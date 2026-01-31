// @ts-nocheck
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Building2,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileText,
  GraduationCap,
  History as HistoryIcon,
  Link as LinkIcon,
  ListChecks,
  Pause,
  Pencil,
  Play,
  Plus,
  RefreshCcw,
  Settings,
  SquareChartGantt,
  Trash2,
  UploadCloud,
  Users,
  X,
} from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  ResponsiveContainer,
  PieChart as RPieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Consistent styling based on previous requests (teal-based, dark/light mode)
const themeStyles = {
  border: "border-zinc-300/20 dark:border-theme-color-primary/20",
  bgCard: "bg-white/50 dark:bg-transparent",
  textPrimary: "text-zinc-900 dark:text-zinc-100",
  textSecondary: "text-zinc-500 dark:text-zinc-400",
};

// Utility to merge class names
function clsx(...a) {
  return a.filter(Boolean).join(" ");
}

// ------------------------- Mock Helpers -------------------------
const nowIso = () => new Date().toISOString().slice(0, 16);
const uid = () => Math.random().toString(36).slice(2, 9);
const fmt = (d) => new Date(d).toLocaleString();

// ------------------------- Types (JSDoc) ------------------------
/**
 * @typedef {Object} Election
 * @property {string} id
 * @property {string} title
 * @property {string} classId // Single class for election
 * @property {string} start
 * @property {string} end
 * @property {boolean} isRunning
 * @property {"scheduled"|"running"|"ended"} status
 */

/** @typedef {{ id:string; name:string; classId:string; photo?:string; manifesto?:string }} Candidate */
/** @typedef {{ id:string; nis:string; name:string; classId:string; address?:string; phone?:string }} Student */
/** @typedef {{ id:string; name:string; phone?:string }} Staff */
/** @typedef {{ id:string; name:string }} ClassItem */
/** @typedef {{ id:string; electionId:string; voterId:string; candidateId:string; at:string }} Vote */

// ------------------------- Seed Data ----------------------------
const SEED_CLASSES = [
  { id: "7A", name: "VII-A" },
  { id: "7B", name: "VII-B" },
  { id: "8A", name: "VIII-A" },
  { id: "9A", name: "IX-A" },
];

const SEED_STUDENTS = Array.from({ length: 64 }).map((_, i) => {
  const c = SEED_CLASSES[i % SEED_CLASSES.length];
  return {
    id: `stu_${uid()}`,
    nis: `${24000 + i}`,
    name: `Siswa ${i + 1}`,
    classId: c.id,
    address: `Jl. Contoh No.${i + 3}`,
    phone: `08${Math.floor(1000000000 + Math.random() * 899999999)}`,
  };
});

const SEED_STAFF = [
  "Kepala Sekolah",
  "Wakil Kurikulum",
  "TU 1",
  "TU 2",
  "Guru BK",
].map((s, i) => ({ id: `st_${i}`, name: s, phone: `08${Math.floor(100000000 + Math.random() * 899999999)}` }));

// ------------------------- CSV Helpers --------------------------
function toCSV(rows, headers) {
  const h = headers || Object.keys(rows[0] || {});
  const esc = (v) => `"${String(v ?? "").replaceAll('"', '""')}"`;
  return [h.join(","), ...rows.map((r) => h.map((k) => esc(r[k])).join(","))].join("\n");
}

function download(filename, content) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ------------------------- UI Elements --------------------------
function Pill({ children, color = "sky" }) {
  const map = {
    sky: "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-200",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200",
    rose: "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-200",
    emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200",
    zinc: "bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200",
  };
  return (
    <span className={clsx("px-2 pb-0.5 pt-1 rounded-md text-xs font-medium", map[color])}>
      {children}
    </span>
  );
}

function Modal({ open, onClose, title, children, wide = false }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className={clsx(
              "relative bg-white dark:bg-theme-color-primary/10 rounded-2xl shadow-2xl w-full mx-4",
              themeStyles.border,
              wide ? "max-w-5xl" : "max-w-2xl"
            )}
          >
            <div className={clsx("p-4 border-b", themeStyles.border, "flex items-center justify-between")}>
              <h3 className="text-lg font-semibold">{title}</h3>
              <button
                onClick={onClose}
                className={clsx("p-2 rounded-md hover:bg-zinc-100/10 dark:hover:bg-theme-color-primary/20")}
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-4">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({ label, children }) {
  return (
    <label className="grid gap-2 text-sm">
      <span className={themeStyles.textSecondary}>{label}</span>
      {children}
    </label>
  );
}

const COLORS = ['#14B8A6', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6', '#EC4899', '#10B981'];

// ------------------------- Main Component -----------------------
export const ClassPresidentMain = () => {
  // Theme
  const [dark, setDark] = useState(true);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // Master data
  const [classes, setClasses] = useState(SEED_CLASSES);
  const [students, setStudents] = useState(SEED_STUDENTS);
  const [staff, setStaff] = useState(SEED_STAFF);

  // Elections
  const [elections, setElections] = useState(
    /** @type {Election[]} */ ([
      {
        id: uid(),
        title: "Ketua Kelas Semester Ganjil 7A",
        classId: "7A",
        start: nowIso(),
        end: nowIso(),
        isRunning: false,
        status: "scheduled",
      },
      {
        id: uid(),
        title: "Ketua Kelas Semester Ganjil 8A",
        classId: "8A",
        start: nowIso(),
        end: nowIso(),
        isRunning: false,
        status: "scheduled",
      },
    ])
  );

  const [candidates, setCandidates] = useState(
    /** @type {Candidate[]} */ ([
      { id: uid(), name: "Alya Prameswari", classId: "7A", manifesto: "Kebersamaan Kelas", photo: "" },
      { id: uid(), name: "Bima Satriya", classId: "7A", manifesto: "Kelas Aktif", photo: "" },
    ])
  );

  const [votes, setVotes] = useState(/** @type {Vote[]} */ ([]));

  // UI State
  const [tab, setTab] = useState("live"); // live | elections | master | history | settings
  const [modal, setModal] = useState(null); // id string
  const [ctx, setCtx] = useState({}); // passing context into modal
  const [qElection, setQElection] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [qStudent, setQStudent] = useState("");
  const [filterClass, setFilterClass] = useState("ALL");

  // ------------------------- Self Tests (smoke) -----------------
  useEffect(() => {
    try {
      console.group("SelfTests — ClassPresidentDashboard");
      console.assert(typeof uid() === "string" && uid().length > 0, "uid() returns string");
      console.assert(nowIso().length === 16, "nowIso() length === 16");
      const csv = toCSV([{ a: 1, b: 2 }], ["a", "b"]);
      console.assert(csv.split("\n")[0] === "a,b", "CSV header correct");
      console.assert(csv.includes("1,2"), "CSV row correct");
      console.groupEnd();
    } catch (e) {
      console.error("SelfTests failed", e);
    }
  }, []);

  // Simulasi real-time counting
  useEffect(() => {
    const active = elections.find((e) => e.isRunning);
    if (!active) return;
    const t = setInterval(() => {
      const eligible = students.filter((s) => s.classId === active.classId);
      const voted = new Set(votes.filter((v) => v.electionId === active.id).map((v) => v.voterId));
      const queue = eligible.filter((s) => !voted.has(s.id));
      if (queue.length === 0) return;
      const batch = Math.max(1, Math.floor(Math.random() * Math.min(3, queue.length)));
      const selected = queue.sort(() => Math.random() - 0.5).slice(0, batch);
      const candPool = candidates.filter((c) => c.classId === active.classId);
      selected.forEach((s) => {
        const picked = candPool[Math.floor(Math.random() * candPool.length)];
        setVotes((vs) => [
          ...vs,
          {
            id: uid(),
            electionId: active.id,
            voterId: s.id,
            candidateId: picked.id,
            at: new Date().toISOString(),
          },
        ]);
      });
    }, 1200);
    return () => clearInterval(t);
  }, [elections, students, candidates, votes]);

  // Derived counts for active election
  const activeElection = useMemo(() => elections.find((e) => e.isRunning) || null, [elections]);
  const liveCounts = useMemo(() => {
    if (!activeElection) return [];
    const cand = candidates.filter((c) => c.classId === activeElection.classId);
    const byCand = cand.map((c) => ({
      name: c.name,
      id: c.id,
      votes: votes.filter((v) => v.electionId === activeElection.id && v.candidateId === c.id).length,
    }));
    return byCand.sort((a, b) => b.votes - a.votes);
  }, [activeElection, candidates, votes]);

  const totalEligible = useMemo(() => {
    if (!activeElection) return 0;
    return students.filter((s) => s.classId === activeElection.classId).length;
  }, [students, activeElection]);

  const totalVoted = useMemo(
    () => (activeElection ? votes.filter((v) => v.electionId === activeElection.id).length : 0),
    [votes, activeElection]
  );

  // ------------------------- Actions ----------------------------
  const createElection = (payload) => {
    const e = { id: uid(), ...payload, isRunning: false, status: "scheduled" };
    setElections((es) => [e, ...es]);
  };

  const updateElection = (id, patch) => setElections((es) => es.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  const removeElection = (id) => setElections((es) => es.filter((e) => e.id !== id));

  const addCandidate = (payload) => setCandidates((cs) => [...cs, { id: uid(), ...payload }]);
  const editCandidate = (id, patch) => setCandidates((cs) => cs.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  const delCandidate = (id) => setCandidates((cs) => cs.filter((c) => c.id !== id));

  const addStudent = (payload) => setStudents((ss) => [...ss, { id: `stu_${uid()}`, ...payload }]);
  const editStudent = (id, patch) => setStudents((ss) => ss.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  const delStudent = (id) => setStudents((ss) => ss.filter((s) => s.id !== id));

  const addClass = (payload) => setClasses((cs) => [...cs, { id: payload.id || uid(), ...payload }]);
  const delClass = (id) => setClasses((cs) => cs.filter((c) => c.id !== id));

  const importStudentsCSV = (text) => {
    const lines = text.split(/\r?\n/).filter(Boolean);
    const [h, ...rows] = lines;
    const cols = h.split(",").map((s) => s.trim());
    const idx = (k) => cols.indexOf(k);
    const parsed = rows.map((r) => {
      const c = r.split(",");
      return {
        id: `stu_${uid()}`,
        nis: c[idx("nis")],
        name: c[idx("name")],
        classId: c[idx("classId")],
        address: c[idx("address")],
        phone: c[idx("phone")],
      };
    });
    setStudents((ss) => [...ss, ...parsed]);
  };

  const exportWinnersCSV = () => {
    const winners = computeHistory();
    download(
      `winners_${Date.now()}.csv`,
      toCSV(winners, ["electionId", "electionTitle", "classId", "winner", "votes", "total", "timestamp"])
    );
  };

  const computeHistory = () => {
    return elections
      .filter((e) => e.status === "ended")
      .map((e) => {
        const pool = candidates.filter((c) => c.classId === e.classId);
        const tally = pool.map((c) => ({
          c,
          n: votes.filter((v) => v.electionId === e.id && v.candidateId === c.id).length,
        }));
        const winner = tally.sort((a, b) => b.n - a.n)[0];
        return {
          electionId: e.id,
          electionTitle: e.title,
          classId: e.classId,
          winner: winner?.c?.name || "-",
          votes: winner?.n || 0,
          total: votes.filter((v) => v.electionId === e.id).length,
          timestamp: e.end,
        };
      });
  };

  const historyRows = useMemo(() => computeHistory(), [elections, candidates, votes]);

  // ------------------------- Render ------------------------------
  return (
    <div className={clsx("min-h-screen p-8", themeStyles.textPrimary, dark ? "" : "bg-zinc-50")}>
        {/* header */}
      <div className="w-full border-b border-white/10 pb-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-xl font-semibold tracking-tight">
            Pemilihan ketua kelas
          </h1>
          <p className="text-gray-300 dark:text-gray-400 mt-1">
            Dashboard pengumpulan suara secara digital
          </p>
        </div>
      </div>
      <main className="max-w-full mx-auto pb-6 pt-4 grid gap-6">
        {/* Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { key: "live", label: "Live Counting", icon: SquareChartGantt },
            { key: "elections", label: "Pemilihan", icon: ListChecks },
            { key: "master", label: "Master Data", icon: Building2 },
            { key: "history", label: "History", icon: HistoryIcon },
            { key: "settings", label: "Pengaturan", icon: Settings },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={clsx(
                "px-3 py-1 rounded-md text-sm flex items-center gap-2 border",
                themeStyles.border,
                tab === t.key ? "bg-sky-500 text-white border-sky-500" : "hover:bg-zinc-100/10"
              )}
            >
              {React.createElement(t.icon, { size: 16 })} {t.label}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setDark((d) => !d)}
              className={clsx("px-3 py-1 rounded-md border text-sm", themeStyles.border, "hover:bg-zinc-100/10")}
            >
              {dark ? "Mode Terang" : "Mode Gelap"}
            </button>
            <a
              className={clsx("px-3 py-1 rounded-md border text-sm flex items-center gap-1", themeStyles.border, "hover:bg-zinc-100/10")}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setModal("public");
              }}
            >
              <Eye size={14} /> Layar Publik
            </a>
            <a
              className={clsx("px-3 py-1 rounded-md border text-sm flex items-center gap-1", themeStyles.border, "hover:bg-zinc-100/10")}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setModal("help");
              }}
            >
              <FileText size={14} /> SOP
            </a>
          </div>
        </div>

        {/* LIVE */}
        {tab === "live" && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 grid gap-6">
              <div className={clsx("p-4 rounded-2xl border", themeStyles.border, themeStyles.bgCard)}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className={themeStyles.textSecondary}>Pemilihan Aktif</div>
                    <div className="font-semibold text-lg">{activeElection ? activeElection.title : "— tidak ada —"}</div>
                    <div className={clsx("text-xs", themeStyles.textSecondary)}>
                      {activeElection ? `${fmt(activeElection.start)} s/d ${fmt(activeElection.end)}` : ""}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!activeElection && (
                      <button
                        onClick={() => {
                          const e = elections[0];
                          if (!e) return;
                          updateElection(e.id, { isRunning: true, status: "running" });
                        }}
                        className="px-3 py-1 rounded-md text-sm bg-emerald-600 text-white flex items-center gap-2"
                      >
                        <Play size={14} /> Mulai (contoh)
                      </button>
                    )}
                    {activeElection && (
                      <>
                        <button
                          onClick={() => updateElection(activeElection.id, { isRunning: false, status: "ended" })}
                          className="px-3 py-1 rounded-md text-sm bg-rose-600 text-white flex items-center gap-2"
                        >
                          <Pause size={14} /> Akhiri
                        </button>
                        <button
                          onClick={() => setVotes((vs) => vs.filter((v) => v.electionId !== activeElection.id))}
                          className="px-3 py-1 rounded-md text-sm bg-zinc-800 text-white flex items-center gap-2"
                        >
                          <RefreshCcw size={14} /> Reset Suara
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Stat title="Total Pemilih" value={totalEligible} icon={Users} />
                  <Stat title="Sudah Memilih" value={totalVoted} icon={CheckCircle2} />
                  <Stat
                    title="Partisipasi (%)"
                    value={totalEligible ? ((totalVoted / totalEligible) * 100) | 0 : 0}
                    icon={BarChart3}
                  />
                  <Stat title="Status" value={activeElection ? activeElection.status : "—"} icon={Clock} />
                </div>
              </div>

              <div className={clsx("p-4 rounded-2xl border", themeStyles.border, themeStyles.bgCard)}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Grafik Perolehan Suara</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setModal("public")}
                      className={clsx("px-3 py-1 rounded-md border text-sm flex items-center gap-2", themeStyles.border)}
                    >
                      <LinkIcon size={14} /> Tampilkan di Layar Publik
                    </button>
                    <button
                      onClick={() => setModal("cand")}
                      className="px-3 py-1 rounded-md bg-sky-600 text-white text-sm flex items-center gap-2"
                    >
                      <Users size={14} /> Kelola Kandidat
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={liveCounts}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" />
                        <XAxis dataKey="name" angle={-15} textAnchor="end" interval={0} stroke="#ffffff" tick={{ fill: "#ffffff" }} />
                        <YAxis allowDecimals={false} stroke="#ffffff" tick={{ fill: "#ffffff" }} />
                        <Tooltip />
                        <Bar dataKey="votes" radius={[8, 8, 0, 0]}>
                          {liveCounts.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RPieChart>
                        <Pie data={liveCounts} dataKey="votes" nameKey="name" outerRadius={100} label>
                          {liveCounts.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                          ))}
                        </Pie>
                        <Legend />
                        <Tooltip />
                      </RPieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              <div className={clsx("p-4 rounded-2xl border", themeStyles.border, themeStyles.bgCard)}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Log Suara Terbaru</h3>
                </div>
                <div className="max-h-80 overflow-auto space-y-2 pr-1">
                  {votes
                    .slice(-30)
                    .reverse()
                    .map((v) => {
                      const s = students.find((x) => x.id === v.voterId);
                      const c = candidates.find((x) => x.id === v.candidateId);
                      return (
                        <div
                          key={v.id}
                          className={clsx("text-sm flex items-center justify-between border-b py-1", themeStyles.border)}
                        >
                          <div className="flex items-center gap-2">
                            <Pill color="zinc">{new Date(v.at).toLocaleTimeString()}</Pill>
                            <span className="opacity-80">{s?.name}</span>
                            <span className={themeStyles.textSecondary}>({s?.nis})</span>
                            <span className={themeStyles.textSecondary}>— {s?.classId}</span>
                          </div>
                          <div>
                            <Pill color="emerald">→ {c?.name}</Pill>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className={clsx("p-4 rounded-2xl border", themeStyles.border, themeStyles.bgCard)}>
                <h3 className="font-semibold mb-3">Pemenang Sementara</h3>
                <ol className="space-y-2 text-sm">
                  {liveCounts.map((r, i) => (
                    <li key={r.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Pill color={i === 0 ? "emerald" : "zinc"}>{i + 1}</Pill> {r.name}
                      </div>
                      <div className="font-semibold">{r.votes}</div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>
        )}

        {/* ELECTIONS */}
        {tab === "elections" && (
          <section className="grid gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Daftar Pemilihan</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setModal("newElection")}
                  className="px-3 py-1 rounded-md bg-sky-600 text-white text-sm flex items-center gap-2"
                >
                  <Plus size={14} /> Tambah Pemilihan
                </button>
                <button
                  onClick={() => setModal("cand")}
                  className={clsx("px-3 py-1 rounded-md border text-sm flex items-center gap-2", themeStyles.border)}
                >
                  <Users size={14} /> Kandidat
                </button>
              </div>
            </div>

            <div className={clsx("flex flex-wrap items-center gap-2 border p-3 rounded-md", themeStyles.border)}>
              <input
                value={qElection}
                onChange={(e) => setQElection(e.target.value)}
                placeholder="Cari judul pemilihan..."
                className={clsx("px-3 py-1 text-sm rounded-md bg-transparent border w-64", themeStyles.border)}
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={clsx("px-3 py-1 text-sm rounded-md bg-transparent border", themeStyles.border)}
              >
                <option value="ALL">Semua Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="running">Running</option>
                <option value="ended">Ended</option>
              </select>
            </div>

            <div className={clsx("overflow-auto rounded-2xl border", themeStyles.border)}>
              <table className="min-w-full text-sm table-fixed">
                <thead className={themeStyles.bgCard}>
                  <tr className="text-left">
                    <th className="p-3 w-1/4">Judul</th>
                    <th className="p-3 w-1/6">Kelas</th>
                    <th className="p-3 w-1/4">Jadwal</th>
                    <th className="p-3 w-1/6">Status</th>
                    <th className="p-3 w-1/4">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {elections
                    .filter(
                      (e) =>
                        (filterStatus === "ALL" || e.status === filterStatus) &&
                        (qElection === "" || e.title.toLowerCase().includes(qElection.toLowerCase()))
                    )
                    .map((e) => (
                      <tr
                        key={e.id}
                        className={clsx("border-t hover:bg-zinc-50/40 dark:hover:bg-theme-color-primary/20", themeStyles.border)}
                      >
                        <td className="p-3 font-medium">{e.title}</td>
                        <td className="p-3">
                          <Pill color="amber">{e.classId}</Pill>
                        </td>
                        <td className="p-3 text-xs">{fmt(e.start)} s/d {fmt(e.end)}</td>
                        <td className="p-3">
                          {e.status === "running" ? (
                            <Pill color="emerald">running</Pill>
                          ) : e.status === "ended" ? (
                            <Pill color="rose">ended</Pill>
                          ) : (
                            <Pill color="zinc">scheduled</Pill>
                          )}
                        </td>
                        <td className="p-3 flex items-center gap-2">
                          {!e.isRunning && e.status !== "ended" && (
                            <button
                              onClick={() => updateElection(e.id, { isRunning: true, status: "running" })}
                              className="px-2 py-1 rounded-md bg-emerald-600 text-white text-xs flex items-center gap-1"
                            >
                              <Play size={12} /> Mulai
                            </button>
                          )}
                          {e.isRunning && (
                            <button
                              onClick={() => updateElection(e.id, { isRunning: false, status: "ended" })}
                              className="px-2 py-1 rounded-md bg-rose-600 text-white text-xs flex items-center gap-1"
                            >
                              <Pause size={12} /> Akhiri
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setCtx({ e });
                              setModal("editElection");
                            }}
                            className={clsx("px-2 py-1 rounded-md border text-xs flex items-center gap-1", themeStyles.border)}
                          >
                            <Pencil size={12} /> Edit
                          </button>
                          <button
                            onClick={() => removeElection(e.id)}
                            className={clsx("px-2 py-1 rounded-md border text-xs flex items-center gap-1", themeStyles.border)}
                          >
                            <Trash2 size={12} /> Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* MASTER */}
        {tab === "master" && (
          <section className="grid lg:grid-cols-1 gap-6">
            <div className={clsx("p-4 rounded-2xl border", themeStyles.border, themeStyles.bgCard)}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <input
                    value={qStudent}
                    onChange={(e) => setQStudent(e.target.value)}
                    placeholder="Cari NIS/Nama..."
                    className={clsx("px-3 py-1 text-sm rounded-md bg-transparent border w-48", themeStyles.border)}
                  />
                  <select
                    value={filterClass}
                    onChange={(e) => setFilterClass(e.target.value)}
                    className={clsx("px-3 py-1 text-sm rounded-md bg-transparent border", themeStyles.border)}
                  >
                    <option value="ALL">Semua Kelas</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.id}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setModal("addStudent")}
                    className="px-3 py-1 rounded-md bg-sky-600 text-white text-sm flex items-center gap-2"
                  >
                    <Plus size={14} /> Tambah
                  </button>
                  <button
                    onClick={() => {
                      const csv = toCSV(
                        [
                          {
                            nis: "24000",
                            name: "Budi",
                            classId: "7A",
                            address: "Jl. Mawar 1",
                            phone: "0812345678",
                          },
                        ],
                        ["nis", "name", "classId", "address", "phone"]
                      );
                      download("template_siswa.csv", csv);
                    }}
                    className={clsx("px-3 py-1 rounded-md border text-sm flex items-center gap-2", themeStyles.border)}
                  >
                    <Download size={14} /> Template CSV
                  </button>
                  <button
                    onClick={() => setModal("importCSV")}
                    className={clsx("px-3 py-1 rounded-md border text-sm flex items-center gap-2", themeStyles.border)}
                  >
                    <UploadCloud size={14} /> Import CSV
                  </button>
                </div>
              </div>
              <div className="max-h-96 overflow-auto rounded-md">
                <table className="min-w-full text-sm table-fixed">
                  <thead className={clsx(themeStyles.bgCard, "sticky top-0")}>
                    <tr className="text-left">
                      <th className="p-2 w-1/5">NIS</th>
                      <th className="p-2 w-1/5">Nama</th>
                      <th className="p-2 w-1/5">Kelas</th>
                      <th className="p-2 w-1/5">Alamat</th>
                      <th className="p-2 w-1/5">No. HP</th>
                      <th className="p-2 w-1/5">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students
                      .filter(
                        (s) =>
                          (filterClass === "ALL" || s.classId === filterClass) &&
                          (qStudent === "" || `${s.nis} ${s.name}`.toLowerCase().includes(qStudent.toLowerCase()))
                      )
                      .slice(0, 200)
                      .map((s) => (
                        <tr
                          key={s.id}
                          className={clsx("border-t hover:bg-zinc-50/40 dark:hover:bg-theme-color-primary/20", themeStyles.border)}
                        >
                          <td className="p-2">{s.nis}</td>
                          <td className="p-2">{s.name}</td>
                          <td className="p-2">{s.classId}</td>
                          <td className="p-2">{s.address}</td>
                          <td className="p-2">{s.phone}</td>
                          <td className="p-2 flex items-center gap-2">
                            <button
                              onClick={() => {
                                setCtx({ s });
                                setModal("editStudent");
                              }}
                              className={clsx("px-2 py-1 rounded-md border text-xs flex items-center gap-1", themeStyles.border)}
                            >
                              <Pencil size={12} /> Edit
                            </button>
                            <button
                              onClick={() => delStudent(s.id)}
                              className={clsx("px-2 py-1 rounded-md border text-xs flex items-center gap-1", themeStyles.border)}
                            >
                              <Trash2 size={12} /> Hapus
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid gap-6">
              <div className={clsx("p-4 rounded-2xl border", themeStyles.border, themeStyles.bgCard)}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Kelas</h3>
                  <button
                    onClick={() => setModal("addClass")}
                    className="px-3 py-1 rounded-md bg-sky-600 text-white text-sm flex items-center gap-2"
                  >
                    <Plus size={14} /> Tambah
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {classes.map((c) => (
                    <div
                      key={c.id}
                      className={clsx("px-3 py-1 rounded-md border flex items-center gap-2", themeStyles.border, themeStyles.bgCard)}
                    >
                      <GraduationCap size={16} /> <span className="font-medium text-sm">{c.name}</span>
                      <button
                        onClick={() => delClass(c.id)}
                        className={clsx("ml-2 text-xs px-2 py-0.5 rounded-md border", themeStyles.border)}
                      >
                        Hapus
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className={clsx("p-4 rounded-2xl border", themeStyles.border, themeStyles.bgCard)}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Kandidat</h3>
                  <button
                    onClick={() => setModal("cand")}
                    className={clsx("px-3 py-1 rounded-md border text-sm flex items-center gap-2", themeStyles.border)}
                  >
                    <Users size={14} /> Kelola
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {candidates.map((c) => (
                    <div key={c.id} className={clsx("p-3 rounded-md border", themeStyles.border, themeStyles.bgCard)}>
                      <div className="font-medium">{c.name}</div>
                      <div className={clsx("text-xs line-clamp-2", themeStyles.textSecondary)}>{c.manifesto || "—"}</div>
                      <div className="text-xs mt-1">Kelas: {c.classId}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* HISTORY */}
        {tab === "history" && (
          <section className="grid gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">History Pemenang</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={exportWinnersCSV}
                  className={clsx("px-3 py-1 rounded-md border text-sm flex items-center gap-2", themeStyles.border)}
                >
                  <Download size={14} /> Ekspor CSV
                </button>
              </div>
            </div>

            <div className={clsx("overflow-auto rounded-2xl border", themeStyles.border)}>
              <table className="min-w-full text-sm table-fixed">
                <thead className={themeStyles.bgCard}>
                  <tr className="text-left">
                    <th className="p-3 w-1/4">Pemilihan</th>
                    <th className="p-3 w-1/6">Kelas</th>
                    <th className="p-3 w-1/5">Pemenang</th>
                    <th className="p-3 w-1/6">Suara</th>
                    <th className="p-3 w-1/6">Total Suara</th>
                    <th className="p-3 w-1/5">Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {historyRows.map((r, i) => (
                    <tr key={i} className={clsx("border-t", themeStyles.border)}>
                      <td className="p-3">{r.electionTitle}</td>
                      <td className="p-3">{r.classId}</td>
                      <td className="p-3 font-medium">{r.winner}</td>
                      <td className="p-3">{r.votes}</td>
                      <td className="p-3">{r.total}</td>
                      <td className="p-3 text-xs">{fmt(r.timestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* SETTINGS */}
        {tab === "settings" && (
          <section className="grid gap-6">
            <div className={clsx("p-4 rounded-2xl border", themeStyles.border, themeStyles.bgCard)}>
              <h3 className="font-semibold mb-3">Pengaturan Umum</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Mode Akses Tendik (Read-Only)">
                  <select className={clsx("px-3 py-2 rounded-md bg-transparent border", themeStyles.border)}>
                    <option>Aktif</option>
                    <option>Nonaktif</option>
                  </select>
                </Field>
                <Field label="Verifikasi OTP / NIS Sebelum Voting">
                  <select className={clsx("px-3 py-2 rounded-md bg-transparent border", themeStyles.border)}>
                    <option>Aktif</option>
                    <option>Nonaktif</option>
                  </select>
                </Field>
                <Field label="Publikasi Link Live Counting">
                  <input
                    className={clsx("px-3 py-2 rounded-md bg-transparent border w-full", themeStyles.border)}
                    value="/public/live/election"
                    readOnly
                  />
                </Field>
                <Field label="Hash & Audit Trail (server)">
                  <div className={clsx("text-xs", themeStyles.textSecondary)}>
                    Aktifkan di backend untuk menyimpan hash ballot + log chain.
                  </div>
                </Field>
              </div>
            </div>
          </section>
        )}

        {/* ----------------------- MODALS ----------------------- */}
        <Modal open={modal === "public"} onClose={() => setModal(null)} title="Layar Publik — Live Counting" wide>
          <PublicScreen
            election={activeElection}
            counts={liveCounts}
            totalEligible={totalEligible}
            totalVoted={totalVoted}
          />
        </Modal>

        <Modal open={modal === "newElection"} onClose={() => setModal(null)} title="Tambah Pemilihan">
          <ElectionForm classes={classes} onSubmit={(payload) => { createElection(payload); setModal(null); }} />
        </Modal>
        <Modal open={modal === "editElection"} onClose={() => setModal(null)} title="Edit Pemilihan">
          <ElectionForm classes={classes} initial={ctx.e} onSubmit={(payload) => { updateElection(ctx.e.id, payload); setModal(null); }} />
        </Modal>

        <Modal open={modal === "cand"} onClose={() => setModal(null)} title="Kelola Kandidat" wide>
          <CandidateManager
            candidates={candidates}
            classes={classes}
            onAdd={(p) => addCandidate(p)}
            onEdit={(id, p) => editCandidate(id, p)}
            onDel={(id) => delCandidate(id)}
          />
        </Modal>

        <Modal open={modal === "addStudent"} onClose={() => setModal(null)} title="Tambah Siswa">
          <StudentForm classes={classes} onSubmit={(p) => { addStudent(p); setModal(null); }} />
        </Modal>
        <Modal open={modal === "editStudent"} onClose={() => setModal(null)} title="Edit Siswa">
          <StudentForm classes={classes} initial={ctx.s} onSubmit={(p) => { editStudent(ctx.s.id, p); setModal(null); }} />
        </Modal>

        <Modal open={modal === "importCSV"} onClose={() => setModal(null)} title="Import Siswa via CSV">
          <CSVImporter onText={(t) => importStudentsCSV(t)} />
        </Modal>

        <Modal open={modal === "addClass"} onClose={() => setModal(null)} title="Tambah Kelas">
          <AddClassForm onSubmit={(p) => { addClass(p); setModal(null); }} />
        </Modal>

        <Modal open={modal === "help"} onClose={() => setModal(null)} title="SOP Singkat">
          <ol className="list-decimal pl-4 space-y-1 text-sm">
            <li>Buat pemilihan ketua kelas untuk kelas tertentu dan set jadwal.</li>
            <li>Tambahkan kandidat untuk kelas yang sesuai.</li>
            <li>Import DPT (siswa) via CSV atau input manual.</li>
            <li>Tekan <b>Mulai</b> untuk membuka voting dan layar publik.</li>
            <li>Live counting tampil otomatis; setelah selesai tekan <b>Akhiri</b>.</li>
            <li>Lihat pemenang pada tab <b>History</b> dan ekspor CSV.</li>
          </ol>
        </Modal>
      </main>
    </div>
  );
}

// ------------------------- Subcomponents ------------------------
function Stat({ title, value, icon: Icon }) {
  return (
    <div className={clsx("rounded-md border p-3", themeStyles.border, themeStyles.bgCard)}>
      <div className={clsx("flex items-center gap-2 text-xs", themeStyles.textSecondary)}>
        <Icon size={14} /> {title}
      </div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}

function ElectionForm({ initial, onSubmit, classes }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [classId, setClassId] = useState(initial?.classId || classes[0]?.id || "");
  const [start, setStart] = useState(initial?.start || nowIso());
  const [end, setEnd] = useState(initial?.end || nowIso());

  const submit = (e) => {
    e.preventDefault();
    onSubmit({ title, classId, start, end });
  };

  return (
    <form onSubmit={submit} className="grid gap-3">
      <Field label="Judul">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className={clsx("px-3 py-2 rounded-md bg-transparent border w-full", themeStyles.border)}
          placeholder="Mis. Pemilihan Ketua Kelas 7A 2025"
        />
      </Field>
      <Field label="Kelas">
        <select
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          className={clsx("px-3 py-2 rounded-md bg-transparent border w-full", themeStyles.border)}
        >
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Mulai">
          <input
            type="datetime-local"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className={clsx("px-3 py-2 rounded-md bg-transparent border w-full", themeStyles.border)}
          />
        </Field>
        <Field label="Selesai">
          <input
            type="datetime-local"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className={clsx("px-3 py-2 rounded-md bg-transparent border w-full", themeStyles.border)}
          />
        </Field>
      </div>
      <div className="flex justify-end">
        <button className="px-4 py-2 rounded-md bg-sky-600 text-white text-sm">Simpan</button>
      </div>
    </form>
  );
}

function CandidateManager({ candidates, classes, onAdd, onEdit, onDel }) {
  const [q, setQ] = useState("");
  const filtered = candidates.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari kandidat..."
          className={clsx("px-3 py-2 rounded-md bg-transparent border w-80", themeStyles.border)}
        />
        <button
          onClick={() => {
            const name = prompt("Nama kandidat?");
            if (!name) return;
            const classId = prompt("Masukkan ID Kelas (contoh: 7A, 8A)") || classes[0]?.id;
            if (!classes.find((c) => c.id === classId)) {
              alert("Kelas tidak valid!");
              return;
            }
            const manifesto = prompt("Manifesto singkat?") || "";
            onAdd({ name, classId, manifesto });
          }}
          className="px-3 py-1 rounded-md bg-sky-600 text-white text-sm flex items-center gap-2"
        >
          <Plus size={14} /> Tambah Kandidat
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((c) => (
          <div key={c.id} className={clsx("p-3 rounded-md border", themeStyles.border, themeStyles.bgCard)}>
            <div className="font-medium">{c.name}</div>
            <div className="text-xs">Kelas: {c.classId}</div>
            <div className={clsx("text-xs mt-1 line-clamp-2", themeStyles.textSecondary)}>{c.manifesto || "—"}</div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => {
                  const name = prompt("Ubah nama", c.name) || c.name;
                  const manifesto = prompt("Manifesto", c.manifesto || "") || "";
                  const classId = prompt("Kelas", c.classId) || c.classId;
                  if (!classes.find((cls) => cls.id === classId)) {
                    alert("Kelas tidak valid!");
                    return;
                  }
                  onEdit(c.id, { name, manifesto, classId });
                }}
                className={clsx("px-2 py-1 rounded-md border text-xs flex items-center gap-1", themeStyles.border)}
              >
                <Pencil size={12} /> Edit
              </button>
              <button
                onClick={() => onDel(c.id)}
                className={clsx("px-2 py-1 rounded-md border text-xs flex items-center gap-1", themeStyles.border)}
              >
                <Trash2 size={12} /> Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StudentForm({ initial, onSubmit, classes }) {
  const [nis, setNis] = useState(initial?.nis || "");
  const [name, setName] = useState(initial?.name || "");
  const [classId, setClassId] = useState(initial?.classId || classes[0]?.id || "");
  const [address, setAddress] = useState(initial?.address || "");
  const [phone, setPhone] = useState(initial?.phone || "");

  const submit = (e) => {
    e.preventDefault();
    onSubmit({ nis, name, classId, address, phone });
  };

  return (
    <form onSubmit={submit} className="grid gap-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="NIS">
          <input
            value={nis}
            onChange={(e) => setNis(e.target.value)}
            required
            className={clsx("px-3 py-2 rounded-md bg-transparent border w-full", themeStyles.border)}
          />
        </Field>
        <Field label="Nama">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={clsx("px-3 py-2 rounded-md bg-transparent border w-full", themeStyles.border)}
          />
        </Field>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Kelas">
          <select
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            className={clsx("px-3 py-2 rounded-md bg-transparent border w-full", themeStyles.border)}
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id}
              </option>
            ))}
          </select>
        </Field>
        <Field label="No. HP">
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={clsx("px-3 py-2 rounded-md bg-transparent border w-full", themeStyles.border)}
          />
        </Field>
      </div>
      <Field label="Alamat">
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className={clsx("px-3 py-2 rounded-md bg-transparent border w-full", themeStyles.border)}
        />
      </Field>
      <div className="flex justify-end">
        <button className="px-4 py-2 rounded-md bg-sky-600 text-white text-sm">Simpan</button>
      </div>
    </form>
  );
}

function CSVImporter({ onText }) {
  const ta = useRef(null);
  return (
    <div className="grid gap-3 text-sm">
      <div>
        Tempel CSV di bawah (header: <code>nis,name,classId,address,phone</code>) kemudian klik Import.
      </div>
      <textarea
        ref={ta}
        rows={8}
        className={clsx("w-full rounded-md border bg-transparent p-3 font-mono text-xs", themeStyles.border)}
        placeholder={`nis,name,classId,address,phone\n24001,Sinta,7A,Jl. Melur 2,08123...`}
      ></textarea>
      <div className="flex justify-end">
        <button
          onClick={() => onText(ta.current.value)}
          className="px-4 py-2 rounded-md bg-sky-600 text-white text-sm"
        >
          Import
        </button>
      </div>
    </div>
  );
}

function AddClassForm({ onSubmit }) {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ id, name: name || id });
      }}
      className="grid gap-3"
    >
      <Field label="ID Kelas (mis. 7A)">
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
          className={clsx("px-3 py-2 rounded-md bg-transparent border w-full", themeStyles.border)}
        />
      </Field>
      <Field label="Nama Tampilan">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={clsx("px-3 py-2 rounded-md bg-transparent border w-full", themeStyles.border)}
        />
      </Field>
      <div className="flex justify-end">
        <button className="px-4 py-2 rounded-md bg-sky-600 text-white text-sm">Simpan</button>
      </div>
    </form>
  );
}

function PublicScreen({ election, counts, totalEligible, totalVoted }) {
  return (
    <div className="grid gap-4">
      <div className="flex items-end justify-between">
        <div>
          <div className={clsx("text-sm", themeStyles.textSecondary)}>Live Counting</div>
          <div className="text-2xl font-bold">{election ? election.title : "Tidak ada pemilihan aktif"}</div>
          {election && <div className={clsx("text-xs", themeStyles.textSecondary)}>{new Date().toLocaleString()}</div>}
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className={clsx("text-center p-2 rounded-md", themeStyles.bgCard)}>
            <div className="text-xs">Pemilih</div>
            <div className="text-xl font-semibold">{totalEligible}</div>
          </div>
          <div className={clsx("text-center p-2 rounded-md", themeStyles.bgCard)}>
            <div className="text-xs">Memilih</div>
            <div className="text-xl font-semibold">{totalVoted}</div>
          </div>
          <div className={clsx("text-center p-2 rounded-md", themeStyles.bgCard)}>
            <div className="text-xs">Partisipasi</div>
            <div className="text-xl font-semibold">{totalEligible ? ((totalVoted / totalEligible) * 100) | 0 : 0}%</div>
          </div>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={counts}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" />
            <XAxis dataKey="name" stroke="#ffffff" tick={{ fill: "#ffffff" }} />
            <YAxis allowDecimals={false} stroke="#ffffff" tick={{ fill: "#ffffff" }} />
            <Tooltip />
            <Bar dataKey="votes" radius={[8, 8, 0, 0]}>
              {counts.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
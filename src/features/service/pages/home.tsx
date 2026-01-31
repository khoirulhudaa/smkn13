import { motion } from "framer-motion";
import {
  CheckCircle2,
  ClipboardList,
  Mail,
  MessageSquare,
  Phone,
  Plus, ShieldAlert, Star as StarIcon,
  Wrench
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis, YAxis
} from "recharts";

// Helper function for class names
function classNames(...args: any[]) {
  return args.filter(Boolean).join(" ");
}

// Color palette inspired by reference code
const COLORS = ["#60A5FA", "#22C55E", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"]; // blue, teal, amber, red, violet, cyan
const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const CASE_TYPES = ["Bullying", "Kekerasan", "Pelecehan", "Perundungan Online", "Pencurian"];
const ROLE_SCHOOLS = { guru: "SMPN 1 Bandung" };
const ROLES = [{ key: "guru", label: "Guru & Tendik" }];

// Error Boundary
class ErrorBoundary extends React.Component<any, { hasError: boolean; message?: string }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, message: String(error) };
  }
  componentDidCatch(error: any, info: any) {
    console.error("UI Error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
          <div className="max-w-xl w-full dark:bg-neutral-900/60 border border-red-200 dark:border-red-600 text-red-700 dark:text-red-400 rounded-2xl p-5 shadow-sm">
            <div className="font-semibold mb-1">Terjadi kesalahan saat merender UI</div>
            <div className="text-sm opacity-80">{this.state.message}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              Periksa kembali input atau komponen yang baru diubah.
            </div>
          </div>
        </div>
      );
    }
    return this.props.children as any;
  }
}

// Header Component
function Header() {
  return (
    <div className="bg-transparent border-b border-white/10 pb-4 text-white pt-2 px-2 shadow-lg">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-xl font-semibold tracking-tight">
            Pelayanan Masyarakat Sekolah
          </h1>
          <p className="text-gray-300 dark:text-gray-400 mt-1">
            Dashboard layanan untuk Guru & Tendik
          </p>
        </div>
        <div className="flex items-end flex-col gap-2 text-gray-200 dark:text-gray-300 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" /> support@xpresensi.sch.id
          </div>
          {/* <div className="hidden sm:block">•</div> */}
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" /> (021) 555-0123
          </div>
        </div>
      </div>
    </div>
  );
}

// Role Switcher Component
function RoleSwitcher({ role, onChange }: { role: string; onChange: (v: string) => void }) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex gap-2 md:gap-3 mt-5">
        {ROLES.map((r) => (
          <button
            key={r.key}
            onClick={() => onChange(r.key)}
            className={classNames(
              "px-3 md:px-4 py-2 rounded-xl text-sm md:text-base whitespace-nowrap transition-all duration-300 transform hover:scale-105",
              role === r.key
                ? "dark:bg-neutral-900/60 text-gray-900 dark:text-white shadow"
                : "bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
            )}
            aria-label={`Switch to ${r.label} role`}
          >
            {r.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, subtitle, icon: Icon, tone = "default" }: any) {
  const toneClass =
    tone === "danger"
      ? "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-600"
      : tone === "success"
      ? "bg-teal-50 dark:bg-teal-900/90 text-white dark:text-white border-white/10 dark:border-white/10"
      : tone === "warning"
      ? "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-600"
      : "dark:bg-neutral-900/60/80 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-white/10";
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={classNames(
        "p-4 rounded-2xl border shadow-sm flex items-center gap-3 backdrop-blur-sm",
        toneClass
      )}
    >
      {Icon && (
        <div className="p-2 w-[60px] h-[60px] flex items-center justify-center rounded-xl bg-white text-gray-900 dark:text-teal-700">
          <Icon className="w-[65%] h-[65%]" />
        </div>
      )}
      <div className="flex-1">
        <div className="text-md tracking-wide">{title}</div>
        <div className="text-2xl font-semibold">{value}</div>
        {subtitle && <div className="text-xs opacity-70">{subtitle}</div>}
      </div>
    </motion.div>
  );
}

// Rating Widgets
function Star({ filled = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={classNames(
        "w-4 h-4",
        filled
          ? "fill-yellow-400 stroke-yellow-500"
          : "fill-none stroke-gray-400 dark:stroke-gray-500"
      )}
    >
      <path
        strokeWidth="1.5"
        d="M12 17.3l-5.47 3.1 1.46-6.05L3 9.9l6.18-.53L12 3.7l2.82 5.67 6.18.53-4 4.45 1.46 6.05z"
      />
    </svg>
  );
}

function StarsDisplay({ value = 0 }) {
  const v = Math.round((value || 0) * 2) / 2; // nearest .5
  return (
    <div className="inline-flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} filled={n <= Math.round(v)} />
      ))}
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {value ? value.toFixed(1) : "-"}
      </span>
    </div>
  );
}

function StarsInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="inline-flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={`${n} bintang`}
          className="focus:ring-2 focus:ring-blue-500 rounded"
        >
          <Star filled={n <= value} />
        </button>
      ))}
      <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
        {value || "-"}/5
      </span>
    </div>
  );
}

function RatingModal({
  open,
  onClose,
  onSubmit,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: any) => void;
  initial?: any;
}) {
  const [respon, setRespon] = useState(initial?.ratingRespon || 0);
  const [solusi, setSolusi] = useState(initial?.ratingSolusi || 0);
  const [komunikasi, setKomunikasi] = useState(initial?.ratingKomunikasi || 0);
  const [sla, setSla] = useState(initial?.ratingSla || 0);
  const [note, setNote] = useState(initial?.ratingNote || "");
  if (!open) return null;
  const all = [respon, solusi, komunikasi, sla];
  const valid = all.every((v) => v > 0);
  const avg = valid ? Math.round((all.reduce((a, b) => a + b, 0) / 4) * 10) / 10 : 0;
  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="dark:bg-neutral-900/60/90 backdrop-blur-lg rounded-2xl w-full max-w-lg p-6 shadow-xl"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-semibold text-gray-800 dark:text-white">
            Beri Rating Penyelesaian
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            aria-label="Close rating modal"
          >
            ✕
          </button>
        </div>
        <div className="grid gap-3 text-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="text-gray-700 dark:text-gray-200">
              Kecepatan Respon
            </span>
            <StarsInput value={respon} onChange={setRespon} />
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-gray-700 dark:text-gray-200">
              Kualitas Solusi
            </span>
            <StarsInput value={solusi} onChange={setSolusi} />
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-gray-700 dark:text-gray-200">Komunikasi</span>
            <StarsInput value={komunikasi} onChange={setKomunikasi} />
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-gray-700 dark:text-gray-200">
              Kepatuhan SLA
            </span>
            <StarsInput value={sla} onChange={setSla} />
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-gray-700 dark:text-gray-200 opacity-70">
              Rata-rata
            </span>
            <div className="font-medium text-gray-800 dark:text-white">
              {avg ? `${avg.toFixed(1)} / 5` : "-"}
            </div>
          </div>
          <textarea
            className="border border-white/20 dark:border-white/20 rounded-xl px-3 py-2 bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Catatan (opsional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            aria-label="Rating note"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-3 py-2 border border-white/20 dark:border-white/20 rounded-xl text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
              aria-label="Cancel rating"
            >
              Batal
            </button>
            <button
              disabled={!valid}
              onClick={() =>
                onSubmit({
                  ratingRespon: respon,
                  ratingSolusi: solusi,
                  ratingKomunikasi: komunikasi,
                  ratingSla: sla,
                  ratingAvg: avg,
                  ratingNote: note,
                })
              }
              className="px-3 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-xl disabled:opacity-50 hover:bg-blue-400 dark:hover:bg-blue-500 transition-all duration-300 transform hover:scale-105"
              aria-label="Submit rating"
            >
              Kirim
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Chart Components
function SimpleBar({ data }: { data: any[] }) {
  return (
    <div className="dark:bg-neutral-900/60/80 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm p-4 backdrop-blur-sm">
      <div className="text-sm font-semibold mb-2 text-gray-800 dark:text-white">
        Tren Tiket 7 Hari
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="d" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                color: "#FFFFFF",
                borderRadius: "8px",
                border: "none",
              }}
            />
            <Legend />
            <Bar dataKey="Baru" fill={COLORS[0]} radius={[6, 6, 0, 0]} />
            <Bar dataKey="Diproses" fill={COLORS[2]} radius={[6, 6, 0, 0]} />
            <Bar dataKey="Selesai" fill={COLORS[1]} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function SimplePie({ data, title = "Komposisi Kategori" }: { data: any[]; title?: string }) {
  return (
    <div className="dark:bg-neutral-900/60/80 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm p-4 backdrop-blur-sm">
      <div className="text-sm font-semibold mb-2 text-gray-800 dark:text-white">
        {title}
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" outerRadius={80}>
              {data.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                color: "#FFFFFF",
                borderRadius: "8px",
                border: "none",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function SimpleArea({ data }: { data: any[] }) {
  return (
    <div className="dark:bg-neutral-900/60/80 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm p-4 backdrop-blur-sm">
      <div className="text-sm font-semibold mb-2 text-gray-800 dark:text-white">
        Waktu Proses Rata-rata (jam)
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS[0]} stopOpacity={0.4} />
                <stop offset="95%" stopColor={COLORS[0]} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="d" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                color: "#FFFFFF",
                borderRadius: "8px",
                border: "none",
              }}
            />
            <Area
              type="monotone"
              dataKey="jam"
              stroke={COLORS[0]}
              fillOpacity={1}
              fill="url(#grad1)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Ticket Detail Component
function TicketDetail({ ticket, onClose }: { ticket: any; onClose: () => void }) {
  if (!ticket) return null;
  const safe = { ...ticket };
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="dark:bg-neutral-900/60/90 backdrop-blur-lg rounded-2xl shadow-lg w-full max-w-lg p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Detail Komplain #{safe.id}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            aria-label="Close ticket detail"
          >
            ✕
          </button>
        </div>
        <div className="space-y-2 text-sm text-gray-800 dark:text-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <strong>Tanggal Dibuat:</strong> {safe.date}
            </div>
            <div>
              <strong>Asal Sekolah:</strong> {safe.school}
            </div>
            <div>
              <strong>Judul:</strong> {safe.title}
            </div>
            <div>
              <strong>Kategori:</strong> {safe.category}
              {safe.isSensitive && ` (${safe.caseType})`}
            </div>
            <div>
              <strong>Prioritas:</strong> {safe.priority}
            </div>
            <div>
              <strong>SLA:</strong> {safe.sla}
            </div>
            <div>
              <strong>Lokasi/Unit:</strong> {safe.location}
            </div>
            <div>
              <strong>Dampak:</strong> {safe.impact}
            </div>
            <div>
              <strong>No. Aset:</strong> {safe.assetNumber || "-"}
            </div>
          </div>
          {safe.isSensitive && (
            <div className="text-red-500 dark:text-red-400 text-xs flex items-center gap-1">
              <ShieldAlert className="w-4 h-4" /> Kasus sensitif – akses terbatas
              BK/Kesiswaan/Kepsek
            </div>
          )}
          {(safe.studentId || safe.studentName) && (
            <div className="bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-white/10 rounded-xl p-3">
              <div className="font-semibold mb-2 text-gray-800 dark:text-white">
                Data Siswa Terkait
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <strong>ID Siswa:</strong> {safe.studentId || "-"}
                </div>
                <div>
                  <strong>Nama Siswa:</strong> {safe.studentName || "-"}
                </div>
                <div>
                  <strong>Kelas:</strong> {safe.className || "-"}
                </div>
                <div>
                  <strong>Orang Tua/Wali:</strong> {safe.parentName || "-"}
                </div>
                <div>
                  <strong>Kontak HP:</strong> {safe.parentPhone || "-"}
                </div>
                <div>
                  <strong>Email:</strong> {safe.parentEmail || "-"}
                </div>
                <div className="md:col-span-2">
                  <strong>Notifikasi Orang Tua:</strong>{" "}
                  {safe.parentNotifiedAt
                    ? `Terkirim ${safe.parentNotifiedAt}`
                    : "Belum terkirim"}
                </div>
              </div>
            </div>
          )}
          {/* Inside TicketDetail component, add to the JSX: */}
          {safe.photo && (
            <div className="mt-3">
              <strong>Bukti Foto:</strong>
              <div className="mt-1">
                <span className="text-gray-800 dark:text-gray-200">{safe.photo}</span>
                {/* If you have an actual image URL from the server, use this instead:
                <img
                  src={safe.photoUrl}
                  alt="Evidence photo"
                  className="max-w-full h-auto rounded-lg border border-gray-200 dark:border-white/10"
                  style={{ maxHeight: "200px" }}
                />
                */}
              </div>
            </div>
          )}
          {(safe.decisionRole || safe.headApprovalRequired) && (
            <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-600 rounded-xl p-3">
              <div className="font-semibold mb-2 text-gray-800 dark:text-white">
                Keputusan & Disposisi
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <strong>Disposisi ke:</strong> {safe.decisionRole || "-"}
                </div>
                <div>
                  <strong>Butuh Persetujuan Kepsek:</strong>{" "}
                  {safe.headApprovalRequired ? "Ya" : "Tidak"}
                </div>
                <div>
                  <strong>Status Persetujuan:</strong> {safe.approvalStatus || "-"}
                </div>
                <div>
                  <strong>Disetujui oleh:</strong> {safe.approvedBy || "-"}
                </div>
                <div className="md:col-span-2">
                  <strong>Waktu Persetujuan:</strong> {safe.approvedAt || "-"}
                </div>
              </div>
            </div>
          )}
          <div>
            <strong>Deskripsi:</strong> {safe.description}
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-full py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-xl hover:bg-blue-400 dark:hover:bg-blue-500 transition-all duration-300 transform hover:scale-105"
          aria-label="Close ticket detail"
        >
          Tutup
        </button>
      </motion.div>
    </div>
  );
}

// Tickets Table Component
function TicketsTable({ rows = [], onRate }: { rows?: any[]; onRate?: (row: any) => void }) {
  const [detail, setDetail] = useState<any | null>(null);
  const visible = rows.filter((r) => !r.isSensitive);
  return (
    <div className="dark:bg-neutral-900/60/80 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden backdrop-blur-sm">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-white/10 text-sm font-semibold text-gray-800 dark:text-white">
        Tiket Terbaru
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300">
            <tr>
              <th className="text-left px-4 py-2">Tanggal</th>
              <th className="text-left px-4 py-2">ID</th>
              <th className="text-left px-4 py-2">Judul</th>
              <th className="text-left px-4 py-2">Kategori</th>
              <th className="text-left px-4 py-2">Disposisi</th>
              <th className="text-left px-4 py-2">Persetujuan</th>
              <th className="text-left px-4 py-2">Lokasi</th>
              <th className="text-left px-4 py-2">Sekolah</th>
              <th className="text-left px-4 py-2">Prioritas</th>
              <th className="text-left px-4 py-2">Status</th>
              <th className="text-left px-4 py-2">SLA</th>
              <th className="text-left px-4 py-2">Rating</th>
              <th className="px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => (
              <tr
                key={r.id}
                className="border-t border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
              >
                <td className="px-4 py-2 font-mono text-xs text-gray-800 dark:text-white">
                  {r.date}
                </td>
                <td className="px-4 py-2 font-mono text-xs text-gray-800 dark:text-white">
                  {r.id}
                </td>
                <td className="px-4 py-2 text-gray-800 dark:text-white">{r.title}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-white">{r.category}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-white">
                  {r.decisionRole || "-"}
                </td>
                <td className="px-4 py-2 text-gray-800 dark:text-white">
                  {r.approvalStatus || "-"}
                </td>
                <td className="px-4 py-2 text-gray-800 dark:text-white">
                  {r.location || "-"}
                </td>
                <td className="px-4 py-2 text-gray-800 dark:text-white">{r.school}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-white">{r.priority}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-white">{r.status}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-white">{r.sla}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-white">
                  {typeof r.ratingAvg === "number" ? (
                    <StarsDisplay value={r.ratingAvg} />
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setDetail(r)}
                      className="text-blue-500 dark:text-blue-400 hover:underline text-xs flex items-center gap-1"
                      aria-label={`View details for ticket ${r.id}`}
                    >
                      <MessageSquare className="w-3 h-3" /> Detail
                    </button>
                    {onRate && (
                      <button
                        onClick={() => onRate(r)}
                        className="text-xs px-3 py-1 rounded-md w-max border border-white/20 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                        aria-label={
                          typeof r.ratingAvg === "number"
                            ? `Edit rating for ticket ${r.id}`
                            : `Rate ticket ${r.id}`
                        }
                      >
                        {typeof r.ratingAvg === "number" ? "Ubah Rating" : "Beri Rating"}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TicketDetail ticket={detail} onClose={() => setDetail(null)} />
    </div>
  );
}

// Complaint Form Component
function ComplaintForm({ onCreate, school }: { onCreate: (row: any) => void; school: string }) {
  const [form, setForm] = useState({
    title: "",
    category: "Sarpras",
    priority: "Sedang",
    location: "",
    impact: "Sedang",
    description: "",
    isSensitive: false,
    caseType: "",
    studentId: "",
    studentName: "",
    className: "",
    parentName: "",
    parentPhone: "",
    parentEmail: "",
    decisionRole: "",
    headApprovalRequired: false,
    approvalStatus: "Tidak perlu",
    approvedBy: "",
    approvedAt: "",
    photo: null as File | null, // Add photo to form state
    photoPreview: "" as string, // Add photo preview URL
  });

  // Clean up object URL when component unmounts or photo changes
  useEffect(() => {
    return () => {
      if (form.photoPreview) {
        URL.revokeObjectURL(form.photoPreview);
      }
    };
  }, [form.photoPreview]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (!validTypes.includes(file.type)) {
        alert("Hanya file JPEG, PNG, atau GIF yang diperbolehkan.");
        return;
      }
      if (file.size > maxSize) {
        alert("Ukuran file maksimum adalah 5MB.");
        return;
      }
      // Revoke previous preview URL
      if (form.photoPreview) {
        URL.revokeObjectURL(form.photoPreview);
      }
      // Set new file and preview
      setForm({
        ...form,
        photo: file,
        photoPreview: URL.createObjectURL(file),
      });
    } else {
      // Clear photo and preview if no file is selected
      if (form.photoPreview) {
        URL.revokeObjectURL(form.photoPreview);
      }
      setForm({
        ...form,
        photo: null,
        photoPreview: "",
      });
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const id = `GURU-${new Date().getFullYear()}-${Math.random().toString().slice(2, 5)}`;
    const notifyNow = (form.studentId || form.studentName) && (form.parentPhone || form.parentEmail);
    const row = {
      ...form,
      id,
      date: new Date().toISOString().slice(0, 10),
      status: "Baru",
      sla: form.isSensitive
        ? "2 jam respon"
        : form.priority === "Tinggi"
        ? "24 jam"
        : form.priority === "Sedang"
        ? "3 hari"
        : "7 hari",
      school,
      approvalStatus: form.headApprovalRequired ? "Menunggu" : "Tidak perlu",
      approvedBy: "",
      approvedAt: "",
      parentNotifiedAt: notifyNow
        ? new Date().toISOString().replace("T", " ").slice(0, 16)
        : undefined,
      photo: form.photo ? form.photo.name : undefined, // Store only the file name for simplicity
    };
    if (notifyNow) {
      console.log("[NOTIF] Kirim ke orang tua:", {
        to: form.parentPhone || form.parentEmail,
        studentId: form.studentId,
        ticketId: id,
        title: form.title,
      });
    }
    if (form.photo) {
      console.log("[UPLOAD] Photo evidence:", {
        ticketId: id,
        fileName: form.photo.name,
        fileSize: form.photo.size,
        fileType: form.photo.type,
      });
    }
    onCreate?.(row);
    // Reset form, including photo and preview
    if (form.photoPreview) {
      URL.revokeObjectURL(form.photoPreview);
    }
    setForm({
      title: "",
      category: "Sarpras",
      priority: "Sedang",
      location: "",
      impact: "Sedang",
      description: "",
      isSensitive: false,
      caseType: "",
      studentId: "",
      studentName: "",
      className: "",
      parentName: "",
      parentPhone: "",
      parentEmail: "",
      decisionRole: "",
      headApprovalRequired: false,
      approvalStatus: "Tidak perlu",
      approvedBy: "",
      approvedAt: "",
      photo: null,
      photoPreview: "",
    });
  }

  const categoryOptions = "Sarpras,IT,Keamanan,Kebersihan,Administrasi,Akademik,Kepegawaian,Kasus Khusus".split(",");

  return (
    <form
      onSubmit={submit}
      className="dark:bg-neutral-900/60/80 rounded-2xl border border-gray-200 dark:border-white/10 p-4 space-y-3 backdrop-blur-sm"
    >
      <div className="flex items-center mb-4 justify-between">
        <div className="text-md font-semibold text-gray-800 dark:text-white">
          Buat Komplain (Guru & Tendik)
        </div>
        <button
          type="submit"
          className="px-3 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg border border-white/10 flex items-center gap-2 text-sm hover:bg-blue-400 dark:hover:bg-blue-500 transition-all duration-300 transform hover:scale-105"
          aria-label="Save complaint"
        >
          <Plus className="w-4 h-4" /> Simpan
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          className="border border-white/20 dark:border-white/20 rounded-lg px-3 py-2 bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 md:col-span-2"
          placeholder="Judul"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          aria-label="Complaint title"
        />
        <select
          className="border border-white/20 dark:border-white/20 rounded-lg px-3 py-2 bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
          value={form.category}
          onChange={(e) =>
            setForm({
              ...form,
              category: e.target.value,
              isSensitive: e.target.value === "Kasus Khusus",
            })
          }
          aria-label="Complaint category"
        >
          {categoryOptions.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select
          className="border border-white/20 dark:border-white/20 rounded-lg px-3 py-2 bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
          value={form.priority}
          onChange={(e) => setForm({ ...form, priority: e.target.value })}
          aria-label="Complaint priority"
        >
          <option>Rendah</option>
          <option>Sedang</option>
          <option>Tinggi</option>
        </select>
        <input
          className="border border-white/20 dark:border-white/20 rounded-lg px-3 py-2 bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
          placeholder="Lokasi/Unit (cth: Ruang VII-B)"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          aria-label="Complaint location"
        />
        <select
          className="border border-white/20 dark:border-white/20 rounded-lg px-3 py-2 bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
          value={form.impact}
          onChange={(e) => setForm({ ...form, impact: e.target.value })}
          aria-label="Complaint impact"
        >
          <option>Tidak ada</option>
          <option>Rendah</option>
          <option>Sedang</option>
          <option>Tinggi</option>
        </select>
        {form.isSensitive && (
          <>
            <select
              className="border border-white/20 dark:border-white/20 rounded-lg px-3 py-2 bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
              value={form.caseType}
              onChange={(e) => setForm({ ...form, caseType: e.target.value })}
              aria-label="Sensitive case type"
            >
              <option value="">Pilih Jenis Kasus</option>
              {CASE_TYPES.map((ct, idx) => (
                <option key={idx} value={ct}>
                  {ct}
                </option>
              ))}
            </select>
            <input
              className="border border-white/20 dark:border-white/20 rounded-lg px-3 py-2 bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="ID Siswa"
              value={form.studentId}
              onChange={(e) => setForm({ ...form, studentId: e.target.value })}
              aria-label="Student ID"
            />
            <input
              className="border border-white/20 dark:border-white/20 rounded-lg px-3 py-2 bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="Nama Siswa (boleh inisial)"
              value={form.studentName}
              onChange={(e) => setForm({ ...form, studentName: e.target.value })}
              aria-label="Student name"
            />
            <input
              className="border border-white/20 dark:border-white/20 rounded-lg px-3 py-2 bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="Kelas (cth: VIII-B)"
              value={form.className}
              onChange={(e) => setForm({ ...form, className: e.target.value })}
              aria-label="Class name"
            />
            <input
              className="border border-white/20 dark:border-white/20 rounded-lg px-3 py-2 bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="Nama Orang Tua/Wali"
              value={form.parentName}
              onChange={(e) => setForm({ ...form, parentName: e.target.value })}
              aria-label="Parent name"
            />
            <input
              className="border border-white/20 dark:border-white/20 rounded-lg px-3 py-2 bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="HP Orang Tua (opsional)"
              value={form.parentPhone}
              onChange={(e) => setForm({ ...form, parentPhone: e.target.value })}
              aria-label="Parent phone"
            />
            <input
              className="border border-white/20 dark:border-white/20 rounded-lg px-3 py-2 bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="Email Orang Tua (opsional)"
              value={form.parentEmail}
              onChange={(e) => setForm({ ...form, parentEmail: e.target.value })}
              aria-label="Parent email"
            />
          </>
        )}
        <select
          className="border border-white/20 dark:border-white/20 rounded-lg px-3 py-2 bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
          value={form.decisionRole}
          onChange={(e) => setForm({ ...form, decisionRole: e.target.value })}
          aria-label="Disposition role"
        >
          <option value="">Disposisi ke...</option>
          {"Admin Sarpras,TU,Kepala Sekolah,BK/Kesiswaan,Keamanan".split(",").map((d, i) => (
            <option key={i} value={d}>
              {d}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
          <input
            type="checkbox"
            checked={form.headApprovalRequired}
            onChange={(e) =>
              setForm({
                ...form,
                headApprovalRequired: e.target.checked,
                approvalStatus: e.target.checked ? "Menunggu" : "Tidak perlu",
              })
            }
            className="h-4 w-4 text-blue-500 border-white/20 rounded focus:ring-blue-500"
            aria-label="Require head approval"
          />
          <span>Butuh persetujuan Kepala Sekolah</span>
        </label>
        {/* File Input for Photo Upload */}
        <div className="md:col-span-3">
          <label className="block text-sm text-gray-700 dark:text-gray-200 mb-1">
            Bukti Foto (opsional, maks 5MB, JPEG/PNG/GIF)
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif"
            onChange={handleFileChange}
            className="border border-white/20 dark:border-white/20 rounded-lg px-3 py-2 bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 w-full"
            aria-label="Upload photo evidence"
          />
          {form.photoPreview && (
            <div className="mt-2">
              <img
                src={form.photoPreview}
                alt="Photo preview"
                className="max-w-full h-auto rounded-lg border border-gray-200 dark:border-white/10"
                style={{ maxHeight: "200px" }}
              />
              <button
                type="button"
                onClick={() => {
                  if (form.photoPreview) {
                    URL.revokeObjectURL(form.photoPreview);
                  }
                  setForm({ ...form, photo: null, photoPreview: "" });
                }}
                className="mt-2 text-sm text-red-500 dark:text-red-400 hover:underline"
                aria-label="Remove photo"
              >
                Hapus Foto
              </button>
            </div>
          )}
        </div>
        <textarea
          className="border border-white/20 dark:border-white/20 rounded-lg px-3 py-2 bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 md:col-span-3"
          rows={3}
          placeholder="Deskripsi kejadian & dampak pembelajaran"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          aria-label="Complaint description"
        />
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        Catatan: Prioritas otomatis menyesuaikan—Tinggi (≤24 jam), Sedang (≤3 hari), Rendah (≤7 hari).
        Kasus Khusus → respon awal ≤ 2 jam. Disposisi & persetujuan disiapkan untuk dashboard
        Admin/Kepsek. Bukti foto akan disimpan sebagai lampiran komplain.
      </div>
    </form>
  );
}

// Mock Data & Helpers
function makeTrend() {
  return days.map((d) => ({
    d,
    Baru: Math.floor(Math.random() * 15),
    Diproses: Math.floor(Math.random() * 10),
    Selesai: Math.floor(Math.random() * 20),
  }));
}

function makePie(names: string[]) {
  return names.map((n) => ({ name: n, value: Math.floor(Math.random() * 100) + 10 }));
}

function makeArea() {
  return days.map((d) => ({ d, jam: Math.floor(Math.random() * 36) + 2 }));
}

function makeRows(prefix = "GURU") {
  const statuses = ["Baru", "Diproses", "Menunggu", "Selesai", "Ditolak"];
  const cats = ["Sarpras", "Keamanan", "Akademik", "IT", "Kebersihan", "Kepegawaian"];
  return Array.from({ length: 6 }).map((_, i) => ({
    id: `${prefix}-${2025}-${String(i + 1).padStart(3, "0")}`,
    date: `2025-08-${String(10 + i).padStart(2, "0")}`,
    title: "Keluhan fasilitas",
    category: cats[i % cats.length],
    priority: "Sedang",
    status: i < 3 ? statuses[i] : "Selesai",
    sla: "3 hari",
    description: "Demo ticket",
    school: ROLE_SCHOOLS.guru,
    location: "Ruang VII-B",
    impact: "Sedang",
    ratingAvg: i === 3 ? 5 : i === 4 ? 4 : i === 5 ? 3 : undefined, // demo ratings untuk distribusi
  }));
}

// Service Component
function Service() {
  const trend = useMemo(() => makeTrend(), []);
  const pie = useMemo(() => makePie(["AC", "CCTV", "Proyektor", "Komputer", "Kelistrikan"]), []);
  const area = useMemo(() => makeArea(), []);
  const [rows, setRows] = useState(() => makeRows("GURU"));
  const [ratingOpen, setRatingOpen] = useState(false);
  const [ratingTarget, setRatingTarget] = useState<any | null>(null);

  function addTicket(row: any) {
    setRows((prev) => [row, ...prev]);
  }

  function openRate(r: any) {
    setRatingTarget(r);
    setRatingOpen(true);
  }

  function submitRate(payload: any) {
    if (!ratingTarget) return;
    setRows((prev) =>
      prev.map((r) => (r.id === ratingTarget.id ? { ...r, ...payload } : r))
    );
    setRatingOpen(false);
    setRatingTarget(null);
  }

  // Distribusi rating
  const rated = rows.filter((r) => typeof r.ratingAvg === "number");
  const avgRated = rated.length
    ? rated.reduce((a, b) => a + (b.ratingAvg || 0), 0) / rated.length
    : 0;
  const ratingDist = [1, 2, 3, 4, 5].map((n) => ({
    name: `${n}★`,
    value: rated.filter((r) => Math.round(r.ratingAvg || 0) === n).length,
  }));

  // Dev sanity: log count
  useEffect(() => {
    console.log("Tickets loaded:", rows.length);
  }, []);

  return (
    <div className="space-y-4 pb-8 px-2 text-gray-800 dark:text-white">
      {/* <h2 className="text-3xl font-bold mb-8 text-teal-600 dark:text-teal-400">
        Pelayanan masyarakat
      </h2> */}
      {/* glossy overlay */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/10 opacity-40 dark:from-white/10 dark:to-white/0" />
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full" />
      </div>
      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in;
        }
        select option {
          background: #F9FAFB !important;
          color: #1F2937;
        }
        select option:checked,
        select option:hover {
          background: #60A5FA !important;
          color: #FFFFFF;
        }
        @media (prefers-color-scheme: dark) {
          select option {
            background: #1E293B !important;
            color: #FFFFFF;
          }
          select option:checked,
          select option:hover {
            background: #60A5FA !important;
            color: #FFFFFF;
          }
        }
      `}</style>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 animate-fade-in">
        <StatCard
          title="Tiket Aktif"
          value={String(rows.length)}
          subtitle="7 hari terakhir"
          icon={ClipboardList}
        />
        <StatCard
          title="SLA Terpenuhi"
          value="92%"
          subtitle="bulan ini"
          icon={CheckCircle2}
          tone="success"
        />
        <StatCard
          title="Sudah Dinilai"
          value={String(rated.length)}
          subtitle="tiket selesai"
          icon={StarIcon}
        />
        <StatCard
          title="Rata-rata Rating"
          value={avgRated ? avgRated.toFixed(1) : "-"}
          subtitle="/ 5"
          icon={Wrench}
        />
      </div>
      <ComplaintForm onCreate={addTicket} school={ROLE_SCHOOLS.guru} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-fade-in">
        <div className="lg:col-span-2">
          <SimpleBar data={trend} />
        </div>
        <SimplePie data={pie} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-fade-in">
        <div className="lg:col-span-2">
          <TicketsTable rows={rows} onRate={openRate} />
        </div>
        <div className="space-y-4">
          <SimpleArea data={area} />
          <SimplePie data={ratingDist} title="Distribusi Rating" />
        </div>
      </div>
      <RatingModal
        open={ratingOpen}
        onClose={() => {
          setRatingOpen(false);
          setRatingTarget(null);
        }}
        onSubmit={submitRate}
        initial={ratingTarget}
      />
    </div>
  );
}

// Role Content Component
function RoleContent() {
  return <Service />;
}

// Root App
export default function App() {
  const [role, setRole] = useState("guru");
  return (
    <ErrorBoundary>
      <div className="min-h-screen text-gray-800 dark:text-white px-4 md:px-6 pt-6">
        <div className="w-full mx-auto space-b-6">
          <div className="bg-transparent border-b border-white/10 pb-4 text-white pt-2 w-[99%] px-[0.6px] mx-auto shadow-lg">
            
            {/* header */}
            <div className="w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl md:text-xl font-semibold tracking-tight">
                  Pelayanan Masyarakat Sekolah
                </h1>
                <p className="text-gray-300 dark:text-gray-400 mt-1">
                  Dashboard layanan untuk Guru & Tendik
                </p>
              </div>
            </div>
          </div>

          {/* <RoleSwitcher role={role} onChange={setRole} /> */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* <div className="dark:bg-neutral-900/60/80 border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gray-100 dark:bg-white/10/70">
                  <Wrench className="w-5 h-5 text-gray-800 dark:text-white" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Anda melihat
                  </div>
                  <div className="text-lg font-semibold text-gray-800 dark:text-white">
                    {ROLES[0].label} • {ROLE_SCHOOLS.guru}
                  </div>
                </div>
              </div>
            </div> */}
            <RoleContent />
            {/* <footer className="text-center text-gray-500 dark:text-gray-400 text-xs py-8">
              © 2023–2025 Xpresensi – All rights reserved.
            </footer> */}
          </motion.div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

// Dev Tests
function runDevTests() {
  const rows = makeRows("TEST");
  console.assert(rows.some((r) => r.ratingAvg), "demo ratings terisi");
  const dist = [1, 2, 3, 4, 5].map((n) =>
    rows.filter((r) => Math.round(r.ratingAvg || 0) === n).length
  );
  console.assert(dist.some((v) => v > 0), "ada distribusi rating");
  console.assert(
    typeof Header === "function" &&
      typeof RoleSwitcher === "function" &&
      typeof StatCard === "function",
    "komponen dasar tersedia"
  );
  console.assert(Array.isArray(days) && days.length === 7, "days 7 item");
  const trend = makeTrend();
  console.assert(Array.isArray(trend) && trend.length === 7, "makeTrend 7 hari");
  const avgSample = (4 + 5 + 4 + 4) / 4;
  console.assert(
    Math.round(avgSample * 10) / 10 === 4.3,
    "pembulatan 1 desimal"
  );
}
runDevTests();
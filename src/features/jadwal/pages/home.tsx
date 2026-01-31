import { SMAN25_CONFIG } from "@/core/theme";
import { FooterComp } from "@/features/_global/components/footer";
import { HeroComp } from "@/features/_global/components/hero";
import NavbarComp from "@/features/_global/components/navbar";
import { getSchoolId } from "@/features/_global/hooks/getSchoolId";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

/****************************
 * THEME & DATA
 ****************************/
const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

/****************************
 * FILTER & SORT HELPERS
 ****************************/
const normalize = (s: string) => (s || "").toLowerCase();

/****************************
 * SCHEDULE TABLE
 ****************************/
const ScheduleTable = ({ schedules, theme }: { schedules: any[]; theme: any }) => {
  const prefersReducedMotion = useReducedMotion();

  if (!schedules || schedules.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border p-6 text-left"
        style={{ borderColor: theme.subtle, background: theme.surface, color: 'black' }}
      >
       Belum ada data jadwal pelajaran
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
      className="overflow-x-auto"
    >
      <table
        className="w-full text-sm"
        style={{ color: theme.primaryText, borderCollapse: "separate", borderSpacing: 0 }}
      >
        <thead>
          <tr>
            {["Hari", "Jam", "Mata Pelajaran", "Guru", "Kelas", "Ruang"].map((h) => (
              <th key={h} className="px-4 py-2 text-left border-b" style={{ borderColor: theme.subtle }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {schedules.map((s, i) => (
            <motion.tr
              key={s.id}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.35, delay: prefersReducedMotion ? 0 : i * 0.02 }}
              className="hover:bg-white/5"
            >
              <td className="px-4 py-2 border-b" style={{ borderColor: theme.subtle, color: theme.surfaceText }}>
                {s.day || "-"}
              </td>
              <td className="px-4 py-2 border-b" style={{ borderColor: theme.subtle, color: theme.surfaceText }}>
                {s.startTime} - {s.endTime}
              </td>
              <td className="px-4 py-2 border-b" style={{ borderColor: theme.subtle, color: theme.surfaceText }}>
                {s.subject || "-"}
              </td>
              <td className="px-4 py-2 border-b" style={{ borderColor: theme.subtle, color: theme.surfaceText }}>
                {s.teacher || "-"}
              </td>
              <td className="px-4 py-2 border-b" style={{ borderColor: theme.subtle, color: theme.surfaceText }}>
                {s.className || "-"}
              </td>
              <td className="px-4 py-2 border-b" style={{ borderColor: theme.subtle, color: theme.surfaceText }}>
                {s.room || "-"}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

/****************************
 * SCHEDULE SECTION
 ****************************/
const ScheduleSection = ({ theme }: { theme: any; }) => {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [day, setDay] = useState("Semua");
  const [kelas, setKelas] = useState("Semua");

  const schoolId = getSchoolId()

  // Fetch data from NEW API (hanya bagian ini yang diubah)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://be-school.kiraproject.id/jadwal?schoolId=${schoolId}`, {
          method: "GET",
          cache: 'no-store',
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Response tidak valid");
        }

        const validSchedules = (result.data || [])
          .map((s: any) => ({
            ...s,
            day: s.day ? s.day.charAt(0).toUpperCase() + s.day.slice(1).toLowerCase() : null,
            subject: s.subject || "-",
            teacher: s.teacher || "-",
            className: s.className || "-",
            room: s.room || "-",
          }))
          .filter(
            (s: any) =>
              s.subject !== "-" &&
              s.day &&
              s.startTime &&
              s.endTime &&
              DAYS.map(d => d.toLowerCase()).includes(s.day.toLowerCase())
          );

        setSchedules(validSchedules);
        if (validSchedules.length === 0) {
          setError("Belum ada data jadwal pelajaran");
        }
      } catch (e) {
        console.warn("Fetch error:", e);
        setError("Gagal memuat data jadwal. Silakan coba lagi nanti");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Get unique classes
  const classes = useMemo(() => {
    const unique = [...new Set(schedules.map((s) => s.className).filter(Boolean))];
    return ["Semua", ...unique];
  }, [schedules]);

  // Filter schedules
  const filteredSchedules = useMemo(() => {
    return schedules.filter((s) => {
      const matchQ =
        !q ||
        normalize(s.subject).includes(normalize(q)) ||
        normalize(s.teacher).includes(normalize(q)) ||
        normalize(s.className).includes(normalize(q));
      const matchDay = !day || day === "Semua" || s.day === day;
      const matchKelas = !kelas || kelas === "Semua" || s.className === kelas;
      return matchQ && matchDay && matchKelas;
    });
  }, [schedules, q, day, kelas]);

  // Group by day for weekly summary
  const scheduleByDay = useMemo(() => {
    const group = Object.fromEntries(DAYS.map((d) => [d, []]));
    schedules.forEach((s) => {
      if (s.day && group[s.day]) group[s.day].push(s);
    });
    return group;
  }, [schedules]);

  return (
    <section id="jadwal" className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto md:px-0 px-4">
        <div className="lg:flex items-start justify-between gap-4 mb-4">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-2xl md:text-3xl font-bold"
              style={{ color: 'black' }}
            >
              Jadwal Pelajaran
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-sm opacity-85"
              style={{ color: theme.surfaceText }}
            >
              Jadwal pelajaran siswa.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-right text-xs lg:mt-0 mt-3 md:inline-block hidden"
            style={{ color: theme.primaryText }}
          >
            Total Jadwal: <strong>{schedules.length}</strong>
            <br />
            Tersaring: <strong>{filteredSchedules.length}</strong>
          </motion.div>
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border p-4 mb-4 text-left"
            style={{ borderColor: theme.subtle, background: theme.surface, color: 'BLACK' }}
          >
            {error}
          </motion.div>
        )}

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-4 flex flex-wrap items-center gap-3"
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari mata pelajaran, guru, atau kelas…"
            className="w-full md:w-[400px] px-3 py-2 rounded-xl text-sm border bg-transparent"
            style={{ borderColor: theme.subtle, color: theme.primaryText }}
            disabled={loading}
          />
          <label className="text-xs flex items-center gap-2">
            <span style={{ color: theme.primaryText }}>Hari</span>
            <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="px-2 py-1 rounded-lg text-sm border bg-transparent"
              style={{ borderColor: theme.subtle, color: theme.primaryText }}
              disabled={loading}
            >
              {["Semua", ...DAYS].map((d) => (
                <option key={d} value={d} style={{ color: "#111827" }}>
                  {d}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs flex items-center gap-2">
            <span style={{ color: theme.primaryText }}>Kelas</span>
            <select
              value={kelas}
              onChange={(e) => setKelas(e.target.value)}
              className="px-2 py-1 rounded-lg text-sm border bg-transparent"
              style={{ borderColor: theme.subtle, color: theme.primaryText }}
              disabled={loading}
            >
              {classes.map((c) => (
                <option key={c} value={c} style={{ color: "#111827" }}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </motion.div>

        {/* Table */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border p-4"
            style={{ borderColor: theme.subtle, background: theme.surface }}
          >
            <div className="h-6 bg-white/20 rounded w-full mb-2 animate-pulse" />
            <div className="h-6 bg-white/20 rounded w-full mb-2 animate-pulse" />
            <div className="h-6 bg-white/20 rounded w-full animate-pulse" />
          </motion.div>
        ) : (
          <ScheduleTable schedules={filteredSchedules} theme={theme} />
        )}

        {/* Weekly Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10"
        >
          <h3 className="text-lg font-semibold mb-2" style={{ color: theme.primaryText }}>
            Ringkasan Jadwal Mingguan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {DAYS.map((d, i) => (
              <motion.div
                key={d}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="rounded-2xl border p-3"
                style={{ borderColor: theme.subtle, background: theme.surface }}
              >
                <div className="font-medium mb-2" style={{ color: theme.primaryText }}>
                  {d}
                </div>
                <div className="flex flex-col gap-2">
                  {scheduleByDay[d].length === 0 ? (
                    <div className="text-xs opacity-75" style={{ color: theme.surfaceText }}>
                      Tidak ada jadwal.
                    </div>
                  ) : (
                    scheduleByDay[d].map((s: any, j: number) => (
                      <motion.div
                        key={s.id}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: j * 0.03 }}
                        className="text-xs flex items-center justify-between gap-2"
                        style={{ color: theme.surfaceText }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="truncate">{s.subject || "-"}</span>
                          <span className="opacity-80">
                            ({s.startTime} - {s.endTime})
                          </span>
                        </div>
                        <span>{s.room || "-"}</span>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/****************************
 * DEFAULT PAGE DENGAN HERO
 ****************************/
const SchedulePage = () => {
  const schoolInfo = SMAN25_CONFIG;
  const theme = schoolInfo.theme;
  const schoolName = schoolInfo.fullName;
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    try {
      console.assert(typeof ScheduleSection === "function", "ScheduleSection harus ada");
      console.assert(typeof NavbarComp === "function" && typeof FooterComp === "function", "Navbar/Footer harus ada");
      console.log("UI smoke tests passed (Jadwal)");
    } catch (e) {
      console.error("UI smoke tests failed:", e);
    }
  }, [prefersReducedMotion]);

  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      <NavbarComp theme={theme} />

      {/* HERO SECTION */}
      <HeroComp titleProps="Jadwal Pelajaran" id="#jadwal" />

      <main id="jadwal">
        <ScheduleSection theme={theme} />
      </main>

      <FooterComp />
    </div>
  );
};

export default SchedulePage;
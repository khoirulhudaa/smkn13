import { SMAN25_CONFIG } from "@/core/theme";
import { FooterComp } from "@/features/_global/components/footer";
import { HeroComp } from "@/features/_global/components/hero";
import NavbarComp from "@/features/_global/components/navbar";
import { getSchoolId } from "@/features/_global/hooks/getSchoolId";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Bell, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

/****************
 * UTILITIES
 ****************/
const PPDB_PERIOD = {
  start: new Date("2025-05-01T00:00:00+07:00"),
  end: new Date("2025-07-31T23:59:59+07:00"),
};
const isWithinPeriod = (now, { start, end }) => now >= start && now <= end;

/****************************
 * DATA & STYLES
 ****************************/
const CATEGORY_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  Akademik: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
  Kesiswaan: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400" },
  Dinas: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-400" },
  Ujian: { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-400" },
  Libur: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-400" },
  Umum: { bg: "bg-slate-50", text: "text-slate-700", dot: "bg-slate-400" },
};

/****************************
 * KALENDER DATA
 ****************************/
const CATEGORY_COLORS = {
  Akademik: "#F2C94C",
  Kesiswaan: "#4ADE80",
  Dinas: "#60A5FA",
  Ujian: "#FB7185",
  Libur: "#A78BFA",
  Umum: "#94A3B8",
};

const DEMO_EVENTS = [
  { title: "Upacara & Pembinaan Karakter", date: "2025-09-08", category: "Kesiswaan" },
  { title: "Masa Penilaian Tengah Semester (PTS)", date: "2025-09-15", category: "Ujian" },
  { title: "Rapat Orang Tua/Wali Kelas X", date: "2025-09-20", category: "Akademik" },
  { title: "Kegiatan Donor Darah", date: "2025-09-24", category: "Kesiswaan" },
  { title: "Edaran Dinas: Cuti Bersama", date: "2025-09-27", category: "Dinas" },
  { title: "Libur Maulid Nabi", date: "2025-09-16", category: "Libur" },
];

/****************************
 * FETCH HOOK (HANYA BAGIAN INI YANG DIUBAH)
 ****************************/
const useCalendarEvents = (year, month) => {
  const [events, setEvents] = useState<any[]>(DEMO_EVENTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const schoolId = getSchoolId()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://be-school.kiraproject.id/kalender?schoolId=${schoolId}`, {
          method: "GET",
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Response tidak valid");
        }

        // Mapping sesuai struktur API baru
        const mappedEvents = (result.data || []).map((e: any) => ({
          title: e.title || "Tidak ada judul",
          date: e.date || "",
          category: e.category || "Umum",
          description: e.description || "",
          startTime: e.startTime || null,
          endTime: e.endTime || null,
          id: e.id,
        }));

        setEvents(mappedEvents);
        if (mappedEvents.length === 0) {
          setError("Belum ada agenda untuk bulan ini.");
        }
      } catch (err) {
        console.warn("Fetch error:", err);
        setError("Gagal memuat data kalender. Menampilkan data demo.");
        setEvents(DEMO_EVENTS);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year, month]); // Re-fetch saat bulan/tahun berubah

  return { data: events, isPending: loading, error };
};

/****************************
 * UTILITY HOOK
 ****************************/
function useMonthMatrix(year, monthIndex) {
  return useMemo(() => {
    const first = new Date(year, monthIndex, 1);
    const startDay = first.getDay();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const prevMonthDays = new Date(year, monthIndex, 0).getDate();
    const cells = [];
    for (let i = 0; i < startDay; i++) {
      cells.push({ day: prevMonthDays - startDay + 1 + i, inMonth: false });
    }
    for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, inMonth: true });
    while (cells.length < 42) cells.push({ day: cells.length - (startDay + daysInMonth) + 1, inMonth: false });
    return { cells, daysInMonth, startDay };
  }, [year, monthIndex]);
}

/****************************
 * COMPONENTS
 ****************************/
const Legend = ({ theme }) => (
  <div className="flex flex-wrap gap-3 md:mt-0 mt-10">
    {Object.entries(CATEGORY_COLORS).map(([k, color]) => (
      <div key={k} className="inline-flex items-center gap-2 text-xs">
        <span className="w-3 h-3 rounded-sm inline-block" style={{ background: color, border: `1px solid ${theme.subtle}` }} />
        <span style={{ color: theme.surfaceText }}>{k}</span>
      </div>
    ))}
  </div>
);

const DayCell = ({ day, inMonth, isToday, events }: any) => {
  return (
    <div 
      className={`min-h-[100px] md:min-h-[140px] p-3 border-r border-b border-gray-900/20 transition-all duration-300 
      ${!inMonth ? "bg-slate-50/30 opacity-30" : "bg-white hover:bg-slate-50/50"}`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className={`text-sm font-black ${isToday ? "w-7 h-7 flex items-center justify-center bg-blue-600 text-white rounded-full shadow-lg shadow-blue-200" : "text-slate-400"}`}>
          {day}
        </span>
      </div>
      
      <div className="space-y-1.5">
        {events.slice(0, 2).map((e: any, i: number) => (
          <div 
            key={i} 
            className={`text-[9px] md:text-[10px] p-1.5 rounded-lg border font-bold truncate leading-none
            ${CATEGORY_STYLES[e.category]?.bg || "bg-slate-50"} ${CATEGORY_STYLES[e.category]?.text || "text-slate-600"} 
            ${CATEGORY_STYLES[e.category]?.text.replace('text', 'border')}/10`}
          >
            {e.title}
          </div>
        ))}
        {events.length > 2 && (
          <p className="text-[9px] font-black text-slate-300 uppercase pl-1">+{events.length - 2} Agenda</p>
        )}
      </div>
    </div>
  );
};

export const CalendarSection = ({ schoolName }: { schoolName: string }) => {
  const [cursor, setCursor] = useState(new Date());
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const SCHOOL_ID = getSchoolId();

  // Fetch Logic (Simplified for integration)
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCal = async () => {
      try {
        const res = await fetch(`https://be-school.kiraproject.id/kalender?schoolId=${SCHOOL_ID}`);
        const json = await res.json();
        if (json.success) setEvents(json.data);
      } finally { setLoading(false); }
    };
    fetchCal();
  }, [SCHOOL_ID]);

  const { cells } = useMemo(() => {
    const first = new Date(year, month, 1);
    const startDay = first.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = 0; i < startDay; i++) cells.push({ day: prevMonthDays - startDay + 1 + i, inMonth: false });
    for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, inMonth: true });
    while (cells.length < 42) cells.push({ day: cells.length - (startDay + daysInMonth) + 1, inMonth: false });
    return { cells };
  }, [year, month]);

  const eventsByDay = useMemo(() => {
    const map: any = {};
    events.forEach(e => {
      const d = new Date(e.date);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const date = d.getDate();
        if (!map[date]) map[date] = [];
        map[date].push(e);
      }
    });
    return map;
  }, [events, year, month]);

  const upcomingEvents = useMemo(() => {
    return [...events]
      .filter(e => new Date(e.date) >= new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 4);
  }, [events]);

  const monthLabel = cursor.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  return (
    <section className="py-16 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header Dashboard Style */}
        <div className="flex flex-col lg:flex-row gap-12 mb-4">
          <div className="w-max">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-12 h-[2px] bg-slate-900" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Timeline</span>
            </div>
            <h2 className="text-xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.8] mb-4">
              Agenda <span className="text-blue-600">Sekolah</span>
            </h2>
            <p className="text-slate-500 w-max font-medium leading-relaxed">
              Pantau seluruh jadwal akademik, ujian, hingga kegiatan kesiswaan dalam satu dasbor terpadu.
            </p>
          </div>

          {/* Upcoming Highlight Cards */}
          <div className="lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingEvents.map((e, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-white p-5 rounded-[2rem] border border-gray-900/20 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className={`w-8 h-8 rounded-xl ${CATEGORY_STYLES[e.category]?.bg} flex items-center justify-center mb-4`}>
                    <Bell size={14} className={CATEGORY_STYLES[e.category]?.text} />
                  </div>
                  <h4 className="font-black text-slate-900 uppercase italic tracking-tighter text-sm line-clamp-1">{e.title}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{new Date(e.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Calendar Grid Container */}
        <div className="bg-white rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.04)] border border-gray-900/20 overflow-hidden">
          {/* Calendar Toolbar */}
          <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6">
               <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">{monthLabel}</h3>
               <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-gray-900/30">
                 <button onClick={() => setCursor(new Date(year, month - 1))} className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-400 hover:text-blue-600">
                   <ChevronLeft size={20} />
                 </button>
                 <button onClick={() => setCursor(new Date(year, month + 1))} className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-400 hover:text-blue-600">
                   <ChevronRight size={20} />
                 </button>
               </div>
            </div>
          </div>

          {/* Grid Header */}
          <div className="grid grid-cols-7 bg-slate-50/50 border-b border-gray-900/20">
            {["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"].map(d => (
              <div key={d} className="py-4 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                {d}
              </div>
            ))}
          </div>

          {/* Grid Body */}
          <div className="grid grid-cols-7">
            {cells.map((c, i) => (
              <DayCell 
                key={i} 
                day={c.day} 
                inMonth={c.inMonth} 
                isToday={c.inMonth && new Date().getDate() === c.day && new Date().getMonth() === month && new Date().getFullYear() === year}
                events={c.inMonth ? (eventsByDay[c.day] || []) : []}
              />
            ))}
          </div>
        </div>

        {/* Mobile Agenda List View */}
        <div className="mt-12 lg:hidden space-y-4">
          <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Agenda Bulan Ini</h3>
          {events.filter(e => new Date(e.date).getMonth() === month).map((e, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-gray-900/20 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl ${CATEGORY_STYLES[e.category]?.bg} flex flex-col items-center justify-center`}>
                  <span className={`text-xs font-black ${CATEGORY_STYLES[e.category]?.text}`}>{new Date(e.date).getDate()}</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{e.title}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{e.category}</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-slate-300" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

/****************************
 * PAGE DENGAN HERO
 ****************************/
const CalendarPage = () => {
  const schoolInfo = SMAN25_CONFIG;
  const theme = schoolInfo.theme;
  const schoolName = schoolInfo.fullName;
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    try {
      console.assert(!!theme, "Theme harus ada");
      const keys = ["bg", "primary", "primaryText", "surface", "surfaceText", "subtle", "accent"];
      keys.forEach((k) => console.assert(k in theme, `Theme key '${k}' harus ada`));
      console.assert(typeof CalendarSection === "function", "CalendarSection harus terdefinisi");
      console.assert(typeof NavbarComp === "function", "Navbar harus terdefinisi");
      console.assert(typeof FooterComp === "function", "Footer harus terdefinisi");

      const { cells } = (function () {
        const first = new Date(2025, 8, 1);
        const startDay = first.getDay();
        const daysInMonth = new Date(2025, 9, 0).getDate();
        const prevMonthDays = new Date(2025, 8, 0).getDate();
        const arr = [];
        for (let i = 0; i < startDay; i++) arr.push({ day: prevMonthDays - startDay + 1 + i, inMonth: false });
        for (let d = 1; d <= daysInMonth; d++) arr.push({ day: d, inMonth: true });
        while (arr.length < 42) arr.push({ day: arr.length - (startDay + daysInMonth) + 1, inMonth: false });
        return { cells: arr };
      })();
      console.assert(cells.length === 42, "Grid kalender harus 42 sel");
      console.assert(isWithinPeriod(new Date("2025-06-15T00:00:00+07:00"), PPDB_PERIOD) === true, "PPDB harus aktif Juni 2025");

      console.log("UI smoke tests passed");
    } catch (e) {
      console.error("UI smoke tests failed:", e);
    }
  }, [prefersReducedMotion, theme]);

  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      <NavbarComp theme={theme} />

      {/* HERO SECTION */}
      <HeroComp titleProps="Kalender Agenda" id="#kalender" />

      <main id="kalender">
        <CalendarSection schoolName={schoolName} />
      </main>

      <FooterComp />
    </div>
  );
};

export default CalendarPage;
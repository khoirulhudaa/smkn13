import { SMAN25_CONFIG } from "@/core/theme";
import { FooterComp } from "@/features/_global/components/footer";
import { HeroComp } from "@/features/_global/components/hero";
import NavbarComp from "@/features/_global/components/navbar";
import { getSchoolId } from "@/features/_global/hooks/getSchoolId";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BookOpen, ChevronRight, Info, Mail, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

/****************************
 * AVATAR SVG GENERATOR
 ****************************/
const makeAvatar = (name: string, theme: any) => {
  const initials = name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const svg = `<?xml version='1.0' encoding='UTF-8'?>
<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'>
<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
<stop offset='0%' stop-color='${theme.primary}'/><stop offset='100%' stop-color='${theme.subtle}'/></linearGradient></defs>
<rect width='240' height='240' rx='24' fill='url(#g)'/>
<text x='50%' y='55%' text-anchor='middle' font-family='Inter,Arial' font-size='84' font-weight='700' fill='${theme.primaryText}'>${initials}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

/****************************
 * DEMO DATA (Fallback)
 ****************************/
const DEMO_PEOPLE = [
  { id: 1, name: "Drs. Andi Pratama", unit: "RPL", subjects: ["RPL"], status: "PNS", years: 12, email: "andi@smkn13.sch.id" },
  { id: 2, name: "Sari Wulandari, M.Pd", unit: "Umum", subjects: ["MTK"], status: "PNS", years: 10, email: "sari@smkn13.sch.id" },
  { id: 3, name: "Budi Santoso", unit: "RPL", subjects: ["RPL"], status: "PPPK", years: 6, email: "budi@smkn13.sch.id" },
  { id: 4, name: "Siti Rahma", unit: "Umum", subjects: [], role: "TU – Administrasi", status: "PNS", years: 7, email: "siti@smkn13.sch.id" },
];

/****************************
 * REACT QUERY HOOK - Terintegrasi dengan API guruTendik
 ****************************/
const useTeacherStaff = () => {
  return useQuery({
    queryKey: ['guru-tendik'],
    queryFn: async () => {
      const schoolId = getSchoolId(); // <-- GANTI sesuai kebutuhan (bisa dari context, env, atau props)
      const url = `https://be-school.kiraproject.id/guruTendik?schoolId=${schoolId}`;

      const res = await fetch(url, {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`Gagal memuat data guru/tendik: ${res.status}`);
      }

      const json = await res.json();

      if (!json.success || !Array.isArray(json.data)) {
        throw new Error('Format response API tidak sesuai');
      }

      return json.data.map((item: any) => ({
        id: item.id,
        name: item.nama || 'Nama tidak tersedia',
        subjects: item.mapel ? [item.mapel.trim()] : [],
        role: item.role || (item.mapel ? null : 'Tendik / Staf'),
        unit: item.jurusan || 'Umum',
        photo: item.photoUrl || null,
        status: item.isActive ? 'Aktif' : 'Nonaktif',
        years: 0, // Belum ada field tahun mulai → bisa ditambah di backend nanti
        email: item.email || null,
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 menit
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    placeholderData: DEMO_PEOPLE,
    retry: 1,
  });
};

/****************************
 * FILTER & SORT
 ****************************/
const DEPARTMENTS = ["Guru", "Wali Kelas", "Kepala Sekolah", "Kepala Tata Usaha", "Administrasi"];
const SUBJECTS = ["RPL", "TKJ", "MM", "MTK", "B. Indonesia", "B. Inggris", "PPKn", "Sejarah", "Agama", "PJOK", "BK", "Kewirausahaan"];

const filterPeople = (people: any[], q: string, unit: string, subject: string) => {
  const nq = q.trim().toLowerCase();
  return people.filter((p) => {
    const matchQ =
      !nq ||
      p.name.toLowerCase().includes(nq) ||
      (p.email || '').toLowerCase().includes(nq) ||
      (p.role || '').toLowerCase().includes(nq);
    const matchUnit = unit === 'Semua' || p.unit === unit;
    const matchSubj = subject === 'Semua' || p.subjects.includes(subject);
    return matchQ && matchUnit && matchSubj;
  });
};

const sorters: Record<string, (a: any, b: any) => number> = {
  nama: (a, b) => a.name.localeCompare(b.name),
  masaKerja: (a, b) => (b.years || 0) - (a.years || 0),
};

const Chip = ({ children, theme }: { children: React.ReactNode; theme: any }) => (
  <span
    className="text-[11px] px-2 py-0.5 rounded-full border"
    style={{ borderColor: theme.subtle, background: "rgba(255,255,255,0.06)", color: theme.primaryText }}
  >
    {children}
  </span>
);

/****************************
 * CARD & MODAL
 ****************************/
const PersonCard = ({ person, theme, onOpen }: { person: any; theme: any; onOpen: (p: any) => void }) => {
  const prefersReducedMotion = useReducedMotion();
  const isTeacher = person.subjects.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.45 }}
      className="rounded-2xl p-4 border border-gray-300 flex gap-3 hover:shadow-md transition cursor-pointer"
      style={{ background: theme.surface }}
      onClick={() => onOpen(person)}
    >
      <img
        src={person.photo || makeAvatar(person.name, theme)}
        alt={person.name}
        className="w-14 h-14 rounded-xl object-cover border"
        style={{ borderColor: theme.subtle }}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="truncate">
            <div className="font-semibold truncate" style={{ color: theme.primaryText }}>
              {person.name}
            </div>
            <div className="text-xs opacity-80 truncate" style={{ color: theme.primaryText }}>
              {isTeacher ? person.subjects.join(', ') : person.role}
            </div>
          </div>
          <span className="text-xs px-2 py-1 rounded-lg border" style={{ borderColor: theme.subtle, color: theme.primaryText }}>
            Detail
          </span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Chip theme={theme}>{person.unit}</Chip>
          {isTeacher && <Chip theme={theme}>{person.status}</Chip>}
          {(person.years || 0) > 0 && <Chip theme={theme}>{person.years} th</Chip>}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs" style={{ color: theme.primaryText }}>
          {person.email && (
            <a href={`mailto:${person.email}`} className="underline" onClick={(e) => e.stopPropagation()}>
              Email
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Modal = ({ open, onClose, theme, title, children }: { open: boolean; onClose: () => void; theme: any; title: string; children: React.ReactNode }) => {
  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.45)" }} onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="relative max-w-lg w-full rounded-2xl border p-4"
        style={{ background: theme.surface, borderColor: theme.subtle }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="font-semibold" style={{ color: theme.primaryText }}>
            {title}
          </div>
          <button onClick={onClose} className="px-2 py-1 rounded-lg border text-xs" style={{ borderColor: theme.subtle, color: theme.primaryText }}>
            Tutup
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
};

/****************************
 * CONTROLS
 ****************************/
const Controls = ({
  theme,
  q,
  setQ,
  unit,
  setUnit,
  subject,
  setSubject,
  sortBy,
  setSortBy,
}: {
  theme: any;
  q: string;
  setQ: (v: string) => void;
  unit: string;
  setUnit: (v: string) => void;
  subject: string;
  setSubject: (v: string) => void;
  sortBy: string;
  setSortBy: (v: string) => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="flex flex-wrap items-center gap-3"
  >
    <input
      value={q}
      onChange={(e) => setQ(e.target.value)}
      placeholder="Cari nama/email/role…"
      className="px-3 py-2 rounded-xl text-sm border bg-transparent"
      style={{ borderColor: theme.subtle, color: theme.primaryText }}
    />
    {/* <label className="text-xs flex items-center gap-2">
      <span style={{ color: theme.primaryText }}>Unit</span>
      <select
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
        className="px-2 py-1 rounded-lg text-sm border bg-transparent"
        style={{ borderColor: theme.subtle, color: theme.primaryText }}
      >
        {['Semua', ...DEPARTMENTS].map((u) => (
          <option key={u} value={u} style={{ color: '#111827' }}>
            {u}
          </option>
        ))}
      </select>
    </label> */}
    <label className="text-xs flex items-center gap-2">
      <span style={{ color: theme.primaryText }}>Mapel</span>
      <select
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="px-2 py-1 rounded-lg text-sm border bg-transparent"
        style={{ borderColor: theme.subtle, color: theme.primaryText }}
      >
        {['Semua', ...SUBJECTS].map((s) => (
          <option key={s} value={s} style={{ color: '#111827' }}>
            {s}
          </option>
        ))}
      </select>
    </label>
  </motion.div>
);


/****************************
 * AVATAR FALLBACK
 ****************************/
const AvatarPlaceholder = ({ name }: { name: string }) => {
  const initial = name.charAt(0).toUpperCase();
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-400 font-black text-2xl">
      {initial}
    </div>
  );
};

/****************************
 * COMPONENTS
 ****************************/

const TeacherCard = ({ person, onOpen }: { person: any; onOpen: (p: any) => void }) => {
  const isTeacher = person.subjects.length > 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={() => onOpen(person)}
      className="group bg-white rounded-[2rem] p-5 border border-gray-900/20 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div className="flex items-start gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-50 shadow-inner">
            {person.photo ? (
              <img src={person.photo} alt={person.name} className="w-full h-full object-cover" />
            ) : (
              <AvatarPlaceholder name={person.name} />
            )}
          </div>
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${person.status === 'Aktif' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
        </div>

        <div className="min-w-0 flex-1 pt-1">
          <h3 className="font-black text-slate-900 leading-tight truncate uppercase italic tracking-tighter">
            {person.name}
          </h3>
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">
            {isTeacher ? person.subjects[0] : person.role}
          </p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
        <div className="flex gap-2">
          <span className="px-2 py-1 bg-slate-100 text-[9px] font-black text-slate-500 uppercase rounded-md tracking-tighter">
            {person.unit}
          </span>
        </div>
        <div className="text-slate-300 group-hover:text-blue-600 transition-colors">
          <ChevronRight size={18} />
        </div>
      </div>
    </motion.div>
  );
};

const TeacherStaffSection = ({ schoolName }: { schoolName: string }) => {
  const [q, setQ] = useState('');
  const [subject, setSubject] = useState('Semua');
  const [selected, setSelected] = useState<any>(null);

  const { data: people = [], isLoading } = useTeacherStaff(); // Menggunakan hook API yang sudah Anda buat

  const SUBJECTS = ["Semua", "RPL", "TKJ", "MM", "MTK", "B. Indonesia", "B. Inggris", "PPKn", "Sejarah", "Agama", "PJOK", "BK"];

  const filteredPeople = useMemo(() => {
    return people.filter((p: any) => {
      const matchQ = p.name.toLowerCase().includes(q.toLowerCase()) || (p.email || '').toLowerCase().includes(q.toLowerCase());
      const matchSubj = subject === 'Semua' || p.subjects.includes(subject);
      return matchQ && matchSubj;
    });
  }, [people, q, subject]);

  return (
    <section className="py-16 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-12 h-[2px] bg-blue-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">Pegawai Sekolah</span>
            </div>
            <h2 className="text-xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.8]">
              Pilar <span className="text-blue-600">Akademik</span>
            </h2>
            <p className="mt-6 text-slate-500 font-medium">
              Mengenal lebih dekat para pendidik dan tenaga kependidikan
            </p>
          </div>

          <div className="bg-white p-2 rounded-3xl shadow-sm border border-gray-900/20 flex items-center gap-4">
            <div className="px-6 py-2 border-r border-slate-100">
               <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Total</p>
               <p className="text-xl font-black text-slate-900">{people.length}</p>
            </div>
            <div className="px-6 py-2">
               <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Filtered</p>
               <p className="text-xl font-black text-blue-600">{filteredPeople.length}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={20} />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari nama atau email..."
              className="w-full pl-14 pr-6 py-5 bg-gray-200 placeholder:text-black/50 rounded-[2rem] border-none shadow-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
            />
          </div>
          <div className="relative w-full md:w-64">
             <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full pl-8 pr-12 py-5 bg-gray-200 placeholder:text-black/50 rounded-[2rem] border-none shadow-sm font-black uppercase tracking-widest text-[11px] text-slate-700 appearance-none focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer"
             >
                {SUBJECTS.map(s => <option key={s} value={s}>{s === 'Semua' ? 'SEMUA MAPEL' : s}</option>)}
             </select>
             <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 rotate-90 pointer-events-none" size={18} />
          </div>
        </div>

        {/* Grid Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-40 bg-white rounded-[2rem] animate-pulse border border-slate-50" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredPeople.map((p: any) => (
                <TeacherCard key={p.id} person={p} onOpen={setSelected} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Detail Modal */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999999999999] flex items-center justify-center p-6 backdrop-blur-xl bg-slate-900/60"
              onClick={() => setSelected(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                className="bg-white w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl p-8 relative"
                onClick={e => e.stopPropagation()}
              >
                <button onClick={() => setSelected(null)} className="absolute top-6 right-6 p-2 hover:bg-red-500 bg-red-600 text-white rounded-full transition-colors">
                  <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center">
                  <div className="w-28 h-28 rounded-[2rem] overflow-hidden border-4 border-slate-50 shadow-xl mb-6">
                    {selected.photo ? (
                      <img src={selected.photo} alt={selected.name} className="w-full h-full object-cover" />
                    ) : (
                      <AvatarPlaceholder name={selected.name} />
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter leading-tight">
                    {selected.name}
                  </h3>
                  <p className="text-blue-600 font-bold uppercase tracking-widest text-[10px] mt-2 mb-8">
                    {selected.subjects.length > 0 ? `Guru ${selected.subjects.join(', ')}` : selected.role}
                  </p>

                  <div className="w-full space-y-3">
                    <div className="flex items-center justify-between p-4 bg-slate-100 rounded-2xl">
                      <div className="flex items-center gap-3 text-slate-400">
                        <BookOpen size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Unit Kerja</span>
                      </div>
                      <span className="font-bold text-slate-700">{selected.unit}</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-100 rounded-2xl">
                      <div className="flex items-center gap-3 text-slate-400">
                        <Info size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Status</span>
                      </div>
                      <span className={`font-bold ${selected.status === 'Aktif' ? 'text-emerald-600' : 'text-slate-400'}`}>{selected.status}</span>
                    </div>

                    {selected.email && (
                      <a 
                        href={`mailto:${selected.email}`}
                        className="flex items-center justify-center gap-3 w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-blue-600 transition-all mt-4 shadow-lg shadow-slate-200"
                      >
                        <Mail size={14} /> Hubungi via Email
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

/****************************
 * MAIN PAGE
 ****************************/
const TeacherStaffPage = () => {
  const schoolInfo = SMAN25_CONFIG;
  const theme = schoolInfo.theme;
  const schoolName = schoolInfo.fullName;

  useEffect(() => {
    // Optional: smoke test / debug
    console.log("Theme loaded:", theme);
  }, [theme]);

  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      <NavbarComp theme={theme} />

      <HeroComp titleProps="Guru & Tendik" id="#guru" />

      <main id="guru">
        <TeacherStaffSection theme={theme} schoolName={schoolName} />
      </main>

      <FooterComp />
    </div>
  );
};

export default TeacherStaffPage;
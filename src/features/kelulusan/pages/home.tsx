// import { getXHostHeader } from "@/core/utils/XHostHeader";
// import { FooterComp } from "@/features/_global/components/footer";
// import NavbarComp from "@/features/_global/components/navbar";
// import { useQuery, useQueryClient } from '@tanstack/react-query';
// import { useEffect, useMemo, useState } from "react";

// /****************************
//  * DETEKSI SEKOLAH BERDASARKAN DOMAIN
//  ****************************/
// const getSchoolInfoFromDomain = () => {
//   const host = typeof window !== "undefined" ? window.location.hostname : getXHostHeader();
//   const domain = host?.toLowerCase().replace(/^https?:\/\//, "");

//   // === SMKN 13 Jakarta ===
//   if (
//     domain === "smkn13jkt.kiraproject.id" ||
//     domain === "smkn13jakarta.sch.id" ||  // TAMBAHAN
//     domain === "localhost"
//   ) {
//     return {
//       type: "SMKN",
//       number: "13",
//       city: "Jakarta",
//       fullName: "SMKN 13 Jakarta",
//       shortName: "SMKN 13",
//       npsn: "20102234",
//       email: "ppid@smkn13.sch.id",
//       phone: "+62 21 1234567",
//       hours: "07:00 – 15:00",
//       theme: {
//         name: "SMKN 13 Jakarta",
//         primary: "#1F3B76",
//         primaryText: "#ffffff",
//         accent: "#F2C94C",
//         bg: "#0B1733",
//         surface: "#102347",
//         surfaceText: "#ffffff",
//         subtle: "#2C3F6B",
//         border: "#1E376B",
//         gold: "#F2C94C",
//         pop: "#E63946",
//       },
//     };
//   }

//   // === SMAN dari .sch.id (new. atau tanpa new.) + jakarta.sch.id ===
//   const smanMatch = domain?.match(/^(new\.)?sman(\d+)-jkt\.sch\.id$/) ||
//                     domain?.match(/^sman(\d+)jakarta\.sch\.id$/); // TAMBAHAN

//   if (smanMatch) {
//     const number = smanMatch[2] || smanMatch[1]; // legacy: [2], jakarta: [1]
//     const validNumbers = ["25", "65", "68", "78"];
//     if (validNumbers.includes(number)) {
//       const npsnMap: Record<string, string> = {
//         "25": "20102235",
//         "65": "20102236",
//         "68": "20102237",
//         "78": "20102238",
//       };
//       return {
//         type: "SMAN",
//         number,
//         city: "Jakarta",
//         fullName: `SMAN ${number} Jakarta`,
//         shortName: `SMAN ${number}`,
//         npsn: npsnMap[number],
//         email: `ppid@sman${number}.sch.id`,
//         phone: `+62 21 7654${number}`,
//         hours: "07:00 – 14:00",
//         theme: {
//           name: `SMAN ${number} Jakarta`,
//           primary: "#1F3B76",
//           primaryText: "#ffffff",
//           accent: "#F2C94C",
//           bg: "#0B1733",
//           surface: "#102347",
//           surfaceText: "#ffffff",
//           subtle: "#2C3F6B",
//           border: "#1E376B",
//           gold: "#F2C94C",
//           pop: "#E63946",
//         },
//       };
//     }
//   }

//   // === Fallback Default (SMAN 1 Jakarta) ===
//   return {
//     type: "SMAN",
//     number: "1",
//     city: "Jakarta",
//     fullName: "SMAN 1 Jakarta",
//     shortName: "SMAN 1",
//     npsn: "20102239",
//     email: "ppid@sman1.sch.id",
//     phone: "+62 21 1111111",
//     hours: "07:00 – 14:00",
//     theme: {
//       name: "Default",
//       primary: "#1F3B76",
//       primaryText: "#ffffff",
//       accent: "#F2C94C",
//       bg: "#0B1733",
//       surface: "#102347",
//       surfaceText: "#ffffff",
//       subtle: "#2C3F6B",
//       border: "#1E376B",
//       gold: "#F2C94C",
//       pop: "#E63946",
//     },
//   };
// };

// /****************************
//  * API CONFIG
//  ****************************/
// const API_BASE = "https://dev.kiraproject.id";
// const headers = { "X-Host": getXHostHeader(), "Cache-Control": "no-store" };

// const fetchGraduations = async () => {
//   const res = await fetch(`${API_BASE}/graduations`, { headers, cache: "no-store" });
//   if (!res.ok) throw new Error("Gagal memuat data kelulusan");
//   const json = await res.json();
//   if (!Array.isArray(json.data)) throw new Error("Data tidak valid");
//   return json.data;
// };

// /****************************
//  * UTILS
//  ****************************/
// const fmtDate = (d: string | Date) => new Intl.DateTimeFormat('id-ID', {
//   dateStyle: 'full',
//   timeStyle: 'short',
//   timeZone: 'Asia/Jakarta'
// }).format(new Date(d));

// const nowJakarta = () => new Date();

// const toHMS = (ms: number) => {
//   const s = Math.floor(ms / 1000);
//   const h = Math.floor(s / 3600).toString().padStart(2, '0');
//   const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
//   const sec = (s % 60).toString().padStart(2, '0');
//   return `${h}:${m}:${sec}`;
// };

// /****************************
//  * COMPONENTS
//  ****************************/
// const ResultCard = ({ res, onPrint }: { res: any; onPrint: () => void }) => {
//   if (!res) {
//     return (
//       <div className="rounded-2xl border p-6 text-center" style={{ borderColor: theme.border, background: 'black' }}>
//         <p className="text-sm" style={{ color: 'black' }}>
//           Masukkan <strong>NISN</strong> atau <strong>Nomor Peserta</strong> untuk melihat status kelulusan.
//         </p>
//       </div>
//     );
//   }

//   const pass = res.status?.toLowerCase() === 'lulus';

//   return (
//     <div className="rounded-2xl border overflow-hidden shadow-lg" style={{ borderColor: theme.border, background: 'black' }}>
//       <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: `1px solid ${theme.border}`, background: theme.type === 'SMKN' ? 'rgba(255,255,255,0.05)' : '#f1f5f9' }}>
//         <div className="font-semibold" style={{ color: 'black' }}>
//           Hasil Kelulusan — {res.tahun}
//         </div>
//         <div className="flex items-center gap-2">
//           <span
//             className="text-xs px-3 py-1 rounded-full border font-medium"
//             style={{
//               borderColor: pass ? theme.gold : theme.pop,
//               color: pass ? theme.gold : theme.pop,
//               background: pass ? `rgba(${theme.type === 'SMKN' ? '242,201,76' : '245,158,11'}, 0.1)` : `rgba(${theme.type === 'SMKN' ? '230,57,70' : '239,68,68'}, 0.1)`,
//             }}
//           >
//             {res.status}
//           </span>
//           <button
//             onClick={onPrint}
//             className="text-xs px-3 py-1 rounded-lg border transition-colors"
//             style={{ borderColor: theme.border, color: 'black', background: 'transparent' }}
//             onMouseEnter={(e) => e.currentTarget.style.background = theme.type === 'SMKN' ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}
//             onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
//           >
//             Cetak
//           </button>
//         </div>
//       </div>
//       <div className="p-5 grid sm:grid-cols-2 gap-4 text-sm" style={{ color: 'black' }}>
//         <div><span className="opacity-70 text-xs">Nama</span><div className="font-medium mt-1">{res.nama}</div></div>
//         <div><span className="opacity-70 text-xs">NISN</span><div className="font-mono mt-1">{res.nisn}</div></div>
//         <div><span className="opacity-70 text-xs">Nomor Peserta</span><div className="font-mono mt-1">{res.peserta}</div></div>
//         <div><span className="opacity-70 text-xs">Jurusan</span><div className="mt-1">{res.jurusan}</div></div>
//         <div><span className="opacity-70 text-xs">Kelas</span><div className="mt-1">{res.kelas}</div></div>
//         <div><span className="opacity-70 text-xs">Sekolah</span><div className="mt-1">{res.sekolah}</div></div>
//         <div className="sm:col-span-2"><span className="opacity-70 text-xs">Keterangan</span><div className="mt-1">{res.ket}</div></div>
//       </div>
//     </div>
//   );
// };

// /****************************
//  * KELULUSAN SECTION
//  ****************************/
// const KelulusanSection = () => {
//   const queryClient = useQueryClient();
//   const [mode, setMode] = useState<'nisn' | 'peserta'>('nisn');
//   const [q, setQ] = useState('');
//   const [jur, setJur] = useState('Semua');
//   const [yr, setYr] = useState('');
//   const [res, setRes] = useState<any>(null);
//   const [err, setErr] = useState('');
//   const [now, setNow] = useState(nowJakarta());
//   const [searchCount, setSearchCount] = useState(0);
//   const RATE_LIMIT_MS = 3 * 1000;
//   const RATE_MAX = 5;

//   const { data: gradData = [], isPending: loading, error } = useQuery({
//     queryKey: ['graduations'],
//     queryFn: fetchGraduations,
//     staleTime: 0,
//     gcTime: 0,
//   });

//   const KELULUSAN_PERIOD = {
//     start: new Date(school.kelulusanPeriod.start),
//     end: new Date(school.kelulusanPeriod.end)
//   };

//   const isOpen = now >= KELULUSAN_PERIOD.start && now <= KELULUSAN_PERIOD.end;
//   const opensInMs = Math.max(0, KELULUSAN_PERIOD.start.getTime() - now.getTime());
//   const closesInMs = Math.max(0, KELULUSAN_PERIOD.end.getTime() - now.getTime());

//   useEffect(() => {
//     const id = setInterval(() => setNow(nowJakarta()), 1000);
//     return () => clearInterval(id);
//   }, []);

//   useEffect(() => {
//     const last = Number(localStorage.getItem('kel_search_last') || '0');
//     const count = Number(localStorage.getItem('kel_search_count') || '0');
//     const now = Date.now();
//     if (now - last > RATE_LIMIT_MS) {
//       localStorage.setItem('kel_search_last', String(now));
//       localStorage.setItem('kel_search_count', '0');
//       setSearchCount(0);
//     } else {
//       setSearchCount(count);
//     }
//   }, []);

//   const incrementSearch = () => {
//     const now = Date.now();
//     let last = Number(localStorage.getItem('kel_search_last') || '0');
//     let count = Number(localStorage.getItem('kel_search_count') || '0');
//     if (now - last > RATE_LIMIT_MS) { last = now; count = 0; }
//     count += 1;
//     localStorage.setItem('kel_search_last', String(last));
//     localStorage.setItem('kel_search_count', String(count));
//     setSearchCount(count);
//   };

//   const JURUSAN = useMemo(() => ['Semua', ...new Set(gradData.map((d: any) => d.jurusan))], [gradData]);
//   const TAHUN = useMemo(() => [...new Set(gradData.map((d: any) => d.tahun))].sort((a: any, b: any) => b - a), [gradData]);

//   const filteredCount = useMemo(() =>
//     gradData.filter((d: any) => (jur === 'Semua' || d.jurusan === jur) && (!yr || d.tahun === Number(yr))).length,
//     [gradData, jur, yr]
//   );

//   const doSearch = () => {
//     setErr('');
//     setRes(null);

//     if (searchCount >= RATE_MAX) {
//       setErr('Terlalu sering. Tunggu 3 detik.');
//       return;
//     }

//     if (!isOpen) {
//       setErr('Pengumuman kelulusan belum dibuka.');
//       return;
//     }

//     const s = q.trim();
//     if (!s) {
//       setErr('Isi NISN atau Nomor Peserta');
//       return;
//     }

//     incrementSearch();

//     const key = mode === 'peserta' ? 'peserta' : 'nisn';
//     const r = gradData.find((x: any) =>
//       String(x[key]).replace(/\s|-/g, '').toLowerCase() === String(s).replace(/\s|-/g, '').toLowerCase()
//     );

//     if (!r) {
//       setErr('Data tidak ditemukan');
//       return;
//     }

//     if ((jur !== 'Semua' && r.jurusan !== jur) || (yr && r.tahun !== Number(yr))) {
//       setErr('Tidak sesuai filter jurusan/tahun');
//       return;
//     }

//     setRes(r);
//   };

//   const onPrint = () => {
//     window.print();
//   };

//   const handleViewClick = (item: any) => {
//     setMode('nisn');
//     setQ(item.nisn);
//     setJur(item.jurusan);
//     setYr(item.tahun.toString());
//     doSearch();
//   };

//   if (error) {
//     return (
//       <section id="kelulusan" className="py-16">
//         <div className="max-w-6xl mx-auto px-4 text-center">
//           <p className="text-sm" style={{ color: theme.pop }}>
//             Gagal memuat data. <button onClick={() => queryClient.invalidateQueries({ queryKey: ['graduations'] })} className="underline">Coba lagi</button>
//           </p>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section id="kelulusan" className="py-12 md:py-16">
//       <div className="max-w-6xl mx-auto px-4">
//         <div className="lg:flex items-start justify-between gap-6 mb-6">
//           <div>
//             <h2 className="text-2xl md:text-3xl font-bold" style={{ color: theme.gold }}>Pengumuman Kelulusan</h2>
//             <p className="text-xs lg:text-sm mt-1 opacity-85" style={{ color: 'black' }}>
//               Cek status kelulusan menggunakan <strong>NISN</strong> atau <strong>Nomor Peserta Ujian</strong>.
//             </p>
//           </div>
//           <div className="text-right text-xs lg:mt-0 mt-3" style={{ color: 'black' }}>
//             Total data: <strong>{gradData.length}</strong><br />
//             Dalam filter: <strong>{filteredCount}</strong>
//           </div>
//         </div>

//         {!isOpen && (
//           <div className="rounded-2xl border p-5 mb-6 text-center" style={{ borderColor: theme.border, background: theme.type === 'SMKN' ? 'rgba(255,255,255,0.05)' : '#fef3c7', color: 'black' }}>
//             <div className="font-medium mb-2">Pengumuman Kelulusan Belum Tersedia</div>
//             <div className="text-xs opacity-85">
//               Jadwal: <strong>{fmtDate(KELULUSAN_PERIOD.start)}</strong> s.d. <strong>{fmtDate(KELULUSAN_PERIOD.end)}</strong>
//             </div>
//             {opensInMs > 0 && (
//               <div className="text-xs mt-2 font-mono">
//                 Dibuka dalam: <span className="text-lg">{toHMS(opensInMs)}</span>
//               </div>
//             )}
//           </div>
//         )}

//         <div className="grid md:grid-cols-3 gap-4 mb-6" style={{ opacity: isOpen ? 1 : 0.5, pointerEvents: isOpen ? 'auto' : 'none' }}>
//           <div className="flex items-center gap-3 text-xs" style={{ color: 'black' }}>
//             <label className="flex items-center gap-1 cursor-pointer">
//               <input type="radio" checked={mode === 'nisn'} onChange={() => setMode('nisn')} className="w-4 h-4" />
//               NISN
//             </label>
//             <label className="flex items-center gap-1 cursor-pointer">
//               <input type="radio" checked={mode === 'peserta'} onChange={() => setMode('peserta')} className="w-4 h-4" />
//               Nomor Peserta
//             </label>
//           </div>
//           <div className="flex items-center gap-2">
//             <input
//               value={q}
//               onChange={(e) => setQ(e.target.value)}
//               onKeyDown={(e) => e.key === 'Enter' && doSearch()}
//               placeholder={mode === 'nisn' ? '1234567890' : '2024-001'}
//               className="flex-1 px-4 py-2.5 rounded-xl text-sm border focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
//               style={{ borderColor: theme.border, background: 'black', color: 'black' }}
//             />
//             <button
//               onClick={doSearch}
//               className="px-5 py-2.5 rounded-xl bg-white hover:brightness-95 border text-sm font-medium transition-all"
//               style={{ borderColor: theme.border, color: 'black'}}
//               // onMouseEnter={(e) => e.currentTarget.style.background = theme.gold + '20'}
//               // onMouseLeave={(e) => e.currentTarget.style.background = theme.type === 'SMKN' ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}
//             >
//               Cek
//             </button>
//           </div>
//           <div className="grid grid-cols-2 gap-2">
//             <select
//               value={jur}
//               onChange={(e) => setJur(e.target.value)}
//               className="px-3 py-2.5 rounded-xl text-sm border"
//               style={{ borderColor: theme.border, background: 'black', color: 'black' }}
//             >
//               {JURUSAN.map(j => <option key={j} value={j}>{j}</option>)}
//             </select>
//             <select
//               value={yr}
//               onChange={(e) => setYr(e.target.value)}
//               className="px-3 py-2.5 rounded-xl text-sm border"
//               style={{ borderColor: theme.border, background: 'black', color: 'black' }}
//             >
//               <option value="">Semua Tahun</option>
//               {TAHUN.map(t => <option key={t} value={t}>{t}</option>)}
//             </select>
//           </div>
//         </div>

//         {err && <div className="text-sm mb-4 p-3 rounded-lg" style={{ color: theme.pop, background: theme.type === 'SMKN' ? 'rgba(230,57,70,0.1)' : '#fee2e2' }}>{err}</div>}
//         {loading && <div className="text-sm mb-4" style={{ color: theme.muted }}>Memuat data kelulusan...</div>}

//         <ResultCard res={res} onPrint={onPrint} />

//         {gradData.length > 0 && (
//           <div className="mt-8">
//             <div className="text-xs mb-3 opacity-75" style={{ color: theme.muted }}>Ringkasan (sesuai filter):</div>
//             <div className="grid md:grid-cols-3 gap-4">
//               {gradData
//                 .filter((d: any) => (jur === 'Semua' || d.jurusan === jur) && (!yr || d.tahun === Number(yr)))
//                 .map((d: any) => (
//                   <div key={d.id} className="rounded-xl border p-4 text-sm transition-all hover:shadow-md" style={{ borderColor: theme.border, background: theme.type === 'SMKN' ? 'rgba(255,255,255,0.03)' : '#f8fafc', color: 'black' }}>
//                     <div className="font-medium">{d.nama}</div>
//                     <div className="text-xs opacity-70">{d.jurusan} · {d.tahun}</div>
//                     <div className="text-xs font-mono mt-1">NISN: {d.nisn}</div>
//                     <button
//                       onClick={() => handleViewClick(d)}
//                       className="mt-3 text-xs px-3 py-1.5 rounded-lg border w-full transition-colors"
//                       style={{ borderColor: theme.border, color: 'black', background: 'transparent' }}
//                       onMouseEnter={(e) => e.currentTarget.style.background = theme.type === 'SMKN' ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}
//                       onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
//                     >
//                       Lihat Detail
//                     </button>
//                   </div>
//                 ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// };

// /****************************
//  * MAIN PAGE
//  ****************************/
// let theme: any = {};
// let school: any = {};

// export default function KelulusanPage() {
//   school = getSchoolInfoFromDomain();
//   theme = school.theme;

//   useEffect(() => {
//     document.documentElement.style.setProperty("--brand-primary", theme.primary);
//     document.documentElement.style.setProperty("--brand-accent", theme.gold);
//     document.documentElement.style.setProperty("--brand-bg", theme.bg);
//     document.documentElement.style.setProperty("--brand-surface", 'black');
//   }, []);

//   return (
//     <div className="min-h-screen flex flex-col" style={{ background: theme.bg }}>
//       <NavbarComp theme={theme} />
//       <main className="flex-1">
//         <KelulusanSection />
//       </main>
//       <FooterComp theme={theme} />
//     </div>
//   );
// }


import { getXHostHeader } from "@/core/utils/XHostHeader";
import { FooterComp } from "@/features/_global/components/footer";
import NavbarComp from "@/features/_global/components/navbar";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

/****************************
 * HERO SECTION UNTUK KELULUSAN
 ****************************/
const HeroSection = () => {
  const scrollToKelulusan = () => {
    document.getElementById("kelulusan")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-[78vh] flex items-center justify-center z-[1] overflow-hidden">
      {/* Background Image - Representatif kelulusan / wisuda */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/gradd.jpg')`, // Ganti dengan foto wisuda/kelulusan jika ada
          backgroundPosition: "center 35%",
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

      {/* Content */}
      <div className="relative z-10 md:text-center text-left text-white px-6 max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          Pengumuman Kelulusan
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-2xl mb-12 max-w-3xl mx-auto opacity-95 drop-shadow-lg"
        >
          Cek status kelulusan siswa secara resmi dan real-time
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
          onClick={scrollToKelulusan}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-10 py-4 rounded-2xl bg-white text-gray-900 font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
        >
          Cek Kelulusan
        </motion.button>
      </div>
    </section>
  );
};

/****************************
 * DETEKSI SEKOLAH BERDASARKAN DOMAIN
 ****************************/
const getSchoolInfoFromDomain = () => {
  const host = typeof window !== "undefined" ? window.location.hostname : getXHostHeader();
  const domain = host?.toLowerCase().replace(/^https?:\/\//, "");

  // === SMKN 13 Jakarta ===
  if (
    domain === "smkn13jkt.kiraproject.id" ||
    domain === "smkn13jakarta.sch.id" ||  // TAMBAHAN
    domain === "localhost"
  ) {
    return {
      type: "SMKN",
      number: "13",
      city: "Jakarta",
      fullName: "SMKN 13 Jakarta",
      shortName: "SMKN 13",
      npsn: "20102234",
      email: "ppid@smkn13.sch.id",
      phone: "+62 21 1234567",
      hours: "07:00 – 15:00",
      kelulusanPeriod: { start: "2025-06-01T00:00:00+07:00", end: "2025-12-31T23:59:59+07:00" },
      theme: {
        name: "SMKN 13 Jakarta",
        primary: "#1F3B76",
        primaryText: "#ffffff",
        accent: "#F2C94C",
        bg: "#0B1733",
        surface: "#102347",
        surfaceText: "#ffffff",
        subtle: "#2C3F6B",
        border: "#1E376B",
        gold: "#F2C94C",
        pop: "#E63946",
      },
    };
  }

  // === SMAN dari .sch.id (new. atau tanpa new.) + jakarta.sch.id ===
  const smanMatch = domain?.match(/^(new\.)?sman(\d+)-jkt\.sch\.id$/) ||
                    domain?.match(/^sman(\d+)jakarta\.sch\.id$/); // TAMBAHAN

  if (smanMatch) {
    const number = smanMatch[2] || smanMatch[1]; // legacy: [2], jakarta: [1]
    const validNumbers = ["25", "65", "68", "78"];
    if (validNumbers.includes(number)) {
      const npsnMap: Record<string, string> = {
        "25": "20102235",
        "65": "20102236",
        "68": "20102237",
        "78": "20102238",
      };
      return {
        type: "SMAN",
        number,
        city: "Jakarta",
        fullName: `SMAN ${number} Jakarta`,
        shortName: `SMAN ${number}`,
        npsn: npsnMap[number],
        email: `ppid@sman${number}.sch.id`,
        phone: `+62 21 7654${number}`,
        hours: "07:00 – 14:00",
        kelulusanPeriod: { start: "2025-06-01T00:00:00+07:00", end: "2025-12-31T23:59:59+07:00" },
        theme: {
          name: `SMAN ${number} Jakarta`,
          primary: "#1F3B76",
          primaryText: "#ffffff",
          accent: "#F2C94C",
          bg: "#0B1733",
          surface: "#102347",
          surfaceText: "#ffffff",
          subtle: "#2C3F6B",
          border: "#1E376B",
          gold: "#F2C94C",
          pop: "#E63946",
        },
      };
    }
  }

  // === Fallback Default (SMAN 1 Jakarta) ===
  return {
    type: "SMAN",
    number: "1",
    city: "Jakarta",
    fullName: "SMAN 1 Jakarta",
    shortName: "SMAN 1",
    npsn: "20102239",
    email: "ppid@sman1.sch.id",
    phone: "+62 21 1111111",
    hours: "07:00 – 14:00",
    kelulusanPeriod: { start: "2025-06-01T00:00:00+07:00", end: "2025-12-31T23:59:59+07:00" },
    theme: {
      name: "Default",
      primary: "#1F3B76",
      primaryText: "#ffffff",
      accent: "#F2C94C",
      bg: "#0B1733",
      surface: "#102347",
      surfaceText: "#ffffff",
      subtle: "#2C3F6B",
      border: "#1E376B",
      gold: "#F2C94C",
      pop: "#E63946",
    },
  };
};

/****************************
 * API CONFIG
 ****************************/
const API_BASE = "https://dev.kiraproject.id";
const headers = { "X-Host": getXHostHeader(), "Cache-Control": "no-store" };

const fetchGraduations = async () => {
  const res = await fetch(`${API_BASE}/graduations`, { headers, cache: "no-store" });
  if (!res.ok) throw new Error("Gagal memuat data kelulusan");
  const json = await res.json();
  if (!Array.isArray(json.data)) throw new Error("Data tidak valid");
  return json.data;
};

/****************************
 * UTILS
 ****************************/
const fmtDate = (d: string | Date) => new Intl.DateTimeFormat('id-ID', {
  dateStyle: 'full',
  timeStyle: 'short',
  timeZone: 'Asia/Jakarta'
}).format(new Date(d));

const nowJakarta = () => new Date();

const toHMS = (ms: number) => {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600).toString().padStart(2, '0');
  const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${h}:${m}:${sec}`;
};

/****************************
 * COMPONENTS
 ****************************/
const ResultCard = ({ res, onPrint }: { res: any; onPrint: () => void }) => {
  if (!res) {
    return (
      <div className="rounded-2xl border p-6 text-center bg-blue-200" style={{ borderColor: theme.border}}>
        <p className="text-sm text-blue-700">
          Masukkan <strong>NISN</strong> atau <strong>Nomor Peserta</strong> untuk melihat status kelulusan.
        </p>
      </div>
    );
  }

  const pass = res.status?.toLowerCase() === 'lulus';

  return (
    <div className="rounded-2xl border overflow-hidden shadow-lg" style={{ borderColor: theme.border, background: 'black' }}>
      <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: `1px solid ${theme.border}`, background: theme.type === 'SMKN' ? 'rgba(255,255,255,0.05)' : '#f1f5f9' }}>
        <div className="font-semibold" style={{ color: 'black' }}>
          Hasil Kelulusan — {res.tahun}
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-xs px-3 py-1 rounded-full border font-medium"
            style={{
              borderColor: pass ? theme.gold : theme.pop,
              color: pass ? theme.gold : theme.pop,
              background: pass ? `rgba(${theme.type === 'SMKN' ? '242,201,76' : '245,158,11'}, 0.1)` : `rgba(${theme.type === 'SMKN' ? '230,57,70' : '239,68,68'}, 0.1)`,
            }}
          >
            {res.status}
          </span>
          <button
            onClick={onPrint}
            className="text-xs px-3 py-1 rounded-lg border transition-colors"
            style={{ borderColor: theme.border, color: 'black', background: 'transparent' }}
            onMouseEnter={(e) => e.currentTarget.style.background = theme.type === 'SMKN' ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            Cetak
          </button>
        </div>
      </div>
      <div className="p-5 grid sm:grid-cols-2 gap-4 text-sm" style={{ color: 'black' }}>
        <div><span className="opacity-70 text-xs">Nama</span><div className="font-medium mt-1">{res.nama}</div></div>
        <div><span className="opacity-70 text-xs">NISN</span><div className="font-mono mt-1">{res.nisn}</div></div>
        <div><span className="opacity-70 text-xs">Nomor Peserta</span><div className="font-mono mt-1">{res.peserta}</div></div>
        <div><span className="opacity-70 text-xs">Jurusan</span><div className="mt-1">{res.jurusan}</div></div>
        <div><span className="opacity-70 text-xs">Kelas</span><div className="mt-1">{res.kelas}</div></div>
        <div><span className="opacity-70 text-xs">Sekolah</span><div className="mt-1">{res.sekolah}</div></div>
        <div className="sm:col-span-2"><span className="opacity-70 text-xs">Keterangan</span><div className="mt-1">{res.ket}</div></div>
      </div>
    </div>
  );
};

/****************************
 * KELULUSAN SECTION
 ****************************/
const KelulusanSection = () => {
  const queryClient = useQueryClient();
  const [mode, setMode] = useState<'nisn' | 'peserta'>('nisn');
  const [q, setQ] = useState('');
  const [jur, setJur] = useState('Semua');
  const [yr, setYr] = useState('');
  const [res, setRes] = useState<any>(null);
  const [err, setErr] = useState('');
  const [now, setNow] = useState(nowJakarta());
  const [searchCount, setSearchCount] = useState(0);
  const RATE_LIMIT_MS = 3 * 1000;
  const RATE_MAX = 5;

  const { data: gradData = [], isPending: loading, error } = useQuery({
    queryKey: ['graduations'],
    queryFn: fetchGraduations,
    staleTime: 0,
    gcTime: 0,
  });

  const KELULUSAN_PERIOD = {
    start: new Date(school.kelulusanPeriod.start),
    end: new Date(school.kelulusanPeriod.end)
  };

  const isOpen = now >= KELULUSAN_PERIOD.start && now <= KELULUSAN_PERIOD.end;
  const opensInMs = Math.max(0, KELULUSAN_PERIOD.start.getTime() - now.getTime());
  const closesInMs = Math.max(0, KELULUSAN_PERIOD.end.getTime() - now.getTime());

  useEffect(() => {
    const id = setInterval(() => setNow(nowJakarta()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const last = Number(localStorage.getItem('kel_search_last') || '0');
    const count = Number(localStorage.getItem('kel_search_count') || '0');
    const now = Date.now();
    if (now - last > RATE_LIMIT_MS) {
      localStorage.setItem('kel_search_last', String(now));
      localStorage.setItem('kel_search_count', '0');
      setSearchCount(0);
    } else {
      setSearchCount(count);
    }
  }, []);

  const incrementSearch = () => {
    const now = Date.now();
    let last = Number(localStorage.getItem('kel_search_last') || '0');
    let count = Number(localStorage.getItem('kel_search_count') || '0');
    if (now - last > RATE_LIMIT_MS) { last = now; count = 0; }
    count += 1;
    localStorage.setItem('kel_search_last', String(last));
    localStorage.setItem('kel_search_count', String(count));
    setSearchCount(count);
  };

  const JURUSAN = useMemo(() => ['Semua', ...new Set(gradData.map((d: any) => d.jurusan))], [gradData]);
  const TAHUN = useMemo(() => [...new Set(gradData.map((d: any) => d.tahun))].sort((a: any, b: any) => b - a), [gradData]);

  const filteredCount = useMemo(() =>
    gradData.filter((d: any) => (jur === 'Semua' || d.jurusan === jur) && (!yr || d.tahun === Number(yr))).length,
    [gradData, jur, yr]
  );

  const doSearch = () => {
    setErr('');
    setRes(null);

    if (searchCount >= RATE_MAX) {
      setErr('Terlalu sering. Tunggu 3 detik.');
      return;
    }

    if (!isOpen) {
      setErr('Pengumuman kelulusan belum dibuka.');
      return;
    }

    const s = q.trim();
    if (!s) {
      setErr('Isi NISN atau Nomor Peserta');
      return;
    }

    incrementSearch();

    const key = mode === 'peserta' ? 'peserta' : 'nisn';
    const r = gradData.find((x: any) =>
      String(x[key]).replace(/\s|-/g, '').toLowerCase() === String(s).replace(/\s|-/g, '').toLowerCase()
    );

    if (!r) {
      setErr('Data tidak ditemukan');
      return;
    }

    if ((jur !== 'Semua' && r.jurusan !== jur) || (yr && r.tahun !== Number(yr))) {
      setErr('Tidak sesuai filter jurusan/tahun');
      return;
    }

    setRes(r);
  };

  const onPrint = () => {
    window.print();
  };

  const handleViewClick = (item: any) => {
    setMode('nisn');
    setQ(item.nisn);
    setJur(item.jurusan);
    setYr(item.tahun.toString());
    doSearch();
  };

  if (error) {
    return (
      <section id="kelulusan" className="py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm" style={{ color: theme.pop }}>
            Gagal memuat data. <button onClick={() => queryClient.invalidateQueries({ queryKey: ['graduations'] })} className="underline">Coba lagi</button>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="kelulusan" className="py-12 md:py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="lg:flex items-start justify-between gap-6 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: 'black' }}>Pengumuman Kelulusan</h2>
            <p className="text-xs lg:text-sm mt-1 opacity-85" style={{ color: 'black' }}>
              Cek status kelulusan menggunakan <strong>NISN</strong> atau <strong>Nomor Peserta Ujian</strong>.
            </p>
          </div>
          <div className="text-right text-xs lg:mt-0 mt-3" style={{ color: 'black' }}>
            Total data: <strong>{gradData.length}</strong><br />
            Dalam filter: <strong>{filteredCount}</strong>
          </div>
        </div>

        {!isOpen && (
          <div className="rounded-2xl border p-5 mb-6 text-center" style={{ borderColor: theme.border, background: theme.type === 'SMKN' ? 'rgba(255,255,255,0.05)' : '#fef3c7', color: 'black' }}>
            <div className="font-medium my-2">Pengumuman Kelulusan Belum Tersedia</div>
            {/* <div className="text-xs opacity-85">
              Jadwal: <strong>{fmtDate(KELULUSAN_PERIOD.start)}</strong> s.d. <strong>{fmtDate(KELULUSAN_PERIOD.end)}</strong>
            </div> */}
            {opensInMs > 0 && (
              <div className="text-xs mt-2 font-mono">
                Dibuka dalam: <span className="text-lg">{toHMS(opensInMs)}</span>
              </div>
            )}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-4 mb-6 z-[3333]" style={{ opacity: isOpen ? 1 : 0.5, pointerEvents: isOpen ? 'auto' : 'none' }}>
          <div className="flex items-center gap-3 text-xs" style={{ color: 'black' }}>
            <label className="flex items-center gap-1 text-black cursor-pointer">
              <input type="radio" checked={mode === 'nisn'} onChange={() => setMode('nisn')} className="w-4 h-4" />
              NISN
            </label>
            <label className="flex items-center gap-1 text-black cursor-pointer">
              <input type="radio" checked={mode === 'peserta'} onChange={() => setMode('peserta')} className="w-4 h-4" />
              Nomor Peserta
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && doSearch()}
              placeholder={mode === 'nisn' ? '1234567890' : '2024-001'}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm border focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
              style={{ borderColor: theme.border, background: 'black', color: 'white' }}
            />
            <button
              onClick={doSearch}
              className="px-5 py-2.5 rounded-xl bg-white hover:brightness-95 border text-sm font-medium transition-all"
              style={{ borderColor: theme.border, color: 'black'}}
            >
              Cek
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <select
              value={jur}
              onChange={(e) => setJur(e.target.value)}
              className="px-3 py-2.5 rounded-xl text-sm border"
              style={{ borderColor: theme.border, background: 'black', color: 'white' }}
            >
              {JURUSAN.map(j => <option key={j} value={j}>{j}</option>)}
            </select>
            <select
              value={yr}
              onChange={(e) => setYr(e.target.value)}
              className="px-3 py-2.5 rounded-xl text-sm border"
              style={{ borderColor: theme.border, background: 'black', color: 'white' }}
            >
              <option value="">Semua Tahun</option>
              {TAHUN.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {err && <div className="text-sm mb-4 p-3 rounded-lg" style={{ color: theme.pop, background: theme.type === 'SMKN' ? 'rgba(230,57,70,0.1)' : '#fee2e2' }}>{err}</div>}
        {loading && <div className="text-sm mb-4" style={{ color: theme.muted }}>Memuat data kelulusan...</div>}

        <ResultCard res={res} onPrint={onPrint} />

        {gradData.length > 0 && (
          <div className="mt-8">
            <div className="text-xs mb-3 opacity-75" style={{ color: theme.muted }}>Ringkasan (sesuai filter):</div>
            <div className="grid md:grid-cols-3 gap-4">
              {gradData
                .filter((d: any) => (jur === 'Semua' || d.jurusan === jur) && (!yr || d.tahun === Number(yr)))
                .map((d: any) => (
                  <div key={d.id} className="rounded-xl border p-4 text-sm transition-all hover:shadow-md" style={{ borderColor: theme.border, background: theme.type === 'SMKN' ? 'rgba(255,255,255,0.03)' : '#f8fafc', color: 'black' }}>
                    <div className="font-medium">{d.nama}</div>
                    <div className="text-xs opacity-70">{d.jurusan} · {d.tahun}</div>
                    <div className="text-xs font-mono mt-1">NISN: {d.nisn}</div>
                    <button
                      onClick={() => handleViewClick(d)}
                      className="mt-3 text-xs px-3 py-1.5 rounded-lg border w-full transition-colors"
                      style={{ borderColor: theme.border, color: 'black', background: 'transparent' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = theme.type === 'SMKN' ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      Lihat Detail
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

/****************************
 * MAIN PAGE DENGAN HERO
 ****************************/
let theme: any = {};
let school: any = {};

export default function KelulusanPage() {
  school = getSchoolInfoFromDomain();
  theme = school.theme;

  useEffect(() => {
    document.documentElement.style.setProperty("--brand-primary", theme.primary);
    document.documentElement.style.setProperty("--brand-accent", theme.gold);
    document.documentElement.style.setProperty("--brand-bg", theme.bg);
    document.documentElement.style.setProperty("--brand-surface", 'black');
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavbarComp theme={theme} />

      {/* HERO SECTION BARU */}
      <HeroSection />

      <main className="flex-1">
        <KelulusanSection />
      </main>

      <FooterComp theme={theme} />
    </div>
  );
}
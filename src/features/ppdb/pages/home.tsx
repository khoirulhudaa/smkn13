import { HeroComp } from "@/features/_global/components/hero";
import NavbarComp from "@/features/_global/components/navbar";
import { getSchoolId } from "@/features/_global/hooks/getSchoolId";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  FolderSearch,
  Info,
  Loader2,
  Mail,
  MapPinned // Icon baru untuk Jalur
  ,

  Phone,
  ShieldCheck
} from "lucide-react";
import { useEffect, useState } from "react";

const BASE_URL = "https://be-school.kiraproject.id/ppdb";
const SCHOOL_ID = getSchoolId();

// ──────────────────────────────────────────────────────────────
// Komponen UI Premium
// ──────────────────────────────────────────────────────────────

const BentoCard = ({ children, className = "", delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    // whileHover={{ y: -5 }}
    className={`bg-white rounded-[2.5rem] border border-gray-300 shadow-xl shadow-blue-900/5 p-6 md:p-8 relative overflow-hidden group ${className}`}
  >
    {children}
  </motion.div>
);

const SectionHeader = ({ title, subtitle, icon: Icon }: any) => (
  <div className="flex flex-col gap-2 mb-8">
    <div className="flex items-center gap-3 text-blue-700 uppercase tracking-[0.2em] text-xs font-black">
      <div className="p-2 bg-blue-50 rounded-lg">
        <Icon size={18} />
      </div>
      {subtitle}
    </div>
    <h3 className="text-2xl md:text-3xl font-[900] text-slate-900 tracking-tight">{title}</h3>
  </div>
);

// ──────────────────────────────────────────────────────────────
// Main Page
// ──────────────────────────────────────────────────────────────

export default function PPDBPage() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPPDBConfig = async () => {
      try {
        setLoading(true);
        // Menambahkan cache: "no-store" untuk mencegah Too Many Requests dari sisi caching browser yang agresif
        const res = await fetch(`${BASE_URL}?schoolId=${SCHOOL_ID}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        if (!res.ok) throw new Error(`Gagal memuat data (HTTP ${res.status})`);
        const json = await res.json();

        if (json.success && json.data?.length > 0) {
          setConfig(json.data[0]);
        } else {
          setConfig(null);
        }
      } catch (err: any) {
        console.log('err', err.message)
        setError(err.message || "Gagal memuat informasi PPDB");
      } finally {
        setLoading(false);
      }
    };
    if (SCHOOL_ID) fetchPPDBConfig();
  }, []);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric", month: "long", year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8faff]">
        <Loader2 className="h-12 w-12 animate-spin text-blue-700 mb-4" />
        <p className="text-blue-900/50 font-bold tracking-widest uppercase text-xs">Menyiapkan Informasi...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8faff] text-slate-900 font-sans">
      <NavbarComp />
      <HeroComp titleProps={`Portal PPDB ${config?.year || ''}`} id="#ppdb" />

      <section id="ppdb" className="py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-100/30 rounded-full blur-[100px] -z-10" />

        <div className="max-w-7xl mx-auto px-4">
          <AnimatePresence mode="wait">
            {error ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-white border-2 border-red-50 p-16 rounded-[3rem] text-center shadow-2xl shadow-red-500/10"
              >
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-6" />
                <h2 className="text-3xl font-black text-slate-900 mb-2">Terjadi Gangguan</h2>
                <p className="text-slate-500">{error}</p>
              </motion.div>
            ) : !config ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-blue-100 p-20 rounded-[4rem] text-center shadow-2xl shadow-blue-900/5"
              >
                <FolderSearch className="h-12 w-12 text-blue-700 mx-auto mb-8 animate-bounce" />
                <h2 className="text-4xl font-[900] text-slate-900 mb-4 tracking-tight">Belum Ada Informasi</h2>
                <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
                  Pendaftaran untuk tahun ajaran baru belum dibuka.
                </p>
              </motion.div>
            ) : (
              <div className="space-y-8">
                
                {/* ─── Row 1: Header & Quota ─── */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <BentoCard className="md:col-span-10 flex flex-col justify-center">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div>
                        <div className="flex items-center gap-2 text-blue-700 font-black text-xs uppercase tracking-widest mb-3">
                          <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                          Pendaftaran Aktif
                        </div>
                        <h1 className="text-4xl md:text-5xl font-[900] text-slate-900 tracking-tighter">
                          PPDB - <span className="text-blue-700">{config.year}</span>
                        </h1>
                      </div>
                      <div className="bg-blue-50 border border-blue-900/10 p-6 rounded-[2rem]">
                        <p className="text-blue-900/40 font-bold text-[10px] uppercase tracking-widest mb-1">Periode</p>
                        <p className="text-blue-700 font-black text-sm md:text-base">
                          {formatDate(config.startDate)} — {formatDate(config.endDate)}
                        </p>
                      </div>
                    </div>
                  </BentoCard>

                  <BentoCard className="md:col-span-2 bg-blue-600 text-slate-900">
                    <div className="relative z-10 flex flex-col h-full justify-between">
                      <p className="text-slate-900 font-bold uppercase tracking-widest text-xs">Total Kuota</p>
                      <div>
                        <h4 className="text-6xl font-black text-slate-900">{config.quota || "∞"}</h4>
                      </div>
                    </div>
                  </BentoCard>
                </div>

                {/* ─── Row 2: Jalur Pendaftaran (NEW SECTION) ─── */}
                <BentoCard className="border-blue-100">
                  <SectionHeader title="Jalur Pendaftaran" subtitle="Admission Paths" icon={MapPinned} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {config.admissionPaths && config.admissionPaths.length > 0 ? (
                      config.admissionPaths.map((path: any, i: number) => (
                        <motion.div 
                          key={i}
                          whileHover={{ scale: 1.02 }}
                          className="p-6 rounded-[2rem] bg-slate-50 border border-slate-300 flex flex-col h-full"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <h5 className="text-lg font-black text-slate-900">{path.name}</h5>
                            <span className="bg-blue-100 text-blue-700 text-[14px] px-3 py-1 rounded-full font-black uppercase">
                              {path.quota}
                            </span>
                          </div>
                          <p className="text-slate-500 text-sm leading-loose">
                            {path.description || "Tidak ada deskripsi spesifik untuk jalur ini."}
                          </p>
                        </motion.div>
                      ))
                    ) : (
                      <p className="col-span-full text-center text-slate-400 italic py-4">Informasi jalur pendaftaran belum tersedia.</p>
                    )}
                  </div>
                </BentoCard>

                {/* ─── Row 3: Description & Contacts ─── */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <BentoCard className="md:col-span-8">
                    <SectionHeader title="Deskripsi Kegiatan" subtitle="Information" icon={Info} />
                    <p className="text-slate-600 leading-loose text-md whitespace-pre-line">
                      {config.description || "Belum ada deskripsi mendalam mengenai pendaftaran tahun ini."}
                    </p>
                  </BentoCard>

                  <div className="md:col-span-4 flex flex-col gap-6">
                    <BentoCard className="bg-slate-900 text-slate-900 h-full">
                      <Phone className="text-blue-500 mb-6" size={32} />
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Hubungi Kami</p>
                      <h4 className="text-xl font-bold text-slate-900">{config.contactPhone || "—"}</h4>
                    </BentoCard>

                    <BentoCard className="h-full border-blue-100">
                      <Mail className="text-blue-600 mb-6" size={32} />
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Official Email</p>
                      <h4 className="text-xl font-bold text-slate-900 truncate">{config.contactEmail || "—"}</h4>
                    </BentoCard>
                  </div>
                </div>

                {/* ─── Row 4: Requirements ─── */}
                <BentoCard className="bg-white border-blue-100">
                  <div className="flex flex-col md:flex-row gap-12">
                    <div className="md:w-1/3">
                      <SectionHeader title="Syarat & Ketentuan" subtitle="Requirement" icon={ShieldCheck} />
                      <p className="text-slate-500 text-sm leading-relaxed">
                        Siapkan dokumen asli untuk proses verifikasi data setelah melakukan pendaftaran online.
                      </p>
                    </div>
                    <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {config.requirements?.map((req: string, i: number) => (
                        <div key={i} className="group flex items-center gap-4 p-5 rounded-2xl bg-blue-50/50 border border-blue-900/10 transition-all group">
                          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-xs shadow-sm">
                            {i + 1}
                          </div>
                          <span className="font-bold text-sm text-slate-900 leading-tight">{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </BentoCard>

              </div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
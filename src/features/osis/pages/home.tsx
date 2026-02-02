import { SMAN25_CONFIG } from "@/core/theme";
import { FooterComp } from "@/features/_global/components/footer";
import { HeroComp } from "@/features/_global/components/hero";
import NavbarComp from "@/features/_global/components/navbar";
import { getSchoolId } from "@/features/_global/hooks/getSchoolId";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { 
  Users, 
  Target, 
  Trophy, 
  ChevronRight, 
  Mail, 
  Phone, 
  X, 
  CheckCircle2, 
  Loader2,
  Award
} from "lucide-react";

// ──────────────────────────────────────────────────────────────
// Sub-Components Premium
// ──────────────────────────────────────────────────────────────

const GlassCard = ({ children, className = "" }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`bg-white rounded-[2rem] border border-gray-300 shadow-xl shadow-blue-900/5 p-8 ${className}`}
  >
    {children}
  </motion.div>
);

const SectionHeader = ({ title, subtitle, icon: Icon }: any) => (
  <div className="flex flex-col mb-12">
    <div className="flex items-center gap-3 text-blue-600 font-black text-xs uppercase tracking-[0.3em] mb-4">
      <div className="p-2.5 bg-blue-50 rounded-xl border border-gray-300">
        <Icon size={18} />
      </div>
      {subtitle}
    </div>
    <h2 className="text-2xl md:text-4xl italic font-[900] text-slate-900 tracking-tighter leading-none">
      {title}
    </h2>
  </div>
);

// ──────────────────────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────────────────────

const OsisPage = () => {
  const schoolInfo = SMAN25_CONFIG;
  const schoolId = getSchoolId();

  const [apiData, setApiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formMsg, setFormMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`https://be-school.kiraproject.id/osis?schoolId=${schoolId}`);
        const result = await res.json();
        if (result.success) setApiData(result.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [schoolId]);

  const struktur = apiData ? [
    { jabatan: "Ketua OSIS", nama: apiData.ketuaNama, foto: apiData.ketuaFotoUrl, nip: apiData.ketuaNipNuptk },
    { jabatan: "Wakil Ketua", nama: apiData.wakilNama, foto: apiData.wakilFotoUrl, nip: apiData.wakilNipNuptk },
    { jabatan: "Sekretaris", nama: apiData.sekretarisNama, foto: apiData.sekretarisFotoUrl, nip: apiData.sekretarisNipNuptk },
    { jabatan: "Bendahara", nama: apiData.bendaharaNama, foto: apiData.bendaharaFotoUrl, nip: apiData.bendaharaNipNuptk },
  ] : [];

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
      <p className="text-slate-400 font-black text-[10px] tracking-widest uppercase">Sinkronisasi Struktur...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 font-sans">
      <NavbarComp theme={schoolInfo.theme} />
      <HeroComp titleProps="Struktur - OSIS" id="#content" />

      <main id="content" className="relative pb-24">
        {/* Background Decorative */}
        <div className="absolute top-0 right-0 w-1/2 h-[600px] bg-blue-50/50 rounded-full blur-[120px] -z-10 translate-x-1/3" />

        <div className="max-w-7xl mx-auto px-6">
          
          {/* 1. STRUKTUR ORGANISASI */}
          <section className="py-20">
            <SectionHeader title="Struktur Utama" subtitle="Leadership Team" icon={Users} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {struktur.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-[2.5rem] bg-white border p-6 shadow-xl shadow-blue-900/5 border-blue-400 transition-all duration-500">
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div className="w-32 h-32 rounded-[2rem] overflow-hidden mb-6 border-4 border-blue-50 shadow-inner group-hover:scale-105 transition-transform duration-500">
                        <img 
                          src={s.foto || '/defaultProfile.png'} 
                          alt={s.nama} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-2">
                        {s.jabatan}
                      </span>
                      <h4 className="text-lg font-bold text-slate-900 leading-tight mb-1 italic">
                        {s.nama || "—"}
                      </h4>
                      <p className="text-xs text-slate-400 font-medium">
                        ID: {s.nip || "S-2024-XXX"}
                      </p>
                    </div>
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 p-4 transition-opacity">
                      <CheckCircle2 size={40} className="text-blue-600" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* 2. VISI & MISI */}
          <section className="py-12 border-t border-slate-100">
            <div className="grid lg:grid-cols-1 gap-16 items-start">
              <div>
                <SectionHeader title="Visi & Misi" subtitle="Our Blueprint" icon={Target} />
                <p className="text-slate-500 text-lg leading-relaxed">
                  Membangun sinergi antar siswa untuk mewujudkan lingkungan sekolah yang inovatif, religius, dan berprestasi.
                </p>
              </div>

              <div className="space-y-6">
                <GlassCard className="border-l-4 border-l-blue-600">
                  <h4 className="text-blue-600 font-black text-xs uppercase tracking-widest mb-4">The Vision</h4>
                  <p className="text-2xl font-black text-slate-900 italic tracking-tighter leading-tight">
                    "{apiData?.visi || "Menciptakan ekosistem siswa yang progresif dan berintegritas tinggi."}"
                  </p>
                </GlassCard>
                
                <div className="grid grid-cosl-1 md:grid-cols-2 gap-4">
                  {apiData?.misi?.map((m: string, i: number) => (
                    <div key={i} className="flex gap-4 p-5 rounded-3xl bg-blue-50/50 border border-gray-300">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black">
                        {i + 1}
                      </div>
                      <p className="font-bold text-slate-700 leading-relaxed">{m}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 3. PRESTASI */}
          <section className="pt-12 pb-7 border-t border-slate-100">
            <SectionHeader title="Pencapaian" subtitle="Hall of Fame" icon={Award} />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apiData?.prestasiSaatIni?.length > 0 ? apiData.prestasiSaatIni.map((p: any, i: number) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5 }}
                  className="p-8 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden group shadow-2xl shadow-slate-200"
                >
                  <Trophy className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                  <div className="relative z-10">
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-600 text-[10px] font-black uppercase mb-4">
                      Tahun {p.tahun}
                    </span>
                    <h5 className="text-xl font-black mb-3 w-full truncate leading-snug">{p.judul}</h5>
                    <p className="text-slate-400 text-sm leading-relaxed">{p.deskripsi}</p>
                  </div>
                </motion.div>
              )) : (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-[3rem]">
                  <p className="text-slate-400 font-bold italic">Belum ada data prestasi yang dirilis.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* 4. MODAL FORM - PREMIUM DESIGN */}
      <AnimatePresence>
        {formOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setFormOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10 md:p-14">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic">Join the Force.</h3>
                    <p className="text-slate-500 font-medium">Daftarkan dirimu untuk menjadi bagian dari OSIS.</p>
                  </div>
                  <button onClick={() => setFormOpen(false)} className="p-3 bg-slate-50 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setFormMsg("Pendaftaran Berhasil!")}}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Nama Lengkap</label>
                      <input type="text" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-blue-500 focus:bg-white outline-none transition-all font-bold" placeholder="Input Nama" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Kelas</label>
                      <input type="text" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-blue-500 focus:bg-white outline-none transition-all font-bold" placeholder="X / XI / XII" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Alasan Bergabung</label>
                    <textarea rows={3} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-blue-500 focus:bg-white outline-none transition-all font-bold resize-none" placeholder="Apa motivasimu?" />
                  </div>
                  
                  {formMsg && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-green-50 text-green-600 rounded-2xl text-center font-bold">
                      {formMsg}
                    </motion.div>
                  )}

                  <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black shadow-xl shadow-blue-600/30 hover:bg-slate-900 transition-all uppercase tracking-widest">
                    Kirim Form Pendaftaran
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <FooterComp />
    </div>
  );
};

export default OsisPage;
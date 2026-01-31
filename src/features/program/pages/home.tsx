import { SMAN25_CONFIG } from "@/core/theme";
import { FooterComp } from "@/features/_global/components/footer";
import { HeroComp } from "@/features/_global/components/hero";
import NavbarComp from "@/features/_global/components/navbar";
import { getSchoolId } from "@/features/_global/hooks/getSchoolId";
import axios from "axios";
import { motion } from "framer-motion";
import { Sparkles, Target } from "lucide-react";
import { useEffect, useState } from "react";

const BASE_URL = "https://be-school.kiraproject.id";

const ProgramSekolahPage = () => {
  const schoolInfo = SMAN25_CONFIG;
  const theme = schoolInfo.theme;

  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/program`, {
          params: { schoolId: getSchoolId() },
        });

        if (response.data.success) {
          setPrograms(response.data.data);
        } else {
          setError(response.data.message || "Gagal memuat program");
        }
      } catch (err) {
        setError("Terjadi kesalahan saat mengambil data program");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);


  console.log(programs)
  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      <NavbarComp theme={theme} />

      {/* HERO SECTION */}
      <HeroComp titleProps="Program Sekolah" id="#program" />

        {/* KONTEN UTAMA */}
      <section id="program" className="py-16 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
            <div className="absolute top-20 right-[-10%] w-[500px] h-[500px] bg-blue-50 rounded-full blur-[120px] opacity-60" />
            <div className="absolute bottom-20 left-[-10%] w-[400px] h-[400px] bg-indigo-50 rounded-full blur-[100px] opacity-60" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-[2]">
          
          {/* Header Branding */}
          <div className="max-w-7xl mb-20">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="w-12 h-[2px] bg-blue-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600/60">Educational Excellence</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.8] mb-8"
            >
              Program <span className="text-blue-600">Unggulan</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-md w-full md:text-lg text-slate-500 font-medium leading-relaxed"
            >
              {programs?.[0]?.mainDescription || 'Belum tersedia'}
            </motion.p>
          </div>

          {/* Program Items Grid */}
          {loading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-80 bg-white rounded-[2.5rem] animate-pulse shadow-sm border border-slate-100" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 font-bold">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {programs?.[0]?.items.map((program, index) => (
                <motion.div
                  key={program.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="group relative bg-white p-10 rounded-[3rem] border border-gray-900/20 shadow-[0_10px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col justify-between overflow-hidden"
                >
                  {/* Decorative number on background */}
                  <span className="absolute top-10 right-10 text-8xl font-black text-slate-50 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                    0{index + 1}
                  </span>

                  <div>
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 bg-blue-600 text-white transition-colors duration-500">
                      {index % 3 === 0 ? <Sparkles size={28} /> : index % 3 === 1 ? <Target size={28} /> : <BookOpen size={28} />}
                    </div>

                    <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-tight mb-4 text-black transition-colors">
                      {program.title || 'Program Unggulan'}
                    </h3>

                    <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
                      {program.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Section Footer */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-24 p-12 bg-slate-900 rounded-[3rem] relative overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8"
          >
             <div className="relative z-10">
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2">Kurikulum Merdeka</h2>
                <p className="text-slate-400 text-sm max-w-md font-medium">Implementasi kurikulum terbaru untuk kebebasan belajar dan eksplorasi minat siswa secara mendalam.</p>
             </div>
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[80px]" />
          </motion.div>
        </div>
      </section>


      <FooterComp />
    </div>
  );
};

export default ProgramSekolahPage;
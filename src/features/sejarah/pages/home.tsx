import { SMAN25_CONFIG } from "@/core/theme";
import { FooterComp } from "@/features/_global/components/footer";
import { HeroComp } from "@/features/_global/components/hero";
import NavbarComp from "@/features/_global/components/navbar";
import { getSchoolId } from "@/features/_global/hooks/getSchoolId";
import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const Section = ({ children }: { children: React.ReactNode }) => (
  <section className="py-12 md:py-16">
    <div className="max-w-7xl mx-auto px-4 md:px-4">{children}</div>
  </section>
);

const ScrollProgress = ({ theme }: { theme: any }) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  return <motion.div style={{ scaleX, transformOrigin: "0% 50%", background: theme.accent }} className="fixed left-0 right-0 top-0 h-1 z-[60]" />;
};

const Counter: React.FC<{ to: number }> = ({ to }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (to === 0) return;
    let current = 0;
    const duration = 2000;
    const step = to / 60;
    const interval = setInterval(() => {
      current += step;
      if (current >= to) {
        setCount(to);
        clearInterval(interval);
      } else {
        setCount(Math.round(current));
      }
    }, duration / 60);
    return () => clearInterval(interval);
  }, [to]);
  return <span>{count}</span>;
};

const HeroSejarah: React.FC<{ theme: any; data: any }> = ({ theme, data }) => {
  return (
    <section id="sejarah" className="pt-16 pb-4 relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="gap-12 flex flex-col justify-center items-center text-clip">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="w-full text-left"
          >
            <span className="text-blue-600 font-bold tracking-widest uppercase text-sm">Legacy</span>
            <h2 className="text-3xl italic md:text-4xl font-extrabold mt-2 mb-6" style={{ color: theme.primaryText }}>
              Tentang <span className="text-blue-700">Kami</span>
            </h2>
            <p className="text-lg leading-relaxed opacity-80" style={{ color: theme.primaryText }}>
              {data?.deskripsi || "Informasi mengenai sejarah sekolah sedang dalam proses pembaruan data."}
            </p>
          </motion.div>

          <div className="w-full grid grid-cols-4 gap-4">
            {[
              { label: "Tahun Berdiri", val: data?.tahunBerdiri || 0, icon: "🏛️" },
              { label: "Kepala Sekolah", val: data?.jumlahKepalaSekolah || 0, icon: "🎓" },
              { label: "Kompetensi", val: data?.jumlahKompetensiKeahlian || 0, icon: "💡" },
              { label: "Alumni", val: "10k+", icon: "✨" }, // Bonus stat
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group p-6 rounded-[2rem] border border-blue-300 transition-all hover:shadow-xl hover:shadow-blue-500/5 bg-white/70 backdrop-blur-md"
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-3xl md:text-4xl font-black text-blue-600">
                  <Counter to={typeof item.val === 'number' ? item.val : 0} />
                </div>
                <div className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wider">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Timeline: React.FC<{ theme: any; data: any[] }> = ({ theme, data }) => {
  if (!data || data.length === 0) return null;

  return (
    <section className="pt-16 pb-4 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-left mb-16">
          <h2 className="text-3xl md:text-4xl font-bold italic" style={{ color: theme.primaryText }}>Jejak Langkah</h2>
          <div className="h-1 w-20 bg-blue-600 mt-4 rounded-full" />
        </div>

        <div className="relative">
          {/* Central Line */}
          <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 top-0 w-1 h-full bg-gradient-to-b from-blue-600 via-blue-400 to-transparent opacity-20" />

          <div className="space-y-5">
            {data.map((it, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                className={`relative flex border border-blue-300 rounded-3xl items-center justify-between w-full ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className="hidden md:block w-5/12" />
                
                {/* Dot */}
                <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow-lg z-10" />

                <div className="w-full md:w-5/12 pl-8 md:pl-0">
                  <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold mb-3">
                      {it.year}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">{it.title}</h3>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">{it.deskripsi}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
const KepalaSekolahGrid: React.FC<{ theme: any; data: any[] }> = ({ theme, data }) => {
  if (!data || data.length === 0) return null;
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 italic text-left" style={{ color: theme.primaryText }}>
          Pimpinan dari <span className="text-blue-700">Masa ke Masa</span>
        </h2>
        
        <div className="flex flex-wrap justify-center items-center gap-8">
          {data.map((p, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="md:w-[31%] w-full relative group p-6 rounded-[2.5rem] bg-white border border-gray-300 shadow-xl shadow-slate-200/50 text-left"
            >
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="absolute inset-0 bg-blue-600 rounded-full scale-105 opacity-20 group-hover:scale-110 transition-transform" />
                <div 
                  className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-inner bg-slate-100 bg-cover bg-center transition-transform group-hover:scale-95" 
                  style={{ backgroundImage: p.fotoUrl ? `url(${p.fotoUrl})` : "none" }} 
                >
                  {!p.fotoUrl && (
                    <div className="flex h-full items-center justify-center text-slate-400">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              <div className="font-black text-slate-900 leading-tight">{p.nama || p.name}</div>
              <div className="mt-2 text-xs font-bold text-blue-600 uppercase tracking-tighter opacity-70">
                Masa Bakti: {p.masaJabatan || p.period}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/**************** * MAIN PAGE COMPONENT ****************/
const SejarahPage = () => {
  const schoolInfo = SMAN25_CONFIG;
  const { theme, fullName: schoolName } = schoolInfo;
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const schoolId = getSchoolId()

  useEffect(() => {
    const getSejarah = async () => {
      try {
        const response = await fetch(`https://be-school.kiraproject.id/sejarah?schoolId=${schoolId}`);
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };

    getSejarah();
  }, []);

  return (
    <div className="min-h-screen w-full" style={{ background: theme.bg }}>
      <ScrollProgress theme={theme} />
      <NavbarComp theme={theme} />
      
      <HeroComp titleProps="Sejarah Sekolah" id="#sejarah" />
      
      {/* Jika loading, bisa tampilkan skeleton atau biarkan saja karena HeroSection sudah muncul */}
      {!loading ? (
        <>
          <HeroSejarah theme={theme} data={data} />
          <Timeline theme={theme} data={data?.timeline} />
          <KepalaSekolahGrid theme={theme} data={data?.daftarKepalaSekolah} />
        </>
      ) : (
        <div className="py-20 text-left opacity-50">Memuat data sejarah...</div>
      )}
      
      <FooterComp />
    </div>
  );
};

export default SejarahPage;
import { SMAN25_CONFIG } from "@/core/theme";
import { FooterComp } from "@/features/_global/components/footer";
import { HeroComp } from "@/features/_global/components/hero";
import NavbarComp from "@/features/_global/components/navbar";
import { getSchoolId } from "@/features/_global/hooks/getSchoolId";
import { motion } from "framer-motion";
import { BarChart3, CheckCircle2, Lightbulb, Loader2, Quote, Rocket, Target } from "lucide-react";
import { useEffect, useState } from "react";

const SCHOOL_ID = getSchoolId();
const BASE_URL = "https://be-school.kiraproject.id/visi-misi";

// ──────────────────────────────────────────────────────────────
// Sub-Components
// ──────────────────────────────────────────────────────────────

const SectionContainer = ({ children, className = "" }: any) => (
  <section className={`py-16 border-b border-gray-100 last:border-0 ${className}`}>
    <div className="max-w-7xl mx-auto px-5 md:px-4">
      {children}
    </div>
  </section>
);

const PremiumLabel = ({ children, icon: Icon }: any) => (
  <div className="flex items-center gap-3 text-blue-600 font-black text-xs uppercase tracking-[0.3em] mb-8">
    <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-100">
      <Icon size={18} />
    </div>
    {children}
  </div>
);

// ──────────────────────────────────────────────────────────────
// Main Page Component
// ──────────────────────────────────────────────────────────────

export default function VisiMisiPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const schoolInfo = SMAN25_CONFIG;

  useEffect(() => {
    const fetchData = async () => {
      if (!SCHOOL_ID) return;
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}?schoolId=${SCHOOL_ID}`, { cache: "no-store" });
        const json = await res.json();
        const record = json.success ? (Array.isArray(json.data) ? json.data[0] : json.data) : null;
        setData(record);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFDFF]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
        <p className="text-slate-400 font-black text-[10px] tracking-widest uppercase">Memuat Strategi...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
      <NavbarComp theme={schoolInfo.theme} />
      <HeroComp titleProps="Visi - Misi & Tujuan" id="#content" />

      <main id="content" className="relative">
        {/* 1. VISI SECTION - Rata Kiri dengan Border Aksen */}
        <SectionContainer className="bg-white">
          <div className="relative max-w-7xl">
            <Quote className="absolute top-4 text-slate-300 right-0 md:flex hidden rotate-12" size={200} />
            <PremiumLabel icon={Target}>Visi Sekolah</PremiumLabel>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative pl-4 w-full md:w-[80%] md:pl-12 border-l-4 border-blue-600"
            >
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-[1.1] text-slate-900">
                {data?.vision || "Cita-cita sekolah belum dikonfigurasi."}
              </h2>
            </motion.div>
          </div>
        </SectionContainer>

        {/* 2. MISI SECTION - Vertical Stack Rata Kiri */}
        <SectionContainer className="bg-slate-50">
          <PremiumLabel icon={Rocket}>Langkah Strategis (Misi)</PremiumLabel>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5">
            {data?.missions?.map((misi: string, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="w-full gap-4 md:gap-12 p-8 md:p-10 bg-white border border-slate-300 rounded-[2rem] hover:shadow-2xl hover:shadow-blue-900/5 transition-all group"
              >
                <div className="text-2xl w-[80%] md:w-max md:text-4xl font-black text-blue-600/20 group-hover:text-blue-600 transition-colors shrink-0">
                  {(i + 1).toString().padStart(2, '0')}
                </div>
                <div className="flex-1">
                  <p className="text-md md:text-lg font-semibold md:font-bold text-slate-800 leading-relaxed italic">
                    {misi}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </SectionContainer>

        {/* 3. PILAR SECTION - Minimalis Rata Kiri */}
        <SectionContainer>
          <div className="max-w-7xl pb-7 md:pb-12">
            <PremiumLabel icon={Lightbulb}>Tujuan Utama</PremiumLabel>
            <h3 className="text-2xl w-[80%] md:w-max md:text-4xl font-black tracking-tight mb-12">Fondasi Pengembangan Pendidikan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data?.pillars?.map((pilar: string, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-6 p-6 md:p-8 rounded-3xl bg-white border border-slate-300 hover:border-blue-300 transition-colors"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="text-blue-600" size={24} />
                  </div>
                  <span className="text-md md:text-lg font-semibold md:font-bold text-slate-800 italic tracking-tight">{pilar}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </SectionContainer>

        {/* 4. KPI SECTION - Premium Rata Kiri */}
        <SectionContainer className="bg-slate-900 text-white overflow-hidden relative">
          {/* Ornamen dekorasi */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[100px] -z-0" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 text-blue-400 font-black text-xs uppercase tracking-[0.3em] mb-12">
              <BarChart3 size={20} />
              Indikator Kinerja (KPI)
            </div>
            
            <div className="grid grid-cols-1 gap-12">
              {data?.kpis?.map((kpi: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="max-w-7xl group"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
                    <div className="space-y-2">
                      <span className="text-blue-500 font-black text-xs tracking-widest uppercase">Target {i + 1}</span>
                      <h4 className="text-2xl md:text-3xl font-bold leading-tight text-white transition-colors">
                        {kpi.indicator}
                      </h4>
                    </div>
                    <div className="shrink-0">
                      <span className="text-6xl font-black tracking-tighter text-white">
                        {kpi.target}<span className="text-2xl text-white ml-2"> %</span>
                      </span>
                    </div>
                  </div>
                  
                  {/* Linear Progress Bar Rata Kiri */}
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${kpi.target}%` }}
                      transition={{ duration: 1.5, ease: "circOut" }}
                      className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </SectionContainer>
      </main>

      <FooterComp />
    </div>
  );
}
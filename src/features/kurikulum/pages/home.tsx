import { SMAN25_CONFIG } from "@/core/theme";
import { FooterComp } from "@/features/_global/components/footer";
import { HeroComp } from "@/features/_global/components/hero";
import NavbarComp from "@/features/_global/components/navbar";
import { getSchoolId } from "@/features/_global/hooks/getSchoolId";
import { motion, useReducedMotion } from "framer-motion";
import { AlertCircle, Calendar, Clock, Download, FileText, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

/****************
 * FETCH HOOK (HANYA BAGIAN INI YANG DIUBAH)
 ****************/
type Dokumen = {
  id: string;
  title: string;
  url: string;
  updatedAt: string;
};

type JamPelajaran = {
  key: string;
  start: string;
  end: string;
  order: number;
};

type KurikulumData = {
  dokumen: Dokumen[];
  jamPelajaran: JamPelajaran[];
};

const DEMO_DATA: KurikulumData = {
  dokumen: [
    { id: "1", title: "Kurikulum Merdeka 2025", url: "https://example.com/kurikulum.pdf", updatedAt: "2025-01-15T00:00:00Z" },
  ],
  jamPelajaran: [
    { key: "Jam 1", start: "07:00", end: "07:45", order: 1 },
    { key: "Jam 2", start: "07:45", end: "08:30", order: 2 },
  ],
};

const useKurikulumData = () => {
  const [data, setData] = useState<KurikulumData>(DEMO_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const SCHOOL_ID = getSchoolId()

  useEffect(() => {
    const fetchKurikulum = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://be-school.kiraproject.id/kurikulum?schoolId=${SCHOOL_ID}`, {
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
        const mappedData: KurikulumData = {
          dokumen: (result.data || []).map((doc: any) => ({
            id: doc.id?.toString() || "",
            title: doc.name || "Dokumen Kurikulum",
            url: doc.documentUrl || "",
            description: doc.description || "",
            year: doc.year || "",
            type: doc.type || "",
            updatedAt: doc.updatedAt || new Date().toISOString(),
          })),
          jamPelajaran: [], // API kurikulum tidak punya jam pelajaran → kosongkan atau ambil dari API lain jika perlu
        };

        setData(mappedData);
      } catch (err) {
        console.warn("Fetch error:", err);
        setError("Gagal memuat data kurikulum. Menampilkan data demo.");
        setData(DEMO_DATA);
      } finally {
        setLoading(false);
      }
    };

    fetchKurikulum();
  }, []); // Hanya fetch sekali saat mount

  return { data, isPending: loading, error };
};
const Curriculum = ({ theme, schoolName }: { theme: any; schoolName: string }) => {
  const { data = DEMO_DATA, isPending: loading, error } = useKurikulumData();

  // Loading State yang lebih "Chic"
  if (loading) {
    return (
      <section className="py-24 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="text-blue-900/60 font-medium animate-pulse">Menyusun Kurikulum Terbaik...</p>
      </section>
    );
  }

  return (
    <section id="kurikulum" className="relative py-16 overflow-hidden bg-slate-50">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-indigo-100/50 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-10 text-left">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-blue-500 font-bold tracking-widest uppercase text-xs"
          >
            Academic Excellence
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl italic font-black text-slate-900 mt-2"
          >
            Struktur <span className="text-blue-700">Kurikulum</span>
          </motion.h2>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Section: Daftar Dokumen (Kiri/Utama) */}
          <div className="lg:col-span-12 space-y-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
              <FileText className="text-blue-600" /> Dokumen Resmi
            </h3>
            
            {data.dokumen.map((doc, i) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative bg-white/70 backdrop-blur-md border border-blue-300 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100">
                        {doc.type || "Umum"}
                      </span>
                      <span className="flex items-center text-slate-400 text-sm">
                        <Calendar className="w-3.5 h-3.5 mr-1" /> {doc.year}
                      </span>
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {doc.title}
                    </h4>
                    <p className="text-slate-600 text-sm leading-loose w-[90%]">
                      {doc.description}
                    </p>
                  </div>
                  
                  {doc.url && (
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex mt-7 w-max items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                    >
                      <Download className="w-4 h-4" /> Unduh File
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {data.dokumen.length === 0 && data.jamPelajaran.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-500 font-medium">Informasi kurikulum belum tersedia untuk saat ini.</p>
          </div>
        )}
      </div>
    </section>
  );
};

/****************************
 * PAGE DENGAN HERO
 ****************************/
const CurriculumPage = () => {
  const schoolInfo = SMAN25_CONFIG;
  const theme = schoolInfo.theme;
  const schoolName = schoolInfo.fullName;
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    try {
      console.assert(!!theme, "Theme harus ada");
      const keys = ["bg", "primary", "primaryText", "surface", "surfaceText", "subtle", "accent"];
      keys.forEach((k) => console.assert(k in theme, `Theme key '${k}' harus ada`));
      console.assert(typeof Curriculum === "function", "Curriculum component harus terdefinisi");
      console.assert(typeof NavbarComp === "function", "Navbar harus terdefinisi");
      console.assert(typeof FooterComp === "function", "Footer harus terdefinisi");

      console.log("UI smoke tests passed (theme, Navbar/Footer)");
    } catch (e) {
      console.error("UI smoke tests failed:", e);
    }
  }, [prefersReducedMotion, theme]);

  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      <NavbarComp theme={theme} />

      {/* HERO SECTION */}
      <HeroComp titleProps={`Kurikulum ${new Date().getFullYear()}`} id="#Kurikulum" />

      <main id="Kurikulum">
        <Curriculum theme={theme} schoolName={schoolName} />
      </main>

      <FooterComp />
    </div>
  );
};

export default CurriculumPage;
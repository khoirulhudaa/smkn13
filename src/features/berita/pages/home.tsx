import { SMAN25_CONFIG } from "@/core/theme";
import { FooterComp } from "@/features/_global/components/footer";
import { HeroComp } from "@/features/_global/components/hero";
import NavbarComp from "@/features/_global/components/navbar";
import { getSchoolId } from "@/features/_global/hooks/getSchoolId";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";


/****************************
 * UTILS
 ****************************/

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("id-ID", { 
  day: "numeric", month: "short", year: "numeric" 
});

/****************************
 * PREMIUM COMPONENTS
 ****************************/

// 1. Premium Badge
const CardBadge = ({ children, variant = "default" }: { children: React.ReactNode; variant?: string }) => {
  const isDinas = variant === "dinas";
  return (
    <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] rounded-full border ${
      isDinas 
        ? "bg-red-500/10 border-red-500/20 text-red-600" 
        : "bg-blue-500/10 border-blue-500/20 text-blue-600"
    }`}>
      {children}
    </span>
  );
};

const NewsCard = ({ item, onClick, theme }: any) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="group relative flex flex-col h-full bg-white rounded-[2rem] overflow-hidden border border-gray-300 shadow-[0_20px_50px_rgba(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)]"
    >
      {/* Image Container */}
      <div className="relative h-[220px] overflow-hidden">
        <img
          src={item.imageUrl || "/default-berita.png"}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Date Overlay */}
        <div className="absolute top-4 left-4">
           <div className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl shadow-sm">
              <p className="text-[10px] font-black text-gray-900 uppercase tracking-tighter italic">
                {item.date}
              </p>
           </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-7 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-4">
          <CardBadge variant={item.source === "Dinas" ? "dinas" : "default"}>
            {item.category}
          </CardBadge>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">• 4 Min Read</span>
        </div>

        <h3 className="text-xl font-black text-gray-900 leading-tight mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 italic uppercase">
          {item.title}
        </h3>

        <p className="text-sm text-gray-500 font-medium line-clamp-3 mb-6 leading-relaxed">
          {item.desc}
        </p>

        <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">
              H
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest text-gray-900">Humas</span>
          </div>
          
          <button
            onClick={onClick}
            className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 group-hover:gap-4 transition-all"
          >
            Selengkapnya <span>→</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

/****************************
 * SECTION: Berita
 ****************************/
function BeritaSection({ theme }: { theme: any; }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Semua");
  const [selected, setSelected] = useState<any>(null);
  const [newsData, setNewsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const schoolId = getSchoolId();
        const res = await fetch(`https://be-school.kiraproject.id/berita?schoolId=${schoolId}`);
        const result = await res.json();

        if (result.success) {
          const mapped = result.data.map((item: any) => ({
            ...item,
            date: fmtDate(item.publishDate),
            desc: item.content || "No description provided.",
            author: "Humas",
          }));
          setNewsData(mapped);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const categories = useMemo(() => ["Semua", ...Array.from(new Set(newsData.map((n) => n.category)))], [newsData]);

  const filtered = useMemo(() => {
    return newsData.filter((n) => {
      const okQ = !q || n.title.toLowerCase().includes(q.toLowerCase());
      const okC = cat === "Semua" || n.category === cat;
      return okQ && okC;
    });
  }, [q, cat, newsData]);

  return (
    <section className="py-16 bg-[#FDFDFD]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Heading Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-8 border-b border-gray-100 pb-12">
          <div className="w-max">
             <div className="flex items-center gap-3 mb-4">
              <span className="w-12 h-[2px] bg-black" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">Wawasan Baru</span>
            </div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter italic uppercase leading-[0.8] mb-3">
              Daftar <span className="text-blue-600 underline decoration-4 underline-offset-8">Informasi</span>
            </h2>
            {/* <p className="text-md text-gray-500 font-medium">
              Update eksklusif mengenai aktivitas, prestasi, dan pengumuman
            </p> */}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search news..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="px-6 py-4 rounded-2xl bg-gray-200 placeholder:text-black/50 border-none font-bold text-gray-800 focus:ring-2 focus:ring-blue-100 transition min-w-[300px]"
            />
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              className="px-6 py-4 rounded-2xl bg-gray-200 placeholder:text-black/50 border-none font-black text-[11px] uppercase tracking-widest text-gray-500 focus:ring-2 focus:ring-blue-100"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* News Grid */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-10">
            {[1,2,3].map(i => <div key={i} className="h-[500px] bg-gray-100 rounded-[2rem] animate-pulse" />)}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-10">
            <AnimatePresence mode="popLayout">
              {filtered.map((news) => (
                <NewsCard 
                  key={news.id} 
                  item={news} 
                  theme={theme} 
                  onClick={() => setSelected(news)} 
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Enhanced Detail Modal */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99999999999999999] flex items-center justify-center p-4 md:p-10"
              onClick={() => setSelected(null)}
            >
              <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-xl" />
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 30 }}
                className="relative w-full z-[999999999] max-w-5xl bg-white rounded-[2rem] overflow-hidden shadow-2xl max-h-full flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky h-[90vh] z-[9999999]">
                  <div className="relative h-[32%]">
                    <img src={selected.imageUrl} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => setSelected(null)}
                      className="absolute top-8 right-8 w-12 h-12 bg-red-600 text-white border-2 shadiw-xl border-white rounded-full flex items-center justify-center font-black shadow-xl hover:scale-110 transition"
                    >
                      <X />
                    </button>
                  </div>
                  
                  <div className="p-10 h-[68%] md:p-6 overflow-y-auto">
                    <div className="flex items-center w-full justify-between gap-4 mb-8">
                       <CardBadge>{selected.category}</CardBadge>
                       <span className="text-xs font-black text-gray-600 uppercase tracking-widest">{selected.date}</span>
                    </div>
                    
                    <h2 className="text-xl md:text-3xl font-black text-gray-900 tracking-tighter uppercase italic leading-[0.9] mb-4">
                      {selected.title}
                    </h2>

                    <div className="prose prose-lg w-[100%] text-gray-600 font-medium pb-6 leading-relaxed ">
                      {selected.desc}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/****************************
 * PAGE UTAMA
 ****************************/
const BeritaPage = () => {
  const schoolInfo = SMAN25_CONFIG;
  const theme = schoolInfo.theme;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavbarComp />
      <HeroComp titleProps="Berita Untuk-mu" id="#berita" />
      <main className="flex-1 relative z-[1]" id="berita">
        <BeritaSection theme={theme} />
      </main>
      <FooterComp />
    </div>
  );
};

export default BeritaPage;
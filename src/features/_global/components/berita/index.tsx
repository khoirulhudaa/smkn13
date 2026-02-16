import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Calendar, Newspaper, Search, User, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getSchoolId } from "../../hooks/getSchoolId";

const BASE_URL = "https://be-school.kiraproject.id";

const fmtDate = (iso: string) => 
  new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

const BeritaComp = () => {
  const [newsData, setNewsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Semua");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const schoolId = getSchoolId();
        const response = await fetch(`${BASE_URL}/berita?schoolId=${schoolId}`);
        const result = await response.json();
        if (result.success) setNewsData(result.data);
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
    <section className="py-12 md:py-24 bg-slate-50 relative">
      {/* Ornamen Background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-2[">
        {/* Header & Filter */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-blue-600 font-black tracking-widest text-xs uppercase mb-4"
            >
              <Newspaper size={16} /> Insight & Updates
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-[900] text-slate-900 leading-none">
              Warta <span className="text-blue-600 underline direction-normal">Sekolah.</span>
            </h2>
          </div>

          <div className="flex flex-wrap gap-4 z-[4]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Cari berita..."
                className="pl-12 pr-6 py-4 rounded-2xl bg-white border border-gray-300 text-black focus:border-blue-500 outline-none w-full md:w-64 shadow-sm transition-all"
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <select 
              onChange={(e) => setCat(e.target.value)}
              className="px-6 py-4 rounded-2xl bg-white border border-gray-300 font-bold text-slate-700 outline-none cursor-pointer shadow-sm"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[600px]">
            <div className="md:col-span-2 md:row-span-2 bg-slate-200 animate-pulse rounded-[3rem]" />
            <div className="md:col-span-2 bg-slate-200 animate-pulse rounded-[3rem]" />
            <div className="bg-slate-200 animate-pulse rounded-[3rem]" />
            <div className="bg-slate-200 animate-pulse rounded-[3rem]" />
          </div>
        ) : (
          /* BENTO GRID BERITA */
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[300px]">
            {filtered.map((n, i) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelected(n)}
                className={`group z-[4] relative rounded-[2.5rem] overflow-hidden cursor-pointer shadow-xl shadow-blue-900/5 bg-white ${
                  i === 0 ? "md:col-span-2 md:row-span-2" : // Berita Utama
                  i === 1 ? "md:col-span-2" : ""           // Berita Kedua (Lebar)
                }`}
              >
                {/* Image Background */}
                <div className="absolute inset-0 transition-transform duration-1000 group-hover:scale-110">
                  <img 
                    src={n.imageUrl || "/default-berita.png"} 
                    className="w-full h-full object-cover" 
                    alt={n.title}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${
                    i === 0 ? "from-blue-950 via-blue-900/40" : "from-slate-950/80 via-slate-900/20"
                  } to-transparent`} />
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 p-8 md:p-8 flex flex-col justify-end">
                  <div className="flex flex-col items-start gap-3 mb-4">
                    <span className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-blue-600/30">
                      {n.category}
                    </span>
                    <span className="text-white/70 text-xs font-bold flex items-center gap-1">
                      <Calendar size={14} /> {fmtDate(n.publishDate)}
                    </span>
                  </div>

                  <h3 className={`text-white font-black leading-tight group-hover:text-blue-800 group-hover:bg-white group-hover:italic group-hover:px-4 duration-200 transition-all 
                    ${i === 0 ? "text-3xl md:text-4xl line-clamp-2" : "text-xl line-clamp-1"} 
                    ${i === 0 ? "w-full" : "w-max max-w-full"}`}>
                    {n.title}
                  </h3>

                  {i === 0 && (
                    <p className="text-slate-200 mt-4 line-clamp-2 text-sm md:text-base font-light max-w-xl">
                      {n.content}
                    </p>
                  )}

                  <div className="mt-6 flex items-center gap-2 text-blue-400 font-black text-xs uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                    Learn More <ArrowRight size={16} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL DETAIL (Simplified Premium) */}
      <AnimatePresence>
        {selected && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999999999] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
            onClick={() => setSelected(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }}
              className="bg-white w-full max-w-7xl h-[94vh] rounded-[1.2rem] overflow-hidden flex flex-col md:flex-row shadow-2xl shadow-blue-600/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="md:w-2/5 h-64 md:flex hidden md:h-auto overflow-hidden">
                <img src={selected.imageUrl} className="w-full h-full object-cover" alt="Detail" />
              </div>
              <div className="md:w-3/5 p-8 md:p-16 overflow-y-auto">
                <button 
                  onClick={() => setSelected(null)}
                  className="absolute top-8 right-10 md:right-16 w-12 h-12 rounded-full bg-red-600 flex items-center justify-center hover:bg-red-700 text-white transition-all"
                >
                  <X size={24} />
                </button>
                <div className="flex items-center gap-4 text-blue-600 font-bold text-xs uppercase mb-6">
                   <span>{selected.category}</span>
                   <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                   <span className="text-slate-400">{fmtDate(selected.publishDate)}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-8 leading-tight">
                  {selected.title} TERBAIK DI TAHUN 2026 SEPNJANG SEJARAH DI MEGARA KESATUAN REPUBLIK INDONESIA
                </h2>
                <div className="prose prose-blue prose-slate w-full text-slate-600 font-medium leading-relaxed">
                  {selected.content} 
                  dsajdjashdakjshdajhdajdhajsh jhasjdhasjdhasjdahsjkdhasjdhasjhd ajhajshsjdhasjdhasjdhasjh jashdjashdjashdasjdhasjhdj hdakjshdaksjhdaskjdhaskjdh jdhasjdhasjdhasjdhajsdhasj hasjdhasjdhasjdhasjh kjashdjashdajshdajskhkajs hdaskjdhajkhdaskjhdaskjh kjashdjash
                  dsajdjashdakjshdajhdajdhajsh jhasjdhasjdhasjdahsjkdhasjdhasjhd ajhajshsjdhasjdhasjdhasjh jashdjashdjashdasjdhasjhdj hdakjshdaksjhdaskjdhaskjdh jdhasjdhasjdhasjdhajsdhasj hasjdhasjdhasjdhasjh kjashdjashdajshdajskhkajs hdaskjdhajkhdaskjhdaskjh kjashdjash
                  dsajdjashdakjshdajhdajdhajsh jhasjdhasjdhasjdahsjkdhasjdhasjhd ajhajshsjdhasjdhasjdhasjh jashdjashdjashdasjdhasjhdj hdakjshdaksjhdaskjdhaskjdh jdhasjdhasjdhasjdhajsdhasj hasjdhasjdhasjdhasjh kjashdjashdajshdajskhkajs hdaskjdhajkhdaskjhdaskjh kjashdjash
                  dsajdjashdakjshdajhdajdhajsh jhasjdhasjdhasjdahsjkdhasjdhasjhd ajhajshsjdhasjdhasjdhasjh jashdjashdjashdasjdhasjhdj hdakjshdaksjhdaskjdhaskjdh jdhasjdhasjdhasjdhajsdhasj hasjdhasjdhasjdhasjh kjashdjashdajshdajskhkajs hdaskjdhajkhdaskjhdaskjh kjashdjash
                  dsajdjashdakjshdajhdajdhajsh jhasjdhasjdhasjdahsjkdhasjdhasjhd ajhajshsjdhasjdhasjdhasjh jashdjashdjashdasjdhasjhdj hdakjshdaksjhdaskjdhaskjdh jdhasjdhasjdhasjdhajsdhasj hasjdhasjdhasjdhasjh kjashdjashdajshdajskhkajs hdaskjdhajkhdaskjhdaskjh kjashdjash
                  dsajdjashdakjshdajhdajdhajsh jhasjdhasjdhasjdahsjkdhasjdhasjhd ajhajshsjdhasjdhasjdhasjh jashdjashdjashdasjdhasjhdj hdakjshdaksjhdaskjdhaskjdh jdhasjdhasjdhasjdhajsdhasj hasjdhasjdhasjdhasjh kjashdjashdajshdajskhkajs hdaskjdhajkhdaskjhdaskjh kjashdjash
                  dsajdjashdakjshdajhdajdhajsh jhasjdhasjdhasjdahsjkdhasjdhasjhd ajhajshsjdhasjdhasjdhasjh jashdjashdjashdasjdhasjhdj hdakjshdaksjhdaskjdhaskjdh jdhasjdhasjdhasjdhajsdhasj hasjdhasjdhasjdhasjh kjashdjashdajshdajskhkajs hdaskjdhajkhdaskjhdaskjh kjashdjash
                </div>
                <div className="mt-12 pt-8 border-t border-slate-100 flex items-center gap-4 text-slate-400 italic">
                  <User size={18} className="text-blue-600" /> Published by <span className="text-slate-900 font-bold not-italic">{selected.author || 'Admin Sekolah'}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default BeritaComp;
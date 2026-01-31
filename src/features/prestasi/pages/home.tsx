import { SMAN25_CONFIG } from "@/core/theme";
import { FooterComp } from "@/features/_global/components/footer";
import { HeroComp } from "@/features/_global/components/hero";
import NavbarComp from "@/features/_global/components/navbar";
import { getSchoolId } from "@/features/_global/hooks/getSchoolId";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Calendar, ChevronDown, Filter, MapPin, Search, Star, Trophy, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const Modal = ({ open, onClose, theme, title, children }) => {
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
        className="relative max-w-2xl w-full rounded-3xl border overflow-hidden shadow-2xl"
        style={{ background: theme.surface, borderColor: theme.subtle }}
      >
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: theme.subtle }}>
          <h3 className="text-xl font-bold" style={{ color: theme.primaryText }}>{title}</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition">
            ✕
          </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>
      </motion.div>
    </motion.div>
  );
};

/* Data dummy sekarang kosong sesuai permintaan */
const ACHIEVEMENTS: any[] = [];

const PrestasiCard = ({ item, theme, onOpen }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
      whileHover={{ y: prefersReducedMotion ? 0 : -8, scale: 1.03 }}
      className="group relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all cursor-pointer border"
      style={{ borderColor: theme.subtle, background: theme.surface }}
      onClick={() => onOpen(item)}
    >
      <div className="aspect-[16/9] relative overflow-hidden">
        <img
          src={item.img || '/trophy.jpg'}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute top-4 right-4">
          <Star className="w-10 h-10 text-yellow-400 drop-shadow-lg" fill="currentColor" />
        </div>
      </div>
      <div className="p-4 md:p-6">
        <h3 className="text-md font-bold mb-2 line-clamp-2" style={{ color: theme.primaryText }}>
          {item.title}
        </h3>
        <div className="text-sm opacity-80 mb-3" style={{ color: theme.surfaceText }}>
          {item.date} · {item.category} · {item.level}
        </div>
        <p className="text-xs opacity-90 line-clamp-3" style={{ color: theme.surfaceText }}>
          {item.desc}
        </p>
        <span
          className="inline-block mt-7 px-4 py-2 rounded-full text-sm font-medium transition-all"
          style={{ background: theme.accent, color: "#111827" }}
        >
          Lihat Detail →
        </span>
      </div>
    </motion.div>
  );
};

const PrestasiSection = () => {
  const schoolId = getSchoolId();
  const [selected, setSelected] = useState<any>(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Semua');

  const [achievements, setAchievements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrestasi = async () => {
      try {
        const res = await fetch(`https://be-school.kiraproject.id/prestasi?schoolId=${schoolId}`);
        const json = await res.json();
        if (json.success) {
          const mapped = json.data.map((item: any) => ({
            title: item.name || 'Prestasi Unggul',
            date: item.year || '2024',
            category: item.organizer || 'Lainnya',
            level: item.level || 'Nasional',
            desc: item.description || 'Dedikasi dan kerja keras siswa SMAN 25 Jakarta dalam mengharumkan nama sekolah.',
            img: item.imageUrl || 'https://images.unsplash.com/photo-1578574515313-ad99ca9b3b44?q=80&w=1000&auto=format&fit=crop',
          }));
          setAchievements(mapped);
        }
      } catch (err) {
        console.error("Error fetching achievements:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrestasi();
  }, [schoolId]);

  const categories = useMemo(() => ['Semua', ...new Set(achievements.map(a => a.category))], [achievements]);

  const filtered = achievements.filter(a => {
    const matchQ = a.title.toLowerCase().includes(query.toLowerCase());
    const matchC = category === 'Semua' || a.category === category;
    return matchQ && matchC;
  });

  return (
    <section className="py-16 bg-[#FAFAFA] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header Title Section */}
        <div className="max-w-2xl mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-12 h-[2px] bg-slate-900" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Tiada pembatas untuk kita</span>
          </div>
          <h2 className="text-xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.8]">
            Jejak <span className="text-blue-600 underline decoration-4 underline-offset-8">Kejuaraan</span>
          </h2>
        </div>

        {/* Filters Section (Search & Dropdown) */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-16">
          <div className="relative w-full md:w-2/3 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari prestasi atau juara..."
              className="w-full pl-14 pr-6 py-5 bg-gray-200 placeholder:text-black/50 rounded-3xl border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] font-bold text-slate-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-200 transition-all outline-none"
            />
          </div>
          
          <div className="relative w-full md:w-1/3">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Filter size={18} />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full pl-14 pr-10 py-5 bg-gray-200 placeholder:text-black/50 rounded-3xl border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] font-black uppercase tracking-widest text-[11px] text-slate-700 appearance-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 transition-all outline-none cursor-pointer"
            >
              {categories.map(c => (
                <option key={c} value={c} className="font-sans font-bold normal-case text-base">
                  {c === "Semua" ? "SEMUA KATEGORI" : c.toUpperCase()}
                </option>
              ))}
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <ChevronDown size={18} />
            </div>
          </div>
        </div>

        {/* Grid Content */}
        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-10">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="aspect-[4/5] bg-slate-200 rounded-[2.5rem] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => (
                <AchievementCard key={i} item={item} onOpen={setSelected} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
             <Trophy size={48} className="mx-auto text-slate-200 mb-4" />
             <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Data tidak ditemukan</p>
          </div>
        )}

        {/* Premium Modal Detail */}
        <AnimatePresence>
          {selected && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-slate-900/60"
              onClick={() => setSelected(null)}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                className="bg-white w-full max-w-4xl rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row h-max max-h-[90vh]"
                onClick={e => e.stopPropagation()}
              >
                <div className="md:w-1/2 relative h-64 md:h-auto overflow-hidden">
                  <img src={selected.img} className="w-full h-full object-cover scale-105" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                  <button 
                    onClick={() => setSelected(null)}
                    className="absolute top-6 right-6 border-2 border-white shadow-xl w-12 h-12 z-[3] bg-red-600 rounded-full flex md:hidden items-center justify-center shadow-xl text-white"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="md:w-1/2 p-8 flex flex-col overflow-y-auto">
                  <div className="flex justify-between items-start mb-8">
                    <span className="bg-blue-100 text-blue-700 text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest">
                      {selected.level} Achievement
                    </span>
                    <button onClick={() => setSelected(null)} className="hidden md:block p-2 hover:bg-slate-100 rounded-full transition-colors">
                      <X size={24} />
                    </button>
                  </div>

                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-tight mb-3">
                    {selected.title}
                  </h2>
                  
                  <p className="text-slate-500 font-medium leading-relaxed mb-4">
                    {selected.desc}
                  </p>

                  <div className="grid grid-cols-2 gap-6 mt-auto pt-8 border-t border-slate-100">
                    <div>
                      <div className="flex items-center gap-2 mb-1 text-slate-400">
                        <Calendar size={12} />
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Waktu</span>
                      </div>
                      <p className="font-bold text-slate-900">{selected.date}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1 text-slate-400">
                        <MapPin size={12} />
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Penyelenggara</span>
                      </div>
                      <p className="font-bold text-slate-900 text-sm">{selected.category}</p>
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
};

const PrestasiPage = () => {
  const schoolInfo = SMAN25_CONFIG;
  const theme = schoolInfo.theme;
  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      <NavbarComp theme={theme} />
      <HeroComp titleProps="Prestasi Sekolah" id="#prestasi" />
      <main id="prestasi">
        <PrestasiSection />
      </main>
      <FooterComp />
    </div>
  );
};

export default PrestasiPage;
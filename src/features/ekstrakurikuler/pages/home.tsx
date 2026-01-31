import { SMAN25_CONFIG } from "@/core/theme";
import { FooterComp } from "@/features/_global/components/footer";
import { HeroComp } from "@/features/_global/components/hero";
import NavbarComp from "@/features/_global/components/navbar";
import { getSchoolId } from "@/features/_global/hooks/getSchoolId";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";

/****************************
 * DATA DEMO — EKSTRAKURIKULER (UPDATED THUMBNAILS)
 ****************************/
const CATEGORIES = ["Sains & Riset", "Pramuka", "Jurnalistik", "Keagamaan", "Bahasa", "Multimedia"];
const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

const CLUBS: any[] = [
];

/****************************
 * HELPERS & COMPONENTS (tetap sama)
 ****************************/
const normalize = (s: string) => (s || "").toLowerCase();

function filterClubs(list: any[], q: string, category: string, day: string) {
  return list.filter(c => {
    const matchQ = !q || normalize(c.name).includes(normalize(q)) || normalize(c.desc).includes(normalize(q));
    const matchCat = !category || category === 'Semua' || c.category === category;
    const matchDay = !day || day === 'Semua' || c.day === day;
    return matchQ && matchCat && matchDay;
  });
}

const Chip = ({ children, theme }: any) => (
  <span className="text-[11px] px-2 py-0.5 rounded-full border" style={{ borderColor: theme.subtle, background: "rgba(255,255,255,0.06)", color: theme.primaryText }}>
    {children}
  </span>
);


// 1. Modern Glassy Chip
const PremiumChip = ({ children, active }: { children: React.ReactNode; active?: boolean }) => (
  <span className={`px-4 py-1.5 rounded-full text-[10px] overflow-hidden font-black uppercase tracking-widest transition-all duration-300 ${
    active 
    ? "bg-black text-white shadow-lg shadow-black/20" 
    : "bg-white text-gray-500 border border-gray-900/30 hover:border-black/20"
  }`}>
    {children}
  </span>
);

// 2. Cinematic Club Card
const ClubCard = ({ club, onOpen }: any) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={() => onOpen(club)}
      className="group relative bg-white rounded-[2.5rem] overflow-hidden border border-gray-300 shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.1)] transition-all duration-500 cursor-pointer"
    >
      {/* Image Container with Overlay */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img 
          src={club.img} 
          alt={club.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        <div className="absolute bottom-4 left-6">
           <span className="bg-white/20 backdrop-blur-md text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter border border-white/30">
             {club.category}
           </span>
        </div>
      </div>

      <div className="p-8">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-black text-gray-900 leading-tight uppercase italic tracking-tighter group-hover:text-blue-600 transition-colors">
            {club.name}
          </h3>
        </div>
        
        <p className="text-gray-500 text-sm font-medium line-clamp-2 mb-6 leading-relaxed">
          {club.desc}
        </p>

        <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase font-black text-gray-400 tracking-widest">Schedule</span>
            <span className="text-xs font-bold text-gray-900">{club.day} • {club.time || '15:30'}</span>
          </div>
          <div className="ml-auto w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center group-hover:bg-blue-600 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/****************************
 * EKSKUL SECTION — PAKAI API BARU
 **************************/
const EkskulSection = () => {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("Semua");
  const [selected, setSelected] = useState<any>(null);
  const schoolId = getSchoolId();

  const { data: clubs = [], isLoading } = useQuery({
    queryKey: ['ekskul-premium', schoolId],
    queryFn: async () => {
      const res = await fetch(`https://be-school.kiraproject.id/ekstrakurikuler?schoolId=${schoolId}`);
      const json = await res.json();
      return json.data.map((item: any) => ({
        ...item,
        name: item.name,
        category: item.category || "General",
        day: item.schedule?.split(' ')[0] || "Kamis",
        desc: item.description,
        img: item.imageUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000&auto=format&fit=crop',
        coach: item.mentor
      }));
    }
  });

  const categories = useMemo(() => ["Semua", ...new Set(clubs.map((c: any) => c.category))], [clubs]);

  const filtered = clubs.filter((c: any) => {
    const matchQ = c.name.toLowerCase().includes(query.toLowerCase());
    const matchC = activeCat === "Semua" || c.category === activeCat;
    return matchQ && matchC;
  });

  return (
    <section className="py-16 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Modern Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-8 border-b border-gray-200 pb-12">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-12 h-[2px] bg-black" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Student Activities</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-[0.8]">
              Melampaui <span className="text-blue-600 underline decoration-4 underline-offset-8">Batas</span>
            </h2>
          </div>

          <div className="flex items-center gap-6 w-full md:w-auto">
             <div className="relative group w-full md:w-max">
                <input 
                  type="text" 
                  placeholder="Cari bakat kamu..."
                  className="w-full md:w-80 pl-12 pr-6 py-4 bg-gray-200 placeholder:text-black/50 rounded-2xl border-none shadow-sm font-bold text-gray-800 focus:ring-2 focus:ring-blue-100 transition-all"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
             </div>
             
             <div className="hidden md:flex w-max gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map((c: any) => (
                  <button key={c} onClick={() => setActiveCat(c)} className="h-max pt-1">
                    <PremiumChip active={activeCat === c}>{c}</PremiumChip>
                  </button>
                ))}
             </div>
          </div>
        </div>

        {/* Dynamic Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-10">
            {[1,2,3].map(i => <div key={i} className="aspect-[4/5] bg-gray-200 rounded-[2.5rem] animate-pulse" />)}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence mode="popLayout">
              {filtered.map((club: any) => (
                <ClubCard key={club.name} club={club} onOpen={setSelected} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Premium Detail Slide-over / Modal */}
        <AnimatePresence>
          {selected && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/40"
              onClick={() => setSelected(null)}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                className="bg-white w-full max-w-4xl rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row h-[90vh] md:h-max"
                onClick={e => e.stopPropagation()}
              >
                <div className="md:w-1/2 h-64 md:h-auto relative">
                  <button 
                    onClick={() => setSelected(null)}
                    className="absolute top-6 right-6 z-[4] w-12 h-12 bg-red-600 text-white border-2 shadiw-xl border-white rounded-full md:hidden flex items-center justify-center font-black shadow-xl hover:scale-110 transition"
                  >
                    <X />
                  </button>
                  <img src={selected.img} className="w-full h-full object-cover" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                </div>
                
                <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic leading-[0.8] mb-3">
                      {selected.name}
                    </h2>
                    
                    <p className="text-gray-500 font-medium leading-relaxed pb-2">
                      {selected.desc}
                    </p>
                  </div>
                  
                  <div>
                    <div className="grid grid-cols-2 gap-8 mb-6 pt-8 border-t border-gray-100">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Mentor</p>
                        <p className="font-bold text-gray-900">{selected.coach || 'Ibu Siti Aminah'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Schedule</p>
                        <p className="font-bold text-gray-900">{selected.day}, {selected.schedule?.split(' ')[1] || '15:30'}</p>
                      </div>
                    </div>
                    <a 
                      href={`https://wa.me/628123456789?text=Halo, saya tertarik mendaftar ekskul ${selected.name}`}
                      target="_blank"
                      className="block w-full py-5 mt-auto bg-blue-600 text-white text-center rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-colors shadow-lg shadow-blue-200"
                    >
                      Register Now
                    </a>
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

/****************************
 * PAGE UTAMA
 **************************/
const EkskulPage = () => {
  const schoolInfo = SMAN25_CONFIG;
  const theme = schoolInfo.theme;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavbarComp theme={theme} />
      <HeroComp titleProps="Ekstrakurikuler" id="#ekstra" />
      <main className="flex-1 relative z-[1]" id="ekstra">
        <EkskulSection />
      </main>
      <FooterComp />
    </div>
  );
};

export default EkskulPage;
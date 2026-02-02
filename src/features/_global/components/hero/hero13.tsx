import { useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { motion } from "framer-motion";
import { getSchoolId } from "../../hooks/getSchoolId";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ChevronDown, GraduationCap, Sparkles } from "lucide-react";


// Hook baru untuk profil sekolah (hanya ini yang ditambah)
const useSchoolProfile = () => {
  const schoolId = getSchoolId(); // ← sesuaikan dengan ID sekolah yang ada di database

  const API_BASE = 'https://be-school.kiraproject.id';

  return useQuery({
    queryKey: ['schoolProfile', schoolId],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/profileSekolah?schoolId=${schoolId}`, {
        cache: 'no-store',
      });
      if (!res.ok) throw new Error(`Gagal mengambil profil sekolah: ${res.status}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Response tidak valid");
      return data.data; // null atau objek profil
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};


export const HeroComp13 = ({titleProps, subTitleProps, id}: {titleProps?: string, subTitleProps?: string, id?: string}) => {
  const { data: profile } = useSchoolProfile();
  const containerRef = useRef(null);
  
  // Efek Parallax sederhana saat scroll
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#020617] py-20 z-[4]"
    >
      <div>
        {/* 1. DYNAMIC BACKGROUND ENGINE */}
        <div className="absolute inset-0 z-0">
          {/* Overlay Gradients - Lebih pekat di bawah untuk transisi smooth ke section berikutnya */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/40 via-slate-950/80 to-[#020617] z-[2]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent z-[1]" />
          
          <motion.img 
            style={{ y: y1 }}
            initial={{ scale: 1.1, filter: "blur(4px)" }}
            animate={{ scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            src={profile?.heroImageUrl || '/hero2.png'} 
            className="w-full h-full object-cover opacity-40"
          />
        </div>

        {/* 2. FLOATING DECORATION (Premium Touch) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div 
            animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/4 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]" 
          />
          <motion.div 
            animate={{ y: [0, 20, 0], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-1/4 right-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-[120px]" 
          />
        </div>

        {/* 3. MAIN CONTENT */}
        <motion.div 
          style={{ opacity }}
          className="relative z-[2] max-w-7xl mt-[-36px] mx-auto px-6 text-center"
        >
          {/* Badge Atas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
          >
            <Sparkles size={14} className="text-blue-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-100">
              Official Website Sekolah SLTA - Jakarta
            </span>
          </motion.div>

          {/* Headline dengan Efek Text Reveal */}
          {(() => {
            const fullTitle = titleProps ? titleProps : profile?.heroTitle || "SELAMAT DATANG DI SEKOLAH YANG BERKARAKTER";
            const words = fullTitle.split(" ");
            
            // Jika hanya satu kata, tampilkan langsung dengan underline
            if (words.length <= 1) {
              return (
                <motion.h1 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="text-5xl md:text-7xl font-[1000] text-white leading-[1] mb-8 tracking-tighter"
                >
                  <span className="underline decoration-normal decoration-blue-600 underline-offset-8">
                    {fullTitle}
                  </span>
                </motion.h1>
              );
            }

            const lastWord = words.pop();
            const remainingText = words.join(" ");

            return (
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="text-3xl md:text-7xl font-[1000] text-white leading-[1] mb-8 tracking-tighter"
              >
                {remainingText}{" "}
                <span className="text-transparent stroke-white [-webkit-text-stroke:2px_white] underline decoration-normal decoration-blue-600 italic underline-offset-8">
                  {lastWord}
                </span>
              </motion.h1>
            );
          })()}
          {/* SubtitleProps */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-md md:text-xl text-blue-100/60 mx-auto max-w-4xl mb-12 leading-relaxed font-light italic"
          >
            {subTitleProps ? subTitleProps : profile?.heroSubTitle || "Menghadirkan standar pendidikan internasional dengan nilai-nilai luhur budaya bangsa."}
          </motion.p>

          {/* Button Group */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="w-full flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <a 
              href={`${id ? id : '#sambutan'}`} 
              className="w-[80%] md:w-[260px] flex justify-center group relative px-6 md:px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-sm transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-blue-600/40 overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
              <span className="relative flex items-center gap-3">
                AYO MENJELAJAH <ArrowRight size={18} />
              </span>
            </a>

            <a href={`/ppdb`} target="_blank" className="w-[80%] md:w-[260px]">
              <button className="w-full md:w-[260px] justify-center px-10 py-5 bg-white/5 hover:bg-white/10 backdrop-blur-xl text-white border border-white/10 rounded-2xl font-black text-sm transition-all flex items-center gap-3">
                PPDB {new Date().getFullYear()}
                <GraduationCap size={20} /> 
              </button>
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* 4. SCROLL INDICATOR */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="relative top-10 w-full z-[2] text-white/30"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[9px] font-black uppercase tracking-widest">Scroll Down</span>
          <ChevronDown size={20} />
        </div>
      </motion.div>
    </section>
  );
};
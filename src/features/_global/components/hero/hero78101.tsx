import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import { getSchoolId } from "../../hooks/getSchoolId";

// Hook profil sekolah
const useSchoolProfile = () => {
  const schoolId = getSchoolId();
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
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

const SafeImage = ({ src, alt, className, style }: any) => {
  const [failed, setFailed] = useState(false);
  if (failed || !src) {
    return (
      <div className={className} aria-label={alt || 'image'}
           style={{ ...style, background: "repeating-linear-gradient(45deg, #e2e8f0 0 10px, #cbd5e1 10px 20px)" }} />
    );
  }
  return <img src={src} alt={alt || ''} className={className} style={style} loading="lazy" decoding="async"
               referrerPolicy="no-referrer" crossOrigin="anonymous" onError={() => setFailed(true)} />;
};

interface HeroProps {
  id?: string;
  titleProps?: string;
  subTitleProps?: string;
}

export const HeroComp78101 = ({ id, titleProps, subTitleProps }: HeroProps) => {
  const { data: profile, isPending } = useSchoolProfile();

  // Prioritas: Props > Data API > Default Text
  const title = titleProps || (!isPending && profile?.heroTitle) || "SEKOLAH BERPRESTASI DAN BERKARAKTER";
  const subTitle = subTitleProps || (!isPending && profile?.heroSubTitle) || 
    "Jadilah bagian dari generasi berprestasi dengan fasilitas modern, pembelajaran inovatif, dan kegiatan ekstrakurikuler yang mendukung potensi terbaik Anda.";

  return (
    <section id={id} className="relative h-[90vh] md:mt-[0px] md:pt-0 pt-14 w-full overflow-hidden bg-[#01040a]">
      {/* --- Background Logic --- */}
      <div className="absolute inset-0 z-0">
        <SafeImage 
          src={profile?.heroImageUrl || '/hero2.png'} 
          alt={title} 
          className="w-full h-full object-cover opacity-40 scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#01040a] via-[#01040a]/95 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#01040a] via-transparent to-[#01040a]/50" />
      </div>

      {/* --- Orbit Lines --- */}
      <div className="absolute top-1/2 -right-32 md:-right-60 -translate-y-1/2 z-[4] pointer-events-none">
          <svg width="800" height="800" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <motion.circle 
              cx="400" cy="400" r="180" 
              stroke="white" 
              strokeWidth="2.5" 
              strokeLinecap="round"
              strokeDasharray="120 400"
              filter="url(#glow)"
              initial={{ rotate: 0 }} 
              animate={{ rotate: 360 }} 
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: 'center', opacity: 0.8 }}
            />

            <motion.circle 
              cx="400" cy="400" r="260" 
              stroke="white" 
              strokeWidth="1" 
              strokeDasharray="5 15"
              initial={{ rotate: 360 }} 
              animate={{ rotate: 0 }} 
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: 'center', opacity: 0.4 }}
            />

            <motion.g
              initial={{ rotate: 0 }} 
              animate={{ rotate: 360 }} 
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: 'center' }}
              className="md:flex hidden"
            >
              <circle 
                cx="400" cy="400" r="340" 
                stroke="white" 
                strokeWidth="1.5" 
                strokeDasharray="200 800"
                style={{ opacity: 0.6 }}
              />
              <circle cx="400" cy="400" r="5" fill="white" filter="url(#glow)" />
            </motion.g>

            <circle 
              cx="400" cy="400" r="390" 
              stroke="white" 
              strokeWidth="0.5" 
              style={{ opacity: 0.2 }} 
            />
          </svg>
      </div>

      {/* --- Main Content --- */}
      <div className="relative z-[5] container mx-auto mt-[-4px] px-6 md:px-2 h-full flex items-center">
        <div className="max-w-7xl">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="w-10 h-[2px] bg-blue-600 shadow-[0_0_15px_#2563eb]" />
            <span className="text-blue-500 font-bold tracking-[0.5em] text-[10px] uppercase">
              Leading the Future
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-[75px] ml-[-2px] w-[90%] font-black text-white leading-tight md:leading-[1] tracking-tighter mb-8 uppercase"
          >
            {title}
            <span className="text-blue-600 hidden md:inline">.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.4 }}
            className="text-slate-300 text-md md:text-lg font-light w-full md:max-w-[70%] leading-relaxed mb-12 border-l-2 border-blue-900 pl-6"
          >
            {subTitle}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-5"
          >
            <a 
              href={id} 
              className="px-10 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-500 transition-all shadow-[0_0_25px_rgba(37,99,235,0.4)] text-center group"
            >
              Eksplorasi Sekarang
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </a>
            
            <a 
              href="/ppdb" 
              className="px-10 py-4 border border-blue-500/30 text-white font-medium rounded-full hover:bg-blue-500/10 transition-all text-center backdrop-blur-sm"
            >
              Pendaftaran Siswa
            </a>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-[#01040a] to-transparent z-10" />
    </section>
  );
};
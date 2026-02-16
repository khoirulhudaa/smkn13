import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react"; // Install lucide-react jika belum ada
import { useMemo, useRef, useState } from "react";
import { getSchoolId } from "../../hooks/getSchoolId";

// ... (useSchoolProfile Hook tetap sama)
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

export const HeroComp40 = ({ id, titleProps, subTitleProps }: any) => {
  const { data: profile, isPending } = useSchoolProfile();
  const [isMuted, setIsMuted] = useState(true);
  const playerRef = useRef<HTMLIFrameElement>(null);

  const title = isPending || !profile?.heroTitle ? titleProps : profile.heroTitle;
  const subTitle = isPending || !profile?.heroSubTitle ? subTitleProps : profile.heroSubTitle;
  const videoId = useMemo(() => {
    return getYoutubeId(profile?.linkYoutube);
  }, [profile?.linkYoutube]);

  // Fungsi untuk mengirim pesan ke YouTube API
  const toggleMute = () => {
    const command = isMuted ? 'unMute' : 'mute';
    playerRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func: command, args: [] }),
      '*'
    );
    setIsMuted(!isMuted);
  };

  function getYoutubeId(url: string) {
    if (!url) return "L6RvJtXSLlE";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : "L6RvJtXSLlE";
  }

  const renderTitle = (text: string) => {
    if (!text) return null;
    const words = text.split(" ");
    const lastTwo = words.slice(-2).join(" ");
    const firstPart = words.slice(0, -2).join(" ");

    return (
      <span className="block">
        {firstPart}{" "}
        <span className="relative text-transparent bg-clip-text px-2 w-max bg-gradient-to-r from-blue-400 to-indigo-200 italic font-serif">
          {lastTwo}
          <motion.span 
            initial={{ width: 0 }}
            whileInView={{ width: '100%' }}
            transition={{ duration: 1, delay: 0.8 }}
            className="absolute bottom-2 md:flex hidden w-max left-0 h-[2px] bg-blue-500/50"
          />
        </span>
      </span>
    );
  };

  return (
    <section className="relative md:mt-[-100px] h-[85vh] md:h-[110vh] w-full bg-black flex items-center justify-center">
      
      {/* --- Fullscreen Video Wrapper --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <iframe
          ref={playerRef}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&enablejsapi=1&start=6`}
          allow="autoplay; encrypted-media"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                     w-[100vw] h-[56.25vw] min-h-[200vh] min-w-[177.77vh]"
          style={{ border: 'none', aspectRatio: '16/9' }}
          title="Hero Background Video"
        />
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black/80" />
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
      </div>

      {/* --- Content Area --- */}
      <div className="relative z-10 container flex flex-col justify-center items-center mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-7xl mt-[70px] md:mt-[60px] mx-auto"
        >
          {/* ... (Konten Judul & Tombol lainnya tetap sama) ... */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="hidden md:inline-block px-4 py-1 mb-6 border border-blue-800 rounded-full bg-blue-500/10 backdrop-blur-sm"
          >
            <span className="text-xs font-medium tracking-[0.3em] text-blue-400 uppercase">
              Official website at SMAN 40 Jakarta Utara
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl md:text-7xl font-bold text-white leading-[1.1] tracking-tighter mb-8"
          >
            {renderTitle(titleProps ? titleProps : title)}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-md md:text-xl text-gray-300 font-light w-full md:max-w-2xl mx-auto leading-relaxed mb-12"
          >
            {subTitleProps ? subTitleProps : subTitle}
          </motion.p>

          <div className="mt-12 flex flex-col md:flex-row gap-6 mx-auto w-full md:w-max justify-center items-center">
            <a href={id} className="w-full md:w-max justify-center sm:w-auto flex items-center gap-1 px-12 py-5 bg-blue-700 hover:bg-blue-600 text-white border-2 border-white/50 font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-[0_10px_40px_rgba(37,99,235,0.4)]">
              MULAI PENELUSURAN
            </a>
            <button
                onClick={toggleMute}
                className="md:flex hidden z-30 p-4 opacity-[70%] bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl text-white transition-all duration-300"
                aria-label="Toggle Mute"
            >
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
            <a href="/ppdb" className="w-full md:w-max justify-center flex sm:w-auto px-12 py-5 bg-transparent border-2 border-white/50 hover:border-white text-white font-bold rounded-2xl transition-all duration-300 backdrop-blur-md">
              PENDAFTARAN SISWA
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroComp40;
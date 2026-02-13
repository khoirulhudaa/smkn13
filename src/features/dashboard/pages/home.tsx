import { SMAN25_CONFIG } from "@/core/theme";
import { getXHostHeader } from "@/core/utils/XHostHeader";
import BeritaComp from "@/features/_global/components/berita";
import { FooterComp } from "@/features/_global/components/footer";
import GalleryComp from "@/features/_global/components/galeri";
import { HeroComp } from "@/features/_global/components/hero";
import NavbarComp from "@/features/_global/components/navbar";
import { SambutanComp } from "@/features/_global/components/sambutan";
import { getSchoolId } from "@/features/_global/hooks/getSchoolId";
import { queryClient } from "@/features/_root/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, FileCheck, HelpCircle, Instagram, Mail, MessageCircle, Play, SquareArrowOutUpRight, Thermometer, UserCheck, UserX } from "lucide-react";
import { useEffect, useState } from "react";

const BASE_URL = 'https://be-school.kiraproject.id/profileSekolah';
const BASE_URL2 = 'https://be-school.kiraproject.id';

interface SchoolProfile {
  schoolId?: number;
  schoolName?: string;
  headmasterName?: string;
  headmasterWelcome?: string;
  heroTitle?: string;
  heroSubTitle?: string;
  photoHeadmasterUrl?: string;
  studentCount?: number;
  teacherCount?: number;
  roomCount?: number;
  achievementCount?: number;
  linkYoutube?: string;
}

// --- SHARED COMPONENTS & HELPERS ---
const SectionHeader = ({ title, subtitle, light = false }: any) => (
  <div className="mb-16 text-center">
    <motion.span 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      className={`inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-[0.2em] uppercase rounded-full ${light ? 'bg-blue-400/10 text-blue-300 border border-blue-400/20' : 'bg-blue-50 text-blue-700'}`}
    >
      Official Information
    </motion.span>
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className={`text-3xl md:text-5xl font-black mb-6 ${light ? 'text-white' : 'text-slate-900'}`}
    >
      {title}
    </motion.h2>
    <div className={`w-24 h-1.5 mx-auto rounded-full bg-blue-600 mb-6`} />
    <p className={`w-[96%] md:max-w-2xl mx-auto text-sm md:text-lg ${light ? 'text-blue-100/70' : 'text-slate-600'}`}>{subtitle}</p>
  </div>
);

const useStats = () => {
  const xHost = getXHostHeader();
  return useQuery({
    queryKey: ['stats', xHost],
    queryFn: async () => {
      const res = await fetch("https://dev.kiraproject.id/public/statistics/daily", {
        cache: 'no-store',
        headers: { 'X-Host': xHost, 'Cache-Control': 'no-store' },
      });
      if (!res.ok) throw new Error("Failed to fetch statistics");
      const data = await res.json();
      if (!data.success) throw new Error("Invalid response");
      return [
        { k: "HADIR", v: data.data.hadirHariIni },
        { k: "IZIN", v: data.data.izinSakit },
        { k: "TERLAMBAT", v: data.data.terlambat },
        { k: "GURU HADIR", v: data.data.guruHadir },
      ];
    },
  });
};

export function useNews(schoolId: string | number | undefined) {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolId) {
      setError("schoolId tidak ditemukan");
      setLoading(false);
      return;
    }

    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`https://be-school.kiraproject.id/berita?schoolId=${schoolId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Jika nanti pakai autentikasi: "Authorization": `Bearer ${token}`,
          },
          cache: "no-store", // agar selalu fresh
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();

        if (!json.success) {
          throw new Error(json.message || "Gagal mengambil berita");
        }

        // Mapping data sesuai struktur backend baru
        const mappedNews = json.data.map((item: any) => ({
          id: item.id,
          title: item.title,
          date: new Date(item.publishDate).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          tag: item.category || "Umum",
          img: item.imageUrl || "/default-news.jpg",
          excerpt: item.content.substring(0, 150) + "...", // potong jadi excerpt
          source: item.source || "Sekolah",
        }));

        setNews(mappedNews);
      } catch (err: any) {
        console.error("Fetch news error:", err);
        setError(err.message || "Gagal memuat berita");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [schoolId]);

  return { news, loading, error };
}

interface Facility {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string | null;
}

const FasilitasSection = () => {
  const schoolId = getSchoolId();

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolId) {
      setError("School ID tidak ditemukan");
      setLoading(false);
      return;
    }

    const fetchFacilities = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`https://be-school.kiraproject.id/fasilitas?schoolId=${schoolId}`, {
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();

        if (!json.success || !Array.isArray(json.data)) {
          throw new Error("Format response tidak valid");
        }

        // Mapping data dari backend
        const mapped = json.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          imageUrl: item.imageUrl || null,
        }));

        setFacilities(mapped);
      } catch (err: any) {
        console.error("Fetch fasilitas error:", err);
        setError(err.message || "Gagal memuat fasilitas");
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, [schoolId]);

  if (loading) {
    return (
      <section className="py-8 md:py-20 bg-gradient-to-b from-indigo-100 via-purple-50 to-white">
        <div className="max-w-7xl mx-auto md:px-0 px-4 text-center4">
          <p className="text-gray-600">Memuat fasilitas sekolah...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8 md:py-20 bg-gradient-to-b from-indigo-100 via-purple-50 to-white">
        <div className="max-w-7xl mx-auto md:px-0 px-4 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </section>
    );
  }

  if (facilities.length === 0) {
    return (
      <section className="py-8 md:py-20 bg-gradient-to-b from-indigo-100 via-purple-50 to-white">
        <div className="max-w-7xl mx-auto md:px-0 px-6 md:text-center">
          <h2 className="text-3xl md:text-5xl font-black" style={{ color: "black" }}>
            Fasilitas <span className="text-blue-700 italic underline decoration-normal">Sekolah</span>
          </h2>
          <div className="w-full h-[200px] mt-12 rounded-lg border border-black/30 bg-gray-400/5 flex justify-center items-center">
            <p className="text-gray-500 mt-4">Belum ada data fasilitas yang tersedia saat ini.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* <SectionHeader 
          title="Fasilitas Sekolah" 
          subtitle="Lingkungan belajar yang didukung teknologi terkini untuk menunjang kreativitas siswa." 
        /> */}

        <div className="md:text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-xs font-bold tracking-widest uppercase mb-4"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            Bangunan layak dan nyaman
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-black text-slate-900 mb-6"
          >
            Fasilitas <span className="text-blue-600 italic underline direction-normal  ">Sekolah</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 max-w-2xl mx-auto text-lg font-light"
          >
            Lingkungan belajar yang didukung teknologi terkini untuk menunjang kreativitas siswa.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[240px]">
          {facilities.map((item, i) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -10 }}
              className={`group relative rounded-[2rem] overflow-hidden shadow-xl z-[4] ${
                i === 0 ? "md:col-span-2 md:row-span-2" : i === 1 ? "md:col-span-2" : ""
              }`}
            >
              <img src={item.imageUrl || "/default-facility.jpg"} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="w-full absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/20 to-transparent p-8 flex flex-col justify-end">
                <h3 className="text-white font-black leading-tight text-2xl 
                  group-hover:text-blue-800 group-hover:bg-white w-max group-hover:italic 
                    duration-200 transition-all 
                    truncate block max-w-full group-hover:px-4">
                  {item.name}
                </h3>
                <p className="text-blue-100 text-sm mt-2 line-clamp-2 font-light">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
};
const PengurusSection = () => {
  const [pengurus, setPengurus] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const SCHOOL_ID = getSchoolId(); 
  const API_URL = `https://be-school.kiraproject.id/guruTendik?schoolId=${SCHOOL_ID}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);
        const result = await response.json();

        // 1. Definisikan Struktur 4 Pilar Utama
        const mainRoles = [
          { key: "Kepala Sekolah", label: "Kepala Sekolah" },
          { key: "Komite Sekolah", label: "Komite Sekolah" },
          { key: "Wakil Kepala Sekolah", label: "Wakil Kepala Sekolah" },
          { key: "Kepala Tata Usaha", label: "Kepala Tata Usaha" }
        ];

        if (result.success) {
          const allData = result.data;

          // 2. Map setiap pilar: Ambil dari API jika ada, jika tidak pakai data dummy
          const mergedData = mainRoles.map((role) => {
            const found = allData.find((item: any) => item.role === role.key);
            
            if (found) {
              return {
                jabatan: found.role,
                nama: found.nama,
                img: found.photoUrl || '/kapalaSekolah.png',
                email: found.email,
                isPlaceholder: false
              };
            } else {
              // Data Dummy jika tidak ditemukan di API
              return {
                jabatan: role.label,
                nama: "Nama Tenaga Pendidik",
                img: null,
                email: "#",
                isPlaceholder: true
              };
            }
          });

          setPengurus(mergedData);
        }
      } catch (error) {
        console.error("Gagal mengambil data guru:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="py-24 text-center">Memuat data pilar pendidikan...</div>;
  }

  return (
    <section className="py-12 md:py-24 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-6 relative z-[4]">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-blue-600 font-bold tracking-[0.2em] uppercase text-sm"
            >
              Leadership Team
            </motion.span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mt-2">
              Pilar <span className="text-blue-600 italic underline">Pendidikan</span>
            </h2>
          </div>
          <p className="text-slate-600 max-w-sm font-light leading-relaxed">
            Kepala Sekolah, Komite Sekolah, Wakil Kepala Sekolah, Kepala Tata Usaha
          </p>
        </div>

        {/* Grid Section */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 z-[4]">
          {pengurus.map((item: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`group z-[4] ${item.isPlaceholder ? 'opacity-60' : ''}`}
            >
              <div className={`relative z-[4] rounded-[2rem] overflow-hidden mb-6 aspect-[3/4] shadow-lg transition-all duration-500 
                ${item.isPlaceholder 
                  ? 'bg-slate-200 border-2 border-dashed border-slate-300 flex items-center justify-center grayscale' 
                  : 'bg-slate-100 shadow-blue-900/5'}`}
              >
                {item.isPlaceholder ? (
                  <span className="text-slate-500 font-medium px-4 text-center">{item.jabatan}</span>
                ) : (
                  <>
                    <img 
                      src={item.img} 
                      alt={item.nama} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-6 right-6 flex flex-col gap-3 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                      <a href={`mailto:${item.email}`} className="w-10 h-10 p-2 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 hover:bg-blue-600 transition-colors">
                        <Mail size={20} />
                      </a>
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-1 text-center md:text-left px-2">
                <p className="text-blue-600 font-bold text-xs uppercase tracking-widest">
                  {item.jabatan}
                </p>
                <h3 className={`text-lg font-bold transition-colors ${item.isPlaceholder ? 'text-slate-500 font-medium' : 'text-slate-900 group-hover:text-blue-700'}`}>
                  {item.nama}
                </h3>
                <div className={`h-1 transition-all duration-500 rounded-full mt-2 ${item.isPlaceholder ? 'w-4 bg-slate-200' : 'w-8 bg-slate-200 group-hover:w-16 group-hover:bg-blue-600'}`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const VideoSection = () => {
  const [profile, setProfile] = useState<SchoolProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const SCHOOL_ID = getSchoolId();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}?schoolId=${SCHOOL_ID}`);
        const result = await res.json();
        if (result.success) setProfile(result.data);
      } catch (err) {
        console.error('Gagal memuat video profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [SCHOOL_ID]);

  const getYouTubeId = (url?: string): string | null => {
    if (!url) return null;
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeId(profile?.linkYoutube);
  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;

  return (
    <section className="py-12 md:py-20 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-[2]">
        <div className="md:text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-xs font-bold tracking-widest uppercase mb-4"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            Audio Visual Experience
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-black text-slate-900 mb-6"
          >
            Tentang <span className="text-blue-600 italic underline direction-normal  ">Kami</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 max-w-2xl mx-auto text-lg font-light"
          >
            {profile?.schoolName || 'SMAN 25 Jakarta'} dalam lensa kamera. Saksikan berbagai aktivitas, prestasi, dan kebersamaan kami.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-7xl mx-auto"
        >          
          <div className="relative z-[4] bg-white p-3 md:p-5 rounded-[2.5rem] shadow-2xl shadow-blue-900/10 border border-blue-800/80">
            <div className="relative aspect-video rounded-[1.8rem] overflow-hidden bg-slate-900 group">
              {loading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 animate-pulse">
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-blue-900 font-bold tracking-widest">LOADING CINEMATIC...</p>
                </div>
              ) : !videoId ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 text-center px-6">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Video Belum Tersedia</h3>
                  <p className="text-slate-500 mt-2 font-light">Kami sedang menyiapkan konten video terbaik untuk Anda.</p>
                </div>
              ) : (
                <>
                  <iframe
                    width="100%"
                    height="100%"
                    src={embedUrl}
                    title="School Profile Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                  {/* Decorative frame inner shadow */}
                  <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.2)]" />
                </>
              )}
            </div>
          </div>

          {/* Video Metadata Tag (Bottom Right) */}
          {!loading && videoId && (
            <div className="absolute -bottom-6 -right-6 md:right-10 bg-blue-600 text-white px-8 z-[5] py-4 rounded-2xl shadow-xl hidden md:block">
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-80 mb-1">Official Video</p>
              <p className="font-bold text-sm">PROFIL SEKOLAH 2024/2025</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

const InstagramFeedSection = ({ theme }: any) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const schoolId = getSchoolId();
        const response = await fetch(`${BASE_URL2}/feed?schoolId=${schoolId}`);
        const result = await response.json();
        if (result.success) setPosts(result.data);
      } catch (error) {
        console.error("Gagal mengambil data feed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeeds();
  }, []);

  return (
    <section className="py-12 md:py-24 bg-slate-50 relative overflow-hidden">
      {/* Abstract Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Modern Header */}
        <div className="flex flex-col md:flex-row items-start justify-between mb-16 gap-6 text-left">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center md:justify-start gap-2 text-blue-600 font-black tracking-widest text-xs uppercase mb-3"
            >
              <Instagram size={18} strokeWidth={3} /> Social Connect
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-[900] text-slate-900 leading-none">
              Instagram <span className="text-blue-600  italic underline direction-normal">Feed</span>
            </h2>
          </div>
          <a 
            href="https://instagram.com" target="_blank"
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-blue-600/20 flex items-center gap-3 group"
          >
            Follow Our Activities
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="aspect-square bg-slate-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-20 text-center">
             <p className="text-slate-400 font-bold italic">No recent activities found on social media.</p>
          </div>
        ) : (
          /* INSTAGRAM STYLE GRID */
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
            {posts.map((post: any, i: number) => (
              <motion.a
                key={post.id || i}
                href={post.postLink}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="group relative aspect-square rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden bg-slate-900 shadow-xl shadow-blue-900/5"
              >
                {/* Media */}
                {post.mediaType === "video" ? (
                  <video className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" muted loop autoPlay>
                    <source src={post.mediaUrl} type="video/mp4" />
                  </video>
                ) : (
                  <img 
                    src={post.mediaUrl} 
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-50 transition-all duration-700 group-hover:scale-110" 
                  />
                )}

                {/* Overlay on Hover (Instagram Style) */}
                <div className="absolute inset-0 flex items-center justify-center bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                   <div className="flex gap-6 text-white font-black text-lg">
                      <div className="flex items-center gap-2">
                        <SquareArrowOutUpRight size={24} /> <span className="drop-shadow-md">Kungjungi</span>
                      </div>
                   </div>
                </div>

                {/* Video Indicator */}
                {post.mediaType === "video" && (
                  <div className="absolute top-4 right-4 text-white drop-shadow-lg">
                    <Play size={20} fill="white" />
                  </div>
                )}

                {/* Bottom Caption (Subtle) */}
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-blue-950 to-transparent">
                   <p className="text-white text-[10px] md:text-xs font-medium line-clamp-2 italic opacity-90">
                     {post.caption}
                   </p>
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// Ikon tambahan untuk header
const ArrowRight = ({ className, size }: any) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);

// === STATS BAR ===
const StatsBar = () => {
  const { data: stats = [], isPending, error } = useStats();

  // Daftar icon sesuai urutan stats (sesuaikan dengan data stats kamu)
  const icons = [
      <UserCheck className="w-12 h-12 md:w-12 md:h-12 p-3 rounded-md bg-green-600 text-white" />,     // Kehadiran
      <UserX className="w-12 h-12 md:w-12 md:h-12 p-3 rounded-md bg-red-600 text-white" />,           // Alpha
      <Thermometer className="w-12 h-12 md:w-12 md:h-12 p-3 rounded-md bg-orange-600 text-white" />,  // Sakit
      <FileCheck className="w-12 h-12 md:w-12 md:h-12 p-3 rounded-md bg-blue-600 text-white" />,      // Izin
  ];

  if (isPending) return <div className="py-6 text-center">Loading stats...</div>;
  if (error) return <div className="py-6 text-red-400 text-center">Error: {error.message}</div>;

  return (
    <section id="stats" className="w-full md:w-7xl px-2 md:px-16 rounded-2xl mx-auto relative py-6 mt-[-60px] h-max">
      <div className="w-full mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-6">
          {stats.map((s: any, i: number) => (
            <motion.div
              key={s.k}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl px-6 border shadow-lg h-[110px] bg-white pb-0 border-gray-300 flex flex-col items-start justify-center"
            >
              <div className="flex items-center gap-6 relative mt-1">
                {/* Icon */}
                <div className="text-black h-full w-[30%] opacity-80">
                  {icons[i] || null} {/* fallback null jika urutan tidak cocok */}
                </div>
                <div className="flex flex-col h-max items-start gap-2 text-xl md:text-2xl font-bold" style={{ color: 'black' }}>
                  {/* Label */}
                  <div className="text-xs md:text-[16px] w-max opacity-80" style={{ color: 'black' }}>
                    {s.k}
                  </div>
                  <div className="w-max flex items-center gap-2">
                    {s.v} 
                    <p className="text-sm font-normal text-gray-500">
                      Orang
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const useComments = (schoolId: number) => {   // parameter tetap number
  const API_BASE = 'https://be-school.kiraproject.id';

  const query = useQuery({
    queryKey: ['comments', schoolId],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/rating?schoolId=${schoolId}`, {
        cache: 'no-store',
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Gagal memuat komentar');
      return data.data || [];
    },
    staleTime: 2 * 60 * 1000,
  });

  const mutation = useMutation({
    mutationFn: async (newComment: { name: string; email: string; comment: string; rating: number }) => {
      const res = await fetch(`${API_BASE}/rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          ...newComment,
          schoolId,              
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Gagal mengirim komentar');
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', schoolId] });
    },
  });

  return { ...query, mutate: mutation.mutate, isSubmitting: mutation.isPending };
};

const CommentSection = () => {
  const schoolId: any = getSchoolId();  // ← number, bukan string "88"

  const { data: comments = [], isPending, error } = useComments(schoolId);
  const { mutate, isSubmitting } = useComments(schoolId);

  const [form, setForm] = useState({
    name: '',
    email: '',
    comment: '',
    rating: 5,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (value: number) => {
    setForm(prev => ({ ...prev, rating: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.comment.trim()) {
      alert('Nama dan komentar wajib diisi');
      return;
    }

    // Catatan: userId sementara kita hardcode atau bisa ambil dari auth nanti
    mutate({
      email: form.email.trim() || 'anonymous@example.com',
      name: form.name.trim(),
      comment: form.comment.trim(),
      rating: form.rating,
    }, {
      onSuccess: () => {
        setForm({ name: '', email: '', comment: '', rating: 5 });
        alert('Terima kasih atas ulasan Anda!');
      },
      onError: (err: any) => {
        alert('Gagal mengirim: ' + (err.message || 'Unknown error'));
      }
    });
  };

  return (
   <section className="relative overflow-hidden bg-[#0f172a] py-16 md:py-24">
      {/* Decorative Blur - Disesuaikan ukurannya agar tidak 'bocor' di mobile */}
      <div className="absolute -right-20 -top-20 z-0 h-[300px] w-[300px] rounded-full bg-blue-700 opacity-40 blur-[80px] md:h-[800px] md:w-[800px] md:opacity-60 md:blur-[120px]" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader 
          light 
          title="Suara Akademik" 
          subtitle="Apa kata mereka tentang pengalaman belajar di sekolah kami?" 
        />

        {/* Container Form dengan Adaptive Padding & Radius */}
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/20 bg-white/5 p-6 backdrop-blur-xl shadow-2xl md:rounded-[3rem] md:p-12">
          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            
            {/* Input Nama & Email */}
            <div className="grid gap-6 md:grid-cols-2 md:gap-8">
              <div className="space-y-3">
                <label className="ml-1 block text-xs font-bold uppercase tracking-[0.2em] text-blue-300 md:text-sm">
                  Nama Lengkap
                </label>
                <input 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange} 
                  required
                  className="w-full rounded-2xl border border-white/20 bg-white/5 px-5 py-4 text-white outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 md:px-6" 
                  placeholder="Contoh: Budi Santoso"
                />
              </div>

              <div className="space-y-3">
                <label className="ml-1 block text-xs font-bold uppercase tracking-[0.2em] text-blue-300 md:text-sm">
                  Email
                </label>
                <input 
                  type="email" 
                  name="email" 
                  value={form.email} 
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/20 bg-white/5 px-5 py-4 text-white outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 md:px-6" 
                  placeholder="budi@email.com"
                />
              </div>
            </div>

            {/* Rating Selector - Dibuat lebih touch-friendly di mobile */}
            <div className="space-y-3">
              <label className="ml-1 block text-xs font-bold uppercase tracking-[0.2em] text-blue-300 md:text-sm">
                Rating Anda
              </label>
              <div className="flex w-max gap-2 rounded-2xl border border-white/20 bg-white/5 p-2 md:p-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star} 
                    type="button" 
                    onClick={() => handleRatingChange(star)} 
                    className={`text-2xl transition-all duration-300 hover:scale-125 md:text-3xl ${
                      star <= form.rating ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]' : 'text-white/20'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Textarea */}
            <div className="space-y-3">
              <label className="ml-1 block text-xs font-bold uppercase tracking-[0.2em] text-blue-300 md:text-sm">
                Pesan & Kesan
              </label>
              <textarea 
                name="comment" 
                value={form.comment} 
                onChange={handleChange} 
                required 
                rows={4}
                className="w-full rounded-2xl border border-white/20 bg-white/5 px-5 py-4 text-white outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 md:px-6"
                placeholder="Tuliskan ulasan Anda..."
              />
            </div>

            {/* Submit Button - Animasi Hover & Loading State */}
            <button 
              disabled={isSubmitting}
              className="group relative w-full overflow-hidden rounded-2xl bg-blue-600 py-4 text-base font-black tracking-widest text-white transition-all hover:bg-blue-500 hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] disabled:bg-slate-700 md:py-5 md:text-lg"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    MENGIRIM...
                  </>
                ) : (
                  'KIRIM ULASAN SEKARANG'
                )}
              </span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

interface Sponsor {
  id: number;
  name: string;
  imageUrl?: string | null;
}

const SponsorMarqueeSection = () => {
  const schoolId = getSchoolId();

  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!schoolId) return;

    const fetchSponsors = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://be-school.kiraproject.id/partner?schoolId=${schoolId}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Gagal memuat sponsor");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setSponsors(json.data);
        }
      } catch (err) {
        console.error("Error fetch sponsor:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSponsors();
  }, [schoolId]);

  // Duplikat data agar terlihat seamless infinite loop
  const duplicatedSponsors = [...sponsors, ...sponsors];

  if (loading || sponsors.length === 0) {
    return null; 
  }

  return (
    <section className="py-12 md:py-16 bg-gradient-to-r from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto md:px-0 px-4 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800">
          Mitra & Sponsor Kami
        </h2>

        <div className="relative mt-16">
          {/* Marquee container */}
          <div
            className="flex animate-marquee hover:pause-marquee whitespace-nowrap"
            style={{
              animation: "marquee 30s linear infinite",
            }}
          >
            {duplicatedSponsors.map((sponsor, index) => (
              <div
                key={`${sponsor.id}-${index}`}
                className="flex-shrink-0 mx-2 flex flex-col items-center justify-center"
                style={{ minWidth: "200px" }}
              >
                {sponsor.imageUrl ? (
                  <img
                    src={sponsor.imageUrl}
                    alt={sponsor.name}
                    className="h-20 md:h-24 w-auto object-contain transition-all duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-16 md:h-20 w-32 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
                    Logo
                  </div>
                )}
                {/* <p className="mt-3 text-sm text-gray-600 font-medium text-center">
                  {sponsor.name}
                </p> */}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CSS Animasi */}
      <style jsx global>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .pause-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

const useFAQs = (schoolId: string | number) => {
  const [faqs, setFaqs] = useState<Array<{ question: string; answer: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolId) {
      setError("schoolId tidak ditemukan");
      setLoading(false);
      return;
    }

    const fetchFAQs = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`https://be-school.kiraproject.id/faq?schoolId=${schoolId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();

        if (!json.success || !Array.isArray(json.data)) {
          throw new Error(json.message || "Format response FAQ tidak valid");
        }

        // Flatten semua faqs dari record-record yang aktif
        const allFaqs = json.data
          .filter((entry: any) => entry.isActive !== false)
          .flatMap((entry: any) =>
            Array.isArray(entry.faqs) ? entry.faqs : []
          )
          .filter((faq: any) => faq?.question?.trim() && faq?.answer?.trim());

        setFaqs(allFaqs);
      } catch (err: any) {
        console.error("Fetch FAQ error:", err);
        setError(err.message || "Gagal memuat FAQ");
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, [schoolId]);

  return { faqs, loading, error };
};

const FAQSection = () => {
  const SCHOOL_ID = getSchoolId();
  const { faqs, loading, error } = useFAQs(SCHOOL_ID);
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Default buka item pertama

  if (loading) return (
    <div className="py-24 text-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-slate-500 font-bold">Mengambil informasi...</p>
    </div>
  );

  return (
    <section className="py-12 md:py-24 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50 -z-10 hidden md:block" />
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-blue-100 rounded-full blur-[100px] opacity-60" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="gap-16 w-full text-center flex flex-col justify-center items-center">
          
          {/* KIRI: Header Content */}
          <div className="w-full flex flex-col justify-center items-center text-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="relative w-full flex flex-col justify-center text-center items-center mx-auto"
            >
              <div className="w-max mx-auto inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 mb-6">
                <HelpCircle size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">Help Center</span>
              </div>
              <h2 className="w-[90%] md:w-max text-4xl text-center mx-auto md:text-5xl font-[900] text-slate-900 flex-col md:flex items-center leading-tight mb-8">
                Pertanyaan yang <br />
                <span className="text-blue-600 underline ml-2 direction-normal">Populer</span>
              </h2>
              <p className="text-slate-500 text-lg font-light mb-10 w-full md:w-[80%]">
                Butuh bantuan cepat? Temukan jawaban dari berbagai pertanyaan umum seputar Sekolah kami.
              </p>
              
              <div className="w-full p-8 rounded-[2rem] bg-slate-900 text-white flex text-left items-center gap-6 shadow-2xl shadow-blue-900/20">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Masih bingung?</h4>
                  <p className="text-slate-400 text-sm mb-4">Tim administrasi kami siap membantu Anda secara langsung.</p>
                  <a href="/layanan">
                    <button className="text-blue-400 font-black text-sm uppercase tracking-tighter hover:text-white transition-colors">
                      Hubungi Kontak Kami →
                    </button>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* KANAN: FAQ Accordion */}
          <div className="w-full space-y-4">
            {faqs.length === 0 ? (
              <div className="p-10 border-2 border-dashed border-slate-200 rounded-[2rem] text-center text-slate-400 font-bold">
                Belum ada FAQ tersedia.
              </div>
            ) : (
              faqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`group rounded-[2rem] border-2 transition-all duration-500 ${
                      isOpen 
                        ? "bg-white border-blue-600 shadow-2xl shadow-blue-900/10" 
                        : "bg-slate-50 border-gray-300"
                    }`}
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="w-full text-left p-8 flex justify-between items-center outline-none"
                    >
                      <h3 className={`text-md md:text-xl font-extrabold pr-6 transition-colors duration-300 ${
                        isOpen ? "text-blue-600" : "text-slate-800"
                      }`}>
                        <span className={`mr-4 text-sm font-black ${isOpen ? "text-blue-600" : "text-slate-300"}`}>
                          0{index + 1}
                        </span>
                        {faq.question}
                      </h3>
                      <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                        isOpen ? "bg-blue-600 text-white rotate-180" : "bg-white text-slate-400 group-hover:text-blue-600"
                      }`}>
                        <ChevronDown size={20} />
                      </div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="pb-8 text-left text-slate-500 leading-relaxed font-medium text-sm md:text-lg border-t border-slate-100 ml-8">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

// Page utama
const Page = ({ theme, onTenantChange, currentKey }: any) => (
  <div className="min-h-screen bg-white">
    <NavbarComp theme={theme} onTenantChange={onTenantChange} currentKey={currentKey} />
    <HeroComp id="#sambutan" />
    {/* <StatsBar theme={theme} /> */}
    <SambutanComp />
    <FasilitasSection />
    <VideoSection />
    <PengurusSection />
    <BeritaComp />
    <GalleryComp />
    <InstagramFeedSection theme={theme} />
    <CommentSection />
    <SponsorMarqueeSection />
    <FAQSection />
    <FooterComp />
  </div>
);

const Homepage = () => {
  const schoolInfo = SMAN25_CONFIG;
  const [key, setKey] = useState(schoolInfo.fullName);
  const theme = schoolInfo.theme;
  const schoolID = getSchoolId()

  useEffect(() => {
    queryClient.invalidateQueries();
  }, [key]);

  return <Page theme={theme} onTenantChange={setKey} currentKey={key} />;
};

export default Homepage;

// Tema dominan biru tua
export const SMAN25_THEME = {
  primary: "#1e3a8a",
  accent: "#fcd34d",
} as const;
import { SMAN25_CONFIG } from "@/core/theme";
import { FooterComp } from "@/features/_global/components/footer";
import { HeroComp } from "@/features/_global/components/hero";
import NavbarComp from "@/features/_global/components/navbar";
import { getSchoolId } from "@/features/_global/hooks/getSchoolId";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
// Asumsi useSchool tersedia di hooks Anda

/****************************
 * HERO SECTION
 ****************************/
const HeroSection = ({ profile }: any) => {
  const scrollToSambutan = () => {
    document.getElementById("sambutan")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-[78vh] flex items-center justify-center overflow-hidden z-[1]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/sambutan.webp')`,
        }}
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 text-left md:text-center text-white px-6 mt-[-60px] max-w-5xl">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          {"Sambutan Kepala Sekolah"}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="text-lg md:text-xl mb-10 max-w-3xl mx-auto text-white/90 leading-relaxed"
        >
          {profile?.heroSubTitle || "Selamat datang di website resmi sekolah kami."}
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          onClick={scrollToSambutan}
          className="px-6 py-3 rounded-xl bg-white text-black font-medium text-lg hover:bg-gray-100 transition shadow-xl"
        >
          Baca Sambutan Lengkap
        </motion.button>
      </div>
    </section>
  );
};

/****************************
 * SAFE IMAGE COMPONENT
 ****************************/
const SafeImage = ({ src, alt, className = "", fallback }: any) => {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return fallback || (
      <div className={`${className} bg-slate-200 flex items-center justify-center`}>
        <span className="text-slate-400 text-sm italic">Foto tidak tersedia</span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      loading="lazy"
    />
  );
};

/****************************
 * SAMBUTAN SECTION
 ****************************/
const SambutanSection = ({ profile, loading }: any) => {
  if (loading) return <div className="py-24 text-center">Memuat profil sekolah...</div>;
  if (!profile) return <div className="py-24 text-center">Profil belum tersedia.</div>;

  const stats = [
    { value: profile.studentCount || "0", label: "Peserta Didik" },
    { value: profile.teacherCount || "0", label: "Guru Tendik" },
    { value: profile.roomCount || "0", label: "Ruangan" },
    { value: profile.achievementCount || "0", label: "Penghargaan" },
  ];

  return (
    <section id="sambutan" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center text-center space-y-12">
          
          {/* Foto Kepala Sekolah */}
          <div className="w-full max-w-md">
            <div className="relative">
              <SafeImage 
                src={profile.photoHeadmasterUrl || "/kepalaSekolah.png"}
                alt={profile.headmasterName} 
                className="w-full h-[330px] object-contain" 
              />
            </div>
          </div>

          {/* Konten Teks */}
          <div className="max-w-7xl space-y-8">
            <div className="text-xl text-slate-700 leading-relaxed space-y-6 italic">
              {profile.headmasterWelcome?.split("\n").map((p: string, i: number) => (
                <p key={i}>"{p}"</p>
              ))}
            </div>

            <div className="pt-4">
              <p className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
                {profile.headmasterName}
              </p>
              <p className="text-blue-600 font-bold tracking-widest text-sm uppercase mt-1">
                Kepala Sekolah {profile.schoolName}
              </p>
            </div>

            {/* Stats Box */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-slate-100">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-4xl font-black text-slate-900">{stat.value}+</p>
                  <p className="text-slate-500 font-medium text-sm mt-1 uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/****************************
 * PAGE UTAMA
 ****************************/
const SambutanPage = () => {
  const schoolData = getSchoolId();
  const schoolId = schoolData;
  
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const schoolInfo = SMAN25_CONFIG;
  const theme = schoolInfo.theme;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!schoolId) return;
      
      try {
        setLoading(true);
        // Memanggil API baru berdasarkan schoolId
        const response = await fetch(`https://be-school.kiraproject.id/profileSekolah?schoolId=${schoolId}`);
        const result = await response.json();
        
        if (result.success && result.data) {
          setProfile(result.data);
        }
      } catch (error) {
        console.error("Gagal mengambil profil sekolah:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [schoolId]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <NavbarComp theme={theme} />
      
      <HeroComp id="#sambutan" titleProps="Sambutan Kepala Sekolah" />

      <main className="flex-1 relative z-[10]" id="sambutan">
        <SambutanSection profile={profile} loading={loading} />
      </main>

      <FooterComp />
    </div>
  );
};

export default SambutanPage;
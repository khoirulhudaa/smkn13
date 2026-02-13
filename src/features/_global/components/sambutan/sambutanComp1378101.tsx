import { motion } from "framer-motion";
import { Award, BookOpen, School, Sparkles, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { getSchoolId } from "../../hooks/getSchoolId";

const SambutanComp1378101 = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const SCHOOL_ID = getSchoolId();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`https://be-school.kiraproject.id/profileSekolah?schoolId=${SCHOOL_ID}`);
        const result = await res.json();
        if (result.success) setProfile(result.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="py-24 text-center text-blue-600 font-bold">Memuat pesan kepemimpinan...</div>;

  const stats = [
    { icon: <Users size={30} />, value: profile?.studentCount || '540+', label: 'Siswa' },
    { icon: <BookOpen size={30} />, value: profile?.teacherCount || '45+', label: 'Guru' },
    { icon: <School size={30} />, value: profile?.roomCount || '30+', label: 'Kelas' },
    { icon: <Award size={30} />, value: profile?.achievementCount || '100', label: 'Prestasi' },
  ];

  return (
   <section id="sambutan" className="relative pt-20 pb-6 md:pb-6 bg-white z-[2]">
   
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/grid-me.png")` }} />
    
      <div className="max-w-7xl mx-auto px-6 relative z-[2]">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 mb-6"
          >
            <Sparkles size={14} fill="currentColor" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Pesan Kepemimpinan</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-[1000] text-slate-900 leading-tight tracking-tighter"
          >
            Mendidik dengan <br />
            <span className="text-blue-600 underline decoration-normal italic underline-offset-8">Hati & Inovasi</span>
          </motion.h2>
        </div>

        {/* PROFILE CARD - CLEAN & MINIMALIST */}
        <div className="flex flex-col items-center mb-24">
          <motion.div
            className="w-full md:w-max relative group"
          >
            {/* Soft Shadow Base */}
            <div className="absolute inset-10 bg-blue-600/20 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative w-full h-[90%] mx-auto md:w-[440px] overflow-hidden p-6 border border-blue-900 rounded-[40px] md:h-[440px] bg-white">
              <img 
                src={profile?.photoHeadmasterUrl || '/kapalaSekolah.png'} 
                alt="Kepala Sekolah" 
                className="w-full h-full rounded-xl md:object-cover object-contain transition-transform duration-1000" 
              />
            </div>

            {/* Badge Nama - Glassmorphism */}
            <motion.div 
              transition={{ delay: 0.4 }}
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-xl border border-black/50 p-6 rounded-[2rem] shadow-xl text-center w-max"
            >
              <h3 className="text-xl font-[900] text-slate-900 mb-1 leading-none">
                {profile?.headmasterName || 'Kepala Sekolah'}
              </h3>
              <p className="text-blue-600 text-[11px] font-black uppercase tracking-widest">
                Kepala Sekolah
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* NARRATIVE CONTENT */}
        <div className="relative w-full md:w-[90%] mx-auto mb-12 mt-[-16px]">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-md w-full md:text-2xl z-[2] text-black/70 leading-[1.8] font-light text-center"
          >
            {profile?.headmasterWelcome?.split('\n').map((p: string, i: number) => (
              <p key={i} className="mb-8">
                "{p}"
              </p>
            ))}
          </motion.div>
        </div>

        {/* STATS SECTION - CLEAN BENTO STYLE */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          {stats.map((s: any, i: number) => (
            <div 
              key={i} 
              className="group md:p-8 rounded-[3rem] flex flex-col items-center"
            >
              <div className="w-full md:w-16 h-16 rounded-2xl bg-blue-700 shadow-sm flex items-center justify-center text-white mb-6 transition-all duration-500">
                {s.icon}
              </div>
              <p className="text-5xl font-[1000] text-slate-900 mb-1 tabular-nums">
                {s.value}
              </p>
              <p className="text-[15px] font-normal text-slate-600 mt-4 uppercase tracking-widest">
                {s.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SambutanComp1378101;
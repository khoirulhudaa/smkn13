// import { motion } from "framer-motion";
// import { Award, BookOpen, Quote, School, Sparkles, Users } from "lucide-react";
// import { useEffect, useState } from "react";
// import { getSchoolId } from "../../hooks/getSchoolId";

// const SambutanComp40 = () => {
//   const [profile, setProfile] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const SCHOOL_ID = getSchoolId();

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await fetch(`https://be-school.kiraproject.id/profileSekolah?schoolId=${SCHOOL_ID}`);
//         const result = await res.json();
//         if (result.success) setProfile(result.data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProfile();
//   }, [SCHOOL_ID]);

//   if (loading) return (
//     <div className="h-96 flex items-center justify-center">
//       <motion.div 
//         animate={{ rotate: 360 }} 
//         transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
//         className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" 
//       />
//     </div>
//   );

//   const stats = [
//     { icon: <Users size={24} />, value: profile?.studentCount || '540+', label: 'Siswa Aktif' },
//     { icon: <BookOpen size={24} />, value: profile?.teacherCount || '45+', label: 'Tenaga Pengajar' },
//     { icon: <School size={24} />, value: profile?.roomCount || '30+', label: 'Ruang Kelas' },
//     { icon: <Award size={24} />, value: profile?.achievementCount || '100+', label: 'Prestasi' },
//   ];

//   return (
//     <section id="sambutan" className="relative py-24 bg-[#FCFCFD] overflow-hidden">
//       {/* Background Decor */}
//       <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
//         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-50/50 blur-[120px] rounded-full" />
//       </div>

//       <div className="max-w-7xl mx-auto px-6 relative z-10">
        
//         {/* HEADER */}
//         <div className="flex flex-col items-center text-center mb-20">
//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-6"
//           >
//             <Sparkles size={14} className="text-blue-600" />
//             <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Pesan Kepemimpinan</span>
//           </motion.div>
          
//           <motion.h2 
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             className="text-3xl md:text-5xl font-black md:font-bold text-slate-900 leading-tight tracking-[ -0.04em]"
//           >
//             Mendidik dengan <br />
//             <span className="italic text-blue-600">Dedikasi & Kasih Sayang</span>
//           </motion.h2>
//         </div>

//         <div className="grid lg:grid-cols-12 gap-16 items-start">
          
//           {/* LEFT: PHOTO SECTION */}
//           <div className="lg:col-span-5 relative">
//             <motion.div
//               initial={{ opacity: 0, x: -30 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/10 border-[8px] border-white"
//             >
//               <img 
//                 src={profile?.photoHeadmasterUrl || '/kapalaSekolah.png'} 
//                 alt="Kepala Sekolah" 
//                 className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
              
//               <div className="absolute bottom-8 left-8 right-8 text-white">
//                 <h3 className="text-2xl font-bold leading-tight">
//                   {profile?.headmasterName || 'Kepala Sekolah'}
//                 </h3>
//                 <p className="text-blue-300 text-xs font-bold uppercase tracking-widest mt-1">
//                   Kepala Sekolah Utama
//                 </p>
//               </div>
//             </motion.div>
            
//             {/* Aesthetic Ornament */}
//             <div className="absolute -z-10 -bottom-6 -right-6 w-32 h-32 bg-blue-100 rounded-full blur-2xl" />
//           </div>

//           {/* RIGHT: CONTENT SECTION */}
//           <div className="lg:col-span-7 flex flex-col justify-center h-full">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               className="relative"
//             >
//               {/* <Quote className="text-blue-100 absolute -top-10 -left-6 w-20 h-20 -z-10 rotate-180" /> */}
              
//               <div className="space-y-6">
//                 {profile?.headmasterWelcome?.split('\n').map((p: string, i: number) => (
//                   <p key={i} className="text-md md:text-xl text-slate-600 leading-relaxed font-light text-justify italic">
//                     {p}
//                   </p>
//                 ))}
//               </div>

//               {/* STATS BENTO BOARD */}
//               <div className="mt-10 md:mt-16 grid grid-cols-2 gap-4">
//                 {stats.map((s, i) => (
//                   <motion.div 
//                     key={i}
//                     initial={{ opacity: 0, y: 20 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     transition={{ delay: i * 0.1 }}
//                     className="p-6 bg-white rounded-[2rem] border border-blue-300 shadow-sm hover:shadow-md transition-shadow"
//                   >
//                     <div className="text-blue-600 mb-3">{s.icon}</div>
//                     <div className="text-2xl font-black text-slate-900 tracking-tighter">{s.value}</div>
//                     <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">{s.label}</div>
//                   </motion.div>
//                 ))}
//               </div>
//             </motion.div>
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// };


// export default SambutanComp40;


import { motion } from "framer-motion";
import { Award, BookOpen, School, Sparkles, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { getSchoolId } from "../../hooks/getSchoolId";

const SambutanComp40 = () => {
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
            Menciptakan Siswa  <br />
            <span className="text-blue-600 underline decoration-normal italic underline-offset-8">Karakter Unggul</span>
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

export default SambutanComp40;
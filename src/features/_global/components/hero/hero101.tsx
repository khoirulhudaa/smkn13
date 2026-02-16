import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getSchoolId } from "../../hooks/getSchoolId";

interface HeroProps {
  id?: string;
  titleProps?: string;
  subTitleProps?: string;
}

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

export const HeroComp101 = ({ id, titleProps, subTitleProps }: HeroProps) => {
  const { data: profile } = useSchoolProfile();

  return (
    <section className="relative h-max md:mt-[0px] md:pt-0 pt-10 md:h-[90vh] border-b border-slate-900/20 rounded-br-[120px] rounded-bl-[120px] flex items-center bg-blue-800/10 overflow-hidden ">
      {/* Background Decorative Elements */}
      {/* <div className="absolute top-0 right-0 w-1/3 h-full bg-white -skew-x-12 transform origin-top" /> */}
      
      <div className="container mx-auto px-4 relative z-[4]">
        <div className="md:flex gap-16 items-center">
          
          {/* Kolom Kiri: Teks */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-[60%] md:mt-[-20px] md:space-y-7 space-y-7"
          >
            <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-100 border border-blue-200">
              <span className="text-sm font-bold text-blue-700 uppercase tracking-widest">
                🏫 Sekolah Negeri - Jakarta Barat
              </span>
            </div>

            <h1 className="text-4xl lg:text-7xl w-full font-black text-slate-900 leading-tight mb-6">
              {titleProps ? titleProps : "SMAN 101 Jakarta Barat"}
            </h1>

            <p className="text-md md:text-lg text-slate-600 ml-[2px] leading-relaxed mb-10 max-w-full">
              {subTitleProps ? subTitleProps : "Kami menggabungkan kurikulum standar global dengan pembentukan karakter yang kuat untuk melahirkan pemimpin masa depan yang inovatif."}
            </p>

            <div className="w-max grid grid-cols-2 gap-1 mt-12">
            <a href={id}>
              <button className="w-full md:w-max md:px-4 px-8 py-4 flex items-center gap-1 bg-slate-900 text-white font-bold rounded-2xl hover:bg-blue-600 active:scale-[0.96] transition-all shadow-lg shadow-slate-200">
                  <span className="md:flex hidden">
                    Mulai 
                  </span>
                  Eksplorasi
              </button>
            </a>
              <a href="/ppdb">
                <button className="w-full md:w-max md:px-4 px-8 py-4 flex items-center gap-1 bg-white text-slate-700 font-bold rounded-2xl border border-slate-400 active:scale-[0.96] hover:brightness-95 hover:border-blue-400 transition-all">
                    Pendaftaran 
                    <span className="md:flex hidden">
                      Siswa
                    </span>
                </button>
              </a>
            </div>

            {/* Statistik Singkat */}
            {/* <div className="mt-12 grid grid-cols-3 gap-8 border-t border-slate-200 pt-8">
              <div>
                <p className="text-3xl font-bold text-slate-900">50+</p>
                <p className="text-sm text-slate-500">Eskul Aktif</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900">100%</p>
                <p className="text-sm text-slate-500">Akreditasi A</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900">2k+</p>
                <p className="text-sm text-slate-500">Alumni Sukses</p>
              </div>
            </div> */}
          </motion.div>

          {/* Kolom Kanan: Visual Komposisi */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative w-full md:w-[40%]"
          >
            {/* Main Image Card */}
            <div className="relative z-[4] rounded-md md:rounded-[2.5rem] overflow-hidden border-[12px] border-white shadow-2xl nd:mt-0 mt-8 md:rotate-2 hover:rotate-0 transition-transform duration-500">
              <img 
                src={profile?.heroImageUrl || '/hero2.png'} 
                alt="Student" 
                className="w-full h-[400px] object-cover"
              />
            </div>

            {/* Floating Glass Card 1 */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-14 -right-6 z-30 p-6 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 hidden md:block"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Character Building</p>
                  <p className="text-sm font-bold text-slate-900">Terverifikasi</p>
                </div>
              </div>
            </motion.div>

            {/* Floating Glass Card 2 */}
            <motion.div 
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-10 -left-10 z-30 p-6 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 hidden md:block"
            >
              <div className="text-center">
                <p className="text-2xl font-black text-blue-600">Negeri</p>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Sekolah Nasional</p>
              </div>
            </motion.div>

            {/* Decorative Dots */}
            {/* <div className="absolute bottom-6 right-6 w-32 h-32 bg-blue-400 rounded-full blur-3xl z-10" /> */}
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroComp101;
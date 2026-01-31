import { motion } from "framer-motion";
import { ArrowRight, Layers } from "lucide-react";
import { useEffect, useState } from "react";
import { getSchoolId } from "../../hooks/getSchoolId";

const BASE_URL = "https://be-school.kiraproject.id";
const SCHOOL_ID = getSchoolId();

const GalleryBento = () => {
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlbum, setSelectedAlbum] = useState<any | null>(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/albums?schoolId=${SCHOOL_ID}&isActive=true`);
        const json = await res.json();
        if (json.success) setAlbums(json.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbums();
  }, []);

  return (
    <section className="py-12 md:py-24 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-[120px] -z-10 opacity-60" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-blue-600 font-black tracking-widest text-xs uppercase mb-3"
            >
              <Layers size={16} /> Visual Documentation
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-[900] text-slate-900 leading-tight"
            >
              Momen <span className="text-blue-600  underline direction-normal">Terbaik</span> Kami
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-slate-500 font-medium md:max-w-xs text-sm italic border-l-4 border-blue-600 pl-4"
          >
            "Setiap foto menceritakan dedikasi, prestasi, dan semangat belajar."
          </motion.p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[600px]">
            <div className="md:col-span-2 md:row-span-2 bg-slate-100 animate-pulse rounded-[2rem]" />
            <div className="bg-slate-100 animate-pulse rounded-[2rem]" />
            <div className="bg-slate-100 animate-pulse rounded-[2rem]" />
            <div className="md:col-span-2 bg-slate-100 animate-pulse rounded-[2rem]" />
          </div>
        ) : (
          /* BENTO GRID LAYOUT */
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[220px]">
            {albums.map((album, i) => (
              <motion.div
                key={album.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -8 }}
                onClick={() => setSelectedAlbum(album)}
                className={`group relative z-[4] overflow-hidden rounded-[2.5rem] shadow-xl cursor-pointer ${
                  // Pola Grid Bento:
                  i % 5 === 0 ? "md:col-span-2 md:row-span-2" : // Album besar
                  i % 5 === 3 ? "md:col-span-2" : ""           // Album lebar
                }`}
              >
                {/* Image */}
                <img
                  src={album.coverUrl ? `${BASE_URL}${album.coverUrl}` : "/placeholder.jpg"}
                  alt={album.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Glassmorphism Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/20 to-transparent flex flex-col justify-end p-8">
                  <div className="flex justify-between items-end">
                    <div className="w-full">
                      <span className="text-[10px] font-black text-white uppercase tracking-widest bg-blue-500/50 border-white/30 backdrop-blur-md px-3 py-1 rounded-full border">
                         {album.itemCount || 0} Photos
                      </span>
                      <h3 
                        className={`text-white w-max font-black leading-tight group-hover:text-blue-800 group-hover:bg-white group-hover:italic duration-200 transition-all mt-3 
                          truncate block w-full 
                          group-hover:px-4 
                          ${i % 5 === 0 ? 'text-3xl' : 'text-xl'}`}
                        title={album.title}
                      >
                        {album.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Border Effect */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-400/50 rounded-[2.5rem] transition-colors duration-500" />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Re-use Modal Gallery Full dari code sebelumnya di sini */}
    </section>
  );
};

export default GalleryBento;
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Layers,
  Loader2,
  X
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { getSchoolId } from "../../hooks/getSchoolId";

const BASE_URL = "https://be-school.kiraproject.id";
const SCHOOL_ID = getSchoolId();

const GalleryBento = () => {
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk Modal
  const [selectedAlbum, setSelectedAlbum] = useState<any | null>(null);
  const [albumItems, setAlbumItems] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadingItems, setLoadingItems] = useState(false);

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

  // Fetch item saat album dibuka
  const openAlbum = async (album: any) => {
    setSelectedAlbum(album);
    setLoadingItems(true);
    setCurrentIndex(0);
    try {
      const res = await fetch(`${BASE_URL}/gallery?albumId=${album.id}&isActive=true`);
      const json = await res.json();
      if (json.success) setAlbumItems(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingItems(false);
    }
  };

  const closeAlbum = () => {
    setSelectedAlbum(null);
    setAlbumItems([]);
  };

  const nextImg = useCallback(() => {
    setCurrentIndex((prev) => (prev === albumItems.length - 1 ? 0 : prev + 1));
  }, [albumItems.length]);

  const prevImg = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? albumItems.length - 1 : prev - 1));
  }, [albumItems.length]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedAlbum) return;
      if (e.key === "ArrowRight") nextImg();
      if (e.key === "ArrowLeft") prevImg();
      if (e.key === "Escape") closeAlbum();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedAlbum, nextImg, prevImg]);

  return (
    <section className="py-12 md:py-24 bg-slate-50 relative overflow-hidden">
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
              Momen <span className="text-blue-600 underline decoration-blue-200 underline-offset-8">Terbaik</span> Kami
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[600px]">
            <div className="md:col-span-2 md:row-span-2 bg-slate-100 animate-pulse rounded-[2rem]" />
            <div className="bg-slate-100 animate-pulse rounded-[2rem]" />
            <div className="bg-slate-100 animate-pulse rounded-[2rem]" />
            <div className="md:col-span-2 bg-slate-100 animate-pulse rounded-[2rem]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[220px]">
            {albums.map((album, i) => (
              <motion.div
                key={album.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -8 }}
                onClick={() => openAlbum(album)}
                className={`group relative z-[4] overflow-hidden rounded-[2.5rem] shadow-xl cursor-pointer ${
                  i % 5 === 0 ? "md:col-span-2 md:row-span-2" : 
                  i % 5 === 3 ? "md:col-span-2" : ""
                }`}
              >
                <img
                  src={album.coverUrl ? `${BASE_URL}${album.coverUrl}` : "/placeholder.jpg"}
                  alt={album.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-900/20 to-transparent flex flex-col justify-end p-8">
                   <div className="mb-2 translate-y-0 group-hover:translate-y-0 transition-transform duration-300">
                      <span className="text-[10px] font-black text-white uppercase tracking-widest bg-blue-500/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                         {album.itemCount || 0} Photos
                      </span>
                   </div>
                   <h3 className={`text-white w-full truncate group-hover:bg-white group-hover:pl-2 group-hover:italic transition-padding group-hover:text-blue-900 font-black leading-tight transition-all duration-300 ${i % 5 === 0 ? 'text-3xl' : 'text-xl'}`}>
                      {album.title}
                   </h3>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ================= MODAL FULL SCREEN ================= */}
      <AnimatePresence>
        {selectedAlbum && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-2xl flex flex-col"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 md:p-8 relative z-10">
              <div className="flex flex-col">
                <h2 className="text-2xl md:text-3xl font-black text-white">{selectedAlbum.title}</h2>
                <div className="flex items-center gap-4 text-blue-300 text-xs mt-2 uppercase tracking-widest font-bold">
                  <span className="flex items-center gap-1"><ImageIcon size={14}/> {albumItems.length} Media</span>
                  <span className="flex items-center gap-1"><Calendar size={14}/> {new Date(selectedAlbum.createdAt).getFullYear()}</span>
                </div>
              </div>
              <button 
                onClick={closeAlbum}
                className="w-12 h-12 flex items-center justify-center rounded-full text-white bg-red-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 relative flex items-center justify-center p-4">
              {loadingItems ? (
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                  <span className="text-white/50 font-bold uppercase tracking-tighter">Loading Story...</span>
                </div>
              ) : albumItems.length > 0 ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <motion.img
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 0.95, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 1.05, x: -20 }}
                    src={`${BASE_URL}${albumItems[currentIndex]?.imageUrl}`}
                    alt="Gallery item"
                    className="max-w-full max-h-[45vh] object-contain rounded-3xl shadow-2xl border border-white/5"
                  />
                  
                  {/* Arrows */}
                  <div className="absolute inset-0 flex items-center justify-between px-2 md:px-10 pointer-events-none">
                    <button 
                      onClick={prevImg}
                      className="w-14 h-14 flex items-center justify-center rounded-full bg-black/20 text-white/50 hover:text-white hover:bg-blue-600 transition-all pointer-events-auto backdrop-blur-md"
                    >
                      <ChevronLeft size={32} />
                    </button>
                    <button 
                      onClick={nextImg}
                      className="w-14 h-14 flex items-center justify-center rounded-full bg-black/20 text-white/50 hover:text-white hover:bg-blue-600 transition-all pointer-events-auto backdrop-blur-md"
                    >
                      <ChevronRight size={32} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-white/20 font-black text-4xl uppercase italic">No Photos Found</div>
              )}
            </div>

            {/* Thumbnail Navigation */}
            <div className="h-[24%] bg-black/40 border-t border-white/5 p-4 overflow-x-auto overflow-y-hidden no-scrollbar">
              <div className="flex gap-3 justify-center h-full items-center">
                {albumItems.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative h-[90%] aspect-video rounded-xl overflow-hidden transition-all duration-300 flex-shrink-0 ${
                      idx === currentIndex ? 'ring-4 ring-blue-500 scale-105 shadow-lg shadow-blue-500/50' : 'opacity-40 grayscale hover:grayscale-0 hover:opacity-100'
                    }`}
                  >
                    <img src={`${BASE_URL}${item.imageUrl}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GalleryBento;
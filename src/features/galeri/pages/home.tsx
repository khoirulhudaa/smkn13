import { SMAN25_CONFIG } from "@/core/theme";
import { FooterComp } from "@/features/_global/components/footer";
import { HeroComp } from "@/features/_global/components/hero";
import NavbarComp from "@/features/_global/components/navbar";
import { getSchoolId } from "@/features/_global/hooks/getSchoolId";
import { AnimatePresence, motion } from "framer-motion";
import { 
  ArrowLeftCircle, 
  ArrowRightCircle, 
  X, 
  Image as ImageIcon, 
  Calendar, 
  Maximize2,
  Loader2
} from "lucide-react";
import { useEffect, useState } from "react";

// --- API CONFIG & UTILS ---
const BASE_URL = "https://be-school.kiraproject.id";
const SCHOOL_ID = getSchoolId();

const getJsonHeaders = () => ({
  "Content-Type": "application/json",
});

const fetchAlbums = async () => {
  const res = await fetch(`${BASE_URL}/albums?schoolId=${SCHOOL_ID}&isActive=true`, {
    mode: 'cors',
    headers: getJsonHeaders(),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Gagal mengambil album");
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "API error");

  return (json.data || []).map((album: any) => ({
    ...album,
    coverUrl: album.coverUrl ? `${BASE_URL}${album.coverUrl}` : "/placeholder-album.jpg",
  }));
};

const fetchAlbumItems = async (albumId: string | number) => {
  const res = await fetch(`${BASE_URL}/gallery?albumId=${albumId}&isActive=true`, {
    headers: getJsonHeaders(),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Gagal mengambil item");
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "API error");

  return (json.data || []).map((item: any) => ({
    id: item.id,
    title: item.title || "Foto kegiatan",
    description: item.description || "",
    date: item.createdAt || item.date || new Date().toISOString(),
    src: item.imageUrl ? `${BASE_URL}${item.imageUrl}` : "/placeholder.jpg",
  }));
};

// --- HOOKS ---
const useGallery = () => {
  const [albums, setAlbums] = useState<any[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<any | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingItems, setLoadingItems] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetchAlbums();
        setAlbums(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openAlbum = async (album: any) => {
    setSelectedAlbum(album);
    setCurrentIndex(0);
    setLoadingItems(true);
    try {
      const galleryItems = await fetchAlbumItems(album.id);
      setItems(galleryItems);
    } catch (err) {
      setItems([]);
    } finally {
      setLoadingItems(false);
    }
  };

  const closeAlbum = () => {
    setSelectedAlbum(null);
    setItems([]);
  };

  return {
    albums, selectedAlbum, items, currentIndex, loading, loadingItems,
    openAlbum, closeAlbum, setCurrentIndex,
    goPrev: () => setCurrentIndex(prev => (prev <= 0 ? items.length - 1 : prev - 1)),
    goNext: () => setCurrentIndex(prev => (prev >= items.length - 1 ? 0 : prev + 1)),
  };
};

// --- COMPONENT ---
const GalleryPage = () => {
  const { theme } = SMAN25_CONFIG;
  const {
    albums, selectedAlbum, items, currentIndex, loading, loadingItems,
    openAlbum, closeAlbum, goPrev, goNext, setCurrentIndex
  } = useGallery();

  const currentItem = items[currentIndex] || {};

  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      <NavbarComp theme={theme} />
      <HeroComp titleProps="Galeri Kegiatan" id="#galeri" />

      <section id="galeri" className="py-16 pb-24 relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-20 left-0 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-16 text-center md:text-left"
          >
            <span className="text-blue-600 font-bold tracking-widest uppercase text-xs">Our Memories</span>
            <h2 className="text-3xl md:text-4xl font-black italic text-slate-900 mt-2">
              Album <span className="text-blue-600">Sekolah</span>
            </h2>
          </motion.div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-blue-600/50">
              <Loader2 className="w-12 h-12 animate-spin mb-4" />
              <p className="font-medium animate-pulse">Menyiapkan Koleksi...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[280px]">
              {albums.map((album, index) => {
                // Bento Logic: Item 1 besar, Item 4 lebar
                const isLarge = index === 0 || index === 7;
                const isWide = index === 3 || index === 4;

                return (
                  <motion.div
                    key={album.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => openAlbum(album)}
                    className={`group relative rounded-[2rem] overflow-hidden cursor-pointer bg-slate-200 border border-white transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20
                      ${isLarge ? "md:col-span-2 md:row-span-2" : ""}
                      ${isWide ? "md:col-span-2" : "md:col-span-1"}
                    `}
                  >
                    <img
                      src={album.coverUrl}
                      alt={album.title}
                      crossOrigin="anonymous"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-black/20 to-transparent opacity-70 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white translate-y-2 group-hover:translate-y-0 transition-transform">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                          <ImageIcon size={12} /> {album.itemCount ?? 0} Foto
                        </span>
                      </div>
                      <h3 className={`transition-all truncate block max-w-full font-bold leading-tight group-hover:bg-white w-max group-hover:italic group-hover:px-3 group-hover:text-blue-700 ${isLarge ? 'text-2xl' : 'text-lg'}`}>
                        {album.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-blue-200 text-xs">
                        <Maximize2 size={12} />
                        <span>Buka Album</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* --- MODAL GALERI FULL --- */}
      <AnimatePresence>
        {selectedAlbum && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-slate-950/98 backdrop-blur-xl flex flex-col"
            onClick={closeAlbum}
          >
            {/* Header Modal */}
            <div className="flex items-center justify-between p-6 bg-gradient-to-b from-black/50 to-transparent relative z-10">
              <div className="text-white">
                <h2 className="text-2xl font-bold">{selectedAlbum.title}</h2>
                <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                   <span className="flex items-center gap-1"><ImageIcon size={14}/> {items.length} Foto</span>
                   <span className="flex items-center gap-1"><Calendar size={14}/> {new Date(selectedAlbum.createdAt).toLocaleDateString("id-ID")}</span>
                </div>
              </div>
              <button onClick={closeAlbum} className="p-3 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all">
                <X size={24} />
              </button>
            </div>

            {/* Viewport Utama */}
            <div className="flex-1 flex items-center justify-center relative px-4 select-none">
              {loadingItems ? (
                <div className="flex flex-col items-center gap-3 text-blue-400">
                  <Loader2 className="w-10 h-10 animate-spin" />
                  <span className="text-sm font-medium">Memuat Gambar...</span>
                </div>
              ) : items.length > 0 ? (
                <>
                  <motion.img
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    src={currentItem.src}
                    alt={currentItem.title}
                    crossOrigin="anonymous"
                    className="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl border border-white/10"
                    onClick={(e) => e.stopPropagation()}
                  />
                  
                  {/* Navigasi */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); goPrev(); }}
                    className="absolute left-6 top-1/2 -translate-y-1/2 p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all"
                  >
                    <ArrowLeftCircle size={48} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); goNext(); }}
                    className="absolute right-6 top-1/2 -translate-y-1/2 p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all"
                  >
                    <ArrowRightCircle size={48} />
                  </button>
                </>
              ) : (
                <p className="text-slate-500">Album ini belum memiliki konten.</p>
              )}
            </div>

            {/* Thumbnail Strip */}
            {!loadingItems && items.length > 0 && (
              <div className="p-8 bg-black/20 overflow-x-auto">
                <div className="flex gap-3 justify-center max-w-5xl mx-auto">
                  {items.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                      className={`relative flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden transition-all duration-300 ${
                        idx === currentIndex ? "ring-2 ring-blue-500 scale-110 opacity-100" : "opacity-40 hover:opacity-70"
                      }`}
                    >
                      <img src={item.src} crossOrigin="anonymous" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <FooterComp />
    </div>
  );
};

export default GalleryPage;
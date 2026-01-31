import { FooterComp } from "@/features/_global/components/footer";
import { HeroComp } from "@/features/_global/components/hero";
import NavbarComp from "@/features/_global/components/navbar";
import { getSchoolId } from "@/features/_global/hooks/getSchoolId";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  MapPin,
  Users,
  X
} from "lucide-react";
import React, { useState } from "react";

// === TYPES (disesuaikan dengan backend) ===
export type Jenis = "Latihan" | "Perkemahan" | "Lomba" | "Bakti" | "Rapat" | "Kursus" | "Lainnya";
export type DocItem = {
  name: string;
  url: string;
  type?: 'image/png' | 'image/jpeg' | 'video/mp4';
};
export type Kegiatan = {
  id: string;
  judul: string;
  jenis: Jenis;
  tanggal: string;
  lokasi: string;
  penanggungJawab: string;
  peserta: number;
  deskripsi?: string;
  dokumentasi: DocItem[];
};

// 1. Badge Kategori yang Elegan
const CategoryBadge = ({ children }: { children: string }) => (
  <span className="bg-white backdrop-blur-md text-black shadow-xl text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-amber-500/20">
    {children}
  </span>
);

const ActivityCard = ({ kegiatan, onOpenDetail, theme }: any) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="group relative bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-all duration-500"
  >
    <div className="relative aspect-video overflow-hidden">
      <img 
        src={kegiatan.dokumentasi[0]?.url || "/pramuka.jpg"} 
        alt={kegiatan.judul}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute top-4 left-4">
        <CategoryBadge>{kegiatan.jenis}</CategoryBadge>
      </div>
    </div>

    <div className="p-8">
      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">
        <Calendar size={12} className="text-amber-500" />
        {new Date(kegiatan.tanggal).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
      </div>
      
      <h3 className="text-2xl font-black text-gray-900 leading-tight mb-4 group-hover:text-amber-600 transition-colors">
        {kegiatan.judul}
      </h3>

      <div className="space-y-2 mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
          <MapPin size={14} /> {kegiatan.lokasi}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
          <Users size={14} /> {kegiatan.peserta || 45} Peserta Terdaftar
        </div>
      </div>

      <button
        onClick={() => onOpenDetail(kegiatan)}
        className="w-full py-4 rounded-xl border-2 border-gray-900 text-gray-900 font-black text-xs uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group/btn"
      >
        Detail Kegiatan
        <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
      </button>
    </div>
  </motion.div>
);

function svgFallback(label: string = 'Gambar', w = 800, h = 450, theme: any) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
<rect width="100%" height="100%" fill="${theme.surface}"/>
<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#ffffffb3" font-family="Inter,Arial,sans-serif" font-size="22">${label}</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function SafeImg({
  src,
  alt,
  className,
  style,
  fallbackLabel,
  theme
}: {
  src?: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  fallbackLabel?: string;
  theme: any;
}) {
  const [url, setUrl] = React.useState<string>(src || '');
  const [triedFallback, setTriedFallback] = React.useState(false);

  React.useEffect(() => {
    setUrl(src || '');
    setTriedFallback(false);
  }, [src]);

  const ph = `https://placehold.co/1280x720/png?text=${encodeURIComponent(fallbackLabel || alt || 'Gambar')}`;
  const finalUrl = url || ph;

  return (
    <img
      src={finalUrl}
      alt={alt || ''}
      className={className}
      style={style}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (!triedFallback) {
          setUrl(ph);
          setTriedFallback(true);
        } else {
          setUrl(svgFallback(fallbackLabel || alt || 'Gambar', 800, 450, theme));
        }
      }}
    />
  );
}

// === MAIN COMPONENT ===
export function PramukaMain() {
  const [detail, setDetail] = useState<any>(null);
  const schoolId = getSchoolId();

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ['pramuka-premium', schoolId],
    queryFn: async () => {
      const res = await fetch(`https://be-school.kiraproject.id/pramuka?schoolId=${schoolId}`);
      const json = await res.json();
      return json.data.map((item: any) => ({
        id: item.id.toString(),
        judul: item.title,
        jenis: item.category || "Latihan",
        tanggal: item.date,
        lokasi: item.location,
        penanggungJawab: item.mentor,
        deskripsi: item.description,
        dokumentasi: item.imageUrl ? [{ name: item.title, url: item.imageUrl }] : []
      }));
    }
  });


  return (
    <div className="min-h-screen bg-white">
      <NavbarComp />

      <HeroComp titleProps="Kegiatan Pramuka" id="#pramuka" />

      <main className="max-w-7xl mx-auto px-6 py-8 md:py-16" id="pramuka">
        {/* Header Section - Modern Branded Style (Pure Tailwind) */}
        <motion.section 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mb-12"
        >
          <div
            className="md:flex hidden relative rounded-[2.5rem] p-8 md:p-4 overflow-hidden border border-gray-900/20 shadow-[0_20px_50px_rgba(0,0,0,0.04)] bg-white"
          >
            {/* Elemen Dekoratif Latar Belakang - Menggunakan warna Slate & Amber */}
            <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-slate-100 rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-[-20%] left-[10%] w-32 h-32 bg-amber-100 rounded-full blur-2xl opacity-60" />

            <div className="relative flex flex-col md:flex-row items-center gap-8">
              {/* Avatar Group dengan Ring Premium */}
              <div className="relative group">
                <div className="absolute inset-0 bg-amber-500 rounded-full blur-md opacity-10 group-hover:opacity-20 transition-opacity" />
                <div 
                  className="relative w-24 h-24 md:w-28 md:h-28 rounded-full p-1.5 border-2 border-dashed border-slate-200 rotate-12 group-hover:rotate-0 transition-transform duration-500"
                >
                  <div className="w-full h-full rounded-full overflow-hidden bg-white shadow-inner">
                    <img 
                      src="/pramuka.jpg" 
                      alt="Pramuka SMAN 25" 
                      className="w-full h-full object-cover scale-110" 
                    />
                  </div>
                </div>
              </div>

              {/* Teks Header */}
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                  <span className="px-3 py-1 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-slate-800">
                    Official Page
                  </span>
                  <span className="w-8 h-[1px] bg-slate-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Beranda / Pramuka
                  </span>
                </div>
                
                <h1 className="text-xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.8] mb-4">
                  Galeri <span className="text-blue-700 text-shadow-sm">Pramuka</span>
                </h1>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[500px] bg-gray-100 rounded-[2rem] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {rows.map((k: any) => (
                <ActivityCard key={k.id} kegiatan={k} onOpenDetail={setDetail} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Premium Detail Modal */}
        <AnimatePresence>
          {detail && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl bg-gray-900/40"
              onClick={() => setDetail(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
                className="bg-white w-full max-w-5xl rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row h-[80vh] md:h-[600px]"
                onClick={e => e.stopPropagation()}
              >
                {/* Image Section */}
                <div className="md:w-1/2 md:h-full h-[40%] relative bg-gray-900">
                  <button onClick={() => setDetail(null)} className="z-[3] border-2 border-white absolute top-6 right-6 rounded-full bg-red-600 text-white p-3 hover:bg-red-600 transition-colors">
                    <X size={24}/>
                  </button>
                  <img 
                    src={detail.dokumentasi[0]?.url || "/pramuka.jpg"} 
                    className="w-full h-full object-cover opacity-80" 
                    alt="" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                </div>

                {/* Content Section */}
                <div className="md:w-1/2 p-8 flex flex-col overflow-y-auto">
                  <div className="flex justify-between items-start">
                    <CategoryBadge>{detail.jenis}</CategoryBadge>
                  </div>

                  <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic leading-none mb-6">
                    {detail.judul}
                  </h2>
                  
                  <div className="flex flex-wrap gap-6 mb-8 py-6 border-y border-gray-100">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Lokasi</span>
                      <span className="text-sm font-bold text-gray-900">{detail.lokasi}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Tanggal</span>
                      <span className="text-sm font-bold text-gray-900">{new Date(detail.tanggal).toLocaleDateString("id-ID", { dateStyle: 'long' })}</span>
                    </div>
                  </div>
{/* 
                  <p className="text-gray-500 font-medium leading-relaxed mb-10 flex-1">
                    {detail.deskripsi || "Informasi mendetail mengenai kegiatan ini dapat ditanyakan langsung kepada pembina pramuka di sekolah."}
                  </p> */}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <FooterComp />
    </div>
  );
}
import { SMAN25_CONFIG } from "@/core/theme";
import { FooterComp } from "@/features/_global/components/footer";
import { HeroComp } from "@/features/_global/components/hero";
import NavbarComp from "@/features/_global/components/navbar";
import { getSchoolId } from "@/features/_global/hooks/getSchoolId";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";

/****************************
 * UTILS
 ****************************/
const cx = (...cls: (string | boolean | undefined)[]) => cls.filter(Boolean).join(" ");
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
const isNewWithin = (iso: string, days = 7) => {
  const d = new Date(iso).getTime();
  return Date.now() - d <= days * 24 * 60 * 60 * 1000;
};

/****************************
 * FEED BUILDERS (JSON Feed & RSS 2.0)
 ****************************/
const xmlEsc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[c]));

function buildJSONFeed(items: any[], schoolName: string) {
  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: `Pengumuman ${schoolName}`,
    home_page_url: "#pengumuman",
    feed_url: "#pengumuman?format=json",
    items: items.map((d) => ({
      id: d.id,
      title: d.title,
      content_text: d.body,
      date_published: new Date(d.date).toISOString(),
      tags: [d.category || "Umum"],
      authors: [{ name: schoolName }],
      _meta: { source: d.source, pinned: !!d.pinned },
      url: `#pengumuman-${d.id}`,
    })),
  };
  return JSON.stringify(feed, null, 2);
}

function buildRSS(items: any[], schoolName: string) {
  const now = new Date().toUTCString();
  const header = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n<channel>\n<title>Pengumuman ${schoolName}</title>\n<link>#pengumuman</link>\n<description>Feed pengumuman terbaru</description>\n<language>id-ID</language>\n<lastBuildDate>${now}</lastBuildDate>`;
  const body = items
    .map(
      (d) => `\n  <item>\n    <title>${xmlEsc(d.title)}</title>\n    <link>#pengumuman-${xmlEsc(d.id)}</link>\n    <guid isPermaLink="false">${xmlEsc(d.id)}</guid>\n    <pubDate>${new Date(d.date).toUTCString()}</pubDate>\n    <category>${xmlEsc(d.category || "Umum")}</category>\n    <description>${xmlEsc(d.body)}</description>\n  </item>`
    )
    .join("");
  const footer = `\n</channel>\n</rss>`;
  return header + body + footer;
}

/****************************
 * INTERFACES
 ****************************/
interface Announcement {
  id: string;
  title: string;
  body: string;
  date: string;
  pinned: boolean;
  source?: string;
  category?: string;
  imageUrl?: string;
}

interface AnnouncementApiResponse {
  success: boolean;
  data: {
    id: number;
    title: string;
    content: string;
    imageUrl?: string | null;
    publishDate: string;
    schoolId: number;
    isActive: boolean;
    category?: string;
    source?: string;
  }[];
}

/****************************
 * COMPONENTS
 ****************************/
const Tag = ({ children }: { children: React.ReactNode }) => (
  <span className="px-3 py-1 text-[11px] rounded-full bg-black/10 text-black border border-black/20 font-medium">
    {children}
  </span>
);

function AnnouncementCard({ item, onDetail }: { item: Announcement; onDetail: (item: Announcement) => void }) {
  const baru = isNewWithin(item.date, 7);
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
      className="rounded-2xl p-6 bg-white border border-black/10 shadow-sm hover:shadow-lg transition cursor-pointer min-h-[360px] flex flex-col"
    >
      {/* Gambar fixed height */}
      <div className="w-full h-[150px] overflow-hidden rounded-lg mb-4 flex-shrink-0">
        <img
          src={item.imageUrl || "/default-pengumuman.png"}
          alt={item.title}
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Info tanggal */}
      <div className="text-xs text-black/60 mb-2">
        {fmtDate(item.date)}
      </div>

      {/* Judul */}
      <h3 className="text-xl font-bold text-black leading-snug line-clamp-2 mb-2">
        {item.title}
      </h3>

      {/* Badge category & source */}
      <div className="flex flex-wrap gap-2 mb-3">
        <Tag>{item.category || "Umum"}</Tag>
        {item.source && (
          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-purple-600 text-white">
            {item.source}
          </span>
        )}
        {baru && (
          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-black text-white">
            BARU
          </span>
        )}
      </div>

      {/* Deskripsi */}
      <p className="text-sm text-black/80 line-clamp-3 flex-1 mb-4">
        {item.body}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <button
          onClick={() => onDetail(item)}
          className="text-sm font-semibold text-black underline hover:no-underline"
        >
          Baca selengkapnya →
        </button>
        {item.pinned && (
          <span className="text-xs text-black/50">Dipin</span>
        )}
      </div>
    </motion.article>
  );
}

function FilterBar({
  query,
  setQuery,
  selectedCategory,
  setSelectedCategory,
  availableCategories,
  selectedSource,
  setSelectedSource,
  availableSources,
}: {
  query: string;
  setQuery: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  availableCategories: string[];
  selectedSource: string;
  setSelectedSource: (value: string) => void;
  availableSources: string[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row md:items-end gap-6 mt-8"
    >
      <div className="flex-1">
        <label className="block text-sm font-medium text-black/80 mb-2">
          Cari Pengumuman
        </label>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ketik judul atau isi pengumuman..."
          className="w-full px-5 py-3 rounded-xl border border-black/20 bg-white text-black placeholder-black/40 focus:outline-none focus:border-black transition"
        />
      </div>

      <div className="flex gap-4">
        <div>
          <label className="block text-sm font-medium text-black/80 mb-2">
            Kategori
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 rounded-xl text-sm border text-black border-black/20 bg-white w-40"
          >
            {availableCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-black/80 mb-2">
            Sumber
          </label>
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="px-4 py-3 rounded-xl text-sm border text-black border-black/20 bg-white w-40"
          >
            {availableSources.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
    </motion.div>
  );
}

/****************************
 * SECTION: Announcements
 ****************************/
function AnnouncementsSection() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("Semua");
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const schoolId = getSchoolId();
        const res = await fetch(`https://be-school.kiraproject.id/pengumuman?schoolId=${schoolId}`);
        const result = await res.json();
        if (result.success) {
          const mapped = result.data.map((item: any) => ({
            id: item.id.toString(),
            title: item.title,
            body: item.content,
            date: item.publishDate,
            category: item.category || "Umum",
            source: item.source || "Sekolah",
            imageUrl: item.imageUrl
          }));
          setAnnouncements(mapped);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = useMemo(() => ["Semua", ...Array.from(new Set(announcements.map(a => a.category)))], [announcements]);

  const filtered = announcements.filter(a => {
    const matchQ = a.title.toLowerCase().includes(query.toLowerCase()) || a.body.toLowerCase().includes(query.toLowerCase());
    const matchC = cat === "Semua" || a.category === cat;
    return matchQ && matchC;
  });

  return (
    <section className="py-16 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header Content */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-8 border-b border-gray-200 pb-12">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-12 h-[2px] bg-blue-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Official Notice</span>
            </div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-[0.9]">
              Papan <span className="text-blue-600">Pengumuman</span>
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative md:w-max w-full">
              <input
                type="text"
                placeholder="Cari Sekarang..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-12 pr-6 w-full py-4 rounded-2xl bg-gray-200 placeholder:text-black/50 border-none shadow-sm font-bold text-gray-800 focus:ring-2 focus:ring-blue-100 transition min-w-[300px]"
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              className="px-6 py-4 rounded-2xl bg-gray-200 placeholder:text-black/50 border-none shadow-sm font-black uppercase tracking-widest text-gray-500 focus:ring-2 focus:ring-blue-100"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Grid Display */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map(i => <div key={i} className="h-[300px] bg-gray-200/50 rounded-[2rem] animate-pulse" />)}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filtered.map((item) => (
                <AnnouncementCard key={item.id} item={item} onDetail={setSelectedItem} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Tactical Slide-in Modal */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-end p-0"
              onClick={() => setSelectedItem(null)}
            >
              <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative w-full max-w-2xl bg-white h-screen shadow-2xl overflow-y-auto flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-8">
                  <button 
                    onClick={() => setSelectedItem(null)}
                    className="mb-12 flex text-red-600 items-center gap-2 text-[16px] font-black uppercase tracking-widest hover:gap-4 transition-all"
                  >
                    <ArrowLeft size={26} /> Kembali sekarang
                  </button>

                  <div className="flex gap-3 mb-8">
                    <StatusTag variant="new">{selectedItem.category}</StatusTag>
                    {selectedItem.source && <StatusTag variant="dinas">{selectedItem.source}</StatusTag>}
                  </div>

                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase italic leading-[0.9] mb-8">
                    {selectedItem.title}
                  </h2>

                  <div className="h-[1px] w-full bg-gray-100 mb-8" />

                  {selectedItem.imageUrl && (
                    <img 
                      src={selectedItem.imageUrl} 
                      className="w-full h-auto rounded-3xl mb-8 shadow-lg"
                      alt="notice" 
                    />
                  )}

                  <div className="flex flex-col gap-6">
                    <div className="flex gap-10">
                       <div>
                          <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Date</p>
                          <p className="text-sm font-bold text-gray-900">{fmtDate(selectedItem.date)}</p>
                       </div>
                       <div>
                          <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Ref ID</p>
                          <p className="text-sm font-bold text-gray-900">#{selectedItem.id.padStart(4, '0')}</p>
                       </div>
                    </div>
                    
                    <div className="prose prose-blue max-w-none">
                      <p className="text-gray-600 font-medium leading-relaxed whitespace-pre-wrap text-lg">
                        {selectedItem.body}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/****************************
 * PAGE UTAMA
 ****************************/
const PengumumanPage = () => {
  const schoolInfo = SMAN25_CONFIG;
  const schoolName = schoolInfo.fullName;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavbarComp />
      <HeroComp titleProps="Info Pengumuman" id="#pengumuman" />
      <main className="flex-1 relative z-[1]" id="pengumuman">
        <AnnouncementsSection schoolName={schoolName} />
      </main>
      <FooterComp />
    </div>
  );
};

export default PengumumanPage;
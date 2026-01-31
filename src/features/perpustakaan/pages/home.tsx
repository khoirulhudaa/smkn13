import { SMAN25_CONFIG } from "@/core/theme";
import { FooterComp } from "@/features/_global/components/footer";
import { HeroComp } from "@/features/_global/components/hero";
import NavbarComp from "@/features/_global/components/navbar";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

/****************************
 * PERPUSTAKAAN — Data & Helpers
 ****************************/
function getExt(name = "") {
  const m = String(name).toLowerCase().match(/\.([a-z0-9]+)$/);
  return m ? `.${m[1]}` : "";
}
const prettySize = (n) => {
  if (!Number.isFinite(n)) return "-";
  const kb = n / 1024; if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024; return `${mb.toFixed(2)} MB`;
};
const READS_KEY = "smkn13_library_reads";
const loadReads = () => { try { return JSON.parse(localStorage.getItem(READS_KEY) || '{}'); } catch { return {}; } };
const saveReads = (obj) => { try { localStorage.setItem(READS_KEY, JSON.stringify(obj)); } catch {} };
const getReadCount = (id) => (loadReads()[id] || 0);
const incrementRead = (id) => { const m = loadReads(); m[id] = (m[id]||0)+1; saveReads(m); return m[id]; };
const mimeOf: any = (ext: any) => ({
  ".html": "text/html",
  ".htm": "text/html",
  ".md": "text/markdown",
  ".markdown": "text/markdown",
  ".txt": "text/plain",
  ".pdf": "application/pdf",
  ".epub": "application/epub+zip",
}[ext] || "application/octet-stream");

const DEMO_BOOKS = [
  { id: "buku-web-1", title: "Dasar-Dasar HTML & CSS", author: "Tim RPL", category: "TIK", format: ".html", pages: 24, cover: '/slide2.jpg',
    generateBlob: () => new Blob(["<!doctype html><meta charset='utf-8'><title>Dasar HTML & CSS</title>","<style>body{font:16px/1.6 system-ui;padding:24px}h1{color:#1F3B76}</style>","<h1>Dasar-Dasar HTML & CSS</h1><p>Ini contoh buku demo untuk perpustakaan sekolah.</p>"], { type: mimeOf('.html') }) },
  { id: "buku-md-1", title: "Tips Produktif Belajar", author: "BK SMKN 13", category: "Pengembangan Diri", format: ".md", pages: 18, cover: '/slide2.jpg',
    generateBlob: () => new Blob([`# Tips Produktif Belajar\n\n**Fokus 25 menit** (Teknik Pomodoro) diikuti istirahat 5 menit.\n\n*Matikan notifikasi* saat mengerjakan tugas.`], { type: mimeOf('.md') }) },
  { id: "buku-txt-1", title: "Peraturan Perpustakaan", author: "Petugas Perpus", category: "Informasi", format: ".txt", pages: 6, cover: '/slide2.jpg',
    generateBlob: () => new Blob([`PERATURAN PERPUSTAKAAN SMKN 13 JAKARTA\n\n1. Jaga ketenangan.\n2. Maks pinjam 7 hari.\n3. Denda keterlambatan Rp1.000/hari.`], { type: mimeOf('.txt') }) },
  { id: "buku-epub-1", title: "Panduan Magang Industri", author: "Hubin", category: "Karier", format: ".epub", pages: 120, cover: '/slide2.jpg',
    generateBlob: () => new Blob(["EPUB belum dimuat (butuh epub.js)."], { type: mimeOf('.epub') }) },
  { id: "buku-md-2", title: "Etika Digital untuk Siswa", author: "Kesiswaan", category: "Karakter", format: ".md", pages: 22, cover: '/slide2.jpg',
    generateBlob: () => new Blob([`# Etika Digital\n\nGunakan internet secara bertanggung jawab.`], { type: mimeOf('.md') }) },
  { id: "buku-web-2", title: "Pengantar JavaScript", author: "Tim RPL", category: "TIK", format: ".html", pages: 30, cover: '/slide2.jpg',
    generateBlob: () => new Blob(["<!doctype html><meta charset='utf-8'><title>JS</title>","<h1>Pengantar JS</h1><p>Variabel, fungsi, DOM.</p>"], { type: mimeOf('.html') }) },
  { id: "buku-txt-2", title: "Panduan OSIS", author: "OSIS", category: "Organisasi", format: ".txt", pages: 14, cover: '/slide2.jpg',
    generateBlob: () => new Blob([`Struktur, program kerja, dan SOP kegiatan.`], { type: mimeOf('.txt') }) },
  { id: "buku-md-3", title: "K3 Dasar di Bengkel", author: "Kaprog Teknik", category: "K3", format: ".md", pages: 26, cover: '/slide2.jpg',
    generateBlob: () => new Blob([`# K3 Dasar\n\nPakai APD, cek peralatan, SOP.`], { type: mimeOf('.md') }) },
  { id: "buku-web-3", title: "Desain UI Sekolah", author: "Tim Multimedia", category: "Desain", format: ".html", pages: 28, cover: '/slide2.jpg',
    generateBlob: () => new Blob(["<!doctype html><meta charset='utf-8'><title>UI</title>","<h1>Prinsip UI</h1><p>Kontras, hierarki, konsistensi.</p>"], { type: mimeOf('.html') }) },
  { id: "buku-txt-3", title: "SOP Peminjaman Perpustakaan", author: "Petugas Perpus", category: "Informasi", format: ".txt", pages: 8, cover: '/slide2.jpg',
    generateBlob: () => new Blob([`Alur: Cari → Ambil → Pinjam → Kembalikan.`], { type: mimeOf('.txt') }) },
  { id: "buku-md-4", title: "Sejarah SMKN 13 Jakarta", author: "Tim Sejarah", category: "Sejarah", format: ".md", pages: 40, cover: '/slide2.jpg',
    generateBlob: () => new Blob([`# Sejarah SMKN 13\n\nDidirikan tahun 19xx, berkembang hingga sekarang.`], { type: mimeOf('.md') }) },
  { id: "buku-web-4", title: "Panduan Ekstrakurikuler", author: "Pembina Ekskul", category: "Organisasi", format: ".html", pages: 32, cover: '/slide2.jpg',
    generateBlob: () => new Blob(["<!doctype html><meta charset='utf-8'><title>Ekskul</title>","<h1>Panduan Ekskul</h1><p>Kegiatan ekstrakurikuler di sekolah.</p>"], { type: mimeOf('.html') }) },
];

const StatChip = ({ children, theme }) => (
  <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.10)", color: theme.primaryText }}>{children}</span>
);

const ShelfCard = ({ book, theme, onRead }) => (
  <motion.div layout whileHover={{ y: -4 }} whileTap={{ scale: 0.99 }} className="rounded-xl md:h-[500px] overflow-hidden shrink-0 w-full" style={{background: theme.surface }}>
    <div className="w-full" style={{ aspectRatio: '3 / 4', background: theme.subtle }}>
      <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
    </div>
    <div className="p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="font-semibold text-sm line-clamp-2" style={{ color: 'black' }}>{book.title}</div>
        <StatChip theme={theme}>{book.format.toUpperCase().replace('.', '')}</StatChip>
      </div>
      <div className="text-[11px] opacity-80 mt-1" style={{ color: 'black' }}>{book.author}</div>
      <div className="mt-2 flex items-center justify-between text-[11px]">
        {/* <div style={{ color: theme.primaryText }}>Baca: <strong>{getReadCount(book.id)}</strong>x</div> */}
        <div style={{ color: 'black' }}>{book.pages} hlm</div>
      </div>
      {/* <div className="mt-2 flex items-center gap-2">
        <button onClick={()=>onRead(book)} className="text-[11px] px-2 py-1 rounded-lg" style={{ background: "rgba(255,255,255,0.08)", color: theme.primaryText }}>Baca</button>
      </div> */}
    </div>
  </motion.div>
);

/****************************
 * Reader (HTML/MD/TXT/PDF/EPUB*)
 ****************************/
const Reader = ({ item, theme, onClose }) => {
  const [blobUrl, setBlobUrl] = useState(null);
  const [text, setText] = useState("");
  const ext = getExt(item?.name);

  useEffect(()=>{
    if (!item) return;
    const url = URL.createObjectURL(item);
    setBlobUrl(url);
    const fr = new FileReader();
    if ([".txt", ".md", ".markdown", ".html", ".htm"].includes(ext)) {
      fr.onload = () => setText(String(fr.result||""));
      fr.readAsText(item);
    }
    return () => { URL.revokeObjectURL(url); };
  }, [item]);

  const makeSrcDoc = () => {
    if (!text) return undefined;
    if (ext === ".html" || ext === ".htm") return text;
    if (ext === ".md" || ext === ".markdown") {
      let html = text
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/\*\*(.*?)\*\*/gim, '<b>$1</b>')
        .replace(/\*(.*?)\*/gim, '<i>$1</i>')
        .replace(/\n\n/g, '<br/>');
      return `<!doctype html><html><head><meta charset='utf-8'/><meta name='viewport' content='width=device-width, initial-scale=1'>
        <style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial;line-height:1.6;padding:16px;color:${theme.primaryText};background:${theme.surface}}h1,h2,h3{margin:0 0 8px}</style></head><body>${html}</body></html>`;
    }
    if (ext === ".txt") {
      const esc = (s)=>s.replace(/[&<>]/g,(c)=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));
      const pre = `<pre style="white-space:pre-wrap">${esc(text)}</pre>`;
      return `<!doctype html><meta charset='utf-8'/>${pre}`;
    }
    return undefined;
  };

  return (
    <AnimatePresence>
      {item && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] p-4 flex" style={{ background: 'rgba(0,0,0,0.35)' }}>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
            className="relative max-w-5xl w-full mx-auto rounded-2xl overflow-hidden flex flex-col"
            style={{ background: theme.surface }}>
            <div className="flex items-center justify-between p-3" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="text-sm" style={{ color: theme.primaryText }}>
                <strong>{item.name}</strong> · {getExt(item.name).toUpperCase()} · {prettySize(item.size)}
              </div>
              <div className="flex items-center gap-2">
                {blobUrl && (
                  <a className="text-xs px-3 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.08)', color: theme.primaryText }} href={blobUrl} download={item.name}>Unduh</a>
                )}
                <button onClick={onClose} className="text-xs px-3 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.08)', color: theme.primaryText }}>Tutup</button>
              </div>
            </div>

            <div className="flex-1 overflow-auto" style={{ background: theme.bg }}>
              {(ext === ".pdf") && blobUrl && (
                <motion.embed initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={blobUrl} type="application/pdf" className="w-full" style={{ height: "calc(100vh - 180px)" }} />
              )}

              {(ext === ".html" || ext === ".htm" || ext === ".md" || ext === ".markdown" || ext === ".txt") && (
                <motion.iframe initial={{ opacity: 0 }} animate={{ opacity: 1 }} srcDoc={makeSrcDoc()} className="w-full" style={{ height: "calc(100vh - 180px)", background: theme.surface }} sandbox="allow-same-origin allow-popups allow-forms" />
              )}

              {ext === ".epub" && (
                <div className="p-4 text-sm" style={{ color: theme.primaryText }}>
                  <div className="mb-2">Pratinjau EPUB:</div>
                  {typeof window !== 'undefined' && window?.ePub ? (
                    <EpubInlineReader file={item} theme={theme} />
                  ) : (
                    <div>
                      Browser belum punya <code>epub.js</code>. Silakan unduh file atau pasang <em>epub.js</em> global (window.ePub) untuk pratinjau langsung.
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const EpubInlineReader = ({ file, theme }) => {
  const containerRef = useRef(null);
  useEffect(()=>{
    if (!file || !(typeof window !== 'undefined' && window?.ePub)) return;
    const url = URL.createObjectURL(file);
    const b = window.ePub(url);
    const r = b.renderTo(containerRef.current, { width: '100%', height: '70vh', spread: 'auto', manager: 'continuous' });
    r.display();
    return () => { URL.revokeObjectURL(url); b && b.destroy && b.destroy(); };
  }, [file]);
  return <div ref={containerRef} className="rounded-xl" style={{ background: theme.surface }} />;
};

/****************************
 * Library Section — Carousel 3 Baris with API Integration
 ****************************/
function LibrarySection({ theme }) {
  const safeTheme = SMAN25_CONFIG;
  const [openItem, setOpenItem] = useState(null);
  const [query, setQuery] = useState("islam");
  const [apiBooks, setApiBooks] = useState([]); // State for API-fetched books

  // 3-ROW CAROUSEL CONFIG
  const GAP = 12; // px
  const ROWS = 3;

  const viewportRef = useRef(null);
  const scrollerRef = useRef(null);
  const [vw, setVw] = useState(0);
  const [cols, setCols] = useState(3);
  const [pageIndex, setPageIndex] = useState(0);

  // Fetch books from API when query changes
useEffect(() => {
  if (!query.trim()) {
    setApiBooks([]); // Clear API books if query is empty
    return;
  }

  const fetchBooks = async () => {
    try {
      const response = await fetch("http://lib.sman1jkt.sch.id/index.php?p=api/book/search", {
        method: "POST",
        body: JSON.stringify({ keyword: query }), // Use query directly
      });
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        const mappedBooks = result.data.map((book, index) => ({
          id: book.id || `api-book-${index}`,
          title: book.title || "Untitled",
          author: book.authors?.[0]?.author_name || "Unknown Author",
          category: book.subjects?.[0]?.topic || "Uncategorized",
          format: ".pdf",
          pages: parseInt(book.collation) || 50,
          cover: book.image
            ? `http://lib.sman1jkt.sch.id/${book.image.replace(/^\.\//, "")}`
            : "/slide2.jpg",
          generateBlob: () => new Blob([`Placeholder content for ${book.title}`], { type: mimeOf(".txt") }),
        }));
        setApiBooks(mappedBooks);
      } else {
        setApiBooks([]);
      }
    } catch (error) {
      console.error("Error fetching books from API:", error);
      setApiBooks([]);
    }
  };

  const debounce = setTimeout(fetchBooks, 300);
  return () => clearTimeout(debounce);
}, [query]);

// Example input handler to reset query to "islam" when cleared
const handleInputChange = (e) => {
  const value = e.target.value;
  setQuery(value || "islam"); // Set to "islam" if input is empty
};

  // Filter API books based on search query
  const filteredBooks = useMemo(() => {
    return apiBooks.filter(
      (b) =>
        b.title.toLowerCase().includes(query.toLowerCase()) ||
        b.author.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, apiBooks]);

  const pageSize = Math.max(ROWS * Math.max(1, cols), ROWS);

  const pages = useMemo(() => {
    const arr = [];
    for (let i = 0; i < filteredBooks.length; i += pageSize) {
      arr.push(filteredBooks.slice(i, i + pageSize));
    }
    return arr;
  }, [filteredBooks, pageSize]);

  useEffect(() => {
    setPageIndex((i) => Math.min(i, Math.max(0, pages.length - 1)));
  }, [pages.length]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: pageIndex * vw, behavior: "smooth" });
  }, [pageIndex, vw]);

  const handleRead = (book) => {
    const blob = book.generateBlob();
    const file = new File([blob], `${book.title}${book.format}`, {
      type: blob.type || mimeOf(book.format),
      lastModified: Date.now(),
    });
    incrementRead(book.id);
    setOpenItem(file);
  };

  const go = (dir) =>
    setPageIndex((i) => {
      const next = i + dir;
      if (next < 0) return 0;
      if (next > pages.length - 1) return pages.length - 1;
      return next;
    });

  return (
    <section id="perpustakaan-content" className="pb-12 md:pb-16">

      <HeroComp titleProps="Perpus Digital" id="#perpus"/>

      <div className="max-w-7xl mx-auto px-4 mt-12" id="perpus">
        <div className="w-full mb-10 flex items-center justify-between">
          <div className="w-full md:items-center flex flex-col md:justify-center gap-4 mb-4">
            <h2
              className="text-2xl md:text-3xl font-bold"
              style={{ color: 'black' }}
            >
              Cari buku
            </h2>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari judul/penulis…"
              className="px-4 py-4 mt-4 rounded-xl border border-gray-500 text-sm w-[80%]"
              style={{ background: "rgba(255,255,255,0.08)", color: 'black' }}
            />
          </div>

            {/* <div
              className="text-xs text-right lg:mt-0 mt-3"
              style={{ color: safeTheme.primaryText }}
            >
              Buku Tersedia: <strong>{filteredBooks.length}</strong>
              <br />
              Total Dibaca: <strong>{totalReads}</strong>
            </div> */}
        </div>

        {/* Viewport */}
        <div ref={viewportRef} className="w-full overflow-hidden rounded-2xl">
          {/* Scroller pages */}
          <div
            ref={scrollerRef}
            className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 overflow-x-auto"
            style={{ scrollBehavior: "smooth" }}
          >
            {pages.map((page, pIdx) => (
              <div
                key={pIdx}
                className="w-full px-1"
                style={{ width: vw || "100%" }}
              >
                <div className="gap-3 space-y-2 flex flex-wrap justify-between">
                  {page.map((b) => (
                    <ShelfCard key={b.id} book={b} theme={safeTheme} onRead={handleRead} />
                  ))}
                </div>
              </div>
            ))}
            {pages.length === 0 && (
              <motion.div
                layout
                className="w-max rounded-2xl p-4 text-sm"
                style={{ color: safeTheme.surfaceText, background: "rgba(255,255,255,0.06)" }}
              >
                <p className="w-max">
                  Tidak ada buku yang cocok dengan pencarian.
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Dots */}
        {/* <div className="mt-3 flex items-center justify-center gap-2">
          {pages.map((_, i) => (
            <button
              key={i}
              onClick={() => setPageIndex(i)}
              className="h-2 rounded-full transition-all"
              style={{
                width: i === pageIndex ? 24 : 8,
                background: i === pageIndex ? 'black' : safeTheme.subtle,
              }}
              aria-label={`Halaman ${i + 1}`}
            />
          ))}
        </div> */}
      </div>

      <Reader item={openItem} theme={safeTheme} onClose={() => setOpenItem(null)} />
    </section>
  );
}

/*************************
 * DEFAULT EXPORT + TESTS
 *************************/
const PerpustakaanPage = () => {
  const theme = SMAN25_CONFIG;

  return (
    <div className="min-h-screen" style={{ background: theme.theme.bg }}>
      <NavbarComp theme={theme} />
      <main>
        <LibrarySection theme={theme} />
      </main>
      <FooterComp />
    </div>
  );
}

export default PerpustakaanPage;

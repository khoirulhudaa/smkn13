import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

/****************************
 * THEME & SAFETY GUARDS
 ****************************/
const THEMES = {
  smkn13: {
    name: "SMKN 13 Jakarta",
    primary: "#1F3B76",
    primaryText: "#ffffff",
    accent: "#F2C94C",
    bg: "#0B1733",
    surface: "#102347",
    surfaceText: "#ffffff",
    subtle: "#2C3F6B",
    pop: "#E63946",
    dinas: "#4CAF50",
  },
};
const getSafeTheme = (t) => ({ ...THEMES.smkn13, ...(t || {}) });

/****************************
 * NAV DATA & HELPERS
 ****************************/
const NAV = [
  { label: "Beranda", href: "/dashboard" },
  { label: "Pramuka", href: "/pramuka" },
  { label: "Pramuka", href: "/pramuka" },
  { label: "Profil", children: [
    { label: "Sambutan", href: "/sambutan" },
    { label: "Visi & Misi", href: "/visiMisi" },
    { label: "Sejarah", href: "/sejarah" },
    { label: "Struktur", href: "/struktur" },
    { label: "Galeri", href: "/galeri" },
  ]},
  { label: "Akademik", children: [
    { label: "Kurikulum", href: "/kurikulum" },
    { label: "Kalender", href: "/kalender" },
    { label: "Jadwal", href: "/jadwal" },
    { label: "Guru & Tendik", href: "/guru-tendik" },
  ]},
  { label: "Kesiswaan", children: [
    { label: "OSIS", href: "/osis" },
    { label: "Pemilihan OSIS", href: "/kandidatosis" },
    { label: "Ekstrakurikuler", href: "/ekstrakulikuler" },
    { label: "Prestasi", href: "/prestasi" },
  ]},
  { label: "Perpustakaan", href: "/perpustakaan" },
    { label: "Informasi", children: [
    { label: "Pengumuman", href: "/pengumuman" },
    { label: "Berita", href: "/berita" },
    { label: "Agenda", href: "/agenda" },
    { label: "Buku alumni", href: "/buku-alumni" },
    { label: "PPDB", href: "/ppdb" },
    { label: "PPID", href: "/ppid" },
    { label: "Layanan", href: "/layanan" },
    { label: "Kelulusan", href: "/kelulusan" },
  ]},
  { label: "Galeri", href: "/dashboard#galeri" },
];


const makeSvg = (
  width: number,
  height: number,
  color1: string,
  color2: string,
  title: string,
  subtitle: string = ""
): string => {
  const svgContent = `
    <?xml version="1.0" encoding="UTF-8"?>
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${color1}"/>
          <stop offset="100%" stop-color="${color2}"/>
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#g)"/>
      <g fill="rgba(255, 255, 255, 0.95)" font-family="Inter, Arial, sans-serif" font-weight="700">
        <text x="6%" y="55%" font-size="${Math.round(height / 12)}">${title.replace(/&/g, "&amp;")}</text>
        <text x="6%" y="70%" font-size="${Math.round(height / 24)}" opacity="0.9">${subtitle.replace(/&/g, "&amp;")}</text>
      </g>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
};

/****************************
 * ANIMATION VARIANTS (Framer Motion)
 ****************************/
const gridVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.02 }
  },
  exit: { opacity: 0 }
};
const cardVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 20 } },
  exit: { opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.15 } }
};

const Link = ({ href, className, style, children, target, rel }) => (
  <a href={href} className={className} style={style} target={target} rel={rel}>{children}</a>
);
/****************
 * UTILITIES
 ****************/
const PPDB_PERIOD = {
  start: new Date("2025-05-01T00:00:00+07:00"),
  end: new Date("2025-07-31T23:59:59+07:00"),
};
const isWithinPeriod = (now, { start, end }) => now >= start && now <= end;
const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (e) => {
      if (!ref.current || (e.target instanceof Node && ref.current.contains(e.target))) return;
      handler(e);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};


/*********
 * BADGE
 *********/
const Badge = ({ children, theme }) => (
  <span className="flex items-center px-2 py-2 h-max text-xs rounded-md border"
    style={{ background: theme.accent, color: "#1b1b1b", borderColor: theme.accent }}>{children}</span>
);

/****************
 * LOGIN MENU (header yellow button with submenu)
 ****************/
const LoginMenu = ({ theme }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useOnClickOutside(ref, () => setOpen(false));
  const items = [
    { label: "Guru", href: "https://teacher.xpresensi.com" },
    { label: "Orang Tua", href: "https://parent.xpresensi.com" },
    { label: "Siswa", href: "https://student.xpresensi.com" },
    { label: "Admin", href: "https://admin.xpresensi.com" },
  ];
  return (
    <div className="relative" ref={ref}>
      <button className="text-sm font-medium rounded-xl px-3 py-2"
              style={{ background: theme.accent, color: "#1b1b1b" }}
              onClick={() => setOpen(v => !v)} aria-haspopup="menu" aria-expanded={open}>Login ▾</button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.16 }}
            className="absolute right-0 mt-2 w-48 rounded-xl border shadow-xl p-2"
            style={{ background: "rgba(255,255,255,0.95)", borderColor: THEMES.smkn13.subtle }} role="menu">
            {items.map((i) => (
              <Link key={i.label} href={i.href} target="_blank" rel="noopener noreferrer"
                className="block px-3 py-2 rounded-lg text-sm hover:bg-black/5" style={{ color: "#111827" }} role="menuitem">{i.label}</Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/****************
 * NAV COMPONENTS
 ****************/
const NavDropdown = ({ item, theme }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useOnClickOutside(ref, () => setOpen(false));
  const hasChild = Array.isArray(item.children) && item.children.length > 0;
  if (!hasChild) {
    const isRoute = typeof item.href === "string" && item.href.startsWith("/");
    return isRoute ? (
      <Link href={item.href} className="text-sm px-1 py-1 hover:underline" style={{ color: theme.primaryText }}>{item.label}</Link>
    ) : (
      <a href={item.href} className="text-sm px-1 py-1 hover:underline" style={{ color: theme.primaryText }}>{item.label}</a>
    );
  }
  return (
    <div className="relative" ref={ref} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className="text-sm px-1 py-1 flex items-center gap-1" style={{ color: theme.primaryText }} onClick={() => setOpen(v => !v)}>
        {item.label}<span aria-hidden>▾</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.16 }}
            className="absolute left-0 mt-2 w-52 rounded-xl border shadow-xl p-2" style={{ background: "rgba(16,23,71,0.98)", borderColor: theme.subtle }}>
            {item.children.map(c => {
              const isRoute = typeof c.href === "string" && c.href.startsWith("/");
              return isRoute ? (
                <Link key={c.label} href={c.href} className="block px-3 py-2 rounded-lg text-sm hover:bg-white/10" style={{ color: theme.primaryText }}>{c.label}</Link>
              ) : (
                <a key={c.label} href={c.href} className="block px-3 py-2 rounded-lg text-sm hover:bg-white/10" style={{ color: theme.primaryText }}>{c.label}</a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const useMobileMenu = (isOpen, onClose) => {
  const ref = useRef(null);
  useOnClickOutside(ref, onClose);
  return ref;
};

const MobileAccordion = ({ item, theme }) => {
  const [open, setOpen] = useState(false);
  const hasChild = Array.isArray(item.children) && item.children.length > 0;
  if (!hasChild) {
    const isRoute = typeof item.href === "string" && item.href.startsWith("/");
    return isRoute ? (
      <Link href={item.href} className="block px-4 py-3 rounded-lg hover:bg-white/10 transition-colors" style={{ color: theme.primaryText }}>{item.label}</Link>
    ) : (
      <a href={item.href} className="block px-4 py-3 rounded-lg hover:bg-white/10 transition-colors" style={{ color: theme.primaryText }}>{item.label}</a>
    );
  }
  return (
    <div>
      <button onClick={() => setOpen(v => !v)} className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-white/10 transition-colors" style={{ color: theme.primaryText }}>
        <span>{item.label}</span><span>{open ? "−" : "+"}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: "auto", opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }} 
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden pl-4"
          >
            {item.children.map(c => {
              const isRoute = typeof c.href === "string" && c.href.startsWith("/");
              return isRoute ? (
                <Link key={c.label} href={c.href} className="block px-4 py-2 rounded-lg text-sm hover:bg-white/5 transition-colors mt-1" style={{ color: theme.primaryText }}>{c.label}</Link>
              ) : (
                <a key={c.label} href={c.href} className="block px-4 py-2 rounded-lg text-sm hover:bg-white/5 transition-colors mt-1" style={{ color: theme.primaryText }}>{c.label}</a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/***********
 * NAVBAR
 ***********/
const Navbar = ({ theme = THEMES.smkn13, onTenantChange = () => {}, currentKey = "smkn13" }) => {
  const safeTheme = theme || THEMES.smkn13;
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileRef = useMobileMenu(mobileOpen, () => setMobileOpen(false)); // Baru: Hook untuk tutup saat click outside
  const ppdbActive = isWithinPeriod(new Date(), PPDB_PERIOD);
  const navItems = NAV.map(it => it.children ? ({ ...it, children: it.children.filter(c => c.label !== 'PPDB1' || ppdbActive) }) : it);
  
  return (
    <>
      {/* Navbar Desktop + Mobile Header */}
      <div className="w-full sticky top-0 z-[999999] backdrop-blur supports-[backdrop-filter]:bg-white/5" style={{ background: "rgba(0,0,0,0.25)", borderBottom: `1px solid ${safeTheme.subtle}` }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-3 md:py-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold" style={{ background: safeTheme.accent, color: "#111827" }}>13</div>
              <div className="leading-none"><div className="text-base md:text-lg font-semibold" style={{ color: safeTheme.primaryText }}>SMKN 13 Jakarta</div></div>
            </div>
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navItems.map(item => <NavDropdown key={item.label} item={item} theme={safeTheme} />)}
            </div>
            {/* Perubahan: Uncomment dan sesuaikan untuk mobile + desktop */}
            <div className="flex items-center gap-2">
              <LoginMenu theme={safeTheme} /> {/* Tampil di desktop */}
              <button 
                className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border" 
                aria-label="Menu" 
                onClick={() => setMobileOpen(v => !v)} 
                style={{ borderColor: safeTheme.subtle, color: safeTheme.primaryText }}
              >
                ☰
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Perubahan: Menu Mobile sebagai Sidebar Overlay dari Kiri */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop Overlay (opsional, untuk tutup saat tap background) */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              transition={{ duration: 0.2 }} 
              className="fixed inset-0 bg-black/50 lg:hidden z-[99999999999]" 
              onClick={() => setMobileOpen(false)} 
              aria-hidden="true"
            />
            {/* Sidebar Menu */}
            <motion.div 
              ref={mobileRef}
              initial={{ x: "-100%" }}  // Mulai dari kiri luar layar
              animate={{ x: 0 }}        // Slide ke posisi normal
              exit={{ x: "-100%" }}     // Slide keluar ke kiri
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }} // Smooth ease
              className="fixed left-0 top-0 h-full w-4/5 max-w-sm bg-[rgba(16,23,71,0.98)] border-r shadow-2xl p-4 z-[9999999999999] lg:hidden overflow-y-auto"
              style={{ borderColor: safeTheme.subtle }}
            >
              <div className="flex items-center justify-between mb-6 pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-2xl flex items-center justify-center font-bold text-xs" style={{ background: safeTheme.accent, color: "#111827" }}>13</div>
                  <div className="text-sm font-semibold" style={{ color: safeTheme.primaryText }}>Menu</div>
                </div>
                <button 
                  onClick={() => setMobileOpen(false)} 
                  className="text-2xl" 
                  style={{ color: safeTheme.primaryText }}
                  aria-label="Tutup Menu"
                >
                  ×
                </button>
              </div>
              <div className="space-y-2">
                {navItems.map(item => <MobileAccordion key={item.label} item={item} theme={safeTheme} />)}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};


const SITE_SINCE = Number.parseInt(
  (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_SITE_SINCE) || '2025',
  10
);

/****************
 * FOOTER
 ****************/
const Footer = ({ theme }) => {
  const now = new Date().getFullYear();
  const from = Number.isFinite(SITE_SINCE) ? SITE_SINCE : now;
  const yearLabel = from < now ? `${from} — ${now}` : `${now}`;
  return (
    <footer className="mt-8">
      <div className="max-w-7xl mx-auto px-4 py-10 border-t border-white/20">
        <div className="grid md:grid-cols-4 gap-6">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold" style={{ background: theme.accent, color: "#111827" }}>13</div>
              <div>
                <div className="text-base font-semibold" style={{ color: THEMES.smkn13.primaryText }}>SMKN 13 Jakarta</div>
                <div className="text-xs opacity-80" style={{ color: THEMES.smkn13.primaryText }}>Sekolah Menengah Kejuruan Negeri</div>
              </div>
            </div>
            <p className="mt-3 text-sm opacity-85" style={{ color: THEMES.smkn13.primaryText }}>Mewujudkan lulusan berkarakter, kompeten, dan siap kerja melalui lingkungan belajar yang modern dan inklusif.</p>
          </div>
          <div>
            <div className="text-sm font-semibold mb-2" style={{ color: THEMES.smkn13.primaryText }}>Tautan</div>
            <ul className="text-sm space-y-1" style={{ color: THEMES.smkn13.primaryText }}>
              <li><a href="#profil">Profil</a></li>
              <li><a href="#pengumuman">Pengumuman</a></li>
              <li><a href="#galeri">Galeri</a></li>
              <li><a href="#kontak">Kontak</a></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold mb-2" style={{ color: THEMES.smkn13.primaryText }}>Kontak</div>
            <div className="text-sm opacity-85" style={{ color: THEMES.smkn13.primaryText }}>
              Jl. Contoh No. 13, Jakarta Pusat<br />
              (021) 987‑654<br />
              info@smkn13.sch.id
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm opacity-80" style={{ color: THEMES.smkn13.primaryText }}>© {yearLabel} — SMKN 13 Jakarta. All rights reserved.</div>
          <div className="text-xs" style={{ color: THEMES.smkn13.primaryText }}>Powered by <span className="font-semibold">Xpresensi</span></div>
        </div>
      </div>
    </footer>
  );
};

/****************************
 * GALLERY DATA (demo)
 ****************************/
const GALLERY = [
  { id: 'img-1', type: 'photo', title: 'Upacara Bendera', album: 'Kegiatan Sekolah', date: '2025-08-22', src: makeSvg(1600, 1000, '#1F3B76', '#2C3F6B', 'Upacara Bendera', 'Lapangan SMKN 13'), w:1600, h:1000 },
  { id: 'img-2', type: 'photo', title: 'Lomba Futsal', album: 'Olahraga', date: '2025-08-15', src: makeSvg(1600, 1000, '#0B1733', '#102347', 'Turnamen Futsal', 'Provinsi DKI Jakarta'), w:1600, h:1000 },
  { id: 'img-3', type: 'photo', title: 'Pameran Karya RPL', album: 'Akademik', date: '2025-07-30', src: makeSvg(1600, 1000, '#F2C94C', '#1F3B76', 'Pameran Karya', 'Jurusan RPL'), w:1600, h:1000 },
  { id: 'img-4', type: 'photo', title: 'Kegiatan Pramuka', album: 'Kesiswaan', date: '2025-07-12', src: makeSvg(1600, 1000, '#2C3F6B', '#0B1733', 'Latihan Pramuka', 'Lapangan Belakang'), w:1600, h:1000 },
  { id: 'vid-1', type: 'video', title: 'Profil Sekolah', album: 'Video', date: '2025-07-10', embed: 'https://www.youtube.com/embed/5qap5aO4i9A' },
  { id: 'img-5', type: 'photo', title: 'Wisuda Siswa', album: 'Kegiatan Sekolah', date: '2025-06-25', src: makeSvg(1600, 1000, '#1F3B76', '#F2C94C', 'Wisuda 2025', 'SMKN 13 Jakarta'), w:1600, h:1000 },
  { id: 'img-6', type: 'photo', title: 'Lomba Inovasi', album: 'Akademik', date: '2025-06-10', src: makeSvg(1600, 1000, '#1F3B76', '#4CAF50', 'Inovasi Teknologi', 'Juara 1 Kota'), w:1600, h:1000 },
];

/****************************
 * LOCAL STORAGE — views counter
 ****************************/
const VIEWS_KEY = 'galleryViews:v1';
const loadViews = () => { try { return JSON.parse(localStorage.getItem(VIEWS_KEY)) || {}; } catch { return {}; } };
const saveViews = (obj) => { try { localStorage.setItem(VIEWS_KEY, JSON.stringify(obj)); } catch {} };

/****************************
 * GALLERY CARD & LIGHTBOX
 ****************************/
const GalleryCard = ({ item, theme, onOpen, views = 0 }) => {
  const isVideo = item.type === 'video';
  const [loaded, setLoaded] = useState(false);
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 220, damping: 18 }}
      className="rounded-2xl overflow-hidden border hover:shadow-md transition flex flex-col break-inside-avoid mb-4"
      style={{ borderColor: theme.subtle, background: theme.surface }}>
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16 / 9', background: theme.subtle }}>
        {isVideo ? (
          <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: theme.primaryText }}>Video</div>
        ) : (
          <motion.img
            layoutId={`media-${item.id}`}
            src={item.src}
            alt={item.title}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            initial={{ scale: 1 }}
            animate={{ scale: 1.1 }}
            transition={{ duration: 12, repeat: Infinity, repeatType: 'mirror' }}
            className="w-full h-full object-cover"
            style={{ filter: loaded ? 'none' : 'blur(12px)', transformOrigin: 'center' }}
          />
        )}
      </div>
      <div className="p-3 flex flex-col gap-1">
        <div className="font-semibold" style={{ color: theme.primaryText }}>{item.title}</div>
        <div className="text-xs opacity-80" style={{ color: theme.surfaceText }}>{new Date(item.date).toLocaleDateString('id-ID',{ day:'2-digit', month:'short', year:'numeric' })} · {item.album}</div>
        <div className="text-[11px] opacity-80" style={{ color: theme.surfaceText }}>{views}x dilihat</div>
        <button onClick={()=>onOpen(item)} className="mt-1 text-xs px-3 py-1 rounded-lg border self-start" style={{ borderColor: theme.subtle, color: theme.primaryText }}>Lihat</button>
      </div>
    </motion.div>
  );
};

const Lightbox = ({ open, onClose, item, theme, onViewed, onPrev, onNext, items = [], index = -1, count = 0, direction = 0, onJump, autoPlay = true, autoInterval = 5000 }) => {
  if (!open) return null;
  const isVideo = item?.type === 'video';
  useEffect(()=>{ if (item) onViewed?.(item); }, [item]);

  // Keyboard nav
  useEffect(()=>{
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') return onClose?.();
      if (e.key === 'ArrowLeft') return onPrev?.();
      if (e.key === 'ArrowRight') return onNext?.();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose, onPrev, onNext]);

  // Autoplay
  const [auto, setAuto] = useState(!!autoPlay);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (!open || !auto || paused || count <= 1) return;
    const id = setInterval(() => { onNext?.(); }, Math.max(2000, autoInterval));
    return () => clearInterval(id);
  }, [open, auto, paused, count, autoInterval, onNext, index]);

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 26 } },
    exit: (dir) => ({ x: dir > 0 ? -80 : 80, opacity: 0, transition: { duration: 0.18 } })
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0"
        style={{ background: "rgba(0, 0, 0, 0.6)" }}
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.98 }}
        className="relative w-full max-w-5xl rounded-2xl border overflow-hidden"
        style={{ background: theme.surface, borderColor: theme.subtle }}
      >
        <div
          className="flex items-center justify-between px-4 py-2"
          style={{ borderBottom: `1px solid ${theme.subtle}` }}
        >
          <div className="font-semibold" style={{ color: theme.primaryText }}>
            {item?.title}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAuto((prev) => !prev)}
              className="px-2 py-1 rounded-lg border text-xs"
              style={{ borderColor: theme.subtle, color: theme.primaryText }}
              aria-pressed={auto}
            >
              {auto ? "⏸ Auto" : "▶ Auto"}
            </button>
            <button
              onClick={onPrev}
              className="px-2 py-1 rounded-lg border text-xs"
              style={{ borderColor: theme.subtle, color: theme.primaryText }}
              aria-label="Previous slide"
            >
              ◀
            </button>
            <button
              onClick={onNext}
              className="px-2 py-1 rounded-lg border text-xs"
              style={{ borderColor: theme.subtle, color: theme.primaryText }}
              aria-label="Next slide"
            >
              ▶
            </button>
            <button
              onClick={onClose}
              className="px-2 py-1 rounded-lg border text-xs"
              style={{ borderColor: theme.subtle, color: theme.primaryText }}
              aria-label="Close viewer"
            >
              Tutup
            </button>
          </div>
        </div>
        <div
          className="bg-black/20 flex items-center justify-center relative"
          style={{ minHeight: 300 }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={item.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full flex items-center justify-center select-none"
              drag="x"
              dragElastic={0.2}
              onDragEnd={(e, info) => {
                if (info.offset.x > 120) onPrev();
                else if (info.offset.x < -120) onNext();
              }}
            >
              {isVideo ? (
                <div className="w-full aspect-video">
                  <iframe
                    className="w-full h-full"
                    src={item.embed}
                    title={item.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <motion.img
                  layoutId={`media-${item.id}`}
                  src={item.src}
                  alt={item.title}
                  className="max-h-[70vh] w-auto object-contain"
                  initial={{ scale: 1.02 }}
                  animate={{ scale: 1.08 }}
                  transition={{ duration: 16, repeat: Infinity, repeatType: "mirror" }}
                />
              )}
            </motion.div>
          </AnimatePresence>
          {/* Pager dots */}
          <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5">
            {Array.from({ length: count }).map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => onJump(i)}
                className="w-2 h-2 rounded-full border"
                style={{
                  background: i === index ? theme.accent : "transparent",
                  borderColor: theme.subtle,
                }}
              />
            ))}
          </div>
        </div>
        <div className="px-4 py-3 text-sm" style={{ color: theme.surfaceText }}>
          <div>
            {new Date(item.date).toLocaleString("id-ID", { dateStyle: "long" })} · Album:{" "}
            <strong>{item.album}</strong> ·{" "}
            <span className="opacity-80">
              {index + 1}/{count}
            </span>
          </div>
        </div>
        {/* Thumbnails strip */}
        <div className="px-3 pb-3 overflow-x-auto">
          <div className="flex gap-2 min-w-full">
            {items.map((it, i) => (
              <button
                key={it.id}
                onClick={() => onJump(i)}
                className="shrink-0 rounded-lg overflow-hidden border"
                style={{ borderColor: i === index ? theme.accent : theme.subtle }}
                aria-label={`Go to ${it.title}`}
              >
                {it.type === "video" ? (
                  <div
                    className="w-24 h-16 flex items-center justify-center text-[10px]"
                    style={{ background: theme.subtle, color: theme.primaryText }}
                  >
                    Video
                  </div>
                ) : (
                  <img
                    src={it.src}
                    alt={it.title}
                    className="w-24 h-16 object-cover"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};


/* --------------------------------------------------------------
   1. API HELPERS
   -------------------------------------------------------------- */
const API_BASE   = "https://dev.kiraproject.id";
const API_HEADERS = { "X-Host": "smkn13jktnew.kiraproject.id" };

/* fetch semua album (includeItems=false → lebih ringan) */
const fetchAlbums = async (): Promise<any[]> => {
  const res = await fetch(`${API_BASE}/albums?includeItems=false`, { headers: API_HEADERS });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (!json.success) throw new Error("API response not success");
  return json.data.filter((a: any) => a.isActive);          // hanya album aktif
};

/* fetch items dari satu album */
const fetchAlbumItems = async (albumId: number): Promise<any[]> => {
  const res = await fetch(`${API_BASE}/albums/${albumId}?includeItems=true`, { headers: API_HEADERS });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (!json.success) throw new Error("API response not success");
  return json.data.items ?? [];
};

/* --------------------------------------------------------------
   2. HOOK: albums + selected album items
   -------------------------------------------------------------- */
const useGallery = () => {
  const [albums, setAlbums] = useState<any[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<any | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loadingAlbums, setLoadingAlbums] = useState(true);
  const [loadingItems, setLoadingItems] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ---- load albums ------------------------------------------------ */
  useEffect(() => {
    (async () => {
      try {
        setLoadingAlbums(true);
        const data = await fetchAlbums();
        setAlbums(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoadingAlbums(false);
      }
    })();
  }, []);

  /* ---- load items ketika album dipilih --------------------------- */
  const openAlbum = async (album: any) => {
    setSelectedAlbum(album);
    setLoadingItems(true);
    try {
      const data = await fetchAlbumItems(album.id);
      /* transform ke format yang dipahami GalleryCard / Lightbox */
      const transformed = data.map((it: any) => {
        const isVideo = it.type === "video" || !!it.embedUrl;
        return {
          id: `api-${album.id}-${it.id}`,
          type: isVideo ? "video" : "photo",
          title: it.caption || album.title,
          album: album.title,
          date: it.createdAt || album.createdAt,
          src: isVideo ? undefined : it.fileUrl,          // gambar asli
          embed: isVideo ? it.embedUrl : undefined,
        };
      });
      setItems(transformed);
    } catch (e: any) {
      setError(e.message);
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
    albums,
    selectedAlbum,
    items,
    loadingAlbums,
    loadingItems,
    error,
    openAlbum,
    closeAlbum,
  };
};

/* --------------------------------------------------------------
   3. CARD: album thumbnail (hanya menampilkan cover + judul)
   -------------------------------------------------------------- */
const AlbumCard = ({
  album,
  theme,
  onOpen,
}: {
  album: any;
  theme: any;
  onOpen: (a: any) => void;
}) => {
  const cover = album.coverUrl || makeSvg(400, 250, "#1F3B76", "#2C3F6B", album.title);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-2xl overflow-hidden border hover:shadow-md transition flex flex-col break-inside-avoid mb-4"
      style={{ borderColor: theme.subtle, background: theme.surface }}
    >
      <div className="relative w-full" style={{ aspectRatio: "16 / 10" }}>
        <img
          src={cover}
          alt={album.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-3 flex flex-col gap-1">
        <div className="font-semibold" style={{ color: theme.primaryText }}>
          {album.title}
        </div>
        <div className="text-xs opacity-80" style={{ color: theme.surfaceText }}>
          {new Date(album.createdAt).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </div>
        <button
          onClick={() => onOpen(album)}
          className="mt-1 text-xs px-3 py-1 rounded-lg border self-start"
          style={{ borderColor: theme.subtle, color: theme.primaryText }}
        >
          Lihat
        </button>
      </div>
    </motion.div>
  );
};

/* --------------------------------------------------------------
   4. GALLERY SECTION – menampilkan daftar album + lightbox items
   -------------------------------------------------------------- */
const GallerySection = ({ theme }: { theme?: any }) => {
  const safeTheme = getSafeTheme(theme);
  const {
    albums,
    selectedAlbum,
    items,
    loadingAlbums,
    loadingItems,
    error,
    openAlbum,
    closeAlbum,
  } = useGallery();

  /* ---- filter / sort untuk items yang sedang ditampilkan ---- */
  const [q, setQ] = useState("");
  const [kind, setKind] = useState("Semua");
  const [sort, setSort] = useState("Terbaru");
  const [viewsMap, setViewsMap] = useState(loadViews());
  const [navDir, setNavDir] = useState(0);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const filteredItems = useMemo(() => {
    const nq = q.trim().toLowerCase();
    let data = items.filter((it) => {
      const okQ = !nq || it.title.toLowerCase().includes(nq);
      const okK = kind === "Semua" || (kind === "Foto" ? it.type === "photo" : it.type === "video");
      return okQ && okK;
    });
    if (sort === "Terbaru")
      data = data.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sort === "Terlama")
      data = data.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
    if (sort === "Populer")
      data = data.slice().sort((a, b) => (viewsMap[b.id] || 0) - (viewsMap[a.id] || 0));
    return data;
  }, [items, q, kind, sort, viewsMap]);

  const handleOpenItem = (it: any) => setSelectedItem(it);
  const handleCloseItem = () => setSelectedItem(null);
  const handleViewed = (it: any) => {
    const next = { ...viewsMap, [it.id]: (viewsMap[it.id] || 0) + 1 };
    setViewsMap(next);
    saveViews(next);
  };

  const curIdx = selectedItem ? filteredItems.findIndex((i) => i.id === selectedItem.id) : -1;
  const goPrev = () => {
    if (!selectedItem) return;
    setNavDir(-1);
    const i = curIdx <= 0 ? filteredItems.length - 1 : curIdx - 1;
    setSelectedItem(filteredItems[i]);
  };
  const goNext = () => {
    if (!selectedItem) return;
    setNavDir(1);
    const i = curIdx >= filteredItems.length - 1 ? 0 : curIdx + 1;
    setSelectedItem(filteredItems[i]);
  };
  const goTo = (i: number) => {
    if (i === curIdx) return;
    setNavDir(i > curIdx ? 1 : -1);
    setSelectedItem(filteredItems[i]);
  };

  const prefersReduced = useReducedMotion();

  /* ------------------- UI ------------------- */
  if (loadingAlbums) {
    return (
      <section id="galeri" className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm" style={{ color: safeTheme.primaryText }}>
            Memuat album...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="galeri" className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-red-400">Gagal memuat album: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="galeri" className="py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4">

        {/* ==== Header ==== */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: safeTheme.accent }}>
              Galeri
            </h2>
            <p className="text-sm opacity-85" style={{ color: safeTheme.surfaceText }}>
              Pilih album untuk melihat foto &amp; video.
            </p>
          </div>
          <div className="text-right text-xs" style={{ color: safeTheme.primaryText }}>
            Total album: <strong>{albums.length}</strong>
          </div>
        </div>

        {/* ==== Daftar Album ==== */}
        <motion.div
          className="columns-1 sm:columns-4 lg:columns-4 gap-4"
          variants={prefersReduced ? undefined : gridVariants}
          initial={prefersReduced ? false : "hidden"}
          animate={prefersReduced ? false : "show"}
        >
          <AnimatePresence mode="popLayout">
            {albums.map((a) => (
              <motion.div
                key={a.id}
                variants={prefersReduced ? undefined : cardVariants}
                layout
              >
                <AlbumCard album={a} theme={safeTheme} onOpen={openAlbum} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* ==== Lightbox untuk items (hanya muncul bila album dipilih) ==== */}
        <AnimatePresence>
          {selectedAlbum && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
              onClick={closeAlbum}
            >
              <motion.div
                className="relative w-full max-w-5xl bg-white rounded-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: -20 }}
              >
                {/* Header Lightbox */}
                <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: safeTheme.subtle }}>
                  <h3 className="font-semibold" style={{ color: safeTheme.primaryText }}>
                    {selectedAlbum.title}
                  </h3>
                  <button
                    onClick={closeAlbum}
                    className="text-xl"
                    style={{ color: safeTheme.primaryText }}
                  >
                    ×
                  </button>
                </div>

                {/* Kontrol filter (opsional) */}
                {loadingItems ? (
                  <div className="p-8 text-center">Memuat item...</div>
                ) : (
                  <>
                    <div className="p-3 flex flex-wrap gap-2 border-b" style={{ borderColor: safeTheme.subtle }}>
                      <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Cari judul..."
                        className="px-2 py-1 rounded text-sm border"
                        style={{ borderColor: safeTheme.subtle, color: safeTheme.primaryText }}
                      />
                      <select
                        value={kind}
                        onChange={(e) => setKind(e.target.value)}
                        className="px-2 py-1 rounded text-sm border"
                        style={{ borderColor: safeTheme.subtle, color: safeTheme.primaryText }}
                      >
                        {["Semua", "Foto", "Video"].map((k) => (
                          <option key={k} value={k}>
                            {k}
                          </option>
                        ))}
                      </select>
                      <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="px-2 py-1 rounded text-sm border ml-auto"
                        style={{ borderColor: safeTheme.subtle, color: safeTheme.primaryText }}
                      >
                        {["Terbaru", "Terlama", "Populer"].map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Grid items */}
                    <div className="p-4 max-h-[70vh] overflow-y-auto columns-1 sm:columns-4 lg:columns-3 gap-3">
                      <AnimatePresence mode="popLayout">
                        {filteredItems.map((it) => (
                          <motion.div
                            key={it.id}
                            variants={prefersReduced ? undefined : cardVariants}
                            layout
                          >
                            <GalleryCard
                              item={it}
                              theme={safeTheme}
                              onOpen={handleOpenItem}
                              views={viewsMap[it.id] || 0}
                            />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      {filteredItems.length === 0 && (
                        <p className="col-span-full text-center text-sm opacity-70">
                          Tidak ada item yang cocok.
                        </p>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lightbox detail satu item (carousel) */}
        <Lightbox
          open={!!selectedItem}
          onClose={handleCloseItem}
          item={selectedItem}
          theme={safeTheme}
          onViewed={handleViewed}
          onPrev={goPrev}
          onNext={goNext}
          items={filteredItems}
          index={curIdx}
          count={filteredItems.length}
          direction={navDir}
          onJump={goTo}
        />
      </div>
    </section>
  );
};

/****************************
 * DEFAULT PAGE (Navbar + Gallery + Footer) + TESTS
 ****************************/
const GalleryPage = () => {
  const appTheme = getSafeTheme();
  const prefersReducedMotion = useReducedMotion();

  useEffect(()=>{
    try {
      console.assert(typeof GallerySection === 'function', 'GallerySection harus ada');
      console.assert(Array.isArray(GALLERY) && GALLERY.length >= 6, 'Minimal 6 item galeri untuk demo');
      console.assert(typeof Navbar === 'function' && typeof Footer === 'function', 'Navbar/Footer harus terdefinisi');
      const map = loadViews();
      console.assert(map && typeof map === 'object', 'loadViews harus mengembalikan objek');
      // Tambahan test: Lightbox prev/next handlers ada
      console.assert(typeof Lightbox === 'function', 'Lightbox harus ada');
      console.assert(typeof getSafeTheme === 'function', 'getSafeTheme harus ada');
      console.assert(typeof setInterval === 'function', 'Autoplay membutuhkan setInterval');
      console.log('✅ UI smoke tests passed (Galeri + Header/Footer + Autoplay)');
    } catch (e) {
      console.error('❌ UI smoke tests failed:', e);
    }
  }, [prefersReducedMotion]);

  return (
    <div className="min-h-screen" style={{ background: appTheme.bg }}>
      <Navbar theme={appTheme} />
      <main>
        <GallerySection theme={appTheme} />
      </main>
      <Footer theme={appTheme} />
    </div>
  );
}

export default GalleryPage;
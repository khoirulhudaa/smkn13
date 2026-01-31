import React, { useEffect, useRef, useState } from "react";
// NOTE: Canvas preview isn't a Next.js runtime, so we shim `Link` to <a> for preview.
// In your real Next app, you can re-enable: `import Link from "next/link";`
const Link = ({ href, className, style, children, target, rel }) => (
  <a href={href} className={className} style={style} target={target} rel={rel}>{children}</a>
);
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
let useSwipeable;
try { useSwipeable = require("react-swipeable").useSwipeable; } catch { useSwipeable = () => ({}) }

/****************************
 * THEME PRESETS (per-tenant)
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
  },
  default: {
    name: "Default",
    primary: "#0E7490",
    primaryText: "#ffffff",
    accent: "#f59e0b",
    bg: "#f8fafc",
    surface: "#ffffff",
    surfaceText: "#0f172a",
    subtle: "#e2e8f0",
    pop: "#ef4444",
  },
};

/************************
 * NAV DATA (simplified)
 ************************/
// Dynamic site since-year (fall back to 2025). In production, set NEXT_PUBLIC_SITE_SINCE.
const SITE_SINCE = Number.parseInt(
  (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_SITE_SINCE) || '2025',
  10
);

const NAV = [
  { label: "Beranda", href: "/dashboard" },
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
    { label: "Ekstrakurikuler", href: "/ekstrakulikuler" },
    { label: "Prestasi", href: "/prestasi" },
  ]},
  { label: "Perpustakaan", href: "/perpustakaan" },
    { label: "Informasi", children: [
    { label: "Pengumuman", href: "/pengumuman" },
    { label: "Berita", href: "/berita" },
    { label: "Agenda", href: "/agenda" },
    { label: "PPDB", href: "/ppdb" },
    { label: "Layanan", href: "/layanan" },
    { label: "Kelulusan", href: "/kelulusan" },
  ]},
  { label: "Galeri", href: "#galeri" },
];

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

/****************
 * LOCAL DEMO IMAGES (non-blocking data-URI)
 ****************/
const makeSvg = (w, h, c1, c2, label) => {
  const svg = `<?xml version='1.0' encoding='UTF-8'?>\n<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>\n  <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>\n    <stop offset='0%' stop-color='${c1}'/>\n    <stop offset='100%' stop-color='${c2}'/>\n  </linearGradient></defs>\n  <rect width='${w}' height='${h}' fill='url(#g)'/>\n  <g fill='rgba(255,255,255,0.85)' font-family='Inter,Arial,sans-serif' font-size='${Math.round(h/12)}' font-weight='700'>\n    <text x='5%' y='55%'>${label.replace(/&/g, '&amp;')}</text>\n  </g>\n</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};
const LOCAL_IMAGES = {
  hero: [
    makeSvg(1600, 900, '#1F3B76', '#2C3F6B', 'SMKN 13 Jakarta'),
    makeSvg(1600, 900, '#102347', '#1F3B76', 'Pengumuman'),
    makeSvg(1600, 900, '#0B1733', '#102347', 'Sambutan'),
    makeSvg(1600, 900, '#1F3B76', '#0B1733', 'Galeri'),
    makeSvg(1600, 900, '#2C3F6B', '#1F3B76', 'Layanan'),
    makeSvg(1600, 900, '#1F3B76', '#F2C94C', 'Kontak'),
  ],
  news: [
    makeSvg(800, 500, '#1F3B76', '#2C3F6B', 'Berita 1'),
    makeSvg(800, 500, '#2C3F6B', '#1F3B76', 'Berita 2'),
    makeSvg(800, 500, '#102347', '#1F3B76', 'Berita 3'),
  ],
  gallery: Array.from({ length: 6 }, (_, i) => makeSvg(800, 600, i % 2 ? '#1F3B76' : '#2C3F6B', i % 3 ? '#102347' : '#0B1733', `Galeri ${i+1}`))
};

/****************
 * GLOBAL (DINAS) CONTENT — visible across all tenants
 ****************/
const GLOBAL_DATA = {
  announcements: [
    { title: "Edaran Dinas: Libur Nasional & Cuti Bersama", date: "05 Sep 2025", tag: "Dinas", source: "dinas" },
  ],
  news: [
    { title: "Program Magang Terpadu DKI", date: "18 Agu 2025", tag: "Dinas", source: "dinas", img: '/slide1.jpg', excerpt: "Dinas Pendidikan meluncurkan skema magang terpadu lintas industri untuk SMK di DKI Jakarta." },
  ],
};

/****************
 * SAFE IMAGE (CORS-safe + graceful fallback)
 ****************/
const SafeImage = ({ src, alt, className, style }) => {
  const [failed, setFailed] = useState(false);
  if (failed || !src) {
    return (
      <div className={className} aria-label={alt || 'image'}
           style={{ ...style, background: "repeating-linear-gradient(45deg, #1f2937 0 10px, #111827 10px 20px)" }} />
    );
  }
  return <img src={src} alt={alt || ''} className={className} style={style} loading="lazy" decoding="async"
              referrerPolicy="no-referrer" crossOrigin="anonymous" onError={() => setFailed(true)} />;
};

/*********
 * BADGE
 *********/
const Badge = ({ children, theme }) => (
  <span className="px-2 py-1 text-xs rounded-full border"
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
      {/* <button className="text-sm font-medium rounded-xl px-3 py-2"
              style={{ background: theme.accent, color: "#1b1b1b" }}
              onClick={() => setOpen(v => !v)} aria-haspopup="menu" aria-expanded={open}>Login ▾</button> */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.16 }}
            className="absolute right-0 mt-2 w-48 rounded-xl border shadow-xl p-2"
            style={{ background: "rgba(255,255,255,0.95)", borderColor: theme.subtle }} role="menu">
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
            className="absolute left-0 mt-2 w-44 rounded-xl border shadow-xl p-2" style={{ background: "rgba(16,23,71,0.98)", borderColor: theme.subtle }}>
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

const MobileAccordion = ({ item, theme }) => {
  const [open, setOpen] = useState(false);
  const hasChild = Array.isArray(item.children) && item.children.length > 0;
  if (!hasChild) {
    const isRoute = typeof item.href === "string" && item.href.startsWith("/");
    return isRoute ? (
      <Link href={item.href} className="block px-4 py-2 rounded-lg" style={{ color: theme.primaryText }}>{item.label}</Link>
    ) : (
      <a href={item.href} className="block px-4 py-2 rounded-lg" style={{ color: theme.primaryText }}>{item.label}</a>
    );
  }
  return (
    <div>
      <button onClick={() => setOpen(v => !v)} className="w-full flex items-center justify-between px-4 py-2 rounded-lg" style={{ color: theme.primaryText }}>
        <span>{item.label}</span><span>{open ? "−" : "+"}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="pl-4">
            {item.children.map(c => {
              const isRoute = typeof c.href === "string" && c.href.startsWith("/");
              return isRoute ? (
                <Link key={c.label} href={c.href} className="block px-4 py-2 rounded-lg text-sm hover:underline" style={{ color: theme.primaryText }}>{c.label}</Link>
              ) : (
                <a key={c.label} href={c.href} className="block px-4 py-2 rounded-lg text-sm hover:underline" style={{ color: theme.primaryText }}>{c.label}</a>
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
  const ppdbActive = isWithinPeriod(new Date(), PPDB_PERIOD);
  const navItems = NAV.map(it => it.children ? ({ ...it, children: it.children.filter(c => c.label !== 'PPDB1' || ppdbActive) }) : it);
  return (
    <div className="w-full sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/5" style={{ background: "rgba(0,0,0,0.25)", borderBottom: `1px solid ${safeTheme.subtle}` }}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between py-3 md:py-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold" style={{ background: safeTheme.accent, color: "#111827" }}>13</div>
            <div className="leading-none"><div className="text-base md:text-lg font-semibold" style={{ color: safeTheme.primaryText }}>SMKN 13 Jakarta</div></div>
          </div>
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navItems.map(item => <NavDropdown key={item.label} item={item} theme={safeTheme} />)}
          </div>
          {/* <div className="flex items-center gap-2"><LoginMenu theme={safeTheme} />
            <button className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border" aria-label="Menu" onClick={() => setMobileOpen(v => !v)} style={{ borderColor: safeTheme.subtle, color: safeTheme.primaryText }}>☰</button>
          </div> */}
        </div>
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="lg:hidden overflow-hidden pb-3">
              <div className="grid gap-1 rounded-2xl p-2 border" style={{ borderColor: safeTheme.subtle, background: "rgba(16,23,71,0.35)" }}>
                {navItems.map(item => <MobileAccordion key={item.label} item={item} theme={safeTheme} />)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/****************
 * HERO SLIDER (6 slides)
 ****************/
const heroSlides = [
  { title: "Portal Resmi SMKN 13 Jakarta", desc: "Website multi‑tenant terintegrasi Xpresensi.", img: '/slide1.jpg', cta1: { href: "#pengumuman", label: "Lihat Pengumuman" }, cta2: { href: "#galeri", label: "Jelajah Galeri" }},
  { title: "Pengumuman Terbaru", desc: "Informasi akademik & kesiswaan.", img: '/slide2.jpg', cta1: { href: "#pengumuman", label: "Cek Info" }, cta2: { href: "#", label: "Kalender" }},
  { title: "Sambutan Kepala Sekolah", desc: "Lingkungan belajar unggul & berkarakter.", img: '/slide3.jpg', cta1: { href: "#profil", label: "Baca Sambutan" }, cta2: { href: "#profil", label: "Profil Sekolah" }},
  { title: "Galeri Kegiatan", desc: "Dokumentasi kegiatan & prestasi.", img: '/slide1.jpg', cta1: { href: "#galeri", label: "Lihat Galeri" }, cta2: { href: "#kesiswaan", label: "Ekskul" }},
  { title: "Layanan Sekolah", desc: "Kurikulum, perpustakaan, kesiswaan.", img: '/slide2.jpg', cta1: { href: "/layanan", label: "Layanan" }, cta2: { href: "#perpustakaan", label: "E‑Library" } },
  { title: "Kontak Sekolah", desc: "Informasi layanan publik.", img: '/slide3.jpg', cta1: { href: "#kontak", label: "Kontak" }, cta2: { href: "#", label: "Lokasi" }},
];
const easing = [0.33, 1, 0.68, 1];
const Hero = ({ theme }) => {
  const [index, setIndex] = useState(0);
  const [isPaused, setPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const go = (dir) => setIndex(p => (p + dir + heroSlides.length) % heroSlides.length);
  const handlers = useSwipeable({ onSwipedLeft: () => go(1), onSwipedRight: () => go(-1), preventScrollOnSwipe: true, trackMouse: true });
  useEffect(() => { if (isPaused || prefersReducedMotion) return; const t = setInterval(() => setIndex(p => (p + 1) % heroSlides.length), 6000); return () => clearInterval(t); }, [isPaused, prefersReducedMotion]);
  const slide = heroSlides[index];
  return (
    <section id="beranda" className="relative overflow-hidden">
      <div className="relative w-full" {...handlers}>
        <div className="absolute inset-0">
          <AnimatePresence>
            <motion.div key={index} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: prefersReducedMotion ? 0 : 1, ease: easing }} className="absolute inset-0">
              <SafeImage src={slide.img} alt={slide.title} className="relative inset-0 w-full h-full object-cover" style={{ filter: "brightness(0.7)" }} />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${theme.bg}AA 0%, ${theme.primary}CC 100%)` }} />
        </div>
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 z-[3333] relative">
          <AnimatePresence mode="wait">
            <motion.div key={`text-${index}`} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }} transition={{ duration: prefersReducedMotion ? 0 : 0.6, ease: easing }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight" style={{ color: theme.primaryText }}>{slide.title}</h1>
              <p className="mt-4 text-base md:text-lg opacity-90" style={{ color: theme.primaryText }}>{slide.desc}</p>
              <div className="mt-6 flex items-center gap-3">
                <a className="rounded-xl px-5 py-3 text-sm font-semibold" style={{ background: theme.accent, color: "#1b1b1b" }} href={slide.cta1.href}>{slide.cta1.label}</a>
                <a className="rounded-xl px-5 py-3 text-sm font-semibold border" style={{ borderColor: theme.accent, color: theme.primaryText }} href={slide.cta2.href}>{slide.cta2.label}</a>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="mt-8 flex items-center gap-3">
            <button aria-label="Sebelumnya" onClick={() => go(-1)} className="px-3 py-2 rounded-xl bg-white/40 border backdrop-blur" style={{ borderColor: theme.subtle, color: theme.primaryText }}>←</button>
            <button aria-label="Berikutnya" onClick={() => go(1)} className="px-3 py-2 rounded-xl bg-white/40 border backdrop-blur" style={{ borderColor: theme.subtle, color: theme.primaryText }}>→</button>
          </div>
          <div className="mt-4 flex gap-2">
            {heroSlides.map((_, i) => (
              <button key={i} aria-label={`Slide ${i + 1}`} onClick={() => setIndex(i)} className="h-2 rounded-full transition-all" style={{ width: i === index ? 24 : 8, background: i === index ? theme.accent : 'white' }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/*******************
 * SECTION WRAPPER
 *******************/
const Section = ({ id, title, subtitle, theme, children, viewAllHref = "#" }) => (
  <section id={id} className="py-12 md:py-16">
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
          {subtitle && (<p className="text-sm opacity-70 text-white">{subtitle}</p>)}
        </div>
        <a href={viewAllHref} className="text-sm text-white">Lihat semua →</a>
      </div>
      {children}
    </div>
  </section>
);

/****************
 * STATS BAR (below hero)
 ****************/
const StatsBar = ({ theme }) => {
  const stats = [
    { k: "Hadir Hari Ini", v: 1021 },
    { k: "Izin/Sakit", v: 34 },
    { k: "Terlambat", v: 12 },
    { k: "Guru Hadir", v: 88 },
  ];
  const prefersReducedMotion = useReducedMotion();
  return (
    <section id="stats" className="py-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {stats.map((s, i) => (
            <motion.div key={s.k} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: prefersReducedMotion ? 0 : 0.35, delay: prefersReducedMotion ? 0 : i * 0.05 }} className="rounded-2xl p-4 border shadow-sm" style={{ background: theme.surface, borderColor: theme.subtle }}>
              <div className="text-xs md:text-sm opacity-80" style={{ color: theme.surfaceText }}>{s.k}</div>
              <div className="text-xl md:text-2xl font-bold" style={{ color: theme.surfaceText }}>{s.v}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/****************
 * GLOBAL INFO BAR (DINAS urgent)
 ****************/
const GlobalInfoBar = ({ theme }) => {
  const urgent = GLOBAL_DATA.announcements[0];
  if (!urgent) return null;
  return (
    <div className="w-full border-b" style={{ background: THEMES.smkn13.accent, borderColor: theme.subtle, color: "#111827" }}>
      <div className="max-w-6xl mx-auto px-4 py-2 text-sm flex items-center gap-2">
        <span className="px-2 py-0.5 rounded-full text-xs font-semibold border" style={{ borderColor: "#111827" }}>DINAS</span>
        <span className="truncate">{urgent.title}</span>
        <a href="#pengumuman" className="underline text-xs">Lihat</a>
      </div>
    </div>
  );
};

/****************
 * HEADMASTER GREETING
 ****************/
const HeadmasterGreeting = ({ theme }) => {
  const prefersReducedMotion = useReducedMotion();
  const variants = {
    container: { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: prefersReducedMotion ? 0 : 0.08 } } },
    up: { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: prefersReducedMotion ? 0 : 0.5, ease: [0.33,1,0.68,1] } } },
    fade: { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: prefersReducedMotion ? 0 : 0.6 } } }
  };
  return (
    <section id="profil" className="py-12 md:py-16 relative">
      <motion.div aria-hidden initial={{ opacity: 0 }} animate={{ opacity: 0.25 }} transition={{ duration: prefersReducedMotion ? 0 : 1.2 }} className="pointer-events-none absolute -top-24 -right-24 w-[320px] h-[320px] rounded-full blur-3xl" style={{ background: theme.accent }} />
      <div className="max-w-6xl mx-auto px-4">
        <motion.div variants={variants.container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="grid md:grid-cols-[260px,1fr] gap-6 items-start rounded-2xl border p-4 md:p-6" style={{ background: theme.surface, borderColor: theme.subtle }}>
          <motion.div variants={variants.up} className="relative rounded-2xl overflow-hidden border aspect-[3/4] md:aspect-auto" style={{ borderColor: theme.subtle }}>
            <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${theme.subtle}, ${theme.primary})` }} />
            <motion.div className="absolute bottom-3 left-3 rounded-xl px-3 py-1 text-xs font-medium" style={{ background: 'rgba(0,0,0,0.35)', color: theme.primaryText, border: `1px solid ${theme.subtle}` }}
              animate={prefersReducedMotion ? {} : { y: -2 }}
              transition={{ repeat: prefersReducedMotion ? 0 : Infinity, repeatType: 'reverse', duration: 3, ease: 'easeInOut' }}>
              Kepala Sekolah
            </motion.div>
          </motion.div>
          <div>
            <motion.div variants={variants.up} className="mb-2">
              <h2 className="text-2xl md:text-3xl font-bold" style={{ color: 'white' }}>Sambutan Kepala Sekolah</h2>
              <p className="text-sm opacity-70 text-white">Ucapan selamat datang dan komitmen layanan pendidikan di SMKN 13 Jakarta</p>
            </motion.div>
            <motion.div variants={variants.up}>
              <div className="text-base font-semibold" style={{ color: theme.surfaceText }}>Drs. Nama Kepala Sekolah</div>
              <div className="text-sm opacity-80" style={{ color: theme.surfaceText }}>Kepala SMKN 13 Jakarta</div>
            </motion.div>
            <motion.div variants={variants.up} className="mt-4 space-y-3 leading-relaxed text-sm md:text-base" style={{ color: theme.surfaceText }}>
              <p>Assalamu’alaikum warahmatullahi wabarakatuh. Selamat datang di website resmi <strong>SMKN 13 Jakarta</strong>. Situs ini kami hadirkan sebagai pusat informasi dan layanan digital bagi siswa, orang tua, guru, dan masyarakat.</p>
              <p>Kami berkomitmen menyelenggarakan pendidikan vokasi yang <em>relevan dengan industri</em>, menjunjung karakter, serta berorientasi pada <em>link and match</em>. Program dan kemitraan kami rancang untuk menyiapkan lulusan yang kompeten, adaptif, dan berdaya saing.</p>
              <blockquote className="border-l-4 pl-3 italic" style={{ borderColor: theme.accent }}>
                "Bersama, kita bangun budaya belajar yang unggul, inklusif, dan kolaboratif."
              </blockquote>
            </motion.div>
            <motion.div variants={variants.up} className="mt-5 flex flex-wrap items-center gap-3">
              <a href="#pengumuman" className="rounded-xl px-4 py-2 text-sm font-medium" style={{ background: theme.accent, color: '#1b1b1b' }}>Lihat Pengumuman</a>
              <a href="#galeri" className="rounded-xl px-4 py-2 text-sm font-medium border" style={{ borderColor: theme.accent, color: theme.surfaceText }}>Galeri Kegiatan</a>
            </motion.div>
            <motion.div variants={variants.fade} className="mt-6 text-xs opacity-70" style={{ color: theme.surfaceText }}>
              Jakarta, {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}<br />
              <span className="inline-block mt-1">— Kepala SMKN 13 Jakarta</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/****************
 * ANNOUNCEMENTS (merge DINAS + local, trimmed demo)
 ****************/
const Announcements = ({ theme }) => {
  const local = [
    { title: "PPDB 2025 Tahap 1 Dibuka", date: "06 Sep 2025", tag: "Akademik", source: "local" },
    { title: "Pengambilan Rapor Semester Ganjil", date: "31 Okt 2025", tag: "Kesiswaan", source: "local" },
  ];
  const data = [...GLOBAL_DATA.announcements, ...local];
  return (
    <Section id="pengumuman" title="Pengumuman" subtitle="Informasi terbaru untuk warga sekolah" theme={theme}>
      <div className="grid md:grid-cols-3 gap-4">
        {data.map((item) => (
          <div key={item.title} className="rounded-2xl p-4 border shadow-sm hover:shadow-md transition" style={{ background: theme.surface, borderColor: theme.subtle }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge theme={theme}>{item.tag}</Badge>
                {item.source === 'dinas' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold border" style={{ borderColor: theme.accent, color: theme.surfaceText }}>DINAS</span>
                )}
              </div>
              <span className="text-xs opacity-75" style={{ color: theme.surfaceText }}>{item.date}</span>
            </div>
            <div className="mt-3 font-semibold" style={{ color: theme.surfaceText }}>{item.title}</div>
            <a className="mt-4 inline-block text-sm" style={{ color: theme.accent }} href="#">Baca selengkapnya</a>
          </div>
        ))}
      </div>
    </Section>
  );
};

/****************
 * NEWS (merge DINAS + local, trimmed demo)
 ****************/
const News = ({ theme }) => {
  const local = [
    { title: "SMKN 13 Juara Lomba Inovasi Teknologi Kota", date: "02 Sep 2025", tag: "Berita", img: '/slide1.jpg', excerpt: "Tim RPL SMKN 13 meraih juara inovasi tingkat kota.", source: "local" },
    { title: "Workshop K3 & Safety Laboratorium", date: "30 Agu 2025", tag: "Kegiatan", img: '/slide1.jpg', excerpt: "Penguatan budaya keselamatan kerja bagi siswa jurusan teknik dengan praktik langsung.", source: "local" },
  ];
  const items = [...GLOBAL_DATA.news, ...local];
  return (
    <Section id="berita" title="Berita" subtitle="Kabar terbaru SMKN 13 Jakarta" theme={theme} viewAllHref="/berita">
      <div className="grid md:grid-cols-3 gap-4">
        {items.map((n) => (
          <article key={n.title} className="rounded-2xl overflow-hidden border shadow-sm hover:shadow-md transition" style={{ background: theme.surface, borderColor: theme.subtle }}>
            <div className="aspect-video w-full overflow-hidden" style={{ background: theme.subtle }}>
              <SafeImage src={n.img} alt={n.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge theme={theme}>{n.tag}</Badge>
                  {n.source === 'dinas' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold border" style={{ borderColor: theme.accent, color: theme.surfaceText }}>DINAS</span>
                  )}
                </div>
                <span className="text-xs opacity-75" style={{ color: theme.surfaceText }}>{n.date}</span>
              </div>
              <h3 className="mt-3 font-semibold" style={{ color: theme.surfaceText }}>{n.title}</h3>
              <p className="mt-2 text-sm opacity-85" style={{ color: theme.surfaceText }}>{n.excerpt}</p>
              <a className="mt-3 inline-block text-sm" style={{ color: theme.accent }} href="/berita">Baca selengkapnya</a>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
};

/****************
 * GALLERY (trim to 6 items)
 ****************/
const Gallery = ({ theme }) => {
  const images = LOCAL_IMAGES.gallery; // 6 items
  return (
    <Section id="galeri" title="Galeri" subtitle="Kegiatan & fasilitas sekolah" theme={theme}>
      <div className="grid md:grid-cols-3 gap-3">
        {images.map((src, idx) => (
          <div key={src} className="aspect-[4/3] rounded-2xl overflow-hidden border" style={{ borderColor: theme.subtle }}>
            <SafeImage src={'/slide2.jpg'} alt={`Galeri ${idx + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </Section>
  );
};

/****************
 * MANAGEMENT CARDS (kept concise)
 ****************/

/****************
 * FOOTER
 ****************/
const Footer = ({ theme }) => {
  const now = new Date().getFullYear();
  const from = Number.isFinite(SITE_SINCE) ? SITE_SINCE : now;
  const yearLabel = from < now ? `${from} — ${now}` : `${now}`;
  return (
    <footer className="mt-8">
      <div className="max-w-6xl mx-auto px-4 py-10 border-t" style={{ borderColor: theme.subtle }}>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold" style={{ background: theme.accent, color: "#111827" }}>13</div>
              <div>
                <div className="text-base font-semibold" style={{ color: theme.primaryText }}>SMKN 13 Jakarta</div>
                <div className="text-xs opacity-80" style={{ color: theme.primaryText }}>Sekolah Menengah Kejuruan Negeri</div>
              </div>
            </div>
            <p className="mt-3 text-sm opacity-85" style={{ color: theme.primaryText }}>Mewujudkan lulusan berkarakter, kompeten, dan siap kerja melalui lingkungan belajar yang modern dan inklusif.</p>
          </div>
          <div>
            <div className="text-sm font-semibold mb-2" style={{ color: theme.primaryText }}>Tautan</div>
            <ul className="text-sm space-y-1" style={{ color: theme.primaryText }}>
              <li><a href="#profil">Profil</a></li>
              <li><a href="#pengumuman">Pengumuman</a></li>
              <li><a href="#galeri">Galeri</a></li>
              <li><a href="#kontak">Kontak</a></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold mb-2" style={{ color: theme.primaryText }}>Kontak</div>
            <div className="text-sm opacity-85" style={{ color: theme.primaryText }}>
              Jl. Contoh No. 13, Jakarta Pusat<br />
              (021) 987‑654<br />
              info@smkn13.sch.id
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm opacity-80" style={{ color: theme.primaryText }}>© {yearLabel} — SMKN 13 Jakarta. All rights reserved.</div>
          <div className="text-xs" style={{ color: theme.primaryText }}>Powered by <span className="font-semibold">Xpresensi</span></div>
        </div>
      </div>
    </footer>
  );
};

/********
 * PAGE
 ********/
const Page = ({ theme, onTenantChange, currentKey }) => (
  <div className="h-screen overflow-y-auto overflow-x-hidden" style={{ background: theme.primary }}>
    <Navbar theme={theme} onTenantChange={onTenantChange} currentKey={currentKey} />
    <GlobalInfoBar theme={theme} />
    <Hero theme={theme} />
    <StatsBar theme={theme} />
    <HeadmasterGreeting theme={theme} />
    <Announcements theme={theme} />
    <News theme={theme} />
    <Gallery theme={theme} />
    <Footer theme={theme} />
  </div>
);

/*************************
 * DEFAULT EXPORT + TESTS
 *************************/
const Homepage = () => {
  const [key, setKey] = useState("smkn13");
  const getThemeByKey = (k) => THEMES[k] || THEMES.smkn13 || THEMES.default;
  const theme = getThemeByKey(key);
  useEffect(() => {
    try {
      console.assert(typeof Page === "function", "Page must be defined");
      console.assert(typeof Navbar === "function", "Navbar must be defined");
      console.assert(Array.isArray(NAV) && NAV.length >= 6, "NAV must have multiple groups");
      console.assert(Array.isArray(LOCAL_IMAGES.gallery) && LOCAL_IMAGES.gallery.length === 6, "Gallery should have 6 demo items");
      console.assert(Array.isArray(heroSlides) && heroSlides.length === 6, "Hero should have 6 slides");
      console.assert(GLOBAL_DATA && Array.isArray(GLOBAL_DATA.announcements) && GLOBAL_DATA.announcements.length >= 1, "Global DINAS announcements present");
      const _nowYear = new Date().getFullYear();
      console.assert(Number.isFinite(SITE_SINCE) && SITE_SINCE <= _nowYear, "SITE_SINCE must be <= current year");
      console.log("✅ UI smoke tests passed");
    } catch (e) {
      console.error("❌ UI smoke tests failed:", e);
    }
  }, []);
  return <Page theme={theme} onTenantChange={setKey} currentKey={key} />;
}

export default Homepage;

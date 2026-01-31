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
  { label: "Beranda", href: "#beranda" },
  { label: "Profil", children: [
    { label: "Sambutan", href: "#profil" },
    { label: "Visi & Misi", href: "#profil-visimisi" },
    { label: "Sejarah", href: "#profil-sejarah" },
    { label: "Struktur", href: "#profil-struktur" },
  ]},
  { label: "Akademik", children: [
    { label: "Kurikulum", href: "#kurikulum" },
    { label: "Kalender", href: "#kalender" },
    { label: "Jadwal", href: "#jadwal" },
    { label: "Guru & Tendik", href: "/guru-tendik" },
  ]},
  { label: "Kesiswaan", children: [
    { label: "OSIS", href: "#osis" },
    { label: "Ekstrakurikuler", href: "#ekskul" },
    { label: "Prestasi", href: "#prestasi" },
  ]},
  { label: "Perpustakaan", href: "#perpustakaan" },
    { label: "Informasi", children: [
    { label: "Pengumuman", href: "/pengumuman" },
    { label: "Berita", href: "/berita" },
    { label: "Agenda", href: "/agenda" },
    { label: "PPDB", href: "/ppdb" },
    { label: "Layanan", href: "/layanan" },
    { label: "Kontak", href: "/kontak" },
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
  React.useEffect(() => {
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

// Kepala sekolah (data bisa diisi dari CMS/API)
const HEADMASTER = {
  name: "Drs. Deky Noviar, M.M",
  tenure: "2024–sekarang",
  // Foto resmi kepala sekolah
  photo: 'data:image/jpeg;base64,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',
  placeholder: false,
  priorities: [
    "Penguatan teaching factory & kelas industri",
    "Sertifikasi kompetensi (BNSP/industri)",
    "PKL terpadu & penempatan kerja",
    "Budaya sekolah aman & anti-perundungan",
  ],
};

// Local images for hero/news/gallery
const LOCAL_IMAGES = {
  hero: [
    makeSvg(1600, 900, '#1F3B76', '#2C3F6B', 'Portal Resmi'),
    makeSvg(1600, 900, '#2C3F6B', '#1F3B76', 'Pengumuman'),
    makeSvg(1600, 900, '#1F3B76', '#102347', 'Sambutan Kepsek'),
    makeSvg(1600, 900, '#102347', '#1F3B76', 'Galeri Kegiatan'),
    makeSvg(1600, 900, '#2C3F6B', '#1F3B76', 'Layanan'),
    makeSvg(1600, 900, '#1F3B76', '#2C3F6B', 'Kontak'),
  ],
  news: [
    makeSvg(800, 500, '#1F3B76', '#2C3F6B', 'Berita 1'),
    makeSvg(800, 500, '#2C3F6B', '#1F3B76', 'Berita 2'),
    makeSvg(800, 500, '#102347', '#1F3B76', 'Berita 3'),
  ],
  gallery: [
    makeSvg(1200, 800, '#1F3B76', '#2C3F6B', 'Galeri 1'),
    makeSvg(1200, 800, '#2C3F6B', '#1F3B76', 'Galeri 2'),
    makeSvg(1200, 800, '#102347', '#1F3B76', 'Galeri 3'),
    makeSvg(1200, 800, '#1F3B76', '#102347', 'Galeri 4'),
    makeSvg(1200, 800, '#2C3F6B', '#1F3B76', 'Galeri 5'),
    makeSvg(1200, 800, '#1F3B76', '#2C3F6B', 'Galeri 6'),
  ],
};

// Global DINAS demo data
const GLOBAL_DATA = {
  announcements: [
    { title: "Edaran Disdik: Kegiatan Kebencanaan Pekan Ini", date: "12 Agu 2025", tag: "DINAS", source: 'dinas' },
  ],
  news: [
    { title: "Program Revitalisasi SMK", date: "25 Agu 2025", tag: "DINAS", img: LOCAL_IMAGES.news[0], excerpt: "Kolaborasi sekolah dan industri.", source: 'dinas' },
  ],
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
      <button className="text-sm font-medium rounded-xl px-3 py-2"
              style={{ background: theme.accent, color: "#1b1b1b" }}
              onClick={() => setOpen(v => !v)} aria-haspopup="menu" aria-expanded={open}>Login ▾</button>
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
                <Link key={c.label} href={c.href} className="block px-3 py-2 rounded-lg text-sm hover:bg-white/10" style={{ color: theme.primaryText }}>
                  {c.label}
                </Link>
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
  const navItems = NAV.map(it => it.children ? ({ ...it, children: it.children.filter(c => c.label !== 'PPDB' || ppdbActive) }) : it);
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
          <div className="flex items-center gap-2"><LoginMenu theme={safeTheme} />
            <button className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border" aria-label="Menu" onClick={() => setMobileOpen(v => !v)} style={{ borderColor: safeTheme.subtle, color: safeTheme.primaryText }}>☰</button>
          </div>
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
  { title: "Portal Resmi SMKN 13 Jakarta", desc: "Website multi‑tenant terintegrasi Xpresensi.", img: LOCAL_IMAGES.hero[0], cta1: { href: "#pengumuman", label: "Lihat Pengumuman" }, cta2: { href: "#galeri", label: "Jelajah Galeri" }},
  { title: "Pengumuman Terbaru", desc: "Informasi akademik & kesiswaan.", img: LOCAL_IMAGES.hero[1], cta1: { href: "#pengumuman", label: "Cek Info" }, cta2: { href: "#", label: "Kalender" }},
  { title: "Sambutan Kepala Sekolah", desc: "Lingkungan belajar unggul & berkarakter.", img: LOCAL_IMAGES.hero[2], cta1: { href: "#profil", label: "Baca Sambutan" }, cta2: { href: "#profil", label: "Profil Sekolah" }},
  { title: "Galeri Kegiatan", desc: "Dokumentasi kegiatan & prestasi.", img: LOCAL_IMAGES.hero[3], cta1: { href: "#galeri", label: "Lihat Galeri" }, cta2: { href: "#kesiswaan", label: "Ekskul" }},
  { title: "Layanan Sekolah", desc: "Kurikulum, perpustakaan, kesiswaan.", img: LOCAL_IMAGES.hero[4], cta1: { href: "/layanan", label: "Layanan" }, cta2: { href: "#perpustakaan", label: "E‑Library" } },
  { title: "Kontak Sekolah", desc: "Informasi layanan publik.", img: LOCAL_IMAGES.hero[5], cta1: { href: "#kontak", label: "Kontak" }, cta2: { href: "#", label: "Lokasi" }},
];
const easing = [0.33, 1, 0.68, 1];
const Hero = ({ theme }) => {
  const [index, setIndex] = useState(0);
  const [isPaused, setPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const go = (dir) => setIndex(p => (p + dir + heroSlides.length) % heroSlides.length);
  const handlers = useSwipeable({ onSwipedLeft: () => go(1), onSwipedRight: () => go(-1), preventScrollOnSwipe: true, trackMouse: true });
  React.useEffect(() => { if (isPaused || prefersReducedMotion) return; const t = setInterval(() => setIndex(p => (p + 1) % heroSlides.length), 6000); return () => clearInterval(t); }, [isPaused, prefersReducedMotion]);
  const slide = heroSlides[index];
  return (
    <section id="beranda" className="relative overflow-hidden">
      <div className="relative w-full" {...handlers}>
        <div className="absolute inset-0 -z-10">
          <AnimatePresence mode="wait">
            <motion.div key={index} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: prefersReducedMotion ? 0 : 1, ease: easing }} className="absolute inset-0">
              <SafeImage src={slide.img} alt={slide.title} className="absolute inset-0 w-full h-full object-cover" style={{ filter: "brightness(0.7)" }} />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${THEMES.smkn13.bg}AA 0%, ${THEMES.smkn13.primary}CC 100%)` }} />
        </div>
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <AnimatePresence mode="wait">
            <motion.div key={`text-${index}`} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }} transition={{ duration: prefersReducedMotion ? 0 : 0.6, ease: easing }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight" style={{ color: THEMES.smkn13.primaryText }}>{slide.title}</h1>
              <p className="mt-4 text-base md:text-lg opacity-90" style={{ color: THEMES.smkn13.primaryText }}>{slide.desc}</p>
              <div className="mt-6 flex items-center gap-3">
                <a className="rounded-xl px-5 py-3 text-sm font-semibold" style={{ background: THEMES.smkn13.accent, color: "#1b1b1b" }} href={slide.cta1.href}>{slide.cta1.label}</a>
                <a className="rounded-xl px-5 py-3 text-sm font-semibold border" style={{ borderColor: THEMES.smkn13.accent, color: THEMES.smkn13.primaryText }} href={slide.cta2.href}>{slide.cta2.label}</a>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="mt-8 flex items-center gap-3">
            <button aria-label="Sebelumnya" onClick={() => go(-1)} className="px-3 py-2 rounded-xl border backdrop-blur" style={{ borderColor: THEMES.smkn13.subtle, color: THEMES.smkn13.primaryText }}>←</button>
            <button aria-label="Berikutnya" onClick={() => go(1)} className="px-3 py-2 rounded-xl border backdrop-blur" style={{ borderColor: THEMES.smkn13.subtle, color: THEMES.smkn13.primaryText }}>→</button>
          </div>
          <div className="mt-4 flex gap-2">
            {heroSlides.map((_, i) => (
              <button key={i} aria-label={`Slide ${i + 1}`} onClick={() => setIndex(i)} className="h-2 rounded-full transition-all" style={{ width: i === index ? 24 : 8, background: i === index ? THEMES.smkn13.accent : THEMES.smkn13.subtle }} />
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
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: theme.primary }}>{title}</h2>
          {subtitle && (<p className="text-sm opacity-70" style={{ color: theme.primary }}>{subtitle}</p>)}
        </div>
        <a href={viewAllHref} className="text-sm" style={{ color: theme.primary }}>Lihat semua →</a>
      </div>
      {children}
    </div>
  </section>
);

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
    <section id="profil" className="pt-12 md:pt-16 relative overflow-hidden">
      <motion.div aria-hidden initial={{ opacity: 0 }} animate={{ opacity: 0.25 }} transition={{ duration: prefersReducedMotion ? 0 : 1.2 }} className="pointer-events-none absolute -top-24 -right-24 w-[320px] h-[320px] rounded-full blur-3xl" style={{ background: THEMES.smkn13.accent }} />
      <div className="max-w-6xl mx-auto px-4">
        <motion.div variants={variants.container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="grid md:grid-cols-[200px,1fr] gap-6 items-start rounded-2xl border p-4 md:p-6" style={{ background: THEMES.smkn13.surface, borderColor: THEMES.smkn13.subtle }}>
          <motion.div variants={variants.up} className="relative rounded-2xl overflow-hidden border aspect-[3/4] md:aspect-auto max-h-64 md:max-h-80" style={{ borderColor: THEMES.smkn13.subtle }}>
            {HEADMASTER.photo ? (
              <SafeImage src={HEADMASTER.photo} alt={HEADMASTER.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${THEMES.smkn13.subtle}, ${THEMES.smkn13.primary})` }} />
            )}
            <motion.div className="absolute bottom-3 left-3 rounded-xl px-3 py-1 text-xs font-medium" style={{ background: 'rgba(0,0,0,0.35)', color: THEMES.smkn13.primaryText, border: `1px solid ${THEMES.smkn13.subtle}` }}
              animate={prefersReducedMotion ? {} : { y: -2 }}
              transition={{ repeat: prefersReducedMotion ? 0 : Infinity, repeatType: 'reverse', duration: 3, ease: 'easeInOut' }}>
              Kepala Sekolah
            </motion.div>
          </motion.div>
          <div>
            <motion.div variants={variants.up} className="mb-2 border-b border-white/10 pb-3">
              <h2 className="text-2xl md:text-3xl font-bold text-white">Sambutan Kepala Sekolah</h2>
              <p className="text-sm opacity-70 text-white">Ucapan selamat datang dan komitmen layanan pendidikan di SMKN 13 Jakarta</p>
            </motion.div>
            <motion.div variants={variants.up}>
              <div className="text-base font-semibold" style={{ color: THEMES.smkn13.surfaceText }}>{HEADMASTER.name}</div>
              <div className="text-sm opacity-80" style={{ color: THEMES.smkn13.surfaceText }}>Kepala SMKN 13 Jakarta • {HEADMASTER.tenure}</div>
            </motion.div>
            <motion.div variants={variants.up} className="mt-4 space-y-3 leading-relaxed text-sm md:text-base" style={{ color: THEMES.smkn13.surfaceText }}>
              <p>Assalamu’alaikum warahmatullahi wabarakatuh. Selamat datang di website resmi <strong>SMKN 13 Jakarta</strong>. Situs ini kami hadirkan sebagai pusat informasi dan layanan digital bagi siswa, orang tua, guru, dan masyarakat.</p>
              <p>Kami berkomitmen menyelenggarakan pendidikan vokasi yang <em>relevan dengan industri</em>, menjunjung karakter, serta berorientasi pada <em>link and match</em>. Program dan kemitraan kami rancang untuk menyiapkan lulusan yang kompeten, adaptif, dan berdaya saing.</p>
              <blockquote className="border-l-4 pl-3 italic" style={{ borderColor: THEMES.smkn13.accent }}>
                "Bersama, kita bangun budaya belajar yang unggul, inklusif, dan kolaboratif."
              </blockquote>
            </motion.div>
            <motion.div variants={variants.up} className="mt-5 flex flex-wrap items-center gap-3">
              <a href="#pengumuman" className="rounded-xl px-4 py-2 text-sm font-medium" style={{ background: THEMES.smkn13.accent, color: '#1b1b1b' }}>Lihat Pengumuman</a>
              <a href="#galeri" className="rounded-xl px-4 py-2 text-sm font-medium border" style={{ borderColor: THEMES.smkn13.accent, color: THEMES.smkn13.surfaceText }}>Galeri Kegiatan</a>
            </motion.div>
            <motion.div variants={variants.fade} className="mt-6 text-xs opacity-70" style={{ color: THEMES.smkn13.surfaceText }}>
              Jakarta, {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}<br />
              <span className="inline-block mt-1">— {HEADMASTER.name}</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/****************
 * PROFIL — VISI & MISI
 ****************/
const ProfileVisionMission = ({ theme }) => {
  const misi = [
    "Pembelajaran berbasis kompetensi & proyek riil industri",
    "Penguatan karakter, literasi digital, dan budaya kerja",
    "Pengembangan teaching factory & kelas industri",
    "Sertifikasi kompetensi bertaraf nasional/internasional",
    "Kemitraan PKL dan penempatan kerja yang luas",
    "Layanan sekolah yang transparan, cepat, dan ramah",
  ];
  const values = ["Integritas", "Disiplin", "Kolaborasi", "Inovasi", "Pelayanan"];
  return (
    <Section id="profil-visimisi" title="Visi & Misi" subtitle="Arah pengembangan SMKN 13 Jakarta" theme={theme}>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl p-5 border" style={{ background: theme.surface, borderColor: theme.subtle }}>
          <h3 className="text-lg font-semibold" style={{ color: theme.surfaceText }}>Visi</h3>
          <p className="mt-2 text-sm md:text-base" style={{ color: theme.surfaceText }}>
            Mewujudkan SMK unggul berbasis industri yang melahirkan lulusan berkarakter, kompeten, dan berdaya saing global.
          </p>
          <div className="mt-4 text-sm opacity-80" style={{ color: theme.surfaceText }}>Nilai Budaya: {values.join(" • ")}</div>
        </div>
        <div className="rounded-2xl p-5 border" style={{ background: theme.surface, borderColor: theme.subtle }}>
          <h3 className="text-lg font-semibold" style={{ color: theme.surfaceText }}>Misi</h3>
          <ul className="mt-2 space-y-2 list-disc pl-5 text-sm md:text-base" style={{ color: theme.surfaceText }}>
            {misi.map((mi) => (<li key={mi}>{mi}</li>))}
          </ul>
        </div>
      </div>
    </Section>
  );
};

/****************
 * PROFIL — SEJARAH
 ****************/
const ProfileHistory = ({ theme }) => {
  const history = [
    { year: 1998, event: "Sekolah berdiri" },
    { year: 2010, event: "Revitalisasi sarana praktik & laboratorium" },
    { year: 2017, event: "Akreditasi A" },
    { year: 2023, event: "Implementasi Kurikulum Merdeka" },
    { year: 2024, event: "Perluasan kemitraan kelas industri" },
  ];
  return (
    <Section id="profil-sejarah" title="Sejarah" subtitle="Tonggak perkembangan sekolah" theme={theme}>
      <div className="rounded-2xl p-5 border" style={{ background: theme.surface, borderColor: theme.subtle }}>
        <ol className="relative border-s pl-6" style={{ borderColor: theme.subtle }}>
          {history.map((h) => (
            <li key={h.year} className="mb-4">
              <div className="absolute -left-1.5 mt-1 w-3 h-3 rounded-full" style={{ background: theme.accent }} />
              <div className="text-sm font-semibold" style={{ color: theme.surfaceText }}>{h.year}</div>
              <div className="text-sm opacity-85" style={{ color: theme.surfaceText }}>{h.event}</div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
};

/****************
 * PROFIL — STRUKTUR
 ****************/
const ProfileStructure = ({ theme }) => {
  const contacts = [
    { role: "Waka Kurikulum", email: "wakakur@smkn13.sch.id" },
    { role: "Waka Kesiswaan", email: "waksis@smkn13.sch.id" },
    { role: "Humas", email: "humas@smkn13.sch.id" },
  ];
  return (
    <Section id="profil-struktur" title="Struktur Organisasi" subtitle="Unit kerja & kontak layanan" theme={theme}>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl p-5 border flex items-center justify-center aspect-[3/2]" style={{ background: theme.surface, borderColor: theme.subtle }}>
          {/* Placeholder diagram; ganti ke gambar struktur resmi bila siap */}
          <SafeImage src={makeSvg(800, 500, theme.subtle, theme.primary, 'Diagram Struktur')}
            alt="Struktur Organisasi" className="w-full h-full object-cover" />
        </div>
        <div className="rounded-2xl p-5 border" style={{ background: theme.surface, borderColor: theme.subtle }}>
          <h3 className="text-lg font-semibold" style={{ color: theme.surfaceText }}>Kontak Unit</h3>
          <ul className="mt-3 space-y-2 text-sm" style={{ color: theme.surfaceText }}>
            {contacts.map((c) => (
              <li key={c.role} className="flex items-center justify-between">
                <span>{c.role}</span>
                <a href={`mailto:${c.email}`} className="underline" style={{ color: theme.accent }}>{c.email}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
};

/****************
 * PROFIL — RIWAYAT KEPALA SEKOLAH
 ****************/
const ProfilePrincipalsHistory = ({ theme }) => {
  const principals = [
    { name: "Drs. A. Setiawan", tenure: "2005–2009", note: "Penguatan fondasi kurikulum dan sarana praktik" },
    { name: "Dra. B. Lestari", tenure: "2009–2013", note: "Ekspansi jurusan & awal kemitraan industri" },
    { name: "Drs. C. Prabowo, M.Pd.", tenure: "2013–2018", note: "Akreditasi A & revitalisasi laboratorium" },
    { name: "Ir. D. Syafril, M.T.", tenure: "2018–2022", note: "Implementasi teaching factory & sertifikasi" },
    { name: HEADMASTER.name, tenure: "2022–sekarang", note: "Transformasi digital & kolaborasi Link & Match" },
  ];
  return (
    <Section id="profil-kepala-sekolah" title="Riwayat Kepala Sekolah" subtitle="Apresiasi kepemimpinan dari masa ke masa" theme={theme}>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {principals.map((p) => (
          <div key={p.name} className="rounded-2xl p-4 border shadow-sm hover:shadow-md transition" style={{ background: theme.surface, borderColor: theme.subtle }}>
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold" style={{ color: theme.surfaceText }}>{p.name}</div>
              <span className="text-xs px-2 py-0.5 rounded-full border" style={{ borderColor: theme.subtle, color: theme.surfaceText }}>{p.tenure}</span>
            </div>
            <p className="mt-2 text-sm opacity-85" style={{ color: theme.surfaceText }}>{p.note}</p>
          </div>
        ))}
      </div>
    </Section>
  );
};

/****************
 * NEWS & ANNOUNCEMENTS (simple merge of DINAS + local)
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

const News = ({ theme }) => {
  const local = [
    { title: "SMKN 13 Juara Lomba Inovasi Teknologi Kota", date: "02 Sep 2025", tag: "Berita", img: LOCAL_IMAGES.news[1], excerpt: "Tim RPL SMKN 13 meraih juara inovasi tingkat kota.", source: "local" },
    { title: "Workshop K3 & Safety Laboratorium", date: "30 Agu 2025", tag: "Kegiatan", img: LOCAL_IMAGES.news[2], excerpt: "Penguatan budaya keselamatan kerja bagi siswa jurusan teknik dengan praktik langsung.", source: "local" },
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
            <SafeImage src={src} alt={`Galeri ${idx + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </Section>
  );
};

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

/****************
 * SAFE IMAGE (fallback gradient when blocked)
 ****************/
const SafeImage = ({ src, alt, className, style }) => {
  const [failed, setFailed] = React.useState(false);
  if (!src || failed) {
    return <div className={className} style={{ ...style, background: "repeating-linear-gradient(45deg,#1f2937 0 10px,#111827 10px 20px)" }} aria-label={alt} />;
  }
  return <img src={src} alt={alt} className={className} style={style} onError={() => setFailed(true)} />;
};

/****************
 * PAGE
 ****************/
const Sambutan = ({ theme = THEMES.smkn13 }) => (
  <div className="min-h-screen" style={{ background: theme.primary }}>
    <Navbar theme={theme} />
    {/* Tampilkan hanya sambutan + riwayat sesuai arahan terakhir */}
    <main>
      <HeadmasterGreeting theme={theme} />
      <ProfilePrincipalsHistory theme={theme} />
      {/* Bagian profil lain siap diaktifkan jika perlu */}
      {/* <ProfileVisionMission theme={theme} /> */}
      {/* <ProfileHistory theme={theme} /> */}
      {/* <ProfileStructure theme={theme} /> */}
      {/* <Announcements theme={theme} /> */}
      {/* <News theme={theme} /> */}
      {/* <Gallery theme={theme} /> */}
    </main>
    <Footer theme={theme} />
  </div>
);

export default Sambutan;
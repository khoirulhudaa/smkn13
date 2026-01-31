import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

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
  },
};
const getSafeTheme = (t) => ({ ...THEMES.smkn13, ...(t || {}) });

/****************************
 * DATA DEMO
 ****************************/
const initialKandidat = [
  {
    id: 1,
    nama: "Andi Pratama",
    kelas: "XI RPL",
    foto: "https://randomuser.me/api/portraits/men/12.jpg",
    visi: "Meningkatkan disiplin dan prestasi",
    misi: "Mendorong kegiatan kreatif dan inovatif",
    program: [
      "Agenda belajar bareng tiap pekan",
      "Lomba inovasi kelas",
      "Pojok aspirasi digital",
    ],
    tag: ["Disiplin", "Akademik"],
  },
  {
    id: 2,
    nama: "Budi Santoso",
    kelas: "XI TKJ",
    foto: "https://randomuser.me/api/portraits/men/22.jpg",
    visi: "OSIS inklusif & transparan",
    misi: "Mewadahi aspirasi seluruh siswa",
    program: ["Laporan OSIS bulanan", "Forum aspirasi lintas kelas", "Open volunteer"],
    tag: ["Transparansi", "Aspirasi"],
  },
  {
    id: 3,
    nama: "Citra Ayu",
    kelas: "XI MM",
    foto: "https://randomuser.me/api/portraits/women/33.jpg",
    visi: "Menguatkan budaya literasi & seni",
    misi: "Program literasi mingguan & festival seni",
    program: ["Book club Jumat", "Pentas seni triwulan", "Galeri karya siswa"],
    tag: ["Seni", "Literasi"],
  },
];


/****************************
 * NAV DATA & HELPERS
 ****************************/
const NAV = [
  { label: "Beranda", href: "/dashboard" },
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
              style={{ background: theme.smkn13.accent, color: "#1b1b1b" }}
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
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold" style={{ background: theme.smkn13.accent, color: "#111827" }}>13</div>
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
 * PROMO PEMILIHAN KETUA OSIS — TERINTEGRASI XPRESENSI
 * (Bukan untuk voting. Voting asli berlangsung di sistem Xpresensi.)
 ****************************/
export default function KandidatOsisPage() {
  const theme = getSafeTheme();

  // ======= STATE untuk bagian kandidat (interaktif, non-voting) =======
  const [kandidat, setKandidat] = useState(initialKandidat);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("nama"); // "nama" | "kelas"
  const [selectedId, setSelectedId] = useState(null);
  const [compareIds, setCompareIds] = useState([]); // max 2
  const [supports, setSupports] = useState({}); // { [id]: number }
  const [supportedOnce, setSupportedOnce] = useState({}); // { [id]: true }
  const SUPPORT_LS = "promo_support_counts_osis";

  useEffect(() => {
    // SMOKE TESTS + load dukungan
    try {
      console.assert(Array.isArray(initialKandidat) && initialKandidat.length >= 3, "Kandidat minimal 3");
      console.assert(THEMES.smkn13 && THEMES.smkn13.accent, "Theme ok");
      console.assert(typeof getSafeTheme === "function", "getSafeTheme ada");
      const s = JSON.parse(localStorage.getItem(SUPPORT_LS) || "{}");
      const once = JSON.parse(localStorage.getItem(SUPPORT_LS + "_once") || "{}");
      if (s && typeof s === "object") setSupports(s);
      if (once && typeof once === "object") setSupportedOnce(once);
      console.info("✅ Promo page smoke tests passed");
    } catch (e) {
      console.warn("⚠️ Promo page init warning:", e);
    }
  }, []);

  const saveSupports = (s, once) => {
    setSupports(s);
    setSupportedOnce(once);
    try {
      localStorage.setItem(SUPPORT_LS, JSON.stringify(s));
      localStorage.setItem(SUPPORT_LS + "_once", JSON.stringify(once));
    } catch {}
  };

  const giveSupport = (id) => {
    if (supportedOnce[id]) return; // satu kali per kandidat per perangkat
    const next = { ...supports, [id]: (supports[id] || 0) + 1 };
    const once = { ...supportedOnce, [id]: true };
    saveSupports(next, once);
  };

  const toggleCompare = (id) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length >= 2 ? [prev[1], id] : [...prev, id]
    );
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const arr = kandidat.filter(
      (k) =>
        !q ||
        k.nama.toLowerCase().includes(q) ||
        k.kelas.toLowerCase().includes(q) ||
        (k.tag || []).some((t) => String(t).toLowerCase().includes(q))
    );
    return [...arr].sort((a, b) => String(a[sortKey]).localeCompare(String(b[sortKey])));
  }, [kandidat, query, sortKey]);

  const selected = useMemo(() => kandidat.find((k) => k.id === selectedId) || null, [selectedId, kandidat]);

  const JADWAL = [
    { t: "Pendaftaran Kandidat", d: "1–7 Okt 2025" },
    { t: "Verifikasi & Debat", d: "8–12 Okt 2025" },
    { t: "Masa Kampanye", d: "13–18 Okt 2025" },
    { t: "Voting di Xpresensi", d: "19–20 Okt 2025" },
    { t: "Pengumuman", d: "21 Okt 2025" },
  ];

  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>

      <Navbar theme={THEMES} />

      {/* HERO */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-4"
            style={{ background: "rgba(255,255,255,0.12)", color: theme.primaryText, border: `1px solid ${theme.subtle}` }}
          >
            <span>🔗 Terintegrasi</span>
            <b style={{ color: theme.accent }}>Xpresensi</b>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3" style={{ color: theme.primaryText }}>
            Pemilihan Ketua OSIS 2025/2026
          </h1>
          <p className="text-sm md:text-base opacity-90 max-w-2xl mx-auto" style={{ color: theme.surfaceText }}>
            Informasi resmi dan panduan singkat. Voting dilakukan <b>langsung di sistem Xpresensi</b> dengan SSO akun sekolah.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <a
              href="https://student.xpresensi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl text-sm font-medium"
              style={{ background: theme.accent, color: "#111827" }}
            >
              Login Pemilih (Siswa)
            </a>
            <a
              href="https://teacher.xpresensi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl text-sm font-medium"
              style={{ background: theme.accent, color: "#111827" }}
            >
              Login Guru
            </a>
            <a
              href="https://admin.xpresensi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl text-sm font-medium"
              style={{ background: theme.accent, color: "#111827" }}
            >
              Login Panitia Admin
            </a>
            <a
              href="#panduan"
              className="px-5 py-2.5 rounded-xl text-sm font-medium border"
              style={{ borderColor: theme.subtle, color: theme.primaryText }}
            >
              Lihat Panduan
            </a>
          </div>
        </div>
      </section>

      {/* INFO BAR / JADWAL */}
      <section className="pb-6">
        <div className="max-w-6xl mx-auto px-4 grid gap-4 md:grid-cols-5">
          {JADWAL.map((it, i) => (
            <div key={i} className="rounded-2xl border p-4 text-center" style={{ background: theme.surface, borderColor: theme.subtle }}>
              <div className="text-[12px] uppercase tracking-wide opacity-85" style={{ color: theme.surfaceText }}>
                {it.t}
              </div>
              <div className="text-sm font-semibold" style={{ color: theme.primaryText }}>
                {it.d}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* POSTER DEBAT */}
      <section className="py-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-[26px] font-bold mb-4" style={{ color: theme.primaryText }}>
            Poster Debat Kandidat
          </h2>
          <p className="text-sm mb-6 opacity-90" style={{ color: theme.surfaceText }}>
            Saksikan debat terbuka calon Ketua OSIS. Poster resmi acara ditampilkan di bawah.
          </p>
          <div className="rounded-2xl overflow-hidden border shadow-md" style={{ borderColor: theme.subtle }}>
            <img src="/example.jpg" alt="Poster Debat Ketua OSIS" className="w-full h-auto object-cover" />
          </div>
        </div>
      </section>

      {/* KANDIDAT (interaktif, non-voting) */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-end justify-between gap-3 mb-4">
            <div>
              <h2 className="text-2xl md:text-[26px] font-bold" style={{ color: theme.primaryText }}>
                Kandidat Ketua OSIS
              </h2>
              <p className="text-sm opacity-90" style={{ color: theme.surfaceText }}>
                Profil ringkas untuk promosi. <b>Voting hanya di Xpresensi.</b>
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari nama/kelas/tema..."
                className="px-3 py-2 rounded-lg text-sm border"
                style={{ borderColor: theme.subtle, background: "white", color: "#111" }}
              />
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value)}
                className="px-3 py-2 rounded-lg text-sm border"
                style={{ borderColor: theme.subtle, background: "white", color: "#111" }}
              >
                <option value="nama">Urut: Nama</option>
                <option value="kelas">Urut: Kelas</option>
              </select>
            </div>
          </div>

          {/* Grid kandidat */}
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {filtered.map((k) => (
              <motion.div
                key={k.id}
                whileHover={{ scale: 1.02 }}
                className="rounded-2xl border p-5 text-left"
                style={{ background: theme.surface, borderColor: theme.subtle }}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={k.foto}
                    alt={`Foto ${k.nama}`}
                    className="w-16 h-16 rounded-full object-cover border"
                    style={{ borderColor: theme.subtle }}
                  />
                  <div>
                    <div className="font-semibold" style={{ color: theme.primaryText }}>
                      {k.nama}
                    </div>
                    <div className="text-xs opacity-85" style={{ color: theme.surfaceText }}>
                      Kelas {k.kelas}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {(k.tag || []).map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-full text-[11px]"
                          style={{
                            background: "rgba(255,255,255,0.12)",
                            color: theme.primaryText,
                            border: `1px solid ${theme.subtle}`,
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <details className="mt-3">
                  <summary className="cursor-pointer text-xs" style={{ color: theme.surfaceText }}>
                    <b>Visi:</b> {k.visi}
                  </summary>
                  <div className="mt-2 text-xs" style={{ color: theme.surfaceText }}>
                    <b>Misi:</b> {k.misi}
                  </div>
                  <ul className="mt-2 text-xs list-disc list-inside" style={{ color: theme.surfaceText }}>
                    {(k.program || []).map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </details>

                {/* dukungan promosi (local) */}
                <div className="mt-4 flex items-center justify-between">
                  <button
                    onClick={() => giveSupport(k.id)}
                    disabled={!!supportedOnce[k.id]}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-60"
                    style={{ background: theme.accent, color: "#111827" }}
                  >
                    {supportedOnce[k.id] ? "Terima kasih!" : "Dukung (Promo)"}
                  </button>
                  <span className="text-xs" style={{ color: theme.surfaceText }}>
                    {(supports[k.id] || 0) + 0} dukungan
                  </span>
                </div>

                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedId(k.id)}
                    className="px-3 py-1.5 rounded-lg text-xs border"
                    style={{ borderColor: theme.subtle, color: theme.primaryText }}
                  >
                    Lihat Profil
                  </button>
                  <button
                    onClick={() => toggleCompare(k.id)}
                    className="px-3 py-1.5 rounded-lg text-xs border"
                    style={{ borderColor: theme.subtle, color: theme.primaryText }}
                  >
                    {compareIds.includes(k.id) ? "Batalkan" : "Bandingkan"}
                  </button>
                </div>

                <div className="mt-3 flex gap-2">
                  <a
                    href="https://student.xpresensi.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg text-xs font-medium"
                    style={{ background: theme.accent, color: "#111827" }}
                  >
                    Xpresensi (Siswa)
                  </a>
                  <a
                    href="https://teacher.xpresensi.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg text-xs border"
                    style={{ borderColor: theme.subtle, color: theme.primaryText }}
                  >
                    Guru
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tray bandingkan */}
          {compareIds.length > 0 && (
            <div className="mt-8 rounded-2xl border p-4" style={{ background: theme.surface, borderColor: theme.subtle }}>
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold" style={{ color: theme.primaryText }}>
                  Bandingkan Kandidat ({compareIds.length}/2)
                </div>
                <button
                  onClick={() => setCompareIds([])}
                  className="px-3 py-1 rounded-lg text-xs border"
                  style={{ borderColor: theme.subtle, color: theme.primaryText }}
                >
                  Reset
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr style={{ color: theme.primaryText }}>
                      <th className="py-2 pr-4">Aspek</th>
                      {compareIds.map((id) => {
                        const c = kandidat.find((x) => x.id === id) || { nama: "-" };
                        return (
                          <th key={id} className="py-2 px-4">
                            {c.nama}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody style={{ color: theme.surfaceText }}>
                    <tr>
                      <td className="py-2 pr-4">Kelas</td>
                      {compareIds.map((id) => {
                        const c = kandidat.find((x) => x.id === id) || { kelas: "-" };
                        return (
                          <td key={id} className="py-2 px-4">
                            {c.kelas}
                          </td>
                        );
                      })}
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">Visi</td>
                      {compareIds.map((id) => {
                        const c = kandidat.find((x) => x.id === id) || { visi: "-" };
                        return (
                          <td key={id} className="py-2 px-4">
                            {c.visi}
                          </td>
                        );
                      })}
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">Misi</td>
                      {compareIds.map((id) => {
                        const c = kandidat.find((x) => x.id === id) || { misi: "-" };
                        return (
                          <td key={id} className="py-2 px-4">
                            {c.misi}
                          </td>
                        );
                      })}
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">Program</td>
                      {compareIds.map((id) => {
                        const c = kandidat.find((x) => x.id === id) || { program: [] };
                        return (
                          <td key={id} className="py-2 px-4">
                            {(c.program || []).slice(0, 3).join(", ")}
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal profil kandidat */}
        {selected && (
          <div
            className="fixed inset-0 z-50"
            role="dialog"
            aria-modal="true"
            style={{ background: "rgba(0,0,0,0.7)" }}
            onClick={() => setSelectedId(null)}
          >
            <div
              className="max-w-xl mx-auto mt-20 rounded-2xl border p-5 relative"
              style={{ background: "white", color: "#111", borderColor: theme.subtle }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedId(null)}
                aria-label="Tutup"
                className="absolute top-3 right-3 text-sm px-2 py-1 border rounded-lg"
              >
                Tutup ✕
              </button>
              <div className="flex gap-4">
                <img
                  src={selected.foto}
                  alt={`Foto ${selected.nama}`}
                  className="w-20 h-20 rounded-full object-cover border"
                />
                <div>
                  <div className="font-semibold text-lg">{selected.nama}</div>
                  <div className="text-xs opacity-70">Kelas {selected.kelas}</div>
                  <div className="mt-2 text-sm">
                    <b>Visi:</b> {selected.visi}
                  </div>
                  <div className="text-sm">
                    <b>Misi:</b> {selected.misi}
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-sm font-semibold">Program Unggulan</div>
                <ul className="text-sm list-disc list-inside">
                  {(selected.program || []).map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 flex gap-2">
                <a
                  href="https://student.xpresensi.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl text-sm font-medium"
                  style={{ background: theme.accent, color: "#111827" }}
                >
                  Dukung di Xpresensi (Siswa)
                </a>
                <a
                  href="https://teacher.xpresensi.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl text-sm border"
                  style={{ borderColor: theme.subtle, color: "#111" }}
                >
                  Guru
                </a>
                <a
                  href="https://admin.xpresensi.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl text-sm border"
                  style={{ borderColor: theme.subtle, color: "#111" }}
                >
                  Admin
                </a>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* FAQ & KEBIJAKAN */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4 grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-xl font-bold mb-3" style={{ color: theme.primaryText }}>
              FAQ
            </h3>
            <div className="rounded-2xl border p-4 mb-3" style={{ background: theme.surface, borderColor: theme.subtle }}>
              <div className="font-semibold" style={{ color: theme.primaryText }}>
                Di mana melakukan voting?
              </div>
              <div className="text-sm" style={{ color: theme.surfaceText }}>
                Voting hanya di portal Xpresensi sekolah (SSO).
              </div>
            </div>
            <div className="rounded-2xl border p-4 mb-3" style={{ background: theme.surface, borderColor: theme.subtle }}>
              <div className="font-semibold" style={{ color: theme.primaryText }}>
                Bagaimana jika akun saya bermasalah?
              </div>
              <div className="text-sm" style={{ color: theme.surfaceText }}>
                Hubungi panitia/ TU untuk reset akses Xpresensi.
              </div>
            </div>
            <div className="rounded-2xl border p-4" style={{ background: theme.surface, borderColor: theme.subtle }}>
              <div className="font-semibold" style={{ color: theme.primaryText }}>
                Apakah hasil bisa dipantau langsung?
              </div>
              <div className="text-sm" style={{ color: theme.surfaceText }}>
                Rekap tersedia untuk panitia sesuai ketentuan sekolah.
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-3" style={{ color: theme.primaryText }}>
              Kebijakan & Keamanan
            </h3>
            <ul className="text-sm space-y-2" style={{ color: theme.surfaceText }}>
              <li>• Data pemilih mengacu pada data sekolah di Xpresensi.</li>
              <li>• Setiap akun memiliki satu hak suara sesuai ketentuan.</li>
              <li>• Aktivitas dicatat untuk kepentingan audit panitia.</li>
              <li>• Kebijakan privasi mengikuti kebijakan sekolah & Xpresensi.</li>
            </ul>
            <div className="flex flex-col gap-2 mt-4">
              <a
                href="https://student.xpresensi.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex px-4 py-2 rounded-xl text-sm font-medium"
                style={{ background: theme.accent, color: "#111827" }}
              >
                Portal Xpresensi Siswa
              </a>
              <a
                href="https://teacher.xpresensi.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex px-4 py-2 rounded-xl text-sm font-medium"
                style={{ background: theme.accent, color: "#111827" }}
              >
                Portal Xpresensi Guru
              </a>
              <a
                href="https://admin.xpresensi.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex px-4 py-2 rounded-xl text-sm font-medium"
                style={{ background: theme.accent, color: "#111827" }}
              >
                Portal Xpresensi Admin
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOT NOTE */}
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-4 text-center relative">
          <p className="text-xs opacity-80" style={{ color: theme.surfaceText }}>
            Halaman ini hanya untuk <b>informasi & promosi</b>. Voting resmi berlangsung di sistem Xpresensi.
          </p>
          <div className="absolute bottom-0 right-0 pr-2">
            <span className="text-[11px] opacity-70" style={{ color: theme.surfaceText }}>
              Powered by <b>Xpresensi</b>
            </span>
          </div>
        </div>
      </section>

      <Footer theme={THEMES} />
    </div>
  );
}

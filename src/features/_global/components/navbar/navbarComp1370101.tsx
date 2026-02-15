import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LogInIcon, Mail, MapPin, Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getSchoolId } from "../../hooks/getSchoolId";

// Theme Tokens for Multiple Schools
const THEME_TOKENS = {
  sdn09: {
    name: "SDN 09 JAKARTA",
    "--brand-primary": "#457B9D",
    "--brand-primaryText": "#ffffff",
    "--brand-accent": "#F4A261",
    "--brand-bg": "#E5E7EB",
    "--brand-surface": "#ffffff",
    "--brand-surfaceText": "#1F2937",
    "--brand-subtle": "#9CA3AF",
    "--brand-pop": "#DC2626",
  }
};

// Get theme based on domain
const getThemeKey = () => {
  return "sdn09"; // Default
};

// Shim Link (ganti dengan next/link bila pakai Next.js)
const Link = ({ href, className, style, children, target, rel }) => (
  <a href={href} className={className} style={style} target={target} rel={rel}>
    {children}
  </a>
);

// Hook click-outside
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

// Hook untuk ambil profil sekolah (sama seperti di homepage)
const useSchoolProfile = () => {
  const schoolId = getSchoolId(); // ← sesuaikan dengan ID sekolah SDN 09 di database

  const API_BASE = 'https://be-school.kiraproject.id';
  // ? 'http://localhost:5005' 
  // : 'https://be-school.kiraproject.id';

  return useQuery({
    queryKey: ['schoolProfile', schoolId],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/profileSekolah?schoolId=${schoolId}`, {
        cache: 'no-store',
      });
      if (!res.ok) throw new Error(`Gagal mengambil profil sekolah: ${res.status}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Response tidak valid");
      return data.data; // null atau objek profil
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// === DATA NAVIGASI ===
const NAV = [
  {
    label: "Profil Sekolah",
    children: [
      { label: "Halaman Utama", href: "/halaman-utama" },
      { label: "Sambutan", href: "/sambutan" },
      { label: "Visi & Misi", href: "/visiMisi" },
      { label: "Galeri", href: "/galeri" },
      { label: "Sejarah", href: "/sejarah" },
      { label: "Tata tertib", href: "/tata-tertib" },
      { label: "Struktur", href: "/struktur" },
    ],
  },
  {
    label: "Akademik",
    children: [
      { label: "Prestasi", href: "/prestasi" },
      { label: "Kurikulum", href: "/kurikulum" },
      { label: "Kalender", href: "/kalender" },
      { label: "Jadwal", href: "/jadwal" },
      { label: "Guru & Tendik", href: "/guru-tendik" },
    ],
  },
  { label: "Program", href: "/program" },
  {
    label: "Kegiatan",
    children: [
      { label: "OSIS", href: "/osis" },
      { label: "Voting OSIS", href: "/voting-osis" },
      { label: "Ekstrakurikuler", href: "/ekstrakulikuler" },
      { label: "Pramuka", href: "/pramuka" },
    ],
  },
  { label: "Perpus", href: "/perpustakaan" },
  {
    label: "Informasi",
    children: [
      { label: "Pengumuman", href: "/pengumuman" },
      { label: "Berita", href: "/berita" },
      // { label: "Agenda", href: "/agenda" },
      { label: "Buku Alumni", href: "/buku-alumni" },
      { label: "PPDB", href: "/ppdb" },
      { label: "PPID", href: "/ppid" },
      { label: "Layanan", href: "/layanan" },
      // { label: "Kelulusan", href: "/kelulusan" },
    ],
  },
];

// === LOGIN MENU ===
const LoginMenu = ({ theme }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useOnClickOutside(ref, () => setOpen(false));

  return (
    <div className="relative" ref={ref}>
      <a href="https://admin.kiraproject.id/auth/login" target="__blank">
        <button
          className="text-sm font-medium rounded-lg bg-white border border-blue-700 gap-3 text-blue-700 pl-2 hover:text-white hover:bg-blue-600 pr-3 py-2 hidden md:flex items-center"
          style={{ background: theme.accent }}
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={open}
        >
          <LogInIcon className="w-4" />
          <p className="uppercase w-max">Login Admin</p>
        </button>
      </a>
    </div>
  );
};

// === DROPDOWN (Desktop) ===
const NavDropdown = ({ item, theme }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useOnClickOutside(ref, () => setOpen(false));
  const hasChild = Array.isArray(item.children) && item.children.length > 0;

  if (!hasChild) {
    const isRoute = typeof item.href === "string" && item.href.startsWith("/");
    return isRoute ? (
      <Link
        href={item.href}
        className="text-sm px-1 w-max py-1 uppercase hover:underline"
        style={{ color: 'black' }}
      >
        {item.label}
      </Link>
    ) : (
      <a
        href={item.href}
        className="text-sm px-1 w-max py-1 uppercase hover:underline"
        style={{ color: 'black' }}
      >
        {item.label}
      </a>
    );
  }

  return (
    <div
      className="relative"
      ref={ref}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className="text-sm px-1 py-1 w-max uppercase flex items-center gap-1"
        style={{ color: 'black' }}
        onClick={() => setOpen((v) => !v)}
      >
        {item.label}
        <span aria-hidden>
          <ChevronDown className="w-[14px]" />
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.16 }}
            className="bg-blue-800 absolute left-0 mt-2 w-44 rounded-2xl shadow-3xl uppercase border border-white p-2"
            style={{ borderColor: theme.subtle }}
          >
            {item.children.map((c) => {
              const isRoute = typeof c.href === "string" && c.href.startsWith("/");
              return isRoute ? (
                <Link
                  key={c.label}
                  href={c.href}
                  className="block px-3 py-2 rounded-lg text-sm uppercase hover:bg-white/10"
                  style={{ color: 'white' }}
                >
                  {c.label}
                </Link>
              ) : (
                <a
                  key={c.label}
                  href={c.href}
                  className="block px-3 py-2 rounded-lg text-sm uppercase hover:bg-white/10"
                  style={{ color: 'black' }}
                >
                  {c.label}
                </a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// === MOBILE ACCORDION ===
const MobileAccordion = ({ item, theme }) => {
  const [open, setOpen] = useState(false);
  const hasChild = Array.isArray(item.children) && item.children.length > 0;

  if (!hasChild) {
    const isRoute = typeof item.href === "string" && item.href.startsWith("/");
    return isRoute ? (
      <Link
        href={item.href}
        className="block px-4 py-3 rounded-lg uppercase hover:bg-white/10 transition-colors"
        style={{ color: 'white' }}
      >
        {item.label}
      </Link>
    ) : (
      <a
        href={item.href}
        className="block px-4 py-3 rounded-lg uppercase hover:bg-white/10 transition-colors"
        style={{ color: 'white' }}
      >
        {item.label}
      </a>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center uppercase justify-between px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
        style={{ color: 'white' }}
      >
        <span>{item.label}</span>
        <span>{open ? "−" : "+"}</span>
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
            {item.children.map((c) => {
              const isRoute = typeof c.href === "string" && c.href.startsWith("/");
              return isRoute ? (
                <Link
                  key={c.label}
                  href={c.href}
                  className="block px-4 py-2 uppercase rounded-lg text-sm hover:bg-white/5 transition-colors mt-1"
                  style={{ color: 'white' }}
                >
                  {c.label}
                </Link>
              ) : (
                <a
                  key={c.label}
                  href={c.href}
                  className="block px-4 py-2 uppercase rounded-lg text-sm hover:bg-white/5 transition-colors mt-1"
                  style={{ color: 'white' }}
                >
                  {c.label}
                </a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// === MOBILE MENU HOOK ===
const useMobileMenu = (isOpen, onClose) => {
  const ref = useRef(null);
  useOnClickOutside(ref, onClose);
  return ref;
};

// === NAVBAR COMPONENT ===
export const NavbarComp1378101 = ({ theme = {}, onTenantChange = () => {}, currentKey = "smkn13" }) => {
  const themeKey = getThemeKey();
  const safeTheme = THEME_TOKENS[themeKey]  
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileRef = useMobileMenu(mobileOpen, () => setMobileOpen(false));

  // Ambil data profil sekolah dari hook API profil baru
  const { data: profile, isPending } = useSchoolProfile();

  // === FUNGSI PEMBERSIH NAMA SEKOLAH ===
  const getCleanName = (name: string) => {
    if (!name) return "";
    // Menghapus Jakarta, wilayah arah mata angin, dan Pusat (case-insensitive)
    const pattern = /\b(jakarta|barat|timur|utara|selatan|pusat)\b/gi;
    return name.replace(pattern, "").replace(/\s\s+/g, ' ').trim();
  };

  const cleanedSchoolName = getCleanName(profile?.schoolName || safeTheme.name);

  const navItems = NAV.map((it) =>
    it.children ? { ...it } : it
  );

  useEffect(() => {
    if (themeKey !== currentKey) {
      onTenantChange(themeKey);
    }
  }, [themeKey, currentKey, onTenantChange]);

  return (
    <div className="relative top-0 left-0 w-full z-[9999]">
      {/* Top Header - Sekarang dinamis dari Profile Sekolah */}
      <header className="w-full text-[10px] md:text-xs px-4 md:px-16 uppercase font-medium bg-blue-700 text-white hidden md:flex items-center justify-center p-3">
        {isPending ? (
          <p className="animate-pulse tracking-widest">Sinkronisasi data sekolah...</p>
        ) : (
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Phone size={12} className="opacity-70" />
              {profile?.phoneNumber || "+62 21 1234 5678"}
            </span>
            <span className="flex items-center gap-2">
              <Mail size={12} className="opacity-70" />
              {profile?.email || "info@sekolah.sch.id"}
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={12} className="opacity-70" />
              {profile?.address || "Alamat sekolah belum diatur"}
            </span>
          </div>
        )}
      </header>

      {/* Header Utama */}
      <div className="w-full sticky top-0 z-[4] backdrop-blur shadow-xl justify-between bg-white">
        <div className="max-w-7xl mx-auto md:px-1">
          <div className="w-full flex items-center justify-between px-5 md:px-0 py-3 md:py-3">
            {/* Logo & Nama Sekolah */}
            <div className="flex items-center gap-2 w-[40%] md:w-[30%]">
              <div className="leading-none flex gap-4 items-center">
                <div
                  className="flex items-center gap-3 text-sm md:text-lg font-bold tracking-tighter"
                  style={{ color: 'black' }}
                >
                  <img src={profile?.logoUrl} alt="Logo Sekolah" className="w-8 h-8 md:w-10 md:h-10 md:flex hidden object-contain" />
                  <span className="uppercase md:text-[15px] text-[16px] w-max">{cleanedSchoolName}</span>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex uppercase items-center w-max gap-6 xl:gap-8">
              {navItems.map((item) => (
                <NavDropdown key={item.label} item={item} theme={safeTheme} />
              ))}
            </div>

            {/* Right Menu (Login + Toggle) */}
            <div className="flex items-center w-[30%] uppercase justify-end gap-4">
              <LoginMenu theme={safeTheme} />
              <button
                className="md:hidden flex flex-col gap-1.5 p-2"
                aria-label="Menu"
                onClick={() => setMobileOpen(true)}
              >
                <div className="w-6 h-0.5 bg-black"></div>
                <div className="w-6 h-0.5 bg-black"></div>
                <div className="w-4 h-0.5 bg-black self-end"></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-blue-800 backdrop-blur-sm z-[999]"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              ref={mobileRef}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-[100vw] bg-blue-800 text-white shadow-2xl z-[999] flex flex-col"
            >
              {/* Sidebar Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <img src={profile?.logoUrl} alt="Logo" className="w-8 h-8 rounded" />
                   <span className="font-bold tracking-tighter uppercase text-sm">{cleanedSchoolName}</span>
                </div>
                <button 
                  onClick={() => setMobileOpen(false)}
                  className="w-10 h-10 flex items-center font-black border border-white/60 hover:bg-red-700 active:scale-[1] hover:scale-[1.1] duration-200 transition-scale justify-center rounded-full bg-red-600 text-white"
                >
                  ✕
                </button>
              </div>

              {/* Sidebar Content (Scrollable) */}
              <div className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
                {navItems.map((item) => (
                  <MobileAccordion key={item.label} item={item} theme={safeTheme} />
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavbarComp1378101;
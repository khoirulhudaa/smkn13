import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LogInIcon, Mail, MapPin, Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getSchoolId } from "../../hooks/getSchoolId";

const useSchoolProfile = () => {
  const schoolId = getSchoolId();
  const API_BASE = 'https://be-school.kiraproject.id';
  return useQuery({
    queryKey: ['schoolProfile', schoolId],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/profileSekolah?schoolId=${schoolId}`);
      const data = await res.json();
      return data.data;
    },
    staleTime: 300000,
  });
};

// // === DATA NAVIGASI ===
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


// === DROPDOWN COMPONENT (Premium Style) ===
const NavDropdown = ({ item }: any) => {
  const [open, setOpen] = useState(false);
  
  return (
    <div 
      className="relative group"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="flex items-center gap-1.5 text-[13px] font-semibold tracking-wide text-slate-700 hover:text-blue-600 transition-colors py-4 uppercase">
        {item.label}
        <ChevronDown size={14} className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {open && item.children && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute left-[-20px] top-full w-56 bg-white/90 backdrop-blur-xl border border-slate-200/60 shadow-[0_20px_40px_rgba(0,0,0,0.08)] rounded-2xl p-2 z-50 overflow-hidden"
          >
            <div className="grid gap-1">
              {item.children.map((child: any) => (
                <a
                  key={child.label}
                  href={child.href}
                  className="px-4 py-2.5 text-[12px] font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl transition-all flex items-center justify-between group/item"
                >
                  {child.label}
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const NavbarComp40 = () => {
  const { data: profile, isPending } = useSchoolProfile();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getCleanName = (name: string) => {
    if (!name) return "";
    return name.replace(/\b(jakarta|barat|timur|utara|selatan|pusat)\b/gi, "").trim();
  };

  return (
    <div className="fixed top-0 left-0 w-full z-[6] transition-all duration-500">
      
      {/* 1. TOP INFO BAR (Extra Minimalist) */}
      <div className={`hidden md:flex bg-blue-700 text-white py-5 h-[40px] px-12 transition-all duration-500 ${scrolled ? 'translate-y-[-100%] opacity-0' : 'translate-y-0 opacity-100'}`}>
        <div className="max-w-7xl mx-auto w-full flex justify-center gap-7 items-center text-[10px] tracking-[0.15em] font-semibold uppercase">
          <div className="flex gap-8">
            <span className="flex items-center gap-2 uppercase hover:text-white transition-colors cursor-pointer">
              <Phone size={12} className="text-blue-400" /> {profile?.phoneNumber || "Contact"}
            </span>
            <span className="flex items-center gap-2 uppercase hover:text-white transition-colors cursor-pointer">
              <Mail size={12} className="text-white" /> {profile?.email || "Email Us"}
            </span>
          </div>
          <div className="flex items-center gap-2 uppercase text-white">
            <MapPin size={12} /> {profile?.address || "Location"}
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION CONTAINER */}
      <div className={`w-full transition-all shadow-2xl duration-500 px-0 md:px-8 ${scrolled ? 'md:mt-0' : 'md:mt-0'}`}>
        <nav className={`w-screen md:max-w-7xl mx-auto flex items-center justify-between px-6 py-3 rounded-bl-2xl rounded-br-2xl transition-all duration-500 
          ${scrolled 
            ? 'bg-white/80 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-white/40 mt-2' 
            : 'bg-white border border-slate-100 shadow-sm'}`}>
          
          {/* Logo Section */}
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-full group-hover:bg-blue-500/30 transition-all" />
              <img 
                src={profile?.logoUrl || "/logo.png"} 
                alt="Logo" 
                className="w-10 h-10 md:w-11 md:h-11 relative object-contain transition-transform group-hover:scale-110" 
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm md:text-lg font-black tracking-tighter text-slate-900 leading-none">
                {getCleanName(profile?.schoolName) || "SCHOOL"}
              </span>
              {/* <span className="text-[9px] font-bold tracking-[0.2em] text-blue-600 uppercase">Education Excellence</span> */}
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV.map((item) => (
              item.children ? <NavDropdown key={item.label} item={item} /> : (
                <a key={item.label} href={item.href} className="text-[13px] font-semibold text-slate-700 hover:text-blue-600 transition-all uppercase tracking-wide">
                  {item.label}
                </a>
              )
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <a href="https://admin.kiraproject.id" target="_blank" className="hidden md:flex items-center gap-2 border border-slate-900 hover:bg-slate-900 text-slate-900 hover:text-white px-5 py-2.5 rounded-xl text-[11px] font-bold tracking-widest transition-all hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 uppercase">
              <LogInIcon size={14} /> Admin Portal
            </a>
            
            {/* Hamburger */}
            <button 
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2.5 bg-slate-50 text-slate-900 rounded-xl hover:bg-blue-50 transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>
        </nav>
      </div>

      {/* 3. MOBILE SIDEBAR (Full Overlay Style) */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/90 backdrop-blur-2xl z-[1000] flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center gap-3">
                <img src={profile?.logoUrl} className="w-10 h-10" />
                <span className="text-white font-bold tracking-tighter uppercase">{getCleanName(profile?.schoolName)}</span>
              </div>
              <button 
                onClick={() => setMobileOpen(false)}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white"
              >
                <X size={28} />
              </button>
            </div>
            
            <div className="flex flex-col gap-6 overflow-y-auto">
              {NAV.map((item, idx) => (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  key={item.label}
                >
                  <h4 className="text-blue-400 text-[10px] font-bold tracking-widest uppercase mb-4">{item.label}</h4>
                  <div className="flex flex-col gap-4 pl-2 border-l border-white/10">
                    {item.children ? item.children.map((c: any) => (
                      <a key={c.label} href={c.href} className="text-2xl font-light text-white/80 hover:text-white">{c.label}</a>
                    )) : <a href={item.href} className="text-2xl font-light text-white">{item.label}</a>}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavbarComp40;
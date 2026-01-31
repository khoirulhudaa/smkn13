import {
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Phone,
  ShieldCheck
} from "lucide-react";
import { useEffect, useState } from "react";
import { getSchoolId } from "../../hooks/getSchoolId";

export const FooterComp = () => {
  const [schoolData, setSchoolData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const schoolId = getSchoolId();
      try {
        // Ganti URL ini dengan endpoint API backend kamu
        const response = await fetch(`https://be-school.kiraproject.id/profileSekolah?schoolId=${schoolId}`);
        const result = await response.json();
        if (result.success && result.data) {
          setSchoolData(result.data);
        }
      } catch (error) {
        console.error("Gagal mengambil data footer:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // State Loading atau Default jika data belum ada
  if (loading) return <div className="bg-blue-800 h-20" />; 

  // Fungsi untuk membersihkan nama dari keterangan wilayah
  const cleanSchoolName = (name: string) => {
    if (!name) return "";
    // Regex untuk mencari kata wilayah, \b memastikan kata berdiri sendiri (bukan bagian dari kata lain)
    const pattern = /\b(jakarta|barat|timur|utara|selatan|pusat)\b/gi;
    return name.replace(pattern, "").replace(/\s\s+/g, ' ').trim();
  };

  const displayData = {
    // Nama sekolah yang sudah dibersihkan
    name: cleanSchoolName(schoolData?.schoolName || "Ceria Academy"),
    
    address: schoolData?.address || "Alamat belum diatur",
    phone: schoolData?.phoneNumber || "-",
    email: schoolData?.email || "-",
    
    // Mengambil inisial dari nama yang sudah bersih
    shortName: cleanSchoolName(schoolData?.schoolName || "CA")
      .split(' ')
      .filter(word => word.length > 0)
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase(),

    mapsUrl: (schoolData?.latitude && schoolData?.longitude) 
      ? `https://www.google.com/maps?q=${schoolData.latitude},${schoolData.longitude}`
      : "#"
  };

  return (
    <footer className="relative bg-blue-800 text-white overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-800/10 rounded-full blur-[100px]" />
      
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-4">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg bg-[#F2C94C] text-[#1e293b]"
              >
                {displayData.shortName}
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tighter uppercase leading-none">
                  {displayData.name}
                </h2>
                <p className="text-[10px] font-bold text-white uppercase tracking-[0.2em] mt-1">
                  Web Pendidikan
                </p>
              </div>
            </div>
            
            <p className="text-slate-200 text-sm leading-relaxed max-w-sm">
              Mewujudkan lulusan yang berkarakter Profil Pelajar Pancasila, 
              unggul dalam prestasi, berbudaya lingkungan, dan siap menghadapi 
              tantangan global.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-200 mb-6 flex items-center gap-2">
              <Globe size={14} className="text-blue-200 ml-[-4px]" /> Navigasi
            </h4>
            <ul className="grid grid-cols-1 gap-4">
              {['Halaman-utama', 'Pengumuman', 'Galeri', 'Layanan'].map((item) => (
                <li key={item}>
                  <a 
                    href={`/${item.toLowerCase()}`} 
                    className="text-slate-200 hover:text-white text-sm font-medium flex items-center gap-2 transition-all hover:translate-x-1"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-4">
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-200 mb-6 flex items-center gap-2">
              <MapPin size={16} className="text-blue-200 ml-[-4px]" /> Hubungi Kami
            </h4>
            <div className="space-y-4">
              <p className="text-slate-200 text-sm leading-relaxed">
                {displayData.address}
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <Phone size={14} /> {displayData.phone}
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <Mail size={14} /> {displayData.email}
                </div>
              </div>

              <a 
                href={displayData.mapsUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-2 text-xs font-black text-blue-400 uppercase tracking-widest hover:text-blue-300 transition-colors"
              >
                Buka di Google Maps <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-slate-200 text-[11px] font-bold uppercase tracking-widest">
            <ShieldCheck size={14} />
            <span>© 2026 {displayData.name} • All Rights Reserved</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-slate-200 text-[10px] font-black uppercase tracking-widest">Official Partner</span>
            <div className="flex items-center gap-1.5 bg-white/5 px-4 py-2 rounded-full border border-white/5">
              <span className="text-[10px] text-slate-300">Powered by</span>
              <span className="text-xs font-black text-white tracking-tighter italic">XPRESENSI</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
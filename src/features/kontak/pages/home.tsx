import { SMAN25_CONFIG } from "@/core/theme";
import { FooterComp } from "@/features/_global/components/footer";
import { HeroComp } from "@/features/_global/components/hero";
import NavbarComp from "@/features/_global/components/navbar";
import { getSchoolId } from "@/features/_global/hooks/getSchoolId";
import { useEffect, useState } from "react";

/* ================= CONFIG ================= */
const BASE_URL = "https://be-school.kiraproject.id";


/* ================= COMPONENTS ================= */
const Card = ({ children }: any) => (
  <div className="rounded-2xl border border-black/5 bg-white shadow-sm hover:shadow-md transition">
    {children}
  </div>
);

const Loading = () => (
  <div className="py-20 md:text-center text-left text-sm text-black/80">Memuat data…</div>
);


/* ================= SERVICES GRID ================= */
const ServicesGrid = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const SCHOOL_ID = getSchoolId();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/layanan?schoolId=${SCHOOL_ID}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Gagal memuat layanan");
        const json = await res.json();
        if (json.success) {
          setServices(json.data || []);
        } else {
          setError(json.message || "Gagal memuat data");
        }
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan koneksi");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [SCHOOL_ID]);

  const internalServices = services.filter((s: any) => s.type === "internal");
  const publicServices = services.filter((s: any) => s.type === "publik");

  const renderCardContent = (s: any) => (
    <div className="p-8 md:p-10 flex flex-col h-full relative z-[2]">
      {/* Icon & Badge */}
      <div className="flex justify-between items-start mb-8">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-blue-600 text-white transition-all duration-300 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
        </div>
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold px-4 py-1.5 bg-gray-100/50 rounded-full text-gray-500 backdrop-blur-sm">
          {s.type}
        </span>
      </div>

      {/* Text Content */}
      <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-700 transition-colors leading-tight">
        {s.title}
      </h3>
      <p className="text-gray-500 leading-relaxed mb-8 flex-grow line-clamp-3 text-sm md:text-base">
        {s.description}
      </p>

      {/* Metadata Footer */}
      <div className="pt-8 border-t border-gray-100/80 space-y-4">
        <div className="flex items-center group/item cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center mr-4 group-hover/item:bg-blue-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400 group-hover/item:text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          </div>
          <span className="text-sm font-semibold text-gray-700">{s.noTelephone || "Tidak tersedia"}</span>
        </div>

        <div className="flex items-center group/item cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center mr-4 group-hover/item:bg-blue-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400 group-hover/item:text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          </div>
          <span className="text-sm font-semibold text-gray-700 truncate">{s.email || "Tidak tersedia"}</span>
        </div>
      </div>
    </div>
  );

  if (loading) return <Loading />;
  if (error) return (
    <div className="max-w-md mx-auto text-center py-24 px-6">
      <div className="bg-red-50 text-red-600 p-6 rounded-3xl border border-red-100">
        <p className="font-bold mb-2">Terjadi Gangguan</p>
        <p className="text-sm opacity-80 mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-red-600 text-white rounded-full text-sm font-bold hover:bg-red-700 transition">
          Muat Ulang Halaman
        </button>
      </div>
    </div>
  );

  return (
    <section id="layanan-section" className="py-24 bg-[#F8FAFC] relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-200 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-100 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-[2]">
        {/* SECTION: INTERNAL */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-2">Layanan Internal</h2>
            <div className="h-1.5 w-12 bg-blue-600 rounded-full" />
          </div>
          <p className="text-gray-500 max-w-sm text-sm">Akses layanan khusus civitas akademik dan staf sekolah.</p>
        </div>

        {internalServices.length === 0 ? (
          <div className="bg-white/50 border border-dashed border-gray-300 rounded-[2rem] py-16 text-center text-gray-400 mb-20">
            Belum ada data layanan internal.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            {internalServices.map((s) => (
              <Card key={s.id}>{renderCardContent(s)}</Card>
            ))}
          </div>
        )}

        {/* SECTION: PUBLIK */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-2">Layanan Publik</h2>
            <div className="h-1.5 w-12 bg-purple-600 rounded-full" />
          </div>
          <p className="text-gray-500 max-w-sm text-sm">Informasi dan layanan yang dapat diakses oleh masyarakat umum.</p>
        </div>

        {publicServices.length === 0 ? (
          <div className="bg-white/50 border border-dashed border-gray-300 rounded-[2rem] py-16 text-center text-gray-400">
            Belum ada data layanan publik.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publicServices.map((s) => (
              <Card key={s.id}>{renderCardContent(s)}</Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

/* ================= PAGE ================= */
export default function LayananPage() {
  const theme = SMAN25_CONFIG.theme;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavbarComp theme={theme} />
      
      <HeroComp titleProps="Portal Layanan" id="#layanan" />

      <main className="flex-1 relative z-[1]" id="layanan">
        <ServicesGrid />
      </main>
      
      <FooterComp />
    </div>
  );
}
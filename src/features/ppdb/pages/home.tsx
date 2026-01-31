import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Loader, Calendar, Mail, Phone, FileText, AlertCircle } from "lucide-react";
import NavbarComp from "@/features/_global/components/navbar";
import { getSchoolId } from "@/features/_global/hooks/getSchoolId";
import { HeroComp } from "@/features/_global/components/hero";

// ──────────────────────────────────────────────────────────────
// Konstanta
// ──────────────────────────────────────────────────────────────

const BASE_URL = "https://be-school.kiraproject.id/ppdb";
const SCHOOL_ID = getSchoolId(); // Ganti dengan ID sekolah yang sesuai (dari auth/context)

// ──────────────────────────────────────────────────────────────
// Utilities
// ──────────────────────────────────────────────────────────────

const cx = (...classes: any[]) => classes.filter(Boolean).join(" ");

// ──────────────────────────────────────────────────────────────
// Komponen UI Shared
// ──────────────────────────────────────────────────────────────

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={cx("rounded-2xl border border-zinc-700/50 bg-zinc-900/40 backdrop-blur-sm p-6", className)}>
    {children}
  </div>
);

const InfoItem = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | number | null }) => (
  <div className="flex items-start gap-4">
    <div className="p-3 rounded-lg bg-zinc-800/50">
      <Icon className="h-6 w-6 text-blue-400" />
    </div>
    <div>
      <p className="text-sm text-zinc-400">{label}</p>
      <p className="text-lg font-medium text-white mt-1">
        {value ?? "—"}
      </p>
    </div>
  </div>
);

// ──────────────────────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────────────────────

export default function PPDBPage() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPPDBConfig = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}?schoolId=${SCHOOL_ID}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Jika ada autentikasi: Authorization: `Bearer ${token}`
          },
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${await res.text()}`);
        }

        const json = await res.json();

        if (json.success && json.data && json.data.length > 0) {
          setConfig(json.data[0]); // ambil yang terbaru / pertama
        } else {
          setConfig(null);
        }
      } catch (err: any) {
        setError(err.message || "Gagal memuat informasi PPDB");
        setConfig(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPPDBConfig();
  }, []);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <Loader className="h-12 w-12 animate-spin text-blue-500" />
          <p className="text-zinc-400">Memuat informasi PPDB...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <NavbarComp />
      {/* Hero */}
      <HeroComp titleProps={`PPDB Tahun ${new Date().getFullYear() || '2026'}`} id="#ppdb" />

      {/* Main Content */}
      <section id="ppdb" className="py-16">
        <div className="max-w-7xl mx-auto md:px-0 px-4">
          {error ? (
            <Card className="text-center py-12">
              <AlertCircle className="h-16 w-16 mx-auto text-red-500 mb-4" />
              <h2 className="text-2xl font-bold text-red-400 mb-3">Terjadi Kesalahan</h2>
              <p className="text-zinc-400">{error}</p>
            </Card>
          ) : !config ? (
            <Card className="text-center py-16">
              <FileText className="h-20 w-20 mx-auto text-zinc-600 mb-6" />
              <h2 className="text-3xl font-bold mb-4">Belum Ada Konfigurasi PPDB</h2>
              <p className="text-zinc-400 text-lg max-w-xl mx-auto">
                Informasi PPDB untuk tahun ajaran ini belum dikonfigurasi oleh pihak sekolah.
                Silakan hubungi admin sekolah untuk informasi lebih lanjut.
              </p>
            </Card>
          ) : (
            <>
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  PPDB Tahun {config.year}
                </h1>
                <p className="text-xl text-zinc-400">
                  {config.startDate && config.endDate
                    ? `${formatDate(config.startDate)} – ${formatDate(config.endDate)}`
                    : "Periode belum ditentukan"}
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <InfoItem
                    icon={Calendar}
                    label="Periode Pendaftaran"
                    value={
                      config.startDate && config.endDate
                        ? `${formatDate(config.startDate)} s/d ${formatDate(config.endDate)}`
                        : "Belum ditentukan"
                    }
                  />
                </Card>

                <Card>
                  <InfoItem
                    icon={FileText}
                    label="Kuota Siswa"
                    value={config.quota ? `${config.quota} siswa` : "Tidak dibatasi"}
                  />
                </Card>

                <Card>
                  <InfoItem
                    icon={Mail}
                    label="Email Kontak"
                    value={config.contactEmail}
                  />
                </Card>

                <Card className="md:col-span-2 lg:col-span-3">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                    <FileText className="h-6 w-6 text-blue-400" />
                    Deskripsi PPDB
                  </h3>
                  <p className="text-zinc-300 whitespace-pre-line leading-relaxed">
                    {config.description || "Belum ada deskripsi"}
                  </p>
                </Card>

                <Card className="md:col-span-2 lg:col-span-3">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                    <FileText className="h-6 w-6 text-blue-400" />
                    Persyaratan Pendaftaran
                  </h3>
                  {config.requirements?.length > 0 ? (
                    <ul className="list-disc list-inside space-y-3 text-zinc-300">
                      {config.requirements.map((req: string, i: number) => (
                        <li key={i} className="pl-2">
                          {req}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-zinc-500 italic">Belum ada persyaratan yang ditambahkan</p>
                  )}
                </Card>

                <Card className="md:col-span-2 lg:col-span-3">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                    <Phone className="h-6 w-6 text-blue-400" />
                    Kontak Resmi
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <InfoItem icon={Mail} label="Email" value={config.contactEmail} />
                    <InfoItem icon={Phone} label="Telepon / WA" value={config.contactPhone} />
                  </div>
                </Card>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
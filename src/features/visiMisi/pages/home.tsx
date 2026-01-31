import { SMAN25_CONFIG } from "@/core/theme";
import { FooterComp } from "@/features/_global/components/footer";
import { HeroComp } from "@/features/_global/components/hero";
import NavbarComp from "@/features/_global/components/navbar";
import { getSchoolId } from "@/features/_global/hooks/getSchoolId";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";

// Asumsi schoolId dari config atau hardcode (ganti dengan nilai real dari DB/config/hook)
const SCHOOL_ID = getSchoolId(); // <-- GANTI DENGAN SCHOOL ID REAL ANDA

const BASE_URL = "https://be-school.kiraproject.id/visi-misi";

/*********
 * BADGE
 *********/
const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="flex items-center px-3 py-1.5 text-xs rounded-full bg-blue-100 text-blue-800 border border-blue-200 font-medium shadow-sm">
    {children}
  </span>
);

/****************
 * SECTION WRAPPER
 ****************/
const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <section className="py-12 md:py-16 bg-white">
    <div className="max-w-7xl mx-auto px-4 md:px-6">
      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="mt-3 text-lg text-gray-600">{subtitle}</p>}
      </div>
      {children}
    </div>
  </section>
);

/****************
 * VisiMisi COMPONENT (dengan fetch biasa)
 ****************/
const VisiMisi = ({ schoolName }: { schoolName: string }) => {
  const [data, setData] = useState<{
    vision: string;
    missions: string[];
    pillars: string[];
    kpis: { target: number; indicator: string }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVisiMisi = async () => {
      if (!SCHOOL_ID) {
        setError("School ID tidak ditemukan");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}?schoolId=${SCHOOL_ID}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();
        const records = json.success ? json.data : json; // Sesuaikan jika response wrapped

        let record;
        if (Array.isArray(records) && records.length > 0) {
          record = records[0];
        } else if (typeof records === "object" && records !== null) {
          record = records;
        }

        if (record) {
          setData({
            vision: record.vision || record.visi || "",
            missions: Array.isArray(record.missions) ? record.missions : [],
            pillars: Array.isArray(record.pillars) ? record.pillars : [],
            kpis: Array.isArray(record.kpis)
              ? record.kpis.map((item: any) => ({
                  target: Number(item.target) || 0,
                  indicator: String(item.indicator || item.name || ""),
                }))
              : [],
          });
        } else {
          setData(null);
        }
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError("Gagal memuat data visi misi dari server");
      } finally {
        setLoading(false);
      }
    };

    fetchVisiMisi();
  }, []);

  const visi = data?.vision || "";
  const misi = data?.missions || [];
  const pillars = data?.pillars || [];
  const kpis = data?.kpis || [];

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500">Memuat visi & misi...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">{error}. Menampilkan data default.</div>
    );
  }

  return (
    <div id="visi-misi" className="relative bg-gray-50 pb-8">
      {/* Visi */}
      <Section title="Visi" subtitle={`Arah besar pengembangan ${schoolName}`}>
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`text-2xl border border-gray-400 md:text-xl font-normal ${visi ? 'text-black' : 'text-gray-400'} rounded-3xl p-10 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xlleading-relaxed`}
        >
          {visi || "Data visi belum tersedia"}
        </motion.blockquote>
      </Section>

      {/* Misi */}
      {misi.length > 0 ? (
        <Section title="Misi" subtitle="Langkah strategis untuk mewujudkan visi">
          <div className="grid md:grid-cols-2 gap-6">
            {misi.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-2xl  p-7 bg-white border border-gray-400 shadow-md hover:shadow-xl transition-shadow flex items-start gap-5"
              >
                <Badge>M{i + 1}</Badge>
                <p className="text-base leading-relaxed text-gray-800">{item}</p>
              </motion.div>
            ))}
          </div>
        </Section>
      ): (
        <Section title="Misi" subtitle={`Arah besar pengembangan ${schoolName}`}>
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-xl font-normal text-gray-400 rounded-3xl p-10 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xlleading-relaxed"
          >
            {"Data misi belum tersedia"}
          </motion.blockquote>
        </Section>
      )}

      {/* Pilar */}
      {pillars.length > 0 ? (
        <Section title="Pilar" subtitle="Langkah strategis untuk mewujudkan visi">
          <div className="grid md:grid-cols-2 gap-6">
            {pillars.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-2xl p-7 bg-white border border-gray-400 shadow-md hover:shadow-xl transition-shadow flex items-start gap-5"
              >
                <Badge>M{i + 1}</Badge>
                <p className="text-base leading-relaxed text-gray-800">{item}</p>
              </motion.div>
            ))}
          </div>
        </Section>
      ): (
        <Section title="Pilar" subtitle={`Arah besar pengembangan ${schoolName}`}>
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-xl font-normal text-gray-400 rounded-3xl p-10 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xlleading-relaxed"
          >
            {"Data pilar belum tersedia"}
          </motion.blockquote>
        </Section>
      )}

      {/* KPI */}
      {kpis.length > 0 ? (
        <Section title="KPI" subtitle="Indikator Kinerja Utama & Target Pencapaian">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kpis.map((kpi, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-2xl p-6 bg-white border border-gray-400 shadow-md hover:shadow-xl transition-all flex flex-col gap-4 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <Badge>KPI {i + 1}</Badge>
                  <span className="text-xl font-bold text-blue-700">
                    {kpi.target}%
                  </span>
                </div>

                <p className="text-base leading-relaxed text-gray-800 font-medium">
                  {kpi.indicator}
                </p>

                {/* Optional: progress bar sederhana */}
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all"
                    style={{ width: `${Math.min(kpi.target, 100)}%` }}
                  ></div>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>
      ) : (
        <Section title="KPI" subtitle={`Arah besar pengembangan ${schoolName}`}>
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-xl font-normal text-gray-400 rounded-3xl p-10 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl leading-relaxed"
          >
            {"Data KPI belum tersedia"}
          </motion.blockquote>
        </Section>
      )}
    </div>
  );
};

/********
 * PAGE UTAMA
 ********/
const VisiMisiPage = () => {
  const schoolInfo = SMAN25_CONFIG;
  const schoolName = schoolInfo.fullName;

  // Untuk demo fallback di hero, kita bisa fetch lagi atau pakai state global jika ada
  // Di sini pakai fetch sederhana lagi (atau lift state ke atas jika mau optimize)
  const [heroVisi, setHeroVisi] = useState<string>("");

  useEffect(() => {
    fetch(`${BASE_URL}?schoolId=${SCHOOL_ID}`)
      .then((res) => res.json())
      .then((json) => {
        const records = json.success ? json.data : json;
        const record = Array.isArray(records) && records.length > 0 ? records[0] : records;
        setHeroVisi(record?.vision || record?.visi || "");
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavbarComp theme={schoolInfo.theme} />

      {/* Hero dengan visi dinamis */}
      <HeroComp titleProps="Visi & Misi Sekolah" id="#visi" />

      {/* Content */}
      <main className="flex-1 relative z-[1]" id="visi">
        <VisiMisi schoolName={schoolName} />
      </main>

      <FooterComp />
    </div>
  );
};

export default VisiMisiPage;
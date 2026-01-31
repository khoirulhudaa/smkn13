import { SMAN25_CONFIG } from "@/core/theme";
import { FooterComp } from "@/features/_global/components/footer";
import { HeroComp } from "@/features/_global/components/hero";
import NavbarComp from "@/features/_global/components/navbar";
import { getSchoolId } from "@/features/_global/hooks/getSchoolId";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

// Asumsi schoolId dari config atau hardcode (ganti dengan nilai real dari DB/config/hook)
const SCHOOL_ID = getSchoolId(); // <-- GANTI DENGAN SCHOOL ID REAL ANDA

const BASE_URL = "https://be-school.kiraproject.id/tata-tertib";

/*********
 * BADGE
 *********/
const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="flex items-center py-1.5 text-xs text-black font-medium shadow-sm">
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
        <h2 className="text-3xl italic md:text-4xl font-black text-gray-900">{title}</h2>
        {subtitle && <p className="mt-3 text-lg text-gray-600">{subtitle}</p>}
      </div>
      {children}
    </div>
  </section>
);

/****************
 * AturanTataTertib COMPONENT (dengan fetch dari API /school-rules)
 ****************/
const AturanTataTertib = ({ schoolName }: { schoolName: string }) => {
  const [rules, setRules] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAturan = async () => {
      if (!SCHOOL_ID) {
        setError("School ID tidak ditemukan");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}?schoolId=${SCHOOL_ID}`, {
          method: "GET",
          // headers: { "Content-Type": "application/json" },/
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();
        const records = json.success ? json.data : json;

        let record;
        if (Array.isArray(records) && records.length > 0) {
          record = records[0];
        } else if (typeof records === "object" && records !== null) {
          record = records;
        }

        if (record && Array.isArray(record.rules)) {
          setRules(record.rules);
        } else {
          setRules([]);
        }
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError("Gagal memuat data aturan & tata tertib dari server");
      } finally {
        setLoading(false);
      }
    };

    fetchAturan();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500">Memuat aturan & tata tertib...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">{error}. Menampilkan data default.</div>
    );
  }

  return (
    <div id="aturan-tata-tertib" className="relative bg-gray-50 pb-16">
      {/* Aturan & Tata Tertib */}
      {rules.length > 0 ? (
        <Section title="Tata Tertib Sekolah" subtitle={`Pedoman warga ${schoolName}`}>
          <div className="grid md:grid-cols-1 gap-6 text-justify">
            {rules.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-2xl p-4 px-0 bg-white transition-shadow flex items-start gap-5"
              >
                <Badge>{i + 1}.</Badge>
                <p className="text-sm leading-relaxed text-gray-800">{item}</p>
              </motion.div>
            ))}
          </div>
        </Section>
      ) : (
        <Section title="Tata Tertib Sekolah" subtitle={`Pedoman warga ${schoolName}`}>
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-xl font-normal text-gray-400 rounded-3xl p-10 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl leading-relaxed"
          >
            {"Data aturan & tata tertib belum tersedia"}
          </motion.blockquote>
        </Section>
      )}
    </div>
  );
};

/********
 * PAGE UTAMA
 ********/
const AturanTataTertibPage = () => {
  const schoolInfo = SMAN25_CONFIG;
  const schoolName = schoolInfo.fullName;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavbarComp theme={schoolInfo.theme} />

      {/* Hero dengan intro dinamis */}
      <HeroComp titleProps="Aturan & Tata Tertib" id="#aturan" />

      {/* Content */}
      <main className="flex-1 relative z-[1] w-full" id="aturan">
        <AturanTataTertib schoolName={schoolName} />
      </main>

      <FooterComp />
    </div>
  );
};

export default AturanTataTertibPage;
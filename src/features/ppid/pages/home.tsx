import { SMAN25_CONFIG } from "@/core/theme";
import { FooterComp } from "@/features/_global/components/footer";
import { HeroComp } from "@/features/_global/components/hero";
import NavbarComp from "@/features/_global/components/navbar";
import { getSchoolId } from "@/features/_global/hooks/getSchoolId";
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from "framer-motion";
import { File } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const IFilter = () => "🔎";
const ILink = () => "🔗"

/****************************
 * UTILS
 ****************************/
const Section = ({ id, title, icon, children }: { id: string; title: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <section id={id} className="scroll-mt-32 py-16 border-b border-gray-900/30 last:border-none">
    <div className="max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="flex items-center gap-4 mb-10"
      >
        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-200">
          {icon}
        </div>
        <h2 className="text-3xl text-gray-900 font-black tracking-tight uppercase">
          {title}
        </h2>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-[2.5rem] bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-900/30 overflow-hidden"
      >
        <div className="p-2 sm:p-4">
          {children}
        </div>
      </motion.div>
    </div>
  </section>
);


/****************************
 * API CONFIG PPID
 ****************************/
const PPID_API_BASE = "https://be-school.kiraproject.id/ppid";
const SCHOOL_ID = getSchoolId();

const fetchPPIDDocuments = async () => {
  const response = await fetch(`${PPID_API_BASE}?schoolId=${SCHOOL_ID}`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  const json = await response.json();

  if (!json.success) throw new Error(json.message || "Response tidak valid");

  return json.data || [];
};

/****************************
 * ADAPTER DATA → format DokumenList
 ****************************/
const mapToDokumenFormat = (items: any[]) => {
  return items.map(item => ({
    id: item.id,
    judul: item.title || "—",
    categoryName: item.category || "lainnya",
    tahun: item.publishedDate
      ? new Date(item.publishedDate).getFullYear()
      : (item.createdAt ? new Date(item.createdAt).getFullYear() : new Date().getFullYear()),
    tipe: "Dokumen",
    url: item.documentUrl || "",
  }));
};

/****************************
 * DOKUMEN LIST
 ****************************/
const DokumenList = ({ kategoriFilter }: { kategoriFilter: string }) => {
  const [q, setQ] = useState("");
  const [tahun, setTahun] = useState("Semua");

  const { data: rawData = [], isPending: loading } = useQuery({
    queryKey: ['ppid-documents', SCHOOL_ID],
    queryFn: fetchPPIDDocuments,
  });

  const documents = useMemo(() => mapToDokumenFormat(rawData), [rawData]);

  const { tahunOpts, filtered } = useMemo(() => {
    const years = Array.from(new Set(documents.map((d: any) => d.tahun))).sort((a: any, b: any) => b - a);
    const filteredDocs = documents.filter((d: any) =>
      d.categoryName === kategoriFilter &&
      (tahun === "Semua" || String(d.tahun) === tahun) &&
      (q === "" || d.judul.toLowerCase().includes(q.toLowerCase()))
    );
    return {
      tahunOpts: ["Semua", ...years.map(String)],
      filtered: filteredDocs,
    };
  }, [documents, q, kategoriFilter, tahun]);

  if (loading) return <div className="p-10 text-center text-gray-600 animate-pulse font-medium">Mengambil arsip dokumen...</div>;

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 px-4 pt-4">
        <div className="flex-1 relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-600 transition-colors">
            <IFilter />
          </div>
          <input 
            value={q} 
            onChange={e => setQ(e.target.value)} 
            placeholder="Cari dokumen..." 
            className="w-full pl-12 pr-4 py-3.5 bg-gray-200 placeholder:text-black/60 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm font-medium"
          />
        </div>
        <div className="md:w-48">
          <select 
            value={tahun} 
            onChange={e => setTahun(e.target.value)} 
            className="w-full px-4 py-3.5 bg-gray-200 placeholder:text-black/60 border-none rounded-2xl outline-none text-sm font-bold text-gray-700 cursor-pointer"
          >
            {tahunOpts.map(t => <option key={t} value={t}>Tahun {t}</option>)}
          </select>
        </div>
      </div>

      {/* Modern Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-gray-50">
              <th className="px-8 py-5 text-[11px] uppercase tracking-[0.2em] font-semibold text-gray-600">Arsip Judul</th>
              <th className="px-8 py-5 text-[11px] uppercase tracking-[0.2em] font-semibold text-gray-600">Tahun</th>
              <th className="px-8 py-5 text-[11px] uppercase tracking-[0.2em] font-semibold text-gray-600 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            <AnimatePresence>
              {filtered.map((d: any, i: number) => (
                <motion.tr 
                  key={d.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-blue-50/30 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-gray-900 font-bold text-base leading-tight group-hover:text-blue-700 transition-colors">{d.judul}</span>
                      <span className="text-xs text-gray-600 mt-1 font-medium">{d.tipe}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-black text-gray-500">{d.tahun}</td>
                  <td className="px-8 py-6 text-right">
                    {d.url ? (
                      <a 
                        href={d.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95"
                      >
                        <ILink /> Unduh
                      </a>
                    ) : (
                      <span className="text-xs font-bold text-gray-300 italic uppercase">No File</span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-gray-600 font-semibold uppercase tracking-tighter flex justify-center mx-auto items-center gap-4 text-xl">
              <File className="relative top-[-2.5px]" />
              Dokumen Tidak Ditemukan
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

/****************************
 * MAIN PPID PAGE – tanpa Profil PPID
 ****************************/
let theme: any = {};

export function PPIDMain() {
  const school = SMAN25_CONFIG;
  theme = school.theme;

  useEffect(() => {
    document.documentElement.style.setProperty("--brand-primary", theme.primary);
    document.documentElement.style.setProperty("--brand-accent", theme.gold);
    document.documentElement.style.setProperty("--brand-bg", theme.bg);
    document.documentElement.style.setProperty("--brand-surface", theme.surface);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      <NavbarComp theme={theme} />

      <HeroComp titleProps="Transparansi PPID" id="#ppid" />

       {/* DOCUMENT SECTIONS */}
      <div className="bg-white" id="ppid">
        <Section id="berkala" title="Informasi Berkala" icon={<File size={20}/>}>
          <DokumenList kategoriFilter="berkala" />
        </Section>

        <Section id="setiap-saat" title="Informasi Setiap Saat" icon={<File size={20}/>}>
          <DokumenList kategoriFilter="setiap-saat" />
        </Section>

        <Section id="serta-merta" title="Informasi Serta Merta" icon={<File size={20}/>}>
          <DokumenList kategoriFilter="serta-merta" />
        </Section>

        <Section id="keuangan" title="Laporan Keuangan" icon={<File size={20}/>}>
          <DokumenList kategoriFilter="keuangan" />
        </Section>

        <Section id="kegiatan" title="Dokumentasi Kegiatan" icon={<File size={20}/>}>
          <DokumenList kategoriFilter="kegiatan" />
        </Section>

        <Section id="profil" title="Profil Sekolah" icon={<File size={20}/>}>
          <DokumenList kategoriFilter="profil" />
        </Section>

        <Section id="ppdb" title="Informasi PPDB" icon={<File size={20}/>}>
          <DokumenList kategoriFilter="ppdb" />
        </Section>
      </div>

      <FooterComp />
    </div>
  );
}
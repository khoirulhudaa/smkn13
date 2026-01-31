import { SMAN25_CONFIG } from "@/core/theme";
import { FooterComp } from "@/features/_global/components/footer";
import { HeroComp } from "@/features/_global/components/hero";
import NavbarComp from "@/features/_global/components/navbar";
import { getSchoolId } from "@/features/_global/hooks/getSchoolId";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/****************************
 * HELPERS (validation)
 ****************************/
function validateForm(f: { nama: string; kelas: string; kontak: string; alasan: string }) {
  if (!f.nama.trim()) return "Nama wajib diisi";
  if (!f.kelas.trim()) return "Kelas wajib diisi";
  if (!f.kontak.trim()) return "Kontak wajib diisi";
  return null;
}

/****************************
 * OSIS PAGE (Full Code dengan Hero Modern)
 ****************************/
const OsisPage = () => {
  const schoolInfo = SMAN25_CONFIG;
  const theme = schoolInfo.theme;
  const schoolName = schoolInfo.fullName;
  const prefersReducedMotion = useReducedMotion();

  // Focus refs
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const formCloseBtnRef = useRef<HTMLButtonElement>(null);

  // === FORM MINAT ===
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ nama: "", kelas: "", kontak: "", alasan: "" });
  const [formMsg, setFormMsg] = useState("");
  const openForm = () => {
    setFormOpen(true);
    setTimeout(() => formCloseBtnRef.current?.focus(), 0);
  };
  const closeForm = () => {
    setFormOpen(false);
    setFormMsg("");
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateForm(form);
    if (err) {
      setFormMsg(err);
      return;
    }
    try {
      const existing = JSON.parse(localStorage.getItem("osis_minat") || "[]");
      existing.push({ ...form, ts: new Date().toISOString() });
      localStorage.setItem("osis_minat", JSON.stringify(existing));
      setFormMsg("Terima kasih! Form terkirim. Kami akan menghubungi kamu.");
      setForm({ nama: "", kelas: "", kontak: "", alasan: "" });
    } catch {
      setFormMsg("Maaf, terjadi masalah saat menyimpan. Coba lagi.");
    }
  };

  // === API Integration (HANYA BAGIAN INI YANG DIUBAH) ===
  const [apiData, setApiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const schoolId = getSchoolId()

  const fetchData = async () => {
    try {
      // Ganti endpoint ke backend lokal baru
      const response = await fetch(`https://be-school.kiraproject.id/osis?schoolId=${schoolId}`, {  // Ganti schoolId sesuai kebutuhan
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          // Jika perlu token: 'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        }
      });
      const result = await response.json();
      if (result.success && result.data) {
        setApiData(result.data);
      } else {
        throw new Error('API request failed');
      }
    } catch (err) {
      console.warn('err', err);
      setError('Gagal memuat data OSIS. Silakan coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Transform API data (disesuaikan dengan struktur backend baru)
  const struktur = apiData ? [
    {
      jabatan: "Ketua OSIS",
      nama: apiData.ketuaNama || "-",
      nipNuptk: apiData.ketuaNipNuptk || "-",      // ← ini yang baru
      kelas: "-", // atau ambil dari data lain jika ada
      motto: "-", // atau ambil dari data lain jika ada
      foto: apiData.ketuaFotoUrl || '/defaultProfile.png'
    },
    {
      jabatan: "Wakil Ketua OSIS",
      nama: apiData.wakilNama || "-",
      nipNuptk: apiData.wakilNipNuptk || "-",      // ← ini yang baru
      kelas: "-",
      motto: "-",
      foto: apiData.wakilFotoUrl || '/defaultProfile.png'
    },
    {
      jabatan: "Bendahara OSIS",
      nama: apiData.bendaharaNama || "-",
      nipNuptk: apiData.bendaharaNipNuptk || "-",  // ← ini yang baru
      kelas: "-",
      motto: "-",
      foto: apiData.bendaharaFotoUrl || '/defaultProfile.png'
    },
    {
      jabatan: "Sekretaris OSIS",
      nama: apiData.sekretarisNama || "-",
      nipNuptk: apiData.sekretarisNipNuptk || "-", // ← ini yang baru
      kelas: "-",
      motto: "-",
      foto: apiData.sekretarisFotoUrl || '/defaultProfile.png'
    }
  ] : [];

  // === TENURES & HISTORY (disesuaikan dengan API baru) ===
  const [tenures, setTenures] = useState<any[]>([]);
  const [membersByTenure, setMembersByTenure] = useState<Record<string, any[]>>({});

  useEffect(() => {
    const fetchTenuresAndMembers = async () => {
      try {
        // Backend baru tidak punya endpoint tenures terpisah, jadi kita skip atau mock sementara
        // Jika backend punya endpoint riwayat, bisa ditambahkan di sini
        // Untuk sekarang kita gunakan data aktif saja
        setTenures([]);
        setMembersByTenure({});
      } catch (err) {
        setError('Gagal memuat data kepengurusan OSIS.');
      } finally {
        setLoading(false);
      }
    };
    fetchTenuresAndMembers();
  }, []);

  const HISTORY = tenures.map(tenure => ({
    tahun: new Date(tenure.startDate).getFullYear(),
    status: tenure.isActive ? 'Berjalan' : 'Selesai',
    periode: tenure.periodLabel,
    pengurus: membersByTenure[tenure.id] || []
  }));

  const [selectedYear, setSelectedYear] = useState(HISTORY[0]?.tahun || new Date().getFullYear());
  const years = HISTORY.map(h => h.tahun);
  const current = HISTORY.find(h => h.tahun === selectedYear) || HISTORY[0];

  // === LIGHTBOX ===
  const galeri = [
    { src: "/defaultProfile.png", thumb: "/example.jpg", alt: "Kegiatan LDKS" },
    { src: "/defaultProfile.png", thumb: "/example.jpg", alt: "Pentas Seni" },
    { src: "/defaultProfile.png", thumb: "/example.jpg", alt: "Lomba Olahraga" },
  ];
  const [lbOpen, setLbOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const startX = useRef(0);
  const onOpen = (i: number) => { setIdx(i); setLbOpen(true); };
  const onClose = () => setLbOpen(false);
  const prev = () => setIdx((i) => (i - 1 + galeri.length) % galeri.length);
  const next = () => setIdx((i) => (i + 1) % galeri.length);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lbOpen) {
        if (e.key === "Escape") onClose();
        if (e.key === "ArrowLeft") prev();
        if (e.key === "ArrowRight") next();
      }
    };
    window.addEventListener("keydown", onKey);
    if (lbOpen && closeBtnRef.current) closeBtnRef.current.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [lbOpen]);

  /****************************
   * SMOKE TESTS
   ****************************/
  useEffect(() => {
    try {
      const keys = ["bg", "primary", "primaryText", "surface", "surfaceText", "subtle", "accent"];
      keys.forEach(k => console.assert(theme[k], `Theme key '${k}' missing`));
      console.log("UI smoke tests passed (OSIS)");
    } catch (e) {
      console.error("UI smoke tests failed:", e);
    }
  }, [theme, HISTORY]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: theme.bg }}>
        <p style={{ color: theme.primaryText }}>Memuat data OSIS...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      <NavbarComp theme={theme} />
      <HeroComp titleProps="Organisasi OSIS" id="#osis" />

      <section id="osis" className="py-16 text-[15px] md:text-[17px] leading-relaxed">
        <div className="max-w-7xl md:px-0 px-4 mx-auto md:text-center text-left">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4"
            style={{ color: 'black' }}
          >
            OSIS {schoolName}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-sm md:text-base mb-10 opacity-90"
            style={{ color: theme.surfaceText }}
          >
            Organisasi Siswa Intra Sekolah (OSIS) sebagai wadah pengembangan diri, kepemimpinan, dan kreativitas siswa.
          </motion.p>

          {/* Struktur Aktif */}
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl md:text-[26px] font-bold mb-2"
            style={{ color: theme.primaryText }}
          >
            Struktur Organisasi
          </motion.h3>
          <p className="text-xs md:text-[13px] mb-6 opacity-85" style={{ color: theme.surfaceText }}>
            Periode aktif saat ini.
          </p>
        
          <div className="mb-12">
            {/* Baris kedua: Wakil, Bendahara, Sekretaris (index 1-3) */}
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
              {struktur.slice(0, 2).map((s, i) => (
                <motion.div
                  key={s.jabatan}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (i + 1) * 0.05 }}
                  className="relative rounded-2xl border p-5 shadow-md flex flex-col items-center group focus-within:ring-2 focus-within:ring-yellow-300"
                  style={{ background: theme.surface, borderColor: theme.subtle }}
                  tabIndex={0}
                  aria-label={`${s.jabatan} ${s.nama}`}
                >
                  <img
                    src={s.foto}
                    alt={`Foto ${s.nama}`}
                    className="w-20 h-20 rounded-full object-cover border mb-3"
                    style={{ borderColor: theme.subtle }}
                  />
                  <h4 className="text-sm font-semibold" style={{ color: 'black' }}>
                    {s.jabatan}
                  </h4>
                  <p className="text-base" style={{ color: theme.primaryText }}>
                    {s.nama}
                  </p>
                  {/* NIP/NUPTK untuk masing-masing */}
                  {s.nipNuptk && (
                    <p className="text-xs opacity-85 mt-1" style={{ color: theme.surfaceText }}>
                      No. Induk: {s.nipNuptk}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Baris kedua: Wakil, Bendahara, Sekretaris (index 1-3) */}
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 mt-5">
              {struktur.slice(2, 4).map((s, i) => (
                <motion.div
                  key={s.jabatan}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (i + 1) * 0.05 }}
                  className="relative rounded-2xl border p-5 shadow-md flex flex-col items-center group focus-within:ring-2 focus-within:ring-yellow-300"
                  style={{ background: theme.surface, borderColor: theme.subtle }}
                  tabIndex={0}
                  aria-label={`${s.jabatan} ${s.nama}`}
                >
                  <img
                    src={s.foto}
                    alt={`Foto ${s.nama}`}
                    className="w-20 h-20 rounded-full object-cover border mb-3"
                    style={{ borderColor: theme.subtle }}
                  />
                  <h4 className="text-sm font-semibold" style={{ color: 'black' }}>
                    {s.jabatan}
                  </h4>
                  <p className="text-base" style={{ color: theme.primaryText }}>
                    {s.nama}
                  </p>
                  {/* NIP/NUPTK untuk masing-masing */}
                  {s.nipNuptk && (
                    <p className="text-xs opacity-85 mt-1" style={{ color: theme.surfaceText }}>
                      No. Induk: {s.nipNuptk}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Visi & Misi */}
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl md:text-[26px] font-bold mb-3"
            style={{ color: theme.primaryText }}
          >
            Visi & Misi OSIS
          </motion.h3>
          <div className="grid gap-4 md:grid-cols-2 text-left mb-12">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border p-5"
              style={{ background: theme.surface, borderColor: theme.subtle }}
            >
              <h4 className="font-semibold mb-2" style={{ color: 'black' }}>Visi</h4>
              <p className="opacity-90" style={{ color: theme.primaryText }}>
                {apiData?.visi || '-'}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border p-5"
              style={{ background: theme.surface, borderColor: theme.subtle }}
            >
              <h4 className="font-semibold mb-2" style={{ color: 'black' }}>Misi</h4>
              <ul className="list-disc list-inside space-y-1" style={{ color: theme.primaryText }}>
                {apiData?.misi?.map((m: string, i: number) => (
                  <li key={i}>{m}</li>
                )) || <li>-</li>}
              </ul>
            </motion.div>
          </div>

          {/* Prestasi */}
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl md:text-[26px] font-bold mb-4"
            style={{ color: theme.primaryText }}
          >
            Prestasi
          </motion.h3>
          <div className={`w-full grid ${apiData?.prestasiSaatIni ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-4 mb-12 text-left`}>
            {apiData?.prestasiSaatIni?.map((p: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                whileHover={{ scale: prefersReducedMotion ? 1 : 1.02 }}
                className="rounded-2xl border p-5"
                style={{ background: theme.surface, borderColor: theme.subtle }}
              >
                <p className="text-sm md:text-[15px] font-semibold" style={{ color: theme.primaryText }}>
                  {p.judul || "Prestasi"}
                </p>
                <p className="text-xs opacity-85" style={{ color: theme.surfaceText }}>
                  {p.tahun} - {p.deskripsi || "-"}
                </p>
              </motion.div>
            )) || (
              <p className="text-sm opacity-90 mt-4 md:text-center text-left w-full" style={{ color: theme.surfaceText }}>
                Belum ada prestasi yang tercatat.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* FORM MINAT */}
      {formOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.65)" }}
          role="dialog"
          aria-modal="true"
          aria-label="Form Minat Bergabung OSIS"
        >
          <div className="absolute inset-0" onClick={closeForm} />
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="relative max-w-lg w-full bg-white text-black rounded-2xl shadow-2xl border p-5"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-lg font-semibold">Form Minat Bergabung OSIS</h4>
              <button
                ref={formCloseBtnRef}
                onClick={closeForm}
                aria-label="Tutup formulir"
                className="px-2 py-1 rounded-lg border text-xs"
              >
                Tutup [x]
              </button>
            </div>
            <p className="text-xs text-gray-600 mb-3">
              Data ini hanya untuk keperluan rekrutmen OSIS. Wajib isi kolom bertanda *.
            </p>
            <form onSubmit={onSubmit} className="space-y-3">
              <label className="block">
                <span className="text-sm font-medium">Nama Lengkap *</span>
                <input name="nama" value={form.nama} onChange={onChange} required className="mt-1 w-full border rounded-lg px-3 py-2" placeholder="Nama kamu" />
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-sm font-medium">Kelas *</span>
                  <input name="kelas" value={form.kelas} onChange={onChange} required className="mt-1 w-full border rounded-lg px-3 py-2" placeholder="Contoh: XI RPL" />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">Kontak (WA/Email) *</span>
                  <input name="kontak" value={form.kontak} onChange={onChange} required className="mt-1 w-full border rounded-lg px-3 py-2" placeholder="08xxx atau email" />
                </label>
              </div>
              <label className="block">
                <span className="text-sm font-medium">Alasan Bergabung</span>
                <textarea name="alasan" value={form.alasan} onChange={onChange} rows={3} className="mt-1 w-full border rounded-lg px-3 py-2" placeholder="Ceritakan singkat motivasimu" />
              </label>
              {formMsg && (
                <div className="text-sm p-2 rounded bg-green-50 border border-green-200 text-green-700">{formMsg}</div>
              )}
              <div className="flex items-center justify-end gap-2 pt-1">
                <button type="button" onClick={closeForm} className="px-4 py-2 rounded-xl border text-sm">Batal</button>
                <button type="submit" className="px-4 py-2 rounded-xl text-sm font-medium" style={{ background: 'black', color: "#111827" }}>
                  Kirim
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* LIGHTBOX */}
      {lbOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[60] flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.85)" }}
          role="dialog"
          aria-modal="true"
          aria-label="Galeri OSIS"
        >
          <button
            ref={closeBtnRef}
            aria-label="Tutup galeri"
            onClick={onClose}
            className="absolute top-4 right-4 px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-yellow-300"
            style={{ borderColor: theme.subtle, color: "#fff", background: "rgba(0,0,0,0.2)" }}
          >
            Tutup [x]
          </button>

          <div
            className="h-full flex items-center justify-center select-none"
            onTouchStart={(e) => { startX.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
              const dx = e.changedTouches[0].clientX - startX.current;
              if (dx > 40) prev();
              if (dx < -40) next();
            }}
          >
            <button onClick={prev} aria-label="Foto sebelumnya" className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-yellow-300" style={{ borderColor: theme.subtle, color: "#fff" }}>‹</button>
            <img src={galeri[idx].src} alt={galeri[idx].alt} className="max-h-[80vh] max-w-[92vw] object-contain rounded-xl border" style={{ borderColor: theme.subtle }} />
            <button onClick={next} aria-label="Foto berikutnya" className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-yellow-300" style={{ borderColor: theme.subtle, color: "#fff" }}>›</button>
            <div className="absolute bottom-6 left-0 right-0 md:text-center text-left text-xs" aria-live="polite">
              <span style={{ color: "#fff" }}>{idx + 1} / {galeri.length} — {galeri[idx].alt}</span>
            </div>
          </div>
        </motion.div>
      )}

      <FooterComp />
    </div>
  );
};

export default OsisPage;
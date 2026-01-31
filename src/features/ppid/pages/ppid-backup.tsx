import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useMemo, useRef, useState } from "react";

/************ MINI ICONS (emoji stubs) ************/
const Icon = ({ label, title }: { label: string; title?: string }) => (
  <span aria-hidden title={title || ""} className="inline-block select-none align-middle" style={{ width: 18, textAlign: "center" }}>{label}</span>
);
const IInfo = () => <Icon label="ℹ️"/>;
const IBook = () => <Icon label="📚"/>;
const IShield = () => <Icon label="🛡️"/>;
const IFile = () => <Icon label="📄"/>;
const IChart = () => <Icon label="📊"/>;
const IInbox = () => <Icon label="📥"/>;
const IPhone = () => <Icon label="📞"/>;
const IFilter = () => <Icon label="🔎"/>;
const IArrowDown = () => <Icon label="▾"/>;
const IArrowRight = () => <Icon label="▸"/>;
const ICheck = () => <Icon label="✅"/>;
const IClock = () => <Icon label="⏱️"/>;
const IAlert = () => <Icon label="⚠️"/>;
const ILink = () => <Icon label="🔗"/>;
const IUpload = () => <Icon label="🗂️"/>;
const IPrint = () => <Icon label="🖨️"/>;

/************ THEME ************/
const THEME = {
  brand: {
    primary: "#1F3B76",
    onPrimary: "#ffffff",
    accent: "#F2C94C",
    bg: "#0B1733",
    surface: "#102347",
    onSurface: "#ffffff",
    subtle: "#2C3F6B",
  },
};

/************ SAMPLE DATA ************/
const SAMPLE_DOKUMEN = [
  { id: "d1", kategori: "Informasi Berkala", judul: "RAPBS & Realisasi 2025 Semester 1", tahun: 2025, tipe: "PDF", url: "#", size: "1.2 MB" },
  { id: "d2", kategori: "Regulasi & SOP", judul: "SOP Layanan Permohonan Informasi", tahun: 2025, tipe: "PDF", url: "#", size: "380 KB" },
  { id: "d3", kategori: "Informasi Setiap Saat", judul: "Daftar Tenaga Pendidik & Kualifikasi", tahun: 2025, tipe: "XLSX", url: "#", size: "240 KB" },
  { id: "d4", kategori: "Informasi Serta-merta", judul: "Prosedur Tanggap Darurat Bencana", tahun: 2025, tipe: "PDF", url: "#", size: "520 KB" },
  { id: "d5", kategori: "Laporan Keuangan", judul: "Laporan Dana BOS Triwulan II 2025", tahun: 2025, tipe: "PDF", url: "#", size: "890 KB" },
  { id: "d6", kategori: "Laporan Kinerja", judul: "IKU & Capaian Kinerja 2024", tahun: 2024, tipe: "PDF", url: "#", size: "1.1 MB" },
  { id: "d7", kategori: "Regulasi & SOP", judul: "SK Penunjukan PPID Sekolah", tahun: 2024, tipe: "PDF", url: "#", size: "210 KB" },
];

const KATEGORI_OPTIONS = [
  "Semua",
  "Profil PPID",
  "Regulasi & SOP",
  "Informasi Berkala",
  "Informasi Setiap Saat",
  "Informasi Serta-merta",
  "Laporan Keuangan",
  "Laporan Kinerja",
];

/************ UTIL ************/
const cls = (...arr: (string | false | undefined)[]) => arr.filter(Boolean).join(" ");
const Section = ({ id, title, icon, children }:{ id: string; title: string; icon?: React.ReactNode; children: React.ReactNode }) => (
  <section id={id} className="scroll-mt-32 py-10">
    <div className="max-w-6xl mx-auto px-4">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2">
        {icon} <span>{title}</span>
      </h2>
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 text-white">
        {children}
      </div>
    </div>
  </section>
);

/************ SUBNAV (sticky) ************/
const SubNav = ({ items }: { items: { href: string; label: string }[] }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="sticky top-16 z-30 w-full backdrop-blur border-b border-white/10 bg-[rgba(16,35,71,0.65)]">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-3">
        <button onClick={() => setOpen(!open)} className="sm:hidden inline-flex items-center gap-1 text-white/90 text-sm">
          <IFilter/> Menu <IArrowDown/>
        </button>
        <nav className={cls("flex-1", open ? "block" : "hidden sm:block")}> 
          <ul className="flex flex-wrap items-center gap-2 py-1">
            {items.map((it) => (
              <li key={it.href}>
                <a href={it.href} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-white/5 hover:bg-white/10 border border-white/10 text-white">
                  <ILink/> {it.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <button onClick={() => window.print()} className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-white/10 hover:bg-white/20 border border-white/10 text-white">
          <IPrint/> Cetak Halaman
        </button>
      </div>
    </div>
  );
};

/************ DOKUMEN LIST ************/
function DokumenList() {
  const [q, setQ] = useState("");
  const [kategori, setKategori] = useState("Semua");
  const [tahun, setTahun] = useState("Semua");

  const tahunOpts = useMemo(() => {
    const years = Array.from(new Set(SAMPLE_DOKUMEN.map((d) => d.tahun))).sort((a, b) => b - a);
    return ["Semua", ...years.map(String)];
  }, []);

  const filtered = useMemo(() => {
    return SAMPLE_DOKUMEN.filter((d) =>
      (kategori === "Semua" || d.kategori === kategori) &&
      (tahun === "Semua" || String(d.tahun) === tahun) &&
      (q.trim() === "" || d.judul.toLowerCase().includes(q.toLowerCase()))
    );
  }, [q, kategori, tahun]);

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-3">
        <div className="col-span-1">
          <label className="text-xs text-white/70">Pencarian</label>
          <div className="mt-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-2 py-2">
            <IFilter/>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari judul dokumen…" className="bg-transparent outline-none text-white text-sm flex-1"/>
          </div>
        </div>
        <div className="col-span-1">
          <label className="text-xs text-white/70">Kategori</label>
          <select value={kategori} onChange={(e)=>setKategori(e.target.value)} className="mt-1 w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white">
            {KATEGORI_OPTIONS.map((k)=> <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
        <div className="col-span-1">
          <label className="text-xs text-white/70">Tahun</label>
          <select value={tahun} onChange={(e)=>setTahun(e.target.value)} className="mt-1 w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white">
            {tahunOpts.map((t)=> <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/10 text-white">
            <tr>
              <th className="text-left px-4 py-2">Kategori</th>
              <th className="text-left px-4 py-2">Judul</th>
              <th className="text-left px-4 py-2">Tahun</th>
              <th className="text-left px-4 py-2">Tipe</th>
              <th className="text-left px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d, idx) => (
              <tr key={d.id} className={cls(idx % 2 ? "bg-white/0" : "bg-white/[0.03]")}> 
                <td className="px-4 py-2 text-white/90">{d.kategori}</td>
                <td className="px-4 py-2 text-white">{d.judul}</td>
                <td className="px-4 py-2 text-white/90">{d.tahun}</td>
                <td className="px-4 py-2"><span className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-white/90">{d.tipe}</span></td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <a href={d.url} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs"><ILink/> Lihat</a>
                    <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs"><IUpload/> Unduh</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-white/70">Tidak ada dokumen yang cocok.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/************ FORMS ************/
function FormPermohonan() {
  const [data, setData] = useState({ nama:"", nik:"", email:"", telepon:"", alamat:"", rincian:"", cara:"Salinan Digital" });
  const [sent, setSent] = useState(false);
  const onChange = (k: string, v: string) => setData((s:any)=>({ ...s, [k]: v }));
  const onSubmit = (e: any) => { e.preventDefault(); setSent(true); };
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Nama" required><input value={data.nama} onChange={(e)=>onChange("nama", e.target.value)} className="input rounded-md p-1 w-full"/></Field>
        <Field label="NIK" required><input value={data.nik} onChange={(e)=>onChange("nik", e.target.value)} className="input rounded-md p-1 w-full"/></Field>
        <Field label="Email" required><input type="email" value={data.email} onChange={(e)=>onChange("email", e.target.value)} className="input rounded-md p-1 w-full"/></Field>
        <Field label="Telepon"><input value={data.telepon} onChange={(e)=>onChange("telepon", e.target.value)} className="input rounded-md p-1 w-full"/></Field>
        <Field label="Alamat"><input value={data.alamat} onChange={(e)=>onChange("alamat", e.target.value)} className="input rounded-md p-1 w-full"/></Field>
        <Field label="Cara Memperoleh Informasi">
          <select value={data.cara} onChange={(e)=>onChange("cara", e.target.value)} className="input rounded-md p-1 w-full">
            <option>Salinan Digital</option>
            <option>Salinan Fisik</option>
            <option>Melihat/Membaca</option>
          </select>
        </Field>
        <Field label="Rincian Informasi Diminta" required full>
          <textarea rows={4} value={data.rincian} onChange={(e)=>onChange("rincian", e.target.value)} className="w-full rounded-md input"/>
        </Field>
      </div>
      <div className="flex items-center gap-2">
        <button type="submit" className="btn">Kirim Permohonan</button>
        {sent && <span className="text-green-300 text-sm inline-flex items-center gap-2"><ICheck/> Terkirim (simulasi)</span>}
      </div>
      <p className="text-xs text-white/60">Catatan: ini simulasi front-end. Integrasi ke email/helpdesk bisa ditambahkan.</p>
    </form>
  );
}

/** STAR COMPONENT */
const Star: React.FC<any> = ({ filled, onClick, aria }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-5 h-5 focus:outline-none focus:ring-2 focus:ring-brand-accent ${filled ? "text-brand-accent" : "text-brand-subtle"}`}
    aria-label={aria}
  >
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <path
        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  </button>
);

/****************
 * PELAYANAN MASYARAKAT & RATING
 ****************/
const PublicService = ({ theme }) => {
  const [tab, setTab] = useState('permohonan'); // permohonan | tracking | saran
  const [jenis, setJenis] = useState('Informasi');
  const [nama, setNama] = useState('');
  const [kontak, setKontak] = useState('');
  const [pesan, setPesan] = useState('');
  const [kode, setKode] = useState('SMK13-0925-001');
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [ratings, setRatings] = useState([5,5,4,4,4,3,5,4,5,3,4]);
  const [isHuman, setIsHuman] = useState(false);
  const [errors, setErrors] = useState({});

  // rate limit local (aman SSR)
  const [submitsInWindow, setSubmitsInWindow] = useState(0);
  const RATE_WINDOW_MS = 5 * 60 * 1000;
  const RATE_MAX = 3;

  useEffect(() => {
    try {
      const now = Date.now();
      const slot = Number(localStorage.getItem('svc_rate_slot')||'0');
      const count = Number(localStorage.getItem('svc_rate_count')||'0');
      if (now - slot > RATE_WINDOW_MS) {
        localStorage.setItem('svc_rate_slot', String(now));
        localStorage.setItem('svc_rate_count', '0');
        setSubmitsInWindow(0);
      } else {
        setSubmitsInWindow(count);
      }
    } catch { /* noop on SSR */ }
  }, []);

  const incRate = () => {
    try {
      const now = Date.now();
      let slot = Number(localStorage.getItem('svc_rate_slot')||'0');
      let count = Number(localStorage.getItem('svc_rate_count')||'0');
      if (now - slot > RATE_WINDOW_MS) { slot = now; count = 0; }
      count += 1;
      localStorage.setItem('svc_rate_slot', String(slot));
      localStorage.setItem('svc_rate_count', String(count));
      setSubmitsInWindow(count);
    } catch { /* noop */ }
  };

  const avg = Math.round((ratings.reduce((a,b)=>a+b,0) / Math.max(1, ratings.length)) * 10) / 10;
  const counts = [1,2,3,4,5].map(n => ratings.filter(r=>r===n).length);

  const validateAll = () => {
    const e = {};
    if (tab === 'permohonan') {
      if (nama.trim().length < 3) e.nama = 'Nama minimal 3 karakter';
      if (!/^(.+@.+\..+|\+?\d{9,15})$/.test(kontak)) e.kontak = 'Kontak harus email atau no.hp valid';
      if (pesan.trim().length < 10) e.pesan = 'Uraian minimal 10 karakter';
      if (!isHuman) e.isHuman = 'Centang verifikasi manusia';
    }
    if (tab === 'saran') {
      if (rating < 1) e.rating = 'Pilih rating 1–5';
      if (!isHuman) e.isHuman = 'Centang verifikasi manusia';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (submitsInWindow >= RATE_MAX) { setErrors({ rate: 'Terlalu sering. Coba beberapa menit lagi.' }); return; }
    if (!validateAll()) return;
    setSubmitted(true);
    incRate();
    alert(`Terima kasih!\n${jenis} oleh ${nama || 'Anonym'} sudah kami terima.\nKontak: ${kontak || '-'}\nKode tiket: ${kode}`);
  };

  const submitFeedback = () => {
    if (submitsInWindow >= RATE_MAX) { setErrors({ rate: 'Terlalu sering. Coba beberapa menit lagi.' }); return; }
    if (!validateAll()) return;
    setRatings(prev => [...prev, rating]);
    setRating(0);
    setPesan('');
    incRate();
  };

  return (
    <Section id="pelayanan" title="Pelayanan Masyarakat & Rating"
      // subtitle="Ajukan permohonan/pengaduan, cek status, dan beri penilaian layanan"
      theme={theme}
    >
      <div className="mb-4 rounded-xl border p-3 flex items-center justify-between" style={{ borderColor: theme.subtle, background: theme.surface, color: theme.surfaceText }}>
        <div className="flex items-center gap-3">
          <div className="text-sm opacity-80">Rata-rata</div>
          <div className="text-2xl font-semibold">{avg}<span className="text-base opacity-70">/5</span></div>
          <div className="flex items-center" style={{ color: theme.accent }}>
            {Array.from({length:5}).map((_,i)=> (
              <svg key={i} viewBox="0 0 24 24" className="w-5 h-5"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z" fill={i < Math.round(avg) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5"/></svg>
            ))}
          </div>
        </div>
        <div className="text-sm opacity-80">Total responden: {ratings.length}</div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Left (tabs & content) */}
        <div className="lg:col-span-2 rounded-2xl border p-4 md:p-5"
             style={{ background: theme.surface, borderColor: theme.subtle, color: theme.surfaceText }}>
          <div className="flex items-center gap-2 mb-4">
            {['permohonan','tracking','saran'].map(key => (
              <button key={key} onClick={()=>{setTab(key);setErrors({});}} className="px-3 py-2 text-sm rounded-xl border"
                style={{ background: tab===key ? theme.accent : 'transparent', color: tab===key ? '#1b1b1b' : theme.surfaceText, borderColor: theme.subtle }}>
                {key==='permohonan' && 'Permohonan / Pengaduan'}
                {key==='tracking' && 'Tracking Status'}
                {key==='saran' && 'Kotak Saran & Rating'}
              </button>
            ))}
          </div>

          {errors.rate && (<div className="mb-3 text-xs" style={{ color: '#ffd700' }}>{errors.rate}</div>)}

          {tab==='permohonan' && (
            <form onSubmit={submitForm} className="grid gap-3">
              <div className="grid md:grid-cols-2 gap-3">
                <label className="grid gap-1 text-sm">
                  <span>Jenis</span>
                  <select value={jenis} onChange={e=>setJenis(e.target.value)} className="rounded-xl px-3 py-2 border bg-transparent" style={{ borderColor: theme.subtle, color: theme.surfaceText }}>
                    <option value="Informasi">Permohonan Informasi</option>
                    <option value="Pengaduan">Pengaduan</option>
                  </select>
                </label>
                <label className="grid gap-1 text-sm">
                  <span>Nama</span>
                  <input value={nama} onChange={e=>setNama(e.target.value)} placeholder="Nama lengkap" className="rounded-xl px-3 py-2 border bg-transparent" style={{ borderColor: theme.subtle, color: theme.surfaceText }} />
                  {errors.nama && <span className="text-xs" style={{ color: '#ffd700' }}>{errors.nama}</span>}
                </label>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <label className="grid gap-1 text-sm">
                  <span>Kontak</span>
                  <input value={kontak} onChange={e=>setKontak(e.target.value)} placeholder="Email / No. HP" className="rounded-xl px-3 py-2 border bg-transparent" style={{ borderColor: theme.subtle, color: theme.surfaceText }} />
                  {errors.kontak && <span className="text-xs" style={{ color: '#ffd700' }}>{errors.kontak}</span>}
                </label>
                <label className="grid gap-1 text-sm">
                  <span>Kode Tiket (otomatis)</span>
                  <input value={kode} onChange={e=>setKode(e.target.value)} className="rounded-xl px-3 py-2 border bg-transparent" style={{ borderColor: theme.subtle, color: theme.surfaceText }} />
                </label>
              </div>
              <label className="grid gap-1 text-sm">
                <span>Uraian</span>
                <textarea value={pesan} onChange={e=>setPesan(e.target.value)} rows={4} placeholder="Tuliskan detail kebutuhan Anda" className="rounded-xl px-3 py-2 border bg-transparent" style={{ borderColor: theme.subtle, color: theme.surfaceText }} />
                {errors.pesan && <span className="text-xs" style={{ color: '#ffd700' }}>{errors.pesan}</span>}
              </label>

              <label className="flex items-center gap-2 text-xs mt-1">
                <input type="checkbox" checked={isHuman} onChange={e=>setIsHuman(e.target.checked)} />
                <span>Saya bukan robot</span>
                {errors.isHuman && <span className="ml-2" style={{ color: '#ffd700' }}>{errors.isHuman}</span>}
              </label>

              <div className="flex items-center justify-between pt-2">
                <div className="text-xs opacity-75">Data Anda terenkripsi untuk keperluan tindak lanjut layanan.</div>
                <button className="rounded-xl px-4 py-2 text-sm font-medium" style={{ background: theme.accent, color: '#1b1b1b' }}>Kirim</button>
              </div>
              {submitted && (
                <div className="text-xs mt-2" style={{ color: theme.surfaceText }}>✔ Terkirim. Simpan kode tiket Anda: <strong>{kode}</strong></div>
              )}
            </form>
          )}

          {tab==='tracking' && (
            <div className="grid gap-3">
              <label className="grid gap-1 text-sm">
                <span>Kode Tiket</span>
                <input value={kode} onChange={e=>setKode(e.target.value)} placeholder="cth: SMK13-0925-001" className="rounded-xl px-3 py-2 border bg-transparent" style={{ borderColor: theme.subtle, color: theme.surfaceText }} />
              </label>
              <div className="rounded-xl border p-3 text-sm" style={{ borderColor: theme.subtle, color: theme.surfaceText }}>
                <div className="flex items-center justify-between">
                  <div><strong>Status:</strong> Diproses</div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold border" style={{ borderColor: theme.accent, color: theme.surfaceText }}>SLA 2×24 jam</span>
                </div>
                <ul className="mt-2 list-disc pl-5 space-y-1">
                  <li>01 Sep 2025 — Tiket dibuat</li>
                  <li>02 Sep 2025 — Diverifikasi</li>
                  <li>03 Sep 2025 — Sedang ditindaklanjuti</li>
                </ul>
              </div>
            </div>
          )}

          {tab==='saran' && (
            <div className="grid gap-4">
              <div>
                <div className="text-sm mb-1">Rating Layanan</div>
                <div className="flex items-center gap-1" style={{ color: theme.accent }}>
                  {Array.from({length:5}).map((_,i)=> (
                    <Star key={i} filled={i < rating} onClick={()=>setRating(i+1)} 
                    aria={`Beri rating ${i+1} bintang`} />
                  ))}
                  {errors.rating && <span className="ml-2 text-xs" style={{ color: '#ffd700' }}>
                    {errors.rating}
                  </span>}
                </div>
              </div>
              <label className="grid gap-1 text-sm">
                <span>Saran / Masukan</span>
                <textarea rows={3} value={pesan} onChange={e=>setPesan(e.target.value)} placeholder="Ceritakan pengalaman layanan Anda" className="rounded-xl px-3 py-2 border bg-transparent" style={{ borderColor: theme.subtle, color: theme.surfaceText }} />
              </label>

              <label className="flex items-center gap-2 text-xs mt-1">
                <input type="checkbox" checked={isHuman} onChange={e=>setIsHuman(e.target.checked)} />
                <span>Saya bukan robot</span>
                {errors.isHuman && <span className="ml-2" style={{ color: '#ffd700' }}>{errors.isHuman}</span>}
              </label>

              <div className="flex items-center justify-end">
                <button type="button" onClick={submitFeedback} className="rounded-xl px-4 py-2 text-sm font-medium" style={{ background: theme.accent, color: '#1b1b1b' }}>Kirim Feedback</button>
              </div>
            </div>
          )}
        </div>

        {/* Right (public rating summary) */}
        <div className="rounded-2xl border p-4 md:p-5 flex flex-col gap-4" style={{ background: theme.surface, borderColor: theme.subtle, color: theme.surfaceText }}>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-sm opacity-75">Rata-rata Kepuasan</div>
              <div className="text-3xl font-bold">{avg}<span className="text-base opacity-70">/5</span></div>
            </div>
            <div className="flex items-center" style={{ color: theme.accent }}>
              {Array.from({length:5}).map((_,i)=> (
                <svg key={i} viewBox="0 0 24 24" className="w-5 h-5"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z" fill={i < Math.round(avg) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5"/></svg>
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            {[5,4,3,2,1].map((n) => (
              <div key={n} className="flex items-center gap-2 text-sm">
                <span className="w-8">{n}★</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: theme.subtle }}>
                  <div className="h-full" 
                  style={{ width: `${ratings.length ? (counts[n-1]/ratings.length)*100 : 0}%`, 
                  background: theme.accent }} />
                </div>
                <span className="w-6 text-right">{counts[n-1]}</span>
              </div>
            ))}
          </div>
          <div className="text-xs opacity-75">Total responden: {ratings.length}. Data demo; hubungkan ke API untuk data nyata.</div>
        </div>
      </div>

      {/* Tips integrasi */}
      <div className="mt-4 text-xs opacity-75" style={{ color: theme.primaryText }}>
        <ul className="list-disc pl-5 space-y-1">
          <li>Ganti URL <code>#/api/*</code> dengan endpoint backend Anda.</li>
          <li>Integrasi captcha (mis. reCAPTCHA v2) dengan mengganti checkbox placeholder.</li>
          <li>Backend tetap perlu throttling/anti-spam meski sudah ada rate-limit lokal.</li>
        </ul>
      </div>
    </Section>
  );
};

// =================


function FormPengaduan() {
  const [data, setData] = useState({ nama:"", email:"", topik:"", uraian:"" });
  const [sent, setSent] = useState(false);
  const onChange = (k: string, v: string) => setData((s:any)=>({ ...s, [k]: v }));
  const onSubmit = (e: any) => { e.preventDefault(); setSent(true); };
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Nama" required><input value={data.nama} onChange={(e)=>onChange("nama", e.target.value)} className="input rounded-md p-1 w-full"/></Field>
        <Field label="Email" required><input type="email" value={data.email} onChange={(e)=>onChange("email", e.target.value)} className="input rounded-md p-1 w-full"/></Field>
        <Field label="Topik" required full><input value={data.topik} onChange={(e)=>onChange("topik", e.target.value)} className="input rounded-md p-1 w-full"/></Field>
        <Field label="Uraian" required full><textarea rows={4} value={data.uraian} onChange={(e)=>onChange("uraian", e.target.value)} className="input rounded-md p-1 w-full"/></Field>
      </div>
      <div className="flex items-center gap-2">
        <button type="submit" className="btn">Kirim Aduan</button>
        {sent && <span className="text-green-300 text-sm inline-flex items-center gap-2"><ICheck/> Terkirim (simulasi)</span>}
      </div>
      <p className="text-xs text-white/60">Catatan: ini simulasi front-end. Integrasi ke helpdesk/WhatsApp sekolah bisa ditambahkan.</p>
    </form>
  );
}

/************ FIELD & STYLES ************/
const Field = ({ label, required, children, full }:{ label: string; required?: boolean; children: React.ReactNode; full?: boolean }) => (
  <div className={cls(full ? "sm:col-span-2" : "") }>
    <label className="text-xs text-white/70">{label} {required && <span className="text-red-300">*</span>}</label>
    <div className="mt-1">{children}</div>
  </div>
);

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
              style={{ background: theme.accent, color: "#1b1b1b" }}
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

/************ MAIN COMPONENT ************/
export function PPIDMain() {
  useEffect(() => {
    document.documentElement.style.setProperty("--brand-primary", THEME.brand.primary);
    document.documentElement.style.setProperty("--brand-onPrimary", THEME.brand.onPrimary);
    document.documentElement.style.setProperty("--brand-accent", THEME.brand.accent);
    document.documentElement.style.setProperty("--brand-bg", THEME.brand.bg);
    document.documentElement.style.setProperty("--brand-surface", THEME.brand.surface);
    document.documentElement.style.setProperty("--brand-onSurface", THEME.brand.onSurface);
  }, []);

  const subItems = [
    { href: "#profil", label: "Profil PPID" },
    { href: "#regulasi", label: "Regulasi & SOP" },
    { href: "#berkala", label: "Informasi Berkala" },
    { href: "#setiap-saat", label: "Informasi Setiap Saat" },
    { href: "#serta-merta", label: "Informasi Serta-merta" },
    { href: "#laporan-keuangan", label: "Laporan Keuangan" },
    { href: "#laporan-kinerja", label: "Laporan Kinerja" },
    { href: "#layanan", label: "Layanan Permohonan" },
    { href: "#pengaduan", label: "Aduan & Kontak" },
  ];

  return (
    <div className="min-h-screen" style={{ background: THEME.brand.bg }}>
      {/* HEADER */}
      <Navbar />

      {/* HERO */}
      <div className="relative overflow-hidden border-b border-white/10" style={{ background: THEME.brand.surface }}>
        <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14 grid sm:grid-cols-2 gap-6 items-center text-white">
          <div>
            <div className="inline-flex items-center gap-2 text-xs text-black bg-[var(--brand-accent)] px-3 py-1 rounded-full mb-3 font-semibold">
              <IShield/> Transparansi Informasi Publik
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight">PPID Sekolah — Keterbukaan Informasi untuk Orang Tua & Masyarakat</h1>
            <p className="mt-3 text-white/80">Halaman ini memuat informasi berkala, setiap saat, serta-merta; regulasi & SOP; laporan; dan layanan permohonan informasi.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <a href="#layanan" className="btn"><IInbox/> Ajukan Permohonan</a>
              {/* <a href="#berkala" className="btn ghost"><IBook/> Lihat Dokumen</a> */}
            </div>
          </div>
          <div className="sm:justify-self-end">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <ul className="space-y-2 text-sm">
                <li className="text-white/90"><IInfo/> <b>Identitas:</b> NPSN 12345678 · Akreditasi A · Alamat Jl. Contoh No. 1</li>
                <li className="text-white/90"><IClock/> <b>Jam Layanan PPID:</b> Senin–Jumat 08.00–15.00 WIB</li>
                <li className="text-white/90"><IPhone/> <b>Kontak:</b> ppid@sekolah.sch.id · (021) 123456</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* SUBNAV */}
      <SubNav items={subItems} />

      {/* CONTENT SECTIONS */}
      <Section id="profil" title="Profil PPID" icon={<IInfo/>}>
        <div className="prose prose-invert max-w-none">
          <p><b>PPID Sekolah</b> bertugas mengelola dan memberikan layanan informasi publik sesuai UU No. 14/2008 tentang Keterbukaan Informasi Publik.</p>
          <ul>
            <li>Struktur: Penanggung jawab (Kepala Sekolah), Atasan PPID, PPID Pelaksana.</li>
            <li>Tugas: Pengklasifikasian informasi, penyediaan informasi, pendokumentasian, layanan permohonan & keberatan.</li>
            <li>Output: Daftar Informasi Publik, laporan layanan, dokumentasi permohonan.</li>
          </ul>
        </div>
      </Section>

      <Section id="regulasi" title="Regulasi & SOP" icon={<IShield/>}>
        <ul className="list-disc pl-5 space-y-1 text-white/90">
          <li>UU 14/2008 Keterbukaan Informasi Publik</li>
          <li>PP 61/2010 Pelaksanaan UU KIP</li>
          <li>Permendikbud terkait pengelolaan informasi & BOS</li>
          <li>SK Penunjukan PPID Sekolah</li>
          <li>SOP Layanan Permohonan Informasi</li>
        </ul>
        <div className="mt-4">
          <DokumenList/>
        </div>
      </Section>

      <Section id="berkala" title="Informasi Berkala" icon={<IBook/>}>
        <p className="text-white/80">Contoh: Kurikulum, kalender akademik, program kerja, data sarpras, rekap prestasi, pengumuman PPDB.</p>
        <div className="mt-4">
          <DokumenList/>
        </div>
      </Section>

      <Section id="setiap-saat" title="Informasi Setiap Saat" icon={<IFile/>}>
        <p className="text-white/80">Contoh: Data PTK, peserta didik, layanan perpustakaan, standar layanan, daftar aset.</p>
        <div className="mt-4">
          <DokumenList/>
        </div>
      </Section>

      <Section id="serta-merta" title="Informasi Serta-merta" icon={<IAlert/>}>
        <p className="text-white/80">Informasi yang mempengaruhi hajat hidup orang banyak dan/atau keselamatan publik (mis. bencana, wabah, gangguan layanan).</p>
        <div className="mt-4">
          <DokumenList/>
        </div>
      </Section>

      <Section id="laporan-keuangan" title="Laporan Keuangan" icon={<IChart/>}>
        <p className="text-white/80">Contoh: Realisasi Dana BOS, bantuan pemerintah, audit keuangan.</p>
        <div className="mt-4">
          <DokumenList/>
        </div>
      </Section>

      <Section id="laporan-kinerja" title="Laporan Kinerja" icon={<IChart/>}>
        <p className="text-white/80">Contoh: IKU, capaian kinerja, evaluasi Dinas, rapor mutu sekolah.</p>
        <div className="mt-4">
          <DokumenList/>
        </div>
      </Section>

      <Section id="layanan" title="Layanan Permohonan Informasi" icon={<IInbox/>}>
        <ol className="list-decimal pl-5 text-white/90 space-y-1">
          <li>Pemohon mengisi formulir permohonan.</li>
          <li>PPID memverifikasi dan menindaklanjuti (maks. 10 hari kerja + perpanjangan 7 hari bila perlu).</li>
          <li>Pemohon menerima jawaban/keberatan sesuai ketentuan.</li>
        </ol>
        <div className="mt-4">
          <FormPermohonan/>
        </div>
      </Section>

      <PublicService theme={THEMES.smkn13} />

      <Footer theme={THEMES} />

      <style jsx global>{`
        .navitem{ @apply text-white/90 text-sm px-3 py-1.5 rounded-full hover:bg-white/10 border border-white/10; }
        .btn{ @apply inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-black; background: var(--brand-accent); }
        .btn.ghost{ @apply text-white; background: transparent; border: 1px solid rgba(255,255,255,0.15); }
        .input{ @apply w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none; }
        .prose :where(a){ color: #F2C94C; }
      `}</style>
    </div>
  );
}
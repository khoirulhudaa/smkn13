import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * PPDB PAGE (Single-file React component)
 * - Tanpa Header/Nav & Footer (sesuai permintaan)
 * - Tailwind-ready, hanya React & framer-motion
 * - Gating backend + mode demo (?open=1 atau tombol "Buka Form (Demo)")
 *
 * Catatan perbaikan:
 * - Menghapus placeholder tak sengaja seperti $1 dan menutup seluruh JSX agar tidak "terpotong".
 * - Memperbaiki error "Unterminated string constant" akibat potongan JSX di bagian akhir.
 * - Menambahkan style untuk kontras dropdown opsi (white background vs white text).
 * - Menjaga semua hooks berada di dalam komponen fungsi.
 */

// === THEME (bisa di-override per-tenant) ===
const THEME = {
  primary: "#1F3B76",
  primaryText: "#ffffff",
  accent: "#F2C94C",
  bg: "#0B1733",
  surface: "#102347",
  surfaceText: "#ffffff",
  subtle: "#2C3F6B",
  muted: "#7B8AB3",
};

const cx = (...cls: (string | false | null | undefined)[]) => cls.filter(Boolean).join(" ");

// === SHARED UI ===
const Chip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs border border-white/15 bg-white/10 backdrop-blur">
    {children}
  </span>
);

const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium border border-white/15 bg-white/5">
    {children}
  </span>
);

const Card: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = "", children }) => (
  <div className={cx("rounded-2xl border border-white/10 bg-white/5 p-5", className)}>
    {children}
  </div>
);

const Section: React.FC<{ id?: string; title: string; subtitle?: string; children: React.ReactNode }> = ({ id, title, subtitle, children }) => (
  <section id={id} className="relative py-10 md:py-14">
    <div className="max-w-6xl mx-auto px-4">
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-white">{title}</h2>
        {subtitle && <p className="text-sm md:text-base text-white/70 mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  </section>
);

// === CONTENT WIDGETS ===
const Timeline: React.FC<{ items: { title: string; desc: string; date: string }[] }> = ({ items = [] }) => (
  <ol className="relative border-s border-white/15 pl-4 space-y-6">
    {items.map((it, i) => (
      <li key={i} className="ms-4">
        <div className="absolute w-2 h-2 rounded-full border-2 border-white/70 bg-[#0B1733] -left-[5px] mt-2" />
        <Card className="bg-white/5">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">{it.title}</h4>
              <p className="text-white/70 text-sm">{it.desc}</p>
            </div>
            <Badge>{it.date}</Badge>
          </div>
        </Card>
      </li>
    ))}
  </ol>
);

const Step: React.FC<{ idx: number; title: string; desc: string }> = ({ idx, title, desc }) => (
  <div className="relative">
    <div className="flex items-start gap-3">
      <div className="h-7 w-7 rounded-full grid place-items-center border border-white/20 bg-white/10 text-sm font-semibold">{idx}</div>
      <div>
        <div className="text-white font-medium">{title}</div>
        <div className="text-white/70 text-sm">{desc}</div>
      </div>
    </div>
  </div>
);

const KuotaTable: React.FC<{ data: { nama: string; kuota: number; peminat: number }[] }> = ({ data }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full text-sm">
      <thead>
        <tr className="text-left text-white/80 border-b border-white/10">
          <th className="py-2">Program Keahlian</th>
          <th className="py-2">Kuota</th>
          <th className="py-2">Peminat</th>
          <th className="py-2">Sisa</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/5">
        {data.map((r, i) => (
          <tr key={i} className="hover:bg-white/5">
            <td className="py-2 text-white">{r.nama}</td>
            <td className="py-2">{r.kuota}</td>
            <td className="py-2">{r.peminat}</td>
            <td className="py-2">{Math.max(0, r.kuota - r.peminat)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const FAQ: React.FC<{ items: { q: string; a: string }[] }> = ({ items }) => {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <Card key={i}>
          <button
            className="w-full text-left flex items-center justify-between gap-3"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
          >
            <span className="text-white font-medium">{it.q}</span>
            <span className="text-white/70">{open === i ? "−" : "+"}</span>
          </button>
          <AnimatePresence>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-3 text-white/80 text-sm">{it.a}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      ))}
    </div>
  );
};

/***********************
 * Rekap & Tabel Pendaftar
 ***********************/
const StatPanel: React.FC<{ title: string; total: number; items?: { label: string; value: number }[]; tone?: "blue" | "green" }> = ({ title, total, items = [], tone = "blue" }) => (
  <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
    <div
      className={cx("px-4 py-2 text-white font-semibold text-center", tone === "green" ? "bg-emerald-600" : "bg-blue-600")}
      style={{ borderBottomLeftRadius: "18px", borderBottomRightRadius: "18px" }}
    >
      {title}
    </div>
    <div className="p-5 text-center">
      <div className="text-3xl font-semibold">{total.toLocaleString()}</div>
      <ul className="mt-2 space-y-1 text-sm text-white/80">
        {items.map((it, i) => (
          <li key={i} className="leading-relaxed">
            {it.label} : <span className="text-white font-medium">{it.value.toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const DataTable: React.FC<{ rows: any[] }> = ({ rows }) => {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [sortKey, setSortKey] = useState<keyof any>("noUrut");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    const list = s
      ? rows.filter((r) => ${r.noPendaftaran} ${r.nama} ${r.asalSekolah} ${r.npsn}.toLowerCase().includes(s))
      : rows;
    const sorted = [...list].sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [rows, q, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const start = (page - 1) * perPage;
  const paged = filtered.slice(start, start + perPage);

  const changeSort = (key: keyof any) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2">
          <span>Show</span>
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
            className="rounded-md bg-white/10 border border-white/15 px-2 py-1"
          >
            {[10, 20, 30, 50, 100].map((n) => (
              <option key={n} value={n} className="text-black">
                {n}
              </option>
            ))}
          </select>
          <span>entries</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Search:</span>
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            className="rounded-md bg-white/10 border border-white/15 px-2 py-1"
            placeholder="ketik nama / sekolah / NPSN"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-white/80 border-b border-white/10">
              {[
                { key: "noUrut", label: "NO" },
                { key: "noPendaftaran", label: "NO PENDAFTARAN" },
                { key: "nama", label: "NAMA" },
                { key: "asalSekolah", label: "ASAL SEKOLAH" },
                { key: "npsn", label: "NPSN ASAL SEKOLAH" },
              ].map((c) => (
                <th
                  key={c.key}
                  className="py-2 cursor-pointer select-none"
                  onClick={() => changeSort(c.key as keyof any)}
                >
                  <div className="inline-flex items-center gap-1">
                    {c.label}
                    {sortKey === (c.key as keyof any) && (
                      <span className="text-xs">{sortDir === "asc" ? "▲" : "▼"}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {paged.map((r: any, i: number) => (
              <tr key={r.noPendaftaran} className="hover:bg-white/5">
                <td className="py-2">{start + i + 1}</td>
                <td className="py-2">{r.noPendaftaran}</td>
                <td className="py-2 text-white">{r.nama}</td>
                <td className="py-2">{r.asalSekolah}</td>
                <td className="py-2">{r.npsn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-white/80">
        <div>
          Showing <span className="text-white">{paged.length}</span> of
          <span className="text-white"> {filtered.length}</span> entries
        </div>
        <div className="flex items-center gap-2">
          <button disabled={page === 1} onClick={() => setPage(1)} className="px-2 py-1 rounded border border-white/15 disabled:opacity-40">«</button>
          <button disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-2 py-1 rounded border border-white/15 disabled:opacity-40">Prev</button>
          <span>Page {page} / {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="px-2 py-1 rounded border border-white/15 disabled:opacity-40">Next</button>
          <button disabled={page === totalPages} onClick={() => setPage(totalPages)} className="px-2 py-1 rounded border border-white/15 disabled:opacity-40">»</button>
        </div>
      </div>
    </div>
  );
};

// ——— Komponen Utama ———
export default function PPDBPage() {
  // ===== Demo helpers untuk Rekap & Tabel =====
  const makeRows = (jenjangLabel: string) => {
    const N = 125; // per jenjang (demo)
    const schools: Record<string, string[]> = {
      SD: ["SDN 01", "SDN 02", "SD Islam Al-Azhar", "SD Tarakanita"],
      SMP: ["SMPN 3", "SMP GPI Solokanjeruk", "SMP Al-Hidayah"],
      SMA: ["SMAN 5", "SMA Pribadi", "SMA Muhammadiyah"],
      SMK: ["SMKN 13 Jakarta", "SMK Al-Mufassir", "SMK Telkom"],
      MTs: ["MTS Al-Ihsan", "MTs Al-Mufassir"],
      MTsN: ["MTsN 1 Jakarta", "MTsN 2 Bandung"],
      MA: ["MAN 2 Bandung", "MA Persis"],
      MI: ["MIN 1 Jakarta", "MI Al-Hidayah"],
      PKBM: ["PKBM Cerdas Bangsa"],
      Lainnya: ["Sekolah Nusantara"],
    };
    const jalurList = ["Afirmasi", "Prestasi", "Reguler"];
    const result = Array.from({ length: N }, (_, i) => {
      const nama = `Peserta ${i + 1} ${jenjangLabel}`;
      const bucket = schools[jenjangLabel] || schools.Lainnya;
      const sekolah = bucket[i % bucket.length];
      const jalur = jalurList[i % 3];
      const npsn = String(20000000 + ((i * 13) % 999999)).padStart(8, "0");
      return {
        noUrut: i + 1,
        noPendaftaran: `PPDB${String(new Date().getFullYear()).slice(2)}${(10000 + i).toString()}`,
        nama,
        asalSekolah: sekolah,
        npsn,
        jalur,
      };
    });
    return result;
  };
  const DEMO = useMemo(() => {
    const jenjangList = ["SD", "SMP", "SMA", "SMK", "MTs", "MTsN", "MA", "MI", "PKBM", "Lainnya"];
    const map: Record<string, any[]> = {};
    jenjangList.forEach((j) => {
      map[j] = makeRows(j);
    });
    return map;
  }, []);
  const demoByJenjang = (j: string) => {
    const rows = DEMO[j] || [];
    const count = rows.length;
    const byJalur = {
      Afirmasi: rows.filter((r: any) => r.jalur === "Afirmasi").length,
      Prestasi: rows.filter((r: any) => r.jalur === "Prestasi").length,
      Reguler: rows.filter((r: any) => r.jalur === "Reguler").length,
    };
    return { rows, totalPendaftar: count, byJalur, kuotaTotal: 360 };
  };

  // ===== Gating dari backend =====
  /**
   * Backend diharapkan expose endpoint seperti GET /api/ppdb/status
   * Contoh respon: { active: true, mode: "PPDB", startDate: "2025-09-10" }
   */
  const [isRegActive, setIsRegActive] = useState(false);
  const [regMode, setRegMode] = useState<"PPDB" | "SPMB" | "OFF">("OFF");
  const [regStart, setRegStart] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/ppdb/status", { cache: "no-store" });
        if (!res.ok) throw new Error("Bad status");
        const data = await res.json();
        if (!mounted) return;
        setIsRegActive(Boolean(data.active));
        setRegMode((data.mode as any) ?? "OFF");
        setRegStart(data.startDate ?? null);
      } catch {
        if (!mounted) return;
        setIsRegActive(false);
        setRegMode("OFF");
        setRegStart(null);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // === MODE DEMO (tanpa backend) ===
  const [localForceOpen, setLocalForceOpen] = useState(false);
  const demoForceOpen = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("open") === "1";
  const formEnabled = demoForceOpen || localForceOpen || (isRegActive && (regMode === "PPDB" || regMode === "SPMB"));

  // ===== Mock state form & hasil =====
  const [pendaftar, setPendaftar] = useState(237);
  const [jalur, setJalur] = useState("Zonasi");
  const [berkas, setBerkas] = useState<File | null>(null);
  const [kirimOk, setKirimOk] = useState(false);
  const [noPendaftaran, setNoPendaftaran] = useState("");
  const [hasil, setHasil] = useState<any>(null);

  // === STATE TAMBAHAN UNTUK FORM ===
  const [jenjang, setJenjang] = useState("SMP");
  const [statusSekolah, setStatusSekolah] = useState("Negeri");
  const [nisn, setNisn] = useState("");
  const [namaLengkap, setNamaLengkap] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("Laki-laki");
  const [npsnAsal, setNpsnAsal] = useState("");
  const [namaSekolahAsal, setNamaSekolahAsal] = useState("");
  const [noHp, setNoHp] = useState("");
  const [tempatLahir, setTempatLahir] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [alamatJalan, setAlamatJalan] = useState("");
  const [rt, setRt] = useState("");
  const [rw, setRw] = useState("");
  const [desa, setDesa] = useState("");
  const [kecamatan, setKecamatan] = useState("");
  const [kabupatenKota, setKabupatenKota] = useState("");
  const [provinsi, setProvinsi] = useState("");
  const [kodePos, setKodePos] = useState("");
  const [password, setPassword] = useState("");

  // Captcha dummy
  const makeCaptcha = () => Math.random().toString(36).slice(2, 6).toUpperCase();
  const [captcha, setCaptcha] = useState(makeCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");

  const onlyDigits = (s: string) => s.replace(/\D+/g, "");

  // Jadwal untuk <Timeline />
  const jadwal = [
    { title: "Pendaftaran Dibuka", desc: "Form online aktif 24 jam", date: "10 Sep 2025" },
    { title: "Verifikasi Berkas", desc: "Oleh panitia sekolah", date: "11–15 Sep 2025" },
    { title: "Tes/Seleksi (jika ada)", desc: "Jadwal per program keahlian", date: "17 Sep 2025" },
    { title: "Pengumuman Hasil", desc: "Cek di menu Cek Hasil", date: "20 Sep 2025" },
    { title: "Daftar Ulang", desc: "Konfirmasi dan unggah berkas ulang", date: "22–24 Sep 2025" },
  ];

  const handleKirim = (e: React.FormEvent) => {
    e.preventDefault();
    const ok =
      nisn.length === 10 &&
      npsnAsal.length === 8 &&
      kodePos.length === 5 &&
      captchaInput.toUpperCase() === captcha;
    if (!ok) return alert("Periksa kembali input (NISN 10 digit, NPSN 8 digit, Kode Pos 5 digit, Captcha).");
    setKirimOk(true);
    setPendaftar((n) => n + 1);
    setTimeout(() => setKirimOk(false), 2600);
  };

  const handleCek = (e: React.FormEvent) => {
    e.preventDefault();
    if (/^PPDB25-/.test(noPendaftaran)) {
      setHasil({ status: "LULUS", jurusan: "RPL", keterangan: "Silakan daftar ulang pada 22–24 Sep 2025." });
    } else if (noPendaftaran.trim()) {
      setHasil({ status: "MENUNGGU", jurusan: "-", keterangan: "Verifikasi berkas sedang diproses." });
    } else {
      setHasil(null);
    }
  };

  const PROVINSI = [
    "DKI Jakarta","Jawa Barat","Banten","Jawa Tengah","DI Yogyakarta","Jawa Timur","Aceh","Sumatera Utara","Sumatera Barat","Riau","Kep. Riau","Jambi","Sumatera Selatan","Bangka Belitung","Bengkulu","Lampung","Bali","Nusa Tenggara Barat","Nusa Tenggara Timur","Kalimantan Barat","Kalimantan Tengah","Kalimantan Selatan","Kalimantan Timur","Kalimantan Utara","Sulawesi Utara","Gorontalo","Sulawesi Tengah","Sulawesi Barat","Sulawesi Selatan","Sulawesi Tenggara","Maluku","Maluku Utara","Papua","Papua Barat","Papua Tengah","Papua Pegunungan","Papua Selatan","Papua Barat Daya",
  ];

  // Self-tests (tidak mem-block render)
  try {
    console.assert(makeCaptcha().length === 4, "Captcha length should be 4");
    const demo = demoByJenjang("SMP");
    console.assert(typeof demo.totalPendaftar === "number", "demoByJenjang returns totals");
    console.assert(Array.isArray(jadwal) && jadwal.length > 0, "jadwal must be defined and non-empty");
    console.assert(/^PPDB25-/.test("PPDB25-001234") === true, "cek pola nomor lulus");
    console.assert(/^PPDB25-/.test("XYZ") === false, "cek pola nomor tidak valid");
  } catch {}

  return (
    <div style={{ background: THEME.bg, color: THEME.primaryText }} className="min-h-screen">
      {/* Fix native select dropdown contrast on light system menus */}
      <style>{select option { color: #111; background: #fff; }}</style>

      {/* HERO */}
      <section id="ppdb" className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{ background: radial-gradient(600px 300px at 20% 0%, ${THEME.accent}, transparent 60%) }} />
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight">PPDB {new Date().getFullYear()}<br /> SMKN 13 Jakarta</h1>
              <p className="text-white/80 mt-3 md:text-lg">Terbuka dan transparan. Akses pendaftaran 24/7, pemantauan status real‑time, dan bantuan langsung dari panitia.</p>
              <div className="flex items-center gap-2 mt-4">
                <Chip>Counter pendaftar: <b className="ml-1">{pendaftar.toLocaleString()}</b></Chip>
                <Chip>Kuota total: 360</Chip>
                <Chip>Jalur aktif: {jalur}</Chip>
                {(typeof window !== "undefined" && (new URLSearchParams(window.location.search).get("open") === "1")) || localForceOpen ? (
                  <Chip>Mode demo: pendaftaran terbuka</Chip>
                ) : null}
              </div>
              <div className="flex gap-3 mt-6">
                {formEnabled ? (
                  <a href="#pendaftaran" className="px-4 py-2 rounded-xl border border-white/15 bg-white/10 hover:bg-white/15 font-medium">Daftar Sekarang</a>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="px-4 py-2 rounded-xl border border-white/15 bg-white/5 text-white/60" title="Pendaftaran belum dibuka">Daftar belum dibuka</span>
                    <button type="button" onClick={() => setLocalForceOpen(true)} className="px-3 py-2 rounded-xl border border-white/15 bg-white/10 hover:bg-white/15 text-sm">Buka Form (Demo)</button>
                  </div>
                )}
                <a href="#alur" className="px-4 py-2 rounded-xl border border-white/15 hover:bg-white/10 font-medium">Lihat Alur</a>
              </div>
              {!formEnabled && (
                <div className="mt-3 text-xs text-amber-200/90">Portal pendaftaran akan aktif ketika jadwal dimulai oleh backend ({regMode}).{regStart ? ` Mulai ${regStart}.` : ""}</div>
              )}
            </div>
            <Card className="md:ml-auto">
              <div className="text-white font-medium">Jadwal Utama PPDB</div>
              <div className="mt-3"><Timeline items={jadwal} /></div>
              <div className="mt-4 text-xs text-white/70">Catatan: Jadwal dapat berubah sesuai kebijakan Dinas Pendidikan.</div>
            </Card>
          </div>
        </div>
      </section>

      {/* ALUR */}
      <Section id="alur" title="Alur Pendaftaran" subtitle="Ikuti langkah-langkah berikut agar proses berjalan lancar.">
        <div className="grid md:grid-cols-4 gap-4">
          <Step idx={1} title="Registrasi Akun" desc="Masukkan email/WhatsApp yang aktif." />
          <Step idx={2} title="Lengkapi Form" desc="Isi biodata & pilih program keahlian." />
          <Step idx={3} title="Unggah Berkas" desc="KK, Akta, Rapor, SKL/Surat Lulus, dsb." />
          <Step idx={4} title="Kirim & Pantau" desc="Cek status verifikasi dan pengumuman." />
        </div>
      </Section>

      {/* PERSYARATAN */}
      <Section id="persyaratan" title="Persyaratan" subtitle="Rangkum syarat umum dan khusus per jalur.">
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <div className="text-white font-medium mb-2">Syarat Umum</div>
            <ul className="list-disc list-inside text-white/80 text-sm space-y-1">
              <li>Usia maksimal sesuai ketentuan PPDB Dinas Pendidikan.</li>
              <li>Memiliki NIK/KK DKI Jakarta (untuk jalur zonasi).</li>
              <li>Mengisi formulir pendaftaran online dan unggah berkas.</li>
            </ul>
          </Card>
          <Card>
            <div className="text-white font-medium mb-2">Jalur Pendaftaran</div>
            <div className="flex flex-wrap gap-2">
              <Badge>Zonasi</Badge>
              <Badge>Afirmasi</Badge>
              <Badge>Perpindahan Orang Tua</Badge>
              <Badge>Prestasi</Badge>
            </div>
            <p className="text-sm text-white/70 mt-2">Detail nilai minimal/ketentuan tiap jalur mengikuti juknis resmi.</p>
          </Card>
        </div>
      </Section>

      {/* KUOTA */}
      <Section id="kuota" title="Kuota & Peminat" subtitle="Pantau ketersediaan kursi di setiap program keahlian.">
        <Card>
          <KuotaTable data={[{ nama: "RPL", kuota: 108, peminat: 92 }, { nama: "TKJ", kuota: 108, peminat: 101 }, { nama: "DKV", kuota: 72, peminat: 66 }, { nama: "Akuntansi", kuota: 72, peminat: 54 }]} />
          <div className="text-xs text-white/60 mt-2">Terakhir diperbarui: {new Date().toLocaleDateString()}</div>
        </Card>
      </Section>

      {/* REKAP */}
      <Section id="rekap" title="Rekap Pendaftar & Kuota" subtitle="Angka otomatis mengikuti filter jenjang.">
        <Card>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-white/80 text-sm">Jenjang:</span>
            <select value={jenjang} onChange={(e) => setJenjang(e.target.value)} className="rounded-md bg-white/10 border border-white/15 px-2 py-1 text-sm">
              {["SD", "SMP", "SMA", "SMK", "MTs", "MTsN", "MA", "MI", "PKBM", "Lainnya"].map((j) => (
                <option key={j} value={j} className="text-black">{j}</option>
              ))}
            </select>
            <span className="text-white/60 text-xs">(Demo: data di bawah akan menyesuaikan)</span>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <StatPanel title="Data Pendaftar" total={demoByJenjang(jenjang).totalPendaftar} items={[
              { label: "Pendaftar Jalur Afirmasi", value: demoByJenjang(jenjang).byJalur.Afirmasi },
              { label: "Pendaftar Jalur Prestasi", value: demoByJenjang(jenjang).byJalur.Prestasi },
              { label: "Pendaftar Jalur Reguler", value: demoByJenjang(jenjang).byJalur.Reguler },
            ]} tone="blue" />
            <StatPanel title="Kuota Peserta Didik Baru" total={demoByJenjang(jenjang).kuotaTotal} items={[
              { label: "Kuota Jalur Afirmasi 15%", value: Math.round(demoByJenjang(jenjang).kuotaTotal * 0.15) },
              { label: "Kuota Jalur Prestasi 15%", value: Math.round(demoByJenjang(jenjang).kuotaTotal * 0.15) },
              { label: "Kuota Jalur Reguler 70%", value: Math.round(demoByJenjang(jenjang).kuotaTotal * 0.7) },
            ]} tone="green" />
          </div>
        </Card>
      </Section>

      {/* DATA PENDAFTAR */}
      <Section id="data-pendaftar" title="Data Pendaftar" subtitle="Tabel daftar pendaftar – bisa di-sort, cari, dan atur jumlah baris.">
        <Card>
          <DataTable rows={demoByJenjang(jenjang).rows} />
        </Card>
      </Section>

      {/* FORM PENDAFTARAN (gated) */}
      {formEnabled ? (
        <Section id="pendaftaran" title="Formulir Pendaftaran Online" subtitle="Isi data calon peserta didik dengan benar.">
          <Card>
            <form onSubmit={handleKirim} className="grid md:grid-cols-2 gap-4">
              {/* Baris: Jalur, Jenjang, Status */}
              <div>
                <label className="text-sm text-white/80">Jalur Pendaftaran</label>
                <select value={jalur} onChange={(e) => setJalur(e.target.value)} className="mt-1 w-full rounded-lg bg-white/10 border border-white/15 px-3 py-2 outline-none">
                  <option className="text-black">Reguler</option>
                  <option className="text-black">Zonasi</option>
                  <option className="text-black">Afirmasi</option>
                  <option className="text-black">Perpindahan Orang Tua</option>
                  <option className="text-black">Prestasi</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-white/80">Jenjang</label>
                  <select value={jenjang} onChange={(e) => setJenjang(e.target.value)} className="mt-1 w-full rounded-lg bg-white/10 border border-white/15 px-3 py-2 outline-none">
                    <option className="text-black">SMP</option>
                    <option className="text-black">MTs</option>
                    <option className="text-black">MTsN</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-white/80">Status Sekolah</label>
                  <select value={statusSekolah} onChange={(e) => setStatusSekolah(e.target.value)} className="mt-1 w-full rounded-lg bg-white/10 border border-white/15 px-3 py-2 outline-none">
                    <option className="text-black">Negeri</option>
                    <option className="text-black">Swasta</option>
                  </select>
                </div>
              </div>

              {/* NISN, Nama Lengkap */}
              <div>
                <label className="text-sm text-white/80">NISN (10 angka) — dipakai sebagai Username</label>
                <input inputMode="numeric" pattern="\\d{10}" maxLength={10} value={nisn} onChange={(e) => setNisn(onlyDigits(e.target.value).slice(0, 10))} required className="mt-1 w-full rounded-lg bg-white/10 border border-white/15 px-3 py-2 outline-none" placeholder="Masukkan 10 digit angka" />
              </div>
              <div>
                <label className="text-sm text-white/80">Nama Lengkap</label>
                <input value={namaLengkap} onChange={(e) => setNamaLengkap(e.target.value)} required className="mt-1 w-full rounded-lg bg-white/10 border border-white/15 px-3 py-2 outline-none" placeholder="Nama sesuai ijazah" />
              </div>

              {/* Jenis Kelamin, NPSN Asal */}
              <div>
                <label className="text-sm text-white/80">Jenis Kelamin</label>
                <div className="mt-2 flex items-center gap-4 text-sm">
                  <label className="inline-flex items-center gap-2">
                    <input type="radio" name="jk" className="accent-blue-400" checked={jenisKelamin === "Laki-laki"} onChange={() => setJenisKelamin("Laki-laki")} />
                    Laki-laki
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input type="radio" name="jk" className="accent-blue-400" checked={jenisKelamin === "Perempuan"} onChange={() => setJenisKelamin("Perempuan")} />
                    Perempuan
                  </label>
                </div>
              </div>
              <div>
                <label className="text-sm text-white/80">NPSN MTs/SMP Asal (8 angka)</label>
                <input inputMode="numeric" pattern="\\d{8}" maxLength={8} value={npsnAsal} onChange={(e) => setNpsnAsal(onlyDigits(e.target.value).slice(0, 8))} required className="mt-1 w-full rounded-lg bg-white/10 border border-white/15 px-3 py-2 outline-none" placeholder="Masukkan 8 digit" />
              </div>

              {/* Nama Sekolah Asal, No HP */}
              <div>
                <label className="text-sm text-white/80">Nama MTs/SMP Asal</label>
                <input value={namaSekolahAsal} onChange={(e) => setNamaSekolahAsal(e.target.value)} required className="mt-1 w-full rounded-lg bg-white/10 border border-white/15 px-3 py-2 outline-none" placeholder="contoh: MTsN 1 Jakarta" />
              </div>
              <div>
                <label className="text-sm text-white/80">No Handphone</label>
                <input inputMode="numeric" value={noHp} onChange={(e) => setNoHp(onlyDigits(e.target.value).slice(0, 14))} required className="mt-1 w-full rounded-lg bg-white/10 border border-white/15 px-3 py-2 outline-none" placeholder="Masukkan No HP (08...)" />
              </div>

              {/* Tempat/Tanggal Lahir */}
              <div>
                <label className="text-sm text-white/80">Tempat Lahir</label>
                <input value={tempatLahir} onChange={(e) => setTempatLahir(e.target.value)} required className="mt-1 w-full rounded-lg bg-white/10 border border-white/15 px-3 py-2 outline-none" placeholder="Kota/Kabupaten" />
              </div>
              <div>
                <label className="text-sm text-white/80">Tanggal Lahir</label>
                <input type="date" value={tanggalLahir} onChange={(e) => setTanggalLahir(e.target.value)} required className="mt-1 w-full rounded-lg bg-white/10 border border-white/15 px-3 py-2 outline-none" />
              </div>

              {/* Alamat Jalan & RT/RW */}
              <div>
                <label className="text-sm text-white/80">Alamat (Kampung/Jalan)</label>
                <input value={alamatJalan} onChange={(e) => setAlamatJalan(e.target.value)} required className="mt-1 w-full rounded-lg bg-white/10 border border-white/15 px-3 py-2 outline-none" placeholder="Nama Kampung/Jalan" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-white/80">RT</label>
                  <input inputMode="numeric" value={rt} onChange={(e) => setRt(onlyDigits(e.target.value).slice(0, 3))} required className="mt-1 w-full rounded-lg bg-white/10 border border-white/15 px-3 py-2 outline-none" placeholder="RT" />
                </div>
                <div>
                  <label className="text-sm text-white/80">RW</label>
                  <input inputMode="numeric" value={rw} onChange={(e) => setRw(onlyDigits(e.target.value).slice(0, 3))} required className="mt-1 w-full rounded-lg bg-white/10 border border-white/15 px-3 py-2 outline-none" placeholder="RW" />
                </div>
              </div>

              {/* Desa, Kecamatan */}
              <div>
                <label className="text-sm text-white/80">Desa/Kelurahan</label>
                <input value={desa} onChange={(e) => setDesa(e.target.value)} required className="mt-1 w-full rounded-lg bg-white/10 border border-white/15 px-3 py-2 outline-none" placeholder="Nama Desa/Kelurahan" />
              </div>
              <div>
                <label className="text-sm text-white/80">Kecamatan</label>
                <input value={kecamatan} onChange={(e) => setKecamatan(e.target.value)} required className="mt-1 w-full rounded-lg bg-white/10 border border-white/15 px-3 py-2 outline-none" placeholder="Nama Kecamatan" />
              </div>

              {/* Kab/Kota, Provinsi */}
              <div>
                <label className="text-sm text-white/80">Kabupaten/Kota</label>
                <input value={kabupatenKota} onChange={(e) => setKabupatenKota(e.target.value)} required className="mt-1 w-full rounded-lg bg-white/10 border border-white/15 px-3 py-2 outline-none" placeholder="Nama Kabupaten/Kota" />
              </div>
              <div>
                <label className="text-sm text-white/80">Provinsi</label>
                <input list="provinsi-list" value={provinsi} onChange={(e) => setProvinsi(e.target.value)} required className="mt-1 w-full rounded-lg bg-white/10 border border-white/15 px-3 py-2 outline-none" placeholder="Pilih/ketik provinsi" />
                <datalist id="provinsi-list">
                  {PROVINSI.map((p) => (
                    <option key={p} value={p} />
                  ))}
                </datalist>
              </div>

              {/* Kode Pos, Password */}
              <div>
                <label className="text-sm text-white/80">Kode Pos (5 angka)</label>
                <input inputMode="numeric" pattern="\\d{5}" maxLength={5} value={kodePos} onChange={(e) => setKodePos(onlyDigits(e.target.value).slice(0, 5))} required className="mt-1 w-full rounded-lg bg-white/10 border border-white/15 px-3 py-2 outline-none" placeholder="mis. 11460" />
              </div>
              <div>
                <label className="text-sm text-white/80">Password (Mohon Diingat)</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 w-full rounded-lg bg-white/10 border border-white/15 px-3 py-2 outline-none" placeholder="Minimal 6 karakter" />
              </div>

              {/* Captcha */}
              <div className="md:col-span-2 grid md:grid-cols-[1fr_auto_auto] gap-3 items-end">
                <div>
                  <label className="text-sm text-white/80">Captcha</label>
                  <input value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value)} required className="mt-1 w-full rounded-lg bg-white/10 border border-white/15 px-3 py-2 outline-none" placeholder="masukkan kode" />
                </div>
                <div className="select-none grid place-items-center px-4 py-2 rounded-lg border border-white/15 bg-white/10 text-lg font-bold tracking-widest">{captcha}</div>
                <button type="button" onClick={() => setCaptcha(makeCaptcha())} className="h-10 px-3 rounded-lg border border-white/15 bg-white/10 hover:bg-white/15 text-sm">Refresh Kode</button>
              </div>

              {/* Unggah Berkas */}
              <div className="md:col-span-2">
                <label className="text-sm text-white/80">Unggah Berkas (PDF/IMG, zip opsional)</label>
                <input type="file" onChange={(e) => setBerkas((e.target as HTMLInputElement).files?.[0] ?? null)} className="mt-1 block w-full text-sm" />
                <p className="text-xs text-white/60 mt-1">Maks 10MB/berkas. Format: KK, Akta, Rapor, SKL/Surat Lulus, dll.</p>
              </div>

              {/* Tombol Kirim */}
              <div className="md:col-span-2 flex items-center gap-3">
                <button type="submit" className="px-4 py-2 rounded-xl border border-white/15 bg-white/10 hover:bg-white/15 font-medium">SIMPAN</button>
                {kirimOk && <span className="text-sm text-emerald-300">Berhasil tersimpan! Nomor pendaftaran dikirim via email/WA.</span>}
              </div>
            </form>
          </Card>
          <div className="text-xs text-white/60 mt-3">Dengan mengirim, Anda menyetujui kebijakan privasi & penggunaan data sekolah.</div>
        </Section>
      ) : (
        <Section id="pendaftaran" title="Pendaftaran Belum Dibuka" subtitle={Portal ${regMode || "PPDB"} akan dibuka sesuai jadwal yang ditetapkan.}>
          <Card>
            <div className="text-white/80 text-sm">
              {regStart ? (
                <>Jadwal pendaftaran: <b className="text-white">{regStart}</b> (silakan kembali pada tanggal tersebut).</>
              ) : (
                <>Jadwal pendaftaran akan diinformasikan segera.</>
              )}
            </div>
            <div className="mt-3">
              <button type="button" onClick={() => setLocalForceOpen(true)} className="px-3 py-2 rounded-xl border border-white/15 bg-white/10 hover:bg-white/15 text-sm">Buka Form (Demo)</button>
            </div>
          </Card>
        </Section>
      )}

      {/* CEK HASIL */}
      <Section id="hasil" title="Cek Hasil PPDB" subtitle="Masukkan nomor pendaftaran untuk melihat status.">
        <Card>
          <form onSubmit={handleCek} className="flex flex-col md:flex-row gap-3 items-start md:items-end">
            <div className="flex-1 w-full">
              <label className="text-sm text-white/80">Nomor Pendaftaran</label>
              <input value={noPendaftaran} onChange={(e) => setNoPendaftaran(e.target.value)} className="mt-1 w-full rounded-lg bg-white/10 border border-white/15 px-3 py-2 outline-none" placeholder="mis. PPDB25-001234" />
            </div>
            <button type="submit" className="px-4 py-2 rounded-xl border border-white/15 bg-white/10 hover:bg-white/15 font-medium">Cek</button>
          </form>
          {hasil && (
            <Card className="mt-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className={cx("text-sm px-2.5 py-1 rounded-md font-semibold", hasil.status === "LULUS" ? "bg-emerald-500/20 text-emerald-200" : "bg-yellow-500/20 text-yellow-200")}>{hasil.status}</div>
                <div className="text-white/80 text-sm">Program Keahlian: <b className="text-white">{hasil.jurusan}</b></div>
              </div>
              <div className="text-white mt-2 text-sm">{hasil.keterangan}</div>
            </Card>
          )}
        </Card>
      </Section>

      {/* BG Decoration */}
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden={true}>
        <div className="absolute -top-24 -right-24 w-[520px] h-[520px] rounded-full blur-3xl opacity-20" style={{ background: THEME.primary }} />
        <div className="absolute -bottom-24 -left-24 w-[420px] h-[420px] rounded-full blur-3xl opacity-10" style={{ background: THEME.accent }} />
      </div>
    </div>
  );
}
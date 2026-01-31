import React, { useMemo, useState, useEffect } from "react";
import {
  Sparkles,
  Mic,
  UploadCloud,
  Download,
  FileText,
  Brain,
  Stars,
  Search,
  Filter,
  Share2,
  History as HistoryIcon,
  Loader2,
  Trash2,
  QrCode,
  Phone,
  Mail,
} from "lucide-react";

// shadcn/ui
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/core/libs";
import { Button } from "@/core/libs";
import { Input } from "@/core/libs";
import { Badge } from "@/core/libs";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/core/libs";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/core/libs";
import { Textarea } from "@/core/libs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/core/libs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/libs";
import { ScrollArea } from "@/core/libs";
import { Switch } from "@/core/libs";
import { QRCodeSVG } from "qrcode.react";

// ---------------------------------------------------------------
// Types & Demo data – in real app fetched from API
export type Session = {
  id: string;
  date: string;
  class: string;
  subject: string;
  teacher: string;
  duration: number;
  lang: string;
  sentiment: "positive" | "neutral" | "negative";
  tldr: string;
  keyPoints: string[];
  pr: string[];
  photo?: string; // Added for photo evidence
};

const demoSessions: Session[] = [
  {
    id: "S-240826-1",
    date: "2025-08-26 08:15",
    class: "XII DKV-1",
    subject: "Desain Grafis",
    teacher: "Ibu Wulan",
    duration: 43,
    lang: "id",
    sentiment: "positive",
    tldr:
      "Komposisi layout majalah: prinsip grid, hirarki tipografi, dan latihan membuat mockup halaman.",
    keyPoints: [
      "Grid 12 kolom & margin konsisten",
      "Hirarki: H1/H2/body, leading & tracking",
      "Studi kasus: majalah sekolah edisi OSIS",
    ],
    pr: ["Buat 2 variasi layout halaman artikel 2 kolom (PDF)"],
    photo: undefined, // Optional photo field
  },
  {
    id: "S-240825-3",
    date: "2025-08-25 10:00",
    class: "XI TKJ-2",
    subject: "Jaringan Komputer",
    teacher: "Pak Bima",
    duration: 48,
    lang: "id",
    sentiment: "neutral",
    tldr:
      "Pengenalan VLAN, segmentasi jaringan, dan simulasi trunking di Packet Tracer.",
    keyPoints: [
      "VLAN ID, Access vs Trunk",
      "802.1Q Tagging",
      "Keamanan dasar: isolasi broadcast domain",
    ],
    pr: ["Kerjakan modul 3: konfigurasi 3 VLAN + trunk"],
    photo: undefined,
  },
  {
    id: "S-240825-3",
    date: "2025-08-25 10:00",
    class: "XI TKJ-2",
    subject: "Jaringan Komputer",
    teacher: "Pak Bima",
    duration: 48,
    lang: "id",
    sentiment: "neutral",
    tldr:
      "Pengenalan VLAN, segmentasi jaringan, dan simulasi trunking di Packet Tracer.",
    keyPoints: [
      "VLAN ID, Access vs Trunk",
      "802.1Q Tagging",
      "Keamanan dasar: isolasi broadcast domain",
    ],
    pr: ["Kerjakan modul 3: konfigurasi 3 VLAN + trunk"],
    photo: undefined,
  },
  {
    id: "S-240825-3",
    date: "2025-08-25 10:00",
    class: "XI TKJ-2",
    subject: "Jaringan Komputer",
    teacher: "Pak Bima",
    duration: 48,
    lang: "id",
    sentiment: "neutral",
    tldr:
      "Pengenalan VLAN, segmentasi jaringan, dan simulasi trunking di Packet Tracer.",
    keyPoints: [
      "VLAN ID, Access vs Trunk",
      "802.1Q Tagging",
      "Keamanan dasar: isolasi broadcast domain",
    ],
    pr: ["Kerjakan modul 3: konfigurasi 3 VLAN + trunk"],
    photo: undefined,
  },
  {
    id: "S-240825-3",
    date: "2025-08-25 10:00",
    class: "XI TKJ-2",
    subject: "Jaringan Komputer",
    teacher: "Pak Bima",
    duration: 48,
    lang: "id",
    sentiment: "neutral",
    tldr:
      "Pengenalan VLAN, segmentasi jaringan, dan simulasi trunking di Packet Tracer.",
    keyPoints: [
      "VLAN ID, Access vs Trunk",
      "802.1Q Tagging",
      "Keamanan dasar: isolasi broadcast domain",
    ],
    pr: ["Kerjakan modul 3: konfigurasi 3 VLAN + trunk"],
    photo: undefined,
  },
  {
    id: "S-240825-3",
    date: "2025-08-25 10:00",
    class: "XI TKJ-2",
    subject: "Jaringan Komputer",
    teacher: "Pak Bima",
    duration: 48,
    lang: "id",
    sentiment: "neutral",
    tldr:
      "Pengenalan VLAN, segmentasi jaringan, dan simulasi trunking di Packet Tracer.",
    keyPoints: [
      "VLAN ID, Access vs Trunk",
      "802.1Q Tagging",
      "Keamanan dasar: isolasi broadcast domain",
    ],
    pr: ["Kerjakan modul 3: konfigurasi 3 VLAN + trunk"],
    photo: undefined,
  },
  {
    id: "S-240825-3",
    date: "2025-08-25 10:00",
    class: "XI TKJ-2",
    subject: "Jaringan Komputer",
    teacher: "Pak Bima",
    duration: 48,
    lang: "id",
    sentiment: "neutral",
    tldr:
      "Pengenalan VLAN, segmentasi jaringan, dan simulasi trunking di Packet Tracer.",
    keyPoints: [
      "VLAN ID, Access vs Trunk",
      "802.1Q Tagging",
      "Keamanan dasar: isolasi broadcast domain",
    ],
    pr: ["Kerjakan modul 3: konfigurasi 3 VLAN + trunk"],
    photo: undefined,
  },
];

const roleBadges: Record<string, string> = {
  guru: "Guru",
  siswa: "Siswa",
  ortu: "Orang Tua",
  admin: "Admin",
};

// Keep the TL;DR label as a constant for tests
const TLDR_LABEL = "Ringkasan super-singkat (1–3 kalimat)";

// Business rule: Auto Share default ON only for guru
const getDefaultAutoShare = (role: "guru" | "siswa" | "ortu" | "admin") => role === "guru";

function StarRating({ value = 0, onChange }: { value?: number; onChange?: (v: number) => void }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex items-center gap-1">
      {stars.map((s) => (
        <button
          key={s}
          className={`p-1 transition ${value >= s ? "text-teal-600 dark:text-teal-400" : "text-gray-400 dark:text-gray-500 hover:text-teal-500 dark:hover:text-teal-300"}`}
          onClick={() => onChange?.(s)}
          aria-label={`rating-${s}`}
        >
          <Stars className="w-5 h-5" />
        </button>
      ))}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</span>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------
// Runtime smoke tests
function runDevTests() {
  try {
    console.groupCollapsed("RangkumanAI – dev tests");
    console.assert(Array.isArray(demoSessions) && demoSessions.length >= 2, "demoSessions should have >= 2 items");

    const requiredKeys: (keyof Session)[] = [
      "id", "date", "class", "subject", "teacher", "duration", "lang", "sentiment", "tldr", "keyPoints", "pr",
    ];
    for (const s of demoSessions) {
      for (const k of requiredKeys) console.assert(k in s, `Session missing key: ${String(k)}`);
      console.assert(typeof s.tldr === "string" && s.tldr.length > 10, "TL;DR should be non-empty string");
      console.assert(Array.isArray(s.keyPoints) && s.keyPoints.length > 0, "keyPoints should be non-empty array");
      console.assert(Array.isArray(s.pr) && s.pr.length > 0, "pr should be non-empty array");
    }

    ["guru", "siswa", "ortu", "admin"].forEach((r) => console.assert(r in roleBadges, `role badge missing: ${r}`));
    console.assert(TLDR_LABEL.includes("Ringkasan"), "TLDR_LABEL missing/changed");
    console.assert(getDefaultAutoShare("guru") === true, "autoShare should default ON for guru");
    console.assert(!getDefaultAutoShare("siswa") && !getDefaultAutoShare("ortu") && !getDefaultAutoShare("admin"), "autoShare default OFF for others");

    console.groupEnd();
  } catch (e) {
    console.error("Dev tests failed", e);
  }
}
if (typeof window !== "undefined") runDevTests();

// ---------------------------------------------------------------
// Main component
export default function AllSummarizes() {
  const [role, setRole] = useState<"guru" | "siswa" | "ortu" | "admin">("guru");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Session | null>(demoSessions[0]);
  const [open, setOpen] = useState(false);
  const [autoShare, setAutoShare] = useState(getDefaultAutoShare("guru"));
  const [rating, setRating] = useState(0);
  const [qrOpen, setQrOpen] = useState(false);
  const [lastTaskInfo, setLastTaskInfo] = useState<string | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");

  useEffect(() => {
    setAutoShare(getDefaultAutoShare(role));
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [role, photoPreview]);

  const filtered = useMemo(() => {
    return demoSessions.filter((s) =>
      (s.subject + s.class + s.teacher + s.tldr).toLowerCase().includes(q.toLowerCase())
    );
  }, [q]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (!validTypes.includes(file.type)) {
        alert("Hanya file JPEG, PNG, atau GIF yang diperbolehkan.");
        return;
      }
      if (file.size > maxSize) {
        alert("Ukuran file maksimum adalah 5MB.");
        return;
      }
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    } else {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
      setPhoto(null);
      setPhotoPreview("");
    }
  };

  const handleProcessWithAI = () => {
    if (!photo && !selected) return;
    const payload = {
      sessionId: selected?.id,
      photo: photo ? photo.name : undefined,
    };
    console.log("[AI PROCESS] Payload:", payload);
    // Simulate updating the selected session with the photo
    if (selected && photo) {
      setSelected({ ...selected, photo: photo.name });
    }
  };

  const handleExportPDF = () => {
    if (!selected) return;
    const url = `https://xpresensi.app/sessions/${selected.id}`;
    const printable = window.open("", "_blank", "noopener,noreferrer");
    if (printable) {
      printable.document.write(`<!doctype html><html><head><meta charset='utf-8'>
        <title>Rangkuman ${selected.subject}</title>
        <style>
          body{font-family:ui-sans-serif,system-ui;margin:40px;background:#f9fafb;}
          h1{font-size:20px;margin:0 0 8px;color:#1f2937;}
          h2{font-size:16px;margin:16px 0 8px;color:#1f2937;}
          ul{margin:0 0 8px 18px;}
          .muted{color:#6b7280;}
          img{max-width:100%;max-height:200px;border-radius:8px;border:1px solid #e5e7eb;}
          @media (prefers-color-scheme: dark) {
            body{background:#1f2a44;}
            h1,h2{color:#ffffff;}
            .muted{color:#9ca3af;}
            img{border:1px solid #4b5563;}
          }
        </style></head><body>`);
      printable.document.write(`<h1>Rangkuman AI – ${selected.subject} (${selected.class})</h1>`);
      printable.document.write(`<div class='muted'>Tanggal: ${selected.date} • Durasi: ${selected.duration} menit • ${selected.lang.toUpperCase()}</div>`);
      printable.document.write(`<h2>TL;DR</h2><p>${selected.tldr}</p>`);
      printable.document.write(`<h2>Poin-Poin Utama</h2><ul>${selected.keyPoints.map(k=>`<li>${k}</li>`).join("")}</ul>`);
      printable.document.write(`<h2>Tugas / PR</h2><ul>${selected.pr.map(k=>`<li>${k}</li>`).join("")}</ul>`);
      if (selected.photo) {
        printable.document.write(`<h2>Bukti Foto</h2><div class='muted'>Nama file: ${selected.photo}</div>`);
      }
      printable.document.write(`<h2>Glosarium</h2><ul><li>Grid – Sistem kolom untuk menyusun layout agar konsisten.</li><li>Leading – Jarak antarbaris pada tipografi.</li><li>Tracking – Spasi keseluruhan antar huruf.</li></ul>`);
      printable.document.write(`<h2>QR</h2><div class='muted'>Scan melalui menu QR di aplikasi: ${url}</div>`);
      printable.document.write(`</body></html>`);
      printable.document.close();
    }
  };

  const handleSendToTodo = () => {
    if (!selected) return;
    const recipients = { siswa: true, orangTuaKelas: true, admin: true };
    const payload = { sessionId: selected.id, class: selected.class, subject: selected.subject, recipients, photo: selected.photo };
    console.log("Create Task Payload", payload);
    setLastTaskInfo(`Tugas dibuat untuk siswa + orang tua kelas ${selected.class} + admin`);
  };

  return (
    <div className="min-h-screen p-8 text-gray-800 dark:text-white">
      {/* glossy overlay */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/10 opacity-40 dark:from-white/10 dark:to-white/0" />
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full" />
      </div>
      <style>
        {`
          select option {
            background: #F9FAFB !important;
            color: #1F2937;
          }
          select option:checked,
          select option:hover {
            background: #14B8A6 !important;
            color: #FFFFFF;
          }
          @media (prefers-color-scheme: dark) {
            select option {
              background: #1F2A44 !important;
              color: #FFFFFF;
            }
            select option:checked,
            select option:hover {
              background: #14B8A6 !important;
              color: #FFFFFF;
            }
          }
        `}
      </style>

      {/* header */}
      <div className="w-full border-b border-white/10 pb-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-xl font-semibold tracking-tight">
            Rangkuman mata pelajaran
          </h1>
          <p className="text-gray-300 dark:text-gray-400 mt-1">
            Dashboard layanan untuk Guru & Tendik
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="relative mt-4 z-10 rounded-md dark:border-gray-700 bg-neutral-900/60">
        <div className="max-w-full rounded-lg mx-auto px-4 py-3 border border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            <div>
              <div className="text-lg font-semibold text-gray-800 dark:text-white">Dashboard Rangkuman AI (Whisper)</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Transkrip • Ringkasan • PR • Notifikasi • Histori</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={role} onValueChange={(v: any) => { setRole(v); }}>
              <SelectTrigger className="w-[160px] bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white">
                <SelectValue placeholder="Peran" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
                <SelectItem value="guru">Guru</SelectItem>
                <SelectItem value="siswa">Siswa</SelectItem>
                <SelectItem value="ortu">Orang Tua</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400 dark:text-gray-500" />
              <Input
                className="pl-8 w-[260px] bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white rounded-lg"
                placeholder="Cari kelas/mata pelajaran/ringkasan…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <Button className="bg-teal-600 dark:bg-teal-700 text-white gap-2 hover:bg-teal-500 dark:hover:bg-teal-600 transition-all duration-300 transform" onClick={handleExportPDF}>
              <Download className="w-4 h-4" /> Export PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full mx-auto py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Capture / Upload / Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-neutral-900/60 border-gray-200 dark:border-white/10 rounded-xl shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white"><Mic className="w-5 h-5 text-teal-600 dark:text-teal-400" /> Rekam / Upload Audio & Foto</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">Unggah rekaman pelajaran, rapat OSIS, atau bimbingan belajar, serta bukti foto (opsional).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center">
                <UploadCloud className="w-8 h-8 mx-auto mb-2 text-teal-600 dark:text-teal-400" />
                <div className="text-sm text-gray-500 dark:text-gray-400">Tarik & lepas berkas audio di sini (mp3, m4a, wav) atau</div>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <Button className="bg-teal-600 dark:bg-teal-700 text-white gap-2 hover:bg-teal-500 dark:hover:bg-teal-600 transition-all duration-300 transform">
                    <UploadCloud className="w-4 h-4"/>Pilih Berkas
                  </Button>
                  <Button variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 gap-2">
                    <Mic className="w-4 h-4"/>Mulai Rekam
                  </Button>
                </div>
              </div>
              {/* <div className="space-y-3">
                <label className="block text-sm text-gray-700 dark:text-gray-200">
                  Bukti Foto (opsional, maks 5MB, JPEG/PNG/GIF)
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleFileChange}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-teal-500 w-full"
                  aria-label="Upload photo evidence"
                />
                {photoPreview && (
                  <div className="mt-2">
                    <img
                      src={photoPreview}
                      alt="Photo preview"
                      className="max-w-full h-auto rounded-lg border border-gray-200 dark:border-gray-600"
                      style={{ maxHeight: "200px" }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (photoPreview) {
                          URL.revokeObjectURL(photoPreview);
                        }
                        setPhoto(null);
                        setPhotoPreview("");
                      }}
                      className="mt-2 text-sm text-red-500 dark:text-red-400 hover:underline"
                      aria-label="Remove photo"
                    >
                      Hapus Foto
                    </button>
                  </div>
                )}
              </div> */}
              <div className="flex flex-col items-start justify-between">
                <div className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-200">
                  <Switch checked={autoShare} onCheckedChange={setAutoShare} className="data-[state=checked]:bg-teal-600 border border-white/10" />
                  <span>Otomatis bagikan ke siswa & orang tua</span>
                </div>
                <Button className="w-full mt-4 bg-teal-600 dark:bg-teal-600 text-white gap-2 hover:bg-teal-500 dark:hover:bg-teal-700 transition-all duration-300 transform" onClick={handleProcessWithAI}>
                  <Sparkles className="w-4 h-4"/> Proses dengan AI
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900/60 border-gray-200 dark:border-white/10 rounded-xl shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white"><HistoryIcon className="w-5 h-5 text-teal-600 dark:text-teal-400"/> Filter Histori</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">Saring berdasarkan kelas, mapel, rentang tanggal.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Field label="Kelas">
                <Select>
                  <SelectTrigger className="bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white rounded-lg">
                    <SelectValue placeholder="Semua kelas"/>
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="x-dkv">X DKV</SelectItem>
                    <SelectItem value="xi-tkj">XI TKJ</SelectItem>
                    <SelectItem value="xii-dkv1">XII DKV-1</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Mapel">
                <Select>
                  <SelectTrigger className="bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white rounded-lg">
                    <SelectValue placeholder="Semua mapel"/>
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="desain">Desain Grafis</SelectItem>
                    <SelectItem value="jaringan">Jaringan Komputer</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Tanggal Mulai">
                <Input type="date" className="bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white rounded-lg"/>
              </Field>
              <Field label="Tanggal Selesai">
                <Input type="date" className="bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white rounded-lg"/>
              </Field>
              <Button variant="outline" className="col-span-2 gap-2 py-4 border-gray-300 dark:border-gray-600 bg-teal-600 dark:bg-teal-600 text-white hover:bg-teal-500 dark:hover:bg-teal-700 transition-all duration-300 transform">
                <Filter className="w-4 h-4"/> Terapkan Filter
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: List & Detail */}
        <div className="relative w-full lg:col-span-2 space-y-6">
          <Card className="bg-neutral-900/60 border-gray-200 dark:border-white/10 rounded-xl shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-gray-800 dark:text-white">Histori Sesi</CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">Daftar sesi dengan ringkasan cepat dan aksi.</CardDescription>
              </div>
              <Badge className="bg-teal-600 dark:bg-teal-700 text-white">Peran: {roleBadges[role]}</Badge>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-white">
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Kelas</TableHead>
                    <TableHead>Mapel</TableHead>
                    <TableHead>Guru</TableHead>
                    <TableHead>Durasi</TableHead>
                    {/* <TableHead>Ringkas</TableHead> */}
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((s) => (
                    <TableRow key={s.id} className="hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                      <TableCell className="text-gray-800 dark:text-white">{s.date}</TableCell>
                      <TableCell className="text-gray-800 dark:text-white">{s.class}</TableCell>
                      <TableCell className="text-gray-800 dark:text-white">{s.subject}</TableCell>
                      <TableCell className="text-gray-800 dark:text-white">{s.teacher}</TableCell>
                      <TableCell className="text-gray-800 dark:text-white">{s.duration} mnt</TableCell>
                      {/* <TableCell className="max-w-[360px] truncate text-gray-800 dark:text-white" title={s.tldr}>{s.tldr}</TableCell> */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 transform" onClick={() => {setSelected(s); setOpen(true);}}>
                            <FileText className="w-4 h-4 mr-1"/> Detail
                          </Button>
                          <Button size="sm" className="bg-teal-600 dark:bg-teal-700 text-white gap-1 hover:bg-teal-500 dark:hover:bg-teal-600 transition-all duration-300 transform">
                            <Share2 className="w-4 h-4"/> Bagikan
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Detail Drawer / Dialog */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent className="min-w-[50vw] h-[100vh] overflow-y-auto max-w-[500px] bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-l border-gray-200 dark:border-white/10 rounded-l-xl shadow-2xl text-gray-800 dark:text-white p-0">
            <SheetHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <SheetTitle className="flex items-center gap-3 text-gray-800 dark:text-white">
                <FileText className="w-5 h-5 text-teal-600 dark:text-teal-400" /> Detail Rangkuman – {selected?.subject} ({selected?.class})
              </SheetTitle>
            </SheetHeader>
            <div className="p-6 h-max">
              {selected ? (
                <div className="flex flex-col gap-6">
                  {/* Column A: Player & Meta */}
                  <div className="w-full h-max flex items-center gap-6">
                    <Card className="w-1/2 min-h-[280px] bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600 rounded-xl shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-base text-gray-800 dark:text-white">Audio & Metadata</CardTitle>
                        <CardDescription className="text-gray-500 dark:text-gray-400">{selected.date} • {selected.duration} menit • {selected.lang.toUpperCase()}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="rounded-xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600">
                          <audio controls className="w-full">
                            <source src="/demo-audio.mp3" type="audio/mpeg" />
                          </audio>
                        </div>
                        {selected.photo && (
                          <div>
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-200">Bukti Foto</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{selected.photo}</div>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <Badge
                            className={`${
                              selected.sentiment === "positive" ? "bg-green-600" :
                              selected.sentiment === "neutral" ? "bg-blue-600" :
                              "bg-red-600"
                            } text-white`}
                          >
                            {selected.sentiment}
                          </Badge>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 transform"
                              onClick={handleExportPDF}
                            >
                              <Download className="w-4 h-4 mr-1" /> PDF
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4 mr-1" /> Hapus
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="w-1/2 min-h-[280px] bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600 rounded-xl shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-base text-gray-800 dark:text-white">Rating & Masukan</CardTitle>
                        <CardDescription className="text-gray-500 dark:text-gray-400">Beri penilaian kepuasan materi per sesi.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <StarRating value={rating} onChange={setRating} />
                        <Textarea
                          placeholder="Tulis komentar singkat…"
                          className="bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white rounded-lg"
                        />
                        <div className="flex justify-end">
                          <Button
                            className="bg-teal-600 dark:bg-teal-700 text-white gap-1 hover:bg-teal-500 dark:hover:bg-teal-600 transition-all duration-300 transform"
                          >
                            <Stars className="w-4 h-4" /> Kirim
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Column B: TL;DR + Keypoints + PR */}
                  <div className="space-y-4 h-[70vh] lg:col-span-2">
                    <Card className="bg-gray-50 h-[45%] dark:bg-gray-700/30 border-gray-200 dark:border-gray-600 rounded-xl shadow-lg">
                      <CardHeader className="flex items-start justify-start">
                        <div>
                          <CardTitle className="text-base text-gray-800 dark:text-white">TL;DR</CardTitle>
                          <CardDescription className="text-gray-500 dark:text-gray-400">{TLDR_LABEL}</CardDescription>
                        </div>
                        <br />
                        <Button
                          variant="outline"
                          size="sm"
                          className="px-3 py-4 gap-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 transition-all duration-300 transform hover:brightness-[90%]"
                          onClick={() => setQrOpen(true)}
                        >
                          <QrCode className="w-4 h-4" /> Tampilkan QR
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <p className="leading-relaxed text-gray-800 dark:text-white">{selected.tldr}</p>
                      </CardContent>
                    </Card>

                    <Tabs defaultValue="transkrip" className="h-max pb-3 pt-2">
                      <TabsList className="bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <TabsTrigger value="transkrip" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">Transkrip</TabsTrigger>
                        <TabsTrigger value="glosarium" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">Rangkuman</TabsTrigger>
                        {/* <TabsTrigger value="keamanan" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">Keamanan</TabsTrigger> */}
                      </TabsList>
                      <TabsContent value="transkrip" className="h-full overflow-hidden pb-2 mt-4">
                        <Card className="h-full overflow-y-auto bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600 rounded-xl shadow-lg">
                          <CardHeader><CardTitle className="text-base text-gray-800 dark:text-white">Transkrip dengan Timestamp</CardTitle></CardHeader>
                          <CardContent>
                            <ScrollArea className="h-full overflow-y-auto pr-4">
                              <div className="space-y-2 text-gray-700 dark:text-gray-200">
                                {[...Array(19)].map((_, i) => (
                                  <div key={i} className="flex gap-3">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 w-16">00:{String(i).padStart(2, "0")}</span>
                                    <p>Kalimat contoh transkrip ke‑{i + 1} yang menjelaskan materi inti sesi pelajaran hari ini…</p>
                                  </div>
                                ))}
                              </div>
                            </ScrollArea>
                          </CardContent>
                        </Card>
                      </TabsContent>
                      <TabsContent value="glosarium">
                        <Card className="bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600 rounded-xl shadow-lg">
                          <CardHeader><CardTitle className="text-base text-gray-800 dark:text-white">Istilah Penting</CardTitle></CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {[
                                { term: "Grid", def: "Sistem kolom untuk menyusun layout agar konsisten." },
                                { term: "Leading", def: "Jarak antarbaris pada tipografi." },
                                { term: "Tracking", def: "Spasi keseluruhan antar huruf." },
                              ].map((g, i) => (
                                <div key={i} className="p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
                                  <div className="font-semibold text-gray-800 dark:text-white">{g.term}</div>
                                  <div className="text-gray-700 dark:text-gray-200 text-sm">{g.def}</div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                      <TabsContent value="keamanan">
                        <Card className="bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600 rounded-xl shadow-lg">
                          <CardHeader><CardTitle className="text-base text-gray-800 dark:text-white">Pemeriksaan Keamanan & Sensitivitas</CardTitle></CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
                              <div>
                                <div className="font-medium text-gray-800 dark:text-white">Deteksi kata sensitif</div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">Tidak ditemukan kata yang perlu ditinjau.</div>
                              </div>
                              <Badge className="bg-green-600 text-white">Aman</Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
                              <div>
                                <div className="font-medium text-gray-800 dark:text-white">Kesamaan materi</div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">Tidak ada kemiripan tinggi dengan sesi sebelumnya.</div>
                              </div>
                              <Badge className="bg-blue-600 text-white">OK</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 p-6"><Loader2 className="w-4 h-4 animate-spin" /> Memuat…</div>
              )}
            </div>
            </SheetContent>
          </Sheet>

          {/* QR POPUP */}
          <Dialog open={qrOpen} onOpenChange={setQrOpen}>
            <DialogContent className="max-w-sm bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-gray-200 dark:border-gray-600 rounded-xl shadow-2xl text-gray-800 dark:text-white">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2"><QrCode className="w-5 h-5 text-teal-600 dark:text-teal-400"/> Kode QR Sesi</DialogTitle>
              </DialogHeader>
              {selected ? (
                <div className="flex flex-col items-center gap-3">
                  <QRCodeSVG value={`https://xpresensi.app/sessions/${selected.id}`} size={200} />
                  <div className="text-xs text-gray-600 dark:text-gray-400">Scan untuk membuka sesi {selected.subject} – {selected.class}</div>
                </div>
              ) : null}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <footer className="py-8 text-center text-gray-400 dark:text-gray-400">© 2023–2025 Xpresensi • Rangkuman AI • Whisper</footer>
    </div>
  );
}
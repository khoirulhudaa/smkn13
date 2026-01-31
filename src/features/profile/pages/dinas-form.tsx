
import React from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  School,
  MapPin,
  Activity,
  ShieldCheck,
  FileText,
  MessageSquare,
  Bell,
  Building2,
  Network,
  Database,
  Settings,
  BookOpenCheck,
  Radar,
  SquareStack,
  RefreshCcw,
  History,
  Globe,
  ChevronRight,
  Download,
  UploadCloud,
  ClipboardList,
  Fingerprint,
  Map,
  Key,
  Library,
  UserCog,
  Layers,
} from "lucide-react";

// shadcn/ui
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/libs";
import { Button } from "@/core/libs";
import { Input } from "@/core/libs";
import { Badge } from "@/core/libs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/core/libs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/libs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/libs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/core/libs";
import { Progress } from "@/core/libs";
import { Separator } from "@/core/libs";
import { Avatar, AvatarFallback, AvatarImage } from "@/core/libs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/core/libs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/core/libs";
import { Switch } from "@/core/libs";

// charts
import {
  ResponsiveContainer,
  XAxis,
  Tooltip as RTooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/*************************
 * MOCK DATA
 *************************/
const kpis = [
  { label: "Total Sekolah", value: 142, icon: School, trend: "+6" },
  { label: "Guru Aktif", value: 3245, icon: Users, trend: "+2.1%" },
  { label: "Sesi Presensi Hari Ini", value: 18430, icon: Activity, trend: "+4.2%" },
  { label: "Laporan Layanan", value: 127, icon: MessageSquare, trend: "-8%" },
];

const presensiSeries = [
  { name: "Sen", hadird: 88, telat: 7 },
  { name: "Sel", hadird: 90, telat: 6 },
  { name: "Rab", hadird: 93, telat: 5 },
  { name: "Kam", hadird: 91, telat: 6 },
  { name: "Jum", hadird: 95, telat: 4 },
];

const pieData = [
  { name: "Hadir", value: 86 },
  { name: "Izin", value: 6 },
  { name: "Sakit", value: 5 },
  { name: "Alpha", value: 3 },
];

const COLORS = ["#2563eb", "#22c55e", "#eab308", "#ef4444"];

const schools = [
  { npsn: "20201111", name: "SMPN 5 Bandung", kec: "Cicendo", kab: "Bandung", prov: "Jawa Barat", lastSync: "07:32", sla: 99.4, risk: "Low" },
  { npsn: "20202222", name: "SMAN 3 Bandung", kec: "Coblong", kab: "Bandung", prov: "Jawa Barat", lastSync: "07:29", sla: 98.1, risk: "Medium" },
  { npsn: "20203333", name: "SDN 12 Cibadak", kec: "Astanaanyar", kab: "Bandung", prov: "Jawa Barat", lastSync: "07:40", sla: 96.5, risk: "High" },
  { npsn: "20204444", name: "SMKN 7 Bandung", kec: "Batununggal", kab: "Bandung", prov: "Jawa Barat", lastSync: "07:35", sla: 99.9, risk: "Low" },
];

const incidents = [
  { id: "INC-8451", school: "SDN 12 Cibadak", type: "Server LAN Down", severity: "High", status: "Open", eta: "2h", owner: "Teknisi A" },
  { id: "INC-8452", school: "SMAN 3 Bandung", type: "SINKRON Dapodik", severity: "Medium", status: "Investigate", eta: "4h", owner: "Teknisi B" },
  { id: "INC-8453", school: "SMPN 5 Bandung", type: "Kamera Presensi", severity: "Low", status: "Scheduled", eta: "Besok", owner: "Teknisi C" },
];

const serviceItems = [
  { id: 1, kategori: "Kebersihan Toilet", target: 90, real: 82 },
  { id: 2, kategori: "Keamanan Area", target: 95, real: 92 },
  { id: 3, kategori: "Kedisiplinan Jam", target: 96, real: 93 },
  { id: 4, kategori: "Respon Aduan", target: 90, real: 88 },
];

const pengumuman = [
  { id: 1, title: "Audit Data Semester Ganjil", body: "Mulai 1 Sep – 15 Sep. Pastikan presensi & jadwal valid.", time: "Baru saja" },
  { id: 2, title: "Maintenance Terjadwal", body: "WAF & LB upgrade 28 Agu 00:00–02:00 WIB.", time: "1 jam lalu" },
];

/*************************
 * REGION HIERARCHY (Provinsi → Kab/Kota → Kecamatan)
 *************************/
const REGION = {
  provinsi: ["Jawa Barat", "DKI Jakarta", "Lampung"],
  kabupatenByProv: {
    "Jawa Barat": ["Bandung", "Kota Cimahi"],
    "DKI Jakarta": ["Jakarta Barat", "Jakarta Timur"],
    "Lampung": ["Bandar Lampung", "Lampung Selatan"],
  },
  kecamatanByKab: {
    "Bandung": ["Coblong", "Cicendo", "Astanaanyar", "Batununggal"],
    "Kota Cimahi": ["Cimahi Utara", "Cimahi Tengah"],
    "Jakarta Barat": ["Kebon Jeruk", "Palmerah"],
    "Jakarta Timur": ["Cipayung", "Duren Sawit"],
    "Bandar Lampung": ["Tanjung Karang Pusat", "Kedaton"],
    "Lampung Selatan": ["Kalianda", "Natar"],
  },
};

/*************************
 * SIDEBAR MENU CONFIG
 *************************/
const SIDEBAR_MENU = [
  // Dashboard & Summary
  { key: "dashboard", icon: LayoutDashboard, label: "Dashboard", active: true },
  { key: "daftar-sekolah", icon: School, label: "Daftar Sekolah" },

  // Presensi & Data
  { key: "manajemen-kehadiran", icon: Activity, label: "Manajemen Kehadiran" },
  { key: "absen-manual", icon: Fingerprint, label: "Absen Manual" },
  { key: "manajemen-data", icon: ClipboardList, label: "Manajemen Data" },
  { key: "sebaran-lokasi", icon: Map, label: "Sebaran Lokasi Siswa" },
  { key: "data-perizinan", icon: Key, label: "Data Perizinan" },

  // Layanan & Perpustakaan
  { key: "perpustakaan", icon: Library, label: "Perpustakaan" },
  { key: "aduan", icon: MessageSquare, label: "Aduan & Aspirasi" },
  { key: "layanan", icon: BookOpenCheck, label: "Evaluasi Layanan" },

  // Integrasi & Pengawas
  { key: "hub-dinas", icon: Building2, label: "Hub Dinas & Pengawas" },
  { key: "wilayah", icon: Layers, label: "Integrasi Wilayah" },

  // Analitik & Audit
  { key: "heatmap", icon: MapPin, label: "Heatmap Evaluasi" },
  { key: "kepatuhan", icon: ShieldCheck, label: "Kepatuhan & Audit" },
  { key: "laporan", icon: FileText, label: "Laporan & Ekspor" },

  // Infrastruktur & Pengaturan
  { key: "infra", icon: Network, label: "Infrastruktur & LAN" },
  { key: "manajemen-admin", icon: UserCog, label: "Manajemen Admin" },
  { key: "pengaturan", icon: Settings, label: "Pengaturan" },
];

/*************************
 * TABLE HEADERS (includes Kecamatan/Kab/Provinsi)
 *************************/
const HEADERS = [
  "NPSN",
  "Sekolah",
  "Kecamatan",
  "Kab/Kota",
  "Provinsi",
  "Last Sync",
  "SLA",
  "Risiko",
  "Aksi",
];

/*************************
 * MAIN COMPONENT
 *************************/
export const EditProfileForm = () => {
  // Region state lifted to top-level for global filtering
  const [prov, setProv] = React.useState(REGION.provinsi[0]);
  const kabs = REGION.kabupatenByProv[prov] || [];
  const [kab, setKab] = React.useState(kabs[0]);
  const kecs = REGION.kecamatanByKab[kab] || [];
  const [kec, setKec] = React.useState("Semua");

  React.useEffect(() => {
    // when prov changes, reset kab and kec
    const nextKabs = REGION.kabupatenByProv[prov] || [];
    setKab(nextKabs[0]);
    setKec("Semua");
  }, [prov]);

  React.useEffect(() => {
    // when kab changes, reset kec
    setKec("Semua");
  }, [kab]);

  const filteredSchools = schools.filter((s) => {
    const matchProv = s.prov === prov;
    const matchKab = kab ? s.kab === kab : true;
    const matchKec = kec === "Semua" ? true : s.kec === kec;
    return matchProv && matchKab && matchKec;
  });

  return (
    <TooltipProvider>
      <div className="min-h-screen grid lg:grid-cols-[260px_1fr] bg-gradient-to-br from-slate-50 via-indigo-50 to-sky-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
        {/* Sidebar */}
        <aside className="hidden lg:block border-r p-4 space-y-2 bg-gradient-to-b from-slate-900 to-slate-800 text-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-9 w-9 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center ring-1 ring-white/10">
              <SquareStack className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-semibold leading-tight">Xpresensi Admin</div>
              <div className="text-xs text-white/60">Terhubung Dinas & Pengawas</div>
            </div>
          </div>

          {SIDEBAR_MENU.map((m) => (
            <NavItem key={m.key} icon={m.icon} label={m.label} active={m.active} />
          ))}
        </aside>

        {/* Main */}
        <main className="p-4 lg:p-6 space-y-4">
          {/* Top Bar */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight bg-gradient-to-r from-slate-800 via-indigo-700 to-sky-600 bg-clip-text text-transparent dark:from-white dark:via-indigo-200 dark:to-sky-200">Dashboard</h1>
              <Badge variant="outline" className="rounded-full">Akses Terpadu</Badge>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <RegionToolbar
                prov={prov}
                kab={kab}
                kec={kec}
                onProvChange={setProv}
                onKabChange={setKab}
                onKecChange={setKec}
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline"><RefreshCcw className="h-4 w-4 mr-2" /> Sinkron</Button>
                </TooltipTrigger>
                <TooltipContent>Tarik data terbaru dari sekolah & dinas</TooltipContent>
              </Tooltip>
              <DropdownNotif />
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://i.pravatar.cc/64?img=13" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {kpis.map((k) => (
              <StatCard key={k.label} {...k} />
            ))}
          </div>

          {/* Two Column: Charts + Incident/Announcements */}
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2 border-white/30 bg-white/70 dark:bg-slate-900/40 supports-[backdrop-filter]:backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
              <CardHeader className="pb-0">
                <CardTitle>Tren Kehadiran Mingguan</CardTitle>
                <CardDescription>Ringkasan presensi guru & siswa</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={presensiSeries}>
                      <XAxis dataKey="name" />
                      <RTooltip />
                      <Bar dataKey="hadird" stackId="a" radius={6} />
                      <Bar dataKey="telat" stackId="a" radius={6} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/30 bg-white/70 dark:bg-slate-900/40 supports-[backdrop-filter]:backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
              <CardHeader className="pb-0">
                <CardTitle>Komposisi Status Hari Ini</CardTitle>
                <CardDescription>Distribusi Hadir / Izin / Sakit / Alpha</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={55}>
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Hub Dinas & Pengawas / Service Quality */}
          <Tabs defaultValue="hub" className="mt-2">
            <TabsList className="grid grid-cols-3 max-w-xl bg-white/60 dark:bg-slate-900/40 supports-[backdrop-filter]:backdrop-blur-xl">
              <TabsTrigger value="hub">Hub Dinas & Pengawas</TabsTrigger>
              <TabsTrigger value="layanan">Evaluasi Layanan Masyarakat</TabsTrigger>
              <TabsTrigger value="insiden">Insiden & Kunjungan</TabsTrigger>
            </TabsList>

            <TabsContent value="hub" className="space-y-4">
              <Card className="border-white/30 bg-white/70 dark:bg-slate-900/40 supports-[backdrop-filter]:backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                <CardHeader>
                  <CardTitle>Kanal Terpadu</CardTitle>
                  <CardDescription>Akses data lintas sekolah untuk Dinas & Pengawas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="border-dashed border-white/30 bg-white/60 dark:bg-slate-900/30 supports-[backdrop-filter]:backdrop-blur-xl">
                      <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><BookOpenCheck className="h-4 w-4"/>Rapor Kepatuhan</CardTitle><CardDescription>IKM, disiplin, ketuntasan</CardDescription></CardHeader>
                      <CardContent><Progress value={78} className="h-2"/><div className="mt-2 text-sm text-muted-foreground">Target triwulan 85%</div></CardContent>
                    </Card>
                    <Card className="border-dashed border-white/30 bg-white/60 dark:bg-slate-900/30 supports-[backdrop-filter]:backdrop-blur-xl">
                      <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Radar className="h-4 w-4"/>Deteksi Anomali</CardTitle><CardDescription>Telat massal, absen tidak wajar</CardDescription></CardHeader>
                      <CardContent className="text-sm text-muted-foreground">3 pola terdeteksi minggu ini</CardContent>
                    </Card>
                    <Card className="border-dashed border-white/30 bg-white/60 dark:bg-slate-900/30 supports-[backdrop-filter]:backdrop-blur-xl">
                      <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Globe className="h-4 w-4"/>SSO Pemda</CardTitle><CardDescription>Integrasi SSO & perizinan</CardDescription></CardHeader>
                      <CardContent className="flex items-center gap-3"><Switch defaultChecked/><span className="text-sm">Aktif</span></CardContent>
                    </Card>
                  </div>

                  <div className="rounded-xl border border-white/30 p-4 bg-white/60 dark:bg-slate-900/30 supports-[backdrop-filter]:backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium">Daftar Sekolah & Pengawas</div>
                        <div className="text-sm text-muted-foreground">Filter provinsi / kabupaten / kecamatan & jenjang</div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <RegionToolbar
                          compact
                          prov={prov}
                          kab={kab}
                          kec={kec}
                          onProvChange={setProv}
                          onKabChange={setKab}
                          onKecChange={setKec}
                        />
                        <Select defaultValue="all">
                          <SelectTrigger className="w-[150px]"><SelectValue placeholder="Jenjang" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Semua</SelectItem>
                            <SelectItem value="sd">SD</SelectItem>
                            <SelectItem value="smp">SMP</SelectItem>
                            <SelectItem value="sma">SMA/SMK</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline"><Download className="h-4 w-4 mr-2"/>Ekspor XLS</Button>
                      </div>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          {HEADERS.map((h) => (
                            <TableHead key={h}>{h}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredSchools.map((s) => (
                          <TableRow key={s.npsn}>
                            <TableCell className="font-mono">{s.npsn}</TableCell>
                            <TableCell className="font-medium">{s.name}</TableCell>
                            <TableCell>{s.kec}</TableCell>
                            <TableCell>{s.kab}</TableCell>
                            <TableCell>{s.prov}</TableCell>
                            <TableCell>{s.lastSync}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2"><Progress value={s.sla} className="h-2 w-24"/><span className="text-xs text-muted-foreground">{s.sla}%</span></div>
                            </TableCell>
                            <TableCell><RiskBadge level={s.risk} /></TableCell>
                            <TableCell className="text-right">
                              <Button size="sm" variant="ghost">Detail <ChevronRight className="h-4 w-4 ml-1"/></Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        {filteredSchools.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={HEADERS.length} className="text-center text-sm text-muted-foreground">
                              Tidak ada sekolah pada scope {prov}/{kab}{kec !== "Semua" ? "/" + kec : ""}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="layanan" className="space-y-4">
              <Card className="border-white/30 bg-white/70 dark:bg-slate-900/40 supports-[backdrop-filter]:backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                <CardHeader>
                  <CardTitle>Evaluasi Layanan Masyarakat (SPM)</CardTitle>
                  <CardDescription>Ikhtisar standar pelayanan di sekolah — dapat diakses Dinas/Walikota</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                  {serviceItems.map((i) => (
                    <div key={i.id} className="rounded-xl border border-white/30 p-4 bg-white/60 dark:bg-slate-900/30 supports-[backdrop-filter]:backdrop-blur-xl">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{i.kategori}</div>
                        <Badge variant={i.real >= i.target ? "secondary" : "destructive"}>{i.real}%</Badge>
                      </div>
                      <Progress value={(i.real / i.target) * 100} className="h-2" />
                      <div className="text-xs text-muted-foreground mt-2">Target {i.target}%</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insiden" className="space-y-4">
              <Card className="border-white/30 bg-white/70 dark:bg-slate-900/40 supports-[backdrop-filter]:backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                <CardHeader>
                  <CardTitle>Insiden Aktif & Kunjungan Teknisi</CardTitle>
                  <CardDescription>Tiket otomatis + penjadwalan kunjungan (terhubung pengawas)</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Sekolah</TableHead>
                        <TableHead>Jenis</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>ETA</TableHead>
                        <TableHead>Teknisi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {incidents.map((it) => (
                        <TableRow key={it.id}>
                          <TableCell className="font-mono">{it.id}</TableCell>
                          <TableCell>{it.school}</TableCell>
                          <TableCell>{it.type}</TableCell>
                          <TableCell>
                            <Badge variant={it.severity === "High" ? "destructive" : it.severity === "Medium" ? "secondary" : "outline"}>{it.severity}</Badge>
                          </TableCell>
                          <TableCell>{it.status}</TableCell>
                          <TableCell>{it.eta}</TableCell>
                          <TableCell>{it.owner}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Infrastruktur & Kepatuhan */}
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="border-white/30 bg-white/70 dark:bg-slate-900/40 supports-[backdrop-filter]:backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
              <CardHeader>
                <CardTitle>Infrastruktur & LAN</CardTitle>
                <CardDescription>Inventori perangkat & kesehatan jaringan sekolah</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-3 gap-3">
                  <MiniMeter icon={Network} title="Node Online" value="482" subtitle="/ 497" />
                  <MiniMeter icon={Database} title="Sinkron Harian" value="98%" subtitle="data valid" />
                  <MiniMeter icon={ShieldCheck} title="WAF/LB" value="OK" subtitle="TLS A+" />
                </div>
                <Separator />
                <div className="text-sm text-muted-foreground">Catatan: perangkat kamera presensi harus berada pada VLAN aman; audit port 802.1X mingguan.</div>
              </CardContent>
            </Card>

            <Card className="border-white/30 bg-white/70 dark:bg-slate-900/40 supports-[backdrop-filter]:backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
              <CardHeader>
                <CardTitle>Kepatuhan & Audit</CardTitle>
                <CardDescription>Log akses, retensi data, dan status persetujuan orang tua</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Audit Log (30 hari)</div>
                    <div className="text-xs text-muted-foreground">Akses sensitif dimonitor realtime</div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline"><History className="h-4 w-4 mr-2"/>Lihat</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Audit Log</DialogTitle>
                        <DialogDescription>Cuplikan 10 event terakhir</DialogDescription>
                      </DialogHeader>
                      <div className="rounded-lg border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Waktu</TableHead>
                              <TableHead>Pengguna</TableHead>
                              <TableHead>Aksi</TableHead>
                              <TableHead>Objek</TableHead>
                              <TableHead>IP</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {Array.from({ length: 10 }).map((_, i) => (
                              <TableRow key={i}>
                                <TableCell>2025-08-23 07:{(20 + i).toString().padStart(2, "0")}</TableCell>
                                <TableCell>pengawas_{i + 1}</TableCell>
                                <TableCell>VIEW</TableCell>
                                <TableCell>Presensi Kelas {i + 3}</TableCell>
                                <TableCell>36.89.1.{100 + i}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Persetujuan Orang Tua</div>
                    <div className="text-xs text-muted-foreground">Kebijakan privasi & retensi 1 tahun</div>
                  </div>
                  <Badge variant="secondary">96.2% Terkumpul</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between py-2">
            <div className="text-xs text-muted-foreground">© {new Date().getFullYear()} Xpresensi – Integrasi Dinas & Pengawas</div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm"><UploadCloud className="h-4 w-4 mr-2"/>Impor Jadwal</Button>
              <Button size="sm"><FileText className="h-4 w-4 mr-2"/>Buat Laporan Bulanan</Button>
            </div>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}

/*************************
 * HELPER COMPONENTS
 *************************/
const StatCard = ({ label, value, icon: Icon, trend }) => (
  <Card className="shadow-sm border-white/30 bg-white/70 dark:bg-slate-900/40 supports-[backdrop-filter]:backdrop-blur-xl">
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between">
        <CardDescription className="text-muted-foreground">{label}</CardDescription>
        <Icon className="h-4 w-4" />
      </div>
      <CardTitle className="text-3xl mt-1">
        <motion.span initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>{Number(value).toLocaleString()}</motion.span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <Badge variant={String(trend).startsWith("-") ? "destructive" : "secondary"}>{trend}</Badge>
    </CardContent>
  </Card>
);

const RiskBadge = ({ level }) => {
  const styles = {
    Low: "bg-green-100 text-green-700",
    Medium: "bg-yellow-100 text-yellow-700",
    High: "bg-red-100 text-red-700",
  };
  return <span className={`px-2 py-1 rounded-full text-xs ${styles[level]}`}>{level}</span>;
};

function NavItem({ icon: Icon, label, active = false }) {
  return (
    <button
      className={`group w-full flex items-center gap-3 px-3 py-2 rounded-xl transition relative text-left ${
        active ? "bg-white/10 ring-1 ring-white/10 text-white" : "hover:bg-white/5 text-slate-200"
      }`}
      aria-current={active ? "page" : undefined}
    >
      <span
        className={`absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full transition-all ${
          active ? "bg-indigo-400 opacity-100" : "opacity-0 group-hover:opacity-60 bg-white/40"
        }`}
      />
      <Icon className="h-4 w-4 opacity-90" />
      <span className="text-sm font-medium tracking-wide">{label}</span>
    </button>
  );
}

function MiniMeter({ icon: Icon, title, value, subtitle }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-2xl bg-muted flex items-center justify-center">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-sm font-medium leading-tight">{title}</div>
        <div className="text-xs text-muted-foreground">{subtitle}</div>
      </div>
      <div className="ml-auto text-sm font-semibold">{value}</div>
    </div>
  );
}

function DropdownNotif() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] text-white flex items-center justify-center">{pengumuman.length}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Pemberitahuan</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {pengumuman.map((p) => (
          <DropdownMenuItem key={p.id} className="flex flex-col items-start">
            <div className="font-medium">{p.title}</div>
            <div className="text-xs text-muted-foreground">{p.body}</div>
            <div className="text-[10px] text-muted-foreground mt-1">{p.time}</div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function RegionToolbar({ prov, kab, kec, onProvChange, onKabChange, onKecChange, compact = false }) {
  const kabs = REGION.kabupatenByProv[prov] || [];
  const kecs = REGION.kecamatanByKab[kab] || [];

  return (
    <div className={`flex items-center gap-2 ${compact ? "" : "bg-white/60 dark:bg-slate-900/40 supports-[backdrop-filter]:backdrop-blur-xl rounded-xl px-3 py-2"}`}>
      <Select value={prov} onValueChange={onProvChange}>
        <SelectTrigger className={`w-[160px] ${compact ? "h-8" : ""}`}><SelectValue placeholder="Provinsi" /></SelectTrigger>
        <SelectContent>
          {REGION.provinsi.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={kab} onValueChange={onKabChange}>
        <SelectTrigger className={`w-[170px] ${compact ? "h-8" : ""}`}><SelectValue placeholder="Kab/Kota" /></SelectTrigger>
        <SelectContent>
          {kabs.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={kec} onValueChange={onKecChange}>
        <SelectTrigger className={`w-[170px] ${compact ? "h-8" : ""}`}><SelectValue placeholder="Kecamatan" /></SelectTrigger>
        <SelectContent>
          <SelectItem key="__all" value="Semua">Semua</SelectItem>
          {kecs.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
        </SelectContent>
      </Select>
      {!compact && (
        <Badge variant="secondary" className="ml-1">Scope: {prov} / {kab} / {kec}</Badge>
      )}
    </div>
  );
}

/*************************
 * RUNTIME SELF-TESTS (non-breaking)
 *************************/
(function runSelfTests() {
  try {
    const labels = SIDEBAR_MENU.map((m) => m.label);

    // Test 1: labels must be unique
    const uniqueCount = new Set(labels).size;
    console.assert(uniqueCount === labels.length, "[TEST] Sidebar labels must be unique");

    // Test 2: required labels should exist (per latest request)
    const REQUIRED = [
      "Manajemen Kehadiran",
      "Absen Manual",
      "Manajemen Data",
      "Sebaran Lokasi Siswa",
      "Data Perizinan",
      "Perpustakaan",
      "Manajemen Admin",
      "Integrasi Wilayah",
    ];
    const missing = REQUIRED.filter((r) => !labels.includes(r));
    console.assert(missing.length === 0, `\n[TEST] Missing sidebar items: ${missing.join(", ")}`);

    // Test 3: at least one item is active (focus state)
    const hasActive = SIDEBAR_MENU.some((m) => m.active);
    console.assert(hasActive, "[TEST] At least one sidebar item should be active");

    // Test 4: forbidden items must not exist
    const FORBIDDEN = ["Manajemen Format", "Aplikasi Xpresensi Lainnya", "Jadwal & Mapel", "Kartu Sekolah"];
    const foundForbidden = FORBIDDEN.filter((f) => labels.includes(f));
    console.assert(foundForbidden.length === 0, `\n[TEST] Forbidden sidebar items still present: ${foundForbidden.join(", ")}`);

    // Test 5: all schools should have kab & prov fields populated
    const allHaveRegion = schools.every((s) => Boolean(s.kab && s.prov));
    console.assert(allHaveRegion, "[TEST] Each school must include kab & prov fields");

    // Test 6: HEADERS must contain region columns
    ["Kecamatan", "Kab/Kota", "Provinsi"].forEach((h) => {
      console.assert(HEADERS.includes(h), `[TEST] HEADERS should include ${h}`);
    });

    // Test 7: region filtering should return rows when scope matches dataset
    const sampleFilter = (arr, prov, kab, kec) =>
      arr.filter((s) => s.prov === prov && s.kab === kab && (kec === "Semua" || s.kec === kec));
    const rows = sampleFilter(schools, "Jawa Barat", "Bandung", "Semua");
    console.assert(rows.length === schools.length, "[TEST] Filtering by Jawa Barat/Bandung should include all sample schools");
  } catch (e) {
    console.error("[TEST] Runtime tests failed to execute:", e);
  }
})();
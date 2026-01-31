
import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Fokus: Dashboard Pelayanan Masyarakat dengan histori per sekolah (lebih detail) + modal histori penuh & ekspor CSV.
 * Build-safe: tanpa dependensi eksternal yang rawan (shadcn/ui, recharts, lucide, react-leaflet).
 * - UI mini: komponen Tailwind ringan (Card/Badge/Switch/Modal).
 * - Grafik: CSS/SVG sederhana (bar, sparkline, donut gauge).
 * - Peta (tab lain) tetap ada dan aman via Leaflet CDN.
 */

/**********************  Mini UI primitives (no external deps)  **********************/
function clsx(...a){return a.filter(Boolean).join(" ")}
function Card({children,className=""}){return <div className={clsx("rounded-2xl border bg-white shadow-sm",className)}>{children}</div>}
function CardHeader({children,className=""}){return <div className={clsx("px-4 pt-4 pb-2",className)}>{children}</div>}
function CardTitle({children,className=""}){return <div className={clsx("text-lg font-semibold",className)}>{children}</div>}
function CardContent({children,className=""}){return <div className={clsx("px-4 pb-4",className)}>{children}</div>}
function Badge({children,variant="default"}){
  const base="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium";
  const variants={default:"bg-gray-900 text-white",secondary:"bg-gray-200 text-gray-800",destructive:"bg-red-600 text-white",outline:"border border-gray-300 text-gray-700"};
  return <span className={clsx(base,variants[variant]||variants.default)}>{children}</span>
}
function Switch({checked,onCheckedChange}){
  return(
    <button type="button" role="switch" aria-checked={checked} onClick={()=>onCheckedChange?.(!checked)} className={clsx("inline-flex h-5 w-9 items-center rounded-full transition",checked?"bg-emerald-600":"bg-gray-300")}> 
      <span className={clsx("h-4 w-4 rounded-full bg-white transform transition",checked?"translate-x-4":"translate-x-0.5")} />
    </button>
  )
}
function Modal({open,onClose,title,children,widthClass="max-w-5xl"}){
  if(!open) return null
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className={clsx("w-full rounded-2xl bg-white shadow-xl",widthClass)}>
          <div className="flex items-center justify-between border-b px-5 py-3">
            <div className="font-semibold">{title}</div>
            <button onClick={onClose} className="rounded-md border px-2 py-1 text-sm">Tutup</button>
          </div>
          <div className="p-5 max-h-[70vh] overflow-auto">{children}</div>
        </div>
      </div>
    </div>
  )
}

/****************************  Helpers & Testable Logic  ****************************/ 
function variantAdminByHadir(hadir){return hadir<70?"destructive":"default"}
function variantDinasByHadir(hadir){return hadir<=85?"destructive":"default"}
function variantPengawasDokumen(status){if(status==="Selesai")return"default";if(status==="Terjadwal")return"secondary";return"destructive"}

// --- Pelayanan helpers ---
function hoursDiff(a,b){return (new Date(b)-new Date(a))/36e5}
function computeSLA(records,thresholdHours){
  if(!records?.length) return 0
  const done=records.filter(r=>r.status==="Selesai"&&r.resolvedAt)
  if(!done.length) return 0
  const ok=done.filter(r=>hoursDiff(r.openedAt,r.resolvedAt)<=thresholdHours)
  return Math.round((ok.length/done.length)*100)
}
function aggregateDailyCounts(records,days){
  // return array of length `days` for last N days (oldest..newest)
  const today=new Date(); today.setHours(0,0,0,0)
  const arr=[]
  for(let i=days-1;i>=0;i--){
    const d=new Date(today); d.setDate(d.getDate()-i)
    const key=d.toISOString().slice(0,10)
    const count=records.filter(r=>r.openedAt.slice(0,10)===key).length
    arr.push({date:key,count})
  }
  return arr
}
function movingAvg(values,win=3){
  if(win<=1) return values.map(v=>Number(v))
  const out=values.map(()=>null)
  for(let i=0;i<values.length;i++){
    if(i+1<win) continue
    let s=0; for(let j=i-win+1;j<=i;j++) s+=Number(values[j])
    out[i]=+(s/win).toFixed(2)
  }
  return out
}
function filterByDateRange(records,fromISO,toISO){
  const from=fromISO? new Date(fromISO+"T00:00:00"): null
  const to=toISO? new Date(toISO+"T23:59:59.999"): null
  return records.filter(r=>{
    const t=new Date(r.openedAt)
    if(from && t<from) return false
    if(to && t>to) return false
    return true
  })
}
function toCSV(rows){
  if(!rows?.length) return ""
  const cols=["openedAt","category","status","responseHours","resolvedAt","satisfaction","title"]
  const header=cols.join(",")
  const esc=v=>String(v??"").replace(/"/g,'""')
  const lines=rows.map(r=> cols.map(c=>`"${esc(r[c])}"`).join(","))
  return [header, ...lines].join("\n")
}
function isLowSatisfaction(avg){ return Number(avg)<60 }
function isLow(value,threshold=60){ return Number(value)<Number(threshold) }

// === NEW: Master Kategori Pelayanan (lengkap & bisa ditambah) ===
const PELAYANAN_CATEGORIES=[
  "Administrasi Umum","PPDB","Mutasi Siswa","Surat Keterangan","Legalisir Ijazah/Transkrip","Beasiswa/KIP",
  "Kurikulum & KBM","Bimbingan Konseling","Kedisiplinan","Kesehatan & UKS","Perpustakaan","Sarana Prasarana",
  "Kebersihan & Keamanan","IT & Jaringan","Website/Portal","Keuangan/Komite","Kegiatan Sekolah","Ekstrakurikuler",
  "Transportasi/Parkir","Kantin","Inklusi/Disabilitas","Pencegahan Perundungan","Pengaduan Kekerasan",
  "Lingkungan/Green School","Layanan Alumni","Hubungan Masyarakat","Lainnya"
]

// Demo GPS points (Bandung) — dipakai tab lain
const GPS_POINTS=[
  { lat:-6.9179,lng:107.6139,role:"siswa",name:"Siswa 01",active:true },
  { lat:-6.9195,lng:107.6110,role:"siswa",name:"Siswa 02",active:false },
  { lat:-6.9142,lng:107.6205,role:"siswa",name:"Siswa 03",active:true },
  { lat:-6.9208,lng:107.6231,role:"siswa",name:"Siswa 04",active:false },
  { lat:-6.9031,lng:107.6180,role:"siswa",name:"Siswa 05",active:true },
  { lat:-6.9055,lng:107.5750,lng2:0,role:"guru", name:"Guru 01",active:true },
  { lat:-6.9320,lng:107.6040,role:"guru", name:"Guru 02",active:false },
  { lat:-6.9470,lng:107.6355,role:"guru", name:"Guru 03",active:true },
  { lat:-6.9302,lng:107.7203,role:"guru", name:"Guru 04",active:false },
  { lat:-6.9642,lng:107.6385,role:"guru", name:"Guru 05",active:true },
  { lat:-6.8985,lng:107.6190,role:"siswa",name:"Siswa 06",active:true },
  { lat:-6.9498,lng:107.6349,role:"siswa",name:"Siswa 07",active:false },
];
function filterByActive(points,showActive,showInactive){return points.filter(p=>(p.active&&showActive)||(!p.active&&showInactive))}

/********************************  Root Component  *********************************/
export const EditProfileForm = () => {
  const [tab,setTab]=useState("pelayanan"); // fokus ke pelayanan
  const [range,setRange]=useState("7d");
  const [kecamatan,setKecamatan]=useState("all");
  const [search,setSearch]=useState("");

  // Self-tests lama + tambahan baru untuk Pelayanan helpers
  const testResults=useMemo(()=>{
    const sample=[
      {openedAt:"2025-08-01T08:00:00Z",resolvedAt:"2025-08-02T08:00:00Z",status:"Selesai"}, // 24h
      {openedAt:"2025-08-03T08:00:00Z",resolvedAt:"2025-08-05T08:30:00Z",status:"Selesai"}, // 48.5h
      {openedAt:"2025-08-04T10:00:00Z",status:"Diproses"}, // ignore
    ]
    const sampleDates=[
      {openedAt:"2025-08-10T08:00:00Z",status:"Baru"},
      {openedAt:"2025-08-15T08:00:00Z",status:"Baru"},
    ]
    const csvRows=[{openedAt:"2025-01-01",category:"A",status:"Selesai",responseHours:2,resolvedAt:"2025-01-02",satisfaction:90,title:"T"}]
    const tests=[
      {name:"Admin: 69 -> destructive",actual:variantAdminByHadir(69),expected:"destructive"},
      {name:"Admin: 70 -> default",actual:variantAdminByHadir(70),expected:"default"},
      {name:"Admin: 0 -> destructive",actual:variantAdminByHadir(0),expected:"destructive"},
      {name:"Dinas: 85 -> destructive",actual:variantDinasByHadir(85),expected:"destructive"},
      {name:"Dinas: 86 -> default",actual:variantDinasByHadir(86),expected:"default"},
      {name:"Pengawas badge map (Selesai)",actual:variantPengawasDokumen("Selesai"),expected:"default"},
      {name:"Pengawas badge map (Terjadwal)",actual:variantPengawasDokumen("Terjadwal"),expected:"secondary"},
      {name:"Pengawas badge map (Unknown)",actual:variantPengawasDokumen("Unknown"),expected:"destructive"},
      {name:"SLA 48h (2 of 2 within 48h -> 50%)",actual:computeSLA(sample,48),expected:50},
      {name:"Daily counts length 7",actual:aggregateDailyCounts(sample,7).length,expected:7},
      {name:"MovingAvg window=2",actual:JSON.stringify(movingAvg([1,2,3,4],2)),expected:JSON.stringify([null,1.5,2.5,3.5])},
      {name:"isLowSatisfaction 59 -> true",actual:isLowSatisfaction(59),expected:true},
      {name:"DateRange 2025-08-12..2025-08-16 -> 1",actual:filterByDateRange(sampleDates,"2025-08-12","2025-08-16").length,expected:1},
      {name:"CSV has 2 lines (header+1)",actual:toCSV(csvRows).split("\n").length===2,expected:true},
      {name:"CSV header correct",actual:toCSV(csvRows).startsWith("openedAt,category,status,responseHours,resolvedAt,satisfaction,title"),expected:true},
      {name:"PELAYANAN_CATEGORIES min 20",actual:PELAYANAN_CATEGORIES.length>=20,expected:true},
    ]
    const failed=tests.filter(t=>t.actual!==t.expected)
    return {tests,failed}
  },[])

  return(
    <div className="min-h-screen w-full p-6 md:p-10 space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">Xpresensi — Dashboard</h1>
          <p className="text-sm text-gray-500">Fokus Pelayanan Masyarakat dengan histori per-sekolah. Tab lain tetap minimal.</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={range} onChange={e=>setRange(e.target.value)} className="h-9 rounded-md border px-2 text-sm">
            <option value="7d">7 hari</option>
            <option value="30d">30 hari</option>
            <option value="90d">90 hari</option>
          </select>
          <select value={kecamatan} onChange={e=>setKecamatan(e.target.value)} className="h-9 rounded-md border px-2 text-sm">
            <option value="all">Semua kecamatan</option>
            <option value="bojongloa">Bojongloa</option>
            <option value="antapani">Antapani</option>
            <option value="coblong">Coblong</option>
          </select>
          <div className="flex items-center gap-2">
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari sekolah/kelas/guru" className="h-9 w-[220px] rounded-md border px-2 text-sm"/>
            <button className="h-9 rounded-md border px-3 text-sm">Filter</button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div>
        <div className="grid grid-cols-4 gap-2 w-full md:w-[750px]">
          {[
            {id:"admin",label:"Admin Sekolah",icon:"🎓"},
            {id:"dinas",label:"Dinas",icon:"📊"},
            {id:"pengawas",label:"Pengawas",icon:"👥"},
            {id:"pelayanan",label:"Pelayanan",icon:"📈"},
          ].map(t=> (
            <button key={t.id} onClick={()=>setTab(t.id)} className={clsx("flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm", tab===t.id?"bg-gray-900 text-white":"bg-white")}>{t.icon} {t.label}</button>
          ))}
        </div>
        <div className="mt-4">
          {tab==="admin"&&<AdminSekolah/>}
          {tab==="dinas"&&<Dinas/>}
          {tab==="pengawas"&&<Pengawas/>}
          {tab==="pelayanan"&&<Pelayanan/>}
        </div>
      </div>

      {/* Self-tests output */}
      <details className="text-xs text-gray-500">
        <summary>Self-tests: {testResults.failed.length===0?"Semua lulus":`${testResults.failed.length} gagal`}</summary>
        <ul className="list-disc ml-4 mt-2">
          {testResults.tests.map(t=> (
            <li key={t.name}>
              {t.name}: <span className={t.actual===t.expected?"text-emerald-600":"text-red-600"}>{String(t.actual)}</span>
              {t.actual!==t.expected && <span> (harusnya {String(t.expected)})</span>}
            </li>
          ))}
        </ul>
      </details>
    </div>
  )
}

/*************************  Admin/Dinas/Pengawas = MAP ONLY  *************************/
function AdminSekolah(){
  const [showActive,setShowActive]=useState(true)
  const [showInactive,setShowInactive]=useState(false)
  return(
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2">📍 Peta Lokasi Siswa & Guru (Jam KBM)</CardTitle>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-2"><Switch checked={showActive} onCheckedChange={setShowActive}/>Aktif</span>
          <span className="flex items-center gap-2"><Switch checked={showInactive} onCheckedChange={setShowInactive}/>Tidak Aktif</span>
        </div>
      </CardHeader>
      <CardContent className="h-[420px]"><LeafletMap points={GPS_POINTS} showActive={showActive} showInactive={showInactive}/></CardContent>
    </Card>
  )
}
function Dinas(){
  const [showActive,setShowActive]=useState(true)
  const [showInactive,setShowInactive]=useState(false)
  return(
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2">📍 Peta Lokasi GPS (Jam KBM)</CardTitle>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-2"><Switch checked={showActive} onCheckedChange={setShowActive}/>Aktif</span>
          <span className="flex items-center gap-2"><Switch checked={showInactive} onCheckedChange={setShowInactive}/>Tidak Aktif</span>
        </div>
      </CardHeader>
      <CardContent className="h-[420px]"><LeafletMap points={GPS_POINTS} showActive={showActive} showInactive={showInactive}/></CardContent>
    </Card>
  )
}
function Pengawas(){
  const [showActive,setShowActive]=useState(true)
  const [showInactive,setShowInactive]=useState(false)
  return(
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2">📍 Peta Lokasi GPS (Jam KBM)</CardTitle>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-2"><Switch checked={showActive} onCheckedChange={setShowActive}/>Aktif</span>
          <span className="flex items-center gap-2"><Switch checked={showInactive} onCheckedChange={setShowInactive}/>Tidak Aktif</span>
        </div>
      </CardHeader>
      <CardContent className="h-[420px]"><LeafletMap points={GPS_POINTS} showActive={showActive} showInactive={showInactive}/></CardContent>
    </Card>
  )
}

/*****************************  Pelayanan Masyarakat (detail per sekolah)  *****************************/
function Pelayanan(){
  // ===== Data sekolah + histori =====
  const schools=useMemo(()=>createDemoSchools(),[])
  const [selectedId,setSelectedId]=useState(schools[0]?.id)
  const selected=useMemo(()=>schools.find(s=>s.id===selectedId)||schools[0],[schools,selectedId])

  // KPI aggr untuk sekolah terpilih
  const sla=useMemo(()=>computeSLA(selected.history,48),[selected])
  const last30=useMemo(()=>aggregateDailyCounts(selected.history,30),[selected])
  const counts30=last30.map(d=>d.count)
  const mov30=movingAvg(counts30,5)
  const avgSatisf=useMemo(()=>{
    const done=selected.history.filter(r=>typeof r.satisfaction==="number")
    if(!done.length) return 0
    return Math.round(done.reduce((a,b)=>a+b.satisfaction,0)/done.length)
  },[selected])
  const medianResp=useMemo(()=>{
    const arr=selected.history.filter(r=>r.responseHours!=null).map(r=>r.responseHours).sort((a,b)=>a-b)
    if(!arr.length) return 0
    const mid=Math.floor(arr.length/2)
    return arr.length%2? arr[mid] : Math.round((arr[mid-1]+arr[mid])/2)
  },[selected])

  // Filter riwayat dasar (status+kategori)
  const [statusFilter,setStatusFilter]=useState("all")
  const [catFilter,setCatFilter]=useState("all")
  const baseFiltered=selected.history.filter(r=> (statusFilter==="all"||r.status===statusFilter) && (catFilter==="all"||r.category===catFilter))

  // Date range untuk modal & tabel ringkas
  const [fromDate,setFromDate]=useState("")
  const [toDate,setToDate]=useState("")
  const dateFiltered=useMemo(()=>filterByDateRange(baseFiltered,fromDate,toDate),[baseFiltered,fromDate,toDate])
  const recent=dateFiltered.slice(-10).reverse()

  // Overall KPI (semua sekolah) — ringkas
  const kpis=useMemo(()=>{
    const all=schools.flatMap(s=>s.history)
    return [
      {label:"Index Pelayanan (IP)", value: Math.round(all.reduce((a,b)=>a+(b.satisfaction??0),0)/Math.max(1,all.filter(x=>x.satisfaction!=null).length)) , suffix:"/ 100"},
      {label:"Aduan 14 hari", value: all.filter(r=> (new Date())-new Date(r.openedAt) <= 14*864e5 ).length},
      {label:"SLA ≤48h", value: computeSLA(all,48)+"%"},
      {label:"Sekolah", value: schools.length},
    ]
  },[schools])

  // Modal riwayat & export
  const [openHistory,setOpenHistory]=useState(false)
  const handleExport=()=>{
    const csv=toCSV(dateFiltered)
    const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"})
    const url=URL.createObjectURL(blob)
    const a=document.createElement("a")
    a.href=url; a.download=`riwayat-${selected.id}.csv`; a.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000)
  }

  // === NEW: Warning style untuk SLA rendah (<60) ===
  const SLA_WARN_THRESHOLD=60
  const slaWarn=isLow(sla,SLA_WARN_THRESHOLD)

  // === NEW: Distribusi kategori untuk sekolah terpilih ===
  const catDist=useMemo(()=>{
    const map=new Map();
    selected.history.forEach(r=>{ map.set(r.category,(map.get(r.category)||0)+1) })
    return Array.from(map.entries()).map(([name,count])=>({name,count})).sort((a,b)=>b.count-a.count)
  },[selected])
  const catTotal=catDist.reduce((a,b)=>a+b.count,0)

  return(
    <div className="space-y-6">
      {/* KPIs ringkas seluruh sekolah */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpis.map(k=> (
          <Card key={k.label}><CardHeader className="pb-1"><CardTitle className="text-sm font-medium">{k.label}</CardTitle></CardHeader><CardContent className="text-3xl font-semibold">{k.value} {k.suffix&&<span className="text-base text-gray-500">{k.suffix}</span>}</CardContent></Card>
        ))}
      </div>

      {/* Selector sekolah + ringkasan sekolah terpilih */}
      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-base">📚 Ringkasan Per Sekolah</CardTitle>
          <div className="flex gap-2 items-center">
            <label className="text-sm text-gray-600">Pilih sekolah</label>
            <select value={selectedId} onChange={e=>setSelectedId(e.target.value)} className="h-9 rounded-md border px-2 text-sm">
              {schools.map(s=> <option key={s.id} value={s.id}>{s.name} — {s.kecamatan}</option>)}
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className={clsx("md:col-span-1", slaWarn && "border-red-300 bg-red-50")}> {/* SLA card warning */}
              <CardHeader className="pb-1"><CardTitle className={clsx("text-sm font-medium", slaWarn && "text-red-700 flex items-center gap-1")}>{slaWarn && "⚠️ "}SLA ≤ 48 jam</CardTitle></CardHeader>
              <CardContent>
                <Donut value={sla} color={slaWarn?"#dc2626":"#111"} track={slaWarn?"#fee2e2":"#e5e7eb"}/>
                <div className={clsx("text-xs text-center mt-1", slaWarn?"text-red-700":"text-gray-500")}>Acuan: tuntas ≤ 48 jam</div>
                {slaWarn && <div className="mt-2 text-center"><Badge variant="destructive">SLA rendah</Badge></div>}
              </CardContent>
            </Card>
            <Card className={clsx("md:col-span-1", isLowSatisfaction(avgSatisf)&&"border-red-300")}> {/* warnai merah jika <60 */}
              <CardHeader className="pb-1"><CardTitle className="text-sm font-medium">Rata Kepuasan</CardTitle></CardHeader>
              <CardContent>
                <div className={clsx("text-4xl font-semibold", isLowSatisfaction(avgSatisf)&&"text-red-600")}>{avgSatisf}<span className="text-base text-gray-500">/100</span></div>
                <div className="text-xs text-gray-500">Dari aduan yang selesai & disurvei</div>
              </CardContent>
            </Card>
            <Card className="md:col-span-1">
              <CardHeader className="pb-1"><CardTitle className="text-sm font-medium">Median Waktu Respons</CardTitle></CardHeader>
              <CardContent>
                <div className="text-4xl font-semibold">{medianResp}<span className="text-base text-gray-500"> jam</span></div>
                <div className="text-xs text-gray-500">Dari tiket yang sudah direspon</div>
              </CardContent>
            </Card>
            <Card className="md:col-span-1">
              <CardHeader className="pb-1"><CardTitle className="text-sm font-medium">Aduan 30 Hari</CardTitle></CardHeader>
              <CardContent>
                <Sparkline data={counts30} avg={mov30} height={70}/>
                <div className="text-xs text-gray-500">Garis tipis: moving average (5)</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Historis harian (30 hari) */}
      <Card>
        <CardHeader className="pb-1"><CardTitle className="text-base">📈 Histori Harian — {selected.name}</CardTitle></CardHeader>
        <CardContent>
          <SimpleBar data={last30} height={180}/>
          <div className="text-[11px] text-gray-500 mt-2">Bar menunjukkan jumlah aduan dibuka tiap hari (30 hari terakhir).</div>
        </CardContent>
      </Card>

      {/* Distribusi kategori */}
      <Card>
        <CardHeader className="pb-1"><CardTitle className="text-base">🏷️ Kategori Pelayanan — {selected.name}</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-500 mb-2">Master kategori (dapat dikembangkan):</div>
              <ul className="text-sm list-disc ml-5 space-y-1 max-h-48 overflow-auto pr-2">
                {PELAYANAN_CATEGORIES.map(k=> <li key={k}>{k}</li>)}
              </ul>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-2">Distribusi aduan berdasarkan kategori (semua histori sekolah ini):</div>
              <ul className="space-y-2">
                {catDist.map(c=>{
                  const pct = catTotal? Math.round((c.count/catTotal)*100):0
                  return (
                    <li key={c.name} className="text-sm">
                      <div className="flex items-center justify-between mb-1"><span className="truncate pr-2">{c.name}</span><span className="text-gray-500">{c.count} ({pct}%)</span></div>
                      <div className="h-2 rounded bg-gray-200 overflow-hidden"><div className="h-full" style={{width:`${pct}%`, background:"linear-gradient(to right,#111,#6b7280)"}}/></div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Riwayat tiket terakhir dengan filter + lihat semua */}
      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-base">🗂️ Riwayat Aduan Terbaru</CardTitle>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-2">
            <div className="flex gap-2">
              <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="h-9 rounded-md border px-2 text-sm">
                <option value="all">Semua status</option>
                <option value="Baru">Baru</option>
                <option value="Diproses">Diproses</option>
                <option value="Selesai">Selesai</option>
              </select>
              <select value={catFilter} onChange={e=>setCatFilter(e.target.value)} className="h-9 rounded-md border px-2 text-sm">
                <option value="all">Semua kategori</option>
                {Array.from(new Set(selected.history.map(r=>r.category))).map(c=>(<option key={c} value={c}>{c}</option>))}
              </select>
            </div>
            <div className="flex gap-2 items-center">
              <input type="date" value={fromDate} onChange={e=>setFromDate(e.target.value)} className="h-9 rounded-md border px-2 text-sm"/>
              <span className="text-xs text-gray-500">s/d</span>
              <input type="date" value={toDate} onChange={e=>setToDate(e.target.value)} className="h-9 rounded-md border px-2 text-sm"/>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>setOpenHistory(true)} className="h-9 rounded-md border px-3 text-sm">Lihat semua riwayat</button>
              <button onClick={handleExport} className="h-9 rounded-md border px-3 text-sm">Export CSV</button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="py-2">Tanggal</th>
                  <th className="py-2">Kategori</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Respons</th>
                  <th className="py-2">Selesai</th>
                  <th className="py-2">Skor</th>
                  <th className="py-2">Judul</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r,i)=>(
                  <tr key={i} className="border-t align-top">
                    <td className="py-2 whitespace-nowrap">{formatDate(r.openedAt)}</td>
                    <td className="py-2">{r.category}</td>
                    <td className="py-2">
                      <Badge variant={r.status==="Selesai"?"default":r.status==="Diproses"?"secondary":"destructive"}>{r.status}</Badge>
                    </td>
                    <td className="py-2">{r.responseHours!=null? r.responseHours+" jam":"-"}</td>
                    <td className="py-2">{r.resolvedAt? Math.round(hoursDiff(r.openedAt,r.resolvedAt))+" jam":"-"}</td>
                    <td className="py-2">{r.satisfaction!=null? r.satisfaction:"-"}</td>
                    <td className="py-2 w-[320px]">{r.title}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-[11px] text-gray-500 mt-2">Menampilkan 10 tiket terakhir (ikut filter & tanggal). Gunakan tombol di atas untuk melihat semua.</div>
        </CardContent>
      </Card>

      {/* Modal Riwayat Lengkap */}
      <Modal open={openHistory} onClose={()=>setOpenHistory(false)} title={`Riwayat Lengkap — ${selected.name}`}>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="outline">{dateFiltered.length} tiket</Badge>
          <div className="ml-auto text-xs text-gray-500">Filter aktif: {statusFilter}/{catFilter} {fromDate||toDate?`· ${fromDate||".."} s/d ${toDate||".."}`:""}</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="py-2">Tanggal</th>
                <th className="py-2">Kategori</th>
                <th className="py-2">Status</th>
                <th className="py-2">Respons</th>
                <th className="py-2">Selesai</th>
                <th className="py-2">Skor</th>
                <th className="py-2">Judul</th>
              </tr>
            </thead>
            <tbody>
              {dateFiltered.slice().reverse().map((r,i)=>(
                <tr key={i} className="border-t align-top">
                  <td className="py-2 whitespace-nowrap">{formatDate(r.openedAt)}</td>
                  <td className="py-2">{r.category}</td>
                  <td className="py-2"><Badge variant={r.status==="Selesai"?"default":r.status==="Diproses"?"secondary":"destructive"}>{r.status}</Badge></td>
                  <td className="py-2">{r.responseHours!=null? r.responseHours+" jam":"-"}</td>
                  <td className="py-2">{r.resolvedAt? Math.round(hoursDiff(r.openedAt,r.resolvedAt))+" jam":"-"}</td>
                  <td className="py-2">{r.satisfaction!=null? r.satisfaction:"-"}</td>
                  <td className="py-2 w-[480px]">{r.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>
    </div>
  )
}

/*********************  Demo data generator (deterministik)  *********************/
function createDemoSchools(){
  const schools=[
    {id:"smpn12",name:"SMPN 12",kecamatan:"Bojongloa"},
    {id:"sman4",name:"SMAN 4",kecamatan:"Coblong"},
    {id:"sdn5",name:"SDN 5",kecamatan:"Antapani"},
  ]
  const cats=PELAYANAN_CATEGORIES
  const today=new Date(); today.setHours(9,0,0,0)
  function mk(seed){
    const history=[]
    for(let i=0;i<60;i++){ // lebih panjang agar distribusi kategori lebih kaya
      const d=new Date(today); d.setDate(d.getDate()-i)
      const n=(seed*11+i*7)%cats.length
      const category=cats[n]
      const openedAt=new Date(d); openedAt.setHours(9+(i%5), Math.floor(i*seed)%60)
      const statusIdx=(seed+i)%3 // 0: Baru, 1: Diproses, 2: Selesai
      let status=["Baru","Diproses","Selesai"][statusIdx]
      let resolvedAt=null, responseHours=null, satisfaction=null
      if(status!=="Baru"){
        responseHours= 1 + ((i+seed)%10) // 1..10 jam
      }
      if(status==="Selesai"){
        const dur= 12 + ((i*seed)%72) // 12..83 jam
        resolvedAt=new Date(openedAt.getTime()+dur*36e5)
        satisfaction= 55 + ((i*3 + seed*5)%46) // 55..100 agar peluang <60 ada
      }
      const title=`${category}: tiket #${seed}-${i}`
      history.push({
        title,
        category,
        openedAt:openedAt.toISOString(),
        status,
        responseHours,
        resolvedAt: resolvedAt? resolvedAt.toISOString(): null,
        satisfaction,
      })
    }
    return history.sort((a,b)=>new Date(a.openedAt)-new Date(b.openedAt))
  }
  return [
    {...schools[0], history: mk(3)},
    {...schools[1], history: mk(5)},
    {...schools[2], history: mk(7)},
  ]
}

/********************************  Tiny Charts  ********************************/
function Donut({value=0,size=160,thickness=24,color="#111",track="#e5e7eb"}){
  const clamped=Math.max(0,Math.min(100,value))
  return (
    <div className="mx-auto" style={{width:size,height:size}}>
      <div className="relative w-full h-full grid place-items-center" style={{background:`conic-gradient(${color} ${clamped*3.6}deg, ${track} 0)`, borderRadius:"9999px"}}>
        <div className="absolute" style={{width:size-thickness*2,height:size-thickness*2, background:"white", borderRadius:"9999px"}}/>
        <div className="relative text-3xl font-semibold" style={{color}}>{clamped}%</div>
      </div>
    </div>
  )
}

function Sparkline({data=[],avg=[],width=260,height=70}){
  const max=Math.max(1,...data)
  const toY=v=> height - (v/max)*height
  const step= data.length>1? width/(data.length-1): width
  const path=data.map((v,i)=>`${i===0?"M":"L"}${i*step},${toY(v)}`).join(" ")
  const avgPath=avg.map((v,i)=> v==null? null : `${i===0?"M":"L"}${i*step},${toY(v)}`).filter(Boolean).join(" ")
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[70px]">
      <path d={path} fill="none" stroke="#111" strokeWidth="2"/>
      {avgPath && <path d={avgPath} fill="none" stroke="#9ca3af" strokeWidth="1" strokeDasharray="4 3"/>}
    </svg>
  )
}
function SimpleBar({data=[],height=160}){
  const max=Math.max(1,...data.map(d=>d.count))
  return (
    <div className="w-full" style={{height}}>
      <div className="h-full w-full flex items-end gap-0.5">
        {data.map((d,i)=>{
          const h=Math.round((d.count/max)*100)
          return <div key={d.date+"-"+i} title={`${d.date}: ${d.count}`} className="flex-1 bg-gray-200"><div className="w-full" style={{height:`${h}%`, background:"linear-gradient(to top, rgba(31,41,55,1), rgba(31,41,55,0.6))"}}/></div>
        })}
      </div>
    </div>
  )
}
function formatDate(iso){const d=new Date(iso); return d.toLocaleDateString(undefined,{day:"2-digit",month:"short",year:"numeric"})}

/***********************************  MAP (Leaflet)  ***********************************/
function useLeafletReady(){
  const [ready,setReady]=useState(false)
  useEffect(()=>{
    if(typeof window==="undefined") return
    if(window.L){setReady(true);return}
    const cssId="leaflet-css"; if(!document.getElementById(cssId)){ const link=document.createElement("link"); link.id=cssId; link.rel="stylesheet"; link.href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"; document.head.appendChild(link) }
    const jsId="leaflet-js"; if(document.getElementById(jsId)){ document.getElementById(jsId).addEventListener("load",()=>setReady(true)); return }
    const script=document.createElement("script"); script.id=jsId; script.src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"; script.async=true; script.onload=()=>setReady(true); document.body.appendChild(script)
  },[])
  return ready
}
function LeafletMap({points,showActive,showInactive}){
  const mapEl=useRef(null), mapRef=useRef(null), layerRef=useRef(null)
  const ready=useLeafletReady()
  useEffect(()=>{ if(!ready||!mapEl.current||mapRef.current) return; const L=window.L; const map=L.map(mapEl.current).setView([-6.9175,107.6191],12); L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{ attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>' }).addTo(map); mapRef.current=map; layerRef.current=L.layerGroup().addTo(map); return ()=>{map.remove()} },[ready])
  useEffect(()=>{ if(!ready||!mapRef.current||!layerRef.current) return; const L=window.L; const layer=layerRef.current; layer.clearLayers(); const data=filterByActive(points,showActive,showInactive); data.forEach(p=>{ const color=p.role==="siswa"? (p.active?"#16a34a":"#6b7280") : (p.active?"#7c3aed":"#6b7280"); const marker=L.circleMarker([p.lat,p.lng],{radius:6,color,fillColor:color,fillOpacity:0.7}); marker.bindTooltip(`${p.role.toUpperCase()} · ${p.name} · ${p.active?"Aktif":"Tidak Aktif"}`); marker.addTo(layer) }) },[ready,points,showActive,showInactive])
  if(!ready) return <div className="w-full h-full rounded-xl bg-gray-100 animate-pulse"/>
  return <div ref={mapEl} className="w-full h-full rounded-xl overflow-hidden"/>
}
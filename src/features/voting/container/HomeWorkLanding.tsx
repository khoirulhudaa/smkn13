import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { X, Upload, Loader, Save } from "lucide-react";
import { clsx } from "clsx";

// ──────────────────────────────────────────────────────────────
// Konstanta
// ──────────────────────────────────────────────────────────────

const BASE_URL = "http://localhost:5005/osis";
const SCHOOL_ID = "1"; // Ganti dengan nilai dinamis dari useSchool() atau auth

// ──────────────────────────────────────────────────────────────
// Komponen Utama OSIS Page / Section
// ──────────────────────────────────────────────────────────────

export function OsisPage() {
  const [osisData, setOsisData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState<"editOsis" | null>(null);

  // Form state (sesuai struktur backend)
  const [formData, setFormData] = useState({
    periodeSaatIni: "",
    ketuaNama: "",
    ketuaNipNuptk: "",
    wakilNama: "",
    wakilNipNuptk: "",
    bendaharaNama: "",
    bendaharaNipNuptk: "",
    sekretarisNama: "",
    sekretarisNipNuptk: "",
    visi: "",
    misi: [] as string[],
    prestasiSaatIni: [] as Array<{ judul: string; tahun: string; deskripsi: string }>,
    // Riwayat kepemimpinan tidak diedit di form ini (hanya via addToRiwayat jika perlu)
  });

  const [files, setFiles] = useState<Record<string, File | null>>({
    ketuaFoto: null,
    wakilFoto: null,
    bendaharaFoto: null,
    sekretarisFoto: null,
  });

  const [previews, setPreviews] = useState<Record<string, string | null>>({});

  // Fetch data OSIS
  useEffect(() => {
    const fetchOsis = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}?schoolId=${SCHOOL_ID}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        if (json.success && json.data) {
          setOsisData(json.data);
          // Populate form dengan data yang ada
          setFormData({
            periodeSaatIni: json.data.periodeSaatIni || "",
            ketuaNama: json.data.ketuaNama || "",
            ketuaNipNuptk: json.data.ketuaNipNuptk || "",
            wakilNama: json.data.wakilNama || "",
            wakilNipNuptk: json.data.wakilNipNuptk || "",
            bendaharaNama: json.data.bendaharaNama || "",
            bendaharaNipNuptk: json.data.bendaharaNipNuptk || "",
            sekretarisNama: json.data.sekretarisNama || "",
            sekretarisNipNuptk: json.data.sekretarisNipNuptk || "",
            visi: json.data.visi || "",
            misi: Array.isArray(json.data.misi) ? json.data.misi : [],
            prestasiSaatIni: Array.isArray(json.data.prestasiSaatIni) ? json.data.prestasiSaatIni : [],
          });
          // Set preview dari URL yang sudah ada
          setPreviews({
            ketuaFoto: json.data.ketuaFotoUrl || null,
            wakilFoto: json.data.wakilFotoUrl || null,
            bendaharaFoto: json.data.bendaharaFotoUrl || null,
            sekretarisFoto: json.data.sekretarisFotoUrl || null,
          });
        } else {
          setOsisData(null);
        }
      } catch (err: any) {
        console.error("Fetch OSIS error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOsis();
  }, []);

  const updateForm = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const updateMisi = (index: number, value: string) => {
    const newMisi = [...formData.misi];
    newMisi[index] = value;
    setFormData((prev) => ({ ...prev, misi: newMisi }));
  };

  const addMisi = () => {
    setFormData((prev) => ({ ...prev, misi: [...prev.misi, ""] }));
  };

  const removeMisi = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      misi: prev.misi.filter((_, i) => i !== index),
    }));
  };

  const updatePrestasi = (index: number, field: string, value: string) => {
    const newPrestasi = [...formData.prestasiSaatIni];
    newPrestasi[index] = { ...newPrestasi[index], [field]: value };
    setFormData((prev) => ({ ...prev, prestasiSaatIni: newPrestasi }));
  };

  const addPrestasi = () => {
    setFormData((prev) => ({
      ...prev,
      prestasiSaatIni: [...prev.prestasiSaatIni, { judul: "", tahun: "", deskripsi: "" }],
    }));
  };

  const removePrestasi = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      prestasiSaatIni: prev.prestasiSaatIni.filter((_, i) => i !== index),
    }));
  };

  const handleFileChange = (role: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [role]: file }));
      const previewUrl = URL.createObjectURL(file);
      setPreviews((prev) => ({ ...prev, [role]: previewUrl }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formPayload = new FormData();

      formPayload.append("schoolId", SCHOOL_ID);
      formPayload.append("periodeSaatIni", formData.periodeSaatIni);
      formPayload.append("ketuaNama", formData.ketuaNama);
      formPayload.append("ketuaNipNuptk", formData.ketuaNipNuptk || "");
      formPayload.append("wakilNama", formData.wakilNama);
      formPayload.append("wakilNipNuptk", formData.wakilNipNuptk || "");
      formPayload.append("bendaharaNama", formData.bendaharaNama);
      formPayload.append("bendaharaNipNuptk", formData.bendaharaNipNuptk || "");
      formPayload.append("sekretarisNama", formData.sekretarisNama);
      formPayload.append("sekretarisNipNuptk", formData.sekretarisNipNuptk || "");
      formPayload.append("visi", formData.visi);
      formPayload.append("misi", JSON.stringify(formData.misi.filter((m) => m.trim())));

      if (formData.prestasiSaatIni.length > 0) {
        formPayload.append("prestasiSaatIni", JSON.stringify(formData.prestasiSaatIni));
      }

      // Attach files
      Object.entries(files).forEach(([key, file]) => {
        if (file) {
          formPayload.append(key, file);
        }
      });

      const res = await fetch(BASE_URL, {
        method: "POST", // backend handle create or update
        body: formPayload,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || `Gagal menyimpan (${res.status})`);
      }

      const result = await res.json();
      if (result.success) {
        setOsisData(result.data);
        setModal(null);
        alert("Data OSIS berhasil disimpan!");
      }
    } catch (err: any) {
      console.error(err);
      alert(`Gagal menyimpan: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const roles = [
    { key: "ketua", title: "Ketua OSIS" },
    { key: "wakil", title: "Wakil Ketua OSIS" },
    { key: "bendahara", title: "Bendahara OSIS" },
    { key: "sekretaris", title: "Sekretaris OSIS" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Data OSIS</h1>
          <button
            onClick={() => setModal("editOsis")}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Save size={18} />
            Edit Data OSIS
          </button>
        </div>

        {osisData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Periode */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Periode Saat Ini</h3>
              <p className="text-2xl text-blue-400">{osisData.periodeSaatIni || "—"}</p>
            </div>

            {/* Visi */}
            <div className="md:col-span-2 lg:col-span-3 bg-zinc-900/60 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Visi OSIS</h3>
              <p className="text-zinc-300 whitespace-pre-line">{osisData.visi || "Belum ada visi"}</p>
            </div>

            {/* Misi */}
            <div className="md:col-span-2 lg:col-span-3 bg-zinc-900/60 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Misi OSIS</h3>
              {osisData.misi?.length > 0 ? (
                <ol className="list-decimal list-inside space-y-2 text-zinc-300">
                  {osisData.misi.map((m: string, i: number) => (
                    <li key={i}>{m}</li>
                  ))}
                </ol>
              ) : (
                <p className="text-zinc-500 italic">Belum ada misi</p>
              )}
            </div>

            {/* Pengurus OSIS */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {roles.map((role) => {
                const nama = osisData[`${role.key}Nama`];
                const nip = osisData[`${role.key}NipNuptk`];
                const fotoUrl = osisData[`${role.key}FotoUrl`];

                return (
                  <div key={role.key} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 text-center">
                    {fotoUrl && (
                      <img
                        src={fotoUrl}
                        alt={`${role.title} photo`}
                        className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-zinc-700 shadow-lg mb-4"
                      />
                    )}
                    <h4 className="text-lg font-semibold mb-2">{role.title}</h4>
                    <p className="text-zinc-300 font-medium">{nama || "—"}</p>
                    {nip && <p className="text-sm text-zinc-500 mt-1">NIP/NUPTK: {nip}</p>}
                  </div>
                );
              })}
            </div>

            {/* Prestasi */}
            <div className="lg:col-span-3 bg-zinc-900/60 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Prestasi Periode Ini</h3>
              {osisData.prestasiSaatIni?.length > 0 ? (
                <div className="space-y-6">
                  {osisData.prestasiSaatIni.map((p: any, i: number) => (
                    <div key={i} className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-semibold text-lg">{p.judul || "Prestasi"}</h4>
                      <p className="text-sm text-zinc-400">{p.tahun || "—"}</p>
                      <p className="mt-2 text-zinc-300">{p.deskripsi || "—"}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-500 italic">Belum ada prestasi tercatat</p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-zinc-900/40 rounded-2xl border border-zinc-800">
            <FileText className="mx-auto h-16 w-16 text-zinc-600 mb-6" />
            <h2 className="text-2xl font-bold mb-4">Belum Ada Data OSIS</h2>
            <p className="text-zinc-400 mb-8">Silakan tambahkan data OSIS terlebih dahulu</p>
            <button
              onClick={() => setModal("editOsis")}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium"
            >
              Buat Data OSIS Sekarang
            </button>
          </div>
        )}
      </div>

      {/* ──── MODAL EDIT ──── */}
      <AnimatePresence>
        {modal === "editOsis" && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
              onClick={() => setModal(null)}
            />

            {/* Modal Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-lg bg-zinc-950 border-l border-zinc-800 shadow-2xl overflow-y-auto z-50"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Edit Data OSIS Saat Ini</h3>
                  <button onClick={() => setModal(null)} className="text-zinc-400 hover:text-white">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Periode */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-zinc-300">Periode Saat Ini</label>
                    <input
                      type="text"
                      value={formData.periodeSaatIni}
                      onChange={(e) => updateForm("periodeSaatIni", e.target.value)}
                      placeholder="2025/2026"
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white focus:border-blue-500/50 outline-none"
                    />
                  </div>

                  {/* Pengurus */}
                  {roles.map((role) => (
                    <div key={role.key} className="space-y-4 border-t border-zinc-800 pt-5">
                      <h4 className="font-medium text-lg text-zinc-200 capitalize">{role.title}</h4>

                      <input
                        placeholder="Nama"
                        value={formData[`${role.key}Nama` as keyof typeof formData] as string}
                        onChange={(e) => updateForm(`${role.key}Nama`, e.target.value)}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white focus:border-blue-500/50 outline-none"
                      />

                      <input
                        placeholder="NIP/NUPTK (opsional)"
                        value={formData[`${role.key}NipNuptk` as keyof typeof formData] as string}
                        onChange={(e) => updateForm(`${role.key}NipNuptk`, e.target.value)}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white focus:border-blue-500/50 outline-none"
                      />

                      <div>
                        <label className="block text-sm font-medium mb-2 text-zinc-300">Foto {role.title}</label>
                        <label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-zinc-600 rounded-xl cursor-pointer hover:border-blue-500/50 transition-colors bg-zinc-900/40">
                          <div className="text-center">
                            <Upload className="mx-auto h-10 w-10 text-zinc-500" />
                            <p className="mt-3 text-sm text-zinc-400">Klik atau drag foto di sini</p>
                            <p className="text-xs text-zinc-500 mt-1">(max 5MB, jpg/png)</p>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileChange(`${role.key}Foto`, e)}
                          />
                        </label>

                        {(previews[`${role.key}Foto`] || osisData?.[`${role.key}FotoUrl`]) && (
                          <div className="mt-4 flex justify-center">
                            <img
                              src={previews[`${role.key}Foto`] || osisData?.[`${role.key}FotoUrl`]}
                              alt="Preview"
                              className="h-32 w-32 object-cover rounded-xl border border-zinc-700 shadow-lg"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Visi */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-zinc-300">Visi</label>
                    <textarea
                      value={formData.visi}
                      onChange={(e) => updateForm("visi", e.target.value)}
                      rows={4}
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white resize-y focus:border-blue-500/50 outline-none"
                      placeholder="Tuliskan visi OSIS..."
                    />
                  </div>

                  {/* Misi */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-zinc-300">Misi</label>
                    {formData.misi.map((misi, idx) => (
                      <div key={idx} className="flex gap-3 mb-3">
                        <input
                          value={misi}
                          onChange={(e) => updateMisi(idx, e.target.value)}
                          className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white focus:border-blue-500/50 outline-none"
                          placeholder={`Misi ${idx + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() => removeMisi(idx)}
                          className="rounded-lg border border-red-600/50 px-4 py-2.5 text-red-400 hover:bg-red-900/30 transition-colors"
                        >
                          Hapus
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addMisi}
                      className="mt-3 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                    >
                      <Upload size={16} /> Tambah Misi
                    </button>
                  </div>

                  {/* Prestasi */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-zinc-300">Prestasi Periode Ini</label>
                    {formData.prestasiSaatIni.map((p, idx) => (
                      <div key={idx} className="border border-zinc-800 rounded-xl p-4 mb-4 bg-zinc-950/50">
                        <input
                          placeholder="Judul Prestasi"
                          value={p.judul}
                          onChange={(e) => updatePrestasi(idx, "judul", e.target.value)}
                          className="w-full mb-3 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white focus:border-blue-500/50 outline-none"
                        />
                        <input
                          placeholder="Tahun"
                          value={p.tahun}
                          onChange={(e) => updatePrestasi(idx, "tahun", e.target.value)}
                          className="w-full mb-3 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white focus:border-blue-500/50 outline-none"
                        />
                        <textarea
                          placeholder="Deskripsi singkat"
                          value={p.deskripsi}
                          onChange={(e) => updatePrestasi(idx, "deskripsi", e.target.value)}
                          rows={3}
                          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white focus:border-blue-500/50 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => removePrestasi(idx)}
                          className="mt-3 text-sm text-red-400 hover:text-red-300 transition-colors"
                        >
                          Hapus Prestasi
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addPrestasi}
                      className="mt-3 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                    >
                      <Upload size={16} /> Tambah Prestasi
                    </button>
                  </div>

                  {/* Tombol Submit */}
                  <div className="flex justify-end gap-4 pt-6 border-t border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setModal(null)}
                      className="px-6 py-2.5 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className={clsx(
                        "px-8 py-2.5 rounded-lg text-white font-medium flex items-center gap-2 transition-colors",
                        saving ? "bg-blue-800 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                      )}
                    >
                      {saving ? (
                        <>
                          <Loader className="h-5 w-5 animate-spin" />
                          Menyimpan...
                        </>
                      ) : (
                        "Simpan Perubahan"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
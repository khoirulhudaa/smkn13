import { SMAN25_CONFIG } from '@/core/theme';
import { FooterComp } from "@/features/_global/components/footer";
import { HeroComp } from '@/features/_global/components/hero';
import NavbarComp from "@/features/_global/components/navbar";
import { getSchoolId } from '@/features/_global/hooks/getSchoolId';
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import * as z from "zod";

/****************************
 * PLACEHOLDER AVATAR
 ****************************/
const PLACEHOLDER_AVATAR = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="320">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="%23a7c7ff"/>
      <stop offset="1" stop-color="%23f2c94c"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="%230B1733"/>
  <rect x="8" y="8" width="384" height="304" rx="18" fill="url(%23g)" fill-opacity="0.18"/>
  <circle cx="200" cy="130" r="58" fill="%23ffffff" fill-opacity="0.18"/>
  <rect x="90" y="220" width="220" height="16" rx="8" fill="%23ffffff" fill-opacity="0.14"/>
</svg>
`);

/****************************
 * TYPES
 ****************************/
interface AlumniItem {
  id: string;
  name: string;
  graduationYear: number | string;
  description?: string;
  photoUrl?: string;
  angkatan: string;
  title?: string;
  handle?: string;
  likes: number;
  liked: boolean;
  thumbs: number;
  thumbed: boolean;
  shares: number;
  shared: boolean;
}

/****************************
 * INLINE PROFILE CARD (sederhana)
 ****************************/
const InlineProfileCard: React.FC<{
  avatarUrl: string;
  name: string;
  title?: string;
  angkatan: string;
  description?: string;
  theme: any;
}> = ({ avatarUrl, name, title, angkatan }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden border border-blue-300 rounded-2xl shadow-xl h-[380px]"
      // whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
    >
      <img
        src={avatarUrl || PLACEHOLDER_AVATAR}
        alt={name}
        className="w-full h-full object-cover"
        onError={(e) => (e.currentTarget.src = PLACEHOLDER_AVATAR)}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
        <h3 className="text-xl font-bold">{name}</h3>
        <p className="text-sm opacity-90 mt-1">Angkatan {angkatan}</p>
        {title && <p className="text-sm mt-2 opacity-80">{title}</p>}
        {/* {description && (
          <p className="text-xs mt-3 line-clamp-3 opacity-75">{description}</p>
        )} */}
      </div>
    </motion.div>
  );
};

/****************************
 * MAIN COMPONENT - Buku Alumni
 ****************************/
const API_BASE_URL = "https://be-school.kiraproject.id";
const SCHOOL_ID = getSchoolId(); 

const registerAlumniSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  graduationYear: z.string().regex(/^\d{4}$/, "Tahun harus 4 digit (contoh: 2023)"),
  major: z.string().min(2, "Jurusan asal wajib diisi").optional(),
  description: z.string().max(500, "Maksimal 500 karakter").optional(),
});

type RegisterAlumniForm = z.infer<typeof registerAlumniSchema>;

export function BukuAlumni() {
  const schoolInfo = SMAN25_CONFIG;
  const theme = schoolInfo.theme;

  const [alumniData, setAlumniData] = useState<AlumniItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterAlumniForm>({
    resolver: zodResolver(registerAlumniSchema),
  });

  // Fetch data alumni
  const fetchAlumni = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE_URL}/alumni?schoolId=${SCHOOL_ID}`, {
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json = await res.json();

      if (!json.success || !Array.isArray(json.data)) {
        throw new Error('Format response tidak valid');
      }

      // ── Optimasi utama di sini ───────────────────────────────
      const mapped = json.data.map((item) => {
        const description = item.description || '';
        const parts = description.split(/[\r\n]+/);

        const title = parts[0]?.trim() || 'Alumni';
        const desc = parts[1]?.trim() || '';

        return {
          id: String(item.id),
          name: item.name || 'Tanpa Nama',
          graduationYear: item.graduationYear || '—',
          description, // tetap simpan full text kalau perlu di tempat lain
          photoUrl: item.photoUrl || PLACEHOLDER_AVATAR,
          angkatan: item.graduationYear != null ? String(item.graduationYear) : '—',
          title,
          desc,
          handle: (item.name || '').toLowerCase().replace(/\s+/g, '.'),
          // nilai default yang sering berulang → bisa di luar map kalau mau hemat memori
          likes: 0,
          liked: false,
          thumbs: 0,
          thumbed: false,
          shares: 0,
          shared: false,
        };
      });

      setAlumniData(mapped);
    } catch (err) {
      console.error('Fetch alumni error:', err);
      setError('Gagal memuat data alumni. Silakan coba lagi nanti.');
      setAlumniData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlumni();
  }, [fetchAlumni]);

  // Handle upload foto + preview
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Submit registrasi
  const onRegisterAlumni = async (data: RegisterAlumniForm) => {
    setRegisterLoading(true);
    setRegisterError(null);
    setRegisterSuccess(false);

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("graduationYear", data.graduationYear);

      // Gabungkan major ke description jika ada
      let desc = data.description || "";
      if (data.major) {
        desc = `Jurusan asal: ${data.major}${desc ? `\n\n${desc}` : ''}`;
      }
      if (desc) formData.append("description", desc);

      formData.append("schoolId", String(SCHOOL_ID));

      if (photoFile) {
        formData.append("photo", photoFile);
      }

      const res = await fetch(`${API_BASE_URL}/alumni`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Gagal mendaftarkan alumni");
      }

      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Registrasi gagal");

      setRegisterSuccess(true);

      // Reset form & tutup modal setelah 1.5 detik
      setTimeout(() => {
        reset();
        setPhotoFile(null);
        setPhotoPreview(null);
        setShowRegisterModal(false);
        fetchAlumni(); // Refresh data
      }, 1500);
    } catch (err: any) {
      setRegisterError(err.message || "Terjadi kesalahan");
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      <NavbarComp theme={theme} />
      <HeroComp titleProps='Buku Alumni' id='#alumni' />

      <main className="mx-auto max-w-7xl px-6 py-16" id='alumni'>
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-4 pb-10">
          <div className="w-max">
            <div className='w-max flex gap-4 mb-5 items-center'>
              <button
                onClick={() => setShowRegisterModal(true)}
                className="px-8 py-4 rounded-full w-max bg-gray-900 text-white font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-blue-600 hover:scale-105 transition-all active:scale-95"
              >
                + Gabung Direktori
              </button>
              <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase italic leading-[0.8]">
                Relasi <span className="text-blue-600">Kita</span>
              </h1>
            </div>
            <p className="text-lg text-gray-500 font-medium">
              Menghubungkan {alumniData.length} orang
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-[420px] bg-gray-100 rounded-[2.5rem] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {alumniData.map((alumni) => (
              <InlineProfileCard
                key={alumni.id}
                avatarUrl={alumni.photoUrl || ""}
                name={alumni.name}
                title={alumni.title}
                angkatan={alumni.angkatan}
                theme={theme}
              />
            ))}
          </div>
        )}
      </main>

      {/* MODAL REGISTRASI (Tetap Sesuai Struktur Awal) */}
      <AnimatePresence>
        {showRegisterModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999999999999999999999999999999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setShowRegisterModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="relative w-[94vw] md:w-[80vw] max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8 md:p-10">
                <h2 className="text-3xl font-black text-gray-900 mb-8 uppercase italic tracking-tighter">
                  Daftarkan Profil Anda
                </h2>
                
                <form onSubmit={handleSubmit(onRegisterAlumni)} className="gap-8 grid grid-cols-1 md:grid-cols-2">
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Nama Lengkap</label>
                      <input {...register("name")} className="w-full px-5 py-4 bg-gray-200 placeholder:text-black/50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none font-bold text-gray-800" placeholder="John Doe" />
                      {errors.name && <p className="mt-2 text-xs font-bold text-red-500 uppercase">{errors.name.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Angkatan</label>
                        <input {...register("graduationYear")} className="w-full px-5 py-4 bg-gray-200 placeholder:text-black/50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none font-bold text-gray-800" placeholder="2020" maxLength={4} />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Jurusan</label>
                        <input {...register("major")} className="w-full px-5 py-4 bg-gray-200 placeholder:text-black/50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none font-bold text-gray-800" placeholder="IPA/IPS" />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Bio Singkat</label>
                      <textarea {...register("description")} className="w-full px-5 py-4 bg-gray-200 placeholder:text-black/50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none font-medium text-gray-800 h-32 resize-none" placeholder="Ceritakan pencapaian atau profesi Anda sekarang..." />
                    </div>
                  </div>

                  <div className="flex flex-col justify-between">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 block">Foto Profil</label>
                      <div className="relative group w-40 h-40 mx-auto md:mx-0">
                        <div className="w-full h-full rounded-[2.5rem] bg-gray-200 border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center">
                          {photoPreview ? (
                            <img src={photoPreview} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] font-black text-red-500 uppercase">No Image</span>
                          )}
                        </div>
                        <label className="absolute inset-0 cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity rounded-[2.5rem]">
                          <span className="text-white text-[10px] font-black uppercase tracking-widest">Ganti</span>
                          <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-10 md:mt-0">
                      <button type="button" onClick={() => setShowRegisterModal(false)} className="flex-1 py-4 bg-red-600 rounded-2xl font-black text-[12px] uppercase tracking-widest hover:bg-red-700 transition-colors">Batal</button>
                      <button type="submit" disabled={registerLoading} className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black text-[12px] uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-100 disabled:opacity-50">
                        {registerLoading ? "Mengirim..." : "Simpan Profil"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      <FooterComp />
    </div>
  );
}
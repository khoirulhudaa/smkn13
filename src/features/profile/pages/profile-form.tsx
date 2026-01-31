// // // import { zodResolver } from "@hookform/resolvers/zod";
// // // import {
// // //   FormControl,
// // //   FormMessage,
// // //   FormField,
// // //   SelectContent,
// // //   SelectItem,
// // //   FormItem,
// // //   FormLabel,
// // //   Input,
// // //   SelectTrigger,
// // //   SelectValue,
// // //   Textarea,
// // //   Select,
// // //   Button,
// // //   Form,
// // //   Popover,
// // //   PopoverTrigger,
// // //   PopoverContent,
// // //   Calendar,
// // // } from "@/core/libs";
// // // import { useEffect, useMemo, useRef } from "react";
// // // import { useForm } from "react-hook-form";
// // // import { z } from "zod";
// // // import { useProfile } from "../hooks";
// // // import { UserModel } from "@/core/models";
// // // import { dayjs, forwardDateDisabled } from "@/core/libs";
// // // import { DashboardPageLayout, useAlert } from "@/features/_global";
// // // import { useNavigate } from "react-router-dom";
// // // import { CalendarIcon } from "lucide-react";
// // // const updateProfileSchema = z.object({
// // //   nama: z
// // //     .string()
// // //     .min(1, { message: "Nama harus minimal 1 karakter" })
// // //     .optional(),
// // //   jk: z
// // //     .enum(["Pria", "Wanita"], {
// // //       message: "Jenis kelamin harus Pria atau Wanita",
// // //     })
// // //     .optional(),
// // //   agama: z.string().optional(),
// // //   tempat_lahir: z.string().optional(),
// // //   tgl_lahir: z.string().optional(),
// // //   alamat_dom: z.string().optional(),
// // //   jml_anak: z.number().nullable().optional(),
// // //   no_hp: z.string().optional(),
// // //   email: z
// // //     .string()
// // //     .email({ message: "Format email tidak valid, silahkan cek kembali!" })
// // //     .optional(),
// // //   kontak_darurat: z.string().optional(),
// // //   alamat_ktp: z.string().optional(),
// // //   status: z
// // //     .enum(["Menikah", "Lajang"], {
// // //       message: "Status harus Menikah atau Lajang",
// // //     })
// // //     .optional(),
// // // });

// // // type ProfileFormValues = z.infer<typeof updateProfileSchema>;

// // // export function EditProfileForm() {
// // //   const profile = useProfile();
// // //   const alert = useAlert();
// // //   const navigate = useNavigate();
// // //   const userDataJson = useMemo(
// // //     () => (profile.user ? JSON.stringify(profile.user) : ""),
// // //     [profile.user],
// // //   );

// // //   const form = useForm<ProfileFormValues>({
// // //     resolver: zodResolver(updateProfileSchema),
// // //     defaultValues: {
// // //       nama: "",
// // //       jk: undefined,
// // //       agama: "",
// // //       tempat_lahir: "",
// // //       tgl_lahir: "",
// // //       alamat_dom: "",
// // //       jml_anak: undefined,
// // //       no_hp: "",
// // //       email: "",
// // //       kontak_darurat: "",
// // //       alamat_ktp: "",
// // //       status: undefined,
// // //     },
// // //     mode: "onChange",
// // //   });

// // //   const formResetRef = useRef(form.reset);

// // //   useEffect(() => {
// // //     if (!form.formState.isDirty && userDataJson) {
// // //       const userData: UserModel = JSON.parse(userDataJson);
// // //       formResetRef.current?.({
// // //         nama: userData.nama || "",
// // //         jk: (userData.jk as "Pria" | "Wanita") || undefined,
// // //         agama: userData.agama || "",
// // //         tempat_lahir: userData.tempat_lahir || "",
// // //         tgl_lahir: userData.tgl_lahir || "",
// // //         alamat_dom: userData.alamat_dom || "",
// // //         jml_anak: userData.jml_anak || undefined,
// // //         no_hp: userData.no_hp || "",
// // //         email: userData.email || "",
// // //         kontak_darurat: userData.kontak_darurat || "",
// // //         alamat_ktp: userData.alamat_ktp || "",
// // //         status: (userData.status as "Menikah" | "Lajang") || undefined,
// // //       });
// // //     }
// // //   }, [form.formState.isDirty, userDataJson]);

// // //   async function onSubmit(data: ProfileFormValues) {
// // //     try {
// // //       await profile.updateProfile(data);
// // //       alert.success("Profil berhasil di perbarui");
// // //       navigate("/profile", { replace: true });
// // //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
// // //     } catch (err: any) {
// // //       alert.error(err?.message || "gagal memperbarui profil");
// // //     }
// // //   }

// // //   return (
// // //     <DashboardPageLayout
// // //       title="Edit Profile"
// // //       breadcrumbs={[
// // //         {
// // //           label: "profile",
// // //           url: "/profile",
// // //         },
// // //         {
// // //           label: "Edit Profile",
// // //           url: "/profile/edit",
// // //         },
// // //       ]}
// // //     >
// // //       <Form {...form}>
// // //         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
// // //           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-6">
// // //             <div>
// // //               <FormField
// // //                 control={form.control}
// // //                 name="nama"
// // //                 render={({ field, fieldState }) => (
// // //                   <FormItem>
// // //                     <FormLabel>Nama</FormLabel>
// // //                     <FormControl>
// // //                       <Input placeholder="Masukkan nama" {...field} />
// // //                     </FormControl>
// // //                     <FormMessage>{fieldState.error?.message}</FormMessage>
// // //                   </FormItem>
// // //                 )}
// // //               />
// // //             </div>

// // //             <div>
// // //               <FormField
// // //                 control={form.control}
// // //                 name="jk"
// // //                 render={({ field, fieldState }) => (
// // //                   <FormItem>
// // //                     <FormLabel>Jenis Kelamin</FormLabel>
// // //                     <Select
// // //                       onValueChange={field.onChange}
// // //                       defaultValue={field.value}
// // //                       value={field.value}
// // //                     >
// // //                       <FormControl>
// // //                         <SelectTrigger>
// // //                           <SelectValue placeholder="Pilih jenis kelamin" />
// // //                         </SelectTrigger>
// // //                       </FormControl>
// // //                       <SelectContent>
// // //                         <SelectItem value="Pria">Pria</SelectItem>
// // //                         <SelectItem value="Wanita">Wanita</SelectItem>
// // //                       </SelectContent>
// // //                     </Select>
// // //                     <FormMessage>{fieldState.error?.message}</FormMessage>
// // //                   </FormItem>
// // //                 )}
// // //               />
// // //             </div>
// // //             <div>
// // //               <FormField
// // //                 control={form.control}
// // //                 name="agama"
// // //                 render={({ field, fieldState }) => (
// // //                   <FormItem>
// // //                     <FormLabel>Agama</FormLabel>
// // //                     <FormControl>
// // //                       <Input placeholder="Masukkan agama" {...field} />
// // //                     </FormControl>
// // //                     <FormMessage>{fieldState.error?.message}</FormMessage>
// // //                   </FormItem>
// // //                 )}
// // //               />
// // //             </div>
// // //             <div>
// // //               <FormField
// // //                 control={form.control}
// // //                 name="tempat_lahir"
// // //                 render={({ field, fieldState }) => (
// // //                   <FormItem>
// // //                     <FormLabel>Tempat Lahir</FormLabel>
// // //                     <FormControl>
// // //                       <Input placeholder="Masukkan tempat lahir" {...field} />
// // //                     </FormControl>
// // //                     <FormMessage>{fieldState.error?.message}</FormMessage>
// // //                   </FormItem>
// // //                 )}
// // //               />
// // //             </div>
// // //             <div>
// // //               <FormField
// // //                 control={form.control}
// // //                 name="tgl_lahir"
// // //                 render={({ field, fieldState }) => (
// // //                   <FormItem className="flex flex-col mb-6">
// // //                     <FormLabel>Tanggal Lahir</FormLabel>
// // //                     <Popover>
// // //                       <PopoverTrigger asChild>
// // //                         <FormControl>
// // //                           <Button
// // //                             variant={"outline"}
// // //                             className=" pl-3 text-left font-normal"
// // //                           >
// // //                             {field.value ? (
// // //                               dayjs(field.value).format("DD MMMM YYYY")
// // //                             ) : (
// // //                               <span>Pick a date</span>
// // //                             )}
// // //                             <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
// // //                           </Button>
// // //                         </FormControl>
// // //                       </PopoverTrigger>
// // //                       <PopoverContent className="w-auto p-0" align="start">
// // //                         <Calendar
// // //                           mode="single"
// // //                           selected={dayjs(field.value).toDate()}
// // //                           onSelect={field.onChange}
// // //                           disabled={forwardDateDisabled}
// // //                           initialFocus
// // //                         />
// // //                       </PopoverContent>
// // //                     </Popover>
// // //                     <FormMessage>{fieldState.error?.message}</FormMessage>
// // //                   </FormItem>
// // //                 )}
// // //               />
// // //             </div>
// // //             <div>
// // //               <FormField
// // //                 control={form.control}
// // //                 name="alamat_dom"
// // //                 render={({ field, fieldState }) => (
// // //                   <FormItem>
// // //                     <FormLabel>Alamat Domisili</FormLabel>
// // //                     <FormControl>
// // //                       <Textarea
// // //                         placeholder="Masukkan alamat domisili"
// // //                         {...field}
// // //                       />
// // //                     </FormControl>
// // //                     <FormMessage>{fieldState.error?.message}</FormMessage>
// // //                   </FormItem>
// // //                 )}
// // //               />
// // //             </div>
// // //             <div>
// // //               <FormField
// // //                 control={form.control}
// // //                 name="jml_anak"
// // //                 render={({ field, fieldState }) => (
// // //                   <FormItem>
// // //                     <FormLabel>Jumlah Anak</FormLabel>
// // //                     <FormControl>
// // //                       <Input
// // //                         type="number"
// // //                         placeholder="Masukkan jumlah anak"
// // //                         {...field}
// // //                         onChange={(e) => {
// // //                           const value = e.target.value;
// // //                           field.onChange(
// // //                             value === "" ? undefined : parseInt(value, 10),
// // //                           );
// // //                         }}
// // //                         value={field.value ?? ""}
// // //                       />
// // //                     </FormControl>
// // //                     <FormMessage>{fieldState.error?.message}</FormMessage>
// // //                   </FormItem>
// // //                 )}
// // //               />
// // //             </div>

// // //             <div>
// // //               <FormField
// // //                 control={form.control}
// // //                 name="no_hp"
// // //                 render={({ field, fieldState }) => (
// // //                   <FormItem>
// // //                     <FormLabel>Nomor HP</FormLabel>
// // //                     <FormControl>
// // //                       <Input placeholder="Masukkan nomor HP" {...field} />
// // //                     </FormControl>
// // //                     <FormMessage>{fieldState.error?.message}</FormMessage>
// // //                   </FormItem>
// // //                 )}
// // //               />
// // //             </div>

// // //             <div>
// // //               <FormField
// // //                 control={form.control}
// // //                 name="email"
// // //                 render={({ field, fieldState }) => (
// // //                   <FormItem>
// // //                     <FormLabel>Email</FormLabel>
// // //                     <FormControl>
// // //                       <Input
// // //                         type="email"
// // //                         placeholder="Masukkan email"
// // //                         {...field}
// // //                       />
// // //                     </FormControl>
// // //                     <FormMessage>{fieldState.error?.message}</FormMessage>
// // //                   </FormItem>
// // //                 )}
// // //               />
// // //             </div>
// // //             <div>
// // //               <FormField
// // //                 control={form.control}
// // //                 name="kontak_darurat"
// // //                 render={({ field, fieldState }) => (
// // //                   <FormItem>
// // //                     <FormLabel>Kontak Darurat</FormLabel>
// // //                     <FormControl>
// // //                       <Input placeholder="Masukkan kontak darurat" {...field} />
// // //                     </FormControl>
// // //                     <FormMessage>{fieldState.error?.message}</FormMessage>
// // //                   </FormItem>
// // //                 )}
// // //               />
// // //             </div>

// // //             <div>
// // //               <FormField
// // //                 control={form.control}
// // //                 name="alamat_ktp"
// // //                 render={({ field, fieldState }) => (
// // //                   <FormItem>
// // //                     <FormLabel>Alamat KTP</FormLabel>
// // //                     <FormControl>
// // //                       <Textarea placeholder="Masukkan alamat KTP" {...field} />
// // //                     </FormControl>
// // //                     <FormMessage>{fieldState.error?.message}</FormMessage>
// // //                   </FormItem>
// // //                 )}
// // //               />
// // //             </div>
// // //             <div>
// // //               <FormField
// // //                 control={form.control}
// // //                 name="status"
// // //                 render={({ field, fieldState }) => (
// // //                   <FormItem>
// // //                     <FormLabel>Status</FormLabel>
// // //                     <Select
// // //                       onValueChange={field.onChange}
// // //                       defaultValue={field.value}
// // //                       value={field.value}
// // //                     >
// // //                       <FormControl>
// // //                         <SelectTrigger>
// // //                           <SelectValue placeholder="Pilih status" />
// // //                         </SelectTrigger>
// // //                       </FormControl>
// // //                       <SelectContent>
// // //                         <SelectItem value="Menikah">Menikah</SelectItem>
// // //                         <SelectItem value="Lajang">Lajang</SelectItem>
// // //                       </SelectContent>
// // //                     </Select>
// // //                     <FormMessage>{fieldState.error?.message}</FormMessage>
// // //                   </FormItem>
// // //                 )}
// // //               />
// // //             </div>
// // //           </div>

// // //           <Button
// // //             type="submit"
// // //             disabled={
// // //               !form.formState.isDirty ||
// // //               profile.mutation.isPending ||
// // //               !form.formState.isValid ||
// // //               form.formState.isLoading
// // //             }
// // //           >
// // //             {profile.mutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
// // //           </Button>
// // //         </form>
// // //       </Form>
// // //     </DashboardPageLayout>
// // //   );
// // // }


// // // import { APP_CONFIG } from '@/core/configs';
// // // import { lang } from '@/core/libs';
// // // import { DashboardPageLayout } from '@/features/_global';
// // // import { Outlet } from 'react-router-dom';
// // // import { StudentInformation } from '../containers';

// // // export const EditProfileForm = () => {
// // //   // const { decodeParams, params } = useParamDecode();

// // //   // if (!decodeParams?.id || !decodeParams?.text) {
// // //   //   return <Navigate to="/404" replace />;
// // //   // }

// // //   return (
// // //     <DashboardPageLayout
// // //       siteTitle={`${lang.text('ProfileInfo')} | ${APP_CONFIG.appName}`}
// // //       breadcrumbs={[
// // //         {
// // //           label: lang.text('ProfileInfo'),
// // //           url: '/profile/edit',
// // //         },
// // //         {
// // //           label: lang.text('ProfileInfo'),
// // //           url: `/profile/edit`,
// // //         },
// // //       ]}
// // //       title={lang.text('ProfileInfo')}
// // //       backButton
// // //     >
// // //       <div className="pb-4" />
// // //       <StudentInformation />
// // //       {/* <div className="py-4 mt-6">
// // //         {STUDENT_SUBMENU.map((submenu, index) => {
// // //           return (
// // //             <NavLink
// // //               key={index}
// // //               to={submenu.path}
// // //               end
// // //               className={({ isActive }) => {
// // //                 return cn(
// // //                   buttonVariants({ variant: isActive ? 'default' : 'outline' }),
// // //                   'mr-2',
// // //                 );
// // //               }}
// // //             >
// // //               {submenu.title}
// // //             </NavLink>
// // //           );
// // //         })}
// // //       </div> */}
// // //       <Outlet />
// // //       <div className="pb-16 sm:pb-0" />
// // //     </DashboardPageLayout>
// // //   );
// // // };





// // import React, { useMemo, useState } from "react";
// // import {
// //   Card,
// //   CardContent,
// //   CardDescription,
// //   CardHeader,
// //   CardTitle,
// //   Tabs,
// //   TabsContent,
// //   TabsList,
// //   TabsTrigger,
// //   Button,
// //   Label,
// //   Input,
// //   Textarea,
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// //   Avatar,
// //   AvatarFallback,
// //   AvatarImage,
// //   Badge,
// //   Progress,
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableHead,
// //   TableHeader,
// //   TableRow,
// //   Dialog,
// //   DialogContent,
// //   DialogDescription,
// //   DialogHeader,
// //   DialogTitle,
// //   DialogTrigger,
// // } from "@/core/libs";
// // import {
// //   CalendarDays,
// //   BookOpen,
// //   Users,
// //   Clock3,
// //   UploadCloud,
// //   FileText,
// //   GraduationCap,
// //   PenLine,
// //   CheckCircle2,
// //   ListTodo,
// //   PieChart as PieIcon,
// //   BarChart3,
// //   History,
// //   UserRound,
// //   ShieldCheck,
// //   Settings,
// //   School,
// //   NotebookPen,
// //   Radio,
// //   Mic,
// //   Search,
// //   Building2,
// //   ArrowRightLeft,
// // } from "lucide-react";
// // import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, AreaChart, Area, Legend } from "recharts";
// // import { useProfile } from "../hooks";

// // // Dummy data for sections not covered by profileNew?.user (replace with API integration)
// // const statsToday = {
// //   totalMapel: 1,
// //   totalSiswa: 362,
// //   totalJam: 6,
// //   kehadiranKelas: [
// //     { kelas: "7A", mapel: "B. Indonesia", jam: "07.00–07.45", status: "Hadir", hadir: 31, izin: 1, sakit: 0, alpha: 0 },
// //     { kelas: "8B", mapel: "B. Indonesia", jam: "08.00–08.45", status: "Hadir", hadir: 32, izin: 0, sakit: 1, alpha: 0 },
// //     { kelas: "9C", mapel: "B. Indonesia", jam: "10.00–10.45", status: "Menunggu", hadir: 0, izin: 0, sakit: 0, alpha: 0 },
// //   ],
// // };

// // const barKehadiranGuru = [
// //   { minggu: "1", hadir: 24, izin: 0, sakit: 0 },
// //   { minggu: "2", hadir: 23, izin: 1, sakit: 0 },
// //   { minggu: "3", hadir: 24, izin: 0, sakit: 0 },
// //   { minggu: "4", hadir: 22, izin: 1, sakit: 1 },
// // ];

// // const pieMapelJam = [
// //   { name: "Mengajar", value: 24 },
// //   { name: "Pengembangan", value: 6 },
// //   { name: "Administrasi", value: 4 },
// // ];

// // const rangkumanTerbaru = [
// //   { id: 1, kelas: "7A", judul: "Ringkasan Bab 3 – Teks Eksposisi", tgl: "2025-08-21", pr: 2 },
// //   { id: 2, kelas: "8B", judul: "Catatan Diskusi – Opini & Fakta", tgl: "2025-08-20", pr: 1 },
// // ];

// // const jadwalHariIni = [
// //   { jam: "07.00", kelas: "7A", mapel: "B. Indonesia", ruang: "VIII-1" },
// //   { jam: "08.00", kelas: "8B", mapel: "B. Indonesia", ruang: "VIII-2" },
// //   { jam: "10.00", kelas: "9C", mapel: "B. Indonesia", ruang: "IX-3" },
// // ];

// // const karier = {
// //   pertamaMengajar: 2005, // Placeholder, replace with API data
// //   estimasiPensiun: 2039, // Placeholder, replace with API data
// //   perTahun: [
// //     { tahun: 2019, siswa: 310, kelas: 12 },
// //     { tahun: 2020, siswa: 298, kelas: 11 },
// //     { tahun: 2021, siswa: 320, kelas: 12 },
// //     { tahun: 2022, siswa: 340, kelas: 13 },
// //     { tahun: 2023, siswa: 356, kelas: 14 },
// //     { tahun: 2024, siswa: 362, kelas: 14 },
// //     { tahun: 2025, siswa: 362, kelas: 14 },
// //   ],
// // };

// // const allMapel = [
// //   "Bahasa Indonesia",
// //   "Matematika",
// //   "Ilmu Pengetahuan Alam",
// //   "Ilmu Pengetahuan Sosial",
// //   "PPKn",
// //   "Bahasa Inggris",
// //   "Seni Budaya",
// //   "PJOK",
// //   "Informatika",
// //   "Prakarya",
// //   "Agama",
// //   "Muatan Lokal",
// // ];

// // const penugasanHistory = [
// //   // { id: 1, sekolah: "SMPN 12 Bandung", unit: "Kampus Utama", jabatan: "Guru Mapel", tmtMulai: "2010-07-01", tmtSelesai: "2016-06-30", status: "Selesai" },
// //   // { id: 2, sekolah: "SMPN 3 Cimahi", unit: "Unit Barat", jabatan: "Wali Kelas", tmtMulai: "2016-07-01", tmtSelesai: "2019-06-30", status: "Selesai" },
// //   // { id: 3, sekolah: "SMPN 8 Bandung", unit: "Kampus A", jabatan: "Guru Mapel", tmtMulai: "2019-07-01", tmtSelesai: null, status: "Aktif" },
// // ];

// // const riwayatSiswa = Array.from({ length: 24 }).map((_, i) => ({
// //   id: i + 1,
// //   nama: `Siswa ${i + 1}`,
// //   tahunAjar: ["2023/2024", "2024/2025"][i % 2],
// //   kelas: ["7A", "8B", "9C"][i % 3],
// //   status: ["Naik Kelas", "Lulus", "Mutasi"][i % 3],
// // }));

// // // Small helpers
// // function Stat({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string | number; sub?: string }) {
// //   return (
// //     <Card className="shadow-sm w-max h-max">
// //       <CardContent className="p-4 flex flex-col gap-3">
// //         <div className="w-max flex items-center gap-3">
// //           <div className="p-2 rounded-xl bg-muted"><Icon className="h-5 w-5"/></div>
// //           <div className="text-sm text-muted-foreground mr-10">{label}</div>
// //           <div className="text-lg font-semibold flex w-max leading-tight">{value}</div>
// //           {/* {sub && <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>} */}
// //         </div>
// //       </CardContent>
// //     </Card>
// //   );
// // }

// // function SectionTitle({ icon: Icon, title, action }: { icon: any; title: string; action?: React.ReactNode }) {
// //   return (
// //     <div className="flex items-center justify-between mb-3">
// //       <div className="flex items-center gap-2">
// //         <Icon className="h-5 w-5"/>
// //         <h3 className="font-semibold tracking-tight">{title}</h3>
// //       </div>
// //       {action}
// //     </div>
// //   );
// // }

// // function statusClass(status: string) {
// //   if (status === "Aktif" || status === "Hadir") return "bg-green-100 text-green-700 border-green-200";
// //   if (status === "Menunggu") return "bg-yellow-100 text-yellow-700 border-yellow-200";
// //   return "bg-gray-100 text-gray-700 border-gray-200";
// // }

// // export const EditProfileForm = () => {
// //   const profileNew = useProfile();
// //   const [tahunFilter, setTahunFilter] = useState<string>("2025");
// //   const [searchSiswa, setSearchSiswa] = useState("");
// //   const [mapel, setMapel] = useState<string[]>(profileNew?.user?.mapelDiampu || ["Bahasa Indonesia"]);
// //   const [mapelDialogOpen, setMapelDialogOpen] = useState(false);
// //   const [mapelSearch, setMapelSearch] = useState("");
// //   const [mapelExpanded, setMapelExpanded] = useState(false);

// //   const addMapel = (m: string) => setMapel(prev => prev.includes(m) ? prev : [...prev, m]);
// //   const removeMapel = (m: string) => setMapel(prev => prev.filter(x => x !== m));

// //   // Map profileNew?.user to profile structure
// //   const profile = useMemo(() => ({
// //     nama: profileNew?.user?.name || "Guru",
// //     nip: profileNew?.user?.nip || "-",
// //     nuptk: profileNew?.user?.nikki || "-",
// //     ttl: profileNew?.user?.tanggalLahir ? `${new Date(profileNew?.user?.tanggalLahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}` : "-",
// //     jk: profileNew?.user?.jenisKelamin || "-",
// //     agama: profileNew?.user?.agama || "-",
// //     alamat: profileNew?.user?.alamat || "-",
// //     hp: profileNew?.user?.noTlp || "-",
// //     email: profileNew?.user?.email || "-",
// //     pendidikan: {
// //       terakhir: profileNew?.user?.pendidikan?.terakhir || "-",
// //       jurusan: profileNew?.user?.pendidikan?.jurusan || "-",
// //       institusi: profileNew?.user?.pendidikan?.institusi || "-",
// //       tahun: profileNew?.user?.pendidikan?.tahun || "-",
// //     },
// //     keahlian: profileNew?.user?.keahlian || ["-"], // Placeholder, needs API
// //     jenjang: profileNew?.user?.jenjang || "SMP", // Placeholder, needs API
// //     sertifikasi: profileNew?.user?.sertifikasi || [], // Placeholder, needs API
// //     jabatan: profileNew?.user?.role || "Guru Mapel", // Placeholder, needs API
// //     kelasBinaan: profileNew?.user?.kelasBinaan || [], // Placeholder, needs API
// //     mapelDiampu: mapel,
// //     totalJam: profileNew?.user?.totalJam || 24, // Placeholder, needs API
// //     foto: profileNew?.user?.image?.includes('uploads') ? `https://dev.kiraproject.id${profileNew?.user?.image}` : profileNew?.user?.image || "https://via.placeholder.com/150",
// //     sekolahSaatIni: profileNew?.user?.sekolah?.namaSekolah || "-",
// //     riwayatPenugasan: profileNew?.user?.riwayatPenugasan || penugasanHistory.map(r => ({ sekolah: r.sekolah, tahun: r.tmtSelesai ? `${new Date(r.tmtMulai).getFullYear()}–${new Date(r.tmtSelesai).getFullYear()}` : `${new Date(r.tmtMulai).getFullYear()}–sekarang` })),
// //   }), [profileNew?.user, mapel]);

// //   const masaBakti = useMemo(() => {
// //     const now = new Date().getFullYear();
// //     return { tahun: now - karier.pertamaMengajar, sisa: karier.estimasiPensiun - now };
// //   }, []);

// //   const filteredRiwayat = useMemo(() => riwayatSiswa.filter((s) => s.nama.toLowerCase().includes(searchSiswa.toLowerCase())), [searchSiswa]);

// //   console.log('profile 222', profile)
// //   return (
// //     <div className="min-h-screen w-full bg-background text-foreground">
// //       {/* Page header */}
// //       <div className="max-w-full mx-auto p-4 md:p-6">
// //         <div className="flex items-start gap-4 md:gap-6">
// //           <Card className="flex-1 shadow-sm">
// //             <CardContent className="p-4 md:p-6">
// //               <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
// //                 <Avatar className="h-20 w-20 rounded-2xl ring-2 ring-muted">
// //                   <AvatarImage src={profile.foto} alt={profile.nama} />
// //                   <AvatarFallback>{profile.nama.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}</AvatarFallback>
// //                 </Avatar>
// //                 <div className="flex justify-between w-full gap-2">
// //                   <div>
// //                     <h1 className="text-xl md:text-2xl font-bold leading-tight">{profile.nama}</h1>
// //                     {/* <div className="text-sm text-muted-foreground">NUPTK: {profile.nuptk}</div> */}
// //                     <div className="flex flex-wrap gap-2 mt-4">
// //                       <Badge variant="secondary" className="rounded-sm"><BookOpen className="h-3.5 w-3.5 mr-1"/> {mapel.join(", ")}</Badge>
// //                       <Badge variant="outline" className="rounded-sm"><School className="h-3.5 w-3.5 mr-1"/> {profile.jenjang}</Badge>
// //                       <Badge className="rounded-sm">{profile?.jabatan}</Badge>
// //                       <Badge variant={'outline'} className="rounded-sm">NIP: {profile.nip}</Badge>
// //                     </div>
// //                   </div>
// //                   <div className="flex w-max gap-5">
// //                     <Stat icon={BookOpen} label="Mapel" value={mapel.length} />
// //                     <Stat icon={Users} label="Total Siswa" value={statsToday.totalSiswa} />
// //                     <Stat icon={Clock3} label="Jam Hari Ini" value={`${statsToday.totalJam} jam`} />
// //                   </div>
// //                 </div>
// //               </div>
// //               <div className="grid md:grid-cols-3 gap-3 md:gap-4 mt-4">
// //                 <Card className="shadow-sm">
// //                   <CardHeader className="pb-2"><CardTitle className="text-base">Masa Bakti</CardTitle><CardDescription>Sejak {karier.pertamaMengajar}</CardDescription></CardHeader>
// //                   <CardContent>
// //                     <div className="text-2xl font-semibold">{masaBakti.tahun} tahun</div>
// //                     <div className="text-xs text-muted-foreground">Perkiraan pensiun {karier.estimasiPensiun} • sisa {masaBakti.sisa} tahun</div>
// //                     <Progress className="mt-3" value={((new Date().getFullYear() - karier.pertamaMengajar) / (karier.estimasiPensiun - karier.pertamaMengajar)) * 100} />
// //                   </CardContent>
// //                 </Card>
// //                 <Card className="shadow-sm">
// //                   <CardHeader className="pb-2"><CardTitle className="text-base">Waktu Pertama Mengajar</CardTitle></CardHeader>
// //                   <CardContent>
// //                     <div className="text-lg">{karier.pertamaMengajar}</div>
// //                     <div className="text-xs text-muted-foreground">Data dari riwayat SK pengangkatan</div>
// //                   </CardContent>
// //                 </Card>
// //                 <Card className="shadow-sm">
// //                   <CardHeader className="pb-2"><CardTitle className="text-base">Estimasi Pensiun</CardTitle></CardHeader>
// //                   <CardContent>
// //                     <div className="text-lg">{karier.estimasiPensiun}</div>
// //                     <div className="text-xs text-muted-foreground">Mengikuti regulasi ASN/GTK</div>
// //                   </CardContent>
// //                 </Card>
// //               </div>
// //             </CardContent>
// //           </Card>
// //         </div>

// //         {/* Main Grid */}
// //         <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6 mt-6">
// //           {/* Left Column */}
// //           <div className="space-y-4 md:space-y-6 xl:col-span-2">
// //             <Card className="shadow-sm">
// //               <CardContent className="p-4 md:p-6">
// //                 <div className="grid md:grid-cols-3 gap-4">
// //                   <div className="md:col-span-2">
// //                     <SectionTitle icon={BarChart3} title="Bar Chart Kehadiran Guru (mingguan)" />
// //                     <div className="h-64">
// //                       <ResponsiveContainer width="100%" height="100%">
// //                         <BarChart data={barKehadiranGuru}>
// //                           <CartesianGrid strokeDasharray="3 3" />
// //                           <XAxis dataKey="minggu" tickLine={false} />
// //                           <YAxis allowDecimals={false} tickLine={false} />
// //                           <Tooltip />
// //                           <Legend />
// //                           <Bar dataKey="hadir" name="Hadir" radius={[6,6,0,0]} fill="#22c55e" />
// //                           <Bar dataKey="izin" name="Izin" radius={[6,6,0,0]} fill="#eab308" />
// //                           <Bar dataKey="sakit" name="Sakit" radius={[6,6,0,0]} fill="#ef4444" />
// //                         </BarChart>
// //                       </ResponsiveContainer>
// //                     </div>
// //                   </div>
// //                   <div>
// //                     <SectionTitle icon={PieIcon} title="Distribusi Mapel/Jam" />
// //                     <div className="h-64">
// //                       <ResponsiveContainer width="100%" height="100%">
// //                         <PieChart>
// //                           <Pie data={pieMapelJam} dataKey="value" nameKey="name" outerRadius={90}>
// //                             {pieMapelJam.map((entry, index) => (
// //                               <Cell key={`cell-${index}`} fill={["#22c55e", "#3b82f6", "#eab308"][index % 3]} />
// //                             ))}
// //                           </Pie>
// //                           <Tooltip />
// //                           <Legend />
// //                         </PieChart>
// //                       </ResponsiveContainer>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </CardContent>
// //             </Card>

// //             <div className="grid md:grid-cols-2 gap-4 md:gap-6">
// //               <Card className="shadow-sm">
// //                 <CardContent className="p-4 md:p-6">
// //                   <SectionTitle icon={CalendarDays} title="Kehadiran Kelas Hari Ini" />
// //                   <Table>
// //                     <TableHeader>
// //                       <TableRow>
// //                         <TableHead>Kelas</TableHead>
// //                         <TableHead>Mapel</TableHead>
// //                         <TableHead>Jam</TableHead>
// //                         <TableHead>Status</TableHead>
// //                         <TableHead className="text-right">Rekap</TableHead>
// //                       </TableRow>
// //                     </TableHeader>
// //                     <TableBody>
// //                       {statsToday.kehadiranKelas.map((k, idx) => (
// //                         <TableRow key={idx}>
// //                           <TableCell>{k.kelas}</TableCell>
// //                           <TableCell>{k.mapel}</TableCell>
// //                           <TableCell>{k.jam}</TableCell>
// //                           <TableCell>
// //                             <Badge variant="secondary" className={`rounded-full border ${statusClass(k.status)}`}>{k.status}</Badge>
// //                           </TableCell>
// //                           <TableCell className="text-right text-sm text-muted-foreground">
// //                             H:{k.hadir} • I:{k.izin} • S:{k.sakit} • A:{k.alpha}
// //                           </TableCell>
// //                         </TableRow>
// //                       ))}
// //                     </TableBody>
// //                   </Table>
// //                 </CardContent>
// //               </Card>

// //               <Card className="shadow-sm">
// //                 <CardContent className="p-4 md:p-6">
// //                   <SectionTitle icon={ListTodo} title="PR & Rangkuman Terbaru" />
// //                   <div className="space-y-3">
// //                     {rangkumanTerbaru.map((r) => (
// //                       <div key={r.id} className="p-3 rounded-xl border flex items-start justify-between">
// //                         <div>
// //                           <div className="font-medium">{r.judul}</div>
// //                           <div className="text-xs text-muted-foreground">Kelas {r.kelas} • {new Date(r.tgl).toLocaleDateString()}</div>
// //                         </div>
// //                         <Badge variant="outline">PR: {r.pr}</Badge>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 </CardContent>
// //               </Card>

// //               <Card className="shadow-sm md:col-span-2">
// //                 <CardContent className="p-4 md:p-6">
// //                   <SectionTitle icon={Clock3} title="Jadwal Hari Ini" />
// //                   <div className="grid md:grid-cols-3 gap-3">
// //                     {jadwalHariIni.map((j, i) => (
// //                       <Card key={i} className="border rounded-xl">
// //                         <CardContent className="p-3">
// //                           <div className="text-sm text-muted-foreground">{j.jam}</div>
// //                           <div className="font-semibold">{j.mapel} – {j.kelas}</div>
// //                           <div className="text-xs text-muted-foreground">Ruang {j.ruang}</div>
// //                         </CardContent>
// //                       </Card>
// //                     ))}
// //                   </div>
// //                 </CardContent>
// //               </Card>

// //               <Card className="shadow-sm md:col-span-2">
// //                 <CardContent className="p-4 md:p-6">
// //                   <SectionTitle icon={History} title="Riwayat Siswa & Rekap Otomatis" action={
// //                     <div className="flex items-center gap-2">
// //                       <Select value={tahunFilter} onValueChange={(v)=>setTahunFilter(v)}>
// //                         <SelectTrigger className="h-9 w-32"><SelectValue placeholder="Tahun"/></SelectTrigger>
// //                         <SelectContent>
// //                           <SelectItem value="2023">2023</SelectItem>
// //                           <SelectItem value="2024">2024</SelectItem>
// //                           <SelectItem value="2025">2025</SelectItem>
// //                         </SelectContent>
// //                       </Select>
// //                       <div className="relative">
// //                         <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
// //                         <Input className="pl-8 h-9" placeholder="Cari siswa..." value={searchSiswa} onChange={(e)=>setSearchSiswa(e.target.value)} />
// //                       </div>
// //                     </div>
// //                   } />

// //                   <div className="grid md:grid-cols-3 gap-4 mb-4">
// //                     <Stat icon={Users} label="Total Siswa Pernah Diajar" value={statsToday.totalSiswa} />
// //                     <Stat icon={BookOpen} label="Jumlah Mapel Diajarkan" value={mapel.length} />
// //                     <Stat icon={School} label="Kelas Diampu (tahun ini)" value={karier.perTahun.find(t=>t.tahun.toString()===tahunFilter)?.kelas ?? 0} />
// //                   </div>

// //                   <div className="grid md:grid-cols-2 gap-4">
// //                     <Card className="shadow-sm">
// //                       <CardHeader className="pb-2"><CardTitle className="text-base">Bar Jumlah Siswa (per tahun ajaran)</CardTitle></CardHeader>
// //                       <CardContent>
// //                         <div className="h-60">
// //                           <ResponsiveContainer width="100%" height="100%">
// //                             <AreaChart data={karier.perTahun}>
// //                               <defs>
// //                                 <linearGradient id="siswa" x1="0" y1="0" x2="0" y2="1">
// //                                   <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
// //                                   <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
// //                                 </linearGradient>
// //                               </defs>
// //                               <CartesianGrid strokeDasharray="3 3" />
// //                               <XAxis dataKey="tahun"/>
// //                               <YAxis/>
// //                               <Tooltip/>
// //                               <Area type="monotone" dataKey="siswa" stroke="#3b82f6" strokeWidth={2} fillOpacity={0.3} fill="url(#siswa)" />
// //                             </AreaChart>
// //                           </ResponsiveContainer>
// //                         </div>
// //                       </CardContent>
// //                     </Card>

// //                     <Card className="shadow-sm">
// //                       <CardHeader className="pb-2"><CardTitle className="text-base">Bar Jumlah Kelas (per tahun ajaran)</CardTitle></CardHeader>
// //                       <CardContent>
// //                         <div className="h-60">
// //                           <ResponsiveContainer width="100%" height="100%">
// //                             <BarChart data={karier.perTahun}>
// //                               <CartesianGrid strokeDasharray="3 3" />
// //                               <XAxis dataKey="tahun"/>
// //                               <YAxis/>
// //                               <Tooltip/>
// //                               <Bar dataKey="kelas" fill="#22c55e" radius={[6,6,0,0]} />
// //                             </BarChart>
// //                           </ResponsiveContainer>
// //                         </div>
// //                       </CardContent>
// //                     </Card>
// //                   </div>

// //                   <div className="mt-4 rounded-xl border">
// //                     <Table>
// //                       <TableHeader>
// //                         <TableRow>
// //                           <TableHead>Nama</TableHead>
// //                           <TableHead>Tahun Ajaran</TableHead>
// //                           <TableHead>Kelas</TableHead>
// //                           <TableHead>Status</TableHead>
// //                         </TableRow>
// //                       </TableHeader>
// //                       <TableBody>
// //                         {filteredRiwayat.map((s)=> (
// //                           <TableRow key={s.id}>
// //                             <TableCell>{s.nama}</TableCell>
// //                             <TableCell>{s.tahunAjar}</TableCell>
// //                             <TableCell>{s.kelas}</TableCell>
// //                             <TableCell>
// //                               <Badge variant="outline" className={`rounded-full border ${statusClass(s.status)}`}>{s.status}</Badge>
// //                             </TableCell>
// //                           </TableRow>
// //                         ))}
// //                       </TableBody>
// //                     </Table>
// //                   </div>
// //                 </CardContent>
// //               </Card>
// //             </div>
// //     </div>

// //           {/* Right Column */}
// //           <div className="space-y-4 md:space-y-6">
// //             {/* Quick Actions */}
// //             <Card className="shadow-sm">
// //               <CardHeader>
// //                 <CardTitle className="text-base flex items-center gap-2"><NotebookPen className="h-4 w-4"/>Aksi Cepat</CardTitle>
// //                 <CardDescription>Input Mapel, PR, Upload Rekaman, dan Rangkuman AI</CardDescription>
// //               </CardHeader>
// //               <CardContent className="space-y-3">
// //                 <Dialog>
// //                   <DialogTrigger asChild><Button className="w-full" variant="default"><BookOpen className="h-4 w-4 mr-2"/>Input Mata Pelajaran</Button></DialogTrigger>
// //                   <DialogContent className="sm:max-w-lg">
// //                     <DialogHeader>
// //                       <DialogTitle>Input Mata Pelajaran</DialogTitle>
// //                       <DialogDescription>Tambahkan atau perbarui mata pelajaran yang diampu.</DialogDescription>
// //                     </DialogHeader>
// //                     <div className="grid gap-3">
// //                       <div className="grid gap-1.5">
// //                         <Label>Nama Mapel</Label>
// //                         <Input placeholder="Contoh: Bahasa Indonesia"/>
// //                       </div>
// //                       <div className="grid gap-1.5">
// //                         <Label>Alokasi Jam/Minggu</Label>
// //                         <Input type="number" placeholder="24"/>
// //                       </div>
// //                       <Button className="mt-2"><CheckCircle2 className="h-4 w-4 mr-2"/>Simpan</Button>
// //                     </div>
// //                   </DialogContent>
// //                 </Dialog>

// //                 <Dialog>
// //                   <DialogTrigger asChild><Button className="w-full" variant="secondary"><ListTodo className="h-4 w-4 mr-2"/>Input PR Siswa</Button></DialogTrigger>
// //                   <DialogContent className="sm:max-w-lg">
// //                     <DialogHeader>
// //                       <DialogTitle>Input PR Siswa</DialogTitle>
// //                       <DialogDescription>Tentukan kelas, tenggat, dan deskripsi PR.</DialogDescription>
// //                     </DialogHeader>
// //                     <div className="grid gap-3">
// //                       <div className="grid gap-1.5">
// //                         <Label>Kelas</Label>
// //                         <Select>
// //                           <SelectTrigger><SelectValue placeholder="Pilih kelas"/></SelectTrigger>
// //                           <SelectContent>
// //                             {Array.from(new Set(riwayatSiswa.map(s=>s.kelas))).map(k=> (
// //                               <SelectItem key={k} value={k}>{k}</SelectItem>
// //                             ))}
// //                           </SelectContent>
// //                         </Select>
// //                       </div>
// //                       <div className="grid gap-1.5">
// //                         <Label>Judul / Deskripsi</Label>
// //                         <Textarea placeholder="Tulis instruksi PR..."/>
// //                       </div>
// //                       <div className="grid gap-1.5">
// //                         <Label>Tenggat</Label>
// //                         <Input type="date"/>
// //                       </div>
// //                       <Button className="mt-2"><CheckCircle2 className="h-4 w-4 mr-2"/>Simpan</Button>
// //                     </div>
// //                   </DialogContent>
// //                 </Dialog>

// //                 <Dialog>
// //                   <DialogTrigger asChild><Button className="w-full" variant="outline"><UploadCloud className="h-4 w-4 mr-2"/>Upload Rekaman</Button></DialogTrigger>
// //                   <DialogContent className="sm:max-w-lg">
// //                     <DialogHeader>
// //                       <DialogTitle>Upload Rekaman</DialogTitle>
// //                       <DialogDescription>Unggah rekaman pembelajaran untuk dirangkum AI.</DialogDescription>
// //                     </DialogHeader>
// //                     <div className="grid gap-3">
// //                       <Input type="file" accept="audio/*,video/*"/>
// //                       <Button><Mic className="h-4 w-4 mr-2"/>Proses & Rangkum</Button>
// //                     </div>
// //                   </DialogContent>
// //                 </Dialog>

// //                 {/* <Button className="w-full" variant="ghost"><FileText className="h-4 w-4 mr-2"/>Lihat Hasil Rangkuman</Button> */}
// //               </CardContent>
// //             </Card>

// //             {/* Tabs: Absensi */}
// //             <Card className="shadow-sm">
// //               <CardHeader>
// //                 <CardTitle className="text-base flex items-center gap-2"><Radio className="h-4 w-4"/>Absensi</CardTitle>
// //                 <CardDescription>Mapel • Sekolah • Guru</CardDescription>
// //               </CardHeader>
// //               <CardContent>
// //                 <Tabs defaultValue="mapel">
// //                   <TabsList className="grid grid-cols-3 w-full">
// //                     <TabsTrigger value="mapel">Absensi Mapel</TabsTrigger>
// //                     <TabsTrigger value="sekolah">Absensi Sekolah</TabsTrigger>
// //                     <TabsTrigger value="guru">Absensi Guru</TabsTrigger>
// //                   </TabsList>
// //                   <TabsContent value="mapel" className="mt-4">
// //                     <div className="text-sm text-muted-foreground">Form absensi per sesi mapel. (Placeholder)</div>
// //                   </TabsContent>
// //                   <TabsContent value="sekolah" className="mt-4">
// //                     <div className="text-sm text-muted-foreground">Rekap kehadiran sekolah. (Placeholder)</div>
// //                   </TabsContent>
// //                   <TabsContent value="guru" className="mt-4">
// //                     <div className="text-sm text-muted-foreground">Absensi pribadi guru. (Placeholder)</div>
// //                   </TabsContent>
// //                 </Tabs>
// //               </CardContent>
// //             </Card>

// //             {/* Profil Saya */}
// //             <Card className="shadow-sm">
// //               <CardHeader>
// //                 <CardTitle className="text-base flex items-center gap-2"><UserRound className="h-4 w-4"/>Profil Saya</CardTitle>
// //                 <CardDescription>Lengkapi data diri, pendidikan, keahlian, penugasan, dan akun.</CardDescription>
// //               </CardHeader>
// //               <CardContent className="space-y-6">
// //                 {/* A. Data Diri */}
// //                 <section>
// //                   <SectionTitle icon={Settings} title="A. Data Diri" />
// //                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
// //                     <div className="grid gap-1.5"><Label>Nama</Label><Input defaultValue={profile.nama}/></div>
// //                     <div className="grid gap-1.5"><Label>NIP/NUPTK</Label><Input defaultValue={`${profile.nip} / ${profile.nuptk}`}/></div>
// //                     <div className="grid gap-1.5"><Label>Tempat & Tanggal Lahir</Label><Input defaultValue={profile.ttl}/></div>
// //                     <div className="grid gap-1.5"><Label>Jenis Kelamin</Label><Input defaultValue={profile.jk}/></div>
// //                     <div className="grid gap-1.5"><Label>Agama</Label><Input defaultValue={profile.agama}/></div>
// //                     <div className="grid gap-1.5"><Label>Alamat</Label><Input defaultValue={profile.alamat}/></div>
// //                     <div className="grid gap-1.5"><Label>No HP</Label><Input defaultValue={profile.hp}/></div>
// //                     <div className="grid gap-1.5"><Label>Email</Label><Input defaultValue={profile.email}/></div>
// //                   </div>
// //                 </section>

// //                 {/* B. Pendidikan */}
// //                 <section>
// //                   <SectionTitle icon={GraduationCap} title="B. Pendidikan" />
// //                   <div className="grid md:grid-cols-4 gap-3">
// //                     <div className="grid gap-1.5"><Label>Pendidikan Terakhir</Label><Input defaultValue={profile.pendidikan.terakhir}/></div>
// //                     <div className="grid gap-1.5"><Label>Jurusan</Label><Input defaultValue={profile.pendidikan.jurusan}/></div>
// //                     <div className="grid gap-1.5"><Label>Nama Institusi</Label><Input defaultValue={profile.pendidikan.institusi}/></div>
// //                     <div className="grid gap-1.5"><Label>Tahun Lulus</Label><Input defaultValue={profile.pendidikan.tahun}/></div>
// //                   </div>
// //                 </section>

// //                 {/* C. Keahlian & Sertifikasi */}
// //                 <section>
// //                   <SectionTitle icon={PenLine} title="B. Keahlian & Sertifikasi" />
// //                   <div className="grid gap-1.5 mb-3">
// //                     <Label>Bidang Keahlian</Label>
// //                     <Input defaultValue={profile.keahlian.join(", ")}/>
// //                   </div>
// //                   <div className="grid gap-1.5">
// //                     <Label>Jenjang yang Diampu</Label>
// //                     <Input defaultValue={profile.jenjang}/>
// //                   </div>
// //                   <div className="grid gap-1.5 mt-3">
// //                     <Label>Sertifikasi (nama + tahun)</Label>
// //                     <Textarea defaultValue={profile.sertifikasi.map(s=>`${s.nama} – ${s.tahun}`).join("\n")} rows={3}/>
// //                   </div>
// //                   <div className="grid gap-1.5 mt-3">
// //                     <Label>Upload Sertifikat (multi)</Label>
// //                     <Input type="file" multiple accept="image/*,application/pdf"/>
// //                   </div>
// //                 </section>

// //                 {/* D. Penugasan & Jabatan */}
// //                 <section>
// //                   <SectionTitle icon={School} title="D. Penugasan & Jabatan" />
// //                   <div className="grid md:grid-cols-2 gap-3">
// //                     <div className="grid gap-1.5"><Label>Jabatan</Label><Input defaultValue={profile.jabatan}/></div>
// //                     <div className="grid gap-1.5"><Label>Kelas Binaan</Label><Input defaultValue={profile.kelasBinaan.join(", ")}/></div>
// //                     <div className="grid gap-1.5 md:col-span-2">
// //                       <Label>Mata Pelajaran Diampu</Label>
// //                       <div className="flex flex-wrap gap-2">
// //                         {(mapelExpanded ? mapel : mapel.slice(0,5)).map((m) => (
// //                           <span key={m} className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-sm">
// //                             {m}
// //                             <button className="rounded-full p-0.5 hover:bg-muted" onClick={()=>removeMapel(m)} aria-label={`Hapus ${m}`}>
// //                               <span className="sr-only">hapus</span>✕
// //                             </button>
// //                           </span>
// //                         ))}
// //                         {mapel.length > 5 && !mapelExpanded && (
// //                           <Button variant="ghost" size="sm" onClick={()=>setMapelExpanded(true)}>&gt; {mapel.length - 5} lainnya</Button>
// //                         )}
// //                         <Dialog open={mapelDialogOpen} onOpenChange={setMapelDialogOpen}>
// //                           <DialogTrigger asChild>
// //                             <Button size="sm" variant="secondary">Tambah/Pilih</Button>
// //                           </DialogTrigger>
// //                           <DialogContent className="sm:max-w-lg">
// //                             <DialogHeader>
// //                               <DialogTitle>Pilih Mata Pelajaran</DialogTitle>
// //                               <DialogDescription>Centang untuk menambah, uncentang untuk menghapus.</DialogDescription>
// //                             </DialogHeader>
// //                             <div className="grid gap-3">
// //                               <Input placeholder="Cari mapel..." value={mapelSearch} onChange={(e)=>setMapelSearch(e.target.value)} />
// //                               <div className="max-h-60 overflow-auto rounded-md border p-2">
// //                                 {allMapel
// //                                   .filter(m=>m.toLowerCase().includes(mapelSearch.toLowerCase()))
// //                                   .map((m) => (
// //                                     <label key={m} className="flex items-center gap-2 py-1">
// //                                       <input
// //                                         type="checkbox"
// //                                         className="h-4 w-4"
// //                                         checked={mapel.includes(m)}
// //                                         onChange={(e)=> e.target.checked ? addMapel(m) : removeMapel(m)}
// //                                       />
// //                                       <span>{m}</span>
// //                                     </label>
// //                                   ))}
// //                               </div>
// //                               <div className="flex justify-end gap-2">
// //                                 <Button variant="outline" onClick={()=>setMapelDialogOpen(false)}>Tutup</Button>
// //                                 <Button onClick={()=>setMapelDialogOpen(false)}>Simpan</Button>
// //                               </div>
// //                             </div>
// //                           </DialogContent>
// //                         </Dialog>
// //                       </div>
// //                     </div>
// //                     <div className="grid gap-1.5"><Label>Total Jam Mengajar</Label><Input type="number" defaultValue={profile.totalJam}/></div>
// //                   </div>

// //                   <div className="grid gap-1.5 mt-3">
// //                     <Label>Sekolah Saat Ini</Label>
// //                     <Input defaultValue={profile.sekolahSaatIni}/>
// //                   </div>
// //                   {/* <div className="mt-3">
// //                     <Label>Riwayat Penugasan / Pindah Sekolah</Label>
// //                     <ul className="list-disc pl-5 text-sm text-muted-foreground">
// //                       {profile.riwayatPenugasan.map((r,i)=> (
// //                         <li key={i}>{r.sekolah} ({r.tahun})</li>
// //                       ))}
// //                     </ul>
// //                   </div> */}

// //                   <div className="mt-4">
// //                     <SectionTitle icon={Building2} title="Riwayat Mutasi (Rinci)" action={
// //                       <Dialog>
// //                         <DialogTrigger asChild>
// //                           <Button variant="default" size="sm"><ArrowRightLeft className="h-4 w-4 mr-2"/>Ajukan Pindah Sekolah</Button>
// //                         </DialogTrigger>
// //                         <DialogContent className="sm:max-w-lg">
// //                           <DialogHeader>
// //                             <DialogTitle>Form Pengajuan Pindah Sekolah</DialogTitle>
// //                             <DialogDescription>Lengkapi detail mutasi untuk proses verifikasi oleh admin/dinas.</DialogDescription>
// //                           </DialogHeader>
// //                           <div className="grid gap-3">
// //                             <div className="grid gap-1.5"><Label>Sekolah Tujuan</Label><Input placeholder="Contoh: SMPN 5 Bandung"/></div>
// //                             <div className="grid gap-1.5"><Label>Unit/Alamat Tujuan</Label><Input placeholder="Jl. Contoh No. 1"/></div>
// //                             <div className="grid gap-1.5"><Label>Jabatan di Sekolah Tujuan</Label><Input placeholder="Guru Mapel / Wali Kelas / Kepala Lab"/></div>
// //                             <div className="grid gap-1.5"><Label>TMT (Mulai Bertugas)</Label><Input type="date"/></div>
// //                             <div className="grid gap-1.5"><Label>Jenis Mutasi</Label>
// //                               <Select>
// //                                 <SelectTrigger><SelectValue placeholder="Pilih jenis"/></SelectTrigger>
// //                                 <SelectContent>
// //                                   <SelectItem value="mutasi">Mutasi</SelectItem>
// //                                   <SelectItem value="rotasi">Rotasi</SelectItem>
// //                                   <SelectItem value="promosi">Promosi</SelectItem>
// //                                 </SelectContent>
// //                               </Select>
// //                             </div>
// //                             <div className="grid gap-1.5"><Label>Alasan</Label><Textarea placeholder="Tulis alasan singkat" rows={3}/></div>
// //                             <div className="grid gap-1.5"><Label>Upload SK/Surat Rekomendasi</Label><Input type="file" accept="application/pdf,image/*"/></div>
// //                             <Button className="mt-2"><CheckCircle2 className="h-4 w-4 mr-2"/>Kirim Pengajuan</Button>
// //                           </div>
// //                         </DialogContent>
// //                       </Dialog>
// //                     } />

// //                     <div className="rounded-xl border mt-3">
// //                       <Table>
// //                         <TableHeader>
// //                           <TableRow>
// //                             <TableHead>Sekolah</TableHead>
// //                             <TableHead>Unit</TableHead>
// //                             <TableHead>Jabatan</TableHead>
// //                             <TableHead>Mulai</TableHead>
// //                             <TableHead>Selesai</TableHead>
// //                             <TableHead>Status</TableHead>
// //                           </TableRow>
// //                         </TableHeader>
// //                         <TableBody>
// //                           {penugasanHistory.map((p)=> (
// //                             <TableRow key={p.id}>
// //                               <TableCell>{p.sekolah}</TableCell>
// //                               <TableCell>{p.unit}</TableCell>
// //                               <TableCell>{p.jabatan}</TableCell>
// //                               <TableCell>{new Date(p.tmtMulai).toLocaleDateString()}</TableCell>
// //                               <TableCell>{p.tmtSelesai ? new Date(p.tmtSelesai).toLocaleDateString() : '-'}</TableCell>
// //                               <TableCell>
// //                                 <Badge variant="secondary" className={`rounded-full border ${statusClass(p.status)}`}>{p.status}</Badge>
// //                               </TableCell>
// //                             </TableRow>
// //                           ))}
// //                         </TableBody>
// //                       </Table>
// //                     </div>
// //                   </div>
// //                 </section>

// //                 {/* E. Tanda Tangan & Akun */}
// //                 <section>
// //                   <SectionTitle icon={ShieldCheck} title="E. Tanda Tangan & Akun" />
// //                   <div className="grid md:grid-cols-2 gap-3">
// //                     <div className="grid gap-1.5"><Label>Upload TTD</Label><Input type="file" accept="image/*"/></div>
// //                     <div className="grid gap-1.5"><Label>Ganti Password (opsional)</Label><Input type="password" placeholder="••••••••"/></div>
// //                   </div>
// //                   <Button className="mt-3"><CheckCircle2 className="h-4 w-4 mr-2"/>Simpan</Button>
// //                 </section>

// //                 {/* Dev Tests (simple runtime checks) */}
// //                 <section>
// //                   <SectionTitle icon={Settings} title="Developer Tests (runtime)" />
// //                   <div className="flex flex-wrap gap-2 items-center">
// //                     <Button variant="outline" size="sm" onClick={()=>setMapel(["Bahasa Indonesia","Matematika","IPA","IPS","PPKn","Bahasa Inggris","Seni Budaya","PJOK"]) }>Set &gt; 6 mapel</Button>
// //                     <Button variant="outline" size="sm" onClick={()=>setMapel(["Bahasa Indonesia"]) }>Set 1 mapel</Button>
// //                     <Button variant="outline" size="sm" onClick={()=>setMapel([])}>Kosongkan mapel</Button>
// //                     <Button variant="outline" size="sm" onClick={()=>setMapel(allMapel.slice(0,6))}>Set 6 mapel</Button>
// //                     <Button variant="outline" size="sm" onClick={()=>setMapelExpanded(true)}>Expand chips</Button>
// //                     <Button variant="outline" size="sm" onClick={()=>setMapelExpanded(false)}>Collapse chips</Button>
// //                     <span className="text-xs text-muted-foreground ml-2">State: jumlah={mapel.length}, expanded={String(mapelExpanded)}</span>
// //                   </div>
// //                 </section>
// //               </CardContent>
// //             </Card>
// //           </div>
// //         </div>

// //         {/* Footer tip */}
// //         <div className="text-xs text-muted-foreground text-center mt-6">UI demo • Integrasikan ke API Xpresensi untuk data real-time (jadwal, absensi, PR, rangkuman AI, dsb.)</div>
// //       </div>
// //     </div>
// //   );
// // }



// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
//   Badge,
//   Button,
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   Input,
//   Label,
//   Progress,
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
//   Textarea,
// } from "@/core/libs";
// import { useBiodataGuru } from "@/features/user";
// import {
//   ArrowRightLeft,
//   BarChart3,
//   BookOpen,
//   Building2,
//   CalendarDays,
//   CheckCircle2,
//   Clock3,
//   GraduationCap,
//   History,
//   ListTodo,
//   Mic,
//   NotebookPen,
//   PenLine,
//   PieChart as PieIcon,
//   Radio,
//   School,
//   Search,
//   Settings,
//   ShieldCheck,
//   UploadCloud,
//   UserRound,
//   Users
// } from "lucide-react";
// import React, { useMemo, useState } from "react";
// import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
// import { useProfile } from "../hooks";
// // Dummy data for sections not covered by profileNew?.user (replace with API integration)
// const statsToday = {
//   totalMapel: 1,
//   totalSiswa: 362,
//   totalJam: 6,
//   kehadiranKelas: [
//     { kelas: "7A", mapel: "B. Indonesia", jam: "07.00–07.45", status: "Hadir", hadir: 31, izin: 1, sakit: 0, alpha: 0 },
//     { kelas: "8B", mapel: "B. Indonesia", jam: "08.00–08.45", status: "Hadir", hadir: 32, izin: 0, sakit: 1, alpha: 0 },
//     { kelas: "9C", mapel: "B. Indonesia", jam: "10.00–10.45", status: "Menunggu", hadir: 0, izin: 0, sakit: 0, alpha: 0 },
//   ],
// };

// const barKehadiranGuru = [
//   { minggu: "1", hadir: 24, izin: 0, sakit: 0 },
//   { minggu: "2", hadir: 23, izin: 1, sakit: 0 },
//   { minggu: "3", hadir: 24, izin: 0, sakit: 0 },
//   { minggu: "4", hadir: 22, izin: 1, sakit: 1 },
// ];

// const pieMapelJam = [
//   { name: "Mengajar", value: 24 },
//   { name: "Pengembangan", value: 6 },
//   { name: "Administrasi", value: 4 },
// ];

// const rangkumanTerbaru = [
//   { id: 1, kelas: "7A", judul: "Ringkasan Bab 3 – Teks Eksposisi", tgl: "2025-08-21", pr: 2 },
//   { id: 2, kelas: "8B", judul: "Catatan Diskusi – Opini & Fakta", tgl: "2025-08-20", pr: 1 },
// ];

// const jadwalHariIni = [
//   { jam: "07.00", kelas: "7A", mapel: "B. Indonesia", ruang: "VIII-1" },
//   { jam: "08.00", kelas: "8B", mapel: "B. Indonesia", ruang: "VIII-2" },
//   { jam: "10.00", kelas: "9C", mapel: "B. Indonesia", ruang: "IX-3" },
// ];

// const karier = {
//   pertamaMengajar: 2005, // Placeholder, replace with API data
//   estimasiPensiun: 2039, // Placeholder, replace with API data
//   perTahun: [
//     { tahun: 2019, siswa: 310, kelas: 12 },
//     { tahun: 2020, siswa: 298, kelas: 11 },
//     { tahun: 2021, siswa: 320, kelas: 12 },
//     { tahun: 2022, siswa: 340, kelas: 13 },
//     { tahun: 2023, siswa: 356, kelas: 14 },
//     { tahun: 2024, siswa: 362, kelas: 14 },
//     { tahun: 2025, siswa: 362, kelas: 14 },
//   ],
// };

// const allMapel = [
//   "Bahasa Indonesia",
//   "Matematika",
//   "Ilmu Pengetahuan Alam",
//   "Ilmu Pengetahuan Sosial",
//   "PPKn",
//   "Bahasa Inggris",
//   "Seni Budaya",
//   "PJOK",
//   "Informatika",
//   "Prakarya",
//   "Agama",
//   "Muatan Lokal",
// ];

// const penugasanHistory = [
//   // { id: 1, sekolah: "SMPN 12 Bandung", unit: "Kampus Utama", jabatan: "Guru Mapel", tmtMulai: "2010-07-01", tmtSelesai: "2016-06-30", status: "Selesai" },
//   // { id: 2, sekolah: "SMPN 3 Cimahi", unit: "Unit Barat", jabatan: "Wali Kelas", tmtMulai: "2016-07-01", tmtSelesai: "2019-06-30", status: "Selesai" },
//   // { id: 3, sekolah: "SMPN 8 Bandung", unit: "Kampus A", jabatan: "Guru Mapel", tmtMulai: "2019-07-01", tmtSelesai: null, status: "Aktif" },
// ];

// const riwayatSiswa = Array.from({ length: 24 }).map((_, i) => ({
//   id: i + 1,
//   nama: `Siswa ${i + 1}`,
//   tahunAjar: ["2023/2024", "2024/2025"][i % 2],
//   kelas: ["7A", "8B", "9C"][i % 3],
//   status: ["Naik Kelas", "Lulus", "Mutasi"][i % 3],
// }));

// // Small helpers
// function Stat({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string | number; sub?: string }) {
//   return (
//     <Card className="shadow-sm w-max h-max dark:bg-neutral-900/60 border border-gray-200 dark:border-white/10">
//       <CardContent className="p-4 flex flex-col gap-3">
//         <div className="w-max flex items-center gap-3">
//           <div className="p-2 rounded-xl bg-blue-100 dark:bg-white/10"><Icon className="h-5 w-5 text-teal-500 dark:text-teal-400"/></div>
//           <div className="text-sm text-gray-500 dark:text-gray-400 mr-10">{label}</div>
//           <div className="text-lg font-semibold text-gray-800 dark:text-white flex w-max leading-tight">{value}</div>
//           {/* {sub && <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{sub}</div>} */}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// function SectionTitle({ icon: Icon, title, action }: { icon: any; title: string; action?: React.ReactNode }) {
//   return (
//     <div className="flex items-center justify-between mb-3">
//       <div className="flex items-center gap-2">
//         <Icon className="h-5 w-5 text-teal-500 dark:text-teal-400"/>
//         <h3 className="font-semibold tracking-tight text-gray-800 dark:text-white">{title}</h3>
//       </div>
//       {action}
//     </div>
//   );
// }

// function statusClass(status: string) {
//   if (status === "Aktif" || status === "Hadir") return "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700";
//   if (status === "Menunggu") return "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700";
//   return "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-white/10";
// }

// export const EditProfileForm = () => {
//   const profileNew = useProfile();
//   const dataGuru = useBiodataGuru();
//   const [tahunFilter, setTahunFilter] = useState<string>("2025");
//   const [searchSiswa, setSearchSiswa] = useState("");
//   const [mapel, setMapel] = useState<string[]>(profileNew?.user?.mapelDiampu || ["Bahasa Indonesia"]);
//   const [mapelDialogOpen, setMapelDialogOpen] = useState(false);
//   const [mapelSearch, setMapelSearch] = useState("");
//   const [mapelExpanded, setMapelExpanded] = useState(false);
//   const addMapel = (m: string) => setMapel(prev => prev.includes(m) ? prev : [...prev, m]);
//   const removeMapel = (m: string) => setMapel(prev => prev.filter(x => x !== m));
//   console.log('profileNew', profileNew?.user)
//   console.log('dataGuru', dataGuru?.data)

//   // Map profileNew?.user to profile structure
//   const profile = useMemo(() => ({
//     nama: profileNew?.user?.name || "Guru",
//     nip: profileNew?.user?.nip || "-",
//     nuptk: profileNew?.user?.nikki || "-",
//     ttl: profileNew?.user?.tanggalLahir ? `${new Date(profileNew?.user?.tanggalLahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}` : "-",
//     jk: profileNew?.user?.jenisKelamin || "-",
//     agama: profileNew?.user?.agama || "-",
//     alamat: profileNew?.user?.alamat || "-",
//     hp: profileNew?.user?.noTlp || "-",
//     email: profileNew?.user?.email || "-",
//     pendidikan: {
//       terakhir: profileNew?.user?.pendidikan?.terakhir || "-",
//       jurusan: profileNew?.user?.pendidikan?.jurusan || "-",
//       institusi: profileNew?.user?.pendidikan?.institusi || "-",
//       tahun: profileNew?.user?.pendidikan?.tahun || "-",
//     },
//     keahlian: profileNew?.user?.keahlian || ["-"], // Placeholder, needs API
//     jenjang: profileNew?.user?.jenjang || "SMP", // Placeholder, needs API
//     sertifikasi: profileNew?.user?.sertifikasi || [], // Placeholder, needs API
//     jabatan: profileNew?.user?.role || "Guru Mapel", // Placeholder, needs API
//     kelasBinaan: profileNew?.user?.kelasBinaan || [], // Placeholder, needs API
//     mapelDiampu: mapel,
//     totalJam: profileNew?.user?.totalJam || 24, // Placeholder, needs API
//     foto: profileNew?.user?.image?.includes('uploads') ? `https://dev.kiraproject.id${profileNew?.user?.image}` : profileNew?.user?.image || "https://via.placeholder.com/150",
//     sekolahSaatIni: profileNew?.user?.sekolah?.namaSekolah || "-",
//     riwayatPenugasan: profileNew?.user?.riwayatPenugasan || penugasanHistory.map(r => ({ sekolah: r.sekolah, tahun: r.tmtSelesai ? `${new Date(r.tmtMulai).getFullYear()}–${new Date(r.tmtSelesai).getFullYear()}` : `${new Date(r.tmtMulai).getFullYear()}–sekarang` })),
//   }), [profileNew?.user, mapel]);

//   const masaBakti = useMemo(() => {
//     const now = new Date().getFullYear();
//     return { tahun: now - karier.pertamaMengajar, sisa: karier.estimasiPensiun - now };
//   }, []);

//   const filteredRiwayat = useMemo(() => riwayatSiswa.filter((s) => s.nama.toLowerCase().includes(searchSiswa.toLowerCase())), [searchSiswa]);

//   return (
//     <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-gray-50 dark:from-gray-900 dark:to-gray-900 text-gray-800 dark:text-white py-5 px-3">
//       <style>{`
//         @keyframes fadeIn {
//           0% { opacity: 0; transform: translateY(-10px); }
//           100% { opacity: 1; transform: translateY(0); }
//         }
//         .animate-fade-in {
//           animation: fadeIn 0.3s ease-in;
//         }
//         select option {
//           background: #F9FAFB !important;
//           color: #1F2937;
//         }
//         select option:checked,
//         select option:hover {
//           background: #60A5FA !important;
//           color: #FFFFFF;
//         }
//         @media (prefers-color-scheme: dark) {
//           select option {
//             background: #1E293B !important;
//             color: #FFFFFF;
//           }
//           select option:checked,
//           select option:hover {
//             background: #60A5FA !important;
//             color: #FFFFFF;
//           }
//         }
//       `}</style>
//       {/* Page header */}
//       <div className="max-w-full mx-auto p-4 md:p-6">
//         <div className="flex items-start gap-4 md:gap-6">
//           <Card className="flex-1 dark:bg-neutral-900/60 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
//             <CardContent className="p-4 md:p-6">
//               <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
//                 <Avatar className="h-20 w-20 rounded-2xl ring-2 ring-blue-200 dark:ring-teal-700">
//                   <AvatarImage src={profile.foto} alt={profile.nama} />
//                   <AvatarFallback className="bg-blue-100 dark:bg-white/10 text-teal-500 dark:text-teal-400">{profile.nama.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}</AvatarFallback>
//                 </Avatar>
//                 <div className="flex justify-between w-full gap-2">
//                   <div>
//                     <h1 className="text-xl md:text-2xl font-bold leading-tight text-gray-800 dark:text-white">{profile.nama}</h1>
//                     {/* <div className="text-sm text-gray-500 dark:text-gray-400">NUPTK: {profile.nuptk}</div> */}
//                     <div className="flex flex-wrap gap-2 mt-4">
//                       <Badge variant="secondary" className="rounded-sm bg-blue-100 dark:bg-white/10 text-teal-500 dark:text-teal-400"><BookOpen className="h-3.5 w-3.5 mr-1"/> {mapel.join(", ")}</Badge>
//                       <Badge variant="outline" className="rounded-sm border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200"><School className="h-3.5 w-3.5 mr-1"/> {profile.jenjang}</Badge>
//                       <Badge className="rounded-sm bg-green-500 dark:bg-green-600 text-white">{profile?.jabatan}</Badge>
//                       <Badge variant="outline" className="rounded-sm border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200">NIP: {profile.nip}</Badge>
//                     </div>
//                   </div>
//                   <div className="flex w-max gap-5">
//                     <Stat icon={BookOpen} label="Mapel" value={mapel.length} />
//                     <Stat icon={Users} label="Total Siswa" value={statsToday.totalSiswa} />
//                     <Stat icon={Clock3} label="Jam Hari Ini" value={`${statsToday.totalJam} jam`} />
//                   </div>
//                 </div>
//               </div>
//               <div className="grid md:grid-cols-3 gap-3 md:gap-4 mt-4">
//                 <Card className="dark:bg-neutral-900/60 border border-gray-200 dark:border-white/10 rounded-xl shadow-sm">
//                   <CardHeader className="pb-2"><CardTitle className="text-base text-gray-800 dark:text-white">Masa Bakti</CardTitle><CardDescription className="text-gray-500 dark:text-gray-400">Sejak {karier.pertamaMengajar}</CardDescription></CardHeader>
//                   <CardContent>
//                     <div className="text-2xl font-semibold text-gray-800 dark:text-white">{masaBakti.tahun} tahun</div>
//                     <div className="text-xs text-gray-500 dark:text-gray-400">Perkiraan pensiun {karier.estimasiPensiun} • sisa {masaBakti.sisa} tahun</div>
//                     <Progress className="mt-3 bg-gray-200 dark:bg-gray-700" value={((new Date().getFullYear() - karier.pertamaMengajar) / (karier.estimasiPensiun - karier.pertamaMengajar)) * 100} style={{ "--progress-color": "#60A5FA" } as React.CSSProperties} />
//                   </CardContent>
//                 </Card>
//                 <Card className="dark:bg-neutral-900/60 border border-gray-200 dark:border-white/10 rounded-xl shadow-sm">
//                   <CardHeader className="pb-2"><CardTitle className="text-base text-gray-800 dark:text-white">Waktu Pertama Mengajar</CardTitle></CardHeader>
//                   <CardContent>
//                     <div className="text-lg text-gray-800 dark:text-white">{karier.pertamaMengajar}</div>
//                     <div className="text-xs text-gray-500 dark:text-gray-400">Data dari riwayat SK pengangkatan</div>
//                   </CardContent>
//                 </Card>
//                 <Card className="dark:bg-neutral-900/60 border border-gray-200 dark:border-white/10 rounded-xl shadow-sm">
//                   <CardHeader className="pb-2"><CardTitle className="text-base text-gray-800 dark:text-white">Estimasi Pensiun</CardTitle></CardHeader>
//                   <CardContent>
//                     <div className="text-lg text-gray-800 dark:text-white">{karier.estimasiPensiun}</div>
//                     <div className="text-xs text-gray-500 dark:text-gray-400">Mengikuti regulasi ASN/GTK</div>
//                   </CardContent>
//                 </Card>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Main Grid */}
//         <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6 mt-6">
//           {/* Left Column */}
//           <div className="space-y-4 md:space-y-6 xl:col-span-2">
//             <Card className="dark:bg-neutral-900/60 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
//               <CardContent className="p-4 md:p-6">
//                 <div className="grid md:grid-cols-3 gap-4">
//                   <div className="md:col-span-2">
//                     <SectionTitle icon={BarChart3} title="Bar Chart Kehadiran Guru (mingguan)" />
//                     <div className="h-64">
//                       <ResponsiveContainer width="100%" height="100%">
//                         <BarChart data={barKehadiranGuru}>
//                           <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
//                           <XAxis dataKey="minggu" tickLine={false} stroke="#6B7280" />
//                           <YAxis allowDecimals={false} tickLine={false} stroke="#6B7280" />
//                           <Tooltip contentStyle={{ backgroundColor: "#1F2937", color: "#FFFFFF", borderRadius: "8px" }} />
//                           <Legend />
//                           <Bar dataKey="hadir" name="Hadir" radius={[6,6,0,0]} fill="#22C55E" />
//                           <Bar dataKey="izin" name="Izin" radius={[6,6,0,0]} fill="#EAB308" />
//                           <Bar dataKey="sakit" name="Sakit" radius={[6,6,0,0]} fill="#EF4444" />
//                         </BarChart>
//                       </ResponsiveContainer>
//                     </div>
//                   </div>
//                   <div>
//                     <SectionTitle icon={PieIcon} title="Distribusi Mapel/Jam" />
//                     <div className="h-64">
//                       <ResponsiveContainer width="100%" height="100%">
//                         <PieChart>
//                           <Pie data={pieMapelJam} dataKey="value" nameKey="name" outerRadius={90}>
//                             {pieMapelJam.map((entry, index) => (
//                               <Cell key={`cell-${index}`} fill={["#22C55E", "#60A5FA", "#EAB308"][index % 3]} />
//                             ))}
//                           </Pie>
//                           <Tooltip contentStyle={{ backgroundColor: "#1F2937", color: "#FFFFFF", borderRadius: "8px" }} />
//                           <Legend />
//                         </PieChart>
//                       </ResponsiveContainer>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <div className="grid md:grid-cols-2 gap-4 md:gap-6">
//               <Card className="dark:bg-neutral-900/60 border border-gray-200 dark:border-white/10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
//                 <CardContent className="p-4 md:p-6">
//                   <SectionTitle icon={CalendarDays} title="Kehadiran Kelas Hari Ini" />
//                   <Table>
//                     <TableHeader>
//                       <TableRow className="hover:bg-gray-100 dark:hover:bg-gray-700">
//                         <TableHead className="text-gray-700 dark:text-gray-200">Kelas</TableHead>
//                         <TableHead className="text-gray-700 dark:text-gray-200">Mapel</TableHead>
//                         <TableHead className="text-gray-700 dark:text-gray-200">Jam</TableHead>
//                         <TableHead className="text-gray-700 dark:text-gray-200">Status</TableHead>
//                         <TableHead className="text-right text-gray-700 dark:text-gray-200">Rekap</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {statsToday.kehadiranKelas.map((k, idx) => (
//                         <TableRow key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800">
//                           <TableCell className="text-gray-800 dark:text-white">{k.kelas}</TableCell>
//                           <TableCell className="text-gray-800 dark:text-white">{k.mapel}</TableCell>
//                           <TableCell className="text-gray-800 dark:text-white">{k.jam}</TableCell>
//                           <TableCell>
//                             <Badge variant="secondary" className={`rounded-full border ${statusClass(k.status)}`}>{k.status}</Badge>
//                           </TableCell>
//                           <TableCell className="text-right text-sm text-gray-500 dark:text-gray-400">
//                             H:{k.hadir} • I:{k.izin} • S:{k.sakit} • A:{k.alpha}
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </CardContent>
//               </Card>

//               <Card className="dark:bg-neutral-900/60 border border-gray-200 dark:border-white/10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
//                 <CardContent className="p-4 md:p-6">
//                   <SectionTitle icon={ListTodo} title="PR & Rangkuman Terbaru" />
//                   <div className="space-y-3">
//                     {rangkumanTerbaru.map((r) => (
//                       <div key={r.id} className="p-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-gray-800 flex items-start justify-between">
//                         <div>
//                           <div className="font-medium text-gray-800 dark:text-white">{r.judul}</div>
//                           <div className="text-xs text-gray-500 dark:text-gray-400">Kelas {r.kelas} • {new Date(r.tgl).toLocaleDateString()}</div>
//                         </div>
//                         <Badge variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200">PR: {r.pr}</Badge>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className="dark:bg-neutral-900/60 border border-gray-200 dark:border-white/10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 md:col-span-2">
//                 <CardContent className="p-4 md:p-6">
//                   <SectionTitle icon={Clock3} title="Jadwal Hari Ini" />
//                   <div className="grid md:grid-cols-3 gap-3">
//                     {jadwalHariIni.map((j, i) => (
//                       <Card key={i} className="border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50 dark:bg-gray-800">
//                         <CardContent className="p-3">
//                           <div className="text-sm text-gray-500 dark:text-gray-400">{j.jam}</div>
//                           <div className="font-semibold text-gray-800 dark:text-white">{j.mapel} – {j.kelas}</div>
//                           <div className="text-xs text-gray-500 dark:text-gray-400">Ruang {j.ruang}</div>
//                         </CardContent>
//                       </Card>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className="dark:bg-neutral-900/60 border border-gray-200 dark:border-white/10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 md:col-span-2">
//                 <CardContent className="p-4 md:p-6">
//                   <SectionTitle icon={History} title="Riwayat Siswa & Rekap Otomatis" action={
//                     <div className="flex items-center gap-2">
//                       <Select value={tahunFilter} onValueChange={(v)=>setTahunFilter(v)}>
//                         <SelectTrigger className="h-9 w-32 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500">
//                           <SelectValue placeholder="Tahun"/>
//                         </SelectTrigger>
//                         <SelectContent className="bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
//                           <SelectItem value="2023">2023</SelectItem>
//                           <SelectItem value="2024">2024</SelectItem>
//                           <SelectItem value="2025">2025</SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <div className="relative">
//                         <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400"/>
//                         <Input className="pl-8 h-9 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" placeholder="Cari siswa..." value={searchSiswa} onChange={(e)=>setSearchSiswa(e.target.value)} />
//                       </div>
//                     </div>
//                   } />

//                   <div className="grid md:grid-cols-3 gap-4 mb-4">
//                     <Stat icon={Users} label="Total Siswa Pernah Diajar" value={statsToday.totalSiswa} />
//                     <Stat icon={BookOpen} label="Jumlah Mapel Diajarkan" value={mapel.length} />
//                     <Stat icon={School} label="Kelas Diampu (tahun ini)" value={karier.perTahun.find(t=>t.tahun.toString()===tahunFilter)?.kelas ?? 0} />
//                   </div>

//                   <div className="grid md:grid-cols-2 gap-4">
//                     <Card className="dark:bg-neutral-900/60 border border-gray-200 dark:border-white/10 rounded-xl shadow-sm">
//                       <CardHeader className="pb-2"><CardTitle className="text-base text-gray-800 dark:text-white">Bar Jumlah Siswa (per tahun ajaran)</CardTitle></CardHeader>
//                       <CardContent>
//                         <div className="h-60">
//                           <ResponsiveContainer width="100%" height="100%">
//                             <AreaChart data={karier.perTahun}>
//                               <defs>
//                                 <linearGradient id="siswa" x1="0" y1="0" x2="0" y2="1">
//                                   <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.8} />
//                                   <stop offset="95%" stopColor="#60A5FA" stopOpacity={0} />
//                                 </linearGradient>
//                               </defs>
//                               <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
//                               <XAxis dataKey="tahun" stroke="#6B7280"/>
//                               <YAxis stroke="#6B7280"/>
//                               <Tooltip contentStyle={{ backgroundColor: "#1F2937", color: "#FFFFFF", borderRadius: "8px" }}/>
//                               <Area type="monotone" dataKey="siswa" stroke="#60A5FA" strokeWidth={2} fillOpacity={0.3} fill="url(#siswa)" />
//                             </AreaChart>
//                           </ResponsiveContainer>
//                         </div>
//                       </CardContent>
//                     </Card>

//                     <Card className="dark:bg-neutral-900/60 border border-gray-200 dark:border-white/10 rounded-xl shadow-sm">
//                       <CardHeader className="pb-2"><CardTitle className="text-base text-gray-800 dark:text-white">Bar Jumlah Kelas (per tahun ajaran)</CardTitle></CardHeader>
//                       <CardContent>
//                         <div className="h-60">
//                           <ResponsiveContainer width="100%" height="100%">
//                             <BarChart data={karier.perTahun}>
//                               <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
//                               <XAxis dataKey="tahun" stroke="#6B7280"/>
//                               <YAxis stroke="#6B7280"/>
//                               <Tooltip contentStyle={{ backgroundColor: "#1F2937", color: "#FFFFFF", borderRadius: "8px" }}/>
//                               <Bar dataKey="kelas" fill="#22C55E" radius={[6,6,0,0]} />
//                             </BarChart>
//                           </ResponsiveContainer>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   </div>

//                   <div className="mt-4 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-gray-800">
//                     <Table>
//                       <TableHeader>
//                         <TableRow className="hover:bg-gray-100 dark:hover:bg-gray-700">
//                           <TableHead className="text-gray-700 dark:text-gray-200">Nama</TableHead>
//                           <TableHead className="text-gray-700 dark:text-gray-200">Tahun Ajaran</TableHead>
//                           <TableHead className="text-gray-700 dark:text-gray-200">Kelas</TableHead>
//                           <TableHead className="text-gray-700 dark:text-gray-200">Status</TableHead>
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         {filteredRiwayat.map((s)=> (
//                           <TableRow key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
//                             <TableCell className="text-gray-800 dark:text-white">{s.nama}</TableCell>
//                             <TableCell className="text-gray-800 dark:text-white">{s.tahunAjar}</TableCell>
//                             <TableCell className="text-gray-800 dark:text-white">{s.kelas}</TableCell>
//                             <TableCell>
//                               <Badge variant="outline" className={`rounded-full border ${statusClass(s.status)}`}>{s.status}</Badge>
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>

//           {/* Right Column */}
//           <div className="space-y-4 md:space-y-6">
//             {/* Quick Actions */}
//             <Card className="dark:bg-neutral-900/60 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
//               <CardHeader>
//                 <CardTitle className="text-base flex items-center gap-2 text-gray-800 dark:text-white"><NotebookPen className="h-4 w-4 text-teal-500 dark:text-teal-400"/>Aksi Cepat</CardTitle>
//                 <CardDescription className="text-gray-500 dark:text-gray-400">Input Mapel, PR, Upload Rekaman, dan Rangkuman AI</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 <Dialog>
//                   <DialogTrigger asChild><Button className="w-full bg-blue-500 hover:bg-blue-400 text-white transition-all duration-300 transform hover:scale-105"><BookOpen className="h-4 w-4 mr-2"/>Input Mata Pelajaran</Button></DialogTrigger>
//                   <DialogContent className="sm:max-w-lg dark:bg-neutral-900/60 backdrop-blur-lg rounded-xl shadow-2xl p-6">
//                     <DialogHeader>
//                       <DialogTitle className="text-gray-800 dark:text-white">Input Mata Pelajaran</DialogTitle>
//                       <DialogDescription className="text-gray-500 dark:text-gray-400">Tambahkan atau perbarui mata pelajaran yang diampu.</DialogDescription>
//                     </DialogHeader>
//                     <div className="grid gap-3">
//                       <div className="grid gap-1.5">
//                         <Label className="text-gray-700 dark:text-gray-200">Nama Mapel</Label>
//                         <Input className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" placeholder="Contoh: Bahasa Indonesia"/>
//                       </div>
//                       <div className="grid gap-1.5">
//                         <Label className="text-gray-700 dark:text-gray-200">Alokasi Jam/Minggu</Label>
//                         <Input type="number" className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" placeholder="24"/>
//                       </div>
//                       <Button className="mt-2 bg-green-500 hover:bg-green-400 text-white transition-all duration-300 transform hover:scale-105"><CheckCircle2 className="h-4 w-4 mr-2"/>Simpan</Button>
//                     </div>
//                   </DialogContent>
//                 </Dialog>

//                 <Dialog>
//                   <DialogTrigger asChild><Button className="w-full bg-blue-100 dark:bg-white/10 text-teal-500 dark:text-teal-400 hover:bg-blue-200 dark:hover:bg-blue-800 transition-all duration-300"><ListTodo className="h-4 w-4 mr-2"/>Input PR Siswa</Button></DialogTrigger>
//                   <DialogContent className="sm:max-w-lg dark:bg-neutral-900/60 backdrop-blur-lg rounded-xl shadow-2xl p-6">
//                     <DialogHeader>
//                       <DialogTitle className="text-gray-800 dark:text-white">Input PR Siswa</DialogTitle>
//                       <DialogDescription className="text-gray-500 dark:text-gray-400">Tentukan kelas, tenggat, dan deskripsi PR.</DialogDescription>
//                     </DialogHeader>
//                     <div className="grid gap-3">
//                       <div className="grid gap-1.5">
//                         <Label className="text-gray-700 dark:text-gray-200">Kelas</Label>
//                         <Select>
//                           <SelectTrigger className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500"><SelectValue placeholder="Pilih kelas"/></SelectTrigger>
//                           <SelectContent className="bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
//                             {Array.from(new Set(riwayatSiswa.map(s=>s.kelas))).map(k=> (
//                               <SelectItem key={k} value={k}>{k}</SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </div>
//                       <div className="grid gap-1.5">
//                         <Label className="text-gray-700 dark:text-gray-200">Judul / Deskripsi</Label>
//                         <Textarea className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" placeholder="Tulis instruksi PR..."/>
//                       </div>
//                       <div className="grid gap-1.5">
//                         <Label className="text-gray-700 dark:text-gray-200">Tenggat</Label>
//                         <Input type="date" className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500"/>
//                       </div>
//                       <Button className="mt-2 bg-green-500 hover:bg-green-400 text-white transition-all duration-300 transform hover:scale-105"><CheckCircle2 className="h-4 w-4 mr-2"/>Simpan</Button>
//                     </div>
//                   </DialogContent>
//                 </Dialog>

//                 <Dialog>
//                   <DialogTrigger asChild><Button className="w-full border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"><UploadCloud className="h-4 w-4 mr-2"/>Upload Rekaman</Button></DialogTrigger>
//                   <DialogContent className="sm:max-w-lg dark:bg-neutral-900/60 backdrop-blur-lg rounded-xl shadow-2xl p-6">
//                     <DialogHeader>
//                       <DialogTitle className="text-gray-800 dark:text-white">Upload Rekaman</DialogTitle>
//                       <DialogDescription className="text-gray-500 dark:text-gray-400">Unggah rekaman pembelajaran untuk dirangkum AI.</DialogDescription>
//                     </DialogHeader>
//                     <div className="grid gap-3">
//                       <Input type="file" accept="audio/*,video/*" className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500"/>
//                       <Button className="bg-blue-500 hover:bg-blue-400 text-white transition-all duration-300 transform hover:scale-105"><Mic className="h-4 w-4 mr-2"/>Proses & Rangkum</Button>
//                     </div>
//                   </DialogContent>
//                 </Dialog>

//                 {/* <Button className="w-full" variant="ghost"><FileText className="h-4 w-4 mr-2"/>Lihat Hasil Rangkuman</Button> */}
//               </CardContent>
//             </Card>

//             {/* Tabs: Absensi */}
//             <Card className="dark:bg-neutral-900/60 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
//               <CardHeader>
//                 <CardTitle className="text-base flex items-center gap-2 text-gray-800 dark:text-white"><Radio className="h-4 w-4 text-teal-500 dark:text-teal-400"/>Absensi</CardTitle>
//                 <CardDescription className="text-gray-500 dark:text-gray-400">Mapel • Sekolah • Guru</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <Tabs defaultValue="mapel">
//                   <TabsList className="grid grid-cols-3 w-full bg-gray-100 dark:bg-gray-700">
//                     <TabsTrigger value="mapel" className="text-gray-800 dark:text-white data-[state=active]:bg-blue-500 data-[state=active]:text-white">Absensi Mapel</TabsTrigger>
//                     <TabsTrigger value="sekolah" className="text-gray-800 dark:text-white data-[state=active]:bg-blue-500 data-[state=active]:text-white">Absensi Sekolah</TabsTrigger>
//                     <TabsTrigger value="guru" className="text-gray-800 dark:text-white data-[state=active]:bg-blue-500 data-[state=active]:text-white">Absensi Guru</TabsTrigger>
//                   </TabsList>
//                   <TabsContent value="mapel" className="mt-4">
//                     <div className="text-sm text-gray-500 dark:text-gray-400">Form absensi per sesi mapel. (Placeholder)</div>
//                   </TabsContent>
//                   <TabsContent value="sekolah" className="mt-4">
//                     <div className="text-sm text-gray-500 dark:text-gray-400">Rekap kehadiran sekolah. (Placeholder)</div>
//                   </TabsContent>
//                   <TabsContent value="guru" className="mt-4">
//                     <div className="text-sm text-gray-500 dark:text-gray-400">Absensi pribadi guru. (Placeholder)</div>
//                   </TabsContent>
//                 </Tabs>
//               </CardContent>
//             </Card>

//             {/* Profil Saya */}
//             <Card className="dark:bg-neutral-900/60 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
//               <CardHeader>
//                 <CardTitle className="text-base flex items-center gap-2 text-gray-800 dark:text-white"><UserRound className="h-4 w-4 text-teal-500 dark:text-teal-400"/>Profil Saya</CardTitle>
//                 <CardDescription className="text-gray-500 dark:text-gray-400">Lengkapi data diri, pendidikan, keahlian, penugasan, dan akun.</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 {/* A. Data Diri */}
//                 <section>
//                   <SectionTitle icon={Settings} title="A. Data Diri" />
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                     <div className="grid gap-1.5"><Label className="text-gray-700 dark:text-gray-200">Nama</Label><Input className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" defaultValue={profile.nama}/></div>
//                     <div className="grid gap-1.5"><Label className="text-gray-700 dark:text-gray-200">NIP/NUPTK</Label><Input className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" defaultValue={`${profile.nip} / ${profile.nuptk}`}/></div>
//                     <div className="grid gap-1.5"><Label className="text-gray-700 dark:text-gray-200">Tempat & Tanggal Lahir</Label><Input className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" defaultValue={profile.ttl}/></div>
//                     <div className="grid gap-1.5"><Label className="text-gray-700 dark:text-gray-200">Jenis Kelamin</Label><Input className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" defaultValue={profile.jk}/></div>
//                     <div className="grid gap-1.5"><Label className="text-gray-700 dark:text-gray-200">Agama</Label><Input className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" defaultValue={profile.agama}/></div>
//                     <div className="grid gap-1.5"><Label className="text-gray-700 dark:text-gray-200">Alamat</Label><Input className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" defaultValue={profile.alamat}/></div>
//                     <div className="grid gap-1.5"><Label className="text-gray-700 dark:text-gray-200">No HP</Label><Input className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" defaultValue={profile.hp}/></div>
//                     <div className="grid gap-1.5"><Label className="text-gray-700 dark:text-gray-200">Email</Label><Input className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" defaultValue={profile.email}/></div>
//                   </div>
//                 </section>

//                 {/* B. Pendidikan */}
//                 <section>
//                   <SectionTitle icon={GraduationCap} title="B. Pendidikan" />
//                   <div className="grid md:grid-cols-4 gap-3">
//                     <div className="grid gap-1.5"><Label className="text-gray-700 dark:text-gray-200">Pendidikan Terakhir</Label><Input className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" defaultValue={profile.pendidikan.terakhir}/></div>
//                     <div className="grid gap-1.5"><Label className="text-gray-700 dark:text-gray-200">Jurusan</Label><Input className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" defaultValue={profile.pendidikan.jurusan}/></div>
//                     <div className="grid gap-1.5"><Label className="text-gray-700 dark:text-gray-200">Nama Institusi</Label><Input className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" defaultValue={profile.pendidikan.institusi}/></div>
//                     <div className="grid gap-1.5"><Label className="text-gray-700 dark:text-gray-200">Tahun Lulus</Label><Input className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" defaultValue={profile.pendidikan.tahun}/></div>
//                   </div>
//                 </section>

//                 {/* C. Keahlian & Sertifikasi */}
//                 <section>
//                   <SectionTitle icon={PenLine} title="B. Keahlian & Sertifikasi" />
//                   <div className="grid gap-1.5 mb-3">
//                     <Label className="text-gray-700 dark:text-gray-200">Bidang Keahlian</Label>
//                     <Input className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" defaultValue={profile.keahlian.join(", ")}/>
//                   </div>
//                   <div className="grid gap-1.5">
//                     <Label className="text-gray-700 dark:text-gray-200">Jenjang yang Diampu</Label>
//                     <Input className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" defaultValue={profile.jenjang}/>
//                   </div>
//                   <div className="grid gap-1.5 mt-3">
//                     <Label className="text-gray-700 dark:text-gray-200">Sertifikasi (nama + tahun)</Label>
//                     <Textarea className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" defaultValue={profile.sertifikasi.map(s=>`${s.nama} – ${s.tahun}`).join("\n")} rows={3}/>
//                   </div>
//                   <div className="grid gap-1.5 mt-3">
//                     <Label className="text-gray-700 dark:text-gray-200">Upload Sertifikat (multi)</Label>
//                     <Input type="file" multiple accept="image/*,application/pdf" className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500"/>
//                   </div>
//                 </section>

//                 {/* D. Penugasan & Jabatan */}
//                 <section>
//                   <SectionTitle icon={School} title="D. Penugasan & Jabatan" />
//                   <div className="grid md:grid-cols-2 gap-3">
//                     <div className="grid gap-1.5"><Label className="text-gray-700 dark:text-gray-200">Jabatan</Label><Input className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" defaultValue={profile.jabatan}/></div>
//                     <div className="grid gap-1.5"><Label className="text-gray-700 dark:text-gray-200">Kelas Binaan</Label><Input className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" defaultValue={profile.kelasBinaan.join(", ")}/></div>
//                     <div className="grid gap-1.5 md:col-span-2">
//                       <Label className="text-gray-700 dark:text-gray-200">Mata Pelajaran Diampu</Label>
//                       <div className="flex flex-wrap gap-2">
//                         {(mapelExpanded ? mapel : mapel.slice(0,5)).map((m) => (
//                           <span key={m} className="inline-flex items-center gap-1 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 px-2 py-1 text-sm text-gray-800 dark:text-white">
//                             {m}
//                             <button className="rounded-full p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600" onClick={()=>removeMapel(m)} aria-label={`Hapus ${m}`}>
//                               <span className="sr-only">hapus</span>✕
//                             </button>
//                           </span>
//                         ))}
//                         {mapel.length > 5 && !mapelExpanded && (
//                           <Button variant="ghost" size="sm" className="text-teal-500 dark:text-teal-400 hover:text-blue-600 dark:hover:text-blue-300 transition-all duration-300" onClick={()=>setMapelExpanded(true)}>&gt; {mapel.length - 5} lainnya</Button>
//                         )}
//                         <Dialog open={mapelDialogOpen} onOpenChange={setMapelDialogOpen}>
//                           <DialogTrigger asChild>
//                             <Button size="sm" variant="secondary" className="bg-blue-100 dark:bg-white/10 text-teal-500 dark:text-teal-400 hover:bg-blue-200 dark:hover:bg-blue-800 transition-all duration-300">Tambah/Pilih</Button>
//                           </DialogTrigger>
//                           <DialogContent className="sm:max-w-lg dark:bg-neutral-900/60 backdrop-blur-lg rounded-xl shadow-2xl p-6">
//                             <DialogHeader>
//                               <DialogTitle className="text-gray-800 dark:text-white">Pilih Mata Pelajaran</DialogTitle>
//                               <DialogDescription className="text-gray-500 dark:text-gray-400">Centang untuk menambah, uncentang untuk menghapus.</DialogDescription>
//                             </DialogHeader>
//                             <div className="grid gap-3">
//                               <Input className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" placeholder="Cari mapel..." value={mapelSearch} onChange={(e)=>setMapelSearch(e.target.value)} />
//                               <div className="max-h-60 overflow-auto rounded-md border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-gray-800 p-2">
//                                 {allMapel
//                                   .filter(m=>m.toLowerCase().includes(mapelSearch.toLowerCase()))
//                                   .map((m) => (
//                                     <label key={m} className="flex items-center gap-2 py-1 text-gray-800 dark:text-white">
//                                       <input
//                                         type="checkbox"
//                                         className="h-4 w-4 text-blue-500 focus:ring-blue-500"
//                                         checked={mapel.includes(m)}
//                                         onChange={(e)=> e.target.checked ? addMapel(m) : removeMapel(m)}
//                                       />
//                                       <span>{m}</span>
//                                     </label>
//                                   ))}
//                               </div>
//                               <div className="flex justify-end gap-2">
//                                 <Button variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300" onClick={()=>setMapelDialogOpen(false)}>Tutup</Button>
//                                 <Button className="bg-green-500 hover:bg-green-400 text-white transition-all duration-300 transform hover:scale-105" onClick={()=>setMapelDialogOpen(false)}>Simpan</Button>
//                               </div>
//                             </div>
//                           </DialogContent>
//                         </Dialog>
//                       </div>
//                     </div>
//                     <div className="grid gap-1.5"><Label className="text-gray-700 dark:text-gray-200">Total Jam Mengajar</Label><Input type="number" className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" defaultValue={profile.totalJam}/></div>
//                   </div>

//                   <div className="grid gap-1.5 mt-3">
//                     <Label className="text-gray-700 dark:text-gray-200">Sekolah Saat Ini</Label>
//                     <Input className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" defaultValue={profile.sekolahSaatIni}/>
//                   </div>
//                   {/* <div className="mt-3">
//                     <Label>Riwayat Penugasan / Pindah Sekolah</Label>
//                     <ul className="list-disc pl-5 text-sm text-gray-500 dark:text-gray-400">
//                       {profile.riwayatPenugasan.map((r,i)=> (
//                         <li key={i}>{r.sekolah} ({r.tahun})</li>
//                       ))}
//                     </ul>
//                   </div> */}

//                   <div className="mt-4">
//                     <SectionTitle icon={Building2} title="Riwayat Mutasi (Rinci)" action={
//                       <Dialog>
//                         <DialogTrigger asChild>
//                           <Button variant="default" size="sm" className="bg-blue-500 hover:bg-blue-400 text-white transition-all duration-300 transform hover:scale-105"><ArrowRightLeft className="h-4 w-4 mr-2"/>Ajukan Pindah Sekolah</Button>
//                         </DialogTrigger>
//                         <DialogContent className="sm:max-w-lg dark:bg-neutral-900/60 backdrop-blur-lg rounded-xl shadow-2xl p-6">
//                           <DialogHeader>
//                             <DialogTitle className="text-gray-800 dark:text-white">Form Pengajuan Pindah Sekolah</DialogTitle>
//                             <DialogDescription className="text-gray-500 dark:text-gray-400">Lengkapi detail mutasi untuk proses verifikasi oleh admin/dinas.</DialogDescription>
//                           </DialogHeader>
//                           <div className="grid gap-3">
//                             <div className="grid gap-1.5"><Label className="text-gray-700 dark:text-gray-200">Sekolah Tujuan</Label><Input className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" placeholder="Contoh: SMPN 5 Bandung"/></div>
//                             <div className="grid gap-1.5"><Label className="text-gray-700 dark:text-gray-200">Unit/Alamat Tujuan</Label><Input className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" placeholder="Jl. Contoh No. 1"/></div>
//                             <div className="grid gap-1.5"><Label className="text-gray-700 dark:text-gray-200">Jabatan di Sekolah Tujuan</Label><Input className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" placeholder="Guru Mapel / Wali Kelas / Kepala Lab"/></div>
//                             <div className="grid gap-1.5"><Label className="text-gray-700 dark:text-gray-200">TMT (Mulai Bertugas)</Label><Input type="date" className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500"/></div>
//                             <div className="grid gap-1.5"><Label className="text-gray-700 dark:text-gray-200">Jenis Mutasi</Label>
//                               <Select>
//                                 <SelectTrigger className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500"><SelectValue placeholder="Pilih jenis"/></SelectTrigger>
//                                 <SelectContent className="bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
//                                   <SelectItem value="mutasi">Mutasi</SelectItem>
//                                   <SelectItem value="rotasi">Rotasi</SelectItem>
//                                   <SelectItem value="promosi">Promosi</SelectItem>
//                                 </SelectContent>
//                               </Select>
//                             </div>
//                             <div className="grid gap-1.5"><Label className="text-gray-700 dark:text-gray-200">Alasan</Label><Textarea className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" placeholder="Tulis alasan singkat" rows={3}/></div>
//                             <div className="grid gap-1.5"><Label className="text-gray-700 dark:text-gray-200">Upload SK/Surat Rekomendasi</Label><Input type="file" accept="application/pdf,image/*" className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500"/></div>
//                             <Button className="mt-2 bg-green-500 hover:bg-green-400 text-white transition-all duration-300 transform hover:scale-105"><CheckCircle2 className="h-4 w-4 mr-2"/>Kirim Pengajuan</Button>
//                           </div>
//                         </DialogContent>
//                       </Dialog>
//                     } />

//                     <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-gray-800 mt-3">
//                       <Table>
//                         <TableHeader>
//                           <TableRow className="hover:bg-gray-100 dark:hover:bg-gray-700">
//                             <TableHead className="text-gray-700 dark:text-gray-200">Sekolah</TableHead>
//                             <TableHead className="text-gray-700 dark:text-gray-200">Unit</TableHead>
//                             <TableHead className="text-gray-700 dark:text-gray-200">Jabatan</TableHead>
//                             <TableHead className="text-gray-700 dark:text-gray-200">Mulai</TableHead>
//                             <TableHead className="text-gray-700 dark:text-gray-200">Selesai</TableHead>
//                             <TableHead className="text-gray-700 dark:text-gray-200">Status</TableHead>
//                           </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                           {penugasanHistory.map((p)=> (
//                             <TableRow key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
//                               <TableCell className="text-gray-800 dark:text-white">{p.sekolah}</TableCell>
//                               <TableCell className="text-gray-800 dark:text-white">{p.unit}</TableCell>
//                               <TableCell className="text-gray-800 dark:text-white">{p.jabatan}</TableCell>
//                               <TableCell className="text-gray-800 dark:text-white">{new Date(p.tmtMulai).toLocaleDateString()}</TableCell>
//                               <TableCell className="text-gray-800 dark:text-white">{p.tmtSelesai ? new Date(p.tmtSelesai).toLocaleDateString() : '-'}</TableCell>
//                               <TableCell>
//                                 <Badge variant="secondary" className={`rounded-full border ${statusClass(p.status)}`}>{p.status}</Badge>
//                               </TableCell>
//                             </TableRow>
//                           ))}
//                         </TableBody>
//                       </Table>
//                     </div>
//                   </div>
//                 </section>

//                 {/* E. Tanda Tangan & Akun */}
//                 <section>
//                   <SectionTitle icon={ShieldCheck} title="E. Tanda Tangan & Akun" />
//                   <div className="grid md:grid-cols-2 gap-3">
//                     <div className="grid gap-1.5"><Label className="text-gray-700 dark:text-gray-200">Upload TTD</Label><Input type="file" accept="image/*" className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500"/></div>
//                     <div className="grid gap-1.5"><Label className="text-gray-700 dark:text-gray-200">Ganti Password (opsional)</Label><Input type="password" className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" placeholder="••••••••"/></div>
//                   </div>
//                   <Button className="mt-3 bg-green-500 hover:bg-green-400 text-white transition-all duration-300 transform hover:scale-105"><CheckCircle2 className="h-4 w-4 mr-2"/>Simpan</Button>
//                 </section>

//                 {/* Dev Tests (simple runtime checks) */}
//                 <section>
//                   <SectionTitle icon={Settings} title="Developer Tests (runtime)" />
//                   <div className="flex flex-wrap gap-2 items-center">
//                     <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300" onClick={()=>setMapel(["Bahasa Indonesia","Matematika","IPA","IPS","PPKn","Bahasa Inggris","Seni Budaya","PJOK"]) }>Set &gt; 6 mapel</Button>
//                     <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300" onClick={()=>setMapel(["Bahasa Indonesia"]) }>Set 1 mapel</Button>
//                     <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300" onClick={()=>setMapel([])}>Kosongkan mapel</Button>
//                     <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300" onClick={()=>setMapel(allMapel.slice(0,6))}>Set 6 mapel</Button>
//                     <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300" onClick={()=>setMapelExpanded(true)}>Expand chips</Button>
//                     <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300" onClick={()=>setMapelExpanded(false)}>Collapse chips</Button>
//                     <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">State: jumlah={mapel.length}, expanded={String(mapelExpanded)}</span>
//                   </div>
//                 </section>
//               </CardContent>
//             </Card>
//           </div>
//         </div>

//         {/* Footer tip */}
//         <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-6">UI demo • Integrasikan ke API Xpresensi untuk data real-time (jadwal, absensi, PR, rangkuman AI, dsb.)</div>
//       </div>
//     </div>
//   );
// }


import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Progress,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from "@/core/libs";
import {
  ArrowRightLeft,
  BarChart3,
  BookOpen,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  History,
  ListTodo,
  Mic,
  NotebookPen,
  PenLine,
  PieChart as PieIcon,
  Radio,
  School,
  Search,
  Settings,
  ShieldCheck,
  UploadCloud,
  UserRound,
  Users
} from "lucide-react";
import React, { useMemo, useState, useEffect } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useProfile } from "../hooks";
import { useBiodataGuru } from "@/features/user";

// Dummy data for sections not covered by profileNew?.user (replace with API integration)
const statsToday = {
  totalMapel: 1,
  totalSiswa: 362,
  totalJam: 6,
  kehadiranKelas: [
    { kelas: "7A", mapel: "B. Indonesia", jam: "07.00–07.45", status: "Hadir", hadir: 31, izin: 1, sakit: 0, alpha: 0 },
    { kelas: "8B", mapel: "B. Indonesia", jam: "08.00–08.45", status: "Hadir", hadir: 32, izin: 0, sakit: 1, alpha: 0 },
    { kelas: "9C", mapel: "B. Indonesia", jam: "10.00–10.45", status: "Menunggu", hadir: 0, izin: 0, sakit: 0, alpha: 0 },
  ],
};

const barKehadiranGuru = [
  { minggu: "1", hadir: 24, izin: 0, sakit: 0 },
  { minggu: "2", hadir: 23, izin: 1, sakit: 0 },
  { minggu: "3", hadir: 24, izin: 0, sakit: 0 },
  { minggu: "4", hadir: 22, izin: 1, sakit: 1 },
];

const pieMapelJam = [
  { name: "Mengajar", value: 24 },
  { name: "Pengembangan", value: 6 },
  { name: "Administrasi", value: 4 },
];

const rangkumanTerbaru = [
  { id: 1, kelas: "7A", judul: "Ringkasan Bab 3 – Teks Eksposisi", tgl: "2025-08-21", pr: 2 },
  { id: 2, kelas: "8B", judul: "Catatan Diskusi – Opini & Fakta", tgl: "2025-08-20", pr: 1 },
];

const jadwalHariIni = [
  { jam: "07.00", kelas: "7A", mapel: "B. Indonesia", ruang: "VIII-1" },
  { jam: "08.00", kelas: "8B", mapel: "B. Indonesia", ruang: "VIII-2" },
  { jam: "10.00", kelas: "9C", mapel: "B. Indonesia", ruang: "IX-3" },
];

const karier = {
  pertamaMengajar: 2005, // Placeholder, replace with API data
  estimasiPensiun: 2039, // Placeholder, replace with API data
  perTahun: [
    { tahun: 2019, siswa: 310, kelas: 12 },
    { tahun: 2020, siswa: 298, kelas: 11 },
    { tahun: 2021, siswa: 320, kelas: 12 },
    { tahun: 2022, siswa: 340, kelas: 13 },
    { tahun: 2023, siswa: 356, kelas: 14 },
    { tahun: 2024, siswa: 362, kelas: 14 },
    { tahun: 2025, siswa: 362, kelas: 14 },
  ],
};

const allMapel = [
  "Bahasa Indonesia",
  "Matematika",
  "Ilmu Pengetahuan Alam",
  "Ilmu Pengetahuan Sosial",
  "PPKn",
  "Bahasa Inggris",
  "Seni Budaya",
  "PJOK",
  "Informatika",
  "Prakarya",
  "Agama",
  "Muatan Lokal",
];

const penugasanHistory = [
  // { id: 1, sekolah: "SMPN 12 Bandung", unit: "Kampus Utama", jabatan: "Guru Mapel", tmtMulai: "2010-07-01", tmtSelesai: "2016-06-30", status: "Selesai" },
  // { id: 2, sekolah: "SMPN 3 Cimahi", unit: "Unit Barat", jabatan: "Wali Kelas", tmtMulai: "2016-07-01", tmtSelesai: "2019-06-30", status: "Selesai" },
  // { id: 3, sekolah: "SMPN 8 Bandung", unit: "Kampus A", jabatan: "Guru Mapel", tmtMulai: "2019-07-01", tmtSelesai: null, status: "Aktif" },
];

const riwayatSiswa = Array.from({ length: 24 }).map((_, i) => ({
  id: i + 1,
  nama: `Siswa ${i + 1}`,
  tahunAjar: ["2023/2024", "2024/2025"][i % 2],
  kelas: ["7A", "8B", "9C"][i % 3],
  status: ["Naik Kelas", "Lulus", "Mutasi"][i % 3],
}));

// Small helpers
function Stat({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string | number; sub?: string }) {
  return (
    <Card className="shadow-sm w-max h-max dark:bg-neutral-900/60 border border-gray-200 dark:border-white/10">
      <CardContent className="p-4 flex flex-col gap-3">
        <div className="w-max flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-100 dark:bg-white/10"><Icon className="h-5 w-5 text-teal-500 dark:text-teal-400"/></div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mr-10">{label}</div>
          <div className="text-lg font-semibold text-gray-800 dark:text-white flex w-max leading-tight">{value}</div>
          {/* {sub && <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{sub}</div>} */}
        </div>
      </CardContent>
    </Card>
  );
}

function SectionTitle({ icon: Icon, title, action }: { icon: any; title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-teal-500 dark:text-teal-400"/>
        <h3 className="font-semibold tracking-tight text-gray-800 dark:text-white">{title}</h3>
      </div>
      {action}
    </div>
  );
}

function statusClass(status: string) {
  if (status === "Aktif" || status === "Hadir") return "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400 border-black/40 dark:border-white/10";
  if (status === "Menunggu") return "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700";
  return "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-white/10";
}

export const EditProfileForm = () => {
  const profileNew = useProfile();
  const dataGuru = useBiodataGuru();
  const [tahunFilter, setTahunFilter] = useState<string>("2025");
  const [searchSiswa, setSearchSiswa] = useState("");
  const [mapel, setMapel] = useState<string[]>(profileNew?.user?.mapelDiampu || ["Bahasa Indonesia"]);
  const [mapelDialogOpen, setMapelDialogOpen] = useState(false);
  const [mapelSearch, setMapelSearch] = useState("");
  const [mapelExpanded, setMapelExpanded] = useState(false);
  const addMapel = (m: string) => setMapel(prev => prev.includes(m) ? prev : [...prev, m]);
  const removeMapel = (m: string) => setMapel(prev => prev.filter(x => x !== m));

  // Fetch guru profile data
  useEffect(() => {
    const fetchGuruProfile = async () => {
      const id = profileNew?.user?.id;
      if (!id) {
        console.log("No user ID found in profileNew?.user?.id");
        return;
      }

      const apiUrl = `https://dev.kiraproject.id/api/guru-profile/${id}`;
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!response.ok) {
          throw new Error(`API call failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log("Guru Profile Data:", data);
      } catch (error) {
        console.error("Error fetching guru profile:", error);
      }
    };

    fetchGuruProfile();
  }, [profileNew?.user?.id]);

  console.log('profileNew', profileNew?.user);
  console.log('dataGuru', dataGuru?.data);

  // Map profileNew?.user to profile structure
  const profile = useMemo(() => ({
    nama: profileNew?.user?.name || "Guru",
    nip: profileNew?.user?.nip || "-",
    nuptk: profileNew?.user?.nikki || "-",
    ttl: profileNew?.user?.tanggalLahir ? `${new Date(profileNew?.user?.tanggalLahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}` : "-",
    jk: profileNew?.user?.jenisKelamin || "-",
    agama: profileNew?.user?.agama || "-",
    alamat: profileNew?.user?.alamat || "-",
    hp: profileNew?.user?.noTlp || "-",
    email: profileNew?.user?.email || "-",
    pendidikan: {
      terakhir: profileNew?.user?.pendidikan?.terakhir || "-",
      jurusan: profileNew?.user?.pendidikan?.jurusan || "-",
      institusi: profileNew?.user?.pendidikan?.institusi || "-",
      tahun: profileNew?.user?.pendidikan?.tahun || "-",
    },
    keahlian: profileNew?.user?.keahlian || ["-"], // Placeholder, needs API
    jenjang: profileNew?.user?.jenjang || "SMP", // Placeholder, needs API
    sertifikasi: profileNew?.user?.sertifikasi || [], // Placeholder, needs API
    jabatan: profileNew?.user?.role || "Guru Mapel", // Placeholder, needs API
    kelasBinaan: profileNew?.user?.kelasBinaan || [], // Placeholder, needs API
    mapelDiampu: mapel,
    totalJam: profileNew?.user?.totalJam || 24, // Placeholder, needs API
    foto: profileNew?.user?.image?.includes('uploads') ? `https://dev.kiraproject.id${profileNew?.user?.image}` : profileNew?.user?.image || "https://via.placeholder.com/150",
    sekolahSaatIni: profileNew?.user?.sekolah?.namaSekolah || "-",
    // riwayatPenugasan: profileNew?.user?.riwayatPenugasan || penugasanHistory.map(r => ({ sekolah: r.sekolah, tahun: r.tmtSelesai ? `${new Date(r.tmtMulai).getFullYear()}–${new Date(r.tmtSelesai).getFullYear()}` : `${new Date(r.tmtMulai).getFullYear()}–sekarang` })),
    riwayatPenugasan: profileNew?.user?.riwayatPenugasan || penugasanHistory.map(r => ({ sekolah: r.sekolah, tahun: r.tmtSelesai ? `${new Date(r.tmtMulai).getFullYear()}–${new Date(r.tmtSelesai).getFullYear()}` : `${new Date(r.tmtMulai).getFullYear()}–sekarang` })),
  }), [profileNew?.user, mapel]);

  const masaBakti = useMemo(() => {
    const now = new Date().getFullYear();
    return { tahun: now - karier.pertamaMengajar, sisa: karier.estimasiPensiun - now };
  }, []);

  const filteredRiwayat = useMemo(() => riwayatSiswa.filter((s) => s.nama.toLowerCase().includes(searchSiswa.toLowerCase())), [searchSiswa]);

  return (
    <div className="min-h-screen w-full  text-gray-800 dark:text-white py-5 px-3">
      {/* glossy overlay */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/10 opacity-40 dark:from-white/10 dark:to-white/0" />
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-white/50 blur-3xl opacity-20 dark:bg-white/10" />
      </div>
      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in;
        }
        select option {
          background: #F9FAFB !important;
          color: #1F2937;
        }
        select option:checked,
        select option:hover {
          background: #60A5FA !important;
          color: #FFFFFF;
        }
        @media (prefers-color-scheme: dark) {
          select option {
            background: #1E293B !important;
            color: #FFFFFF;
          }
          select option:checked,
          select option:hover {
            background: #60A5FA !important;
            color: #FFFFFF;
          }
        }
      `}</style>
      {/* Page header */}
      <div className="max-w-full mx-auto p-4 md:p-6">
        <div className="flex items-start gap-4 md:gap-6">
          <Card className="flex-1 dark:bg-neutral-900/60 border border-gray-200 dark:border-white/10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                <Avatar className="h-20 w-20 ring-2 ring-blue-200 dark:ring-white/20 rounded-full">
                  <AvatarImage src={profile.foto} alt={profile.nama} />
                  <AvatarFallback className="bg-blue-100 dark:bg-white/10 text-teal-500 dark:text-teal-400">{profile.nama.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex justify-between w-full gap-2">
                  <div>
                    <h1 className="text-xl md:text-xl font-bold leading-tight text-gray-800 dark:text-white">{profile.nama}</h1>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Badge variant="secondary" className="rounded-sm bg-blue-100 dark:bg-white/10 text-teal-500 dark:text-teal-400"><BookOpen className="h-3.5 w-3.5 mr-1"/> {mapel.join(", ")}</Badge>
                      <Badge variant="outline" className="rounded-sm border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200"><School className="h-3.5 w-3.5 mr-1"/> {profile.jenjang}</Badge>
                      <Badge className="rounded-sm bg-green-500 dark:bg-green-600 text-white">{profile?.jabatan}</Badge>
                      <Badge variant="outline" className="rounded-sm border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200">NIP: {profile.nip}</Badge>
                    </div>
                  </div>
                  <div className="flex w-max gap-5">
                    <Stat icon={BookOpen} label="Mapel" value={mapel.length} />
                    <Stat icon={Users} label="Total Siswa" value={statsToday.totalSiswa} />
                    <Stat icon={Clock3} label="Jam Hari Ini" value={`${statsToday.totalJam} jam`} />
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-3 md:gap-4 mt-4">
                <Card className="dark:bg-neutral-900/60 border border-gray-200 dark:border-white/10 rounded-xl shadow-sm">
                  <CardHeader className="pb-2"><CardTitle className="text-base text-gray-800 dark:text-white">Masa Bakti</CardTitle><CardDescription className="text-gray-500 dark:text-gray-400">Sejak {karier.pertamaMengajar}</CardDescription></CardHeader>
                  <CardContent>
                    <div className="text-xl font-semibold text-gray-800 dark:text-white">{masaBakti.tahun} tahun</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Perkiraan pensiun {karier.estimasiPensiun} • sisa {masaBakti.sisa} tahun</div>
                    <Progress className="mt-3 bg-gray-200 dark:bg-gray-700" value={((new Date().getFullYear() - karier.pertamaMengajar) / (karier.estimasiPensiun - karier.pertamaMengajar)) * 100} style={{ "--progress-color": "#60A5FA" } as React.CSSProperties} />
                  </CardContent>
                </Card>
                <Card className="dark:bg-neutral-900/60 border border-gray-200 dark:border-white/10 rounded-xl shadow-sm">
                  <CardHeader className="pb-2"><CardTitle className="text-base text-gray-800 dark:text-white">Waktu Pertama Mengajar</CardTitle></CardHeader>
                  <CardContent>
                    <div className="text-lg text-gray-800 dark:text-white">{karier.pertamaMengajar}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Data dari riwayat SK pengangkatan</div>
                  </CardContent>
                </Card>
                <Card className="dark:bg-neutral-900/60 border border-gray-200 dark:border-white/10 rounded-xl shadow-sm">
                  <CardHeader className="pb-2"><CardTitle className="text-base text-gray-800 dark:text-white">Estimasi Pensiun</CardTitle></CardHeader>
                  <CardContent>
                    <div className="text-lg text-gray-800 dark:text-white">{karier.estimasiPensiun}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Mengikuti regulasi ASN/GTK</div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6 mt-6">
          {/* Left Column */}
          <div className="space-y-4 md:space-y-6 xl:col-span-2">
            <Card className="dark:bg-neutral-900/60 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-4 md:p-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <SectionTitle icon={BarChart3} title="Bar Chart Kehadiran Guru (mingguan)" />
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barKehadiranGuru}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                          <XAxis dataKey="minggu" tickLine={false} stroke="#6B7280" />
                          <YAxis allowDecimals={false} tickLine={false} stroke="#6B7280" />
                          <Tooltip contentStyle={{ backgroundColor: "#1F2937", color: "#FFFFFF", borderRadius: "8px" }} />
                          <Legend />
                          <Bar dataKey="hadir" name="Hadir" radius={[6,6,0,0]} fill="#22C55E" />
                          <Bar dataKey="izin" name="Izin" radius={[6,6,0,0]} fill="#EAB308" />
                          <Bar dataKey="sakit" name="Sakit" radius={[6,6,0,0]} fill="#EF4444" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div>
                    <SectionTitle icon={PieIcon} title="Distribusi Mapel/Jam" />
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={pieMapelJam} dataKey="value" nameKey="name" outerRadius={90}>
                            {pieMapelJam.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={["#22C55E", "#60A5FA", "#EAB308"][index % 3]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: "#1F2937", color: "#FFFFFF", borderRadius: "8px" }} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-4 md:gap-6">
              <Card className="dark:bg-neutral-900/60 border border-gray-200 dark:border-white/10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4 md:p-6">
                  <SectionTitle icon={CalendarDays} title="Kehadiran Kelas Hari Ini" />
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-gray-100 dark:hover:bg-gray-700">
                        <TableHead className="text-gray-700 dark:text-gray-200">Kelas</TableHead>
                        <TableHead className="text-gray-700 dark:text-gray-200">Mapel</TableHead>
                        <TableHead className="text-gray-700 dark:text-gray-200">Jam</TableHead>
                        <TableHead className="text-gray-700 dark:text-gray-200">Status</TableHead>
                        <TableHead className="text-right text-gray-700 dark:text-gray-200">Rekap</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {statsToday.kehadiranKelas.map((k, idx) => (
                        <TableRow key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <TableCell className="text-gray-800 dark:text-white">{k.kelas}</TableCell>
                          <TableCell className="text-gray-800 dark:text-white">{k.mapel}</TableCell>
                          <TableCell className="text-gray-800 dark:text-white">{k.jam}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={`rounded-full border ${statusClass(k.status)}`}>{k.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right text-sm text-gray-500 dark:text-gray-400">
                            H:{k.hadir} • I:{k.izin} • S:{k.sakit} • A:{k.alpha}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="dark:bg-neutral-900/60 border border-gray-200 dark:border-white/10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4 md:p-6">
                  <SectionTitle icon={ListTodo} title="PR & Rangkuman Terbaru" />
                  <div className="space-y-3">
                    {rangkumanTerbaru.map((r) => (
                      <div key={r.id} className="p-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-gray-800 flex items-start justify-between">
                        <div>
                          <div className="font-medium text-gray-800 dark:text-white">{r.judul}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Kelas {r.kelas} • {new Date(r.tgl).toLocaleDateString()}</div>
                        </div>
                        <Badge variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200">PR: {r.pr}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="dark:bg-neutral-900/60 border border-gray-200 dark:border-white/10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 md:col-span-2">
                <CardContent className="p-4 md:p-6">
                  <SectionTitle icon={Clock3} title="Jadwal Hari Ini" />
                  <div className="grid md:grid-cols-3 gap-3">
                    {jadwalHariIni.map((j, i) => (
                      <Card key={i} className="border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50 dark:bg-gray-800">
                        <CardContent className="p-3">
                          <div className="text-sm text-gray-500 dark:text-gray-400">{j.jam}</div>
                          <div className="font-semibold text-gray-800 dark:text-white">{j.mapel} – {j.kelas}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Ruang {j.ruang}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="dark:bg-neutral-900/60 border border-gray-200 dark:border-white/10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 md:col-span-2">
                <CardContent className="p-4 md:p-6">
                  <SectionTitle icon={History} title="Riwayat Siswa & Rekap Otomatis" action={
                    <div className="flex items-center gap-2">
                      <Select value={tahunFilter} onValueChange={(v)=>setTahunFilter(v)}>
                        <SelectTrigger className="h-9 w-32 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500">
                          <SelectValue placeholder="Tahun"/>
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                          <SelectItem value="2023">2023</SelectItem>
                          <SelectItem value="2024">2024</SelectItem>
                          <SelectItem value="2025">2025</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400"/>
                        <Input className="pl-8 h-9 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" placeholder="Cari siswa..." value={searchSiswa} onChange={(e)=>setSearchSiswa(e.target.value)} />
                      </div>
                    </div>
                  } />

                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <Stat icon={Users} label="Total Siswa Pernah Diajar" value={statsToday.totalSiswa} />
                    <Stat icon={BookOpen} label="Jumlah Mapel Diajarkan" value={mapel.length} />
                    <Stat icon={School} label="Kelas Diampu (tahun ini)" value={karier.perTahun.find(t=>t.tahun.toString()===tahunFilter)?.kelas ?? 0} />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="dark:bg-neutral-900/60 border border-gray-200 dark:border-white/10 rounded-xl shadow-sm">
                      <CardHeader className="pb-2"><CardTitle className="text-base text-gray-800 dark:text-white">Bar Jumlah Siswa (per tahun ajaran)</CardTitle></CardHeader>
                      <CardContent>
                        <div className="h-60">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={karier.perTahun}>
                              <defs>
                                <linearGradient id="siswa" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.8} />
                                  <stop offset="95%" stopColor="#60A5FA" stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                              <XAxis dataKey="tahun" stroke="#6B7280"/>
                              <YAxis stroke="#6B7280"/>
                              <Tooltip contentStyle={{ backgroundColor: "#1F2937", color: "#FFFFFF", borderRadius: "8px" }}/>
                              <Area type="monotone" dataKey="siswa" stroke="#60A5FA" strokeWidth={2} fillOpacity={0.3} fill="url(#siswa)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="dark:bg-neutral-900/60 border border-gray-200 dark:border-white/10 rounded-xl shadow-sm">
                      <CardHeader className="pb-2"><CardTitle className="text-base text-gray-800 dark:text-white">Bar Jumlah Kelas (per tahun ajaran)</CardTitle></CardHeader>
                      <CardContent>
                        <div className="h-60">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={karier.perTahun}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                              <XAxis dataKey="tahun" stroke="#6B7280"/>
                              <YAxis stroke="#6B7280"/>
                              <Tooltip contentStyle={{ backgroundColor: "#1F2937", color: "#FFFFFF", borderRadius: "8px" }}/>
                              <Bar dataKey="kelas" fill="#22C55E" radius={[6,6,0,0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="mt-4 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-neutral-900/60">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-gray-100 dark:hover:bg-gray-700">
                          <TableHead className="text-gray-700 dark:text-gray-200">Nama</TableHead>
                          <TableHead className="text-gray-700 dark:text-gray-200">Tahun Ajaran</TableHead>
                          <TableHead className="text-gray-700 dark:text-gray-200">Kelas</TableHead>
                          <TableHead className="text-gray-700 dark:text-gray-200">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRiwayat.map((s)=> (
                          <TableRow key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <TableCell className="text-gray-800 dark:text-white">{s.nama}</TableCell>
                            <TableCell className="text-gray-800 dark:text-white">{s.tahunAjar}</TableCell>
                            <TableCell className="text-gray-800 dark:text-white">{s.kelas}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`rounded-full border ${statusClass(s.status)}`}>{s.status}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4 md:space-y-6">
            {/* Quick Actions */}
            <Card className="dark:bg-neutral-900/60 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-gray-800 dark:text-white"><NotebookPen className="h-4 w-4 text-teal-500 dark:text-teal-400"/>Aksi Cepat</CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">Input Mapel, PR, Upload Rekaman, dan Rangkuman AI</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Dialog>
                  <DialogTrigger asChild><Button className="w-full bg-blue-500 hover:bg-blue-400 text-white transition-all duration-300 transform hover:scale-105"><BookOpen className="h-4 w-4 mr-2"/>Input Mata Pelajaran</Button></DialogTrigger>
                  <DialogContent className="sm:max-w-lg dark:bg-neutral-900/60 backdrop-blur-lg rounded-xl shadow-2xl p-6">
                    <DialogHeader>
                      <DialogTitle className="text-gray-800 dark:text-white">Input Mata Pelajaran</DialogTitle>
                      <DialogDescription className="text-gray-500 dark:text-gray-400">Tambahkan atau perbarui mata pelajaran yang diampu.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-3">
                      <div className="grid gap-1.5">
                        <Label className="text-gray-700 dark:text-gray-200">Nama Mapel</Label>
                        <Input className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" placeholder="Contoh: Bahasa Indonesia"/>
                      </div>
                      <div className="grid gap-1.5">
                        <Label className="text-gray-700 dark:text-gray-200">Alokasi Jam/Minggu</Label>
                        <Input type="number" className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" placeholder="24"/>
                      </div>
                      <Button className="mt-2 bg-green-500 hover:bg-green-400 text-white transition-all duration-300 transform hover:scale-105"><CheckCircle2 className="h-4 w-4 mr-2"/>Simpan</Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild><Button className="w-full bg-blue-100 dark:bg-white/10 text-teal-500 dark:text-teal-400 hover:bg-blue-200 dark:hover:bg-blue-800 transition-all duration-300"><ListTodo className="h-4 w-4 mr-2"/>Input PR Siswa</Button></DialogTrigger>
                  <DialogContent className="sm:max-w-lg dark:bg-neutral-900/60 backdrop-blur-lg rounded-xl shadow-2xl p-6">
                    <DialogHeader>
                      <DialogTitle className="text-gray-800 dark:text-white">Input PR Siswa</DialogTitle>
                      <DialogDescription className="text-gray-500 dark:text-gray-400">Tentukan kelas, tenggat, dan deskripsi PR.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-3">
                      <div className="grid gap-1.5">
                        <Label className="text-gray-700 dark:text-gray-200">Kelas</Label>
                        <Select>
                          <SelectTrigger className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500"><SelectValue placeholder="Pilih kelas"/></SelectTrigger>
                          <SelectContent className="bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                            {Array.from(new Set(riwayatSiswa.map(s=>s.kelas))).map(k=> (
                              <SelectItem key={k} value={k}>{k}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-1.5">
                        <Label className="text-gray-700 dark:text-gray-200">Judul / Deskripsi</Label>
                        <Textarea className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" placeholder="Tulis instruksi PR..."/>
                      </div>
                      <div className="grid gap-1.5">
                        <Label className="text-gray-700 dark:text-gray-200">Tenggat</Label>
                        <Input type="date" className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500"/>
                      </div>
                      <Button className="mt-2 bg-green-500 hover:bg-green-400 text-white transition-all duration-300 transform hover:scale-105"><CheckCircle2 className="h-4 w-4 mr-2"/>Simpan</Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild><Button className="w-full border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"><UploadCloud className="h-4 w-4 mr-2"/>Upload Rekaman</Button></DialogTrigger>
                  <DialogContent className="sm:max-w-lg dark:bg-neutral-900/60 backdrop-blur-lg rounded-xl shadow-2xl p-6">
                    <DialogHeader>
                      <DialogTitle className="text-gray-800 dark:text-white">Upload Rekaman</DialogTitle>
                      <DialogDescription className="text-gray-500 dark:text-gray-400">Unggah rekaman pembelajaran untuk dirangkum AI.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-3">
                      <Input type="file" accept="audio/*,video/*" className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500"/>
                      <Button className="bg-blue-500 hover:bg-blue-400 text-white transition-all duration-300 transform hover:scale-105"><Mic className="h-4 w-4 mr-2"/>Proses & Rangkum</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* Tabs: Absensi */}
            <Card className="dark:bg-neutral-900/60 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-gray-800 dark:text-white"><Radio className="h-4 w-4 text-teal-500 dark:text-teal-400"/>Absensi</CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">Mapel • Sekolah • Guru</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="mapel">
                  <TabsList className="grid grid-cols-3 w-full bg-gray-100 dark:bg-gray-700">
                    <TabsTrigger value="mapel" className="text-gray-800 dark:text-white data-[state=active]:bg-blue-500 data-[state=active]:text-white">Absensi Mapel</TabsTrigger>
                    <TabsTrigger value="sekolah" className="text-gray-800 dark:text-white data-[state=active]:bg-blue-500 data-[state=active]:text-white">Absensi Sekolah</TabsTrigger>
                    <TabsTrigger value="guru" className="text-gray-800 dark:text-white data-[state=active]:bg-blue-500 data-[state=active]:text-white">Absensi Guru</TabsTrigger>
                  </TabsList>
                  <TabsContent value="mapel" className="mt-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Form absensi per sesi mapel. (Placeholder)</div>
                  </TabsContent>
                  <TabsContent value="sekolah" className="mt-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Rekap kehadiran sekolah. (Placeholder)</div>
                  </TabsContent>
                  <TabsContent value="guru" className="mt-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Absensi pribadi guru. (Placeholder)</div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Profil Saya */}
            <Card className="dark:bg-neutral-900/60 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-gray-800 dark:text-white"><UserRound className="h-4 w-4 text-teal-500 dark:text-teal-400"/>Profil Saya</CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">Lengkapi data diri, pendidikan, keahlian, penugasan, dan akun.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* A. Data Diri */}
                <section>
                  <SectionTitle icon={Settings} title="A. Data Diri" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="grid gap-1.5"><Label className="text-gray-700 dark:text-gray-200">Nama</Label><Input className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" defaultValue={profile.nama}/></div>
                    <div className="grid gap-1.5"><Label className="text-gray-700 dark:text-gray-200">NIP/NUPTK</Label><Input className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" defaultValue={`${profile.nip} / ${profile.nuptk}`}/></div>
                    <div className="grid gap-1.5"><Label className="text-gray-700 dark:text-gray-200">Tempat & Tanggal Lahir</Label><Input className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" defaultValue={profile.ttl}/></div>
                    <div className="grid gap-1.5"><Label className="text-gray-700 dark:text-gray-200">Jenis Kelamin</Label><Input className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" defaultValue={profile.jk}/></div>
                    <div className="grid gap-1.5"><Label className="text-gray-700 dark:text-gray-200">Agama</Label><Input className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" defaultValue={profile.agama}/></div>
                    <div className="grid gap-1.5"><Label className="text-gray-700 dark:text-gray-200">Alamat</Label><Input className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" defaultValue={profile.alamat}/></div>
                    <div className="grid gap-1.5"><Label className="text-gray-700 dark:text-gray-200">No HP</Label><Input className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" defaultValue={profile.hp}/></div>
                    <div className="grid gap-1.5"><Label className="text-gray-700 dark:text-gray-200">Email</Label><Input className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" defaultValue={profile.email}/></div>
                  </div>
                </section>

                {/* B. Pendidikan */}
                <section>
                  <SectionTitle icon={GraduationCap} title="B. Pendidikan" />
                  <div className="grid md:grid-cols-1 gap-3">
                    <div className="grid gap-1.5"><Label className="text-gray-700 dark:text-gray-200">Pendidikan Terakhir</Label><Input className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" defaultValue={profile.pendidikan.terakhir}/></div>
                    <div className="grid gap-1.5"><Label className="text-gray-700 dark:text-gray-200">Jurusan</Label><Input className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" defaultValue={profile.pendidikan.jurusan}/></div>
                    <div className="grid gap-1.5"><Label className="text-gray-700 dark:text-gray-200">Nama Institusi</Label><Input className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" defaultValue={profile.pendidikan.institusi}/></div>
                    <div className="grid gap-1.5"><Label className="text-gray-700 dark:text-gray-200">Tahun Lulus</Label><Input className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" defaultValue={profile.pendidikan.tahun}/></div>
                  </div>
                </section>

                {/* C. Keahlian & Sertifikasi */}
                <section>
                  <SectionTitle icon={PenLine} title="B. Keahlian & Sertifikasi" />
                  <div className="grid gap-1.5 mb-3">
                    <Label className="text-gray-700 dark:text-gray-200">Bidang Keahlian</Label>
                    <Input className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" defaultValue={profile.keahlian.join(", ")}/>
                  </div>
                  <div className="grid gap-1.5">
                    <Label className="text-gray-700 dark:text-gray-200">Jenjang yang Diampu</Label>
                    <Input className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" defaultValue={profile.jenjang}/>
                  </div>
                  <div className="grid gap-1.5 mt-3">
                    <Label className="text-gray-700 dark:text-gray-200">Sertifikasi (nama + tahun)</Label>
                    <Textarea className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" defaultValue={profile.sertifikasi.map(s=>`${s.nama} – ${s.tahun}`).join("\n")} rows={3}/>
                  </div>
                  <div className="grid gap-1.5 mt-3">
                    <Label className="text-gray-700 dark:text-gray-200">Upload Sertifikat (multi)</Label>
                    <Input type="file" multiple accept="image/*,application/pdf" className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500"/>
                  </div>
                </section>

                {/* D. Penugasan & Jabatan */}
                <section>
                  <SectionTitle icon={School} title="D. Penugasan & Jabatan" />
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="grid gap-1.5"><Label className="text-gray-700 dark:text-gray-200">Jabatan</Label><Input className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" defaultValue={profile.jabatan}/></div>
                    <div className="grid gap-1.5"><Label className="text-gray-700 dark:text-gray-200">Kelas Binaan</Label><Input className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" defaultValue={profile.kelasBinaan.join(", ")}/></div>
                    <div className="grid gap-1.5 md:col-span-2">
                      <Label className="text-gray-700 dark:text-gray-200">Mata Pelajaran Diampu</Label>
                      <div className="flex flex-wrap gap-2">
                        {(mapelExpanded ? mapel : mapel.slice(0,5)).map((m) => (
                          <span key={m} className="inline-flex items-center gap-1 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 px-2 py-1 text-sm text-gray-800 dark:text-white">
                            {m}
                            <button className="rounded-full p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600" onClick={()=>removeMapel(m)} aria-label={`Hapus ${m}`}>
                              <span className="sr-only">hapus</span>✕
                            </button>
                          </span>
                        ))}
                        {mapel.length > 5 && !mapelExpanded && (
                          <Button variant="ghost" size="sm" className="text-teal-500 dark:text-teal-400 hover:text-blue-600 dark:hover:text-blue-300 transition-all duration-300" onClick={()=>setMapelExpanded(true)}>&gt; {mapel.length - 5} lainnya</Button>
                        )}
                        <Dialog open={mapelDialogOpen} onOpenChange={setMapelDialogOpen}>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="secondary" className="bg-blue-100 dark:bg-white/10 text-teal-500 dark:text-teal-400 hover:bg-blue-200 dark:hover:bg-blue-800 transition-all duration-300">Tambah/Pilih</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-lg dark:bg-neutral-900/60 backdrop-blur-lg rounded-xl shadow-2xl p-6">
                            <DialogHeader>
                              <DialogTitle className="text-gray-800 dark:text-white">Pilih Mata Pelajaran</DialogTitle>
                              <DialogDescription className="text-gray-500 dark:text-gray-400">Centang untuk menambah, uncentang untuk menghapus.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-3">
                              <Input className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" placeholder="Cari mapel..." value={mapelSearch} onChange={(e)=>setMapelSearch(e.target.value)} />
                              <div className="max-h-60 overflow-auto rounded-md border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-gray-800 p-2">
                                {allMapel
                                  .filter(m=>m.toLowerCase().includes(mapelSearch.toLowerCase()))
                                  .map((m) => (
                                    <label key={m} className="flex items-center gap-2 py-1 text-gray-800 dark:text-white">
                                      <input
                                        type="checkbox"
                                        className="h-4 w-4 text-blue-500 focus:ring-blue-500"
                                        checked={mapel.includes(m)}
                                        onChange={(e)=> e.target.checked ? addMapel(m) : removeMapel(m)}
                                      />
                                      <span>{m}</span>
                                    </label>
                                  ))}
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300" onClick={()=>setMapelDialogOpen(false)}>Tutup</Button>
                                <Button className="bg-green-500 hover:bg-green-400 text-white transition-all duration-300 transform hover:scale-105" onClick={()=>setMapelDialogOpen(false)}>Simpan</Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                    <div className="grid gap-1.5"><Label className="text-gray-700 dark:text-gray-200">Total Jam Mengajar</Label><Input type="number" className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" defaultValue={profile.totalJam}/></div>
                  </div>

                  <div className="grid gap-1.5 mt-3">
                    <Label className="text-gray-700 dark:text-gray-200">Sekolah Saat Ini</Label>
                    <Input className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" defaultValue={profile.sekolahSaatIni}/>
                  </div>

                  <div className="mt-4">
                    <SectionTitle icon={Building2} title="Riwayat Mutasi (Rinci)" action={
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="default" size="sm" className="bg-blue-500 hover:bg-blue-400 text-white transition-all duration-300 transform hover:scale-105"><ArrowRightLeft className="h-4 w-4 mr-2"/>Ajukan Pindah Sekolah</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg dark:bg-neutral-900/60 backdrop-blur-lg rounded-xl shadow-2xl p-6">
                          <DialogHeader>
                            <DialogTitle className="text-gray-800 dark:text-white">Form Pengajuan Pindah Sekolah</DialogTitle>
                            <DialogDescription className="text-gray-500 dark:text-gray-400">Lengkapi detail mutasi untuk proses verifikasi oleh admin/dinas.</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-3">
                            <div className="grid gap-1.5"><Label className="text-gray-700 dark:text-gray-200">Sekolah Tujuan</Label><Input className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" placeholder="Contoh: SMPN 5 Bandung"/></div>
                            <div className="grid gap-1.5"><Label className="text-gray-700 dark:text-gray-200">Unit/Alamat Tujuan</Label><Input className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" placeholder="Jl. Contoh No. 1"/></div>
                            <div className="grid gap-1.5"><Label className="text-gray-700 dark:text-gray-200">Jabatan di Sekolah Tujuan</Label><Input className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" placeholder="Guru Mapel / Wali Kelas / Kepala Lab"/></div>
                            <div className="grid gap-1.5"><Label className="text-gray-700 dark:text-gray-200">TMT (Mulai Bertugas)</Label><Input type="date" className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500"/></div>
                            <div className="grid gap-1.5"><Label className="text-gray-700 dark:text-gray-200">Jenis Mutasi</Label>
                              <Select>
                                <SelectTrigger className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500"><SelectValue placeholder="Pilih jenis"/></SelectTrigger>
                                <SelectContent className="bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                                  <SelectItem value="mutasi">Mutasi</SelectItem>
                                  <SelectItem value="rotasi">Rotasi</SelectItem>
                                  <SelectItem value="promosi">Promosi</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid gap-1.5"><Label className="text-gray-700 dark:text-gray-200">Alasan</Label><Textarea className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" placeholder="Tulis alasan singkat" rows={3}/></div>
                            <div className="grid gap-1.5"><Label className="text-gray-700 dark:text-gray-200">Upload SK/Surat Rekomendasi</Label><Input type="file" accept="application/pdf,image/*" className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500"/></div>
                            <Button className="mt-2 bg-green-500 hover:bg-green-400 text-white transition-all duration-300 transform hover:scale-105"><CheckCircle2 className="h-4 w-4 mr-2"/>Kirim Pengajuan</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    } />

                    <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-gray-800 mt-3">
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-gray-100 dark:hover:bg-gray-700">
                            <TableHead className="text-gray-700 dark:text-gray-200">Sekolah</TableHead>
                            <TableHead className="text-gray-700 dark:text-gray-200">Unit</TableHead>
                            <TableHead className="text-gray-700 dark:text-gray-200">Jabatan</TableHead>
                            <TableHead className="text-gray-700 dark:text-gray-200">Mulai</TableHead>
                            <TableHead className="text-gray-700 dark:text-gray-200">Selesai</TableHead>
                            <TableHead className="text-gray-700 dark:text-gray-200">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {penugasanHistory.map((p)=> (
                            <TableRow key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                              <TableCell className="text-gray-800 dark:text-white">{p.sekolah}</TableCell>
                              <TableCell className="text-gray-800 dark:text-white">{p.unit}</TableCell>
                              <TableCell className="text-gray-800 dark:text-white">{p.jabatan}</TableCell>
                              <TableCell className="text-gray-800 dark:text-white">{new Date(p.tmtMulai).toLocaleDateString()}</TableCell>
                              <TableCell className="text-gray-800 dark:text-white">{p.tmtSelesai ? new Date(p.tmtSelesai).toLocaleDateString() : '-'}</TableCell>
                              <TableCell>
                                <Badge variant="secondary" className={`rounded-full border ${statusClass(p.status)}`}>{p.status}</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </section>

                {/* E. Tanda Tangan & Akun */}
                <section>
                  <SectionTitle icon={ShieldCheck} title="E. Tanda Tangan & Akun" />
                  <div className="grid md:grid-cols-1 gap-3">
                    <div className="grid gap-1.5"><Label className="text-gray-700 dark:text-gray-200">Upload TTD</Label><Input type="file" accept="image/*" className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500"/></div>
                    <div className="grid gap-1.5"><Label className="text-gray-700 dark:text-gray-200">Ganti Password (opsional)</Label><Input type="password" className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500" placeholder="••••••••"/></div>
                  </div>
                  <Button className="mt-3 bg-green-500 hover:bg-green-400 text-white transition-all duration-300 transform hover:scale-105"><CheckCircle2 className="h-4 w-4 mr-2"/>Simpan</Button>
                </section>

                {/* Dev Tests (simple runtime checks) */}
                <section>
                  <SectionTitle icon={Settings} title="Developer Tests (runtime)" />
                  <div className="flex flex-wrap gap-2 items-center">
                    <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300" onClick={()=>setMapel(["Bahasa Indonesia","Matematika","IPA","IPS","PPKn","Bahasa Inggris","Seni Budaya","PJOK"]) }>Set &gt; 6 mapel</Button>
                    <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300" onClick={()=>setMapel(["Bahasa Indonesia"]) }>Set 1 mapel</Button>
                    <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300" onClick={()=>setMapel([])}>Kosongkan mapel</Button>
                    <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300" onClick={()=>setMapel(allMapel.slice(0,6))}>Set 6 mapel</Button>
                    <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300" onClick={()=>setMapelExpanded(true)}>Expand chips</Button>
                    <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300" onClick={()=>setMapelExpanded(false)}>Collapse chips</Button>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">State: jumlah={mapel.length}, expanded={String(mapelExpanded)}</span>
                  </div>
                </section>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer tip */}
        {/* <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-6">UI demo • Integrasikan ke API Xpresensi untuk data real-time (jadwal, absensi, PR, rangkuman AI, dsb.)</div> */}
      </div>
    </div>
  );
}
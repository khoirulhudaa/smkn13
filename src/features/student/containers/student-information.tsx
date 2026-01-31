import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  createGmapUrl,
  dayjs,
  lang
} from "@/core/libs";
import { formatGender, getStaticFile } from "@/core/utils";
import { useAlert, useParamDecode } from "@/features/_global/hooks";
import { useAuth } from "@/features/auth";
import { useClassroom } from "@/features/classroom";
import { GENDER_OPTIONS, STATUS_OPTIONS, useUserCreation, useUserDetail } from "@/features/user";
import { useBiodata } from "@/features/user/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { debounce } from "lodash";
import {
  CalendarIcon,
  CheckIcon,
  IdCard,
  KeyIcon,
  LogInIcon,
  Mail,
  MapPin,
  PersonStanding,
  TabletSmartphone
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { EditableInfoItem, NonEditableInfoItem, StudentPhoto } from "../components";
import { useStudentDetail } from "../hooks";
import { studentEditSchema } from "../utils";

export interface StudentInformationProps {}

export const StudentInformation = () => {
  const { decodeParams } = useParamDecode();
  const navigate = useNavigate();
  const detail = useStudentDetail({ id: decodeParams?.id });
  const userDetail = useUserDetail(decodeParams?.biodataId);
  const classroom = useClassroom();
  const creation = useUserCreation();
  const auth = useAuth();
  const biodata = useBiodata();
  const alert = useAlert();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [initialValues, setInitialValues] = useState<z.infer<typeof studentEditSchema> | null>(null);

  // Validasi ID
  useEffect(() => {
    if (!decodeParams?.id || !decodeParams?.biodataId) {
      alert.error("ID siswa atau biodata tidak valid");
      navigate("/students");
    }
  }, [decodeParams?.id, decodeParams?.biodataId, alert, navigate]);

  const form = useForm<z.infer<typeof studentEditSchema>>({
    resolver: zodResolver(studentEditSchema),
    mode: "onChange",
    defaultValues: {
      kelasId: "",
      name: "",
      email: "",
      alamat: "",
      // hobi: "",
      jenisKelamin: "",
      tanggalLahir: "",
      rfid: "",
      nisn: "",
      nrk: "",
      nikki: "",
      nis: "",
      nip: "",
      nik: "",
      noTlp: "",
      isVerified: false,
      isActive: 0,
      sekolahId: 0,
    },
  });

  // Memoized options
  const genderOptions = useMemo(
    () => GENDER_OPTIONS.map(opt => ({ value: opt.label, label: opt.value })),
    []
  );

  const statusOptions = useMemo(
    () => STATUS_OPTIONS.map(opt => ({ value: opt.value, label: opt.label })),
    []
  );

  // const verificationOptions = useMemo(
  //   () => [
  //     { value: true, label: lang.text("isVerified") },
  //     { value: false, label: lang.text("isNotVerified") },
  //   ],
  //   []
  // );

  const classroomOptions = useMemo(
    () => classroom.data?.map(k => ({ value: String(k.id), label: k.namaKelas })) || [],
    [classroom.data]
  );

  // Memoized derived values
  const formattedGender = useMemo(
    () => formatGender(userDetail.data?.jenisKelamin),
    [userDetail.data?.jenisKelamin]
  );

  const formattedStatus = useMemo(
    () => (userDetail.data?.isActive === 2 ? lang.text("active") : lang.text("nonActive")),
    [userDetail.data?.isActive]
  );

  const formattedVerification = useMemo(
    () => (userDetail.data?.isVerified ? lang.text("isVerified") : lang.text("isNotVerified")),
    [userDetail.data?.isVerified]
  );

  // Deep comparison function
  const deepEqual = (obj1: any, obj2: any): boolean => {
    if (obj1 === obj2) return true;
    if (typeof obj1 !== "object" || obj1 === null || typeof obj2 !== "object" || obj2 === null) {
      return false;
    }
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) return false;
    for (const key of keys1) {
      if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
        return false;
      }
    }
    return true;
  };

  console.log('userDetail', userDetail)
  console.log('detail', detail)

  // Populate form and store initial values
  useEffect(() => {
    if (detail.data && userDetail.data && classroom.data && !isEditMode) {
      const validKelasId = detail.data?.idKelas && classroom.data.some(kelas => kelas.id === detail.data.idKelas)
        ? String(detail.data.idKelas)
        : classroom.data.length > 0 ? String(classroom.data[0].id) : "";

      const newValues = {
        kelasId: validKelasId,
        name: detail.data?.user?.name || userDetail.data?.name || "",
        email: userDetail.data?.email || "",
        alamat: userDetail.data?.alamat || "",
        hobi: userDetail.data?.hobi || "",
        jenisKelamin: userDetail.data?.jenisKelamin || "",
        tanggalLahir: userDetail.data?.tanggalLahir || "",
        rfid: userDetail.data?.rfid || "",
        nisn: userDetail.data?.nisn || "",
        nrk: userDetail.data?.nrk || "",
        nikki: userDetail.data?.nikki || "",
        nis: userDetail.data?.nis || "",
        nip: userDetail.data?.nip || "",
        nik: userDetail.data?.nik || "",
        noTlp: userDetail.data?.noTlp || "",
        isVerified: userDetail.data?.isVerified || false,
        isActive: userDetail.data?.isActive || 0,
        sekolahId: userDetail.data?.sekolahId || 0,
      };

      form.reset(newValues, { keepDirty: true });
      setInitialValues(newValues);
      setHasChanges(false);
    }
  }, [detail.data, userDetail.data, classroom.data, isEditMode, form]);

  // Optimized form.watch with debounce
  useEffect(() => {
    if (initialValues) {
      const subscription = form.watch(
        debounce((currentValues) => {
          const hasFormChanges = !deepEqual(currentValues, initialValues);
          setHasChanges(hasFormChanges);
        }, 300)
      );
      return () => subscription.unsubscribe();
    }
  }, [form, initialValues]);

  // Submit form function
  async function onSubmit(data: z.infer<typeof studentEditSchema>) {
    setIsSubmitting(true);
    try {
      if (!data.kelasId || !classroom.data?.some(kelas => String(kelas.id) === data.kelasId)) {
        alert.error("Kelas yang dipilih tidak valid");
        return;
      }

      const updatedData: any = {};
      if (data.name && data.name !== (detail.data?.user?.name || userDetail.data?.name)) {
        updatedData.name = data.name;
      }
      if (data.email && data.email !== userDetail.data?.email) updatedData.email = data.email;
      if (data.tanggalLahir && data.tanggalLahir !== userDetail.data?.tanggalLahir) updatedData.tanggalLahir = data.tanggalLahir;
      if (data.rfid && data.rfid !== userDetail.data?.rfid) updatedData.rfid = data.rfid;
      if (data.nisn && data.nisn !== userDetail.data?.nisn) updatedData.nisn = data.nisn;
      if (data.nrk && data.nrk !== userDetail.data?.nrk) updatedData.nrk = data.nrk;
      if (data.nikki && data.nikki !== userDetail.data?.nikki) updatedData.nikki = data.nikki;
      if (data.nis && data.nis !== userDetail.data?.nis) updatedData.nis = data.nis;
      if (data.nip && data.nip !== userDetail.data?.nip) updatedData.nip = data.nip;
      if (data.nik && data.nik !== userDetail.data?.nik) updatedData.nik = data.nik;
      if (data.noTlp && data.noTlp !== userDetail.data?.noTlp) updatedData.noTlp = data.noTlp;
      if (data.alamat && data.alamat !== userDetail.data?.alamat) updatedData.alamat = data.alamat;
      // if (data.hobi && data.hobi !== userDetail.data?.hobi) updatedData.hobi = data.hobi;
      if (data.isActive !== undefined && data.isActive !== userDetail.data?.isActive) updatedData.isActive = data.isActive;
      if (data.sekolahId !== undefined && data.sekolahId !== userDetail.data?.sekolahId) updatedData.sekolahId = data.sekolahId;
      if (data.jenisKelamin && data.jenisKelamin !== userDetail.data?.jenisKelamin) updatedData.jenisKelamin = data.jenisKelamin;
      if (data.isVerified !== undefined) {
            // Konversi userDetail.data?.isVerified ke boolean untuk perbandingan
            const serverIsVerified = userDetail.data?.isVerified === true || userDetail.data?.isVerified === 1 || userDetail.data?.isVerified === "1";
            if (data.isVerified !== serverIsVerified) {
              updatedData.isVerified = data.isVerified; // Kirim true/false langsung
        }
      }      
      updatedData.kelasId = Number(data.kelasId);
      console.log("Data yang dikirim saat submit:", updatedData);

      await creation.update(decodeParams?.biodataId!, updatedData);
      setIsEditMode(false);
      alert.success(lang.text("successUpdate", { context: lang.text("student") }));
      setIsSubmitting(false);
      await Promise.all([
        biodata.query.refetch(),
        detail.query.refetch(),
        userDetail.query.refetch(),
      ]);
      setHasChanges(false);
    } catch (err: any) {
      alert.error(
        err?.message || lang.text("failUpdate", { context: lang.text("student") })
      );
    } 
  }

  const handleResetPasswordDefault = async () => {
    try {
      // Validasi userId
      const userIdRaw = detail?.data?.userId || detail?.data?.user?.id;
      if (!userIdRaw) {
        alert.error(lang.text('failedResetPass'));
        return { success: false, message: 'User ID tidak ditemukan' };
      }

      const userIdParam = String(userIdRaw); // API mungkin mengharapkan string di path

      // Panggil fungsi reset password
      await auth.resetPasswordDefault(userIdParam);
      alert.success(lang.text('successResetPass')); // Pastikan pesan ini juga diterjemahkan
      return
    } catch (error) {
      // Tangani error dengan pesan yang lebih spesifik
      const errorMessage = error?.message || lang.text('failedResetPass');
      alert.error(errorMessage);
      console.error('Gagal mereset password:', error);
      return 
    }
  };

  // Loading dan error state
  if (detail.isLoading || userDetail.isLoading || classroom.isLoading) {
    return <div>Memuat...</div>;
  }

  if (detail.isError || userDetail.isError || classroom.isError) {
    return <div>Gagal memuat data</div>;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        <div>
          <StudentPhoto
            title={detail.data?.user?.name || "-"}
            image={getStaticFile(String(detail.data?.user?.image))}
          />
        </div>
        <div className="md:col-span-2 lg:col-span-3">
          <Card className="w-full">
            <CardHeader className="border-b border-white/10 mb-6 flex flex-row items-center justify-between">
              <div className="flex items-center gap-4">
                {isEditMode ? (
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Masukkan nama siswa"
                            className="text-lg font-semibold"
                          />
                        </FormControl>
                        <FormMessage>{fieldState.error?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                ) : (
                  <CardTitle className="border border-white/10 px-4 py-3 rounded-md">{detail.data?.user?.name}</CardTitle>
                )}
                {isEditMode ? (
                  <FormField
                    control={form.control}
                    name="nis"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Masukkan NIS"
                            className="text-sm text-gray-500"
                          />
                        </FormControl>
                        <FormMessage>{fieldState.error?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                ) : (
                  <CardDescription>{`NIS: ${detail?.data?.user?.nis || "-"}`}</CardDescription>
                )}
              </div>
              <div className="flex gap-2">
                {isEditMode ? (
                  <>
                    <Button
                      type="button"
                      size="sm"
                      className="border-blue-500 text-blue-300 active:scale-[0.99]"
                      variant={'outline'}
                      onClick={() => handleResetPasswordDefault()}
                    >
                      {lang.text('resetPassword')}
                      <KeyIcon />
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={isSubmitting || !hasChanges}
                    >
                      {isSubmitting ? lang.text("saving") : lang.text("save")}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isSubmitting}
                      onClick={() => {
                        if (hasChanges && window.confirm("Perubahan belum disimpan. Yakin ingin membatalkan?")) {
                          form.reset();
                          setIsEditMode(false);
                          setHasChanges(false);
                        } else if (!hasChanges) {
                          setIsEditMode(false);
                        }
                      }}
                    >
                      {lang.text("cancel")}
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    size="lg"
                    onClick={() => setIsEditMode(true)}
                  >
                    {lang.text("edit")}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {isEditMode && (
                  <EditableInfoItem
                    control={form.control}
                    icon={<IdCard size={24} />}
                    label={lang.text("classRoom")}
                    value={classroom.data?.find(k => k.id === Number(form.getValues("kelasId")))?.namaKelas}
                    name="kelasId"
                    type="select"
                    options={classroomOptions}
                    isEditMode={isEditMode}
                  />
                )}
                {!isEditMode && (
                  <NonEditableInfoItem
                    icon={<IdCard size={24} />}
                    label={lang.text("classRoom")}
                    value={detail.data?.kelas?.namaKelas}
                    isEditMode={isEditMode}
                  />
                )}
                <EditableInfoItem
                  control={form.control}
                  icon={<IdCard size={24} />}
                  label="NISN"
                  value={userDetail.data?.nisn}
                  name="nisn"
                  isEditMode={isEditMode}
                />
                <EditableInfoItem
                  control={form.control}
                  icon={<Mail size={24} />}
                  label="Email"
                  value={userDetail.data?.email}
                  name="email"
                  type="email"
                  isEditMode={isEditMode}
                />
                <NonEditableInfoItem
                  icon={<Mail size={24} />}
                  label={lang.text("school")}
                  value={detail.data?.user?.sekolah?.namaSekolah}
                  isEditMode={isEditMode}
                />
                <EditableInfoItem
                  control={form.control}
                  icon={<MapPin size={24} />}
                  label={lang.text("address")}
                  value={userDetail.data?.alamat}
                  name="alamat"
                  isEditMode={isEditMode}
                />
                {/* <EditableInfoItem
                  control={form.control}
                  icon={<Heart size={24} />}
                  label={lang.text("hobby")}
                  value={userDetail.data?.hobi}
                  name="hobi"
                  isEditMode={isEditMode}
                /> */}
                <EditableInfoItem
                  control={form.control}
                  icon={<PersonStanding size={24} />}
                  label={lang.text("gender")}
                  value={formattedGender}
                  name="jenisKelamin"
                  type="select"
                  options={genderOptions}
                  isEditMode={isEditMode}
                />
                <EditableInfoItem
                  control={form.control}
                  icon={<CheckIcon size={24} />}
                  label={lang.text("status")}
                  value={formattedStatus}
                  name="isActive"
                  type="select"
                  options={statusOptions}
                  isEditMode={isEditMode}
                />
                <NonEditableInfoItem
                  icon={<LogInIcon size={24} />}
                  label={lang.text("lastLogin")}
                  value={dayjs(userDetail.data?.lastLogin).format("HH:mm, DD MMM YYYY")}
                  isEditMode={isEditMode}
                />
                {/* <EditableInfoItem
                  control={form.control}
                  icon={<VerifiedIcon size={24} />}
                  label={lang.text("verificationStatus")}
                  value={formattedVerification}
                  name="isVerified"
                  type="select"
                  options={verificationOptions}
                  isEditMode={isEditMode}
                /> */}
                <EditableInfoItem
                  control={form.control}
                  icon={<TabletSmartphone size={24} />}
                  label={lang.text("deviceId")}
                  value={userDetail.data?.noTlp}
                  name="noTlp"
                  isEditMode={isEditMode}
                />
                <EditableInfoItem
                  control={form.control}
                  icon={<IdCard size={24} />}
                  label="RFID"
                  value={userDetail.data?.rfid}
                  name="rfid"
                  isEditMode={isEditMode}
                />
                <EditableInfoItem
                  control={form.control}
                  icon={<CalendarIcon size={24} />}
                  label={lang.text("dateOfBirth")}
                  value={userDetail.data?.tanggalLahir}
                  name="tanggalLahir"
                  type="date"
                  isEditMode={isEditMode}
                />
                <NonEditableInfoItem
                  icon={<MapPin size={24} />}
                  label={lang.text("lastLocation")}
                  renderValue={
                    detail.data?.location ? (
                      <Link
                        to={createGmapUrl(detail.data.location.latitude, detail.data.location.longitude)}
                        target="_blank"
                      >
                        {lang.text("seeOnMap")}
                      </Link>
                    ) : "-"
                  }
                  isEditMode={isEditMode}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </Form>
  );
};
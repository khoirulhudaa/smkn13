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
  dayjs,
  lang
} from "@/core/libs";
import { formatGender, getStaticFile } from "@/core/utils";
import { useAlert } from "@/features/_global/hooks";
import { useAuth } from "@/features/auth";
import { GENDER_OPTIONS, STATUS_OPTIONS, useUserCreation } from "@/features/user";
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
import { z } from "zod";
import { EditableInfoItem, NonEditableInfoItem, StudentPhoto } from "../components";
import { useProfile } from "../hooks";
import { studentEditSchema } from "../utils";

export interface StudentInformationProps {}

export const StudentInformation = () => {
  const profile = useProfile();
  const creation = useUserCreation();
  const auth = useAuth();
  const biodata = useBiodata();
  const alert = useAlert();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [initialValues, setInitialValues] = useState<z.infer<typeof studentEditSchema> | null>(null);

  const form = useForm<z.infer<typeof studentEditSchema>>({
    resolver: zodResolver(studentEditSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      alamat: "",
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

  // Log form errors for debugging
  const { formState: { errors } } = form;
  useEffect(() => {
    console.log("Form errors:", errors);
  }, [errors]);

  // Log profile data for debugging
  useEffect(() => {
    console.log("Profile data:", profile?.user);
  }, [profile?.user]);

  // Memoized options
  const genderOptions = useMemo(
    () => GENDER_OPTIONS.map(opt => ({ value: opt.label, label: opt.value })),
    []
  );

  const statusOptions = useMemo(
    () => STATUS_OPTIONS.map(opt => ({ value: opt.value, label: opt.label })),
    []
  );

  // Memoized derived values
  const formattedGender = useMemo(
    () => formatGender(profile?.user?.jenisKelamin),
    [profile?.user?.jenisKelamin]
  );

  const formattedStatus = useMemo(
    () => (profile?.user?.isActive === 2 ? lang.text("active") : lang.text("nonActive")),
    [profile?.user?.isActive]
  );

  const formattedVerification = useMemo(
    () => (profile?.user?.isVerified ? lang.text("isVerified") : lang.text("isNotVerified")),
    [profile?.user?.isVerified]
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

  // Populate form and store initial values
  useEffect(() => {
    if (profile?.user && !isEditMode) {
      const newValues = {
        name: profile.user.name || "",
        email: profile.user.email || "",
        alamat: profile.user.alamat || "",
        jenisKelamin: profile.user.jenisKelamin || "",
        tanggalLahir: profile.user.tanggalLahir || "",
        rfid: profile.user.rfid || "",
        nisn: profile.user.nisn || "",
        nrk: profile.user.nrk || "",
        nikki: profile.user.nikki || "",
        nis: profile.user.nis || "",
        nip: profile.user.nip || "",
        nik: profile.user.nik || "",
        noTlp: profile.user.noTlp || "",
        isVerified: profile.user.isVerified || false,
        isActive: profile.user.isActive || 0,
        sekolahId: profile.user.sekolahId || 0,
      };

      form.reset(newValues, { keepDirty: true });
      setInitialValues(newValues);
      setHasChanges(false);
    }
  }, [profile?.user, isEditMode, form]);

  // Optimized form.watch with debounce
  useEffect(() => {
    if (initialValues) {
      const subscription = form.watch(
        debounce((currentValues) => {
          const hasFormChanges = !deepEqual(currentValues, initialValues);
          console.log("Current values:", currentValues, "Has changes:", hasFormChanges);
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
      const updatedData: any = {};
      if (data.name && data.name !== profile?.user?.name) updatedData.name = data.name;
      if (data.email && data.email !== profile?.user?.email) updatedData.email = data.email;
      if (data.tanggalLahir && data.tanggalLahir !== profile?.user?.tanggalLahir) updatedData.tanggalLahir = data.tanggalLahir;
      if (data.rfid && data.rfid !== profile?.user?.rfid) updatedData.rfid = data.rfid;
      if (data.nisn && data.nisn !== profile?.user?.nisn) updatedData.nisn = data.nisn;
      if (data.nrk && data.nrk !== profile?.user?.nrk) updatedData.nrk = data.nrk;
      if (data.nikki && data.nikki !== profile?.user?.nikki) updatedData.nikki = data.nikki;
      if (data.nis && data.nis !== profile?.user?.nis) updatedData.nis = data.nis;
      if (data.nip && data.nip !== profile?.user?.nip) updatedData.nip = data.nip;
      if (data.nik && data.nik !== profile?.user?.nik) updatedData.nik = data.nik;
      if (data.noTlp && data.noTlp !== profile?.user?.noTlp) updatedData.noTlp = data.noTlp;
      if (data.alamat && data.alamat !== profile?.user?.alamat) updatedData.alamat = data.alamat;
      if (data.isActive !== undefined && data.isActive !== profile?.user?.isActive) updatedData.isActive = data.isActive;
      if (data.sekolahId !== undefined && data.sekolahId !== profile?.user?.sekolahId) updatedData.sekolahId = data.sekolahId;
      if (data.jenisKelamin && data.jenisKelamin !== profile?.user?.jenisKelamin) updatedData.jenisKelamin = data.jenisKelamin;
      if (data.isVerified !== undefined) {
        const serverIsVerified = profile?.user?.isVerified === true || profile?.user?.isVerified === 1 || profile?.user?.isVerified === "1";
        if (data.isVerified !== serverIsVerified) {
          updatedData.isVerified = data.isVerified;
        }
      }

      console.log("Data yang dikirim saat submit:", updatedData);

      // Assuming biodataId is profile?.user?.id
      await creation.update(profile?.user?.id!, updatedData);
      setIsEditMode(false);
      alert.success(lang.text("successUpdate", { context: lang.text("student") }));
      setIsSubmitting(false);
      await Promise.all([
        biodata.query.refetch(),
        profile.query.refetch(),
      ]);
      setHasChanges(false);
    } catch (err: any) {
      alert.error(
        err?.message || lang.text("failUpdate", { context: lang.text("student") })
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleResetPasswordDefault = async () => {
    try {
      const userIdRaw = profile?.user?.id;
      if (!userIdRaw) {
        alert.error(lang.text('failedResetPass'));
        return { success: false, message: 'User ID tidak ditemukan' };
      }

      const userIdParam = String(userIdRaw);
      await auth.resetPasswordDefault(userIdParam);
      alert.success(lang.text('successResetPass'));
      return;
    } catch (error) {
      const errorMessage = error?.message || lang.text('failedResetPass');
      alert.error(errorMessage);
      console.error('Gagal mereset password:', error);
      return;
    }
  }

  // Loading and error state
  if (profile.isLoading) {
    return <div>Memuat...</div>;
  }

  if (profile.isError) {
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
            title={profile?.user?.name || "-"}
            image={profile?.user?.image?.includes('uploads') ? `https://dev.kiraproject.id${profile?.user?.image}` : getStaticFile(String(profile?.user?.image))}
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
                  <CardTitle className="border border-white/10 px-4 py-3 rounded-md">{profile?.user?.name}</CardTitle>
                )}
                {isEditMode ? (
                  <FormField
                    control={form.control}
                    name="nip"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Masukkan NIP"
                            className="text-sm text-gray-500"
                          />
                        </FormControl>
                        <FormMessage>{fieldState.error?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                ) : (
                  <CardDescription>{`NIP: ${profile?.user?.nip || "-"}`}</CardDescription>
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
                      onClick={() => console.log("Submit button clicked")}
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
                <EditableInfoItem
                  control={form.control}
                  icon={<IdCard size={24} />}
                  label="NRK"
                  value={profile?.user?.nrk}
                  name="nrk"
                  isEditMode={isEditMode}
                />
                <EditableInfoItem
                  control={form.control}
                  icon={<Mail size={24} />}
                  label="Email"
                  value={profile?.user?.email}
                  name="email"
                  type="email"
                  isEditMode={isEditMode}
                />
                <NonEditableInfoItem
                  icon={<Mail size={24} />}
                  label={lang.text("school")}
                  value={profile?.user?.sekolah?.namaSekolah}
                  isEditMode={isEditMode}
                />
                <EditableInfoItem
                  control={form.control}
                  icon={<MapPin size={24} />}
                  label={lang.text("address")}
                  value={profile?.user?.alamat}
                  name="alamat"
                  isEditMode={isEditMode}
                />
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
                  value={dayjs(profile?.user?.lastLogin).format("HH:mm, DD MMM YYYY")}
                  isEditMode={isEditMode}
                />
                <EditableInfoItem
                  control={form.control}
                  icon={<TabletSmartphone size={24} />}
                  label={lang.text("deviceId")}
                  value={profile?.user?.noTlp}
                  name="noTlp"
                  isEditMode={isEditMode}
                />
                <EditableInfoItem
                  control={form.control}
                  icon={<IdCard size={24} />}
                  label="RFID"
                  value={profile?.user?.rfid}
                  name="rfid"
                  isEditMode={isEditMode}
                />
                <EditableInfoItem
                  control={form.control}
                  icon={<CalendarIcon size={24} />}
                  label={lang.text("dateOfBirth")}
                  value={profile?.user?.tanggalLahir}
                  name="tanggalLahir"
                  type="date"
                  isEditMode={isEditMode}
                />
                <NonEditableInfoItem
                  icon={<MapPin size={24} />}
                  label={lang.text("lastLocation")}
                  value={"-"} // No location in profile?.user
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

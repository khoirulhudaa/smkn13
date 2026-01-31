import {
  Badge,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  lang,
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
  TableRow
} from "@/core/libs";
import { useAlert, useVokadialog, Vokadialog } from "@/features/_global";
import { useCourse } from "@/features/course";
import { useBiodataGuru } from "@/features/user";
import { Download, Pen, Plus, School2, Trash, UploadCloud } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { useScheduleCreation, useSchedules } from "../hooks";
import { useClassroom } from "@/features/classroom";
import { FaFileExcel } from "react-icons/fa";

interface ScheduleItem {
  id: number;
  hari: string;
  jamMulai: string;
  jamSelesai: string;
  mataPelajaran: {
    id: number;
    namaMataPelajaran: string;
    kelasId: number;
    kelas: { id: number; namaKelas: string } | null;
  };
  guru: { id: number; namaGuru: string };
  createdAt: string;
  updatedAt: string;
}

interface NewScheduleForm {
  mataPelajaranId: number;
  guruId: number;
  hari: string;
  jamMulai: string;
  jamSelesai: string;
}

interface BulkSchedule {
  namaKelas: string;
  namaMataPelajaran: string;
  namaGuru: string;
  hari: string;
  jamMulai: string;
  jamSelesai: string;
}

const daysOrder = ["SENIN", "SELASA", "RABU", "KAMIS", "JUMAT"];

export function ScheduleLandingContent() {
  const alert = useAlert();
  const creation = useScheduleCreation();
  const dialog = useVokadialog();
  const showRef = useRef<typeof dialog.open>();
  showRef.current = dialog.open;
  const [id, setId] = useState<number>(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [editScheduleId, setEditScheduleId] = useState<number>(0);
  const [searchCourse, setSearchCourse] = useState<string>("");
  const [searchTeacher, setSearchTeacher] = useState<string>("");
  const [selectedClassId, setSelectedClassId] = useState<number>(0); // 0 for All Classes
  const [selectedDays, setSelectedDays] = useState<string[]>(daysOrder); // Default to all days
  const [isDayFilterOpen, setIsDayFilterOpen] = useState(false);
  const [selectedKelasIdForAdd, setSelectedKelasIdForAdd] = useState<number>(0); // 0 for no class selected in add modal
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const teacherSearchInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<NewScheduleForm>({
    mataPelajaranId: 0,
    guruId: 0,
    hari: "",
    jamMulai: "",
    jamSelesai: "",
  });

  const courses = useCourse();
  const teachers = useBiodataGuru();
  const schedules = useSchedules();
  const listClass = useClassroom()

  console.log('classs', listClass?.data)
  console.log('courses', courses?.data)

  // Derive classes from schedules.data
  const classes = useMemo(() => {
    if (!schedules?.data) return [];
    const kelasSet = new Map<number, { id: number; namaKelas: string }>();
    Object.keys(schedules.data).forEach((day) => {
      schedules?.data[day].forEach((schedule: ScheduleItem) => {
        const { kelas } = schedule.mataPelajaran;
        if (kelas && kelas.id != null && kelas.namaKelas) {
          if (!kelasSet.has(kelas.id)) {
            kelasSet.set(kelas.id, { id: kelas.id, namaKelas: kelas.namaKelas });
          }
        }
      });
    });
    return Array.from(kelasSet.values());
  }, [schedules?.data]);

  // Memoize filtered courses
  const filteredCourses = useMemo(() => {
    let filtered = courses?.data?.filter((course: any) =>
      course.namaMataPelajaran.toLowerCase().includes(searchCourse.toLowerCase())
    ) || [];
    
    // When adding a schedule, further filter by selectedKelasIdForAdd
    if (isAddModalOpen && selectedKelasIdForAdd !== 0) {
      filtered = filtered.filter((course: any) => course.kelasId === selectedKelasIdForAdd);
    }
    
    return filtered;
  }, [courses?.data, searchCourse, isAddModalOpen, selectedKelasIdForAdd]);

  // Memoize filtered teachers
  const filteredTeachers = useMemo(() => {
    return (
      teachers?.data?.filter((teacher: any) =>
        teacher.namaGuru.toLowerCase().includes(searchTeacher.toLowerCase())
      ) || []
    );
  }, [teachers?.data, searchTeacher]);

  // Group data by kelasId and then by day
  const groupedByClassAndDay = useMemo(() => {
    const result: Record<number, Record<string, ScheduleItem[]>> = {};

    if (schedules?.data) {
      // Normalize day keys to uppercase
      const normalizeDay = (day: string) => day.toUpperCase();

      // Collect all unique kelasId
      const kelasIds = new Set<number>();
      Object.keys(schedules.data).forEach((day) => {
        schedules.data[day].forEach((schedule: ScheduleItem) => {
          kelasIds.add(schedule.mataPelajaran.kelasId);
        });
      });

      // Initialize result for all kelasId and days
      kelasIds.forEach((kelasId) => {
        result[kelasId] = daysOrder.reduce((acc, d) => {
          acc[d] = [];
          return acc;
        }, {} as Record<string, ScheduleItem[]>);
      });

      // Populate schedules
      Object.keys(schedules.data).forEach((day) => {
        const normalizedDay = normalizeDay(day);
        if (daysOrder.includes(normalizedDay)) {
          schedules.data[day].forEach((schedule: ScheduleItem) => {
            const kelasId = schedule.mataPelajaran.kelasId;
            if (result[kelasId]) {
              result[kelasId][normalizedDay].push(schedule);
            }
          });
        }
      });

      // Sort schedules by jamMulai
      Object.keys(result).forEach((kelasId) => {
        daysOrder.forEach((day) => {
          result[kelasId][day].sort((a, b) => {
            const timeA = new Date(`1970-01-01T${a.jamMulai}:00`);
            const timeB = new Date(`1970-01-01T${b.jamMulai}:00`);
            return timeA.getTime() - timeB.getTime();
          });
        });
      });
    }

    return result;
  }, [schedules?.data]);

  // Download Excel template
  const handleDownloadTemplate = () => {
    try {
      const link = document.createElement("a");
      link.href = "/template_jadwal_mapel.xlsx";
      link.download = "template_jadwal_mapel.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      alert.success("Template Excel berhasil diunduh");
    } catch (err: any) {
      alert.error("Gagal mengunduh template Excel: " + (err.message || "Unknown error"));
    }
  };

  // Handle Excel file upload
  const handleUploadExcel = async () => {
    if (!excelFile) {
      alert.error("Pilih file Excel terlebih dahulu");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array", cellDates: true }); // Pastikan parse sebagai Date
        const sheet = workbook.Sheets["Schedules"];
        if (!sheet) {
          alert.error("Sheet 'Schedules' tidak ditemukan");
          return;
        }

        const jsonData: any[] = XLSX.utils.sheet_to_json(sheet);
        if (jsonData.length === 0) {
          alert.error("File Excel kosong");
          return;
        }

        // Validate data
        const validSchedules: NewScheduleForm[] = [];
        const errors: string[] = [];
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        const validDays = daysOrder;

        jsonData.forEach((row: any, index: number) => {
          // Konversi jamMulai dan jamSelesai ke format HH:mm
          const formatTime = (value: any) => {
            if (value instanceof Date) {
              const hours = value.getHours().toString().padStart(2, '0');
              const minutes = value.getMinutes().toString().padStart(2, '0');
              return `${hours}:${minutes}`;
            }
            return value?.toString().trim() || "";
          };

          const schedule: BulkSchedule = {
            namaKelas: row.namaKelas?.toString().trim() || "",
            namaMataPelajaran: row.namaMataPelajaran?.toString().trim() || "",
            namaGuru: row.namaGuru?.toString().trim() || "",
            hari: row.hari?.toString().trim() || "",
            jamMulai: formatTime(row.jamMulai),
            jamSelesai: formatTime(row.jamSelesai),
          };

          console.log('schedule saat ini:', schedule);

          // Validate required fields, excluding "Catatan"
          if (
            !schedule.namaKelas ||
            !schedule.namaMataPelajaran ||
            !schedule.namaGuru ||
            !schedule.hari ||
            !schedule.jamMulai ||
            !schedule.jamSelesai
          ) {
            errors.push(`Baris ${index + 2}: Semua kolom wajib diisi (kecuali Catatan). Data: ${JSON.stringify(schedule)}`);
            return;
          }

          // Validate namaKelas
          const kelas = listClass?.data.find((k: any) =>
            k.namaKelas.toLowerCase() === schedule.namaKelas.toLowerCase()
          );
          if (!kelas) {
            errors.push(`Baris ${index + 2}: Nama kelas '${schedule.namaKelas}' tidak valid`);
            return;
          }

          // Validate namaMataPelajaran and kelas match
          const course = courses.data?.find((c: any) =>
            c.namaMataPelajaran.toLowerCase() === schedule.namaMataPelajaran.toLowerCase() &&
            c.kelasId === kelas.id
          );
          if (!course) {
            errors.push(`Baris ${index + 2}: Mata pelajaran '${schedule.namaMataPelajaran}' tidak valid atau tidak sesuai dengan kelas '${schedule.namaKelas}'`);
            return;
          }

          // Validate namaGuru
          const teacher = teachers.data?.find((t: any) =>
            t.namaGuru.toLowerCase() === schedule.namaGuru.toLowerCase()
          );
          if (!teacher) {
            errors.push(`Baris ${index + 2}: Nama guru '${schedule.namaGuru}' tidak valid`);
            return;
          }

          // Validate hari
          if (!validDays.includes(schedule.hari.toUpperCase())) {
            errors.push(`Baris ${index + 2}: Hari tidak valid (gunakan: ${validDays.join(", ")})`);
            return;
          }

          // Validate time format
          if (!timeRegex.test(schedule.jamMulai) || !timeRegex.test(schedule.jamSelesai)) {
            errors.push(`Baris ${index + 2}: Format waktu harus HH:mm (contoh: 08:00). Data: ${schedule.jamMulai}, ${schedule.jamSelesai}`);
            return;
          }

          // Validate jamSelesai > jamMulai
          const startTime = new Date(`1970-01-01T${schedule.jamMulai}:00`);
          const endTime = new Date(`1970-01-01T${schedule.jamSelesai}:00`);
          if (endTime <= startTime) {
            errors.push(`Baris ${index + 2}: Jam selesai harus setelah jam mulai`);
            return;
          }

          // Add to valid schedules
          validSchedules.push({
            mataPelajaranId: course.id,
            guruId: teacher.id,
            hari: schedule.hari.toUpperCase(),
            jamMulai: schedule.jamMulai,
            jamSelesai: schedule.jamSelesai,
          });
        });

        if (errors.length > 0) {
          alert.error(`Validasi gagal:\n${errors.join("\n")}`);
          return;
        }

        if (validSchedules.length === 0) {
          alert.error("Tidak ada data valid untuk diunggah");
          return;
        }

        // Kirim data ke API secara bertahap
        let successCount = 0;
        let errorCount = 0;

        for (const item of validSchedules) {
          try {
            await creation.create(item);
            successCount++;
          } catch (err: any) {
            console.error(`Gagal mengirim: ${item.mataPelajaranId}`, err);
            errorCount++;
          }
        }

        setIsUploadModalOpen(false);
        setExcelFile(null);

        if (successCount > 0) {
          alert.success(
            lang.text("successful", {
              context: `Membuat ( ${successCount} jadwal) dan gagal( ${errorCount} jadwal)`,
            })
          );
          schedules.query.refetch();
        }

        if (errorCount > 0) {
          alert.error(
            lang.text("failed", {
              context: `Membuat (${successCount} jadwal) dan gagal (${errorCount} jadwal)`,
            })
          );
        }
      };
      reader.readAsArrayBuffer(excelFile);
    } catch (err: any) {
      alert.error("Gagal memproses file Excel: " + (err.message || "Unknown error"));
    }
  };

  // Restore focus to course search input
  useEffect(() => {
    if (searchInputRef.current && document.activeElement !== searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchCourse]);

  // Restore focus to teacher search input
  useEffect(() => {
    if (teacherSearchInputRef.current && document.activeElement !== teacherSearchInputRef.current) {
      teacherSearchInputRef.current.focus();
    }
  }, [searchTeacher]);

  // Handle keydown to prevent focus shift
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["ArrowDown", "ArrowUp", "Enter"].includes(e.key)) {
      e.preventDefault();
    }
  };

  // Handle day checkbox toggle
  const handleDayToggle = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  // Handle "All Days" checkbox toggle
  const handleAllDaysToggle = () => {
    setSelectedDays((prev) => (prev.length === daysOrder.length ? [] : [...daysOrder]));
  };

  const handleConfirmDelete = async () => {
    if (id === 0) {
      alert.error("Anda perlu ID");
      return;
    }
    try {
      await creation.delete(id);
      alert.success(
        lang.text("successful", {
          context: lang.text("dataSuccessDelete", { context: "" }),
        })
      );
      schedules.query.refetch();
      dialog.close();
    } catch (err: any) {
      alert.error("Error deleting schedule:", err);
      alert.error(
        err?.message ||
          lang.text("failed", {
            context: lang.text("dataFailDelete", { context: "" }),
          })
      );
    }
  };

  const handleAddSchedule = async () => {
    if (
      !formData.mataPelajaranId ||
      !formData.guruId ||
      !formData.hari ||
      !formData.jamMulai ||
      !formData.jamSelesai
    ) {
      alert.error("Semua field harus diisi");
      return;
    }

    if (selectedKelasIdForAdd === 0) {
      alert.error("Pilih kelas terlebih dahulu");
      return;
    }

    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(formData.jamMulai) || !timeRegex.test(formData.jamSelesai)) {
      alert.error("Format waktu harus HH:mm (contoh: 08:40)");
      return;
    }

    const startTime = new Date(`1970-01-01T${formData.jamMulai}:00`);
    const endTime = new Date(`1970-01-01T${formData.jamSelesai}:00`);
    if (endTime <= startTime) {
      alert.error("Jam selesai harus setelah jam mulai");
      return;
    }

    const payload = { ...formData };
    try {
      await creation.create(payload);
      alert.success(
        lang.text("successful", {
          context: lang.text("scheduleSuccessCreate", { context: "" }),
        })
      );
      schedules.query.refetch();
      setIsAddModalOpen(false);
      setFormData({
        mataPelajaranId: 0,
        guruId: 0,
        hari: "",
        jamMulai: "",
        jamSelesai: "",
      });
      setSearchCourse("");
      setSearchTeacher("");
      setSelectedKelasIdForAdd(0);
    } catch (err: any) {
      alert.error(
        err?.message ||
          lang.text("failed", {
            context: lang.text("scheduleFailCreate", { context: "" }),
          })
      );
    }
  };

  const handleEditSchedule = async () => {
    if (
      !formData.mataPelajaranId ||
      !formData.guruId ||
      !formData.hari ||
      !formData.jamMulai ||
      !formData.jamSelesai
    ) {
      alert.error("Semua field harus diisi");
      return;
    }

    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(formData.jamMulai) || !timeRegex.test(formData.jamSelesai)) {
      alert.error("Format waktu harus HH:mm (contoh: 08:40)");
      return;
    }

    const startTime = new Date(`1970-01-01T${formData.jamMulai}:00`);
    const endTime = new Date(`1970-01-01T${formData.jamSelesai}:00`);
    if (endTime <= startTime) {
      alert.error("Jam selesai harus setelah jam mulai");
      return;
    }

    const payload = { ...formData };
    try {
      await creation.update(editScheduleId, payload);
      alert.success(
        lang.text("successful", {
          context: lang.text("scheduleSuccessUpdate", { context: "" }),
        })
      );
      schedules.query.refetch();
      setIsEditModalOpen(false);
      setFormData({
        mataPelajaranId: 0,
        guruId: 0,
        hari: "",
        jamMulai: "",
        jamSelesai: "",
      });
      setSearchCourse("");
      setSearchTeacher("");
    } catch (err: any) {
      alert.error(
        err?.message ||
          lang.text("failed", {
            context: lang.text("scheduleFailUpdate", { context: "" }),
          })
      );
    }
  };

  const openAddModal = () => {
    setSelectedDay("");
    setFormData({
      mataPelajaranId: 0,
      guruId: 0,
      hari: "",
      jamMulai: "",
      jamSelesai: "",
    });
    setSearchCourse("");
    setSearchTeacher("");
    setSelectedKelasIdForAdd(0);
    setIsAddModalOpen(true);
  };

  const openEditModal = (day: string, schedule: ScheduleItem) => {
    setSelectedDay(day);
    setEditScheduleId(schedule.id);
    setFormData({
      mataPelajaranId: schedule.mataPelajaran.id || 0,
      guruId: schedule.guru.id || 0,
      hari: day,
      jamMulai: schedule.jamMulai,
      jamSelesai: schedule.jamSelesai,
    });
    setSearchCourse("");
    setSearchTeacher("");
    setIsEditModalOpen(true);
  };

  // Render loading state
  if (!schedules?.data || schedules.isLoading) {
    return (
      <div className="w-full h-[400px] border-dashed border-black/10 rounded-md flex items-center justify-center text-center">
        <p className="text-center">{lang.text("loadingScheduleMapel")}</p>
      </div>
    );
  }

  const dayMap = {
    'SENIN': 'senin',
    'SELASA': 'selasa',
    'RABU': 'rabu',
    'KAMIS': 'kamis',
    'JUMAT': 'jumat',
  };

  return (
    <>
      <Vokadialog
        visible={dialog.visible}
        title={'test test'}
        content={lang.text("deleteConfirmationDesc", { context: "tersebut" })}
        footer={
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={handleConfirmDelete} variant="destructive">
              {lang.text("delete")}
            </Button>
            <Button onClick={dialog.close} variant="outline">
              {lang.text("cancel")}
            </Button>
          </div>
        }
      />

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{lang.text('createSchedule')}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="kelasId">Kelas</label>
              <Select
                onValueChange={(value) => setSelectedKelasIdForAdd(parseInt(value))}
                value={selectedKelasIdForAdd === 0 ? "" : selectedKelasIdForAdd.toString()}
              >
                <SelectTrigger>
                  <SelectValue placeholder={lang.text('selectClassroom')} />
                </SelectTrigger>
                <SelectContent>
                  {listClass?.data.map((kelas: any) => (
                    <SelectItem key={kelas.id} value={kelas.id.toString()}>
                      {kelas.namaKelas}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="hari">{lang.text('day')}</label>
              <Select
                onValueChange={(value) => setFormData({ ...formData, hari: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={lang.text('selectDay')} />
                </SelectTrigger>
                <SelectContent>
                  {daysOrder.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="mataPelajaranId">{lang.text('course')}</label>
              <Select
                onValueChange={(value) =>
                  setFormData({ ...formData, mataPelajaranId: parseInt(value) })
                }
                disabled={selectedKelasIdForAdd === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder={selectedKelasIdForAdd === 0 ? lang.text('selectClassRoom') : lang.text('selectCourse')} />
                </SelectTrigger>
                <SelectContent className="px-2">
                  <div className="py-1 mb-2">
                    <Input
                      ref={searchInputRef}
                      placeholder={lang.text('searchCourse')}
                      value={searchCourse}
                      onChange={(e) => setSearchCourse(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                      className="w-full"
                    />
                  </div>
                  {filteredCourses.map((course: any) => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      {course.namaMataPelajaran}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="guruId">{lang.text('teacher')}</label>
              <Select
                onValueChange={(value) =>
                  setFormData({ ...formData, guruId: parseInt(value) })}
                >
                <SelectTrigger>
                  <SelectValue placeholder={lang.text('selectTeacher')} />
                </SelectTrigger>
                <SelectContent className="px-2">
                  <div className="py-1 mb-2">
                    <Input
                      ref={teacherSearchInputRef}
                      placeholder="Cari Guru..."
                      value={searchTeacher}
                      onChange={(e) => setSearchTeacher(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                      className="w-full"
                    />
                  </div>
                  {filteredTeachers?.map((teacher: any) => (
                    <SelectItem key={teacher.id} value={teacher.id.toString()}>
                      {teacher.namaGuru}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="jamMulai">{lang.text('startHour')}</label>
              <Input
                type="time"
                value={formData.jamMulai}
                onChange={(e) => setFormData({ ...formData, jamMulai: e.target.value })}
                className="w-full"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="jamSelesai">{lang.text('endHour')}</label>
              <Input
                type="time"
                value={formData.jamSelesai}
                onChange={(e) => setFormData({ ...formData, jamSelesai: e.target.value })}
                className="w-full"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddSchedule}>{lang.text('save')}</Button>
            <Button variant="outline" onClick={() => {
              setIsAddModalOpen(false);
              setFormData({
                mataPelajaranId: 0,
                guruId: 0,
                hari: '',
                jamMulai: '',
                jamSelesai: '',
              });
              setSelectedKelasIdForAdd(0);
            }}>
              {lang.text('cancel')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{lang.text('editSchedule')} - {selectedDay}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="mataPelajaranId">{lang.text('course')}</label>
              <Select
                value={formData.mataPelajaranId.toString()}
                onValueChange={(value) =>
                  setFormData({ ...formData, mataPelajaranId: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={lang.text('selectCourse')} />
                </SelectTrigger>
                <SelectContent className="px-2">
                  <div className="py-1 mb-2">
                    <Input
                      ref={searchInputRef}
                      placeholder="Cari Mata Pelajaran..."
                      value={searchCourse}
                      onChange={(e) => setSearchCourse(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                      className="w-full"
                    />
                  </div>
                  {filteredCourses.map((course: any) => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      {course.namaMataPelajaran}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="guruId">{lang.text('teacher')}</label>
              <Select
                value={formData.guruId.toString()}
                onValueChange={(value) =>
                  setFormData({ ...formData, guruId: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Guru" />
                </SelectTrigger>
                <SelectContent className="px-2">
                  <div className="py-1 mb-2">
                    <Input
                      ref={teacherSearchInputRef}
                      placeholder={lang.text('searchTeacher')}
                      value={searchTeacher}
                      onChange={(e) => setSearchTeacher(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                      className="w-full"
                    />
                  </div>
                  {filteredTeachers.map((teacher: any) => (
                    <SelectItem key={teacher.id} value={teacher.id.toString()}>
                      {teacher.namaGuru}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="jamMulai">{lang.text('startHour')}</label>
              <Input
                type="time"
                value={formData.jamMulai}
                onChange={(e) => setFormData({ ...formData, jamMulai: e.target.value })}
                className="w-full"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="jamSelesai">{lang.text('endHour')}</label>
              <Input
                type="time"
                value={formData.jamSelesai}
                onChange={(e) => setFormData({ ...formData, jamSelesai: e.target.value })}
                className="w-full"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEditSchedule}>{lang.text('save')}</Button>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              {lang.text('cancel')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDayFilterOpen} onOpenChange={setIsDayFilterOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{lang.text('selectDay')}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="all-days"
                checked={selectedDays.length === daysOrder.length}
                onCheckedChange={handleAllDaysToggle}
              />
              <label htmlFor="all-days">{lang.text('allDays')}</label>
            </div>
            {daysOrder.map((day) => (
              <div key={day} className="flex items-center gap-2">
                <Checkbox
                  id={day}
                  checked={selectedDays.includes(day)}
                  onCheckedChange={() => handleDayToggle(day)}
                />
                <label htmlFor={day}>{day}</label>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDayFilterOpen(false)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent>
          <DialogHeader>
            {/* <DialogTitle>{lang.text('uploadExcel')}</DialogTitle> */}
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="excelFile">{lang.text('selectFileExcel')}</label>
              <Input
                type="file"
                id="excelFile"
                accept=".xlsx,.xls"
                onChange={(e) => setExcelFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUploadExcel}>
              {lang.text('uploadExcel')}
              <FaFileExcel />
            </Button>
            <Button variant="outline" onClick={() => {
              setIsUploadModalOpen(false);
              setExcelFile(null);
            }}>
              Batal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mb-8">
        <div className="w-full mb-4 flex justify-between items-center">
          <div className="flex gap-2">
            <Button variant='outline' onClick={openAddModal}>
              {lang.text('createSchedule')} <Plus />
            </Button>
            <div className="mx-2 h-[36px] py-1 flex items-center justify-center">
              <p>{lang.text('or')}</p>
            </div>
            <Button className="text-green-300 border border-green-700" variant="outline" onClick={handleDownloadTemplate}>
              {lang.text('DownloadTemplateExcel')} <Download />
            </Button>
            <div className="w-[1px] bg-white/20 mx-2 h-[28px] mt-1"></div>
            <Button variant="outline" onClick={() => setIsUploadModalOpen(true)}>
              {lang.text('uploadExcel')} <UploadCloud />
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <Select
              onValueChange={(value) => setSelectedClassId(parseInt(value))}
              value={selectedClassId.toString()}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Pilih Kelas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">{lang.text('allClasses')}</SelectItem>
                {listClass?.data?.map((kelas: any) => (
                  <SelectItem key={kelas.id} value={kelas.id.toString()}>
                    {kelas.namaKelas}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="w-[200px] justify-between"
              onClick={() => setIsDayFilterOpen(true)}
            >
              {selectedDays.length === daysOrder.length
                ? lang.text('allDays')
                : selectedDays.length === 0
                ? lang.text("selectDay")
                : selectedDays.join(", ")}
              <span>▼</span>
            </Button>
            <Badge variant="outline" className="py-2.5">
              <span>{lang.text('totalClass')}:</span>
              <span className="ml-2">{classes.length}</span>
            </Badge>          
          </div>
        </div>
        <div className="grid gap-8">
          {Object.keys(groupedByClassAndDay).length > 0 && selectedDays.length > 0 ? (
            Object.keys(groupedByClassAndDay)
              .filter((kelasId) => selectedClassId === 0 || parseInt(kelasId) === selectedClassId)
              .map((kelasId) => {
                const classSchedules = groupedByClassAndDay[parseInt(kelasId)];
                if (!classSchedules) {
                  console.warn(`No schedules found for kelasId: ${kelasId}`);
                  return null;
                }
                return (
                  <div key={kelasId} className="border rounded-lg p-6 shadow-md">
                    <h1 className="flex gap-5 text-2xl font-bold mb-6">
                      <School2 /> {lang.text('className')}:{" "}
                      {classes.find((k: any) => k.id === parseInt(kelasId))?.namaKelas ||
                        `Kelas ${kelasId}`}
                    </h1>
                    <div className="grid grid-cols-2 gap-4">
                      {daysOrder
                        .filter((day) => selectedDays.includes(day))
                        .map((day) => (
                          <div key={day} className="border rounded-lg p-4 shadow-sm">
                            <h2 className="text-xl font-bold mb-4">{lang.text(dayMap[day])}</h2>
                            {classSchedules[day] && classSchedules[day].length > 0 ? (
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>{lang.text("time")}</TableHead>
                                    <TableHead>{lang.text("nameMapel")}</TableHead>
                                    <TableHead>{lang.text("nameTeacher")}</TableHead>
                                    <TableHead>{lang.text("actions")}</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {classSchedules[day].map((item) => (
                                    <TableRow key={item.id}>
                                      <TableCell>{`${item.jamMulai} - ${item.jamSelesai}`}</TableCell>
                                      <TableCell>{item.mataPelajaran.namaMataPelajaran}</TableCell>
                                      <TableCell>{item.guru.namaGuru}</TableCell>
                                      <TableCell className="flex gap-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => openEditModal(day, item)}
                                        >
                                          <Pen />
                                        </Button>
                                        <Button
                                          variant="destructive"
                                          size="sm"
                                          onClick={() => {
                                            setId(item.id);
                                            showRef.current?.();
                                          }}
                                        >
                                          <Trash />
                                        </Button>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            ) : (
                              <p className="text-gray-500">No schedule for {day}</p>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                );
              })
          ) : (
            <div className="rounded-lg border border-dashed border-white/20 w-full h-[56vh] flex flex-col justify-center items-center">
              <p className="text-gray-500 text-center">
                {selectedDays.length === 0
                  ? "Pilih setidaknya satu hari untuk menampilkan jadwal."
                  : "Belum ada jadwal tersedia."}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

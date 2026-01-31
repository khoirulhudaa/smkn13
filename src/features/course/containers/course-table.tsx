import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, distinctObjectsByProperty, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, lang, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/libs";
import { CourseDataModel } from "@/core/models/course";
import { getStaticFile } from "@/core/utils";
import { BaseDataTable } from "@/features/_global";
import { useAlert } from "@/features/_global/hooks";
import { useClassroom } from "@/features/classroom";
import {
  courseColumns,
  CourseCreationForm,
  courseDataFallback,
  useCourse,
  useCourseCreation,
} from "@/features/course";
import { useProfile } from "@/features/profile";
import { useSchool } from "@/features/schools";
import { zodResolver } from "@hookform/resolvers/zod";
import { Document, Image, Page, pdf, StyleSheet, Text, View } from "@react-pdf/renderer";
import { Download, Plus, UploadCloud } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { FaFile, FaFileExcel, FaFilePdf } from "react-icons/fa";
import * as XLSX from "xlsx";
import { z } from "zod";
import { ModalCreateCourse } from "../components";

// PDF Styles
const pdfStyles = StyleSheet.create({
  page: {
    fontSize: 12,
    fontFamily: 'Times-Roman',
  },
  header: {
    position: 'relative',
    top: 0,
    left: 0,
    right: 0,
    marginBottom: 20,
  },
  headerImage: {
    width: 595,
    maxHeight: 150,
    objectFit: 'contain',
  },
  contentWrapper: {
    paddingLeft: 32,
    paddingRight: 32,
    marginTop: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  content: {
    marginBottom: 10,
    textAlign: 'center',
    lineHeight: 1.5,
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tableCell: {
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: '#000',
    textAlign: 'center',
  },
  tableHeader: {
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0',
  },
  signature: {
    marginTop: 50,
    alignItems: 'flex-end',
  },
  signatureImage: {
    width: 120,
    height: 'auto',
    maxHeight: 50,
    marginTop: 20,
    marginBottom: 10,
  },
  signatureText: {
    textAlign: 'center',
  },
});

// PDF Component for Course Data
const CoursePDF: React.FC<{
  courseData: any[];
  schoolData: { kopSurat: string | undefined; namaSekolah: string; namaKepalaSekolah: string; ttdKepalaSekolah: string | undefined };
}> = ({ courseData, schoolData }) => {
  const kopSuratUrl = schoolData.kopSurat
    ? schoolData.kopSurat.startsWith('data:image')
      ? schoolData.kopSurat
      : `data:image/png;base64,${schoolData.kopSurat}`
    : '';

  const signatureUrl = schoolData.ttdKepalaSekolah
    ? schoolData.ttdKepalaSekolah.startsWith('data:image')
      ? schoolData.ttdKepalaSekolah
      : `data:image/png;base64,${schoolData.ttdKepalaSekolah}`
    : '';

  const rowsPerPage = 20;
  const dataChunks = [];
  for (let i = 0; i < courseData.length; i += rowsPerPage) {
    const chunk = courseData.slice(i, i + rowsPerPage);
    if (chunk.length > 0) {
      dataChunks.push(chunk);
    }
  }

  return (
    <Document>
      {dataChunks.map((chunk, pageIndex) => (
        <Page
          key={pageIndex}
          size="A4"
          style={pdfStyles.page}
          break={pageIndex > 0}
        >
          <View style={pdfStyles.header} fixed>
            {kopSuratUrl && (
              <Image src={getStaticFile(kopSuratUrl)} style={pdfStyles.headerImage} />
            )}
          </View>
          <View style={pdfStyles.contentWrapper}>
            <Text style={pdfStyles.title}>Daftar Mata Pelajaran</Text>
            <Text style={pdfStyles.content}>Sekolah: {schoolData.namaSekolah || 'N/A'}</Text>
            <View style={pdfStyles.table}>
              <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]} fixed>
                {['No', 'Nama Mata Pelajaran', 'Kelas', 'Sekolah'].map((header, index) => (
                  <View
                    key={index}
                    style={[
                      pdfStyles.tableCell,
                      pdfStyles.tableHeader,
                      {
                        width: index === 0 ? '10%' : index === 1 ? '40%' : index === 2 ? '25%' : '25%',
                      },
                    ]}
                  >
                    <Text>{header}</Text>
                  </View>
                ))}
              </View>
              {chunk.map((item, index) => (
                <View style={pdfStyles.tableRow} key={index} wrap={false}>
                  <View style={[pdfStyles.tableCell, { width: '10%' }]}>
                    <Text>{pageIndex * rowsPerPage + index + 1}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: '40%' }]}>
                    <Text>{item.namaMataPelajaran || '-'}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: '25%' }]}>
                    <Text>{item.kelas?.namaKelas || '-'}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: '25%' }]}>
                    <Text>{schoolData.namaSekolah || '-'}</Text>
                  </View>
                </View>
              ))}
            </View>
            {pageIndex === dataChunks.length - 1 && (
              <View style={pdfStyles.signature}>
                <Text style={pdfStyles.signatureText}>Kepala Sekolah,</Text>
                {signatureUrl && (
                  <Image src={signatureUrl} style={pdfStyles.signatureImage} />
                )}
                <Text style={pdfStyles.signatureText}>{schoolData.namaKepalaSekolah || 'Nama Kepala Sekolah'}</Text>
              </View>
            )}
          </View>
        </Page>
      ))}
    </Document>
  );
};

// Function to generate PDF
const generateCoursePDF = async ({
  courseData,
  alert,
  schoolData,
  schoolIsLoading,
}: {
  courseData: any[];
  alert: { success: (msg: string) => void; error: (msg: string) => void } | undefined;
  schoolData: any;
  schoolIsLoading: boolean;
}) => {
  if (!alert) {
    console.error('Alert system is not available');
    return;
  }

  if (schoolIsLoading) {
    alert.error('Data sekolah masih dimuat, silakan coba lagi.');
    return;
  }

  if (!courseData || !Array.isArray(courseData) || courseData.length === 0) {
    alert.error('Tidak ada data mata pelajaran untuk dihasilkan.');
    return;
  }

  if (!schoolData || !schoolData.namaSekolah) {
    alert.error('Data sekolah tidak lengkap.');
    return;
  }

  if (!schoolData.kopSurat) {
    alert.error('Kop surat tidak tersedia, laporan akan dibuat tanpa kop surat.');
  }

  try {
    const doc = (
      <CoursePDF
        courseData={courseData}
        schoolData={{
          namaSekolah: schoolData.namaSekolah || 'Nama Sekolah',
          kopSurat: schoolData.kopSurat || undefined,
          namaKepalaSekolah: schoolData.namaKepalaSekolah || 'Nama Kepala Sekolah',
          ttdKepalaSekolah: schoolData.ttdKepalaSekolah || undefined,
        }}
      />
    );

    const pdfInstance = pdf(doc);
    const pdfBlob = await pdfInstance.toBlob();

    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Daftar-Mata-Pelajaran-${new Date().toISOString().slice(0, 10)}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    alert.success('Daftar mata pelajaran berhasil diunduh sebagai PDF.');
  } catch (error) {
    console.error('Error generating course PDF:', error);
    alert.error('Gagal menghasilkan daftar mata pelajaran dalam format PDF.');
  }
};

export const CourseTable = () => {
  const resource = useCourse();
  const school = useSchool();
  const classroom = useClassroom();
  const profile = useProfile();
  const alert = useAlert();
  const creation = useCourseCreation();
  const [createCourse, setCreateCourse] = useState(false);
  const [editCourse, setEditCourse] = useState<CourseDataModel | null>(null);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [exportLoading, setExportLoading] = useState<{ excel: boolean; pdf: boolean }>({ excel: false, pdf: false });
  const [selectedExport, setSelectedExport] = useState<string>("");
  const [searchNamaMataPelajaran, setSearchNamaMataPelajaran] = useState("");

  const columns = useMemo(
    () =>
      courseColumns({
        schoolOptions: distinctObjectsByProperty(
          school.data?.map((d) => ({
            label: d.namaSekolah,
            value: d.namaSekolah,
          })) || [],
          "value",
        ),
        classroomOptions: distinctObjectsByProperty(
          classroom.data?.map((d) => ({
            label: d.namaKelas,
            value: d.namaKelas,
          })) || [],
          "value",
        ),
        onEdit: (course) => setEditCourse(course),
      }),
    [school.data, classroom.data],
  );

  // Filter data based on namaMataPelajaran search
  const filteredCourseData = useMemo(() => {
    // const uniqueData = distinctObjectsByProperty(resource.data || [], "namaMataPelajaran");
    if (!searchNamaMataPelajaran) return resource.data;
    return resource?.data.filter((item) =>
      item.namaMataPelajaran?.toLowerCase().includes(searchNamaMataPelajaran.toLowerCase())
    ) || [];
  }, [resource.data, searchNamaMataPelajaran]);

  // Schema for file upload form
  const uploadSchema = z.object({
    file: z
      .instanceof(File)
      .refine((file) => file && [".xlsx", ".xls"].some(ext => file.name.toLowerCase().endsWith(ext)), {
        message: lang.text("invalidFileType"),
      }),
  });

  const uploadForm = useForm<z.infer<typeof uploadSchema>>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      file: undefined,
    },
  });

  // Function to download Excel template
  const handleDownloadTemplate = () => {
    const link = document.createElement("a");
    link.href = "/template_jadwal.xlsx";
    link.download = "template_jadwal.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to export data to Excel
  const handleExportExcel = () => {
    if (!filteredCourseData || filteredCourseData.length === 0) {
      alert.error("Tidak ada data untuk diekspor.");
      return;
    }

    setExportLoading((prev) => ({ ...prev, excel: true }));

    const exportData = filteredCourseData.map((item, index) => ({
      No: index + 1,
      namaMataPelajaran: item.namaMataPelajaran,
      Kelas: item.kelas?.namaKelas || 'N/A',
      Sekolah: school.data?.[0]?.namaSekolah || 'N/A',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Courses");

    // Auto-size columns
    const colWidths = [
      { wch: 5 },  // No
      { wch: 25 }, // namaMataPelajaran
      { wch: 20 }, // Kelas
      { wch: 20 }, // Sekolah
    ];
    worksheet['!cols'] = colWidths;

    XLSX.writeFile(workbook, `course_data_${new Date().toISOString().slice(0, 10)}.xlsx`);
    alert.success("Data berhasil diekspor ke Excel.");
    setExportLoading((prev) => ({ ...prev, excel: false }));
    setSelectedExport(""); // Reset dropdown
  };

  // Function to export data to PDF
  const handleExportPDF = async () => {
    if (!filteredCourseData || filteredCourseData.length === 0) {
      alert.error("Tidak ada data untuk diekspor.");
      return;
    }

    setExportLoading((prev) => ({ ...prev, pdf: true }));

    await generateCoursePDF({
      courseData: filteredCourseData,
      alert,
      schoolData: school.data?.[0] || {},
      schoolIsLoading: school.isLoading,
    });

    setExportLoading((prev) => ({ ...prev, pdf: false }));
    setSelectedExport(""); // Reset dropdown
  };

  // Function to handle export selection
  const handleExport = (format: string) => {
    if (format === "excel") {
      handleExportExcel();
    } else if (format === "pdf") {
      handleExportPDF();
    }
  };

  console.log('classroom', classroom)

  // Handle Excel file upload
  const handleExcelUpload = async (data: z.infer<typeof uploadSchema>) => {
    const file = data.file;
    if (!file) {
      alert.error('Tidak ada file dikirim!');
      return;
    }

    if (!profile?.user?.sekolahId) {
      alert.error("Gagal mendapatkan sekolahId dari profil pengguna.");
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Transformasi data ke format API
        const formattedData = jsonData.map((row: any) => ({
          namaMataPelajaran: row["Mata Pelajaran"]?.trim() || "",
          namaKelas: row["Nama Kelas"]?.trim() || "",
        }));

        console.log('format', formattedData)

        // Validasi data
        const validClasses = classroom.data?.map((cls) => cls.namaKelas.toLowerCase()) || [];
        const validData = formattedData.filter(
          (item) =>
            item.namaMataPelajaran &&
            item.namaKelas &&
            validClasses.includes(item.namaKelas.toLowerCase())
        );

        console.log('valid', validData)

        if (validData.length === 0) {
          setUploadStatus(lang.text("NotFoundValid"));
          return;
        }

        // Cek kelas yang tidak valid
        const invalidClasses = formattedData
          .filter((item) => item.namaKelas && !validClasses.includes(item.namaKelas.toLowerCase()))
          .map((item) => item.namaKelas);
        if (invalidClasses.length > 0) {
          alert.error(
            lang.text("classNotValid")
          );
          return;
        }

        // Cek duplikasi mata pelajaran
        const duplicates = validData.filter((item) =>
          resource.data?.some(
            (course) =>
              course.namaMataPelajaran.toLowerCase() ===
              item.namaMataPelajaran.toLowerCase()
          )
        );

        if (duplicates.length > 0) {
          alert.error(
            lang.text("errorDuplicateCourse", {
              context: duplicates.map((d) => d.namaMataPelajaran).join(", "),
            })
          );
          return;
        }

        // Kirim data ke API
        let successCount = 0;
        let errorCount = 0;

        for (const item of validData) {
          try {
            // Cari kelasId berdasarkan namaKelas
            const kelas = classroom.data?.find(
              (cls) => cls.namaKelas.toLowerCase() === item.namaKelas.toLowerCase()
            );
            const kelasId = kelas?.id;

            if (!kelasId) {
              throw new Error(`Kelas ID tidak ditemukan untuk ${item.namaKelas}`);
            }

            await creation.create({
              namaMataPelajaran: item.namaMataPelajaran,
              kelasId,
              sekolahId: profile?.user?.sekolahId,
            });
            successCount++;
          } catch (error) {
            console.error(`Gagal mengirim: ${item.namaMataPelajaran}`, error);
            errorCount++;
          }
        }

        alert.success(
          lang.text("success", {
            success: successCount,
            failed: errorCount,
          })
        );

        if (successCount > 0) {
          resource.query.refetch();
          alert.success(lang.text("successCreate", { context: lang.text("course") }));
        }

        if (errorCount === 0) {
          setIsExcelModalOpen(false);
          uploadForm.reset();
        }
      };

      await resource.query.refetch();
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("Error saat memproses file:", error);
      alert.error(lang.text("errSystem"));
    } finally {
      setUploading(false);
      await resource.query.refetch();
    }
  };

  return (
    <>
      <ModalCreateCourse show={createCourse} onClose={() => setCreateCourse(false)} />
      <Dialog open={!!editCourse} onOpenChange={() => setEditCourse(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{lang.text("editCourse")}</DialogTitle>
          </DialogHeader>
          {editCourse && (
            <CourseCreationForm
              onClose={() => setEditCourse(null)}
              initialData={{
                id: editCourse.id,
                namaMataPelajaran: editCourse.namaMataPelajaran,
                sekolahId: editCourse.sekolah?.id,
                kelasId: editCourse.kelas?.id,
              }}
            />
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={isExcelModalOpen} onOpenChange={setIsExcelModalOpen}>
        <DialogContent className="w-[600px] pt-10 h-max">
          <DialogHeader className="flex h-[54px] justify-between border-b border-b-white/10 pb-6 mb-4">
            <DialogTitle className="flex items-baseline">
              <p>{lang.text('uploadExcel')}</p>
            </DialogTitle>
          </DialogHeader>
          <Form {...uploadForm}>
            <form onSubmit={uploadForm.handleSubmit(handleExcelUpload)} className="mb-8">
              <div className="flex flex-col gap-6">
                <FormField
                  control={uploadForm.control}
                  name="file"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{lang.text('selectFileExcel')}</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept=".xlsx,.xls"
                          onChange={(e) => field.onChange(e.target.files?.[0])}
                        />
                      </FormControl>
                      <FormMessage>{uploadForm.formState.errors.file?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={uploading || !profile?.user?.sekolahId}
                    className="active:scale-[0.97]"
                  >
                    {uploading ? lang.text('progress') : lang.text("uploadExcelCourse")}
                    <FaFileExcel />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsExcelModalOpen(false)}
                    className="active:scale-[0.97]"
                  >
                    {lang.text("cancel")}
                  </Button>
                </div>
                {uploadStatus && (
                  <p className="text-sm text-red-500">{uploadStatus}</p>
                )}
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <div className="flex gap-4 mb-4 items-center">
        <Button
          variant={'outline'}
          disabled={uploading || exportLoading.excel || exportLoading.pdf}
          className="active:scale-[0.97]"
          onClick={() => setCreateCourse(true)}
        >
          {lang.text('createCourse')}
          <Plus />
        </Button>
        <div className="mx-1 h-[36px] py-1 flex items-center justify-center">
          <p>{lang.text('or')}</p>
        </div>
        <Button
          onClick={handleDownloadTemplate}
          disabled={uploading || exportLoading.excel || exportLoading.pdf}
          className="hover:bg-black/10 hover:text-green-300 active:scale-[0.99] bg-transparent border border-green-500 text-green-200"
        >
          {lang.text('DownloadTemplateExcel')}
          <Download />
        </Button>
        <div className="w-[1px] bg-white/20 mx-1 h-[76%]"></div>
        <Button
          variant={'outline'}
          onClick={() => setIsExcelModalOpen(true)}
          disabled={uploading || exportLoading.excel || exportLoading.pdf || !profile?.user?.sekolahId}
          className="active:scale-[0.97]"
        >
          {uploading ? lang.text('progress') : lang.text("uploadExcel")}
          <UploadCloud />
        </Button>
        <Select
          value={selectedExport}
          onValueChange={handleExport}
          disabled={uploading || exportLoading.excel || exportLoading.pdf || !filteredCourseData?.length}
        >
          <SelectTrigger className="w-[120px] ml-auto">
            <SelectValue
              placeholder={
                <span className="flex items-center gap-2">
                  <FaFile />
                  {lang.text('export')}
                </span>
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="excel">
              <p className="flex items-center">
                <FaFileExcel className="mr-2" />
                Export Excel
              </p>
            </SelectItem>
            <SelectItem className="flex items-center w-max" value="pdf">
              <p className="flex items-center">
                <FaFilePdf className="mr-2" />
                Export PDF
              </p>
            </SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder={lang.text('searchClass')}
          value={searchNamaMataPelajaran}
          onChange={(e) => setSearchNamaMataPelajaran(e.target.value)}
          className="max-w-xs"
        />
      </div>
      <BaseDataTable
        columns={columns}
        data={filteredCourseData}
        dataFallback={courseDataFallback}
        globalSearch={false}
        showFilterButton
        actions={[
          {
            title: lang.text("addWithContext", { context: lang.text("course") }),
            onClick: () => setCreateCourse(true),
          },
        ]}
        searchParamPagination
        searchPlaceholder={lang.text("search")}
        isLoading={resource.query.isLoading}
      />
    </>
  );
};
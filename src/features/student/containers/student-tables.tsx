import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  lang
} from "@/core/libs";
import { getStaticFile } from "@/core/utils";
import { useAlert, useDataTableController } from "@/features/_global";
import { useClassroom } from "@/features/classroom";
import { useProfile } from "@/features/profile";
import { useSchool, useSchoolDetail } from "@/features/schools";
import { checkAttendance, StudentTable, useAttedances } from "@/features/student";
import { useBiodataNew } from "@/features/user/hooks/use-biodata-new";
import { Document, Image, Page, pdf, StyleSheet, Text, View } from '@react-pdf/renderer';
import axios from "axios";
import dayjs from "dayjs";
import { ChevronDown, ChevronUp, UploadIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import { useStudentPagination } from "../hooks/use-student-pagination";
import { useBiodata } from "@/features/user";

// Gaya PDF yang serupa dengan kode pertama
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

// Komponen PDF untuk Laporan Absensi Harian

const DailyAttendancePDF: React.FC<{
  attendanceData: {
    id: number;
    name: string;
    nis: string;
    nisn: string;
    namaKelas: string | null;
    statusKehadiran: string;
  }[];
  schoolData: {
    kopSurat: string;
    namaSekolah: string;
    namaKepalaSekolah: string;
    ttdKepalaSekolah: string | undefined;
  };
  date: string;
}> = ({ attendanceData, schoolData, date }) => {
  const kopSuratUrl = schoolData.kopSurat
    ? schoolData.kopSurat.startsWith('data:image')
      ? schoolData.kopSurat
      : `data:image/png;base64,${schoolData.kopSurat}`
    : undefined;

  const signatureUrl = schoolData.ttdKepalaSekolah
    ? schoolData.ttdKepalaSekolah.startsWith('data:image')
      ? schoolData.ttdKepalaSekolah
      : `data:image/png;base64,${schoolData.ttdKepalaSekolah}`
    : undefined;

  // Split data into chunks for pagination
  const rowsPerPage = 23;
  const dataChunks = [];
  for (let i = 0; i < attendanceData.length; i += rowsPerPage) {
    const chunk = attendanceData.slice(i, i + rowsPerPage);
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
            {kopSuratUrl && <Image src={kopSuratUrl} style={pdfStyles.headerImage} />}
          </View>
          <View style={pdfStyles.contentWrapper}>
            <Text style={pdfStyles.title}>Laporan Absensi Harian</Text>
            <Text style={pdfStyles.content}>
              Tanggal: {date || 'Tanggal Tidak Diketahui'}
            </Text>
            <View style={pdfStyles.table}>
              <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]} fixed>
                {['No', 'Nama Siswa', 'NIS', 'NISN'].map((header, index) => (
                  <View
                    key={index}
                    style={[
                      pdfStyles.tableCell,
                      pdfStyles.tableHeader,
                      {
                        width:
                          index === 0 ? '5%' :
                          index === 1 ? '45%' :
                          index === 2 ? '25%' :
                          '25%',
                      },
                    ]}
                  >
                    <Text>{header}</Text>
                  </View>
                ))}
              </View>
              {chunk.map((item, index) => (
                <View style={pdfStyles.tableRow} key={index} wrap={false}>
                  <View style={[pdfStyles.tableCell, { width: '5%' }]}>
                    <Text>{pageIndex * rowsPerPage + index + 1}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: '45%' }]}>
                    <Text>{item.name || '-'}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: '25%' }]}>
                    <Text>{item.nis || '-'}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: '25%' }]}>
                    <Text>{item.nisn || '-'}</Text>
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

// Komponen PDF untuk Laporan Absensi Bulanan
const MonthlyAttendancePDF: React.FC<{
  attendanceData: any[];
  schoolData: { kopSurat: string; namaSekolah: string; namaKepalaSekolah: string; ttdKepalaSekolah: string | undefined };
  month: string;
}> = ({ attendanceData, schoolData, month }) => {
  const kopSuratUrl = schoolData.kopSurat
    ? schoolData.kopSurat.startsWith('data:image')
      ? schoolData.kopSurat
      : `data:image/png;base64,${schoolData.kopSurat}`
    : undefined;

  const signatureUrl = schoolData.ttdKepalaSekolah
    ? schoolData.ttdKepalaSekolah.startsWith('data:image')
      ? schoolData.ttdKepalaSekolah
      : `data:image/png;base64,${schoolData.ttdKepalaSekolah}`
    : undefined;

  // Bagi data menjadi kelompok untuk setiap halaman
  const rowsPerPage = 25; // Jumlah baris per halaman
  const dataChunks = [];
  for (let i = 0; i < attendanceData.length; i += rowsPerPage) {
    const chunk = attendanceData.slice(i, i + rowsPerPage);
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
          break={pageIndex > 0} // Page break untuk halaman setelah pertama
        >
          <View style={pdfStyles.header} fixed>
            <Image src={getStaticFile(kopSuratUrl)} style={pdfStyles.headerImage} />
          </View>
          <View style={pdfStyles.contentWrapper}>
            <Text style={pdfStyles.title}>Laporan Absensi Bulanan</Text>
            <Text style={pdfStyles.content}>
              Bulan: {month || 'Bulan Tidak Diketahui'}
            </Text>
            <View style={pdfStyles.table}>
              <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]} fixed>
                {['No', 'Nama Siswa', 'NIS', 'Kelas', 'Hadir', 'Izin', 'Sakit', 'Alpa'].map((header, index) => (
                  <View
                    key={index}
                    style={[
                      pdfStyles.tableCell,
                      pdfStyles.tableHeader,
                      {
                        width: index === 0 ? '5%' : index === 1 ? '25%' : index === 2 ? '15%' : index === 3 ? '15%' : '10%',
                      },
                    ]}
                  >
                    <Text>{header}</Text>
                  </View>
                ))}
              </View>
              {chunk.map((item, index) => (
                <View style={pdfStyles.tableRow} key={index} wrap={false}>
                  <View style={[pdfStyles.tableCell, { width: '5%' }]}>
                    <Text>{pageIndex * rowsPerPage + index + 1}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: '25%' }]}>
                    <Text>{item?.user?.name || '-'}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: '15%' }]}>
                    <Text>{item?.user?.nis || '-'}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: '15%' }]}>
                    <Text>{item?.user?.namaKelas || '-'}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: '10%' }]}>
                    <Text>{item.hadir || 0}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: '10%' }]}>
                    <Text>{item.izin || 0}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: '10%' }]}>
                    <Text>{item.sakit || 0}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: '10%' }]}>
                    <Text>{item.alpa || 0}</Text>
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

// Fungsi untuk menghasilkan PDF absensi harian
export const generateAttendancePDF = async ({
  studentParams,
  attendanceData,
  alert,
  nameSchool,
  schoolData,
  schoolIsLoading,
}: {
  studentParams: any;
  attendanceData: any[];
  alert: any;
  nameSchool: string;
  schoolData: any;
  schoolIsLoading: boolean;
}) => {

  if (schoolIsLoading) {
    alert.error('Data sekolah masih dimuat, silakan coba lagi.');
    return;
  }

  if (!attendanceData || attendanceData.length === 0) {
    alert.error('Tidak ada data absensi untuk dihasilkan.');
    return;
  }

  try {
    const doc = (
      <DailyAttendancePDF
        attendanceData={attendanceData}
        schoolData={{
          namaSekolah: nameSchool,
          kopSurat: schoolData?.kopSurat || '',
          namaKepalaSekolah: schoolData?.namaKepalaSekolah || 'Nama Kepala Sekolah',
          ttdKepalaSekolah: schoolData?.ttdKepalaSekolah,
        }}
        date={dayjs().format('DD MMMM YYYY')}
      />
    );

    const pdfInstance = pdf(doc);
    const pdfBlob = await pdfInstance.toBlob();

    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Laporan-Absensi-Harian-${dayjs().format('YYYY-MM-DD')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    alert.success('Laporan absensi harian berhasil diunduh.');
  } catch (error) {
    console.error('Error generating daily attendance PDF:', error);
    alert.error('Gagal menghasilkan laporan absensi harian.');
  }
};

// Fungsi untuk menghasilkan PDF absensi bulanan
export const generateMonthlyAttendancePDF = async ({
  studentParams,
  attendanceData,
  alert,
  nameSchool,
  schoolData,
  schoolIsLoading,
}: {
  studentParams: any;
  attendanceData: any[];
  alert: any;
  nameSchool: string;
  schoolData: any;
  schoolIsLoading: boolean;
}) => {
  console.log('atttw', attendanceData)
  if (schoolIsLoading) {
    alert.error('Data sekolah masih dimuat, silakan coba lagi.');
    return;
  }

  if (!attendanceData || attendanceData.length === 0) {
    alert.error('Tidak ada data absensi untuk dihasilkan.');
    return;
  }

  // Proses data absensi untuk menghitung jumlah hadir, izin, sakit, dan alpa per siswa
  const monthlyData = attendanceData.reduce((acc, item) => {
    const studentId = item?.id;
    if (!acc[studentId]) {
      acc[studentId] = {
        user: item,
        // kelas: item.kelas,
        hadir: 0,
        izin: 0,
        sakit: 0,
        alpa: 0,
      };
    }
    if (item.status === 'Hadir') acc[studentId].hadir += 1;
    else if (item.status === 'Izin') acc[studentId].izin += 1;
    else if (item.status === 'Sakit') acc[studentId].sakit += 1;
    else if (item.status === 'Alpa') acc[studentId].alpa += 1;
    return acc;
  }, {});

  const formattedData = Object.values(monthlyData);
  console.log('formattte', formattedData)

  try {
    const doc = (
      <MonthlyAttendancePDF
        attendanceData={formattedData}
        schoolData={{
          namaSekolah: nameSchool,
          kopSurat: schoolData?.kopSurat || '',
          namaKepalaSekolah: schoolData?.namaKepalaSekolah || 'Nama Kepala Sekolah',
          ttdKepalaSekolah: schoolData?.ttdKepalaSekolah,
        }}
        month={dayjs().format('MMMM YYYY')}
      />
    );

    const pdfInstance = pdf(doc);
    const pdfBlob = await pdfInstance.toBlob();

    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Laporan-Absensi-Bulanan-${dayjs().format('YYYY-MM')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    alert.success('Laporan absensi bulanan berhasil diunduh.');
  } catch (error) {
    console.error('Error generating monthly attendance PDF:', error);
    alert.error('Gagal menghasilkan laporan absensi bulanan.');
  }
};

export const StudentLandingTables = () => {
  const [openImport, setOpenImport] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingPDF, setGeneratingPDF] = useState(false);
  const [attendanceResult, setAttendanceResult] = useState<any[]>([]);
  const [profileSchoolId, setProfileSchoolId] = useState<number | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const alert = useAlert();

  const {
    global,
    sorting,
    filter,
    pagination,
    onSortingChange,
    onPaginationChange,
  } = useDataTableController({ defaultPageSize: 50 });

  const profile = useProfile();
  const classRoom = useClassroom();
  const siswa = useBiodata();
  const jumlahMasuk = useBiodataNew(profile?.user?.sekolahId);
  const sekolahId = filter.find((f) => f.id === "sekolahId")?.value || profile.user?.sekolahId || 1;
  const { data: schoolData, isLoading: schoolIsLoading } = useSchool();
  useEffect(() => {
    setProfileSchoolId(profile.user?.sekolahId || null);
  }, [profile.user]);

  console.log('siswa', siswa?.data)

  console.log('schoolData', schoolData)

  const attedances = profileSchoolId !== null ? useAttedances({ id: profileSchoolId }) : useAttedances();
  console.log('attedances:', attedances?.data)
  const idKelas = filter.find((f) => f.id === "idKelas")?.value;
  
  const studentParams = useMemo(() => ({
    page: pagination.pageIndex + 1,
    size: pagination.pageSize,
    sekolahId: sekolahId ? +sekolahId : undefined,
    idKelas: idKelas ? +idKelas : undefined,
    keyword: global,
  }), [pagination.pageIndex, pagination.pageSize, sekolahId, idKelas, global]);
  
  const { data, isLoading, refetch } = useStudentPagination(studentParams);
  console.log('data isActive cek:', data)
  // console.log('data siswa:', data)
  useMemo(() => {
    if (attedances.isLoading || isLoading || !attedances.data || !data?.students?.data) {
      return;
    }
    const result = checkAttendance(attedances.data, data.students?.data);
    setAttendanceResult(result);
    // console.log('result', result);
  }, [attedances.isLoading, attedances.data, isLoading, data?.students?.data]);

  // Refetch when profileSchoolId changes
  useEffect(() => {
    if (profileSchoolId) {
      attedances.query.refetch();
      refetch();
    }
  }, [profileSchoolId, attedances.query.refetch, refetch]);

  const handleDownload = (type: string) => {
    const fileUrl = type === 'excel' ? '/Template-Pendaftaran-Siswa.xlsx' : '/Template-Pendaftaran-Siswa-CSVFormat.csv';
    const link = document.createElement('a');
    link.href = fileUrl;
    link.setAttribute('download', type === 'excel' ? 'Template-Pendaftaran-Siswa.xlsx' : 'Template-Pendaftaran-Siswa.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadExcel = (type: string) => {
    handleDownload(type);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
  };

  const importData = async () => {
    if (selectedFile) {
      const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
      if (fileExtension !== 'xlsx') {
        alert.error("Harap unggah file dengan format .xlsx");
        return;
      }

      setIsUploading(true);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert.error("Token tidak ditemukan, silakan login.");
          setIsUploading(false);
          return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/upload-excel`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.data) {
          alert.error("Tidak ada data yang dikembalikan dari server");
          setIsUploading(false);
          return;
        }

        const { data } = response.data;

        const formattedMessage = (
          <div>
            <p>✅ Berhasil diimport: {data?.success || 0}</p>
            <p>⚠️ Data yang dilewati: {data?.skipped || 0}</p>
            <p>❌ Data tidak valid: {data?.invalid || 0}</p>
          </div>
        );

        if (response.data.success) {
          setSelectedFile(null);
          await Promise.all([
            attedances.query.refetch(),
            refetch(),
          ]);
          alert.success(formattedMessage);
        } else {
          setSelectedFile(null);
          console.log('repsonse excel 2:', response)
          await Promise.all([
            attedances.query.refetch(),
            refetch(),
          ]);
          alert.error(formattedMessage);
        }

        console.log('response:', response);
        setOpenImport(false);
      } catch (error: any) {
        console.log("Error saat mengunggah file:", error);
        alert.error("Terjadi kesalahan saat mengimpor data");
      } finally {
        setIsUploading(false);
      }
    } else {
      alert.error("Tidak ada file yang dipilih!");
    }
  };

  const handleDownloadPDF = async () => {
    setGeneratingPDF(true);
    try {
      await generateAttendancePDF({
        studentParams,
        attendanceData: attendanceResult,
        alert,
        nameSchool: profile.user?.sekolah?.namaSekolah || "",
        schoolData: schoolData?.[0],
        schoolIsLoading,
      });
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleAlert = () => {
    alert.error(lang.text('shouldClassroom'));
  };

  console.log('data.students?.data new', data)

  return (
    <>
      <div className="flex justify-between items-center pb-4">
        <div className="w-full flex justify-between">
          <div className="flex w-max">
            <Button className="hidden" variant="outline" onClick={() => handleDownloadExcel('csv')}>
              {lang.text("download")} Template CSV
            </Button>
            <Button className="mr-4" variant="outline" onClick={() => handleDownloadExcel('excel')}>
              {lang.text("download")} Template Excel
            </Button>
            <Button variant="outline" onClick={() => classRoom?.data.length > 0 ? setOpenImport(true) : handleAlert()}>
              {lang.text("import")} Data
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex justify-between items-center pb-4 gap-4">
              <Button
                variant="outline"
                aria-label="presentCount"
                className="hover:bg-transparent cursor-default"
              >
                {lang.text('presence')}: {jumlahMasuk?.data?.absenHariIni?.length}
              </Button>
              <Button
                variant="outline"
                onClick={handleDownloadPDF}
                aria-label="presentCount"
                className="bg-red-600 text-white hover:bg-red-700 cursor-pointer"
              >
                {lang.text('downloadPDFNormal')}
                <FaFilePdf />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <StudentTable
        data={data?.students?.data}
        isLoading={isLoading || attedances.isLoading}
        pagination={{
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
          totalItems: data?.pagination?.totalItems?.n || 0,
          onPageChange: (page) => onPaginationChange({ ...pagination, pageIndex: page }),
          onSizeChange: (size) => onPaginationChange({ ...pagination, pageSize: size, pageIndex: 0 }),
        }}
        sorting={sorting}
        onSortingChange={onSortingChange}
      />

      <Dialog open={openImport} onOpenChange={setOpenImport}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{lang.text("import")} Data Siswa</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center space-y-4">
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-500 rounded-lg cursor-pointer hover:border-gray-300 transition"
            >
              <UploadIcon className="w-10 h-10 text-gray-400 mb-2" />
              <span className="text-gray-600 text-sm">
                {selectedFile ? selectedFile.name : "Pilih file CSV atau Excel"}
              </span>
            </label>
            <Input
              id="file-upload"
              type="file"
              accept=".csv, .xlsx"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          <DialogFooter className="flex justify-between space-x-4">
            <Button variant="outline" onClick={() => setOpenImport(false)}>
              {lang.text("cancel")}
            </Button>
            <Button
              variant="default"
              disabled={!selectedFile || isUploading}
              onClick={importData}
            >
              {isUploading ? "Uploading..." : lang.text("import")} Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
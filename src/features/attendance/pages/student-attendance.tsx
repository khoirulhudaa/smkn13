import { APP_CONFIG } from '@/core/configs';
import { Button, lang, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/core/libs';
import { getStaticFile } from '@/core/utils';
import { DashboardPageLayout, useAlert } from '@/features/_global';
import { useClassroom } from '@/features/classroom';
import { useProfile } from '@/features/profile';
import { useSchool } from '@/features/schools';
import { useBiodata } from '@/features/user';
import { useBiodataNew } from '@/features/user/hooks/use-biodata-new';
import { Document, Image, Page, pdf, StyleSheet, Text, View } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import Papa from 'papaparse';
import { useEffect, useMemo, useState } from 'react';
import { FaFile } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { StudentAttendanceTable } from '../containers';

// Konfigurasi dayjs untuk timezone
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

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

// PDF Component for Student Attendance
const StudentAttendancePDF: React.FC<{
  attendanceData: any[];
  schoolData: { kopSurat: string | undefined; namaSekolah: string; namaKepalaSekolah: string; ttdKepalaSekolah: string | undefined };
  mode: 'daily' | 'monthly';
  date?: string;
  period?: string;
}> = ({ attendanceData, schoolData, mode, date, period }) => {
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

  const rowsPerPage = 25;
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
            {kopSuratUrl && (
              <Image src={getStaticFile(kopSuratUrl)} style={pdfStyles.headerImage} />
            )}
          </View>
          <View style={pdfStyles.contentWrapper}>
            <Text style={pdfStyles.title}>Laporan Kehadiran Siswa</Text>
            <Text style={pdfStyles.content}>
              Mode: {mode === 'daily' ? 'Harian' : 'Bulanan'}
            </Text>
            <Text style={pdfStyles.content}>
              {mode === 'daily'
                ? `Tanggal: ${date || 'Tanggal Tidak Diketahui'}`
                : `Periode: ${period || 'Periode Tidak Diketahui'}`}
            </Text>
            <View style={pdfStyles.table}>
              <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]} fixed>
                {['No', 'Nama', 'NISN', 'Kelas', 'Sekolah', 'Status', 'Jam Masuk', 'Jam Pulang'].map((header, index) => (
                  <View
                    key={index}
                    style={[
                      pdfStyles.tableCell,
                      pdfStyles.tableHeader,
                      {
                        width: index === 0 ? '5%' : index === 1 ? '20%' : index === 2 ? '15%' : index === 3 ? '10%' : index === 4 ? '15%' : index === 5 ? '10%' : '15%',
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
                  <View style={[pdfStyles.tableCell, { width: '20%' }]}>
                    <Text>{item?.Nama || '-'}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: '15%' }]}>
                    <Text>{item?.NISN || '-'}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: '10%' }]}>
                    <Text>{item?.Kelas || '-'}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: '15%' }]}>
                    <Text>{item?.Sekolah || '-'}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: '10%' }]}>
                    <Text>{item?.StatusKehadiran || '-'}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: '15%' }]}>
                    <Text>{item?.JamMasuk || '-'}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: '15%' }]}>
                    <Text>{item?.JamPulang || '-'}</Text>
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
const generateStudentAttendancePDF = async ({
  attendanceData,
  alert,
  schoolData,
  schoolIsLoading,
  mode,
  date,
  period,
}: {
  attendanceData: any[];
  alert: { success: (msg: string) => void; error: (msg: string) => void } | undefined;
  schoolData: any;
  schoolIsLoading: boolean;
  mode: 'daily' | 'monthly';
  date?: string;
  period?: string;
}) => {
  if (!alert) {
    console.error('Alert system is not available');
    return;
  }

  if (schoolIsLoading) {
    alert.error('Data sekolah masih dimuat, silakan coba lagi.');
    return;
  }

  if (!attendanceData || !Array.isArray(attendanceData) || attendanceData.length === 0) {
    alert.error('Tidak ada data kehadiran untuk dihasilkan.');
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
      <StudentAttendancePDF
        attendanceData={attendanceData}
        schoolData={{
          namaSekolah: schoolData.namaSekolah || 'Nama Sekolah',
          kopSurat: schoolData.kopSurat || undefined,
          namaKepalaSekolah: schoolData.namaKepalaSekolah || 'Nama Kepala Sekolah',
          ttdKepalaSekolah: schoolData.ttdKepalaSekolah || undefined,
        }}
        mode={mode}
        date={date}
        period={period}
      />
    );

    const pdfInstance = pdf(doc);
    const pdfBlob = await pdfInstance.toBlob();

    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Laporan-Kehadiran-Siswa-${mode}-${dayjs().format('YYYYMMDD')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    alert.success('Laporan kehadiran siswa berhasil diunduh.');
  } catch (error) {
    console.error('Error generating attendance PDF:', error);
    alert.error('Gagal menghasilkan laporan kehadiran siswa.');
  }
};

export const StudentAttendance = () => {
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataMode, setDataMode] = useState<'daily' | 'monthly'>('daily');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [exportLoading, setExportLoading] = useState<{
      csv: boolean;
      excel: boolean;
      pdf: boolean;
  }>({ csv: false, excel: false, pdf: false });

  useEffect(() => {
    localStorage.setItem("attendanceTarget", "students");
  }, []);

  const profile = useProfile();
  const alert = useAlert();
  const classRoom = useClassroom();

  console.log('Profileee:', profile)
  const biodata = useBiodataNew(profile?.user?.sekolahId);
  const biodataAll = useBiodata();
  // const { data: schoolData, isLoading: schoolIsLoading } = useSchoolDetail({ id: profile?.user?.sekolahId});
  const schoolData = useSchool()
  console.log('STUDENT ATTEDANCE - ABSENHARIINI', biodata?.data);
  console.log('biodataAll', biodataAll?.data);
  console.log('schoolData', schoolData);

  const [selectedStartMonth, setSelectedStartMonth] = useState<string>(
    dayjs().tz('Asia/Jakarta').startOf('month').format('YYYY-MM')
  );
  const [selectedEndMonth, setSelectedEndMonth] = useState<string>(
    dayjs().tz('Asia/Jakarta').format('YYYY-MM')
  );

  const formatTime = (time?: string) => {
    return time
      ? dayjs(time).tz('Asia/Jakarta').format('DD MMM YYYY, HH:mm:ss')
      : 'N/A';
  };

  const filteredData = useMemo(() => {
    if (dataMode === 'daily') {
      const todayDate = dayjs().tz('Asia/Jakarta').format('DD MMMM YYYY');
      const combinedData = [];

      const daftarAbsen = Array.from(
        new Map(
          biodata.data?.absenHariIni?.map(item => [item.nis, item]) || []
        ).values()
      );

      console.log('biodata.data?.absenHariIni', biodata.data?.absenHariIni)
      console.log('daftarAbsen', daftarAbsen)

      // Data dari absenHariIni (Hadir)
      if (biodata.data?.absenHariIni && Array.isArray(biodata.data.absenHariIni)) {
        combinedData.push(
          ...daftarAbsen.map((student) => ({
            user: {
              name: student.name || '-',
              nis: student.nis || '-',
              nisn: student.nisn || '-',
              sekolah: {
                namaSekolah: schoolData?.data?.[0]?.namaSekolah || '-',
              },
            },
            kelas: {
              namaKelas: student.namaKelas || '-',
            },
            attendance: {
              statusKehadiran: 'Hadir',
              tanggalMasuk: todayDate,
            },
          }))
        );
      }

      // Data dari dispenHariIni (Dispen)
      if (biodata.data?.dispenHariIni && Array.isArray(biodata.data.dispenHariIni)) {
        combinedData.push(
          ...biodata.data.dispenHariIni.map((student) => ({
            user: {
              name: student.name || '-',
              nisn: student.nisn || '-',
              sekolah: {
                namaSekolah: schoolData?.data?.[0]?.namaSekolah || 'N/A',
              },
            },
            kelas: {
              namaKelas: student.namaKelas || 'N/A',
            },
            attendance: {
              statusKehadiran: 'Dispen',
              tanggalMasuk: todayDate,
            },
          }))
        );
      }

      // Data dari sakitHariIni (Sakit)
      if (biodata.data?.sakitHariIni && Array.isArray(biodata.data.sakitHariIni)) {
        combinedData.push(
          ...biodata.data.sakitHariIni.map((student) => ({
            user: {
              name: student.name || '-',
              nis: student.nis || '-',
              nisn: student.nisn || '-',
              sekolah: {
                namaSekolah: schoolData?.data?.[0]?.namaSekolah || 'N/A',
              },
            },
            kelas: {
              namaKelas: student.namaKelas || 'N/A',
            },
            attendance: {
              statusKehadiran: 'Sakit',
              tanggalMasuk: todayDate,
            },
          }))
        );
      }

      // Filter berdasarkan kelas yang dipilih
      return combinedData.filter((student) =>
        selectedClass ? student.kelas.namaKelas === selectedClass : true
      );
    } else {
      if (Array.isArray(biodataAll.data) && biodataAll.data.length > 0) {
        return biodataAll.data
          .flatMap((student) =>
            student.absensis
              ?.filter((attendance) =>
                dayjs(attendance.jamMasuk)
                  .tz('Asia/Jakarta')
                  .isBetween(
                    dayjs(selectedStartMonth).startOf('month'),
                    dayjs(selectedEndMonth).endOf('month'),
                    null,
                    '[]'
                  )
              )
              .map((attendance) => ({
                ...student,
                attendance: {
                  ...attendance,
                  jamMasuk: formatTime(attendance.jamMasuk),
                  jamPulang: formatTime(attendance.jamPulang),
                },
              }))
          )
          .filter((student) =>
            selectedClass ? student.kelas?.namaKelas === selectedClass : true
          ) || [];
      }
      return [];
    }
  }, [dataMode, biodata.data, biodataAll.data, selectedStartMonth, selectedEndMonth, selectedClass, schoolData]);
  
  useEffect(() => {
    setIsLoading(
      (dataMode === 'daily' && biodata.isLoading) ||
      (dataMode !== 'daily' && biodataAll.isLoading)
    );
  }, [dataMode, biodata.isLoading, biodataAll.isLoading]);

  console.log('STUDENT ATTEDANCE - DATA::', filteredData);
  
 const handleExport = async (format: 'csv' | 'excel' | 'pdf') => {
  if (filteredData.length === 0) {
    alert.error('Tidak ada data untuk diekspor.');
    return;
  }

  setExportLoading((prev) => ({ ...prev, [format]: true }));

  const exportData = filteredData.map((data, index) => ({
    No: index + 1,
    Nama: data.user?.name || '',
    NISN: data.user?.nisn || '',
    Kelas: data.kelas?.namaKelas || 'N/A',
    Sekolah: data.user?.sekolah?.namaSekolah || 'N/A',
    StatusKehadiran: data.attendance?.statusKehadiran || 'N/A',
    ...(dataMode === 'daily'
      ? { TanggalMasuk: data.attendance?.tanggalMasuk || 'N/A' }
      : {
          JamMasuk: data.attendance?.jamMasuk || 'N/A',
          JamPulang: data.attendance?.jamPulang || 'N/A',
        }),
  }));

  if (format === 'csv') {
    const csv = Papa.unparse(exportData, { delimiter: ';' });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `attendance_data_${dataMode}_${dayjs().format('YYYYMMDD')}.csv`;
    link.click();
  } else if (format === 'excel') {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
    XLSX.writeFile(wb, `attendance_data_${dataMode}_${dayjs().format('YYYYMMDD')}.xlsx`);
  } else if (format === 'pdf') {
    await generateStudentAttendancePDF({
      attendanceData: exportData,
      alert,
      schoolData: schoolData?.data?.[0] || {},
      schoolIsLoading: schoolData?.isLoading,
      mode: dataMode,
      date: dataMode === 'daily' ? dayjs().tz('Asia/Jakarta').format('DD MMMM YYYY') : undefined,
      period: dataMode === 'monthly' ? `${dayjs(selectedStartMonth).format('MMMM, YYYY')}` : undefined,
    });
  }

  setIsModalOpen(false);
  setExportLoading((prev) => ({ ...prev, [format]: false }));
};

  const attendanceCount = filteredData.length;

  return (
    <DashboardPageLayout
      siteTitle={`${lang.text('studentAttendance')} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        { label: lang.text('studentAttendance'), url: '/students' },
      ]}
      title={lang.text('studentAttendance')}
    >
      <div className="flex justify-between items-center mb-4 space-x-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg transition duration-300"
          >
            {lang.text('export')} Data

            <FaFile />
          </Button>
          <Select value={dataMode} onValueChange={(value: 'daily' | 'monthly') => setDataMode(value)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Pilih mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">{lang.text('daily')}</SelectItem>
              <SelectItem value="monthly">{lang.text('monthly')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="outline"
          aria-label="attendanceCount"
          className="hover:bg-transparent cursor-default"
        >
          {lang.text('presentToday')}: 
          <div className="w-[1px] h-[10px] bg-white mx-1"></div>
          {attendanceCount}
        </Button>
      </div>
      <StudentAttendanceTable data={filteredData} isLoading={isLoading} />
      <div className="pb-16 sm:pb-0" />

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-gray-900 text-white rounded-lg p-6 w-full max-w-md shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">Export & Filter</h2>
            {dataMode === 'monthly' && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Pilih Rentang Bulan
                </label>
                <div className="flex space-x-4">
                  <input
                    type="month"
                    value={selectedStartMonth}
                    onChange={(e) => setSelectedStartMonth(e.target.value)}
                    className="bg-gray-800 text-white p-2 rounded-lg w-full border border-gray-700"
                  />
                  <span className="text-white mt-2">-</span>
                  <input
                    type="month"
                    value={selectedEndMonth}
                    onChange={(e) => setSelectedEndMonth(e.target.value)}
                    className="bg-gray-800 text-white p-2 rounded-lg w-full border border-gray-700"
                  />
                </div>
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Pilih Kelas
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="bg-gray-800 text-white p-2 rounded-lg w-full border border-gray-700"
              >
                <option value="">Semua Kelas</option>
                {classRoom?.data?.map((kelas) => (
                  <option key={kelas?.id} value={kelas?.namaKelas}>
                    {kelas?.namaKelas}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => handleExport('csv')}
                className={`flex active:scale-[0.98] hover:brightness-95 items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 w-full ${
                  exportLoading.csv ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={exportLoading.csv}
              >
                {exportLoading.csv ? (
                  <>
                    Memproses...
                  </>
                ) : (
                  'Export CSV'
                )}
              </button>
              <button
                onClick={() => handleExport('excel')}
                className={`flex active:scale-[0.98] hover:brightness-95 items-center justify-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 w-full ${
                  exportLoading.excel ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={exportLoading.excel}
              >
                {exportLoading.excel ? (
                  <>
                    Memproses...
                  </>
                ) : (
                  'Export Excel'
                )}
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className={`flex active:scale-[0.98] hover:brightness-95 items-center justify-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 w-full ${
                  exportLoading.pdf ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={exportLoading.pdf}
              >
                {exportLoading.pdf ? (
                  <>
                    Memproses...
                  </>
                ) : (
                  'Export PDF'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardPageLayout>
  );
};
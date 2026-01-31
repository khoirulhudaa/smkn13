// import { Badge, Button, Checkbox, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Input, lang, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/libs";
// import { useAlert } from "@/features/_global";
// import { useClassroom } from "@/features/classroom";
// import { useCourse } from "@/features/course";
// import { useProfile } from "@/features/profile";
// import { useSchool } from "@/features/schools";
// import { useBiodata } from "@/features/user";
// import { storage } from '@itokun99/secure-storage';
// import { Document, Image, Page, pdf, StyleSheet, Text, View } from '@react-pdf/renderer';
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { parseISO } from "date-fns";
// import dayjs from "dayjs";
// import { BookPlus, LayoutGrid, LayoutList, RefreshCw, Repeat, Users } from "lucide-react";
// import { useEffect, useMemo, useState } from "react";
// import { FaFilePdf, FaSpinner } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import AttendanceCard from "../components/attendanceCard";
// import QRCodeDisplay from "../components/QrcodeDisplay";
// import { absenManual, fetchAttendanceByQrID, generateQrCodeApi } from "../utils";

// const pdfStyles = StyleSheet.create({
//   page: {
//     fontSize: 12,
//     fontFamily: 'Times-Roman',
//   },
//   header: {
//     position: 'relative',
//     top: 0,
//     left: 0,
//     right: 0,
//     marginBottom: 20,
//   },
//   headerImage: {
//     width: 595,
//     maxHeight: 150,
//     objectFit: 'contain',
//   },
//   contentWrapper: {
//     paddingLeft: 32,
//     paddingRight: 32,
//     marginTop: 10,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 5,
//     textTransform: 'uppercase',
//   },
//   content: {
//     marginBottom: 2,
//     textAlign: 'center',
//     lineHeight: 1.5,
//   },
//   table: {
//     display: 'flex',
//     flexDirection: 'column',
//     borderStyle: 'solid',
//     borderWidth: 1,
//     borderColor: '#000',
//   },
//   tableRow: {
//     flexDirection: 'row',
//     borderBottomWidth: 1,
//     borderBottomColor: '#000',
//   },
//   tableCell: {
//     padding: 5,
//     borderRightWidth: 1,
//     borderRightColor: '#000',
//     textAlign: 'center',
//   },
//   tableHeader: {
//     fontWeight: 'bold',
//     backgroundColor: '#f0f0f0',
//   },
//   signature: {
//     marginTop: 50,
//     alignItems: 'flex-end',
//   },
//   signatureImage: {
//     width: 120,
//     height: 'auto',
//     maxHeight: 50,
//     marginTop: 20,
//     marginBottom: 10,
//   },
//   signatureText: {
//     textAlign: 'center',
//   },
// });

// // Daily Attendance PDF Component (unchanged)
// const DailyAttendancePDF: React.FC<{
//   attendanceData: {
//     namaSiswa: string;
//     nis: string;
//     statusKehadiran: string;
//     tanggal: string;
//   }[];
//   schoolData: {
//     kopSurat: string;
//     namaSekolah: string;
//     namaKepalaSekolah: string;
//     ttdKepalaSekolah: string | undefined;
//   };
//   date: string;
//   guruName?: string;
//   namaMapel?: string;
//   namaKelas?: string;
// }> = ({ attendanceData, schoolData, date, guruName, namaMapel, namaKelas }) => {
//   const kopSuratUrl = schoolData.kopSurat
//     ? schoolData.kopSurat.startsWith('data:image')
//       ? schoolData.kopSurat
//       : `data:image/png;base64,${schoolData.kopSurat}`
//     : '';

//   const signatureUrl = schoolData.ttdKepalaSekolah
//     ? schoolData.ttdKepalaSekolah.startsWith('data:image')
//       ? schoolData.ttdKepalaSekolah
//       : `data:image/png;base64,${schoolData.ttdKepalaSekolah}`
//     : '';

//   const rowsPerPage = 23;
//   const dataChunks = [];
//   for (let i = 0; i < attendanceData.length; i += rowsPerPage) {
//     const chunk = attendanceData.slice(i, i + rowsPerPage);
//     if (chunk.length > 0) {
//       dataChunks.push(chunk);
//     }
//   }

//   return (
//     <Document>
//       {dataChunks.map((chunk, pageIndex) => (
//         <Page
//           key={pageIndex}
//           size="A4"
//           style={pdfStyles.page}
//           break={pageIndex > 0}
//         >
//           <View style={pdfStyles.header} fixed>
//             {kopSuratUrl && <Image src={kopSuratUrl} style={pdfStyles.headerImage} />}
//           </View>
//           <View style={pdfStyles.contentWrapper}>
//             <Text style={pdfStyles.title}>Laporan Absensi Harian</Text>
//             <Text style={pdfStyles.content}>
//               Tanggal: {date || 'Tanggal Tidak Diketahui'}
//             </Text>
//             <View style={{ 
//               flexDirection: 'row', 
//               justifyContent: 'center', 
//               alignItems: 'center', 
//               marginBottom: 10 
//             }}>
//               <Text style={{ marginRight: 10 }}>{guruName}</Text>
//               <Text style={{ marginRight: 10 }}>|</Text>
//               <Text style={{ marginRight: 10 }}>{namaMapel}</Text>
//               <Text style={{ marginRight: 10 }}>|</Text>
//               <Text>{namaKelas}</Text>
//             </View>
//             <View style={pdfStyles.table}>
//               <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]} fixed>
//                 {['No', 'Nama', 'NIS', 'Status Kehadiran', 'Jam Masuk'].map((header, index) => (
//                   <View
//                     key={index}
//                     style={[
//                       pdfStyles.tableCell,
//                       pdfStyles.tableHeader,
//                       {
//                         width:
//                           index === 0 ? '5%' :
//                           index === 1 ? '35%' :
//                           index === 2 ? '20%' :
//                           index === 3 ? '20%' :
//                           '20%',
//                       },
//                     ]}
//                   >
//                     <Text>{header}</Text>
//                   </View>
//                 ))}
//               </View>
//               {chunk.map((item, index) => (
//                 <View style={pdfStyles.tableRow} key={index} wrap={false}>
//                   <View style={[pdfStyles.tableCell, { width: '5%' }]}>
//                     <Text>{pageIndex * rowsPerPage + index + 1}</Text>
//                   </View>
//                   <View style={[pdfStyles.tableCell, { width: '35%' }]}>
//                     <Text>{item.namaSiswa || '-'}</Text>
//                   </View>
//                   <View style={[pdfStyles.tableCell, { width: '20%' }]}>
//                     <Text>{item.nis || '-'}</Text>
//                   </View>
//                   <View style={[pdfStyles.tableCell, { width: '20%' }]}>
//                     <Text>{item.statusKehadiran || '-'}</Text>
//                   </View>
//                   <View style={[pdfStyles.tableCell, { width: '20%' }]}>
//                     <Text>{dayjs(item.tanggal).tz("Asia/Jakarta").format("HH:mm") || '-'}</Text>
//                   </View>
//                 </View>
//               ))}
//             </View>
//             {pageIndex === dataChunks.length - 1 && (
//               <View style={pdfStyles.signature}>
//                 <Text style={pdfStyles.signatureText}>Kepala Sekolah,</Text>
//                 {signatureUrl && (
//                   <Image src={signatureUrl} style={pdfStyles.signatureImage} />
//                 )}
//                 <Text style={pdfStyles.signatureText}>{schoolData.namaKepalaSekolah || 'Nama Kepala Sekolah'}</Text>
//               </View>
//             )}
//           </View>
//         </Page>
//       ))}
//     </Document>
//   );
// };

// // Generate PDF Function (unchanged)
// const generateAttendancePDF = async ({
//   attendanceData,
//   alert,
//   schoolData,
//   schoolIsLoading,
//   guruName,
//   namaMapel,
//   namaKelas 
// }: {
//   attendanceData: any[];
//   alert: any;
//   schoolData: any;
//   schoolIsLoading: boolean;
//   guruName?: string;
//   namaMapel?: string;
//   namaKelas?: string;
// }) => {
//   if (schoolIsLoading) {
//     alert.error('Data sekolah masih dimuat, silakan coba lagi.');
//     return;
//   }

//   if (!attendanceData || attendanceData.length === 0) {
//     alert.error('Tidak ada data absensi untuk dihasilkan.');
//     return;
//   }

//   const selectedCourse = JSON.parse(localStorage.getItem('selectedCourse') || '{}');
//   const selectedClass = JSON.parse(localStorage.getItem('selectedClass') || '{}');
//   const selectedNamaMataPelajaran = selectedCourse.namaMataPelajaran || '';
//   const selectedKelas = selectedClass.namaKelas || '';

//   try {
//     const doc = (
//        <DailyAttendancePDF
//         attendanceData={attendanceData}
//         schoolData={{
//           namaSekolah: schoolData?.[0]?.namaSekolah || 'Nama Sekolah',
//           kopSurat: schoolData?.[0]?.kopSurat || '',
//           namaKepalaSekolah: schoolData?.[0]?.namaKepalaSekolah || 'Nama Kepala Sekolah',
//           ttdKepalaSekolah: schoolData?.[0]?.ttdKepalaSekolah,
//         }}
//         date={dayjs().format('DD MMMM YYYY')}
//         guruName={guruName}
//         namaMapel={selectedNamaMataPelajaran}
//         namaKelas={selectedKelas}
//       />
//     );

//     const pdfInstance = pdf(doc);
//     const pdfBlob = await pdfInstance.toBlob();

//     const url = window.URL.createObjectURL(pdfBlob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = `Laporan-Absensi-Harian-${dayjs().format('YYYY-MM-DD')}.pdf`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     window.URL.revokeObjectURL(url);

//     alert.success('Laporan absensi harian berhasil diunduh.');
//   } catch (error) {
//     console.error('Error generating daily attendance PDF:', error);
//     alert.error('Gagal menghasilkan laporan absensi harian.');
//   }
// };

// // Mock function for posting manual attendance (replace with actual API call)
// const postManualAttendance = async (qrId: string, studentId: number) => {
//   try {
//     const response = await fetch(`/absen-manual-mapel/${qrId}`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ studentId }),
//     });
//     if (!response.ok) throw new Error('Failed to submit manual attendance');
//     return await response.json();
//   } catch (error) {
//     alert.error(error,message || 'Gagal melakukan absen manual')
//     throw error;
//   }
// };

// export function HistoryAttendance() {
//   const [qrCodeData, setQrCodeData] = useState<any>(null);
//   const [loading, setLoading] = useState(false);
//   const [isQrDisabled, setIsQrDisabled] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [displayMode, setDisplayMode] = useState<'single' | 'grid'>('grid');
//   const [alertMessage, setAlertMessage] = useState<string | null>(null);
//   const [manualLoading, setManualLoading] = useState(false);
//   const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [refreshKey, setRefreshKey] = useState(0);
//   const { data: schoolData, isLoading: schoolIsLoading } = useSchool();
//   const classRoom = useClassroom();
//   const profile = useProfile();
//   const course = useCourse();
//   const student = useBiodata();
//   const QueryClient = useQueryClient();
//   const navigate = useNavigate();
//   const alert = useAlert();

//   console.log('rpfile', profile?.user)

//   useEffect(() => {
//     if (profile?.user) {
//       const allowedRoles = ['guru'];
//       if (!profile.user.role || !allowedRoles.includes(profile.user.role)) {
//         storage.delete("auth.token");
//         QueryClient.clear();
//         navigate("/auth/login", { replace: true });
//       }
//     }
//   }, [profile?.user]);

//   const parsedStudents = useMemo(() => {
//     try {
//       return typeof student.data === "string"
//         ? JSON.parse(student.data)
//         : student.data || [];
//     } catch (error) {
//       console.error("Gagal parse student.data:", error);
//       return [];
//     }
//   }, [student.data, refreshKey]);

//   const handleRefetch = async () => {
//     setManualLoading(true);
//     await refetch();
//     setManualLoading(false);
//   };

//   const { data: attendanceData, isLoading, isFetching, refetch } = useQuery({
//     queryKey: ['attendanceByQr', profile?.user?.sekolahId],
//     queryFn: () => fetchAttendanceByQrID(500, profile?.user?.sekolahId),
//     enabled: false,
//     staleTime: 1 * 60 * 1000,
//     retry: true,
//   });

//   const generateQrCode = async (data: {
//     kelasId: string;
//     mataPelajaranId: string;
//   }) => {
//     setLoading(true);
//     setIsQrDisabled(true);
//     try {
//       const qrCode = await generateQrCodeApi(data);
//       if (!qrCode) {
//         setError("Gagal menghasilkan QR Code. Silakan coba lagi.");
//         setIsQrDisabled(false);
//       } else {
//         setError(null);
//         setQrCodeData(qrCode?.qrCodeData)
//         setAlertMessage("Sukses regenerate QR Code!");
//         await refetch()
//         setTimeout(() => setAlertMessage(null), 3000);
//       }
//     } catch (error) {
//       setError("Gagal menghasilkan QR Code. Silakan periksa koneksi Anda.");
//     } finally {
//       await refetch()
//       setLoading(false);
//       setIsQrDisabled(false);
//     }
//   };

//   useEffect(() => {
//     const savedQr = localStorage.getItem("qrCodeData");
//     const savedDate = localStorage.getItem("qrGeneratedDate");

//     if (savedQr && savedDate) {
//       const lastGeneratedDate = parseISO(savedDate);
//       const now = new Date();

//       const resetTime = new Date(lastGeneratedDate);
//       resetTime.setDate(resetTime.getDate() + 1);
//       resetTime.setHours(6, 0, 0, 0);

//       if (now >= resetTime) {
//         localStorage.removeItem("qrCodeData");
//         localStorage.removeItem("qrGeneratedDate");
//         setQrCodeData(null);
//         setIsQrDisabled(false);
//       } else {
//         try {
//           setQrCodeData(JSON.parse(savedQr));
//         } catch (error) {
//           console.error("❌ Gagal parsing qrCodeData dari localStorage:", error);
//           setQrCodeData(null);
//         }
//       }
//     }
//   }, []);

//   const handleDownloadPDF = async () => {
//     const selectedCourse = JSON.parse(localStorage.getItem('selectedCourse') || '{}');
//     const selectedClass = JSON.parse(localStorage.getItem('selectedClass') || '{}');
//     const selectedNamaMataPelajaran = selectedCourse.namaMataPelajaran || '';

//     setIsGeneratingPDF(true);
//     const today = new Date();
//     today.setHours(today.getHours() + 7);
//     const todayString = today.toISOString().split('T')[0];

//     const filteredAttendanceData = attendanceData.filter((data) => {
//       const dataDate = new Date(data.tanggal);
//       dataDate.setHours(dataDate.getHours() + 7);
//       const dataDateString = dataDate.toISOString().split('T')[0];
//       const isSameDate = dataDateString === todayString;
//       const isMatchingCourse = selectedNamaMataPelajaran
//         ? data.namaMataPelajaran === selectedNamaMataPelajaran
//         : true;
//       return isSameDate && isMatchingCourse;
//     });

//     await generateAttendancePDF({
//       attendanceData: filteredAttendanceData,
//       alert,
//       schoolData,
//       schoolIsLoading,
//       guruName: profile?.user?.name || '-',
//       namaMapel: course?.data?.find((c) => c.id === qrCodeData?.AbsensiMp?.idMataPelajaran)?.namaMataPelajaran || '-',
//       namaKelas: classRoom?.data?.find((k) => k.id === qrCodeData?.AbsensiMp?.idKelas)?.namaKelas || '-',
//     });
//     setIsGeneratingPDF(false);
//   };

//   const handleManual = async () => {
//      if (selectedStudentIds.length !== 1) return;
//     const selectedStudentId = selectedStudentIds[0];

//     if (!qrCodeData) {
//       alert.error('QR Code tidak tersedia.');
//       return;
//     }

//     setManualLoading(true);
//     try {
//       await absenManual(parseInt(selectedStudentId), "hadir");
//       setIsModalOpen(false);
//       setSelectedStudentIds([]);
//       setSearchQuery('');
//       alert.success('Berhasil melakukan absen manual');
//       await refetch();
//     } catch (error) {
//       alert.error(error.message || 'Gagal mengirim absensi manual.');
//     } finally {
//       setManualLoading(false);
//     }
//   };

//   const formatJamMasuk = (jamMasuk?: string | null) => {
//     if (!jamMasuk) return "Tidak Tersedia";
//     return dayjs(jamMasuk)
//       .tz("Asia/Jakarta")
//       .format("dddd, DD MMMM YYYY, HH:mm");
//   };

//   const selectedClass = JSON.parse(localStorage.getItem('selectedClass') || '{}');

//   const filteredStudents = parsedStudents?.filter((student: any) => {
//     const searchLower = searchQuery.toLowerCase();
//     const isClassMatch = student?.kelas?.id && selectedClass?.idKelas
//       ? student.kelas.id === Number(selectedClass.idKelas)
//       : false;

//     return (
//       isClassMatch &&
//       (student?.user?.name?.toLowerCase().includes(searchLower) ||
//         student?.user?.nis?.toLowerCase().includes(searchLower) ||
//         student?.user?.nisn?.toLowerCase().includes(searchLower))
//     );
//   }) || [];

//   const selectedCourse = JSON.parse(localStorage.getItem('selectedCourse') || '{}');
//   const selectedNamaMataPelajaran = selectedCourse.namaMataPelajaran || '';

//   const today = new Date();
//   today.setHours(today.getHours() + 7);
//   const todayString = today.toISOString().split('T')[0];

//   const filteredAttendanceData2 = attendanceData && attendanceData?.filter((data) => {
//     const dataDate = new Date(data.tanggal);
//     dataDate.setHours(dataDate.getHours() + 7);
//     const dataDateString = dataDate.toISOString().split('T')[0];
//     const isSameDate = dataDateString === todayString;
//     const isMatchingCourse = selectedNamaMataPelajaran
//       ? data.namaMataPelajaran === selectedNamaMataPelajaran
//       : true;

//     return isSameDate && isMatchingCourse;
//   });

//   const handleManualBulk = async (specificStudentIds?: number[]) => {
//     const allClassStudents = parsedStudents.filter((student: any) => {
//       const selectedClass = JSON.parse(localStorage.getItem('selectedClass') || '{}');
//       const idKelas = selectedClass?.idKelas || null;
//       const matchClass = idKelas ? student?.kelas?.id === Number(idKelas) : true;
//       const isActive = student?.user?.isActive !== 0;

//       return matchClass && isActive;
//     });

//     const studentIds = specificStudentIds || allClassStudents.map((student: any) => parseInt(student.id));

//     if (studentIds.length === 0) {
//       alert.error('Tidak ada siswa yang memenuhi kriteria.');
//       return;
//     }

//     setManualLoading(true);
//     try {
//       await Promise.all(
//         studentIds.map((studentId) => absenManual(studentId, "hadir"))
//       );
//       await refetch();
//       alert.success(`Berhasil melakukan absen manual untuk ${studentIds.length} siswa`);
//       setSelectedStudentIds([]);
//       setIsModalOpen(false);
      
//     } catch (error) {
//       const errorMessage = error instanceof Error ? error.message : 'Gagal melakukan absen manual';
//       if (errorMessage.includes('Siswa sudah absen') || errorMessage.includes('entity')) {
//         alert.success('Berhasil melakukan absen manual untuk semua siswa');
//         await refetch();
//         setSelectedStudentIds([]);
//         setIsModalOpen(false);
//         // alert.success('Beberapa siswa sudah absen sebelumnya.');
//       } else {
//         await refetch();
//         setSelectedStudentIds([]);
//         setIsModalOpen(false);
//         alert.error(errorMessage);
//       }
//     } finally {
//       setManualLoading(false);
//     }
//   };

//   return (
//     <div className="h-max p-8 relative">
//       {alertMessage && (
//         <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50 animate-fade-in" role="alert">
//           {alertMessage}
//         </div>
//       )}

//       <style>{`
//         @keyframes fadeIn {
//           0% { opacity: 0; transform: translateY(-10px); }
//           100% { opacity: 1; transform: translateY(0); }
//         }
//         .animate-fade-in {
//           animation: fadeIn 0.3s ease-in;
//         }
//       `}</style>

//       <h2 className="text-xl font-sembold text-gray-800 dark:text-white">
//         {lang.text('historyAttendanceMapel')}
//       </h2>

//       <div className="mt-4 flex">

//         <div className="w-[80%] overflow-hidden flex flex-col border-t border-white/20">
//           <div className="flex px-6 items-center gap-4 border-l border-b border-black dark:border-white/20 py-6 mb-2">
//             <Button onClick={handleRefetch} className="uppercase h-[40px] text-[15.5px] flex items-center gap-4">
//               <p className="relative top-[1px]">
//                 {lang.text('reloadData')}
//               </p>
//               <Repeat />
//             </Button>
//             <Badge className="pt-1 h-[40px] flex items-center gap-4" variant="outline">
//               <p className="uppercase text-[15px] relative bottom-[1px]">{lang.text('presentToday')}</p>
//               <p className="text-[17px] font-normal">
//                 {(() => {
//                   const selectedCourse = JSON.parse(localStorage.getItem('selectedCourse') || '{}');
//                   const selectedNamaMataPelajaran = selectedCourse.namaMataPelajaran || '';
//                   const today = new Date();
//                   today.setHours(today.getHours() + 7);
//                   const todayString = today.toISOString().split('T')[0];

//                   const filteredAttendanceData = (attendanceData || []).filter((data) => {
//                     const dataDate = new Date(data.tanggal);
//                     dataDate.setHours(dataDate.getHours() + 7);
//                     const dataDateString = dataDate.toISOString().split('T')[0];
//                     const isSameDate = dataDateString === todayString;
//                     const statusKehadiran = data?.statusKehadiran === 'hadir';
//                     const isMatchingCourse = selectedNamaMataPelajaran
//                       ? data.namaMataPelajaran === selectedNamaMataPelajaran
//                       : true;
//                     return isSameDate && isMatchingCourse && statusKehadiran;
//                   });

//                   return filteredAttendanceData.length;
//                 })()}
//               </p>
//             </Badge>

//             <div className="w-[1px] h-[30px] bg-white/40"></div>

//             <Button
//               onClick={() => setIsModalOpen(true)}
//               className="uppercase pt-1 h-[40px] text-[15.5px] flex items-center gap-4"
//               variant="outline"
//               disabled={manualLoading}
//             >
//               {manualLoading ? (
//                 <>
//                   <p>Mengirim...</p>
//                   <FaSpinner className="animate-spin duration-[2s]" />
//                 </>
//               ) : (
//                 <p className="flex items-center w-max gap-3">
//                   <span className="relative top-[1.2px]">
//                     Absensi Manual 
//                   </span>
//                   <BookPlus /></p>
//               )}
//             </Button>
//             <Button
//               onClick={() => handleManualBulk()}
//               className="uppercase pt-1 h-[40px] text-[15.5px] flex items-center gap-4 border border-blue-700 bg-transparent text-black dark:text-blue-300"
//               variant="outline"
//               disabled={manualLoading}
//             >
//               <p className="flex items-center w-max gap-3">
//                 <span className="relative top-[1.8px]">
//                   Absen Semua Siswa 
//                 </span>
//                 <Users className="relative top-[1.2px]" />
//               </p>  
//             </Button>
//             <div className="flex items-center gap-4 ml-auto">
//               <Button
//                 onClick={handleDownloadPDF}
//                 className="flex w-max items-center h-[40px] px-3 rounded-md text-red-300 border border-red-500 bg-transparent hover:bg-white/10"
//                 title="Export as PDF"
//                 disabled={isGeneratingPDF}
//               >
//                 {isGeneratingPDF ? (
//                   <>
//                     <p>Generating PDF...</p>
//                     <FaSpinner className="ml-3 animate-spin duration-[2s]" />
//                   </>
//                 ) : (
//                   <>
//                     <p>EXPORT PDF</p>
//                     <FaFilePdf className="ml-3 text-red-300" />
//                   </>
//                 )}
//               </Button>
//               <button
//                 onClick={() => setDisplayMode('single')}
//                 className={`p-2 rounded-md text-white ${displayMode === 'single' ? 'bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'}`}
//               >
//                 <LayoutList size={24} />
//               </button>
//               <button
//                 onClick={() => setDisplayMode('grid')}
//                 className={`p-2 rounded-md text-white ${displayMode === 'grid' ? 'bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'}`}
//               >
//                 <LayoutGrid size={24} />
//               </button>
//             </div>
//           </div>
//           <div
//             className={`
//               w-[100%] h-[70vh] overflow-y-auto border-l py-4 px-6 border-b border-black dark:border-white/20
//               grid
//               ${
//                 displayMode === 'single'
//                 ? 'grid-cols-[minmax(260px,auto)]'
//                 : filteredAttendanceData2?.length === 1
//                 ? 'grid-cols-3'
//                 : 'grid-cols-[repeat(auto-fit,minmax(260px,1fr))]'
//               } gap-6 pb-28
//             `}
//           >
//             {isFetching || isLoading || manualLoading ? (
//               <div className="gap-4 w-full h-[30vh] border border-dashed border-black dark:border-white/20 rounded-lg flex justify-center items-center mt-10 col-span-full">
//                 <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
//                   {lang.text('loadData')}
//                 </p>
//                 <FaSpinner className="animate-spin duration-[2s]" />
//               </div>
//             ) : error ? (
//               <div className="text-gray-500 text-center w-max mt-10">{error}</div>
//             ) : (attendanceData?.length ?? 0) > 0 ? (
//               (() => {
//                 const selectedCourse = JSON.parse(localStorage.getItem('selectedCourse') || '{}');
//                 const selectedClass = JSON.parse(localStorage.getItem('selectedClass') || '{}');
//                 const selectedNamaMataPelajaran = selectedCourse.namaMataPelajaran || '';
//                 const selectedKelas = selectedClass.namaKelas || '';

//                 const today = new Date();
//                 today.setHours(today.getHours() + 7);
//                 const todayString = today.toISOString().split('T')[0];

//                 const filteredAttendanceData = attendanceData.filter((data) => {
//                   const dataDate = new Date(data.tanggal);
//                   dataDate.setHours(dataDate.getHours() + 7);
//                   const dataDateString = dataDate.toISOString().split('T')[0];
//                   const isSameDate = dataDateString === todayString;
//                   const isMatchingCourse = selectedNamaMataPelajaran
//                     ? data.namaMataPelajaran === selectedNamaMataPelajaran
//                     : true;

//                   return isMatchingCourse;
//                 });

//                 return filteredAttendanceData.length > 0 ? (
//                   filteredAttendanceData
//                     .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
//                     .map((data, index) => (
//                       <AttendanceCard
//                         key={index}
//                         data={data}
//                         isSpecial={index === 0}
//                         displayMode={displayMode}
//                         selectedClass={selectedKelas}
//                         refetch={refetch} // Pass refetch to AttendanceCard
//                       />
//                     ))
//                 ) : (
//                   <div className="w-full h-[30vh] border border-dashed border-black dark:border-white/20 rounded-lg flex flex-col justify-center items-center col-span-full">
//                     <img src="/files.png" alt="file icon" className="w-[120px]" />
//                     <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
//                       {lang.text('notFoundDataByClass')}
//                     </p>
//                   </div>
//                 );
//               })()
//             ) : (
//               <div className="w-full h-[30vh] border border-dashed border-black dark:border-white/20 rounded-lg flex flex-col justify-center items-center col-span-full">
//                 <img src="/files.png" alt="file icon" className="w-[120px]" />
//                 <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
//                   {lang.text('notFoundDataByClass')}
//                 </p>
//               </div>
//             )}
//           </div>

//         </div>
//         <div className="w-[20%] min-h-[73vh] py-4 border-r border-t border-b border-black pb-8 px-6 border-l dark:border-white/20">
//           <div className="w-full flex flex-col text-center items-center justify-center">
//             <div className="w-[180px] h-[180px] rounded-full overflow-hidden bg-white/30 mt-4">
//               <img src={profile?.user?.image ? `https://dev.kiraproject.id${profile?.user?.image}`: '/defaultProfile.png'} alt="foto-profile" />
//             </div>
//             <div className="mt-4">
//               <p className="text-lg">{profile?.user?.name || '-'}</p>
//               <small className="text-slate-400">Guru {JSON.parse(localStorage.getItem('selectedCourse') || '{}')?.namaMataPelajaran || 'pengajar'}</small>
//             </div>
//           </div>
//           <QRCodeDisplay
//             generateQrCode={generateQrCode}
//             qrCodeData={qrCodeData || null}
//             isDisabled={loading || isQrDisabled}
//           />
//           <br />
//           {/* {(() => {
//             const selectedCourse = JSON.parse(localStorage.getItem('selectedCourse') || '{}');
//             const selectedNamaMataPelajaran = selectedCourse.namaMataPelajaran || '';
//             const today = new Date();
//             today.setHours(today.getHours() + 7);
//             const todayString = today.toISOString().split('T')[0];

//             const filteredAttendanceData = (attendanceData || []).filter((data) => {
//               const dataDate = new Date(data.tanggal);
//               dataDate.setHours(dataDate.getHours() + 7);
//               const dataDateString = dataDate.toISOString().split('T')[0];
//               const isSameDate = dataDateString === todayString;
//               const statusKehadiran = data?.statusKehadiran === 'hadir';
//               const isMatchingCourse = selectedNamaMataPelajaran
//                 ? data.namaMataPelajaran === selectedNamaMataPelajaran
//                 : true;
//               return isSameDate && isMatchingCourse && statusKehadiran;
//             });

//             const sortedAttendanceData = filteredAttendanceData.sort(
//               (a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime()
//             );

//             return sortedAttendanceData.length > 0 ? (
//               <div className="mt-6 flex flex-col w-full bg-slate-100 h-max border rounded-sm border-black/70 dark:border-white/20 text-white text-sm space-y-2">
//                 <div className="text-black border-b border-black/20 p-4">
//                   <strong>Siswa Pertama Hadir:</strong>
//                   <br />
//                   {sortedAttendanceData[sortedAttendanceData.length - 1].namaSiswa}
//                   <br />
//                   <br />
//                   ({formatJamMasuk(sortedAttendanceData[sortedAttendanceData.length - 1].tanggal)})
//                 </div>
//                 <div className="text-black border-b border-black/20 p-4">
//                   <strong>Siswa Terakhir Hadir:</strong>
//                   <br />
//                   {sortedAttendanceData[0].namaSiswa}
//                   <br />
//                   <br />
//                   ({formatJamMasuk(sortedAttendanceData[0].tanggal)})
//                 </div>
//               </div>
//             ) : null;
//           })()} */}
//         </div>
//       </div>

//       <Dialog open={isModalOpen} onOpenChange={(open) => {
//         setIsModalOpen(open);
//         if (!open) {
//           setSelectedStudentIds([]);
//           setSearchQuery('');
//         }
//       }}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Absensi Manual</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4">
//             <Input
//               placeholder="Cari nama, NIS, atau NISN..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full"
//             />
//             <div className="max-h-[300px] overflow-y-auto">
//               {filteredStudents.length === 0 ? (
//                 <div className="p-4 text-center text-gray-500">
//                   Tidak ada data siswa yang ditemukan.
//                 </div>
//               ) : (
//                 filteredStudents
//                   .filter((student: any) => {
//                     const selectedClass = JSON.parse(localStorage.getItem('selectedClass') || '{}');
//                     const idKelas = selectedClass?.idKelas || null;
//                     const matchClass = idKelas ? student?.kelas?.id === Number(idKelas) : true;
//                     const isActive = student?.user?.isActive !== 0;

//                     return matchClass && isActive;
//                   })
//                   .map((student: any) => (
//                     <div key={student?.id} className="flex items-center space-x-3 py-2">
//                       <Checkbox
//                         id={student.id.toString()}
//                         checked={selectedStudentIds.includes(student.id.toString())}
//                         onCheckedChange={(checked: boolean) => {
//                           const id = student.id.toString();
//                           setSelectedStudentIds((prev) =>
//                             checked ? [...prev, id] : prev.filter((i) => i !== id)
//                           );
//                         }}
//                       />
//                       <label
//                         htmlFor={student.id.toString()}
//                         className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//                       >
//                         {student?.user?.name} ({student?.user?.nis || '-'}) (
//                         {student?.kelas?.namaKelas || 'Belum ada kelas'})
//                       </label>
//                     </div>
//                   ))
//               )}
//             </div>
//           </div>
//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => {
//                 setIsModalOpen(false);
//                 setSelectedStudentIds([]);
//                 setSearchQuery('');
//               }}
//             >
//               Batal
//             </Button>
//             {selectedStudentIds.length <= 1 ? (
//               <Button
//                 onClick={handleManual}
//                 disabled={manualLoading || selectedStudentIds.length === 0}
//               >
//                 {manualLoading ? (
//                   <>
//                     <p>Mengirim...</p>
//                     <FaSpinner className="ml-2 animate-spin duration-[2s]" />
//                   </>
//                 ) : (
//                   'Tambahkan kehadiran'
//                 )}
//               </Button>
//             ) : (
//               <Button
//                 onClick={() => handleManualBulk(selectedStudentIds.map((id) => parseInt(id)))}
//                 disabled={manualLoading}
//               >
//                 {manualLoading ? (
//                   <>
//                     <p>Mengirim...</p>
//                     <FaSpinner className="ml-2 animate-spin duration-[2s]" />
//                   </>
//                 ) : (
//                   `Tambahkan ${selectedStudentIds.length} kehadiran`
//                 )}
//               </Button>
//             )}
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }


import { Badge, Button, Checkbox, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Input, lang, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/libs";
import { useAlert } from "@/features/_global";
import { useClassroom } from "@/features/classroom";
import { useCourse } from "@/features/course";
import { useProfile } from "@/features/profile";
import { useSchool } from "@/features/schools";
import { useBiodata } from "@/features/user";
import { storage } from '@itokun99/secure-storage';
import { Document, Image, Page, pdf, StyleSheet, Text, View } from '@react-pdf/renderer';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { parseISO } from "date-fns";
import dayjs from "dayjs";
import { BookPlus, LayoutGrid, LayoutList, Mail, Phone, RefreshCw, Repeat, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { FaFilePdf, FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AttendanceCard from "../components/attendanceCard";
import QRCodeDisplay from "../components/QrcodeDisplay";
import { absenManual, fetchAttendanceByQrID, generateQrCodeApi } from "../utils";

const pdfStyles = StyleSheet.create({
  page: {
    fontSize: 12,
    fontFamily: "Times-Roman",
  },
   header: {
    position: "relative",
    top: 0,
    left: 0,
    right: 0,
    marginBottom: 20,
  },
  headerImage: {
    width: 595,
    maxHeight: 150,
    objectFit: "contain",
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
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  content: {
    marginBottom: 5,
    textAlign: 'center',
    lineHeight: 1.5,
    fontSize: 12,
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  tableCell: {
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: '#1F2937',
    textAlign: 'center',
    fontSize: 10,
  },
  tableHeader: {
    fontWeight: 'bold',
    backgroundColor: '#F3F4F6',
  },
  signature: {
    marginTop: 40,
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  signatureImage: {
    width: 100,
    height: 'auto',
    maxHeight: 50,
    marginTop: 10,
    marginBottom: 10,
  },
  signatureText: {
    textAlign: 'center',
    fontSize: 12,
  },
});

// Daily Attendance PDF Component
const DailyAttendancePDF: React.FC<{
  attendanceData: {
    namaSiswa: string;
    nis: string;
    statusKehadiran: string;
    tanggal: string;
  }[];
  schoolData: {
    kopSurat: string;
    namaSekolah: string;
    namaKepalaSekolah: string;
    ttdKepalaSekolah: string | undefined;
  };
  date: string;
  guruName?: string;
  namaMapel?: string;
  namaKelas?: string;
}> = ({ attendanceData, schoolData, date, guruName, namaMapel, namaKelas }) => {
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
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'center', 
              alignItems: 'center', 
              marginBottom: 10 
            }}>
              <Text style={{ marginRight: 10 }}>{guruName}</Text>
              <Text style={{ marginRight: 10 }}>|</Text>
              <Text style={{ marginRight: 10 }}>{namaMapel}</Text>
              <Text style={{ marginRight: 10 }}>|</Text>
              <Text>{namaKelas}</Text>
            </View>
            <View style={pdfStyles.table}>
              <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]} fixed>
                {['No', 'Nama', 'NIS', 'Status Kehadiran', 'Jam Masuk'].map((header, index) => (
                  <View
                    key={index}
                    style={[
                      pdfStyles.tableCell,
                      pdfStyles.tableHeader,
                      {
                        width:
                          index === 0 ? '5%' :
                          index === 1 ? '35%' :
                          index === 2 ? '20%' :
                          index === 3 ? '20%' :
                          '20%',
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
                  <View style={[pdfStyles.tableCell, { width: '35%' }]}>
                    <Text>{item.namaSiswa || '-'}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: '20%' }]}>
                    <Text>{item.nis || '-'}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: '20%' }]}>
                    <Text>{item.statusKehadiran || '-'}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: '20%' }]}>
                    <Text>{dayjs(item.tanggal).tz("Asia/Jakarta").format("HH:mm") || '-'}</Text>
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

// Generate PDF Function
const generateAttendancePDF = async ({
  attendanceData,
  alert,
  schoolData,
  schoolIsLoading,
  guruName,
  namaMapel,
  namaKelas 
}: {
  attendanceData: any[];
  alert: any;
  schoolData: any;
  schoolIsLoading: boolean;
  guruName?: string;
  namaMapel?: string;
  namaKelas?: string;
}) => {
  if (schoolIsLoading) {
    alert.error('Data sekolah masih dimuat, silakan coba lagi.');
    return;
  }

  if (!attendanceData || attendanceData.length === 0) {
    alert.error('Tidak ada data absensi untuk dihasilkan.');
    return;
  }

  const selectedCourse = JSON.parse(localStorage.getItem('selectedCourse') || '{}');
  const selectedClass = JSON.parse(localStorage.getItem('selectedClass') || '{}');
  const selectedNamaMataPelajaran = selectedCourse.namaMataPelajaran || '';
  const selectedKelas = selectedClass.namaKelas || '';

  try {
    const doc = (
       <DailyAttendancePDF
        attendanceData={attendanceData}
        schoolData={{
          namaSekolah: schoolData?.[0]?.namaSekolah || 'Nama Sekolah',
          kopSurat: schoolData?.[0]?.kopSurat || '',
          namaKepalaSekolah: schoolData?.[0]?.namaKepalaSekolah || 'Nama Kepala Sekolah',
          ttdKepalaSekolah: schoolData?.[0]?.ttdKepalaSekolah,
        }}
        date={dayjs().format('DD MMMM YYYY')}
        guruName={guruName}
        namaMapel={selectedNamaMataPelajaran}
        namaKelas={selectedKelas}
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

export function HistoryAttendance() {
  const [qrCodeData, setQrCodeData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isQrDisabled, setIsQrDisabled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [displayMode, setDisplayMode] = useState<'single' | 'grid'>('grid');
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [manualLoading, setManualLoading] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const { data: schoolData, isLoading: schoolIsLoading } = useSchool();
  const classRoom = useClassroom();
  const profile = useProfile();
  const course = useCourse();
  const student = useBiodata();
  const QueryClient = useQueryClient();
  const navigate = useNavigate();
  const alert = useAlert();

  useEffect(() => {
    if (profile?.user) {
      const allowedRoles = ['guru'];
      if (!profile.user.role || !allowedRoles.includes(profile.user.role)) {
        storage.delete("auth.token");
        QueryClient.clear();
        navigate("/auth/login", { replace: true });
      }
    }
  }, [profile?.user, QueryClient, navigate]);

  const parsedStudents = useMemo(() => {
    try {
      return typeof student.data === "string"
        ? JSON.parse(student.data)
        : student.data || [];
    } catch (error) {
      console.error("Gagal parse student.data:", error);
      return [];
    }
  }, [student.data, refreshKey]);

  const handleRefetch = async () => {
    setManualLoading(true);
    await refetch();
    setManualLoading(false);
  };

  const { data: attendanceData, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['attendanceByQr', profile?.user?.sekolahId],
    queryFn: () => fetchAttendanceByQrID(500, profile?.user?.sekolahId),
    enabled: false,
    staleTime: 1 * 60 * 1000,
    retry: true,
  });

  const generateQrCode = async (data: {
    kelasId: string;
    mataPelajaranId: string;
  }) => {
    setLoading(true);
    setIsQrDisabled(true);
    try {
      const qrCode = await generateQrCodeApi(data);
      if (!qrCode) {
        setError("Gagal menghasilkan QR Code. Silakan coba lagi.");
        setIsQrDisabled(false);
      } else {
        setError(null);
        setQrCodeData(qrCode?.qrCodeData);
        setAlertMessage("Sukses regenerate QR Code!");
        await refetch();
        setTimeout(() => setAlertMessage(null), 3000);
      }
    } catch (error) {
      setError("Gagal menghasilkan QR Code. Silakan periksa koneksi Anda.");
    } finally {
      await refetch();
      setLoading(false);
      setIsQrDisabled(false);
    }
  };

  useEffect(() => {
    const savedQr = localStorage.getItem("qrCodeData");
    const savedDate = localStorage.getItem("qrGeneratedDate");

    if (savedQr && savedDate) {
      const lastGeneratedDate = parseISO(savedDate);
      const now = new Date();

      const resetTime = new Date(lastGeneratedDate);
      resetTime.setDate(resetTime.getDate() + 1);
      resetTime.setHours(6, 0, 0, 0);

      if (now >= resetTime) {
        localStorage.removeItem("qrCodeData");
        localStorage.removeItem("qrGeneratedDate");
        setQrCodeData(null);
        setIsQrDisabled(false);
      } else {
        try {
          setQrCodeData(JSON.parse(savedQr));
        } catch (error) {
          console.error("❌ Gagal parsing qrCodeData dari localStorage:", error);
          setQrCodeData(null);
        }
      }
    }
  }, []);

  const handleDownloadPDF = async () => {
    const selectedCourse = JSON.parse(localStorage.getItem('selectedCourse') || '{}');
    const selectedClass = JSON.parse(localStorage.getItem('selectedClass') || '{}');
    const selectedNamaMataPelajaran = selectedCourse.namaMataPelajaran || '';

    setIsGeneratingPDF(true);
    const today = new Date();
    today.setHours(today.getHours() + 7);
    const todayString = today.toISOString().split('T')[0];

    const filteredAttendanceData = attendanceData?.filter((data) => {
      const dataDate = new Date(data.tanggal);
      dataDate.setHours(dataDate.getHours() + 7);
      const dataDateString = dataDate.toISOString().split('T')[0];
      const isSameDate = dataDateString === todayString;
      const isMatchingCourse = selectedNamaMataPelajaran
        ? data.namaMataPelajaran === selectedNamaMataPelajaran
        : true;
      return isSameDate && isMatchingCourse;
    }) || [];

    await generateAttendancePDF({
      attendanceData: filteredAttendanceData,
      alert,
      schoolData,
      schoolIsLoading,
      guruName: profile?.user?.name || '-',
      namaMapel: course?.data?.find((c) => c.id === qrCodeData?.AbsensiMp?.idMataPelajaran)?.namaMataPelajaran || '-',
      namaKelas: classRoom?.data?.find((k) => k.id === qrCodeData?.AbsensiMp?.idKelas)?.namaKelas || '-',
    });
    setIsGeneratingPDF(false);
  };

  const handleManual = async () => {
    if (selectedStudentIds.length !== 1) return;
    const selectedStudentId = selectedStudentIds[0];

    if (!qrCodeData) {
      alert.error('QR Code tidak tersedia.');
      return;
    }

    setManualLoading(true);
    try {
      await absenManual(parseInt(selectedStudentId), "hadir");
      setIsModalOpen(false);
      setSelectedStudentIds([]);
      setSearchQuery('');
      alert.success('Berhasil melakukan absen manual');
      await refetch();
    } catch (error: any) {
      alert.error(error.message || 'Gagal mengirim absensi manual.');
    } finally {
      setManualLoading(false);
    }
  };

  const formatJamMasuk = (jamMasuk?: string | null) => {
    if (!jamMasuk) return "Tidak Tersedia";
    return dayjs(jamMasuk)
      .tz("Asia/Jakarta")
      .format("dddd, DD MMMM YYYY, HH:mm");
  };

  const selectedClass = JSON.parse(localStorage.getItem('selectedClass') || '{}');

  const filteredStudents = parsedStudents?.filter((student: any) => {
    const searchLower = searchQuery.toLowerCase();
    const isClassMatch = student?.kelas?.id && selectedClass?.idKelas
      ? student.kelas.id === Number(selectedClass.idKelas)
      : false;

    return (
      isClassMatch &&
      (student?.user?.name?.toLowerCase().includes(searchLower) ||
        student?.user?.nis?.toLowerCase().includes(searchLower) ||
        student?.user?.nisn?.toLowerCase().includes(searchLower))
    );
  }) || [];

  const selectedCourse = JSON.parse(localStorage.getItem('selectedCourse') || '{}');
  const selectedNamaMataPelajaran = selectedCourse.namaMataPelajaran || '';

  const today = new Date();
  today.setHours(today.getHours() + 7);
  const todayString = today.toISOString().split('T')[0];

  const filteredAttendanceData2 = attendanceData?.filter((data) => {
    const dataDate = new Date(data.tanggal);
    dataDate.setHours(dataDate.getHours() + 7);
    const dataDateString = dataDate.toISOString().split('T')[0];
    const isSameDate = dataDateString === todayString;
    const isMatchingCourse = selectedNamaMataPelajaran
      ? data.namaMataPelajaran === selectedNamaMataPelajaran
      : true;

    return isSameDate && isMatchingCourse;
  }) || [];

  const handleManualBulk = async (specificStudentIds?: number[]) => {
    const allClassStudents = parsedStudents.filter((student: any) => {
      const selectedClass = JSON.parse(localStorage.getItem('selectedClass') || '{}');
      const idKelas = selectedClass?.idKelas || null;
      const matchClass = idKelas ? student?.kelas?.id === Number(idKelas) : true;
      const isActive = student?.user?.isActive !== 0;

      return matchClass && isActive;
    });

    const studentIds = specificStudentIds || allClassStudents.map((student: any) => parseInt(student.id));

    if (studentIds.length === 0) {
      alert.error('Tidak ada siswa yang memenuhi kriteria.');
      return;
    }

    setManualLoading(true);
    try {
      await Promise.all(
        studentIds.map((studentId) => absenManual(studentId, "hadir"))
      );
      await refetch();
      alert.success(`Berhasil melakukan absen manual untuk ${studentIds.length} siswa`);
      setSelectedStudentIds([]);
      setIsModalOpen(false);
    } catch (error: any) {
      const errorMessage = error.message || 'Gagal melakukan absen manual';
      if (errorMessage.includes('Siswa sudah absen') || errorMessage.includes('entity')) {
        alert.success('Berhasil melakukan absen manual untuk semua siswa');
        await refetch();
        setSelectedStudentIds([]);
        setIsModalOpen(false);
      } else {
        await refetch();
        setSelectedStudentIds([]);
        setIsModalOpen(false);
        alert.error(errorMessage);
      }
    } finally {
      setManualLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-gray-800 dark:text-white p-8">
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
          background: #14B8A6 !important;
          color: #FFFFFF;
        }
        @media (prefers-color-scheme: dark) {
          select option {
            background: #1F2A44 !important;
            color: #FFFFFF;
          }
          select option:checked,
          select option:hover {
            background: #14B8A6 !important;
            color: #FFFFFF;
          }
        }
      `}</style>

      {alertMessage && (
        <div className="fixed top-4 right-4 bg-teal-600 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in" role="alert">
          {alertMessage}
        </div>
      )}

       {/* header */}
      <div className="bg-transparent border-b border-white/20 pb-4 text-white mb-4 shadow-lg">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-xl font-semibold tracking-tight">
              Absensi mata pelajaran
            </h1>
            <p className="text-gray-300 dark:text-gray-400 mt-1">
              Dashboard layanan untuk Guru & Tendik
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="w-[80%] flex flex-col">
          <div className="flex items-center gap-4 p-6 bg-neutral-900/90 rounded-xl shadow-lg mb-6 border border-gray-200 dark:border-gray-700">
            <Button
              onClick={handleRefetch}
              className="bg-teal-600 hover:bg-teal-500 text-white uppercase h-10 text-sm flex items-center gap-2 transition-all duration-300"
            >
              <RefreshCw size={16} />
              <span>{lang.text('reloadData')}</span>
            </Button>
            <Badge className="h-10 flex items-center gap-2 bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-400 text-sm uppercase">
              <span>{lang.text('presentToday')}</span>
              <span className="font-bold">
                {filteredAttendanceData2.filter((data: any) => data.statusKehadiran === 'hadir').length}
              </span>
            </Badge>
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700"></div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-transparent border border-teal-600 text-teal-300 dark:text--500 dark:hover:bg-teal-500 hover:text-white uppercase h-10 text-sm flex items-center gap-2 transition-all duration-300"
              variant="outline"
              disabled={manualLoading}
            >
              {manualLoading ? (
                <>
                  <span>Mengirim...</span>
                  <FaSpinner className="animate-spin" />
                </>
              ) : (
                <>
                  <span>Absensi Manual</span>
                  <BookPlus size={16} />
                </>
              )}
            </Button>
            <Button
              onClick={() => handleManualBulk()}
              className="bg-transparent border border-blue-600 hover:bg-blue-500 text-blue-300 dark:hover:bg-blue-500 hover:text-white uppercase h-10 text-sm flex items-center gap-2 transition-all duration-300"
              variant="outline"
              disabled={manualLoading}
            >
              <span>Absen Semua Siswa</span>
              <Users size={16} />
            </Button>
            <div className="flex items-center gap-2 ml-auto">
              <Button
                onClick={handleDownloadPDF}
                className="bg-transparent border border-red-400 text-red-300 hover:text-white hover:bg-red-100 dark:hover:bg-red-500 h-10 text-sm flex items-center gap-2 transition-all duration-300"
                disabled={isGeneratingPDF}
              >
                {isGeneratingPDF ? (
                  <>
                    {lang.text('downloadPDF')}
                    <FaSpinner className="animate-spin" />
                  </>
                ) : (
                  <>
                    <span>{lang.text('downloadPDF')}</span>
                    <FaFilePdf />
                  </>
                )}
              </Button>
              <button
                onClick={() => setDisplayMode('single')}
                className={`p-2 rounded-lg ${displayMode === 'single' ? 'bg-teal-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-teal-100 dark:hover:bg-teal-900'} transition-all duration-300`}
              >
                <LayoutList size={20} />
              </button>
              <button
                onClick={() => setDisplayMode('grid')}
                className={`p-2 rounded-lg ${displayMode === 'grid' ? 'bg-teal-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-teal-100 dark:hover:bg-teal-900'} transition-all duration-300`}
              >
                <LayoutGrid size={20} />
              </button>
            </div>
          </div>
          <div
            className={`
              w-full min-h-[70vh] bg-neutral-900/90 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700
              grid
              ${
                displayMode === 'single'
                ? 'grid-cols-1'
                : filteredAttendanceData2?.length === 1
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              } gap-6
            `}
          >
            {isFetching || isLoading || manualLoading ? (
              <div className="col-span-full flex flex-col items-center justify-center h-[30vh] border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                <FaSpinner className="animate-spin text-teal-600 dark:text-teal-400 text-3xl mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  {lang.text('loadData')}
                </p>
              </div>
            ) : error ? (
              <div className="col-span-full text-gray-500 dark:text-gray-400 text-center py-10">
                {error}
              </div>
            ) : filteredAttendanceData2.length > 0 ? (
              filteredAttendanceData2
                .sort((a: any, b: any) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
                .map((data: any, index: number) => (
                  <AttendanceCard
                    key={index}
                    data={data}
                    isSpecial={index === 0}
                    displayMode={displayMode}
                    selectedClass={selectedClass.namaKelas || ''}
                    refetch={refetch}
                  />
                ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center h-[30vh] border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                <img src="/files.png" alt="file icon" className="w-24 mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                  {lang.text('notFoundDataByClass')}
                </p>
              </div>
            )}
          </div>
        </div>
         <div className="w-[20%] min-h-[73vh] bg-neutral-900/90 rounded-xl py-4 border-r border-t border-b border-black pb-8 px-6 border-l dark:border-white/20">
          <div className="w-full flex flex-col text-center items-center justify-center">
            <div className="w-[180px] h-[180px] rounded-full overflow-hidden bg-cover bg-white/30 mt-4">
              <img src={profile?.user?.image ? `https://dev.kiraproject.id${profile?.user?.image}`: '/defaultProfile.png'} alt="foto-profile" />
            </div>
            <div className="mt-4">
              <p className="text-lg">{profile?.user?.name || '-'}</p>
              <small className="text-slate-400">Guru {JSON.parse(localStorage.getItem('selectedCourse') || '{}')?.namaMataPelajaran || 'pengajar'}</small>
            </div>
          </div>
          <QRCodeDisplay
            generateQrCode={generateQrCode}
            qrCodeData={qrCodeData || null}
            isDisabled={loading || isQrDisabled}
          />
          <br />
          {/* {(() => {
            const selectedCourse = JSON.parse(localStorage.getItem('selectedCourse') || '{}');
            const selectedNamaMataPelajaran = selectedCourse.namaMataPelajaran || '';
            const today = new Date();
            today.setHours(today.getHours() + 7);
            const todayString = today.toISOString().split('T')[0];

            const filteredAttendanceData = (attendanceData || []).filter((data) => {
              const dataDate = new Date(data.tanggal);
              dataDate.setHours(dataDate.getHours() + 7);
              const dataDateString = dataDate.toISOString().split('T')[0];
              const isSameDate = dataDateString === todayString;
              const statusKehadiran = data?.statusKehadiran === 'hadir';
              const isMatchingCourse = selectedNamaMataPelajaran
                ? data.namaMataPelajaran === selectedNamaMataPelajaran
                : true;
              return isSameDate && isMatchingCourse && statusKehadiran;
            });

            const sortedAttendanceData = filteredAttendanceData.sort(
              (a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime()
            );

            return sortedAttendanceData.length > 0 ? (
              <div className="mt-6 flex flex-col w-full bg-slate-100 h-max border rounded-sm border-black/70 dark:border-white/20 text-white text-sm space-y-2">
                <div className="text-black border-b border-black/20 p-4">
                  <strong>Siswa Pertama Hadir:</strong>
                  <br />
                  {sortedAttendanceData[sortedAttendanceData.length - 1].namaSiswa}
                  <br />
                  <br />
                  ({formatJamMasuk(sortedAttendanceData[sortedAttendanceData.length - 1].tanggal)})
                </div>
                <div className="text-black border-b border-black/20 p-4">
                  <strong>Siswa Terakhir Hadir:</strong>
                  <br />
                  {sortedAttendanceData[0].namaSiswa}
                  <br />
                  <br />
                  ({formatJamMasuk(sortedAttendanceData[0].tanggal)})
                </div>
              </div>
            ) : null;
          })()} */}
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={(open) => {
        setIsModalOpen(open);
        if (!open) {
          setSelectedStudentIds([]);
          setSearchQuery('');
        }
      }}>
        <DialogContent className="max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-xl shadow-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800 dark:text-white">
              Absensi Manual
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Cari nama, NIS, atau NISN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg"
            />
            <div className="max-h-64 overflow-y-auto">
              {filteredStudents.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  Tidak ada data siswa yang ditemukan.
                </div>
              ) : (
                filteredStudents
                  .filter((student: any) => {
                    const selectedClass = JSON.parse(localStorage.getItem('selectedClass') || '{}');
                    const idKelas = selectedClass?.idKelas || null;
                    const matchClass = idKelas ? student?.kelas?.id === Number(idKelas) : true;
                    const isActive = student?.user?.isActive !== 0;

                    return matchClass && isActive;
                  })
                  .map((student: any) => (
                    <div key={student?.id} className="flex items-center space-x-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <Checkbox
                        id={student.id.toString()}
                        checked={selectedStudentIds.includes(student.id.toString())}
                        onCheckedChange={(checked: boolean) => {
                          const id = student.id.toString();
                          setSelectedStudentIds((prev) =>
                            checked ? [...prev, id] : prev.filter((i) => i !== id)
                          );
                        }}
                        className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                      />
                      <label
                        htmlFor={student.id.toString()}
                        className="text-sm font-medium text-gray-800 dark:text-white flex-1"
                      >
                        {student?.user?.name} ({student?.user?.nis || '-'}) (
                        {student?.kelas?.namaKelas || 'Belum ada kelas'})
                      </label>
                    </div>
                  ))
              )}
            </div>
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedStudentIds([]);
                setSearchQuery('');
              }}
              className="border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Batal
            </Button>
            {selectedStudentIds.length <= 1 ? (
              <Button
                onClick={handleManual}
                disabled={manualLoading || selectedStudentIds.length === 0}
                className="bg-teal-600 hover:bg-teal-500 text-white"
              >
                {manualLoading ? (
                  <>
                    <span>Mengirim...</span>
                    <FaSpinner className="ml-2 animate-spin" />
                  </>
                ) : (
                  'Tambahkan kehadiran'
                )}
              </Button>
            ) : (
              <Button
                onClick={() => handleManualBulk(selectedStudentIds.map((id) => parseInt(id)))}
                disabled={manualLoading}
                className="bg-teal-600 hover:bg-teal-500 text-white"
              >
                {manualLoading ? (
                  <>
                    <span>Mengirim...</span>
                    <FaSpinner className="ml-2 animate-spin" />
                  </>
                ) : (
                  `Tambahkan ${selectedStudentIds.length} kehadiran`
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
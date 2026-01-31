// import {
//   Badge,
//   Button,
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   Input,
//   lang,
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/core/libs";
// import { useAlert, Vokadialog } from "@/features/_global";
// import { useProfile } from "@/features/profile";
// import { useSchool } from "@/features/schools";
// import { Document, Image, Page, pdf, StyleSheet, Text, View } from "@react-pdf/renderer";
// import dayjs from "dayjs";
// import { useState } from "react";
// import { FaFilePdf, FaPlus, FaSpinner } from "react-icons/fa";
// import { useTask } from "../hooks";

// interface Homework {
//   id: number;
//   materiTugas: string;
//   startTime: string;
//   endTime: string;
//   deskripsi: string;
//   detailTugas: string;
//   jadwalPelajaranId: number;
//   createdAt: string;
//   updatedAt: string;
//   tumbnail: string | null;
//   sekolahId: number;
//   jadwalMataPelajaran: {
//     id: number;
//     hari: string;
//     jamMulai: string;
//     jamSelesai: string;
//     mataPelajaranId: number;
//     guruId: number;
//     createdAt: string;
//     updatedAt: string;
//     kelasId: number;
//     sekolahId: number;
//     mataPelajaran?: {
//       id: number;
//       namaMataPelajaran: string;
//       kelasId: number;
//       createdAt: string;
//       updatedAt: string;
//       sekolahId: number;
//       kelas?: {
//         id: number;
//         namaKelas: string;
//         level: string;
//         kodeKelas: string | null;
//         sekolahId: number;
//         createdAt: string;
//         updatedAt: string;
//         deleteAt: string | null;
//       };
//     };
//     guru?: {
//       id: number;
//       namaGuru: string;
//       kode_guru: string;
//       createdAt: string;
//       updatedAt: string;
//       userId: number;
//       mataPelajaranId: number;
//     };
//   };
// }

// interface HomeworkCardListProps {
//   tasks: Homework[];
//   deleteTask: (id: number) => void;
//   updateTask: (id: string, updates: any) => Promise<void>;
//   alert: { success: (msg: string) => void; error: (msg: string) => void };
// }

// const pdfStyles = StyleSheet.create({
//   page: {
//     fontSize: 12,
//     fontFamily: "Times-Roman",
//   },
//   header: {
//     position: "relative",
//     top: 0,
//     left: 0,
//     right: 0,
//     marginBottom: 20,
//   },
//   headerImage: {
//     width: 595,
//     maxHeight: 150,
//     objectFit: "contain",
//   },
//   contentWrapper: {
//     paddingLeft: 32,
//     paddingRight: 32,
//     marginTop: 10,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 5,
//     textTransform: "uppercase",
//   },
//   content: {
//     marginBottom: 10,
//     textAlign: "center",
//     lineHeight: 1.5,
//   },
//   table: {
//     display: "flex",
//     flexDirection: "column",
//     borderStyle: "solid",
//     borderWidth: 1,
//     borderColor: "#000",
//   },
//   tableRow: {
//     flexDirection: "row",
//     borderBottomWidth: 1,
//     fontSize: 11,
//     borderBottomColor: "#000",
//   },
//   tableCell: {
//     padding: 5,
//     borderRightWidth: 1,
//     fontSize: 11,
//     borderRightColor: "#000",
//     textAlign: "center",
//   },
//   tableHeader: {
//     fontWeight: "bold",
//     backgroundColor: "#f0f0f0",
//   },
//   signature: {
//     marginTop: 50,
//     alignItems: "flex-end",
//   },
//   signatureImage: {
//     width: 120,
//     height: "auto",
//     maxHeight: 50,
//     marginTop: 20,
//     marginBottom: 10,
//   },
//   signatureText: {
//     textAlign: "center",
//   },
// });

// const HomeworkPDF: React.FC<{
//   tasks: Homework[];
//   schoolData: {
//     kopSurat: string | undefined;
//     namaSekolah: string;
//     namaKepalaSekolah: string;
//     ttdKepalaSekolah: string | undefined;
//   };
//   date: string;
// }> = ({ tasks, schoolData, date }) => {
//   const kopSuratUrl = schoolData.kopSurat
//     ? schoolData.kopSurat.startsWith("data:image")
//       ? schoolData.kopSurat 
//       : schoolData.kopSurat.includes('/uploads')
//       ? `https://dev.kiraproject.id${schoolData.kopSurat}`
//       : `data:image/png;base64,${schoolData.kopSurat}`
//     : undefined;

//   const signatureUrl = schoolData.ttdKepalaSekolah
//       ? schoolData.ttdKepalaSekolah.startsWith("data:image")
//       ? schoolData.ttdKepalaSekolah 
//       : schoolData.ttdKepalaSekolah.includes('/uploads')
//       ? `https://dev.kiraproject.id${schoolData.ttdKepalaSekolah}`
//       : `data:image/png;base64,${schoolData.ttdKepalaSekolah}`
//     : undefined;

//   const rowsPerPage = 23;
//   const dataChunks = [];
//   for (let i = 0; i < tasks.length; i += rowsPerPage) {
//     const chunk = tasks.slice(i, i + rowsPerPage);
//     if (chunk.length > 0) {
//       dataChunks.push(chunk);
//     }
//   }

//   return (
//     <Document>
//       {dataChunks.map((chunk, pageIndex) => (
//         <Page key={pageIndex} size="A4" style={pdfStyles.page} break={pageIndex > 0}>
//           <View style={pdfStyles.header} fixed>
//             {kopSuratUrl && <Image src={kopSuratUrl} style={pdfStyles.headerImage} />}
//           </View>
//           <View style={pdfStyles.contentWrapper}>
//             <Text style={pdfStyles.title}>Daftar Tugas</Text>
//             <Text style={pdfStyles.content}>Tanggal: {date || "Tanggal Tidak Diketahui"}</Text>
//             <View style={pdfStyles.table}>
//               <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]} fixed>
//                 {["No", "Nama Guru", "Materi Tugas", "Tanggal Mulai", "Tanggal Selesai"].map((header, index) => (
//                   <View
//                     key={index}
//                     style={[
//                       pdfStyles.tableCell,
//                       pdfStyles.tableHeader,
//                       {
//                         width: index === 0 ? "5%" : index === 1 ? "25%" : index === 2 ? "35%" : "17.5%",
//                       },
//                     ]}
//                   >
//                     <Text>{header}</Text>
//                   </View>
//                 ))}
//               </View>
//               {chunk.map((item, index) => (
//                 <View style={pdfStyles.tableRow} key={index} wrap={false}>
//                   <View style={[pdfStyles.tableCell, { width: "5%" }]}>
//                     <Text>{pageIndex * rowsPerPage + index + 1}</Text>
//                   </View>
//                   <View style={[pdfStyles.tableCell, { width: "25%" }]}>
//                     <Text>{item.jadwalMataPelajaran?.guru?.namaGuru || "-"}</Text>
//                   </View>
//                   <View style={[pdfStyles.tableCell, { width: "35%" }]}>
//                     <Text>{item.materiTugas || "-"}</Text>
//                   </View>
//                   <View style={[pdfStyles.tableCell, { width: "17.5%" }]}>
//                     <Text>{item.startTime ? dayjs(item.startTime).format("DD MMMM YYYY") : "-"}</Text>
//                   </View>
//                   <View style={[pdfStyles.tableCell, { width: "17.5%" }]}>
//                     <Text>{item.endTime ? dayjs(item.endTime).format("DD MMMM YYYY") : "-"}</Text>
//                   </View>
//                 </View>
//               ))}
//             </View>
//             {pageIndex === dataChunks.length - 1 && (
//               <View style={pdfStyles.signature}>
//                 <Text style={pdfStyles.signatureText}>Kepala Sekolah,</Text>
//                 {signatureUrl && <Image src={signatureUrl} style={pdfStyles.signatureImage} />}
//                 <Text style={pdfStyles.signatureText}>{schoolData.namaKepalaSekolah || "Nama Kepala Sekolah"}</Text>
//               </View>
//             )}
//           </View>
//         </Page>
//       ))}
//     </Document>
//   );
// };

// const generateHomeworkPDF = async ({
//   tasks,
//   alert,
//   nameSchool,
//   schoolData,
//   schoolIsLoading,
// }: {
//   tasks: Homework[];
//   alert: any;
//   nameSchool: string;
//   schoolData: any;
//   schoolIsLoading: boolean;
// }) => {

//   console.log('schoolData', schoolData)
//   if (schoolIsLoading) {
//     alert.error("Data sekolah masih dimuat, silakan coba lagi.");
//     return;
//   }

//   if (!schoolData || !schoolData?.[0].namaSekolah) {
//     alert.error("Data sekolah tidak lengkap.");
//     return;
//   }

//   if (!tasks || tasks.length === 0) {
//     alert.error("Tidak ada data tugas untuk dihasilkan.");
//     return;
//   }

//   try {
//     const doc = (
//       <HomeworkPDF
//         tasks={tasks}
//         schoolData={{
//           namaSekolah: nameSchool?.[0],
//           kopSurat: schoolData?.[0].kopSurat || undefined,
//           namaKepalaSekolah: schoolData?.[0].namaKepalaSekolah || "Nama Kepala Sekolah",
//           ttdKepalaSekolah: schoolData?.[0].ttdKepalaSekolah,
//         }}
//         date={dayjs().format("DD MMMM YYYY")}
//       />
//     );

//     const pdfInstance = pdf(doc);
//     const pdfBlob = await pdfInstance.toBlob();

//     const url = window.URL.createObjectURL(pdfBlob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `Daftar-Tugas-${dayjs().format("YYYY-MM-DD")}.pdf`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     window.URL.revokeObjectURL(url);

//     alert.success("Daftar tugas berhasil diunduh.");
//   } catch (error) {
//     console.error("Error generating homework PDF:", error);
//     alert.error("Gagal menghasilkan daftar tugas.");
//   }
// };

// const HomeworkCardList: React.FC<HomeworkCardListProps> = ({ tasks, deleteTask, updateTask, alert }) => {
//   const [open, setOpen] = useState(false);
//   const [selectedHomework, setSelectedHomework] = useState<Homework | null>(null);
//   const [openModalDelete, setOpenModalDelete] = useState(false);
//   const [openModalUpdate, setOpenModalUpdate] = useState(false);
//   const [selectId, setSelectId] = useState(0);
//   const [updateForm, setUpdateForm] = useState<Partial<{
//     materiTugas: string;
//     startTime: string;
//     endTime: string;
//     jadwalPelajaranId: number;
//     deskripsi: string;
//     detailTugas: string;
//   }>>({});
//   const [isUpdating, setIsUpdating] = useState(false);

//   const handleOpenModal = (homework: Homework) => {
//     setSelectedHomework(homework);
//     setOpen(true);
//   };

//   const handleCloseModal = () => {
//     setSelectedHomework(null);
//     setOpen(false);
//   };

//   const handleOpenUpdateModal = (homework: Homework) => {
//     setSelectedHomework(homework);
//     setUpdateForm({
//       materiTugas: homework.materiTugas,
//       startTime: homework.startTime,
//       endTime: homework.endTime,
//       jadwalPelajaranId: homework.jadwalPelajaranId,
//       deskripsi: homework.deskripsi,
//       detailTugas: homework.detailTugas,
//     });
//     setOpenModalUpdate(true);
//   };

//   const handleCloseUpdateModal = () => {
//     setSelectedHomework(null);
//     setUpdateForm({});
//     setOpenModalUpdate(false);
//   };

//   const handleUpdate = async () => {
//     if (!selectedHomework) return;
//     setIsUpdating(true);
//     try {
//       await updateTask({
//         id: selectedHomework.id,
//         updates: updateForm,
//       });
//       alert.success(lang.text('successUpdate') || 'Tugas berhasil diperbarui.');
//       handleCloseUpdateModal();
//     } catch (error: any) {
//       alert.error(error.message || lang.text('failUpdate') || 'Gagal memperbarui tugas.');
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   const handleDelete = async (id: number) => {
//     try {
//       await deleteTask(id);
//       alert.success(lang.text('dataSuccessDelete') || 'Tugas berhasil dihapus.');
//       setOpenModalDelete(false);
//     } catch (error) {
//       alert.error(error.message || lang.text('dataFailDelete') || 'Gagal menghapus tugas.');
//     }
//   };

//   const handleDeleteData = (id: number) => {
//     setSelectId(id);
//     setOpenModalDelete(true);
//   };

//   // Handle no data
//   if (!tasks || tasks.length === 0) {
//     return (
//       <div className="relative dark:bg-neutral-900/60 border border-dashed border-gray-300 dark:border-gray-600 h-[50vh] flex flex-col items-center justify-center rounded-xl p-6 text-center text-gray-500 dark:text-gray-400">
        
//         {/* glossy overlay */}
//         <div className="pointer-events-none absolute inset-0">
//           <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/10 opacity-40 dark:from-white/10 dark:to-white/0" />
//           <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full" />
//         </div>
//         <img src="/iconTask.png" alt="task icon" className="w-24 mb-4" />
//         {lang.text('noData')}
//       </div>
//     );
//   }

//   return (
//     <>
//       {openModalDelete && (
//         <Vokadialog
//           visible={openModalDelete}
//           title={lang.text("deleteConfirmation")}
//           content={lang.text("deleteConfirmationDesc", { context: 'tugas' })}
//           footer={
//             <div className="flex flex-col sm:flex-row gap-2">
//               <Button
//                 onClick={() => handleDelete(selectId)}
//                 variant="destructive"
//                 className="bg-red-500 hover:bg-red-400 text-white transition-all duration-300 transform hover:scale-105"
//                 aria-label="Confirm delete task"
//               >
//                 {lang.text("delete")}
//               </Button>
//               <Button
//                 onClick={() => setOpenModalDelete(false)}
//                 variant="outline"
//                 className="border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
//                 aria-label="Cancel delete task"
//               >
//                 {lang.text("cancel")}
//               </Button>
//             </div>
//           }
//         />
//       )}
//       {openModalUpdate && (
//         <Dialog open={openModalUpdate} onOpenChange={setOpenModalUpdate}>
//           <DialogContent className="sm:max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-xl shadow-2xl p-6">
//             <DialogHeader>
//               <DialogTitle className="text-xl font-bold text-gray-800 dark:text-white">
//                 {lang.text('editPR')}
//               </DialogTitle>
//             </DialogHeader>
//             <div className="space-y-4">
//               {[
//                 { label: "Materi Tugas", key: "materiTugas", placeholder: "Masukkan materi tugas" },
//                 { label: "Deskripsi", key: "deskripsi", placeholder: "Masukkan deskripsi" },
//                 { label: "Detail Tugas", key: "detailTugas", placeholder: "Masukkan detail tugas" },
//                 { label: "Tanggal Mulai", key: "startTime", type: "date" },
//                 { label: "Tanggal Selesai", key: "endTime", type: "date" },
//                 { label: "Jadwal Pelajaran ID", key: "jadwalPelajaranId", type: "number", placeholder: "Masukkan ID jadwal pelajaran" },
//               ].map((field) => (
//                 <div key={field.key} className="flex flex-col gap-2">
//                   <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
//                     {field.label}
//                   </label>
//                   <Input
//                     type={field.type || "text"}
//                     value={updateForm[field.key] || ''}
//                     onChange={(e) =>
//                       setUpdateForm({
//                         ...updateForm,
//                         [field.key]: field.type === "number" ? parseInt(e.target.value) : e.target.value,
//                       })
//                     }
//                     placeholder={field.placeholder}
//                     className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg py-2 focus:ring-blue-500"
//                     aria-label={field.label}
//                   />
//                 </div>
//               ))}
//             </div>
//             <div className="flex justify-end gap-2 mt-6">
//               <Button
//                 variant="outline"
//                 onClick={handleCloseUpdateModal}
//                 disabled={isUpdating}
//                 className="border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
//                 aria-label="Cancel update task"
//               >
//                 {lang.text('cancel')}
//               </Button>
//               <Button
//                 onClick={handleUpdate}
//                 disabled={isUpdating}
//                 className="bg-blue-500 hover:bg-blue-400 text-white transition-all duration-300 transform hover:scale-105"
//                 aria-label="Save updated task"
//               >
//                 {isUpdating ? <FaSpinner className="animate-spin mr-2" /> : null}
//                 {lang.text('save')}
//               </Button>
//             </div>
//           </DialogContent>
//         </Dialog>
//       )}
//       <div className="grid dark:bg-neutral-900/60 p-4 border border-white/20 rounded-xl grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
//         {tasks.map((homework) => (
//           <Card
//             key={homework.id}
//             className="relative dark:bg-neutral-900/60 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
//           >
//             <div
//               className={`${
//                 dayjs().isAfter(dayjs(homework.endTime)) ? 'bg-red-500' : 'bg-green-500'
//               } absolute top-4 right-4 w-3 h-3 rounded-full`}
//             />
//             <CardHeader>
//               <img src="/iconTask.png" alt="task icon" className="w-12 mb-2" />
//               <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
//                 {homework.materiTugas || 'Unnamed Task'}
//               </CardTitle>
//               <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
//                 {homework.jadwalMataPelajaran?.mataPelajaran?.namaMataPelajaran || 'Unknown Subject'} -{' '}
//                 <span className="font-semibold text-gray-700 dark:text-gray-200">
//                   [ Kelas {homework.jadwalMataPelajaran?.kelas?.namaKelas || 'Kelas tidak ada'} ]
//                 </span>
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-3">
//                 <div>
//                   <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Deskripsi:</p>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">{homework.deskripsi || '-'}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Detail Tugas:</p>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">{homework.detailTugas || '-'}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Guru:</p>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">
//                     {homework.jadwalMataPelajaran?.guru?.namaGuru || 'Unknown Teacher'}
//                   </p>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Hari:</p>
//                   <Badge
//                     variant="outline"
//                     className="bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-400"
//                   >
//                     {homework.jadwalMataPelajaran?.hari || 'Unknown Day'}
//                   </Badge>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Waktu:</p>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">
//                     {homework.startTime ? dayjs(homework.startTime).format('DD MMMM YYYY') : '-'} -{' '}
//                     {homework.endTime ? dayjs(homework.endTime).format('DD MMMM YYYY') : '-'}
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//             <CardFooter className="flex flex-col justify-end items-end">
//               <div className="flex justify-between w-full gap-2">
//                 <Button
//                   className="flex-1 bg-blue-500 hover:bg-blue-400 text-white transition-all duration-300 transform hover:scale-105"
//                   onClick={() => handleOpenModal(homework)}
//                   aria-label={`View details for ${homework.materiTugas}`}
//                 >
//                   Detail
//                 </Button>
//                 <Button
//                   className="flex-1 bg-blue-500 hover:bg-blue-400 text-white transition-all duration-300 transform hover:scale-105"
//                   onClick={() => handleOpenUpdateModal(homework)}
//                   aria-label={`Update ${homework.materiTugas}`}
//                 >
//                   {lang.text('update')}
//                 </Button>
//                 <Button
//                   className="flex-1 bg-red-500 hover:bg-red-400 text-white transition-all duration-300 transform hover:scale-105"
//                   variant="destructive"
//                   onClick={() => handleDeleteData(homework.id)}
//                   aria-label={`Delete ${homework.materiTugas}`}
//                 >
//                   {lang.text('delete')}
//                 </Button>
//               </div>
//             </CardFooter>
//           </Card>
//         ))}
//       </div>
//       {/* Modal for Homework Details */}
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent className="sm:max-w-[60vw] bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-xl shadow-2xl p-6">
//           <DialogHeader className="border-b border-gray-200 dark:border-gray-700 pb-6">
//             <Button
//               className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-400 text-white transition-all duration-300 transform hover:scale-105"
//               onClick={handleCloseModal}
//               aria-label="Close task details modal"
//             >
//               Tutup
//             </Button>
//             <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-white">
//               {selectedHomework?.materiTugas || 'Unnamed Task'}
//             </DialogTitle>
//             <DialogDescription className="text-gray-500 dark:text-gray-400">
//               {selectedHomework?.jadwalMataPelajaran?.mataPelajaran?.namaMataPelajaran || 'Unknown Subject'} -{' '}
//               Kelas {selectedHomework?.jadwalMataPelajaran?.kelas?.namaKelas || 'Unknown Class'}
//             </DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             {[
//               { label: "Deskripsi", value: selectedHomework?.deskripsi },
//               { label: "Detail Tugas", value: selectedHomework?.detailTugas },
//               { label: "Guru", value: selectedHomework?.jadwalMataPelajaran?.guru?.namaGuru },
//               {
//                 label: "Hari",
//                 value: (
//                   <Badge
//                     variant="outline"
//                     className="bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-400 py-1"
//                   >
//                     {selectedHomework?.jadwalMataPelajaran?.hari || 'Unknown Day'}
//                   </Badge>
//                 ),
//               },
//               {
//                 label: "Waktu",
//                 value: selectedHomework
//                   ? `${selectedHomework.startTime ? dayjs(selectedHomework.startTime).format('DD MMMM YYYY') : '-'} - ${
//                       selectedHomework.endTime ? dayjs(selectedHomework.endTime).format('DD MMMM YYYY') : '-'
//                     }`
//                   : '-',
//               },
//               {
//                 label: "Status",
//                 value: (
//                   <Badge
//                     variant={selectedHomework && dayjs().isAfter(dayjs(selectedHomework.endTime)) ? "destructive" : "default"}
//                     className={`${
//                       selectedHomework && dayjs().isAfter(dayjs(selectedHomework.endTime))
//                         ? 'bg-red-500 text-white'
//                         : 'bg-green-500 text-white'
//                     } pt-1.5 pb-1`}
//                   >
//                     {selectedHomework && dayjs().isAfter(dayjs(selectedHomework.endTime)) ? "Tenggat Waktu Lewat" : "AKTIF"}
//                   </Badge>
//                 ),
//               },
//               {
//                 label: "Dibuat",
//                 value: selectedHomework?.createdAt ? dayjs(selectedHomework.createdAt).format('DD MMMM YYYY HH:mm') : '-',
//               },
//               {
//                 label: "Diperbarui",
//                 value: selectedHomework?.updatedAt ? dayjs(selectedHomework.updatedAt).format('DD MMMM YYYY HH:mm') : '-',
//               },
//             ].map(({ label, value }) => (
//               <div key={label} className="grid grid-cols-4 items-center gap-4">
//                 <span className="font-medium col-span-1 flex justify-between text-gray-700 dark:text-gray-200">
//                   {label}:<span>:</span>
//                 </span>
//                 <span className="col-span-3 text-gray-800 dark:text-white">{value || '-'}</span>
//               </div>
//             ))}
//           </div>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export const HomeWorkLanding = () => {
//   const [nameFilter, setNameFilter] = useState("");
//   const [dayFilter, setDayFilter] = useState("all");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [guruFilter, setGuruFilter] = useState("all");
//   const [kelasFilter, setKelasFilter] = useState("all");
//   const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
//   const [openModalCreate, setOpenModalCreate] = useState(false);
//   const [createForm, setCreateForm] = useState<{
//     materiTugas: string;
//     startTime: string;
//     endTime: string;
//     jadwalPelajaranId: number;
//     deskripsi: string;
//     detailTugas: string;
//   }>({
//     materiTugas: '',
//     startTime: '',
//     endTime: '',
//     jadwalPelajaranId: 0,
//     deskripsi: '',
//     detailTugas: '',
//   });
//   const [isCreating, setIsCreating] = useState(false);
//   const profile = useProfile();
//   const alert = useAlert();
//   const { data: schoolData, isLoading: schoolIsLoading } = useSchool();
//   const { data: tasks, isLoading: tasksIsLoading, deleteTask, updateTask, createTask } = useTask();

//   const dayOrder = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];

//   const handleOpenCreateModal = () => {
//     setCreateForm({
//       materiTugas: '',
//       startTime: '',
//       endTime: '',
//       jadwalPelajaranId: 0,
//       deskripsi: '',
//       detailTugas: '',
//     });
//     setOpenModalCreate(true);
//   };

//   const handleCloseCreateModal = () => {
//     setCreateForm({
//       materiTugas: '',
//       startTime: '',
//       endTime: '',
//       jadwalPelajaranId: 0,
//       deskripsi: '',
//       detailTugas: '',
//     });
//     setOpenModalCreate(false);
//   };

//   const handleCreate = async () => {
//     if (!createForm.materiTugas || !createForm.jadwalPelajaranId) {
//       alert.error('Materi tugas dan ID jadwal pelajaran harus diisi.');
//       return;
//     }
//     setIsCreating(true);
//     try {
//       await createTask(createForm);
//       alert.success(lang.text('successCreate') || 'Tugas berhasil dibuat.');
//       handleCloseCreateModal();
//     } catch (error: any) {
//       alert.error(error.message || lang.text('failCreate') || 'Gagal membuat tugas.');
//     } finally {
//       setIsCreating(false);
//     }
//   };

//   const handleDownloadPDF = async () => {
//     setIsGeneratingPDF(true);
//     try {
//       await generateHomeworkPDF({
//         tasks: filteredTasks,
//         alert,
//         nameSchool: profile.user?.sekolah?.namaSekolah || "",
//         schoolData: schoolData,
//         schoolIsLoading,
//       });
//     } finally {
//       setIsGeneratingPDF(false);
//     }
//   };

//   // Extract unique teachers and classes for filter options
//   const uniqueTeachers = Array.from(
//     new Set(tasks?.map((task: Homework) => task.jadwalMataPelajaran?.guru?.namaGuru).filter(Boolean))
//   );
//   const uniqueClasses = Array.from(
//     new Set(tasks?.map((task: Homework) => task.jadwalMataPelajaran?.kelas?.namaKelas).filter(Boolean))
//   );

//   // Apply filters
//   const filteredTasks = tasks?.filter((task: Homework) => {
//     const matchesName = nameFilter === "" || task.materiTugas.toLowerCase().includes(nameFilter.toLowerCase());
//     const matchesDay = dayFilter === "all" || task.jadwalMataPelajaran?.hari?.toLowerCase() === dayFilter;
//     const matchesStatus = statusFilter === "all" ||
//       (statusFilter === "active" && !dayjs().isAfter(dayjs(task.endTime))) ||
//       (statusFilter === "expired" && dayjs().isAfter(dayjs(task.endTime)));
//     const matchesGuru = guruFilter === "all" || task.jadwalMataPelajaran?.guru?.namaGuru === guruFilter;
//     const matchesKelas = kelasFilter === "all" || task.jadwalMataPelajaran?.kelas?.namaKelas === kelasFilter;
//     return matchesName && matchesDay && matchesStatus && matchesGuru && matchesKelas;
//   }) || [];

//   return (
//     <div className="min-h-screen text-gray-800 dark:text-white pb-8">
//       {/* glossy overlay */}
//       <div className="pointer-events-none absolute inset-0">
//         <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/10 opacity-40 dark:from-white/10 dark:to-white/0" />
//         <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full" />
//       </div>
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
//       <div className="flex items-center dark:bg-neutral-900/60 p-4 border border-white/20 rounded-xl gap-3 mb-6 flex-wrap">
//         <Input
//           type="text"
//           value={nameFilter}
//           onChange={(e) => setNameFilter(e.target.value)}
//           placeholder={lang.text("search") || "Filter by name..."}
//           className="w-[250px] bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500"
//           aria-label="Search tasks"
//         />
//         <Select value={dayFilter} onValueChange={setDayFilter}>
//           <SelectTrigger className="w-max bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500">
//             <SelectValue placeholder="Filter Hari" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">{lang.text('allDays')}</SelectItem>
//             {dayOrder.map((day) => (
//               <SelectItem key={day} value={day}>
//                 {lang.text(day)}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//         <Select value={statusFilter} onValueChange={setStatusFilter}>
//           <SelectTrigger className="w-max bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500">
//             <SelectValue placeholder="Filter Status" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">{lang.text('allStatus')}</SelectItem>
//             <SelectItem value="active">{lang.text('active') || 'Aktif'}</SelectItem>
//             <SelectItem value="expired">{lang.text('expired') || 'Kedaluwarsa'}</SelectItem>
//           </SelectContent>
//         </Select>
//         <Select value={guruFilter} onValueChange={setGuruFilter}>
//           <SelectTrigger className="w-max bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500">
//             <SelectValue placeholder="Filter Guru" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">{lang.text('allTeachers') || 'Semua Guru'}</SelectItem>
//             {uniqueTeachers.map((guru) => (
//               <SelectItem key={guru} value={guru}>
//                 {guru}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//         <Select value={kelasFilter} onValueChange={setKelasFilter}>
//           <SelectTrigger className="w-max bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500">
//             <SelectValue placeholder="Filter Kelas" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">{lang.text('allClasses') || 'Semua Kelas'}</SelectItem>
//             {uniqueClasses.map((kelas) => (
//               <SelectItem key={kelas} value={kelas}>
//                 {kelas}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//         <div className="ml-auto flex items-center gap-3">
//           <Button
//             className="bg-transparent border border-teal-400 text-teal-300 hover:text-white hover:bg-teal-100 dark:hover:bg-teal-500 transition-all duration-300 transform flex items-center gap-2"
//             onClick={handleOpenCreateModal}
//             aria-label="Create new task"
//           >
//             <FaPlus size={16} />
//             {lang.text('createTask')}
//           </Button>
//           <Button
//             className="w-max bg-transparent border border-red-400 text-red-300 hover:text-white hover:bg-red-100 dark:hover:bg-red-500 transition-all duration-300 transform flex items-center gap-2"
//             variant="outline"
//             aria-label="Download PDF"
//             disabled={isGeneratingPDF || schoolIsLoading}
//             onClick={handleDownloadPDF}
//           >
//             {isGeneratingPDF ? (
//               <>
//                 {lang.text('downloadPDF')}
//                 <FaSpinner className="animate-spin ml-2" />
//               </>
//             ) : (
//               <>
//                 <FaFilePdf size={16} />
//                 {lang.text('downloadPDF') || "Unduh Daftar Tugas"}
//               </>
//             )}
//           </Button>
//         </div>
//       </div>

//       {openModalCreate && (
//         <Dialog open={openModalCreate} onOpenChange={setOpenModalCreate}>
//           <DialogContent className="sm:max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-xl shadow-2xl p-6">
//             <DialogHeader>
//               <DialogTitle className="text-xl font-bold text-gray-800 dark:text-white">
//                 {lang.text('createTask')}
//               </DialogTitle>
//             </DialogHeader>
//             <div className="space-y-4">
//               {[
//                 { label: "Materi Tugas", key: "materiTugas", placeholder: "Masukkan materi tugas" },
//                 { label: "Deskripsi", key: "deskripsi", placeholder: "Masukkan deskripsi" },
//                 { label: "Detail Tugas", key: "detailTugas", placeholder: "Masukkan detail tugas" },
//                 { label: "Tanggal Mulai", key: "startTime", type: "date" },
//                 { label: "Tanggal Selesai", key: "endTime", type: "date" },
//                 { label: "Jadwal Pelajaran ID", key: "jadwalPelajaranId", type: "number", placeholder: "Masukkan ID jadwal pelajaran" },
//               ].map((field) => (
//                 <div key={field.key} className="flex flex-col gap-2">
//                   <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
//                     {field.label}
//                   </label>
//                   <Input
//                     type={field.type || "text"}
//                     value={createForm[field.key]}
//                     onChange={(e) =>
//                       setCreateForm({
//                         ...createForm,
//                         [field.key]: field.type === "number" ? parseInt(e.target.value) : e.target.value,
//                       })
//                     }
//                     placeholder={field.placeholder}
//                     className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg py-2 focus:ring-blue-500"
//                     aria-label={field.label}
//                   />
//                 </div>
//               ))}
//             </div>
//             <div className="flex justify-end gap-2 mt-6">
//               <Button
//                 variant="outline"
//                 onClick={handleCloseCreateModal}
//                 disabled={isCreating}
//                 className="border-gray-300 bg-white/10 dark:border-gray-600 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
//                 aria-label="Cancel create task"
//               >
//                 {lang.text('cancel')}
//               </Button>
//               <Button
//                 onClick={handleCreate}
//                 disabled={isCreating}
//                 className="bg-green-500 hover:bg-green-400 text-white transition-all duration-300 transform hover:scale-105"
//                 aria-label="Create task"
//               >
//                 {isCreating ? <FaSpinner className="animate-spin mr-2" /> : null}
//                 {lang.text('createNow')}
//               </Button>
//             </div>
//           </DialogContent>
//         </Dialog>
//       )}

//       {tasksIsLoading ? (
//         <div className="border border-dashed border-gray-300 dark:border-gray-600 h-[50vh] flex flex-col items-center justify-center rounded-xl p-6 text-center text-gray-500 dark:text-gray-400">
//           <FaSpinner className="animate-spin text-blue-500 dark:text-blue-400 text-3xl mb-4" />
//           <p>Loading tasks...</p>
//         </div>
//       ) : !tasks ? (
//         <div className="dark:bg-neutral-900/60 text-center text-red-500 dark:text-red-400">No tasks available or an error occurred.</div>
//       ) : (
//         <HomeworkCardList
//           tasks={filteredTasks}
//           deleteTask={deleteTask}
//           updateTask={updateTask}
//           alert={alert}
//         />
//       )}
//     </div>
//   );
// };





import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  lang,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/core/libs";
import { useAlert, Vokadialog } from "@/features/_global";
import { useProfile } from "@/features/profile";
import { useSchool } from "@/features/schools";
import { Document, Image, Page, pdf, StyleSheet, Text, View } from "@react-pdf/renderer";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { FaFilePdf, FaPlus, FaSpinner } from "react-icons/fa";
import { useTask } from "../hooks";
import { ResponsiveContainer, AreaChart, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Area, Bar, Cell } from "recharts";

interface Homework {
  id: number;
  materiTugas: string;
  startTime: string;
  endTime: string;
  deskripsi: string;
  detailTugas: string;
  jadwalPelajaranId: number;
  createdAt: string;
  updatedAt: string;
  tumbnail: string | null;
  sekolahId: number;
  jadwalMataPelajaran: {
    id: number;
    hari: string;
    jamMulai: string;
    jamSelesai: string;
    mataPelajaranId: number;
    guruId: number;
    createdAt: string;
    updatedAt: string;
    kelasId: number;
    sekolahId: number;
    mataPelajaran?: {
      id: number;
      namaMataPelajaran: string;
      kelasId: number;
      createdAt: string;
      updatedAt: string;
      sekolahId: number;
      kelas?: {
        id: number;
        namaKelas: string;
        level: string;
        kodeKelas: string | null;
        sekolahId: number;
        createdAt: string;
        updatedAt: string;
        deleteAt: string | null;
      };
    };
    guru?: {
      id: number;
      namaGuru: string;
      kode_guru: string;
      createdAt: string;
      updatedAt: string;
      userId: number;
      mataPelajaranId: number;
    };
  };
}

interface HomeworkCardListProps {
  tasks: Homework[];
  deleteTask: (id: number) => void;
  updateTask: (id: string, updates: any) => Promise<void>;
  alert: { success: (msg: string) => void; error: (msg: string) => void };
}

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
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    textTransform: "uppercase",
  },
  content: {
    marginBottom: 10,
    textAlign: "center",
    lineHeight: 1.5,
  },
  table: {
    display: "flex",
    flexDirection: "column",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    fontSize: 11,
    borderBottomColor: "#000",
  },
  tableCell: {
    padding: 5,
    borderRightWidth: 1,
    fontSize: 11,
    borderRightColor: "#000",
    textAlign: "center",
  },
  tableHeader: {
    fontWeight: "bold",
    backgroundColor: "#f0f0f0",
  },
  signature: {
    marginTop: 50,
    alignItems: "flex-end",
  },
  signatureImage: {
    width: 120,
    height: "auto",
    maxHeight: 50,
    marginTop: 20,
    marginBottom: 10,
  },
  signatureText: {
    textAlign: "center",
  },
});

const HomeworkPDF: React.FC<{
  tasks: Homework[];
  schoolData: {
    kopSurat: string | undefined;
    namaSekolah: string;
    namaKepalaSekolah: string;
    ttdKepalaSekolah: string | undefined;
  };
  date: string;
}> = ({ tasks, schoolData, date }) => {
  const kopSuratUrl = schoolData.kopSurat
    ? schoolData.kopSurat.startsWith("data:image")
      ? schoolData.kopSurat 
      : schoolData.kopSurat.includes('/Uploads')
      ? `https://dev.kiraproject.id${schoolData.kopSurat}`
      : `data:image/png;base64,${schoolData.kopSurat}`
    : undefined;

  const signatureUrl = schoolData.ttdKepalaSekolah
      ? schoolData.ttdKepalaSekolah.startsWith("data:image")
      ? schoolData.ttdKepalaSekolah 
      : schoolData.ttdKepalaSekolah.includes('/Uploads')
      ? `https://dev.kiraproject.id${schoolData.ttdKepalaSekolah}`
      : `data:image/png;base64,${schoolData.ttdKepalaSekolah}`
    : undefined;

  const rowsPerPage = 23;
  const dataChunks = [];
  for (let i = 0; i < tasks.length; i += rowsPerPage) {
    const chunk = tasks.slice(i, i + rowsPerPage);
    if (chunk.length > 0) {
      dataChunks.push(chunk);
    }
  }

  return (
    <Document>
      {dataChunks.map((chunk, pageIndex) => (
        <Page key={pageIndex} size="A4" style={pdfStyles.page} break={pageIndex > 0}>
          <View style={pdfStyles.header} fixed>
            {kopSuratUrl && <Image src={kopSuratUrl} style={pdfStyles.headerImage} />}
          </View>
          <View style={pdfStyles.contentWrapper}>
            <Text style={pdfStyles.title}>Daftar Tugas</Text>
            <Text style={pdfStyles.content}>Tanggal: {date || "Tanggal Tidak Diketahui"}</Text>
            <View style={pdfStyles.table}>
              <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]} fixed>
                {["No", "Nama Guru", "Materi Tugas", "Tanggal Mulai", "Tanggal Selesai"].map((header, index) => (
                  <View
                    key={index}
                    style={[
                      pdfStyles.tableCell,
                      pdfStyles.tableHeader,
                      {
                        width: index === 0 ? "5%" : index === 1 ? "25%" : index === 2 ? "35%" : "17.5%",
                      },
                    ]}
                  >
                    <Text>{header}</Text>
                  </View>
                ))}
              </View>
              {chunk.map((item, index) => (
                <View style={pdfStyles.tableRow} key={index} wrap={false}>
                  <View style={[pdfStyles.tableCell, { width: "5%" }]}>
                    <Text>{pageIndex * rowsPerPage + index + 1}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: "25%" }]}>
                    <Text>{item.jadwalMataPelajaran?.guru?.namaGuru || "-"}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: "35%" }]}>
                    <Text>{item.materiTugas || "-"}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: "17.5%" }]}>
                    <Text>{item.startTime ? dayjs(item.startTime).format("DD MMMM YYYY") : "-"}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: "17.5%" }]}>
                    <Text>{item.endTime ? dayjs(item.endTime).format("DD MMMM YYYY") : "-"}</Text>
                  </View>
                </View>
              ))}
            {pageIndex === dataChunks.length - 1 && (
              <View style={pdfStyles.signature}>
                <Text style={pdfStyles.signatureText}>Kepala Sekolah,</Text>
                {signatureUrl && <Image src={signatureUrl} style={pdfStyles.signatureImage} />}
                <Text style={pdfStyles.signatureText}>{schoolData.namaKepalaSekolah || "Nama Kepala Sekolah"}</Text>
              </View>
            )}
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
};

const generateHomeworkPDF = async ({
  tasks,
  alert,
  nameSchool,
  schoolData,
  schoolIsLoading,
}: {
  tasks: Homework[];
  alert: any;
  nameSchool: string;
  schoolData: any;
  schoolIsLoading: boolean;
}) => {
  if (schoolIsLoading) {
    alert.error("Data sekolah masih dimuat, silakan coba lagi.");
    return;
  }

  if (!schoolData || !schoolData?.[0].namaSekolah) {
    alert.error("Data sekolah tidak lengkap.");
    return;
  }

  if (!tasks || tasks.length === 0) {
    alert.error("Tidak ada data tugas untuk dihasilkan.");
    return;
  }

  try {
    const doc = (
      <HomeworkPDF
        tasks={tasks}
        schoolData={{
          namaSekolah: nameSchool?.[0],
          kopSurat: schoolData?.[0].kopSurat || undefined,
          namaKepalaSekolah: schoolData?.[0].namaKepalaSekolah || "Nama Kepala Sekolah",
          ttdKepalaSekolah: schoolData?.[0].ttdKepalaSekolah,
        }}
        date={dayjs().format("DD MMMM YYYY")}
      />
    );

    const pdfInstance = pdf(doc);
    const pdfBlob = await pdfInstance.toBlob();

    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Daftar-Tugas.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    alert.success("Daftar tugas berhasil diunduh.");
  } catch (error) {
    console.error("Error generating homework PDF:", error);
    alert.error("Gagal menghasilkan daftar tugas.");
  }
};

const HomeworkCardList: React.FC<HomeworkCardListProps> = ({ tasks, deleteTask, updateTask, alert }) => {
  const [open, setOpen] = useState(false);
  const [selectedHomework, setSelectedHomework] = useState<Homework | null>(null);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [selectId, setSelectId] = useState(0);
  const [updateForm, setUpdateForm] = useState<Partial<{
    materiTugas: string;
    startTime: string;
    endTime: string;
    jadwalPelajaranId: number;
    deskripsi: string;
    detailTugas: string;
  }>>({});
  const [isUpdating, setIsUpdating] = useState(false);

  const handleOpenModal = (homework: Homework) => {
    setSelectedHomework(homework);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedHomework(null);
    setOpen(false);
  };

  const handleOpenUpdateModal = (homework: Homework) => {
    setSelectedHomework(homework);
    setUpdateForm({
      materiTugas: homework.materiTugas,
      startTime: homework.startTime,
      endTime: homework.endTime,
      jadwalPelajaranId: homework.jadwalPelajaranId,
      deskripsi: homework.deskripsi,
      detailTugas: homework.detailTugas,
    });
    setOpenModalUpdate(true);
  };

  const handleCloseUpdateModal = () => {
    setSelectedHomework(null);
    setUpdateForm({});
    setOpenModalUpdate(false);
  };

  const handleUpdate = async () => {
    if (!selectedHomework) return;
    setIsUpdating(true);
    try {
      await updateTask({
        id: selectedHomework.id,
        updates: updateForm,
      });
      alert.success(lang.text('successUpdate') || 'Tugas berhasil diperbarui.');
      handleCloseUpdateModal();
    } catch (error: any) {
      alert.error(error.message || lang.text('failUpdate') || 'Gagal memperbarui tugas.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id);
      alert.success(lang.text('dataSuccessDelete') || 'Tugas berhasil dihapus.');
      setOpenModalDelete(false);
    } catch (error) {
      alert.error(error.message || lang.text('dataFailDelete') || 'Gagal menghapus tugas.');
    }
  };

  const handleDeleteData = (id: number) => {
    setSelectId(id);
    setOpenModalDelete(true);
  };

  // Handle no data
  if (!tasks || tasks.length === 0) {
    return (
      <div className="relative dark:bg-neutral-900/60 border border-dashed border-gray-300 dark:border-gray-600 h-[50vh] flex flex-col items-center justify-center rounded-xl p-6 text-center text-gray-500 dark:text-gray-400">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/10 opacity-40 dark:from-white/10 dark:to-white/0" />
          <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full" />
        </div>
        <img src="/iconTask.png" alt="task icon" className="w-24 mb-4" />
        {lang.text('noData')}
      </div>
    );
  }

  return (
    <>
      {openModalDelete && (
        <Vokadialog
          visible={openModalDelete}
          title={lang.text("deleteConfirmation")}
          content={lang.text("deleteConfirmationDesc", { context: 'tugas' })}
          footer={
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => handleDelete(selectId)}
                variant="destructive"
                className="bg-red-500 hover:bg-red-400 text-white transition-all duration-300 transform hover:scale-105"
                aria-label="Confirm delete task"
              >
                {lang.text("delete")}
              </Button>
              <Button
                onClick={() => setOpenModalDelete(false)}
                variant="outline"
                className="border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                aria-label="Cancel delete task"
              >
                {lang.text("cancel")}
              </Button>
            </div>
          }
        />
      )}
      {openModalUpdate && (
        <Dialog open={openModalUpdate} onOpenChange={setOpenModalUpdate}>
          <DialogContent className="sm:max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-xl shadow-2xl p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-800 dark:text-white">
                {lang.text('editPR')}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {[
                { label: "Materi Tugas", key: "materiTugas", placeholder: "Masukkan materi tugas" },
                { label: "Deskripsi", key: "deskripsi", placeholder: "Masukkan deskripsi" },
                { label: "Detail Tugas", key: "detailTugas", placeholder: "Masukkan detail tugas" },
                { label: "Tanggal Mulai", key: "startTime", type: "date" },
                { label: "Tanggal Selesai", key: "endTime", type: "date" },
                { label: "Jadwal Pelajaran ID", key: "jadwalPelajaranId", type: "number", placeholder: "Masukkan ID jadwal pelajaran" },
              ].map((field) => (
                <div key={field.key} className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {field.label}
                  </label>
                  <Input
                    type={field.type || "text"}
                    value={updateForm[field.key] || ''}
                    onChange={(e) =>
                      setUpdateForm({
                        ...updateForm,
                        [field.key]: field.type === "number" ? parseInt(e.target.value) : e.target.value,
                      })
                    }
                    placeholder={field.placeholder}
                    className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg py-2 focus:ring-blue-500"
                    aria-label={field.label}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={handleCloseUpdateModal}
                disabled={isUpdating}
                className="border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                aria-label="Cancel update task"
              >
                {lang.text('cancel')}
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="bg-blue-500 hover:bg-blue-400 text-white transition-all duration-300 transform hover:scale-105"
                aria-label="Save updated task"
              >
                {isUpdating ? <FaSpinner className="animate-spin mr-2" /> : null}
                {lang.text('save')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      <div className="grid dark:bg-neutral-900/60 p-4 border border-white/20 rounded-xl grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tasks.map((homework) => (
          <Card
            key={homework.id}
            className="relative dark:bg-neutral-900/60 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div
              className={`${
                dayjs().isAfter(dayjs(homework.endTime)) ? 'bg-red-500' : 'bg-green-500'
              } absolute top-4 right-4 w-3 h-3 rounded-full`}
            />
            <CardHeader>
              <img src="/iconTask.png" alt="task icon" className="w-12 mb-2" />
              <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
                {homework.materiTugas || 'Unnamed Task'}
              </CardTitle>
              <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                {homework.jadwalMataPelajaran?.mataPelajaran?.namaMataPelajaran || 'Unknown Subject'} -{' '}
                <span className="font-semibold text-gray-700 dark:text-gray-200">
                  [ Kelas {homework.jadwalMataPelajaran?.kelas?.namaKelas || 'Kelas tidak ada'} ]
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Deskripsi:</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{homework.deskripsi || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Detail Tugas:</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{homework.detailTugas || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Guru:</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {homework.jadwalMataPelajaran?.guru?.namaGuru || 'Unknown Teacher'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Hari:</p>
                  <Badge
                    variant="outline"
                    className="bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-400"
                  >
                    {homework.jadwalMataPelajaran?.hari || 'Unknown Day'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Waktu:</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {homework.startTime ? dayjs(homework.startTime).format('DD MMMM YYYY') : '-'} -{' '}
                    {homework.endTime ? dayjs(homework.endTime).format('DD MMMM YYYY') : '-'}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col justify-end items-end">
              <div className="flex justify-between w-full gap-2">
                <Button
                  className="flex-1 bg-blue-500 hover:bg-blue-400 text-white transition-all duration-300 transform hover:scale-105"
                  onClick={() => handleOpenModal(homework)}
                  aria-label={`View details for ${homework.materiTugas}`}
                >
                  Detail
                </Button>
                <Button
                  className="flex-1 bg-blue-500 hover:bg-blue-400 text-white transition-all duration-300 transform hover:scale-105"
                  onClick={() => handleOpenUpdateModal(homework)}
                  aria-label={`Update ${homework.materiTugas}`}
                >
                  {lang.text('update')}
                </Button>
                <Button
                  className="flex-1 bg-red-500 hover:bg-red-400 text-white transition-all duration-300 transform hover:scale-105"
                  variant="destructive"
                  onClick={() => handleDeleteData(homework.id)}
                  aria-label={`Delete ${homework.materiTugas}`}
                >
                  {lang.text('delete')}
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[60vw] bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-xl shadow-2xl p-6">
          <DialogHeader className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <Button
              className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-400 text-white transition-all duration-300 transform hover:scale-105"
              onClick={handleCloseModal}
              aria-label="Close task details modal"
            >
              Tutup
            </Button>
            <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-white">
              {selectedHomework?.materiTugas || 'Unnamed Task'}
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              {selectedHomework?.jadwalMataPelajaran?.mataPelajaran?.namaMataPelajaran || 'Unknown Subject'} -{' '}
              Kelas {selectedHomework?.jadwalMataPelajaran?.kelas?.namaKelas || 'Unknown Class'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {[
              { label: "Deskripsi", value: selectedHomework?.deskripsi },
              { label: "Detail Tugas", value: selectedHomework?.detailTugas },
              { label: "Guru", value: selectedHomework?.jadwalMataPelajaran?.guru?.namaGuru },
              {
                label: "Hari",
                value: (
                  <Badge
                    variant="outline"
                    className="bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-400 py-1"
                  >
                    {selectedHomework?.jadwalMataPelajaran?.hari || 'Unknown Day'}
                  </Badge>
                ),
              },
              {
                label: "Waktu",
                value: selectedHomework
                  ? `${selectedHomework.startTime ? dayjs(selectedHomework.startTime).format('DD MMMM YYYY') : '-'} - ${
                      selectedHomework.endTime ? dayjs(selectedHomework.endTime).format('DD MMMM YYYY') : '-'
                    }`
                  : '-',
              },
              {
                label: "Status",
                value: (
                  <Badge
                    variant={selectedHomework && dayjs().isAfter(dayjs(selectedHomework.endTime)) ? "destructive" : "default"}
                    className={`${
                      selectedHomework && dayjs().isAfter(dayjs(selectedHomework.endTime))
                        ? 'bg-red-500 text-white'
                        : 'bg-green-500 text-white'
                    } pt-1.5 pb-1`}
                  >
                    {selectedHomework && dayjs().isAfter(dayjs(selectedHomework.endTime)) ? "Tenggat Waktu Lewat" : "AKTIF"}
                  </Badge>
                ),
              },
              {
                label: "Dibuat",
                value: selectedHomework?.createdAt ? dayjs(selectedHomework.createdAt).format('DD MMMM YYYY HH:mm') : '-',
              },
              {
                label: "Diperbarui",
                value: selectedHomework?.updatedAt ? dayjs(selectedHomework.updatedAt).format('DD MMMM YYYY HH:mm') : '-',
              },
            ].map(({ label, value }) => (
              <div key={label} className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium col-span-1 flex justify-between text-gray-700 dark:text-gray-200">
                  {label}:<span>:</span>
                </span>
                <span className="col-span-3 text-gray-800 dark:text-white">{value || '-'}</span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const HomeWorkLanding = () => {
  const [nameFilter, setNameFilter] = useState("");
  const [dayFilter, setDayFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [guruFilter, setGuruFilter] = useState("all");
  const [kelasFilter, setKelasFilter] = useState("all");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [createForm, setCreateForm] = useState<{
    materiTugas: string;
    startTime: string;
    endTime: string;
    jadwalPelajaranId: number;
    deskripsi: string;
    detailTugas: string;
  }>({
    materiTugas: '',
    startTime: '',
    endTime: '',
    jadwalPelajaranId: 0,
    deskripsi: '',
    detailTugas: '',
  });
  const [isCreating, setIsCreating] = useState(false);
  const profile = useProfile();
  const alert = useAlert();
  const { data: schoolData, isLoading: schoolIsLoading } = useSchool();
  const { data: tasks, isLoading: tasksIsLoading, deleteTask, updateTask, createTask } = useTask();

  const dayOrder = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];

  // Apply filters
  const filteredTasks = tasks?.filter((task: Homework) => {
    const matchesName = nameFilter === "" || task.materiTugas.toLowerCase().includes(nameFilter.toLowerCase());
    const matchesDay = dayFilter === "all" || task.jadwalMataPelajaran?.hari?.toLowerCase() === dayFilter;
    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "active" && !dayjs().isAfter(dayjs(task.endTime))) ||
      (statusFilter === "expired" && dayjs().isAfter(dayjs(task.endTime)));
    const matchesGuru = guruFilter === "all" || task.jadwalMataPelajaran?.guru?.namaGuru === guruFilter;
    const matchesKelas = kelasFilter === "all" || task.jadwalMataPelajaran?.kelas?.namaKelas === kelasFilter;
    return matchesName && matchesDay && matchesStatus && matchesGuru && matchesKelas;
  }) || [];

  // Prepare data for AreaChart (tasks by day)
  const taskProgressData = useMemo(() => {
    const countsByDay = dayOrder.map((day) => {
      const tasksOnDay = filteredTasks.filter(
        (task) => task.jadwalMataPelajaran?.hari?.toLowerCase() === day
      );
      return {
        label: day.charAt(0).toUpperCase() + day.slice(1),
        terkumpul: tasksOnDay.filter((task) => dayjs().isAfter(dayjs(task.endTime))).length,
        belumDinilai: tasksOnDay.filter((task) => !dayjs().isAfter(dayjs(task.endTime))).length,
        progres: tasksOnDay.length,
      };
    });
    return countsByDay;
  }, [filteredTasks]);

  // Prepare data for BarChart (tasks by status)
  const taskStatusData = useMemo(() => {
    const activeCount = filteredTasks.filter((task) => !dayjs().isAfter(dayjs(task.endTime))).length;
    const expiredCount = filteredTasks.filter((task) => dayjs().isAfter(dayjs(task.endTime))).length;
    return [
      { label: lang.text('active') || 'Aktif', count: activeCount },
      { label: lang.text('expired') || 'Kedaluwarsa', count: expiredCount },
    ];
  }, [filteredTasks]);

  const handleOpenCreateModal = () => {
    setCreateForm({
      materiTugas: '',
      startTime: '',
      endTime: '',
      jadwalPelajaranId: 0,
      deskripsi: '',
      detailTugas: '',
    });
    setOpenModalCreate(true);
  };

  const handleCloseCreateModal = () => {
    setCreateForm({
      materiTugas: '',
      startTime: '',
      endTime: '',
      jadwalPelajaranId: 0,
      deskripsi: '',
      detailTugas: '',
    });
    setOpenModalCreate(false);
  };

  const handleCreate = async () => {
    if (!createForm.materiTugas || !createForm.jadwalPelajaranId) {
      alert.error('Materi tugas dan ID jadwal pelajaran harus diisi.');
      return;
    }
    setIsCreating(true);
    try {
      await createTask(createForm);
      alert.success(lang.text('successCreate') || 'Tugas berhasil dibuat.');
      handleCloseCreateModal();
    } catch (error: any) {
      alert.error(error.message || lang.text('failCreate') || 'Gagal membuat tugas.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      await generateHomeworkPDF({
        tasks: filteredTasks,
        alert,
        nameSchool: profile.user?.sekolah?.namaSekolah || "",
        schoolData,
        schoolIsLoading,
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Extract unique teachers and classes for filter options
  const uniqueTeachers = Array.from(
    new Set(tasks?.map((task: Homework) => task.jadwalMataPelajaran?.guru?.namaGuru).filter(Boolean))
  );
  const uniqueClasses = Array.from(
    new Set(tasks?.map((task: Homework) => task.jadwalMataPelajaran?.kelas?.namaKelas).filter(Boolean))
  );

  return (
    <div className="min-h-screen text-gray-800 dark:text-white pb-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/10 opacity-40 dark:from-white/10 dark:to-white/0" />
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full" />
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
      <div className="flex items-center dark:bg-neutral-900/60 p-4 border border-white/20 rounded-xl gap-3 mb-6 flex-wrap">
        <Input
          type="text"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          placeholder={lang.text("search") || "Filter by name..."}
          className="w-[250px] bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500"
          aria-label="Search tasks"
        />
        <Select value={dayFilter} onValueChange={setDayFilter}>
          <SelectTrigger className="w-max bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500">
            <SelectValue placeholder="Filter Hari" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{lang.text('allDays')}</SelectItem>
            {dayOrder.map((day) => (
              <SelectItem key={day} value={day}>
                {day}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-max bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{lang.text('allStatus')}</SelectItem>
            <SelectItem value="active">{lang.text('active') || 'Aktif'}</SelectItem>
            <SelectItem value="expired">{lang.text('expired') || 'Kedaluwarsa'}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={guruFilter} onValueChange={setGuruFilter}>
          <SelectTrigger className="w-max bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500">
            <SelectValue placeholder="Filter Guru" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{lang.text('allTeachers') || 'Semua Guru'}</SelectItem>
            {uniqueTeachers.map((guru) => (
              <SelectItem key={guru} value={guru}>
                {guru}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={kelasFilter} onValueChange={setKelasFilter}>
          <SelectTrigger className="w-max bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500">
            <SelectValue placeholder="Filter Kelas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{lang.text('allClasses') || 'Semua Kelas'}</SelectItem>
            {uniqueClasses.map((kelas) => (
              <SelectItem key={kelas} value={kelas}>
                {kelas}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="ml-auto flex items-center gap-3">
          <Button
            className="bg-transparent border border-teal-400 text-teal-300 hover:text-white hover:bg-teal-100 dark:hover:bg-teal-500 transition-all duration-300 transform flex items-center gap-2"
            onClick={handleOpenCreateModal}
            aria-label="Create new task"
          >
            <FaPlus size={16} />
            {lang.text('createTask')}
          </Button>
          <Button
            className="w-max bg-transparent border border-red-400 text-red-300 hover:text-white hover:bg-red-100 dark:hover:bg-red-500 transition-all duration-300 transform flex items-center gap-2"
            variant="outline"
            aria-label="Download PDF"
            disabled={isGeneratingPDF || schoolIsLoading}
            onClick={handleDownloadPDF}
          >
            {isGeneratingPDF ? (
              <>
                {lang.text('downloadPDF')}
                <FaSpinner className="animate-spin ml-2" />
              </>
            ) : (
              <>
                <FaFilePdf size={16} />
                {lang.text('downloadPDF') || "Unduh Daftar Tugas"}
              </>
            )}
          </Button>
        </div>
      </div>

      {openModalCreate && (
        <Dialog open={openModalCreate} onOpenChange={setOpenModalCreate}>
          <DialogContent className="sm:max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-xl shadow-2xl p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-800 dark:text-white">
                {lang.text('createTask')}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {[
                { label: "Materi Tugas", key: "materiTugas", placeholder: "Masukkan materi tugas" },
                { label: "Deskripsi", key: "deskripsi", placeholder: "Masukkan deskripsi" },
                { label: "Detail Tugas", key: "detailTugas", placeholder: "Masukkan detail tugas" },
                { label: "Tanggal Mulai", key: "startTime", type: "date" },
                { label: "Tanggal Selesai", key: "endTime", type: "date" },
                { label: "Jadwal Pelajaran ID", key: "jadwalPelajaranId", type: "number", placeholder: "Masukkan ID jadwal pelajaran" },
              ].map((field) => (
                <div key={field.key} className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {field.label}
                  </label>
                  <Input
                    type={field.type || "text"}
                    value={createForm[field.key]}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        [field.key]: field.type === "number" ? parseInt(e.target.value) : e.target.value,
                      })
                    }
                    placeholder={field.placeholder}
                    className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg py-2 focus:ring-blue-500"
                    aria-label={field.label}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={handleCloseCreateModal}
                disabled={isCreating}
                className="border-gray-300 bg-white/10 dark:border-gray-600 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                aria-label="Cancel create task"
              >
                {lang.text('cancel')}
              </Button>
              <Button
                onClick={handleCreate}
                disabled={isCreating}
                className="bg-green-500 hover:bg-green-400 text-white transition-all duration-300 transform hover:scale-105"
                aria-label="Create task"
              >
                {isCreating ? <FaSpinner className="animate-spin mr-2" /> : null}
                {lang.text('createNow')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {tasksIsLoading ? (
        <div className="border border-dashed border-gray-300 dark:border-gray-600 h-[50vh] flex flex-col items-center justify-center rounded-xl p-6 text-center text-gray-500 dark:text-gray-400">
          <FaSpinner className="animate-spin text-blue-500 dark:text-blue-400 text-3xl mb-4" />
          <p>Loading tasks...</p>
        </div>
      ) : !tasks ? (
        <div className="dark:bg-neutral-900/60 text-center text-red-500 dark:text-red-400">No tasks available or an error occurred.</div>
      ) : (
        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList className="bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-lg p-1">
            <TabsTrigger
              value="tasks"
              className="px-4 py-2 text-gray-800 dark:text-white data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-md transition-all duration-300"
            >
              {lang.text('task') || 'Tasks'}
            </TabsTrigger>
            <TabsTrigger
              value="charts"
              className="px-4 py-2 text-gray-800 dark:text-white data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-md transition-all duration-300"
            >
              Grafik
            </TabsTrigger>
          </TabsList>
          <TabsContent value="charts" className="animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="dark:bg-neutral-900/60 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
                    Task Progress by Day
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                    Jumlah tugas per hari berdasarkan filter
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={taskProgressData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                        <XAxis dataKey="label" stroke="#9ca3af" tick={{ fill: "#9ca3af" }} />
                        <YAxis allowDecimals={false} stroke="#9ca3af" tick={{ fill: "#9ca3af" }} />
                        <Tooltip
                          cursor={{ stroke: "#374151" }}
                          contentStyle={{ background: "#0a0a0a", border: "1px solid #1f2937", borderRadius: 12 }}
                        />
                        <Legend wrapperStyle={{ color: "#9ca3af" }} />
                        <Area
                          type="monotone"
                          dataKey="terkumpul"
                          name="Terkumpul"
                          stroke="#3B82F6"
                          fill="#3B82F6"
                          fillOpacity={0.4}
                          strokeWidth={2}
                        />
                        <Area
                          type="monotone"
                          dataKey="belumDinilai"
                          name="Belum Dinilai"
                          stroke="#60A5FA"
                          fill="#60A5FA"
                          fillOpacity={0.4}
                          strokeWidth={2}
                        />
                        <Area
                          type="monotone"
                          dataKey="progres"
                          name="Progres"
                          stroke="#93C5FD"
                          fill="#93C5FD"
                          fillOpacity={0.4}
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card className="dark:bg-neutral-900/60 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
                    Task Distribution by Status
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                    Distribusi tugas berdasarkan status aktif dan kedaluwarsa
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={taskStatusData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                        <XAxis dataKey="label" stroke="#9ca3af" tick={{ fill: "#9ca3af" }} />
                        <YAxis allowDecimals={false} stroke="#9ca3af" tick={{ fill: "#9ca3af" }} />
                        <Tooltip
                          cursor={{ stroke: "#374151" }}
                          contentStyle={{ background: "#0a0a0a", border: "1px solid #1f2937", borderRadius: 12 }}
                        />
                        <Legend wrapperStyle={{ color: "#9ca3af" }} />
                        <Bar dataKey="count" radius={[8, 8, 0, 0]} fill="#ffffff">
                          {taskStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? "#3B82F6" : "#60A5FA"} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="tasks" className="animate-fade-in">
            <HomeworkCardList
              tasks={filteredTasks}
              deleteTask={deleteTask}
              updateTask={updateTask}
              alert={alert}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

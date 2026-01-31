// import { lang } from '@/core/libs';
// import { useAlert } from '@/features/_global';
// import { useClassroom } from '@/features/classroom';
// import { useCourse } from '@/features/course';
// import { useProfile } from '@/features/profile';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';
// import { Download, Repeat, X } from 'lucide-react';
// import { useEffect, useRef, useState } from 'react';
// import { FaMicrophone, FaUpload } from 'react-icons/fa';
// import QRCode from 'react-qr-code';

// interface QRCodeDisplayProps {
//   generateQrCode: (data: { kelasId: string; mataPelajaranId: string; jamMulai?: string; jamSelesai?: string }) => void;
//   qrCodeData: string | null;
//   isDisabled: boolean;
// }

// const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
//   generateQrCode,
//   qrCodeData: propQrCodeData,
//   isDisabled,
// }) => {
//   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
//   const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
//   const [isSummaryModalOpen, setIsSummaryModalOpen] = useState<boolean>(false);
//   const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
//   const [formData, setFormData] = useState({
//     idKelas: '',
//     idMataPelajaran: '',
//     jamMulai: '',
//     jamSelesai: '',
//     topik: '',
//     penjelasanGuru: '',
//   });
//   const [summary, setSummary] = useState<string | null>(null);
//   const [activeTab, setActiveTab] = useState("summary");
//   const [transcript, setTranscript] = useState<string | null>('Belum ada transkrip');
//   const [fileName, setFileName] = useState<string | null>(lang.text('summarizeByX'));
//   const [isDownloading, setIsDownloading] = useState<boolean>(false);
//   const [audioFile, setAudioFile] = useState<File | null>(null);
//   const [isUploadingAudio, setIsUploadingAudio] = useState<boolean>(false);
//   const qrContainerRef = useRef<HTMLDivElement>(null);
//   const qrCodeRef = useRef<HTMLDivElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [qrSize, setQrSize] = useState<number>(0);
//   const classRooms = useClassroom();
//   const course = useCourse();
//   const [isDisabledButton, setIsDisabledButton] = useState(false);

//   // Add local state to manage qrCodeData
//   const [localQrCodeData, setLocalQrCodeData] = useState<string | null>(null);

//   const storedSummary = localStorage.getItem('audioSummary') || null;

//   const [editedSummary, setEditedSummary] = useState(() => {
//     if (!storedSummary) {
//       return 'Belum ada rangkuman.';
//     }

//     if (storedSummary.includes('Sedang proses merangkum')) {
//       return 'Belum ada rangkuman atau mungkin masih proses merangkum...';
//     }

//     return storedSummary;
//   });
//   const alert = useAlert();
//   const profile = useProfile();

//   // Load qrCodeData from localStorage on component mount
//   useEffect(() => {
//     const storedQrCodeData = localStorage.getItem('qrCodeData');
//     if (storedQrCodeData) {
//       setLocalQrCodeData(storedQrCodeData);
//     }
//   }, []);

//   // Update localQrCodeData and localStorage when propQrCodeData changes
//   useEffect(() => {
//     if (propQrCodeData) {
//       setLocalQrCodeData(propQrCodeData);
//       localStorage.setItem('qrCodeData', propQrCodeData);
//     }
//   }, [propQrCodeData]);

//   useEffect(() => {
//     const now = new Date();
//     const localHour = (now.getUTCHours() + 7) % 24; // Adjust for UTC+7 and wrap around 24 hours
//     setIsDisabledButton(localHour >= 6 && localHour < 22); // True from 6 AM to 10 PM
//   }, []);

//   const toggleModal = () => {
//     setIsModalOpen(!isModalOpen);
//   };

//   const toggleFormModal = () => {
//     setIsFormModalOpen(!isFormModalOpen);
//   };

//   const toggleSummaryModal = () => {
//     setIsSummaryModalOpen(!isSummaryModalOpen);
//   };

//   const toggleUploadModal = () => {
//     setIsUploadModalOpen(!isUploadModalOpen);
//   };

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));

//     if (name === 'idKelas' && value) {
//       const selectedClass = classRooms?.data.find((kelas) => kelas.id === Number(value));
//       if (selectedClass) {
//         localStorage.setItem(
//           'selectedClass',
//           JSON.stringify({
//             idKelas: selectedClass.id,
//             namaKelas: selectedClass.namaKelas,
//           })
//         );
//       }
//       setFormData((prev) => ({ ...prev, idMataPelajaran: '' }));
//       localStorage.removeItem('selectedCourse');
//     } else if (name === 'idKelas' && !value) {
//       localStorage.removeItem('selectedClass');
//       localStorage.removeItem('selectedCourse');
//       setFormData((prev) => ({ ...prev, idMataPelajaran: '' }));
//     }

//     if (name === 'idMataPelajaran' && value) {
//       const selectedCourse = course?.data.find((subject) => subject.id === Number(value));
//       if (selectedCourse) {
//         localStorage.setItem(
//           'selectedCourse',
//           JSON.stringify({
//             idMataPelajaran: selectedCourse.id,
//             namaMataPelajaran: selectedCourse.namaMataPelajaran,
//           })
//         );
//       }
//     } else if (name === 'idMataPelajaran' && !value) {
//       localStorage.removeItem('selectedCourse');
//     }
//   };

//   const handleFormSubmit = () => {
//     if (formData.idKelas && formData.idMataPelajaran) {
//       generateQrCode({
//         kelasId: formData.idKelas,
//         mataPelajaranId: formData.idMataPelajaran,
//       });
//       toggleFormModal();
//     } else {
//       alert.error('Please fill in all required fields.');
//     }
//   };

//   const handleDownloadQrCode = async () => {
//     if (!localQrCodeData || !qrCodeRef.current) return;
//     setIsDownloading(true);
//     try {
//       const canvas = await html2canvas(qrCodeRef.current, {
//         scale: 2,
//         backgroundColor: '#ffffff',
//       });

//       if (canvas.width === 0 || canvas.height === 0) {
//         throw new Error('Canvas is empty');
//       }

//       const dataUrl = canvas.toDataURL('image/png');
//       const img = new Image();
//       const imageLoadPromise = new Promise((resolve, reject) => {
//         img.onload = resolve;
//         img.onerror = () => reject(new Error('Invalid image data'));
//         img.src = dataUrl;
//       });
//       await imageLoadPromise;

//       const selectedClass = JSON.parse(localStorage.getItem('selectedClass') || '{}');
//       const selectedCourse = JSON.parse(localStorage.getItem('selectedCourse') || '{}');
//       const fileName = `qr-code-${selectedClass.namaKelas || 'class'}-${selectedCourse.namaMataPelajaran || 'course'}.png`;

//       const link = document.createElement('a');
//       link.href = dataUrl;
//       link.download = fileName;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (error) {
//       console.error('Failed to download QR code image:', error);
//       alert.error('Gagal mengunduh gambar QR code. Silakan coba lagi.');
//     } finally {
//       setIsDownloading(false);
//     }
//   };

//   const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] || null;
//     if (file && ['audio/mpeg', 'audio/wav'].includes(file.type)) {
//       setAudioFile(file);
//     } else {
//       alert.error('Tolong pilih file dengan format mp3/wav.');
//       setAudioFile(null);
//     }
//   };

//   const validateAudio = (file: File): Promise<boolean> => {
//     return new Promise((resolve) => {
//       const audio = new Audio();
//       audio.src = URL.createObjectURL(file);
//       audio.onloadedmetadata = () => {
//         if (audio.duration > 0) {
//           resolve(true);
//         } else {
//           resolve(false);
//         }
//         URL.revokeObjectURL(audio.src);
//       };
//       audio.onerror = () => {
//         resolve(false);
//         URL.revokeObjectURL(audio.src);
//       };
//     });
//   };

//   const handleAudioUpload = async () => {
//     if (!audioFile) {
//       alert.error('Silakan pilih file audio untuk diunggah.');
//       return;
//     }

//     if (audioFile.size === 0) {
//       alert.error('File audio kosong. Silakan unggah file yang valid.');
//       return;
//     }

//     if (audioFile.size > 50 * 1024 * 1024) {
//       alert.error('Ukuran file melebihi batas maksimum 50MB. Silakan unggah file yang lebih kecil.');
//       return;
//     }

//     const allowedTypes = ['audio/wav', 'audio/mp3', 'audio/mpeg'];
//     if (!allowedTypes.includes(audioFile.type)) {
//       alert.error('Format file tidak didukung. Harap unggah file .mp3 atau .wav.');
//       return;
//     }

//     const isValidAudio = await validateAudio(audioFile);
//     if (!isValidAudio) {
//       alert.error('File audio tidak valid atau rusak. Silakan unggah file .mp3 atau .wav yang valid.');
//       return;
//     }

//     setIsUploadingAudio(true);

//     const token = localStorage.getItem('token');
//     if (!token) {
//       alert.error('Silakan login ulang terdahulu');
//       setIsUploadingAudio(false);
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', audioFile);

//     const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

//     try {
//       let isDone = false;

//       while (!isDone) {
//         console.log('Mengirim file untuk proses / polling...');

//         const response = await fetch('https://app.kiraproject.id/upload', {
//           method: 'POST',
//           headers: {
//             ...(token && { Authorization: `Bearer ${token}` }),
//           },
//           body: formData,
//         });

//         if (!response.ok) {
//           const errorData = await response.json().catch(() => ({ error: 'Detail error tidak tersedia' }));
//           alert.error(`HTTP error! Status: ${response.status}, Detail: ${errorData.error || 'Error tidak diketahui'}`);
//           break;
//         }

//         const result = await response.json();
//         console.log('result summarize:', result);

//         if (result?.status && result?.status === 'processing') {
//           setSummary('Sedang proses merangkum');
//           setTranscript('Sedang proses transkrip');
//           setEditedSummary('Sedang proses merangkum');
//           setFileName(audioFile?.name);
//           localStorage.setItem('audioTranscript', 'Sedang proses transript');
//           localStorage.setItem('audioSummary', 'Sedang proses merangkum');
//           localStorage.setItem('statusFile', 'processing')
          
//           await delay(600000); // 10 menit delay
//         } else {
//           const summaryText = result.summary || 'Audio berhasil diringkas.';
//           const summaryTranscript = result.transcript || 'Audio berhasil ditranskrip.';
          
//           setIsUploadingAudio(false);
//           setSummary(summaryText);
//           setEditedSummary(summaryText);
//           setFileName(audioFile?.name);
//           setTranscript(summaryTranscript);
//           localStorage.setItem('audioSummary', summaryText);
//           localStorage.setItem('audioTranscript', summaryTranscript);
//           localStorage.setItem('statusFile', 'done')
//           setIsSummaryModalOpen(true);
//           setIsUploadModalOpen(false);

//           isDone = true;
//         }
//       }
//     } catch (error) {
//       console.error('Gagal mengunggah file audio:', {
//         message: error.message,
//         stack: error.stack,
//         audioFileName: audioFile.name,
//         audioFileSize: audioFile.size,
//         audioFileType: audioFile.type,
//       });
//       alert.error(`Gagal mengunggah file audio: ${error.message}. Silakan coba lagi.`);
//     } finally {
//       setIsUploadingAudio(false);
//       setAudioFile(null);
//       if (fileInputRef.current) {
//         fileInputRef.current.value = '';
//       }
//     }
//   };

//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//   };

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     const file = e.dataTransfer.files?.[0] || null;
//     if (file && ['audio/mpeg', 'audio/wav'].includes(file.type)) {
//       setAudioFile(file);
//     } else {
//       alert.error('Please drop a valid MP3 or WAV file.');
//       setAudioFile(null);
//     }
//   };

//   const handleClearFile = () => {
//     setAudioFile(null);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   const handleChooseFile = () => {
//     fileInputRef.current?.click();
//   };

//   useEffect(() => {
//     const updateQrSize = () => {
//       if (qrContainerRef.current) {
//         const containerWidth = qrContainerRef.current.offsetWidth;
//         const availableWidth = containerWidth - 16 - 8;
//         setQrSize(availableWidth);
//       }
//     };
//     updateQrSize();
//     window.addEventListener('resize', updateQrSize);
//     return () => window.removeEventListener('resize', updateQrSize);
//   }, [localQrCodeData]);

//   const handleSaveSummary = () => {
//     setSummary(editedSummary);
//     localStorage.setItem('audioSummary', editedSummary);
//     alert.success(lang.text('successUpdateSummary'));
//   };

//   const handleDownloadPDF = () => {
//     const doc = new jsPDF({
//       format: "a4",
//       unit: "mm",
//     });

//     const marginLeft = 15;
//     const marginTop = 20;
//     const pageWidth = doc.internal.pageSize.getWidth();
//     const maxWidth = pageWidth - marginLeft * 2;

//     const namaGuru = profile?.user?.name || 'Nama guru pengajar';
//     const tanggal = new Date().toLocaleDateString("id-ID", {
//       day: "2-digit",
//       month: "long",
//       year: "numeric",
//     });

//     const selectedCourse = JSON.parse(localStorage.getItem('selectedCourse') || '{}');

//     doc.setFont("Helvetica", "bold");
//     doc.setFontSize(16);
//     doc.text(selectedCourse.namaMataPelajaran || "Nama mata pelajaran", marginLeft, marginTop);

//     doc.setFontSize(11);
//     doc.setFont("Helvetica", "normal");
//     doc.text(`Tanggal: ${tanggal}`, marginLeft, marginTop + 10);
//     doc.text(`Nama Guru: ${namaGuru}`, marginLeft, marginTop + 16);

//     doc.setFontSize(12);
//     doc.text(editedSummary, marginLeft, marginTop + 30, {
//       maxWidth: maxWidth,
//       align: "left",
//     });

//     doc.save(`Rangkuman ${selectedCourse.namaMataPelajaran || "Rangkuman"}.pdf`);
//   };

//   return (
//     <div className="relative z-[33] top-4 flex flex-col items-center">
//       <style>
//         {`
//           .animated-gradient {
//               background: linear-gradient(
//                 45deg,
//                 rgba(139, 92, 246, 0.6),
//                 rgba(59, 130, 246, 0.6),
//                 rgba(251, 146, 60, 0.6),
//                 rgba(139, 92, 246, 0.6)
//               );
//               background-size: 400% 400%;
//               animation: gradientShift 8s ease infinite;
//             }

//             @keyframes gradientShift {
//               0% { background-position: 0% 50%; }
//               50% { background-position: 100% 50%; }
//               100% { background-position: 0% 50%; }
//             }
//         `}
//       </style>
//       {localQrCodeData && (
//         <div
//           ref={qrContainerRef}
//           onClick={toggleModal}
//           className="mt-4 bg-white p-2 shadow-md rounded border dark:border-white/20 border-black/80 cursor-pointer transition-transform duration-200 hover:brightness-90 active:scale-[0.99] w-full flex flex-col items-center"
//         >
//           <div ref={qrCodeRef}>
//             <QRCode
//               value={localQrCodeData}
//               size={qrSize}
//               style={{ width: '100%', height: 'auto' }}
//             />
//           </div>
//         </div>
//       )}
//       <div className="w-full grid grid-cols-3 mt-5 justify-between gap-4">
//         <div className='text-center flex flex-col justify-center items-center gap-3'>
//           <button
//             onClick={toggleUploadModal}
//             className="w-[50px] h-[50px] flex justify-center items-center border border-dashed border-black dark:border-white rounded-md text-black text-lg bg-white hover:text-white hover:bg-blue-600 transition-colors duration-200"
//           >
//             <FaMicrophone />
//           </button>
//           <small className='w-full text-[9px]'>Upload audio</small>
//         </div>
//         <div className='text-center flex flex-col justify-center items-center gap-3'>
//           <button
//             onClick={handleDownloadQrCode}
//             className={`w-[50px] h-[50px] mx-auto border border-dashed border-black dark:border-white gap-3 text-center flex items-center justify-center bg-white rounded-md ${
//               !localQrCodeData || isDownloading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 hover:text-white text-black'
//             } transition-colors duration-200`}
//             disabled={!localQrCodeData || isDownloading}
//           >
//             {isDownloading ? <FaUpload /> : <Download className="scale-[0.9]" />}
//           </button>
//           <small className='w-full text-[9px]'>Download QR</small>
//         </div>
//         <div className='text-center flex flex-col justify-center items-center gap-3'>
//           <button
//             onClick={toggleFormModal}
//             className="w-[50px] h-[50px] border border-dashed border-black dark:border-white flex justify-center items-center rounded-md text-black text-lg bg-white hover:text-white hover:bg-blue-600 transition-colors duration-200"
//           >
//             <Repeat />
//           </button>
//           <small className='w-full text-[9px]'>Generate QR</small>
//         </div>
//       </div>
//       {/* {localQrCodeData && (
//       )} */}
//       {isFormModalOpen && (
//         <div
//           className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-90"
//           onClick={toggleFormModal}
//         >
//           <div
//             className="bg-gray-800 p-6 rounded-lg shadow-xl w-[90vw] max-w-md"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <h3 className="text-lg font-semibold text-white mb-4">Generate QR Code</h3>
//             <div className="space-y-4">
//               <div>
//                 <label htmlFor="idKelas" className="block text-sm font-medium text-gray-300">
//                   Kelas
//                 </label>
//                 <select
//                   id="idKelas"
//                   name="idKelas"
//                   value={formData.idKelas}
//                   onChange={handleInputChange}
//                   className="mt-1 w-full p-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-700"
//                 >
//                   <option value="">Pilih Kelas</option>
//                   {classRooms?.data.map((kelas) => (
//                     <option key={kelas.id} value={kelas.id}>
//                       {kelas.namaKelas}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label htmlFor="idMataPelajaran" className="block text-sm font-medium text-gray-300">
//                   Mata Pelajaran
//                 </label>
//                 <select
//                   id="idMataPelajaran"
//                   name="idMataPelajaran"
//                   value={formData.idMataPelajaran}
//                   onChange={handleInputChange}
//                   disabled={!formData.idKelas}
//                   className={`mt-1 w-full p-2 rounded-md border focus:outline-none focus:ring-2 ${
//                     !formData.idKelas
//                       ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
//                       : 'bg-gray-700 text-white border-gray-600 focus:ring-blue-700'
//                   }`}
//                 >
//                   <option value="">Pilih Mata Pelajaran</option>
//                   {course?.data
//                     .filter((subject) => subject?.kelasId === Number(formData.idKelas))
//                     .map((subject) => (
//                       <option key={subject.id} value={subject.id}>
//                         {subject.namaMataPelajaran}
//                       </option>
//                     ))}
//                 </select>
//               </div>
//             </div>
//             <div className="mt-6 flex justify-end gap-4">
//               <button
//                 onClick={toggleFormModal}
//                 className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleFormSubmit}
//                 className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-600"
//               >
//                 Generate
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       {isModalOpen && localQrCodeData && (
//         <div
//           className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
//             isModalOpen ? 'opacity-100' : 'opacity-0'
//           } animated-gradient backdrop-blur-sm`}
//           onClick={toggleModal}
//         >
//           <div
//             className={`relative bg-white p-4 rounded-lg shadow-xl transform transition-all duration-300 ${
//               isModalOpen ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
//             } border border-gray-200 w-[90vw] h-[90vw] max-w-[90vh] max-h-[90vh]`}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
//               onClick={toggleModal}
//               aria-label="Close QR code modal"
//             >
//               <svg
//                 className="w-6 h-6"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             </button>
//             <div ref={qrCodeRef}>
//               <QRCode
//                 value={localQrCodeData}
//                 size={Math.min(window.innerWidth * 0.9, window.innerHeight * 0.9)}
//                 style={{ width: '100%', height: 'auto' }}
//               />
//             </div>
//             <button
//               onClick={handleDownloadQrCode}
//               className={`mt-4 cursor-pointer px-4 py-2 rounded-md text-white ${
//                 isDownloading ? 'bg-gray-500' : 'bg-blue-700 hover:bg-blue-600'
//               } transition-colors duration-200 w-full`}
//               disabled={isDisabled || isDownloading}
//             >
//               {isDownloading ? 'Downloading...' : 'Download QR Code Image'}
//             </button>
//           </div>
//         </div>
//       )}
//       {(isUploadModalOpen && !isSummaryModalOpen) && (
//         <div
//           className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-90"
//           onClick={toggleUploadModal}
//         >
//           <div
//             className="bg-gray-800 p-6 rounded-lg shadow-xl h-max w-[70vw]"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex flex-col md:flex-row gap-6">
//               <div className="md:w-[70%] h-full p-4 border-r border-r-white/20">
//                 <h3 className="text-xl font-semibold text-white mb-4">Petunjuk Penggunaan</h3>
//                 <div className="text-gray-300 space-y-4">
//                   <p className='w-[80%]'>Unggah file rekaman suara (format MP3 atau WAV) dari kegiatan pembelajaran atau diskusi. Sistem akan secara otomatis:</p>
//                   <ul className="list-disc list-inside space-y-2 leading-loose text-left">
//                     <p className='bg-green-200 text-green-800 w-max rounded-md px-2'>
//                       ✅ Hanya diperbolehkan <b>MP3 (wav)</b>.
//                     </p>
//                     <p className='bg-white/20 text-white w-max rounded-md px-2'>❌ File <b>(MPEG | Document | MP4)</b> tidak didapat diproses.</p>
//                     <p className='bg-white/20 text-white w-max rounded-md px-2'>🔊 Mentranskripsikan isi audio menjadi teks.</p>
//                     <p className='bg-white/20 text-white w-max rounded-md px-2'>📄 Merangkum isi percakapan menjadi poin-poin penting.</p>
//                     <p className='bg-white/20 text-white w-max rounded-md px-2'>📥 Hasil rangkuman akan tersedia dalam dashboard dalam beberapa menit.</p>
//                   </ul>
//                   <div className='border-t border-white/20 py-4'>
//                     <p className="font-semibold">Catatan:</p>
//                     <ul className="list-disc list-inside space-y-2">
//                       <p className='bg-white/20 text-white w-max rounded-md px-2 py-1'>⚠️ Maksimal ukuran file: <b className='text-white bg-red-600 px-1 py-[1px] rounded-md'>50MB</b></p>
//                       <p className='bg-white/20 text-white w-max rounded-md px-2 py-1'>⚠️ Gunakan rekaman yang jelas dan minim noise agar hasil transkrip akurat.</p>
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//               <div className="relative md:w-[30%] p-4 flex flex-col justify-center">
//                 <div className="absolute top-2 right-4 flex justify-end">
//                   <button
//                     onClick={toggleUploadModal}
//                     className="px-3 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700"
//                   >
//                     <X />
//                   </button>
//                 </div>
//                 <div
//                   className="w-full mt-6 px-8 py-4 bg-gray-700 rounded-md border-2 border-dashed border-gray-600 hover:border-blue-700 transition-colors duration-200 flex flex-col items-center justify-center"
//                   onDragOver={handleDragOver}
//                   onDrop={handleDrop}
//                 >
//                   <input
//                     type="file"
//                     id="audioFile"
//                     accept="audio/mpeg,audio/wav"
//                     onChange={handleAudioFileChange}
//                     className="hidden"
//                     ref={fileInputRef}
//                   />
//                   {audioFile ? (
//                     <div className="flex items-center gap-2 w-full justify-between">
//                       <span className="text-white truncate max-w-[70%]">{audioFile.name}</span>
//                       <button
//                         onClick={handleClearFile}
//                         className="text-gray-300 hover:text-red-500 transition-colors duration-200"
//                         aria-label="Clear selected file"
//                       >
//                         <X size={20} />
//                       </button>
//                     </div>
//                   ) : (
//                     <div className="text-center text-gray-300">
//                       <p>Drag and drop an MP3 or WAV file here, or</p>
//                       <button
//                         onClick={handleChooseFile}
//                         className="mt-4 px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
//                       >
//                         Choose File
//                       </button>
//                     </div>
//                   )}
//                 </div>
//                 <button
//                   onClick={handleAudioUpload}
//                   className={`w-full mt-4 py-3 rounded-md text-white ${
//                     isUploadingAudio || !audioFile
//                       ? 'bg-gray-500 cursor-not-allowed'
//                       : 'bg-blue-700 hover:bg-blue-600'
//                   } transition-colors duration-200`}
//                   disabled={isUploadingAudio || !audioFile}
//                 >
//                   {isUploadingAudio ? 'Uploading...' : 'Upload Audio'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//       {isSummaryModalOpen && (() => {
//         const storedSummary = localStorage.getItem('audioSummary');
//         const storedTranscript = localStorage.getItem('audioTranscript');
//         const displaySummary = summary || storedSummary || '';
//         const displayTranscript = transcript || storedTranscript || '';

//         if (!displaySummary && !displayTranscript) return null;
//         return (
//           <div
//             className="fixed inset-0 flex items-center justify-center z-[999999999999] bg-black bg-opacity-90"
//             onClick={toggleSummaryModal}
//           >
//             <div
//               className="relative bg-gray-800 p-6 rounded-lg shadow-xl w-[90vw] max-w-[80vw] h-[82vh] overflow-hidden"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="w-full flex items-center justify-between mb-4">
//                 <h3 className="text-lg font-semibold text-white">{fileName}</h3>
//                 <button
//                   onClick={toggleSummaryModal}
//                   className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
//                 >
//                   <X />
//                 </button>
//               </div>
//               <div className="flex gap-2 mb-4 border-b border-gray-600">
//                 <button
//                   className={`px-4 py-2 ${activeTab === "summary" ? "bg-gray-700 text-white" : "text-gray-300"}`}
//                   onClick={() => setActiveTab("summary")}
//                 >
//                   Summary
//                 </button>
//                 <button
//                   className={`px-4 py-2 ${activeTab === "transcript" ? "bg-gray-700 text-white" : "text-gray-300"}`}
//                   onClick={() => setActiveTab("transcript")}
//                 >
//                   Transcript
//                 </button>
//               </div>
//               <div className="h-[70%] overflow-y-auto border border-white/20 p-4 rounded-lg mb-4">
//                 {activeTab === "summary" && (
//                   <textarea
//                     value={editedSummary}
//                     onChange={(e) => setEditedSummary(e.target.value)}
//                     className="w-full leading-loose h-full bg-gray-900 text-gray-300 rounded-lg p-3 resize-none focus:outline-none"
//                   />
//                 )}
//                 {activeTab === "transcript" && (
//                   <textarea
//                     value={displayTranscript}
//                     readOnly
//                     className="w-full leading-loose h-full bg-gray-900 text-gray-300 rounded-lg p-3 resize-none focus:outline-none"
//                   />
//                 )}
//               </div>
//               {activeTab === "summary" && (
//                 <div className="flex justify-end gap-3">
//                   <button
//                     onClick={handleSaveSummary}
//                     className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                   >
//                     Simpan
//                   </button>
//                   <button
//                     onClick={handleDownloadPDF}
//                     className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
//                   >
//                     Download PDF
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         );
//       })()}
//     </div>
//   );
// };

// export default QRCodeDisplay;



import { lang } from '@/core/libs';
import { useAlert } from '@/features/_global';
import { useClassroom } from '@/features/classroom';
import { useCourse } from '@/features/course';
import { useProfile } from '@/features/profile';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download, Repeat, Scan, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { FaMicrophone, FaUpload } from 'react-icons/fa';
import QRCode from 'react-qr-code';

interface QRCodeDisplayProps {
  generateQrCode: (data: { kelasId: string; mataPelajaranId: string; jamMulai?: string; jamSelesai?: string }) => void;
  qrCodeData: string | null;
  isDisabled: boolean;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  generateQrCode,
  qrCodeData: propQrCodeData,
  isDisabled,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    idKelas: '',
    idMataPelajaran: '',
    jamMulai: '',
    jamSelesai: '',
    topik: '',
    penjelasanGuru: '',
  });
  const [summary, setSummary] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("summary");
  const [transcript, setTranscript] = useState<string | null>('Belum ada transkrip');
  const [fileName, setFileName] = useState<string | null>(lang.text('summarizeByX'));
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isUploadingAudio, setIsUploadingAudio] = useState<boolean>(false);
  const qrContainerRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [qrSize, setQrSize] = useState<number>(0);
  const classRooms = useClassroom();
  const course = useCourse();
  const [isDisabledButton, setIsDisabledButton] = useState(false);

  // Add local state to manage qrCodeData
  const [localQrCodeData, setLocalQrCodeData] = useState<string | null>(null);

  const storedSummary = localStorage.getItem('audioSummary') || null;

  const [editedSummary, setEditedSummary] = useState(() => {
    if (!storedSummary) {
      return 'Belum ada rangkuman.';
    }

    if (storedSummary.includes('Sedang proses merangkum')) {
      return 'Belum ada rangkuman atau mungkin masih proses merangkum...';
    }

    return storedSummary;
  });
  const alert = useAlert();
  const profile = useProfile();

  // Load qrCodeData from localStorage on component mount
  useEffect(() => {
    const storedQrCodeData = localStorage.getItem('qrCodeData');
    if (storedQrCodeData) {
      setLocalQrCodeData(storedQrCodeData);
    }
  }, []);

  // Update localQrCodeData and localStorage when propQrCodeData changes
  useEffect(() => {
    if (propQrCodeData) {
      setLocalQrCodeData(propQrCodeData);
      localStorage.setItem('qrCodeData', propQrCodeData);
    }
  }, [propQrCodeData]);

  useEffect(() => {
    const now = new Date();
    const localHour = (now.getUTCHours() + 7) % 24; // Adjust for UTC+7 and wrap around 24 hours
    setIsDisabledButton(localHour >= 6 && localHour < 22); // True from 6 AM to 10 PM
  }, []);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleFormModal = () => {
    setIsFormModalOpen(!isFormModalOpen);
  };

  const toggleSummaryModal = () => {
    setIsSummaryModalOpen(!isSummaryModalOpen);
  };

  const toggleUploadModal = () => {
    setIsUploadModalOpen(!isUploadModalOpen);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'idKelas' && value) {
      const selectedClass = classRooms?.data.find((kelas) => kelas.id === Number(value));
      if (selectedClass) {
        localStorage.setItem(
          'selectedClass',
          JSON.stringify({
            idKelas: selectedClass.id,
            namaKelas: selectedClass.namaKelas,
          })
        );
      }
      setFormData((prev) => ({ ...prev, idMataPelajaran: '' }));
      localStorage.removeItem('selectedCourse');
    } else if (name === 'idKelas' && !value) {
      localStorage.removeItem('selectedClass');
      localStorage.removeItem('selectedCourse');
      setFormData((prev) => ({ ...prev, idMataPelajaran: '' }));
    }

    if (name === 'idMataPelajaran' && value) {
      const selectedCourse = course?.data.find((subject) => subject.id === Number(value));
      if (selectedCourse) {
        localStorage.setItem(
          'selectedCourse',
          JSON.stringify({
            idMataPelajaran: selectedCourse.id,
            namaMataPelajaran: selectedCourse.namaMataPelajaran,
          })
        );
      }
    } else if (name === 'idMataPelajaran' && !value) {
      localStorage.removeItem('selectedCourse');
    }
  };

  const handleFormSubmit = () => {
    if (formData.idKelas && formData.idMataPelajaran) {
      generateQrCode({
        kelasId: formData.idKelas,
        mataPelajaranId: formData.idMataPelajaran,
      });
      toggleFormModal();
    } else {
      alert.error('Please fill in all required fields.');
    }
  };

  const handleDownloadQrCode = async () => {
    if (!localQrCodeData || !qrCodeRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(qrCodeRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
      });

      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas is empty');
      }

      const dataUrl = canvas.toDataURL('image/png');
      const img = new Image();
      const imageLoadPromise = new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error('Invalid image data'));
        img.src = dataUrl;
      });
      await imageLoadPromise;

      const selectedClass = JSON.parse(localStorage.getItem('selectedClass') || '{}');
      const selectedCourse = JSON.parse(localStorage.getItem('selectedCourse') || '{}');
      const fileName = `qr-code-${selectedClass.namaKelas || 'class'}-${selectedCourse.namaMataPelajaran || 'course'}.png`;

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to download QR code image:', error);
      alert.error('Gagal mengunduh gambar QR code. Silakan coba lagi.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && ['audio/mpeg', 'audio/wav'].includes(file.type)) {
      setAudioFile(file);
    } else {
      alert.error('Tolong pilih file dengan format mp3/wav.');
      setAudioFile(null);
    }
  };

  const validateAudio = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      audio.onloadedmetadata = () => {
        if (audio.duration > 0) {
          resolve(true);
        } else {
          resolve(false);
        }
        URL.revokeObjectURL(audio.src);
      };
      audio.onerror = () => {
        resolve(false);
        URL.revokeObjectURL(audio.src);
      };
    });
  };

  const handleAudioUpload = async () => {
    if (!audioFile) {
      alert.error('Silakan pilih file audio untuk diunggah.');
      return;
    }

    if (audioFile.size === 0) {
      alert.error('File audio kosong. Silakan unggah file yang valid.');
      return;
    }

    if (audioFile.size > 50 * 1024 * 1024) {
      alert.error('Ukuran file melebihi batas maksimum 50MB. Silakan unggah file yang lebih kecil.');
      return;
    }

    const allowedTypes = ['audio/wav', 'audio/mp3', 'audio/mpeg'];
    if (!allowedTypes.includes(audioFile.type)) {
      alert.error('Format file tidak didukung. Harap unggah file .mp3 atau .wav.');
      return;
    }

    const isValidAudio = await validateAudio(audioFile);
    if (!isValidAudio) {
      alert.error('File audio tidak valid atau rusak. Silakan unggah file .mp3 atau .wav yang valid.');
      return;
    }

    setIsUploadingAudio(true);

    const token = localStorage.getItem('token');
    if (!token) {
      alert.error('Silakan login ulang terdahulu');
      setIsUploadingAudio(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', audioFile);

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    try {
      let isDone = false;

      while (!isDone) {
        console.log('Mengirim file untuk proses / polling...');

        const response = await fetch('https://app.kiraproject.id/upload', {
          method: 'POST',
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Detail error tidak tersedia' }));
          alert.error(`HTTP error! Status: ${response.status}, Detail: ${errorData.error || 'Error tidak diketahui'}`);
          break;
        }

        const result = await response.json();
        console.log('result summarize:', result);

        if (result?.status && result?.status === 'processing') {
          setSummary('Sedang proses merangkum');
          setTranscript('Sedang proses transkrip');
          setEditedSummary('Sedang proses merangkum');
          setFileName(audioFile?.name);
          localStorage.setItem('audioTranscript', 'Sedang proses transript');
          localStorage.setItem('audioSummary', 'Sedang proses merangkum');
          localStorage.setItem('statusFile', 'processing')
          
          await delay(600000); // 10 menit delay
        } else {
          const summaryText = result.summary || 'Audio berhasil diringkas.';
          const summaryTranscript = result.transcript || 'Audio berhasil ditranskrip.';
          
          setIsUploadingAudio(false);
          setSummary(summaryText);
          setEditedSummary(summaryText);
          setFileName(audioFile?.name);
          setTranscript(summaryTranscript);
          localStorage.setItem('audioSummary', summaryText);
          localStorage.setItem('audioTranscript', summaryTranscript);
          localStorage.setItem('statusFile', 'done')
          setIsSummaryModalOpen(true);
          setIsUploadModalOpen(false);

          isDone = true;
        }
      }
    } catch (error) {
      console.error('Gagal mengunggah file audio:', {
        message: error.message,
        stack: error.stack,
        audioFileName: audioFile.name,
        audioFileSize: audioFile.size,
        audioFileType: audioFile.type,
      });
      alert.error(`Gagal mengunggah file audio: ${error.message}. Silakan coba lagi.`);
    } finally {
      setIsUploadingAudio(false);
      setAudioFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0] || null;
    if (file && ['audio/mpeg', 'audio/wav'].includes(file.type)) {
      setAudioFile(file);
    } else {
      alert.error('Please drop a valid MP3 or WAV file.');
      setAudioFile(null);
    }
  };

  const handleClearFile = () => {
    setAudioFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    const updateQrSize = () => {
      if (qrContainerRef.current) {
        const containerWidth = qrContainerRef.current.offsetWidth;
        const availableWidth = containerWidth - 16 - 8;
        setQrSize(availableWidth);
      }
    };
    updateQrSize();
    window.addEventListener('resize', updateQrSize);
    return () => window.removeEventListener('resize', updateQrSize);
  }, [localQrCodeData]);

  const handleSaveSummary = () => {
    setSummary(editedSummary);
    localStorage.setItem('audioSummary', editedSummary);
    alert.success(lang.text('successUpdateSummary'));
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      format: "a4",
      unit: "mm",
    });

    const marginLeft = 15;
    const marginTop = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxWidth = pageWidth - marginLeft * 2;

    const namaGuru = profile?.user?.name || 'Nama guru pengajar';
    const tanggal = new Date().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const selectedCourse = JSON.parse(localStorage.getItem('selectedCourse') || '{}');

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(16);
    doc.text(selectedCourse.namaMataPelajaran || "Nama mata pelajaran", marginLeft, marginTop);

    doc.setFontSize(11);
    doc.setFont("Helvetica", "normal");
    doc.text(`Tanggal: ${tanggal}`, marginLeft, marginTop + 10);
    doc.text(`Nama Guru: ${namaGuru}`, marginLeft, marginTop + 16);

    doc.setFontSize(12);
    doc.text(editedSummary, marginLeft, marginTop + 30, {
      maxWidth: maxWidth,
      align: "left",
    });

    doc.save(`Rangkuman ${selectedCourse.namaMataPelajaran || "Rangkuman"}.pdf`);
  };

  // Check if QR code should be displayed
  const canDisplayQrCode = () => {
    const selectedCourse = JSON.parse(localStorage.getItem('selectedCourse') || '{}');
    const selectedClass = JSON.parse(localStorage.getItem('selectedClass') || '{}');
    return localQrCodeData && selectedCourse.namaMataPelajaran && selectedClass.namaKelas;
  };

  return (
    <div className="relative z-[33] top-4 flex flex-col items-center">
      <style>
        {`
          .animated-gradient {
              background: linear-gradient(
                45deg,
                rgba(139, 92, 246, 0.6),
                rgba(59, 130, 246, 0.6),
                rgba(251, 146, 60, 0.6),
                rgba(139, 92, 246, 0.6)
              );
              background-size: 400% 400%;
              animation: gradientShift 8s ease infinite;
            }

            @keyframes gradientShift {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
        `}
      </style>
      {canDisplayQrCode() && (
        <div
          ref={qrContainerRef}
          onClick={toggleModal}
          className="mt-4 bg-white p-2 shadow-md rounded border dark:border-white/20 border-black/80 cursor-pointer transition-transform duration-200 hover:brightness-90 active:scale-[0.99] w-full flex flex-col items-center"
        >
          <div ref={qrCodeRef}>
            <QRCode
              value={localQrCodeData}
              size={qrSize}
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        </div>
      )}
      <div className="w-full grid grid-cols-3 mt-5 justify-between gap-4">
        <div className='text-center flex flex-col justify-center items-center gap-3'>
          <button
            onClick={toggleUploadModal}
            className="w-[50px] h-[50px] flex justify-center items-center border border-dashed border-black dark:border-white rounded-md text-black text-lg bg-white hover:text-white hover:bg-blue-600 transition-colors duration-200"
          >
            <FaMicrophone />
          </button>
          <small className='w-full text-[9px]'>Upload audio</small>
        </div>
        <div className='text-center flex flex-col justify-center items-center gap-3'>
          <button
            onClick={handleDownloadQrCode}
            className={`w-[50px] h-[50px] mx-auto border border-dashed border-black dark:border-white gap-3 text-center flex items-center justify-center bg-white rounded-md ${
              !canDisplayQrCode() || isDownloading ? 'opacity-50 cursor-not-allowed text-slate-500' : 'hover:bg-blue-600 hover:text-white text-black'
            } transition-colors duration-200`}
            disabled={!canDisplayQrCode() || isDownloading}
          >
            {isDownloading ? <FaUpload /> : <Download className="scale-[0.9]" />}
          </button>
          <small className='w-full text-[9px]'>Download QR</small>
        </div>
        <div className='text-center flex flex-col justify-center items-center gap-3'>
          <button
            onClick={toggleFormModal}
            className="w-[50px] h-[50px] border border-dashed border-black dark:border-white flex justify-center items-center rounded-md text-black text-lg bg-white hover:text-white hover:bg-blue-600 transition-colors duration-200"
          >
            <Scan />
          </button>
          <small className='w-full text-[9px]'>Generate QR</small>
        </div>
      </div>
      {isFormModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-90"
          onClick={toggleFormModal}
        >
          <div
            className="bg-gray-800 p-6 rounded-lg shadow-xl w-[90vw] max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Generate QR Code</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="idKelas" className="block text-sm font-medium text-gray-300">
                  Kelas
                </label>
                <select
                  id="idKelas"
                  name="idKelas"
                  value={formData.idKelas}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-700"
                >
                  <option value="">Pilih Kelas</option>
                  {classRooms?.data.map((kelas) => (
                    <option key={kelas.id} value={kelas.id}>
                      {kelas.namaKelas}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="idMataPelajaran" className="block text-sm font-medium text-gray-300">
                  Mata Pelajaran
                </label>
                <select
                  id="idMataPelajaran"
                  name="idMataPelajaran"
                  value={formData.idMataPelajaran}
                  onChange={handleInputChange}
                  disabled={!formData.idKelas}
                  className={`mt-1 w-full p-2 rounded-md border focus:outline-none focus:ring-2 ${
                    !formData.idKelas
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-700 text-white border-gray-600 focus:ring-blue-700'
                  }`}
                >
                  <option value="">Pilih Mata Pelajaran</option>
                  {course?.data
                    .filter((subject) => subject?.kelasId === Number(formData.idKelas))
                    .map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.namaMataPelajaran}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={toggleFormModal}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleFormSubmit}
                className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-600"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      )}
      {isModalOpen && canDisplayQrCode() && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
            isModalOpen ? 'opacity-100' : 'opacity-0'
          } animated-gradient backdrop-blur-sm`}
          onClick={toggleModal}
        >
          <div
            className={`relative bg-white p-4 rounded-lg shadow-xl transform transition-all duration-300 ${
              isModalOpen ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
            } border border-gray-200 w-[90vw] h-[90vw] max-w-[90vh] max-h-[90vh]`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              onClick={toggleModal}
              aria-label="Close QR code modal"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div ref={qrCodeRef}>
              <QRCode
                value={localQrCodeData}
                size={Math.min(window.innerWidth * 0.9, window.innerHeight * 0.9)}
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
            <button
              onClick={handleDownloadQrCode}
              className={`mt-4 cursor-pointer px-4 py-2 rounded-md text-white ${
                isDownloading ? 'bg-gray-500' : 'bg-blue-700 hover:bg-blue-600'
              } transition-colors duration-200 w-full`}
              disabled={isDisabled || isDownloading}
            >
              {isDownloading ? 'Downloading...' : 'Download QR Code Image'}
            </button>
          </div>
        </div>
      )}
      {(isUploadModalOpen && !isSummaryModalOpen) && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-90"
          onClick={toggleUploadModal}
        >
          <div
            className="bg-gray-800 p-6 rounded-lg shadow-xl h-max w-[70vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-[70%] h-full p-4 border-r border-r-white/20">
                <h3 className="text-xl font-semibold text-white mb-4">Petunjuk Penggunaan</h3>
                <div className="text-gray-300 space-y-4">
                  <p className='w-[80%]'>Unggah file rekaman suara (format MP3 atau WAV) dari kegiatan pembelajaran atau diskusi. Sistem akan secara otomatis:</p>
                  <ul className="list-disc list-inside space-y-2 leading-loose text-left">
                    <p className='bg-green-200 text-green-800 w-max rounded-md px-2'>
                      ✅ Hanya diperbolehkan <b>MP3 (wav)</b>.
                    </p>
                    <p className='bg-white/20 text-white w-max rounded-md px-2'>❌ File <b>(MPEG | Document | MP4)</b> tidak didapat diproses.</p>
                    <p className='bg-white/20 text-white w-max rounded-md px-2'>🔊 Mentranskripsikan isi audio menjadi teks.</p>
                    <p className='bg-white/20 text-white w-max rounded-md px-2'>📄 Merangkum isi percakapan menjadi poin-poin penting.</p>
                    <p className='bg-white/20 text-white w-max rounded-md px-2'>📥 Hasil rangkuman akan tersedia dalam dashboard dalam beberapa menit.</p>
                  </ul>
                  <div className='border-t border-white/20 py-4'>
                    <p className="font-semibold">Catatan:</p>
                    <ul className="list-disc list-inside space-y-2">
                      <p className='bg-white/20 text-white w-max rounded-md px-2 py-1'>⚠️ Maksimal ukuran file: <b className='text-white bg-red-600 px-1 py-[1px] rounded-md'>50MB</b></p>
                      <p className='bg-white/20 text-white w-max rounded-md px-2 py-1'>⚠️ Gunakan rekaman yang jelas dan minim noise agar hasil transkrip akurat.</p>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="relative md:w-[30%] p-4 flex flex-col justify-center">
                <div className="absolute top-2 right-4 flex justify-end">
                  <button
                    onClick={toggleUploadModal}
                    className="px-3 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    <X />
                  </button>
                </div>
                <div
                  className="w-full mt-6 px-8 py-4 bg-gray-700 rounded-md border-2 border-dashed border-gray-600 hover:border-blue-700 transition-colors duration-200 flex flex-col items-center justify-center"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="audioFile"
                    accept="audio/mpeg,audio/wav"
                    onChange={handleAudioFileChange}
                    className="hidden"
                    ref={fileInputRef}
                  />
                  {audioFile ? (
                    <div className="flex items-center gap-2 w-full justify-between">
                      <span className="text-white truncate max-w-[70%]">{audioFile.name}</span>
                      <button
                        onClick={handleClearFile}
                        className="text-gray-300 hover:text-red-500 transition-colors duration-200"
                        aria-label="Clear selected file"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center text-gray-300">
                      <p>Drag and drop an MP3 or WAV file here, or</p>
                      <button
                        onClick={handleChooseFile}
                        className="mt-4 px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                      >
                        Choose File
                      </button>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleAudioUpload}
                  className={`w-full mt-4 py-3 rounded-md text-white ${
                    isUploadingAudio || !audioFile
                      ? 'bg-gray-500 cursor-not-allowed'
                      : 'bg-blue-700 hover:bg-blue-600'
                  } transition-colors duration-200`}
                  disabled={isUploadingAudio || !audioFile}
                >
                  {isUploadingAudio ? 'Uploading...' : 'Upload Audio'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isSummaryModalOpen && (() => {
        const storedSummary = localStorage.getItem('audioSummary');
        const storedTranscript = localStorage.getItem('audioTranscript');
        const displaySummary = summary || storedSummary || '';
        const displayTranscript = transcript || storedTranscript || '';

        if (!displaySummary && !displayTranscript) return null;
        return (
          <div
            className="fixed inset-0 flex items-center justify-center z-[999999999999] bg-black bg-opacity-90"
            onClick={toggleSummaryModal}
          >
            <div
              className="relative bg-gray-800 p-6 rounded-lg shadow-xl w-[90vw] max-w-[80vw] h-[82vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">{fileName}</h3>
                <button
                  onClick={toggleSummaryModal}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  <X />
                </button>
              </div>
              <div className="flex gap-2 mb-4 border-b border-gray-600">
                <button
                  className={`px-4 py-2 ${activeTab === "summary" ? "bg-gray-700 text-white" : "text-gray-300"}`}
                  onClick={() => setActiveTab("summary")}
                >
                  Summary
                </button>
                <button
                  className={`px-4 py-2 ${activeTab === "transcript" ? "bg-gray-700 text-white" : "text-gray-300"}`}
                  onClick={() => setActiveTab("transcript")}
                >
                  Transcript
                </button>
              </div>
              <div className="h-[70%] overflow-y-auto border border-white/20 p-4 rounded-lg mb-4">
                {activeTab === "summary" && (
                  <textarea
                    value={editedSummary}
                    onChange={(e) => setEditedSummary(e.target.value)}
                    className="w-full leading-loose h-full bg-gray-900 text-gray-300 rounded-lg p-3 resize-none focus:outline-none"
                  />
                )}
                {activeTab === "transcript" && (
                  <textarea
                    value={displayTranscript}
                    readOnly
                    className="w-full leading-loose h-full bg-gray-900 text-gray-300 rounded-lg p-3 resize-none focus:outline-none"
                  />
                )}
              </div>
              {activeTab === "summary" && (
                <div className="flex justify-end gap-3">
                  <button
                    onClick={handleSaveSummary}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Simpan
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Download PDF
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default QRCodeDisplay;

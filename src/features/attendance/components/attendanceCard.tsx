import { Badge, Card, CardContent, dayjs } from "@/core/libs";
import { useAlert } from "@/features/_global";
import id from "dayjs/locale/id";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { motion } from "framer-motion";
import { absenManual } from "../utils";

// Aktifkan plugin utc dan timezone
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale(id);

interface Attendance {
  user: {
    image: string;
    name: string | null | undefined;
    nisn: string | null | undefined;
  };
  kelas:
    | {
        namaKelas: string;
      }
    | string
    | null
    | undefined;
  absensis?: {
    statusKehadiran?: string;
    tanggal?: string;
  }[];
  id: string | number; 
}

interface AttendanceCardProps {
  data: Attendance;
  displayMode: 'single' | 'grid';
  isSpecial?: boolean;
  selectedClass: string;
  refetch?: () => Promise<void>; 
}

const AttendanceCard: React.FC<AttendanceCardProps> = ({ data, displayMode, isSpecial = false, selectedClass, refetch }) => {
  const alert = useAlert(); 
  const formatJamMasuk = (jamMasuk?: string | null) => {
    if (!jamMasuk) return "Tidak Tersedia";
    return dayjs(jamMasuk)
      .tz("Asia/Jakarta")
      .format("dddd, DD MMMM YYYY, HH:mm");
  };

  const handleStatusChange = async (status: string) => {
    try {
      await absenManual(data.biodataSiswaId, status); // Pass status to absenManual
      alert.success(`Berhasil memperbarui status kehadiran menjadi ${status}`);
      if (refetch) {
        await refetch(); // Trigger data refresh
      }
    } catch (error) {
      alert.error(error.message || `Gagal memperbarui status kehadiran menjadi ${status}`);
    }
  };

  // console.log('data', data)

  return (
    <motion.div
      whileHover={{ boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative w-full"
    >
      <Card
        className={
          `relative 
          ${data?.statusKehadiran === "alfa" ? ' border-[#dc3545]' : data?.statusKehadiran === "sakit" ? 'border-[#ffc107]' : data?.statusKehadiran === "izin" ? 'border-[#6f42c1]' :  'border-[#007bff]'} border-[2px]  
          ${data?.statusKehadiran === "alfa" ? ' bg-[#dc3545] bg-opacity-10' : data?.statusKehadiran === "sakit" ? 'bg-[#ffc107] bg-opacity-10' : data?.statusKehadiran === "izin" ? 'bg-[#6f42c1] bg-opacity-10' :  'bg-[#007bff] bg-opacity-10'}
          text-gray-900 dark:text-gray-100 shadow-md hover:shadow-lg rounded-xl p-4 ${
          displayMode === 'single'
            ? 'flex items-center gap-4 max-w-full'
            : 'flex flex-col'
        } transition-shadow duration-300`}
        aria-label={`Attendance card for ${data.namaSiswa ?? "Unknown"}`}
      >
        <div
          className={`relative ${
            displayMode === 'single'
              ? 'w-36 h-36 mr-3 rounded-md overflow-hidden shrink-0'
              : 'w-full h-48 rounded-none overflow-hidden shadow-sm'
          }`}
        >
          <img
            src={data?.image ? `https://dev.kiraproject.id${data.image}` : "/defaultProfile.png"}
            alt={`${data?.namaSiswa ?? "Unknown"}'s profile`}
            className="w-full h-full rounded-lg object-cover"
          />
          <p>{data?.namaSiswa}</p>
        </div>

        <CardContent
          className={`w-full relative flex flex-col p-0 ${
            displayMode === 'single' ? 'pt-0 flex-1' : 'pt-4'
          }`}
        >
          <h3 className="text-lg font-semibold tracking-tight border-b border-white/10 pb-3 mb-3 truncate">
            {data?.namaSiswa ?? "Tidak Tersedia"}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-2 truncate">
            NIS: {data.nis ?? "Tidak Tersedia"}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium truncate">
            Kelas: {selectedClass}
          </p>

          <motion.div
            className="mt-3 flex items-center gap-3 flex-wrap"
            whileHover={{ opacity: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-full flex border border-white rounded-lg justify-start overflow-hidden">
              <Badge
                className={`w-[25%] text-center flex items-center justify-center py-1 px-3 cursor-pointer active:scale-[0.98] duration-100 text-sm font-semibold rounded-none ${
                  data?.statusKehadiran === "hadir"
                    ? "bg-[#007bff] text-white hover:bg-[#0061c9]"
                    : "bg-transparent text-white hover:text-white hover:bg-[#0061c9]"
                }`}
                onClick={() => handleStatusChange("hadir")}
                // onClick={() => alert.success('Fitur ini masih dalam tahap pengembangan 🚧')}
              >
                Hadir
              </Badge>
              <Badge
                className={`w-[25%] text-center flex items-center justify-center py-1 px-3 cursor-pointer active:scale-[0.98] duration-100 text-sm font-semibold border-x border-x-white rounded-none ${
                  data?.statusKehadiran === "alfa"
                    ? "bg-[#dc3545] text-white hover:bg-[#bb1f2e]"
                    : "bg-transparent text-white hover:text-white hover:bg-[#bb1f2e]"
                }`}
                onClick={() => handleStatusChange("alfa")}
                // onClick={() => alert.success('Fitur ini masih dalam tahap pengembangan 🚧')}
              >
                Alfa
              </Badge>
              <Badge
                className={`w-[25%] text-center flex items-center justify-center py-1 px-3 cursor-pointer active:scale-[0.98] duration-100 text-sm font-semibold border-x border-r-white rounded-none ${
                  data?.statusKehadiran === "sakit"
                    ? "bg-[#ffc107] text-white hover:bg-[#dda600]"
                    : "bg-transparent text-white hover:text-white hover:bg-[#dda600]"
                }`}
                onClick={() => handleStatusChange("sakit")}
                // onClick={() => alert.success('Fitur ini masih dalam tahap pengembangan 🚧')}
              >
                Sakit
              </Badge>
              <Badge
                className={`w-[25%] text-center flex items-center justify-center py-1 px-3 cursor-pointer active:scale-[0.98] duration-100 text-sm font-semibold rounded-none ${
                  data?.statusKehadiran === "izin"
                    ? "bg-[#6f42c1] text-white hover:bg-[#542aa3]"
                    : "bg-transparent text-white hover:text-white hover:bg-[#542aa3]"
                }`}
                onClick={() => handleStatusChange("izin")}
                // onClick={() => alert.success('Fitur ini masih dalam tahap pengembangan 🚧')}
              >
                Izin
              </Badge>
            </div>
            <Badge className="w-full py-1 px-3 text-sm font-semibold border border-white rounded-md">
              {formatJamMasuk(data.tanggal)}
            </Badge>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AttendanceCard;


// import { Badge, Card, CardContent, dayjs } from "@/core/libs";
// import { useAlert } from "@/features/_global";
// import id from "dayjs/locale/id";
// import timezone from "dayjs/plugin/timezone";
// import utc from "dayjs/plugin/utc";
// import { motion } from "framer-motion";

// // Aktifkan plugin utc dan timezone
// dayjs.extend(utc);
// dayjs.extend(timezone);
// dayjs.locale(id);

// interface Attendance {
//   user: {
//     image: string;
//     name: string | null | undefined;
//     nisn: string | null | undefined;
//   };
//   kelas:
//     | {
//         namaKelas: string;
//       }
//     | string
//     | null
//     | undefined;
//   absensis?: {
//     statusKehadiran?: string;
//     tanggal?: string;
//   }[];
//   id: string | number;
// }

// interface AttendanceCardProps {
//   data: Attendance;
//   displayMode: 'single' | 'grid';
//   isSpecial?: boolean;
//   selectedClass: string;
//   refetch?: () => Promise<void>;
//   onSelect: (id: string | number, isSelected: boolean) => void;
//   isSelected: boolean;
// }

// const AttendanceCard: React.FC<AttendanceCardProps> = ({ 
//   data, 
//   displayMode, 
//   isSpecial = false, 
//   selectedClass, 
//   refetch, 
//   onSelect, 
//   isSelected 
// }) => {
//   const alert = useAlert();
  
//   const formatJamMasuk = (jamMasuk?: string | null) => {
//     if (!jamMasuk) return "Tidak Tersedia";
//     return dayjs(jamMasuk)
//       .tz("Asia/Jakarta")
//       .format("dddd, DD MMMM YYYY, HH:mm");
//   };

//   const handleCheckboxChange = () => {
//     onSelect(data.id, !isSelected);
//   };

//   const currentStatus = data.statusKehadiran ?? "Belum Absen";
//   const currentTanggal = data.tanggal;

//   // console.log('datadata', data)

//   return (
//     <motion.div
//       whileHover={{ boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)" }}
//       transition={{ type: "spring", stiffness: 300, damping: 20 }}
//       className="relative w-full"
//     >
//       <Card
//         className={`relative border dark:border-white/20 border-black bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900
//           text-gray-900 dark:text-gray-100 shadow-md hover:shadow-lg rounded-xl p-4 ${
//           displayMode === 'single'
//             ? 'flex items-center gap-4 max-w-full'
//             : 'flex flex-col'
//         } transition-shadow duration-300`}
//         aria-label={`Attendance card for ${data.namaSiswa ?? "Unknown"}`}
//       >
//         <div
//           className={`relative ${
//             displayMode === 'single'
//               ? 'w-36 h-36 mr-3 rounded-md overflow-hidden shrink-0'
//               : 'w-full h-48 rounded-none overflow-hidden shadow-sm'
//           }`}
//         >
//           <img
//             src={data?.image ? `https://dev.kiraproject.id${data.image}` : "/defaultProfile.png"}
//             alt={`${data?.name ?? "Unknown"}'s profile`}
//             className="w-full h-full rounded-lg object-cover"
//           />
//           <p>{data?.namaSiswa}</p>
//         </div>
//         <CardContent
//           className={`w-full relative flex flex-col p-0 ${
//             displayMode === 'single' ? 'pt-0 flex-1' : 'pt-4'
//           }`}
//         >
//           <h3 className="text-lg font-semibold tracking-tight border-b border-white/10 pb-3 mb-3 truncate">
//             {data?.namaSiswa ?? "Tidak Tersedia"}
//           </h3>
//           <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-2 truncate">
//             NIS: {data?.nisn ?? "Tidak Tersedia"}
//           </p>
//           <p className="text-sm text-gray-600 dark:text-gray-400 font-medium truncate">
//             Kelas: {selectedClass}
//           </p>
//           <motion.div
//             className="mt-3 flex items-center gap-3 flex-wrap"
//             whileHover={{ opacity: 0.9 }}
//             transition={{ duration: 0.2 }}
//           >
//             <div className="w-full flex justify-between">
//               <Badge
//                 className={`w-[25%] text-center flex items-center justify-center py-1 px-3 cursor-pointer active:scale-[0.98] duration-100 text-sm font-semibold rounded-lg border border-white ${
//                   currentStatus === "hadir"
//                     ? "bg-[#007bff] text-white hover:bg-[#0061c9]"
//                     : currentStatus === 'alfa'
//                     ? "bg-red-500 text-white"
//                     : "bg-transparent text-white hover:text-white hover:bg-[#0061c9]"
//                 }`}
//                 onClick={() => alert.success('Fitur ini masih dalam tahap pengembangan 🚧')}
//               >
//                 {currentStatus}
//               </Badge>
//               {/* <div className="relative">
//                 <input
//                   type="checkbox"
//                   checked={isSelected}
//                   onChange={handleCheckboxChange}
//                   className="h-5 w-5 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500"
//                 />
//               </div> */}
//             </div>
//             <Badge className="py-1 px-3 w-full text-sm font-semibold border border-white rounded-md">
//               {formatJamMasuk(currentTanggal)}
//             </Badge>
//           </motion.div>
//         </CardContent>
//       </Card>
//     </motion.div>
//   );
// };

// export default AttendanceCard;
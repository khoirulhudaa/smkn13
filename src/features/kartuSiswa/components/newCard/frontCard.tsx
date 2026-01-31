// import React, { useState } from "react";
// import "./styles/frontCard.css";
// import Barcode from "react-barcode";
// import QRCode from "react-qr-code";
// import { SchoolLogo } from "@/features/schools/components";
// import dayjs from "dayjs";
// import { Student } from "@/types/student";

// interface FrontCardProps {
//   student: Student;
//   background: string;
//   orientation: "horizontal" | "vertical";
// }

// const genderOptions = {
//   Male: "Laki-laki",
//   Female: "Perempuan",
// };

// const FrontCard: React.FC<FrontCardProps> = ({
//   student,
//   background,
//   orientation,
// }) => {
//   const [imageError, setImageError] = useState(false);

//   const calculateExpiryDate = () => {
//     const today = new Date();
//     const expiryDate = new Date(today);
//     expiryDate.setFullYear(today.getFullYear() + 3);
//     const month = String(expiryDate.getMonth() + 1).padStart(2, "0");
//     const year = String(expiryDate.getFullYear()).slice(-2);
//     return `${month}/${year}`;
//   };

//   const expiryDate = calculateExpiryDate();

//   const formattedTanggalLahir = (value?: string | null) => {
//     return value ? dayjs(value).format("DD-MM-YYYY") : "Kosong";
//   };

//   // console.log('student:', student)

//   return (
//     <div id={`student-card-${student.id}`} className="container">
//       <div
//         className={`front-card ${orientation}`}
//         style={{
//           backgroundImage: `url(${background})`,
//           width: orientation === "vertical" ? "300px" : "500px",
//           height: orientation === "vertical" ? "500px" : "300px",
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//         }}
//       >
//         <div className={`header ${orientation}`}>
//           {orientation === "horizontal" && (
//             <div className={`logo-container ${orientation}`}>
//               <SchoolLogo
//                 image={student.logoSekolah || ""}
//                 title={student.sekolah || ""}
//               />
//             </div>
//           )}
//           <div className="school-info">
//             <h2 className="school-name">{student?.user?.sekolah?.namaSekolah || '-'}</h2>
//             {orientation === "horizontal" && (
//               <p className="school-address">{student.user?.sekolah?.alamatSekolah || '-'}</p>
//             )}
//           </div>
//         </div>

//         <div className="title">KARTU PELAJAR</div>

//         <div className={`content ${orientation}`}>
//           <div className={`photo-placeholder ${orientation}`}>
//             <img
//               src={
//                 student.user.image === null
//                   ? "/defaultProfile.png"
//                   : student.user.image || "/default-avatar.png"
//               }
//               alt="Profile"
//               className={`profile-image ${orientation}`}
//               style={{ width: "100%", height: "100%", objectFit: "cover" }}
//               onError={() => setImageError(true)}
//             />
//           </div>
//           <div className={`info ${orientation}`}>
//             <h3 className="student-name">{student.user.name}</h3>
//             <div className="info-grid">
//               <div className="label">NIS/NISN</div>
//               <div className="value">
//                 : {student.user.nis} / {student.user.nisn}
//               </div>
//               <div className="label">TTL</div>
//               <div className="value">
//                 : {formattedTanggalLahir(student.user.tanggalLahir)}
//               </div>
//               <div className="label">Jenis Kelamin</div>
//               <div className="value">
//                 : {genderOptions[student.user.jenisKelamin]}
//               </div>
//               <div className="label">Alamat</div>
//               <div className="value">
//                 : {student.user.alamat || "Tidak tersedia"}
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className={`footer ${orientation}`}>
//           <div className="barcode-placeholder relative -top-5">
//             <Barcode
//               value={student.user.nis}
//               format="CODE128"
//               fontSize={12}
//               width={2.2}
//               height={38}
//             />
//           </div>
//           {orientation === "horizontal" && (
//             <div className="qr-section">
//               {student.user.nisn ? (
//                 <div className="relative top-[-10px]">
//                   <QRCode value={String(student.user.nisn)} size={56} />
//                 </div>
//               ) : (
//                 <p>QR Code tidak tersedia</p>
//               )}
//             </div>
//           )}
//           {orientation === "horizontal" && (
//             <div className="expired">
//               <p>Berlaku sampai</p>
//               <p className="date">{expiryDate}</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FrontCard;


import React, { useState } from "react";
import "./styles/frontCard.css";
import Barcode from "react-barcode";
import QRCode from "react-qr-code";
import { SchoolLogo } from "@/features/schools/components";
import dayjs from "dayjs";
import { Student } from "@/types/student";

interface FrontCardProps {
  student: Student;
  background: string;
  orientation: "horizontal" | "vertical";
}

const genderOptions = {
  Male: "Laki-laki",
  Female: "Perempuan",
};

const FrontCard: React.FC<FrontCardProps> = ({
  student,
  background,
  orientation,
}) => {
  const [imageError, setImageError] = useState(false);

  const calculateExpiryDate = () => {
    const today = new Date();
    const expiryDate = new Date(today);
    expiryDate.setFullYear(today.getFullYear() + 3);
    const month = String(expiryDate.getMonth() + 1).padStart(2, "0");
    const year = String(expiryDate.getFullYear()).slice(-2);
    return `${month}/${year}`;
  };

  const expiryDate = calculateExpiryDate();

  const formattedTanggalLahir = (value?: string | null) => {
    return value ? dayjs(value).format("DD-MM-YYYY") : "Kosong";
  };

  return (
    <div id={`student-card-${student.id}`} className="container">
      <div
        className={`front-card ${orientation}`}
        style={{
          backgroundImage: `url(${background})`,
          width: orientation === "vertical" ? "300px" : "500px",
          height: orientation === "vertical" ? "500px" : "300px",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className={`header ${orientation}`}>
          {orientation === "horizontal" && (
            <div className={`logo-container ${orientation}`}>
              <SchoolLogo
                image={student.logoSekolah || ""}
                title={student.sekolah || ""}
              />
            </div>
          )}
          <div className="school-info">
            <h2 className="school-name">{student?.user?.sekolah?.namaSekolah || '-'}</h2>
            {orientation === "horizontal" && (
              <p className="school-address">{student.user?.sekolah?.alamatSekolah || '-'}</p>
            )}
          </div>
        </div>

        <div className="title">KARTU PELAJAR</div>

        <div className={`content ${orientation}`}>
          <div className={`photo-placeholder ${orientation}`}>
            <img
              src={
                student.user.image === null
                  ? "/defaultProfile.png"
                  : student.user.image || "/default-avatar.png"
              }
              alt="Profile"
              className={`profile-image ${orientation}`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={() => setImageError(true)}
            />
          </div>
          <div className={`info ${orientation}`}>
            <h3 className="student-name">{student.user.name}</h3>
            <div className="info-grid">
              <div className="label">NIS/NISN</div>
              <div className="value">
                : {student.user.nis} / {student.user.nisn}
              </div>
              <div className="label">TTL</div>
              <div className="value">
                : {formattedTanggalLahir(student.user.tanggalLahir)}
              </div>
              <div className="label">Jenis Kelamin</div>
              <div className="value">
                : {genderOptions[student.user.jenisKelamin]}
              </div>
              <div className="label">Alamat</div>
              <div className="value address-value">
                : {student.user.alamat || "Tidak tersedia"}
              </div>
            </div>
          </div>
        </div>

        <div className={`footer ${orientation}`}>
          <div className="barcode-placeholder relative -top-5">
            <Barcode
              value={student.user.nis}
              format="CODE128"
              fontSize={12}
              width={2.2}
              height={38}
            />
          </div>
          {orientation === "horizontal" && (
            <div className="qr-section">
              {student.user.nisn ? (
                <div className="relative top-[-10px]">
                  <QRCode value={String(student.user.nisn)} size={56} />
                </div>
              ) : (
                <p>QR Code tidak tersedia</p>
              )}
            </div>
          )}
          {orientation === "horizontal" && (
            <div className="expired">
              <p>Berlaku sampai</p>
              <p className="date">{expiryDate}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FrontCard;
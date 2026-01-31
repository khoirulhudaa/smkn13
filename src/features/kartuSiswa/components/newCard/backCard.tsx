import React from "react";
import "./styles/backCard.css";
import QRCode from "react-qr-code";
import { Student } from "@/types/student";

interface BackCardProps {
  student: Student;
  background: string;
  orientation: "horizontal" | "vertical";
  visiMisi?: string;
}

const BackCard: React.FC<BackCardProps> = ({
  student,
  background,
  orientation,
  visiMisi,
}) => {

  console.log('background', background)
  console.log('visiMisi', visiMisi)
  return (
    <div
      id={`student-card-${student.id}-back`}
      className={`mt-2 back-card ${orientation}`}
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="back-card-content">
        <h2 className="back-title">{student.sekolah}</h2>
        <div
          className={`bg-white p-4 rounded-lg text-[13px] text-black visi-misi ${orientation}`}
          dangerouslySetInnerHTML={{ __html: visiMisi || "Visi dan Misi tidak tersedia" }}
        />
        <div className={`qr-logo-section ${orientation}`}>
          <div className="qr-container">
            <QRCode
              value={student.user.nisn}
              size={orientation === "vertical" ? 100 : 120}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackCard;
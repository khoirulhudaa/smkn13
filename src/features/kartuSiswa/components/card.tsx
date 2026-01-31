import { useSchool, useSchoolDetailNoRefetch } from "@/features/schools";
import { useBiodataNoRefetch } from "@/features/user";
import { useRef } from "react";
import DownloadButton from "./downloadButton";
import BackCard from "./newCard/backCard";
import FrontCard from "./newCard/frontCard";
import { Badge } from "@/core/libs";
import { FaSpinner } from "react-icons/fa";

interface MultiCardProps {
  searchKelas: string;
  schoolId: number | null;
  selectedBackgroundFront: string;
  selectedBackgroundBack: string;
  orientation: "horizontal" | "vertical";
}

export const MultiCard = ({
  searchKelas,
  schoolId,
  selectedBackgroundFront,
  selectedBackgroundBack,
  orientation,
}: MultiCardProps) => {
  const { data: students, isLoading: isStudentsLoading } = useBiodataNoRefetch();
  const { data: schoolDetail, isLoading: isSchoolLoading } = useSchool();

  const printRef = useRef<HTMLDivElement>(null);
  const allDataRef = useRef<HTMLDivElement>(null);

  // console.log("searchKelas:", searchKelas);
  // console.log("📌 Data Siswa:", students);
  // console.log("🏫 Data Sekolah:", schoolDetail);

  // Show loading state if data is still being fetched
  if (isStudentsLoading || isSchoolLoading || !students || !schoolDetail) {
    return (
      <div className="w-full h-[200px] border border-dashed border-white rounded-lg flex items-center justify-center gap-5 text-center">
        <p>Loading...</p>
        <FaSpinner className="animate-spin duration-800" />
      </div>
    );
  }

  const filteredStudents = students.filter((student) => {
    // Filter by schoolId
    if (schoolId && student.user.sekolah?.id !== schoolId) return false;
    // Filter by kelas if not "all"
    if (searchKelas === "all") return true;
    const classId = student.kelas?.id;
    return classId && String(classId) === searchKelas;
  }) || [];

  console.log('schoolDetail', schoolDetail)

  return (
    <>
      <div className="w-max flex items-center gap-5">
        <div style={{ textAlign: "center", marginLeft: "auto" }}>
          <DownloadButton
            targetRef={printRef}
            allDataRef={allDataRef}
            isFiltered={searchKelas !== "all"}
            students={filteredStudents}
          />
        </div>
        <Badge variant="outline" className="py-[10px] text-[16px]">
          JUMLAH DATA:
          <div className="ml-1.5" />
          {filteredStudents.length}
        </Badge>
      </div>
      <div ref={printRef} style={{ padding: "30px", textAlign: "left" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: orientation === "horizontal" ? "repeat(3, 1fr)" : "repeat(5, 1fr)",
            gap: "20px",
            justifyContent: "center",
            maxWidth: "100%",
            padding: "10px",
          }}
        >
          {filteredStudents.map((student) => {
            const logoSekolah = schoolDetail?.[0]?.file
              ? `data:image/png;base64,${schoolDetail?.[0].file}`
              : "/default-school-logo.png";

            return (
              <div
                key={student.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <FrontCard
                  student={{
                    ...student,
                    sekolah: schoolDetail?.[0]?.namaSekolah || "Nama Sekolah Tidak Ada",
                    alamatSekolah: schoolDetail?.[0]?.alamatSekolah || "Alamat Sekolah Tidak Ada",
                    logoSekolah,
                  }}
                  background={selectedBackgroundFront}
                  orientation={orientation}
                />
                <BackCard
                  student={{
                    ...student,
                    sekolah: schoolDetail?.[0]?.namaSekolah || "Nama Sekolah Tidak Ada",
                    alamatSekolah: schoolDetail?.[0]?.alamatSekolah || "Alamat Sekolah Tidak Ada",
                    logoSekolah,
                  }}
                  background={selectedBackgroundBack}
                  orientation={orientation}
                  visiMisi={schoolDetail?.[0]?.visiMisi}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
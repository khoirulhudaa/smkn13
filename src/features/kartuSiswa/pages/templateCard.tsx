import { useProfile } from "@/features/profile";
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";

import { APP_CONFIG } from "@/core/configs";
import {
  lang,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/libs";
import { useSchoolList } from "@/features/schools/hooks/useSchoolList";
import { MultiCard } from "../components";
import { BackLayerCard } from "../components/backLayerCard";

import { DashboardPageLayout } from "@/features/_global";
import { useClassroom } from "@/features/classroom";
import { useSchool } from "@/features/schools";
import bg1 from "./../assets/bg1.png";
import bg10 from "./../assets/bg10.png";
import bg11 from "./../assets/bg11.png";
import bg12 from "./../assets/bg12.png";
import bg13 from "./../assets/bg13.png";
import bg2 from "./../assets/bg2.png";
import bg3 from "./../assets/bg3.png";
import bg4 from "./../assets/bg4.png";
import bg5 from "./../assets/bg5.png";
import bg6 from "./../assets/bg6.png";
import bg7 from "./../assets/bg7.png";
import bg8 from "./../assets/bg8.png";
import bg9 from "./../assets/bg9.png";

const backgrounds = {
  template1: bg1,
  template2: bg2,
  template3: bg3,
  template4: bg4,
  template5: bg5,
  template6: bg6,
  template7: bg7,
  template8: bg8,
  template9: bg9,
  template10: bg10,
  template11: bg11,
  template12: bg12,
  template13: bg13,
};

export const StudentCardPage = () => {
  const { id } = useParams();
  const { user } = useProfile();
  const userRole = user?.role;
  const navigate = useNavigate();

  const [showBackLayer, setShowBackLayer] = useState(false);
  const [searchKelas, setSearchKelas] = useState<string>("all"); // Default to "all" for all classes
  // const [currentPage, setCurrentPage] = useState(1);
  const [schoolId, setSchoolId] = useState<number | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null); // School ID untuk SuperAdmin
  const [cardOrientation, setCardOrientation] = useState<
    "horizontal" | "vertical"
  >("horizontal");

  const [selectedBackgroundFront, setSelectedBackgroundFront] = useState(
    backgrounds.template1
  );
  const [selectedBackgroundBack, setSelectedBackgroundBack] = useState(
    backgrounds.template1
  );

  const handleSchoolChange = (value: string) => {
    const newSchoolId = value === "" ? null : Number(value);
    setSelectedSchool(value);
    setSchoolId(newSchoolId);
    setSearchKelas("all"); // Reset kelas saat sekolah berubah
    console.log("🎯 School Selected:", newSchoolId);
  };

  // Ambil daftar sekolah (hanya untuk SuperAdmin)
  const { data: schoolList, isLoading: isLoadingSchools } = useSchoolList({
    enabled: userRole === "superAdmin",
  });

  // Ambil daftar kelas berdasarkan schoolId
  const { data: classroomList, isLoading: isLoadingClassrooms } = useClassroom();

  useEffect(() => {
    if (user?.sekolah && userRole !== "superAdmin") {
      setSchoolId(user.sekolah.id);
    }
  }, [user, userRole]);

  useEffect(() => {
    if (schoolId && id !== schoolId.toString()) {
      navigate(`/card/generate`);
    }
  }, [schoolId, id, navigate]);

  useEffect(() => {
    if (selectedSchool !== null) {
      setSchoolId(Number(selectedSchool));
    }
  }, [selectedSchool]);

  const resource = useClassroom();
  const school = useSchool();

  console.log("resource:", resource);
  console.log("school:", school);
  console.log("classroomList:", classroomList);

  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("card")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        { label: lang.text("card"), url: "/card" },
        { label: lang.text("generateCard"), url: "/card/generate" },
      ]}
      title={lang.text("card")}
    >
      <div style={{ padding: "0px", textAlign: "left", marginBottom: "16px" }}>
        <div className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-white">Pilih Orientasi Kartu:</h3>
          <button
            className={`p-2 border-2 rounded-md ${
              cardOrientation === "horizontal"
                ? "border-blue-500"
                : "border-gray-500"
            }`}
            onClick={() => setCardOrientation("horizontal")}
          >
            Horizontal
          </button>
          <button
            className={`p-2 border-2 rounded-md ${
              cardOrientation === "vertical"
                ? "border-blue-500"
                : "border-gray-500"
            }`}
            onClick={() => setCardOrientation("vertical")}
          >
            Vertikal
          </button>
        </div>

        {/* Pilih Tema Kartu Depan */}
        <div className="flex space-x-4 overflow-x-auto p-4 bg-gray-800 rounded-lg mt-4">
          <h3 className="text-white">Pilih Tema Kartu Depan:</h3>
          {Object.entries(backgrounds).map(([key, bg]) => (
            <button
              key={key}
              onClick={() => setSelectedBackgroundFront(bg)}
              className={`p-2 border-2 rounded-md transition ${
                selectedBackgroundFront === bg
                  ? "border-blue-500 scale-105"
                  : "border-gray-500"
              }`}
            >
              <img
                src={bg}
                alt={key}
                className="w-16 h-16 rounded-md object-cover"
              />
            </button>
          ))}
        </div>

        {/* Pilih Tema Kartu Belakang */}
        <div className="flex space-x-4 overflow-x-auto p-4 bg-gray-800 rounded-lg mt-4">
          <h3 className="text-white">Pilih Tema Kartu Belakang:</h3>
          {Object.entries(backgrounds).map(([key, bg]) => (
            <button
              key={key}
              onClick={() => setSelectedBackgroundBack(bg)}
              className={`p-2 border-2 rounded-md transition ${
                selectedBackgroundBack === bg
                  ? "border-red-500 scale-105"
                  : "border-gray-500"
              }`}
            >
              <img
                src={bg}
                alt={key}
                className="w-16 h-16 rounded-md object-cover"
              />
            </button>
          ))}
        </div>

        <div
          style={{
            textAlign: "center",
            margin: "30px 0px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Filter Sekolah (Hanya SuperAdmin) */}
          {userRole === "superAdmin" && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <label htmlFor="schoolFilter">Pilih Sekolah:</label>
              {isLoadingSchools ? (
                <p>Loading...</p>
              ) : schoolList && Array.isArray(schoolList) && schoolList.length > 0 ? (
                <Select
                  value={selectedSchool || ""}
                  onValueChange={handleSchoolChange}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Pilih Sekolah" />
                  </SelectTrigger>
                  <SelectContent>
                    {schoolList.map((school) => (
                      <SelectItem key={school.id} value={String(school.id)}>
                        {school.namaSekolah}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p>⚠ Tidak ada sekolah tersedia</p>
              )}
            </div>
          )}

          {/* Filter Kelas dengan Dropdown */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label
              htmlFor="kelasFilter"
              style={{
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              {lang.text("filterByClass")}:
            </label>
            {isLoadingClassrooms ? (
              <p>Loading...</p>
            ) : classroomList && Array.isArray(classroomList) && classroomList.length > 0 ? (
              <Select
                value={searchKelas}
                onValueChange={(value) => setSearchKelas(value)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder={lang.text("selectClassRoom")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kelas</SelectItem>
                  {classroomList.map((kelas) => (
                    <SelectItem
                      key={kelas.id}
                      value={String(kelas.id)}
                      disabled={!kelas.id || !kelas.namaKelas}
                    >
                      {kelas.namaKelas || "Kelas Tidak Diketahui"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p>⚠ Tidak ada kelas tersedia</p>
            )}
          </div>
        </div>

        {/* MultiCard menggunakan searchKelas sebagai ID kelas */}
        {showBackLayer ? (
          <BackLayerCard />
        ) : (
          <MultiCard
            searchKelas={searchKelas}
            schoolId={schoolId}
            // currentPage={currentPage}
            // setCurrentPage={setCurrentPage}
            selectedBackgroundFront={selectedBackgroundFront}
            selectedBackgroundBack={selectedBackgroundBack}
            orientation={cardOrientation}
          />
        )}
      </div>

      <Outlet />
      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};
import { Card, CardContent, Input, lang } from "@/core/libs";
import { useBiodata } from "@/features/user";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMapEvent } from "react-leaflet";
import { useSchool } from "../hooks";
import { IdCard } from "lucide-react";

// Tambahkan CSS untuk progress bar, custom popup styles, dan initial circle
const styles = `
  .progress-container {
    width: 100%;
    max-width: 300px;
    height: 8px;
    background-color: #e0e0e0;
    border-radius: 4px;
    overflow: hidden;
  }
  .progress-bar {
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, #4f46e5, #3b82f6);
    animation: indeterminateAnimation 1.5s infinite linear;
    transform-origin: 0% 50%;
  }
  @keyframes indeterminateAnimation {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  .custom-div-icon .purple-circle {
    width: 16px;
    height: 16px;
    background: #8b5cf6;
    border-radius: 50%;
    border: 2px solid #fff;
  }
 .purple-circle2 {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid #fff;
  }
  .custom-popup {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05), 0 2px 6px rgba(0, 0, 0, 0.03);
    padding: 0;
    width: 320px;
    font-family: Arial, sans-serif;
  }
  .custom-popup .profile-img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #e5e7eb;
  }
  .custom-popup .initial-circle {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #8b5cf6;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: bold;
    border: 2px solid #e5e7eb;
  }
  .custom-popup .stats {
    display: flex;
    gap: 12px;
    margin-top: 8px;
  }
  .custom-popup .stats div {
    text-align: center;
  }
  .custom-popup .stats span {
    font-size: 12px;
    color: #6b7280;
  }
`;

const PurpleCircleIcon = L.divIcon({
  className: "custom-div-icon",
  html: `<div class="purple-circle"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  popupAnchor: [0, -8],
});

const MapEventsHandler = () => {
  useMapEvent("moveend", (event) => {
    const map = event.target;
    const center = map.getCenter();
  });
  return null;
};

export const SchoolMap = () => {
  const [center] = useState<[number, number]>([-6.16667, 106.82676]);
  const [zoom] = useState<number>(12);
  const [searchStudent, setSearchStudent] = useState<string>("");
  const biodata = useBiodata();
  const schools = useSchool();

  console.log("BIODATA LOK:", biodata);

  // Enhanced studentData with sample fields for ratings and followers
  const studentData = useMemo(() => {
    return (
      biodata?.data
        ?.filter((student) => student.location !== null)
        .map((student) => ({
          lat: student.location.latitude,
          lng: student.location.longitude,
          nis: student.user.nis,
          name: student.user.name,
          email: student.user.email,
          alamat: student.user.alamat || "Alamat belum ditentukan",
          updatedAt: student.location.updatedAt,
          profileImage: student.user.profileImage || null, // Use null if no image
          status: "Lokasi", // Sample status
        })) || []
    );
  }, [biodata?.data]);

  if (biodata?.isLoading || schools?.isLoading) {
    return (
      <Card className="w-full h-full">
        <CardContent className="flex flex-col items-center justify-center h-full">
          <style>{styles}</style>
          <div className="progress-container">
            <div className="progress-bar"></div>
          </div>
          <p className="text-muted-foreground mt-8">{lang.text("loading")}</p>
        </CardContent>
      </Card>
    );
  }

  console.log("studentData", studentData);

  return (
    <>
      <Card className="relative z-[9999] w-max h-[70px] flex items-center px-6 py-2 top-5 mb-8">
        <div className="w-full flex items-center space-y-0">
          <div className="w-max flex mr-4 border-r border-white/50 pr-4 items-center">
            <h3 className="text-lg w-max font-normal">{lang.text("studentTotal")}</h3>
            <div className="flex items-center gap-4">
              <h2 className="text-lg ml-4 text-foreground">({biodata?.data?.length || 0})</h2>
            </div>
          </div>
          <div className="w-max flex items-center">
            <h3 className="text-lg w-max font-normal">{lang.text("locationTotal")}</h3>
            <div className="flex items-center gap-4 w-[80px]">
              <h2 className="text-lg text-foreground ml-4 w-max">({studentData?.length || 0})</h2>
            </div>
            <div className="purple-circle2 bg-purple-600"></div>
          </div>
          <div className="ml-6">
            <Input
              placeholder={lang.text("searchStudentByName")}
              value={searchStudent || ""}
              onChange={(e) => setSearchStudent(String(e.target?.value))}
              className="w-[380px] flex-1 focus:border-none focus-outline-none"
            />
          </div>
        </div>
      </Card>
      <Card className="z-[1] w-full mb-12 mt-4 bg-theme-color-primary/5">
        <CardContent className="p-0">
          <div className="relative w-full gap-4 h-max">
            <Card className="w-[100%] h-[72vh]">
              <CardContent className="p-0 h-full">
                <div className="relative rounded-lg h-full overflow-hidden">
                  <style>{styles}</style>
                  <MapContainer
                    className="w-full h-full"
                    center={center}
                    zoom={zoom}
                    scrollWheelZoom={true}
                    attributionControl={false}
                    zoomControl={false}
                    doubleClickZoom={true}
                    dragging={true}
                    easeLinearity={0.35}
                  >
                    <MapEventsHandler />
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {studentData && studentData.length > 0
                      ? studentData
                          .filter((data) => {
                            if (searchStudent && searchStudent !== "") {
                              return data.name.toLowerCase().includes(searchStudent.toLowerCase());
                            }
                            return true;
                          })
                          .map((student, index) => (
                            <Marker
                              icon={PurpleCircleIcon}
                              key={biodata?.data[index]?.id || index}
                              position={[student.lat, student.lng]}
                            >
                              <Popup className="relative custom-popup bg-transparent">
                                <div className="relative pt-2 flex flex-col items-center gap-2">
                                  <div className="relative mb-5 w-full flex item-center justify-between">
                                    <div className="w-max text-sm gap-2 flex items-center">
                                      <IdCard /> NIS: {student.nis}
                                    </div>
                                    <div className="w-max bg-green-400 text-white text-[12px] flex items-center justify-center px-2">
                                      {student.status}
                                    </div>
                                  </div>
                                  {student.profileImage && student.profileImage !== "" ? (
                                    <img
                                      src={student.profileImage}
                                      alt={student.name}
                                      className="profile-img"
                                    />
                                  ) : (
                                    <div className="initial-circle">
                                      {student.name.charAt(0).toUpperCase()}
                                    </div>
                                  )}
                                  <div className="w-full flex items-center text-center flex-col">
                                    <strong className="text-lg">{student.name}</strong>
                                    <p className="relative top-[-12px] text-sm text-gray-600">
                                      {student?.email}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-center w-full flex flex-col justify-center items-center">
                                  <p className="text-sm text-gray-600">{student.alamat}</p>
                                  <p className="text-xs text-gray-500 mt-1 mb-3">
                                    Last Updated: {new Date(student.updatedAt).toLocaleString()}
                                  </p>
                                  <a
                                    href={`https://www.google.com/maps?q=${student.lat},${student.lng}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="google-maps-button"
                                  >
                                    Lihat google maps
                                  </a>
                                </div>
                              </Popup>
                            </Marker>
                          ))
                      : null}
                  </MapContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
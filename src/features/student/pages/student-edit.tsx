import { useParamDecode } from "@/features/_global";
import { Navigate } from "react-router-dom";

export const StudentEdit = () => {
  const { decodeParams, params } = useParamDecode();

  // 🔹 Debugging: Pastikan ID yang diterima dari URL benar

  // 🔹 Validasi: Jika ID tidak ada, arahkan ke halaman 404
  if (!decodeParams?.id || !decodeParams?.text) {
    console.warn("❌ ERROR: ID siswa tidak ditemukan! Redirect ke /404");
    return <Navigate to="/404" replace />;
  }

  return (
    <></>
    // <DashboardPageLayout
    //   siteTitle={`${lang.text("editStudent")} | ${APP_CONFIG.appName}`}
    //   breadcrumbs={[
    //     {
    //       label: lang.text("student"),
    //       url: "/students",
    //     },
    //     {
    //       label: lang.text("editStudent"),
    //       url: `/students/edit/${params.id}`,
    //     },
    //     {
    //       label: String(decodeParams?.text),
    //       url: `/students/edit/${params.id}`,
    //     },
    //   ]}
    //   title={lang.text("editStudent")}
    // >
    //   <div className="pb-4" />
    //   <StudentCreationForm />
    //   <div className="pb-16 sm:pb-0" />
    // </DashboardPageLayout>
  );
};

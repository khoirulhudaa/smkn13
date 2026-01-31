import { APP_CONFIG } from "@/core/configs/app";
import { MENU_CONFIG, USERMENU_CONFIG } from "@/core/configs/menu";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RootPage } from "../dashboard";

// Load Component for Pages
import { Default404, Vokadash } from "@/features/_global";
import { Otp } from "@/features/otp";
import { SchoolRegister } from "@/features/schools";
import AgendaPage from "../agenda/pages/home";
import { BukuAlumni } from "../alumni/pages/home";
import BeritaPage from "../berita/pages/home";
import Homepage from "../dashboard/pages/home";
import EkskulPage from "../ekstrakurikuler/pages/home";
import GalleryPage from "../galeri/pages/home";
import TeacherStaffPage from "../guruDanTendik/pages/home";
import SchedulePage from "../jadwal/pages/home";
import CalendarPage from "../kalender/pages/home";
import KelulusanPage from "../kelulusan/pages/home";
import LayananPage from "../kontak/pages/home";
import CurriculumPage from "../kurikulum/pages/home";
import OsisPage from "../osis/pages/home";
import PengumumanPage from "../pengumuman/pages/home";
import PerpustakaanPage from "../perpustakaan/pages/home";
import PPDBPage from "../ppdb/pages/home";
import { PPIDMain } from "../ppid/pages/home";
import PrestasiPage from "../prestasi/pages/home";
import Sambutan from "../sambutan/pages/home";
import SejarahPage from "../sejarah/pages/home";
import StrukturPage from "../struktur/pages/home";
import VisiMisiPage from "../visiMisi/pages/home";
import KandidatOsisPage from "../kandidatosis/pages/home";
import { PramukaMain } from "../pramuka/pages/home";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
import ProgramSekolahPage from "../program/pages/home";
import VotingOsisPage from "../voting/pages/home";
import AturanTataTertibPage from "../tataTertib/pages/taskLanding";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <RootPage />,
      errorElement: <Default404 />,
      children: [
        {
          index: true, // Menangani path "/" secara langsung
          element: <Homepage />, // Render HomepageLanding untuk "/"
        },
        {
          path: "/halaman-utama", // Relative: menjadi "/dashboard"
          element: <Homepage />, // Juga render HomepageLanding untuk "/dashboard"
        },
        {
          path: "sambutan", // Relative: menjadi "/sambutan"
          element: <Sambutan />,
        },
        {
          path: "visiMisi", // Relative: menjadi "/visiMisi"
          element: <VisiMisiPage />,
        },
        {
          path: "sejarah", // Relative: menjadi "/sejarah"
          element: <SejarahPage />,
        },
        {
          path: "struktur", // Relative: menjadi "/struktur"
          element: <StrukturPage />,
        },
        {
          path: "kurikulum", // Relative: menjadi "/kurikulum"
          element: <CurriculumPage />,
        },
        {
          path: "kalender", // Relative: menjadi "/kalender"
          element: <CalendarPage />,
        },
        {
          path: "jadwal", // Relative: menjadi "/jadwal"
          element: <SchedulePage />,
        },
        {
          path: "guru-tendik", // Relative: menjadi "/guru-tendik"
          element: <TeacherStaffPage />,
        },
        {
          path: "osis", // Relative: menjadi "/osis"
          element: <OsisPage />,
        },
        {
          path: "pramuka", // Relative: menjadi "/osis"
          element: <PramukaMain />,
        },
        {
          path: "program", // Relative: menjadi "/osis"
          element: <ProgramSekolahPage />,
        },
        {
          path: "kandidatosis", // Relative: menjadi "/osis"
          element: <KandidatOsisPage />,
        },
        {
          path: "ekstrakulikuler", // Relative: menjadi "/ekstrakulikuler"
          element: <EkskulPage />,
        },
        {
          path: "perpustakaan", // Relative: menjadi "/perpustakaan"
          element: <PerpustakaanPage />,
        },
        {
          path: "prestasi", // Relative: menjadi "/prestasi"
          element: <PrestasiPage />,
        },
        {
          path: "pengumuman", // Relative: menjadi "/pengumuman"
          element: <PengumumanPage />,
        },
        {
          path: "voting-osis", // Relative: menjadi "/pengumuman"
          element: <VotingOsisPage />,
        },
        {
          path: "tata-tertib", // Relative: menjadi "/pengumuman"
          element: <AturanTataTertibPage />,
        },
        {
          path: "berita", // Relative: menjadi "/berita"
          element: <BeritaPage />,
        },
        {
          path: "agenda", // Relative: menjadi "/agenda"
          element: <AgendaPage />,
        },
        {
          path: "ppdb", // Relative: menjadi "/ppdb"
          element: <PPDBPage />,
        },
        {
          path: "galeri", // Relative: menjadi "/ppdb"
          element: <GalleryPage />,
        },
        {
          path: "ppid", // Relative: menjadi "/ppdb"
          element: <PPIDMain />,
        },
        {
          path: "buku-alumni", // Relative: menjadi "/ppdb"
          element: <BukuAlumni />,
        },
        // {
        //   path: "kontak", // Relative: menjadi "/ppdb"
        //   element: <KontakMain />,
        // },
        {
          path: "layanan", // Relative: menjadi "/ppdb"
          element: <LayananPage />,
        },
        {
          path: "kelulusan", // Relative: menjadi "/ppdb"
          element: <KelulusanPage />,
        },
      ],
    },
    {
      path: "/schools/register",
      element: <SchoolRegister />,
    },
    {
      path: "/otp",
      element: <Otp />,
    },
  ],
  {
    basename: APP_CONFIG.baseName,
  }
);

export const RootApp = () => {
  const sidebarMenus = MENU_CONFIG.staff;
  const usermenus = USERMENU_CONFIG.staff;

  return (
    <div className="no-select">
      <Vokadash
        appName={APP_CONFIG.appName}
        menus={sidebarMenus}
        usermenus={usermenus}
      >
        <RouterProvider router={router} />
      </Vokadash>
    </div>
  );
};

export const App = () => {
  return  (
    <QueryClientProvider client={queryClient}>
      <RootApp />;
    </QueryClientProvider>
  )
};
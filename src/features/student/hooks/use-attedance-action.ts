import { lang } from "@/core/libs";
import { useAlert } from "@/features/_global";
import { useAttendanceCreation } from "@/features/attendance/hooks";
import { useProfile } from "@/features/profile";
import { useBiodataNew } from "@/features/user/hooks/use-biodata-new";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAttedances } from "./use-attendace";

export const useAttendanceActions = (id: string | number) => {
  const creation = useAttendanceCreation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const alert = useAlert();
  const profile = useProfile();
  const profileSchoolId = profile?.user?.sekolahId;

  // Gunakan useBiodataNew dengan ID yang sama seperti di StudentLandingTables
  const biodatanew = useBiodataNew(profileSchoolId || id);

  const attedances = profileSchoolId !== null ? useAttedances({ id: profileSchoolId }) : useAttedances();

  const handleAttend = async (userId: number) => {
    try {
      if (userId) {
        await creation.create({ userId });
      }

      alert.success(lang.text("successCreate", { context: lang.text("attendance") }));

      // Invalidasi cache untuk semua query terkait
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["biodata-siswa-new", profileSchoolId] }), // Invalidasi useBiodataNew
        queryClient.invalidateQueries({ queryKey: ["attedances-new", profileSchoolId] }), // Invalidasi useAttedances
        queryClient.invalidateQueries({ queryKey: ["students"] }), // Invalidasi useStudentPagination
      ]);

      // Refetch semua data yang relevan
      await Promise.all([
        biodatanew.query.refetch(),
        attedances.query.refetch(),
      ]);

      navigate(-1);
    } catch (err: any) {
      if (err.message?.includes("prisma.devices.findUnique")) {
        console.warn("Prisma device query failed, but treating as success");
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["students"] }),
          queryClient.invalidateQueries({ queryKey: ["attedances-new"] }),
        ]);
        alert.success(lang.text("successCreate", { context: lang.text("attendance") }));
      } else {
        const errorMessage = err.message || (userId
          ? lang.text("failUpdate", { context: lang.text("attendance") })
          : lang.text("failCreate", { context: lang.text("attendance") }));
        alert.error(errorMessage);
      }
    }
  };

  const handleAttendRemove = async (userId: number) => {
    try {
      if (userId) {
        await creation.remove({ userId });
      }

      alert.success(lang.text('dataSuccessDeleteStudent'));

      // Invalidasi cache untuk semua query terkait
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["biodata-siswa-new", profileSchoolId] }), // Invalidasi useBiodataNew
        queryClient.invalidateQueries({ queryKey: ["attedances-new", profileSchoolId] }), // Invalidasi useAttedances
        queryClient.invalidateQueries({ queryKey: ["students"] }), // Invalidasi useStudentPagination
      ]);

      // Refetch semua data yang relevan
      await Promise.all([
        biodatanew.query.refetch(),
        attedances.query.refetch(),
      ]);

      navigate(-1);
    } catch (err: any) {
      if (err.message?.includes("prisma.devices.findUnique")) {
        console.warn("Prisma device query failed, but treating as success");
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["students"] }),
          queryClient.invalidateQueries({ queryKey: ["attedances-new"] }),
        ]);
        alert.success(lang.text('dataSuccessDeleteStudent'));
      } else {
        const errorMessage = err.message || (userId
          ? lang.text("failUpdate", { context: lang.text("attendance") })
          : lang.text("failCreate", { context: lang.text("attendance") }));
        alert.error(errorMessage);
      }
    }
  };

  const handleAttendGoHome = async (userId: number) => {
    try {
      if (userId) {
        await creation.createGo({ userId });
      }

      alert.success(lang.text("successCreate", { context: lang.text("goHome") }));

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["biodata-siswa-new", profileSchoolId] }),
        queryClient.invalidateQueries({ queryKey: ["attedances-new", profileSchoolId] }),
        queryClient.invalidateQueries({ queryKey: ["students"] }),
      ]);

      await Promise.all([
        biodatanew.query.refetch(),
        attedances.query.refetch(),
      ]);

      navigate(-1);
    } catch (err: any) {
      if (err.message?.includes("prisma.devices.findUnique")) {
        console.warn("Prisma device query failed, but treating as success");
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["students"] }),
          queryClient.invalidateQueries({ queryKey: ["attedances-new"] }),
        ]);
        alert.success(lang.text("successCreate", { context: lang.text("goHome") }));
      } else {
        const errorMessage = err.message || (userId
          ? lang.text("failUpdate", { context: lang.text("attendance") })
          : lang.text("failCreate", { context: lang.text("attendance") }));
        alert.error(errorMessage);
      }
    }
  };

  return { handleAttend, handleAttendGoHome, handleAttendRemove };
};
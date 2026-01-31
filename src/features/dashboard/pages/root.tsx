import { DashboardLayout, useVokadashContext } from "@/features/_global";
import { Outlet } from "react-router-dom";

export const RootPage = () => {
  const appContext = useVokadashContext();

  return (
    <DashboardLayout menus={appContext.menus} usermenus={appContext.usermenus}>
      <Outlet />
    </DashboardLayout>
  );
};

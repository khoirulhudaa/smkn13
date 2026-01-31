// src/layouts/AppLayout.tsx
import { Outlet } from "react-router-dom";
import { Vokadash } from "@/features/_global";
import { APP_CONFIG } from "@/core/configs/app";
import { MENU_CONFIG, USERMENU_CONFIG } from "@/core/configs/menu";

export const AppLayout = () => {
  const sidebarMenus = MENU_CONFIG.staff;
  const usermenus = USERMENU_CONFIG.staff;

  return (
    <Vokadash appName={APP_CONFIG.appName} menus={sidebarMenus} usermenus={usermenus}>
      <Outlet />
    </Vokadash>
  );
};

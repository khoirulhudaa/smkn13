import React, { PropsWithChildren } from 'react';
import { SidebarProps } from './sidebar/types';
import { UserMenuProps } from './usermenu';

export interface DashboardLayoutProps extends PropsWithChildren {
  menus: SidebarProps['menus'];
  usermenus: UserMenuProps['menus'];
  sidebarClassName?: string;
  headerClassName?: string;
}
export const DashboardLayout = React.memo(({ menus = [], usermenus, children, ...props }: DashboardLayoutProps) => {
  return (
    <>
      <div className="dashboard-layout grid min-h-[100svh] w-full">
          <div className="sidebar-content bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-neutral-100 flex flex-col overflow-hidden">
            <div className="sidebar-layout-main bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-neutral-100 max-h-svh overflow-y-auto flex flex-1 flex-col gap-4">
              <div className="gap-4 flex-1 flex flex-col">
                {children}
              </div>
            </div>
          </div>
      </div>
    </>
  );
});

DashboardLayout.displayName = 'DashboardLayout';
import { useParamDecode } from '@/features/_global';
import { Navigate } from 'react-router-dom';

export const StudentDetail = () => {
  const { decodeParams, params } = useParamDecode();

  if (!decodeParams?.id || !decodeParams?.text) {
    return <Navigate to="/404" replace />;
  }

  return (
    <></>
    // <DashboardPageLayout
    //   siteTitle={`${lang.text('studentDetail')} | ${APP_CONFIG.appName}`}
    //   breadcrumbs={[
    //     {
    //       label: lang.text('student'),
    //       url: '/students',
    //     },
    //     {
    //       label: decodeParams?.text,
    //       url: `/students/${params.id}`,
    //     },
    //   ]}
    //   title={lang.text('studentDetail')}
    //   backButton
    // >
    //   <div className="pb-4" />
    //   <StudentInformation />
    //   <div className="py-4 mt-6">
    //     {STUDENT_SUBMENU.map((submenu, index) => {
    //       return (
    //         <NavLink
    //           key={index}
    //           to={submenu.path}
    //           end
    //           className={({ isActive }) => {
    //             return cn(
    //               buttonVariants({ variant: isActive ? 'default' : 'outline' }),
    //               'mr-2',
    //             );
    //           }}
    //         >
    //           {submenu.title}
    //         </NavLink>
    //       );
    //     })}
    //   </div>
    //   <Outlet />
    //   <div className="pb-16 sm:pb-0" />
    // </DashboardPageLayout>
  );
};

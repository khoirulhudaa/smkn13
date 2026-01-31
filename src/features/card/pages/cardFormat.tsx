import { lang } from '@/core/libs';
import { DashboardPageLayout } from '@/features/_global';
import { CardCreationForm } from '../containers';

export const CardPage = () => {
  return (
    <DashboardPageLayout
      breadcrumbs={[
        {
          label: lang.text('cardStudentFormat'),
          url: '/format/card',
        },
      ]}
      title={lang.text('cardStudentFormat')}
    >
      <CardCreationForm />

      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};

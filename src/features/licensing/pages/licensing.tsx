import { lang } from '@/core/libs';
import { DashboardPageLayout } from '@/features/_global';
import { LincensingCreationForm } from '../containers';

export const LicensingPage = () => {
  return (
    <DashboardPageLayout
      breadcrumbs={[
        {
          label: lang.text('createDispen'),
          url: '/licensing',
        },
      ]}
      title={lang.text('createDispen')}
    >
      <LincensingCreationForm />

      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};

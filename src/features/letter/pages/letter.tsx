import { lang } from '@/core/libs';
import { DashboardPageLayout } from '@/features/_global';
import { LetterCreationForm } from '../containers';

export const LetterPage = () => {
  return (
    <DashboardPageLayout
      breadcrumbs={[
        {
          label: lang.text('letterFormat'),
          url: '/format',
        },
      ]}
      title={lang.text('updateLetter')}
    >
      <LetterCreationForm />

      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};

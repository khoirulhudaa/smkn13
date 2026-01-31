import {
  studentDailyPresenceColumn,
  tableColumnSiswaFallback,
} from '../../student/utils';
import { BaseDataTable } from '@/features/_global';
import { lang } from '@/core/libs';
import { useMemo } from 'react';
import { useStudentDetail } from '../../student/hooks';

export interface StudentDailyPresenceTableProps {
  id?: number;
}

export function StudentDailyPresenceTable(
  props: StudentDailyPresenceTableProps,
) {
  const detail = useStudentDetail({ id: props?.id });
  const items = useMemo(
    () => detail.data?.absensis || [],
    [detail?.data?.absensis],
  );

  return (
    <BaseDataTable
      columns={studentDailyPresenceColumn}
      data={items}
      dataFallback={tableColumnSiswaFallback}
      globalSearch
      initialState={{
        sorting: [
          {
            id: 'createdAt',
            desc: true,
          },
        ],
      }}
      // searchParamPagination
      // showFilterButton
      searchPlaceholder={lang.text('search')}
      isLoading={detail.query.isLoading}
    />
  );
}

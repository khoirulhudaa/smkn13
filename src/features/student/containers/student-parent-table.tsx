import { lang } from '@/core/libs';
import { BaseDataTable } from '@/features/_global';
import { parentColumnWithFilter, useParent } from '@/features/parents';
import { useSchool } from '@/features/schools';
import { useBiodata } from '@/features/user/hooks';
import { useMemo } from 'react';

export interface StudentParentTableProps {
  id?: number;
}

export function StudentParentTable(props: StudentParentTableProps) {
  const parent = useParent();
  const student = useBiodata();
  const school = useSchool();

  const detail = useMemo(
    () => student?.data?.find((d) => Number(d.id) === Number(props.id)),
    [props.id, student.data],
  );

  const parentNik = detail?.orangTua?.[0]?.user?.nik;

  const datas = useMemo(() => {
    return parent.data
      ?.filter((d) => d.nik === parentNik)
      ?.map((d) => {
        return {
          ...d,
          student: student.data?.find((e) =>
            Boolean(e.orangTua?.find((f) => f.user?.nik === d.nik)),
          ),
          school: school.data?.find(
            (e) => Number(e.id) === Number(d.sekolahId),
          ),
        };
      });
  }, [parent.data, parentNik, school.data, student.data]);

  const columns = useMemo(() => {
    return parentColumnWithFilter();
  }, []);

  return (
    <BaseDataTable
      columns={columns}
      data={datas}
      dataFallback={[]}
      globalSearch={false}
      // searchParamPagination
      // showFilterButton
      searchPlaceholder={lang.text('search')}
      isLoading={
        parent.query.isLoading || student.isLoading || school.isLoading
      }
    />
  );
}

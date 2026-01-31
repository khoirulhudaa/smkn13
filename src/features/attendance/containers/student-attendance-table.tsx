import { distinctObjectsByProperty, lang } from '@/core/libs';
import { BiodataSiswa } from '@/core/models/biodata';
import { BaseDataTable } from '@/features/_global';
import { useClassroom } from '@/features/classroom';
import { useSchool } from '@/features/schools';
import { useMemo } from 'react';
import { studentAttendanceColumn } from '../utils';

interface StudentAttendanceTableProps {
  data: BiodataSiswa[]; // Terima data yang difilter
  totalAttedance?: boolean;
  isLoading?: boolean;
}

export function StudentAttendanceTable({ data, isLoading }: StudentAttendanceTableProps) {
  const school = useSchool();
  const classroom = useClassroom();

  const columns = useMemo(
    () =>
      studentAttendanceColumn({
        classroomOptions: distinctObjectsByProperty(
          classroom.data?.map((d) => ({
            label: d.namaKelas,
            value: d.namaKelas,
          })) || [],
          'value',
        ),
        schoolOptions: distinctObjectsByProperty(
          school.data?.map((d) => ({
            label: d.namaSekolah,
            value: d.namaSekolah,
          })) || [],
          'value',  
        ),
      }),
    [school.data, classroom.data],
  );

  return (
    <div>
      <BaseDataTable
        columns={columns}
        // totalAttedance={totalAttedance}
        data={data} // Gunakan data yang diterima dari prop
        dataFallback={[]}
        globalSearch
        searchParamPagination
        showFilterButton
        initialState={{
          columnVisibility: {
            user_email: false,
            user_nis: false,
            user_nisn: false,
          },
          sorting: [
            {
              id: 'attendance_createdAt',
              desc: true,
            },
          ],
        }}
        // actions={[
        //   {
        //     title: lang.text("addAttendance"),
        //     url: "/attendance/create",
        //   },
        // ]}
        searchPlaceholder={lang.text('search')}
        isLoading={isLoading} // Tidak perlu lagi query biodata di sini
      />
    </div>
  );
}

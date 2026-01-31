import { useBiodata } from '@/features/user/hooks';
import {
  checkAttendance,
  studentColumnWithFilter,
  tableColumnSiswaFallback,
  useAttedances,
  useStudentPagination,
} from '@/features/student';
import { BaseDataTable, useDataTableController } from '@/features/_global';
import { lang } from '@/core/libs';
import { useSchool } from '@/features/schools';
import { useMemo, useEffect, useState } from 'react';
import { StudentMoodleTable } from '../../student/containers/student-moodle';
import { useProfile } from '@/features/profile';

export interface SchoolStudentProps {
  id: number;
}

// Definisi tipe Detail sesuai dengan yang diharapkan oleh StudentMoodleTable
interface Detail {
  id: number;
  data: {
    user: {
      sekolahId: number;
      nis: number;
    };
  };
}

export function SchoolStudentTable(props: SchoolStudentProps) {
  const [attendanceResult, setAttendanceResult] = useState([]);
  const biodata = useBiodata();
  const school = useSchool();
  const profile = useProfile()
  const {
    global,
    sorting,
    filter,
    pagination,
    onSortingChange,
    onPaginationChange,
  } = useDataTableController({ defaultPageSize: 9999 });

  const attedances = profile?.user?.sekolahId !== null ? useAttedances({ id: profile?.user?.sekolahId }) : useAttedances();
  const sekolahId = filter.find((f) => f.id === "sekolahId")?.value;
  const idKelas = filter.find((f) => f.id === "idKelas")?.value;
  console.log('attedance', attedances)
  const studentParams = useMemo(() => ({
    page: pagination.pageIndex + 1,
    size: pagination.pageSize,
    sekolahId: sekolahId ? +sekolahId : undefined,
    idKelas: idKelas ? +idKelas : undefined,
    keyword: global,
  }), [pagination.pageIndex, pagination.pageSize, sekolahId, idKelas, global]);

  const { data, isLoading, refetch } = useStudentPagination(studentParams); // Pastikan refetch diambil dari hook

  useMemo(() => {
    if (attedances.isLoading || isLoading || !attedances.data || !data?.students?.data) {
      return;
    }
    const result = checkAttendance(attedances.data, data.students?.data);
    setAttendanceResult(result);
    console.log('result yang ini', result)
  }, [attedances.isLoading, attedances.data, isLoading, data?.students?.data]);
  

  // State untuk data yang akan dikirim ke StudentMoodleTable
  const [selectedStudent, setSelectedStudent] = useState<Detail | null>(null);

  // Log data dari biodata dan school saat diperoleh
  useEffect(() => {
    console.log('🚀 ~ Biodata fetched:', biodata.data);
    console.log('🚀 ~ School data fetched:', school.data?.[0]);
  }, [biodata.data, school.data?.[0]]);

console.log('biod', biodata.data)

  // const datas = useMemo(() => {
  //   const filteredData = biodata.data?.filter(
  //     (d) => Number(d.user?.sekolah?.id) === props.id,
  //   );
  //   console.log('🚀 ~ Filtered data based on school ID:', filteredData);
  //   return filteredData;
  // }, [biodata.data, props.id]);

  const columns = useMemo(() => {
    const columnData = studentColumnWithFilter({
      noStatus: true,
      schoolOptions:
        school.data?.map((d) => ({
          label: d.namaSekolah,
          value: d.namaSekolah,
        })) || [],
    });
    console.log('🚀 ~ Generated columns:', columnData);
    return columnData;
  }, [school.data?.[0]]);

  // Log final data untuk tabel
  // useEffect(() => {
  //   console.log('🚀 ~ Final data for table:', datas);
  // }, [datas]);

  // Fungsi untuk menangani klik pada siswa
  const handleStudentClick = (student: any) => {
    const studentDetail: Detail = {
      id: student.id, // Menambahkan id
      data: {
        user: {
          sekolahId: student.user?.sekolah?.id || 0,
          nis: Number(student.user?.nis) || 0, // Pastikan tipe number
        },
      },
    };

    console.log('🚀 ~ Selected Student Detail:', studentDetail);
    setSelectedStudent(studentDetail);
  };

  // console.log('datas', datas)

  return (
    <div>
      <BaseDataTable
        columns={columns}
        data={attendanceResult}
        dataFallback={tableColumnSiswaFallback}
        globalSearch
        searchPlaceholder={lang.text('search')}
        isLoading={biodata.query.isLoading}
        onRowClick={handleStudentClick} // Event saat baris tabel diklik
      />
      {selectedStudent && (
        <div style={{ marginTop: '20px' }}>
          <h3>Detail Siswa</h3>
          <StudentMoodleTable detail={selectedStudent} />
        </div>
      )}
    </div>
  );
}

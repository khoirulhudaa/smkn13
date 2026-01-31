import { Input, lang } from "@/core/libs";
import { BaseDataTables } from "@/features/_global/components/base-data-tables";
import { useAttendanceActions } from "@/features/student/hooks";
import { useMemo, useState } from "react";
import { useClassroomOptions, useSchoolOptions } from "../hooks/use-format-school-class";
import { studentColumnWithFilter, studentColumnWithFilterForAbsenceManual } from "../utils";

interface StudentTableProps {
  data: any[];
  isLoading: boolean;
  pagination: {
    pageIndex: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (newPage: number) => void;
    onSizeChange: (newSize: number) => void;
  };
  sorting: any[];
  onSortingChange: (sort: any[]) => void;
}

export function StudentTableManual({
  data,
  isLoading,
  pagination,
  sorting,
  onSortingChange,
}: StudentTableProps) {
  const schoolOptions = useSchoolOptions();
  const classroomOptions = useClassroomOptions();
  const { handleAttend, handleAttendGoHome } = useAttendanceActions();

  // Opsi untuk dropdown statusKehadiran
  // const statusOptions = [
  //   { value: "all", label: "Tampilkan Semua" },
  //   { value: "hadir", label: "Hadir" },
  // ];

  // Memoize columns untuk mencegah regenerasi yang tidak perlu
  const columns = useMemo(
    () =>
      studentColumnWithFilterForAbsenceManual({
        schoolOptions,
        classroomOptions,
        handleAttend,
        handleAttendGoHome
      }),
    [schoolOptions, classroomOptions, handleAttend, handleAttendGoHome]
  );

console.log('datadata', data)

  return (
    <div className="flex flex-col">
      <BaseDataTables
        columns={columns}
        data={data}
        globalSearch={false}
        showFilterButton={false}
        isLoading={isLoading}
        searchParamPagination
        initialState={{ sorting }}
        onSortingChange={onSortingChange}
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        totalItems={pagination.totalItems}
        onPageChange={pagination.onPageChange}
        onSizeChange={pagination.onSizeChange}
      />
    </div>
  );
}

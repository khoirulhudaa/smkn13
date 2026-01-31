import { Input, lang } from "@/core/libs";
import { BaseDataTables } from "@/features/_global/components/base-data-tables";
import { useAttendanceActions } from "@/features/student/hooks";
import { useMemo, useState } from "react";
import { useClassroomOptions, useSchoolOptions } from "../hooks/use-format-school-class";
import { studentColumnWithFilter } from "../utils";

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

export function StudentTable({
  data,
  isLoading,
  pagination,
  sorting,
  onSortingChange,
}: StudentTableProps) {
  const schoolOptions = useSchoolOptions();
  const classroomOptions = useClassroomOptions();
  const { handleAttendRemove } = useAttendanceActions();

  // State untuk filter
  const [searchFilter, setSearchFilter] = useState<string>(""); // Gabungkan nameFilter dan NISFilter
  // const [statusFilter, setStatusFilter] = useState<string>("all");

  // Opsi untuk dropdown statusKehadiran
  // const statusOptions = [
  //   { value: "all", label: "Tampilkan Semua" },
  //   { value: "hadir", label: "Hadir" },
  // ];

  // Memoize columns untuk mencegah regenerasi yang tidak perlu
  const columns = useMemo(
    () =>
      studentColumnWithFilter({
        schoolOptions,
        classroomOptions,
        handleAttendRemove,
      }),
    [schoolOptions, classroomOptions]
  );

  // Filter data berdasarkan searchFilter saja (status ditangani server-side)
  const filteredData = useMemo(() => {
    if (!searchFilter) return data;
    return data.filter((item) => {
      return (
        item.name?.toLowerCase().includes(searchFilter.toLowerCase()) ||
        item.nis?.toString().includes(searchFilter) ||
        item.nisn?.toString().includes(searchFilter) 
      );
    });
  }, [data, searchFilter]);

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between gap-4 mb-4">
        <Input
          type="text"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          placeholder={lang.text('searchByNameOrNISNISN')}
          className="w-[300px]"
        />
      </div>
      <BaseDataTables
        columns={columns}
        data={filteredData}
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

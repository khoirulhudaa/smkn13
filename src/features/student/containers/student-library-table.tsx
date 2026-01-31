import {
    Input,
    lang,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/core/libs";
import { useDataTableController } from "@/features/_global";
import { LibraryTable } from "@/features/library/container";
import { useLibrary } from "@/features/library/hooks";
import { useProfile } from "@/features/profile";
import { useState } from "react";

interface VisitorEntry {
  id: number;
  userId: number;
  status: "masuk" | "keluar";
  waktuKunjungan: string;
  waktuKeluar: string | null;
  createdAt: string;
  updatedAt: string;
  durasiKunjungan: number | null;
  user: { id: number; email: string; name?: string; nis?: string; nisn?: string; namaKelas?: string; [key: string]: any };
}

export const StudentLibraryTable = ({ formattedDate, id }: { formattedDate?: string; id?: number }) => {
  const {
    global,
    sorting,
    filter,
    pagination,
    onSortingChange,
    onPaginationChange,
  } = useDataTableController({ defaultPageSize: 50 });

  const [nisFilter, setNisFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [dayFilter, setDayFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const profile = useProfile();
  const { data: libraries, isLoading } = useLibrary({
    sekolahId: profile?.user?.sekolahId,
    tanggal: formattedDate,
  });

  const dayOrder = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];

  const mergedDataInOrder = dayOrder.reduce((acc: VisitorEntry[], day) => {
    if (libraries?.data?.[day]?.length) {
      acc.push(...libraries.data[day]);
    }
    return acc;
  }, []);

  const filteredData = mergedDataInOrder.filter((item) => {
    const nameMatch = nameFilter
      ? item?.user?.name?.toLowerCase().includes(nameFilter.toLowerCase())
      : true;

    const nisMatch = nisFilter
      ? (item?.user?.nis?.toLowerCase().includes(nisFilter.toLowerCase()) ||
        item?.user?.nisn?.toLowerCase().includes(nisFilter.toLowerCase()))
      : true;

    const dayMatch = dayFilter === "all" ||
      libraries?.data?.[dayFilter]?.includes(item);

    const statusMatch = statusFilter === "all" || item.status === statusFilter;

    const idMatch = id ? item.userId === id : true; // Filter by userId if id is provided

    return nameMatch && nisMatch && dayMatch && statusMatch && idMatch;
  });

  return (
    <>
      <div className="flex items-center gap-3 mt-6 mb-3">
        <Input
          type="text"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          placeholder={lang.text("search") || "Filter by name..."}
          className="w-[300px]"
        />
        <Input
          type="text"
          value={nisFilter}
          onChange={(e) => setNisFilter(e.target.value)}
          placeholder={lang.text("filterNIS") || "Filter by NIS"}
          className="w-[300px]"
        />
        <Select value={dayFilter} onValueChange={setDayFilter}>
          <SelectTrigger className="w-[190px]">
            <SelectValue placeholder="Filter Hari" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{lang.text('allDays')}</SelectItem>
            {dayOrder.map((day) => (
              <SelectItem key={day} value={day}>
                {lang.text(day)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[190px]">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{lang.text('allStatus')}</SelectItem>
            <SelectItem value="masuk">{lang.text('masuk')}</SelectItem>
            <SelectItem value="keluar">{lang.text('keluar')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <LibraryTable
        data={filteredData}
        isLoading={isLoading}
        pagination={{
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
          totalItems: filteredData.length,
          onPageChange: (page) => onPaginationChange({ ...pagination, pageIndex: page }),
          onSizeChange: (size) => onPaginationChange({ ...pagination, pageSize: size, pageIndex: 0 }),
        }}
        sorting={sorting}
        onSortingChange={onSortingChange}
      />
    </>
  );
};
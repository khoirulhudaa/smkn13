import {
  studentCoursePresenceColumn,
  tableColumnSiswaFallback,
} from "../utils";
import { BaseDataTable } from "@/features/_global";
import { lang } from "@/core/libs";
import { useMemo } from "react";
import { useStudentDetail } from "../hooks";
import { StudentCoursePresenceDataModel } from "@/core/models/biodata";

export interface StudentCoursePresenceTableProps {
  id?: number;
}

export function StudentCoursePresenceTable(
  props: StudentCoursePresenceTableProps,
) {
  const detail = useStudentDetail({ id: props?.id });
  const items = useMemo(() => {
    const coursePresences: StudentCoursePresenceDataModel[] = [];
    detail?.data?.kehadiranBulananMataPelajaran?.forEach((d) => {
      d?.absensisMataPelajaran?.forEach((e) => {
        coursePresences.push({ ...e, periode: d });
      });
    });

    return coursePresences;
  }, [detail?.data?.kehadiranBulananMataPelajaran]);

  return (
    <BaseDataTable
      columns={studentCoursePresenceColumn}
      data={items}
      dataFallback={tableColumnSiswaFallback}
      globalSearch
      // searchParamPagination
      // showFilterButton
      searchPlaceholder={lang.text("search")}
      isLoading={detail.query.isLoading}
    />
  );
}

import { BaseDataTable } from "@/features/_global";
import { lang } from "@/core/libs";
import {
  classroomColumns,
  classroomDataFallback,
  useClassroom,
} from "@/features/classroom";
import { useMemo } from "react";

export interface SchoolClassroomTableProps {
  id: number;
}

export const SchoolClassroomTable = (props: SchoolClassroomTableProps) => {
  const resource = useClassroom();

  const datas = useMemo(() => {
    return resource.data?.filter((d) => Number(d.sekolahId) === props.id);
  }, [props.id, resource.data]);

  return (
    <BaseDataTable
      columns={classroomColumns()}
      data={datas}
      dataFallback={classroomDataFallback}
      globalSearch
      actions={[
        {
          title: lang.text("addClassroom"),
          url: "/classrooms/create",
        },
      ]}
      searchParamPagination
      searchPlaceholder={lang.text("search")}
      isLoading={resource.query.isLoading}
    />
  );
};

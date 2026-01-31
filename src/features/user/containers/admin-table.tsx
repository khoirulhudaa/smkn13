// import { useUserAdmin } from "@/features/user";
// import { adminUserColumns, adminUserDataFallback } from "@/features/user";
// import { BaseDataTable } from "@/features/_global";
// import { lang } from "@/core/libs";
// import { useMemo } from "react";

// export function AdminTable() {
//   const biodata = useUserAdmin();

//   const columns = useMemo(() => adminUserColumns(), []);

//   return (
//     <BaseDataTable
//       columns={columns}
//       data={biodata.data}
//       dataFallback={adminUserDataFallback}
//       globalSearch
//       searchParamPagination
//       // showFilterButton
//       searchPlaceholder={lang.text("search")}
//       isLoading={biodata.query.isLoading}
//     />
//   );
// }

import { AdminCreationForm, useUserAdmin } from "@/features/user";
import { adminUserColumns, adminUserDataFallback } from "@/features/user";
import { BaseActionTable, BaseDataTable } from "@/features/_global";
import { lang } from "@/core/libs";
import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/core/libs"; // Assuming you have a Dialog component
import { UserDataModel } from "@/core/models";
import { simpleEncode } from "@/core/libs";

export function AdminTable() {
  const biodata = useUserAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDataModel | null>(null);

  const columns = useMemo(() => {
    const cols = adminUserColumns();
    // Modify the last column (action column) to use onEdit instead of editPath
    return cols.map((col) => {
      if (col.accessorKey === "id") {
        return {
          ...col,
          cell: ({ row }) => {
            const encryptPayload = simpleEncode(
              JSON.stringify({ id: row.original.id, text: row.original.name }),
            );
            return (
              <BaseActionTable
                onEdit={() => {
                  setSelectedUser(row.original); // Set the user to edit
                  setIsModalOpen(true); // Open the modal
                }}
                // detailPath={/admin/users/${encryptPayload}}
                // deletePath={/admin/users/delete/${encryptPayload}}
              />
            );
          },
        };
      }
      return col;
    });
  }, []);

  console.log('biodata.data', biodata.data)

  return (
    <>
      <BaseDataTable
        columns={columns}
        data={biodata.data}
        dataFallback={adminUserDataFallback}
        globalSearch
        searchParamPagination
        searchPlaceholder={lang.text("search")}
        isLoading={biodata.query.isLoading}
      />
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{lang.text("editUser")}</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <AdminCreationForm
              user={selectedUser}
              onClose={() => setIsModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

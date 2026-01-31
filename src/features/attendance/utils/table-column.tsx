import { Badge, dayjs, lang, simpleEncode } from '@/core/libs';
import { BiodataSiswa } from '@/core/models/biodata';
import { getStaticFile } from '@/core/utils';
import {
  BaseActionTable,
  BaseDataTableFilterValueItem,
  BaseTableFilter,
  BaseTableHeader,
  BaseUserItem,
} from '@/features/_global';
import { ColumnDef } from '@tanstack/react-table';
import { EvidenceItem, EvidencePreview } from '../components';
import { BiodataGuru } from '@/core/models/biodata-guru';

export const studentAttendanceColumn = ({
  schoolOptions = [],
  classroomOptions = [],
  dataMode,
}: BaseTableFilter & { dataMode: 'daily' | 'monthly' }): ColumnDef<BiodataSiswa>[] => {
  return [
    {
      accessorKey: 'attendance.createdAt',
      accessorFn: (row) => row.attendance?.createdAt || row.attendance?.tanggalMasuk,
      header: ({ column }) => (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {lang.text('date')}
        </BaseTableHeader>
      ),
      cell: ({ row }) => (
        <div>
          {row.original.attendance?.createdAt
            ? dayjs(row.original.attendance.createdAt).format('DD MMM YYYY')
            : row.original.attendance?.tanggalMasuk || '-'}
        </div>
      ),
    },
    // Kolom Tanggal Masuk untuk mode harian
    ...(dataMode === 'daily'
      ? [
          {
            accessorKey: 'attendance.tanggalMasuk',
            accessorFn: (row) => row.attendance?.tanggalMasuk,
            header: ({ column }) => (
              <BaseTableHeader
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              >
                {lang.text('tanggalMasuk')}
              </BaseTableHeader>
            ),
            cell: ({ row }) => (
              <div>
                {row.original.attendance?.tanggalMasuk || '-'}
              </div>
            ),
          },
        ]
      : []),
    // {
    //   accessorKey: 'attendance.jamMasuk',
    //   accessorFn: (row) => row.attendance?.jamMasuk,
    //   header: ({ column }) => (
    //     <BaseTableHeader
    //       onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    //     >
    //       {lang.text('clockIn')}
    //     </BaseTableHeader>
    //   ),
    //   cell: ({ row }) => (
    //     <div>
    //       {row.original.attendance?.jamMasuk
    //         ? dayjs(row.original.attendance.jamMasuk).format('HH:mm')
    //         : '-'}
    //     </div>
    //   ),
    // },
    // {
    //   accessorKey: 'attendance.jamPulang',
    //   accessorFn: (row) => row.attendance?.jamPulang,
    //   header: ({ column }) => (
    //     <BaseTableHeader
    //       onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    //     >
    //       {lang.text('clockOut')}
    //     </BaseTableHeader>
    //   ),
    //   cell: ({ row }) => (
    //     <div>
    //       {row.original.attendance?.jamPulang &&
    //       dayjs(row.original.attendance.jamPulang).isValid()
    //         ? dayjs(row.original.attendance.jamPulang).format('HH:mm')
    //         : '-'}
    //     </div>
    //   ),
    // },
    {
      accessorKey: 'user.name',
      accessorFn: (row) => row.user?.name,
      header: ({ column }) => (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {lang.text('student')}
        </BaseTableHeader>
      ),
      enableGlobalFilter: true,
      cell: ({ row }) => (
        <BaseUserItem
          image={row.original.user?.image}
          name={row.original.user?.name}
          text1={`Kelas: ${row.original.kelas?.namaKelas || '-'} / Sekolah: ${
            row.original.user?.sekolah?.namaSekolah || '-'
          }`}
          text2={`NIS: ${row.original.user?.nis || '1212126'} / NISN: ${
            row.original.user?.nisn || '-'
          }`}
        />
      ),
    },
    {
      accessorKey: 'user.email',
      accessorFn: (row) => row.user?.email,
      header: ({ column }) => (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {'Email'}
        </BaseTableHeader>
      ),
      cell: ({ row }) => <div>{row.original.user?.email || '-'}</div>,
    },
    {
      accessorKey: 'user.nis',
      accessorFn: (row) => row.user?.nis,
      header: ({ column }) => (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {lang.text('nis')}
        </BaseTableHeader>
      ),
      cell: ({ row }) => <div>{row.original.user?.nis || '-'}</div>,
    },
    {
      accessorKey: 'user.nisn',
      accessorFn: (row) => row.user?.nisn,
      header: ({ column }) => (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {lang.text('nisn')}
        </BaseTableHeader>
      ),
      cell: ({ row }) => <div>{row.original.user?.nisn || '-'}</div>,
    },
    {
      accessorKey: 'user.sekolah.namaSekolah',
      accessorFn: (row) => row.user?.sekolah?.namaSekolah,
      ...(schoolOptions &&
        schoolOptions.length > 0 && {
          meta: {
            filterLabel: lang.text('school'),
            filterPlaceholder: lang.text('selectSchool'),
            filterVariant: 'select',
            filterOptions: schoolOptions,
            filterColumnVisible: false,
          },
        }),
      header: ({ column }) => (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {lang.text('schoolName')}
        </BaseTableHeader>
      ),
      cell: ({ row }) => <div>{row.original.user?.sekolah?.namaSekolah || '-'}</div>,
    },
    {
      accessorKey: 'kelas.namaKelas',
      accessorFn: (row) => row.kelas?.namaKelas,
      ...(classroomOptions &&
        classroomOptions.length > 0 && {
          meta: {
            filterLabel: lang.text('classroom'),
            filterPlaceholder: lang.text('selectClassroom'),
            filterVariant: 'select',
            filterOptions: classroomOptions,
            filterColumnVisible: false,
          },
        }),
      header: ({ column }) => (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {lang.text('classroom')}
        </BaseTableHeader>
      ),
      cell: ({ row }) => <div>{row.original.kelas?.namaKelas || '-'}</div>,
    },
    {
      accessorKey: 'attendance.statusKehadiran',
      accessorFn: (row) => row.attendance?.statusKehadiran,
      header: ({ column }) => (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {lang.text('status')}
        </BaseTableHeader>
      ),
      cell: ({ row }) => (
        <>
          {row.original.attendance?.statusKehadiran ? (
            <Badge>
              {row.original.attendance?.statusKehadiran.toUpperCase()}
            </Badge>
          ) : (
            '-'
          )}
        </>
      ),
    },
    {
      accessorKey: 'user.id',
      accessorFn: (row) => row.user?.id,
      header: ({ column }) => (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {lang.text('evidence')}
        </BaseTableHeader>
      ),
      cell: ({ row }) => {
        const items: EvidenceItem[] = [];

        if (row.original.attendance?.fotoAbsen) {
          items.push({
            title: lang.text('attendanceInPhoto'),
            image: getStaticFile(row.original.attendance?.fotoAbsen),
            status: row.original.attendance?.statusKehadiran,
          });
        }

        if (row.original.attendance?.fotoAbsenPulang) {
          items.push({
            title: lang.text('attendanceOutPhoto'),
            image: getStaticFile(row.original.attendance?.fotoAbsenPulang),
            status: row.original.attendance?.statusKehadiran,
          });
        }

        if (row.original.attendance?.dispensasi?.buktiSurat) {
          items.push({
            title: lang.text('evidence'),
            image: getStaticFile(row.original.attendance?.dispensasi?.buktiSurat),
            status: row.original.attendance?.statusKehadiran,
          });
        }

        return items.length > 0 ? <EvidencePreview items={items} /> : <div>-</div>;
      },
    },
  ];
};

export const teacherAttendanceColumn = ({
  schoolOptions = [],
}: {
  schoolOptions: BaseDataTableFilterValueItem[];
}): ColumnDef<BiodataGuru>[] => {
  return [
    {
      accessorKey: 'attendance.createdAt',
      accessorFn: (row) => row.attendance?.createdAt,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {lang.text('date')}
          </BaseTableHeader>
        );
      },
      cell: ({ row }) => {
        return (
          <div>
            {row.original.attendance?.createdAt
              ? dayjs(row.original.attendance?.createdAt).format('DD MMM YYYY')
              : '-'}
          </div>
        );
      },
    },
    {
      accessorKey: 'attendance.jamMasuk',
      accessorFn: (row) => row.attendance?.jamMasuk,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {lang.text('clockIn')}
          </BaseTableHeader>
        );
      },
      cell: ({ row }) => {
        return (
          <div>
            {row.original.attendance?.jamMasuk
              ? dayjs(row.original.attendance?.jamMasuk).format('HH:mm')
              : '-'}
          </div>
        );
      },
    },
    {
      accessorKey: 'attendance.jamPulang',
      accessorFn: (row) => row.attendance?.jamPulang,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {lang.text('clockOut')}
          </BaseTableHeader>
        );
      },
      cell: ({ row }) => {
        return (
          <div>
            {row.original.attendance?.jamPulang
              ? dayjs(row.original.attendance?.jamPulang).format('HH:mm')
              : '-'}
          </div>
        );
      },
    },
    {
      accessorKey: 'user.name',
      accessorFn: (row) => row.user?.name,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {lang.text('teacher')}
          </BaseTableHeader>
        );
      },
      enableGlobalFilter: true,
      cell: ({ row }) => {
        return (
          <BaseUserItem
            image={row.original.user?.image}
            name={row.original.user?.name}
            text1={`NIP: ${row.original.user?.nip || '-'} / ${
              row.original.user?.sekolah?.namaSekolah || '-'
            }`}
            text2={`NRK: ${row.original.user?.nrk || '-'} / NIKKI: ${
              row.original.user?.nikki || '-'
            }`}
          />
        );
      },
    },
    {
      accessorKey: 'user.email',
      accessorFn: (row) => row.user?.email,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {'NIS'}
          </BaseTableHeader>
        );
      },
    },
    {
      accessorKey: 'user.nrk',
      accessorFn: (row) => row.user?.nrk,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {'NRK'}
          </BaseTableHeader>
        );
      },
    },
    {
      accessorKey: 'user.nip',
      accessorFn: (row) => row.user?.nip,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {`NIP`}
          </BaseTableHeader>
        );
      },
    },
    {
      accessorKey: 'user.nikki',
      accessorFn: (row) => row.user?.nikki,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {`NIKKI`}
          </BaseTableHeader>
        );
      },
    },
    {
      accessorKey: 'user.sekolah.namaSekolah',
      accessorFn: (row) => row.user?.sekolah?.namaSekolah,
      meta: {
        filterLabel: lang.text('school'),
        filterPlaceholder: lang.text('selectSchool'),
        filterVariant: 'select',
        filterOptions: schoolOptions,
        filterColumnVisible: false,
      },
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {lang.text('schoolName')}
          </BaseTableHeader>
        );
      },
    },
    {
      accessorKey: 'attendance.statusKehadiran',
      accessorFn: (row) => row.attendance?.statusKehadiran,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {lang.text('status')}
          </BaseTableHeader>
        );
      },
      cell: ({ row }) => (
        <>
          {row.original.attendance?.statusKehadiran ? (
            <Badge>
              {row.original.attendance?.statusKehadiran?.toUpperCase()}
            </Badge>
          ) : (
            '-'
          )}
        </>
      ),
    },
    {
      accessorKey: 'user.id',
      accessorFn: (row) => row.user?.id,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {lang.text('evidence')}
          </BaseTableHeader>
        );
      },
      cell: ({ row }) => {
        const items: EvidenceItem[] = [];

        if (row.original.attendance?.fotoAbsen) {
          items.push({
            title: lang.text('attendanceInPhoto'),
            image: getStaticFile(row.original.attendance?.fotoAbsen),
            status: row.original.attendance?.statusKehadiran,
          });
        }

        if (row.original.attendance?.fotoAbsenPulang) {
          items.push({
            title: lang.text('attendanceOutPhoto'),
            image: getStaticFile(row.original.attendance?.fotoAbsenPulang),
            status: row.original.attendance?.statusKehadiran,
          });
        }

        if (row.original.attendance?.dispensasi?.buktiSurat) {
          items.push({
            title: lang.text('evidence'),
            image: getStaticFile(
              row.original.attendance?.dispensasi?.buktiSurat,
            ),
            status: row.original.attendance?.statusKehadiran,
          });
        }

        return <EvidencePreview items={items} />;
      },
    },
    // {
    //   accessorKey: 'id',
    //   accessorFn: (row) => row.id,
    //   size: 50,
    //   enableSorting: false,
    //   header: () => {
    //     return null;
    //   },
    //   cell: ({ row }) => {
    //     const encryptPayload = simpleEncode(
    //       JSON.stringify({
    //         id: row.original.userId,
    //         text: row.original.user?.name,
    //       }),
    //     );
    //     return (
    //       <BaseActionTable
    //         detailPath={`/teachers/${encryptPayload}`}
    //         editPath={`/teachers/edit/${encryptPayload}`}
    //         // deletePath={`/students/delete/${encryptPayload}`}
    //       />
    //     );
    //   },
    // },
  ];
};

// Kolom untuk riwayat absensi
export const historyAttendanceColumn = (): ColumnDef<BiodataSiswa>[] => [
  {
    accessorKey: 'attendance.createdAt',
    accessorFn: (row) => row.attendance?.createdAt,
    header: ({ column }) => {
      return (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {lang.text('date')}
        </BaseTableHeader>
      );
    },
    cell: ({ row }) => {
      return (
        <div>
          {row.original.attendance?.createdAt
            ? dayjs(row.original.attendance?.createdAt).format('DD MMM YYYY')
            : '-'}
        </div>
      );
    },
  },
  {
    accessorKey: 'user.name',
    accessorFn: (row) => row.user?.name,
    header: ({ column }) => {
      return (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {lang.text('student')}
        </BaseTableHeader>
      );
    },
    cell: ({ row }) => {
      return <BaseUserItem name={row.original.user?.name} />;
    },
  },
  {
    accessorKey: 'attendance.jamMasuk',
    accessorFn: (row) => row.attendance?.jamMasuk,
    header: ({ column }) => {
      return (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {lang.text('clockIn')}
        </BaseTableHeader>
      );
    },
    cell: ({ row }) => {
      return (
        <div>
          {row.original.attendance?.jamMasuk
            ? dayjs(row.original.attendance?.jamMasuk).format('HH:mm')
            : '-'}
        </div>
      );
    },
  },
  {
    accessorKey: 'attendance.jamPulang',
    accessorFn: (row) => row.attendance?.jamPulang,
    header: ({ column }) => {
      return (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {lang.text('clockOut')}
        </BaseTableHeader>
      );
    },
    cell: ({ row }) => {
      return (
        <div>
          {row.original.attendance?.jamPulang
            ? dayjs(row.original.attendance?.jamPulang).format('HH:mm')
            : '-'}
        </div>
      );
    },
  },
  {
    accessorKey: 'attendance.statusKehadiran',
    accessorFn: (row) => row.attendance?.statusKehadiran,
    header: ({ column }) => {
      return (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {lang.text('status')}
        </BaseTableHeader>
      );
    },
    cell: ({ row }) => (
      <>
        {row.original.attendance?.statusKehadiran ? (
          <Badge>
            {row.original.attendance?.statusKehadiran?.toUpperCase()}
          </Badge>
        ) : (
          '-'
        )}
      </>
    ),
  },
];

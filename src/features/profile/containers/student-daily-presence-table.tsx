// import { Button, dayjs, lang } from '@/core/libs';
// import { BaseDataTable } from '@/features/_global';
// import { useSchool } from '@/features/schools';
// import { pdf } from '@react-pdf/renderer';
// import { useMemo } from 'react';
// import { FaFilePdf } from 'react-icons/fa';
// import { useStudentDetail } from '../../student/hooks';
// import {
//   studentDailyPresenceColumn,
//   StudentPresencePDF,
//   tableColumnSiswaFallback,
// } from '../../student/utils';

// export function StudentDailyPresenceTable(
//   props: any,
// ) {
//   const detail = useStudentDetail({ id: props?.id });
//   const school = useSchool(); // Ambil data sekolah untuk kop dan ttd
//   const items = useMemo(() => detail.data?.absensis || [], [detail?.data?.absensis]);
  
//   console.log('data absen detail siswa:', props?.id)
//   console.log('data absen detail siswa:', detail?.data)

//   const handleDownloadPDF = async () => {
//     if (!school.data?.[0]) return;
//     console.log('school', school)
//     const doc = (
//       <StudentPresencePDF
//         data={items}
//         school={{
//           namaSekolah: school?.data?.[0]?.namaSekolah ?? 'Nama Sekolah',
//           kopSurat: school.data?.[0]?.kopSurat ?? '',
//           namaKepalaSekolah: school.data?.[0].namaKepalaSekolah,
//           ttdKepalaSekolah: school.data?.[0].ttdKepalaSekolah,
//         }}
//       />
//     );

//     const instance = pdf(doc);
//     const blob = await instance.toBlob();
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = `Laporan-Absensi-${dayjs().format('YYYY-MM-DD')}.pdf`;
//     link.click();
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <>
//       {
//         items?.length === 0 ? (
//           <Button disabled={true} className='flex items-center gap-3 mt-[5px] mb-4 bg-red-600 hover:bg-red-700 text-white cursor-not-allowed'>
//             {lang.text('downloadPDF')}
//             <FaFilePdf />
//           </Button>
//         ):
//           <Button onClick={handleDownloadPDF} className='flex items-center gap-3 mt-[5px] mb-4 bg-red-600 hover:bg-red-700 text-white'>
//             {lang.text('downloadPDF')}
//             <FaFilePdf />
//           </Button>
//       }
//       <BaseDataTable
//         columns={studentDailyPresenceColumn}
//         data={items}
//         dataFallback={tableColumnSiswaFallback}
//         globalSearch={false}
//         initialState={{
//           sorting: [{ id: 'createdAt', desc: true }],
//         }}
//         searchPlaceholder={lang.text('search')}
//         isLoading={detail.query.isLoading}
//       />
//     </>
//   );
// }

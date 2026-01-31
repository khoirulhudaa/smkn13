interface Attendance {
  user: {
    image: string;
    name: string;
    nisn: string;
  };
  kelas:
  | {
    namaKelas: string;
    id: string;
  }
  | string;
  absensis?: {
    statusKehadiran: string;
  }[];
}

export const fetchClassesApi = async (): Promise<{ id: string; namaKelas: string }[]> => {
  const token = localStorage.getItem('token');
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/kelas`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  const data = await response.json();
  if (!response.ok) throw new Error('Failed to fetch classes');
  return data.data.map((item: any) => ({
    id: item.id,
    namaKelas: item.namaKelas,
  }));
};

export const fetchBiodataApi = async (
  selectedClass: string,
): Promise<Attendance[]> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No authentication token found');

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/get-biodata-siswa-new`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch biodata: ${response.statusText}`);
  }

  const data = await response.json();

  return (data.data || []).map((student: any) => ({
    user: {
      image: student.user?.image || '/defaultProfile.png',
      name: student.user?.name ?? 'Tidak Tersedia',
      nisn: student.user?.nisn ?? 'Tidak Tersedia',
    },
    kelas: student.kelas && typeof student.kelas === 'object' && student.kelas.namaKelas
      ? { namaKelas: student.kelas.namaKelas, id: student.kelas.id }
      : student.kelas || 'Tidak Tersedia',
    absensis: student.absensis || [],
  })).filter((student: Attendance) => {
    if (!selectedClass) return true;
    return typeof student.kelas === 'object'
      ? student.kelas.namaKelas === selectedClass
      : student.kelas === selectedClass;
  });
};

export const generateQrCodeApi = async (body: {
  idKelas: string;
  idMataPelajaran: string;
  jamMulai: string;
  jamSelesai: string;
}): Promise<string> => {
  const token = localStorage.getItem('token');
  const response = await fetch(
    // `https://backendtesting.xpresensi.com/api/v3/absensi_mata_pelajaran`,
    `https://dev.kiraproject.id/api/generate-qrcode-mapel`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  );
  const data = await response.json();
  if (!response.ok) throw new Error('Failed to generate QR Code');
  // console.log('response:', data)
  return data?.data;
};


export const absenManual = async (id: string | number, status?: string = 'hadir'): Promise<string> => {  
  const token = localStorage.getItem('token');
  const selectedCourse = JSON.parse(localStorage.getItem('selectedCourse') || '{}');
  if (!token) {
    throw new Error('Authentication token not found');
  }

  if (!selectedCourse.idMataPelajaran) {
    throw new Error('Mata pelajaran ID not found in selected course');
  }

  try {
    const response = await fetch(
      `https://dev.kiraproject.id/api/absen-manual-mapel/${id}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status, // Use the passed status
          mataPelajaranId: selectedCourse.idMataPelajaran,
        }),
      }
    );

    if (response.status === 204) {
      return '';
    }

    const text = await response.text();
    let data: any;

    try {
      data = JSON.parse(text);
    } catch {
      throw new Error('Invalid JSON response from server');
    }

    if (!response.ok) {
      throw new Error(data?.message || 'Failed to submit manual attendance');
    }

    // console.log('Response:', data);

    return data?.data || '';
  } catch (error) {
    throw new Error(
      `Manual attendance submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const editCalendarEvent = async (
  id: number,
  updatedData: Partial<{
    note: string;
    description: string;
    startTime: string;
    endTime: string;
  }>,
): Promise<void> => {
  const token = localStorage.getItem('token');

  const filteredData = Object.fromEntries(
    Object.entries(updatedData).filter(([_, value]) => value !== undefined),
  );

  if (Object.keys(filteredData).length === 0) {
    console.warn('Tidak ada data yang diperbarui.');
    return;
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/calendar/${id}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filteredData),
    },
  );

  if (!response.ok) {
    throw new Error(`Gagal mengedit event ID ${id}`);
  }
};

// utils.ts atau api.ts

export async function fetchAttendanceByQrID(limit: number | string, sekolahId: number | string) {
  const token = localStorage.getItem('token');
  const selectedClass = JSON.parse(localStorage.getItem('selectedClass') || '{}');
  // Get current date
  const today = new Date();
  const year = today.getFullYear(); 
  const month = String(today.getMonth() + 1).padStart(2, '0'); 
  const day = String(today.getDate()).padStart(2, '0'); 
  const formattedDate = `${year}-${month}-${day}`;
  // console.log('formattedDate', formattedDate)

  // console.log('limit:', limit)
  // console.log('sekolahId:', sekolahId)
  // const res = await fetch(`https://backendtesting.xpresensi.com/api/v3/absensi_mata_pelajaran_list_siswa/${idLocal}`, {
  const res = await fetch(`https://dev.kiraproject.id/api/admin-absensi-mapel?page=1&limit=${limit}&sekolahId=${sekolahId}&kelasId=${selectedClass.idKelas}&tanggal=${formattedDate}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error('Gagal mengambil data absensi dari server.');
  }

  const data = await res.json();
  // console.log('data absen terbaru:', data)

  // Pastikan bentuk data sesuai, bisa diubah sesuai respons aslinya
  return data?.data || []; // Jika API membungkus di dalam `data`
}

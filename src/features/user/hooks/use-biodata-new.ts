import { biodataService } from '@/core/services';
import { useAuth } from '@/features/auth';
import { useProfile } from '@/features/profile';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export const useBiodataNew = (id: number) => {
  const auth = useAuth();
  const profile = useProfile();
  const enabled = auth.isAuthenticated() && Boolean(profile.user?.id);

  const query = useQuery({
    enabled,
    queryKey: ['biodata-siswa-new', id],
    queryFn: () => biodataService.checkAttendance(id),
    staleTime: 300000, // Cache data selama 30 detik
    refetchInterval: 600000, // Refetch otomatis setiap 10 detik
    refetchOnMount: true, // Refetch saat komponen dimount
    refetchOnReconnect: true, // Refetch saat koneksi pulih
    refetchOnWindowFocus: true, // Refetch saat kembali ke halaman
  });

  const data = useMemo(() => query.data?.data || [], [query.data?.data]); // Memproses data
  const isLoading = query.isLoading || query.isFetching || query.isPending; // Status loading

  const memberOptions: never[] = []; // Placeholder jika ada data lain

  return {
    query,
    data,
    memberOptions,
    isLoading,
  };
};

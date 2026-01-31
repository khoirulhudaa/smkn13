// // src/lib/queryClient.ts
// import { QueryClient } from '@tanstack/react-query';

// export const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       staleTime: 0,           // Data langsung "stale" → refetch setiap mount/focus
//       gcTime: 0,              // (cacheTime diganti gcTime di v5) Hapus cache segera setelah inactive
//       retry: 1,
//       refetchOnWindowFocus: true,  // Refetch saat tab aktif lagi
//       refetchOnMount: true,
//     },
//   },
// });

// src/lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      gcTime: 0,
      refetchOnMount: true,
      refetchOnWindowFocus: false, // MATIKAN!
      retry: 1,
    },
  },
});
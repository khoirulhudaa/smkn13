export const SMAN25_THEME = {
  name: "SMAN 25 Jakarta - Light Soft",
  primary: "#60A5FA",      // Soft blue (biru lembut, mewakili identitas sekolah)
  primaryText: "#1E293B",  // Dark gray untuk teks utama (readable)
  accent: "#FEF08A",       // Soft yellow (hangat, energik untuk CTA/tombol)
  bg: "#F8FBFF",           // Very light blue-ish white (background utama, terasa segar)
  surface: "#FFFFFF",      // Pure white untuk card/section
  surfaceText: "#334155",  // Medium gray untuk teks di surface
  subtle: "#E2E8F0",        // Light gray untuk border/subtle elements
  pop: "#F87171",          // Soft red untuk error/warning (opsional, lembut)
} as const;

// === INFO SEKOLAH ===
export const SMAN25_INFO = {
  id: 88,
  type: "SMAN" as const,
  number: "25" as const,
  city: "Jakarta" as const,
  fullName: "SMAN 25 Jakarta" as const,
} as const;

// === GABUNGAN: SEMUA DALAM SATU OBJEK (paling praktis) ===
export const SMAN25_CONFIG = {
  ...SMAN25_INFO,
  theme: SMAN25_THEME,
} as const;

// Type untuk dipakai di komponen lain (optional tapi bagus)
export type Sman25Config = typeof SMAN25_CONFIG;
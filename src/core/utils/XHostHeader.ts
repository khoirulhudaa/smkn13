// const HOST_MAP: Readonly<Record<string, string>> = {
//   'smkn13jkt.kiraproject.id': 'smkn13jktnew.kiraproject.id',
//   'new.sman25-jkt.sch.id': 'sman25jktnew.kiraproject.id',
//   'new.sman65-jkt.sch.id': 'sman65jktnew.kiraproject.id',
//   'new.sman68-jkt.sch.id': 'sman68jktnew.kiraproject.id',
//   'new.sman78-jkt.sch.id': 'admin78@gmail.com',

//   'smkn13jakarta.sch.id': 'smkn13jktnew.kiraproject.id',
//   'sman25jakarta.sch.id': 'sman25jktnew.kiraproject.id',
//   'sman65jakarta.sch.id': 'sman65jktnew.kiraproject.id',
//   'sman68jakarta.sch.id': 'sman68jktnew.kiraproject.id',
//   'sman78jakarta.sch.id': 'admin78@gmail.com',
// } as const;

// // Cache per tab (akan otomatis reset saat pindah tab)
// let _cachedHostname: string | null = null;
// let _lastUrl = '';

// const getCurrentHostname = (): string => {
//   const currentUrl = window.location.href;

//   // Hanya recalculate jika URL berubah
//   if (_cachedHostname && currentUrl === _lastUrl) {
//     return _cachedHostname;
//   }

//   let hostname = '';
//   try {
//     const url = new URL(currentUrl);
//     hostname = url.hostname.toLowerCase();
//   } catch {
//     hostname = window.location.hostname.toLowerCase();
//   }

//   _cachedHostname = hostname;
//   _lastUrl = currentUrl;
//   return _cachedHostname;
// };

// export const getXHostHeader = (): string => {
//   const hostname = getCurrentHostname();
//   return HOST_MAP[hostname] ?? 'smkn13jktnew.kiraproject.id';
// };

// // Reset cache saat visibility change (pindah tab)
// document.addEventListener('visibilitychange', () => {
//   if (!document.hidden) {
//     _cachedHostname = null;
//     _lastUrl = '';
//   }
// });

// // Reset saat focus (pindah tab)
// window.addEventListener('focus', () => {
//   _cachedHostname = null;
//   _lastUrl = '';
// });


// Hanya mapping untuk domain-domain SMAN 25
const HOST_MAP: Readonly<Record<string, string>> = {
  // Domain baru (yang pakai "new.")
  'new.sman25-jkt.sch.id': 'sman25jktnew.kiraproject.id',

  // Domain lama/resmi
  'sman25jakarta.sch.id': 'sman25jktnew.kiraproject.id',
} as const;

// Cache sederhana (reset otomatis saat pindah tab atau reload)
let _cachedHostname: string | null = null;
let _lastUrl = '';

const getCurrentHostname = (): string => {
  const currentUrl = window.location.href;

  // Gunakan cache jika URL belum berubah
  if (_cachedHostname && currentUrl === _lastUrl) {
    return _cachedHostname;
  }

  let hostname = '';
  try {
    const url = new URL(currentUrl);
    hostname = url.hostname.toLowerCase();
  } catch {
    hostname = window.location.hostname.toLowerCase();
  }

  _cachedHostname = hostname;
  _lastUrl = currentUrl;
  return hostname;
};

export const getXHostHeader = (): string => {
  const hostname = getCurrentHostname();

  // Jika hostname cocok dengan salah satu domain SMAN 25, kembalikan targetnya
  // Kalau tidak cocok, tetap kembalikan default SMAN 25 (biar aman)
  return HOST_MAP[hostname] ?? 'sman25jktnew.kiraproject.id';
};

// Reset cache saat tab kembali aktif atau window difocus kembali
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    _cachedHostname = null;
    _lastUrl = '';
  }
});

window.addEventListener('focus', () => {
  _cachedHostname = null;
  _lastUrl = '';
});
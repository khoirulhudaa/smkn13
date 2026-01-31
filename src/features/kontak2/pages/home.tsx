import React, { useEffect, useState } from 'react';
import { FaBullhorn } from 'react-icons/fa';

/****************************
 * Admin — Informasi (Kontak only, with Sidebar)
 ****************************/

/*********** STORAGE HELPERS ***********/
const INFO_KEYS = { kontak: 'info:kontak' } as const;
const loadJSON = <T,>(k: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(k);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};
const saveJSON = (k: string, v: any) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
};

/*********** API CONFIG & FETCH HELPERS ***********/
const INFO_API_KEY = 'info:api' as const;
const loadApiCfg = (): { baseUrl: string; token: string } => {
  try {
    const s = localStorage.getItem(INFO_API_KEY);
    return s ? JSON.parse(s) : { baseUrl: '', token: '' };
  } catch {
    return { baseUrl: '', token: '' };
  }
};
const saveApiCfg = (v: { baseUrl: string; token: string }) => {
  try {
    localStorage.setItem(INFO_API_KEY, JSON.stringify(v));
  } catch {}
};
async function fetchJSON(url: string, init?: RequestInit) {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  const contentType = res.headers.get('content-type');
  if (!contentType?.includes('application/json')) throw new Error('Respons bukan JSON');
  return res.json();
}

/*********** REUSABLE UI ***********/
const inputBaseClasses = 'w-full rounded-xl border border-white/10 bg-neutral-800/80 px-3 py-2 text-sm text-white outline-none';

const Field = ({ label, hint, children }: { label?: string; hint?: string; children: React.ReactNode }) => (
  <label className="block">
    {label && <div className="mb-1 text-xs font-medium text-white/70">{label}</div>}
    {children}
    {hint && <div className="mt-1 text-[10px] text-white/50">{hint}</div>}
  </label>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className={[inputBaseClasses, props.className || ''].join(' ')} />
);

const TextArea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...props} className={[inputBaseClasses, props.className || ''].join(' ')} />
);

/*********** API PANEL (Tarik/Kirim) ***********/
const ApiPanel = ({ title = 'Koneksi API Info' }: { title?: string }) => {
  const [cfg, setCfg] = useState(loadApiCfg());
  const [status, setStatus] = useState<{ ok?: boolean; msg?: string }>({});
  useEffect(() => {
    saveApiCfg(cfg);
  }, [cfg]);

  const testConn = async () => {
    setStatus({ ok: undefined, msg: 'Menguji koneksi...' });
    try {
      if (!cfg.baseUrl) throw new Error('Base URL kosong');
      const url = cfg.baseUrl.replace(/\/$/, '') + '/health';
      const data = await fetchJSON(url, { headers: cfg.token ? { Authorization: `Bearer ${cfg.token}` } : undefined });
      setStatus({ ok: true, msg: `Terhubung (${data?.status || 'ok'})` });
    } catch (e: any) {
      setStatus({ ok: false, msg: e?.message || 'Gagal terhubung' });
    }
  };

  return (
    <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mb-2 text-sm font-semibold text-white/90">{title}</div>
      <div className="grid gap-2 md:grid-cols-3">
        <Field label="Base URL" hint="contoh: https://api.xschool.sch.id/v1">
          <Input
            value={cfg.baseUrl}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCfg((p) => ({ ...p, baseUrl: e.target.value }))}
            placeholder="https://..."
          />
        </Field>
        <Field label="Token (Bearer)" hint="Opsional bila API publik">
          <Input
            value={cfg.token}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCfg((p) => ({ ...p, token: e.target.value }))}
            placeholder="xxxx.yyyy.zzzz"
          />
        </Field>
        <div className="flex items-end">
          <button
            type="button"
            onClick={testConn}
            className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white"
          >
            Uji Koneksi
          </button>
        </div>
      </div>
      {typeof status.ok !== 'undefined' && (
        <div
          className={`mt-2 text-xs inline-flex items-center gap-2 rounded-lg px-2 py-1 ${
            status.ok ? 'bg-emerald-500/10 text-emerald-300' : 'bg-red-500/10 text-red-300'
          }`}
        >
          {status.msg}
        </div>
      )}
    </div>
  );
};

/*********** FORM: KONTAK ***********/
export function KontakMain() {
  type ContactState = {
    alamat: string;
    telp: string;
    email: string;
    mapsEmbed: string;
    socials: { platform: string; url: string }[];
  };

  const seed: ContactState = {
    alamat: 'Jl. Contoh No. 13, Jakarta Pusat',
    telp: '(021) 987-654',
    email: 'info@smkn13.sch.id',
    mapsEmbed: 'https://www.google.com/maps/embed?pb=...',
    socials: [
      { platform: 'Facebook', url: 'https://facebook.com/smkn13jakarta' },
      { platform: 'Instagram', url: 'https://instagram.com/smkn13jakarta' },
    ],
  };

  const [state, setState] = useState<ContactState>(() => {
    const raw = loadJSON<ContactState>(INFO_KEYS.kontak, seed);
    return {
      alamat: raw.alamat ?? seed.alamat,
      telp: raw.telp ?? seed.telp,
      email: raw.email ?? seed.email,
      mapsEmbed: raw.mapsEmbed ?? seed.mapsEmbed,
      socials: Array.isArray(raw.socials) ? raw.socials : seed.socials,
    };
  });

  type BusyState = { status: 'idle' | 'loading' | 'success' | 'error'; message: string };
  const [busy, setBusy] = useState<BusyState>({ status: 'idle', message: '' });

  useEffect(() => {
    saveJSON(INFO_KEYS.kontak, state);
  }, [state]);

  const cfg = loadApiCfg();

  const setAt = (patch: Partial<ContactState>) => setState((p) => ({ ...p, ...patch }));
  const addSocial = () => setAt({ socials: [...(state.socials || []), { platform: '', url: '' }] });
  const setSocialAt = (i: number, patch: Partial<{ platform: string; url: string }>) => {
    const newSocial = { ...state.socials[i], ...patch };
    if (newSocial.platform.trim() && newSocial.url.trim()) {
      setAt({ socials: state.socials.map((x, idx) => (idx === i ? newSocial : x)) });
    }
  };
  const delSocial = (i: number) => setAt({ socials: state.socials.filter((_, idx) => idx !== i) });

  const getApiUrl = (endpoint: string) => {
    if (!cfg.baseUrl) throw new Error('Base URL kosong');
    return cfg.baseUrl.replace(/\/$/, '') + endpoint;
  };

  const pullFromApi = async () => {
    setBusy({ status: 'loading', message: 'Mengambil dari API...' });
    try {
      const url = getApiUrl('/info/kontak');
      const payload = await fetchJSON(url, { headers: cfg.token ? { Authorization: `Bearer ${cfg.token}` } : undefined });
      if (!payload) throw new Error('Payload kosong');
      const next = {
        alamat: payload.alamat ?? state.alamat,
        telp: payload.telp ?? state.telp,
        email: payload.email ?? state.email,
        mapsEmbed: payload.mapsEmbed ?? state.mapsEmbed,
        socials: Array.isArray(payload.socials) ? payload.socials : state.socials,
      };
      setState(next);
      setBusy({ status: 'success', message: 'Berhasil tarik dari API' });
    } catch (e: any) {
      setBusy({ status: 'error', message: `Gagal tarik: ${e?.message || e}` });
    } finally {
      setTimeout(() => setBusy({ status: 'idle', message: '' }), 1500);
    }
  };

  const pushToApi = async () => {
    setBusy({ status: 'loading', message: 'Mengirim ke API...' });
    try {
      const url = getApiUrl('/info/kontak');
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(cfg.token ? { Authorization: `Bearer ${cfg.token}` } : {}) },
        body: JSON.stringify(state),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setBusy({ status: 'success', message: 'Berhasil kirim ke API' });
    } catch (e: any) {
      setBusy({ status: 'error', message: `Gagal kirim: ${e?.message || e}` });
    } finally {
      setTimeout(() => setBusy({ status: 'idle', message: '' }), 1500);
    }
  };

  return (
    <div className="flex min-h-screen bg-neutral-900 text-white">
      {/* Sidebar khusus Kontak */}
      <aside className="w-56 border-r border-white/10 bg-white/5 p-4 space-y-2">
        <div className="font-semibold text-white/80 mb-2 flex items-center gap-2">
          <FaBullhorn size={18} />
          Menu
        </div>
        <button className="w-full text-left rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300 flex items-center gap-2">
          <FaBullhorn size={16} />
          Kontak
        </button>
      </aside>
      <main className="flex-1 p-6">
        <h1 className="text-xl font-semibold mb-4">Admin — Informasi: Kontak</h1>
        <ApiPanel title="Koneksi API Info — Kontak" />
        <form className="space-y-6 text-white" onSubmit={(e) => e.preventDefault()}>
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-semibold">Kontak</div>
            <div className="flex items-center gap-2 text-xs">
              {busy.status !== 'idle' && (
                <span
                  className={`text-xs ${
                    busy.status === 'error' ? 'text-red-300' : busy.status === 'success' ? 'text-emerald-300' : 'text-white/70'
                  }`}
                >
                  {busy.message}
                </span>
              )}
              <button
                type="button"
                onClick={pullFromApi}
                disabled={busy.status === 'loading'}
                className="rounded-lg border border-white/10 bg-white/10 px-2 py-1 disabled:opacity-50"
              >
                Tarik API
              </button>
              <button
                type="button"
                onClick={pushToApi}
                disabled={busy.status === 'loading'}
                className="rounded-lg border border-white/10 bg-white/10 px-2 py-1 disabled:opacity-50"
              >
                Kirim API
              </button>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 grid gap-2 md:grid-cols-2">
            <Field label="Alamat">
              <TextArea rows={2} value={state.alamat} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAt({ alamat: e.target.value })} />
            </Field>
            <Field label="Telepon">
              <Input value={state.telp} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAt({ telp: e.target.value })} />
            </Field>
            <Field label="Email">
              <Input type="email" value={state.email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAt({ email: e.target.value })} />
            </Field>
            <Field label="Google Maps Embed URL">
              <Input
                value={state.mapsEmbed}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAt({ mapsEmbed: e.target.value })}
                placeholder="https://www.google.com/maps/embed?..."
              />
            </Field>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-sm font-semibold">Media Sosial</div>
              <button
                type="button"
                onClick={addSocial}
                className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300"
              >
                + Tambah Link
              </button>
            </div>
            <div className="space-y-2">
              {(state.socials || []).map((s, i) => (
                <div key={i} className="grid gap-2 md:grid-cols-3 items-center">
                  <Field label="Platform">
                    <Input
                      value={s.platform}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSocialAt(i, { platform: e.target.value })}
                      placeholder="Instagram / Facebook / X"
                    />
                  </Field>
                  <Field label="URL">
                    <Input
                      value={s.url}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSocialAt(i, { url: e.target.value })}
                      placeholder="https://..."
                    />
                  </Field>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => delSocial(i)}
                      className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1 text-xs text-red-300"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
              {(!state.socials || state.socials.length === 0) && (
                <div className="text-[11px] text-white/60">Belum ada tautan sosial. Tambahkan minimal satu.</div>
              )}
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
import { APP_CONFIG } from '@/core/configs';
import { Button, Input, lang, VokadashHead } from '@/core/libs';
import { InputSecure, useAlert } from '@/features/_global';
import { QRCodeSVG } from 'qrcode.react';
import { FormEventHandler, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../hooks';
import { saveToken } from '../utils';

export const LoginPage = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const alert = useAlert();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'email' | 'barcode'>('email');
  const [barcodeToken, setBarcodeToken] = useState<string | null>(null);
  const [isLoadingBarcode, setIsLoadingBarcode] = useState(false);
  const [scannedEmail, setScannedEmail] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [hasLoginWithBarcode, setHasLoginWithBarcode] = useState(false);

  // Fetch barcode token
  const fetchBarcodeToken = async () => {
    if (barcodeToken) return;
    try {
      setIsLoadingBarcode(true);
      const response = await fetch('https://dev.kiraproject.id/generate-barcode', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data?.barcodeToken) {
        setBarcodeToken(data.barcodeToken);
        console.log('barcode', data.barcodeToken);
        socket?.emit('register', data.barcodeToken);
      } else {
        throw new Error('Failed to fetch barcode token');
      }
    } catch (err: any) {
      alert.error(err?.message || 'Failed to fetch barcode token');
    } finally {
      setIsLoadingBarcode(false);
    }
  };

  // Initialize socket connection
  useEffect(() => {
    const socketConnection = io('https://dev.kiraproject.id');

    socketConnection.on('connect', () => {
      setSocket(socketConnection);
      setIsSocketConnected(true);
    });

    socketConnection.on('disconnect', () => {
      setIsSocketConnected(false);
    });

    socketConnection.on('email-scanned', (email: string) => {
      setScannedEmail(email);
      console.log('Email scanned:', email);
    });

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  // Fetch QR code when socket is connected and barcode tab is active
  useEffect(() => {
    if (socket && activeTab === 'barcode') {
      fetchBarcodeToken();
    }
  }, [socket, activeTab]);

  // Handle login with barcode
  useEffect(() => {
    if (scannedEmail && !hasLoginWithBarcode) {
      setHasLoginWithBarcode(true);
      auth.loginWithBarcode(scannedEmail)
        .then((res) => {
          const token = res?.data?.token;
          const role = res?.data?.role;

          if (role === 'siswa' || role === 'Siswa') {
            alert.error('Akses ditolak');
            setHasLoginWithBarcode(false);
            localStorage.removeItem('token');
            navigate('/auth/login', { replace: true });
            return;
          }

          console.log('barcode', res?.data);

          if (token) {
            console.log('token biasa:', token);
            saveToken(token);
            localStorage.setItem('token', token);
          }

          alert.success('Login berhasil dengan QR!');
          navigate('/dashboard', { replace: true });
        })
        .catch((err) => {
          alert.error(err?.message || 'Login gagal');
          setHasLoginWithBarcode(false);
        });
    }
  }, [scannedEmail, auth, alert, hasLoginWithBarcode, navigate]);

  // Handle tab change
  const handleTabChange = (tab: 'email' | 'barcode') => {
    setActiveTab(tab);
  };

  // Handle form submission
  const submit: FormEventHandler = async (e) => {
    e?.preventDefault?.();
    try {
      if (activeTab === 'email') {
        const res = await auth.login({ email, password });

        if (Number(res?.data?.isActive) !== 2) {
          throw new Error(lang.text('needActiovation'));
        }

        const token = res?.data?.token;
        if (token) {
          saveToken(token);
          localStorage.setItem('token', token);
        } else {
          console.log('Token tidak ditemukan dalam response');
        }

        alert.success('Selamat datang kembali');
        navigate('/dashboard', { replace: true });
      }
    } catch (err: any) {
      alert.error(err?.message || lang.text('errSystem'));
    }
  };

  return (
    <form onSubmit={submit} className="relative w-full h-screen flex items-center justify-center bg-gradient-to-br from-teal-900 to-blue-900">
      <VokadashHead>
        <title>{`${lang.text('login')} | ${APP_CONFIG.appName}`}</title>
      </VokadashHead>
      <div className="relative w-[40vw] p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl transition-all duration-500 hover:shadow-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="font-bold text-3xl text-white tracking-tight">XPRESENSI</h2>
          <h3 className="text-lg font-medium text-gray-200 mt-2">
            Welcome back, teacher! 👋
          </h3>
          <p className="text-sm text-gray-400">
            Log in to monitor student activities
          </p>
        </div>

        {/* Tabs */}
        <div className="flex w-full mb-6 bg-white/5 rounded-lg p-1">
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-medium transition-all duration-300 rounded-md ${
              activeTab === 'email'
                ? 'bg-white text-teal-900 shadow-sm'
                : 'text-gray-300 hover:text-white'
            }`}
            onClick={() => handleTabChange('email')}
          >
            Email & Password
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-medium transition-all duration-300 rounded-md ${
              activeTab === 'barcode'
                ? 'bg-white text-teal-900 shadow-sm'
                : 'text-gray-300 hover:text-white'
            }`}
            onClick={() => handleTabChange('barcode')}
          >
            Scan QR Code
          </button>
        </div>

        {/* Form Content */}
        <div className="w-full">
          {activeTab === 'email' ? (
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-200 mb-1"
                >
                  Email
                </label>
                <Input
                  id="email"
                  className="w-full h-12 px-4 text-white placeholder-gray-400 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                  type="email"
                  placeholder={lang.text('inputEmail')}
                  required
                  value={email}
                  onChange={({ target: { value } }) => setEmail(value)}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-200 mb-1"
                >
                  Password
                </label>
                <InputSecure
                  id="password"
                  className="w-full h-12 px-4 text-white placeholder-gray-400 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                  required
                  value={password}
                  onChange={({ target: { value } }) => setPassword(value)}
                  placeholder={lang.text('inputPassword')}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full">
              {isLoadingBarcode ? (
                <p className="text-gray-300">Generating QR Code...</p>
              ) : barcodeToken ? (
                <>
                  <div className="border-4 border-white/30 p-4 rounded-xl bg-white/10 mb-4 shadow-lg transition-transform duration-300 hover:scale-105">
                    <QRCodeSVG value={barcodeToken} size={180} bgColor="transparent" fgColor="#ffffff" />
                  </div>
                  <p className="text-sm text-gray-300 text-center max-w-xs">
                    Open the Xpresensi app as a teacher/admin, then go to{" "}
                    <span className="font-semibold text-white">
                      Profile &gt; Link Device
                    </span>{" "}
                    to scan the QR code.
                  </p>
                  <p className="text-sm mt-3 text-gray-400">
                    Status:{" "}
                    <span
                      className={
                        isSocketConnected ? 'text-green-400' : 'text-red-400'
                      }
                    >
                      {isSocketConnected
                        ? '🟢 Connected'
                        : '🛑 Disconnected'}
                    </span>
                  </p>
                </>
              ) : (
                <p className="text-red-400">Failed to load QR Code</p>
              )}
            </div>
          )}
        </div>

        {/* Submit Button */}
        {activeTab === 'email' && (
          <Button
            type="submit"
            disabled={auth.isLoading}
            className="w-full mt-8 h-12 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-teal-900 transition-all duration-300"
          >
            {auth.isLoading ? lang.text('pleaseWait') : lang.text('login')}
            <span className="ml-2">→</span>
          </Button>
        )}
      </div>
    </form>
  );
};
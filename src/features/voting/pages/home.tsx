import { SMAN25_CONFIG } from "@/core/theme";
import { FooterComp } from "@/features/_global/components/footer";
import NavbarComp from "@/features/_global/components/navbar";
import { getSchoolId } from "@/features/_global/hooks/getSchoolId";
import confetti from 'canvas-confetti';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, Send, Ticket, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

/****************************
 * VOTING PAGE COMPONENT
 ****************************/
const VotingOsisPage = () => {
  const { theme, fullName: schoolName } = SMAN25_CONFIG;
  const schoolId = getSchoolId(); // Sesuaikan dengan ID sekolah

  // States
  const [step, setStep] = useState<"auth" | "voting" | "success" | "finished">("auth");
  const [voteCode, setVoteCode] = useState("");
  const [candidates, setCandidates] = useState<any[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState<any | null>(null); // Untuk menyimpan data kandidat yang sedang dilihat misinya
  const [winnerData, setWinnerData] = useState<any>(null);
  const [votingPercentage, setVotingPercentage] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [results, setResults] = useState<{ name: string; votes: number }[]>([]);

  // Update useEffect checkVotingStatus → tambah fetch results saat finished
  useEffect(() => {
    const checkVotingStatus = async () => {
      try {
        const statusRes = await fetch(
          `https://be-school.kiraproject.id/voting/voting-status?schoolId=${schoolId}`
        );

        if (!statusRes.ok) throw new Error("Gagal memeriksa status");

        const statusResult = await statusRes.json();

        if (statusResult.success) {
          const { isVotingFinished, winner, percentageUsed } = statusResult.data;

          if (isVotingFinished) {
            setWinnerData(winner);
            setVotingPercentage(percentageUsed);
            setStep("finished");

            // Fetch hasil lengkap untuk chart
            const resultsRes = await fetch(
              `https://be-school.kiraproject.id/voting/suara?schoolId=${schoolId}`
            );
            const resultsData = await resultsRes.json();

            if (resultsData.success) {
              setResults(resultsData.data);
            }
          } else {
            setStep("auth");
          }
        }
      } catch (err) {
        console.error(err);
        setError("Gagal memuat status voting");
      }
    };

    checkVotingStatus();
  }, [schoolId]);

  // 1. Tambahkan useRef di bagian atas komponen
  const audioRef: any = useRef(null);

  // Cek status voting saat halaman pertama kali dimuat
  useEffect(() => {
    const checkVotingStatus = async () => {
      try {
        const statusRes = await fetch(
          `https://be-school.kiraproject.id/voting/voting-status?schoolId=${schoolId}`
        );

        if (!statusRes.ok) throw new Error("Gagal memeriksa status voting");

        const statusResult = await statusRes.json();

        if (statusResult.success) {
          const { isVotingFinished, winner, percentageUsed } = statusResult.data;

          if (isVotingFinished) {
            setWinnerData(winner);
            setVotingPercentage(percentageUsed);
            setStep("finished");
          } else {
            setStep("auth"); // Voting masih berlangsung → tampilkan form kode
          }
        } else {
          setError("Gagal memeriksa status voting. Silakan refresh halaman.");
          setStep("auth"); // fallback
        }
      } catch (err) {
        console.error("Error check status:", err);
        setError("Tidak dapat terhubung ke server. Coba lagi nanti.");
        setStep("auth"); // tetap tampilkan form sebagai fallback
      }
    };

    checkVotingStatus();
  }, [schoolId]); // hanya sekali saat mount

  useEffect(() => {
    let interval: any;

    if (step === "finished") {
      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      // Jalankan interval tanpa batas waktu
      interval = setInterval(function() {
        const particleCount = randomInRange(30, 60);
        
        // Tembakan dari Kiri Bawah
        confetti({
          particleCount,
          startVelocity: 35,
          spread: 60,
          origin: { x: 0, y: 1 },
          angle: 60,
          colors: ['#2563eb', '#ffffff', '#fbbf24']
        });
        
        // Tembakan dari Kanan Bawah
        confetti({
          particleCount,
          startVelocity: 35,
          spread: 60,
          origin: { x: 1, y: 1 },
          angle: 120,
          colors: ['#2563eb', '#ffffff', '#fbbf24']
        });
      }, 500); // Jedah 0.5 detik antar tembakan agar tidak terlalu berat bagi CPU
    }

    // Penting: Bersihkan interval jika komponen unmount atau step berubah
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step]);

  useEffect(() => {
    if (step === "finished" && audioRef.current) {
      audioRef.current.volume = 0.5; // Set volume 50%
      audioRef.current.play().catch((error: any) => {
        // Browser sering memblokir autoplay jika pengguna belum berinteraksi dengan halaman
        console.log("Autoplay dicegah oleh browser, musik akan jalan setelah interaksi.");
      });
    }
  }, [step]);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Verifikasi kode (hanya dipanggil jika voting belum selesai)
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (voteCode.length !== 4) return setError("Kode harus tepat 4 karakter");

    setLoading(true);
    setError("");

    try {
      const verifyRes = await fetch(`https://be-school.kiraproject.id/voting/verifikasi-kode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: voteCode.toUpperCase(), schoolId }),
      });

      const verifyResult = await verifyRes.json();

      if (!verifyResult.success) {
        setError(verifyResult.message || "Kode tidak valid atau sudah terpakai.");
        return;
      }

      // Kode valid → ambil kandidat
      const candidateRes = await fetch(
        `https://be-school.kiraproject.id/voting/kandidat?schoolId=${schoolId}`
      );

      const candidateResult = await candidateRes.json();

      if (candidateResult.success && candidateResult.data?.length > 0) {
        setCandidates(candidateResult.data);
        setStep("voting");
      } else {
        setError("Gagal memuat daftar kandidat atau belum ada kandidat.");
      }
    } catch (err) {
      setError("Terjadi kesalahan koneksi. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Submit Vote
  const handleSubmitVote = async () => {
    if (!selectedCandidate) return alert("Pilih satu kandidat!");

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`https://be-school.kiraproject.id/voting/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: voteCode.toUpperCase(),
          candidateId: selectedCandidate,
          schoolId: schoolId,
        }),
      });

      const result = await res.json();

      if (result.success) {
        setStep("success");
      } else {
        setError(result.message || "Gagal mengirim suara. Kode mungkin salah.");
      }
    } catch (err) {
      setError("Gagal mengirim suara. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: theme.bg }}>
      {
        step !== "voting" && step !== "success" && (
          <NavbarComp theme={theme} />
        )
      }

      <main className="flex-grow pt-2 pb-14 px-4">
        <div className="max-w-8xl md:px-4 mx-auto">
          
          {/* STEP 1: AUTHENTICATION */}
          <AnimatePresence mode="wait">
            {step === "auth" && (
              <motion.div
                key="auth"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-md mx-auto mt-10 px-4 py-10 md:px-8 md:py-8 rounded-3xl border border-blue-500/50 shadow-xl bg-white text-center"
              >
                {/* Animated Icon Section */}
                <div className="relative w-24 md:left-1.5 h-24 mx-auto mb-3">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, delay: 0.2 }}
                    className="absolute inset-0 bg-blue-500 rounded-full opacity-10 animate-ping"
                  />
                  <motion.div 
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 10, delay: 0.3 }}
                    className="relative w-20 h-20 bg-gradient-to-tr from-blue-700 to-blue-600 text-white rounded-[1rem] flex items-center justify-center shadow-xl shadow-blue-200"
                  >
                    <Ticket size={48} strokeWidth={2.5} />
                  </motion.div>
                </div>
                <h2 className="text-2xl text-black font-bold mb-2">E-Voting OSIS</h2>
                <p className="text-gray-500 mb-8 text-sm">Masukkan 4-digit kode unik yang diberikan panitia untuk mendapat hak suara.</p>

                <form onSubmit={handleVerifyCode} className="space-y-3">
                  <input
                    type="text"
                    maxLength={4}
                    value={voteCode}
                    onChange={(e) => setVoteCode(e.target.value.toUpperCase())}
                    placeholder="XXXX"
                    className="w-full text-black text-center placeholder:text-gray-300 text-3xl tracking-[1rem] font-bold py-4 border border-black/10 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none uppercase"
                  />
                  {error ? <p className="text-red-500 text-xs font-medium">{error}</p> : <p className="opacity-0 text-xs">p</p>}
                  <button
                    disabled={loading || voteCode.length < 4}
                    className="w-full py-4 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition disabled:bg-gray-300 flex items-center justify-center gap-2"
                  >
                    {loading ? "Mengecek..." : "Masuk ke Ruang Suara"}
                  </button>
                </form>
              </motion.div>
          )}

          {step === "voting" && (
              <motion.div
                key="voting"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-10 pb-32 mt-8"
              >
                {/* Candidates Grid */}
                <div className="flex flex-wrap justify-center gap-8 mt-8">
                  {candidates.map((can, index) => (
                    <motion.div
                      key={can.id}
                      className={`w-full sm:w-[calc(50%-2rem)] lg:w-[calc(25%-2rem)] max-w-[320px]relative group cursor-pointer rounded-[1rem] border-2 transition-all duration-500 overflow-hidden ${
                      selectedCandidate === can.id 
                        ? "border-blue-600 bg-white shadow-2xl shadow-blue-100" 
                        : "border-gray-200 bg-white backdrop-blur-sm hover:border-blue-200 shadow-sm"
                    }`}
                      whileHover={{ y: -8 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => setSelectedCandidate(can.id)}
                    >
                      {/* Checkbox Status */}
                      <div className="absolute top-4 right-4">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedCandidate === can.id ? "bg-blue-600 border-blue-600 scale-110" : "border-gray-200 bg-white"
                        }`}>
                          {selectedCandidate === can.id && <CheckCircle2 className="text-white w-5 h-5" />}
                        </div>
                     </div>
 
                      <div className="p-4 pt-4">
                        {/* Foto Kandidat - Overlapping Style */}
                        <div className="flex justify-center mb-8 h-32">
                          <div className="relative flex items-center">
                            <div className="relative z-10">
                              <img 
                                src={can.chairmanImageUrl || '/default.png'} 
                                className="w-28 h-28 object-cover rounded-[1rem] border-4 border-white shadow-xl rotate-[-5deg] group-hover:rotate-0 transition-transform duration-500" 
                                alt="Ketua" 
                              />
                              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-black text-[8px] text-white px-2 py-1 rounded-md font-bold uppercase tracking-tighter">Ketua</span>
                            </div>
                            <div className="relative -ml-8 mt-6">
                              <img 
                                src={can.viceChairmanImageUrl || '/default.png'} 
                                className="w-24 h-24 object-cover rounded-[1rem] border-4 border-white shadow-xl rotate-[10deg] group-hover:rotate-0 transition-transform duration-500" 
                                alt="Wakil" 
                              />
                              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gray-500 text-[8px] text-white px-2 py-1 rounded-md font-bold uppercase tracking-tighter">Wakil</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-center space-y-1 mb-6">
                          <h3 className="text-xl font-black text-gray-900 leading-tight">
                            {can.chairmanName} <br/> & {can.viceChairmanName}
                          </h3>
                          <p className="text-blue-600 font-bold text-xs uppercase tracking-widest">Paslon #{index + 1}</p>
                        </div>

                        {/* Visi Misi Preview */}
                        <div className={`p-0 rounded-[1rem] flex flex-col justify-between transition-colors duration-500 ${
                          selectedCandidate === can.id ? "bg-blue-50/50" : "bg-gray-50/80"
                        }`}>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="h-[2px] w-5 bg-blue-600" />
                          <p className="text-[14px] font-black text-blue-600 uppercase tracking-widest">Visi & Unggulan</p>
                        </div>
                        <p className="text-xs text-gray-600 italic mb-4 leading-relaxed line-clamp-2">"{can.vision}"</p>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowModal(can);
                            }}
                            className="w-full mt-auto py-3 bg-white border border-blue-200 text-blue-600 rounded-xl text-[11px] font-black uppercase tracking-wider hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm"
                          >
                            <Info size={14} /> Lihat Visi Misi Lengkap
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* MODAL DETAIL VISI MISI */}
                <AnimatePresence>
                  {showModal && (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 top-[-40px] z-[999999999999] flex items-center justify-center bg-black/60 backdrop-blur-md"
                      onClick={() => setShowModal(null)}
                    >
                      <motion.div 
                        initial={{ scale: 0.9, y: 30 }} 
                        animate={{ scale: 1, y: 0 }} 
                        exit={{ scale: 0.9, y: 30 }}
                        className="bg-white h-[90vh] w-full max-w-2xl rounded-[1.5rem] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="p-8">
                          <div className="flex justify-between items-start mb-8">
                            <div>
                              <p className="text-blue-600 font-black text-[10px] uppercase tracking-widest mb-1">Detail Program Kerja</p>
                              <h3 className="text-3xl font-black text-gray-900 leading-none">Paslon #{showModal.id}</h3>
                            </div>
                            <button onClick={() => setShowModal(null)} className="p-2 bg-red-600 hover:bg-red-300 hover:text-red-900 rounded-full transition-all">
                              <X size={20} />
                            </button>
                          </div>

                          <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                            <section>
                              <p className="text-[12px] font-black text-gray-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <p className="w-2 h-2 rounded-full bg-blue-600" /> Visi Utama
                              </p>
                              <p className="text-lg text-gray-800 font-medium italic leading-relaxed border-l-4 border-blue-50 pl-4">
                                "{showModal.vision}"
                              </p>
                            </section>

                            <section>
                              <p className="text-[12px] font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <p className="w-2 h-2 rounded-full bg-blue-600" /> Misi & Strategi
                              </p>
                              <div className="grid gap-3">
                                {showModal.mission?.map((m: string, i: number) => (
                                  <motion.div 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    key={i} 
                                    className="flex items-start gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:border-blue-200 transition-colors"
                                  >
                                    <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-lg shadow-blue-100">
                                      {i + 1}
                                    </span>
                                    <p className="text-sm text-gray-600 leading-relaxed font-medium">{m}</p>
                                  </motion.div>
                                ))}
                              </div>
                            </section>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Premium Floating Action Bar */}
                <motion.div 
                  initial={{ y: 100 }}
                  animate={{ y: 0 }}
                  className="fixed bottom-8 left-4 right-4 z-[90]"
                >
                  <div className="w-full md:w-max mx-auto bg-white/30 backdrop-blur-md border border-white/10 p-3 rounded-[1rem] shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex items-center justify-between gap-4">
                    <div className="pl-6 hidden md:flex items-center gap-4 mr-4">
                      <p className="text-black text-sm uppercase font-black tracking-widest">Kode Verifikasi</p>
                      <p className="text-black border border-black/30 rounded-md px-3 py-1 bg-white/60 backdrop-blur-xl font-mono text-sm font-bold">{voteCode}</p>
                    </div>

                    <div className="w-[1px] md:flex hidden h-[36px] mr-4 bg-black/40"></div>
                    
                    <div className="w-full md:w-max flex items-center gap-3">
                      <button
                        onClick={() => window.location.reload()}
                        className="flex-1 sm:flex-none px-4 py-3 hover:text-red-500 hover:border-red-600 disabled:bg-white/10 disabled:text-gray-500 border border-blue-500 text-blue-600 rounded-[1rem] font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 group"
                      >
                        Kembali
                      </button>
                      <button
                        onClick={handleSubmitVote}
                        disabled={loading || !selectedCandidate}
                        className="flex-1 sm:flex-none px-10 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-white/10 disabled:text-gray-500 border border-blue-300 text-white rounded-[1rem] font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 group"
                      >
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Mengirim...</span>
                          </div>
                        ) : (
                          <>
                            <div className="md:flex hidden">
                              Kirim Suara
                              <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </div>
                            <div className="md:hidden flex gap-2.5">
                              Pilih
                              <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </div>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
          )}

          {step === "success" && (
            <div className="overflow-hidden w-screen h-[100vh] top-0 left-0 absolute flex justify-center items-center">
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative max-w-[450px] group"
              >
                {/* Background Glow Effect */}
                <div className="absolute inset-0 bg-green-500/10 blur-[100px] rounded-full -z-10" />

                <div className="bg-white/80 backdrop-blur-2xl border border-blue-500/50 rounded-[1rem] p-10 text-center shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
                  
                  {/* Animated Icon Section */}
                  <div className="relative w-24 h-24 mx-auto mb-8">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 12, delay: 0.2 }}
                      className="absolute inset-0 bg-blue-500 rounded-full opacity-10 animate-ping"
                    />
                    <motion.div 
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", damping: 10, delay: 0.3 }}
                      className="relative w-24 h-24 bg-gradient-to-tr from-blue-500 to-blue-400 text-white rounded-[1rem] flex items-center justify-center shadow-xl shadow-blue-200"
                    >
                      <CheckCircle2 size={48} strokeWidth={2.5} />
                    </motion.div>
                  </div>

                  {/* Text Section */}
                  <div className="space-y-4 mb-10">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <span className="px-4 py-1.5 rounded-full bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-[0.2em]">
                        Voting tercatat
                      </span>
                      <h2 className="text-4xl font-black text-gray-900 mt-4 tracking-tight">
                        Berhasil!
                      </h2>
                    </motion.div>
                    
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-gray-500 text-sm leading-relaxed px-4"
                    >
                      Terima kasih telah berpartisipasi. Suara Anda telah tercatat dalam sistem bilik suara digital.
                    </motion.p>
                  </div>

                  {/* Action Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-3"
                  >
                    <button
                      onClick={() => window.location.href = "/voting-osis"}
                      className="w-full py-4 bg-blue-500 text-white rounded-lg font-black text-xs uppercase tracking-[0.15em] hover:bg-blue-600 hover:shadow-xl hover:shadow-gray-200 transition-all active:scale-[0.98]"
                    >
                      Selesai & Keluar
                    </button>
                    
                    <p className="text-[10px] text-gray-400 font-medium">
                      SMAN 25 Jakarta
                    </p>
                  </motion.div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-6 -right-6 w-12 h-12 bg-yellow-400/10 rounded-full blur-xl" />
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl" />
              </motion.div>
            </div>
          )}

        {step === "finished" && (
          <motion.div
            key="finished"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-7xl mx-auto mt-8 md:mt-12 pb-0 md:pb-4"
          >
            {/* Header Ringkas */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-4">
              <div className="mr-4">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Hasil Pemilihan</h2>
                <p className="text-gray-500 text-sm font-medium mt-1 w-max">Laporan perolehan suara real-time OSIS</p>
              </div>
              <div className="gap-3 w-full grid grid-cols-2">
                <div className="bg-blue-50 px-4 py-2 rounded-2xl border border-blue-200">
                  <p className="text-[10px] uppercase tracking-wider text-blue-600 font-bold">Total Suara</p>
                  <p className="text-xl font-black text-blue-900">{results.reduce((sum, c) => sum + c.votes, 0)}</p>
                </div>
                <div className="bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-200">
                  <p className="text-[10px] uppercase tracking-wider text-emerald-600 font-bold">Partisipasi</p>
                  <p className="text-xl font-black text-emerald-900">{votingPercentage}%</p>
                </div>
              </div>
            </div>

            {/* Layout Utama: Flex/Grid Side-by-Side */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              
              {/* Kolom Kiri: Kartu Pemenang (Span 7) */}
              {winnerData && (
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="lg:col-span-7 bg-white min-h-[450px] rounded-[1.5rem] border border-gray-200 shadow-2xl shadow-blue-100/50 overflow-hidden relative"
                >
                  <div className="p-3 pt-[13px] md:p-4">
                    <div className="gap-10">
                      {/* Foto Grouping */}
                      <div className="relative grid grid-cols-2 gap-4 md:gap-6 w-full md:w-auto">
                        {/* Foto Ketua */}
                        <div className="w-full group relative transition-all duration-300">
                          <div className="relative z-[2]">
                            <img
                              src={winnerData.chairmanImageUrl || "/default.png"}
                              className="w-full h-44 md:w-full md:h-60 object-cover rounded-3xl border-4 border-white shadow-lg group-hover:shadow-2xl transition-shadow"
                              alt="Ketua"
                            />
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] md:text-xs font-black px-4 py-1.5 rounded-xl shadow-lg border-2 border-white uppercase tracking-wider">
                              Ketua
                            </div>
                          </div>
                        </div>

                        {/* Divider halus jika diperlukan, atau langsung saja */}
                        
                        {/* Foto Wakil */}
                        <div className="w-full group relative transition-all duration-300">
                          <div className="relative z-[2]">
                            <img
                              src={winnerData.viceChairmanImageUrl || "/default.png"}
                              className="w-full h-44 md:w-full md:h-60 object-cover rounded-3xl border-4 border-white shadow-lg group-hover:shadow-2xl transition-shadow"
                              alt="Wakil"
                            />
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] md:text-xs font-black px-4 py-1.5 rounded-xl shadow-lg border-2 border-white uppercase tracking-wider">
                              Wakil
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Teks Info */}
                      <div className="flex-1 text-center mt-6 md:text-left">
                        <p className="text-blue-600 font-bold text-sm uppercase tracking-[0.2em] mb-2">Pemenang Terpilih</p>
                        <h3 className="text-3xl md:text-2xl font-black text-gray-900 leading-tight mb-4">
                          {winnerData.chairmanName} <span className="text-gray-300 font-light">&</span> {winnerData.viceChairmanName}
                        </h3>
                      </div>

                      <p className="text-gray-500 mt-auto">E-voting by SMAN 25 Jakarta</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Kolom Kanan: Chart & Stats (Span 5) */}
              <div className="lg:col-span-5 space-y-6">
                <motion.div
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white min-h-[450px] rounded-[1.5rem] p-8 border border-gray-200 shadow-xl shadow-gray-100/50"
                >
                  <div className="h-64">
                    <Doughnut
                      data={{
                        labels: results.map(c => c.name),
                        datasets: [{
                          data: results.map(c => c.votes),
                          backgroundColor: ['#2563eb', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6'],
                          borderWidth: 8,
                          borderColor: '#ffffff',
                          borderRadius: 10, // Membuat ujung chart tidak tajam (rounded)
                          hoverOffset: 15
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: '70%', // Membuat lubang di tengah lebih besar agar lebih modern
                        plugins: {
                          legend: { display: false }
                        }
                      }}
                    />
                  </div>

                  {/* List Progress Bar Sederhana */}
                  <div className="mt-8 space-y-4">
                    {results.slice(0, 3).map((res, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-gray-600">
                          <span>{res.name}</span>
                          <span>{((res.votes / results.reduce((s, c) => s + c.votes, 0)) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full" 
                            style={{ width: `${(res.votes / results.reduce((s, c) => s + c.votes, 0)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

            </div>
          </motion.div>
        )}
          </AnimatePresence>

          {error && step === "voting" && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl text-center text-sm font-medium">
              {error}
            </div>
          )}
        </div>
      </main>
      {
          step !== "voting" && step !== "success" && (
            <FooterComp theme={theme} />
          )
        }
    </div>
  );
};

export default VotingOsisPage;
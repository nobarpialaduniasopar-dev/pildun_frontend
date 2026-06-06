"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";
import { Clock, CheckCircle, Copy, Download, ExternalLink } from "lucide-react";

type TransactionDetail = {
  id: string;
  total_amount: number;
  payment_method: string;
  payment_url_or_va: string;
  locked_until: string;
  payment_status: string;
  match_schedule: {
    team_a: string;
    team_b: string;
  };
};

export default function PaymentPage() {
  const { orderId } = useParams();
  const router = useRouter();
  const [trx, setTrx] = useState<TransactionDetail | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [loading, setLoading] = useState(true);
  
  // State untuk tab navigasi instruksi VA
  const [vaTab, setVaTab] = useState<'mbanking' | 'atm' | 'ibanking'>('mbanking');

  useEffect(() => {
    const fetchPaymentDetail = async () => {
      try {
        const res = await api.get(`/checkout/detail/${orderId}`);
        setTrx(res.data);
      } catch (err) {
        console.error("Gagal memuat detail pembayaran", err);
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchPaymentDetail();
  }, [orderId]);

  useEffect(() => {
    if (!trx || trx.payment_status !== "PENDING") return;

    const interval = setInterval(() => {
      const distance = new Date(trx.locked_until).getTime() - new Date().getTime();
      
      if (distance < 0) {
        setTimeLeft("WAKTU HABIS");
        clearInterval(interval);
        router.refresh();
      } else {
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [trx]);

  // Fungsi untuk mengunduh QR Code
  const handleDownloadQR = async () => {
    if (!trx) return;
    try {
      const response = await fetch(trx.payment_url_or_va);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `QRIS-TicketGo-${trx.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert("Gagal mengunduh QR Code. Silakan ambil tangkapan layar (screenshot) halaman ini secara manual.");
    }
  };

  if (loading) return <div className="text-center py-12 font-bold text-hermes">Memuat Instruksi Pembayaran...</div>;
  if (!trx) return <div className="text-center py-12 font-bold text-torch-red">Transaksi Tidak Ditemukan.</div>;

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
      
      {/* Header Banner */}
      <div className="bg-dark-heather p-6 text-white text-center space-y-2">
        <h2 className="text-sm uppercase tracking-widest text-light-gray font-bold">Batas Waktu Pembayaran</h2>
        <div className="flex items-center justify-center gap-2 text-2xl font-black text-torch-red animate-pulse">
          <Clock className="w-6 h-6 text-torch-red" />
          <span>{timeLeft}</span>
        </div>
        <p className="text-xs text-light-gray">Selesaikan pembayaran sebelum stok tiket Anda dilepas otomatis.</p>
      </div>

      <div className="p-8 space-y-6">
        
        {/* Detail Nominal */}
        <div className="text-center bg-light-gray/30 p-4 rounded-xl border border-light-gray">
          <span className="text-xs font-bold text-dark-heather uppercase tracking-wider">Total Tagihan</span>
          <h1 className="text-3xl font-black text-avg-green mt-1">
            Rp {trx.total_amount.toLocaleString("id-ID")}
          </h1>
          <p className="text-sm font-semibold text-hermes mt-2">
            Nobar: {trx.match_schedule.team_a} VS {trx.match_schedule.team_b}
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-dark-heather text-lg border-b pb-2">Instruksi Pembayaran</h3>
          
          {/* ================= 1. QRIS CHANNEL ================= */}
          {trx.payment_method === "qris" && (
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-hermes text-white font-bold px-4 py-1 text-xs rounded uppercase">QRIS / E-Wallet</div>
              <div className="border p-4 bg-white rounded-xl shadow-inner w-full max-w-[250px] flex flex-col items-center">
                {/* Tambahkan crossOrigin agar canvas fetch tidak terblokir CORS saat diunduh */}
                <img src={trx.payment_url_or_va} alt="QRIS Code" className="w-48 h-48 object-contain mb-4" crossOrigin="anonymous" />
                <button 
                  onClick={handleDownloadQR}
                  className="w-full bg-hermes hover:bg-blue-900 text-white font-bold py-2 px-4 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" /> Download QR
                </button>
              </div>
              <ol className="text-sm text-gray-600 list-decimal pl-5 space-y-1 w-full mt-2">
                <li>Buka aplikasi e-wallet Anda (GoPay, OVO, Dana, LinkAja, atau Mobile Banking).</li>
                <li>Pilih opsi <strong>Scan QR / Bayar</strong>.</li>
                <li>Arahkan kamera ke QR Code di atas atau tekan logo album untuk mengunggah QR yang telah diunduh.</li>
                <li>Periksa nominal tagihan dan konfirmasi pembayaran.</li>
              </ol>
            </div>
          )}

          {/* ================= 2. GOPAY DIRECT LINK ================= */}
          {trx.payment_method === "gopay" && (
            <div className="flex flex-col items-center space-y-4 py-4">
              <div className="bg-[#00AED6] text-white font-bold px-4 py-1 text-xs rounded uppercase">GoPay</div>
              <p className="text-sm text-gray-600 text-center">Klik tombol di bawah ini untuk langsung membuka aplikasi Gojek/GoPay Anda dan menyelesaikan pembayaran.</p>
              <a 
                href={trx.payment_url_or_va} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#00AED6] hover:bg-[#009bc0] text-white font-bold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2 w-full max-w-xs shadow-md mt-2"
              >
                <ExternalLink className="w-5 h-5" /> Bayar di Aplikasi GoPay
              </a>
            </div>
          )}

          {/* ================= 3. BANK TRANSFER (VA) WITH TABS ================= */}
          {trx.payment_method.startsWith("bank_transfer") && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-light-gray/20 rounded-lg border">
                <div>
                  <span className="text-xs text-gray-500 font-bold uppercase">Nomor Virtual Account</span>
                  <p className="text-xl font-mono font-bold text-hermes tracking-wider mt-1">{trx.payment_url_or_va}</p>
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(trx.payment_url_or_va);
                    alert("Nomor VA berhasil disalin!");
                  }}
                  className="p-2 hover:bg-gray-200 rounded transition"
                  title="Salin Nomor VA"
                >
                  <Copy className="w-5 h-5 text-dark-heather" />
                </button>
              </div>

              {/* Sistem Tab Instruksi */}
              <div className="border border-gray-200 rounded-lg overflow-hidden mt-4">
                <div className="flex bg-gray-50 border-b border-gray-200">
                  <button 
                    onClick={() => setVaTab('mbanking')}
                    className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-wider transition-colors ${vaTab === 'mbanking' ? 'bg-white text-torch-red border-t-2 border-torch-red' : 'text-gray-500 hover:bg-gray-200'}`}
                  >
                    M-Banking
                  </button>
                  <button 
                    onClick={() => setVaTab('atm')}
                    className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-wider border-l border-gray-200 transition-colors ${vaTab === 'atm' ? 'bg-white text-torch-red border-t-2 border-torch-red' : 'text-gray-500 hover:bg-gray-200'}`}
                  >
                    ATM
                  </button>
                  <button 
                    onClick={() => setVaTab('ibanking')}
                    className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-wider border-l border-gray-200 transition-colors ${vaTab === 'ibanking' ? 'bg-white text-torch-red border-t-2 border-torch-red' : 'text-gray-500 hover:bg-gray-200'}`}
                  >
                    Internet Banking
                  </button>
                </div>
                
                <div className="p-5 bg-white min-h-[180px]">
                  {vaTab === 'mbanking' && (
                    <ol className="text-sm text-gray-600 list-decimal pl-4 space-y-2">
                      <li>Buka aplikasi Mobile Banking Anda.</li>
                      <li>Pilih menu <strong>Transfer</strong> &rarr; <strong>Virtual Account</strong>.</li>
                      <li>Masukkan nomor Virtual Account yang tertera di atas.</li>
                      <li>Pastikan nama merchant adalah <strong>TicketGo Nobar</strong> dan nominal tagihan sesuai.</li>
                      <li>Masukkan PIN Anda untuk menyelesaikan transaksi.</li>
                    </ol>
                  )}
                  {vaTab === 'atm' && (
                    <ol className="text-sm text-gray-600 list-decimal pl-4 space-y-2">
                      <li>Masukkan kartu ATM dan PIN Anda.</li>
                      <li>Pilih menu <strong>Transaksi Lainnya</strong> &rarr; <strong>Transfer</strong>.</li>
                      <li>Pilih opsi <strong>Ke Rekening Virtual Account</strong>.</li>
                      <li>Masukkan nomor Virtual Account di atas.</li>
                      <li>Konfirmasi detail pembayaran di layar dan selesaikan transaksi.</li>
                    </ol>
                  )}
                  {vaTab === 'ibanking' && (
                    <ol className="text-sm text-gray-600 list-decimal pl-4 space-y-2">
                      <li>Login ke portal Internet Banking Anda melalui browser.</li>
                      <li>Pilih menu <strong>Transfer</strong> &rarr; <strong>Virtual Account</strong>.</li>
                      <li>Input nomor Virtual Account <strong>{trx.payment_url_or_va}</strong>.</li>
                      <li>Cek kesesuaian nama dan total tagihan pada layar konfirmasi.</li>
                      <li>Gunakan token atau SMS OTP Anda untuk otorisasi verifikasi akhir.</li>
                    </ol>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tombol Konfirmasi */}
        <button 
          onClick={() => {
            alert("Sistem akan otomatis mengirimkan E-Ticket ke email Anda jika pembayaran telah sukses terverifikasi.");
            router.push("/");
          }}
          className="w-full bg-avg-green text-white font-bold py-3.5 rounded-xl hover:bg-green-700 transition flex items-center justify-center gap-2 shadow-md mt-4"
        >
          <CheckCircle className="w-5 h-5" />
          <span>Kembali ke Halaman Utama</span>
        </button>
      </div>
    </div>
  );
}
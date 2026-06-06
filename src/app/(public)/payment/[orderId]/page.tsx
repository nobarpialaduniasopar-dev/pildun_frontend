"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";
import { Clock, CheckCircle, Copy, AlertTriangle } from "lucide-react";

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

  // Ambil detail transaksi dari backend (Kita asumsikan endpoint ini sudah siap di backend nanti)
  useEffect(() => {
    const fetchPaymentDetail = async () => {
      try {
        // Untuk sementara kita buat endpoint simulasi/baca data transaksi publik
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

  // Efek hitung mundur 15 menit
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

  if (loading) return <div className="text-center py-12 font-bold text-hermes">Memuat Instruksi Pembayaran...</div>;
  if (!trx) return <div className="text-center py-12 font-bold text-torch-red">Transaksi Tidak Ditemukan.</div>;

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
      {/* Header Banner Sporty */}
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

        {/* Info Metode Pembayaran & Instruksi */}
        <div className="space-y-4">
          <h3 className="font-bold text-dark-heather text-lg border-b pb-2">Instruksi Pembayaran</h3>
          
          {/* QRIS Channel */}
          {trx.payment_method === "qris" && (
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-hermes text-white font-bold px-4 py-1 text-xs rounded uppercase">QRIS / E-Wallet</div>
              <div className="border p-4 bg-white rounded-xl shadow-inner">
                <img src={trx.payment_url_or_va} alt="QRIS Code" className="w-48 h-48 object-contain" />
              </div>
              <ol className="text-sm text-gray-600 list-decimal pl-5 space-y-1 w-full">
                <li>Buka aplikasi e-wallet Anda (GoPay, OVO, Dana, LinkAja, atau Mobile Banking).</li>
                <li>Pilih opsi <strong>Scan QR / Bayar</strong>.</li>
                <li>Arahkan kamera ke QR Code di atas atau upload tangkapan layar halaman ini.</li>
                <li>Periksa nominal tagihan dan konfirmasi pembayaran.</li>
              </ol>
            </div>
          )}

          {/* Bank Transfer Channel */}
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

              <div className="bg-dark-heather text-white font-bold px-3 py-1 text-xs rounded inline-block uppercase">
                Cara Transfer via ATM / M-Banking
              </div>
              <ol className="text-sm text-gray-600 list-decimal pl-5 space-y-2">
                <li>Masukkan kartu ATM / buka aplikasi Mobile Banking Anda.</li>
                <li>Pilih menu <strong>Transfer</strong> $\rightarrow$ <strong>Virtual Account</strong> / <strong>Ke Rekening Bank Lain</strong>.</li>
                <li>Masukkan nomor Virtual Account yang tertera di atas.</li>
                <li>Pastikan nama merchant yang muncul adalah <strong>TicketGo Nobar</strong> dan total nominal sesuai.</li>
                <li>Masukkan PIN Anda dan simpan bukti transaksi.</li>
              </ol>
            </div>
          )}
        </div>

        {/* Tombol Cek Status */}
        <button 
          onClick={() => {
            alert("Sistem akan otomatis mengirimkan E-Ticket ke email Anda jika pembayaran sukses terverifikasi oleh Midtrans webhook.");
            router.push("/");
          }}
          className="w-full bg-avg-green text-white font-bold py-3 rounded-xl hover:bg-green-700 transition flex items-center justify-center gap-2 shadow-md"
        >
          <CheckCircle className="w-5 h-5" />
          <span>Kembali ke Halaman Utama</span>
        </button>
      </div>
    </div>
  );
}
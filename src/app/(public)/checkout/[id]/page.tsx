"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function CheckoutPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    match_id: params.id,
    buyer_name: "",
    buyer_email: "",
    buyer_whatsapp: "",
    buyer_instagram: "",
    buyer_age: "",
    qty: 1,
    payment_type: "qris", // Default
    bank: "",
  });

  const [otpCode, setOtpCode] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      await api.post("/otp/send", { email: formData.buyer_email });
      setStep(2);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Gagal mengirim OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      // 1. Verifikasi OTP
      await api.post("/otp/verify", { email: formData.buyer_email, otp_code: otpCode });

      // 2. Jika OTP valid, langsung eksekusi Checkout (Pessimistic Locking berjalan di Backend)
      const checkoutRes = await api.post("/checkout", formData);

      // 3. Arahkan ke halaman instruksi pembayaran kustom membawa Order ID
      router.push(`/payment/${checkoutRes.data.order_id}`);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "OTP Salah atau Tiket Habis");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-200">
      <h1 className="text-3xl font-bold text-hermes mb-6">Selesaikan Pembelian</h1>
      
      {errorMsg && <div className="mb-4 p-3 bg-red-100 text-torch-red rounded-lg">{errorMsg}</div>}

      {step === 1 && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-dark-heather mb-1">Nama Lengkap</label>
              <input required type="text" className="w-full border p-2 rounded" 
                value={formData.buyer_name} onChange={e => setFormData({...formData, buyer_name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-dark-heather mb-1">Umur</label>
              <input required type="number" className="w-full border p-2 rounded" 
                value={formData.buyer_age} onChange={e => setFormData({...formData, buyer_age: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-dark-heather mb-1">WhatsApp</label>
              <input required type="text" className="w-full border p-2 rounded" 
                value={formData.buyer_whatsapp} onChange={e => setFormData({...formData, buyer_whatsapp: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-dark-heather mb-1">Instagram (Opsional)</label>
              <input type="text" className="w-full border p-2 rounded" 
                value={formData.buyer_instagram} onChange={e => setFormData({...formData, buyer_instagram: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-dark-heather mb-1">Email (Wajib Aktif)</label>
            <input required type="email" className="w-full border p-2 rounded" 
              value={formData.buyer_email} onChange={e => setFormData({...formData, buyer_email: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-dark-heather mb-1">Metode Pembayaran</label>
              <select className="w-full border p-2 rounded" 
                value={formData.payment_type} onChange={e => setFormData({...formData, payment_type: e.target.value, bank: ""})}>
                <option value="qris">QRIS</option>
                <option value="gopay">GoPay</option>
                <option value="bank_transfer">Bank Transfer (VA)</option>
              </select>
            </div>
            {formData.payment_type === "bank_transfer" && (
              <div>
                <label className="block text-sm font-bold text-dark-heather mb-1">Pilih Bank</label>
                <select required className="w-full border p-2 rounded" 
                  value={formData.bank} onChange={e => setFormData({...formData, bank: e.target.value})}>
                  <option value="">-- Pilih --</option>
                  <option value="mandiri">Mandiri</option>
                  <option value="bni">BNI</option>
                  <option value="bri">BRI</option>
                </select>
              </div>
            )}
          </div>

          <button disabled={loading} type="submit" className="w-full bg-avg-green text-white font-bold py-3 rounded-lg hover:bg-green-700 transition mt-6">
            {loading ? "Memproses..." : "Kirim OTP ke Email"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyAndCheckout} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-dark-heather mb-1">Masukkan 6-Digit OTP</label>
            <input required type="text" maxLength={6} className="w-full border p-3 rounded text-center text-2xl tracking-widest font-bold" 
              value={otpCode} onChange={e => setOtpCode(e.target.value)} />
            <p className="text-sm text-gray-500 mt-2 text-center">Cek kotak masuk atau spam email Anda.</p>
          </div>
          <button disabled={loading} type="submit" className="w-full bg-torch-red text-white font-bold py-3 rounded-lg hover:bg-red-700 transition mt-4">
            {loading ? "Memvalidasi & Mengunci Tiket..." : "Verifikasi & Bayar"}
          </button>
        </form>
      )}
    </div>
  );
}
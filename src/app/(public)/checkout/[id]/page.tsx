"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { Ticket, Mail, Smartphone, User } from "lucide-react";

// Konfigurasi logo pembayaran sesuai nama file di folder public/images/payments/
const PAYMENT_METHODS = [
  { id: 'qris', type: 'qris', bank: '', name: 'QRIS', logo: '/images/payments/qris.webp' },
  { id: 'gopay', type: 'gopay', bank: '', name: 'GoPay', logo: '/images/payments/gopay.webp' },
  { id: 'mandiri', type: 'bank_transfer', bank: 'mandiri', name: 'Mandiri', logo: '/images/payments/mandiri.webp' },
  { id: 'bni', type: 'bank_transfer', bank: 'bni', name: 'BNI', logo: '/images/payments/bni.webp' },
  { id: 'bri', type: 'bank_transfer', bank: 'bri', name: 'BRI', logo: '/images/payments/bri.webp' },
];

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
      await api.post("/otp/verify", { email: formData.buyer_email, otp_code: otpCode });
      const checkoutRes = await api.post("/checkout", formData);
      router.push(`/payment/${checkoutRes.data.order_id}`);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "OTP Salah atau Tiket Habis");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 relative z-10">
      <div className="bg-dark-heather p-8 md:p-12 border-l-8 border-avg-green shadow-[16px_16px_0px_rgba(0,0,0,0.5)]">
        
        <div className="flex items-center gap-4 border-b border-white/10 pb-6 mb-8">
          <Ticket className="w-8 h-8 text-torch-red transform -skew-x-12" />
          <h1 className="text-3xl md:text-4xl font-black text-white italic tracking-tighter uppercase">
            Selesaikan <span className="text-avg-green">Pembelian</span>
          </h1>
        </div>
        
        {errorMsg && (
          <div className="mb-6 p-4 bg-torch-red/20 border-l-4 border-torch-red text-white font-bold text-sm uppercase tracking-widest">
            {errorMsg}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Teks Input Style Brutalist */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-light-gray uppercase tracking-widest flex items-center gap-2">
                  <User className="w-3 h-3 text-avg-green" /> Nama Lengkap
                </label>
                <input required type="text" 
                  className="w-full bg-white/5 border border-white/10 text-white p-3 font-bold focus:border-avg-green focus:ring-0 outline-none transition-colors" 
                  value={formData.buyer_name} onChange={e => setFormData({...formData, buyer_name: e.target.value})} 
                  placeholder="Sesuai KTP" />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-light-gray uppercase tracking-widest flex items-center gap-2">
                  <User className="w-3 h-3 text-avg-green" /> Umur
                </label>
                <input required type="number" 
                  className="w-full bg-white/5 border border-white/10 text-white p-3 font-bold focus:border-avg-green focus:ring-0 outline-none transition-colors" 
                  value={formData.buyer_age} onChange={e => setFormData({...formData, buyer_age: e.target.value})} 
                  placeholder="Min. 18 Tahun" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-light-gray uppercase tracking-widest flex items-center gap-2">
                  <Smartphone className="w-3 h-3 text-avg-green" /> WhatsApp
                </label>
                <input required type="text" 
                  className="w-full bg-white/5 border border-white/10 text-white p-3 font-bold focus:border-avg-green focus:ring-0 outline-none transition-colors" 
                  value={formData.buyer_whatsapp} onChange={e => setFormData({...formData, buyer_whatsapp: e.target.value})} 
                  placeholder="0812xxxx" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-light-gray uppercase tracking-widest flex items-center gap-2">
                  <Smartphone className="w-3 h-3 text-avg-green" /> Instagram
                </label>
                <input type="text" 
                  className="w-full bg-white/5 border border-white/10 text-white p-3 font-bold focus:border-avg-green focus:ring-0 outline-none transition-colors" 
                  value={formData.buyer_instagram} onChange={e => setFormData({...formData, buyer_instagram: e.target.value})} 
                  placeholder="@username (Opsional)" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-torch-red uppercase tracking-widest flex items-center gap-2">
                <Mail className="w-3 h-3" /> Email Utama (Wajib Aktif)
              </label>
              <input required type="email" 
                className="w-full bg-white/5 border border-torch-red/50 text-white p-4 font-bold focus:border-torch-red focus:ring-0 outline-none transition-colors text-lg tracking-wider" 
                value={formData.buyer_email} onChange={e => setFormData({...formData, buyer_email: e.target.value})} 
                placeholder="nama@email.com" />
            </div>

            {/* ================= PAYMENT GRID SELECTOR ================= */}
            <div className="pt-6 border-t border-white/10">
              <label className="block text-xs font-black text-white uppercase tracking-[0.2em] mb-4 border-l-4 border-avg-green pl-3">
                Pilih Metode Pembayaran
              </label>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {PAYMENT_METHODS.map((method) => {
                  const isSelected = formData.payment_type === method.type && formData.bank === method.bank;
                  
                  return (
                    <div
                      key={method.id}
                      onClick={() => setFormData({ ...formData, payment_type: method.type, bank: method.bank })}
                      className={`cursor-pointer border-2 p-4 flex items-center justify-center transition-all h-20 bg-white shadow-sm ${
                        isSelected
                          ? 'border-avg-green shadow-[6px_6px_0px_rgba(60,172,59,0.8)] grayscale-0 opacity-100 transform -translate-y-1'
                          : 'border-transparent grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:border-light-gray'
                      }`}
                    >
                      <img src={method.logo} alt={method.name} className="max-h-full max-w-full object-contain" />
                    </div>
                  );
                })}
              </div>
            </div>

            <button disabled={loading} type="submit" className="w-full bg-avg-green text-white font-black py-5 uppercase tracking-[0.2em] transition-all hover:bg-white hover:text-avg-green border-2 border-transparent hover:border-avg-green transform -skew-x-6 shadow-[8px_8px_0px_rgba(0,0,0,0.3)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 mt-8">
              <span className="block transform skew-x-6">
                {loading ? "MEMPROSES..." : "KIRIM OTP KE EMAIL"}
              </span>
            </button>
          </form>
        )}

        {/* ================= OTP VERIFICATION STEP ================= */}
        {step === 2 && (
          <form onSubmit={handleVerifyAndCheckout} className="space-y-6">
            <div className="text-center mb-8">
              <Mail className="w-12 h-12 text-avg-green mx-auto mb-4" />
              <h3 className="text-2xl font-black text-white uppercase tracking-wider">Cek Email Anda</h3>
              <p className="text-light-gray text-sm mt-2 mb-4">Kami telah mengirimkan 6 digit kode OTP ke <strong className="text-white">{formData.buyer_email}</strong></p>
              <button 
                type="button" 
                onClick={() => { setStep(1); setOtpCode(""); }}
                className="text-[10px] font-black text-torch-red uppercase tracking-widest hover:text-white transition-colors border-b-2 border-torch-red hover:border-white pb-1"
              >
                EMAIL SALAH? GANTI
              </button>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-light-gray uppercase tracking-widest text-center block">
                Masukkan Kode OTP
              </label>
              <input required type="text" maxLength={6} 
                className="w-full bg-black/40 border-2 border-white/20 text-white p-6 text-center text-4xl tracking-[1em] font-black focus:border-avg-green focus:ring-0 outline-none transition-colors" 
                value={otpCode} onChange={e => setOtpCode(e.target.value)} 
                placeholder="------" />
            </div>

            <button disabled={loading} type="submit" className="w-full bg-torch-red text-white font-black py-5 uppercase tracking-[0.2em] transition-all hover:bg-white hover:text-torch-red border-2 border-transparent hover:border-torch-red transform -skew-x-6 shadow-[8px_8px_0px_rgba(0,0,0,0.3)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 mt-4">
              <span className="block transform skew-x-6">
                {loading ? "MENGUNCI TIKET..." : "VERIFIKASI & BAYAR"}
              </span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
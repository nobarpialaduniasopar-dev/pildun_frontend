"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Link as LinkIcon, RefreshCw, Copy, ExternalLink, ShieldAlert, PlusCircle } from "lucide-react";

export default function ScannerManager() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchToken = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/scanner/token');
      // Jika token null atau empty string dari backend, set kosong
      setToken(res.data.token || "");
    } catch (err) {
      showToast("Gagal memuat status scanner.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchToken(); }, []);

  const generateNewToken = async () => {
    // Alert custom tidak bisa menggantikan confirm browser bawaan, 
    // namun kita bisa menggunakan state untuk menampilkan modal konfirmasi jika mau.
    // Untuk saat ini kita pakai confirm bawaan tapi logikanya sudah diperbaiki.
    if (!confirm(token ? "Link lama akan hangus. Lanjutkan?" : "Buat link scanner baru?")) return;
    
    try {
      setLoading(true);
      const res = await api.post('/admin/scanner/generate');
      setToken(res.data.token);
      showToast(res.data.message, "success");
    } catch (err) {
      showToast("Gagal generate link.", "error");
    } finally {
      setLoading(false);
    }
  };

  const scannerLink = token ? `${window.location.origin}/gatekeeper/${token}` : "";

  return (
    <div className="space-y-8 max-w-4xl relative">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-6 py-4 font-black text-white transform -skew-x-3 shadow-xl ${toast.type === 'success' ? 'bg-avg-green' : 'bg-torch-red'}`}>
          {toast.message}
        </div>
      )}

      <div className="bg-dark-heather border border-white/10 p-6 flex items-center justify-between shadow-[8px_8px_0_rgba(0,0,0,0.5)]">
        <div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase flex items-center gap-3">
            <LinkIcon className="text-avg-green" size={32} />
            Gatekeeper <span className="text-avg-green">Manager</span>
          </h1>
        </div>
      </div>

      <div className="bg-white/5 border border-white/20 p-8 transform -skew-x-2 relative overflow-hidden">
        <h2 className="text-xl font-black text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-4">
          Status Scanner
        </h2>
        
        {!token ? (
          <div className="text-center py-10 border-2 border-dashed border-white/20">
            <ShieldAlert className="mx-auto text-white/20 mb-4" size={48} />
            <p className="text-white/50 font-bold mb-6">Belum ada link scanner aktif.</p>
            <button 
              onClick={generateNewToken}
              className="bg-avg-green text-white font-black px-8 py-4 uppercase hover:bg-white hover:text-avg-green transition-all"
            >
              <PlusCircle className="inline mr-2" /> BUAT SCANNER
            </button>
          </div>
        ) : (
          <>
            <div className="bg-black/60 border border-avg-green/50 p-6 mb-6 break-all">
              <span className="text-avg-green font-mono text-lg">{scannerLink}</span>
            </div>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => { navigator.clipboard.writeText(scannerLink); showToast("Link disalin!", "success"); }} className="bg-white/10 text-white font-black px-6 py-4 uppercase hover:bg-white hover:text-black transition-colors transform -skew-x-3 flex items-center gap-2">
                <Copy size={18} /> COPY
              </button>
              <button onClick={() => window.open(scannerLink, '_blank')} className="bg-hermes text-white font-black px-6 py-4 uppercase hover:bg-white hover:text-hermes transition-colors transform -skew-x-3 flex items-center gap-2">
                <ExternalLink size={18} /> BUKA
              </button>
              <button onClick={generateNewToken} className="bg-torch-red text-white font-black px-6 py-4 uppercase hover:bg-white hover:text-torch-red transition-colors transform -skew-x-3 flex items-center gap-2 ml-auto">
                <RefreshCw size={18} /> RE-GENERATE
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
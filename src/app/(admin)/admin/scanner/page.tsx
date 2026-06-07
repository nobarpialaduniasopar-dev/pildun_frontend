"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Link2, RefreshCw, Copy, ExternalLink, ShieldAlert } from "lucide-react";

export default function ScannerManager() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchToken = async () => {
    try {
      const res = await api.get("/admin/scanner/token");
      setToken(res.data.token);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToken();
  }, []);

  const generateNewToken = async () => {
    if (!confirm("PERINGATAN: Membuat link baru akan membuat semua HP Gatekeeper yang menggunakan link lama ter-logout dan tidak bisa melakukan scan. Lanjutkan?")) return;
    
    setLoading(true);
    try {
      const res = await api.post("/admin/scanner/token");
      setToken(res.data.token);
      alert(res.data.message);
    } catch (err) {
      alert("Gagal membuat link baru.");
    } finally {
      setLoading(false);
    }
  };

  const gatekeeperUrl = typeof window !== 'undefined' ? `${window.location.origin}/gatekeeper/${token}` : '';

  return (
    <div className="space-y-8">
      <div className="bg-dark-heather p-6 border-l-8 border-avg-green shadow-[8px_8px_0px_rgba(0,0,0,0.3)]">
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">
          GATEKEEPER <span className="text-avg-green">MANAGER</span>
        </h1>
        <p className="text-white/50 text-xs font-bold uppercase tracking-widest mt-1">Manajemen Akses Kamera Penjaga Pintu</p>
      </div>

      <div className="bg-dark-heather border border-white/10 p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 text-white/5 rotate-[-15deg] pointer-events-none">
          <Link2 size={250} />
        </div>

        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="flex items-start gap-4 p-4 bg-torch-red/10 border-l-4 border-torch-red">
            <ShieldAlert className="text-torch-red shrink-0" />
            <p className="text-sm font-bold text-light-gray">
              Kirimkan link ini ke petugas lapangan (Gatekeeper) agar mereka bisa membuka kamera di HP masing-masing tanpa perlu login.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-light-gray uppercase tracking-widest">Active Gatekeeper Link</label>
            <div className="flex flex-col md:flex-row gap-4">
              <input 
                type="text" 
                readOnly 
                value={loading ? "Memuat link..." : gatekeeperUrl}
                className="flex-1 bg-black/40 border border-white/20 text-white p-4 font-mono text-sm outline-none"
              />
              <div className="flex gap-2">
                <button 
                  onClick={() => { navigator.clipboard.writeText(gatekeeperUrl); alert('Link disalin!'); }}
                  className="bg-white/10 hover:bg-white hover:text-dark-heather text-white p-4 transition flex items-center justify-center border border-white/20"
                  title="Salin Link"
                >
                  <Copy size={20} />
                </button>
                <a 
                  href={gatekeeperUrl}
                  target="_blank"
                  className="bg-avg-green hover:bg-green-600 text-white p-4 transition flex items-center justify-center font-black uppercase text-xs gap-2"
                >
                  <ExternalLink size={16} /> BUKA SCANNER
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10">
            <button 
              onClick={generateNewToken}
              disabled={loading}
              className="bg-transparent border-2 border-torch-red text-torch-red hover:bg-torch-red hover:text-white font-black px-6 py-3 uppercase tracking-widest transition-all transform -skew-x-12 flex items-center gap-2"
            >
              <span className="transform skew-x-12 flex items-center gap-2"><RefreshCw size={16} /> GENERATE LINK BARU (CABUT AKSES LAMA)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
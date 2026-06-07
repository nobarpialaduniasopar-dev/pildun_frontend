"use client";

import { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import api from "@/lib/axios";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { ScanLine, CheckCircle, XCircle, AlertTriangle, LogOut, Camera } from "lucide-react";

export default function FullscreenScanner({ params }: { params: { token: string } }) {
  const [cameras, setCameras] = useState<any[]>([]);
  const [activeCamera, setActiveCamera] = useState<string>("");
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null); // { status, message, ticket }
  const [loading, setLoading] = useState(false);
  
  const scannerRef = useRef<Html5Qrcode | null>(null);

  // Ambil daftar kamera saat mount
  useEffect(() => {
    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length) {
        setCameras(devices);
        setActiveCamera(devices[0].id); // Default kamera pertama
      }
    }).catch(err => {
      console.error("Gagal mengakses kamera", err);
      alert("Izin kamera ditolak atau kamera tidak ditemukan.");
    });

    return () => {
      if (scannerRef.current && isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  // Mulai/Hentikan Scanner berdasarkan state
  useEffect(() => {
    if (!activeCamera) return;

    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode("reader");
    }

    if (isScanning) {
      scannerRef.current.start(
        activeCamera,
        { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
        (decodedText) => {
          handleVerifyTicket(decodedText);
        },
        (errorMessage) => { /* Abaikan error scan per frame */ }
      ).catch(console.error);
    } else {
      if (scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    }
  }, [isScanning, activeCamera]);

  const handleVerifyTicket = async (ticketId: string) => {
    setIsScanning(false); // Stop kamera sejenak saat memproses
    setLoading(true);
    
    try {
      const res = await api.post('/gatekeeper/scan', { 
        ticket_id: ticketId,
        gatekeeper_token: params.token
      });
      setResult({ status: res.data.status, message: res.data.message, ticket: res.data.ticket });
    } catch (err: any) {
      setResult({ 
        status: 'error', 
        message: err.response?.data?.message || 'Tiket Tidak Valid / Link Hangus', 
        ticket: err.response?.data?.ticket 
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePassOut = async () => {
    if (!result?.ticket?.id) return;
    setLoading(true);
    try {
      const res = await api.post('/gatekeeper/checkout', { 
        ticket_id: result.ticket.id,
        gatekeeper_token: params.token
      });
      alert(res.data.message);
      setResult(null);
      setIsScanning(true); // Lanjut scan
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal Pass-Out');
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setResult(null);
    setIsScanning(true);
  };

  // State Awal: Belum mulai scan
  if (!isScanning && !result) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 font-sans">
        <ScanLine className="text-avg-green w-32 h-32 mb-8 animate-pulse" />
        <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-8 text-center">
          SOPAR <span className="text-avg-green">GATEKEEPER</span>
        </h1>
        
        {cameras.length > 0 ? (
          <div className="w-full max-w-sm flex flex-col gap-4">
            <div className="flex items-center gap-3 bg-white/10 px-4 py-3 border border-white/20">
              <Camera className="text-white" />
              <select 
                className="bg-transparent text-white w-full outline-none font-bold uppercase text-sm"
                value={activeCamera}
                onChange={(e) => setActiveCamera(e.target.value)}
              >
                {cameras.map(c => <option key={c.id} value={c.id} className="bg-black text-white">{c.label}</option>)}
              </select>
            </div>
            <button 
              onClick={() => setIsScanning(true)}
              className="w-full bg-avg-green text-white font-black px-6 py-5 text-xl uppercase tracking-widest transform -skew-x-3 active:scale-95 transition-transform"
            >
              MULAI SCANNER
            </button>
          </div>
        ) : (
          <p className="text-white/50 uppercase font-bold tracking-widest text-center">Mencari Kamera...</p>
        )}
      </div>
    );
  }

  // Tampilan Berdasarkan Hasil Scan
  let bgClass = "bg-black";
  if (result?.status === 'success') bgClass = "bg-avg-green";
  if (result?.status === 'error') bgClass = "bg-torch-red";
  if (result?.status === 'already_in') bgClass = "bg-[#FFD700]";

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-300 flex flex-col`}>
      
      {/* Viewfinder Kamera */}
      <div className={`flex-1 relative ${!isScanning ? 'hidden' : 'block'}`}>
        <div id="reader" className="w-full h-full object-cover absolute inset-0"></div>
        <div className="absolute bottom-10 left-0 w-full flex justify-center z-10 px-6">
          <button 
            onClick={() => setIsScanning(false)}
            className="bg-torch-red text-white font-black px-6 py-4 uppercase tracking-widest w-full max-w-sm shadow-[8px_8px_0_rgba(0,0,0,0.8)]"
          >
            HENTIKAN KAMERA
          </button>
        </div>
      </div>

      {/* Screen Hasil Scan */}
      {result && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-200">
          
          {result.status === 'success' && <CheckCircle className="text-white w-40 h-40 mb-6 drop-shadow-xl" />}
          {result.status === 'error' && <XCircle className="text-white w-40 h-40 mb-6 drop-shadow-xl" />}
          {result.status === 'already_in' && <AlertTriangle className="text-black w-40 h-40 mb-6 drop-shadow-xl" />}

          <h2 className={`text-5xl font-black uppercase tracking-tighter italic mb-4 ${result.status === 'already_in' ? 'text-black' : 'text-white'} drop-shadow-md`}>
            {result.status === 'already_in' ? 'SUDAH CHECK-IN' : result.status === 'success' ? 'VALID' : 'DITOLAK'}
          </h2>
          
          <p className={`text-xl font-black tracking-widest uppercase mb-8 px-6 py-3 ${result.status === 'already_in' ? 'bg-black/10 text-black' : 'bg-black/20 text-white'}`}>
            {result.message}
          </p>

          {/* Info Detail Jika Tiket Dikenali */}
          {result.ticket && result.ticket.transaction && (
            <div className={`w-full max-w-sm text-left p-6 mb-8 ${result.status === 'already_in' ? 'bg-black/10 text-black border-black/20' : 'bg-black/20 text-white border-white/20'} border`}>
              <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">Pemegang Tiket</p>
              <p className="text-2xl font-black uppercase mb-4 truncate">{result.ticket.transaction.buyer_name}</p>
              
              {result.status === 'already_in' && result.ticket.scanned_at && (
                <>
                  <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">Waktu Masuk</p>
                  <p className="text-lg font-black uppercase mb-4">
                    {format(new Date(result.ticket.scanned_at), "dd MMM HH:mm:ss", { locale: localeId })} WIB
                  </p>
                </>
              )}
            </div>
          )}

          {/* Tombol Aksi */}
          <div className="flex flex-col gap-4 w-full max-w-sm">
            {result.status === 'already_in' && (
              <button 
                onClick={handlePassOut}
                disabled={loading}
                className="w-full bg-black text-[#FFD700] font-black px-6 py-5 text-xl uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-transform"
              >
                <LogOut /> {loading ? 'MEMPROSES...' : 'YAKIN CHECKOUT?'}
              </button>
            )}
            
            <button 
              onClick={resetScanner}
              disabled={loading}
              className={`w-full font-black px-6 py-5 text-xl uppercase tracking-widest shadow-xl active:scale-95 transition-transform ${result.status === 'already_in' ? 'bg-white text-black' : 'bg-black text-white'}`}
            >
              LANJUT SCAN TIKET LAIN
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
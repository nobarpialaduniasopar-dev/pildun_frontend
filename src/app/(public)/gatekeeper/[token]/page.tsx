"use client";

import { useEffect, useState, useRef } from "react";
import api from "@/lib/axios";
import { Html5QrcodeScanner } from "html5-qrcode";
import { CheckCircle, XCircle, AlertTriangle, ScanLine, Camera } from "lucide-react";
import { useParams } from "next/navigation";

type ScanResult = { status: 'idle' | 'success' | 'used' | 'invalid', message: string, data?: any };

export default function FullScreenScanner() {
  const { token } = useParams();
  const [result, setResult] = useState<ScanResult>({ status: 'idle', message: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    // html5-qrcode otomatis menyediakan fitur pilih kamera di UI-nya jika ada >1 kamera
    scannerRef.current = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0, showTorchButtonIfSupported: true },
      false
    );

    scannerRef.current.render(onScanSuccess, () => {});

    return () => {
      if (scannerRef.current) scannerRef.current.clear().catch(console.error);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onScanSuccess = async (decodedText: string) => {
    if (isProcessing) return;
    setIsProcessing(true);

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(decodedText)) {
        triggerToast('invalid', 'QR BUKAN E-TICKET KITA');
        return;
    }

    try {
      // KIRIM TOKEN GATEKEEPER KE BACKEND SEBAGAI OTENTIKASI
      const res = await api.post("/gatekeeper/scan", { 
        ticket_id: decodedText, // WAJIB ticket_id sesuai validasi backend
        gatekeeper_token: token 
      });
      triggerToast('success', res.data.message, res.data.data);
    } catch (err: any) {
      const status = err.response?.status;
      const msg = err.response?.data?.message || 'Error Jaringan / Server';

      if (status === 422) triggerToast('used', msg, err.response?.data);
      else if (status === 401) triggerToast('invalid', "LINK SCANNER EXPIRED! Minta admin generate ulang.");
      else triggerToast('invalid', msg);
    }
  };

  const triggerToast = (status: 'success' | 'used' | 'invalid', message: string, data?: any) => {
    setResult({ status, message, data });
    setTimeout(() => {
      setIsProcessing(false);
      setResult({ status: 'idle', message: '' });
    }, 2500); // Cooldown 2.5 detik
  };

  return (
    <div className="fixed inset-0 bg-black z-[100000] flex flex-col font-sans">
      
      {/* Toast Notification (Z-Index Tertinggi) */}
      {result.status !== 'idle' && (
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-[100001] w-[90%] max-w-sm shadow-[0_10px_40px_rgba(0,0,0,0.8)] animate-in slide-in-from-top-10">
          {result.status === 'success' && (
            <div className="bg-avg-green border-2 border-white p-4 flex items-center gap-4">
              <CheckCircle className="w-10 h-10 text-white shrink-0" />
              <div>
                <h3 className="text-xl font-black text-white uppercase">{result.message}</h3>
                <p className="text-white/80 font-bold uppercase text-xs">{result.data?.buyer_name} ({result.data?.qty} Pax)</p>
              </div>
            </div>
          )}
          {result.status === 'used' && (
            <div className="bg-orange-600 border-2 border-white p-4 flex items-center gap-4">
              <AlertTriangle className="w-10 h-10 text-white shrink-0" />
              <div>
                <h3 className="text-xl font-black text-white uppercase">{result.message}</h3>
                <p className="text-white/80 font-bold text-[10px] uppercase">Waktu: {result.data?.scanned_at ? new Date(result.data.scanned_at).toLocaleString('id-ID') : 'Unknown'}</p>
              </div>
            </div>
          )}
          {result.status === 'invalid' && (
            <div className="bg-torch-red border-2 border-white p-4 flex items-center gap-4">
              <XCircle className="w-10 h-10 text-white shrink-0" />
              <h3 className="text-lg font-black text-white uppercase">{result.message}</h3>
            </div>
          )}
        </div>
      )}

      {/* Kamera Area (Memaksa HTML5-QRCode Full Screen dan Dark Mode) */}
      <div className="flex-1 relative bg-dark-heather">
        {isProcessing && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center">
            <ScanLine className="w-20 h-20 text-avg-green animate-bounce" />
            <span className="text-white font-black uppercase tracking-[0.3em] mt-6 text-xl">MEMPROSES...</span>
          </div>
        )}
        
        {/* CSS override brutal untuk html5-qrcode */}
        <style dangerouslySetInnerHTML={{__html: `
          #qr-reader { border: none !important; width: 100% !important; height: 100% !important; display: flex; flex-direction: column; }
          #qr-reader__dashboard_section_csr span { color: white !important; font-weight: bold; }
          #qr-reader__dashboard_section_csr button { background-color: #3CAC3B !important; color: white !important; font-weight: 900; padding: 10px 20px; border: none; text-transform: uppercase; margin-top: 10px; cursor: pointer; }
          #qr-reader__dashboard_section_csr select { background-color: #333 !important; color: white !important; padding: 10px; border: 1px solid #555; width: 100%; margin-top: 10px; font-weight: bold; }
          #qr-reader video { object-fit: cover !important; width: 100% !important; height: 100% !important; }
          #qr-reader__dashboard_section_swaplink { display: none !important; }
        `}} />
        <div id="qr-reader" className="w-full h-full"></div>
      </div>

      <div className="bg-black border-t-4 border-torch-red p-6 pb-12 flex justify-between items-center z-40">
        <div>
          <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter">GATEKEEPER</h1>
          <p className="text-torch-red text-[10px] font-black uppercase tracking-widest mt-1 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-torch-red animate-pulse"></span> SYSTEM ONLINE</p>
        </div>
        <Camera className="text-white/20 w-12 h-12" />
      </div>
    </div>
  );
}
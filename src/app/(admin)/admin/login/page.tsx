"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { ShieldAlert, KeyRound, Mail } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await api.post("/admin/login", formData);
      // Simpan token Sanctum dan nama user ke Local Storage
      localStorage.setItem("admin_token", res.data.token);
      localStorage.setItem("admin_name", res.data.name);
      
      // Redirect ke dashboard
      router.push("/admin/dashboard");
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Kredensial tidak valid atau server mati.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hermes flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background brutalist accents */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,transparent,transparent_10px,rgba(255,255,255,0.02)_10px,rgba(255,255,255,0.02)_20px)] pointer-events-none"></div>
      <div className="absolute -left-20 -bottom-20 text-[200px] font-black text-white/[0.02] italic tracking-tighter transform -rotate-12 pointer-events-none">
        RESTRICTED
      </div>

      <div className="w-full max-w-md bg-dark-heather border-t-8 border-torch-red p-8 md:p-12 shadow-[16px_16px_0px_rgba(0,0,0,0.5)] relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-torch-red p-3 rounded-none transform -skew-x-12">
            <ShieldAlert className="w-8 h-8 text-white transform skew-x-12" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">
              COMMAND <br/><span className="text-torch-red">CENTER</span>
            </h1>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-torch-red/20 border-l-4 border-torch-red text-white font-bold text-xs uppercase tracking-widest">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-light-gray uppercase tracking-[0.2em] flex items-center gap-2">
              <Mail className="w-3 h-3 text-torch-red" /> Admin Email
            </label>
            <input required type="email" 
              className="w-full bg-white/5 border border-white/10 text-white p-4 font-bold focus:border-torch-red focus:ring-0 outline-none transition-colors" 
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} 
              placeholder="admin@nobar.com" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-light-gray uppercase tracking-[0.2em] flex items-center gap-2">
              <KeyRound className="w-3 h-3 text-torch-red" /> Password
            </label>
            <input required type="password" 
              className="w-full bg-white/5 border border-white/10 text-white p-4 font-bold focus:border-torch-red focus:ring-0 outline-none transition-colors tracking-widest" 
              value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} 
              placeholder="••••••••" />
          </div>

          <button disabled={loading} type="submit" className="w-full bg-torch-red text-white font-black py-4 uppercase tracking-[0.2em] transition-all hover:bg-white hover:text-torch-red border-2 border-transparent hover:border-torch-red transform -skew-x-6 shadow-[8px_8px_0px_rgba(0,0,0,0.3)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 mt-8">
            <span className="block transform skew-x-6">
              {loading ? "AUTHENTICATING..." : "SYSTEM LOGIN"}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
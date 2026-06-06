"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { LayoutDashboard, Ticket, QrCode, LogOut, Users } from "lucide-react";
import "../globals.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [adminName, setAdminName] = useState("");

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem("admin_token");
    const name = localStorage.getItem("admin_name");

    // Jika bukan halaman login dan tidak ada token, tendang ke login
    if (!isLoginPage && !token) {
      router.push("/admin/login");
    } else if (token) {
      setAdminName(name || "Admin");
      // Set Global Header Axios untuk Sanctum
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [pathname, router, isLoginPage]);

  const handleLogout = async () => {
    try {
      await api.post("/admin/logout");
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_name");
      delete api.defaults.headers.common["Authorization"];
      router.push("/admin/login");
    }
  };

  if (!isClient) return null;

  // Jika di halaman login, jangan tampilkan sidebar
  if (isLoginPage) {
    return (
      <html lang="id">
        <body>
          <div className="min-h-screen bg-hermes font-sans selection:bg-torch-red selection:text-white">
            {children}
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="id">
      <body>
        <div className="min-h-screen flex bg-[#0f1219] text-light-gray font-sans selection:bg-avg-green selection:text-white">
      
      {/* ================= SIDEBAR BRUTALIST ================= */}
      <aside className="w-72 bg-dark-heather border-r border-white/5 flex flex-col relative z-20 shadow-[8px_0_24px_rgba(0,0,0,0.5)]">
        {/* Brand Area */}
        <div className="h-24 flex items-center px-8 border-b border-white/5 bg-black/20">
          <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">
            NOBAR <br/><span className="text-avg-green">ADMIN.</span>
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-8 px-4 space-y-2">
          <p className="px-4 text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">Core Modules</p>
          
          <NavLink href="/admin/dashboard" icon={<LayoutDashboard size={18} />} label="Jadwal Match" active={pathname === "/admin/dashboard"} />
          <NavLink href="/admin/transactions" icon={<Users size={18} />} label="Data Transaksi" active={pathname === "/admin/transactions"} />
          
          <div className="my-6 border-t border-white/5 mx-4"></div>
          <p className="px-4 text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">Gatekeeper</p>
          
          <NavLink href="/admin/scanner" icon={<QrCode size={18} />} label="Ticket Scanner" active={pathname === "/admin/scanner"} />
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-white/5 bg-black/20">
          <div className="flex items-center justify-between bg-white/5 p-4 border border-white/10">
            <div>
              <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest mb-1">Logged in as</p>
              <p className="text-sm font-black text-white uppercase truncate w-32">{adminName}</p>
            </div>
            <button onClick={handleLogout} className="p-2 bg-torch-red/20 text-torch-red hover:bg-torch-red hover:text-white transition-colors" title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="flex-1 flex flex-col relative h-screen overflow-hidden">
        {/* Background Texture */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,rgba(255,255,255,0.01)_5px,rgba(255,255,255,0.01)_10px)] pointer-events-none z-0"></div>
        
        {/* Topbar */}
        <header className="h-24 bg-dark-heather/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-10 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-avg-green animate-pulse"></div>
            <span className="text-[10px] font-black text-avg-green uppercase tracking-[0.2em]">System Online</span>
          </div>
          <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] bg-black/30 px-4 py-2 border border-white/5">
            Solo Paragon Venue
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-10 relative z-10">
          {children}
        </div>
      </main>
      </div>
      </body>
    </html>
  );
}

// Sub-komponen Tombol Sidebar
function NavLink({ href, icon, label, active }: { href: string, icon: React.ReactNode, label: string, active: boolean }) {
  return (
    <Link href={href} className={`flex items-center gap-4 px-4 py-3 text-sm font-black uppercase tracking-wider transition-all transform ${active ? 'bg-avg-green text-white skew-x-[-5deg] shadow-[4px_4px_0px_rgba(0,0,0,0.3)]' : 'text-light-gray hover:bg-white/5 hover:text-white hover:translate-x-1'}`}>
      <span className={active ? 'transform skew-x-[5deg]' : ''}>{icon}</span>
      <span className={active ? 'transform skew-x-[5deg]' : ''}>{label}</span>
    </Link>
  );
}
import Link from "next/link";
import { LayoutDashboard, CalendarDays, Users, QrCode } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-light-gray">
      {/* Sidebar Admin */}
      <aside className="w-64 bg-hermes text-white flex flex-col shadow-xl hidden md:flex">
        <div className="p-6 text-center border-b border-white/20">
          <h2 className="font-bold text-2xl text-avg-green">Admin Panel</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link href="/admin/matches" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition">
            <CalendarDays className="w-5 h-5" /> Jadwal Match
          </Link>
          <Link href="/admin/transactions" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition">
            <Users className="w-5 h-5" /> Transaksi
          </Link>
          <Link href="/admin/scanner" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition">
            <QrCode className="w-5 h-5" /> Gate Scanner
          </Link>
        </nav>
      </aside>

      {/* Konten Admin */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
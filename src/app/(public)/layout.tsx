import { Ticket } from "lucide-react";
import Link from "next/link";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar Publik */}
      <header className="bg-hermes text-white py-4 px-6 md:px-12 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <Ticket className="w-6 h-6 text-avg-green" />
            <span className="font-bold text-xl tracking-wide">TicketGo.</span>
          </Link>
          <nav className="text-sm font-medium">
            <Link href="/" className="hover:text-avg-green transition">Jadwal Match</Link>
          </nav>
        </div>
      </header>

      {/* Konten Halaman */}
      <main className="flex-grow w-full max-w-7xl mx-auto p-6 md:p-12">
        {children}
      </main>

      {/* Footer Publik */}
      <footer className="bg-dark-heather text-light-gray py-6 text-center text-sm">
        <p>&copy; 2026 TicketGo - Nobar Piala Dunia Solo Paragon. All rights reserved.</p>
      </footer>
    </div>
  );
}
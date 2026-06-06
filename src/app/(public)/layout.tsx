import { Trophy } from "lucide-react";
import Link from "next/link";
import "../globals.css";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <div className="min-h-screen flex flex-col bg-hermes text-light-gray font-sans selection:bg-avg-green selection:text-white">
      <header className="w-full z-50 py-6 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-4 md:gap-6 group">
            {/* Logo Solo Paragon dengan efek tembus pandang untuk background hitam */}
            <img src="/images/SOLOPARAGON.webp" alt="Solo Paragon" className="h-8 md:h-12 mix-blend-screen object-contain hover:opacity-80 transition" />
            
            <div className="w-px h-8 bg-white/20 hidden md:block"></div>
            
            <Link href="/" className="items-center gap-3 hidden md:flex hover:opacity-80 transition">
              <div className="bg-torch-red p-2 rounded-lg group-hover:scale-110 transition">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <span className="font-black text-xl md:text-2xl tracking-tighter text-white uppercase italic">
                Nobar <span className="text-avg-green">Piala Dunia</span>
              </span>
            </Link>
          </div>

          <nav className="text-sm font-bold uppercase tracking-widest text-white flex gap-6">
            <Link href="/" className="hover:text-avg-green transition">Jadwal</Link>
            <Link href="#" className="hover:text-avg-green transition">Berita</Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow w-full max-w-7xl mx-auto px-6 md:px-12 pb-12">
        {children}
      </main>

      <footer className="border-t border-light-gray/10 py-8 text-center text-xs font-semibold tracking-widest uppercase text-light-gray/50">
        <p>&copy; 2026 NOBAR PIALA DUNIA SOLO PARAGON.</p>
      </footer>
    </div>
      </body>
    </html>
  );
}
import api from "@/lib/axios";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";
import { Flame, MapPin } from "lucide-react";

type Match = {
  id: string;
  team_a: string;
  team_b: string;
  flag_a_url: string;
  flag_b_url: string;
  match_date: string;
  venue: string;
  price: number;
  quota: number;
  is_hot_match: boolean;
};

async function getMatches() {
  try {
    const response = await api.get('/matches');
    return response.data;
  } catch (error) {
    return { hot_matches: [], upcoming_matches: [] };
  }
}

export default async function Home() {
  const { hot_matches, upcoming_matches } = await getMatches();
  const mainMatch = hot_matches.length > 0 ? hot_matches[0] : upcoming_matches[0];

  return (
    <div className="w-full relative">
      
      {/* GLOBAL WATERMARK (Piala Dunia Vibe) - Fixed di background */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center opacity-[0.02] z-0 overflow-hidden">
        <h1 className="text-[25vw] font-black italic text-white whitespace-nowrap transform -rotate-[10deg] tracking-tighter">
          WORLDCUP
        </h1>
      </div>

      <div className="relative z-10">
        {/* ================= HERO SECTION (Aggressive Sporty Design) ================= */}
        <div className="relative bg-dark-heather p-8 md:p-16 shadow-2xl mb-12 flex flex-col md:flex-row items-center justify-between border-l-8 border-avg-green overflow-hidden">
          
          {/* Background Textures & Watermarks */}
          <div className="absolute right-0 top-0 w-full md:w-1/2 h-full bg-[repeating-linear-gradient(-45deg,transparent,transparent_10px,rgba(255,255,255,0.03)_10px,rgba(255,255,255,0.03)_20px)] pointer-events-none"></div>
          <div className="absolute -right-10 -bottom-16 text-[180px] font-black text-white/[0.03] italic leading-none pointer-events-none tracking-tighter">
            2026
          </div>

          {/* Kiri: Teks & Tombol */}
          <div className="w-full md:w-3/5 relative z-10">
            <div className="inline-flex items-center gap-2 bg-torch-red text-white px-4 py-1 text-[10px] font-black tracking-[0.2em] uppercase mb-8 transform -skew-x-12">
              <span className="transform skew-x-12 flex items-center gap-2"><Flame className="w-3 h-3" /> HOT MATCH</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter leading-[0.85] drop-shadow-lg">
              ROAD TO
            </h1>
            <h1 className="text-6xl md:text-8xl font-black text-avg-green italic tracking-tighter leading-[0.85] mb-6 drop-shadow-lg">
              GLORY
            </h1>
            
            <p className="text-light-gray mb-10 max-w-md text-sm font-semibold leading-relaxed border-l-2 border-white/20 pl-4 uppercase tracking-wide">
              Saksikan pertarungan epik secara langsung di <strong className="text-white">Solo Paragon</strong>. Atmosfer stadion di depan mata Anda.
            </p>

            {mainMatch && (
              <Link href={`/checkout/${mainMatch.id}`} className="inline-flex items-center gap-3 bg-avg-green text-white font-black px-8 py-4 uppercase tracking-widest transition-all hover:bg-white hover:text-avg-green border-2 border-transparent hover:border-avg-green transform -skew-x-6 shadow-[8px_8px_0px_rgba(0,0,0,0.3)] hover:shadow-none hover:translate-x-2 hover:translate-y-2">
                <span className="transform skew-x-6">AMANKAN KURSI</span>
              </Link>
            )}
          </div>

          {/* Kanan: Floating Card (Brutalist) */}
          {mainMatch && (
            <div className="hidden md:block absolute right-12 top-1/2 -translate-y-1/2 w-[340px] bg-hermes border border-white/20 transform -skew-x-6 shadow-[16px_16px_0px_rgba(0,0,0,0.5)] z-20">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-torch-red"></div>
              {/* Counter-skew konten agar tetap bisa dibaca normal */}
              <div className="p-8 transform skew-x-6">
                <div className="text-[9px] text-avg-green text-center uppercase font-black tracking-[0.3em] mb-6 flex items-center justify-center gap-4">
                  <div className="h-[2px] bg-avg-green/30 flex-grow"></div>
                  {format(new Date(mainMatch.match_date), "dd MMM yyyy", { locale: id })}
                  <div className="h-[2px] bg-avg-green/30 flex-grow"></div>
                </div>
                
                <div className="flex justify-between items-center text-center">
                  <div className="flex flex-col items-center">
                    <div className="p-1 bg-white/5 rounded-full mb-3">
                      <img src={mainMatch.flag_a_url} className="w-16 h-16 rounded-full object-cover border-2 border-white/20 shadow-inner" />
                    </div>
                    <span className="font-black text-white text-sm uppercase tracking-wider">{mainMatch.team_a}</span>
                  </div>
                  <span className="text-4xl font-black text-torch-red italic drop-shadow-md">VS</span>
                  <div className="flex flex-col items-center">
                    <div className="p-1 bg-white/5 rounded-full mb-3">
                      <img src={mainMatch.flag_b_url} className="w-16 h-16 rounded-full object-cover border-2 border-white/20 shadow-inner" />
                    </div>
                    <span className="font-black text-white text-sm uppercase tracking-wider">{mainMatch.team_b}</span>
                  </div>
                </div>
                <div className="mt-6 text-center text-[10px] text-white/40 font-black uppercase tracking-widest bg-black/20 py-2">
                  KICK-OFF {format(new Date(mainMatch.match_date), "HH:mm")} WIB
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================= SLOT SPONSOR ================= */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px bg-white/10 flex-grow"></div>
            <h4 className="text-center text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Official Partners</h4>
            <div className="h-px bg-white/10 flex-grow"></div>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-30 grayscale hover:grayscale-0 transition-all duration-300">
            <div className="text-2xl font-black text-white italic tracking-tighter">SPONSOR<span className="text-torch-red">1</span></div>
            <div className="text-2xl font-black text-white italic tracking-tighter">SPONSOR<span className="text-torch-red">2</span></div>
            <div className="text-2xl font-black text-white italic tracking-tighter">SPONSOR<span className="text-torch-red">3</span></div>
          </div>
        </div>

        {/* ================= JADWAL PERTANDINGAN ================= */}
        <div className="mb-8 flex items-center gap-4">
          <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase">
            <span className="text-white">Jadwal</span> <span className="text-avg-green">Pertandingan</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hot_matches.map((match: Match) => <SportyMatchCard key={match.id} match={match} />)}
          {upcoming_matches.map((match: Match) => <SportyMatchCard key={match.id} match={match} />)}
        </div>
      </div>
    </div>
  );
}

// Komponen Card Jadwal (Desain Tajam, Ticket-Style)
function SportyMatchCard({ match }: { match: Match }) {
  const isSoldOut = match.quota <= 0;

  return (
    <div className="bg-dark-heather border border-white/10 flex flex-col hover:border-avg-green transition-colors relative overflow-hidden group">
      
      {/* Background Pattern on Hover */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,rgba(255,255,255,0.02)_5px,rgba(255,255,255,0.02)_10px)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

      {/* Header Info */}
      <div className="px-6 py-3 flex justify-between items-center border-b border-white/5 bg-black/20">
        <span className="text-[10px] font-black text-white flex items-center gap-2 uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-torch-red animate-pulse"></span> 
          {format(new Date(match.match_date), "dd MMM • HH:mm", { locale: id })}
        </span>
        <span className="text-[9px] font-black text-avg-green uppercase tracking-[0.2em] flex items-center gap-1">
          <MapPin className="w-3 h-3"/> {match.venue}
        </span>
      </div>

      {/* Body: Tim */}
      <div className="p-6 flex flex-col gap-5 relative z-10">
        <div className="flex items-center gap-4">
          <img src={match.flag_a_url} className="w-12 h-12 rounded-full border-[3px] border-dark-heather shadow-[0_0_0_1px_rgba(255,255,255,0.1)] object-cover" />
          <span className="font-black text-white text-2xl uppercase tracking-tighter italic">{match.team_a}</span>
        </div>
        
        <div className="w-full flex items-center gap-3">
          <div className="h-[2px] bg-white/5 flex-grow"></div>
          <span className="font-black italic text-xs text-white/20 px-2">VS</span>
          <div className="h-[2px] bg-white/5 flex-grow"></div>
        </div>
        
        <div className="flex items-center gap-4">
          <img src={match.flag_b_url} className="w-12 h-12 rounded-full border-[3px] border-dark-heather shadow-[0_0_0_1px_rgba(255,255,255,0.1)] object-cover" />
          <span className="font-black text-white text-2xl uppercase tracking-tighter italic">{match.team_b}</span>
        </div>
      </div>

      {/* Footer: Harga & Tombol */}
      <div className="px-6 pb-6 pt-2 flex justify-between items-end mt-auto relative z-10">
        <div>
          <p className="text-[8px] text-white/40 font-black uppercase tracking-[0.2em] mb-1">Mulai Dari</p>
          <span className="text-xl font-black text-avg-green">Rp {match.price.toLocaleString('id-ID')}</span>
        </div>
        {isSoldOut ? (
          <button disabled className="bg-white/5 text-white/30 font-black px-6 py-2.5 text-[10px] uppercase tracking-widest cursor-not-allowed border border-white/5 skew-x-[-10deg]">
            <span className="block skew-x-[10deg]">SOLD OUT</span>
          </button>
        ) : (
          <Link href={`/checkout/${match.id}`} className="bg-torch-red text-white font-black px-6 py-2.5 text-[10px] uppercase tracking-widest transition-all hover:bg-white hover:text-torch-red skew-x-[-10deg] shadow-[4px_4px_0px_rgba(0,0,0,0.5)] hover:shadow-none hover:translate-x-1 hover:translate-y-1">
            <span className="block skew-x-[10deg]">BELI TIKET</span>
          </Link>
        )}
      </div>
    </div>
  );
}
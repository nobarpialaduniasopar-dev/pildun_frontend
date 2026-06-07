import api from "@/lib/axios";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";
import { Flame, MapPin, Zap } from "lucide-react";
import Countdown from "@/components/Countdown";
import OngoingMatchCarousel from "@/components/OngoingMatchCarousel";
import HotMatchSection from "@/components/HotMatchSection";

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

async function getStandings() {
  try {
    const response = await api.get('/standings');
    return response.data;
  } catch (error) {
    return { standings: {}, last_updated: "" };
  }
}

const MatchBox = () => (
  <div className="w-[90px] md:w-[100px] bg-white/5 border border-white/20 transform -skew-x-3 hover:border-avg-green transition-all relative z-10 text-[8px] shadow-[4px_4px_0_rgba(0,0,0,0.3)] my-1 shrink-0">
    <div className="px-1.5 py-1 border-b border-white/10 flex justify-between items-center bg-black/40">
      <span className="font-black text-white truncate uppercase">TBD</span>
      <span className="font-black text-avg-green">-</span>
    </div>
    <div className="px-1.5 py-1 flex justify-between items-center opacity-50">
      <span className="font-black text-white truncate uppercase">TBD</span>
      <span className="font-black text-white">-</span>
    </div>
  </div>
);

const RoundColumn = ({ matches }: { matches: number }) => (
  <div className="flex flex-col justify-around relative h-full shrink-0 py-1">
    {Array.from({ length: matches }).map((_, i) => (
      <MatchBox key={i} />
    ))}
  </div>
);

export default async function Home() {
  const { hot_matches, upcoming_matches } = await getMatches();
  const { standings, last_updated } = await getStandings();
  const mainMatch = hot_matches.length > 0 ? hot_matches[0] : upcoming_matches[0];

  return (
    <div className="w-full relative">
      
      {/* CSS Animasi Carousel Ken Burns */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes crossfade1 {
          0%, 45% { opacity: 0.8; transform: scale(1); }
          50%, 95% { opacity: 0; transform: scale(1.05); }
          100% { opacity: 0.8; transform: scale(1); }
        }
        @keyframes crossfade2 {
          0%, 45% { opacity: 0; transform: scale(1.05); }
          50%, 95% { opacity: 0.8; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.05); }
        }
      `}} />

      <div className="fixed inset-0 pointer-events-none flex items-center justify-center opacity-[0.02] z-0 overflow-hidden">
        <h1 className="text-[25vw] font-black italic text-white whitespace-nowrap transform -rotate-[10deg] tracking-tighter">
          WORLDCUP
        </h1>
      </div>

      <div className="relative z-10">
        
        {/* ================= HERO SECTION ================= */}
        <div className="relative bg-dark-heather p-8 md:p-16 shadow-2xl mb-12 flex flex-col md:flex-row items-center justify-between border-l-8 border-avg-green overflow-hidden group">
          
          <div className="absolute right-0 top-0 w-full md:w-1/2 h-full bg-[repeating-linear-gradient(-45deg,transparent,transparent_10px,rgba(255,255,255,0.03)_10px,rgba(255,255,255,0.03)_20px)] pointer-events-none z-10"></div>
          
          {/* CAROUSEL VENUE BACKGROUND (Kanan) */}
          <div className="absolute top-0 right-0 w-full md:w-[60%] h-full hidden md:block overflow-hidden pointer-events-none z-0">
            {/* Gambar Pool 1 */}
            <div className="absolute inset-0 bg-[url('/images/POOL1.webp')] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-1000" 
                 style={{ animation: 'crossfade1 12s infinite ease-in-out', maskImage: 'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,1) 100%)', WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,1) 100%)' }}></div>
            {/* Gambar Pool 2 */}
            <div className="absolute inset-0 bg-[url('/images/POOL2.webp')] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-1000" 
                 style={{ animation: 'crossfade2 12s infinite ease-in-out', maskImage: 'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,1) 100%)', WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,1) 100%)' }}></div>
            
            {/* Gradient shadow untuk transisi mulus ke bawah */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-heather via-transparent to-transparent z-10"></div>
          </div>

          {/* Kiri: Teks & Tombol */}
          <div className="w-full md:w-1/2 relative z-20">
            <Countdown />
            
            <div className="inline-flex items-center gap-2 bg-avg-green text-white px-4 py-1 text-[10px] font-black tracking-[0.2em] uppercase mb-8 transform -skew-x-12">
              <span className="transform skew-x-12 flex items-center gap-2">WORLD CUP 2026</span>
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

          {/* Kanan: Floating Card Carousel (Client Component) */}
          <OngoingMatchCarousel matches={[...hot_matches, ...upcoming_matches]} />
        </div>

        {/* ================= HOT MATCH SECTION ================= */}
        <HotMatchSection initialMatches={hot_matches} />

        {/* ================= SPONSOR UTAMA (PLATINUM) ================= */}
          <div className="w-full mb-12 border-2 border-dashed border-white/20 bg-white/5 py-8 px-6 flex flex-col items-center justify-center group hover:border-avg-green transition-colors cursor-pointer transform -skew-x-3">
            <span className="text-white/40 font-black tracking-[0.3em] text-sm md:text-base uppercase group-hover:text-avg-green transition-colors transform skew-x-3">
              [ PLATINUM SPONSOR SPACE - 1200x200 ]
            </span>
            <span className="text-white/20 text-xs mt-2 font-semibold transform skew-x-3">Your Premium Brand Here</span>
          </div>

          {/* ================= KLASEMEN GRUP (BRUTALIST) ================= */}
          {Object.keys(standings).length > 0 && (
            <div className="mb-16">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-white/10 pb-4">
                <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase">
                  <span className="text-white">Group</span> <span className="text-avg-green">Standings</span>
                </h2>
                <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] bg-white/5 px-3 py-1 border border-white/10 self-start md:self-auto">
                  LAST UPDATE: {last_updated}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(standings).map(([groupName, teams]: [string, any]) => (
                  <div key={groupName} className="bg-dark-heather border border-white/10 overflow-hidden hover:border-white/30 transition-colors">
                    <div className="bg-white/5 border-b border-white/10 px-4 py-2 flex justify-between items-center">
                      <span className="font-black text-avg-green text-sm uppercase tracking-widest">{groupName}</span>
                      <div className="flex text-[9px] text-white/40 font-black uppercase tracking-widest">
                        <span className="w-8 text-center border-r border-white/10">P</span>
                        <span className="w-8 text-center border-r border-white/10">GD</span>
                        <span className="w-8 text-center text-avg-green">PTS</span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      {teams.sort((a:any, b:any) => b.points - a.points || (b.goals_for - b.goals_against) - (a.goals_for - a.goals_against)).map((team: any, index: number) => (
                        <div key={team.id} className={`flex items-center justify-between px-4 py-3 ${index !== teams.length - 1 ? 'border-b border-white/5' : ''} ${index < 2 ? 'bg-avg-green/5' : ''}`}>
                          <div className="flex items-center gap-3">
                            <span className={`text-[10px] font-black w-4 text-center ${index < 2 ? 'text-avg-green' : 'text-white/30'}`}>{index + 1}</span>
                            {team.flag_url ? (
                              <img src={team.flag_url} className="w-5 h-5 rounded-full object-cover" alt="" />
                            ) : (
                              <div className="w-5 h-5 rounded-full bg-white/10"></div>
                            )}
                            <span className={`font-bold text-sm uppercase tracking-wider ${index < 2 ? 'text-white' : 'text-white/70'}`}>{team.team_name}</span>
                          </div>
                          <div className="flex text-xs font-black">
                            <span className="w-8 text-center text-white/40 border-r border-white/5 py-1">{team.played}</span>
                            <span className="w-8 text-center text-white/40 border-r border-white/5 py-1">{(team.goals_for - team.goals_against) > 0 ? `+${team.goals_for - team.goals_against}` : team.goals_for - team.goals_against}</span>
                            <span className="w-8 text-center text-avg-green py-1">{team.points}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= BAGAN FASE GUGUR (KNOCKOUT BRACKET) ================= */}
          <div className="mb-16 relative bg-dark-heather border border-white/10 py-8 shadow-[12px_12px_0_rgba(0,0,0,0.5)] overflow-hidden flex flex-col items-center">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,transparent,transparent_5px,rgba(255,255,255,0.01)_5px,rgba(255,255,255,0.01)_10px)] pointer-events-none"></div>
            
            <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase mb-8 text-center relative z-10">
              <span className="text-white">World</span> <span className="text-torch-red">Bracket</span>
            </h2>

            {/* Kontainer Utama Bracket - MATEMATIKA ABSOLUT & CENTERED */}
            <div 
              className="w-full relative z-10" 
              style={{ height: 'clamp(200px, 45vw, 550px)' }}
            >
              <div 
                className="absolute top-0 left-1/2 origin-top"
                style={{ 
                  width: '1000px',
                  marginLeft: '-500px', /* Menahan elemen kompak di tengah layar */
                  transform: 'scale(min(1, calc(100vw / 1050)))' 
                }}
              >
                <div className="flex flex-nowrap justify-between items-stretch gap-1 px-1 w-full h-[500px]">
                
                {/* LEFT SIDE (Round of 32 -> SF) */}
                <div className="flex flex-1 justify-between gap-1 shrink-0">
                  <RoundColumn matches={8} />
                  <RoundColumn matches={4} />
                  <RoundColumn matches={2} />
                  <RoundColumn matches={1} />
                </div>

                {/* CENTER (GRAND FINAL) */}
                <div className="flex flex-col justify-center px-1 relative z-20 shrink-0 w-[160px]">
                  <div className="w-full bg-torch-red/10 border-2 border-torch-red transform -skew-x-3 shadow-[8px_8px_0_rgba(255,59,48,0.2)]">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-torch-red text-white text-[8px] font-black tracking-widest px-3 py-1 uppercase whitespace-nowrap">
                      Grand Final
                    </div>
                    <div className="px-3 py-3 border-b border-torch-red/30 flex justify-between items-center bg-black/40">
                      <span className="font-black text-white text-[10px] uppercase truncate">TBD</span>
                      <span className="font-black text-avg-green text-sm animate-pulse">-</span>
                    </div>
                    <div className="px-3 py-3 flex justify-between items-center opacity-50">
                      <span className="font-black text-white text-[10px] uppercase truncate">TBD</span>
                      <span className="font-black text-white text-sm">-</span>
                    </div>
                  </div>
                </div>

                {/* RIGHT SIDE (SF <- Round of 32) */}
                <div className="flex flex-1 justify-between gap-1 flex-row-reverse shrink-0">
                  <RoundColumn matches={8} />
                  <RoundColumn matches={4} />
                  <RoundColumn matches={2} />
                  <RoundColumn matches={1} />
                </div>
              </div>
            </div>
          </div>
            
            <p className="text-center text-[10px] text-white/30 font-black tracking-[0.3em] uppercase mt-4 relative z-10 w-full">
              [ 32 TEAMS ADVANCE - ROAD TO GLORY ]
            </p>
          </div>

          {/* ================= JADWAL PERTANDINGAN (LIMIT 9) ================= */}
        {upcoming_matches.length > 0 && (
          <div className="mb-16">
            <div className="mb-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-white/10 pb-4">
              <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase">
                <span className="text-white">Jadwal</span> <span className="text-avg-green">Pertandingan</span>
              </h2>
              <Link href="/matches" className="bg-avg-green hover:bg-white text-white hover:text-avg-green font-black px-6 py-2 uppercase tracking-widest transition-all transform -skew-x-12 border-2 border-transparent hover:border-avg-green shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
                <span className="block transform skew-x-12">SEMUA MATCH</span>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcoming_matches.slice(0, 9).map((match: Match) => <SportyMatchCard key={match.id} match={match} />)}
            </div>
          </div>
        )}

        {/* ================= SPONSOR PENDUKUNG (GOLD & SILVER) ================= */}
        <div className="mt-16 pt-12 border-t border-white/10 pb-8">
          <h3 className="text-center text-xl font-black italic text-white/50 uppercase tracking-widest mb-8">
            Didukung Oleh
          </h3>
          
          {/* Gold Tier - Medium */}
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            {[1, 2].map((i) => (
              <div key={`gold-${i}`} className="w-48 md:w-64 h-24 border-2 border-dashed border-white/15 bg-white/5 flex flex-col items-center justify-center group hover:border-[#FFD700] transition-colors cursor-pointer transform -skew-x-3">
                <span className="text-white/30 font-black tracking-widest text-xs group-hover:text-[#FFD700] transition-colors transform skew-x-3">[ GOLD SPONSOR ]</span>
              </div>
            ))}
          </div>

          {/* Silver Tier - Small */}
          <div className="flex flex-wrap justify-center gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={`silver-${i}`} className="w-32 md:w-40 h-16 border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center group hover:border-[#C0C0C0] transition-colors cursor-pointer transform -skew-x-3">
                <span className="text-white/20 font-black tracking-wider text-[10px] group-hover:text-[#C0C0C0] transition-colors transform skew-x-3">[ SILVER ]</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// Komponen Card Jadwal
function SportyMatchCard({ match }: { match: Match }) {
  const isSoldOut = match.quota <= 0;

  return (
    <div className="bg-dark-heather border border-white/10 flex flex-col hover:border-avg-green transition-colors relative overflow-hidden group">
      <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,rgba(255,255,255,0.02)_5px,rgba(255,255,255,0.02)_10px)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

      {/* Header Info - PENGATURAN TRUNCATE VENUE */}
      <div className="px-5 py-3 flex justify-between items-center border-b border-white/5 bg-black/20">
        <span className="text-[10px] font-black text-white flex items-center gap-2 uppercase tracking-widest flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-torch-red animate-pulse"></span> 
          {format(new Date(match.match_date), "dd MMM • HH:mm", { locale: id })}
        </span>
        <span className="text-[9px] font-black text-avg-green uppercase tracking-[0.2em] flex items-center gap-1 max-w-[50%] justify-end" title={match.venue}>
          <MapPin className="w-3 h-3 flex-shrink-0"/> 
          <span className="truncate">{match.venue}</span>
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

// Komponen Card Hot Match (Desain Menggelegar)
function HotMatchCard({ match }: { match: Match }) {
  const isSoldOut = match.quota <= 0;

  return (
    <div className="bg-torch-red/5 border-2 border-torch-red flex flex-col hover:bg-torch-red/10 transition-all relative overflow-hidden group shadow-[12px_12px_0px_rgba(255,59,48,0.3)] hover:shadow-[16px_16px_0px_rgba(255,59,48,0.5)] hover:-translate-y-1 hover:-translate-x-1">
      <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,59,48,0.05)_10px,rgba(255,59,48,0.05)_20px)] pointer-events-none"></div>
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-torch-red/20 rounded-full blur-3xl pointer-events-none group-hover:bg-torch-red/40 transition-colors"></div>

      <div className="px-6 py-4 flex justify-between items-center border-b border-torch-red/30 bg-black/40 relative z-10">
        <span className="text-xs font-black text-white flex items-center gap-2 uppercase tracking-widest">
          <Zap className="w-4 h-4 text-torch-red" /> 
          {format(new Date(match.match_date), "dd MMM • HH:mm", { locale: id })}
        </span>
        <span className="text-[10px] font-black text-torch-red uppercase tracking-[0.2em] flex items-center gap-1 max-w-[50%] justify-end" title={match.venue}>
          <MapPin className="w-3 h-3 flex-shrink-0"/> 
          <span className="truncate">{match.venue}</span>
        </span>
      </div>

      <div className="p-8 flex flex-col gap-6 relative z-10">
        <div className="flex items-center gap-6">
          <img src={match.flag_a_url} className="w-16 h-16 rounded-full border-4 border-torch-red/50 shadow-[0_0_20px_rgba(255,59,48,0.3)] object-cover" />
          <span className="font-black text-white text-4xl uppercase tracking-tighter italic drop-shadow-md">{match.team_a}</span>
        </div>
        
        <div className="w-full flex items-center gap-4">
          <div className="h-[2px] bg-torch-red/30 flex-grow"></div>
          <span className="font-black italic text-lg text-torch-red px-2 animate-pulse">VS</span>
          <div className="h-[2px] bg-torch-red/30 flex-grow"></div>
        </div>
        
        <div className="flex items-center gap-6">
          <img src={match.flag_b_url} className="w-16 h-16 rounded-full border-4 border-torch-red/50 shadow-[0_0_20px_rgba(255,59,48,0.3)] object-cover" />
          <span className="font-black text-white text-4xl uppercase tracking-tighter italic drop-shadow-md">{match.team_b}</span>
        </div>
      </div>

      <div className="px-8 pb-8 pt-4 flex justify-between items-end mt-auto relative z-10">
        <div>
          <p className="text-[10px] text-white/60 font-black uppercase tracking-[0.2em] mb-1">Mulai Dari</p>
          <span className="text-2xl font-black text-white drop-shadow-[0_2px_10px_rgba(255,59,48,0.5)]">Rp {match.price.toLocaleString('id-ID')}</span>
        </div>
        {isSoldOut ? (
          <button disabled className="bg-black/50 text-white/30 font-black px-8 py-3 text-xs uppercase tracking-widest cursor-not-allowed border border-white/10 skew-x-[-10deg]">
            <span className="block skew-x-[10deg]">SOLD OUT</span>
          </button>
        ) : (
          <Link href={`/checkout/${match.id}`} className="bg-torch-red text-white font-black px-8 py-3 text-xs uppercase tracking-widest transition-all hover:bg-white hover:text-torch-red skew-x-[-10deg] shadow-[6px_6px_0px_rgba(0,0,0,0.8)] hover:shadow-none hover:translate-x-1 hover:translate-y-1">
            <span className="block skew-x-[10deg]">AMANKAN KURSI</span>
          </Link>
        )}
      </div>
    </div>
  );
}
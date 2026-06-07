"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Flame, MapPin, Zap } from "lucide-react";

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

export default function HotMatchSection({ initialMatches }: { initialMatches: Match[] }) {
  const [visibleCount, setVisibleCount] = useState(4);

  // Sortir otomatis dari tanggal terdekat
  const sortedMatches = [...initialMatches].sort(
    (a, b) => new Date(a.match_date).getTime() - new Date(b.match_date).getTime()
  );
  
  const visibleMatches = sortedMatches.slice(0, visibleCount);

  if (sortedMatches.length === 0) return null;

  return (
    <div className="mb-16">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase flex items-center gap-4">
          <Flame className="w-10 h-10 text-torch-red animate-pulse" />
          <span className="text-white">HOT</span> <span className="text-torch-red">MATCHES</span>
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {visibleMatches.map((match) => <HotMatchCard key={match.id} match={match} />)}
      </div>

      {visibleCount < sortedMatches.length && (
        <div className="mt-8 flex justify-center">
          <button 
            onClick={() => setVisibleCount(prev => prev + 4)}
            className="bg-transparent border-2 border-torch-red text-torch-red hover:bg-torch-red hover:text-white font-black px-8 py-3 uppercase tracking-widest transition-all transform -skew-x-12 shadow-[4px_4px_0_rgba(255,59,48,0.3)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
          >
            <span className="block transform skew-x-12">SELENGKAPNYA</span>
          </button>
        </div>
      )}
    </div>
  );
}

// Komponen Card Hot Match
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
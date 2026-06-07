"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";

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
};

export default function OngoingMatchCarousel({ matches }: { matches: Match[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter Match HARI INI
  const todayStr = new Date().toLocaleDateString('id-ID');
  const ongoingMatches = matches.filter(
    (m) => new Date(m.match_date).toLocaleDateString('id-ID') === todayStr
  );

  // Jika tidak ada match hari ini, fallback ke match pertama yang tersedia
  const displayMatches = ongoingMatches.length > 0 ? ongoingMatches : matches.slice(0, 1);
  const isOngoing = ongoingMatches.length > 0;

  // Auto-slide jika lebih dari 1
  useEffect(() => {
    if (displayMatches.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayMatches.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [displayMatches.length]);

  if (!mounted || displayMatches.length === 0) return null;

  const currentMatch = displayMatches[currentIndex];

  return (
    <div className="hidden md:block absolute right-12 top-1/2 -translate-y-1/2 w-[340px] bg-hermes/90 backdrop-blur-sm border border-white/20 transform -skew-x-6 shadow-[16px_16px_0px_rgba(0,0,0,0.5)] z-30 pointer-events-auto transition-all duration-500">
      <div className={`absolute top-0 left-0 w-full h-1.5 ${isOngoing ? 'bg-avg-green' : 'bg-torch-red'}`}></div>
      
      {/* LABEL ABSOLUT */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black border border-white/20 text-white text-[9px] font-black tracking-widest px-4 py-1 uppercase whitespace-nowrap z-40 transform skew-x-6 shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
        <span className={isOngoing ? 'text-avg-green animate-pulse inline-block' : 'text-torch-red inline-block'}>
          {isOngoing ? '• ON GOING MATCH' : 'NEXT MATCH'}
        </span>
      </div>

      <div className="p-8 transform skew-x-6 mt-2">
        <div className="text-[9px] text-white/50 text-center uppercase font-black tracking-[0.3em] mb-6 flex items-center justify-center gap-4">
          <div className="h-[2px] bg-white/10 flex-grow"></div>
          {format(new Date(currentMatch.match_date), "dd MMM yyyy", { locale: id })}
          <div className="h-[2px] bg-white/10 flex-grow"></div>
        </div>
        
        <div key={currentMatch.id} className="flex justify-between items-center text-center animate-in fade-in duration-500">
          <div className="flex flex-col items-center w-[40%]">
            <div className="p-1 bg-white/5 rounded-full mb-3">
              <img src={currentMatch.flag_a_url} className="w-16 h-16 rounded-full object-cover border-2 border-white/20 shadow-inner" alt={currentMatch.team_a} />
            </div>
            <span className="font-black text-white text-sm uppercase tracking-wider truncate w-full">{currentMatch.team_a}</span>
          </div>
          <span className={`text-4xl font-black italic drop-shadow-md w-[20%] ${isOngoing ? 'text-avg-green' : 'text-torch-red'}`}>VS</span>
          <div className="flex flex-col items-center w-[40%]">
            <div className="p-1 bg-white/5 rounded-full mb-3">
              <img src={currentMatch.flag_b_url} className="w-16 h-16 rounded-full object-cover border-2 border-white/20 shadow-inner" alt={currentMatch.team_b} />
            </div>
            <span className="font-black text-white text-sm uppercase tracking-wider truncate w-full">{currentMatch.team_b}</span>
          </div>
        </div>

        <div className="mt-8 text-center text-[10px] text-white/80 font-black uppercase tracking-widest bg-black/40 py-2 truncate px-2 border border-white/10" title={currentMatch.venue}>
          VENUE: {currentMatch.venue}
        </div>

        <div className="mt-4">
           <Link href={`/checkout/${currentMatch.id}`} className={`block w-full text-center ${isOngoing ? 'bg-avg-green text-white' : 'bg-torch-red text-white'} font-black px-4 py-3 text-[10px] uppercase tracking-widest transition-all hover:bg-white hover:text-black shadow-[4px_4px_0px_rgba(0,0,0,0.5)] hover:shadow-none hover:translate-x-1 hover:translate-y-1`}>
             LIHAT TIKET
           </Link>
        </div>

        {/* Carousel Indicators */}
        {displayMatches.length > 1 && (
           <div className="flex justify-center gap-2 mt-4">
             {displayMatches.map((_, i) => (
               <div key={i} className={`w-2 h-2 transform -skew-x-6 ${i === currentIndex ? (isOngoing ? 'bg-avg-green' : 'bg-torch-red') : 'bg-white/20'}`}></div>
             ))}
           </div>
        )}
      </div>
    </div>
  );
}
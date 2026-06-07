"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";
import { MapPin, Search, ArrowDownAZ, CalendarDays } from "lucide-react";

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

export default function AllMatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  
  // States Filter & Sort
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"date_asc" | "date_desc" | "country_a_z">("date_asc");

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await api.get('/matches');
        // Gabung hot dan upcoming jadi satu array master
        setMatches([...res.data.hot_matches, ...res.data.upcoming_matches]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  // Logika Filter & Sortir Mutlak
  const filteredAndSortedMatches = matches
    .filter(m => 
      m.team_a.toLowerCase().includes(search.toLowerCase()) || 
      m.team_b.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "date_asc") return new Date(a.match_date).getTime() - new Date(b.match_date).getTime();
      if (sortBy === "date_desc") return new Date(b.match_date).getTime() - new Date(a.match_date).getTime();
      if (sortBy === "country_a_z") return a.team_a.localeCompare(b.team_a);
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto py-8">
      {/* Header Brutalist */}
      <div className="bg-dark-heather p-8 border-l-8 border-avg-green shadow-[8px_8px_0_rgba(0,0,0,0.5)] mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic leading-none">
            SEMUA <span className="text-avg-green">MATCH</span>
          </h1>
          <p className="text-white/50 text-xs font-bold uppercase tracking-widest mt-2 border-l-2 border-white/20 pl-3">
            Eksplorasi seluruh jadwal pertandingan Piala Dunia 2026.
          </p>
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Cari Negara..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/40 border border-white/20 text-white pl-10 pr-4 py-3 font-bold uppercase text-xs outline-none focus:border-avg-green"
            />
          </div>
          <div className="relative">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none bg-black/40 border border-white/20 text-white px-4 py-3 font-bold uppercase text-xs outline-none focus:border-avg-green cursor-pointer [&>option]:bg-dark-heather pr-10"
            >
              <option value="date_asc">Waktu Terdekat</option>
              <option value="date_desc">Waktu Terlama</option>
              <option value="country_a_z">Negara (A-Z)</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-avg-green">
              {sortBy.includes("date") ? <CalendarDays className="w-4 h-4" /> : <ArrowDownAZ className="w-4 h-4" />}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 font-black text-white/30 uppercase tracking-widest animate-pulse">MENARIK DATA SERVER...</div>
      ) : filteredAndSortedMatches.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-white/20 font-black text-white/30 uppercase tracking-widest">
          PERTANDINGAN TIDAK DITEMUKAN
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedMatches.map((match) => (
            <SportyMatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}

// Rekomponen Card standar
function SportyMatchCard({ match }: { match: Match }) {
  const isSoldOut = match.quota <= 0;

  return (
    <div className="bg-dark-heather border border-white/10 flex flex-col hover:border-avg-green transition-colors relative overflow-hidden group">
      {match.is_hot_match && (
        <div className="absolute top-4 right-[-30px] bg-torch-red text-white text-[8px] font-black uppercase tracking-widest py-1 px-10 transform rotate-45 shadow-md z-20">
          HOT MATCH
        </div>
      )}
      
      <div className="px-5 py-3 flex justify-between items-center border-b border-white/5 bg-black/20">
        <span className="text-[10px] font-black text-white flex items-center gap-2 uppercase tracking-widest flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-avg-green animate-pulse"></span> 
          {format(new Date(match.match_date), "dd MMM • HH:mm", { locale: id })}
        </span>
        <span className="text-[9px] font-black text-avg-green uppercase tracking-[0.2em] flex items-center gap-1 max-w-[50%] justify-end" title={match.venue}>
          <MapPin className="w-3 h-3 flex-shrink-0"/> 
          <span className="truncate">{match.venue}</span>
        </span>
      </div>

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
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { RefreshCw, Save, Trophy, AlertTriangle } from "lucide-react";

type TeamStanding = {
  id: number;
  group_name: string;
  team_name: string;
  flag_url: string | null;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
  goals_for: number;
  goals_against: number;
};

export default function AdminStandings() {
  const [standings, setStandings] = useState<Record<string, TeamStanding[]>>({});
  const [lastUpdated, setLastUpdated] = useState("");
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const fetchStandings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/standings");
      setStandings(res.data.standings || {});
      setLastUpdated(res.data.last_updated || "Belum pernah sync");
    } catch (err) {
      console.error("Gagal mengambil klasemen", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStandings();
  }, []);

  const handleSync = async () => {
    try {
      setSyncing(true);
      await api.post("/admin/standings/sync");
      await fetchStandings();
      alert("Sync API Eksternal Berhasil!");
    } catch (err) {
      alert("Gagal sync API");
    } finally {
      setSyncing(false);
    }
  };

  const handleUpdate = async (id: number, field: string, value: string) => {
    // Optimistic update
    const newStandings = { ...standings };
    for (const group in newStandings) {
      const teamIndex = newStandings[group].findIndex((t) => t.id === id);
      if (teamIndex > -1) {
        newStandings[group][teamIndex] = { ...newStandings[group][teamIndex], [field]: Number(value) };
        break;
      }
    }
    setStandings(newStandings);

    // Kirim ke backend (bisa dibikin debounced untuk versi aslinya, ini trigger per blur)
    try {
      let teamToUpdate;
      for (const group in newStandings) {
        const found = newStandings[group].find((t) => t.id === id);
        if (found) teamToUpdate = found;
      }
      if(teamToUpdate) {
          await api.put(`/admin/standings/${id}`, teamToUpdate);
      }
    } catch (err) {
      console.error("Gagal update manual");
    }
  };

  if (loading) return <div className="text-white font-black animate-pulse">MEMUAT DATA KLASEMEN...</div>;

  return (
    <div className="space-y-8">
      {/* Header Panel */}
      <div className="bg-dark-heather border border-white/10 p-6 flex items-center justify-between shadow-[8px_8px_0_rgba(0,0,0,0.5)]">
        <div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase flex items-center gap-3">
            <Trophy className="text-avg-green" size={32} />
            Data <span className="text-avg-green">Klasemen</span>
          </h1>
          <p className="text-xs text-white/40 font-bold uppercase tracking-widest mt-2">
            Terakhir Update: {lastUpdated}
          </p>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="bg-avg-green text-white font-black px-6 py-3 uppercase tracking-widest transition-all hover:bg-white hover:text-avg-green transform -skew-x-6 flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw size={16} className={`transform skew-x-6 ${syncing ? 'animate-spin' : ''}`} />
          <span className="transform skew-x-6">{syncing ? 'SYNCING...' : 'SYNC API EKSTERNAL'}</span>
        </button>
      </div>

      {Object.keys(standings).length === 0 && (
         <div className="border border-dashed border-torch-red bg-torch-red/10 p-10 text-center flex flex-col items-center justify-center transform -skew-x-2">
            <AlertTriangle className="text-torch-red mb-4" size={48} />
            <p className="text-torch-red font-black tracking-widest uppercase">Data Klasemen Kosong.</p>
            <p className="text-white/50 text-sm mt-2 font-semibold">Tekan tombol Sync API untuk mengambil data awal, atau seed database Anda.</p>
         </div>
      )}

      {/* Grid Grup */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {Object.entries(standings).map(([groupName, teams]) => (
          <div key={groupName} className="bg-dark-heather border border-white/5 relative overflow-hidden">
            <div className="bg-black/40 border-b border-white/5 p-4 flex justify-between items-center">
              <h2 className="text-xl font-black text-white uppercase tracking-wider">{groupName}</h2>
            </div>
            <div className="p-4 overflow-x-auto">
              <table className="w-full text-left text-sm text-white/70">
                <thead className="text-[10px] uppercase font-black tracking-widest text-white/40 border-b border-white/10">
                  <tr>
                    <th className="pb-3 px-2">Tim</th>
                    <th className="pb-3 text-center" title="Played">P</th>
                    <th className="pb-3 text-center" title="Won">W</th>
                    <th className="pb-3 text-center" title="Drawn">D</th>
                    <th className="pb-3 text-center" title="Lost">L</th>
                    <th className="pb-3 text-center" title="Goals For">GF</th>
                    <th className="pb-3 text-center" title="Goals Against">GA</th>
                    <th className="pb-3 text-center text-avg-green">PTS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-semibold">
                  {teams.sort((a,b) => b.points - a.points || (b.goals_for - b.goals_against) - (a.goals_for - a.goals_against)).map((team) => (
                    <tr key={team.id} className="hover:bg-white/5 transition-colors group">
                      <td className="py-3 px-2 flex items-center gap-3">
                        {team.flag_url ? (
                          <img src={team.flag_url} alt={team.team_name} className="w-6 h-6 rounded-full object-cover border border-white/20" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-white/10 border border-white/20"></div>
                        )}
                        <span className="font-black text-white tracking-wider">{team.team_name}</span>
                      </td>
                      <td className="py-3 px-1"><input type="number" onBlur={(e) => handleUpdate(team.id, 'played', e.target.value)} defaultValue={team.played} className="w-8 bg-black/30 border border-white/10 text-center focus:border-avg-green focus:outline-none" /></td>
                      <td className="py-3 px-1"><input type="number" onBlur={(e) => handleUpdate(team.id, 'won', e.target.value)} defaultValue={team.won} className="w-8 bg-black/30 border border-white/10 text-center focus:border-avg-green focus:outline-none" /></td>
                      <td className="py-3 px-1"><input type="number" onBlur={(e) => handleUpdate(team.id, 'drawn', e.target.value)} defaultValue={team.drawn} className="w-8 bg-black/30 border border-white/10 text-center focus:border-avg-green focus:outline-none" /></td>
                      <td className="py-3 px-1"><input type="number" onBlur={(e) => handleUpdate(team.id, 'lost', e.target.value)} defaultValue={team.lost} className="w-8 bg-black/30 border border-white/10 text-center focus:border-torch-red focus:outline-none" /></td>
                      <td className="py-3 px-1"><input type="number" onBlur={(e) => handleUpdate(team.id, 'goals_for', e.target.value)} defaultValue={team.goals_for} className="w-10 bg-black/30 border border-white/10 text-center focus:border-avg-green focus:outline-none" /></td>
                      <td className="py-3 px-1"><input type="number" onBlur={(e) => handleUpdate(team.id, 'goals_against', e.target.value)} defaultValue={team.goals_against} className="w-10 bg-black/30 border border-white/10 text-center focus:border-avg-green focus:outline-none" /></td>
                      <td className="py-3 px-1"><input type="number" onBlur={(e) => handleUpdate(team.id, 'points', e.target.value)} defaultValue={team.points} className="w-10 bg-avg-green/20 text-avg-green font-black border border-avg-green/50 text-center focus:border-white focus:outline-none" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
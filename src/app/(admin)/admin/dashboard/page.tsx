"use client";

import { useEffect, useState, useMemo } from "react";
import api from "@/lib/axios";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Plus, Edit, Trash2, Flame, Calendar, MapPin, X, ChevronDown, Search } from "lucide-react";

// Basis Data 48 Tim Piala Dunia 2026 + Flag API
const WORLD_CUP_TEAMS = [
  { name: "Afrika Selatan", flag: "https://flagcdn.com/w80/za.png" },
  { name: "Aljazair", flag: "https://flagcdn.com/w80/dz.png" },
  { name: "Arab Saudi", flag: "https://flagcdn.com/w80/sa.png" },
  { name: "Argentina", flag: "https://flagcdn.com/w80/ar.png" },
  { name: "AS", flag: "https://flagcdn.com/w80/us.png" },
  { name: "Australia", flag: "https://flagcdn.com/w80/au.png" },
  { name: "Austria", flag: "https://flagcdn.com/w80/at.png" },
  { name: "Belanda", flag: "https://flagcdn.com/w80/nl.png" },
  { name: "Belgia", flag: "https://flagcdn.com/w80/be.png" },
  { name: "Bosnia dan Herzegovina", flag: "https://flagcdn.com/w80/ba.png" },
  { name: "Brasil", flag: "https://flagcdn.com/w80/br.png" },
  { name: "Ceko", flag: "https://flagcdn.com/w80/cz.png" },
  { name: "Curacao", flag: "https://flagcdn.com/w80/cw.png" },
  { name: "Ekuador", flag: "https://flagcdn.com/w80/ec.png" },
  { name: "Ghana", flag: "https://flagcdn.com/w80/gh.png" },
  { name: "Haiti", flag: "https://flagcdn.com/w80/ht.png" },
  { name: "Inggris", flag: "https://flagcdn.com/w80/gb-eng.png" },
  { name: "Iran", flag: "https://flagcdn.com/w80/ir.png" },
  { name: "Jepang", flag: "https://flagcdn.com/w80/jp.png" },
  { name: "Jerman", flag: "https://flagcdn.com/w80/de.png" },
  { name: "Kanada", flag: "https://flagcdn.com/w80/ca.png" },
  { name: "Kolombia", flag: "https://flagcdn.com/w80/co.png" },
  { name: "Korea Selatan", flag: "https://flagcdn.com/w80/kr.png" },
  { name: "Kroasia", flag: "https://flagcdn.com/w80/hr.png" },
  { name: "Maroko", flag: "https://flagcdn.com/w80/ma.png" },
  { name: "Meksiko", flag: "https://flagcdn.com/w80/mx.png" },
  { name: "Mesir", flag: "https://flagcdn.com/w80/eg.png" },
  { name: "Norwegia", flag: "https://flagcdn.com/w80/no.png" },
  { name: "Panama", flag: "https://flagcdn.com/w80/pa.png" },
  { name: "Pantai Gading", flag: "https://flagcdn.com/w80/ci.png" },
  { name: "Paraguay", flag: "https://flagcdn.com/w80/py.png" },
  { name: "Portugal", flag: "https://flagcdn.com/w80/pt.png" },
  { name: "Prancis", flag: "https://flagcdn.com/w80/fr.png" },
  { name: "Qatar", flag: "https://flagcdn.com/w80/qa.png" },
  { name: "RD Kongo", flag: "https://flagcdn.com/w80/cd.png" },
  { name: "Selandia Baru", flag: "https://flagcdn.com/w80/nz.png" },
  { name: "Senegal", flag: "https://flagcdn.com/w80/sn.png" },
  { name: "Skotlandia", flag: "https://flagcdn.com/w80/gb-sct.png" },
  { name: "Spanyol", flag: "https://flagcdn.com/w80/es.png" },
  { name: "Swedia", flag: "https://flagcdn.com/w80/se.png" },
  { name: "Swiss", flag: "https://flagcdn.com/w80/ch.png" },
  { name: "Tanjung Verde", flag: "https://flagcdn.com/w80/cv.png" },
  { name: "Tunisia", flag: "https://flagcdn.com/w80/tn.png" },
  { name: "Turki", flag: "https://flagcdn.com/w80/tr.png" },
  { name: "Uruguay", flag: "https://flagcdn.com/w80/uy.png" },
  { name: "Uzbekistan", flag: "https://flagcdn.com/w80/uz.png" },
  { name: "Yordania", flag: "https://flagcdn.com/w80/jo.png" }
];

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

export default function AdminDashboard() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const DEFAULT_VENUE = "Swimming Pool - Solo Paragon Hotel & Residences";

  const [formData, setFormData] = useState({
    team_a: "", team_b: "", flag_a_url: "", flag_b_url: "",
    match_date: "", venue: DEFAULT_VENUE, price: 0, quota: 0, is_hot_match: false
  });

  // Custom Dropdown & Search States
  const [openDropdownA, setOpenDropdownA] = useState(false);
  const [openDropdownB, setOpenDropdownB] = useState(false);
  const [searchA, setSearchA] = useState("");
  const [searchB, setSearchB] = useState("");

  // Optimasi filter menggunakan useMemo agar tidak render ulang berat
  const filteredTeamsA = useMemo(() => {
    return WORLD_CUP_TEAMS.filter(t => t.name.toLowerCase().includes(searchA.toLowerCase()));
  }, [searchA]);

  const filteredTeamsB = useMemo(() => {
    return WORLD_CUP_TEAMS.filter(t => t.name.toLowerCase().includes(searchB.toLowerCase()));
  }, [searchB]);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/matches");
      setMatches(res.data);
    } catch (err) {
      console.error("Gagal memuat jadwal:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const resetForm = () => {
    setFormData({
      team_a: "", team_b: "", flag_a_url: "", flag_b_url: "",
      match_date: "", venue: DEFAULT_VENUE, price: 0, quota: 0, is_hot_match: false
    });
    setEditingId(null);
    setOpenDropdownA(false);
    setOpenDropdownB(false);
    setSearchA("");
    setSearchB("");
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (match: Match) => {
    const dateStr = new Date(match.match_date).toISOString().slice(0, 16);
    setFormData({
      team_a: match.team_a, team_b: match.team_b,
      flag_a_url: match.flag_a_url, flag_b_url: match.flag_b_url,
      match_date: dateStr, venue: match.venue,
      price: match.price, quota: match.quota,
      is_hot_match: !!match.is_hot_match
    });
    setEditingId(match.id);
    setIsModalOpen(true);
    setSearchA("");
    setSearchB("");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus jadwal ini secara permanen?")) return;
    try {
      await api.delete(`/admin/matches/${id}`);
      fetchMatches();
    } catch (err) {
      alert("Gagal menghapus jadwal.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.team_a || !formData.team_b) {
      alert("Tim A dan Tim B harus dipilih!");
      return;
    }
    setFormLoading(true);
    try {
      if (editingId) {
        await api.put(`/admin/matches/${editingId}`, formData);
      } else {
        await api.post("/admin/matches", formData);
      }
      setIsModalOpen(false);
      fetchMatches();
    } catch (err: any) {
      alert(err.response?.data?.message || "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-dark-heather p-6 border-l-8 border-avg-green shadow-[8px_8px_0px_rgba(0,0,0,0.3)]">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">
            MANAJEMEN <span className="text-avg-green">JADWAL</span>
          </h1>
          <p className="text-white/50 text-xs font-bold uppercase tracking-widest mt-1">Kontrol penuh jadwal pertandingan Nobar</p>
        </div>
        <button onClick={openCreateModal} className="bg-avg-green hover:bg-white text-white hover:text-avg-green font-black px-6 py-3 uppercase tracking-widest transition-all border-2 border-transparent hover:border-avg-green transform -skew-x-12 flex items-center gap-2 shadow-[4px_4px_0px_rgba(0,0,0,0.5)] hover:shadow-none hover:translate-x-1 hover:translate-y-1">
          <span className="transform skew-x-12 flex items-center gap-2"><Plus size={18} /> TAMBAH JADWAL</span>
        </button>
      </div>

      {/* Tabel/Grid Data */}
      {loading ? (
        <div className="text-center py-20 font-black text-white/30 uppercase tracking-widest animate-pulse">MEMUAT DATA...</div>
      ) : matches.length === 0 ? (
        <div className="text-center py-20 bg-dark-heather border border-white/5 font-black text-white/30 uppercase tracking-widest">TIDAK ADA JADWAL</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {matches.map((match) => (
            <div key={match.id} className="bg-dark-heather border border-white/10 relative overflow-hidden group hover:border-white/30 transition-colors">
              {match.is_hot_match && (
                <div className="absolute top-4 right-[-30px] bg-torch-red text-white text-[9px] font-black uppercase tracking-widest py-1 px-10 transform rotate-45 shadow-md z-10">
                  HOT MATCH
                </div>
              )}
              
              <div className="p-6">
                <div className="flex justify-between items-center text-[10px] text-white/50 font-black uppercase tracking-widest mb-4">
                  <span className="flex items-center gap-2"><Calendar size={12} className="text-avg-green" /> {format(new Date(match.match_date), "dd MMM yyyy - HH:mm", { locale: id })}</span>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="text-center w-1/3">
                    <img src={match.flag_a_url} alt={match.team_a} loading="lazy" className="w-12 h-12 mx-auto rounded-full object-cover border-2 border-white/10 mb-2" />
                    <span className="text-xs font-black text-white uppercase mt-2 block">{match.team_a}</span>
                  </div>
                  <div className="text-xl font-black text-white/20 italic">VS</div>
                  <div className="text-center w-1/3">
                    <img src={match.flag_b_url} alt={match.team_b} loading="lazy" className="w-12 h-12 mx-auto rounded-full object-cover border-2 border-white/10 mb-2" />
                    <span className="text-xs font-black text-white uppercase mt-2 block">{match.team_b}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] uppercase font-black tracking-wider text-white/70 bg-black/20 p-3 mb-6">
                  <div>
                    <span className="block text-white/40 mb-1">Harga</span>
                    <span className="text-avg-green text-sm">Rp {match.price.toLocaleString('id-ID')}</span>
                  </div>
                  <div>
                    <span className="block text-white/40 mb-1">Kuota Tersisa</span>
                    <span className="text-white text-sm">{match.quota} Tiket</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button onClick={() => openEditModal(match)} className="flex-1 bg-white/5 hover:bg-avg-green text-white font-black py-2 text-[10px] uppercase tracking-widest transition-colors flex items-center justify-center gap-2 border border-white/10">
                    <Edit size={14} /> EDIT
                  </button>
                  <button onClick={() => handleDelete(match.id)} className="flex-1 bg-white/5 hover:bg-torch-red text-white font-black py-2 text-[10px] uppercase tracking-widest transition-colors flex items-center justify-center gap-2 border border-white/10">
                    <Trash2 size={14} /> HAPUS
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= MODAL BRUTALIST ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-heather w-full max-w-3xl border-t-8 border-avg-green shadow-[16px_16px_0px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-black/20">
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                {editingId ? "EDIT JADWAL" : "TAMBAH JADWAL BARU"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-white/50 hover:text-white transition">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 relative">
              <form id="matchForm" onSubmit={handleSubmit} className="space-y-6">
                
                {/* OPSI TIM DENGAN CUSTOM BRUTALIST DROPDOWN & SEARCH */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/10 p-4 border border-white/5">
                  
                  {/* Custom Dropdown Tim A */}
                  <div className="space-y-3 relative">
                    <label className="text-[10px] font-black text-light-gray uppercase tracking-widest">Tim A</label>
                    <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-2 relative z-20">
                      {formData.flag_a_url ? (
                        <img src={formData.flag_a_url} alt="Flag A" className="w-10 h-10 rounded-full object-cover border-2 border-white/20 shadow-md" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-black/40 border-2 border-white/10"></div>
                      )}
                      
                      <div className="flex-1 relative">
                        <div 
                          onClick={() => { setOpenDropdownA(!openDropdownA); setOpenDropdownB(false); setSearchA(""); }}
                          className="flex justify-between items-center w-full bg-transparent text-white font-bold cursor-pointer outline-none py-2 px-2"
                        >
                          <span className={formData.team_a ? "text-white uppercase" : "text-white/40"}>
                            {formData.team_a || "-- PILIH TIM A --"}
                          </span>
                          <ChevronDown size={16} className={`text-white/50 transition-transform duration-300 ${openDropdownA ? 'rotate-180 text-avg-green' : ''}`} />
                        </div>

                        {openDropdownA && (
                          <>
                            <div className="fixed inset-0 z-30" onClick={() => setOpenDropdownA(false)}></div>
                            
                            <div className="absolute top-[120%] left-0 w-[120%] bg-[#0f1219] border-2 border-avg-green shadow-[8px_8px_0px_rgba(0,0,0,0.7)] z-40 overflow-hidden flex flex-col">
                              {/* Search Bar Input */}
                              <div className="p-3 border-b border-white/10 bg-black/40 sticky top-0 flex items-center gap-3">
                                <Search size={14} className="text-white/40" />
                                <input 
                                  autoFocus
                                  type="text" 
                                  placeholder="Ketik nama tim..." 
                                  className="w-full bg-transparent border-none text-white text-sm outline-none placeholder:text-white/30 font-bold"
                                  value={searchA}
                                  onChange={(e) => setSearchA(e.target.value)}
                                />
                              </div>
                              
                              <div className="max-h-56 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-black/20 [&::-webkit-scrollbar-thumb]:bg-avg-green">
                                {filteredTeamsA.length > 0 ? filteredTeamsA.map(t => (
                                  <div 
                                    key={`a-${t.name}`}
                                    className="flex items-center gap-4 p-3 cursor-pointer hover:bg-avg-green hover:text-white transition-colors border-b border-white/5 last:border-0 group"
                                    onClick={() => {
                                      setFormData({...formData, team_a: t.name, flag_a_url: t.flag});
                                      setOpenDropdownA(false);
                                      setSearchA("");
                                    }}
                                  >
                                    {/* lazy loading agar dom tidak hang */}
                                    <img src={t.flag} alt={t.name} loading="lazy" className="w-8 h-8 rounded-full object-cover border-2 border-transparent group-hover:border-white shadow-sm" />
                                    <span className="text-sm font-black uppercase tracking-wide">{t.name}</span>
                                  </div>
                                )) : (
                                  <div className="p-4 text-center text-white/30 text-xs font-bold uppercase">Tim tidak ditemukan</div>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Custom Dropdown Tim B */}
                  <div className="space-y-3 relative">
                    <label className="text-[10px] font-black text-light-gray uppercase tracking-widest">Tim B</label>
                    <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-2 relative z-10">
                      {formData.flag_b_url ? (
                        <img src={formData.flag_b_url} alt="Flag B" className="w-10 h-10 rounded-full object-cover border-2 border-white/20 shadow-md" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-black/40 border-2 border-white/10"></div>
                      )}
                      
                      <div className="flex-1 relative">
                        <div 
                          onClick={() => { setOpenDropdownB(!openDropdownB); setOpenDropdownA(false); setSearchB(""); }}
                          className="flex justify-between items-center w-full bg-transparent text-white font-bold cursor-pointer outline-none py-2 px-2"
                        >
                          <span className={formData.team_b ? "text-white uppercase" : "text-white/40"}>
                            {formData.team_b || "-- PILIH TIM B --"}
                          </span>
                          <ChevronDown size={16} className={`text-white/50 transition-transform duration-300 ${openDropdownB ? 'rotate-180 text-avg-green' : ''}`} />
                        </div>

                        {openDropdownB && (
                          <>
                            <div className="fixed inset-0 z-30" onClick={() => setOpenDropdownB(false)}></div>
                            
                            <div className="absolute top-[120%] left-0 w-[120%] bg-[#0f1219] border-2 border-avg-green shadow-[8px_8px_0px_rgba(0,0,0,0.7)] z-40 overflow-hidden flex flex-col">
                              {/* Search Bar Input */}
                              <div className="p-3 border-b border-white/10 bg-black/40 sticky top-0 flex items-center gap-3">
                                <Search size={14} className="text-white/40" />
                                <input 
                                  autoFocus
                                  type="text" 
                                  placeholder="Ketik nama tim..." 
                                  className="w-full bg-transparent border-none text-white text-sm outline-none placeholder:text-white/30 font-bold"
                                  value={searchB}
                                  onChange={(e) => setSearchB(e.target.value)}
                                />
                              </div>

                              <div className="max-h-56 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-black/20 [&::-webkit-scrollbar-thumb]:bg-avg-green">
                                {filteredTeamsB.length > 0 ? filteredTeamsB.map(t => (
                                  <div 
                                    key={`b-${t.name}`}
                                    className="flex items-center gap-4 p-3 cursor-pointer hover:bg-avg-green hover:text-white transition-colors border-b border-white/5 last:border-0 group"
                                    onClick={() => {
                                      setFormData({...formData, team_b: t.name, flag_b_url: t.flag});
                                      setOpenDropdownB(false);
                                      setSearchB("");
                                    }}
                                  >
                                    <img src={t.flag} alt={t.name} loading="lazy" className="w-8 h-8 rounded-full object-cover border-2 border-transparent group-hover:border-white shadow-sm" />
                                    <span className="text-sm font-black uppercase tracking-wide">{t.name}</span>
                                  </div>
                                )) : (
                                  <div className="p-4 text-center text-white/30 text-xs font-bold uppercase">Tim tidak ditemukan</div>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-0">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-light-gray uppercase tracking-widest">Waktu Kick-off</label>
                    <input required type="datetime-local" className="w-full bg-white/5 border border-white/10 text-white p-3 font-bold focus:border-avg-green outline-none" value={formData.match_date} onChange={e => setFormData({...formData, match_date: e.target.value})} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-light-gray uppercase tracking-widest">Harga Tiket</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 font-bold">Rp</span>
                      <input required type="text" 
                        className="w-full bg-white/5 border border-white/10 text-white p-3 pl-10 font-bold focus:border-avg-green outline-none" 
                        value={formData.price === 0 ? "" : formData.price.toLocaleString('id-ID')} 
                        onChange={e => {
                          const raw = e.target.value.replace(/\D/g, '');
                          setFormData({...formData, price: raw ? parseInt(raw, 10) : 0});
                        }} 
                        placeholder="0" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-light-gray uppercase tracking-widest">Kuota Tiket</label>
                    <input required type="text" 
                      className="w-full bg-white/5 border border-white/10 text-white p-3 font-bold focus:border-avg-green outline-none" 
                      value={formData.quota === 0 ? "" : formData.quota.toLocaleString('id-ID')} 
                      onChange={e => {
                        const raw = e.target.value.replace(/\D/g, '');
                        setFormData({...formData, quota: raw ? parseInt(raw, 10) : 0});
                      }} 
                      placeholder="0" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-0">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-light-gray uppercase tracking-widest">Lokasi Venue</label>
                    <input required type="text" className="w-full bg-white/5 border border-white/10 text-white p-3 font-bold focus:border-avg-green outline-none" value={formData.venue} onChange={e => setFormData({...formData, venue: e.target.value})} />
                  </div>
                  <div className="flex items-center gap-4 mt-6">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={formData.is_hot_match} onChange={e => setFormData({...formData, is_hot_match: e.target.checked})} />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-torch-red"></div>
                      <span className="ml-3 text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2"><Flame size={14} className="text-torch-red" /> Jadikan Hot Match</span>
                    </label>
                  </div>
                </div>

              </form>
            </div>

            <div className="p-6 border-t border-white/10 bg-black/20 flex justify-end gap-4 relative z-0">
              <button onClick={() => setIsModalOpen(false)} type="button" className="px-6 py-3 text-[10px] font-black text-white/50 uppercase tracking-widest hover:text-white transition">
                BATAL
              </button>
              <button form="matchForm" disabled={formLoading} type="submit" className="bg-avg-green hover:bg-white text-white hover:text-avg-green font-black px-8 py-3 uppercase tracking-widest transition-all border-2 border-transparent hover:border-avg-green transform -skew-x-12 shadow-[4px_4px_0px_rgba(0,0,0,0.5)] hover:shadow-none hover:translate-x-1 hover:translate-y-1">
                <span className="block transform skew-x-12">{formLoading ? "MENYIMPAN..." : "SIMPAN JADWAL"}</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
import api from "@/lib/axios";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";

// Definisi tipe data sesuai response Laravel
type Match = {
  id: number;
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

// Fungsi fetch data dari backend Laravel
async function getMatches() {
  try {
    const response = await api.get('/matches');
    return response.data;
  } catch (error) {
    console.error("Gagal mengambil data match:", error);
    return { hot_matches: [], upcoming_matches: [] };
  }
}

export default async function Home() {
  const { hot_matches, upcoming_matches } = await getMatches();

  return (
    <div className="space-y-12">
      {/* Bagian Hot Match */}
      <section>
        <h2 className="text-3xl font-bold text-torch-red border-b-4 border-avg-green inline-block mb-6 pb-2">
          🔥 Hot Match
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hot_matches.length > 0 ? (
            hot_matches.map((match: Match) => (
              <MatchCard key={match.id} match={match} />
            ))
          ) : (
            <p className="text-gray-500 italic">Belum ada Hot Match tersedia.</p>
          )}
        </div>
      </section>

      {/* Bagian Upcoming Match */}
      <section>
        <h2 className="text-2xl font-bold text-hermes border-b-4 border-avg-green inline-block mb-6 pb-2">
          📅 Upcoming Match
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcoming_matches.length > 0 ? (
            upcoming_matches.map((match: Match) => (
              <MatchCard key={match.id} match={match} />
            ))
          ) : (
            <p className="text-gray-500 italic">Belum ada jadwal pertandingan baru.</p>
          )}
        </div>
      </section>
    </div>
  );
}

// Komponen UI Card (Reusable)
function MatchCard({ match }: { match: Match }) {
  const isSoldOut = match.quota <= 0;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition">
      <div className="bg-dark-heather text-white text-center py-2 text-sm font-semibold">
        {format(new Date(match.match_date), "EEEE, dd MMMM yyyy - HH:mm 'WIB'", { locale: id })}
      </div>
      <div className="p-6 flex items-center justify-between">
        <div className="flex flex-col items-center">
          <img src={match.flag_a_url} alt={match.team_a} className="w-16 h-12 object-cover rounded shadow-sm border" />
          <span className="font-bold mt-2 text-hermes">{match.team_a}</span>
        </div>
        <div className="text-2xl font-black text-gray-400">VS</div>
        <div className="flex flex-col items-center">
          <img src={match.flag_b_url} alt={match.team_b} className="w-16 h-12 object-cover rounded shadow-sm border" />
          <span className="font-bold mt-2 text-hermes">{match.team_b}</span>
        </div>
      </div>
      <div className="px-6 pb-6 text-center">
        <p className="text-sm text-gray-500 mb-4">{match.venue}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-avg-green">
            Rp {match.price.toLocaleString('id-ID')}
          </span>
          {isSoldOut ? (
            <button disabled className="px-4 py-2 rounded-lg font-bold text-white transition bg-gray-400 cursor-not-allowed">
              Sold Out
            </button>
          ) : (
            <Link href={`/checkout/${match.id}`} className="px-4 py-2 rounded-lg font-bold text-white transition bg-torch-red hover:bg-red-700">
              Beli Tiket
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
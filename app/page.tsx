'use client';

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type WPPoint = {
  playNumber: number;
  home: string;
  away: string;
  homeWinProbability: number;
};

export default function Home() {
  const [gameId, setGameId] = useState("");
  const [chartData, setChartData] = useState<any[]>([]);
  const [teams, setTeams] = useState<{ home: string; away: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFetch() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/wp?gameId=${gameId}`);
      const data: WPPoint[] = await res.json();
      if (!Array.isArray(data) || !data.length) {
        setTeams(null);
        setError("No win probability data found for that gameId.");
        return;
      }
      setTeams({ home: data[0].home, away: data[0].away });
      setChartData(
        data.map((d) => ({
          playNumber: d.playNumber,
          [data[0].home]: +(d.homeWinProbability * 100).toFixed(1),
          [data[0].away]: +((1 - d.homeWinProbability) * 100).toFixed(1),
        }))
      );
    } catch {
      setError("Something went wrong fetching that game.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center px-4 py-16">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold tracking-tight mb-1">
          College Football Win Probability
        </h1>
        <p className="text-zinc-400 mb-8">
          Enter a 2025 FBS-vs-FBS gameId to plot each team's win probability.
        </p>

        <div className="flex gap-3 mb-2">
          <input
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            placeholder="e.g. 401756846"
            className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleFetch}
            disabled={loading || !gameId}
            className="rounded-lg bg-indigo-600 px-5 py-2 font-medium text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors"
          >
            {loading ? "Loading..." : "Fetch"}
          </button>
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        {teams && (
          <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-lg font-semibold mb-4">
              {teams.away} @ {teams.home}
            </h2>
            <div className="w-full h-96">
              <ResponsiveContainer>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                  <XAxis
                    dataKey="playNumber"
                    stroke="#a1a1aa"
                    label={{ value: "Play #", position: "insideBottom", offset: -5, fill: "#a1a1aa" }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    stroke="#a1a1aa"
                    label={{ value: "Win Probability (%)", angle: -90, position: "insideLeft", fill: "#a1a1aa" }}
                  />
                  <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46" }} />
                  <Legend />
                  <Line type="monotone" dataKey={teams.home} stroke="#818cf8" dot={false} strokeWidth={2} />
                  <Line type="monotone" dataKey={teams.away} stroke="#fb923c" dot={false} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

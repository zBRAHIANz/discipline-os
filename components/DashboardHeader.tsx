'use client';

import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

interface DashboardHeaderProps {
  streak: number;
  level: number;
  xp: number;
  rankPercentile: number;
}

export default function DashboardHeader({
  streak,
  level,
  xp,
  rankPercentile,
}: DashboardHeaderProps) {
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    logout();
    router.push('/');
  };

  return (
    <header className="border-b border-zinc-800 bg-zinc-900 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-black">DISCIPLINE OS</h1>
          <button
            onClick={handleLogout}
            className="bg-zinc-800 text-zinc-50 font-semibold px-4 py-2 rounded hover:bg-zinc-700 transition-all"
          >
            Logout
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Streak */}
          <div className="bg-zinc-800 rounded px-3 py-2">
            <p className="text-xs text-zinc-400 uppercase font-semibold">Streak</p>
            <p className="text-2xl font-black text-yellow-400">🔥 {streak}</p>
          </div>

          {/* Level */}
          <div className="bg-zinc-800 rounded px-3 py-2">
            <p className="text-xs text-zinc-400 uppercase font-semibold">Level</p>
            <p className="text-2xl font-black text-blue-400">{level}</p>
          </div>

          {/* XP */}
          <div className="bg-zinc-800 rounded px-3 py-2">
            <p className="text-xs text-zinc-400 uppercase font-semibold">XP</p>
            <p className="text-2xl font-black text-green-400">{xp}</p>
          </div>

          {/* Rank */}
          <div className="bg-zinc-800 rounded px-3 py-2">
            <p className="text-xs text-zinc-400 uppercase font-semibold">Rank</p>
            <p className="text-2xl font-black text-purple-400">{Math.round(rankPercentile)}%</p>
          </div>
        </div>
      </div>
    </header>
  );
}

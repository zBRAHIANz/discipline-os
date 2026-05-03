'use client';

import Link from 'next/link';

export default function Landing() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <h1 className="text-6xl font-black mb-4 tracking-tighter">DISCIPLINE OS</h1>
        <p className="text-xl mb-12 text-zinc-400 font-medium">Execution is the only option.</p>
        
        <div className="space-y-4">
          <Link
            href="/auth/signup"
            className="inline-block w-full bg-zinc-50 text-zinc-950 font-bold px-8 py-3 rounded hover:bg-zinc-100 active:scale-95 transition-all"
          >
            START
          </Link>
          
          <p className="text-sm text-zinc-500">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 font-semibold">
              Login
            </Link>
          </p>
        </div>

        <div className="mt-16 pt-8 border-t border-zinc-800">
          <p className="text-xs text-zinc-600 mb-4">How it works:</p>
          <ul className="space-y-3 text-left text-sm text-zinc-400">
            <li>✓ Receive daily mandatory execution tasks</li>
            <li>✓ Track progress in real-time</li>
            <li>✓ Build streaks through consistency</li>
            <li>✓ Climb the global leaderboard</li>
            <li>✓ Earn rewards or face penalties</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { getTimeUntilMidnight, formatTimeRemaining } from '@/lib/utils';

export default function CountdownTimer() {
  const [time, setTime] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    percentage: number;
  } | null>(null);

  useEffect(() => {
    // Set initial time
    setTime(getTimeUntilMidnight());

    // Update every second
    const interval = setInterval(() => {
      setTime(getTimeUntilMidnight());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!time) return null;

  const isUrgent = time.hours === 0;
  const isWarning = time.hours <= 2;

  return (
    <div className={`rounded-lg p-6 mb-6 ${
      isUrgent ? 'bg-red-900 border-2 border-red-600' :
      isWarning ? 'bg-yellow-900 border-2 border-yellow-600' :
      'bg-zinc-900 border border-zinc-800'
    }`}>
      <p className={`text-xs uppercase font-semibold mb-2 ${
        isUrgent ? 'text-red-200' :
        isWarning ? 'text-yellow-200' :
        'text-zinc-400'
      }`}>
        {isUrgent ? '⏰ FINAL HOURS' : isWarning ? '⚠️ TIME WARNING' : 'Time Until Midnight (UTC)'}
      </p>

      <div className="mb-3">
        <p className={`text-4xl font-black ${
          isUrgent ? 'text-red-100' :
          isWarning ? 'text-yellow-100' :
          'text-zinc-50'
        }`}>
          {formatTimeRemaining(time.hours, time.minutes, time.seconds)}
        </p>
      </div>

      {/* Progress bar */}
      <div className="bg-zinc-800 rounded h-2 overflow-hidden">
        <div
          className={`h-full transition-all ${
            isUrgent ? 'bg-red-500' :
            isWarning ? 'bg-yellow-500' :
            'bg-blue-500'
          }`}
          style={{ width: `${time.percentage}%` }}
        />
      </div>

      <p className="text-xs text-zinc-400 mt-2">{Math.round(time.percentage)}% of day remaining</p>
    </div>
  );
}

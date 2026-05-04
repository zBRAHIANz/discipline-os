'use client';

import { useState } from 'react';
import { getDifficultyColor, getDifficultyLabel, getCategoryLabel } from '@/lib/utils';
import { completeTask } from '@/lib/api';

interface TaskCardProps {
  id: string;
  task: {
    title: string;
    description: string;
    category: string;
    difficulty: number;
    estimated_time: number;
    required_proof: boolean;
  };
  completed: boolean;
  completedAt?: string;
  onComplete: () => void;
}

export default function TaskCard({
  id,
  task,
  completed,
  completedAt,
  onComplete,
}: TaskCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleComplete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await completeTask(id);
      onComplete();
    } catch (err) {
      setError('Failed to complete task. Try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`border rounded-lg p-4 transition-all ${
      completed
        ? 'bg-green-900/20 border-green-700 opacity-60'
        : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
    }`}>
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-black px-2 py-1 rounded text-zinc-950 ${
              getDifficultyColor(task.difficulty)
            }`}>
              {getDifficultyLabel(task.difficulty)}
            </span>
            <span className="text-xs font-semibold text-zinc-400">
              {getCategoryLabel(task.category)}
            </span>
            <span className="text-xs text-zinc-500">~{task.estimated_time}min</span>
          </div>

          <h3 className={`font-bold mb-1 ${
            completed ? 'text-zinc-400' : 'text-zinc-50'
          }`}>
            {completed && '✅ '}
            {task.title}
          </h3>
          <p className="text-sm text-zinc-400">{task.description}</p>
        </div>
      </div>

      {completed && completedAt && (
        <p className="text-xs text-green-400 mb-2">
          ✓ Completed at {new Date(completedAt).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })}
        </p>
      )}

      {error && <p className="text-xs text-red-400 mb-2">{error}</p>}

      {!completed && (
        <button
          onClick={handleComplete}
          disabled={isLoading}
          className="w-full bg-zinc-50 text-zinc-950 font-bold py-2 rounded hover:bg-zinc-100 active:scale-95 transition-all disabled:opacity-50"
        >
          {isLoading ? 'Completing...' : 'COMPLETE TASK'}
        </button>
      )}

      {task.required_proof && (
        <p className="text-xs text-zinc-500 mt-2">📸 Proof required for completion</p>
      )}
    </div>
  );
}

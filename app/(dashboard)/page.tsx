'use client';

import { useEffect, useState } from 'react';
import { fetchTodaysTasks, fetchProgress } from '@/lib/api';
import DashboardHeader from '@/components/DashboardHeader';
import CountdownTimer from '@/components/CountdownTimer';
import TaskCard from '@/components/TaskCard';
import type { UserTask, User } from '@/lib/types';

interface TaskWithDetails extends UserTask {
  tasks?: {
    id: string;
    title: string;
    description: string;
    category: string;
    difficulty: number;
    estimated_time: number;
    required_proof: boolean;
  };
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<TaskWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch progress (user stats)
        const progressData = await fetchProgress();
        if (progressData.user) {
          setUser(progressData.user as User);
        }

        // Fetch today's tasks
        const tasksData = await fetchTodaysTasks();
        if (tasksData.tasks) {
          setTasks(tasksData.tasks as TaskWithDetails[]);
        }
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleTaskComplete = () => {
    // Refresh tasks and progress after completion
    fetchTodaysTasks().then((data) => {
      if (data.tasks) setTasks(data.tasks);
    });
    fetchProgress().then((data) => {
      if (data.user) setUser(data.user);
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-50 flex items-center justify-center">
        <p className="text-xl font-semibold text-zinc-400">Loading...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-50">
        <DashboardHeader streak={0} level={0} xp={0} rankPercentile={0} />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-red-900 border border-red-600 rounded-lg p-4 text-red-100">
            {error || 'Failed to load user data'}
          </div>
        </main>
      </div>
    );
  }

  const tasksCompleted = tasks.filter((t) => t.completed).length;
  const completionPercentage = tasks.length > 0 ? (tasksCompleted / tasks.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <DashboardHeader
        streak={user.streak}
        level={user.level}
        xp={user.xp}
        rankPercentile={user.rank_percentile}
      />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Countdown Timer */}
        <CountdownTimer />

        {/* Completion Progress */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-black">TODAY'S EXECUTION</h2>
            <p className="text-sm font-semibold text-zinc-400">
              {tasksCompleted}/{tasks.length} Complete
            </p>
          </div>

          {/* Progress bar */}
          <div className="bg-zinc-800 rounded h-3 overflow-hidden">
            <div
              className={`h-full transition-all ${
                completionPercentage === 100 ? 'bg-green-500' :
                completionPercentage >= 66 ? 'bg-blue-500' :
                completionPercentage >= 33 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="text-xs text-zinc-400 mt-2">
            {Math.round(completionPercentage)}% complete
          </p>
        </div>

        {/* Tasks */}
        {tasks.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 text-center">
            <p className="text-zinc-400 mb-2">No tasks assigned for today</p>
            <p className="text-xs text-zinc-500">
              Tasks are generated daily at 00:00 UTC. Check back tomorrow!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase text-zinc-400 mb-4">Execution Queue</h3>
            {tasks.map((userTask) => (
              <TaskCard
                key={userTask.id}
                id={userTask.id}
                task={userTask.tasks as any}
                completed={userTask.completed}
                completedAt={userTask.completed_at}
                onComplete={handleTaskComplete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

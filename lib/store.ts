import { create } from 'zustand';
import type { User } from './types';

// Auth Store
interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  logout: () => set({ user: null, error: null }),
}));

// Dashboard Store
interface DashboardState {
  tasks: any[];
  progress: any | null;
  tasksCompleted: number;
  tasksTotal: number;
  loading: boolean;
  setTasks: (tasks: any[]) => void;
  setProgress: (progress: any) => void;
  setTasksCompleted: (count: number) => void;
  setTasksTotal: (count: number) => void;
  setLoading: (loading: boolean) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  tasks: [],
  progress: null,
  tasksCompleted: 0,
  tasksTotal: 0,
  loading: false,
  setTasks: (tasks) => set({ tasks }),
  setProgress: (progress) => set({ progress }),
  setTasksCompleted: (count) => set({ tasksCompleted: count }),
  setTasksTotal: (count) => set({ tasksTotal: count }),
  setLoading: (loading) => set({ loading }),
}));

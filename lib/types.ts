// User & Auth
export interface User {
  id: string;
  email: string;
  created_at: string;
  level: number;
  xp: number;
  streak: number;
  rank_percentile: number;
  subscription_status: 'free' | 'premium' | 'penalty_mode';
  penalty_balance: number | null;
  timezone: string;
}

// Tasks
export interface Task {
  id: string;
  title: string;
  description: string;
  category: 'make_money' | 'fitness' | 'discipline_study';
  difficulty: number; // 1-10
  estimated_time: number; // minutes
  required_proof: boolean;
  created_at: string;
}

export interface UserTask {
  id: string;
  user_id: string;
  task_id: string;
  assigned_date: string;
  completed: boolean;
  completed_at: string | null;
  proof_url: string | null;
}

// Progress Tracking
export interface Progress {
  id: string;
  user_id: string;
  date: string;
  streak: number;
  xp: number;
  level: number;
  tasks_completed: number;
  tasks_total: number;
  completion_rate: number;
}

// Notifications
export interface Notification {
  id: string;
  user_id: string;
  type: 'start_warning' | 'time_warning' | 'final_warning' | 'success' | 'failure';
  title: string;
  message: string;
  sent_at: string;
  read: boolean;
}

// Subscriptions
export interface Subscription {
  id: string;
  user_id: string;
  plan: 'free' | 'premium' | 'penalty_mode';
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  started_at: string;
  ended_at: string | null;
  amount_cents: number | null;
  payment_status: string;
}

export interface SubscriptionEvent {
  id: string;
  user_id: string;
  subscription_id: string | null;
  event_type: 'created' | 'charged' | 'failed' | 'cancelled' | 'refunded';
  amount_cents: number | null;
  reason: string | null;
  created_at: string;
}

// Leaderboard
export interface LeaderboardEntry {
  user_id: string;
  email: string;
  level: number;
  xp: number;
  streak: number;
  rank: number;
  rank_percentile: number;
}

// Analytics
export interface Analytics {
  id: string;
  user_id: string;
  date: string;
  completion_rate: number;
  avg_task_completion_time: number | null;
  failure_count: number;
  xp_gained: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthResponse {
  user: User;
  session: {
    access_token: string;
    refresh_token: string;
  };
}

# DISCIPLINE OS - Database Schema

## Overview

Complete PostgreSQL schema for DISCIPLINE OS with relationships, indexes, Row Level Security (RLS) policies, and triggers.

---

## Core Tables

### 1. `users`
Core user profile and progression metrics.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  auth_provider TEXT DEFAULT 'email', -- 'email' | 'google'
  created_at TIMESTAMP DEFAULT NOW(),
  level INTEGER DEFAULT 0,
  xp INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  rank_percentile FLOAT DEFAULT 0.0,
  subscription_status TEXT DEFAULT 'free', -- 'free' | 'premium' | 'penalty_mode'
  penalty_balance DECIMAL(10, 2),
  last_active_date DATE,
  timezone TEXT DEFAULT 'UTC',
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription_status ON users(subscription_status);
CREATE INDEX idx_users_streak ON users(streak DESC);
CREATE INDEX idx_users_xp ON users(xp DESC);
```

### 2. `tasks`
Master task library with difficulty levels and categories.

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- 'make_money' | 'fitness' | 'discipline_study'
  difficulty INTEGER NOT NULL CHECK (difficulty >= 1 AND difficulty <= 10),
  estimated_time INTEGER NOT NULL, -- minutes
  required_proof BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tasks_category ON tasks(category);
CREATE INDEX idx_tasks_difficulty ON tasks(difficulty);
```

### 3. `user_tasks`
Daily task assignments with completion tracking.

```sql
CREATE TABLE user_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  assigned_date DATE NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  proof_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, task_id, assigned_date)
);

CREATE INDEX idx_user_tasks_user_id_date ON user_tasks(user_id, assigned_date);
CREATE INDEX idx_user_tasks_completed ON user_tasks(completed);
CREATE INDEX idx_user_tasks_user_id ON user_tasks(user_id);
```

### 4. `progress`
Daily snapshots for analytics and historical tracking.

```sql
CREATE TABLE progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  streak INTEGER NOT NULL,
  xp INTEGER NOT NULL,
  level INTEGER NOT NULL,
  tasks_completed INTEGER NOT NULL,
  tasks_total INTEGER NOT NULL,
  completion_rate FLOAT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, date)
);

CREATE INDEX idx_progress_user_id_date ON progress(user_id, date DESC);
CREATE INDEX idx_progress_date ON progress(date);
```

### 5. `notifications`
User notification history.

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'start_warning' | 'time_warning' | 'final_warning' | 'success' | 'failure'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMP DEFAULT NOW(),
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, read);
```

### 6. `subscriptions`
Payment and subscription tracking.

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL, -- 'free' | 'premium' | 'penalty_mode'
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP,
  amount_cents INTEGER, -- in cents
  payment_status TEXT DEFAULT 'active', -- 'active' | 'cancelled' | 'failed'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_id ON subscriptions(stripe_customer_id);
```

### 7. `subscription_events`
Audit trail for subscription changes and payments.

```sql
CREATE TABLE subscription_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL, -- 'created' | 'charged' | 'failed' | 'cancelled' | 'refunded'
  amount_cents INTEGER,
  reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_subscription_events_user_id ON subscription_events(user_id);
CREATE INDEX idx_subscription_events_type ON subscription_events(event_type);
```

### 8. `leaderboard_cache`
Pre-calculated leaderboard rankings (updated periodically).

```sql
CREATE TABLE leaderboard_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  level INTEGER NOT NULL,
  xp INTEGER NOT NULL,
  streak INTEGER NOT NULL,
  rank INTEGER NOT NULL,
  rank_percentile FLOAT NOT NULL,
  last_updated TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX idx_leaderboard_rank ON leaderboard_cache(rank);
CREATE INDEX idx_leaderboard_xp ON leaderboard_cache(xp DESC);
```

### 9. `analytics`
Aggregate analytics for performance monitoring.

```sql
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  completion_rate FLOAT NOT NULL,
  avg_task_completion_time INTEGER, -- minutes
  failure_count INTEGER DEFAULT 0,
  xp_gained INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, date)
);

CREATE INDEX idx_analytics_user_id_date ON analytics(user_id, date DESC);
```

---

## Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_cache ENABLE ROW LEVEL SECURITY;

-- Users can view own profile
CREATE POLICY users_view_own ON users
  FOR SELECT
  USING (id = auth.uid());

-- Users can update own profile
CREATE POLICY users_update_own ON users
  FOR UPDATE
  USING (id = auth.uid());

-- Users can view own tasks
CREATE POLICY user_tasks_view_own ON user_tasks
  FOR SELECT
  USING (user_id = auth.uid());

-- Users can update own tasks
CREATE POLICY user_tasks_update_own ON user_tasks
  FOR UPDATE
  USING (user_id = auth.uid());

-- Users can insert own tasks (for system)
CREATE POLICY user_tasks_insert_own ON user_tasks
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can view own progress
CREATE POLICY progress_view_own ON progress
  FOR SELECT
  USING (user_id = auth.uid());

-- Users can view own notifications
CREATE POLICY notifications_view_own ON notifications
  FOR SELECT
  USING (user_id = auth.uid());

-- Users can update own notifications
CREATE POLICY notifications_update_own ON notifications
  FOR UPDATE
  USING (user_id = auth.uid());

-- Tasks table is public (read-only)
CREATE POLICY tasks_view_all ON tasks
  FOR SELECT
  USING (true);

-- Leaderboard is public (read-only)
CREATE POLICY leaderboard_view_all ON leaderboard_cache
  FOR SELECT
  USING (true);
```

---

## Triggers

### Update `updated_at` on table changes

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all updatable tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_tasks_updated_at BEFORE UPDATE ON user_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Auto-insert progress record on task completion

```sql
CREATE OR REPLACE FUNCTION insert_progress_on_completion()
RETURNS TRIGGER AS $$
DECLARE
  v_tasks_completed INTEGER;
  v_tasks_total INTEGER;
  v_completion_rate FLOAT;
BEGIN
  IF NEW.completed = true THEN
    -- Count completed and total tasks for today
    SELECT COUNT(CASE WHEN completed = true THEN 1 END),
           COUNT(*)
    INTO v_tasks_completed, v_tasks_total
    FROM user_tasks
    WHERE user_id = NEW.user_id AND assigned_date = NEW.assigned_date;

    v_completion_rate := CASE 
      WHEN v_tasks_total = 0 THEN 0 
      ELSE (v_tasks_completed::FLOAT / v_tasks_total::FLOAT) * 100 
    END;

    -- Update or insert progress record
    INSERT INTO progress (
      user_id, date, streak, xp, level,
      tasks_completed, tasks_total, completion_rate
    )
    SELECT 
      u.id, NEW.assigned_date, u.streak, u.xp, u.level,
      v_tasks_completed, v_tasks_total, v_completion_rate
    FROM users u
    WHERE u.id = NEW.user_id
    ON CONFLICT (user_id, date) DO UPDATE SET
      tasks_completed = v_tasks_completed,
      tasks_total = v_tasks_total,
      completion_rate = v_completion_rate,
      updated_at = NOW();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER progress_on_task_completion AFTER UPDATE ON user_tasks
  FOR EACH ROW EXECUTE FUNCTION insert_progress_on_completion();
```

---

## Relationships

```
users
  ├── user_tasks (1-to-many)
  ├── progress (1-to-many)
  ├── notifications (1-to-many)
  ├── subscriptions (1-to-many)
  └── subscription_events (1-to-many)

tasks
  └── user_tasks (1-to-many)

user_tasks
  ├── users (many-to-1)
  └── tasks (many-to-1)

subscriptions
  ├── users (many-to-1)
  └── subscription_events (1-to-many)
```

---

## Migration Steps

1. Run all CREATE TABLE statements in order (respecting foreign key constraints)
2. Create indexes
3. Enable RLS and create policies
4. Create functions
5. Create triggers
6. Insert initial task data into `tasks` table

---

## Initial Data

Sample tasks to populate the `tasks` table:

```sql
INSERT INTO tasks (title, description, category, difficulty, estimated_time, required_proof)
VALUES
  ('Send 10 outreach messages', 'Contact 10 potential clients or partners via email or LinkedIn', 'make_money', 5, 30, true),
  ('Publish 1 piece of content', 'Write and publish blog post, video, or social media content', 'make_money', 6, 60, true),
  ('Research 3 competitors', 'Document findings on 3 competitor strategies and pricing', 'make_money', 4, 45, true),
  ('Apply to 5 opportunities', 'Submit applications to 5 jobs, contracts, or grants', 'make_money', 3, 20, true),
  ('Complete 30-min workout', 'Running, weight training, or gym session. Log time and type.', 'fitness', 5, 30, true),
  ('Meal prep for 3 days', 'Prepare healthy meals for next 3 days in containers', 'fitness', 4, 45, false),
  ('Morning meditation', '20-minute guided meditation practice', 'discipline_study', 2, 20, false),
  ('Study for 2 hours', 'Focused study session on target skill (no distractions)', 'discipline_study', 6, 120, true),
  ('Complete 1 course module', 'Finish module on Udemy, Coursera, or similar platform', 'discipline_study', 5, 60, true),
  ('Daily cold shower', '2-3 minute cold shower to build resilience', 'discipline_study', 3, 5, false);
```

---

## Notes

- All timestamps use UTC
- UUIDs are generated server-side for better performance
- Indexes are optimized for common query patterns
- RLS policies ensure users can only access their own data
- Triggers automatically maintain `updated_at` and calculate progress
- Leaderboard cache should be refreshed via scheduled job (e.g., hourly)
- Foreign key cascading ensures data integrity on user deletion

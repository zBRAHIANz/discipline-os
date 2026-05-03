# DISCIPLINE OS

> Execution is the only option.

A global execution enforcement system that converts user intent into mandatory daily actions with strict accountability, adaptive difficulty, and consequence-based progression.

## Quick Start

### Prerequisites
- Node.js 18+
- Supabase account
- Stripe account (for penalty mode)
- Vercel account (optional, for deployment)

### Setup

1. **Clone & Install**
   ```bash
   git clone https://github.com/zBRAHIANz/discipline-os.git
   cd discipline-os
   npm install
   ```

2. **Environment Variables**
   Create `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   STRIPE_SECRET_KEY=your_stripe_secret
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_publishable_key
   ```

3. **Database Setup**
   - Create Supabase project
   - Run migrations from `docs/DATABASE.md`
   - Enable RLS policies

4. **Run Development**
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000

## Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router), TailwindCSS, Zustand
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Payments**: Stripe
- **Hosting**: Vercel (frontend), Supabase (backend)

### Directory Structure
```
.
├── app/
│   ├── (auth)/              # Auth flows (login, signup, gates)
│   ├── (dashboard)/         # Main dashboard and user area
│   ├── api/                 # Backend API routes
│   ├── page.tsx             # Landing page
│   └── layout.tsx           # Root layout
├── components/              # Reusable UI components
├── docs/                    # Documentation
│   └── DATABASE.md          # Full schema & migrations
├── lib/                     # Utilities & configuration
│   ├── types.ts             # TypeScript interfaces
│   ├── supabase.ts          # Supabase clients
│   ├── stripe.ts            # Stripe setup
│   └── store.ts             # Zustand stores
├── styles/                  # Global CSS
├── public/                  # Static assets
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── tailwind.config.ts       # TailwindCSS config
├── next.config.js           # Next.js config
└── postcss.config.js        # PostCSS config
```

## Development Phases

### ✅ Phase 1: Auth & Database
- ✅ Project scaffolding
- ✅ Database schema (9 tables with RLS & triggers)
- ✅ TypeScript types
- ✅ Supabase & Stripe configuration
- [ ] Auth pages (login, signup, commitment gate)
- [ ] Session management
- [ ] Password hashing

### Phase 2: Core Dashboard
- [ ] Daily task display
- [ ] Real-time progress tracking
- [ ] Countdown timer (until midnight)
- [ ] Task completion UI
- [ ] Progress bar

### Phase 3: Task Engine
- [ ] AI-driven task generation
- [ ] Task assignment logic based on user level
- [ ] Proof requirements (image/video upload)
- [ ] Completion validation

### Phase 4: Progression System
- [ ] Streak tracking (+10% XP per day)
- [ ] XP calculation (+100 base, bonuses)
- [ ] Level progression system
- [ ] Rank percentile calculation

### Phase 5: Notifications
- [ ] Push notifications (browser)
- [ ] Email reminders
- [ ] Real-time deadline warnings
- [ ] Success/failure notifications

### Phase 6: Adaptive Logic
- [ ] Difficulty scaling based on performance
- [ ] Failure recovery (reduce difficulty on 2 consecutive failures)
- [ ] Task optimization
- [ ] Streak-based difficulty increase

### Phase 7: Monetization
- [ ] Premium subscription tier
- [ ] Penalty mode with financial deposits
- [ ] Stripe payment processing
- [ ] Subscription management
- [ ] Refund handling

### Phase 8: Community
- [ ] Global leaderboard
- [ ] Group mode with safety rules
- [ ] User rankings
- [ ] Anti-toxicity safeguards

## Database Schema

See `docs/DATABASE.md` for complete schema with relationships, indexes, and RLS policies.

Core tables:
- `users` - User profiles with progression metrics
- `tasks` - Master task library by category/difficulty
- `user_tasks` - Daily assignments (one per user per day per task)
- `progress` - Historical daily snapshots
- `notifications` - User alert history
- `subscriptions` - Payment tracking
- `subscription_events` - Audit trail
- `leaderboard_cache` - Pre-calculated rankings
- `analytics` - Performance metrics

## API Routes (To Be Implemented)

### Auth
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - Clear session
- `GET /api/auth/session` - Check auth status

### Dashboard
- `GET /api/dashboard/tasks` - Get today's tasks
- `POST /api/dashboard/tasks/complete` - Mark task complete
- `GET /api/dashboard/progress` - Get current progress

### Tasks
- `GET /api/tasks` - Get task library
- `POST /api/tasks/generate` - Generate daily tasks
- `PUT /api/tasks/:id` - Update task

### Progression
- `GET /api/progression/stats` - User stats
- `POST /api/progression/update` - Recalculate progression

### Leaderboard
- `GET /api/leaderboard` - Global rankings
- `GET /api/leaderboard/stats/:userId` - User rank stats

## Key Design Principles

### Execution Enforcement
- Daily mandatory tasks assigned at 00:00 UTC
- Real-time progress tracking throughout the day
- Hard deadline at end of day with automatic failure state
- Streak-based motivation system

### Consequence System
- Failure = streak reset (no partial credit)
- XP reduction on failure
- Rank decrease
- Optional financial penalties (penalty mode)

### Adaptive Difficulty
- Tasks scale based on user level and performance
- Reduced difficulty after 2 consecutive failures
- Increased difficulty on 5+ day streaks
- Performance-driven task complexity

### Monetization
- **Free Tier**: Basic tasks, basic tracking
- **Premium** ($10-30/mo): Adaptive system, analytics, full progression
- **Penalty Mode**: User deposits funds, failure triggers deduction, success preserves balance

## Deployment

### Vercel (Frontend)
```bash
vercel deploy
```

### Supabase (Backend)
- Already managed via Supabase hosting
- Auto-scaling, automatic backups, realtime sync

## Environment Setup

### Supabase
1. Create project at supabase.com
2. Run migrations from `docs/DATABASE.md`
3. Enable RLS on all tables
4. Copy API keys to `.env.local`

### Stripe
1. Create account at stripe.com
2. Get Secret and Publishable keys
3. Add to `.env.local`
4. Create Products/Pricing for Premium and Penalty Mode

## Contributing

Follow the priority order strictly:
1. Auth system
2. Core database schema ✅
3. Daily dashboard
4. Task engine
5. Progression system
6. Notifications
7. Adaptive logic
8. Monetization
9. Community

## License

Proprietary - DISCIPLINE OS © 2026

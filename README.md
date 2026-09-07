# CATLY — React/Vite V1

Premium CAT 2026 dashboard frontend.

## Run

```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal.

## Build

```bash
npm run build
```

## Supabase schedule setup

Run `supabase/migrations/20260906_create_schedule_tasks.sql` once in the Supabase SQL Editor. It creates the secure database table used by the **Today's Schedule** section of the Planner page.

Schedule tasks are stored under the signed-in user's account, so they stay available after refresh and on other devices.

## Supabase readiness setup

Run `supabase/migrations/20260907_create_user_readiness.sql` once in the Supabase SQL Editor. It creates the secure account-scoped storage used by the **My Target** readiness check and Dashboard.

On the first successful load, an existing browser-only readiness check is imported into the signed-in account and the legacy browser copy is removed.

## Current status

- React + Vite
- Tailwind-like custom CSS design system (no Tailwind build dependency needed)
- Recharts analytics
- Live countdown from one fixed CAT exam timestamp
- Dashboard
- Score → percentile analytics UI
- QA / VARC / DILR topic coverage
- Motivation
- Target simulation
- Final mock emotional completion
- Reminders

## IMPORTANT DATA NOTE

The values in `src/data/catData.js` are DEVELOPMENT PLACEHOLDERS.
They must be replaced by a verified CAT 2021–2025 dataset before publication.

Do not present AI-generated or guessed statistics as official CAT data.

## Next production layer

1. Import verified question-level CAT data.
2. Replace placeholder score-percentile observations.
3. Add Supabase/Postgres authentication and user profiles.
4. Add secure email/reminder system.
5. Add real mock-test backend.
6. Add authorized/public result integration if available.
7. Verify official CAT 2026 exam date/time before launch.

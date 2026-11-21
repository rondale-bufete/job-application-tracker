# Job Application Tracker

A Supabase-backed job-search workspace for tracking applications, follow-ups, interview notes, and pipeline status.

## Run locally

1. Install dependencies with `npm install`.
2. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`.
3. Run `npm run dev` and open [http://localhost:3000](http://localhost:3000).

## Database setup

The app expects an existing `public.applications` table with UUID `id` and `user_id` columns, plus `company`, `role`, `status`, `date_applied`, `job_description`, and `created_at`. The `status` values used by the app are `applied`, `interview`, `offer`, and `rejected`. Enable row-level security and ensure application policies restrict reads and writes to the authenticated owner.

Apply `supabase/migrations/20261121000000_add_application_workflow.sql` to add job details, follow-up tasks, activity history, indexes, and owner-scoped policies. Run the migration using the Supabase CLI if your project is linked, or execute the SQL in the Supabase SQL Editor.

## Checks

- `npm run lint`
- `node --test lib/application-utils.test.mjs`
- `npm run build`

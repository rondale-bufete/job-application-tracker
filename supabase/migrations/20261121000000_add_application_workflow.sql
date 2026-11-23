alter table public.applications
    add column if not exists job_url text,
    add column if not exists location text,
    add column if not exists salary_range text,
    add column if not exists contact_name text,
    add column if not exists contact_email text;

create table if not exists public.application_tasks (
    id uuid primary key default gen_random_uuid(),
    application_id uuid not null references public.applications(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete cascade,
    title text not null check (length(btrim(title)) > 0),
    notes text,
    due_date date not null,
    completed_at timestamptz,
    created_at timestamptz not null default now()
);

create index if not exists application_tasks_user_due_date_idx
    on public.application_tasks (user_id, due_date)
    where completed_at is null;

create index if not exists application_tasks_application_id_idx
    on public.application_tasks (application_id);

grant select, insert, update, delete on public.application_tasks to authenticated;

alter table public.application_tasks enable row level security;

drop policy if exists "Users can view their application tasks" on public.application_tasks;
create policy "Users can view their application tasks"
    on public.application_tasks for select to authenticated
    using (user_id = (select auth.uid()));

drop policy if exists "Users can create their application tasks" on public.application_tasks;
create policy "Users can create their application tasks"
    on public.application_tasks for insert to authenticated
    with check (
        user_id = (select auth.uid())
        and exists (
            select 1
            from public.applications as app
            where app.id = application_tasks.application_id
              and app.user_id = (select auth.uid())
        )
    );

drop policy if exists "Users can update their application tasks" on public.application_tasks;
create policy "Users can update their application tasks"
    on public.application_tasks for update to authenticated
    using (user_id = (select auth.uid()))
    with check (
        user_id = (select auth.uid())
        and exists (
            select 1
            from public.applications as app
            where app.id = application_tasks.application_id
              and app.user_id = (select auth.uid())
        )
    );

drop policy if exists "Users can delete their application tasks" on public.application_tasks;
create policy "Users can delete their application tasks"
    on public.application_tasks for delete to authenticated
    using (user_id = (select auth.uid()));

create table if not exists public.application_events (
    id uuid primary key default gen_random_uuid(),
    application_id uuid not null references public.applications(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete cascade,
    event_type text not null check (event_type in ('note', 'interview', 'status_change')),
    title text not null check (length(btrim(title)) > 0),
    body text,
    occurred_at timestamptz not null default now(),
    created_at timestamptz not null default now()
);

create index if not exists application_events_application_occurred_idx
    on public.application_events (application_id, occurred_at desc);

grant select, insert on public.application_events to authenticated;

alter table public.application_events enable row level security;

drop policy if exists "Users can view their application events" on public.application_events;
create policy "Users can view their application events"
    on public.application_events for select to authenticated
    using (user_id = (select auth.uid()));

drop policy if exists "Users can create their application events" on public.application_events;
create policy "Users can create their application events"
    on public.application_events for insert to authenticated
    with check (
        user_id = (select auth.uid())
        and exists (
            select 1
            from public.applications as app
            where app.id = application_events.application_id
              and app.user_id = (select auth.uid())
        )
    );

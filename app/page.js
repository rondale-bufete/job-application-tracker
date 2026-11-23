import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import KanbanBoard from "@/components/KanbanBoard";

function LandingPage() {
  const features = [
    {
      title: "Track every application",
      description:
        "See your pipeline clearly from first contact to final interview in a single organized dashboard.",
    },
    {
      title: "Stay on top of deadlines",
      description:
        "Keep interviews, follow-ups, and application statuses in one place so nothing slips through.",
    },
    {
      title: "Move with clarity",
      description:
        "Update your progress in seconds and keep your search momentum visible with a simple workflow.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Add roles",
      text: "Log every opportunity you apply to, from the job title to the company and date.",
    },
    {
      number: "02",
      title: "Track progress",
      text: "Move applications across stages and easily spot what is waiting for a reply.",
    },
    {
      number: "03",
      title: "Stay focused",
      text: "Review your pipeline, prioritize interviews, and keep your job search structured.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#121113] text-[#F4F3F1]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between py-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#818CF8] text-sm font-bold text-[#121113] shadow-lg shadow-[#818CF8]/25">
              J
            </div>
            <div>
              <p className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight">
                Job Tracker
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-[#A29E97] md:flex">
            <Link href="#features" className="transition hover:text-[#F4F3F1]">
              Features
            </Link>
            <Link href="#workflow" className="transition hover:text-[#F4F3F1]">
              How it works
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-[#F4F3F1] transition hover:border-white/20 hover:bg-white/[0.03]"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-[#818CF8] px-4 py-2 text-sm font-semibold text-[#121113] shadow-lg shadow-[#818CF8]/25 transition hover:bg-[#98A6FF]"
            >
              Get started
            </Link>
          </div>
        </header>

        <section className="grid items-center gap-12 pb-18 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:pb-24 lg:pt-16">
          <div>
            <span className="inline-flex items-center rounded-full border border-[#818CF8]/30 bg-[#818CF8]/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-[#C7D2FE]">
              Smart job search
            </span>

            <h1 className="mt-6 max-w-xl font-[family-name:var(--font-display)] text-4xl font-semibold leading-tight tracking-[-0.06em] text-[#F4F3F1] sm:text-5xl lg:text-6xl">
              Track every opportunity and stay in control.
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-[#A29E97] sm:text-lg">
              Organize applications, monitor progress, and keep your next steps visible from the very first click to the final offer.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-full bg-[#818CF8] px-5 py-3 text-sm font-semibold text-[#121113] shadow-lg shadow-[#818CF8]/25 transition hover:bg-[#98A6FF]"
              >
                Start tracking
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.02] px-5 py-3 text-sm font-semibold text-[#F4F3F1] transition hover:border-white/20 hover:bg-white/[0.04]"
              >
                Explore features
              </Link>
            </div>

            <p className="mt-8 max-w-lg text-sm leading-6 text-[#A29E97]">
              A focused workspace for applications, follow-ups, interview notes, and next steps.
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-[2rem] bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.35),transparent_60%)] blur-3xl" />

            <div className="rounded-[28px] border border-white/10 bg-[#1A181C] p-4 shadow-2xl shadow-black/30">
              <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-[#121113] px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                </div>
                <span className="text-xs uppercase tracking-[0.2em] text-[#A29E97]">
                  Example workflow
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {[
                  ["Applied", "12", "bg-[#818CF8]/10 text-[#C7D2FE]"],
                  ["Interview", "4", "bg-[#34D399]/10 text-[#A7F3D0]"],
                  ["Offer", "1", "bg-[#FBBF24]/10 text-[#FDE68A]"],
                ].map(([label, count, tone]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-2xl border border-white/5 bg-[#17151A] px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold ${tone}`}>
                        {count}
                      </span>
                      <span className="text-sm font-medium text-[#F4F3F1]">{label}</span>
                    </div>
                    <span className="text-xs uppercase tracking-[0.18em] text-[#A29E97]">
                      active
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-2xl border border-[#818CF8]/20 bg-[#818CF8]/5 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#A29E97]">A useful next step</span>
                  <span className="rounded-full bg-[#818CF8]/15 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#C7D2FE]">
                    Today
                  </span>
                </div>
                <p className="mt-3 font-[family-name:var(--font-display)] text-2xl font-semibold text-[#F4F3F1]">
                  Send a follow-up
                </p>
                <div className="mt-3 flex items-center justify-between text-sm text-[#A29E97]">
                  <span>Attach it to any application</span>
                  <span>When it’s due</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="pb-20 pt-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#A29E97]">
              Features
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-[-0.05em] text-[#F4F3F1] sm:text-4xl">
              Built to keep your search organized.
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-3xl border border-white/8 bg-white/[0.02] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] transition hover:border-white/15 hover:bg-white/[0.03]"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#818CF8]/10 text-[#C7D2FE]">
                  <span className="text-lg">✦</span>
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#F4F3F1]">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#A29E97]">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section id="workflow" className="pb-20">
          <div className="rounded-[32px] border border-white/8 bg-[#17151A] p-6 sm:p-8 lg:p-10">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#A29E97]">
                How it works
              </p>
              <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-[-0.05em] text-[#F4F3F1] sm:text-4xl">
                Make progress without the chaos.
              </h2>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {steps.map((step) => (
                <div key={step.number} className="rounded-3xl border border-white/8 bg-[#121113] p-6">
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#818CF8]">
                    {step.number}
                  </span>
                  <h3 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-semibold text-[#F4F3F1]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[#A29E97]">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-24">
          <div className="rounded-[32px] border border-[#818CF8]/20 bg-[linear-gradient(135deg,rgba(129,140,248,0.16),rgba(17,17,20,0.8))] p-8 sm:p-10">
            <div className="flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-left">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#C7D2FE]">
                  Ready to begin
                </p>
                <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-[-0.05em] text-[#F4F3F1] sm:text-4xl">
                  Turn your job search into a system.
                </h2>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-full bg-[#818CF8] px-5 py-3 text-sm font-semibold text-[#121113] transition hover:bg-[#98A6FF]"
                >
                  Create account
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-transparent px-5 py-3 text-sm font-semibold text-[#F4F3F1] transition hover:border-white/20 hover:bg-white/[0.03]"
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <LandingPage />;
  }

  const [
    { data: applications, error: applicationsError },
    { data: tasks, error: tasksError },
    { data: events, error: eventsError },
  ] = await Promise.all([
    supabase.from("applications").select("*").order("created_at", { ascending: false }),
    supabase.from("application_tasks").select("*").order("due_date", { ascending: true }),
    supabase.from("application_events").select("*").order("occurred_at", { ascending: false }),
  ]);

  if (applicationsError) console.error("Failed to load applications", applicationsError);
  if (tasksError) console.error("Failed to load application follow-ups", tasksError);
  if (eventsError) console.error("Failed to load application activity", eventsError);

  return (
    <main className="min-h-screen bg-[#121113]">
      <Navbar userEmail={user.email} />
      <KanbanBoard
        initialApplications={applications || []}
        initialTasks={tasks || []}
        initialEvents={events || []}
        loadErrors={{
          applications: applicationsError?.message || null,
          tasks: tasksError?.message || null,
          events: eventsError?.message || null,
        }}
      />
    </main>
  );
}
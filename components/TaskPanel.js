"use client";

import { getTaskBuckets, formatDateOnly } from "@/lib/application-utils.mjs";

const SECTIONS = [
    { key: "overdue", title: "Overdue", tone: "text-red-300" },
    { key: "today", title: "Today", tone: "text-amber-200" },
    { key: "upcoming", title: "Upcoming", tone: "text-[#C7D2FE]" },
];

export default function TaskPanel({ tasks, applications, onComplete, onOpenApplication, busyTaskIds }) {
    const buckets = getTaskBuckets(tasks);
    const appById = new Map(applications.map((application) => [application.id, application]));
    const openCount = Object.values(buckets).reduce((count, items) => count + items.length, 0);

    return (
        <section aria-labelledby="followups-heading" className="mb-8 rounded-2xl border border-white/10 bg-[#17151A] p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 id="followups-heading" className="text-lg font-semibold text-[#F4F3F1]">
                        Next steps
                    </h2>
                    <p className="mt-1 text-sm text-[#A29E97]">
                        {openCount ? `${openCount} open follow-up${openCount === 1 ? "" : "s"}` : "Nothing due. Add a follow-up to keep momentum."}
                    </p>
                </div>
            </div>

            {openCount === 0 ? (
                <p className="rounded-xl border border-dashed border-white/10 px-4 py-6 text-center text-sm text-[#A29E97]">
                    You’re all caught up.
                </p>
            ) : (
                <div className="grid gap-3 lg:grid-cols-3">
                    {SECTIONS.map((section) => (
                        <div key={section.key} className="min-w-0">
                            <h3 className={`mb-2 text-xs font-semibold uppercase tracking-[0.16em] ${section.tone}`}>
                                {section.title} <span className="opacity-70">({buckets[section.key].length})</span>
                            </h3>
                            {buckets[section.key].length === 0 ? (
                                <p className="rounded-xl bg-[#121113]/70 px-3 py-4 text-xs text-[#6E6A64]">No follow-ups</p>
                            ) : (
                                <ul className="space-y-2">
                                    {buckets[section.key].map((task) => {
                                        const application = appById.get(task.application_id);

                                        return (
                                            <li key={task.id} className="rounded-xl border border-white/5 bg-[#121113]/70 p-3">
                                                <div className="flex items-start gap-3">
                                                    <button
                                                        type="button"
                                                        aria-label={`Mark ${task.title} complete`}
                                                        disabled={busyTaskIds.has(task.id)}
                                                        onClick={() => onComplete(task)}
                                                        className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 text-xs text-[#A29E97] hover:border-[#818CF8] hover:text-[#C7D2FE] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#818CF8] disabled:opacity-50"
                                                    >
                                                        ✓
                                                    </button>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="break-words text-sm font-medium text-[#F4F3F1]">{task.title}</p>
                                                        {task.notes && <p className="mt-1 whitespace-pre-wrap text-xs text-[#A29E97]">{task.notes}</p>}
                                                        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#827D77]">
                                                            <span>{formatDateOnly(task.due_date, { year: "numeric" })}</span>
                                                            {application && (
                                                                <>
                                                                    <span aria-hidden="true">·</span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => onOpenApplication(application)}
                                                                        className="truncate text-[#C7D2FE] underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#818CF8]"
                                                                    >
                                                                        {application.company} — {application.role}
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

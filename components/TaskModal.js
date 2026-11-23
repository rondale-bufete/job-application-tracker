"use client";

import { useState } from "react";
import { getLocalDateString } from "@/lib/application-utils.mjs";
import { addApplicationTask } from "@/lib/applications";

export default function TaskModal({ applications, onClose, onAdded }) {
    const [applicationId, setApplicationId] = useState(applications[0]?.id || "");
    const [title, setTitle] = useState("");
    const [notes, setNotes] = useState("");
    const [dueDate, setDueDate] = useState(getLocalDateString());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const task = await addApplicationTask({ applicationId, title, notes, dueDate });
            onAdded(task);
            onClose();
        } catch (saveError) {
            setError(saveError.message || "The follow-up could not be saved.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="task-dialog-title"
                className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-[#1C1B1E] p-5 shadow-2xl sm:p-6"
            >
                <h2 id="task-dialog-title" className="mb-5 text-lg font-semibold text-[#F4F3F1]">
                    Schedule a follow-up
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="task-application" className="mb-1 block text-sm text-[#A29E97]">
                            Application
                        </label>
                        <select
                            id="task-application"
                            required
                            value={applicationId}
                            onChange={(event) => setApplicationId(event.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-[#121113] px-3 py-2.5 text-[#F4F3F1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#818CF8]"
                        >
                            {applications.map((application) => (
                                <option key={application.id} value={application.id}>
                                    {application.company} — {application.role}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="task-title" className="mb-1 block text-sm text-[#A29E97]">
                            What needs to happen?
                        </label>
                        <input
                            id="task-title"
                            required
                            maxLength={200}
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            placeholder="Send a thank-you email"
                            className="w-full rounded-lg border border-white/10 bg-[#121113] px-3 py-2.5 text-[#F4F3F1] placeholder:text-[#6E6A64] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#818CF8]"
                        />
                    </div>
                    <div>
                        <label htmlFor="task-due-date" className="mb-1 block text-sm text-[#A29E97]">
                            Due date
                        </label>
                        <input
                            id="task-due-date"
                            type="date"
                            required
                            value={dueDate}
                            onChange={(event) => setDueDate(event.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-[#121113] px-3 py-2.5 text-[#F4F3F1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#818CF8]"
                        />
                    </div>
                    <div>
                        <label htmlFor="task-notes" className="mb-1 block text-sm text-[#A29E97]">
                            Notes <span className="text-[#6E6A64]">(optional)</span>
                        </label>
                        <textarea
                            id="task-notes"
                            rows={3}
                            value={notes}
                            onChange={(event) => setNotes(event.target.value)}
                            className="w-full resize-y rounded-lg border border-white/10 bg-[#121113] px-3 py-2.5 text-[#F4F3F1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#818CF8]"
                        />
                    </div>

                    {error && <p role="alert" className="text-sm text-red-300">{error}</p>}

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="min-h-11 flex-1 rounded-lg border border-white/10 text-sm text-[#F4F3F1] hover:bg-white/5"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || applications.length === 0}
                            className="min-h-11 flex-1 rounded-lg bg-[#818CF8] text-sm font-semibold text-[#121113] hover:bg-[#98A6FF] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Saving..." : "Add follow-up"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}

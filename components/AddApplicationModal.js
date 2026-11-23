"use client";

import { useState } from "react";
import { addApplication } from "@/lib/applications";
import { getLocalDateString } from "@/lib/application-utils.mjs";

const INPUT_CLASS =
    "w-full rounded-lg border border-white/10 bg-[#121113] px-3 py-2.5 text-[#F4F3F1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#818CF8]";
const LABEL_CLASS = "mb-1 block text-sm text-[#A29E97]";

export default function AddApplicationModal({ onClose, onAdded }) {
    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");
    const [dateApplied, setDateApplied] = useState(getLocalDateString());
    const [jobDescription, setJobDescription] = useState("");
    const [jobUrl, setJobUrl] = useState("");
    const [location, setLocation] = useState("");
    const [salaryRange, setSalaryRange] = useState("");
    const [contactName, setContactName] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const newApp = await addApplication({
                company,
                role,
                dateApplied,
                jobDescription,
                jobUrl,
                location,
                salaryRange,
                contactName,
                contactEmail,
            });
            onAdded(newApp);
            onClose();
        } catch (saveError) {
            setError(saveError.message || "The application could not be saved.");
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
                aria-labelledby="application-dialog-title"
                className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#1C1B1E] p-5 shadow-2xl sm:p-6"
            >
                <h2 id="application-dialog-title" className="mb-5 text-lg font-semibold text-[#F4F3F1]">
                    Add application
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label htmlFor="application-company" className={LABEL_CLASS}>Company</label>
                            <input id="application-company" required maxLength={200} value={company} onChange={(event) => setCompany(event.target.value)} className={INPUT_CLASS} />
                        </div>
                        <div>
                            <label htmlFor="application-role" className={LABEL_CLASS}>Role</label>
                            <input id="application-role" required maxLength={200} value={role} onChange={(event) => setRole(event.target.value)} className={INPUT_CLASS} />
                        </div>
                        <div>
                            <label htmlFor="application-date" className={LABEL_CLASS}>Date applied</label>
                            <input id="application-date" type="date" required value={dateApplied} onChange={(event) => setDateApplied(event.target.value)} className={INPUT_CLASS} />
                        </div>
                        <div>
                            <label htmlFor="application-location" className={LABEL_CLASS}>Location</label>
                            <input id="application-location" maxLength={200} value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Remote, New York..." className={INPUT_CLASS} />
                        </div>
                        <div>
                            <label htmlFor="application-salary" className={LABEL_CLASS}>Salary range</label>
                            <input id="application-salary" maxLength={100} value={salaryRange} onChange={(event) => setSalaryRange(event.target.value)} placeholder="$90k–$120k" className={INPUT_CLASS} />
                        </div>
                        <div>
                            <label htmlFor="application-url" className={LABEL_CLASS}>Job posting URL</label>
                            <input id="application-url" type="url" maxLength={2048} value={jobUrl} onChange={(event) => setJobUrl(event.target.value)} placeholder="https://" className={INPUT_CLASS} />
                        </div>
                        <div>
                            <label htmlFor="application-contact" className={LABEL_CLASS}>Contact name</label>
                            <input id="application-contact" maxLength={200} value={contactName} onChange={(event) => setContactName(event.target.value)} className={INPUT_CLASS} />
                        </div>
                        <div>
                            <label htmlFor="application-contact-email" className={LABEL_CLASS}>Contact email</label>
                            <input id="application-contact-email" type="email" maxLength={254} value={contactEmail} onChange={(event) => setContactEmail(event.target.value)} className={INPUT_CLASS} />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="application-description" className={LABEL_CLASS}>Job description</label>
                        <textarea
                            id="application-description"
                            rows={5}
                            maxLength={20000}
                            value={jobDescription}
                            onChange={(event) => setJobDescription(event.target.value)}
                            placeholder="Paste the job description here..."
                            className={`${INPUT_CLASS} resize-y font-mono text-sm`}
                        />
                    </div>

                    {error && <p role="alert" className="text-sm text-red-300">{error}</p>}

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="min-h-11 flex-1 rounded-lg border border-white/10 text-sm text-[#F4F3F1] hover:bg-white/5">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="min-h-11 flex-1 rounded-lg bg-[#818CF8] text-sm font-semibold text-[#121113] hover:bg-[#98A6FF] disabled:cursor-not-allowed disabled:opacity-60">
                            {loading ? "Saving..." : "Add application"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}

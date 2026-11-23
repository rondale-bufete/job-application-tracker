"use client";

import { useState } from "react";
import { addApplicationEvent, updateApplication, deleteApplication } from "@/lib/applications";
import { formatDateOnly, getSafeHttpUrl } from "@/lib/application-utils.mjs";

const INPUT_CLASS =
    "w-full rounded-lg border border-white/10 bg-[#121113] px-3 py-2.5 text-[#F4F3F1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#818CF8]";
const LABEL_CLASS = "mb-1 block text-sm text-[#A29E97]";

export default function ApplicationDetailModal({
    application,
    events,
    activityError,
    onClose,
    onUpdated,
    onDeleted,
    onEventAdded,
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [company, setCompany] = useState(application.company);
    const [role, setRole] = useState(application.role);
    const [dateApplied, setDateApplied] = useState(application.date_applied);
    const [jobDescription, setJobDescription] = useState(application.job_description || "");
    const [jobUrl, setJobUrl] = useState(application.job_url || "");
    const [location, setLocation] = useState(application.location || "");
    const [salaryRange, setSalaryRange] = useState(application.salary_range || "");
    const [contactName, setContactName] = useState(application.contact_name || "");
    const [contactEmail, setContactEmail] = useState(application.contact_email || "");
    const [eventType, setEventType] = useState("note");
    const [eventTitle, setEventTitle] = useState("");
    const [eventBody, setEventBody] = useState("");
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [savingEvent, setSavingEvent] = useState(false);
    const [error, setError] = useState(null);
    const jobPostingUrl = getSafeHttpUrl(application.job_url);

    async function handleSave(event) {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const updated = await updateApplication(application.id, {
                company,
                role,
                date_applied: dateApplied,
                job_description: jobDescription.trim() || null,
                job_url: jobUrl.trim() || null,
                location: location.trim() || null,
                salary_range: salaryRange.trim() || null,
                contact_name: contactName.trim() || null,
                contact_email: contactEmail.trim() || null,
            });
            onUpdated(updated);
            setIsEditing(false);
        } catch (saveError) {
            setError(saveError.message || "The application could not be saved.");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete() {
        if (!confirm("Delete this application and its follow-ups? This can't be undone.")) return;
        setDeleting(true);
        setError(null);
        try {
            await deleteApplication(application.id);
            onDeleted(application.id);
            onClose();
        } catch (deleteError) {
            setError(deleteError.message || "The application could not be deleted.");
            setDeleting(false);
        }
    }

    async function handleAddEvent(event) {
        event.preventDefault();
        setSavingEvent(true);
        setError(null);
        try {
            const savedEvent = await addApplicationEvent({
                applicationId: application.id,
                eventType,
                title: eventTitle,
                body: eventBody,
            });
            onEventAdded(savedEvent);
            setEventTitle("");
            setEventBody("");
        } catch (saveError) {
            setError(saveError.message || "The activity could not be saved.");
        } finally {
            setSavingEvent(false);
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
                aria-labelledby="application-detail-title"
                className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#1C1B1E] p-5 shadow-2xl sm:p-6"
            >
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <h2 id="application-detail-title" className="break-words text-xl font-semibold text-[#F4F3F1]">
                            {application.company}
                        </h2>
                        <p className="mt-1 text-[#A29E97]">{application.role}</p>
                        <p className="mt-2 text-xs text-[#827D77]">
                            Applied {formatDateOnly(application.date_applied, { year: "numeric", month: "long" })}
                        </p>
                    </div>
                    <button
                        type="button"
                        aria-label="Close application details"
                        onClick={onClose}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-xl text-[#A29E97] hover:bg-white/5 hover:text-[#F4F3F1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#818CF8]"
                    >
                        ×
                    </button>
                </div>

                {isEditing ? (
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="edit-company" className={LABEL_CLASS}>Company</label>
                                <input id="edit-company" required maxLength={200} value={company} onChange={(event) => setCompany(event.target.value)} className={INPUT_CLASS} />
                            </div>
                            <div>
                                <label htmlFor="edit-role" className={LABEL_CLASS}>Role</label>
                                <input id="edit-role" required maxLength={200} value={role} onChange={(event) => setRole(event.target.value)} className={INPUT_CLASS} />
                            </div>
                            <div>
                                <label htmlFor="edit-date" className={LABEL_CLASS}>Date applied</label>
                                <input id="edit-date" type="date" required value={dateApplied} onChange={(event) => setDateApplied(event.target.value)} className={INPUT_CLASS} />
                            </div>
                            <div>
                                <label htmlFor="edit-location" className={LABEL_CLASS}>Location</label>
                                <input id="edit-location" maxLength={200} value={location} onChange={(event) => setLocation(event.target.value)} className={INPUT_CLASS} />
                            </div>
                            <div>
                                <label htmlFor="edit-salary" className={LABEL_CLASS}>Salary range</label>
                                <input id="edit-salary" maxLength={100} value={salaryRange} onChange={(event) => setSalaryRange(event.target.value)} className={INPUT_CLASS} />
                            </div>
                            <div>
                                <label htmlFor="edit-job-url" className={LABEL_CLASS}>Job posting URL</label>
                                <input id="edit-job-url" type="url" maxLength={2048} value={jobUrl} onChange={(event) => setJobUrl(event.target.value)} className={INPUT_CLASS} />
                            </div>
                            <div>
                                <label htmlFor="edit-contact-name" className={LABEL_CLASS}>Contact name</label>
                                <input id="edit-contact-name" maxLength={200} value={contactName} onChange={(event) => setContactName(event.target.value)} className={INPUT_CLASS} />
                            </div>
                            <div>
                                <label htmlFor="edit-contact-email" className={LABEL_CLASS}>Contact email</label>
                                <input id="edit-contact-email" type="email" maxLength={254} value={contactEmail} onChange={(event) => setContactEmail(event.target.value)} className={INPUT_CLASS} />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="edit-description" className={LABEL_CLASS}>Job description</label>
                            <textarea id="edit-description" rows={5} maxLength={20000} value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} className={`${INPUT_CLASS} resize-y font-mono text-sm`} />
                        </div>
                        <div className="flex gap-3">
                            <button type="button" onClick={() => setIsEditing(false)} className="min-h-11 flex-1 rounded-lg border border-white/10 text-sm text-[#F4F3F1] hover:bg-white/5">
                                Cancel
                            </button>
                            <button type="submit" disabled={loading} className="min-h-11 flex-1 rounded-lg bg-[#818CF8] text-sm font-semibold text-[#121113] disabled:opacity-60">
                                {loading ? "Saving..." : "Save changes"}
                            </button>
                        </div>
                    </form>
                ) : (
                    <>
                        <dl className="mb-5 grid gap-3 rounded-xl border border-white/5 bg-[#121113]/70 p-4 text-sm sm:grid-cols-2">
                            {application.location && <div><dt className="text-xs text-[#827D77]">Location</dt><dd className="mt-1 text-[#F4F3F1]">{application.location}</dd></div>}
                            {application.salary_range && <div><dt className="text-xs text-[#827D77]">Salary range</dt><dd className="mt-1 text-[#F4F3F1]">{application.salary_range}</dd></div>}
                            {application.contact_name && <div><dt className="text-xs text-[#827D77]">Contact</dt><dd className="mt-1 text-[#F4F3F1]">{application.contact_name}</dd></div>}
                            {application.contact_email && <div><dt className="text-xs text-[#827D77]">Contact email</dt><dd className="mt-1"><a href={`mailto:${application.contact_email}`} className="text-[#C7D2FE] underline-offset-2 hover:underline">{application.contact_email}</a></dd></div>}
                            {jobPostingUrl && <div className="sm:col-span-2"><dt className="text-xs text-[#827D77]">Job posting</dt><dd className="mt-1 break-all"><a href={jobPostingUrl} target="_blank" rel="noopener noreferrer" className="text-[#C7D2FE] underline-offset-2 hover:underline">Open job posting</a></dd></div>}
                        </dl>

                        <div className="mb-6">
                            <h3 className="mb-2 text-sm font-medium text-[#F4F3F1]">Job description</h3>
                            {application.job_description ? (
                                <p className="max-h-48 overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed text-[#A29E97]">
                                    {application.job_description}
                                </p>
                            ) : (
                                <p className="text-sm italic text-[#827D77]">No description added.</p>
                            )}
                        </div>

                        <section aria-labelledby="activity-heading" className="border-t border-white/10 pt-5">
                            <h3 id="activity-heading" className="text-sm font-semibold text-[#F4F3F1]">Activity</h3>
                            {activityError ? (
                                <p role="status" className="mt-3 rounded-lg border border-amber-400/20 bg-amber-400/5 p-3 text-sm text-amber-100">
                                    Activity history could not be loaded. Apply the database migration and reload to enable it.
                                </p>
                            ) : (
                                <>
                                    <form onSubmit={handleAddEvent} className="mt-3 space-y-3 rounded-xl border border-white/5 bg-[#121113]/70 p-3">
                                        <div className="grid gap-3 sm:grid-cols-[150px_1fr]">
                                            <div>
                                                <label htmlFor="activity-type" className={LABEL_CLASS}>Type</label>
                                                <select id="activity-type" value={eventType} onChange={(event) => setEventType(event.target.value)} className={INPUT_CLASS}>
                                                    <option value="note">Note</option>
                                                    <option value="interview">Interview</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label htmlFor="activity-title" className={LABEL_CLASS}>Title</label>
                                                <input id="activity-title" required maxLength={200} value={eventTitle} onChange={(event) => setEventTitle(event.target.value)} placeholder={eventType === "interview" ? "Hiring manager interview" : "Recruiter said to follow up"} className={INPUT_CLASS} />
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="activity-body" className={LABEL_CLASS}>Details <span className="text-[#6E6A64]">(optional)</span></label>
                                            <textarea id="activity-body" rows={2} maxLength={5000} value={eventBody} onChange={(event) => setEventBody(event.target.value)} className={`${INPUT_CLASS} resize-y`} />
                                        </div>
                                        <button type="submit" disabled={savingEvent} className="min-h-11 rounded-lg border border-[#818CF8]/30 px-4 text-sm font-medium text-[#C7D2FE] hover:bg-[#818CF8]/10 disabled:opacity-60">
                                            {savingEvent ? "Adding..." : "Add activity"}
                                        </button>
                                    </form>

                                    {events.length === 0 ? (
                                        <p className="py-5 text-sm text-[#827D77]">No activity yet. Add a note after your next conversation.</p>
                                    ) : (
                                        <ol className="mt-4 space-y-3">
                                            {events.map((item) => (
                                                <li key={item.id} className="border-l border-white/10 pl-4">
                                                    <p className="text-sm font-medium text-[#F4F3F1]">{item.title}</p>
                                                    <p className="mt-1 text-xs text-[#827D77]">
                                                        {item.event_type.replace("_", " ")} · {new Date(item.occurred_at).toLocaleString()}
                                                    </p>
                                                    {item.body && <p className="mt-2 whitespace-pre-wrap text-sm text-[#A29E97]">{item.body}</p>}
                                                </li>
                                            ))}
                                        </ol>
                                    )}
                                </>
                            )}
                        </section>

                        <div className="mt-6 flex gap-3 border-t border-white/10 pt-4">
                            <button type="button" onClick={() => setIsEditing(true)} className="min-h-11 flex-1 rounded-lg border border-white/10 text-sm text-[#F4F3F1] hover:bg-white/5">
                                Edit
                            </button>
                            <button type="button" onClick={handleDelete} disabled={deleting} className="min-h-11 flex-1 rounded-lg border border-red-500/30 text-sm text-red-300 hover:bg-red-500/10 disabled:opacity-60">
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </>
                )}

                {error && <p role="alert" className="mt-4 text-sm text-red-300">{error}</p>}
            </section>
        </div>
    );
}

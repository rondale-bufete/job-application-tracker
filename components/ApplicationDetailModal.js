"use client";

import { useState } from "react";
import { updateApplication, deleteApplication } from "@/lib/applications";

export default function ApplicationDetailModal({ application, onClose, onUpdated, onDeleted }) {
    const [isEditing, setIsEditing] = useState(false);
    const [company, setCompany] = useState(application.company);
    const [role, setRole] = useState(application.role);
    const [dateApplied, setDateApplied] = useState(application.date_applied);
    const [jobDescription, setJobDescription] = useState(application.job_description || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handleSave(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const updated = await updateApplication(application.id, {
                company,
                role,
                date_applied: dateApplied,
                job_description: jobDescription || null,
            });
            onUpdated(updated);
            setIsEditing(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete() {
        if (!confirm("Delete this application? This can't be undone.")) return;
        await deleteApplication(application.id);
        onDeleted(application.id);
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[85vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {isEditing ? (
                    <form onSubmit={handleSave} className="space-y-4">
                        <h2 className="text-lg font-semibold mb-2">Edit Application</h2>

                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Company</label>
                            <input
                                type="text"
                                required
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Role</label>
                            <input
                                type="text"
                                required
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Date Applied</label>
                            <input
                                type="date"
                                required
                                value={dateApplied}
                                onChange={(e) => setDateApplied(e.target.value)}
                                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Job Description</label>
                            <textarea
                                rows={8}
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 font-mono text-sm resize-y"
                            />
                        </div>

                        {error && <p className="text-sm text-red-600">{error}</p>}

                        <div className="flex gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="flex-1 py-2 rounded-md border border-gray-300 hover:border-gray-900 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-2 rounded-md bg-gray-900 text-white hover:bg-blue-600 transition-colors disabled:opacity-60"
                            >
                                {loading ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </form>
                ) : (
                    <>
                        <div className="flex items-start justify-between mb-1">
                            <h2 className="text-xl font-semibold">{application.company}</h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-900 text-xl leading-none">
                                ×
                            </button>
                        </div>
                        <p className="text-gray-500 mb-1">{application.role}</p>
                        <p className="text-xs text-gray-400 mb-5">
                            Applied{" "}
                            {new Date(application.date_applied).toLocaleDateString(undefined, {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </p>

                        {application.job_description ? (
                            <div className="mb-5">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Job Description</h3>
                                <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                                    {application.job_description}
                                </p>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 italic mb-5">No description added.</p>
                        )}

                        <div className="flex gap-2 pt-2 border-t border-gray-100">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex-1 py-2 mt-4 rounded-md border border-gray-300 hover:border-gray-900 transition-colors text-sm"
                            >
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 py-2 mt-4 rounded-md border border-red-200 text-red-600 hover:bg-red-50 transition-colors text-sm"
                            >
                                Delete
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
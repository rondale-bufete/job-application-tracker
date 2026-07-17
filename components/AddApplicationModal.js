"use client";

import { useState } from "react";
import { addApplication } from "@/lib/applications";

export default function AddApplicationModal({ onClose, onAdded }) {
    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");
    const [dateApplied, setDateApplied] = useState(new Date().toISOString().slice(0, 10));
    const [jobDescription, setJobDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const newApp = await addApplication({
                company,
                role,
                dateApplied,
                jobDescription,
                status: "applied",
            });
            onAdded(newApp);
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-[#1C1B1E] border border-white/[0.08] rounded-xl shadow-2xl max-w-md w-full p-6 max-h-[85vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-semibold mb-4 text-[#F4F3F1]">Add Application</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-[#A29E97] mb-1">Company</label>
                        <input
                            type="text"
                            required
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            className="w-full px-3 py-2 rounded-md bg-[#121113] border border-white/10 text-[#F4F3F1] focus:outline-none focus:border-[#818CF8]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-[#A29E97] mb-1">Role</label>
                        <input
                            type="text"
                            required
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-3 py-2 rounded-md bg-[#121113] border border-white/10 text-[#F4F3F1] focus:outline-none focus:border-[#818CF8]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-[#A29E97] mb-1">Date Applied</label>
                        <input
                            type="date"
                            required
                            value={dateApplied}
                            onChange={(e) => setDateApplied(e.target.value)}
                            className="w-full px-3 py-2 rounded-md bg-[#121113] border border-white/10 text-[#F4F3F1] focus:outline-none focus:border-[#818CF8]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-[#A29E97] mb-1">Job Description</label>
                        <textarea
                            rows={8}
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the job description here..."
                            className="w-full px-3 py-2 rounded-md bg-[#121113] border border-white/10 text-[#F4F3F1] focus:outline-none focus:border-[#818CF8] font-mono text-sm resize-y placeholder:text-[#6E6A64]"
                        />
                    </div>

                    {error && <p className="text-sm text-red-400">{error}</p>}

                    <div className="flex gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2 rounded-md border border-white/10 text-[#F4F3F1] hover:border-white/25 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2 rounded-md bg-[#818CF8] text-[#121113] font-medium hover:bg-[#a5b0f9] transition-colors disabled:opacity-60"
                        >
                            {loading ? "Adding..." : "Add"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
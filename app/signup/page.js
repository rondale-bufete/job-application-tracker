"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const supabase = createClient();
        const { error } = await supabase.auth.signUp({ email, password });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        setSubmitted(true);
        setLoading(false);
    }

    if (submitted) {
        return (
            <main className="min-h-screen bg-[#121113] px-6 py-10 text-[#F4F3F1]">
                <div className="mx-auto max-w-xl rounded-[32px] border border-white/8 bg-[#17151A] p-8 text-center shadow-2xl shadow-black/30 sm:p-10">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#818CF8]/10 text-3xl">
                        ✉️
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#C7D2FE]">
                        Check your inbox
                    </p>
                    <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-[-0.04em] text-[#F4F3F1]">
                        Confirm your email
                    </h1>
                    <p className="mt-4 text-base leading-7 text-[#A29E97]">
                        We sent a confirmation link to <strong className="text-[#F4F3F1]">{email}</strong>.
                        Click it to activate your account, then come back and log in.
                    </p>
                    <Link
                        href="/login"
                        className="mt-8 inline-flex items-center justify-center rounded-full bg-[#818CF8] px-5 py-3 text-sm font-semibold text-[#121113] shadow-lg shadow-[#818CF8]/25 transition hover:bg-[#98A6FF]"
                    >
                        Go to login
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#121113] px-6 py-10 text-[#F4F3F1]">
            <div className="mx-auto max-w-6xl">
                <header className="mb-10 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#818CF8] text-sm font-bold text-[#121113] shadow-lg shadow-[#818CF8]/25">
                            J
                        </div>
                        <span className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight">
                            Job Tracker
                        </span>
                    </Link>

                    <Link
                        href="/login"
                        className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-[#F4F3F1] transition hover:border-white/20 hover:bg-white/[0.03]"
                    >
                        Log in
                    </Link>
                </header>

                <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="hidden lg:block">
                        <div className="rounded-[32px] border border-white/8 bg-[#17151A] p-8 shadow-2xl shadow-black/30">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#C7D2FE]">
                                Begin your search
                            </p>
                            <h1 className="mt-4 max-w-md font-[family-name:var(--font-display)] text-4xl font-semibold tracking-[-0.05em] text-[#F4F3F1]">
                                Turn applications into momentum.
                            </h1>
                            <p className="mt-4 max-w-md text-base leading-7 text-[#A29E97]">
                                Get organized, track every role, and keep your next interview steps visible without the chaos.
                            </p>

                            <div className="mt-8 space-y-4">
                                {[
                                    "Organize roles and statuses",
                                    "Spot follow-ups before they slip",
                                    "Stay focused through every interview stage",
                                ].map((item) => (
                                    <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/5 bg-[#121113] px-4 py-3">
                                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#818CF8]/10 text-[#C7D2FE]">
                                            ✓
                                        </span>
                                        <span className="text-sm text-[#F4F3F1]">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mx-auto w-full max-w-md rounded-[30px] border border-white/8 bg-[#17151A]/90 p-6 shadow-2xl shadow-black/30 backdrop-blur-md sm:p-8">
                        <div className="mb-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#A29E97]">
                                Create account
                            </p>
                            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-[-0.05em] text-[#F4F3F1]">
                                Get started
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm text-[#A29E97]" htmlFor="email">
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-2xl border border-white/10 bg-[#121113] px-4 py-3 text-[#F4F3F1] placeholder:text-[#6E6A64] transition focus:border-[#818CF8] focus:outline-none"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-[#A29E97]" htmlFor="password">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    minLength={6}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-2xl border border-white/10 bg-[#121113] px-4 py-3 text-[#F4F3F1] placeholder:text-[#6E6A64] transition focus:border-[#818CF8] focus:outline-none"
                                    placeholder="At least 6 characters"
                                />
                            </div>

                            {error && (
                                <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-full bg-[#818CF8] px-4 py-3 text-sm font-semibold text-[#121113] shadow-lg shadow-[#818CF8]/25 transition hover:bg-[#98A6FF] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? "Creating account..." : "Create account"}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-[#A29E97]">
                            Already have an account?{" "}
                            <Link href="/login" className="font-medium text-[#C7D2FE] transition hover:text-[#F4F3F1]">
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
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
            <main className="min-h-screen flex items-center justify-center bg-[#121113] px-6">
                <div className="w-full max-w-sm text-center">
                    <div className="w-14 h-14 rounded-full bg-[#818CF8]/10 flex items-center justify-center mx-auto mb-5">
                        <span className="text-2xl">📧</span>
                    </div>
                    <h1 className="text-2xl font-semibold mb-2 text-[#F4F3F1]">Check your email</h1>
                    <p className="text-[#A29E97] text-sm leading-relaxed">
                        We sent a confirmation link to <strong className="text-[#F4F3F1]">{email}</strong>.
                        Click it to activate your account, then come back and log in.
                    </p>
                    <Link
                        href="/login"
                        className="inline-block mt-6 px-6 py-2.5 rounded-md bg-[#818CF8] text-[#121113] text-sm font-medium hover:bg-[#a5b0f9] transition-colors"
                    >
                        Go to Login
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-[#121113] px-6">
            <div className="w-full max-w-sm">
                <h1 className="text-2xl font-semibold mb-1 text-[#F4F3F1]">Create an account</h1>
                <p className="text-[#A29E97] text-sm mb-6">Start tracking your job applications.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-[#A29E97] mb-1" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-md bg-[#1C1B1E] border border-white/10 text-[#F4F3F1] focus:outline-none focus:border-[#818CF8]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-[#A29E97] mb-1" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-md bg-[#1C1B1E] border border-white/10 text-[#F4F3F1] focus:outline-none focus:border-[#818CF8]"
                        />
                    </div>

                    {error && <p className="text-sm text-red-400">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 rounded-md bg-[#818CF8] text-[#121113] font-medium hover:bg-[#a5b0f9] transition-colors disabled:opacity-60"
                    >
                        {loading ? "Creating account..." : "Sign Up"}
                    </button>
                </form>

                <p className="text-sm text-[#A29E97] mt-6 text-center">
                    Already have an account?{" "}
                    <Link href="/login" className="text-[#818CF8] hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </main>
    );
}
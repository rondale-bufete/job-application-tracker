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
        const { data, error } = await supabase.auth.signUp({ email, password });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        // With email confirmation enabled, signUp succeeds but returns no active session
        setSubmitted(true);
        setLoading(false);
    }

    if (submitted) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-[#FAFAFA] px-6">
                <div className="w-full max-w-sm text-center">
                    <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-5">
                        <span className="text-2xl">📧</span>
                    </div>
                    <h1 className="text-2xl font-semibold mb-2">Check your email</h1>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        We sent a confirmation link to <strong>{email}</strong>. Click it to activate your
                        account, then come back and log in.
                    </p>
                    <Link
                        href="/login"
                        className="inline-block mt-6 px-6 py-2.5 rounded-md bg-gray-900 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
                    >
                        Go to Login
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-[#FAFAFA] px-6">
            <div className="w-full max-w-sm">
                <h1 className="text-2xl font-semibold mb-1">Create an account</h1>
                <p className="text-gray-500 text-sm mb-6">Start tracking your job applications.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 mb-1" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 rounded-md bg-gray-900 text-white font-medium hover:bg-blue-600 transition-colors disabled:opacity-60"
                    >
                        {loading ? "Creating account..." : "Sign Up"}
                    </button>
                </form>

                <p className="text-sm text-gray-500 mt-6 text-center">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-600 hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </main>
    );
}
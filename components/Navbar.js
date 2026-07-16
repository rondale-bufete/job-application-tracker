"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Navbar({ userEmail }) {
    const router = useRouter();

    async function handleLogout() {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    }

    return (
        <header className="border-b border-black/5 px-6 py-4 flex items-center justify-between bg-white/70 backdrop-blur-md sticky top-0 z-30">
            <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-[#4F46E5] flex items-center justify-center">
                    <span className="text-white text-sm font-bold font-[family-name:var(--font-display)]">
                        J
                    </span>
                </div>
                <h1 className="text-lg font-medium font-[family-name:var(--font-display)] tracking-tight">
                    Job Tracker
                </h1>
            </div>
            <div className="flex items-center gap-4 text-sm">
                <span className="text-[#6B6862] hidden sm:inline">{userEmail}</span>
                <button
                    onClick={handleLogout}
                    className="px-3.5 py-1.5 rounded-md border border-black/10 hover:border-black/30 hover:bg-black/[0.02] transition-colors text-[#1C1B1A]"
                >
                    Log out
                </button>
            </div>
        </header>
    );
}
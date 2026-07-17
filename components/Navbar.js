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
        <header className="border-b border-white/[0.08] px-6 py-4 flex items-center justify-between bg-[#121113]/80 backdrop-blur-md sticky top-0 z-30">
            <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-[#818CF8] flex items-center justify-center">
                    <span className="text-[#121113] text-sm font-bold font-[family-name:var(--font-display)]">
                        J
                    </span>
                </div>
                <h1 className="text-lg font-medium font-[family-name:var(--font-display)] tracking-tight">
                    Job Tracker
                </h1>
            </div>
            <div className="flex items-center gap-4 text-sm">
                <span className="text-[#A29E97] hidden sm:inline">{userEmail}</span>
                <button
                    onClick={handleLogout}
                    className="px-3.5 py-1.5 rounded-md border border-white/10 hover:border-white/25 hover:bg-white/[0.03] transition-colors text-[#F4F3F1]"
                >
                    Log out
                </button>
            </div>
        </header>
    );
}
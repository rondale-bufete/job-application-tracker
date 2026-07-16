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
        <header className="border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-white">
            <h1 className="text-lg font-semibold">Job Tracker</h1>
            <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-500">{userEmail}</span>
                <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 rounded-md border border-gray-300 hover:border-gray-900 transition-colors"
                >
                    Log out
                </button>
            </div>
        </header>
    );
}
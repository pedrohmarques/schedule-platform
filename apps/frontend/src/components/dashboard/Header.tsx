"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CalendarClock, LogOut } from "lucide-react";

interface StoredUser {
    name: string;
    email: string;
}

export default function Header() {
    const router = useRouter()
    const [user, setUser] = useState<StoredUser | null>(null);
    const pathname = usePathname();
    const role = pathname.startsWith("/dashboard/professional") ? "Profissional" : "Cliente";

    useEffect(() => {
        const raw = sessionStorage.getItem("user");
        if (raw) {
            setUser(JSON.parse(raw));
        }
    }, []);

    function logout() {
        sessionStorage.clear()
        document.cookie = "token=; path=/; max-age=0";
        router.push("/")
    }

    return (
        <div className="border-b border-[var(--border)] bg-[var(--card)]/70 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
                <div className="flex items-center gap-2">
                    <span className="flex size-9 items-center justify-center rounded-3xl bg-[var(--primary)] text-[var(--primary-foreground)]">
                        <CalendarClock size={18} />
                    </span>

                    <span className="font-display text-lg font-semibold tracking-tight">Horalis</span>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden text-right sm:block">
                        <p className="text-sm font-medium leading-tight">{user?.name ?? "..."}</p>
                        <p className="text-xs capitalize text-[var(--muted-foreground)]">{role}</p>
                    </div>
                    <button
                        onClick={logout}
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-[var(--input)] bg-[var(--background)] shadow-sm hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] h-8 rounded-md px-3 text-xs">
                        <LogOut size={16}/> Sair
                    </button>
                </div>
            </div>
        </div>
    )
}

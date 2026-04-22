import Link from "next/link";

import { AuthActions } from "@/components/AuthActions";
import type { UserProfile } from "@/types";

export function SiteHeader({ profile }: { profile: UserProfile | null }) {
  const userName = profile?.display_name?.trim() || "Guest";

  return (
    <header className="sticky top-0 z-30 border-b border-black/10 bg-(--paper)/95 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="text-lg font-bold tracking-tight text-foreground">
          BlogSpace
        </Link>
        <nav className="flex items-center gap-3 text-sm font-medium text-(--ink-soft) md:gap-4">
          <Link href="/">Posts</Link>
          <Link href="/dashboard">Dashboard</Link>
          {!profile ? <Link href="/auth">Login</Link> : null}
          <span className="hidden text-xs font-semibold text-(--ink-soft) sm:inline">Hi, {userName}</span>
          <span className="rounded-full border border-black/15 bg-white px-3 py-1 text-xs uppercase tracking-wider text-foreground">
            {profile?.role ?? "guest"}
          </span>
          <AuthActions isLoggedIn={Boolean(profile)} />
        </nav>
      </div>
    </header>
  );
}

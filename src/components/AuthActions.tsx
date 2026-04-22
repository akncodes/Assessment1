"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

interface AuthActionsProps {
  isLoggedIn: boolean;
}

export function AuthActions({ isLoggedIn }: AuthActionsProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onLogout = async () => {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      return;
    }

    setLoading(true);
    try {
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={onLogout}
      disabled={loading}
      className="rounded-lg border border-black/20 px-3 py-1.5 text-sm font-semibold text-foreground transition hover:bg-(--paper-strong) disabled:opacity-60"
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}

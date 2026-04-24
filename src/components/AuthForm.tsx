"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { hasSupabaseEnv } from "@/lib/env";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getAuthErrorMessage(error: { message?: string; status?: number } | null, action: "signup" | "signin" | "signout") {
  if (!error) {
    return "";
  }

  const message = error.message?.toLowerCase() ?? "";

  if (error.status === 429 || message.includes("rate limit")) {
    return "Too many attempts. Please wait a minute and try again.";
  }

  if (message.includes("email not confirmed")) {
    return "Please confirm your email from your inbox before signing in.";
  }

  if (message.includes("invalid login credentials")) {
    return "Invalid email or password. If you just signed up, confirm your email first.";
  }

  if (message.includes("user already registered")) {
    return "This email is already registered. Try signing in instead.";
  }

  if (error.status === 400) {
    if (action === "signup") {
      return "Signup request was rejected. Check Supabase Auth settings and try again.";
    }
    return "Invalid email or password. If you just signed up, confirm your email first.";
  }

  if (error.status === 422) {
    return "Please use a valid email and a password with at least 6 characters.";
  }

  return error.message ?? "Authentication request failed.";
}

function isRateLimitError(error: { message?: string; status?: number } | null) {
  return Boolean(error && (error.status === 429 || error.message?.toLowerCase().includes("rate limit")));
}

const SIGNUP_COOLDOWN_SECONDS = 60;
const SIGNUP_COOLDOWN_UNTIL_KEY = "auth_signup_cooldown_until";

export function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [signupCooldown, setSignupCooldown] = useState(0);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const enabled = hasSupabaseEnv();
  const supabase = createBrowserSupabaseClient();

  const startSignupCooldown = (seconds: number) => {
    const cooldownUntil = Date.now() + seconds * 1000;
    window.localStorage.setItem(SIGNUP_COOLDOWN_UNTIL_KEY, String(cooldownUntil));
    setSignupCooldown(seconds);
  };

  useEffect(() => {
    const cooldownUntilRaw = window.localStorage.getItem(SIGNUP_COOLDOWN_UNTIL_KEY);
    if (!cooldownUntilRaw) {
      return;
    }

    const cooldownUntil = Number(cooldownUntilRaw);
    if (Number.isNaN(cooldownUntil)) {
      window.localStorage.removeItem(SIGNUP_COOLDOWN_UNTIL_KEY);
      return;
    }

    const remainingSeconds = Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000));
    setSignupCooldown(remainingSeconds);
    if (remainingSeconds === 0) {
      window.localStorage.removeItem(SIGNUP_COOLDOWN_UNTIL_KEY);
    }
  }, []);

  useEffect(() => {
    if (signupCooldown <= 0) {
      window.localStorage.removeItem(SIGNUP_COOLDOWN_UNTIL_KEY);
      return;
    }

    const timer = window.setInterval(() => {
      setSignupCooldown((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [signupCooldown]);

  const validateCredentials = () => {
    const normalizedEmail = email.trim();

    if (!isValidEmail(normalizedEmail)) {
      setMessage("Enter a valid email address.");
      return null;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return null;
    }

    return { normalizedEmail, password };
  };

  const signUp = async () => {
    if (!supabase) {
      setMessage("Supabase environment variables are missing.");
      return;
    }

    if (signupCooldown > 0) {
      setMessage(`Please wait ${signupCooldown}s before trying to sign up again.`);
      return;
    }

    const credentials = validateCredentials();
    if (!credentials) {
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.normalizedEmail,
        password: credentials.password,
      });
      if (isRateLimitError(error)) {
        startSignupCooldown(SIGNUP_COOLDOWN_SECONDS);
      }
      if (error) {
        setMessage(getAuthErrorMessage(error, "signup"));
        return;
      }

      if (data.user && !data.session) {
        setMessage("Signup successful. Check your email and confirm your account before signing in.");
      } else {
        setMessage("Signup successful.");
      }
      if (!error) {
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  const signIn = async () => {
    if (!supabase) {
      setMessage("Supabase environment variables are missing.");
      return;
    }

    const credentials = validateCredentials();
    if (!credentials) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: credentials.normalizedEmail,
        password: credentials.password,
      });
      if (error) {
        setMessage(getAuthErrorMessage(error, "signin"));
        return;
      }
      setMessage("Login successful.");
      router.push("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    if (!supabase) {
      setMessage("Supabase environment variables are missing.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      setMessage(error ? getAuthErrorMessage(error, "signout") : "Logged out.");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 rounded-3xl border border-black/10 bg-white p-6 shadow-[0_12px_40px_rgba(31,41,55,0.08)]">
      <div>
        <label className="mb-1 block text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-11 w-full rounded-xl border border-black/15 px-3"
          disabled={!enabled}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Password</label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-11 w-full rounded-xl border border-black/15 px-3"
          disabled={!enabled}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <button disabled={loading || !enabled} onClick={signIn} className="rounded-xl bg-foreground px-4 py-2 text-sm font-semibold text-white">
          Sign In
        </button>
        <button disabled={loading || !enabled || signupCooldown > 0} onClick={signUp} className="rounded-xl bg-(--accent) px-4 py-2 text-sm font-semibold text-white">
          {signupCooldown > 0 ? `Sign Up (${signupCooldown}s)` : "Sign Up"}
        </button>
        <button disabled={loading || !enabled} onClick={signOut} className="rounded-xl border border-black/20 px-4 py-2 text-sm font-semibold">
          Sign Out
        </button>
      </div>
      {!enabled ? (
        <p className="text-sm text-amber-700">
          Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local to enable auth.
        </p>
      ) : null}
      {message ? <p className="text-sm text-(--ink-soft)">{message}</p> : null}
    </div>
  );
}

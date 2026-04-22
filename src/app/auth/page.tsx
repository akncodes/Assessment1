import { AuthForm } from "@/components/AuthForm";

export default function AuthPage() {
  return (
    <main className="mx-auto w-full max-w-xl px-4 py-10 md:px-6">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Authentication</h1>
      <p className="mb-6 text-sm text-[var(--ink-soft)]">
        Login or signup with Supabase Auth. Roles should be managed via your profiles table.
      </p>
      <AuthForm />
    </main>
  );
}

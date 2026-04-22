import { createBrowserClient } from "@supabase/ssr";

import { getEnv } from "@/lib/env";

export function createBrowserSupabaseClient() {
  const { supabaseUrl, supabaseAnonKey } = getEnv();

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

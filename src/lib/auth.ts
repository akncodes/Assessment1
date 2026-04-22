import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { UserProfile, UserRole } from "@/types";

export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, display_name, role, created_at")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return {
      id: user.id,
      email: user.email ?? "",
      display_name: user.email?.split("@")[0] ?? "New User",
      role: "viewer",
      created_at: new Date().toISOString(),
    };
  }

  return profile as UserProfile;
}

export function canCreatePost(role: UserRole) {
  return role === "author" || role === "admin";
}

export function canEditPost(role: UserRole, isOwner: boolean) {
  if (role === "admin") {
    return true;
  }
  return role === "author" && isOwner;
}

export function canComment(role: UserRole) {
  return role === "viewer" || role === "author" || role === "admin";
}

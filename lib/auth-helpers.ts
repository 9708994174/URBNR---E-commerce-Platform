import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function requireAuth() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return user
}

export async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/auth/login")
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, email, full_name")
    .eq("id", user.id)
    .single()

  // If profile doesn't exist, create it with admin role (for first-time admin access)
  if (!profile && !profileError) {
    // Try to create profile - but this shouldn't happen in normal flow
    console.warn("Profile not found for user:", user.id)
  }

  if (!profile || profile.role !== "admin") {
    console.warn("Admin access denied:", {
      userId: user.id,
      userEmail: user.email,
      profileRole: profile?.role || "not found",
      profileError: profileError?.message,
    })
    redirect("/dashboard")
  }

  return { user, profile }
}

export async function getUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function getUserProfile() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return { user, profile }
}

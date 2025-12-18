"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function setAdminRole(email: string) {
  const supabase = await createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "You must be logged in" }
    }

    // Verify email matches logged-in user
    if (user.email !== email.trim()) {
      return { success: false, error: "Email does not match your logged-in account" }
    }

    // Use a service role or bypass RLS by using a function
    // First, try direct update
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, role")
      .eq("id", user.id)
      .single()

    if (profileError && profileError.code !== "PGRST116") {
      return { success: false, error: `Failed to check profile: ${profileError.message}` }
    }

    // Try using the database function first (if it exists)
    const { data: functionResult, error: functionError } = await supabase.rpc("make_me_admin")

    if (!functionError && functionResult) {
      revalidatePath("/admin/products")
      revalidatePath("/admin/setup")
      return { success: true, message: "Admin role set successfully!" }
    }

    // Fallback: Try direct update
    if (profile) {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ role: "admin" })
        .eq("id", user.id)

      if (updateError) {
        // If RLS blocks update, provide SQL command
        return {
          success: false,
          error: `RLS blocked update. Please run this SQL in Supabase SQL Editor: UPDATE public.profiles SET role = 'admin' WHERE id = '${user.id}'; OR run scripts/027_allow_role_update.sql first.`,
        }
      }
    } else {
      // Create profile if it doesn't exist
      const { error: insertError } = await supabase.from("profiles").insert({
        id: user.id,
        email: user.email,
        role: "admin",
      })

      if (insertError) {
        return {
          success: false,
          error: `Failed to create profile: ${insertError.message}. Please run: UPDATE public.profiles SET role = 'admin' WHERE id = '${user.id}'; in Supabase SQL Editor.`,
        }
      }
    }

    revalidatePath("/admin/products")
    revalidatePath("/admin/setup")
    return { success: true, message: "Admin role set successfully!" }
  } catch (error: any) {
    return { success: false, error: error.message || "An unexpected error occurred" }
  }
}


"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function signInWithPassword(email: string, password: string) {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    revalidatePath("/")
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function signUp(email: string, password: string, fullName?: string) {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        data: {
          full_name: fullName,
          email: email, // Store email in metadata
        },
      },
    })

    if (error) throw error

    // Only create if trigger doesn't exist (for backwards compatibility)
    if (data.user && data.user.identities && data.user.identities.length > 0) {
      // User was created, try to create profile (will fail silently if trigger handles it)
      try {
        await supabase.from("profiles").insert({
          id: data.user.id,
          email: data.user.email,
          full_name: fullName,
          updated_at: new Date().toISOString(),
        })
      } catch (profileError) {
        // Ignore error if profile already created by trigger
        console.log("Profile creation handled by trigger or already exists")
      }
    }

    revalidatePath("/")
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/")
}

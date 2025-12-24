"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function sendOTP(phone: string) {
  const supabase = await createClient()

  try {
    const formattedPhone = normalizePhone(phone)
    if (!formattedPhone) {
      return { success: false, error: "Enter a valid phone number with country code (e.g., +91XXXXXXXXXX)" }
    }

    const { data, error } = await supabase.auth.signInWithOtp({
      phone: formattedPhone,
      options: {
        channel: "sms",
      },
    })

    if (error) throw error
    revalidatePath("/")
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function verifyOTP(phone: string, token: string) {
  const supabase = await createClient()

  try {
    const formattedPhone = normalizePhone(phone)
    if (!formattedPhone) {
      return { success: false, error: "Enter a valid phone number with country code (e.g., +91XXXXXXXXXX)" }
    }

    const { data, error } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token,
      type: "sms",
    })

    if (error) throw error

    // Create or update profile with phone number
    if (data.user) {
      try {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          phone: formattedPhone,
          updated_at: new Date().toISOString(),
        })
      } catch (profileError) {
        console.log("Profile update handled by trigger or already exists")
      }
    }

    revalidatePath("/")
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function resendOTP(phone: string) {
  return sendOTP(phone)
}

function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/[^\d+]/g, "")

  // If it already starts with + and has 10-15 digits after it, accept
  if (digits.startsWith("+")) {
    const rest = digits.slice(1).replace(/\D/g, "")
    return rest.length >= 10 && rest.length <= 15 ? `+${rest}` : null
  }

  // Strip leading zeros
  const trimmed = digits.replace(/^0+/, "")

  // If starts with 91 and is 12 digits total, add +
  if (trimmed.startsWith("91") && trimmed.length === 12) {
    return `+${trimmed}`
  }

  // If 10-digit Indian number, prefix +91
  if (trimmed.length === 10) {
    return `+91${trimmed}`
  }

  // Otherwise, if length between 10-15, prefix +
  if (trimmed.length >= 10 && trimmed.length <= 15) {
    return `+${trimmed}`
  }

  return null
}





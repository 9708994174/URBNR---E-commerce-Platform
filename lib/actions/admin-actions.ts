"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function approveProduct(productId: string, price?: number, notes?: string) {
  const supabase = await createClient()

  try {
    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
    if (!profile || profile.role !== "admin") {
      return { success: false, error: "Unauthorized: Admin access required" }
    }

    const updateData: any = {
      status: "approved",
      updated_at: new Date().toISOString(),
    }

    if (price) {
      updateData.price = parseFloat(price.toString())
    }

    if (notes) {
      updateData.admin_notes = notes
    }

    const { error } = await supabase.from("products").update(updateData).eq("id", productId)

    if (error) throw error

    revalidatePath("/admin/products")
    revalidatePath("/admin")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function rejectProduct(productId: string, notes: string) {
  const supabase = await createClient()

  try {
    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
    if (!profile || profile.role !== "admin") {
      return { success: false, error: "Unauthorized: Admin access required" }
    }

    if (!notes || notes.trim().length === 0) {
      return { success: false, error: "Rejection notes are required" }
    }

    const { error } = await supabase
      .from("products")
      .update({
        status: "rejected",
        admin_notes: notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", productId)

    if (error) throw error

    revalidatePath("/admin/products")
    revalidatePath("/admin")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateProductStatus(productId: string, status: string, notes?: string) {
  const supabase = await createClient()

  try {
    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
    if (!profile || profile.role !== "admin") {
      return { success: false, error: "Unauthorized: Admin access required" }
    }

    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    }

    if (notes) {
      updateData.admin_notes = notes
    }

    const { error } = await supabase.from("products").update(updateData).eq("id", productId)

    if (error) throw error

    revalidatePath("/admin/products")
    revalidatePath("/admin")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}





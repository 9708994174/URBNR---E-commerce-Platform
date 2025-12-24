"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

<<<<<<< HEAD
export async function approveProduct(
  productId: string,
  price?: number,
  notes?: string,
  customizationAmount?: number
) {
=======
export async function approveProduct(productId: string, price?: number, notes?: string) {
>>>>>>> 4a62e5fcd37b589bc3e624e537b2d3fd2921173c
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

<<<<<<< HEAD
    // Get product to find owner
    const { data: product } = await supabase.from("products").select("user_id").eq("id", productId).single()

    const updateData: any = {
      status: "approved",
=======
    const updateData: any = {
      status: "approved",
      updated_at: new Date().toISOString(),
>>>>>>> 4a62e5fcd37b589bc3e624e537b2d3fd2921173c
    }

    if (price) {
      updateData.price = parseFloat(price.toString())
    }

    if (notes) {
      updateData.admin_notes = notes
    }

<<<<<<< HEAD
    // Try to add customization_amount if provided
    if (customizationAmount && customizationAmount > 0) {
      updateData.customization_amount = parseFloat(customizationAmount.toString())
    }

    // Try update with all fields first
    let { error } = await supabase.from("products").update(updateData).eq("id", productId)

    // If error is about customization_amount column not existing, retry without it
    if (error && (error.message?.includes("customization_amount") || error.code === "42703")) {
      console.log("customization_amount column may not exist, retrying without it")
      delete updateData.customization_amount
      const retryResult = await supabase.from("products").update(updateData).eq("id", productId)
      error = retryResult.error
    }

    if (error) throw error

    // Create notification for product owner
    if (product?.user_id) {
      try {
        await supabase.from("notifications").insert({
          user_id: product.user_id,
          type: "product_approved",
          title: "Product Approved",
          message: `Your product has been approved! ${price ? `Price: ₹${price}` : ""} ${customizationAmount ? `Customization Amount: ₹${customizationAmount}` : ""}`,
          related_id: productId,
          read: false,
        })
      } catch (err) {
        // Ignore if notifications table doesn't exist yet
        console.log("Notifications table may not exist:", err)
      }
    }

    revalidatePath("/admin/products")
    revalidatePath("/admin")
    revalidatePath("/dashboard/products")
=======
    const { error } = await supabase.from("products").update(updateData).eq("id", productId)

    if (error) throw error

    revalidatePath("/admin/products")
    revalidatePath("/admin")
>>>>>>> 4a62e5fcd37b589bc3e624e537b2d3fd2921173c
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

<<<<<<< HEAD
    // Get product to find owner
    const { data: product } = await supabase.from("products").select("user_id").eq("id", productId).single()

    const updateData: any = {
      status: "rejected",
      admin_notes: notes,
    }

    const { error } = await supabase
      .from("products")
      .update(updateData)
=======
    const { error } = await supabase
      .from("products")
      .update({
        status: "rejected",
        admin_notes: notes,
        updated_at: new Date().toISOString(),
      })
>>>>>>> 4a62e5fcd37b589bc3e624e537b2d3fd2921173c
      .eq("id", productId)

    if (error) throw error

<<<<<<< HEAD
    // Create notification for product owner
    if (product?.user_id) {
      try {
        await supabase.from("notifications").insert({
          user_id: product.user_id,
          type: "product_rejected",
          title: "Product Rejected",
          message: `Your product has been rejected. Reason: ${notes}`,
          related_id: productId,
          read: false,
        })
      } catch (err) {
        console.log("Notifications table may not exist:", err)
      }
    }

    revalidatePath("/admin/products")
    revalidatePath("/admin")
    revalidatePath("/dashboard/products")
=======
    revalidatePath("/admin/products")
    revalidatePath("/admin")
>>>>>>> 4a62e5fcd37b589bc3e624e537b2d3fd2921173c
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
<<<<<<< HEAD
    }

    // Only add updated_at if column exists (handle gracefully)
    try {
      updateData.updated_at = new Date().toISOString()
    } catch (e) {
      // Ignore if column doesn't exist
=======
      updated_at: new Date().toISOString(),
>>>>>>> 4a62e5fcd37b589bc3e624e537b2d3fd2921173c
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





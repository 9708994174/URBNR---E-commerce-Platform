"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function addToCart(productId: string, size: string, color: string, quantity = 1) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in to add items to cart" }
  }

  // Check if item already exists in cart
  const { data: existing } = await supabase
    .from("cart_items")
    .select("*")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .eq("size", size)
    .eq("color", color)
    .single()

  if (existing) {
    // Update quantity
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: existing.quantity + quantity, updated_at: new Date().toISOString() })
      .eq("id", existing.id)

    if (error) return { error: error.message }
  } else {
    // Insert new item
    const { error } = await supabase.from("cart_items").insert({
      user_id: user.id,
      product_id: productId,
      size,
      color,
      quantity,
    })

    if (error) return { error: error.message }
  }

  revalidatePath("/cart")
  return { success: true }
}

export async function updateCartQuantity(cartItemId: string, quantity: number) {
  const supabase = await createClient()

  if (quantity === 0) {
    const { error } = await supabase.from("cart_items").delete().eq("id", cartItemId)

    if (error) return { error: error.message }
  } else {
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity, updated_at: new Date().toISOString() })
      .eq("id", cartItemId)

    if (error) return { error: error.message }
  }

  revalidatePath("/cart")
  return { success: true }
}

export async function removeFromCart(cartItemId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("cart_items").delete().eq("id", cartItemId)

  if (error) return { error: error.message }

  revalidatePath("/cart")
  return { success: true }
}

export async function toggleWishlist(productId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in" }
  }

  // Check if already in wishlist
  const { data: existing } = await supabase
    .from("wishlist")
    .select("*")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .single()

  if (existing) {
    // Remove from wishlist
    const { error } = await supabase.from("wishlist").delete().eq("id", existing.id)

    if (error) return { error: error.message }
    return { success: true, added: false }
  } else {
    // Add to wishlist
    const { error } = await supabase.from("wishlist").insert({
      user_id: user.id,
      product_id: productId,
    })

    if (error) return { error: error.message }
    return { success: true, added: true }
  }
}

export async function getSimilarProducts(productId: string, category: string, limit = 5, offset = 0) {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from("catalog_products")
    .select("*")
    .eq("category", category)
    .neq("id", productId)
    .range(offset, offset + limit - 1)
    .order("created_at", { ascending: false })

  return products || []
}

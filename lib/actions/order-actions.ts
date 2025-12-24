"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function cancelOrder(orderId: string, reason?: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in" }
  }

  try {
    // Check if order belongs to user and can be cancelled
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("id, user_id, order_status, payment_status, shipping_status, created_at")
      .eq("id", orderId)
      .eq("user_id", user.id)
      .single()

    if (fetchError || !order) {
      return { error: "Order not found or you don't have permission to cancel it" }
    }

    // Check if order is already cancelled
    if (order.order_status === "cancelled") {
      return { error: "This order is already cancelled" }
    }

    // Check if order is already returned or exchanged
    if (order.order_status === "returned" || order.order_status === "exchanged") {
      return { error: "This order cannot be cancelled as it has been returned or exchanged" }
    }

    // Check if order has been shipped - cannot cancel after shipping until delivered
    const shippingStatus = order.shipping_status || "pending"
    if (
      (shippingStatus === "shipped" ||
      shippingStatus === "in_transit" ||
      shippingStatus === "out_for_delivery" ||
      shippingStatus === "preparing") &&
      shippingStatus !== "delivered" &&
      order.order_status !== "delivered"
    ) {
      return { 
        error: "This order cannot be cancelled as it has already been shipped. You can only cancel after delivery or before shipping." 
      }
    }

    // Only allow cancellation if payment is pending or order is confirmed but not shipped
    if (order.payment_status !== "pending" && order.payment_status !== "paid") {
      return { error: "This order cannot be cancelled in its current payment status" }
    }

    // Update order status
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        order_status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)

    if (updateError) throw updateError

    // Create tracking entry
    await supabase.from("order_tracking").insert({
      order_id: orderId,
      status: "cancelled",
      message: reason || "Order cancelled by customer",
    })

    revalidatePath("/account")
    revalidatePath(`/account/orders/${orderId}`)
    revalidatePath("/dashboard/orders")

    return { success: true, message: "Order cancelled successfully" }
  } catch (error: any) {
    return { error: error.message || "Failed to cancel order" }
  }
}


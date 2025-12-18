"use server"

import { createClient } from "@/lib/supabase/server"

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

export async function createCheckoutSession(cartItems: any[], shippingAddress?: any) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in to checkout" }
  }

  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    let baseUrl: string

    if (siteUrl) {
      // If NEXT_PUBLIC_SITE_URL is set, use it
      baseUrl = siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`
    } else {
      // Fallback for local development
      baseUrl = "http://localhost:3000"
    }

    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.product.name,
          description: `Size: ${item.size}, Color: ${item.color}`,
        },
        unit_amount: Math.round(item.product.price * 100),
      },
      quantity: item.quantity,
    }))

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${baseUrl}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`,
      customer_email: user.email,
      metadata: {
        user_id: user.id,
        cart_items: JSON.stringify(cartItems.map((i) => i.id)),
      },
    })

    return { success: true, sessionId: session.id, url: session.url }
  } catch (error: any) {
    console.error("[v0] Checkout error:", error)
    return { error: error.message }
  }
}

export async function handlePaymentSuccess(sessionId: string) {
  const supabase = await createClient()

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status === "paid") {
      const userId = session.metadata.user_id
      const cartItemIds = JSON.parse(session.metadata.cart_items)

      const { data: cartItems } = await supabase
        .from("cart_items")
        .select("*, product:catalog_products(*)")
        .in("id", cartItemIds)

      if (cartItems) {
        const orders = cartItems.map((item: any) => ({
          user_id: userId,
          catalog_product_id: item.product_id,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          amount: item.product.price * item.quantity,
          payment_intent_id: session.payment_intent,
          payment_status: "paid",
          order_number: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`.toUpperCase(),
        }))

        await supabase.from("orders").insert(orders)
        await supabase.from("cart_items").delete().in("id", cartItemIds)
      }

      return { success: true }
    }

    return { error: "Payment not completed" }
  } catch (error: any) {
    console.error("[v0] Payment success handler error:", error)
    return { error: error.message }
  }
}

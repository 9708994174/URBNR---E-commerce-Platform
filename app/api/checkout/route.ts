import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@/lib/supabase/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
})

export async function POST(request: NextRequest) {
  try {
    const { cartItems, shippingInfo } = await request.json()

    // Get authenticated user
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Create line items for Stripe
    const lineItems = cartItems.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product.name,
          description: `Size: ${item.size}, Color: ${item.color}`,
        },
        unit_amount: Math.round(item.product.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }))

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    let baseUrl: string

    if (siteUrl) {
      // If NEXT_PUBLIC_SITE_URL is set, use it
      baseUrl = siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`
    } else {
      // Fallback: try to get from request origin
      const origin = request.headers.get("origin")
      baseUrl = origin || "http://localhost:3000"

      // Ensure baseUrl has a protocol
      if (!baseUrl.startsWith("http")) {
        baseUrl = `https://${baseUrl}`
      }
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`,
      customer_email: shippingInfo.email,
      metadata: {
        user_id: user.id,
        shipping_info: JSON.stringify(shippingInfo),
      },
    })

    // Store order in database
    const orderNumber = `ORD-${Date.now()}`
    for (const item of cartItems) {
      await supabase.from("orders").insert({
        user_id: user.id,
        catalog_product_id: item.product.id,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        amount: item.product.price * item.quantity,
        payment_status: "pending",
        payment_intent_id: session.id,
        order_number: orderNumber,
        shipping_address: shippingInfo,
      })
    }

    return NextResponse.json({ sessionId: session.id })
  } catch (error: any) {
    console.error("[v0] Checkout error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

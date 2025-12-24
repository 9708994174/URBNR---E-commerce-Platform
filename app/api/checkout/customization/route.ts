import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@/lib/supabase/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
})

export async function POST(request: NextRequest) {
  try {
    const { orderId, amount, productId } = await request.json()

    // Get authenticated user
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get order details
    const { data: order } = await supabase
      .from("orders")
      .select("*, products:product_id(*), catalog_products:catalog_product_id(*)")
      .eq("id", orderId)
      .eq("user_id", user.id)
      .single()

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Use order amount from database (source of truth), fallback to provided amount
    // Convert to number to handle string/Decimal types from database
    let orderAmount: number
    if (order.amount !== null && order.amount !== undefined) {
      orderAmount = Number(order.amount)
    } else if (amount !== null && amount !== undefined) {
      orderAmount = Number(amount)
    } else {
      return NextResponse.json(
        { error: "Order amount is missing. Please contact support." },
        { status: 400 }
      )
    }

    // Validate amount is valid number
    if (isNaN(orderAmount) || orderAmount <= 0) {
      return NextResponse.json(
        { error: "Invalid order amount. Please contact support if you need assistance." },
        { status: 400 }
      )
    }

    // Get product info - handle both product types
    let product: any = null
    let productName = "Product"
    let designName = ""

    if (order.product_id) {
      const { data: productData } = await supabase.from("products").select("*").eq("id", order.product_id).single()
      product = productData
      productName = product?.product_name || "Custom Product"
      
      // Try to get design info if it exists
      if (productId) {
        const { data: productDesign } = await supabase
          .from("product_designs")
          .select("*, designs(*)")
          .eq("product_id", productId)
          .maybeSingle()
        designName = productDesign?.designs?.name || ""
      }
    } else if (order.catalog_product_id) {
      product = order.catalog_products
      productName = product?.name || "Product"
    }

    // Validate minimum amount for Stripe (₹0.50 = 50 paise)
    // Stripe requires minimum 50 paise (0.50 INR)
    const MIN_AMOUNT_INR = 0.50
    if (orderAmount < MIN_AMOUNT_INR) {
      return NextResponse.json(
        { error: `Minimum payment amount is ₹0.50 (50 paise). Your order amount is ₹${orderAmount.toFixed(2)}.` },
        { status: 400 }
      )
    }

    // Determine order type
    const orderType = order.order_type || (designName ? "customization" : "product")

    // Create line items for Stripe
    const lineItems = [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: orderType === "customization" 
              ? `Customization: ${productName}`
              : productName,
            description: orderType === "customization" && designName
              ? `Template: ${designName}`
              : orderType === "customization"
              ? "Product customization"
              : "Product order",
          },
          unit_amount: Math.round(orderAmount * 100), // Convert to paise (smallest INR unit)
        },
        quantity: 1,
      },
    ]

    // Get base URL - prioritize NEXT_PUBLIC_SITE_URL, fallback to Vercel's automatic URL, then origin
    let baseUrl: string
    
    // First, try NEXT_PUBLIC_SITE_URL
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    if (siteUrl && !siteUrl.includes('blob') && !siteUrl.includes('vercel_blob')) {
      baseUrl = siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`
    } else {
      // Fallback to Vercel's automatic URL detection
      const vercelUrl = process.env.VERCEL_URL
      if (vercelUrl && !vercelUrl.includes('blob') && !vercelUrl.includes('vercel_blob')) {
        baseUrl = `https://${vercelUrl}`
      } else {
        // Last resort: use origin header (but validate it's not a blob URL)
        const origin = request.headers.get("origin")
        if (origin && !origin.includes('blob') && !origin.includes('vercel_blob') && (origin.startsWith('http://') || origin.startsWith('https://'))) {
          baseUrl = origin
        } else {
          // Final fallback (should only happen in local development)
          baseUrl = "http://localhost:3000"
        }
      }
    }

    // Validate baseUrl is a proper domain (not a blob URL)
    if (baseUrl.includes('blob') || baseUrl.includes('vercel_blob')) {
      console.error('[Checkout] Invalid baseUrl detected (blob URL):', baseUrl)
      baseUrl = "http://localhost:3000" // Safe fallback
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `${baseUrl}/dashboard/orders/${orderId}/checkout`,
      customer_email: user.email || undefined,
      metadata: {
        user_id: user.id,
        order_id: orderId,
        order_type: orderType,
        product_id: productId || order.product_id || order.catalog_product_id || "",
      },
    })

    // Update order with payment intent
    await supabase
      .from("orders")
      .update({
        payment_intent_id: session.id,
        payment_method: "card",
      })
      .eq("id", orderId)

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (error: any) {
    console.error("[v0] Customization checkout error:", error)
    let errorMessage = error.message || "Failed to create checkout session"
    
    // Replace dollar references with INR in error messages
    if (errorMessage.includes("50 cents") || errorMessage.includes("$0.01")) {
      errorMessage = "Minimum payment amount is ₹0.50 (50 paise). Please ensure your order amount is at least ₹0.50."
    }
    
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}


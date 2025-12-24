import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@/lib/supabase/server"
import { sendOrderConfirmationEmail } from "@/lib/utils/email"
import { revalidatePath } from "next/cache"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  const supabase = await createClient()

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    try {
      const orderType = session.metadata?.order_type || "product"
      
      // Handle single order (customization order)
      const orderId = session.metadata?.order_id
      if (orderId) {
        // Get order details with product info
        const { data: order } = await supabase
          .from("orders")
          .select(`
            *,
            products:product_id(id, product_name, image_url),
            catalog_products:catalog_product_id(id, name, image_url),
            profiles:user_id(id, full_name, email)
          `)
          .eq("id", orderId)
          .single()

        if (order) {
          // Update order payment status
          await supabase
            .from("orders")
            .update({
              payment_status: "paid",
              payment_intent_id: session.payment_intent as string,
              order_status: orderType === "customization" ? "confirmed" : "confirmed",
            })
            .eq("id", orderId)

          // Revalidate the order detail page
          revalidatePath(`/account/orders/${orderId}`)
          revalidatePath(`/dashboard/orders/${orderId}`)
          revalidatePath("/account")
          revalidatePath("/account?tab=orders")

          // If it's a customization order, update product status
          if (orderType === "customization") {
            const productId = session.metadata?.product_id
            if (productId) {
              await supabase
                .from("products")
                .update({ status: "under_review" })
                .eq("id", productId)
            }
          }

          // Create order tracking entry
          await supabase.from("order_tracking").insert({
            order_id: orderId,
            status: "confirmed",
            message: "Payment received and order confirmed",
          })

          // Send order confirmation email
          if (order.profiles?.email) {
            const productName = order.products?.product_name || order.catalog_products?.name || "Product"
            await sendOrderConfirmationEmail({
              orderNumber: order.order_number || orderId.slice(0, 8).toUpperCase(),
              customerName: order.profiles.full_name || order.profiles.email || "Customer",
              customerEmail: order.profiles.email,
              orderDate: new Date(order.created_at).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
              items: [{
                name: productName,
                quantity: order.quantity || 1,
                size: order.size,
                color: order.color,
                price: order.amount || 0,
              }],
              totalAmount: order.amount || 0,
              shippingAddress: order.shipping_address || order.shipping_info,
              paymentMethod: order.payment_method || "card",
            })
          }
        }
      } 
      // Handle multiple orders (cart checkout) - preferred method using order_ids from metadata
      if (session.metadata?.order_ids) {
        const orderIds = JSON.parse(session.metadata.order_ids) as string[]
        const userId = session.metadata?.user_id
        
        // Get order details for email
        const { data: orders } = await supabase
          .from("orders")
          .select(`
            *,
            catalog_products:catalog_product_id(id, name, image_url),
            profiles:user_id(id, full_name, email)
          `)
          .in("id", orderIds)
        
        if (orders && orders.length > 0) {
          // Clear cart items after successful payment
          if (userId) {
            await supabase.from("cart_items").delete().eq("user_id", userId)
          }

          // Update all orders payment status
          for (const order of orders) {
            const { error: updateError } = await supabase
              .from("orders")
              .update({
                payment_status: "paid",
                payment_intent_id: session.payment_intent as string,
                order_status: "confirmed",
              })
              .eq("id", order.id)

            if (updateError) {
              console.error(`Failed to update order ${order.id}:`, updateError)
              continue
            }

            // Create order tracking entry
            await supabase.from("order_tracking").insert({
              order_id: order.id,
              status: "confirmed",
              message: "Payment received and order confirmed",
            })

            // Revalidate the order detail page
            revalidatePath(`/account/orders/${order.id}`)
          }
          
          // Revalidate account orders list
          revalidatePath("/account")
          revalidatePath("/account?tab=orders")

          // Send order confirmation email with all items
          const userProfile = orders[0]?.profiles
          const customerEmail = userProfile?.email || session.customer_email
          const customerName = userProfile?.full_name || "Customer"
          const orderNumber = orders[0]?.order_number || `ORD-${Date.now()}`

          if (customerEmail) {
            const items = orders.map((order: any) => ({
              name: order.catalog_products?.name || "Product",
              quantity: order.quantity || 1,
              size: order.size,
              color: order.color,
              price: order.amount || 0,
            }))
            const totalAmount = orders.reduce((sum: number, order: any) => sum + (order.amount || 0), 0)

            await sendOrderConfirmationEmail({
              orderNumber,
              customerName,
              customerEmail,
              orderDate: new Date(orders[0].created_at).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
              items,
              totalAmount,
              shippingAddress: orders[0].shipping_address || orders[0].shipping_info,
              paymentMethod: orders[0].payment_method || "card",
            })
          }
        }
      }
      // Fallback: find orders by payment_intent_id (session.id) or by user_id and recent pending orders
      else {
        const userId = session.metadata?.user_id
        
        // Try to find orders by session.id first (payment_intent_id)
        let { data: orders } = await supabase
          .from("orders")
          .select(`
            *,
            catalog_products:catalog_product_id(id, name, image_url),
            profiles:user_id(id, full_name, email)
          `)
          .eq("payment_intent_id", session.id)
          .eq("payment_status", "pending")

        // If no orders found, try finding by user_id and recent pending orders (within last 5 minutes)
        if ((!orders || orders.length === 0) && userId) {
          const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
          const { data: recentOrders } = await supabase
            .from("orders")
            .select(`
              *,
              catalog_products:catalog_product_id(id, name, image_url),
              profiles:user_id(id, full_name, email)
            `)
            .eq("user_id", userId)
            .eq("payment_status", "pending")
            .eq("order_type", "product")
            .gte("created_at", fiveMinutesAgo)
            .order("created_at", { ascending: false })
            .limit(10) // Limit to prevent matching wrong orders

          orders = recentOrders
        }

        if (orders && orders.length > 0) {
          // Get user profile for email
          let userProfile: any = null
          if (userId) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", userId)
              .single()
            userProfile = profile || orders[0]?.profiles
          }

          const orderNumber = orders[0]?.order_number || `ORD-${Date.now()}`
          const customerEmail = userProfile?.email || session.customer_email || orders[0]?.profiles?.email
          const customerName = userProfile?.full_name || orders[0]?.profiles?.full_name || "Customer"

          // Clear cart items after successful payment
          if (userId) {
            await supabase.from("cart_items").delete().eq("user_id", userId)
          }

          for (const order of orders) {
            const { error: updateError } = await supabase
              .from("orders")
              .update({
                payment_status: "paid",
                payment_intent_id: session.payment_intent as string,
                order_status: "confirmed",
              })
              .eq("id", order.id)

            if (updateError) {
              console.error(`Failed to update order ${order.id}:`, updateError)
              continue
            }

            // Create order tracking entry
            await supabase.from("order_tracking").insert({
              order_id: order.id,
              status: "confirmed",
              message: "Payment received and order confirmed",
            })
          }

          // Send order confirmation email with all items
          if (customerEmail) {
            const items = orders.map((order: any) => ({
              name: order.catalog_products?.name || "Product",
              quantity: order.quantity || 1,
              size: order.size,
              color: order.color,
              price: order.amount || 0,
            }))
            const totalAmount = orders.reduce((sum: number, order: any) => sum + (order.amount || 0), 0)

            await sendOrderConfirmationEmail({
              orderNumber,
              customerName,
              customerEmail,
              orderDate: new Date(orders[0].created_at).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
              items,
              totalAmount,
              shippingAddress: orders[0].shipping_address || orders[0].shipping_info,
              paymentMethod: orders[0].payment_method || "card",
            })
          }
        }
      }
    } catch (error) {
      console.error("Error processing webhook:", error)
      return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}


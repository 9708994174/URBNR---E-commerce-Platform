"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CheckCircle, CreditCard } from "lucide-react"

export default function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const [orderId, setOrderId] = useState<string | null>(null)
  const [order, setOrder] = useState<any>(null)
  const [product, setProduct] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  useEffect(() => {
    params.then((p) => setOrderId(p.id))
  }, [params])

  useEffect(() => {
    if (!orderId) return

    async function fetchOrder() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data: orderData } = await supabase
        .from("orders")
        .select(
          `
          *,
          products(*)
        `,
        )
        .eq("id", orderId)
        .eq("user_id", user.id)
        .single()

      if (orderData) {
        setOrder(orderData)
        setProduct(orderData.products)

        if (orderData.payment_status === "paid") {
          router.push("/dashboard/orders")
        }
      }

      setIsLoading(false)
    }

    fetchOrder()
  }, [orderId, router])

  const handlePayment = async () => {
    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const supabase = createClient()

      const { error } = await supabase
        .from("orders")
        .update({
          payment_status: "paid",
          payment_intent_id: `pi_${Date.now()}`,
        })
        .eq("id", orderId)

      if (error) throw error

      // Update product status to completed
      await supabase.from("products").update({ status: "completed" }).eq("id", product.id)

      router.push("/dashboard/orders")
    } catch (error) {
      alert("Payment failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </DashboardLayout>
    )
  }

  if (!order) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <p className="text-muted-foreground">Order not found</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <Button variant="ghost" asChild>
          <Link href="/dashboard/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </Button>

        <div>
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="text-muted-foreground mt-2">Complete your payment to start production</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {product?.image_url && (
                <img
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.product_name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Product</span>
                  <span className="font-semibold">{product?.product_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-semibold capitalize">{product?.product_type}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-3 border-t">
                  <span>Total</span>
                  <span>${order.amount?.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Demo payment for testing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3 mb-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">Test Payment</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This is a demo payment. In production, this would integrate with Stripe for secure payment
                    processing.
                  </p>
                </div>

                <Button onClick={handlePayment} disabled={isProcessing} className="w-full" size="lg">
                  {isProcessing ? "Processing Payment..." : `Pay $${order.amount?.toFixed(2)}`}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  What Happens Next
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>After successful payment:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Your order will be confirmed immediately</li>
                  <li>Production will begin within 24 hours</li>
                  <li>You&apos;ll receive tracking information via email</li>
                  <li>Estimated delivery: 7-10 business days</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

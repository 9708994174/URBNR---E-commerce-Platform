"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Package } from "lucide-react"
import Link from "next/link"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const sessionId = searchParams.get("session_id")

  useEffect(() => {
    if (sessionId) {
      clearCart()
    }
  }, [sessionId])

  const clearCart = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        // Clear the cart after successful payment
        await supabase.from("cart_items").delete().eq("user_id", user.id)
      }
    } catch (error) {
      console.error("Error clearing cart:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Processing your order...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="max-w-lg w-full mx-4">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-black uppercase">Order Successful!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-muted-foreground text-lg">
            Thank you for your purchase! Your order has been successfully placed and is being processed.
          </p>
          <div className="bg-neutral-100 p-4 rounded-lg">
            <Package className="h-8 w-8 text-accent mx-auto mb-2" />
            <p className="font-bold">You will receive an email confirmation shortly</p>
            <p className="text-sm text-muted-foreground mt-1">Check your orders page to track your delivery</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="flex-1 font-bold uppercase">
              <Link href="/dashboard/orders">View Orders</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="flex-1 font-bold uppercase bg-transparent">
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

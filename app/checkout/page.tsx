"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

type CartItem = {
  id: string
  quantity: number
  size: string
  color: string
  product: {
    id: string
    name: string
    price: number
  }
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "USA",
  })
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/signin")
        return
      }

      const { data, error } = await supabase
        .from("cart_items")
        .select(
          `
          id,
          quantity,
          size,
          color,
          product:catalog_products(id, name, price)
        `,
        )
        .eq("user_id", user.id)

      if (error) throw error
      if (!data || data.length === 0) {
        router.push("/cart")
        return
      }
      setCartItems(data)

      // Load user profile for pre-filling
      const { data: profile } = await supabase.from("profiles").select("email, full_name").eq("id", user.id).single()

      if (profile) {
        setShippingInfo((prev) => ({
          ...prev,
          email: profile.email || "",
          fullName: profile.full_name || "",
        }))
      }
    } catch (error) {
      console.error("Error loading cart:", error)
      toast({
        title: "Error",
        description: "Failed to load cart",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  const handleCheckout = async () => {
    if (!shippingInfo.fullName || !shippingInfo.email || !shippingInfo.address || !shippingInfo.city) {
      toast({
        title: "Incomplete information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      setProcessing(true)
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/signin")
        return
      }

      // Create checkout session
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems,
          shippingInfo,
        }),
      })

      const { sessionId, error } = await response.json()

      if (error) {
        throw new Error(error)
      }

      // Redirect to Stripe Checkout
      const stripe = await stripePromise
      if (stripe) {
        const { error: stripeError } = await stripe.redirectToCheckout({ sessionId })
        if (stripeError) {
          throw stripeError
        }
      }
    } catch (error: any) {
      console.error("Checkout error:", error)
      toast({
        title: "Checkout failed",
        description: error.message || "Please try again",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading checkout...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-black uppercase mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-black uppercase">Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={shippingInfo.fullName}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={shippingInfo.email}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                    placeholder="123 Main Street"
                  />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={shippingInfo.state}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                      placeholder="NY"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={shippingInfo.zipCode}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                      placeholder="10001"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-2xl font-black uppercase">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div>
                        <div className="font-bold">{item.product.name}</div>
                        <div className="text-muted-foreground text-xs">
                          {item.size} / {item.color} × {item.quantity}
                        </div>
                      </div>
                      <div className="font-bold">${(item.product.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-bold">${calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-bold">FREE</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-xl">
                      <span className="font-black">Total</span>
                      <span className="font-black text-accent">${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <Button
                  size="lg"
                  className="w-full font-bold uppercase text-base h-14"
                  onClick={handleCheckout}
                  disabled={processing}
                >
                  {processing ? "Processing..." : "Complete Order"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

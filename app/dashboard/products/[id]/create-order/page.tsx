"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function CreateOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const [productId, setProductId] = useState<string | null>(null)
  const [product, setProduct] = useState<any>(null)
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    params.then((p) => setProductId(p.id))
  }, [params])

  useEffect(() => {
    if (!productId) return

    async function fetchProduct() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data } = await supabase.from("products").select("*").eq("id", productId).eq("user_id", user.id).single()

      if (data) {
        setProduct(data)
        if (data.status !== "approved") {
          router.push(`/dashboard/products/${productId}`)
        }
      }

      setIsLoading(false)
    }

    fetchProduct()
  }, [productId, router])

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)
    setError(null)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          product_id: productId,
          amount: Number.parseFloat(amount),
          payment_status: "pending",
        })
        .select()
        .single()

      if (orderError) throw orderError

      router.push(`/dashboard/orders/${order.id}/checkout`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create order")
    } finally {
      setIsCreating(false)
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

  if (!product) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <p className="text-muted-foreground">Product not found</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <Button variant="ghost" asChild>
          <Link href={`/dashboard/products/${productId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Product
          </Link>
        </Button>

        <div>
          <h1 className="text-3xl font-bold">Create Order</h1>
          <p className="text-muted-foreground mt-2">Set the order amount to proceed with payment</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Product Name</span>
              <span className="font-semibold">{product.product_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type</span>
              <span className="font-semibold capitalize">{product.product_type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className="font-semibold capitalize">{product.status}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
            <CardDescription>Enter the approved price for this product</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (USD)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
                <p className="text-sm text-muted-foreground">Enter the price provided by our team</p>
              </div>

              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive rounded-lg">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <Button type="submit" disabled={isCreating || !amount} className="w-full">
                {isCreating ? "Creating Order..." : "Create Order & Proceed to Payment"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

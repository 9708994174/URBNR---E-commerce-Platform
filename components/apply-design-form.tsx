"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface ApplyDesignFormProps {
  designId: string
  userProducts: any[]
}

export function ApplyDesignForm({ designId, userProducts }: ApplyDesignFormProps) {
  const [selectedProduct, setSelectedProduct] = useState("")
  const [isApplying, setIsApplying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsApplying(true)
    setError(null)

    try {
      const supabase = createClient()

      const { error: insertError } = await supabase.from("product_designs").insert({
        product_id: selectedProduct,
        design_id: designId,
        is_custom: false,
      })

      if (insertError) throw insertError

      // Update product status to under review
      const { error: updateError } = await supabase
        .from("products")
        .update({ status: "under_review" })
        .eq("id", selectedProduct)

      if (updateError) throw updateError

      router.push("/dashboard/products")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to apply design")
    } finally {
      setIsApplying(false)
    }
  }

  if (userProducts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Products Available</CardTitle>
          <CardDescription>Upload a product first to apply this design</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/dashboard/upload">Upload Product</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Apply to Your Product</CardTitle>
        <CardDescription>Select a product to use this design</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleApply} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product">Select Product</Label>
            <Select value={selectedProduct} onValueChange={setSelectedProduct} required>
              <SelectTrigger>
                <SelectValue placeholder="Choose a product" />
              </SelectTrigger>
              <SelectContent>
                {userProducts.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.product_name} ({product.product_type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <Button type="submit" disabled={isApplying || !selectedProduct} className="w-full">
            {isApplying ? "Applying Design..." : "Apply Design"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingBag } from "lucide-react"
import type { Product } from "@/lib/types"
import { AuthModal } from "@/components/auth-modal"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleAddToCart = async (product: Product) => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setSelectedProduct(product)
      setAuthModalOpen(true)
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.from("cart_items").upsert(
        {
          user_id: user.id,
          product_id: product.id,
          quantity: 1,
          size: product.sizes?.[0] || null,
          color: product.colors?.[0] || null,
        },
        {
          onConflict: "user_id,product_id,size,color",
        },
      )

      if (error) throw error

      toast({
        title: "Added to cart!",
        description: `${product.name} has been added to your cart`,
      })

      setTimeout(() => router.push("/cart"), 500)
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleWishlist = async (product: Product) => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setSelectedProduct(product)
      setAuthModalOpen(true)
      return
    }

    try {
      await supabase.from("wishlist").insert({
        user_id: user.id,
        product_id: product.id,
      })

      toast({
        title: "Added to wishlist!",
        description: `${product.name} has been saved to your wishlist`,
      })
    } catch (error) {
      console.error("Error adding to wishlist:", error)
      toast({
        title: "Info",
        description: "This item may already be in your wishlist",
      })
    }
  }

  const onAuthSuccess = async () => {
    if (selectedProduct) {
      await handleAddToCart(selectedProduct)
    }
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-0 w-full">
        {products.map((product) => (
          <div key={product.id} className="group">
            <div className="relative aspect-[3/4] bg-muted overflow-hidden">
              <Link href={`/product/${product.id}`}>
                <img
                  src={product.image_url || "/placeholder.svg?height=400&width=300"}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                />
              </Link>
              <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-10 w-10 bg-background/90 hover:bg-background"
                  onClick={() => handleWishlist(product)}
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-10 w-10 bg-background/90 hover:bg-background"
                  onClick={() => handleAddToCart(product)}
                  disabled={isLoading}
                >
                  <ShoppingBag className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-1">
              <Link href={`/product/${product.id}`}>
                <h3 className="font-bold uppercase text-sm hover:text-accent transition-colors">{product.name}</h3>
              </Link>
              <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
              <p className="text-lg font-black">₹{product.price.toFixed(2)}</p>
              {product.colors && product.colors.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {product.colors.slice(0, 4).map((color, idx) => (
                    <div
                      key={idx}
                      className="w-4 h-4 rounded-full border border-border"
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} onSuccess={onAuthSuccess} />
    </>
  )
}

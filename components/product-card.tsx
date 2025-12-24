"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"
import { toggleWishlist } from "@/lib/actions/cart-actions"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface ProductCardProps {
  product: any
  isWishlisted?: boolean
}

export function ProductCard({ product, isWishlisted = false }: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(isWishlisted)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  async function handleWishlistToggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    setLoading(true)
    const result = await toggleWishlist(product.id)

    if (result.success) {
      setWishlisted(result.added!)
      toast({
        title: result.added ? "Added to wishlist" : "Removed from wishlist",
        description: result.added ? "You can view it in your wishlist" : "Item removed from your wishlist",
      })
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to update wishlist",
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  return (
    <Link href={`/product/${product.id}`} target="_blank" rel="noopener noreferrer" className="group block cursor-pointer">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted rounded-lg mb-3">
        <Image
          src={product.image_url || "/placeholder.svg?height=600&width=450"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full"
          onClick={handleWishlistToggle}
          disabled={loading}
        >
          <Heart
            className={cn("h-5 w-5 transition-colors", wishlisted ? "fill-red-500 text-red-500" : "text-gray-600")}
          />
        </Button>
      </div>
      <h3 className="font-medium text-sm mb-1 line-clamp-2">{product.name}</h3>
      <p className="text-lg font-bold">₹{product.price}</p>
    </Link>
  )
}

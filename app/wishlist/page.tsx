"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { ShopHeader } from "@/components/shop-header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, ShoppingBag, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { AuthModal } from "@/components/auth-modal"
import { useRouter } from "next/navigation"

type WishlistItem = {
  id: string
  product: {
    id: string
    name: string
    description: string | null
    category: string
    price: number
    image_url: string | null
    stock_quantity: number
    colors: string[] | null
  }
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkAuthAndLoadWishlist()
  }, [])

  const checkAuthAndLoadWishlist = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setIsAuthenticated(false)
        setAuthModalOpen(true)
        setLoading(false)
        return
      }

      setIsAuthenticated(true)
      await loadWishlist(user.id)
    } catch (error) {
      console.error("Error:", error)
      setLoading(false)
    }
  }

  const loadWishlist = async (userId: string) => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("wishlist")
        .select(
          `
          id,
          product:catalog_products(id, name, description, category, price, image_url, stock_quantity, colors)
        `,
        )
        .eq("user_id", userId)

      if (error) throw error
      setWishlistItems((data as any) || [])
    } catch (error) {
      console.error("Error loading wishlist:", error)
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (wishlistId: string) => {
    try {
      const supabase = createClient()
      await supabase.from("wishlist").delete().eq("id", wishlistId)
      setWishlistItems((items) => items.filter((item) => item.id !== wishlistId))
    } catch (error) {
      console.error("Error removing from wishlist:", error)
    }
  }

  const addToCart = async (productId: string) => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const product = wishlistItems.find((item) => item.product.id === productId)?.product
      if (!product) return

      await supabase.from("cart_items").upsert({
        user_id: user.id,
        product_id: productId,
        quantity: 1,
        size: null,
        color: product.colors?.[0] || null,
      })

      router.push("/cart")
    } catch (error) {
      console.error("Error adding to cart:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full overflow-x-hidden">
        <ShopHeader />
        <div className="h-16"></div> {/* Spacer for fixed header */}
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-muted-foreground font-bold uppercase">Loading wishlist...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full overflow-x-hidden">
        <ShopHeader />
        <div className="h-16"></div> {/* Spacer for fixed header */}
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center max-w-md px-4">
            <Heart className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-3xl font-black uppercase mb-4">Sign in to view wishlist</h2>
            <p className="text-muted-foreground mb-6">Create an account to save your favorite products</p>
          </div>
        </div>
        <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} onSuccess={() => window.location.reload()} />
      </div>
    )
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen w-full overflow-x-hidden">
        <ShopHeader />
        <div className="h-16"></div> {/* Spacer for fixed header */}
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center max-w-md px-4">
            <Heart className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-3xl font-black uppercase mb-4">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-8">Save items you love to buy them later</p>
            <Link href="/shop">
              <Button size="lg" className="font-bold uppercase">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden">
      <ShopHeader />
      <div className="h-16"></div> {/* Spacer for fixed header */}

      <main className="w-full px-4 md:px-10 lg:px-16 py-8 md:py-12 ml-2">
        <div className="mb-8">
          <Link href="/shop" className="inline-flex items-center text-sm font-bold uppercase hover:text-accent">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Link>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <Heart className="h-8 w-8 text-accent fill-accent" />
          <h1 className="text-4xl md:text-5xl font-black uppercase">My Wishlist ({wishlistItems.length})</h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {wishlistItems.map((item) => (
            <Card key={item.id} className="group overflow-hidden">
              <div className="relative aspect-[3/4] bg-muted overflow-hidden">
                <Link
                  href={`/product/${item.product.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={item.product.image_url || "/placeholder.svg?height=400&width=300"}
                    alt={item.product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-2 right-2 bg-background/90 hover:bg-background text-destructive"
                  onClick={() => removeFromWishlist(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <CardContent className="p-4 space-y-3">
                <Link
                  href={`/product/${item.product.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <h3 className="font-bold uppercase text-sm hover:text-accent transition-colors line-clamp-2">
                    {item.product.name}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground capitalize">{item.product.category}</p>
                <p className="text-lg font-black">₹{item.product.price.toFixed(2)}</p>
                <Button
                  size="sm"
                  className="w-full font-bold uppercase"
                  onClick={() => addToCart(item.product.id)}
                  disabled={item.product.stock_quantity === 0}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  {item.product.stock_quantity === 0 ? "Out of Stock" : "Add to Cart"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}

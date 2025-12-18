"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Trash2, ShoppingBag } from "lucide-react"
import { useRouter } from "next/navigation"
import { ShopHeader } from "@/components/shop-header"
import { AuthModal } from "@/components/auth-modal"
import { SimilarProducts } from "@/components/similar-products"
import Link from "next/link"
import { createCheckoutSession } from "@/lib/actions/payment-actions"
import { useToast } from "@/hooks/use-toast"
import { Footer } from "@/components/footer"

type CartItem = {
  id: string
  quantity: number
  size: string | null
  color: string | null
  product: {
    id: string
    name: string
    price: number
    image_url: string | null
    category: string
  }
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    checkAuthAndLoadCart()
  }, [])

  const checkAuthAndLoadCart = async () => {
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
      await loadCart(user.id)
    } catch (error) {
      console.error("Error:", error)
      setLoading(false)
    }
  }

  const loadCart = async (userId: string) => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("cart_items")
        .select(
          `
          id,
          quantity,
          size,
          color,
          product:catalog_products(id, name, price, image_url, category)
        `,
        )
        .eq("user_id", userId)

      if (error) throw error
      setCartItems((data as any) || [])
    } catch (error) {
      console.error("Error loading cart:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    try {
      const supabase = createClient()
      await supabase.from("cart_items").update({ quantity: newQuantity }).eq("id", itemId)

      setCartItems((items) => items.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)))
    } catch (error) {
      console.error("Error updating quantity:", error)
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      const supabase = createClient()
      await supabase.from("cart_items").delete().eq("id", itemId)
      setCartItems((items) => items.filter((item) => item.id !== itemId))

      toast({
        title: "Item removed",
        description: "Product has been removed from your cart",
      })
    } catch (error) {
      console.error("Error removing item:", error)
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      })
    }
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      setAuthModalOpen(true)
      return
    }

    setLoading(true)
    try {
      const result = await createCheckoutSession(cartItems)

      if (result.success && result.url) {
        window.open(result.url, "_blank", "noopener,noreferrer")
      } else {
        console.error("Checkout error:", result.error)
        toast({
          title: "Checkout Error",
          description: result.error || "Failed to create checkout session",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating checkout:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
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
            <p className="text-muted-foreground font-bold uppercase">Loading cart...</p>
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
            <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-3xl font-black uppercase mb-4">Sign in to view cart</h2>
            <p className="text-muted-foreground mb-6">
              Please sign in or create an account to access your shopping cart
            </p>
          </div>
        </div>
        <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} onSuccess={() => window.location.reload()} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white w-full overflow-x-hidden">
      <ShopHeader />
      <div className="h-16"></div> {/* Spacer for fixed header */}

      <main className="w-full py-8 md:py-12 ml-2">
        {cartItems.length > 0 ? (
          <div className="grid lg:grid-cols-[2fr_1fr] gap-8 w-full px-4 md:px-10 lg:px-16">
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 pb-6 border-b">
                <div className="w-40 h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 flex-shrink-0 bg-gray-100 overflow-hidden group">
                  <Link
                    href={`/product/${item.product.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={item.product.image_url || "/placeholder.svg"}
                      alt={item.product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 cursor-pointer"
                    />
                  </Link>
                </div>
                  <div className="flex-1 min-w-0">
                    <Link 
                      href={`/product/${item.product.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <h3 className="font-bold text-lg mb-2 hover:underline">{item.product.name}</h3>
                    </Link>
                    <div className="flex gap-4 text-sm text-gray-600 mb-4">
                      <span>
                        {item.size} | {item.color}
                      </span>
                      <span>QTY | {item.quantity}</span>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-sm uppercase font-bold underline">
                      MOVE TO WISHLIST
                    </button>
                  </div>
                  <div className="text-right">
                    <button onClick={() => removeItem(item.id)} className="mb-2">
                      <Trash2 className="h-5 w-5" />
                    </button>
                    <p className="font-bold">₹{item.product.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div className="sticky top-24 border rounded-lg p-6 space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-sm">🎁</span>
                  </div>
                  <button className="text-sm font-medium">Login to view Coupons and Gift Cards</button>
                </div>

                <div>
                  <h3 className="font-bold uppercase mb-4">PRICE DETAILS</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Bag Total</span>
                      <span>₹{calculateTotal()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Coupon Discount</span>
                      <span className="text-green-600">- ₹0</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t font-bold">
                      <span>Grand Total</span>
                      <span>₹{calculateTotal()}</span>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full h-14 bg-black hover:bg-gray-900 font-black uppercase text-base mb-4"
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  PAY ₹ {calculateTotal()}
                </Button>
                
                <Link href="/shop" className="block">
                  <Button
                    variant="outline"
                    className="w-full h-12 border-black font-black uppercase text-base hover:bg-black hover:text-white"
                  >
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 px-4">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-black uppercase mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Start adding items to your cart</p>
            <Link href="/shop">
              <Button className="font-black uppercase h-14 px-8 bg-black hover:bg-black/90 text-white text-base">
                Continue Shopping
              </Button>
            </Link>
          </div>
        )}
      </main>

      {cartItems.length > 0 && (
        <SimilarProducts
          productId={cartItems[0].product.id}
          category={cartItems[0].product.category}
          title="YOU MAY ALSO LIKE"
        />
      )}

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} onSuccess={() => window.location.reload()} />
      <Footer />
    </div>
  )
}

"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Menu,
  X,
  Heart,
  ShoppingCart,
  User,
  LayoutGrid,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"

export function NavHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      setUser(user)

      if (user) {
        const { data: cart } = await supabase
          .from("cart_items")
          .select("quantity")
          .eq("user_id", user.id)

        if (cart) {
          setCartCount(cart.reduce((s, i) => s + i.quantity, 0))
        }
      } else {
        setCartCount(0)
      }
    }

    loadUser()
  }, [pathname])

  const categories = [
    { name: "ALL", value: "all" },
    { name: "ACCESSORIES", value: "accessories" },
    { name: "TRENDING", value: "trending" },
    { name: "SALE", value: "sale" },
    { name: "PLUS SIZE", value: "plussize" },
    { name: "BESTSELLERS", value: "bestsellers" },
    { name: "NEW", value: "new" },
    { name: "SHIRTS", value: "shirt" },
    { name: "JACKETS", value: "jacket" },
    { name: "JEANS", value: "jeans" },
    { name: "SWEATERS", value: "sweater" },
    { name: "T-SHIRTS", value: "tshirt" },
  ]

  const navigation = [
    { name: "Shop", href: "/shop" },
    { name: "Designs", href: "/designs" },
    { name: "Customize", href: "/customize" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-black/10">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="w-6 h-6 border-2 border-black rotate-45 flex items-center justify-center">
              <div className="w-3 h-3 bg-black" />
            </div>
            <span className="font-black text-2xl tracking-tighter text-black">
              Zylo
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 text-xs font-black uppercase tracking-wide rounded transition ${
                    isActive
                      ? "bg-black text-white"
                      : "text-black/70 hover:bg-black hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* DESKTOP ACTIONS */}
          <div className="hidden lg:flex items-center gap-1">
            <Button variant="ghost" size="icon" className="hover:bg-black hover:text-white" asChild>
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-black hover:text-white relative"
              asChild
            >
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-black text-white">
                    {cartCount}
                  </Badge>
                )}
              </Link>
            </Button>

            {user ? (
              <Button variant="ghost" size="icon" className="hover:bg-black hover:text-white" asChild>
                <Link href="/dashboard/profile">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <Button
                className="bg-black text-white hover:bg-black/90 font-black uppercase h-9 px-4"
                onClick={() => router.push("/auth/login")}
              >
                Sign In
              </Button>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="lg:hidden text-black"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* DESKTOP CATEGORY MENU (matches shop header categories) */}
        <div className="hidden lg:flex items-center gap-2 py-3 border-t border-black/10">
          <span className="text-xs font-black uppercase text-black/60">
            Shop by
          </span>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <Link
                key={cat.value}
                href={`/shop${cat.value !== "all" ? `?category=${cat.value}` : ""}`}
              >
                <Button
                  variant={
                    cat.value === "all"
                      ? pathname.startsWith("/shop") && !new URLSearchParams(
                          typeof window !== "undefined" ? window.location.search : "",
                        ).get("category")
                        ? "default"
                        : "outline"
                      : "outline"
                  }
                  size="sm"
                  className="font-bold uppercase whitespace-nowrap text-[11px]"
                >
                  {cat.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <nav className="lg:hidden border-t border-black/10 py-3 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 text-sm font-black uppercase rounded transition ${
                    isActive
                      ? "bg-black text-white"
                      : "text-black/70 hover:bg-black hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}

            <div className="border-t border-black/10 pt-3 mt-2 space-y-1">
              <Link
                href="/wishlist"
                className="block px-4 py-3 text-sm font-black uppercase text-black/70 hover:bg-black hover:text-white"
              >
                Wishlist
              </Link>

              <Link
                href="/cart"
                className="block px-4 py-3 text-sm font-black uppercase text-black/70 hover:bg-black hover:text-white"
              >
                Cart {cartCount > 0 && `(${cartCount})`}
              </Link>

              {user ? (
                <Link
                  href="/dashboard"
                  className="block px-4 py-3 text-sm font-black uppercase bg-black text-white"
                >
                  My Account
                </Link>
              ) : (
                <Link
                  href="/auth/login"
                  className="block px-4 py-3 text-sm font-black uppercase bg-black text-white"
                >
                  Sign In
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

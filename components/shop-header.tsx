"use client"

import type React from "react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { ShoppingBag, Heart, User, Search, X, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { User as SupabaseUser, Session, AuthChangeEvent } from "@supabase/supabase-js"
import { AuthModal } from "@/components/auth-modal"
import { UrbnrLogo } from "@/components/urbnr-logo"

export function ShopHeader() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [cartCount, setCartCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [authOpen, setAuthOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  const iconHoverClass =
    "hover:bg-transparent hover:text-black focus-visible:ring-0 transition-transform hover:scale-105"

  useEffect(() => {
    setMounted(true)

    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }: { data: { user: SupabaseUser | null } }) => {
      setUser(user)
      if (user) loadCart(user.id)
    })

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null)
        if (session?.user) loadCart(session.user.id)
        else setCartCount(0)
      }
    )

    function loadCart(userId: string) {
      supabase
        .from("cart_items")
        .select("quantity")
        .eq("user_id", userId)
        .then(({ data }: { data: { quantity: number | null }[] | null }) => {
          if (data) {
            setCartCount(
              data.reduce((s: number, i: { quantity: number | null }) => s + (i.quantity || 0), 0)
            )
          }
        })
    }

    return () => subscription.subscription.unsubscribe()
  }, [])

  if (!mounted) {
    return null
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    router.push(`/shop?search=${encodeURIComponent(searchQuery)}`)
    setSearchQuery("")
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white">
        
        {/* Main Header */}
        <div className="w-full h-16 flex items-center justify-between border-b border-black/10 relative px-3 sm:px-4">
          {/* LEFT - Hamburger Menu (Extreme Left) */}
          <div className="flex items-center pl-2 sm:pl-6 md:pl-10 lg:pl-16">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`${iconHoverClass} p-0`}
                >
                  <div className="flex flex-col gap-1">
                    <div className="w-5 h-0.5 bg-black"></div>
                    <div className="w-5 h-0.5 bg-[#FFB366]"></div>
                    <div className="w-5 h-0.5 bg-black"></div>
                  </div>
                </Button>
              </SheetTrigger>

              <SheetContent side="left" className="w-full sm:w-96 p-0">
                {/* Header with Close Button and Title */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-black/10">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setMenuOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                  <h2 className="text-xl font-black uppercase">CATEGORIES</h2>
                  <div className="w-8"></div> {/* Spacer for centering */}
                </div>

                {/* Filter Buttons */}
                <div className="px-6 py-4 border-b border-black/10 overflow-x-auto">
                  <div className="flex items-center gap-3 pb-2">
                    <Link href="/shop" onClick={() => setMenuOpen(false)}>
                      <Button
                        variant="default"
                        size="sm"
                        className="bg-black text-white font-black uppercase text-xs whitespace-nowrap hover:bg-black/90"
                      >
                        ALL
                      </Button>
                    </Link>
                    <Link href="/shop?category=accessories" onClick={() => setMenuOpen(false)}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-black font-black uppercase text-xs whitespace-nowrap"
                      >
                        ACCESSORIES
                      </Button>
                    </Link>
                    <Link href="/shop?category=trending" onClick={() => setMenuOpen(false)}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-black font-black uppercase text-xs whitespace-nowrap"
                      >
                        TRENDING
                      </Button>
                    </Link>
                    <Link href="/shop?category=sale" onClick={() => setMenuOpen(false)}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-black font-black uppercase text-xs whitespace-nowrap"
                      >
                        SALE
                      </Button>
                    </Link>
                    <Link href="/shop?category=plussize" onClick={() => setMenuOpen(false)}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-black font-black uppercase text-xs whitespace-nowrap"
                      >
                        PLUS SIZE
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Category List */}
                <nav className="flex flex-col overflow-y-auto">
                  {[
                    { name: "BESTSELLERS", href: "/shop?category=bestsellers", image: "/category-shirts.jpg" },
                    { name: "NEW", href: "/shop?category=new", image: "/category-essentials.jpg" },
                    { name: "SHIRTS", href: "/shop?category=shirt", image: "/category-shirts.jpg" },
                    { name: "JACKETS", href: "/shop?category=jacket", image: "/category-winterwear.jpg" },
                    { name: "JEANS", href: "/shop?category=jeans", image: "/category-jeans.jpg" },
                    { name: "SWEATERS", href: "/shop?category=sweater", image: "/category-winterwear.jpg" },
                    { name: "T-SHIRTS", href: "/shop?category=tshirt", image: "/category-essentials.jpg" },
                  ].map((category) => (
                    <Link
                      key={category.name}
                      href={category.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-4 px-6 py-4 border-b border-black/5 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-20 h-20 shrink-0 overflow-hidden rounded">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="flex-1 text-lg font-black uppercase">{category.name}</span>
                      <ChevronRight className="h-5 w-5 text-black/40 shrink-0" />
                    </Link>
                  ))}
                  <Link
                    href="/designs"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-4 px-6 py-4 border-b border-black/5 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-20 h-20 shrink-0 bg-red-600 rounded flex items-center justify-center">
                      <span className="text-white font-black text-xs">CUSTOM</span>
                    </div>
                    <span className="flex-1 text-lg font-black uppercase text-red-600">CUSTOMIZE</span>
                    <ChevronRight className="h-5 w-5 text-black/40 shrink-0" />
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* CENTER - Logo */}
          <Link
            href="/"
            className="flex items-center gap-1.5 sm:gap-2 absolute left-1/2 transform -translate-x-1/2 max-w-[120px] sm:max-w-none"
            aria-label="URBNR home"
          >
            <UrbnrLogo size={72} className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 flex-shrink-0" />
            <span className="text-sm sm:text-base md:text-xl font-black uppercase tracking-[0.1em] sm:tracking-[0.15em] md:tracking-[0.25em] text-black truncate">
              URBNR
            </span>
          </Link>

          {/* RIGHT - Search, User, Wishlist, Cart (Extreme Right) */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 pr-2 sm:pr-3 md:pr-6 lg:pr-10 xl:px-16">
            {/* SEARCH */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='Search "T-Shirt"'
                  className="w-64 h-9 pl-9 pr-4 border border-black focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                />
              </div>
            </form>

            {/* ACCOUNT */}
            <Button
              variant="ghost"
              size="icon"
              className={iconHoverClass}
              onClick={() => {
                if (user) router.push("/account")
                else setAuthOpen(true)
              }}
            >
              <User className="h-6 w-6" />
            </Button>

            {/* WISHLIST */}
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className={iconHoverClass}>
                <Heart className="h-6 w-6" />
              </Button>
            </Link>

            {/* CART */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className={`relative ${iconHoverClass}`}>
                <ShoppingBag className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-bold h-5 w-5 rounded-full flex items-center justify-center z-10">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* AUTH MODAL */}
      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        onSuccess={() => router.push("/account")}
      />
    </>
  )
}

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
<<<<<<< HEAD
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
=======
>>>>>>> 4a62e5fcd37b589bc3e624e537b2d3fd2921173c
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  const iconHoverClass =
    "hover:bg-transparent hover:text-black focus-visible:ring-0 transition-transform hover:scale-105"

  useEffect(() => {
    setMounted(true)

    const supabase = createClient()

<<<<<<< HEAD
    supabase.auth.getUser().then(({ data: { user } }) => {
=======
    supabase.auth.getUser().then(({ data: { user } }: { data: { user: SupabaseUser | null } }) => {
>>>>>>> 4a62e5fcd37b589bc3e624e537b2d3fd2921173c
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
<<<<<<< HEAD
        .then(({ data }) => {
          if (data) {
            setCartCount(
              data.reduce((s, i) => s + (i.quantity || 0), 0)
=======
        .then(({ data }: { data: { quantity: number | null }[] | null }) => {
          if (data) {
            setCartCount(
              data.reduce((s: number, i: { quantity: number | null }) => s + (i.quantity || 0), 0)
>>>>>>> 4a62e5fcd37b589bc3e624e537b2d3fd2921173c
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

<<<<<<< HEAD
  /* 🔹 ADDED: Sign Out handler (nothing else touched) */
  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setMenuOpen(false)
    setUser(null)
    setCartCount(0)
    router.push("/")
  }

  return (
    <>
      {/* Top Header - Desktop/Laptop only */}
      <header className="hidden lg:block fixed top-0 left-0 right-0 z-50 w-full bg-white">
        <div className="w-full h-16 flex items-center justify-between border-b border-black/10 relative px-4 sm:px-6 md:px-10 lg:px-16">
          
          {/* LEFT - Hamburger Menu */}
          <div className="flex items-center flex-shrink-0">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={`${iconHoverClass} p-0`}>
=======
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
>>>>>>> 4a62e5fcd37b589bc3e624e537b2d3fd2921173c
                  <div className="flex flex-col gap-1">
                    <div className="w-5 h-0.5 bg-black"></div>
                    <div className="w-5 h-0.5 bg-[#FFB366]"></div>
                    <div className="w-5 h-0.5 bg-black"></div>
                  </div>
                </Button>
              </SheetTrigger>

<<<<<<< HEAD
              {/* 🔹 ONLY CHANGE HERE: added flex flex-col */}
              <SheetContent side="left" className="w-full sm:w-96 p-0 flex flex-col">
                
                {/* Header */}
=======
              <SheetContent side="left" className="w-full sm:w-96 p-0">
                {/* Header with Close Button and Title */}
>>>>>>> 4a62e5fcd37b589bc3e624e537b2d3fd2921173c
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
<<<<<<< HEAD
                  <div className="w-8"></div>
=======
                  <div className="w-8"></div> {/* Spacer for centering */}
>>>>>>> 4a62e5fcd37b589bc3e624e537b2d3fd2921173c
                </div>

                {/* Filter Buttons */}
                <div className="px-6 py-4 border-b border-black/10 overflow-x-auto">
                  <div className="flex items-center gap-3 pb-2">
                    <Link href="/shop" onClick={() => setMenuOpen(false)}>
<<<<<<< HEAD
                      <Button className="bg-black text-white font-black uppercase text-xs whitespace-nowrap">
=======
                      <Button
                        variant="default"
                        size="sm"
                        className="bg-black text-white font-black uppercase text-xs whitespace-nowrap hover:bg-black/90"
                      >
>>>>>>> 4a62e5fcd37b589bc3e624e537b2d3fd2921173c
                        ALL
                      </Button>
                    </Link>
                    <Link href="/shop?category=accessories" onClick={() => setMenuOpen(false)}>
<<<<<<< HEAD
                      <Button variant="outline" className="border-black font-black uppercase text-xs whitespace-nowrap">
=======
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-black font-black uppercase text-xs whitespace-nowrap"
                      >
>>>>>>> 4a62e5fcd37b589bc3e624e537b2d3fd2921173c
                        ACCESSORIES
                      </Button>
                    </Link>
                    <Link href="/shop?category=trending" onClick={() => setMenuOpen(false)}>
<<<<<<< HEAD
                      <Button variant="outline" className="border-black font-black uppercase text-xs whitespace-nowrap">
=======
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-black font-black uppercase text-xs whitespace-nowrap"
                      >
>>>>>>> 4a62e5fcd37b589bc3e624e537b2d3fd2921173c
                        TRENDING
                      </Button>
                    </Link>
                    <Link href="/shop?category=sale" onClick={() => setMenuOpen(false)}>
<<<<<<< HEAD
                      <Button variant="outline" className="border-black font-black uppercase text-xs whitespace-nowrap">
=======
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-black font-black uppercase text-xs whitespace-nowrap"
                      >
>>>>>>> 4a62e5fcd37b589bc3e624e537b2d3fd2921173c
                        SALE
                      </Button>
                    </Link>
                    <Link href="/shop?category=plussize" onClick={() => setMenuOpen(false)}>
<<<<<<< HEAD
                      <Button variant="outline" className="border-black font-black uppercase text-xs whitespace-nowrap">
=======
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-black font-black uppercase text-xs whitespace-nowrap"
                      >
>>>>>>> 4a62e5fcd37b589bc3e624e537b2d3fd2921173c
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
<<<<<<< HEAD
                      className="flex items-center gap-4 px-6 py-4 border-b border-black/5 hover:bg-gray-50"
                    >
                      <div className="w-20 h-20 shrink-0 overflow-hidden rounded">
                        <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
=======
                      className="flex items-center gap-4 px-6 py-4 border-b border-black/5 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-20 h-20 shrink-0 overflow-hidden rounded">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
>>>>>>> 4a62e5fcd37b589bc3e624e537b2d3fd2921173c
                      </div>
                      <span className="flex-1 text-lg font-black uppercase">{category.name}</span>
                      <ChevronRight className="h-5 w-5 text-black/40 shrink-0" />
                    </Link>
                  ))}
<<<<<<< HEAD

                  <Link
                    href="/designs"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-4 px-6 py-4 border-b border-black/5 hover:bg-gray-50"
=======
                  <Link
                    href="/designs"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-4 px-6 py-4 border-b border-black/5 hover:bg-gray-50 transition-colors"
>>>>>>> 4a62e5fcd37b589bc3e624e537b2d3fd2921173c
                  >
                    <div className="w-20 h-20 shrink-0 bg-red-600 rounded flex items-center justify-center">
                      <span className="text-white font-black text-xs">CUSTOM</span>
                    </div>
                    <span className="flex-1 text-lg font-black uppercase text-red-600">CUSTOMIZE</span>
                    <ChevronRight className="h-5 w-5 text-black/40 shrink-0" />
                  </Link>
<<<<<<< HEAD

                  {user && (
                    <Link
                      href="/wishlist"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-4 px-6 py-4 border-b border-black/5 hover:bg-gray-50"
                    >
                      <div className="w-20 h-20 shrink-0 bg-pink-100 rounded flex items-center justify-center">
                        <Heart className="h-8 w-8 text-pink-600" />
                      </div>
                      <span className="flex-1 text-lg font-black uppercase">WISHLIST</span>
                      <ChevronRight className="h-5 w-5 text-black/40 shrink-0" />
                    </Link>
                  )}
                </nav>

                {/* 🔹 ADDED: Sign Out at bottom (nothing removed) */}
                {user && (
                  <div className="mt-auto border-t border-black/10 px-6 py-4">
                    <Button
                      onClick={handleSignOut}
                      variant="destructive"
                      className="w-full font-black uppercase"
                    >
                      Sign Out
                    </Button>
                  </div>
                )}
=======
                </nav>
>>>>>>> 4a62e5fcd37b589bc3e624e537b2d3fd2921173c
              </SheetContent>
            </Sheet>
          </div>

          {/* CENTER - Logo */}
          <Link
            href="/"
<<<<<<< HEAD
            className="flex items-center gap-2 flex-shrink-0 absolute left-1/2 -translate-x-1/2"
          >
            <UrbnrLogo size={72} className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
            <span className="text-sm sm:text-base md:text-xl font-black uppercase tracking-widest hidden sm:inline">
=======
            className="flex items-center gap-1.5 sm:gap-2 absolute left-1/2 transform -translate-x-1/2 max-w-[120px] sm:max-w-none"
            aria-label="URBNR home"
          >
            <UrbnrLogo size={72} className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 flex-shrink-0" />
            <span className="text-sm sm:text-base md:text-xl font-black uppercase tracking-[0.1em] sm:tracking-[0.15em] md:tracking-[0.25em] text-black truncate">
>>>>>>> 4a62e5fcd37b589bc3e624e537b2d3fd2921173c
              URBNR
            </span>
          </Link>

<<<<<<< HEAD
          {/* RIGHT - Search Box and Icons (Desktop only) */}
          <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
            {/* Search Box */}
            <div className="flex items-center">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search for products, brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-56 md:w-64 lg:w-72 xl:w-80 h-9 md:h-10 lg:h-10 pl-4 pr-10 border border-black/30 focus-visible:border-black rounded-sm bg-white text-sm placeholder:text-black/50 shadow-sm"
                />
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 md:h-8 md:w-8 hover:bg-black/5 rounded-sm"
                >
                  <Search className="h-4 w-4 md:h-4 md:w-4 text-black/70" />
                </Button>
              </form>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-3 sm:gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => (user ? router.push("/account") : setAuthOpen(true))}
                className="h-12 w-12 sm:h-14 sm:w-14"
              >
                <User className="h-7 w-7 sm:h-8 sm:w-8" />
              </Button>

              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative h-12 w-12 sm:h-14 sm:w-14">
                  <ShoppingBag className="h-7 w-7 sm:h-8 sm:w-8" />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-black text-white h-4 w-4 sm:h-5 sm:w-5 rounded-full text-[10px] sm:text-xs flex items-center justify-center font-bold">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Button>
              </Link>
            </div>
=======
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
>>>>>>> 4a62e5fcd37b589bc3e624e537b2d3fd2921173c
          </div>
        </div>
      </header>

<<<<<<< HEAD
      {/* Mobile Bottom Navigation Bar (Fixed at bottom on mobile only) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 w-full bg-white border-t-2 border-black/20 shadow-[0_-4px_12px_rgba(0,0,0,0.1)]">
        <div className="w-full h-16 flex items-center justify-around px-1">
          {/* Menu Button */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="flex flex-col items-center justify-center gap-0.5 h-full w-full max-w-[80px] text-black hover:bg-gray-50 active:bg-gray-100 transition-colors rounded-none"
              >
                <div className="flex flex-col gap-1">
                  <div className="w-5 h-0.5 bg-black"></div>
                  <div className="w-5 h-0.5 bg-[#FFB366]"></div>
                  <div className="w-5 h-0.5 bg-black"></div>
                </div>
                <span className="text-[10px] font-bold uppercase leading-tight">Menu</span>
              </Button>
            </SheetTrigger>

            {/* Mobile Menu Sheet */}
            <SheetContent side="left" className="w-full sm:w-96 p-0 flex flex-col">
              
              {/* Header */}
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
                <div className="w-8"></div>
              </div>

              {/* Filter Buttons */}
              <div className="px-6 py-4 border-b border-black/10 overflow-x-auto">
                <div className="flex items-center gap-3 pb-2">
                  <Link href="/shop" onClick={() => setMenuOpen(false)}>
                    <Button className="bg-black text-white font-black uppercase text-xs whitespace-nowrap">
                      ALL
                    </Button>
                  </Link>
                  <Link href="/shop?category=accessories" onClick={() => setMenuOpen(false)}>
                    <Button variant="outline" className="border-black font-black uppercase text-xs whitespace-nowrap">
                      ACCESSORIES
                    </Button>
                  </Link>
                  <Link href="/shop?category=trending" onClick={() => setMenuOpen(false)}>
                    <Button variant="outline" className="border-black font-black uppercase text-xs whitespace-nowrap">
                      TRENDING
                    </Button>
                  </Link>
                  <Link href="/shop?category=sale" onClick={() => setMenuOpen(false)}>
                    <Button variant="outline" className="border-black font-black uppercase text-xs whitespace-nowrap">
                      SALE
                    </Button>
                  </Link>
                  <Link href="/shop?category=plussize" onClick={() => setMenuOpen(false)}>
                    <Button variant="outline" className="border-black font-black uppercase text-xs whitespace-nowrap">
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
                    className="flex items-center gap-4 px-6 py-4 border-b border-black/5 hover:bg-gray-50"
                  >
                    <div className="w-20 h-20 shrink-0 overflow-hidden rounded">
                      <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="flex-1 text-lg font-black uppercase">{category.name}</span>
                    <ChevronRight className="h-5 w-5 text-black/40 shrink-0" />
                  </Link>
                ))}

                <Link
                  href="/designs"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-4 px-6 py-4 border-b border-black/5 hover:bg-gray-50"
                >
                  <div className="w-20 h-20 shrink-0 bg-red-600 rounded flex items-center justify-center">
                    <span className="text-white font-black text-xs">CUSTOM</span>
                  </div>
                  <span className="flex-1 text-lg font-black uppercase text-red-600">CUSTOMIZE</span>
                  <ChevronRight className="h-5 w-5 text-black/40 shrink-0" />
                </Link>

                {user && (
                  <Link
                    href="/wishlist"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-4 px-6 py-4 border-b border-black/5 hover:bg-gray-50"
                  >
                    <div className="w-20 h-20 shrink-0 bg-pink-100 rounded flex items-center justify-center">
                      <Heart className="h-8 w-8 text-pink-600" />
                    </div>
                    <span className="flex-1 text-lg font-black uppercase">WISHLIST</span>
                    <ChevronRight className="h-5 w-5 text-black/40 shrink-0" />
                  </Link>
                )}
              </nav>

              {/* Sign Out at bottom */}
              {user && (
                <div className="mt-auto border-t border-black/10 px-6 py-4">
                  <Button
                    onClick={handleSignOut}
                    variant="destructive"
                    className="w-full font-black uppercase"
                  >
                    Sign Out
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>

          {/* Account Button */}
          <Button
            variant="ghost"
            onClick={() => (user ? router.push("/account") : setAuthOpen(true))}
            className="flex flex-col items-center justify-center gap-0.5 h-full w-full max-w-[80px] text-black hover:bg-gray-50 active:bg-gray-100 transition-colors rounded-none"
          >
            <User className="h-6 w-6" />
            <span className="text-[10px] font-bold uppercase leading-tight">Account</span>
          </Button>

          {/* Cart Button */}
          <Link href="/cart" className="flex flex-col items-center justify-center gap-0.5 h-full w-full max-w-[80px]">
            <Button variant="ghost" className="relative h-full w-full text-black hover:bg-gray-50 active:bg-gray-100 transition-colors rounded-none">
              <div className="flex flex-col items-center justify-center gap-0.5">
                <div className="relative">
                  <ShoppingBag className="h-6 w-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white h-4 w-4 rounded-full text-[9px] flex items-center justify-center font-bold">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold uppercase leading-tight">Cart</span>
              </div>
            </Button>
          </Link>
        </div>
      </nav>

=======
      {/* AUTH MODAL */}
>>>>>>> 4a62e5fcd37b589bc3e624e537b2d3fd2921173c
      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        onSuccess={() => router.push("/account")}
      />
    </>
  )
}

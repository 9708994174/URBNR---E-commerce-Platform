"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  LayoutGrid,
  User,
  Home,
  FileText,
  ShieldCheck,
  Heart,
  ShoppingCart,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function DashboardNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    async function loadUserData() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      setIsAdmin(profile?.role === "admin")

      const { data: cart } = await supabase
        .from("cart_items")
        .select("quantity")
        .eq("user_id", user.id)

      if (cart) {
        setCartCount(cart.reduce((s: number, i: { quantity: number }) => s + i.quantity, 0))
      }
    }

    loadUserData()
  }, [pathname])

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Designs", href: "/designs", icon: LayoutGrid },
    { name: "Orders", href: "/dashboard/orders", icon: FileText },
  ]

  if (isAdmin) {
    navigation.push({ name: "Admin", href: "/admin", icon: ShieldCheck })
  }

  const iconHoverClass =
    "hover:bg-transparent hover:text-black focus-visible:ring-0 transition-transform hover:scale-105"

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white border-b border-black/10">
      {/* Main Header */}
      <div className="w-full h-16 flex items-center justify-between relative">
        {/* LEFT - Hamburger Menu (Extreme Left) */}
        <div className="flex items-center pl-4 md:pl-10 lg:pl-16">
          <Sheet>
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

            <SheetContent side="left" className="w-80">
              <nav className="flex flex-col space-y-4 mt-8">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`text-lg font-black uppercase ${
                        isActive ? "text-black" : "text-black/70"
                      }`}
                    >
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* CENTER - Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 transform -translate-x-1/2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-black uppercase tracking-wide rounded transition ${
                  isActive
                    ? "bg-black text-white"
                    : "text-black/70 hover:bg-black hover:text-white"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* RIGHT - Actions (Extreme Right) */}
        <div className="flex items-center gap-4 pr-4 md:pr-10 lg:pr-16">
          <Button variant="ghost" size="icon" className={iconHoverClass} asChild>
            <Link href="/wishlist">
              <Heart className="h-6 w-6" />
            </Link>
          </Button>

          <Button variant="ghost" size="icon" className={`relative ${iconHoverClass}`} asChild>
            <Link href="/cart">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-black text-white">
                  {cartCount}
                </Badge>
              )}
            </Link>
          </Button>

          <Button variant="ghost" size="icon" className={iconHoverClass} asChild>
            <Link href="/dashboard/profile">
              <User className="h-6 w-6" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

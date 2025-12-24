"use client"

import type React from "react"
import { ShopHeader } from "@/components/shop-header"
<<<<<<< HEAD
import { MobilePageHeader } from "@/components/mobile-page-header"
import { usePathname } from "next/navigation"

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  backHref?: string
}

export function DashboardLayout({ children, title, backHref }: DashboardLayoutProps) {
  const pathname = usePathname()
  
  // Default title based on pathname if not provided
  const getDefaultTitle = () => {
    if (pathname.includes("/dashboard/products")) return "Products"
    if (pathname.includes("/dashboard/orders")) return "Orders"
    if (pathname.includes("/dashboard/upload")) return "Upload"
    if (pathname.includes("/dashboard/profile")) return "Profile"
    return "Dashboard"
  }
  
  const pageTitle = title || getDefaultTitle()
  const defaultBackHref = backHref || "/"

  return (
    <div className="min-h-screen bg-neutral-50 w-full overflow-x-hidden">
      <ShopHeader />
      <div className="hidden lg:block h-16"></div> {/* Spacer for fixed header on desktop only */}
      <MobilePageHeader title={pageTitle} backHref={defaultBackHref} />

      <main className="w-full pt-16 lg:pt-0">
=======

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-neutral-50 w-full overflow-x-hidden">
      <ShopHeader />
      <div className="h-16"></div> {/* Spacer for fixed header */}

      <main className="w-full">
>>>>>>> 4a62e5fcd37b589bc3e624e537b2d3fd2921173c
        <div className="w-full">{children}</div>
      </main>
    </div>
  )
}

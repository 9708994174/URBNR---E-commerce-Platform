"use client"

import type React from "react"
import { ShopHeader } from "@/components/shop-header"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-neutral-50 w-full overflow-x-hidden">
      <ShopHeader />
      <div className="h-16"></div> {/* Spacer for fixed header */}

      <main className="w-full">
        <div className="w-full">{children}</div>
      </main>
    </div>
  )
}

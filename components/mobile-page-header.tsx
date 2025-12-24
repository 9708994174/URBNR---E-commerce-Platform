"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

interface MobilePageHeaderProps {
  title: string
  backHref: string
  backLabel?: string
}

export function MobilePageHeader({ title, backHref, backLabel }: MobilePageHeaderProps) {
  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-50 w-full bg-white border-b border-black/10">
      <div className="w-full h-16 flex items-center px-4">
        <Button variant="ghost" asChild size="icon" className="h-10 w-10">
          <Link href={backHref}>
            <ChevronLeft className="h-6 w-6" />
          </Link>
        </Button>
        <div className="flex-1 text-center">
          <h1 className="text-lg font-black uppercase">{title}</h1>
        </div>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </div>
    </header>
  )
}


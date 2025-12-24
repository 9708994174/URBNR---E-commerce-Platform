"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export function MobileSearchBox() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    router.push(`/shop?search=${encodeURIComponent(searchQuery)}`)
    setSearchQuery("")
  }

  return (
    <form onSubmit={handleSearch} className="flex items-center gap-2 w-full">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Search for products, brands..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-10 pl-10 pr-4 border border-black/30 focus-visible:border-black rounded-sm bg-gray-50 text-sm placeholder:text-black/50"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/50" />
      </div>
    </form>
  )
}


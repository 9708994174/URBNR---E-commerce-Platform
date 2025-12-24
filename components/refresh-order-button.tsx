"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"

interface RefreshOrderButtonProps {
  orderId: string
}

export function RefreshOrderButton({ orderId }: RefreshOrderButtonProps) {
  const [refreshing, setRefreshing] = useState(false)
  const router = useRouter()

  const handleRefresh = () => {
    setRefreshing(true)
    // Force refresh the page to get latest order data
    router.refresh()
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRefresh}
      disabled={refreshing}
      className="font-bold uppercase"
    >
      <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
      {refreshing ? "Refreshing..." : "Refresh Status"}
    </Button>
  )
}



"use client"

import { useState } from "react"
import { Package } from "lucide-react"
import { validateImageUrl, handleImageError } from "@/lib/utils/image-utils"

interface DashboardProductImageProps {
  imageUrl: string | null
  productName: string
  className?: string
  fallbackClassName?: string
}

export function DashboardProductImage({
  imageUrl,
  productName,
  className = "h-32 w-32 sm:h-40 sm:w-40 object-cover border-2 border-black/20 rounded-lg",
  fallbackClassName = "h-32 w-32 sm:h-40 sm:w-40 border-2 border-black/20 bg-neutral-100 rounded-lg flex items-center justify-center"
}: DashboardProductImageProps) {
  const [hasError, setHasError] = useState(false)

  if (!imageUrl || hasError) {
    // Determine icon size based on fallback className
    const iconSize = fallbackClassName.includes("aspect-square") 
      ? "h-24 w-24 text-neutral-400" 
      : "h-12 w-12 sm:h-16 sm:w-16 text-black/30"
    
    return (
      <div className={fallbackClassName}>
        <Package className={iconSize} />
      </div>
    )
  }

  return (
    <img
      src={validateImageUrl(imageUrl)}
      alt={productName}
      className={className}
      onError={(e) => {
        handleImageError(e)
        setHasError(true)
      }}
    />
  )
}


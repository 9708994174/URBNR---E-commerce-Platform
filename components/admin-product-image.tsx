"use client"

import { useState } from "react"
import { Package } from "lucide-react"
import { validateImageUrl, handleImageError } from "@/lib/utils/image-utils"

interface AdminProductImageProps {
  imageUrl: string | null
  productName: string
  className?: string
  fallbackClassName?: string
}

export function AdminProductImage({ 
  imageUrl, 
  productName, 
  className = "h-full w-full object-cover",
  fallbackClassName = "h-40 w-40 sm:h-48 sm:w-48 lg:h-56 lg:w-56 rounded-lg bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center flex-shrink-0 mx-auto lg:mx-0 border-2 border-black/10"
}: AdminProductImageProps) {
  const [hasError, setHasError] = useState(false)

  if (!imageUrl || hasError) {
    return (
      <div className={fallbackClassName}>
        <Package className="h-20 w-20 sm:h-24 sm:w-24 text-neutral-400" />
      </div>
    )
  }

  return (
    <div className="relative h-40 w-40 sm:h-48 sm:w-48 lg:h-56 lg:w-56 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-100 mx-auto lg:mx-0 border-2 border-black/10">
      <img
        src={validateImageUrl(imageUrl)}
        alt={productName}
        className={className}
        onError={(e) => {
          handleImageError(e)
          setHasError(true)
        }}
      />
    </div>
  )
}


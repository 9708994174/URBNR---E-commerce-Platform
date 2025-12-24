"use client"

import { useEffect, useState } from "react"
import { getSimilarProducts } from "@/lib/actions/cart-actions"
import { ProductCard } from "./product-card"
import { Button } from "./ui/button"
import { Loader2 } from "lucide-react"

interface SimilarProductsProps {
  productId: string
  category: string
  title?: string
}

const PRODUCTS_PER_PAGE = 5

export function SimilarProducts({ productId, category, title = "YOU MAY ALSO LIKE" }: SimilarProductsProps) {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)

  useEffect(() => {
    loadProducts(0)
  }, [productId, category])

  const loadProducts = async (pageNum: number) => {
    try {
      const from = pageNum * PRODUCTS_PER_PAGE
      const similar = await getSimilarProducts(productId, category, PRODUCTS_PER_PAGE, from)
      
      if (pageNum === 0) {
        setProducts(similar)
      } else {
        setProducts((prev) => [...prev, ...similar])
      }

      setHasMore(similar.length === PRODUCTS_PER_PAGE)
      setPage(pageNum)
    } catch (error) {
      console.error("Error loading similar products:", error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const handleLoadMore = async () => {
    setLoadingMore(true)
    await loadProducts(page + 1)
  }

  if (loading) {
    return (
      <div className="py-12 bg-gray-50 w-full">
        <div className="w-full px-4 md:px-10 lg:px-16 ml-2">
          <h2 className="text-center text-3xl font-black mb-8 uppercase tracking-wider px-4">{title}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-0 w-full">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-muted animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (products.length === 0) return null

  return (
    <div className="py-12 bg-gray-50 w-full">
      <div className="w-full px-4 md:px-10 lg:px-16 ml-2">
        <h2 className="text-center text-3xl font-black mb-8 uppercase tracking-wider px-4">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 w-full mb-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {hasMore && (
          <div className="flex justify-center px-4">
            <Button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="px-8 py-3 bg-black text-white font-black uppercase hover:bg-black/90"
            >
              {loadingMore ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Load More Products"
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

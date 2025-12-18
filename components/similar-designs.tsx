"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import Link from "next/link"

interface SimilarDesignsProps {
  currentDesignId: string
  category: string
  title?: string
}

const DESIGNS_PER_PAGE = 5

export function SimilarDesigns({ 
  currentDesignId, 
  category, 
  title = "SIMILAR TEMPLATES" 
}: SimilarDesignsProps) {
  const [designs, setDesigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)

  useEffect(() => {
    loadDesigns(0)
  }, [currentDesignId, category])

  const loadDesigns = async (pageNum: number) => {
    try {
      setLoading(pageNum === 0)
      setLoadingMore(pageNum > 0)
      
      const supabase = createClient()
      const from = pageNum * DESIGNS_PER_PAGE
      const to = from + DESIGNS_PER_PAGE - 1

      const { data, error } = await supabase
        .from("designs")
        .select("*")
        .eq("is_prebuilt", true)
        .eq("category", category)
        .neq("id", currentDesignId)
        .order("created_at", { ascending: false })
        .range(from, to)

      if (error) throw error

      const newDesigns = data || []
      
      if (pageNum === 0) {
        setDesigns(newDesigns)
      } else {
        setDesigns((prev) => [...prev, ...newDesigns])
      }

      setHasMore(newDesigns.length === DESIGNS_PER_PAGE)
      setPage(pageNum)
    } catch (error) {
      console.error("Error loading similar designs:", error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const handleLoadMore = async () => {
    await loadDesigns(page + 1)
  }

  if (loading) {
    return (
      <div className="py-12 bg-gray-50 w-full">
        <div className="w-full px-4 md:px-10 lg:px-16 ml-2">
          <h2 className="text-center text-3xl font-black mb-8 uppercase tracking-wider px-4">{title}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-muted animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (designs.length === 0) return null

  return (
    <div className="py-12 bg-gray-50 w-full">
      <div className="w-full px-4 md:px-10 lg:px-16 ml-2">
        <h2 className="text-center text-3xl font-black mb-8 uppercase tracking-wider px-4">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 w-full mb-8">
          {designs.map((design) => {
            const imageUrl =
              typeof design.thumbnail_url === "string" &&
              design.thumbnail_url.trim().length > 0
                ? design.thumbnail_url.trim()
                : "/placeholder.svg"

            return (
              <div
                key={design.id}
                className="group border border-black/15 hover:border-black transition bg-white flex flex-col"
              >
                {/* IMAGE */}
                <div className="aspect-[3/4] overflow-hidden bg-neutral-100">
                  <img
                    src={imageUrl}
                    alt={design.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* CONTENT */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-sm font-black uppercase truncate mb-1">
                    {design.name}
                  </h3>

                  <p className="text-xs text-black/60 line-clamp-2 mb-3">
                    {design.description}
                  </p>

                  <Link
                    href={`/designs/${design.id}`}
                    className="mt-auto block text-center border border-black py-2 text-xs font-black uppercase
                               hover:bg-black hover:text-white transition"
                  >
                    Use Design
                  </Link>
                </div>
              </div>
            )
          })}
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
                "Load More Templates"
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}


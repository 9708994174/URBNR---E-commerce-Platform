"use client"

import { useState, useMemo, useEffect } from "react"
import { ProductGrid } from "@/components/product-grid"
import { ShopFilters } from "@/components/shop-filters"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import type { Product } from "@/lib/types"

interface ShopPageClientProps {
  initialProducts: Product[]
  category?: string
  search?: string
}

export function ShopPageClient({ initialProducts, category, search }: ShopPageClientProps) {
  const [filters, setFilters] = useState<any>(null)
  const [appliedFilters, setAppliedFilters] = useState<any>(null)

  // Calculate price range from products
  const priceRange = useMemo(() => {
    if (!initialProducts || initialProducts.length === 0) {
      return { min: 0, max: 5000 }
    }
    const prices = initialProducts
      .map((p) => p.price || 0)
      .filter((p) => p > 0)
    
    if (prices.length === 0) {
      return { min: 0, max: 5000 }
    }
    
    const min = Math.floor(Math.min(...prices) / 10) * 10 // Round down to nearest 10
    const max = Math.ceil(Math.max(...prices) / 10) * 10 // Round up to nearest 10
    return { min: Math.max(0, min), max: Math.max(min + 100, max) }
  }, [initialProducts])

  const categories = [
    { name: "ALL", value: "all" },
    { name: "OFFICE WARDROBE", value: "officewardrobe" },
    { name: "FLANNEL CHECK SHIRTS", value: "flannel" },
    { name: "MEDITERRANEAN MOSAIC", value: "mediterranean" },
    { name: "TROUSERS", value: "trousers" },
    { name: "POLOS", value: "polos" },
    { name: "HOLIDAY FITS", value: "holiday" },
    { name: "ESSENTIALS", value: "essentials" },
    { name: "FOOTWEAR", value: "footwear" },
    { name: "JUST LAUNCHED", value: "justlaunched" },
    { name: "PLUS SIZE", value: "plussize" },
    { name: "NEW ARRIVALS", value: "new" },
    { name: "PRICE DROP", value: "pricedrop" },
    { name: "SHIRTS", value: "shirt" },
    { name: "T-SHIRTS", value: "tshirt" },
    { name: "JEANS", value: "jeans" },
    { name: "JACKETS", value: "jacket" },
    { name: "SWEATERS", value: "sweater" },
    { name: "ACCESSORIES", value: "accessories" },
    { name: "TRENDING", value: "trending" },
    { name: "BESTSELLERS", value: "bestsellers" },
    { name: "SALE", value: "sale" },
  ]

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters)
  }

  const handleApplyFilters = () => {
    setAppliedFilters(filters)
  }

  const filteredProducts = useMemo(() => {
    let products = [...initialProducts]

    if (!appliedFilters) return products

    // Filter by price (most efficient to do first, reduces set size)
    if (appliedFilters.price && (appliedFilters.price.min > priceRange.min || appliedFilters.price.max < priceRange.max)) {
      products = products.filter((p) => {
        const price = Number(p.price) || 0
        return price >= appliedFilters.price.min && price <= appliedFilters.price.max
      })
    }

    // Filter by category (from filter sidebar) - apply early as it's a strong filter
    if (appliedFilters.category && appliedFilters.category.length > 0) {
      const categoryMap: Record<string, string> = {
        Shirts: "shirt",
        "T-Shirts": "tshirt",
        Jeans: "jeans",
        Trousers: "trousers",
        Polos: "polos",
        Jackets: "winterwear",
        Sweaters: "winterwear",
      }
      products = products.filter((p) => {
        return appliedFilters.category.some((cat: string) => {
          const dbCategory = categoryMap[cat]
          return dbCategory && p.category === dbCategory
        })
      })
    }

    // Filter by size
    if (appliedFilters.size && appliedFilters.size.length > 0) {
      products = products.filter((p) => {
        if (!p.sizes || !Array.isArray(p.sizes)) return false
        return appliedFilters.size.some((s: string) => 
          p.sizes.map(sz => sz.toUpperCase()).includes(s.toUpperCase())
        )
      })
    }

    // Filter by color (case-insensitive, partial match)
    if (appliedFilters.color && appliedFilters.color.length > 0) {
      products = products.filter((p) => {
        if (!p.colors || !Array.isArray(p.colors)) return false
        return appliedFilters.color.some((c: string) =>
          p.colors.some((pc: string) => 
            pc.toLowerCase().includes(c.toLowerCase()) || 
            c.toLowerCase().includes(pc.toLowerCase())
          )
        )
      })
    }

    // Filter by pattern (improved matching - check name and description)
    if (appliedFilters.pattern && appliedFilters.pattern.length > 0) {
      products = products.filter((p) => {
        const searchText = `${p.name || ""} ${p.description || ""}`.toLowerCase()
        return appliedFilters.pattern.some((pattern: string) => {
          const patternLower = pattern.toLowerCase()
          // More flexible matching - check for word boundaries or partial matches
          return searchText.includes(patternLower) || 
                 searchText.includes(patternLower.replace(/\s+/g, ''))
        })
      })
    }

    // Filter by fit (improved - check name, description, and category)
    if (appliedFilters.fit && appliedFilters.fit.length > 0) {
      products = products.filter((p) => {
        const searchText = `${p.name || ""} ${p.description || ""} ${p.category || ""}`.toLowerCase()
        return appliedFilters.fit.some((fit: string) => {
          const fitLower = fit.toLowerCase()
          // Match full phrase or key words
          const fitWords = fitLower.split(/\s+/)
          return fitWords.every(word => searchText.includes(word)) || searchText.includes(fitLower)
        })
      })
    }

    // Filter by material
    if (appliedFilters.material && appliedFilters.material.length > 0) {
      products = products.filter((p) => {
        const searchText = `${p.name || ""} ${p.description || ""}`.toLowerCase()
        return appliedFilters.material.some((material: string) => {
          return searchText.includes(material.toLowerCase())
        })
      })
    }

    // Filter by collar
    if (appliedFilters.collar && appliedFilters.collar.length > 0) {
      products = products.filter((p) => {
        const searchText = `${p.name || ""} ${p.description || ""}`.toLowerCase()
        return appliedFilters.collar.some((collar: string) => {
          const collarLower = collar.toLowerCase()
          // Match collar type keywords
          const keywords = collarLower.includes('button') ? ['button', 'down'] : 
                          collarLower.includes('mandarin') ? ['mandarin'] :
                          collarLower.includes('band') ? ['band', 'collar'] : [collarLower]
          return keywords.some(kw => searchText.includes(kw))
        })
      })
    }

    // Filter by sleeves
    if (appliedFilters.sleeves && appliedFilters.sleeves.length > 0) {
      products = products.filter((p) => {
        const searchText = `${p.name || ""} ${p.description || ""}`.toLowerCase()
        return appliedFilters.sleeves.some((sleeve: string) => {
          const sleeveLower = sleeve.toLowerCase()
          const keywords = sleeveLower.includes('full') ? ['full', 'sleeve', 'long'] :
                          sleeveLower.includes('half') ? ['half', 'short', 'sleeve'] :
                          sleeveLower.includes('sleeveless') ? ['sleeveless', 'tank', 'vest'] : [sleeveLower]
          return keywords.some(kw => searchText.includes(kw))
        })
      })
    }

    return products
  }, [initialProducts, appliedFilters, priceRange])

  return (
    <>
      {!search && (
        <section className="bg-background border-b border-border sticky top-16 z-40 w-full">
          <div className="w-full px-4 md:px-10 lg:px-16 py-4 ml-4 md:ml-6">
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <Filter className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              {categories.map((cat) => (
                <a key={cat.value} href={`/shop${cat.value !== "all" ? `?category=${cat.value}` : ""}`} className="cursor-pointer">
                  <Button
                    variant={(!category && cat.value === "all") || category === cat.value ? "default" : "outline"}
                    className={`font-bold uppercase whitespace-nowrap transition-all cursor-pointer ${
                      ((!category && cat.value === "all") || category === cat.value) &&
                      "ring-2 ring-offset-2 ring-primary"
                    }`}
                    size="sm"
                  >
                    {cat.name}
                  </Button>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products */}
      <section className="py-8 md:py-12 w-full">
        <div className="w-full flex">
          {/* Filters Sidebar */}
          <div className="hidden lg:block">
            <ShopFilters 
              onFilterChange={handleFilterChange} 
              onApply={handleApplyFilters}
              priceRange={priceRange}
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1 w-full px-4 md:px-10 lg:px-16 ml-4 md:ml-6">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground font-bold uppercase">No products found</p>
                <p className="text-muted-foreground mt-2">
                  {search ? "Try a different search term" : "Try adjusting your filters"}
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-6">
                  Showing {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
                </p>
                <ProductGrid products={filteredProducts} />
              </>
            )}
          </div>
        </div>
      </section>
    </>
  )
}


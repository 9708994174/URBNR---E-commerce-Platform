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

  const categories = [
    { name: "ALL", value: "all" },
    { name: "ACCESSORIES", value: "accessories" },
    { name: "TRENDING", value: "trending" },
    { name: "SALE", value: "sale" },
    { name: "PLUS SIZE", value: "plussize" },
    { name: "BESTSELLERS", value: "bestsellers" },
    { name: "NEW", value: "new" },
    { name: "SHIRTS", value: "shirt" },
    { name: "JACKETS", value: "jacket" },
    { name: "JEANS", value: "jeans" },
    { name: "SWEATERS", value: "sweater" },
    { name: "T-SHIRTS", value: "tshirt" },
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

    // Filter by color
    if (appliedFilters.color && appliedFilters.color.length > 0) {
      products = products.filter((p) => {
        if (!p.colors || !Array.isArray(p.colors)) return false
        return appliedFilters.color.some((c: string) =>
          p.colors.some((pc: string) => pc.toLowerCase().includes(c.toLowerCase()))
        )
      })
    }

    // Filter by size
    if (appliedFilters.size && appliedFilters.size.length > 0) {
      products = products.filter((p) => {
        if (!p.sizes || !Array.isArray(p.sizes)) return false
        return appliedFilters.size.some((s: string) => p.sizes.includes(s))
      })
    }

    // Filter by price
    if (appliedFilters.price) {
      const { min, max } = appliedFilters.price
      if (min > 0 || max < 10000) {
        products = products.filter((p) => {
          const price = p.price || 0
          return price >= min && price <= max
        })
      }
    }

    // Filter by category (from filter sidebar)
    if (appliedFilters.category && appliedFilters.category.length > 0) {
      const categoryMap: Record<string, string> = {
        Shirts: "shirt",
        "T-Shirts": "tshirt",
        Jeans: "jeans",
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

    // Filter by pattern
    if (appliedFilters.pattern && appliedFilters.pattern.length > 0) {
      products = products.filter((p) => {
        const name = (p.name || "").toLowerCase()
        return appliedFilters.pattern.some((pattern: string) => {
          const patternLower = pattern.toLowerCase()
          return name.includes(patternLower)
        })
      })
    }

    // Filter by fit
    if (appliedFilters.fit && appliedFilters.fit.length > 0) {
      products = products.filter((p) => {
        const name = (p.name || "").toLowerCase()
        const desc = (p.description || "").toLowerCase()
        return appliedFilters.fit.some((fit: string) => {
          const fitLower = fit.toLowerCase()
          return name.includes(fitLower) || desc.includes(fitLower)
        })
      })
    }

    return products
  }, [initialProducts, appliedFilters])

  return (
    <>
      {!search && (
        <section className="bg-background border-b border-border sticky top-16 z-40 w-full">
          <div className="w-full px-4 md:px-10 lg:px-16 py-4 ml-2">
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <Filter className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              {categories.map((cat) => (
                <a key={cat.value} href={`/shop${cat.value !== "all" ? `?category=${cat.value}` : ""}`}>
                  <Button
                    variant={(!category && cat.value === "all") || category === cat.value ? "default" : "outline"}
                    className={`font-bold uppercase whitespace-nowrap transition-all ${
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
            <ShopFilters onFilterChange={handleFilterChange} onApply={handleApplyFilters} />
          </div>

          {/* Products Grid */}
          <div className="flex-1 w-full px-4 md:px-10 lg:px-16 ml-2">
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


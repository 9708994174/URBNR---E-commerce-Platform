import { createClient } from "@/lib/supabase/server"
import { ShopHeader } from "@/components/shop-header"
import { ShopPageClient } from "@/components/shop-page-client"
import { Footer } from "@/components/footer"

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ShopPage({ searchParams }: PageProps) {
  const params = await searchParams
  const category = params.category as string | undefined
  const search = params.search as string | undefined
  const supabase = await createClient()

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

  // Map category values to database categories
  const categoryMap: Record<string, string> = {
    // Main categories
    shirt: "shirt",
    tshirt: "tshirt",
    jeans: "jeans",
    trousers: "trousers",
    polos: "polos",
    jacket: "winterwear",
    sweater: "winterwear",
    winterwear: "winterwear",
    accessories: "shoes",
    footwear: "shoes",
    shoes: "shoes",
    // Special categories (mapped to appropriate DB categories)
    officewardrobe: "shirt",
    flannel: "shirt",
    mediterranean: "shirt",
    holiday: "shirt",
    plussize: "shirt",
    trending: "shirt",
    bestsellers: "shirt",
    sale: "shirt",
    pricedrop: "shirt",
    essentials: "tshirt",
    new: "tshirt",
    justlaunched: "shoes", // Just launched is often footwear but can be featured items
  }

  // Build query
  let query = supabase.from("catalog_products").select("*")

  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,category.ilike.%${search}%`)
  }

  // Apply category filter with special handling
  if (category && category !== "all") {
    if (category === "justlaunched") {
      // Just launched shows featured products
      query = query.eq("is_featured", true)
    } else if (category === "new") {
      // New arrivals - already filtered, will be ordered by date
      // No additional filter needed, just show all products ordered by date
    } else if (category === "pricedrop" || category === "sale") {
      // Price drop / Sale - filter by category
      query = query.eq("category", categoryMap[category] || "shirt")
    } else if (categoryMap[category]) {
      // Standard category mapping
      query = query.eq("category", categoryMap[category])
    }
  }

  // Order products: featured first, then by creation date (newest first)
  const { data: products } = await query
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden">
      <ShopHeader />
      <div className="h-16"></div> {/* Spacer for fixed header */}

      <main className="w-full">
        {/* Page Header */}
        <section className="bg-secondary border-b border-border py-8 md:py-12 w-full ml-2">
          <div className="w-full px-0">
            <h1 className="text-4xl md:text-5xl font-black uppercase text-center mb-3">
              {search
                ? `Search Results for "${search}"`
                : category && category !== "all"
                  ? categories.find((c) => c.value === category)?.name || "Shop"
                  : "All Products"}
            </h1>
            <div className="h-1 w-24 bg-accent mx-auto" />
          </div>
        </section>

        <ShopPageClient initialProducts={products || []} category={category} search={search} />
      </main>

      <Footer />
    </div>
  )
}

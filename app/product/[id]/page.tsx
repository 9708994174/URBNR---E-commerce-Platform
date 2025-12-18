import { createClient } from "@/lib/supabase/server"
import { ShopHeader } from "@/components/shop-header"
import { ProductDetails } from "@/components/product-details"
import { Footer } from "@/components/footer"
import { notFound } from "next/navigation"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: product } = await supabase.from("catalog_products").select("*").eq("id", id).single()

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden">
      <ShopHeader />
      <div className="h-16"></div> {/* Spacer for fixed header */}
      <ProductDetails product={product} />
      <Footer />
    </div>
  )
}

import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Package, Plus } from "lucide-react"
import { requireAuth } from "@/lib/auth-helpers"

export default async function MyProductsPage() {
  const user = await requireAuth()
  const supabase = await createClient()

  const { data: allProducts } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const pendingProducts = allProducts?.filter((p) => p.status === "pending") || []
  const approvedProducts = allProducts?.filter((p) => p.status === "approved") || []
  const rejectedProducts = allProducts?.filter((p) => p.status === "rejected") || []

  const ProductCard = ({ product }: { product: any }) => (
    <div className="border border-black/20 bg-white hover:border-black transition">
      <div className="p-4 flex gap-4">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.product_name}
            className="h-24 w-24 object-cover border border-black/20"
          />
        ) : (
          <div className="h-24 w-24 border border-black/20 bg-neutral-100 flex items-center justify-center">
            <Package className="h-10 w-10 text-black/30" />
          </div>
        )}

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-black uppercase text-base">
              {product.product_name}
            </h3>
            <p className="text-xs uppercase tracking-wider text-black/50">
              {product.product_type}
            </p>
            {product.description && (
              <p className="text-sm text-black/60 mt-1 line-clamp-2">
                {product.description}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between mt-3">
            <span
              className={`px-3 py-1 text-xs font-black uppercase border ${
                product.status === "approved"
                  ? "border-green-600 text-green-600"
                  : product.status === "pending"
                  ? "border-yellow-600 text-yellow-600"
                  : product.status === "under_review"
                  ? "border-blue-600 text-blue-600"
                  : "border-red-600 text-red-600"
              }`}
            >
              {product.status.replace("_", " ")}
            </span>

            <Link
              href={`/dashboard/products/${product.id}`}
              className="text-xs font-black uppercase border border-black px-4 py-2 hover:bg-black hover:text-white transition"
            >
              View
            </Link>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <DashboardLayout>
        <div className="space-y-10">

          {/* HEADER */}
          <div className="bg-black text-white px-8 py-10 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tight">
                My Products
              </h1>
              <p className="text-white/70 mt-2 text-lg">
                Manage all your uploaded products
              </p>
            </div>

            <Button
              asChild
              className="h-11 px-6 bg-white text-black hover:bg-white/90 font-black uppercase"
            >
              <Link href="/dashboard/upload">
                <Plus className="mr-2 h-4 w-4" />
                Upload New
              </Link>
            </Button>
          </div>

          {/* TABS */}
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="bg-transparent p-0 flex gap-2">
              {[
                ["all", allProducts?.length || 0],
                ["pending", pendingProducts.length],
                ["approved", approvedProducts.length],
                ["rejected", rejectedProducts.length],
              ].map(([key, count]) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="
                    uppercase text-xs font-black tracking-widest
                    border border-black px-5 py-2
                    data-[state=active]:bg-black
                    data-[state=active]:text-white
                  "
                >
                  {key} ({count})
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {!allProducts || allProducts.length === 0 ? (
                <div className="border border-dashed border-black/30 py-16 text-center">
                  <Package className="h-14 w-14 text-black/30 mx-auto mb-4" />
                  <p className="font-black uppercase text-black/50">
                    No products yet
                  </p>
                </div>
              ) : (
                allProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))
              )}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              {pendingProducts.length === 0 ? (
                <p className="text-center text-black/50 font-black uppercase py-10">
                  No pending products
                </p>
              ) : (
                pendingProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))
              )}
            </TabsContent>

            <TabsContent value="approved" className="space-y-4">
              {approvedProducts.length === 0 ? (
                <p className="text-center text-black/50 font-black uppercase py-10">
                  No approved products
                </p>
              ) : (
                approvedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))
              )}
            </TabsContent>

            <TabsContent value="rejected" className="space-y-4">
              {rejectedProducts.length === 0 ? (
                <p className="text-center text-black/50 font-black uppercase py-10">
                  No rejected products
                </p>
              ) : (
                rejectedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>

      {/* FOOTER */}
      <Footer />
    </>
  )
}

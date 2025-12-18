import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Package, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { requireAdmin } from "@/lib/auth-helpers"
import { ShopHeader } from "@/components/shop-header"
import { Footer } from "@/components/footer"
import { AdminProductActions } from "@/components/admin-product-actions"

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const params = await searchParams
  await requireAdmin()

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  const { data: allProducts } = await supabase
    .from("products")
    .select(
      `
      *,
      profiles!products_user_id_fkey(full_name, email)
    `,
    )
    .order("created_at", { ascending: false })

  const pendingProducts = allProducts?.filter((p) => p.status === "pending") || []
  const underReviewProducts = allProducts?.filter((p) => p.status === "under_review") || []
  const approvedProducts = allProducts?.filter((p) => p.status === "approved") || []
  const rejectedProducts = allProducts?.filter((p) => p.status === "rejected") || []

  const ProductCard = ({ product }: { product: any }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {product.image_url ? (
            <div className="relative h-32 w-32 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-100">
              <img
                src={product.image_url || "/placeholder.svg"}
                alt={product.product_name}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="h-32 w-32 rounded-lg bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center flex-shrink-0">
              <Package className="h-16 w-16 text-neutral-400" />
            </div>
          )}
          <div className="flex-1 space-y-2">
            <div>
              <h3 className="font-bold text-lg">{product.product_name}</h3>
              <p className="text-sm text-muted-foreground capitalize">{product.product_type}</p>
              <p className="text-sm text-muted-foreground">
                by {product.profiles?.full_name || product.profiles?.email || "Unknown"}
              </p>
            </div>
            {product.description && <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>}
            <div className="flex items-center justify-between pt-2">
              <Badge
                className={
                  product.status === "approved"
                    ? "bg-green-500 text-white"
                    : product.status === "pending"
                      ? "bg-yellow-500 text-white"
                      : product.status === "under_review"
                        ? "bg-blue-500 text-white"
                        : "bg-red-500 text-white"
                }
              >
                {product.status.replace("_", " ").toUpperCase()}
              </Badge>
              <div className="flex gap-2">
                {product.status !== "approved" && product.status !== "rejected" && (
                  <AdminProductActions 
                    productId={product.id} 
                    currentStatus={product.status}
                  />
                )}
                <Button size="sm" variant="outline" className="font-bold" asChild>
                  <Link href={`/admin/products/${product.id}`}>View Details</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  // Double-check admin status before rendering
  if (!profile || profile.role !== "admin") {
    return (
      <>
        <ShopHeader />
        <div className="min-h-screen bg-background w-full overflow-x-hidden">
          <div className="h-16"></div>
          <div className="flex items-center justify-center h-[60vh]">
            <Card className="max-w-md">
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-black uppercase mb-2">Access Denied</h2>
                <p className="text-muted-foreground mb-4">
                  You need admin privileges to access this page.
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  Current role: <strong>{profile?.role || "Not found"}</strong>
                </p>
                <div className="space-y-2">
                  <Button asChild className="w-full">
                    <Link href="/admin/setup">Set As Admin</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/dashboard">Go to Dashboard</Link>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Or set your role in Supabase: <code className="bg-muted px-1 rounded">UPDATE profiles SET role = 'admin' WHERE email = 'your-email'</code>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <ShopHeader />
      <div className="min-h-screen bg-background w-full overflow-x-hidden">
        <div className="h-16"></div> {/* Spacer for fixed header */}
        <header className="border-b bg-card w-full ml-2">
          <div className="w-full px-4 md:px-10 lg:px-16 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-black uppercase tracking-tight">Product Management</h1>
                <p className="text-muted-foreground mt-1">Review and manage customer product submissions</p>
              </div>
              <div className="flex items-center gap-4">
                <Badge className="bg-blue-500 text-white px-4 py-2">
                  Under Review: {underReviewProducts.length}
                </Badge>
                <Badge className="bg-yellow-500 text-white px-4 py-2">
                  Pending: {pendingProducts.length}
                </Badge>
              </div>
            </div>
          </div>
        </header>

        <main className="w-full px-4 md:px-10 lg:px-16 py-8 ml-2">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground uppercase font-bold mb-1">Total Products</div>
                <div className="text-2xl font-black">{allProducts?.length || 0}</div>
              </CardContent>
            </Card>
            <Card className="border-yellow-500">
              <CardContent className="p-4">
                <div className="text-sm text-yellow-600 uppercase font-bold mb-1">Pending</div>
                <div className="text-2xl font-black text-yellow-600">{pendingProducts.length}</div>
              </CardContent>
            </Card>
            <Card className="border-blue-500">
              <CardContent className="p-4">
                <div className="text-sm text-blue-600 uppercase font-bold mb-1">Under Review</div>
                <div className="text-2xl font-black text-blue-600">{underReviewProducts.length}</div>
              </CardContent>
            </Card>
            <Card className="border-green-500">
              <CardContent className="p-4">
                <div className="text-sm text-green-600 uppercase font-bold mb-1">Approved</div>
                <div className="text-2xl font-black text-green-600">{approvedProducts.length}</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue={params.status || "under_review"} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All ({allProducts?.length || 0})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({pendingProducts.length})</TabsTrigger>
              <TabsTrigger value="under_review">Under Review ({underReviewProducts.length})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({approvedProducts.length})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({rejectedProducts.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {!allProducts || allProducts.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No products found</h3>
                    <p className="text-muted-foreground">Products will appear here once users start uploading</p>
                  </CardContent>
                </Card>
              ) : (
                allProducts.map((product) => <ProductCard key={product.id} product={product} />)
              )}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              {pendingProducts.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-muted-foreground">No pending products</p>
                  </CardContent>
                </Card>
              ) : (
                pendingProducts.map((product) => <ProductCard key={product.id} product={product} />)
              )}
            </TabsContent>

            <TabsContent value="under_review" className="space-y-4">
              {underReviewProducts.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-muted-foreground">No products under review</p>
                  </CardContent>
                </Card>
              ) : (
                underReviewProducts.map((product) => <ProductCard key={product.id} product={product} />)
              )}
            </TabsContent>

            <TabsContent value="approved" className="space-y-4">
              {approvedProducts.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-muted-foreground">No approved products yet</p>
                  </CardContent>
                </Card>
              ) : (
                approvedProducts.map((product) => <ProductCard key={product.id} product={product} />)
              )}
            </TabsContent>

            <TabsContent value="rejected" className="space-y-4">
              {rejectedProducts.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-muted-foreground">No rejected products</p>
                  </CardContent>
                </Card>
              ) : (
                rejectedProducts.map((product) => <ProductCard key={product.id} product={product} />)
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
      <Footer />
    </>
  )
}

import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Clock, CheckCircle, Users } from "lucide-react"
import Link from "next/link"
import { requireAdmin } from "@/lib/auth-helpers"
import { DashboardNav } from "@/components/dashboard-nav"
import { Footer } from "@/components/footer"

export default async function AdminDashboardPage() {
  await requireAdmin()

  const supabase = await createClient()

  // Get statistics
  const { count: totalProducts } = await supabase.from("products").select("*", { count: "exact", head: true })

  const { count: pendingProducts } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")

  const { count: underReviewProducts } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("status", "under_review")

  const { count: approvedProducts } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("status", "approved")

  const { count: totalUsers } = await supabase.from("profiles").select("*", { count: "exact", head: true })

  const { data: recentProducts } = await supabase
    .from("products")
    .select(
      `
      *,
      profiles!products_user_id_fkey(full_name, email)
    `,
    )
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <>
      <DashboardNav />
      <div className="min-h-screen bg-background w-full overflow-x-hidden">
        <div className="h-16"></div> {/* Spacer for fixed header */}
        <header className="border-b bg-card w-full ml-2">
          <div className="w-full px-4 md:px-10 lg:px-16 py-4">
            <h1 className="text-2xl md:text-3xl font-black uppercase">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage products, users, and platform settings</p>
          </div>
        </header>

      <main className="w-full px-4 md:px-10 lg:px-16 py-8 space-y-8 ml-2">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingProducts || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Under Review</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{underReviewProducts || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedProducts || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers || 0}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProducts?.map((product) => (
                  <Link
                    key={product.id}
                    href={`/admin/products/${product.id}`}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {product.image_url ? (
                        <img
                          src={product.image_url || "/placeholder.svg"}
                          alt={product.product_name}
                          className="h-12 w-12 rounded object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold">{product.product_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          by {product.profiles?.full_name || product.profiles?.email || "Unknown"}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        product.status === "approved"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : product.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : product.status === "under_review"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {product.status.replace("_", " ")}
                    </span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link
                href="/admin/products?status=pending"
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <span className="font-medium">Review Pending Products</span>
                </div>
                <span className="text-2xl font-bold">{pendingProducts || 0}</span>
              </Link>

              <Link
                href="/admin/products?status=under_review"
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">Products Under Review</span>
                </div>
                <span className="text-2xl font-bold">{underReviewProducts || 0}</span>
              </Link>

              <Link
                href="/admin/products"
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">View All Products</span>
                </div>
                <span className="text-2xl font-bold">{totalProducts || 0}</span>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
    </>
  )
}

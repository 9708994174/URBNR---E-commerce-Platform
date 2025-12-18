import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Package } from "lucide-react"
import { requireAuth } from "@/lib/auth-helpers"
import { redirect } from "next/navigation"

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await requireAuth()
  const supabase = await createClient()

  const { data: product } = await supabase.from("products").select("*").eq("id", id).eq("user_id", user.id).single()

  if (!product) {
    redirect("/dashboard/products")
  }

  const { data: productDesign } = await supabase
    .from("product_designs")
    .select(
      `
      *,
      designs(*)
    `,
    )
    .eq("product_id", id)
    .maybeSingle()

  const { data: order } = await supabase.from("orders").select("*").eq("product_id", id).maybeSingle()

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <Button variant="ghost" asChild>
          <Link href="/dashboard/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardContent className="p-0">
                {product.image_url ? (
                  <img
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.product_name}
                    className="w-full aspect-square object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="w-full aspect-square bg-muted flex items-center justify-center rounded-t-lg">
                    <Package className="h-24 w-24 text-muted-foreground" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.product_name}</h1>
              <p className="text-muted-foreground capitalize">{product.product_type}</p>
              {product.description && <p className="mt-4 text-sm">{product.description}</p>}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <span
                  className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
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

                {product.status === "pending" && (
                  <p className="text-sm text-muted-foreground mt-3">
                    Your product is waiting to be reviewed. Choose a design to move forward.
                  </p>
                )}

                {product.status === "under_review" && (
                  <p className="text-sm text-muted-foreground mt-3">
                    Our team is reviewing your product and design. We&apos;ll notify you once it&apos;s approved with
                    pricing.
                  </p>
                )}

                {product.status === "approved" && !order && (
                  <p className="text-sm text-muted-foreground mt-3">
                    Your product has been approved! Create an order to proceed with payment and production.
                  </p>
                )}

                {product.status === "rejected" && (
                  <p className="text-sm text-muted-foreground mt-3">
                    Unfortunately, your product couldn&apos;t be approved. Please contact support for more details.
                  </p>
                )}
              </CardContent>
            </Card>

            {productDesign && (
              <Card>
                <CardHeader>
                  <CardTitle>Design</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    {productDesign.is_custom ? "Custom Design" : productDesign.designs?.name || "Design Selected"}
                  </p>
                  {productDesign.designs?.description && (
                    <p className="text-sm text-muted-foreground mt-2">{productDesign.designs.description}</p>
                  )}
                </CardContent>
              </Card>
            )}

            {product.status === "approved" && !order && (
              <Card>
                <CardHeader>
                  <CardTitle>Ready to Order</CardTitle>
                  <CardDescription>Create an order to proceed with payment</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href={`/dashboard/products/${product.id}/create-order`}>Create Order</Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {order && (
              <Card>
                <CardHeader>
                  <CardTitle>Order Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-semibold">${order.amount?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Status</span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        order.payment_status === "paid"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      }`}
                    >
                      {order.payment_status}
                    </span>
                  </div>
                  {order.payment_status !== "paid" && (
                    <Button asChild className="w-full mt-4">
                      <Link href={`/dashboard/orders/${order.id}/checkout`}>Complete Payment</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

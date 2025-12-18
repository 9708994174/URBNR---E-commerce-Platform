import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/footer"

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: orders } = user
    ? await supabase
        .from("orders")
        .select(
          `
          *,
          products(*)
        `,
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
    : { data: null }

  return (
    <>
      <DashboardLayout>
        <div className="space-y-8 w-full px-4 md:px-10 lg:px-16 ml-2">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight">
              My Orders
            </h1>
            <p className="text-muted-foreground mt-2">
              Track your order history and payments
            </p>
          </div>

          {!user ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-black uppercase mb-2">
                  Please Login
                </h3>
                <p className="text-muted-foreground mb-4">
                  Login to view your orders
                </p>
                <Button asChild className="font-black uppercase">
                  <Link href="/account">Login</Link>
                </Button>
              </CardContent>
            </Card>
          ) : !orders || orders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-black uppercase mb-2">
                  No orders yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Once your products are approved, you&apos;ll be able to place orders here
                </p>
                <Button asChild className="font-black uppercase">
                  <Link href="/dashboard/products">View My Products</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex gap-4">
                        {order.products?.image_url ? (
                          <img
                            src={order.products.image_url || "/placeholder.svg"}
                            alt={order.products.product_name}
                            className="h-20 w-20 object-cover border border-black/20"
                          />
                        ) : (
                          <div className="h-20 w-20 border border-black/20 bg-neutral-100 flex items-center justify-center">
                            <Package className="h-10 w-10 text-black/30" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-black uppercase">
                            {order.products?.product_name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Order #{order.id.slice(0, 8)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-black">
                            ${order.amount?.toFixed(2)}
                          </p>
                          <span
                            className={`inline-block px-3 py-1 text-xs font-black uppercase border ${
                              order.payment_status === "paid"
                                ? "border-green-600 text-green-600"
                                : order.payment_status === "pending"
                                ? "border-yellow-600 text-yellow-600"
                                : "border-red-600 text-red-600"
                            }`}
                          >
                            {order.payment_status}
                          </span>
                        </div>

                        {order.payment_status === "pending" && (
                          <Button
                            asChild
                            className="font-black uppercase"
                          >
                            <Link href={`/dashboard/orders/${order.id}/checkout`}>
                              Pay Now
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>

      {/* FOOTER */}
      <Footer />
    </>
  )
}

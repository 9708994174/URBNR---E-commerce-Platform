import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { requireAdmin } from "@/lib/auth-helpers"
import { ShopHeader } from "@/components/shop-header"
import { Footer } from "@/components/footer"
import { MobilePageHeader } from "@/components/mobile-page-header"
import { Package, Truck, CheckCircle, XCircle, RefreshCw } from "lucide-react"
import Link from "next/link"

export default async function AdminOrdersPage() {
  await requireAdmin()

  const supabase = await createClient()

  // Get all orders with product and user info
  const { data: orders } = await supabase
    .from("orders")
    .select(
      `
      *,
      catalog_products:catalog_product_id(id, name, image_url),
      profiles:user_id(id, full_name, email)
    `
    )
    .order("created_at", { ascending: false })

  // Get returns
  const { data: returns } = await supabase
    .from("order_returns")
    .select(
      `
      *,
      orders:order_id(id, order_number, amount),
      profiles:user_id(id, full_name, email)
    `
    )
    .order("requested_at", { ascending: false })

  // Get exchanges
  const { data: exchanges } = await supabase
    .from("order_exchanges")
    .select(
      `
      *,
      orders:order_id(id, order_number),
      profiles:user_id(id, full_name, email),
      catalog_products:requested_product_id(id, name)
    `
    )
    .order("requested_at", { ascending: false })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
      case "delivered":
      case "completed":
      case "approved":
        return "bg-green-500 text-white border-green-600"
      case "pending":
      case "processing":
        return "bg-yellow-500 text-white border-yellow-600"
      case "shipped":
      case "in_transit":
        return "bg-blue-500 text-white border-blue-600"
      case "cancelled":
      case "rejected":
      case "failed":
        return "bg-red-500 text-white border-red-600"
      default:
        return "bg-gray-500 text-white border-gray-600"
    }
  }

  return (
    <>
      <ShopHeader />
      <div className="min-h-screen bg-background w-full overflow-x-hidden">
        <div className="hidden lg:block h-16"></div> {/* Spacer for fixed header on desktop only */}
        <MobilePageHeader title="Orders Management" backHref="/admin" />

        <header className="border-b bg-black text-white w-full pt-16 lg:pt-0">
          <div className="w-full px-4 md:px-10 lg:px-16 py-8 md:py-10">
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">Orders Management</h1>
            <p className="text-base sm:text-lg text-white/70 mt-3 sm:mt-2">Manage all orders, returns, and exchanges</p>
          </div>
        </header>

        <main className="w-full px-4 md:px-10 lg:px-16 py-6 md:py-8 space-y-6 sm:space-y-8 pb-8 md:pb-12">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <Card className="border-2 border-black/10 hover:border-black/20 transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs sm:text-sm font-black uppercase">Total Orders</CardTitle>
                <Package className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl md:text-3xl font-black">{orders?.length || 0}</div>
              </CardContent>
            </Card>

            <Card className="border-2 border-black/10 hover:border-black/20 transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs sm:text-sm font-black uppercase">Pending Returns</CardTitle>
                <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl md:text-3xl font-black">
                  {returns?.filter((r) => r.status === "pending").length || 0}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-black/10 hover:border-black/20 transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs sm:text-sm font-black uppercase">Pending Exchanges</CardTitle>
                <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl md:text-3xl font-black">
                  {exchanges?.filter((e) => e.status === "pending").length || 0}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-black/10 hover:border-black/20 transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs sm:text-sm font-black uppercase">Shipped</CardTitle>
                <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl md:text-3xl font-black">
                  {orders?.filter((o) => o.shipping_status === "shipped" || o.shipping_status === "delivered").length || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Orders */}
          <Card className="border-2 border-black/10 hover:border-black/20 transition-all">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl font-black uppercase">All Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders && orders.length > 0 ? (
                  orders.map((order: any) => (
                    <div
                      key={order.id}
                      className="flex flex-col gap-3 sm:gap-4 p-4 sm:p-6 border-2 border-black/10 rounded-lg hover:border-black/20 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        {order.catalog_products?.image_url ? (
                          <img
                            src={order.catalog_products.image_url}
                            alt={order.catalog_products.name}
                            className="h-24 w-24 sm:h-20 sm:w-20 object-cover rounded-lg flex-shrink-0 mx-auto sm:mx-0 border-2 border-black/10"
                          />
                        ) : (
                          <div className="h-24 w-24 sm:h-20 sm:w-20 bg-muted rounded-lg flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0 border-2 border-black/10">
                            <Package className="h-12 w-12 sm:h-10 sm:w-10 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 text-center sm:text-left">
                          <h4 className="font-black uppercase text-base sm:text-lg mb-2">{order.catalog_products?.name || "Unknown Product"}</h4>
                          <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                            Order #{order.order_number || order.id.slice(0, 8)}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                            {order.profiles?.full_name || order.profiles?.email || "Unknown User"}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t-2 border-black/10">
                        <p className="text-lg sm:text-xl font-black text-center sm:text-left">₹{order.amount?.toFixed(2) || "0.00"}</p>
                        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                          <Badge className={`${getStatusColor(order.payment_status || "pending")} h-10 w-full sm:w-auto flex items-center justify-center text-xs sm:text-sm font-black uppercase px-4 border-2`}>
                            {order.payment_status || "pending"}
                          </Badge>
                          {order.shipping_status && (
                            <Badge className={`${getStatusColor(order.shipping_status)} h-10 w-full sm:w-auto flex items-center justify-center text-xs sm:text-sm font-black uppercase px-4 border-2`}>
                              {order.shipping_status}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">No orders found</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Returns */}
          <Card className="border-2 border-black/10 hover:border-black/20 transition-all">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl font-black uppercase">Return Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {returns && returns.length > 0 ? (
                  returns.map((returnRequest: any) => (
                    <div
                      key={returnRequest.id}
                      className="flex flex-col gap-3 sm:gap-4 p-4 sm:p-6 border-2 border-black/10 rounded-lg hover:border-black/20 transition-all"
                    >
                      <div className="flex-1">
                        <h4 className="font-black uppercase text-base sm:text-lg mb-2">Return Request #{returnRequest.id.slice(0, 8)}</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                          Order: {returnRequest.orders?.order_number || returnRequest.order_id.slice(0, 8)}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                          User: {returnRequest.profiles?.full_name || returnRequest.profiles?.email}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-1">Reason: {returnRequest.reason}</p>
                        <p className="text-xs sm:text-sm mt-2">{returnRequest.description}</p>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t-2 border-black/10">
                        <Badge className={`${getStatusColor(returnRequest.status)} h-10 w-full sm:w-auto flex items-center justify-center text-xs sm:text-sm font-black uppercase px-4 border-2`}>
                          {returnRequest.status}
                        </Badge>
                        {returnRequest.refund_amount && (
                          <p className="text-base sm:text-lg font-black text-center sm:text-right">Refund: ₹{returnRequest.refund_amount.toFixed(2)}</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">No return requests</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Exchanges */}
          <Card className="border-2 border-black/10 hover:border-black/20 transition-all">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl font-black uppercase">Exchange Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {exchanges && exchanges.length > 0 ? (
                  exchanges.map((exchangeRequest: any) => (
                    <div
                      key={exchangeRequest.id}
                      className="flex flex-col gap-3 sm:gap-4 p-4 sm:p-6 border-2 border-black/10 rounded-lg hover:border-black/20 transition-all"
                    >
                      <div className="flex-1">
                        <h4 className="font-black uppercase text-base sm:text-lg mb-2">Exchange Request #{exchangeRequest.id.slice(0, 8)}</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                          Order: {exchangeRequest.orders?.order_number || exchangeRequest.order_id.slice(0, 8)}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                          User: {exchangeRequest.profiles?.full_name || exchangeRequest.profiles?.email}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-1">Reason: {exchangeRequest.reason}</p>
                        {exchangeRequest.catalog_products && (
                          <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                            Exchange for: {exchangeRequest.catalog_products.name}
                          </p>
                        )}
                        <p className="text-xs sm:text-sm mt-2">{exchangeRequest.description}</p>
                      </div>
                      <div className="pt-3 border-t-2 border-black/10">
                        <Badge className={`${getStatusColor(exchangeRequest.status)} h-10 w-full sm:w-auto flex items-center justify-center text-xs sm:text-sm font-black uppercase px-4 border-2`}>
                          {exchangeRequest.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">No exchange requests</p>
                )}
              </div>
            </CardContent>
          </Card>
        </main>

        <Footer />
      </div>
    </>
  )
}


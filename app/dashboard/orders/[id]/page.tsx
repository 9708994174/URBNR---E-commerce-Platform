import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, Truck, MapPin, Calendar, CreditCard, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { ReturnExchangeRequest } from "@/components/return-exchange-request"
import { requireAuth } from "@/lib/auth-helpers"
import { redirect } from "next/navigation"
import { OrderImage } from "@/components/order-image"

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await requireAuth()
  const supabase = await createClient()

  // Get order with all related data
  const { data: order } = await supabase
    .from("orders")
    .select(`
      *,
      catalog_products:catalog_product_id(id, name, image_url, description),
      products:product_id(id, product_name, image_url, description, product_type),
      profiles:user_id(id, full_name, email)
    `)
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (!order) {
    redirect("/dashboard/orders")
  }

  // Get order tracking history
  const { data: trackingHistory } = await supabase
    .from("order_tracking")
    .select("*")
    .eq("order_id", id)
    .order("created_at", { ascending: true })

  // Get return/exchange requests for this order
  const { data: returnRequest } = await supabase
    .from("order_returns")
    .select("*")
    .eq("order_id", id)
    .maybeSingle()

  const { data: exchangeRequest } = await supabase
    .from("order_exchanges")
    .select("*")
    .eq("order_id", id)
    .maybeSingle()

  const product = order.catalog_products || order.products
  const productName = order.catalog_products?.name || order.products?.product_name || "Product"
  const productImage = order.catalog_products?.image_url || order.products?.image_url

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
      case "confirmed":
      case "delivered":
        return "border-green-600 text-green-600 bg-green-50"
      case "pending":
      case "processing":
        return "border-yellow-600 text-yellow-600 bg-yellow-50"
      case "shipped":
      case "in_transit":
        return "border-blue-600 text-blue-600 bg-blue-50"
      case "cancelled":
      case "rejected":
        return "border-red-600 text-red-600 bg-red-50"
      default:
        return "border-gray-600 text-gray-600 bg-gray-50"
    }
  }

  return (
    <>
      <DashboardLayout title="Order Details" backHref="/dashboard/orders">
        <div className="space-y-8 sm:space-y-10 w-full pb-8 md:pb-12">
          {/* Header */}
          <div className="bg-black text-white w-full py-8 sm:py-10 px-4 md:px-10 lg:px-16">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
                Order Details
              </h1>
              <p className="text-white/70 mt-2 text-base sm:text-lg">
                Order #{order.order_number || id.slice(0, 8).toUpperCase()}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="w-full px-4 md:px-10 lg:px-16 max-w-6xl mx-auto space-y-6">
            {/* Order Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="border-2 border-black/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-8 w-8 text-black/40" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Payment</p>
                      <Badge className={`mt-1 h-10 w-full sm:w-auto flex items-center justify-center text-xs sm:text-sm font-black uppercase px-4 ${getStatusColor(order.payment_status || "pending")} border-2`}>
                        {order.payment_status || "pending"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2 border-black/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Package className="h-8 w-8 text-black/40" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Order Status</p>
                      <Badge className={`mt-1 h-10 w-full sm:w-auto flex items-center justify-center text-xs sm:text-sm font-black uppercase px-4 ${getStatusColor(order.order_status || "pending")} border-2`}>
                        {order.order_status?.replace("_", " ") || "pending"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2 border-black/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Truck className="h-8 w-8 text-black/40" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Shipping</p>
                      <Badge className={`mt-1 h-10 w-full sm:w-auto flex items-center justify-center text-xs sm:text-sm font-black uppercase px-4 ${getStatusColor(order.shipping_status || "pending")} border-2`}>
                        {order.shipping_status?.replace("_", " ") || "pending"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Left Column - Product & Details */}
              <div className="md:col-span-2 space-y-6">
                {/* Product Card */}
                <Card className="border-2 border-black/20">
                  <CardHeader className="bg-black/5">
                    <CardTitle className="text-xl font-black uppercase">Product Details</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <OrderImage
                          src={productImage}
                          alt={productName}
                        />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="font-black uppercase text-xl">{productName}</h3>
                          {order.products?.product_type && (
                            <p className="text-sm text-muted-foreground capitalize">{order.products.product_type}</p>
                          )}
                        </div>
                        {(order.size || order.color) && (
                          <div className="flex gap-4 text-sm">
                            {order.size && (
                              <div>
                                <span className="text-muted-foreground uppercase font-bold">Size:</span>{" "}
                                <span className="font-semibold">{order.size}</span>
                              </div>
                            )}
                            {order.color && (
                              <div>
                                <span className="text-muted-foreground uppercase font-bold">Color:</span>{" "}
                                <span className="font-semibold capitalize">{order.color}</span>
                              </div>
                            )}
                          </div>
                        )}
                        <div>
                          <span className="text-muted-foreground uppercase font-bold text-sm">Quantity:</span>{" "}
                          <span className="font-black text-lg">{order.quantity || 1}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground uppercase font-bold text-sm">Unit Price:</span>{" "}
                          <span className="font-black text-lg">₹{((order.amount || 0) / (order.quantity || 1)).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Address */}
                {(order.shipping_address || order.shipping_info) && (
                  <Card className="border-2 border-black/20">
                    <CardHeader className="bg-black/5">
                      <CardTitle className="text-xl font-black uppercase flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Shipping Address
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-2">
                        <p className="font-bold text-lg">{order.shipping_address?.fullName || order.shipping_address?.full_name || order.shipping_info?.fullName || order.shipping_info?.full_name}</p>
                        <p>{order.shipping_address?.address_line1 || order.shipping_address?.address || order.shipping_info?.address_line1 || order.shipping_info?.address}</p>
                        {order.shipping_address?.address_line2 && <p>{order.shipping_address.address_line2}</p>}
                        <p>
                          {order.shipping_address?.city || order.shipping_info?.city}, {order.shipping_address?.state || order.shipping_info?.state} {order.shipping_address?.zip_code || order.shipping_address?.zipCode || order.shipping_info?.zip_code}
                        </p>
                        <p>{order.shipping_address?.country || order.shipping_info?.country || "India"}</p>
                        {(order.shipping_address?.phone || order.shipping_info?.phone) && (
                          <p className="mt-2">
                            <span className="font-bold">Phone:</span> {order.shipping_address?.phone || order.shipping_info?.phone}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Order Tracking */}
                {trackingHistory && trackingHistory.length > 0 && (
                  <Card className="border-2 border-black/20">
                    <CardHeader className="bg-black/5">
                      <CardTitle className="text-xl font-black uppercase flex items-center gap-2">
                        <Truck className="h-5 w-5" />
                        Order Tracking
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {trackingHistory.map((tracking, idx) => (
                          <div key={tracking.id} className="flex gap-4 pb-4 border-b border-black/10 last:border-0 last:pb-0">
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-black/10 flex items-center justify-center">
                                <Truck className="h-5 w-5 text-black/60" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="font-bold uppercase">{tracking.status?.replace("_", " ")}</p>
                              {tracking.message && <p className="text-sm text-muted-foreground">{tracking.message}</p>}
                              {tracking.location && <p className="text-sm text-muted-foreground">📍 {tracking.location}</p>}
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(tracking.created_at).toLocaleString("en-IN")}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Right Column - Summary & Actions */}
              <div className="space-y-6">
                {/* Order Summary */}
                <Card className="border-2 border-black/20 sticky top-4">
                  <CardHeader className="bg-black/5">
                    <CardTitle className="text-xl font-black uppercase">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-bold">₹{((order.amount || 0) / (order.quantity || 1)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Quantity</span>
                      <span className="font-bold">{order.quantity || 1}</span>
                    </div>
                    <div className="border-t-2 border-black/20 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-black uppercase text-lg">Total</span>
                        <span className="font-black text-2xl">₹{(order.amount || 0).toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-black/10">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Order Date:</span>
                        <span className="font-semibold">
                          {new Date(order.created_at).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      {order.tracking_number && (
                        <div className="flex items-center gap-2 text-sm">
                          <Truck className="h-4 w-4 text-blue-600" />
                          <span className="text-muted-foreground">Tracking:</span>
                          <span className="font-bold text-blue-600">{order.tracking_number}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Payment:</span>
                        <Badge className={getStatusColor(order.payment_status || "pending")}>
                          {(order.payment_method || "card").toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                {order.payment_status === "paid" && 
                 order.order_status !== "returned" && 
                 order.order_status !== "exchanged" && 
                 order.order_status !== "cancelled" && (
                  <Card className="border-2 border-black/20">
                    <CardHeader className="bg-black/5">
                      <CardTitle className="text-lg font-black uppercase">Order Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <ReturnExchangeRequest
                        orderId={order.id}
                        productId={order.catalog_product_id || order.product_id}
                        productName={productName}
                        orderDate={order.created_at}
                      />
                    </CardContent>
                  </Card>
                )}

                {order.payment_status === "pending" && (
                  <Card className="border-2 border-yellow-500">
                    <CardContent className="p-6 text-center">
                      <p className="text-sm text-muted-foreground mb-4">Complete your payment to proceed</p>
                      <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white font-black uppercase h-12">
                        <Link href={`/dashboard/orders/${order.id}/checkout`}>Pay Now</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
      <Footer />
    </>
  )
}


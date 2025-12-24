"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { RefreshCw, PackageX } from "lucide-react"

interface ReturnExchangeRequestProps {
  orderId: string
  productId: string
  productName: string
  orderDate: string
  onSuccess?: () => void
}

export function ReturnExchangeRequest({
  orderId,
  productId,
  productName,
  orderDate,
  onSuccess,
}: ReturnExchangeRequestProps) {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<"return" | "exchange">("return")
  const [reason, setReason] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [exchangeProductId, setExchangeProductId] = useState("")
  const [exchangeSize, setExchangeSize] = useState("")
  const [exchangeColor, setExchangeColor] = useState("")
  const [products, setProducts] = useState<any[]>([])
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const { toast } = useToast()

  // Check if order is within 7 days
  const orderDateObj = new Date(orderDate)
  const daysSinceOrder = Math.floor((Date.now() - orderDateObj.getTime()) / (1000 * 60 * 60 * 24))
  const isWithinPolicy = daysSinceOrder <= 7

  // Load products for exchange
  useEffect(() => {
    if (type === "exchange" && open) {
      const loadProducts = async () => {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("catalog_products")
          .select("id, name, sizes, colors")
          .order("name")

        if (!error && data) {
          setProducts(data)
        }
      }
      loadProducts()
    }
  }, [type, open])

  // Update sizes and colors when product changes
  useEffect(() => {
    if (selectedProduct) {
      const product = products.find((p) => p.id === selectedProduct)
      if (product) {
        setExchangeProductId(product.id)
        if (product.sizes && product.sizes.length > 0) {
          setExchangeSize(product.sizes[0])
        }
        if (product.colors && product.colors.length > 0) {
          setExchangeColor(product.colors[0])
        }
      }
    }
  }, [selectedProduct, products])

  const handleSubmit = async () => {
    if (!reason || !description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (type === "exchange" && !exchangeProductId) {
      toast({
        title: "Missing information",
        description: "Please select a product for exchange",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Error",
          description: "Please login to continue",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Verify the order exists and belongs to the user
      const { data: orderCheck, error: orderError } = await supabase
        .from("orders")
        .select("id, user_id, payment_status, order_status")
        .eq("id", orderId)
        .eq("user_id", user.id)
        .single()

      if (orderError || !orderCheck) {
        console.error("Order verification error:", orderError)
        toast({
          title: "Error",
          description: "Order not found or you don't have permission to access it",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Check if order is eligible for return/exchange
      if (orderCheck.payment_status !== "paid") {
        toast({
          title: "Error",
          description: "Only paid orders can be returned or exchanged",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Check if order has been shipped - cannot return after shipping
      const shippingStatus = orderCheck.shipping_status || "pending"
      if (
        shippingStatus === "shipped" ||
        shippingStatus === "in_transit" ||
        shippingStatus === "out_for_delivery" ||
        shippingStatus === "preparing"
      ) {
        toast({
          title: "Cannot Return/Exchange",
          description: "This order has been shipped and cannot be returned or exchanged. You can only return/exchange before shipping or after delivery.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Check if order is already returned or exchanged
      if (orderCheck.order_status === "returned" || orderCheck.order_status === "exchanged") {
        toast({
          title: "Error",
          description: "This order has already been returned or exchanged",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      if (type === "return") {
        const { data, error } = await supabase.from("order_returns").insert({
          order_id: orderId,
          user_id: user.id,
          reason,
          description,
          status: "pending",
        }).select()

        if (error) {
          console.error("Return insert error:", {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint,
            error: error
          })
          
          // Check if table doesn't exist
          if (error.message?.includes("Could not find the table") || error.message?.includes("relation") || error.message?.includes("does not exist")) {
            throw new Error("Database tables not set up. Please run scripts/038_create_returns_exchanges_tables.sql in Supabase SQL Editor.")
          }
          
          throw new Error(error.message || `Failed to submit return request: ${error.code || 'Unknown error'}`)
        }

        toast({
          title: "Return request submitted",
          description: "Your return request has been submitted and will be reviewed within 24 hours.",
        })
      } else {
        const { data, error } = await supabase.from("order_exchanges").insert({
          order_id: orderId,
          user_id: user.id,
          reason,
          description,
          requested_product_id: exchangeProductId || null,
          requested_size: exchangeSize || null,
          requested_color: exchangeColor || null,
          status: "pending",
        }).select()

        if (error) {
          console.error("Exchange insert error:", {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint,
            error: error
          })
          
          // Check if table doesn't exist
          if (error.message?.includes("Could not find the table") || error.message?.includes("relation") || error.message?.includes("does not exist")) {
            throw new Error("Database tables not set up. Please run scripts/038_create_returns_exchanges_tables.sql in Supabase SQL Editor.")
          }
          
          throw new Error(error.message || `Failed to submit exchange request: ${error.code || 'Unknown error'}`)
        }

        toast({
          title: "Exchange request submitted",
          description: "Your exchange request has been submitted and will be reviewed within 24 hours.",
        })
      }

      setOpen(false)
      setReason("")
      setDescription("")
      setExchangeProductId("")
      setExchangeSize("")
      setExchangeColor("")
      onSuccess?.()
    } catch (error: any) {
      console.error("Error submitting request:", error)
      console.error("Error details:", {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
        stack: error?.stack,
        fullError: error
      })
      
      let errorMessage = "Failed to submit request"
      if (error?.message) {
        errorMessage = error.message
      } else if (error?.code === '42501') {
        errorMessage = "Permission denied. Please ensure you're logged in and have permission to submit this request."
      } else if (error?.code === '23503') {
        errorMessage = "Invalid order or product reference. Please refresh the page and try again."
      } else if (error?.code === '23502') {
        errorMessage = "Missing required information. Please fill in all required fields."
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!isWithinPolicy) {
    return (
      <div className="text-sm text-muted-foreground">
        Return/exchange window has expired (7 days from order date)
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-2 border-black hover:bg-black hover:text-white font-black uppercase h-11 w-full sm:w-auto">
          {type === "return" ? (
            <>
              <PackageX className="h-4 w-4 mr-2" />
              Return
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Exchange
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase">
            {type === "return" ? "Request Return" : "Request Exchange"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <p className="text-sm font-bold text-blue-900 mb-2">7-Day Return/Exchange Policy</p>
            <p className="text-sm text-blue-800">
              You can return or exchange this item within 7 days of purchase. Your request will be reviewed within 24 hours.
            </p>
          </div>

          <div>
            <Label className="text-sm font-bold uppercase">Product</Label>
            <p className="text-sm text-muted-foreground mt-1">{productName}</p>
          </div>

          <div>
            <Label htmlFor="reason" className="text-sm font-bold uppercase">
              Reason *
            </Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger id="reason" className="mt-2">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="defective">Defective/Damaged</SelectItem>
                <SelectItem value="wrong_size">Wrong Size</SelectItem>
                <SelectItem value="wrong_color">Wrong Color</SelectItem>
                <SelectItem value="not_as_described">Not as Described</SelectItem>
                <SelectItem value="changed_mind">Changed Mind</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-bold uppercase">
              Description *
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide more details about your request..."
              className="mt-2 min-h-[100px]"
            />
          </div>

          {type === "exchange" && (
            <>
              <div>
                <Label className="text-sm font-bold uppercase">
                  Exchange Product *
                </Label>
                <p className="text-sm text-muted-foreground mt-1 mb-2">
                  Select the product you want to exchange for
                </p>
                <Select value={selectedProduct || ""} onValueChange={setSelectedProduct}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedProduct && (
                <div className="grid grid-cols-2 gap-4">
                  {products.find((p) => p.id === selectedProduct)?.sizes && (
                    <div>
                      <Label htmlFor="exchangeSize" className="text-sm font-bold uppercase">
                        Size
                      </Label>
                      <Select value={exchangeSize} onValueChange={setExchangeSize}>
                        <SelectTrigger id="exchangeSize" className="mt-2">
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          {products
                            .find((p) => p.id === selectedProduct)
                            ?.sizes?.map((size: string) => (
                              <SelectItem key={size} value={size}>
                                {size}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {products.find((p) => p.id === selectedProduct)?.colors && (
                    <div>
                      <Label htmlFor="exchangeColor" className="text-sm font-bold uppercase">
                        Color
                      </Label>
                      <Select value={exchangeColor} onValueChange={setExchangeColor}>
                        <SelectTrigger id="exchangeColor" className="mt-2">
                          <SelectValue placeholder="Select color" />
                        </SelectTrigger>
                        <SelectContent>
                          {products
                            .find((p) => p.id === selectedProduct)
                            ?.colors?.map((color: string) => (
                              <SelectItem key={color} value={color}>
                                {color}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 font-bold uppercase"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 font-black uppercase bg-black hover:bg-gray-800"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ShopHeader } from "@/components/shop-header"
import { Button } from "@/components/ui/button"
import { CheckCircle, Package, Loader2 } from "lucide-react"
import Link from "next/link"
import { handlePaymentSuccess } from "@/lib/actions/payment-actions"

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const sessionId = searchParams.get("session_id")

    if (!sessionId) {
      setError("No session found")
      setLoading(false)
      return
    }

    handlePayment(sessionId)
  }, [searchParams])

  const handlePayment = async (sessionId: string) => {
    try {
      const result = await handlePaymentSuccess(sessionId)

      if (!result.success) {
        setError(result.error || "Payment verification failed")
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <ShopHeader />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-16 w-16 animate-spin mx-auto mb-4" />
            <p className="text-lg font-bold uppercase">Processing your order...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <ShopHeader />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center max-w-md px-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-3xl">✕</span>
            </div>
            <h2 className="text-3xl font-black uppercase mb-4">Order Failed</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link href="/cart">
              <Button className="font-bold uppercase">Return to Cart</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ShopHeader />

      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>

          <h1 className="text-4xl font-black uppercase mb-4">ORDER CONFIRMED!</h1>
          <p className="text-xl text-gray-600 mb-8">
            Thank you for your purchase. We'll send you a confirmation email shortly.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Package className="h-6 w-6 text-gray-600" />
              <h2 className="text-lg font-bold uppercase">What's Next?</h2>
            </div>
            <ul className="text-left space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">1.</span>
                <span>You'll receive an order confirmation email</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">2.</span>
                <span>We'll notify you when your order ships</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">3.</span>
                <span>Track your order from your account</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/account">
              <Button variant="outline" className="font-bold uppercase w-full sm:w-auto bg-transparent">
                View Orders
              </Button>
            </Link>
            <Link href="/shop">
              <Button className="font-bold uppercase w-full sm:w-auto">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { XCircle } from "lucide-react"
import Link from "next/link"

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="max-w-lg w-full mx-4">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          <CardTitle className="text-3xl font-black uppercase">Checkout Cancelled</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-muted-foreground text-lg">
            Your checkout was cancelled. No charges were made to your account.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="flex-1 font-bold uppercase">
              <Link href="/cart">Return to Cart</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="flex-1 font-bold uppercase bg-transparent">
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

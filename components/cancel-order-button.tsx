"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cancelOrder } from "@/lib/actions/order-actions"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"

interface CancelOrderButtonProps {
  orderId: string
}

export function CancelOrderButton({ orderId }: CancelOrderButtonProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleCancel = async () => {
    if (!reason.trim()) {
      toast({
        title: "Reason required",
        description: "Please provide a reason for cancellation",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    const result = await cancelOrder(orderId, reason)
    
    if (result.success) {
      toast({
        title: "Order cancelled",
        description: result.message || "Your order has been cancelled successfully",
      })
      setOpen(false)
      setReason("")
      router.refresh()
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to cancel order",
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full font-bold uppercase border-2 border-red-300 text-red-600 hover:bg-red-50"
        >
          <X className="h-4 w-4 mr-2" />
          Cancel Order
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-black uppercase">Cancel Order</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel this order? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label className="text-sm font-bold uppercase">Reason for Cancellation *</Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide a reason for cancelling this order..."
              className="mt-2 min-h-[100px]"
            />
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false)
                setReason("")
              }}
              className="flex-1 font-bold uppercase"
            >
              Keep Order
            </Button>
            <Button
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 font-black uppercase bg-red-600 hover:bg-red-700 text-white"
            >
              {loading ? "Cancelling..." : "Confirm Cancellation"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}



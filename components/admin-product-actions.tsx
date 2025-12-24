"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { approveProduct, rejectProduct } from "@/lib/actions/admin-actions"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface AdminProductActionsProps {
  productId: string
  currentStatus: string
  onUpdate?: () => void
}

export function AdminProductActions({ productId, currentStatus, onUpdate }: AdminProductActionsProps) {
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [approveOpen, setApproveOpen] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [price, setPrice] = useState("")
<<<<<<< HEAD
  const [customizationAmount, setCustomizationAmount] = useState("")
=======
>>>>>>> 4a62e5fcd37b589bc3e624e537b2d3fd2921173c
  const [rejectionNotes, setRejectionNotes] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleApprove = async () => {
    if (!price || parseFloat(price) <= 0) {
      toast({
        title: "Price Required",
        description: "Please enter a valid price before approving",
        variant: "destructive",
      })
      return
    }

    setIsApproving(true)
    try {
<<<<<<< HEAD
      const result = await approveProduct(
        productId,
        parseFloat(price),
        undefined,
        customizationAmount ? parseFloat(customizationAmount) : undefined
      )
      if (result.success) {
        toast({
          title: "Product Approved",
          description: "The product has been approved successfully. User will be notified.",
        })
        setApproveOpen(false)
        setPrice("")
        setCustomizationAmount("")
=======
      const result = await approveProduct(productId, parseFloat(price))
      if (result.success) {
        toast({
          title: "Product Approved",
          description: "The product has been approved successfully",
        })
        setApproveOpen(false)
        setPrice("")
>>>>>>> 4a62e5fcd37b589bc3e624e537b2d3fd2921173c
        onUpdate?.()
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to approve product",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsApproving(false)
    }
  }

  const handleReject = async () => {
    if (!rejectionNotes.trim()) {
      toast({
        title: "Notes Required",
        description: "Please provide rejection notes",
        variant: "destructive",
      })
      return
    }

    setIsRejecting(true)
    try {
      const result = await rejectProduct(productId, rejectionNotes)
      if (result.success) {
        toast({
          title: "Product Rejected",
          description: "The product has been rejected",
        })
        setRejectOpen(false)
        setRejectionNotes("")
        onUpdate?.()
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to reject product",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsRejecting(false)
    }
  }

  return (
    <>
<<<<<<< HEAD
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="bg-green-600 hover:bg-green-700 text-white border-2 border-green-600 hover:border-green-700 font-black uppercase text-xs sm:text-sm h-10 w-full sm:w-auto transition-colors"
=======
      <div className="flex gap-2">
        <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
>>>>>>> 4a62e5fcd37b589bc3e624e537b2d3fd2921173c
              disabled={currentStatus === "approved"}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Approve
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Approve Product</DialogTitle>
              <DialogDescription>Set the price and approve this product for sale</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">Enter the selling price for this product</p>
              </div>
<<<<<<< HEAD
              <div className="space-y-2">
                <Label htmlFor="customizationAmount">Customization Amount (₹)</Label>
                <Input
                  id="customizationAmount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={customizationAmount}
                  onChange={(e) => setCustomizationAmount(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Amount user needs to pay to customize this product to template design</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setApproveOpen(false)} className="h-10 font-black uppercase text-xs sm:text-sm border-2 border-black hover:bg-black hover:text-white">
                Cancel
              </Button>
              <Button onClick={handleApprove} disabled={isApproving || !price} className="h-10 bg-green-600 hover:bg-green-700 text-white border-2 border-green-600 hover:border-green-700 font-black uppercase text-xs sm:text-sm">
=======
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setApproveOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleApprove} disabled={isApproving || !price}>
>>>>>>> 4a62e5fcd37b589bc3e624e537b2d3fd2921173c
                {isApproving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Approve Product
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
          <DialogTrigger asChild>
            <Button
<<<<<<< HEAD
              variant="outline"
              className="bg-red-600 hover:bg-red-700 text-white border-2 border-red-600 hover:border-red-700 font-black uppercase text-xs sm:text-sm h-10 w-full sm:w-auto transition-colors"
=======
              size="sm"
              variant="destructive"
>>>>>>> 4a62e5fcd37b589bc3e624e537b2d3fd2921173c
              disabled={currentStatus === "rejected"}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Reject
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Product</DialogTitle>
              <DialogDescription>Provide a reason for rejecting this product</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="rejectionNotes">Rejection Notes *</Label>
                <Textarea
                  id="rejectionNotes"
                  placeholder="Explain why this product is being rejected..."
                  rows={4}
                  value={rejectionNotes}
                  onChange={(e) => setRejectionNotes(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">These notes will be visible to the customer</p>
              </div>
            </div>
            <DialogFooter>
<<<<<<< HEAD
              <Button variant="outline" onClick={() => setRejectOpen(false)} className="h-10 font-black uppercase text-xs sm:text-sm border-2 border-black hover:bg-black hover:text-white">
                Cancel
              </Button>
              <Button onClick={handleReject} disabled={isRejecting || !rejectionNotes.trim()} className="h-10 bg-red-600 hover:bg-red-700 text-white border-2 border-red-600 hover:border-red-700 font-black uppercase text-xs sm:text-sm">
=======
              <Button variant="outline" onClick={() => setRejectOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleReject} disabled={isRejecting || !rejectionNotes.trim()} variant="destructive">
>>>>>>> 4a62e5fcd37b589bc3e624e537b2d3fd2921173c
                {isRejecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Reject Product
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}





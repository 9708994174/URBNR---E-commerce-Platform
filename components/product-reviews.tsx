"use client"

import { useEffect, useMemo, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type Review = {
  id: string
  rating: number
  comment: string
  created_at: string
  user_id: string
  profiles?: {
    full_name?: string | null
  } | null
}

interface ProductReviewsProps {
  productId: string
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const { toast } = useToast()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const [userId, setUserId] = useState<string | null>(null)
  const [tableExists, setTableExists] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function load() {
      setLoading(true)
      try {
        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUserId(user?.id ?? null)

        // Try to load reviews
        const { data, error } = await supabase
          .from("product_reviews")
          .select(
            `
            id,
            rating,
            comment,
            created_at,
            user_id,
            profiles(full_name)
          `,
          )
          .eq("product_id", productId)
          .order("created_at", { ascending: false })

        if (error) {
          // Table doesn't exist or other error - just hide reviews quietly
          console.warn("Reviews not available:", error.code)
          setTableExists(false)
          setReviews([])
        } else {
          setReviews(data || [])
          setTableExists(true)
        }
      } catch (err) {
        console.warn("Reviews load error:", err)
        setTableExists(false)
        setReviews([])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [productId])

  const averageRating = useMemo(() => {
    if (!reviews.length) return null
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0)
    return (sum / reviews.length).toFixed(1)
  }, [reviews])

  const handleSubmit = async () => {
    if (!rating) {
      toast({
        title: "Rating missing",
        description: "Tap a star rating before submitting.",
        variant: "destructive",
      })
      return
    }

    if (!comment.trim()) {
      toast({
        title: "Comment required",
        description: "Add a short note about the product.",
        variant: "destructive",
      })
      return
    }

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.id) {
      toast({
        title: "Login required",
        description: "Please sign in to add a review.",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    try {
      const { data, error } = await supabase
        .from("product_reviews")
        .insert({
          user_id: user.id,
          product_id: productId,
          rating,
          comment: comment.trim(),
        })
        .select(
          `
          id,
          rating,
          comment,
          created_at,
          user_id,
          profiles(full_name)
        `,
        )
        .single()

      if (error) throw error
      
      if (data) {
        setReviews((prev) => [data, ...prev])
        setRating(0)
        setHoverRating(0)
        setComment("")
        toast({ title: "Review submitted", description: "Thanks for your feedback!" })
      }
    } catch (err: any) {
      console.error("Review submit error:", err)
      toast({
        title: "Could not submit review",
        description: err?.message || "Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const renderStars = (value: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= value ? "text-amber-500 fill-amber-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    )
  }

  // If table doesn't exist, show a minimal placeholder
  if (!tableExists && !loading) {
    return (
      <Card className="border-black/5 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-black uppercase">Customer Reviews</CardTitle>
          <p className="text-sm text-muted-foreground">Reviews coming soon!</p>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="border-black/5 shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <CardTitle className="text-xl font-black uppercase">What customers say</CardTitle>
          <p className="text-sm text-muted-foreground">Real feedback from verified shoppers</p>
        </div>
        <div className="flex items-center gap-2">
          {averageRating ? (
            <>
              <span className="text-3xl font-black">{averageRating}</span>
              <div className="flex flex-col leading-tight">
                {renderStars(Math.round(Number(averageRating)))}
                <span className="text-xs text-muted-foreground">{reviews.length} reviews</span>
              </div>
            </>
          ) : (
            <span className="text-sm text-muted-foreground">No reviews yet</span>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="rounded-lg border border-dashed border-black/10 p-4 sm:p-5 bg-muted/40">
          <Label className="text-sm font-semibold mb-2 block">Add your review</Label>
          <div className="flex items-center gap-2 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="p-1"
                aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
              >
                <Star
                  className={`h-6 w-6 transition ${
                    star <= (hoverRating || rating) ? "text-amber-500 fill-amber-400" : "text-gray-300"
                  }`}
                />
              </button>
            ))}
            {rating > 0 && <span className="text-sm font-semibold text-black/80">{rating}/5</span>}
          </div>

          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share what you liked, fit notes, fabric feel, etc."
            rows={4}
            className="bg-white"
          />

          <div className="flex justify-end mt-3">
            <Button onClick={handleSubmit} disabled={submitting} className="font-bold uppercase">
              {submitting ? "Posting..." : "Submit review"}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {loading && <p className="text-sm text-muted-foreground">Loading reviews...</p>}
          {!loading && reviews.length === 0 && (
            <p className="text-sm text-muted-foreground">Be the first to review this product.</p>
          )}

          {reviews.map((review) => (
            <div key={review.id} className="border border-black/5 rounded-lg p-4 bg-white">
              <div className="flex items-center justify-between mb-1">
                <div className="font-semibold text-sm">
                  {review.profiles?.full_name || "Verified buyer"}
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
              {renderStars(review.rating)}
              <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{review.comment}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

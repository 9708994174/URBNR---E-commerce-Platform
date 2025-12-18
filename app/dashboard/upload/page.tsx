"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, X } from "lucide-react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"

export default function UploadProductPage() {
  const [productName, setProductName] = useState("")
  const [productType, setProductType] = useState("")
  const [description, setDescription] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  /* ---------------- IMAGE HANDLING ---------------- */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB")
      return
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid image file (JPG, PNG, WEBP, or GIF)")
      return
    }

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setError(null)
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)
    setError(null)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      let imageUrl: string | null = null

      if (imageFile) {
        const formData = new FormData()
        formData.append("file", imageFile)

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || "Failed to upload image")
        }

        const { url } = await res.json()
        imageUrl = url
      }

      const { error: insertError } = await supabase.from("products").insert({
        user_id: user.id,
        product_name: productName,
        product_type: productType,
        description,
        image_url: imageUrl,
        status: "pending",
      })

      if (insertError) throw insertError

      router.push("/dashboard/products")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload product")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <>
      <DashboardLayout>
        <div className="max-w-5xl mx-auto space-y-10">

          {/* HERO */}
          <div className="bg-black text-white px-8 py-10">
            <h1 className="text-4xl font-black uppercase tracking-tight">
              Upload Product
            </h1>
            <p className="text-white/70 mt-2 text-lg">
              Add a product to start customization and pricing
            </p>
          </div>

          {/* FORM CARD */}
          <div className="bg-white border border-black/20">
            <div className="border-b border-black/20 px-6 py-4">
              <h2 className="text-2xl font-black uppercase">
                Product Details
              </h2>
              <p className="text-black/60 mt-1">
                Tell us about the item you want to customize
              </p>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* NAME */}
                <div>
                  <Label className="text-xs font-black uppercase tracking-widest">
                    Product Name
                  </Label>
                  <Input
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                    placeholder="White T-Shirt, Running Shoes"
                    className="h-11 border border-black/30 focus-visible:ring-0 focus:border-black"
                  />
                </div>

                {/* TYPE */}
                <div>
                  <Label className="text-xs font-black uppercase tracking-widest">
                    Product Type
                  </Label>
                  <Select value={productType} onValueChange={setProductType} required>
                    <SelectTrigger className="h-11 border border-black/30 focus:ring-0">
                      <SelectValue placeholder="Select product type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tshirt">T-Shirt</SelectItem>
                      <SelectItem value="hoodie">Hoodie</SelectItem>
                      <SelectItem value="shoes">Shoes</SelectItem>
                      <SelectItem value="cap">Cap</SelectItem>
                      <SelectItem value="mug">Mug</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* DESCRIPTION */}
                <div>
                  <Label className="text-xs font-black uppercase tracking-widest">
                    Description (optional)
                  </Label>
                  <Textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Any additional details…"
                    className="border border-black/30 resize-none focus-visible:ring-0"
                  />
                </div>

                {/* IMAGE */}
                <div>
                  <Label className="text-xs font-black uppercase tracking-widest">
                    Product Image
                  </Label>

                  {!imagePreview ? (
                    <label className="mt-2 flex flex-col items-center justify-center border border-dashed border-black/40 py-12 cursor-pointer hover:border-black transition">
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      <Upload className="h-12 w-12 text-black/40 mb-3" />
                      <p className="font-black uppercase text-sm">
                        Upload Image
                      </p>
                      <p className="text-xs text-black/50">
                        JPG, PNG, WEBP • Max 5MB
                      </p>
                    </label>
                  ) : (
                    <div className="relative border border-black/20 p-4 mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-64 object-contain"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-4 right-4 bg-black text-white p-2 hover:bg-black/80"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* ERROR */}
                {error && (
                  <div className="border border-red-600 text-red-600 px-4 py-3 text-sm font-bold">
                    {error}
                  </div>
                )}

                {/* ACTIONS */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={isUploading}
                    className="flex-1 h-11 bg-black text-white hover:bg-black/90 font-black uppercase"
                  >
                    {isUploading ? "Uploading…" : "Upload Product"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/dashboard")}
                    className="h-11 border border-black font-black uppercase hover:bg-black hover:text-white"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </DashboardLayout>

      {/* ✅ FOOTER ADDED */}
      <Footer />
    </>
  )
}

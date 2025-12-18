"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Type, ImageIcon, Palette, Sparkles, Upload, ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { AuthModal } from "@/components/auth-modal"
import Link from "next/link"

export function CustomizeBuilder() {
  const [productType, setProductType] = useState<string>("")
  const [designType, setDesignType] = useState<string>("text")
  const [textContent, setTextContent] = useState("Your Text Here")
  const [fontSize, setFontSize] = useState([32])
  const [textColor, setTextColor] = useState("#000000")
  const [bgColor, setBgColor] = useState("#FFFFFF")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [productName, setProductName] = useState("")
  const [description, setDescription] = useState("")
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const productTypes = [
    { value: "tshirt", label: "T-Shirt", price: 699 },
    { value: "shirt", label: "Shirt", price: 1299 },
    { value: "hoodie", label: "Hoodie", price: 1999 },
    { value: "cap", label: "Cap", price: 499 },
  ]

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setAuthModalOpen(true)
      return
    }

    setIsLoading(true)
    try {
      const designData = {
        type: designType,
        text: textContent,
        fontSize: fontSize[0],
        textColor,
        bgColor,
        image: uploadedImage,
      }

      // Create product
      const { data: product, error: productError } = await supabase
        .from("products")
        .insert({
          user_id: user.id,
          product_name: productName || `Custom ${productType}`,
          product_type: productType,
          description: description || "Custom designed product",
          status: "pending",
        })
        .select()
        .single()

      if (productError) throw productError

      // Create design
      const { data: design, error: designError } = await supabase
        .from("designs")
        .insert({
          name: `${productName || "Custom Design"}`,
          description: "Customer custom design",
          category: productType,
          is_prebuilt: false,
          created_by: user.id,
          design_data: designData,
        })
        .select()
        .single()

      if (designError) throw designError

      // Link design to product
      await supabase.from("product_designs").insert({
        product_id: product.id,
        design_id: design.id,
        is_custom: true,
        custom_design_data: designData,
      })

      router.push("/dashboard/products")
    } catch (error) {
      console.error("Error creating custom product:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const selectedProduct = productTypes.find((p) => p.value === productType)

  return (
    <>
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-6">
          <Link href="/shop" className="inline-flex items-center text-sm font-bold uppercase hover:text-accent">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Link>
        </div>

        <div className="text-center mb-10 md:mb-14">
          <h1 className="text-4xl md:text-5xl font-black uppercase mb-3">Create Your Design</h1>
          <div className="h-1 w-24 bg-accent mx-auto mb-4" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Design your own custom products with our easy-to-use customization tool. Add text, upload images, and make
            it uniquely yours.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Design Controls */}
          <div className="space-y-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="uppercase flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Product Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="productType" className="font-bold uppercase text-sm">
                    Product Type
                  </Label>
                  <Select value={productType} onValueChange={setProductType} required>
                    <SelectTrigger id="productType">
                      <SelectValue placeholder="Select product type" />
                    </SelectTrigger>
                    <SelectContent>
                      {productTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label} - ₹{type.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productName" className="font-bold uppercase text-sm">
                    Product Name (Optional)
                  </Label>
                  <Input
                    id="productName"
                    placeholder="My Custom Design"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="font-bold uppercase text-sm">
                    Description (Optional)
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your design..."
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="uppercase">Design Elements</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={designType} onValueChange={setDesignType}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="text" className="uppercase font-bold">
                      <Type className="mr-2 h-4 w-4" />
                      Text
                    </TabsTrigger>
                    <TabsTrigger value="image" className="uppercase font-bold">
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Image
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="text" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="textContent" className="font-bold uppercase text-sm">
                        Your Text
                      </Label>
                      <Input
                        id="textContent"
                        placeholder="Enter your text"
                        value={textContent}
                        onChange={(e) => setTextContent(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="font-bold uppercase text-sm">Font Size: {fontSize[0]}px</Label>
                      <Slider min={16} max={72} step={1} value={fontSize} onValueChange={setFontSize} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="textColor" className="font-bold uppercase text-sm">
                          Text Color
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="textColor"
                            type="color"
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            className="w-14 h-10 p-1"
                          />
                          <Input
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            className="flex-1 font-mono text-sm"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bgColor" className="font-bold uppercase text-sm">
                          Background
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="bgColor"
                            type="color"
                            value={bgColor}
                            onChange={(e) => setBgColor(e.target.value)}
                            className="w-14 h-10 p-1"
                          />
                          <Input
                            value={bgColor}
                            onChange={(e) => setBgColor(e.target.value)}
                            className="flex-1 font-mono text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="image" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label className="font-bold uppercase text-sm">Upload Your Design</Label>
                      {!uploadedImage ? (
                        <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-accent transition-colors">
                          <input
                            type="file"
                            id="design-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                          <label htmlFor="design-upload" className="cursor-pointer">
                            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <p className="font-bold uppercase mb-2">Click to Upload Image</p>
                            <p className="text-sm text-muted-foreground">PNG, JPG up to 10MB</p>
                          </label>
                        </div>
                      ) : (
                        <div className="relative border-2 rounded-lg p-4 bg-muted">
                          <img
                            src={uploadedImage || "/placeholder.svg"}
                            alt="Uploaded design"
                            className="w-full h-48 object-contain mb-3"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => setUploadedImage(null)}
                            className="w-full font-bold uppercase"
                          >
                            Remove Image
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div className="space-y-6">
            <Card className="border-2 sticky top-24">
              <CardHeader>
                <CardTitle className="uppercase">Live Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="aspect-square rounded-lg flex items-center justify-center p-8 relative overflow-hidden"
                  style={{ backgroundColor: bgColor }}
                >
                  {designType === "text" && textContent ? (
                    <p
                      style={{
                        fontSize: `${fontSize[0]}px`,
                        color: textColor,
                      }}
                      className="font-black text-center break-words max-w-full"
                    >
                      {textContent}
                    </p>
                  ) : designType === "image" && uploadedImage ? (
                    <img
                      src={uploadedImage || "/placeholder.svg"}
                      alt="Design preview"
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="text-center">
                      <Sparkles className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground font-bold uppercase">Your design will appear here</p>
                    </div>
                  )}
                </div>

                {selectedProduct && (
                  <div className="mt-6 p-4 bg-secondary rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold uppercase">Product</span>
                      <span className="text-muted-foreground">{selectedProduct.label}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold uppercase">Base Price</span>
                      <span className="text-muted-foreground">₹{selectedProduct.price}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold uppercase">Customization</span>
                      <span className="text-muted-foreground">₹299</span>
                    </div>
                    <div className="border-t pt-3 mt-3 flex justify-between items-center">
                      <span className="font-black uppercase text-lg">Total</span>
                      <span className="font-black text-2xl">₹{selectedProduct.price + 299}</span>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleSubmit}
                  disabled={isLoading || !productType || (!textContent && !uploadedImage)}
                  className="w-full mt-6 h-14 font-bold uppercase"
                  size="lg"
                >
                  {isLoading ? "Creating..." : "Submit Design for Review"}
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Our team will review your design and contact you within 24 hours with production details and timeline.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} onSuccess={handleSubmit} />
    </>
  )
}

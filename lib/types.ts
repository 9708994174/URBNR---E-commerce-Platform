export interface Product {
  id: string
  name: string
  description: string | null
  category: "tshirt" | "shirt" | "jeans" | "trousers" | "shoes" | "winterwear"
  price: number
  stock_quantity: number
  image_url: string | null
  sizes: string[] | null
  colors: string[] | null
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  size: string | null
  color: string | null
  created_at: string
  updated_at: string
  product?: Product
}

export interface WishlistItem {
  id: string
  user_id: string
  product_id: string
  created_at: string
  product?: Product
}

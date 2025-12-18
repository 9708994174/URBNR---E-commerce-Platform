"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import { ShopHeader } from "@/components/shop-header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Package, Heart, Settings, LogOut, Loader2, Sparkles, ShieldCheck } from "lucide-react"
import { getProfile, updateProfile, getOrders } from "@/lib/actions/profile-actions"
import { signOut } from "@/lib/actions/auth-actions"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function AccountPage() {
  const [profile, setProfile] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
  })
  const router = useRouter()
  const { toast } = useToast()

  const stats = useMemo(() => {
    const orderCount = orders.length
    const paidOrders = orders.filter((o) => o.payment_status === "paid").length
    return [
      { label: "Orders", value: orderCount.toString() },
      { label: "Paid", value: paidOrders.toString() },
      { label: "Wishlist", value: "—", href: "/wishlist" },
    ]
  }, [orders])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const profileResult = await getProfile()
    const ordersResult = await getOrders()

    if (profileResult.success && profileResult.profile) {
      setProfile(profileResult.profile)
      setFormData({
        full_name: profileResult.profile.full_name || "",
        phone: profileResult.profile.phone || "",
        address: profileResult.profile.address || "",
        city: profileResult.profile.city || "",
        state: profileResult.profile.state || "",
        zip_code: profileResult.profile.zip_code || "",
      })
    }

    if (ordersResult.success && ordersResult.orders) {
      setOrders(ordersResult.orders)
    }

    setLoading(false)
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const result = await updateProfile(formData)
    if (result.success) {
      toast({
        title: "Success!",
        description: result.message || "Profile updated successfully",
      })
      await loadData()
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to update profile",
        variant: "destructive",
      })
    }

    setSaving(false)
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full overflow-x-hidden">
        <ShopHeader />
        <div className="h-16"></div> {/* Spacer for fixed header */}
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
      <ShopHeader />
      <div className="h-16"></div> {/* Spacer for fixed header */}

      <main className="w-full px-4 md:px-10 lg:px-16 py-10 ml-2">
        {/* Hero */}
        <div className="bg-white border border-black/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black uppercase">Welcome back!</h1>
            <p className="text-sm md:text-base text-black/60 max-w-2xl">
              Manage your profile, track orders, and keep your details up to date. Quick access to wishlist and settings in one place.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/designs">
              <Button className="font-black uppercase h-11 px-5" variant="outline">
                Start Designing
              </Button>
            </Link>
            <Button variant="outline" onClick={handleSignOut} className="font-bold uppercase bg-transparent">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Stats + shortcuts */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          {stats.map((item) => (
            <Link key={item.label} href={item.href || "#"} className={!item.href ? "pointer-events-none" : ""}>
              <Card className="border border-black/10 hover:border-black transition">
                <CardContent className="p-4">
                  <p className="text-xs font-black uppercase text-black/50 mb-1">{item.label}</p>
                  <p className="text-2xl font-black">{item.value}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
          <Card className="border border-black/10">
            <CardContent className="p-4 flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-black" />
              <div>
                <p className="text-xs font-black uppercase text-black/50">Profile</p>
                <p className="font-bold">{formData.full_name || "Add your name"}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="profile" className="space-y-6 mt-10">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-auto lg:inline-grid bg-white border border-black/10">
            <TabsTrigger value="profile" className="uppercase font-bold">
              <User className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="orders" className="uppercase font-bold">
              <Package className="mr-2 h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="uppercase font-bold">
              <Heart className="mr-2 h-4 w-4" />
              Wishlist
            </TabsTrigger>
            <TabsTrigger value="settings" className="uppercase font-bold">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="border border-black/10">
              <CardHeader>
                <CardTitle className="uppercase font-black">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name</label>
                      <Input
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number</label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 9999999999"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input value={profile?.email || ""} disabled className="bg-gray-100" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Address</label>
                    <Input
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Street address"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">City</label>
                      <Input
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">State</label>
                      <Input
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">ZIP Code</label>
                      <Input
                        value={formData.zip_code}
                        onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                        placeholder="ZIP"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button type="submit" className="font-bold uppercase" disabled={saving}>
                      {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card className="border border-black/10">
              <CardHeader>
                <CardTitle className="uppercase font-black">Order History</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">No orders yet</p>
                    <Link href="/shop">
                      <Button className="mt-4 font-bold uppercase">Start Shopping</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4 flex gap-4">
                        <img
                          src={order.product?.image_url || "/placeholder.svg"}
                          alt={order.product?.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold">{order.product?.name}</h3>
                          <p className="text-sm text-gray-600">
                            Order #{order.order_number} • {order.size} • {order.color}
                          </p>
                          <p className="text-sm text-gray-600">
                            Qty: {order.quantity} • ₹{order.amount?.toFixed(2)}
                          </p>
                          <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full uppercase">
                            {order.payment_status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wishlist">
            <Card className="border border-black/10">
              <CardHeader>
                <CardTitle className="uppercase font-black">My Wishlist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium mb-4">View your saved items</p>
                  <Link href="/wishlist">
                    <Button className="font-bold uppercase">Go to Wishlist</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="border border-black/10">
              <CardHeader>
                <CardTitle className="uppercase font-black">Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-bold mb-2">Notifications</h3>
                  <p className="text-sm text-gray-600 mb-4">Manage your email and push notification preferences</p>
                  <Button variant="outline" className="font-bold uppercase bg-transparent">
                    Configure Notifications
                  </Button>
                </div>
                <div className="border-t pt-4">
                  <h3 className="font-bold mb-2 text-red-600">Danger Zone</h3>
                  <p className="text-sm text-gray-600 mb-4">Permanently delete your account and all associated data</p>
                  <Button variant="destructive" className="font-bold uppercase">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  )
}

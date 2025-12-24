"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

interface AdminRouteGuardProps {
  children: React.ReactNode
}

export function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    async function checkAdmin() {
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push("/auth/login")
          return
        }

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single()

        if (error) {
          console.error("Error checking admin status:", error)
          router.push("/dashboard")
          return
        }

        if (!profile || profile.role !== "admin") {
          console.warn("Admin access denied. User role:", profile?.role || "not found")
          router.push("/dashboard")
          return
        }

        setIsAdmin(true)
      } catch (error) {
        console.error("Admin check error:", error)
        router.push("/dashboard")
      } finally {
        setIsChecking(false)
      }
    }

    checkAdmin()
  }, [router])

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-black" />
          <p className="text-muted-foreground font-bold uppercase">Checking admin access...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null // Router will handle redirect
  }

  return <>{children}</>
}


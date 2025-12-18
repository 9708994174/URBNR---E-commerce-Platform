"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push("/shop")
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Brand Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black">
        <img
          src="/custom-sneakers-red-design.jpg"
          alt="Custom Sneakers"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          <h1 className="text-5xl font-black uppercase mb-4 tracking-tight">
            CREATE YOUR
            <br />
            CUSTOM STYLE
          </h1>
          <p className="text-xl font-medium">Design products that define you</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tight">Sign In</h2>
            <p className="text-neutral-600 mt-2 font-medium">Access your custom designs</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-bold uppercase tracking-wide">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 border-2 border-black focus-visible:ring-0 focus-visible:border-accent"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-bold uppercase tracking-wide">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 border-2 border-black focus-visible:ring-0 focus-visible:border-accent"
              />
            </div>
            {error && (
              <div className="bg-destructive/10 border-2 border-destructive p-3">
                <p className="text-sm font-bold text-destructive">{error}</p>
              </div>
            )}
            <Button
              type="submit"
              className="w-full h-14 bg-black hover:bg-neutral-800 text-white font-black uppercase tracking-wide text-base"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-neutral-600 font-medium">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="text-black font-black uppercase underline hover:text-accent">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    const supabase = createClient()

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback`,
          data: {
            full_name: fullName,
            role: "customer",
          },
        },
      })
      if (error) throw error
      router.push("/auth/verify-email")
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
          src="/custom-apparel-clothing.jpg"
          alt="Custom Apparel"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          <h1 className="text-5xl font-black uppercase mb-4 tracking-tight">
            JOIN THE
            <br />
            MOVEMENT
          </h1>
          <p className="text-xl font-medium">Start creating custom products today</p>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tight">Create Account</h2>
            <p className="text-neutral-600 mt-2 font-medium">Begin your custom design journey</p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-bold uppercase tracking-wide">
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-12 border-2 border-black focus-visible:ring-0 focus-visible:border-accent"
              />
            </div>
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
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-bold uppercase tracking-wide">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-neutral-600 font-medium">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-black font-black uppercase underline hover:text-accent">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useRouter } from "next/navigation"
import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, X, Mail, Phone } from "lucide-react"
import { signInWithPassword, signUp } from "@/lib/actions/auth-actions"
import { sendOTP, verifyOTP, resendOTP } from "@/lib/actions/phone-auth-actions"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AuthModal({ open, onOpenChange, onSuccess }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email")
  
  // Phone OTP states
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otpResendTimer, setOtpResendTimer] = useState(0)
  
  const router = useRouter()

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = isSignUp ? await signUp(email, password, fullName) : await signInWithPassword(email, password)

      if (result.success) {
        onOpenChange(false)
        onSuccess?.()
        router.refresh()
      } else {
        setError(result.error || "Authentication failed")
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await sendOTP(phone)
      if (result.success) {
        setOtpSent(true)
        setOtpResendTimer(60) // 60 seconds countdown
        
        // Start countdown timer
        const interval = setInterval(() => {
          setOtpResendTimer((prev) => {
            if (prev <= 1) {
              clearInterval(interval)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      } else {
        setError(result.error || "Failed to send OTP")
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await verifyOTP(phone, otp)
      if (result.success) {
        onOpenChange(false)
        onSuccess?.()
        router.refresh()
      } else {
        setError(result.error || "Invalid OTP")
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setIsLoading(true)
    setError(null)
    const result = await resendOTP(phone)
    if (result.success) {
      setOtpResendTimer(60)
      const interval = setInterval(() => {
        setOtpResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      setError(result.error || "Failed to resend OTP")
    }
    setIsLoading(false)
  }

  const resetForm = () => {
    setEmail("")
    setPassword("")
    setFullName("")
    setPhone("")
    setOtp("")
    setOtpSent(false)
    setOtpResendTimer(0)
    setError(null)
  }

  const switchAuthMethod = (method: "email" | "phone") => {
    setAuthMethod(method)
    resetForm()
  }

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open)
      if (!open) resetForm()
    }}>
      <DialogContent className="sm:max-w-[850px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Sign In or Create Account</DialogTitle>
        </DialogHeader>
        <button
          onClick={() => {
            onOpenChange(false)
            resetForm()
          }}
          className="absolute right-4 top-4 z-50 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
        >
          <X className="h-6 w-6 text-white md:text-black" />
        </button>

        <div className="grid md:grid-cols-[400px_1fr]">
          <div className="relative hidden md:block bg-black h-[600px]">
            <img src="/auth-lifestyle.jpg" alt="Fashion models" className="w-full h-full object-cover" />
          </div>

          <div className="p-8 md:p-12 bg-white">
            <div className="mb-8">
              <h2 className="text-3xl font-black uppercase mb-2 tracking-tight">
                {isSignUp ? "CREATE ACCOUNT" : "LOGIN OR SIGNUP"}
              </h2>
              <p className="text-sm text-gray-600">Unlock coupons, profile and much more</p>
            </div>

            {/* Auth Method Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-200">
              <button
                type="button"
                onClick={() => switchAuthMethod("email")}
                className={`flex items-center gap-2 px-4 py-2 font-bold uppercase text-sm transition ${
                  authMethod === "email"
                    ? "border-b-2 border-black text-black"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                <Mail className="h-4 w-4" />
                Email
              </button>
              <button
                type="button"
                onClick={() => switchAuthMethod("phone")}
                className={`flex items-center gap-2 px-4 py-2 font-bold uppercase text-sm transition ${
                  authMethod === "phone"
                    ? "border-b-2 border-black text-black"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                <Phone className="h-4 w-4" />
                Mobile
              </button>
            </div>

            {/* Email Auth Form */}
            {authMethod === "email" && (
              <form onSubmit={handleEmailAuth} className="space-y-6">
                {isSignUp && (
                  <Input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-14 text-lg border-gray-300 focus:border-black"
                    placeholder="Full Name"
                    required
                  />
                )}

                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 text-lg border-gray-300 focus:border-black"
                  placeholder="Email address"
                  required
                />

                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 text-lg border-gray-300 focus:border-black"
                  placeholder="Password"
                  required
                  minLength={6}
                />

                {error && <p className="text-sm text-red-600">{error}</p>}

                <Button
                  type="submit"
                  className="w-full h-14 bg-black hover:bg-gray-900 text-white font-black uppercase text-base tracking-wide"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                  {isSignUp ? "CREATE ACCOUNT" : "SIGN IN"}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(!isSignUp)
                      setError(null)
                    }}
                    className="text-sm underline hover:text-black transition-colors"
                  >
                    {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                  </button>
                </div>
              </form>
            )}

            {/* Phone OTP Auth Form */}
            {authMethod === "phone" && (
              <>
                {!otpSent ? (
                  <form onSubmit={handleSendOTP} className="space-y-6">
                    <div>
                      <Input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="h-14 text-lg border-gray-300 focus:border-black"
                        placeholder="+91 9876543210"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Enter your phone number with country code (e.g., +91 for India)
                      </p>
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <Button
                      type="submit"
                      className="w-full h-14 bg-black hover:bg-gray-900 text-white font-black uppercase text-base tracking-wide"
                      disabled={isLoading}
                    >
                      {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                      SEND OTP
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOTP} className="space-y-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-4">
                        OTP sent to {phone}
                      </p>
                      <Input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        className="h-14 text-lg border-gray-300 focus:border-black text-center text-2xl tracking-widest"
                        placeholder="000000"
                        maxLength={6}
                        required
                      />
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <Button
                      type="submit"
                      className="w-full h-14 bg-black hover:bg-gray-900 text-white font-black uppercase text-base tracking-wide"
                      disabled={isLoading || otp.length !== 6}
                    >
                      {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                      VERIFY OTP
                    </Button>

                    <div className="text-center space-y-2">
                      {otpResendTimer > 0 ? (
                        <p className="text-sm text-gray-500">
                          Resend OTP in {otpResendTimer}s
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendOTP}
                          className="text-sm underline hover:text-black transition-colors"
                          disabled={isLoading}
                        >
                          Resend OTP
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setOtpSent(false)
                          setOtp("")
                          setError(null)
                        }}
                        className="text-sm underline hover:text-black transition-colors block"
                      >
                        Change Phone Number
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}

            <div className="text-center text-xs text-gray-500 leading-relaxed mt-6">
              <p>By continuing, you agree to our</p>
              <p className="mt-1">
                <button type="button" className="underline hover:text-black">
                  Terms of Service
                </button>{" "}
                and{" "}
                <button type="button" className="underline hover:text-black">
                  Privacy Policy
                </button>
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

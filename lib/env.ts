export const env = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  },
} as const

// Validate environment variables on module load
if (typeof window === "undefined") {
  // Server-side validation
  if (!env.supabase.url || !env.supabase.anonKey) {
    console.warn("[v0] Supabase environment variables are not configured")
  }
}

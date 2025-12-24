import { createBrowserClient } from "@supabase/ssr"

let client: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[v0] Supabase env vars:", {
      url: supabaseUrl ? "set" : "missing",
      key: supabaseAnonKey ? "set" : "missing",
    })
    throw new Error(
      "Missing Supabase environment variables. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your environment.",
    )
  }

  if (client) {
    return client
  }

  client = createBrowserClient(supabaseUrl, supabaseAnonKey)
  return client
}

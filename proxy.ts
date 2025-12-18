import { updateSession } from "@/lib/supabase/proxy"

export async function proxy(request: Request) {
  return await updateSession(request)
}

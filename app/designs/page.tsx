import { createClient } from "@/lib/supabase/server"
import { DesignsPageClient } from "@/components/designs-page-client"

const PAGE_SIZE = 15

export default async function DesignsPage() {
  const supabase = await createClient()

  const { data: designs } = await supabase
    .from("designs")
    .select("*")
    .eq("is_prebuilt", true)
    .order("created_at", { ascending: false })
    .limit(PAGE_SIZE)

  return <DesignsPageClient initialDesigns={designs || []} />
}

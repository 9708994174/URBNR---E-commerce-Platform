import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertCircle } from "lucide-react"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-muted/30">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-2">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-bold">Authentication Error</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {params?.error ? (
              <p className="text-sm text-muted-foreground text-center">Error: {params.error}</p>
            ) : (
              <p className="text-sm text-muted-foreground text-center">
                An unexpected error occurred during authentication.
              </p>
            )}
            <Button asChild className="w-full">
              <Link href="/auth/login">Back to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

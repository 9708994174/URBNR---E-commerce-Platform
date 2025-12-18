import { put } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    console.log("[v0] Upload API called")

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      console.error("[v0] No file provided in request")
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    console.log("[v0] File details:", { name: file.name, size: file.size, type: file.type })

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      console.error("[v0] File too large:", file.size)
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 })
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
    if (!validTypes.includes(file.type)) {
      console.error("[v0] Invalid file type:", file.type)
      return NextResponse.json({ error: "Invalid file type. Please upload JPG, PNG, WEBP, or GIF" }, { status: 400 })
    }

    // Generate unique filename to avoid conflicts
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const fileExtension = file.name.split(".").pop()
    const uniqueFilename = `products/${timestamp}-${randomString}.${fileExtension}`

    console.log("[v0] Uploading to blob storage:", uniqueFilename)

    const blob = await put(uniqueFilename, file, {
      access: "public",
    })

    console.log("[v0] Upload successful:", blob.url)

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error("[v0] Upload failed:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed" }, { status: 500 })
  }
}

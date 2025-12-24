import { put } from "@vercel/blob"
import { NextResponse } from "next/server"

<<<<<<< HEAD
export async function POST(request: Request): Promise<NextResponse> {
  try {
    console.log("[v0] Upload API called")

    // Get filename from query params (as per Vercel Blob documentation)
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get("filename")

    if (!filename) {
      console.error("[v0] No filename provided in query params")
      return NextResponse.json({ error: "Filename is required in query params" }, { status: 400 })
    }

    // Validate file type from filename extension
    const fileExtension = filename.split(".").pop()?.toLowerCase()
    const validExtensions = ["jpg", "jpeg", "png", "webp", "gif"]
    if (!fileExtension || !validExtensions.includes(fileExtension)) {
      console.error("[v0] Invalid file extension:", fileExtension)
=======
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
>>>>>>> 4a62e5fcd37b589bc3e624e537b2d3fd2921173c
      return NextResponse.json({ error: "Invalid file type. Please upload JPG, PNG, WEBP, or GIF" }, { status: 400 })
    }

    // Generate unique filename to avoid conflicts
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
<<<<<<< HEAD
=======
    const fileExtension = file.name.split(".").pop()
>>>>>>> 4a62e5fcd37b589bc3e624e537b2d3fd2921173c
    const uniqueFilename = `products/${timestamp}-${randomString}.${fileExtension}`

    console.log("[v0] Uploading to blob storage:", uniqueFilename)

<<<<<<< HEAD
    // For App Router Route Handlers, pass request.body directly (as per Vercel Blob docs)
    // request.body is a ReadableStream of the file
    const blob = await put(uniqueFilename, request.body, {
=======
    const blob = await put(uniqueFilename, file, {
>>>>>>> 4a62e5fcd37b589bc3e624e537b2d3fd2921173c
      access: "public",
    })

    console.log("[v0] Upload successful:", blob.url)

<<<<<<< HEAD
    return NextResponse.json(blob)
=======
    return NextResponse.json({ url: blob.url })
>>>>>>> 4a62e5fcd37b589bc3e624e537b2d3fd2921173c
  } catch (error) {
    console.error("[v0] Upload failed:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed" }, { status: 500 })
  }
}

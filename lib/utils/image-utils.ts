/**
 * Validates if a URL is a valid image URL
 * Returns the URL if valid, or a placeholder if invalid
 */
export function validateImageUrl(url: string | null | undefined): string {
  if (!url) {
    return "/placeholder.svg"
  }

  // Check if URL contains invalid blob token pattern (vercel_blob_rw_...)
  // This indicates an invalid/stale blob URL that's just a token, not a full URL
  if (url.includes('vercel_blob_rw_') && !url.startsWith('http')) {
    console.warn('Invalid blob URL detected (token URL without http):', url)
    return "/placeholder.svg"
  }

  // If it's already a relative path or data URL, return as-is
  if (url.startsWith('/') || url.startsWith('data:')) {
    return url
  }

  // Check if it's a valid URL format
  try {
    const urlObj = new URL(url)
    
    // Check if it's a valid Vercel Blob storage URL
    // Format: https://*.public.blob.vercel-storage.com/...
    const isVercelBlob = 
      urlObj.hostname.includes('.public.blob.vercel-storage.com') ||
      urlObj.hostname.includes('blob.vercel-storage.com')
    
    // If it's a Vercel Blob URL but has no path (just domain), it's incomplete
    if (isVercelBlob && (!urlObj.pathname || urlObj.pathname === '/')) {
      console.warn('Incomplete blob URL (missing file path):', url)
      return "/placeholder.svg"
    }
    
    // Check if it's other valid image sources
    const isValidDomain = 
      isVercelBlob ||
      urlObj.hostname.includes('supabase') ||
      urlObj.hostname.includes('localhost') ||
      urlObj.hostname.includes('127.0.0.1') ||
      urlObj.protocol === 'data:'
    
    if (isValidDomain) {
      return url
    }
    
    // If it doesn't match known domains, it might be invalid
    console.warn('Unknown image domain:', urlObj.hostname)
    return "/placeholder.svg"
  } catch (e) {
    // Invalid URL format - might be just a token string or malformed URL
    // If it looks like it might be a valid domain without protocol, try adding https://
    if (url.includes('.public.blob.vercel-storage.com') || url.includes('blob.vercel-storage.com')) {
      // If it's just a domain without path, it's incomplete
      if (!url.includes('/') || url.split('/').length < 4) {
        console.warn('Incomplete blob URL (domain only):', url)
        return "/placeholder.svg"
      }
      
      try {
        const urlWithProtocol = url.startsWith('http') ? url : `https://${url}`
        const testUrl = new URL(urlWithProtocol)
        // Check if it has a proper path
        if (!testUrl.pathname || testUrl.pathname === '/') {
          console.warn('Incomplete blob URL (no file path):', url)
          return "/placeholder.svg"
        }
        return urlWithProtocol
      } catch {
        console.warn('Invalid blob URL format:', url)
        return "/placeholder.svg"
      }
    }
    
    console.warn('Invalid image URL format:', url)
    return "/placeholder.svg"
  }
}

/**
 * Image error handler that sets src to placeholder
 */
export function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
  const target = e.target as HTMLImageElement
  if (target.src !== "/placeholder.svg") {
    target.src = "/placeholder.svg"
  }
}


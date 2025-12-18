"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { MapPin, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function LocationPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [locationData, setLocationData] = useState<{
    city?: string
    state?: string
    zipCode?: string
    address?: string
  } | null>(null)

  useEffect(() => {
    // Check if user has already granted location permission
    const locationPrompted = localStorage.getItem("locationPrompted")
    if (locationPrompted === "true") {
      return
    }

    // Show prompt after a short delay
    const timer = setTimeout(() => {
      setShowPrompt(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const getLocationAndAddress = async () => {
    setLoading(true)
    setError(null)

    try {
      // Get current location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        })
      })

      const { latitude, longitude } = position.coords

      // Get address from reverse geocoding
      let addressData = null

      try {
        // Try OpenCage Geocoding API first (free tier available)
        const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY || ""
        
        if (apiKey) {
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}&limit=1`
          )
          if (response.ok) {
            const data = await response.json()
            if (data.results && data.results.length > 0) {
              const result = data.results[0]
              const components = result.components
              addressData = {
                city: components.city || components.town || components.village || components.county || components.municipality || "",
                state: components.state || components.region || components.state_district || "",
                zipCode: components.postcode || components.postal_code || "",
                address: result.formatted || "",
              }
            }
          }
        }

        // Fallback: Use Nominatim (OpenStreetMap) - free, no API key needed
        if (!addressData) {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                'User-Agent': 'URBNR-Ecommerce-App'
              }
            }
          )
          
          if (response.ok) {
            const data = await response.json()
            if (data.address) {
              const addr = data.address
              addressData = {
                city: addr.city || addr.town || addr.village || addr.municipality || addr.county || "",
                state: addr.state || addr.region || addr.state_district || "",
                zipCode: addr.postcode || addr.postal_code || "",
                address: data.display_name || "",
              }
            }
          }
        }

        // Final fallback: Use coordinates if geocoding fails
        if (!addressData) {
          addressData = {
            city: "",
            state: "",
            zipCode: "",
            address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          }
        }

        setLocationData(addressData)

        // Update user profile if logged in
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user && addressData) {
          await supabase
            .from("profiles")
            .update({
              latitude: latitude,
              longitude: longitude,
              city: addressData.city,
              state: addressData.state,
              zip_code: addressData.zipCode,
              address: addressData.address,
              location_address: addressData.address,
              updated_at: new Date().toISOString(),
            })
            .eq("id", user.id)
        }

        // Mark as prompted
        localStorage.setItem("locationPrompted", "true")
        
        // Close prompt after a short delay
        setTimeout(() => {
          setShowPrompt(false)
        }, 2000)
      } catch (geocodeError) {
        console.error("Geocoding error:", geocodeError)
        setError("Failed to get address details. Location coordinates saved.")
        localStorage.setItem("locationPrompted", "true")
        setTimeout(() => {
          setShowPrompt(false)
        }, 3000)
      }
    } catch (err: any) {
      console.error("Location error:", err)
      let errorMessage = "Failed to get your location. You can update your address manually in your profile."
      
      if (err?.code === 1) {
        errorMessage = "Location access denied. You can update your address manually in your profile."
      } else if (err?.code === 2) {
        errorMessage = "Location unavailable. Please check your device settings."
      } else if (err?.code === 3) {
        errorMessage = "Location request timed out. Please try again."
      }
      
      setError(errorMessage)
      localStorage.setItem("locationPrompted", "true")
      setTimeout(() => {
        setShowPrompt(false)
      }, 3000)
    } finally {
      setLoading(false)
    }
  }

  const handleDeny = () => {
    localStorage.setItem("locationPrompted", "true")
    setShowPrompt(false)
  }

  if (!showPrompt) return null

  return (
    <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="sr-only">Enable Location</DialogTitle>
        </DialogHeader>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
            <MapPin className="h-6 w-6 text-white" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-black uppercase mb-2">Enable Location</h3>
            <p className="text-sm text-gray-600 mb-4">
              Allow us to access your location to automatically update your address (city, state, zip code) 
              for faster checkout and personalized experience.
            </p>

            {loading && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Getting your location...</span>
              </div>
            )}

            {error && (
              <p className="text-sm text-red-600 mb-4">{error}</p>
            )}

            {locationData && !error && (
              <div className="bg-green-50 border border-green-200 rounded p-3 mb-4">
                <p className="text-sm font-bold text-green-800 mb-1">Location Updated!</p>
                <p className="text-xs text-green-700">
                  {locationData.city && `City: ${locationData.city}`}
                  {locationData.state && ` | State: ${locationData.state}`}
                  {locationData.zipCode && ` | ZIP: ${locationData.zipCode}`}
                </p>
              </div>
            )}

            {!loading && !locationData && (
              <div className="flex gap-3">
                <Button
                  onClick={getLocationAndAddress}
                  className="flex-1 bg-black text-white font-black uppercase hover:bg-black/90"
                >
                  Allow Location
                </Button>
                <Button
                  onClick={handleDeny}
                  variant="outline"
                  className="flex-1 border-black font-black uppercase"
                >
                  Not Now
                </Button>
              </div>
            )}
          </div>

          {!loading && (
            <button
              onClick={handleDeny}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}


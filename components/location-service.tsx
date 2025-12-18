"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { MapPin, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LocationServiceProps {
  onLocationUpdate?: (location: { lat: number; lng: number; address?: string }) => void
}

export function LocationService({ onLocationUpdate }: LocationServiceProps) {
  const [location, setLocation] = useState<{ lat: number; lng: number; address?: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      return
    }

    // Check permission status
    if (navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        setPermissionGranted(result.state === "granted")
        if (result.state === "granted") {
          getCurrentLocation()
        }
      })
    }
  }, [])

  const getCurrentLocation = async () => {
    setLoading(true)
    setError(null)

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        })
      })

      const { latitude, longitude } = position.coords
      const locationData = { lat: latitude, lng: longitude }

      // Try to get address from reverse geocoding
      try {
        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${process.env.NEXT_PUBLIC_OPENCAGE_API_KEY || ""}`
        )
        if (response.ok) {
          const data = await response.json()
          if (data.results && data.results.length > 0) {
            locationData.address = data.results[0].formatted
          }
        }
      } catch (geocodeError) {
        console.log("Geocoding failed, using coordinates only")
      }

      setLocation(locationData)
      onLocationUpdate?.(locationData)

      // Save location to user profile if logged in
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase
          .from("profiles")
          .update({
            latitude: latitude,
            longitude: longitude,
            location_address: locationData.address,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id)
      }
    } catch (err: any) {
      setError(err.message || "Failed to get location")
      if (err.code === 1) {
        setError("Location access denied. Please enable location permissions.")
      }
    } finally {
      setLoading(false)
    }
  }

  const requestLocationPermission = async () => {
    try {
      await getCurrentLocation()
      setPermissionGranted(true)
    } catch (err: any) {
      setPermissionGranted(false)
      setError("Please enable location permissions in your browser settings")
    }
  }

  if (permissionGranted === false || error) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <MapPin className="h-4 w-4" />
        <Button
          variant="ghost"
          size="sm"
          onClick={requestLocationPermission}
          className="h-auto p-0 text-xs underline"
        >
          Enable Location
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-xs">Getting location...</span>
      </div>
    )
  }

  if (location) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <MapPin className="h-4 w-4 text-green-600" />
        <span className="text-xs">
          {location.address || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`}
        </span>
      </div>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={requestLocationPermission}
      className="h-auto p-1 text-xs"
    >
      <MapPin className="h-4 w-4 mr-1" />
      Get Location
    </Button>
  )
}



"use client"

import { useEffect, useState } from "react"
import { UrbnrLogo } from "@/components/urbnr-logo"

export function LogoIntro() {
  const [visible, setVisible] = useState(false)



  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-3 animate-logo-fade">
        <UrbnrLogo size={220} />
        <span className="text-white text-3xl font-black tracking-[0.2em]">URBNR</span>
      </div>
    </div>
  )
}

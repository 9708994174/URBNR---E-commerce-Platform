"use client"

import { useId } from "react"
import type { HTMLAttributes } from "react"

type UrbnrLogoProps = HTMLAttributes<SVGSVGElement> & {
  size?: number
}

// Clean, minimal URBNR mark: angular "A"–style monogram in a rounded diamond
export function UrbnrLogo({ size = 80, className, ...props }: UrbnrLogoProps) {
  const gradId = useId()
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="URBNR logo"
      {...props}
    >
      <defs>
        <linearGradient id={gradId} x1="10" y1="8" x2="54" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6FE5FF" />
          <stop offset="0.5" stopColor="#46C4FF" />
          <stop offset="1" stopColor="#1B88F0" />
        </linearGradient>
      </defs>
      {/* Soft diamond container */}
      <rect
        x="8"
        y="8"
        width="48"
        height="48"
        rx="14"
        transform="rotate(-15 8 8)"
        fill="#020617"
        stroke="rgba(148, 163, 184, 0.35)"
      />
      {/* Stylized URBNR "A"/arrow monogram */}
      <path
        d="M22 42L30 20c.6-1.7 1.3-2.4 2.7-2.4h1.6c1.4 0 2.1.7 2.7 2.4L44 42h-5.4l-3.4-10.6L32 42h-4.8l3.6-10.7L27 42H22Z"
        fill={`url(#${gradId})`}
      />
    </svg>
  )
}



"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

type HeroSection = {
  title: string
  subtitle?: string
  link: string
  images: string[]
}

export function HeroCarousel({ section }: { section: HeroSection }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % section.images.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [section.images.length])

  return (
    <Link href={section.link} className="relative aspect-[3/4] overflow-hidden">
      <AnimatePresence>
        <motion.div
          key={index}
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-100%", opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={section.images[index]}
            alt={section.title}
            fill
            className="object-cover"
            priority
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />

      <div className="absolute bottom-0 p-8 text-white z-10">
        <h2 className="text-4xl font-black uppercase">{section.title}</h2>
        {section.subtitle && <p className="text-lg">{section.subtitle}</p>}
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 right-4 flex gap-2 z-10">
        {section.images.map((_, i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full ${
              i === index ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </Link>
  )
}

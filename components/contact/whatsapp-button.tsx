"use client"

import { useState } from "react"
import Image from "next/image"

export function WhatsAppButton() {
  const [isHovered, setIsHovered] = useState(false)

  const whatsappNumber = "+233208290628" // Replace with actual number
  const whatsappMessage = encodeURIComponent("Hi! I'm interested in learning more about Nandy's Villa Royal.")
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Chat with us on WhatsApp"
    >
      <div className="relative">
        {/* Tooltip */}
        {isHovered && (
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-foreground text-background text-sm font-medium rounded-lg whitespace-nowrap shadow-lg animate-in fade-in slide-in-from-bottom-2">
            Chat with us
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground" />
          </div>
        )}

        {/* Button */}
        <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110 overflow-hidden">
          <Image
            src="/images/whatsapp-logo.png"
            alt="WhatsApp"
            width={56}
            height={56}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Pulse Animation */}
        <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
      </div>
    </a>
  )
}

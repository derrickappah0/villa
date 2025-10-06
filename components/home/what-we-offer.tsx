"use client"

import type React from "react"
import { useState, useMemo, useCallback } from "react"
import Image from "next/image"

import { Home, Fence, Shield, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const offerings = [
  {
    icon: Home,
    title: "Blocked Structures",
    description: "Quality construction with modern architectural designs built to last generations.",
  },
  {
    icon: Fence,
    title: "Wooden Decking",
    description: "Beautiful outdoor spaces with premium wooden decking for relaxation and entertainment.",
  },
  {
    icon: Shield,
    title: "Secured Environment",
    description: "24/7 security with gated access, CCTV surveillance, and professional security personnel.",
  },
  {
    icon: Users,
    title: "Family Atmosphere",
    description: "A welcoming community designed for families to thrive, connect, and create memories.",
  },
]

export function WhatWeOffer() {
  const { ref, isVisible } = useScrollAnimation(0.2)
  const [isOpen, setIsOpen] = useState(false)
  const [activeTitle, setActiveTitle] = useState<string | null>(null)

  const imagesByTitle = useMemo(
    () => ({
      "Blocked Structures": [
        { src: "/uncompleted-building-3.jpeg", alt: "Two-storey blocked structure shell" },
        { src: "/uncompleted-building-5.jpeg", alt: "Row of units with roof trusses" },
        { src: "/uncompleted-building-10.jpeg", alt: "Completed shells along the street" },
      ],
      "Wooden Decking": [
        { src: "/wooden-decken.jpeg", alt: "Timber decking in progress" },
        { src: "/uncompleted-building-6.jpeg", alt: "Crew working around slab/deck area" },
      ],
      "Secured Environment": [
        { src: "/map.jpg", alt: "Estate location map" },
        { src: "/front-gate-main-view.jpeg", alt: "Main entrance gate" },
        { src: "/front-gate-side-view.jpeg", alt: "Gate side view" },
      ],
      "Family Atmosphere": [
        { src: "/uncompleted-building-4.jpeg", alt: "Terraced homes forming a community" },
        { src: "/uncompleted-building-2.jpeg", alt: "Row of homes fostering neighborhood feel" },
        { src: "/uncompleted-building-8.jpeg", alt: "Gatehouse and green frontage" },
      ],
    }),
    [],
  )

  const handleOpen = useCallback((title: string) => {
    setActiveTitle(title)
    setIsOpen(true)
  }, [])

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 text-balance">What We Offer</h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto text-pretty">
            Everything you need for comfortable, secure, and modern living in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {offerings.map((offering, index) => {
            const Icon = offering.icon
            return (
              <Card
                key={index}
                className={`border-border hover:shadow-lg hover:scale-105 transition-all duration-300 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 0.1}s` }}
                role="button"
                tabIndex={0}
                onClick={() => handleOpen(offering.title)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    handleOpen(offering.title)
                  }
                }}
              >
                <CardContent className="pt-4 pb-4 cursor-pointer">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{offering.title}</h3>
                    <p className="text-sm text-muted-foreground text-pretty">{offering.description}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-3xl p-0">
            <DialogHeader className="px-6 pt-6">
              <DialogTitle>{activeTitle}</DialogTitle>
              <DialogDescription>Browse related images</DialogDescription>
            </DialogHeader>
            <div className="px-2 pb-6">
              <Carousel className="w-full">
                <CarouselContent>
                  {(activeTitle && imagesByTitle[activeTitle] ? imagesByTitle[activeTitle] : [{ src: "/placeholder.jpg", alt: "Image" }]).map((img, i) => (
                    <CarouselItem key={i}>
                      <div className="relative w-full h-[60vh] overflow-hidden rounded-md">
                        <Image src={img.src || "/placeholder.svg"} alt={img.alt} fill className="object-cover" />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-3" />
                <CarouselNext className="-right-3" />
              </Carousel>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}

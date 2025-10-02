"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { MapPin, Waves, Navigation } from "lucide-react"
import Link from "next/link"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const locations = [
  { name: "Jenna Beach", distance: "5 minutes", icon: Waves },
  { name: "White Sand Beach", distance: "10 minutes", icon: Waves },
  { name: "Kasoa Town", distance: "15 minutes", icon: Navigation },
]

export function LocationAdvantage() {
  const { ref, isVisible } = useScrollAnimation(0.2)

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="py-16 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Map */}
          <div
            className={`relative h-[350px] lg:h-[450px] rounded-lg overflow-hidden shadow-xl transition-all duration-700 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            }`}
          >
            <img
              src="/map-showing-coastal-area-with-beach-locations-and-.jpg"
              alt="Location Map"
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          </div>

          {/* Content */}
          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            }`}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary-foreground mb-5 text-balance">
              Prime Coastal Location
            </h2>
            <p className="text-base text-secondary-foreground/80 mb-6 text-pretty">
              Strategically located near Ghana's most beautiful beaches while maintaining easy access to urban
              amenities.
            </p>

            <div className="space-y-3 mb-6">
              {locations.map((location, index) => {
                const Icon = location.icon
                return (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 bg-card rounded-lg hover:shadow-md hover:scale-105 transition-all duration-300 ${
                      isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                    }`}
                    style={{ transitionDelay: `${(index + 2) * 0.1}s` }}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-card-foreground text-sm">{location.name}</h3>
                      <p className="text-xs text-muted-foreground">{location.distance} drive</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <Button asChild size="lg" variant="outline" className="hover:scale-105 transition-transform bg-transparent">
              <Link href="/contact">
                <MapPin className="mr-2" size={20} />
                View Full Map
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

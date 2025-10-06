"use client"

import type React from "react"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function BuildForMeHero() {
  const { ref, isVisible } = useScrollAnimation(0.3)

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            }`}
          >
            <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-6 text-balance">
              Own Land?
              <br />
              <span className="text-primary">Let Us Build Your Dream</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 text-pretty">
              Already have a plot? Perfect. We'll transform it into the home you've always envisioned. From design to
              delivery, we handle everything while you watch your dream take shape.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 hover:scale-105 transition-all font-medium"
              >
                See How It Works
              </a>
              <a
                href="/book-appointment"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-border rounded-lg hover:bg-secondary hover:scale-105 transition-all font-medium"
              >
                Get a Quote
              </a>
            </div>
          </div>

          {/* Image Slider */}
          <div
            className={`relative h-[400px] lg:h-[500px] rounded-lg overflow-hidden shadow-xl transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            }`}
          >
            <img
              src="/worker-4.jpeg"
              alt="Workers building at first floor level"
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

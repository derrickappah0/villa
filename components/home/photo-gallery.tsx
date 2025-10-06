"use client"

import Image from "next/image"
import { useState } from "react"

const galleryImages = [
 
  {
    src: "/front-gate.jpg",
    alt: "Front Gate Entrance",
    title: "Estate Entrance",
    category: "Site",
    className: "col-span-2 row-span-1 md:col-span-3 md:row-span-2",
  },
  {
    src: "/front-gate-2.jpg",
    alt: "Front Gate Side View",
    title: "Gate View",
    category: "Site",
    className: "col-span-1 row-span-1 md:col-span-2 md:row-span-2",
  },
  {
    src: "/worker-1.jpg",
    alt: "Construction Team at Work",
    title: "Team at Work",
    category: "Construction",
    className: "col-span-1 row-span-1 md:col-span-1 md:row-span-1",
  },
  {
    src: "/worker-2.jpg",
    alt: "Masons Building",
    title: "Block Laying",
    category: "Construction",
    className: "col-span-1 row-span-1 md:col-span-1 md:row-span-1",
  },
  {
    src: "/worker-3.jpg",
    alt: "Site Work Progress",
    title: "Site Progress",
    category: "Construction",
    className: "col-span-1 row-span-1 md:col-span-2 md:row-span-1",
  },
  {
    src: "/worker-4.jpg",
    alt: "Construction Work Ongoing",
    title: "Ongoing Works",
    category: "Construction",
    className: "col-span-1 row-span-1 md:col-span-1 md:row-span-1",
  },
  
  {
    src: "/552410414_659883090506825_5991757821515039124_n (1).jpg",
    alt: "Site View",
    title: "Site View 1",
    category: "Site",
    className: "col-span-1 row-span-1 md:col-span-1 md:row-span-1",
  },
  {
    src: "/552685472_1103732058583512_7281198228635200131_n (1).jpg",
    alt: "Site View",
    title: "Site View 2",
    category: "Site",
    className: "col-span-1 row-span-1 md:col-span-1 md:row-span-1",
  },
  {
    src: "/uncompleted.png",
    alt: "Uncompleted Estate Entrance",
    title: "Entrance Works",
    category: "Construction",
    className: "col-span-2 row-span-1 md:col-span-3 md:row-span-2",
  },
]

export function PhotoGallery() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="py-20 md:py-32 bg-gallery">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mb-16 md:mb-24">
          <p className="text-sm md:text-base font-medium tracking-wider uppercase text-muted-foreground mb-4">
            Our Collection
          </p>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif mb-6 text-balance leading-tight">
            Experience Luxury Living
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl text-pretty leading-relaxed">
            Explore our curated collection of stunning villas, each designed to offer an unparalleled living experience
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 lg:gap-6 auto-rows-[180px] md:auto-rows-[200px] lg:auto-rows-[220px]">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-2xl group cursor-pointer ${image.className}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                fill
                className="object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-75"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

              <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                <div className="transform transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                  <p className="text-xs md:text-sm font-medium tracking-widest uppercase text-white/80 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {image.category}
                  </p>
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-serif text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150">
                    {image.title}
                  </h3>
                </div>
              </div>

              <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/20 rounded-2xl transition-all duration-500" />
            </div>
          ))}
        </div>

        <div className="text-center mt-16 md:mt-20">
          <button className="px-8 py-4 bg-foreground text-background font-medium rounded-full hover:bg-foreground/90 transition-all duration-300 hover:scale-105 hover:shadow-xl">
            View Full Portfolio
          </button>
        </div>
      </div>
    </section>
  )
}

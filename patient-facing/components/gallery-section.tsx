import Image from "next/image"
import Link from "next/link"
import { Instagram } from "lucide-react"

interface GalleryImageProps {
  src: string
  alt: string
  span?: string // e.g., "col-span-2 row-span-2"
}

function GalleryImage({ src, alt, span }: GalleryImageProps) {
  return (
    <div className={`relative w-full h-64 overflow-hidden rounded-xl shadow-md group ${span}`}>
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white text-lg font-semibold">
        {alt}
      </div>
    </div>
  )
}

export function GallerySection() {
  const galleryItems = [
    { src: "/placeholder.svg?key=before-after-1", alt: "Before/After Smile Transformation 1", span: "md:col-span-2" },
    { src: "/placeholder.svg?key=studio-ambiance-1", alt: "Modern Studio Ambiance" },
    { src: "/placeholder.svg?key=patient-selfie-1", alt: "Happy Patient Selfie" },
    { src: "/placeholder.svg?key=modern-equipment-1", alt: "Advanced Dental Equipment" },
    { src: "/placeholder.svg?key=before-after-2", alt: "Before/After Smile Transformation 2" },
    { src: "/placeholder.svg?key=studio-ambiance-2", alt: "Welcoming Studio Interior", span: "md:col-span-2" },
    { src: "/placeholder.svg?key=patient-selfie-2", alt: "Another Happy Patient" },
  ]

  return (
    <section id="gallery" className="w-full py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">Our Gallery</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Witness the transformations and explore our state-of-the-art dental wellness studio.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {galleryItems.map((item, index) => (
            <GalleryImage key={index} {...item} />
          ))}
          {/* Placeholder for video testimonial */}
          <div className="relative w-full h-64 overflow-hidden rounded-xl shadow-md bg-muted flex items-center justify-center">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=example" // Replace with actual video testimonial
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="absolute inset-0"
            ></iframe>
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white text-lg font-semibold">
              Video Testimonial
            </div>
          </div>
        </div>
        <div className="mt-12 text-center">
          <Link
            href="https://instagram.com/drpriyasharma"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#6366F1] to-[#F59E0B] px-8 py-3 text-lg font-semibold text-white shadow-lg hover:from-[#5a5ee0] hover:to-[#e08d0a] transition-all duration-300"
          >
            <Instagram className="h-6 w-6 mr-2" /> Follow us on Instagram
          </Link>
        </div>
      </div>
    </section>
  )
}

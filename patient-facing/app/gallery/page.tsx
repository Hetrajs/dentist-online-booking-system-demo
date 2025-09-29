import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Instagram, Camera, Star, Users } from "lucide-react"

interface GalleryImageProps {
  src: string
  alt: string
  category: string
  span?: string
}

function GalleryImage({ src, alt, category, span }: GalleryImageProps) {
  return (
    <div className={`relative w-full h-80 overflow-hidden rounded-xl shadow-lg group ${span}`}>
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="text-sm font-medium text-primary-foreground/80">{category}</p>
        <p className="text-lg font-semibold">{alt}</p>
      </div>
    </div>
  )
}

export default function GalleryPage() {
  const categories = [
    { name: "All", count: 24 },
    { name: "Before & After", count: 8 },
    { name: "Studio", count: 6 },
    { name: "Treatments", count: 5 },
    { name: "Happy Patients", count: 5 },
  ]

  const galleryItems = [
    { src: "/before-after-smile-transformation-1.jpg", alt: "Complete Smile Makeover", category: "Before & After", span: "md:col-span-2" },
    { src: "/modern-dental-studio-interior.jpg", alt: "Modern Studio Interior", category: "Studio" },
    { src: "/patient-selfie-1.jpg", alt: "Happy Patient After Treatment", category: "Happy Patients" },
    { src: "/professional-getting-quick-dental-clean.jpg", alt: "Professional Cleaning Session", category: "Treatments" },
    { src: "/before-after-smile-transformation-2.jpg", alt: "Teeth Whitening Results", category: "Before & After" },
    { src: "/studio-ambiance-1.jpg", alt: "Relaxing Treatment Room", category: "Studio", span: "md:col-span-2" },
    { src: "/professional-wearing-clear-aligners.jpg", alt: "Clear Aligners Treatment", category: "Treatments" },
    { src: "/patient-selfie-2.jpg", alt: "Confident New Smile", category: "Happy Patients" },
    { src: "/modern-equipment-1.jpg", alt: "Advanced Dental Equipment", category: "Studio" },
    { src: "/before-after-smile-transformation.jpg", alt: "Dramatic Transformation", category: "Before & After", span: "md:col-span-2" },
    { src: "/studio-ambiance-2.jpg", alt: "Welcoming Reception Area", category: "Studio" },
    { src: "/dramatic-smile-transformation.jpg", alt: "Life-Changing Results", category: "Before & After" },
  ]

  const stats = [
    { icon: Camera, title: "500+", subtitle: "Photos Captured" },
    { icon: Star, title: "1000+", subtitle: "Transformations" },
    { icon: Users, title: "10,000+", subtitle: "Happy Smiles" },
    { icon: Instagram, title: "50K+", subtitle: "Social Followers" },
  ]

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="w-full py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-foreground mb-6 text-balance">
              Our Gallery
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Witness the incredible transformations and explore our state-of-the-art dental wellness studio.
              Every smile tells a story of confidence restored.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    index === 0
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'bg-card text-card-foreground hover:bg-primary/10 shadow-sm'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <stat.icon className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-2">{stat.title}</h3>
                <p className="text-muted-foreground">{stat.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="w-full py-16 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item, index) => (
              <GalleryImage key={index} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="w-full py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="mb-8">
            <Instagram className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h2 className="text-4xl font-bold text-foreground mb-4">Follow Our Journey</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Stay updated with our latest transformations, behind-the-scenes content, and dental tips on Instagram.
            </p>
          </div>
          <Button
            asChild
            className="rounded-2xl bg-gradient-to-r from-[#6366F1] to-[#F59E0B] px-8 py-6 text-lg font-semibold text-white shadow-lg hover:from-[#5a5ee0] hover:to-[#e08d0a] transition-all duration-300"
          >
            <Link href="https://instagram.com/drpriyasharma" target="_blank" rel="noopener noreferrer">
              Follow @drpriyasharma
            </Link>
          </Button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">Ready for Your Transformation?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of happy patients who have transformed their smiles with us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="rounded-2xl bg-gradient-to-r from-[#6366F1] to-[#F59E0B] px-8 py-6 text-lg font-semibold text-white shadow-lg hover:from-[#5a5ee0] hover:to-[#e08d0a] transition-all duration-300"
            >
              <Link href="/book">Book Your Consultation</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-2xl px-8 py-6 text-lg font-semibold border-2 hover:bg-primary/5 transition-all duration-300"
            >
              <Link href="/services">View Our Services</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}

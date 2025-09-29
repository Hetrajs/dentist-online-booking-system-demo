import { HeroSection } from "@/components/hero-section"
import { ServiceCard } from "@/components/service-card"
import { WhyChooseUsSection } from "@/components/why-choose-us-section"
import { TestimonialCard } from "@/components/testimonial-card"
import { AboutDrPriyaSection } from "@/components/about-dr-priya-section"
import { GallerySection } from "@/components/gallery-section"
import { ContactLocationSection } from "@/components/contact-location-section" // Import ContactLocationSection
import { NewsletterSignup } from "@/components/newsletter-signup"
import Link from "next/link"

export default function Home() {
  const services = [
    {
      title: "✨ The Signature Glow",
      price: 2999,
      duration: "60 minutes",
      benefit: "Instagram-ready smile in one session",
      image: "/placeholder.svg?key=hizoh",
      popular: true,
    },
    {
      title: "⚡ Express Refresh",
      price: 899,
      duration: "20 minutes",
      benefit: "Lunch-break dental refresh",
      image: "/placeholder.svg?key=z81ue",
    },
    {
      title: "💎 Complete Smile Makeover",
      price: 15999,
      duration: "2 sessions",
      benefit: "Red-carpet ready transformation",
      image: "/placeholder.svg?key=rxpd7",
    },
    {
      title: "🦷 Clear Aligners (Premium)",
      price: 85000,
      duration: "6-12 months",
      benefit: "Invisible braces for professionals",
      image: "/placeholder.svg?key=77awx",
    },
  ]

  const testimonials = [
    {
      quote:
        "Dr. Priya made my root canal completely painless! The studio feels like a spa, not a clinic. 100% recommended! 🌟",
      name: "Rahul Sharma",
      title: "Software Engineer, Gurgaon",
      avatar: "/placeholder.svg?key=rahul-sharma",
      rating: 5,
    },
    {
      quote: "Got my dream smile for my wedding! The team is amazing and the results are Instagram-perfect ✨",
      name: "Ananya Patel",
      title: "Marketing Manager, Delhi",
      avatar: "/placeholder.svg?key=ananya-patel",
      rating: 5,
    },
    {
      quote: "Finally found a dentist who understands working professionals. Evening appointments and quick service!",
      name: "Vikash Kumar",
      title: "Consultant, Noida",
      avatar: "/placeholder.svg?key=vikash-kumar",
      rating: 4,
    },
  ]

  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />

      <section id="services" className="w-full py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">Featured Experiences</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our most popular dental wellness services designed for your modern lifestyle.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>
      </section>

      <WhyChooseUsSection />

      <section id="testimonials" className="w-full py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">Patient Stories</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hear what our happy patients have to say about their experience at Dr. Priya Sharma's Dental Wellness
              Studio.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="https://g.page/drpriyasharma/reviews"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#6366F1] to-[#F59E0B] px-8 py-3 text-lg font-semibold text-white shadow-lg hover:from-[#5a5ee0] hover:to-[#e08d0a] transition-all duration-300"
            >
              View More Reviews
            </Link>
          </div>
        </div>
      </section>

      <AboutDrPriyaSection />

      <GallerySection />

      {/* Newsletter Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-background to-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl mx-auto">
            <NewsletterSignup variant="inline" />
          </div>
        </div>
      </section>

      <ContactLocationSection />
    </main>
  )
}

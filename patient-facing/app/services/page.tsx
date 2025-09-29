import { ServiceCard } from "@/components/service-card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ServicesPage() {
  const allServices = [
    {
      title: "✨ The Signature Glow",
      price: 2999,
      duration: "60 minutes",
      benefit: "Instagram-ready smile in one session",
      image: "/placeholder.svg?key=signature-glow",
      popular: true,
    },
    {
      title: "⚡ Express Refresh",
      price: 899,
      duration: "20 minutes",
      benefit: "Lunch-break dental refresh",
      image: "/placeholder.svg?key=express-refresh",
    },
    {
      title: "💎 Complete Smile Makeover",
      price: 15999,
      duration: "2 sessions",
      benefit: "Red-carpet ready transformation",
      image: "/placeholder.svg?key=smile-makeover",
      popular: true,
    },
    {
      title: "🦷 Clear Aligners (Premium)",
      price: 85000,
      duration: "6-12 months",
      benefit: "Invisible braces for professionals",
      image: "/placeholder.svg?key=clear-aligners",
      popular: true,
    },
    {
      title: "🔧 Root Canal Treatment",
      price: 8999,
      duration: "90 minutes",
      benefit: "Pain-free treatment with Netflix",
      image: "/placeholder.svg?key=root-canal",
    },
    {
      title: "👑 Dental Crowns",
      price: 12999,
      duration: "2 sessions",
      benefit: "Natural-looking tooth restoration",
      image: "/placeholder.svg?key=dental-crowns",
    },
    {
      title: "🧽 Professional Cleaning",
      price: 1499,
      duration: "45 minutes",
      benefit: "Deep cleaning and plaque removal",
      image: "/placeholder.svg?key=cleaning",
    },
    {
      title: "🦷 Dental Implants",
      price: 25999,
      duration: "Multiple sessions",
      benefit: "Permanent tooth replacement solution",
      image: "/placeholder.svg?key=implants",
    },
  ]

  const categories = [
    { name: "Cosmetic Dentistry", count: 3 },
    { name: "General Treatment", count: 2 },
    { name: "Orthodontics", count: 1 },
    { name: "Restorative", count: 2 },
  ]

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="w-full py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-foreground mb-6 text-balance">
              Our Dental Services
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Comprehensive dental care designed for your modern lifestyle. From quick refreshes to complete smile makeovers.
            </p>
            <Button
              asChild
              className="rounded-2xl bg-gradient-to-r from-[#6366F1] to-[#F59E0B] px-8 py-6 text-lg font-semibold text-white shadow-lg hover:from-[#5a5ee0] hover:to-[#e08d0a] transition-all duration-300"
            >
              <Link href="/book">Book Your Appointment</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="w-full py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
            {allServices.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="w-full py-16 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Service Categories</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our specialized dental services organized by category
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div key={index} className="bg-card rounded-3xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300">
                <h3 className="text-xl font-semibold text-foreground mb-2">{category.name}</h3>
                <p className="text-muted-foreground">{category.count} Services</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">Ready to Transform Your Smile?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Book your consultation today and take the first step towards your perfect smile.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="rounded-2xl bg-gradient-to-r from-[#6366F1] to-[#F59E0B] px-8 py-6 text-lg font-semibold text-white shadow-lg hover:from-[#5a5ee0] hover:to-[#e08d0a] transition-all duration-300"
            >
              <Link href="/book">Book Appointment</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-2xl px-8 py-6 text-lg font-semibold border-2 hover:bg-primary/5 transition-all duration-300"
            >
              <Link href="/contact">Ask Questions</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}

import { BookingModal } from "@/components/booking-modal"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Star, Shield, Coffee, Wifi } from "lucide-react"
import Link from "next/link"


export default function BookPage() {
  const services = [
    {
      title: "✨ The Signature Glow",
      price: 2999,
      duration: "60 minutes",
      description: "Complete dental cleaning and whitening treatment for an Instagram-ready smile",
      popular: true,
    },
    {
      title: "⚡ Express Refresh",
      price: 899,
      duration: "20 minutes",
      description: "Quick dental cleaning and polish perfect for busy professionals",
    },
    {
      title: "💎 Complete Smile Makeover",
      price: 15999,
      duration: "2 sessions",
      description: "Comprehensive smile transformation with veneers and whitening",
      popular: true,
    },
    {
      title: "🦷 Clear Aligners (Premium)",
      price: 85000,
      duration: "6-12 months",
      description: "Invisible braces treatment for professionals who want discrete orthodontics",
    },
  ]

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
    "6:00 PM", "7:00 PM", "8:00 PM"
  ]

  const benefits = [
    { icon: Shield, title: "Safe & Hygienic", description: "ISO certified with highest safety standards" },
    { icon: Coffee, title: "Comfort Amenities", description: "Netflix, WiFi, and refreshments during treatment" },
    { icon: Clock, title: "Flexible Timing", description: "Extended hours including weekends" },
    { icon: Star, title: "Expert Care", description: "15+ years of experience with 10,000+ happy patients" },
  ]

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="w-full py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-foreground mb-6 text-balance">
              Book Your Appointment
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Ready to transform your smile? Schedule your visit with Dr. Priya Sharma today.
              Choose from our flexible appointment slots and premium services.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
              <span className="rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-foreground border">Same Day Appointments</span>
              <span className="rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-foreground border">Flexible Payment Options</span>
              <span className="rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-foreground border">Insurance Accepted</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Booking Section */}
      <section className="w-full py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-foreground mb-4">Quick Booking</h2>
              <p className="text-lg text-muted-foreground">
                Book your appointment in just a few clicks
              </p>
            </div>

            <div className="bg-card rounded-3xl p-8 shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Booking Form */}
                <div>
                  <h3 className="text-2xl font-semibold text-foreground mb-6">Select Your Service</h3>
                  <div className="space-y-4 mb-8">
                    {services.map((service, index) => (
                      <div key={index} className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:border-primary/50 ${service.popular ? 'border-primary/30 bg-primary/5' : 'border-border'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-foreground">{service.title}</h4>
                          {service.popular && (
                            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">Popular</span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-primary">₹{service.price.toLocaleString()}</span>
                          <span className="text-sm text-muted-foreground">{service.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <BookingModal />
                </div>

                {/* Booking Information */}
                <div>
                  <h3 className="text-2xl font-semibold text-foreground mb-6">Book Your Appointment</h3>
                  <div className="mb-6 p-6 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="h-5 w-5 text-primary" />
                      <span className="font-medium text-foreground">Easy Online Booking</span>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Select your preferred date and time from our available slots.
                      Our system automatically shows only available appointment times.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>Real-time availability</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>Instant confirmation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <span>Secure booking</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-2xl p-6">
                    <h4 className="font-semibold text-foreground mb-4">What to Expect</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Comprehensive consultation and examination</li>
                      <li>• Personalized treatment plan discussion</li>
                      <li>• Transparent pricing with no hidden costs</li>
                      <li>• Comfortable environment with amenities</li>
                      <li>• Follow-up care and support</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full py-16 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why Book With Us?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the difference of modern dental care designed for your comfort and convenience
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center bg-card rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <benefit.icon className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground text-balance">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="w-full py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold text-foreground mb-6">Need Emergency Care?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              For dental emergencies, call us immediately. We provide same-day emergency appointments for urgent dental issues.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                className="rounded-2xl bg-red-600 hover:bg-red-700 px-8 py-6 text-lg font-semibold text-white shadow-lg transition-all duration-300"
              >
                <Link href="tel:+911141234567">Emergency: +91-11-41234567</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-2xl px-8 py-6 text-lg font-semibold border-2 hover:bg-primary/5 transition-all duration-300"
              >
                <Link href="https://wa.me/919811234567" target="_blank" rel="noopener noreferrer">
                  WhatsApp: +91-9811234567
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

import Link from "next/link"
import { MapPin, Phone, Mail, Clock, MessageCircle, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ContactForm } from "@/components/contact-form"

export default function ContactPage() {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Address",
      details: "Shop 45, Ground Floor, Connaught Place, New Delhi - 110001",
      action: "Get Directions",
      link: "https://www.google.com/maps/dir/?api=1&destination=Dr.+Priya+Sharma's+Dental+Wellness+Studio,+Connaught+Place,+New+Delhi"
    },
    {
      icon: Phone,
      title: "Phone",
      details: "+91-11-41234567",
      action: "Call Now",
      link: "tel:+911141234567"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      details: "+91-9811234567",
      action: "Chat Now",
      link: "https://wa.me/919811234567"
    },
    {
      icon: Mail,
      title: "Email",
      details: "hello@drpriyasharma.com",
      action: "Send Email",
      link: "mailto:hello@drpriyasharma.com"
    },
  ]

  const timings = [
    { day: "Monday - Friday", time: "9:00 AM - 9:00 PM" },
    { day: "Saturday", time: "9:00 AM - 7:00 PM" },
    { day: "Sunday", time: "Closed" },
  ]

  const faqs = [
    {
      question: "Do you accept insurance?",
      answer: "Yes, we accept most major dental insurance plans. Please call us to verify your specific coverage."
    },
    {
      question: "Do you offer emergency appointments?",
      answer: "Yes, we provide emergency dental services. Call us immediately for urgent dental issues."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept cash, cards, UPI, and offer EMI options for expensive treatments."
    },
    {
      question: "How do I prepare for my first visit?",
      answer: "Bring your ID, insurance cards, and a list of current medications. Arrive 15 minutes early."
    },
  ]

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="w-full py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-foreground mb-6 text-balance">
              Contact Us
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Ready to transform your smile? Get in touch with us today. We're here to answer your questions
              and help you schedule your perfect appointment.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="w-full py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <div key={index} className="text-center bg-card rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <info.icon className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{info.title}</h3>
                <p className="text-muted-foreground mb-4 text-balance">{info.details}</p>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-2xl hover:bg-primary/5 transition-all duration-300"
                >
                  <Link href={info.link} target={info.link.startsWith('http') ? '_blank' : undefined} rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}>
                    {info.action}
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map and Contact Form */}
      <section className="w-full py-16 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Map */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Find Us</h2>
              <div className="relative h-[400px] w-full rounded-3xl overflow-hidden shadow-xl mb-6">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.0000000000005!2d77.21666666666667!3d28.633333333333333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM4JzAwLjAiTiA3N8KwMTMnMDAuMCJF!5e0!3m2!1sen!2sin!4v1678912345678!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <Button
                asChild
                className="w-full rounded-2xl bg-gradient-to-r from-[#6366F1] to-[#F59E0B] text-white font-semibold py-3 shadow-lg hover:from-[#5a5ee0] hover:to-[#e08d0a] transition-all duration-300"
              >
                <Link
                  href="https://www.google.com/maps/dir/?api=1&destination=Dr.+Priya+Sharma's+Dental+Wellness+Studio,+Connaught+Place,+New+Delhi"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Navigation className="h-5 w-5 mr-2" />
                  Get Directions
                </Link>
              </Button>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Send us a Message</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Office Hours */}
      <section className="w-full py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <Clock className="h-16 w-16 mx-auto mb-4 text-primary" />
              <h2 className="text-4xl font-bold text-foreground mb-4">Office Hours</h2>
              <p className="text-lg text-muted-foreground">
                We're open extended hours to accommodate your busy schedule
              </p>
            </div>
            <div className="bg-card rounded-3xl p-8 shadow-lg">
              {timings.map((timing, index) => (
                <div key={index} className="flex justify-between items-center py-4 border-b border-border last:border-b-0">
                  <span className="text-lg font-medium text-foreground">{timing.day}</span>
                  <span className="text-lg text-muted-foreground">{timing.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-16 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Quick answers to common questions about our dental services
            </p>
          </div>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-card rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-foreground mb-3">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Don't wait to transform your smile. Book your consultation today and take the first step towards better oral health.
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
              <Link href="https://wa.me/919811234567" target="_blank" rel="noopener noreferrer">
                WhatsApp Us
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}

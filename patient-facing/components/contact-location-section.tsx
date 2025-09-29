import Link from "next/link"
import { MapPin, Phone, Mail, Clock, WheatIcon as Whatsapp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ContactForm } from "@/components/contact-form"

export function ContactLocationSection() {
  return (
    <section id="contact" className="w-full py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">Contact & Location</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Reach out to us or visit our studio in the heart of New Delhi.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Information */}
          <div>
            <h3 className="text-3xl font-bold text-foreground mb-6">Get in Touch</h3>
            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="text-lg font-semibold text-foreground">Address</p>
                  <p className="text-muted-foreground">Shop 45, Ground Floor, Connaught Place, New Delhi - 110001</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="text-lg font-semibold text-foreground">Phone</p>
                  <a href="tel:+911141234567" className="text-muted-foreground hover:text-primary transition-colors">
                    +91-11-41234567
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Whatsapp className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="text-lg font-semibold text-foreground">WhatsApp</p>
                  <a
                    href="https://wa.me/919811234567"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    +91-9811234567
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="text-lg font-semibold text-foreground">Email</p>
                  <a
                    href="mailto:hello@drpriyasharma.com"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    hello@drpriyasharma.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="text-lg font-semibold text-foreground">Timings</p>
                  <p className="text-muted-foreground">Mon-Sat: 9 AM - 9 PM | Sunday: Closed</p>
                </div>
              </div>
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
                Get Directions
              </Link>
            </Button>
          </div>

          {/* Google Map & Contact Form */}
          <div>
            <div className="relative h-[300px] w-full rounded-3xl overflow-hidden shadow-xl mb-8">
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
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}

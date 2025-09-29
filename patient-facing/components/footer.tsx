import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Instagram, Facebook, Star } from "lucide-react"
import { NewsletterSignup } from "@/components/newsletter-signup"

export function Footer() {
  return (
    <footer className="bg-card text-card-foreground border-t py-8 md:py-12">
      <div className="container grid grid-cols-1 gap-8 px-4 md:grid-cols-4 md:px-6 lg:grid-cols-5">
        <div className="col-span-full lg:col-span-2">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-foreground mb-4">
            Dr. Priya Sharma
          </Link>
          <p className="text-muted-foreground text-sm mb-4">
            Transform Your Smile. India's Premier Dental Wellness Studio in Connaught Place, New Delhi.
          </p>
          <div className="flex space-x-4">
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Instagram className="h-6 w-6" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Facebook className="h-6 w-6" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link
              href="https://g.page/drpriyasharma"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Star className="h-6 w-6" />
              <span className="sr-only">Google Reviews</span>
            </Link>
          </div>
        </div>

        <div className="col-span-1">
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <nav className="flex flex-col space-y-2 text-sm">
            <Link href="/services" className="text-muted-foreground hover:text-primary transition-colors">
              Services
            </Link>
            <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
              Contact
            </Link>
            <Link href="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
              Terms & Conditions
            </Link>
          </nav>
        </div>

        <div className="col-span-1">
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <address className="not-italic text-sm text-muted-foreground space-y-2">
            <p>Shop 45, Ground Floor,</p>
            <p>Connaught Place, New Delhi - 110001</p>
            <p>
              Phone:{" "}
              <a href="tel:+911141234567" className="hover:text-primary transition-colors">
                +91-11-41234567
              </a>
            </p>
            <p>
              Email:{" "}
              <a href="mailto:hello@drpriyasharma.com" className="hover:text-primary transition-colors">
                hello@drpriyasharma.com
              </a>
            </p>
          </address>
        </div>

        <div className="col-span-full md:col-span-2 lg:col-span-1">
          <NewsletterSignup variant="footer" />
        </div>
      </div>
      <div className="container mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
        <p>© 2025 Dr. Priya Sharma Dental Studio. All rights reserved.</p>
      </div>
    </footer>
  )
}

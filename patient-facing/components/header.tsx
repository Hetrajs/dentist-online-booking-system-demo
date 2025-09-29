"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

import { BookingModal } from "@/components/booking-modal" // Import BookingModal
import Image from "next/image"

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "About", href: "/about" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="w-full bg-background shadow-sm py-4 px-4 md:px-6 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/placeholder.svg?key=logo"
            alt="Dr. Priya Sharma's Dental Wellness Studio Logo"
            width={40}
            height={40}
          />
          <span className="text-xl md:text-2xl font-bold text-foreground">Dr. Priya Sharma</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-foreground hover:text-primary transition-colors text-lg font-medium"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/auth/login"
            className="text-foreground hover:text-primary transition-colors text-lg font-medium"
          >
            Login
          </Link>
          <BookingModal />
        </nav>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4 p-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/auth/login"
                className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Button
                asChild
                className="mt-4 rounded-2xl bg-gradient-to-r from-[#6366F1] to-[#F59E0B] text-white shadow-lg hover:from-[#5a5ee0] hover:to-[#e08d0a] transition-all duration-300"
                onClick={() => setIsOpen(false)}
              >
                <Link href="/book">Book Your Glow-Up ✨</Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

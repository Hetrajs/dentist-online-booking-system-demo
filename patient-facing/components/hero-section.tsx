import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <Image src="/modern-dental-studio-interior.jpg" alt="Modern Dental Studio" fill className="object-cover" priority />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white md:px-6">
        <h1 className="mb-4 text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Transform Your Smile <br />
          <span className="font-hindi text-3xl sm:text-4xl md:text-5xl lg:text-6xl">आपकी मुस्कान, नया अंदाज़</span>
        </h1>
        <p className="mb-8 max-w-3xl text-lg md:text-xl">India's Premier Dental Wellness Studio</p>
        <div className="mb-8 flex flex-wrap justify-center gap-4 text-sm md:text-base">
          <span className="rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">15+ Years Experience</span>
          <span className="rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">10,000+ Happy Patients</span>
          <span className="rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">Same Day Appointments</span>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            asChild
            className="rounded-2xl bg-gradient-to-r from-[#6366F1] to-[#F59E0B] px-8 py-6 text-lg font-semibold text-white shadow-lg hover:from-[#5a5ee0] hover:to-[#e08d0a] transition-all duration-300"
          >
            <Link href="/book">Book Your Transformation</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="rounded-2xl border-2 border-white bg-transparent px-8 py-6 text-lg font-semibold text-white shadow-lg hover:bg-white/20 transition-all duration-300"
          >
            <Link href="/gallery">View Gallery</Link>
          </Button>
        </div>
        <div className="mt-8 flex items-center gap-2 text-lg">
          <MapPin className="h-5 w-5" />
          <span>Connaught Place, Delhi</span>
        </div>
      </div>
    </section>
  )
}

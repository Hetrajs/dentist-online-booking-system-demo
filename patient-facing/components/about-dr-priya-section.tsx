import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GraduationCap, Briefcase, Star, Coffee } from "lucide-react"

export function AboutDrPriyaSection() {
  return (
    <section id="about-dr-priya" className="w-full py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative h-[400px] w-full rounded-3xl overflow-hidden shadow-xl">
            <Image
              src="/placeholder.svg?key=dr-priya-sharma-headshot"
              alt="Dr. Priya Sharma"
              fill
              className="object-cover object-top"
            />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-6 text-balance">Meet Dr. Priya Sharma</h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Dr. Priya Sharma is a highly accomplished and compassionate dental professional with a passion for
              transforming smiles. With over 15 years of experience, she is dedicated to providing personalized,
              pain-free dental care in a modern and welcoming environment.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <GraduationCap className="h-6 w-6 text-primary" />
                <p className="text-foreground text-lg">
                  <span className="font-semibold">Education:</span> BDS from Maulana Azad Institute, MDS from AIIMS
                  Delhi
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase className="h-6 w-6 text-primary" />
                <p className="text-foreground text-lg">
                  <span className="font-semibold">Experience:</span> 15+ Years transforming smiles across Delhi
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Star className="h-6 w-6 text-primary" />
                <p className="text-foreground text-lg">
                  <span className="font-semibold">Specializations:</span> Cosmetic Dentistry, Smile Design, Digital
                  Dentistry
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Coffee className="h-6 w-6 text-primary" />
                <p className="text-foreground text-lg">
                  <span className="font-semibold">Personal:</span> Fellow coffee lover and believer in pain-free
                  dentistry
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mb-8">
              <span className="inline-flex items-center rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-sm">
                ISO Certified
              </span>
              <span className="inline-flex items-center rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-sm">
                Digital Smile Design Expert
              </span>
              <span className="inline-flex items-center rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-sm">
                International Training
              </span>
            </div>
            <Button
              asChild
              className="rounded-2xl bg-gradient-to-r from-[#6366F1] to-[#F59E0B] px-8 py-6 text-lg font-semibold text-white shadow-lg hover:from-[#5a5ee0] hover:to-[#e08d0a] transition-all duration-300"
            >
              <Link href="/book">Book Consultation</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

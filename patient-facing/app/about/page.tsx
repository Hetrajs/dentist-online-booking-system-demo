import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GraduationCap, Briefcase, Star, Coffee, Award, Users, Clock, Heart } from "lucide-react"

export default function AboutPage() {
  const achievements = [
    { icon: Users, title: "10,000+", subtitle: "Happy Patients" },
    { icon: Clock, title: "15+", subtitle: "Years Experience" },
    { icon: Award, title: "50+", subtitle: "Awards & Recognition" },
    { icon: Heart, title: "99%", subtitle: "Patient Satisfaction" },
  ]

  const qualifications = [
    "BDS from Maulana Azad Institute of Dental Sciences, New Delhi",
    "MDS in Conservative Dentistry from AIIMS, New Delhi",
    "Fellowship in Cosmetic Dentistry from NYU, USA",
    "Certified Digital Smile Design Expert",
    "ISO 9001:2015 Certified Practice",
    "Member of Indian Dental Association (IDA)",
  ]

  const values = [
    {
      title: "Patient-Centric Care",
      description: "Every treatment plan is customized to your unique needs and lifestyle.",
      icon: Heart,
    },
    {
      title: "Modern Technology",
      description: "State-of-the-art equipment and latest techniques for optimal results.",
      icon: Star,
    },
    {
      title: "Comfort First",
      description: "Netflix, WiFi, and refreshments to make your visit as comfortable as possible.",
      icon: Coffee,
    },
    {
      title: "Transparent Pricing",
      description: "No hidden costs. Clear pricing with flexible payment options.",
      icon: Award,
    },
  ]

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="w-full py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-foreground mb-6 text-balance">
                Meet Dr. Priya Sharma
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                A passionate dental professional dedicated to transforming smiles and lives through
                personalized, pain-free dental care in a modern, welcoming environment.
              </p>
              <Button
                asChild
                className="rounded-2xl bg-gradient-to-r from-[#6366F1] to-[#F59E0B] px-8 py-6 text-lg font-semibold text-white shadow-lg hover:from-[#5a5ee0] hover:to-[#e08d0a] transition-all duration-300"
              >
                <Link href="/book">Book Consultation</Link>
              </Button>
            </div>
            <div className="relative h-[500px] w-full rounded-3xl overflow-hidden shadow-xl">
              <Image
                src="/placeholder.svg?key=dr-priya-sharma-about"
                alt="Dr. Priya Sharma"
                fill
                className="object-cover object-top"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="w-full py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <achievement.icon className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-2">{achievement.title}</h3>
                <p className="text-muted-foreground">{achievement.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Qualifications Section */}
      <section className="w-full py-16 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Education & Qualifications</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Extensive education and continuous learning to provide the best dental care
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {qualifications.map((qualification, index) => (
              <div key={index} className="flex items-center gap-4 bg-card rounded-2xl p-6 shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <p className="text-foreground font-medium">{qualification}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="w-full py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do at our dental wellness studio
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center bg-card rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <value.icon className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground text-balance">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Personal Story Section */}
      <section className="w-full py-16 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-foreground mb-8">My Journey</h2>
            <div className="prose prose-lg mx-auto text-muted-foreground">
              <p className="text-lg leading-relaxed mb-6">
                My passion for dentistry began during my childhood when I experienced the transformative
                power of a beautiful smile. After completing my dental education from prestigious institutions,
                I realized that modern dentistry should be about more than just treatment—it should be an experience.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                That's why I created this dental wellness studio in the heart of Connaught Place. Here,
                we combine cutting-edge technology with a spa-like atmosphere, ensuring that every visit
                is comfortable, efficient, and results in a smile you'll love to show off.
              </p>
              <p className="text-lg leading-relaxed">
                When I'm not transforming smiles, you'll find me exploring new coffee shops around Delhi,
                staying updated with the latest dental innovations, or planning my next international
                training program. I believe in continuous learning because my patients deserve nothing but the best.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">Ready to Start Your Smile Journey?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let's discuss your dental goals and create a personalized treatment plan just for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="rounded-2xl bg-gradient-to-r from-[#6366F1] to-[#F59E0B] px-8 py-6 text-lg font-semibold text-white shadow-lg hover:from-[#5a5ee0] hover:to-[#e08d0a] transition-all duration-300"
            >
              <Link href="/book">Book Consultation</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-2xl px-8 py-6 text-lg font-semibold border-2 hover:bg-primary/5 transition-all duration-300"
            >
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}

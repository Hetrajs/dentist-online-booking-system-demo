import type React from "react"
import { Hospital, CreditCard, Clock, Smartphone, User, Award } from "lucide-react"

interface BenefitCardProps {
  icon: React.ElementType
  title: string
  description: string
}

function BenefitCard({ icon: Icon, title, description }: BenefitCardProps) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-card rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-foreground">{title}</h3>
      <p className="text-muted-foreground text-balance">{description}</p>
    </div>
  )
}

export function WhyChooseUsSection() {
  const benefits = [
    {
      icon: Hospital,
      title: "Premium Studio Experience",
      description: "Netflix, WiFi, refreshments during treatment for a comfortable visit.",
    },
    {
      icon: CreditCard,
      title: "Flexible Payments",
      description: "UPI, Cards, EMI options, and Insurance accepted for your convenience.",
    },
    {
      icon: Clock,
      title: "Extended Hours",
      description: "Open till 9 PM with weekend appointments to fit your busy schedule.",
    },
    {
      icon: Smartphone,
      title: "Digital-First Approach",
      description: "Online booking, WhatsApp updates, and digital records for seamless experience.",
    },
    {
      icon: User,
      title: "Expert Female Doctor",
      description: "15+ years experience, international training, and a gentle touch.",
    },
    {
      icon: Award,
      title: "Instagram-Worthy Results",
      description: "Professional photography and social media ready smiles.",
    },
  ]

  return (
    <section id="why-choose-us" className="w-full py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">Why Choose Dr. Priya Sharma?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience modern dental care designed for your comfort and convenience.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {benefits.map((benefit, index) => (
            <BenefitCard key={index} {...benefit} />
          ))}
        </div>
      </div>
    </section>
  )
}

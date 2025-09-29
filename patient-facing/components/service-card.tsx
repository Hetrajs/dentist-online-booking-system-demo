import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface ServiceCardProps {
  title: string
  price: number
  duration: string
  benefit: string
  image: string
  popular?: boolean
}

export function ServiceCard({ title, price, duration, benefit, image, popular = false }: ServiceCardProps) {
  return (
    <div className="relative bg-card rounded-3xl shadow-xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300 group max-w-sm mx-auto w-full">
      {popular && (
        <div className="absolute top-3 left-3 bg-gradient-to-r from-[#6366F1] to-[#F59E0B] text-white px-3 py-1 rounded-full text-xs font-semibold z-10 shadow-lg">
          ⭐ Most Popular
        </div>
      )}
      <div className="aspect-[4/3] relative">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">{title}</h3>
        </div>
      </div>
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl md:text-3xl font-bold text-primary">₹{price.toLocaleString("en-IN")}</span>
          <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">{duration}</span>
        </div>
        <p className="text-foreground mb-4 text-sm md:text-base leading-relaxed">{benefit}</p>
        <Button
          asChild
          className="w-full rounded-2xl bg-gradient-to-r from-[#6366F1] to-[#F59E0B] text-white font-semibold py-3 text-sm md:text-base shadow-lg hover:from-[#5a5ee0] hover:to-[#e08d0a] transition-all duration-300"
        >
          <Link href="/book">Book Now</Link>
        </Button>
      </div>
    </div>
  )
}

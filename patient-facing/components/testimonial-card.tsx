import Image from "next/image"
import { Star } from "lucide-react"

interface TestimonialCardProps {
  quote: string
  name: string
  title: string
  avatar: string
  rating: number
}

export function TestimonialCard({ quote, name, title, avatar, rating }: TestimonialCardProps) {
  return (
    <div className="bg-card rounded-3xl shadow-lg p-6 flex flex-col items-center text-center">
      <div className="relative h-20 w-20 mb-4">
        <Image src={avatar || "/placeholder.svg"} alt={name} fill className="rounded-full object-cover" />
      </div>
      <div className="flex mb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${i < rating ? "text-[#F59E0B]" : "text-muted-foreground"}`}
            fill={i < rating ? "#F59E0B" : "none"}
          />
        ))}
      </div>
      <p className="text-foreground text-lg italic mb-4 text-balance">"{quote}"</p>
      <h3 className="text-xl font-semibold text-foreground">{name}</h3>
      <p className="text-muted-foreground text-sm">{title}</p>
    </div>
  )
}

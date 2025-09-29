import Link from "next/link"
import { WheatIcon as Whatsapp } from "lucide-react"

export function WhatsAppButton() {
  return (
    <Link
      href="https://wa.me/919811234567" // Replace with actual WhatsApp number
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#1DA851] transition-colors duration-300 z-50 flex items-center justify-center"
      aria-label="Chat with us on WhatsApp"
    >
      <Whatsapp className="h-8 w-8" />
    </Link>
  )
}

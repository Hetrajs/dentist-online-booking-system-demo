"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { HydrationSafeInput as Input } from "@/components/ui/hydration-safe-input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        setSubmitStatus('success')
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        })
      } else {
        setSubmitStatus('error')
        console.error('Form submission error:', result.message)
      }
    } catch (error) {
      setSubmitStatus('error')
      console.error('Network error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-card rounded-3xl shadow-lg">
      {submitStatus === 'success' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-2xl">
          <p className="text-green-800 font-medium">Thank you for your message! We will get back to you within 24 hours.</p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
          <p className="text-red-800 font-medium">Sorry, there was an error sending your message. Please try again or call us directly.</p>
        </div>
      )}

      <div>
        <Label htmlFor="name" className="text-foreground">
          Name *
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Your Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <Label htmlFor="email" className="text-foreground">
          Email *
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="your.email@example.com"
          value={formData.email}
          onChange={handleChange}
          required
          className="mt-1"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <Label htmlFor="phone" className="text-foreground">
          Phone
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+91-XXXXXXXXXX"
          value={formData.phone}
          onChange={handleChange}
          className="mt-1"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <Label htmlFor="subject" className="text-foreground">
          Subject *
        </Label>
        <Input
          id="subject"
          type="text"
          placeholder="What can we help you with?"
          value={formData.subject}
          onChange={handleChange}
          required
          className="mt-1"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <Label htmlFor="message" className="text-foreground">
          Message *
        </Label>
        <Textarea
          id="message"
          placeholder="Tell us more about your dental needs or questions..."
          value={formData.message}
          onChange={handleChange}
          required
          className="mt-1 min-h-[120px]"
          disabled={isSubmitting}
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-2xl bg-gradient-to-r from-[#6366F1] to-[#F59E0B] text-white font-semibold py-3 shadow-lg hover:from-[#5a5ee0] hover:to-[#e08d0a] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Sending...
          </>
        ) : (
          'Send Message'
        )}
      </Button>
    </form>
  )
}

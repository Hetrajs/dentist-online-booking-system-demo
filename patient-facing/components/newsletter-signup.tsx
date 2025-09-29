"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { HydrationSafeInput as Input } from "@/components/ui/hydration-safe-input"
import { Label } from "@/components/ui/label"
import { Mail, Loader2, CheckCircle } from "lucide-react"

interface NewsletterSignupProps {
  variant?: 'default' | 'footer' | 'inline'
  className?: string
}

export function NewsletterSignup({ variant = 'default', className = '' }: NewsletterSignupProps) {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')
    
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const result = await response.json()
      
      if (result.success) {
        setSubmitStatus('success')
        setFormData({ email: "", name: "" })
      } else {
        setSubmitStatus('error')
        setErrorMessage(result.message || 'Failed to subscribe to newsletter')
      }
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage('Network error. Please try again.')
      console.error('Newsletter subscription error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (variant === 'footer') {
    return (
      <div className={`${className}`}>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground mb-2">Stay Updated</h3>
          <p className="text-sm text-muted-foreground">
            Get dental tips, special offers, and appointment reminders.
          </p>
        </div>
        
        {submitStatus === 'success' ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Successfully subscribed! 🎉</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {submitStatus === 'error' && (
              <p className="text-sm text-red-600">{errorMessage}</p>
            )}
            
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="flex-1"
                disabled={isSubmitting}
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="h-4 w-4" />
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <div className={`bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 ${className}`}>
        <div className="text-center mb-4">
          <Mail className="h-12 w-12 mx-auto mb-3 text-primary" />
          <h3 className="text-xl font-semibold text-foreground mb-2">Stay in the Loop!</h3>
          <p className="text-muted-foreground">
            Get exclusive dental tips, special offers, and appointment reminders delivered to your inbox.
          </p>
        </div>
        
        {submitStatus === 'success' ? (
          <div className="text-center">
            <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-600" />
            <h4 className="text-lg font-semibold text-foreground mb-2">Welcome to our community! 🎉</h4>
            <p className="text-muted-foreground">
              Thank you for subscribing. You'll receive our next newsletter soon!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {submitStatus === 'error' && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{errorMessage}</p>
              </div>
            )}
            
            <div>
              <Label htmlFor="name" className="text-foreground">
                Name (Optional)
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1"
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <Label htmlFor="email" className="text-foreground">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1"
                disabled={isSubmitting}
              />
            </div>
            
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-gradient-to-r from-[#6366F1] to-[#F59E0B] text-white font-semibold py-3 shadow-lg hover:from-[#5a5ee0] hover:to-[#e08d0a] transition-all duration-300"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Subscribing...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Subscribe to Newsletter
                </>
              )}
            </Button>
            
            <p className="text-xs text-muted-foreground text-center">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </form>
        )}
      </div>
    )
  }

  // Default variant
  return (
    <div className={`bg-card rounded-3xl p-6 shadow-lg ${className}`}>
      <div className="text-center mb-6">
        <Mail className="h-12 w-12 mx-auto mb-3 text-primary" />
        <h3 className="text-2xl font-semibold text-foreground mb-2">Newsletter Signup</h3>
        <p className="text-muted-foreground">
          Stay updated with our latest dental tips and special offers.
        </p>
      </div>
      
      {submitStatus === 'success' ? (
        <div className="text-center">
          <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-600" />
          <h4 className="text-lg font-semibold text-foreground mb-2">Thank you for subscribing! 🎉</h4>
          <p className="text-muted-foreground">
            You'll receive our newsletter with dental tips and special offers.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {submitStatus === 'error' && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
              <p className="text-red-800 font-medium">{errorMessage}</p>
            </div>
          )}
          
          <div>
            <Label htmlFor="name" className="text-foreground">
              Name (Optional)
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1"
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <Label htmlFor="email" className="text-foreground">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1"
              disabled={isSubmitting}
            />
          </div>
          
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-gradient-to-r from-[#6366F1] to-[#F59E0B] text-white font-semibold py-3 shadow-lg hover:from-[#5a5ee0] hover:to-[#e08d0a] transition-all duration-300"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Subscribing...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                Subscribe Now
              </>
            )}
          </Button>
          
          <p className="text-xs text-muted-foreground text-center">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </form>
      )}
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AppointmentForm } from "@/components/appointment-form"

export function BookingModal() {
  const [open, setOpen] = useState(false)

  const handleSuccess = () => {
    // Close modal after successful booking
    setTimeout(() => {
      setOpen(false)
    }, 3000) // Give user time to read success message
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-2xl bg-gradient-to-r from-[#6366F1] to-[#F59E0B] px-6 py-3 text-lg font-semibold text-white shadow-lg hover:from-[#5a5ee0] hover:to-[#e08d0a] transition-all duration-300">
          Book Appointment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-6 bg-card rounded-3xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-foreground text-center">Book Your Appointment</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Fill out the form below to request an appointment with Dr. Priya Sharma.
          </DialogDescription>
        </DialogHeader>
        <AppointmentForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}

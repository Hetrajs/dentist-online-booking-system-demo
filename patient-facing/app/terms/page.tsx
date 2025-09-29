import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, FileText, Calendar, CreditCard, AlertTriangle, Scale, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Terms & Conditions | Dr. Priya Sharma Dental Studio",
  description: "Terms and conditions for using Dr. Priya Sharma Dental Studio services and website.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="space-y-8">
          {/* Title Section */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <FileText className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Terms & Conditions</h1>
            <p className="text-lg text-muted-foreground">
              Please read these terms carefully before using our services or website.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Last updated: January 2025
            </p>
          </div>

          {/* Acceptance */}
          <Card>
            <CardHeader>
              <CardTitle>Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                By accessing our website, booking appointments, or using our services, you agree to be bound by these Terms and Conditions. 
                If you do not agree with any part of these terms, please do not use our services.
              </p>
            </CardContent>
          </Card>

          {/* Services Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Our Services</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Dr. Priya Sharma Dental Studio provides comprehensive dental care services including:</p>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>General dentistry and checkups</div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>Cosmetic dental treatments</div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>Orthodontic services</div>
                  </li>
                </ul>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>Surgical procedures</div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>Emergency dental care</div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>Preventive care and education</div>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Appointment Policy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Appointment Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Scheduling & Confirmation
                </h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-6">
                  <li>Appointments are subject to availability and confirmation</li>
                  <li>We will confirm your appointment within 24 hours</li>
                  <li>Please arrive 15 minutes early for your appointment</li>
                  <li>Late arrivals may result in shortened treatment time or rescheduling</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Cancellation Policy</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-6">
                  <li>Cancellations must be made at least 24 hours in advance</li>
                  <li>Same-day cancellations may incur a cancellation fee</li>
                  <li>No-shows may be charged the full appointment fee</li>
                  <li>Emergency cancellations will be handled on a case-by-case basis</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Rescheduling</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-6">
                  <li>Appointments can be rescheduled up to 24 hours in advance</li>
                  <li>Multiple rescheduling may result in appointment cancellation</li>
                  <li>We reserve the right to prioritize punctual patients</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Payment Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Payment Methods</h3>
                <p className="text-muted-foreground mb-2">We accept the following payment methods:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-6">
                  <li>Cash payments</li>
                  <li>Credit and debit cards (Visa, MasterCard, RuPay)</li>
                  <li>UPI payments (Google Pay, PhonePe, Paytm)</li>
                  <li>Bank transfers (NEFT/RTGS)</li>
                  <li>EMI options for treatments above ₹10,000</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Payment Policy</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-6">
                  <li>Payment is due at the time of service unless prior arrangements are made</li>
                  <li>Treatment plans may require advance payment or deposits</li>
                  <li>Insurance claims will be processed as per your policy terms</li>
                  <li>Outstanding balances may incur late fees after 30 days</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Refund Policy</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-6">
                  <li>Refunds for cancelled treatments will be processed within 7-10 business days</li>
                  <li>Partial treatments may be subject to partial refunds</li>
                  <li>Consultation fees are generally non-refundable</li>
                  <li>Refund requests must be made in writing</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Patient Responsibilities */}
          <Card>
            <CardHeader>
              <CardTitle>Patient Responsibilities</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">As a patient, you agree to:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>Provide accurate and complete medical and dental history</div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>Follow pre and post-treatment instructions</div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>Inform us of any changes in your health status</div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>Maintain good oral hygiene as recommended</div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>Attend scheduled follow-up appointments</div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>Treat our staff and other patients with respect</div>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Treatment Consent */}
          <Card>
            <CardHeader>
              <CardTitle>Treatment Consent</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">By using our services, you understand and agree that:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>All dental treatments carry some degree of risk</div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>Treatment outcomes cannot be guaranteed</div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>You will receive detailed treatment plans and cost estimates</div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>You have the right to seek second opinions</div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>Emergency treatments may be performed without prior detailed consent</div>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Website Usage */}
          <Card>
            <CardHeader>
              <CardTitle>Website Usage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Permitted Use</h3>
                <p className="text-muted-foreground mb-2">You may use our website to:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-6">
                  <li>Book appointments and manage your account</li>
                  <li>Access information about our services</li>
                  <li>Contact us for inquiries</li>
                  <li>Subscribe to our newsletter</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Prohibited Activities</h3>
                <p className="text-muted-foreground mb-2">You may not:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-6">
                  <li>Use the website for any illegal or unauthorized purpose</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Transmit viruses or malicious code</li>
                  <li>Interfere with the website's functionality</li>
                  <li>Copy or reproduce content without permission</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                Limitation of Liability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800">Important Legal Notice</h4>
                    <p className="text-yellow-700 text-sm mt-1">
                      Please read this section carefully as it limits our liability.
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                To the fullest extent permitted by law, Dr. Priya Sharma Dental Studio shall not be liable for any indirect, 
                incidental, special, or consequential damages arising from your use of our services or website.
              </p>
              <p className="text-muted-foreground">
                Our total liability for any claims related to our services shall not exceed the amount paid for the specific 
                service giving rise to the claim.
              </p>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card>
            <CardHeader>
              <CardTitle>Governing Law</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                These terms and conditions are governed by the laws of India. Any disputes arising from these terms or your 
                use of our services shall be subject to the exclusive jurisdiction of the courts in New Delhi, India.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Questions About These Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">If you have any questions about these Terms and Conditions, please contact us:</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold mb-2">Email</p>
                  <a href="mailto:legal@drpriyasharma.com" className="text-primary hover:underline">
                    legal@drpriyasharma.com
                  </a>
                </div>
                <div>
                  <p className="font-semibold mb-2">Phone</p>
                  <a href="tel:+911141234567" className="text-primary hover:underline">
                    +91-11-41234567
                  </a>
                </div>
              </div>
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Address:</strong><br />
                  Dr. Priya Sharma Dental Studio<br />
                  Shop 45, Ground Floor<br />
                  Connaught Place, New Delhi - 110001
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card>
            <CardHeader>
              <CardTitle>Changes to These Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated 
                "Last updated" date. Your continued use of our services after any changes constitutes acceptance of the new terms.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

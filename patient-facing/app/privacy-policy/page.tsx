import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Shield, Eye, Lock, Database, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Privacy Policy | Dr. Priya Sharma Dental Studio",
  description: "Learn how we protect your personal information and maintain your privacy at Dr. Priya Sharma Dental Studio.",
}

export default function PrivacyPolicyPage() {
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
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
            <p className="text-lg text-muted-foreground">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Last updated: January 2025
            </p>
          </div>

          {/* Quick Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Quick Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Lock className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold">Secure Data</h3>
                  <p className="text-sm text-muted-foreground">Your information is encrypted and protected</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Database className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold">Limited Collection</h3>
                  <p className="text-sm text-muted-foreground">We only collect what's necessary for your care</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold">Your Rights</h3>
                  <p className="text-sm text-muted-foreground">You control your personal information</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle>Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Personal Information</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Name, email address, and phone number</li>
                  <li>Date of birth and address</li>
                  <li>Emergency contact information</li>
                  <li>Medical and dental history</li>
                  <li>Insurance information</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Appointment Information</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Appointment dates, times, and services</li>
                  <li>Treatment notes and progress</li>
                  <li>Payment and billing information</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Website Usage</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>IP address and browser information</li>
                  <li>Pages visited and time spent</li>
                  <li>Cookies and similar technologies</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Information */}
          <Card>
            <CardHeader>
              <CardTitle>How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong>Provide Dental Care:</strong> Schedule appointments, maintain treatment records, and provide personalized dental services.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong>Communication:</strong> Send appointment reminders, treatment updates, and important health information.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong>Improve Services:</strong> Analyze usage patterns to enhance our website and patient experience.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong>Legal Compliance:</strong> Meet regulatory requirements and maintain proper medical records.
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Information Sharing */}
          <Card>
            <CardHeader>
              <CardTitle>Information Sharing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">We do not sell, trade, or rent your personal information. We may share information only in these limited circumstances:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div><strong>Healthcare Providers:</strong> With specialists or labs involved in your treatment</div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div><strong>Insurance Companies:</strong> For billing and claims processing</div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div><strong>Legal Requirements:</strong> When required by law or court order</div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div><strong>Service Providers:</strong> Trusted partners who help operate our website and services</div>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardHeader>
              <CardTitle>Data Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">We implement industry-standard security measures to protect your information:</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Technical Safeguards</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• SSL encryption for data transmission</li>
                    <li>• Secure database storage</li>
                    <li>• Regular security updates</li>
                    <li>• Access controls and authentication</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Administrative Safeguards</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Staff training on privacy practices</li>
                    <li>• Limited access to patient information</li>
                    <li>• Regular privacy audits</li>
                    <li>• Incident response procedures</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle>Your Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">You have the following rights regarding your personal information:</p>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div><strong>Access:</strong> Request copies of your personal information</div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div><strong>Correction:</strong> Request corrections to inaccurate information</div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div><strong>Deletion:</strong> Request deletion of your information (where legally permissible)</div>
                  </li>
                </ul>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div><strong>Portability:</strong> Request transfer of your information</div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div><strong>Opt-out:</strong> Unsubscribe from marketing communications</div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div><strong>Complaint:</strong> File a complaint with regulatory authorities</div>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">If you have questions about this privacy policy or want to exercise your rights, contact us:</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <a href="mailto:privacy@drpriyasharma.com" className="text-primary hover:underline">
                      privacy@drpriyasharma.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">Phone</p>
                    <a href="tel:+911141234567" className="text-primary hover:underline">
                      +91-11-41234567
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Mailing Address:</strong><br />
                  Dr. Priya Sharma Dental Studio<br />
                  Shop 45, Ground Floor<br />
                  Connaught Place, New Delhi - 110001
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Updates */}
          <Card>
            <CardHeader>
              <CardTitle>Policy Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on our website and updating the "Last updated" date. Your continued use of our services after any changes indicates your acceptance of the updated policy.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

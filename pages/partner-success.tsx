import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, Mail, ArrowRight, Building, Users } from 'lucide-react';
import { Link } from 'wouter';

export default function PartnerSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Application Submitted Successfully!
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Thank you for applying to become a Farezy partner. Your application is now under review.
            </p>
          </div>

          {/* Application Status */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                Application Status: Under Review
              </CardTitle>
              <CardDescription>
                Your application has been submitted and is currently being reviewed by our team.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Mail className="w-6 h-6 text-blue-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100">Email Confirmation Sent</h3>
                    <p className="text-blue-700 dark:text-blue-300 text-sm">
                      We've sent a confirmation email with your application details and reference number.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <Building className="w-6 h-6 text-yellow-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">Review Process</h3>
                    <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                      Our team will review your application and verify your documents. This typically takes 1-3 business days.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Users className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-green-900 dark:text-green-100">Next Steps</h3>
                    <p className="text-green-700 dark:text-green-300 text-sm">
                      Once approved, you'll receive login credentials and access to your partner portal.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What Happens Next */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>What Happens Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                  <div>
                    <h4 className="font-medium">Document Verification</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      We'll verify your business license and insurance documents
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                  <div>
                    <h4 className="font-medium">Application Review</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Our team will review your application and fleet details
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                  <div>
                    <h4 className="font-medium">Approval & Setup</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Once approved, we'll set up your partner portal access
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Partner Benefits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Real-time ride request notifications</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Competitive bidding on rides</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Driver and fleet management tools</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Analytics and earnings reports</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">24/7 support and assistance</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
              <CardDescription>
                Our support team is here to help with any questions about your application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Email Support</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    partners@farezy.co.uk
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Phone Support</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    +44 20 1234 5678 (9 AM - 6 PM)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Return to Homepage
              </Button>
            </Link>
            <Button size="lg" className="w-full sm:w-auto" disabled>
              Access Partner Portal
              <span className="text-xs ml-2">(Available after approval)</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
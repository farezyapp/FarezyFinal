import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Eye, Lock } from 'lucide-react';

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
        </div>

        {/* Last Updated */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-orange-600" />
              Your Privacy Matters
            </CardTitle>
            <CardDescription>
              Last updated: January 2025
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              This Privacy Policy explains how Farezy collects, uses, and protects your personal information when you use our ride comparison platform.
            </p>
          </CardContent>
        </Card>

        {/* Privacy Content */}
        <div className="space-y-6">
          {/* 1. Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Eye className="h-5 w-5 text-orange-600" />
                1. Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Name and email address (when you create an account)</li>
                  <li>Phone number (optional, for booking confirmations)</li>
                  <li>Location data (pickup and destination addresses)</li>
                  <li>Payment information (processed by third-party providers)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Usage Information</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Search history and preferences</li>
                  <li>Booking history and patterns</li>
                  <li>Device information and IP address</li>
                  <li>Browser type and operating system</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Location Data</h3>
                <p className="text-gray-700">
                  We collect location information to provide accurate ride estimates and help you find nearby transportation options. You can control location sharing through your device settings.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 2. How We Use Your Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">2. How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We use your information to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Provide ride comparison and booking services</li>
                <li>Process and facilitate your bookings with transportation providers</li>
                <li>Send booking confirmations and ride updates</li>
                <li>Improve our platform and user experience</li>
                <li>Provide customer support</li>
                <li>Comply with legal requirements</li>
                <li>Prevent fraud and ensure platform security</li>
              </ul>
            </CardContent>
          </Card>

          {/* 3. Information Sharing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">3. Information Sharing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">With Transportation Providers</h3>
                <p className="text-gray-700">
                  We share necessary booking information (name, phone, pickup/destination) with taxi companies and ride-sharing services to facilitate your rides.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">With Service Providers</h3>
                <p className="text-gray-700">
                  We may share data with trusted third-party services that help us operate the platform (analytics, customer support, payment processing).
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Legal Requirements</h3>
                <p className="text-gray-700">
                  We may disclose information when required by law, court order, or government regulation.
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">
                  We never sell your personal information to third parties for marketing purposes.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 4. Data Security */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Lock className="h-5 w-5 text-orange-600" />
                4. Data Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Security Measures Include:</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>SSL encryption for data transmission</li>
                  <li>Secure servers and databases</li>
                  <li>Access controls and authentication</li>
                  <li>Regular security audits and updates</li>
                  <li>Employee training on data protection</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* 5. Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">5. Your Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Under applicable data protection laws, you have the right to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate or incomplete data</li>
                <li>Delete your personal information</li>
                <li>Object to processing of your data</li>
                <li>Data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                To exercise these rights, please contact us at privacy@farezy.co.uk
              </p>
            </CardContent>
          </Card>

          {/* 6. Cookies */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">6. Cookies and Tracking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We use cookies and similar technologies to enhance your experience, analyze usage patterns, and provide personalized content.
              </p>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Types of Cookies:</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Essential cookies (necessary for platform functionality)</li>
                  <li>Performance cookies (analytics and optimization)</li>
                  <li>Preference cookies (user settings and preferences)</li>
                </ul>
              </div>
              <p className="text-gray-700">
                You can manage cookie preferences through your browser settings. See our Cookie Policy for more details.
              </p>
            </CardContent>
          </Card>

          {/* 7. Data Retention */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">7. Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We retain your personal information only as long as necessary to provide our services and comply with legal obligations.
              </p>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Retention Periods:</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Account information: Until account deletion</li>
                  <li>Booking history: 7 years (for legal compliance)</li>
                  <li>Usage analytics: 2 years</li>
                  <li>Support communications: 3 years</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* 8. Children's Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">8. Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
              </p>
              <p className="text-gray-700 leading-relaxed">
                If you are a parent or guardian and believe your child has provided us with personal information, please contact us to have it removed.
              </p>
            </CardContent>
          </Card>

          {/* 9. International Transfers */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">9. International Transfers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Your information may be processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data during international transfers.
              </p>
            </CardContent>
          </Card>

          {/* 10. Changes to Privacy Policy */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">10. Changes to Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </CardContent>
          </Card>

          {/* 11. Contact Us */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">11. Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">
                  <strong>Email:</strong> privacy@farezy.co.uk<br/>
                  <strong>Data Protection Officer:</strong> dpo@farezy.co.uk<br/>
                  <strong>Address:</strong> Farezy Limited, London, United Kingdom
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Scale, AlertCircle } from 'lucide-react';

export default function TermsOfService() {
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
          <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
        </div>

        {/* Last Updated */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-orange-600" />
              Legal Agreement
            </CardTitle>
            <CardDescription>
              Last updated: January 2025
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-800">
                    By using Farezy, you agree to these Terms of Service. Please read them carefully before using our platform.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms Content */}
        <div className="space-y-6">
          {/* 1. Acceptance of Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                By accessing and using Farezy ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use the Service.
              </p>
              <p className="text-gray-700 leading-relaxed">
                These Terms of Service constitute a legally binding agreement between you ("User" or "you") and Farezy ("we," "us," or "our").
              </p>
            </CardContent>
          </Card>

          {/* 2. Description of Service */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">2. Description of Service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Farezy is a ride comparison platform that connects users with licensed taxi companies and ride-sharing services. We provide price comparisons and booking facilitation but do not directly provide transportation services.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The actual transportation service is provided by third-party companies. We act as an intermediary to help you find and book rides with these providers.
              </p>
            </CardContent>
          </Card>

          {/* 3. User Responsibilities */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">3. User Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                You agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Provide accurate and complete information when booking rides</li>
                <li>Use the Service only for lawful purposes</li>
                <li>Respect the rights and safety of drivers and other passengers</li>
                <li>Pay for booked rides according to the provider's terms</li>
                <li>Not interfere with or disrupt the Service</li>
                <li>Maintain the security of your account credentials</li>
              </ul>
            </CardContent>
          </Card>

          {/* 4. Booking and Payment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">4. Booking and Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                When you book a ride through Farezy, you enter into a direct contract with the transportation provider. We facilitate the booking but are not party to the transportation agreement.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Payment is handled directly by the transportation provider according to their terms and conditions. Farezy does not process payments or handle refunds directly.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Cancellation policies vary by provider. Please review the specific terms before booking.
              </p>
            </CardContent>
          </Card>

          {/* 5. Limitation of Liability */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">5. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Farezy provides the platform "as is" without warranties of any kind. We do not guarantee the availability, quality, or safety of transportation services provided by third parties.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We are not liable for any damages arising from your use of transportation services booked through our platform, including but not limited to delays, accidents, or service issues.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our liability is limited to the maximum extent permitted by law.
              </p>
            </CardContent>
          </Card>

          {/* 6. Privacy and Data */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">6. Privacy and Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.
              </p>
              <p className="text-gray-700 leading-relaxed">
                By using our Service, you consent to the collection and use of your information as described in our Privacy Policy.
              </p>
            </CardContent>
          </Card>

          {/* 7. Intellectual Property */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">7. Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                All content, features, and functionality of the Farezy platform are owned by us or our licensors and are protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You may not reproduce, distribute, or create derivative works without our express written permission.
              </p>
            </CardContent>
          </Card>

          {/* 8. Termination */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">8. Termination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We may terminate or suspend your access to the Service at any time, with or without cause, with or without notice.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You may discontinue use of the Service at any time.
              </p>
            </CardContent>
          </Card>

          {/* 9. Changes to Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">9. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting to the platform.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Continued use of the Service after changes constitutes acceptance of the new terms.
              </p>
            </CardContent>
          </Card>

          {/* 10. Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">10. Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">
                  <strong>Email:</strong> legal@farezy.co.uk<br/>
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
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Cookie, Settings, Eye } from 'lucide-react';

export default function CookiePolicy() {
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
          <h1 className="text-3xl font-bold text-gray-900">Cookie Policy</h1>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cookie className="h-5 w-5 text-orange-600" />
              About Cookies
            </CardTitle>
            <CardDescription>
              Last updated: January 2025
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              This Cookie Policy explains how Farezy uses cookies and similar technologies to enhance your experience on our platform.
            </p>
          </CardContent>
        </Card>

        {/* Content */}
        <div className="space-y-6">
          {/* What Are Cookies */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">1. What Are Cookies?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Cookies are small text files that are placed on your device when you visit a website. They help the website remember information about your visit, such as your preferred language and other settings.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Similar technologies include web beacons, pixels, and local storage, which serve similar purposes to cookies.
              </p>
            </CardContent>
          </Card>

          {/* Types of Cookies */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">2. Types of Cookies We Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Essential Cookies</h3>
                  <p className="text-blue-800 text-sm">
                    These cookies are necessary for the website to function properly. They enable basic functions like page navigation, access to secure areas, and user authentication.
                  </p>
                  <p className="text-blue-700 text-sm mt-2">
                    <strong>Examples:</strong> Session management, user preferences, shopping cart
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2">Performance Cookies</h3>
                  <p className="text-green-800 text-sm">
                    These cookies collect information about how you use our website, such as which pages you visit most often and any error messages you might encounter.
                  </p>
                  <p className="text-green-700 text-sm mt-2">
                    <strong>Examples:</strong> Google Analytics, page load times, user behavior tracking
                  </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-900 mb-2">Functionality Cookies</h3>
                  <p className="text-purple-800 text-sm">
                    These cookies allow the website to remember choices you make and provide enhanced features and personal content.
                  </p>
                  <p className="text-purple-700 text-sm mt-2">
                    <strong>Examples:</strong> Language preferences, saved locations, dark mode settings
                  </p>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h3 className="font-semibold text-orange-900 mb-2">Third-Party Cookies</h3>
                  <p className="text-orange-800 text-sm">
                    These cookies are set by third-party services that appear on our pages, such as maps, payment processors, or social media plugins.
                  </p>
                  <p className="text-orange-700 text-sm mt-2">
                    <strong>Examples:</strong> Google Maps, payment gateways, social media widgets
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Specific Cookies */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">3. Specific Cookies We Use</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Cookie Name</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Purpose</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Duration</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">farezy_session</td>
                      <td className="border border-gray-300 px-4 py-2">User session management</td>
                      <td className="border border-gray-300 px-4 py-2">Session</td>
                      <td className="border border-gray-300 px-4 py-2">Essential</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">user_preferences</td>
                      <td className="border border-gray-300 px-4 py-2">Language and display settings</td>
                      <td className="border border-gray-300 px-4 py-2">1 year</td>
                      <td className="border border-gray-300 px-4 py-2">Functionality</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">_ga</td>
                      <td className="border border-gray-300 px-4 py-2">Google Analytics tracking</td>
                      <td className="border border-gray-300 px-4 py-2">2 years</td>
                      <td className="border border-gray-300 px-4 py-2">Performance</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">location_cache</td>
                      <td className="border border-gray-300 px-4 py-2">Cached location data</td>
                      <td className="border border-gray-300 px-4 py-2">30 days</td>
                      <td className="border border-gray-300 px-4 py-2">Functionality</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Managing Cookies */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Settings className="h-5 w-5 text-orange-600" />
                4. Managing Your Cookie Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Browser Settings</h3>
                <p className="text-gray-700 leading-relaxed">
                  You can control cookies through your browser settings. Most browsers allow you to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
                  <li>View and delete cookies</li>
                  <li>Block cookies from specific sites</li>
                  <li>Block third-party cookies</li>
                  <li>Clear all cookies when you close the browser</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Browser-Specific Instructions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium text-gray-900">Chrome</p>
                    <p className="text-sm text-gray-700">Settings → Privacy and security → Cookies</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium text-gray-900">Firefox</p>
                    <p className="text-sm text-gray-700">Options → Privacy & Security → Cookies</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium text-gray-900">Safari</p>
                    <p className="text-sm text-gray-700">Preferences → Privacy → Cookies</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium text-gray-900">Edge</p>
                    <p className="text-sm text-gray-700">Settings → Privacy → Cookies</p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-amber-800 font-medium mb-2">Important Note:</p>
                <p className="text-amber-700 text-sm">
                  Disabling essential cookies may affect the functionality of our website. Some features may not work properly without them.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Third-Party Cookies */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">5. Third-Party Cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Some cookies on our website are set by third-party services. We don't control these cookies, and they are subject to the privacy policies of their respective providers.
              </p>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Third-Party Services We Use:</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li><strong>Google Maps:</strong> For location services and route planning</li>
                  <li><strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
                  <li><strong>Payment Processors:</strong> For secure payment processing</li>
                  <li><strong>Customer Support:</strong> For live chat and help desk functionality</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Cookie Consent */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">6. Cookie Consent</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                When you first visit our website, we'll ask for your consent to use non-essential cookies. You can:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Accept all cookies</li>
                <li>Reject non-essential cookies</li>
                <li>Customize your preferences</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                You can change your preferences at any time by clicking the "Cookie Settings" link in our footer.
              </p>
            </CardContent>
          </Card>

          {/* Updates */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">7. Updates to This Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our practices. Any changes will be posted on this page with an updated revision date.
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">8. Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about our use of cookies, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">
                  <strong>Email:</strong> privacy@farezy.co.uk<br/>
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
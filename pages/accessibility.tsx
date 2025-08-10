import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Accessibility, Eye, Keyboard, Volume2, Smartphone } from 'lucide-react';

export default function AccessibilityPage() {
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
          <h1 className="text-3xl font-bold text-gray-900">Accessibility Statement</h1>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Accessibility className="h-5 w-5 text-orange-600" />
              Our Commitment to Accessibility
            </CardTitle>
            <CardDescription>
              Last updated: January 2025
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              At Farezy, we are committed to ensuring our platform is accessible to all users, including those with disabilities. We strive to provide an inclusive experience that enables everyone to easily find and book transportation services.
            </p>
          </CardContent>
        </Card>

        {/* Content */}
        <div className="space-y-6">
          {/* Standards Compliance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">1. Accessibility Standards</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA. These guidelines help make web content more accessible to people with disabilities, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Visual impairments (blindness, low vision, color blindness)</li>
                <li>Hearing impairments (deafness, hard of hearing)</li>
                <li>Motor impairments (limited use of hands, tremors)</li>
                <li>Cognitive impairments (learning disabilities, attention disorders)</li>
              </ul>
            </CardContent>
          </Card>

          {/* Accessibility Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">2. Accessibility Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Visual Accessibility
                  </h3>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>• High contrast color schemes</li>
                    <li>• Scalable text and interface elements</li>
                    <li>• Alternative text for images</li>
                    <li>• Screen reader compatibility</li>
                    <li>• Focus indicators for navigation</li>
                  </ul>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                    <Keyboard className="h-4 w-4" />
                    Keyboard Navigation
                  </h3>
                  <ul className="text-green-800 text-sm space-y-1">
                    <li>• Full keyboard navigation support</li>
                    <li>• Logical tab order</li>
                    <li>• Keyboard shortcuts for common actions</li>
                    <li>• Skip navigation links</li>
                    <li>• Accessible form controls</li>
                  </ul>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                    <Volume2 className="h-4 w-4" />
                    Audio & Communication
                  </h3>
                  <ul className="text-purple-800 text-sm space-y-1">
                    <li>• Text alternatives for audio content</li>
                    <li>• Visual notifications for important alerts</li>
                    <li>• Clear and simple language</li>
                    <li>• Multiple contact methods</li>
                    <li>• Accessible error messages</li>
                  </ul>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h3 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    Mobile Accessibility
                  </h3>
                  <ul className="text-orange-800 text-sm space-y-1">
                    <li>• Touch-friendly interface design</li>
                    <li>• Responsive layout for all devices</li>
                    <li>• Voice control compatibility</li>
                    <li>• Gesture navigation support</li>
                    <li>• Zoom and magnification support</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Implementation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">3. Technical Implementation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Semantic HTML</h3>
                <p className="text-gray-700 text-sm">
                  We use proper HTML markup with semantic elements to ensure screen readers and other assistive technologies can properly interpret our content.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">ARIA Labels</h3>
                <p className="text-gray-700 text-sm">
                  We implement ARIA (Accessible Rich Internet Applications) labels and roles to provide additional context for interactive elements.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Color and Contrast</h3>
                <p className="text-gray-700 text-sm">
                  All text and interactive elements meet WCAG AA contrast ratio requirements (4.5:1 for normal text, 3:1 for large text).
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Responsive Design</h3>
                <p className="text-gray-700 text-sm">
                  Our platform adapts to different screen sizes and orientations, supporting various devices and assistive technologies.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Assistive Technologies */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">4. Supported Assistive Technologies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Our platform has been tested with the following assistive technologies:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Screen Readers</h3>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• NVDA (Windows)</li>
                    <li>• JAWS (Windows)</li>
                    <li>• VoiceOver (macOS/iOS)</li>
                    <li>• TalkBack (Android)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Other Tools</h3>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• Voice recognition software</li>
                    <li>• Switch navigation devices</li>
                    <li>• Eye-tracking systems</li>
                    <li>• Magnification software</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Keyboard Shortcuts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">5. Keyboard Shortcuts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Use these keyboard shortcuts to navigate more efficiently:
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">General Navigation</p>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li><kbd className="bg-gray-200 px-2 py-1 rounded">Tab</kbd> - Next element</li>
                      <li><kbd className="bg-gray-200 px-2 py-1 rounded">Shift + Tab</kbd> - Previous element</li>
                      <li><kbd className="bg-gray-200 px-2 py-1 rounded">Enter</kbd> - Activate button/link</li>
                      <li><kbd className="bg-gray-200 px-2 py-1 rounded">Esc</kbd> - Close modal/menu</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Farezy Specific</p>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li><kbd className="bg-gray-200 px-2 py-1 rounded">Alt + H</kbd> - Go to home</li>
                      <li><kbd className="bg-gray-200 px-2 py-1 rounded">Alt + S</kbd> - Search rides</li>
                      <li><kbd className="bg-gray-200 px-2 py-1 rounded">Alt + P</kbd> - View profile</li>
                      <li><kbd className="bg-gray-200 px-2 py-1 rounded">Alt + M</kbd> - Open menu</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Known Issues */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">6. Known Issues & Limitations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We are continuously working to improve accessibility. Currently known issues include:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Some third-party map interactions may have limited keyboard support</li>
                <li>Real-time updates may not be immediately announced to screen readers</li>
                <li>Some dynamic content may require page refresh for full accessibility</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                We are actively working to resolve these issues and welcome your feedback on any accessibility barriers you encounter.
              </p>
            </CardContent>
          </Card>

          {/* Testing and Feedback */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">7. Testing and Continuous Improvement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We regularly test our platform with:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Automated accessibility testing tools</li>
                <li>Manual testing with assistive technologies</li>
                <li>User testing with people with disabilities</li>
                <li>Regular accessibility audits by third-party experts</li>
              </ul>
            </CardContent>
          </Card>

          {/* User Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">8. Tips for Better Accessibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Browser Settings</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Enable high contrast mode in your browser or operating system</li>
                  <li>Adjust text size using browser zoom (Ctrl/Cmd + or -)</li>
                  <li>Use your browser's reader mode for better focus</li>
                  <li>Enable reduced motion settings if you're sensitive to animations</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Mobile Devices</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Enable TalkBack (Android) or VoiceOver (iOS) for screen reading</li>
                  <li>Use voice commands for hands-free navigation</li>
                  <li>Adjust display settings for better visibility</li>
                  <li>Enable switch control for alternative input methods</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Contact and Feedback */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">9. Accessibility Feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We welcome your feedback on the accessibility of our platform. If you encounter any barriers or have suggestions for improvement, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">
                  <strong>Email:</strong> accessibility@farezy.co.uk<br/>
                  <strong>Phone:</strong> +44 20 1234 5678<br/>
                  <strong>Address:</strong> Farezy Limited, London, United Kingdom
                </p>
              </div>
              <p className="text-gray-700 leading-relaxed">
                We aim to respond to accessibility feedback within 2 business days and will work with you to address any issues promptly.
              </p>
            </CardContent>
          </Card>

          {/* Legal Compliance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">10. Legal Compliance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                This accessibility statement applies to the Farezy website and mobile application. We are committed to compliance with:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>The Equality Act 2010 (UK)</li>
                <li>The Public Sector Bodies (Websites and Mobile Applications) Accessibility Regulations 2018</li>
                <li>The Americans with Disabilities Act (ADA) where applicable</li>
                <li>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
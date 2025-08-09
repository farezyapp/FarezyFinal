import React, { useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Shield, CheckCircle, AlertTriangle, Phone, Eye, Users, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SafetyGuidelines: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Safety Guidelines</h1>
            </div>
            <Link href="/">
              <div className="text-2xl font-bold text-yellow-600">farezy</div>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        
        {/* Safety Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-6 w-6 mr-2 text-green-600" />
              Your Safety is Our Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              At Farezy, we're committed to providing a safe and secure transportation experience. 
              Follow these guidelines to ensure your journey is both comfortable and secure.
            </p>
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <p className="text-green-700 font-medium">
                Remember: Your safety starts with being informed and prepared.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Before Your Ride */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-blue-600" />
              Before Your Ride
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Verify Driver Information</h4>
                  <p className="text-gray-600 text-sm">Always check the driver's photo, name, license plate, and vehicle details before getting in.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Share Your Trip Details</h4>
                  <p className="text-gray-600 text-sm">Share your ride details with trusted friends or family members.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Wait in a Safe Location</h4>
                  <p className="text-gray-600 text-sm">Stay in a well-lit, populated area while waiting for your ride.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* During Your Ride */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="h-5 w-5 mr-2 text-purple-600" />
              During Your Ride
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-purple-600 text-sm font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Wear Your Seatbelt</h4>
                  <p className="text-gray-600 text-sm">Always buckle up as soon as you get in the vehicle.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-purple-600 text-sm font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Stay Alert</h4>
                  <p className="text-gray-600 text-sm">Keep your phone charged and stay aware of your surroundings.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-purple-600 text-sm font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Follow the Route</h4>
                  <p className="text-gray-600 text-sm">Use the in-app tracking to ensure you're following the correct route.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Safety Features */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="h-5 w-5 mr-2 text-green-600" />
              Safety Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <h4 className="font-semibold text-gray-900">Driver Verification</h4>
                </div>
                <p className="text-sm text-gray-600">All drivers undergo background checks and vehicle inspections.</p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Eye className="h-5 w-5 text-green-600" />
                  <h4 className="font-semibold text-gray-900">Real-time Tracking</h4>
                </div>
                <p className="text-sm text-gray-600">Live GPS tracking allows you to share your location with trusted contacts.</p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Phone className="h-5 w-5 text-purple-600" />
                  <h4 className="font-semibold text-gray-900">Emergency Button</h4>
                </div>
                <p className="text-sm text-gray-600">Quick access to emergency services and support team.</p>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="h-5 w-5 text-yellow-600" />
                  <h4 className="font-semibold text-gray-900">Rating System</h4>
                </div>
                <p className="text-sm text-gray-600">Community-driven driver ratings help maintain service quality.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Situations */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
              Emergency Situations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-4">
              <p className="text-red-700 font-medium">
                If you feel unsafe at any point during your ride, trust your instincts and take action immediately.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-red-600" />
                <span className="text-gray-700">Call emergency services: <strong>999</strong></span>
              </div>
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <span className="text-gray-700">Use the in-app emergency button for immediate assistance</span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-gray-700">Ask the driver to stop in a safe, public location</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Resources */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/faq" className="block text-blue-600 hover:text-blue-800">
                → Frequently Asked Questions
              </Link>
              <Link href="/contact-us" className="block text-blue-600 hover:text-blue-800">
                → Contact Support Team
              </Link>
              <Link href="/report-issue" className="block text-blue-600 hover:text-blue-800">
                → Report a Safety Concern
              </Link>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default SafetyGuidelines;
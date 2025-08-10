import React, { useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Search, MessageCircle, Shield, AlertTriangle, Book, Phone, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const HelpCenter: React.FC = () => {
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
              <h1 className="text-2xl font-bold text-gray-900">Help Center</h1>
            </div>
            <Link href="/">
              <div className="text-2xl font-bold text-yellow-600">farezy</div>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        
        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2 text-blue-600" />
              Search Help Topics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <input
                type="text"
                placeholder="Search for help topics..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <Search className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        {/* Quick Help Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Book className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Getting Started</h3>
              <p className="text-gray-600 text-sm">Learn how to use Farezy to compare rides and book transportation</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Booking Help</h3>
              <p className="text-gray-600 text-sm">Troubleshoot booking issues and payment problems</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Safety & Security</h3>
              <p className="text-gray-600 text-sm">Learn about safety features and security measures</p>
            </CardContent>
          </Card>

        </div>

        {/* Popular Help Topics */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Popular Help Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-gray-700">How to compare ride prices</span>
                <ArrowLeft className="h-4 w-4 text-gray-400 rotate-180" />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-gray-700">Payment methods and billing</span>
                <ArrowLeft className="h-4 w-4 text-gray-400 rotate-180" />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-gray-700">Driver tracking and live updates</span>
                <ArrowLeft className="h-4 w-4 text-gray-400 rotate-180" />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-gray-700">Cancellation and refund policy</span>
                <ArrowLeft className="h-4 w-4 text-gray-400 rotate-180" />
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-gray-700">Account and profile settings</span>
                <ArrowLeft className="h-4 w-4 text-gray-400 rotate-180" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="h-5 w-5 mr-2 text-green-600" />
              Still Need Help?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                <MessageCircle className="h-6 w-6 text-blue-600" />
                <div>
                  <div className="font-semibold text-gray-900">Live Chat</div>
                  <div className="text-sm text-gray-600">Available 24/7</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                <Mail className="h-6 w-6 text-green-600" />
                <div>
                  <div className="font-semibold text-gray-900">Email Support</div>
                  <div className="text-sm text-gray-600">support@farezy.co.uk</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default HelpCenter;
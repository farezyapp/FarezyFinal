import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, AlertTriangle, Send, Shield, Bug, CreditCard, User, Car } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ReportIssue: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  const [formData, setFormData] = useState({
    issueType: '',
    priority: '',
    subject: '',
    description: '',
    email: '',
    rideId: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Issue report submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

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
              <h1 className="text-2xl font-bold text-gray-900">Report an Issue</h1>
            </div>
            <Link href="/">
              <div className="text-2xl font-bold text-yellow-600">farezy</div>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Issue Categories */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                  Issue Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                    <Shield className="h-6 w-6 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Safety Concerns</h4>
                      <p className="text-sm text-gray-600">Driver behavior, vehicle safety, emergency situations</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Bug className="h-6 w-6 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Technical Issues</h4>
                      <p className="text-sm text-gray-600">App bugs, booking problems, tracking issues</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                    <CreditCard className="h-6 w-6 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Billing & Payments</h4>
                      <p className="text-sm text-gray-600">Payment errors, overcharges, refund requests</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                    <User className="h-6 w-6 text-purple-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Service Quality</h4>
                      <p className="text-sm text-gray-600">Driver service, vehicle condition, route issues</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Priority Levels */}
            <Card>
              <CardHeader>
                <CardTitle>Priority Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <div>
                      <span className="font-semibold text-gray-900">High Priority</span>
                      <p className="text-sm text-gray-600">Safety concerns, emergency situations</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                    <div>
                      <span className="font-semibold text-gray-900">Medium Priority</span>
                      <p className="text-sm text-gray-600">Payment issues, service complaints</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <div>
                      <span className="font-semibold text-gray-900">Low Priority</span>
                      <p className="text-sm text-gray-600">App suggestions, general feedback</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Report Form */}
          <Card>
            <CardHeader>
              <CardTitle>Report Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issue Type
                  </label>
                  <Select onValueChange={(value) => handleSelectChange('issueType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select issue type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="safety">Safety Concerns</SelectItem>
                      <SelectItem value="technical">Technical Issues</SelectItem>
                      <SelectItem value="billing">Billing & Payments</SelectItem>
                      <SelectItem value="service">Service Quality</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority Level
                  </label>
                  <Select onValueChange={(value) => handleSelectChange('priority', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="low">Low Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="rideId" className="block text-sm font-medium text-gray-700 mb-2">
                    Ride ID (Optional)
                  </label>
                  <Input
                    id="rideId"
                    name="rideId"
                    type="text"
                    value={formData.rideId}
                    onChange={handleChange}
                    placeholder="e.g., FZ-123456"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Brief description of the issue"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Detailed Description
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Please provide as much detail as possible about the issue..."
                    rows={6}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                  <Send className="h-4 w-4 mr-2" />
                  Submit Report
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Notice */}
        <Card className="mt-8">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <div>
                <p className="font-semibold">Emergency Situations</p>
                <p className="text-sm text-gray-600">
                  If you're in immediate danger or experiencing an emergency, please call 999 immediately.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportIssue;
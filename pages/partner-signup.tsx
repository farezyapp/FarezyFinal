import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Car, MapPin, Phone, Mail, Building, Users, Clock, PoundSterling, CheckCircle, Shield, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';

interface PartnerSignupForm {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  operatingArea: string;
  fleetSize: string;
  serviceTypes: string[];
  operatingHours: string;
  averageResponseTime: string;
  baseRate: string;
  perKmRate: string;
  description: string;
  website?: string;
  licenseNumber: string;
  insuranceProvider: string;
}

export default function PartnerSignup() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<PartnerSignupForm>({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    operatingArea: '',
    fleetSize: '',
    serviceTypes: [],
    operatingHours: '',
    averageResponseTime: '',
    baseRate: '',
    perKmRate: '',
    description: '',
    website: '',
    licenseNumber: '',
    insuranceProvider: ''
  });

  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const signupMutation = useMutation({
    mutationFn: async (data: PartnerSignupForm) => {
      console.log('📝 Submitting partner application:', data.companyName);
      console.log('📝 Form data keys:', Object.keys(data));
      return apiRequest('/api/partner-signup', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    onSuccess: (response) => {
      console.log('✅ Partner application submitted successfully:', response);
      toast({
        title: "Application Submitted Successfully!",
        description: "We'll review your application and contact you within 2-3 business days.",
      });
      // Reset form
      setFormData({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        operatingArea: '',
        fleetSize: '',
        serviceTypes: [],
        operatingHours: '',
        averageResponseTime: '',
        baseRate: '',
        perKmRate: '',
        description: '',
        website: '',
        licenseNumber: '',
        insuranceProvider: ''
      });
      setSelectedServices([]);
    },
    onError: (error) => {
      console.error('❌ Partner application submission failed:', error);
      toast({
        title: "Submission Failed",
        description: "Please check your information and try again.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: keyof PartnerSignupForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceToggle = (service: string) => {
    const updated = selectedServices.includes(service)
      ? selectedServices.filter(s => s !== service)
      : [...selectedServices, service];
    
    setSelectedServices(updated);
    setFormData(prev => ({ ...prev, serviceTypes: updated }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.companyName || !formData.contactName || !formData.email || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    signupMutation.mutate(formData);
  };

  const serviceOptions = [
    { id: 'standard', label: 'Standard Taxi', icon: Car },
    { id: 'luxury', label: 'Luxury/Premium', icon: Star },
    { id: 'wheelchair', label: 'Wheelchair Accessible', icon: Users },
    { id: 'airport', label: 'Airport Transfers', icon: MapPin },
    { id: 'delivery', label: 'Package Delivery', icon: Building },
    { id: 'emergency', label: '24/7 Emergency', icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Enhanced Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                <Car className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent dark:from-orange-400 dark:to-yellow-400">
                  Partner with Farezy
                </h1>
                <p className="text-gray-600 dark:text-gray-300">Join our network of trusted taxi services</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Enhanced Benefits Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-900/20 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">More Customers</h3>
              <p className="text-sm text-orange-700 dark:text-orange-300">Access thousands of potential riders looking for reliable taxi services</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/20 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <PoundSterling className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">Increase Revenue</h3>
              <p className="text-sm text-green-700 dark:text-green-300">Grow your business with our AI-powered booking system</p>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-900/20 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Trusted Platform</h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">Join a secure, reliable platform with verified customers</p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Registration Form */}
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5 text-white" />
              Partner Registration
            </CardTitle>
            <CardDescription className="text-orange-100">
              Fill out the form below to apply to become a Farezy partner. All fields marked with * are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 pb-2 border-b border-orange-200 dark:border-orange-800">
                  <Building className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  Company Information
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      placeholder="e.g. City Taxi Services"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactName">Contact Person *</Label>
                    <Input
                      id="contactName"
                      value={formData.contactName}
                      onChange={(e) => handleInputChange('contactName', e.target.value)}
                      placeholder="Full name of primary contact"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="contact@yourcompany.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Business Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Street address, city, state, postal code"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Primary City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Main city of operation"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website (Optional)</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website || ''}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="https://yourcompany.com"
                    />
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 pb-2 border-b border-orange-200 dark:border-orange-800">
                  <Car className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  Service Details
                </h3>

                <div>
                  <Label>Operating Area *</Label>
                  <Textarea
                    value={formData.operatingArea}
                    onChange={(e) => handleInputChange('operatingArea', e.target.value)}
                    placeholder="Describe the areas/neighborhoods you serve (e.g., Downtown, Airport, Suburbs within 20km radius)"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fleetSize">Fleet Size *</Label>
                    <Select value={formData.fleetSize} onValueChange={(value) => handleInputChange('fleetSize', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fleet size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-5">1-5 vehicles</SelectItem>
                        <SelectItem value="6-15">6-15 vehicles</SelectItem>
                        <SelectItem value="16-30">16-30 vehicles</SelectItem>
                        <SelectItem value="31-50">31-50 vehicles</SelectItem>
                        <SelectItem value="50+">50+ vehicles</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="operatingHours">Operating Hours *</Label>
                    <Select value={formData.operatingHours} onValueChange={(value) => handleInputChange('operatingHours', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select operating hours" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24/7">24/7 Service</SelectItem>
                        <SelectItem value="6am-12am">6:00 AM - 12:00 AM</SelectItem>
                        <SelectItem value="7am-11pm">7:00 AM - 11:00 PM</SelectItem>
                        <SelectItem value="8am-10pm">8:00 AM - 10:00 PM</SelectItem>
                        <SelectItem value="custom">Custom Hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Service Types *</Label>
                  <p className="text-sm text-gray-600 mb-3">Select all services you provide:</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {serviceOptions.map((service) => {
                      const Icon = service.icon;
                      const isSelected = selectedServices.includes(service.id);
                      return (
                        <Button
                          key={service.id}
                          type="button"
                          variant={isSelected ? "default" : "outline"}
                          className={`justify-start h-auto p-4 transition-all duration-200 ${
                            isSelected 
                              ? "bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white shadow-lg" 
                              : "hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-300 dark:hover:border-orange-700"
                          }`}
                          onClick={() => handleServiceToggle(service.id)}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-5 w-5" />
                            <span>{service.label}</span>
                            {isSelected && <CheckCircle className="h-4 w-4 ml-auto" />}
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Pricing & Response */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 pb-2 border-b border-orange-200 dark:border-orange-800">
                  <PoundSterling className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  Pricing & Response Time
                </h3>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="baseRate">Base Rate (USD) *</Label>
                    <Input
                      id="baseRate"
                      type="number"
                      step="0.01"
                      value={formData.baseRate}
                      onChange={(e) => handleInputChange('baseRate', e.target.value)}
                      placeholder="3.50"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="perKmRate">Per KM Rate (USD) *</Label>
                    <Input
                      id="perKmRate"
                      type="number"
                      step="0.01"
                      value={formData.perKmRate}
                      onChange={(e) => handleInputChange('perKmRate', e.target.value)}
                      placeholder="1.25"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="averageResponseTime">Avg. Response Time *</Label>
                    <Select value={formData.averageResponseTime} onValueChange={(value) => handleInputChange('averageResponseTime', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Response time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5-10">5-10 minutes</SelectItem>
                        <SelectItem value="10-15">10-15 minutes</SelectItem>
                        <SelectItem value="15-20">15-20 minutes</SelectItem>
                        <SelectItem value="20-30">20-30 minutes</SelectItem>
                        <SelectItem value="30+">30+ minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Legal & Insurance */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Legal & Insurance
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="licenseNumber">Business License Number *</Label>
                    <Input
                      id="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                      placeholder="Your business license number"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="insuranceProvider">Insurance Provider *</Label>
                    <Input
                      id="insuranceProvider"
                      value={formData.insuranceProvider}
                      onChange={(e) => handleInputChange('insuranceProvider', e.target.value)}
                      placeholder="Name of your insurance company"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Company Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Tell us about your company, experience, and what makes you special (optional)"
                  rows={4}
                />
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={signupMutation.isPending}
                >
                  {signupMutation.isPending ? 'Submitting Application...' : 'Submit Partner Application'}
                </Button>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-3">
                  We'll review your application and contact you within 2-3 business days.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
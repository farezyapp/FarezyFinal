import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Car, Clock, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface BookingRequest {
  serviceProvider: 'uber' | 'lyft' | 'bolt';
  pickup: {
    address: string;
    lat: number;
    lng: number;
  };
  destination: {
    address: string;
    lat: number;
    lng: number;
  };
  rideType: string;
  customerInfo: {
    name: string;
    phone: string;
    email?: string;
  };
}

interface AIBookingPanelProps {
  pickup: { address: string; lat: number; lng: number } | null;
  destination: { address: string; lat: number; lng: number } | null;
  onBookingComplete?: (bookingId: string) => void;
}

export default function AIBookingPanel({ pickup, destination, onBookingComplete }: AIBookingPanelProps) {
  const { toast } = useToast();
  const [selectedService, setSelectedService] = useState<'uber' | 'lyft' | 'bolt'>('uber');
  const [selectedRideType, setSelectedRideType] = useState('UberX');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: ''
  });

  const bookingMutation = useMutation({
    mutationFn: async (bookingData: BookingRequest) => {
      const response = await apiRequest('POST', '/api/rides/book-ai', bookingData);
      return response.json();
    },
    onSuccess: (result) => {
      if (result.success) {
        toast({
          title: "Booking Confirmed!",
          description: `Your ${selectedService} ride has been booked. Booking ID: ${result.bookingId}`,
        });
        if (onBookingComplete && result.bookingId) {
          onBookingComplete(result.bookingId);
        }
      } else {
        toast({
          title: "Booking Failed",
          description: result.error || "Unable to complete booking",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Booking Error",
        description: "Network error occurred while booking",
        variant: "destructive",
      });
    }
  });

  const handleBookRide = () => {
    if (!pickup || !destination) {
      toast({
        title: "Missing Information",
        description: "Please select pickup and destination locations",
        variant: "destructive",
      });
      return;
    }

    if (!customerInfo.name || !customerInfo.phone) {
      toast({
        title: "Customer Information Required",
        description: "Please enter your name and phone number",
        variant: "destructive",
      });
      return;
    }

    const bookingRequest: BookingRequest = {
      serviceProvider: selectedService,
      pickup,
      destination,
      rideType: selectedRideType,
      customerInfo
    };

    bookingMutation.mutate(bookingRequest);
  };

  const serviceOptions = [
    { id: 'uber', name: 'Uber', logo: '🚗', description: 'Fast and reliable rides' },
    { id: 'lyft', name: 'Lyft', logo: '🚕', description: 'Friendly local drivers' },
    { id: 'bolt', name: 'Bolt', logo: '⚡', description: 'Quick city transport' }
  ];

  const rideTypesByService = {
    uber: ['UberX', 'UberXL', 'Uber Comfort', 'Uber Black'],
    lyft: ['Lyft', 'Lyft XL', 'Lux', 'Lux Black'],
    bolt: ['Bolt', 'Bolt XL', 'Bolt Premium']
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          AI-Powered Ride Booking
        </CardTitle>
        <p className="text-sm text-gray-600">
          Book real rides through automated web booking across multiple services
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Trip Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Trip Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <span className="font-medium">Pickup:</span> {pickup?.address || 'Not selected'}
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <div>
                <span className="font-medium">Destination:</span> {destination?.address || 'Not selected'}
              </div>
            </div>
          </div>
        </div>

        {/* Service Selection */}
        <div>
          <h3 className="font-medium mb-3">Choose Service Provider</h3>
          <div className="grid grid-cols-3 gap-3">
            {serviceOptions.map((service) => (
              <Button
                key={service.id}
                variant={selectedService === service.id ? "default" : "outline"}
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => {
                  setSelectedService(service.id as any);
                  setSelectedRideType(rideTypesByService[service.id as keyof typeof rideTypesByService][0]);
                }}
              >
                <span className="text-2xl">{service.logo}</span>
                <span className="font-medium">{service.name}</span>
                <span className="text-xs text-gray-600 text-center">{service.description}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Ride Type Selection */}
        <div>
          <h3 className="font-medium mb-3">Select Ride Type</h3>
          <div className="grid grid-cols-2 gap-2">
            {rideTypesByService[selectedService].map((type) => (
              <Button
                key={type}
                variant={selectedRideType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRideType(type)}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        {/* Customer Information */}
        <div>
          <h3 className="font-medium mb-3">Customer Information</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Full Name *"
              className="w-full p-3 border rounded-lg"
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
            />
            <input
              type="tel"
              placeholder="Phone Number *"
              className="w-full p-3 border rounded-lg"
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
            />
            <input
              type="email"
              placeholder="Email (Optional)"
              className="w-full p-3 border rounded-lg"
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
        </div>

        {/* AI Booking Features */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">AI Booking Features</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Automated web navigation and booking</li>
            <li>• Real-time price comparison</li>
            <li>• Instant booking confirmation</li>
            <li>• Works without API partnerships</li>
          </ul>
        </div>

        {/* Book Button */}
        <Button 
          onClick={handleBookRide}
          disabled={bookingMutation.isPending || !pickup || !destination}
          className="w-full h-12 text-lg"
        >
          {bookingMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Booking with {selectedService}...
            </>
          ) : (
            `Book ${selectedRideType} with ${selectedService}`
          )}
        </Button>

        {/* Status Messages */}
        {bookingMutation.isPending && (
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-800">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">
                AI agent is navigating {selectedService} website and completing your booking...
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
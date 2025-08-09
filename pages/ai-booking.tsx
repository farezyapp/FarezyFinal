import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LocationAutocomplete from '@/components/location-autocomplete';
import AIBookingPanel from '@/components/ai-booking-panel';
import { useLocation } from 'wouter';

export default function AIBooking() {
  const [, setLocation] = useLocation();
  const [pickup, setPickup] = useState<{ address: string; lat: number; lng: number } | null>(null);
  const [destination, setDestination] = useState<{ address: string; lat: number; lng: number } | null>(null);
  const [pickupInput, setPickupInput] = useState('');
  const [destinationInput, setDestinationInput] = useState('');

  const handlePickupSelect = (suggestion: any) => {
    setPickup({
      address: suggestion.fullAddress,
      lat: 52.0406224, // Mock coordinates - would be from geocoding
      lng: -0.7594171
    });
    setPickupInput(suggestion.fullAddress);
  };

  const handleDestinationSelect = (suggestion: any) => {
    setDestination({
      address: suggestion.fullAddress,
      lat: 52.0467, // Mock coordinates - would be from geocoding
      lng: -0.7581
    });
    setDestinationInput(suggestion.fullAddress);
  };

  const handleBookingComplete = (bookingId: string) => {
    // Navigate to tracking page with the booking ID
    setLocation(`/tracking?bookingId=${bookingId}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setLocation('/')}
            className="mr-4 flex items-center text-black hover:text-black hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">
            <span className="text-yellow-500">Fare</span><span className="text-black">zy</span>
            <span className="text-lg font-normal text-gray-600 ml-2">AI Booking System</span>
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Location Selection */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">Select Your Journey</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pickup Location
              </label>
              <LocationAutocomplete
                placeholder="Enter pickup address"
                value={pickupInput}
                onChange={setPickupInput}
                onLocationSelect={handlePickupSelect}
                className="w-full"
                instanceId="ai-pickup-input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination
              </label>
              <LocationAutocomplete
                placeholder="Enter destination address"
                value={destinationInput}
                onChange={setDestinationInput}
                onLocationSelect={handleDestinationSelect}
                className="w-full"
                instanceId="ai-destination-input"
              />
            </div>
          </div>
        </div>

        {/* AI Booking Panel */}
        <AIBookingPanel 
          pickup={pickup}
          destination={destination}
          onBookingComplete={handleBookingComplete}
        />

        {/* How It Works */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">How AI Booking Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="font-medium mb-2">AI Navigation</h3>
              <p className="text-sm text-gray-600">
                Our AI agent opens the ride service website and navigates automatically
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="font-medium mb-2">Smart Booking</h3>
              <p className="text-sm text-gray-600">
                Fills forms, selects options, and completes the booking process for you
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="font-medium mb-2">Real Confirmation</h3>
              <p className="text-sm text-gray-600">
                Receives actual booking confirmation and provides tracking details
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
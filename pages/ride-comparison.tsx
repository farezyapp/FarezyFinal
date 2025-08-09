import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, MapPin, Clock, PoundSterling, Users, Zap, ExternalLink, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import LocationAutocomplete from '@/components/location-autocomplete';

interface Location {
  address: string;
  lat: number;
  lng: number;
}

export default function RideComparison() {
  const { toast } = useToast();
  const [pickup, setPickup] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [pickupInput, setPickupInput] = useState('');
  const [destinationInput, setDestinationInput] = useState('');

  // Fetch ride options from approved partners only
  const { 
    data: rideOptions = [], 
    isLoading: ridesLoading, 
    error: ridesError 
  } = useQuery({
    queryKey: ['/api/rides', pickup?.lat, pickup?.lng, destination?.lat, destination?.lng],
    queryFn: async () => {
      if (!pickup || !destination) return [];
      
      const response = await fetch(`/api/rides?originLat=${pickup.lat}&originLng=${pickup.lng}&destLat=${destination.lat}&destLng=${destination.lng}&distance=5&duration=10`);
      if (!response.ok) {
        throw new Error('Failed to fetch ride options');
      }
      return response.json();
    },
    enabled: !!(pickup && destination),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handlePickupSelect = (suggestion: any) => {
    setPickup({
      address: suggestion.fullAddress || suggestion.mainText,
      lat: suggestion.lat || 52.0406224,
      lng: suggestion.lng || -0.7594171
    });
    setPickupInput(suggestion.fullAddress || suggestion.mainText);
  };

  const handleDestinationSelect = (suggestion: any) => {
    setDestination({
      address: suggestion.fullAddress || suggestion.mainText,
      lat: suggestion.lat || 52.0467,
      lng: suggestion.lng || -0.7581
    });
    setDestinationInput(suggestion.fullAddress || suggestion.mainText);
  };

  const handleBookRide = (option: any) => {
    toast({
      title: "Booking Request",
      description: `Connecting you with ${option.serviceName} for £${option.price}`,
    });
    
    // For production, implement booking flow with the partner
    // For now, show a contact message
    setTimeout(() => {
      toast({
        title: "Contact Partner",
        description: `Call ${option.serviceName} directly to book your ride`,
      });
    }, 1500);
  };

  const formatPrice = (price: string, currency?: string) => {
    if (price.includes('£') || price.includes('$')) {
      return price;
    }
    return `£${price}`;
  };

  const getServiceIcon = (service: string) => {
    switch (service.toLowerCase()) {
      case 'uber':
        return <div className="w-6 h-6 bg-black text-white rounded flex items-center justify-center text-xs font-bold">U</div>;
      default:
        return <div className="w-6 h-6 bg-gray-500 text-white rounded flex items-center justify-center text-xs font-bold">{service[0]}</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-25 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-orange-200/30 dark:border-orange-700/30 sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2 text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="flex items-center gap-4">
              {/* Simple Farezy Logo */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Farezy
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 -mt-1">
                  Ride Comparison
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Location Input Section */}
        <Card className="mb-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-orange-200/50 shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-xl font-bold">
              <div className="p-2 bg-white/20 rounded-lg">
                <MapPin className="h-6 w-6" />
              </div>
              Trip Details
            </CardTitle>
            <CardDescription className="text-orange-50 font-medium">
              Enter your pickup and destination to compare prices from approved partners
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div>
              <label className="block text-base font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Pickup Location
              </label>
              <LocationAutocomplete
                value={pickupInput}
                onChange={setPickupInput}
                onLocationSelect={handlePickupSelect}
                placeholder="Enter pickup address"
                className="w-full text-lg"
              />
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                Destination
              </label>
              <LocationAutocomplete
                value={destinationInput}
                onChange={setDestinationInput}
                onLocationSelect={handleDestinationSelect}
                placeholder="Enter destination address"
                className="w-full text-lg"
              />
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {pickup && destination && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-300 mb-3">
                Available Rides
              </h2>
              <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 dark:from-orange-400/20 dark:to-yellow-400/20 rounded-lg p-4 border border-orange-200/50 dark:border-orange-700/50">
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  <span className="text-orange-600 dark:text-orange-400 font-semibold">From:</span> {pickup.address}
                </p>
                <p className="text-gray-700 dark:text-gray-300 font-medium mt-1">
                  <span className="text-yellow-600 dark:text-yellow-400 font-semibold">To:</span> {destination.address}
                </p>
              </div>
            </div>

            {/* Loading State */}
            {ridesLoading && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 px-6 py-3 rounded-full border border-orange-200 dark:border-orange-700/50">
                    <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-orange-700 dark:text-orange-300 font-semibold">Finding best rides for you...</span>
                  </div>
                </div>
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="bg-white/90 dark:bg-gray-800/90 shadow-xl border border-orange-100 dark:border-orange-900/30">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <Skeleton className="w-16 h-16 rounded-2xl" />
                          <div className="space-y-3">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-4 w-24" />
                            <div className="flex gap-2">
                              <Skeleton className="h-6 w-16 rounded-full" />
                              <Skeleton className="h-6 w-16 rounded-full" />
                              <Skeleton className="h-6 w-16 rounded-full" />
                            </div>
                          </div>
                        </div>
                        <div className="text-right space-y-3">
                          <Skeleton className="h-8 w-20" />
                          <Skeleton className="h-6 w-16" />
                          <Skeleton className="h-10 w-24 rounded-xl" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Error State */}
            {ridesError && (
              <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-red-800" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                        Error Loading Rides
                      </h3>
                      <p className="text-red-700 dark:text-red-300 text-sm">
                        Unable to fetch ride options. Please try again.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Available Rides from Approved Partners */}
            {Array.isArray(rideOptions) && rideOptions.length > 0 && (
              <div className="space-y-4">
                {rideOptions.map((option, index) => (
                  <Card key={option.id || index} className="bg-white/95 dark:bg-gray-800/95 hover:shadow-2xl transition-all duration-300 border border-orange-100 dark:border-orange-900/30 hover:border-orange-300 dark:hover:border-orange-600/50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className="relative">
                            <div 
                              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg"
                              style={{ backgroundColor: option.backgroundColor }}
                            >
                              {option.serviceName.charAt(0)}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                              {option.serviceName}
                            </h3>
                            <p className="text-base text-gray-600 dark:text-gray-300 mb-2 font-medium">
                              {option.serviceType}
                            </p>
                            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                                <Clock className="w-4 h-4 text-orange-500" />
                                <span className="font-medium">{option.estimatedPickupTime} min</span>
                              </div>
                              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                                <MapPin className="w-4 h-4 text-blue-500" />
                                <span className="font-medium">{option.estimatedDistance.toFixed(1)} km</span>
                              </div>
                              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                                <Clock className="w-4 h-4 text-green-500" />
                                <span className="font-medium">{option.estimatedTripTime} min</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-black bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent dark:from-green-400 dark:to-green-300 mb-2">
                            £{option.price.toFixed(2)}
                          </div>
                          {option.tag && (
                            <Badge 
                              variant={option.tag.type === 'success' ? 'default' : 'secondary'} 
                              className={`mb-3 px-3 py-1 font-semibold ${
                                option.tag.type === 'success' 
                                  ? 'bg-green-100 text-green-800 border-green-300' 
                                  : 'bg-orange-100 text-orange-800 border-orange-300'
                              }`}
                            >
                              {option.tag.text}
                            </Badge>
                          )}
                          <Button
                            onClick={() => handleBookRide(option)}
                            className="w-full bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 hover:from-orange-700 hover:via-orange-600 hover:to-yellow-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                          >
                            Book Ride
                            <ExternalLink className="w-5 h-5 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* No Approved Partners Available */}
            {Array.isArray(rideOptions) && rideOptions.length === 0 && !ridesLoading && !ridesError && (
              <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-2 border-orange-200 dark:border-orange-700/50 shadow-xl">
                <CardContent className="p-12 text-center">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                      <Users className="h-10 w-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white">
                      <span className="text-white font-bold text-xs">!</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                    Building Our Partner Network
                  </h3>
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 max-w-md mx-auto">
                    We're actively onboarding professional taxi companies in your area. Great options are coming soon!
                  </p>
                  <div className="bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-orange-800/30 dark:to-yellow-800/30 p-6 rounded-2xl text-gray-800 dark:text-gray-200 border border-orange-200 dark:border-orange-600/30">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">?</span>
                      </div>
                      <p className="text-lg font-bold">Run a taxi company?</p>
                    </div>
                    <p className="mb-4 text-base">Join Farezy to reach thousands of customers and grow your business with our smart booking platform.</p>
                    <Button
                      onClick={() => window.location.href = '/partner-signup'}
                      className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:from-orange-700 hover:to-yellow-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Become a Partner
                      <ExternalLink className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Instructions */}
        {!pickup || !destination ? (
          <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-2 border-orange-200 dark:border-orange-700/50 shadow-xl">
            <CardContent className="p-10 text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                Ready to Compare Rides?
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-md mx-auto">
                Enter your pickup and destination locations above to see real-time prices from our approved taxi partners.
              </p>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Clock, MapPin, Car, User, Phone, Star, Navigation } from "lucide-react";
import LocationAutocomplete from "@/components/location-autocomplete";
import { apiRequest } from "@/lib/queryClient";

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface Driver {
  id: number;
  firstName: string;
  lastName: string;
  rating: string;
  totalRides: number;
  profileImageUrl?: string;
}

interface Vehicle {
  id: number;
  make: string;
  model: string;
  color: string;
  licensePlate: string;
  vehicleType: string;
  capacity: number;
}

interface Quote {
  id: number;
  quotedPrice: string;
  estimatedArrival: number;
  estimatedDuration: number;
  validUntil: string;
  driver?: Driver;
  vehicle?: Vehicle;
}

interface RideRequest {
  id: number;
  status: string;
  pickupLat: string;
  pickupLng: string;
  pickupAddress: string;
  destinationLat: string;
  destinationLng: string;
  destinationAddress: string;
  rideType: string;
  customerName: string;
  customerPhone: string;
  estimatedDistance?: string;
  estimatedDuration?: number;
  maxPrice?: string;
  notes?: string;
}

export function BookRide() {
  const [pickup, setPickup] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [rideType, setRideType] = useState("standard");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [currentRequest, setCurrentRequest] = useState<RideRequest | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [quotesRefreshInterval, setQuotesRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch quotes for current ride request
  const { data: quotesData, isLoading: quotesLoading, refetch: refetchQuotes } = useQuery({
    queryKey: ['/api/rides/quotes', currentRequest?.id],
    enabled: !!currentRequest?.id,
    refetchInterval: 3000, // Refresh quotes every 3 seconds
  });

  const quotes = Array.isArray(quotesData) ? quotesData : [];

  // Request ride mutation
  const requestRideMutation = useMutation({
    mutationFn: async (rideData: any) => {
      const response = await fetch('/api/rides/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rideData),
      });
      if (!response.ok) {
        throw new Error('Failed to request ride');
      }
      return response.json();
    },
    onSuccess: (data) => {
      setCurrentRequest(data.rideRequest);
      toast({
        title: "Ride Requested",
        description: `Found ${data.quotes?.length || 0} available drivers nearby`,
      });
    },
    onError: (error) => {
      toast({
        title: "Request Failed",
        description: "Could not find nearby drivers. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Accept quote mutation
  const acceptQuoteMutation = useMutation({
    mutationFn: async (quoteId: number) => {
      const response = await fetch(`/api/rides/accept/${quoteId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to accept quote');
      }
      return response.json();
    },
    onSuccess: (data) => {
      setSelectedQuote(data.quote);
      toast({
        title: "Ride Confirmed!",
        description: "Your driver is on the way. You'll receive updates soon.",
      });
      // Stop refreshing quotes
      if (quotesRefreshInterval) {
        clearInterval(quotesRefreshInterval);
        setQuotesRefreshInterval(null);
      }
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: "This quote is no longer available. Please select another.",
        variant: "destructive",
      });
      refetchQuotes();
    },
  });

  const handleRequestRide = () => {
    if (!pickup || !destination || !customerName || !customerPhone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Calculate estimated distance (simple calculation)
    const distance = calculateDistance(pickup.lat, pickup.lng, destination.lat, destination.lng);
    const estimatedDuration = Math.max(Math.round(distance * 3), 10); // ~3 minutes per km

    const rideData = {
      customerName,
      customerPhone,
      pickupLat: pickup.lat.toString(),
      pickupLng: pickup.lng.toString(),
      pickupAddress: pickup.address,
      destinationLat: destination.lat.toString(),
      destinationLng: destination.lng.toString(),
      destinationAddress: destination.address,
      rideType,
      estimatedDistance: distance.toFixed(1),
      estimatedDuration,
      notes: notes || null,
    };

    requestRideMutation.mutate(rideData);
  };

  const handleAcceptQuote = (quote: Quote) => {
    acceptQuoteMutation.mutate(quote.id);
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const formatTimeRemaining = (validUntil: string): string => {
    const now = new Date().getTime();
    const expiry = new Date(validUntil).getTime();
    const remaining = Math.max(0, Math.floor((expiry - now) / 1000));
    
    if (remaining <= 0) return "Expired";
    
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    
    if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${seconds}s`;
  };

  const resetBooking = () => {
    setCurrentRequest(null);
    setSelectedQuote(null);
    setPickup(null);
    setDestination(null);
    setCustomerName("");
    setCustomerPhone("");
    setNotes("");
    if (quotesRefreshInterval) {
      clearInterval(quotesRefreshInterval);
      setQuotesRefreshInterval(null);
    }
  };

  // Show ride confirmation if quote is selected
  if (selectedQuote && currentRequest) {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-6 w-6 text-green-600" />
              Ride Confirmed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-2">
                £{selectedQuote.quotedPrice}
              </div>
              <p className="text-gray-600">Your driver is on the way!</p>
            </div>

            {selectedQuote.driver && (
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">
                    {selectedQuote.driver.firstName} {selectedQuote.driver.lastName}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Star className="h-4 w-4 fill-current text-yellow-400" />
                    {selectedQuote.driver.rating} • {selectedQuote.driver.totalRides} rides
                  </div>
                </div>
              </div>
            )}

            {selectedQuote.vehicle && (
              <div className="p-4 border rounded-lg">
                <div className="font-semibold text-gray-900">
                  {selectedQuote.vehicle.color} {selectedQuote.vehicle.make} {selectedQuote.vehicle.model}
                </div>
                <div className="text-sm text-gray-600">
                  {selectedQuote.vehicle.licensePlate} • {selectedQuote.vehicle.capacity} seats
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-green-600" />
                <span className="font-medium">Pickup:</span>
                <span className="text-gray-600">{currentRequest.pickupAddress}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Navigation className="h-4 w-4 text-red-600" />
                <span className="font-medium">Destination:</span>
                <span className="text-gray-600">{currentRequest.destinationAddress}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              Estimated arrival: {selectedQuote.estimatedArrival} minutes
            </div>

            <Button onClick={resetBooking} variant="outline" className="w-full">
              Book Another Ride
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show quotes if we have a current request
  if (currentRequest && quotes) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-6 w-6" />
              Available Rides
            </CardTitle>
            <p className="text-sm text-gray-600">
              Showing {quotes.length} quote{quotes.length !== 1 ? 's' : ''} from nearby drivers
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {quotes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Car className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No drivers available right now</p>
                <p className="text-sm">Please try again in a few minutes</p>
                <Button onClick={resetBooking} variant="outline" className="mt-4">
                  Try Different Location
                </Button>
              </div>
            ) : (
              <>
                {quotes.map((quote: Quote) => (
                  <Card key={quote.id} className="border-2 hover:border-blue-200 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <div className="text-2xl font-bold text-green-600">
                              £{quote.quotedPrice}
                            </div>
                            <Badge variant="secondary">
                              {formatTimeRemaining(quote.validUntil)} left
                            </Badge>
                          </div>
                          
                          {quote.driver && (
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-gray-600" />
                              </div>
                              <div>
                                <div className="font-medium text-sm">
                                  {quote.driver.firstName} {quote.driver.lastName}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                  <Star className="h-3 w-3 fill-current text-yellow-400" />
                                  {quote.driver.rating} • {quote.driver.totalRides} rides
                                </div>
                              </div>
                            </div>
                          )}

                          {quote.vehicle && (
                            <div className="text-sm text-gray-600 mb-2">
                              {quote.vehicle.color} {quote.vehicle.make} {quote.vehicle.model}
                              <span className="ml-2">• {quote.vehicle.capacity} seats</span>
                            </div>
                          )}

                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {quote.estimatedArrival} min pickup
                            </div>
                            <div className="flex items-center gap-1">
                              <Navigation className="h-4 w-4" />
                              {quote.estimatedDuration} min trip
                            </div>
                          </div>
                        </div>

                        <Button 
                          onClick={() => handleAcceptQuote(quote)}
                          disabled={acceptQuoteMutation.isPending}
                          className="ml-4"
                        >
                          {acceptQuoteMutation.isPending ? "Booking..." : "Book Now"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <div className="flex gap-2 pt-4">
                  <Button onClick={resetBooking} variant="outline" className="flex-1">
                    Cancel Request
                  </Button>
                  <Button onClick={() => refetchQuotes()} variant="outline">
                    Refresh Quotes
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show initial booking form
  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-6 w-6" />
            Book a Ride
          </CardTitle>
          <p className="text-gray-600">Get instant quotes from nearby drivers</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="pickup">Pickup Location *</Label>
              <LocationAutocomplete
                placeholder="Enter pickup address..."
                onLocationSelect={(location) => setPickup({
                  lat: 51.5074, // Default to London coordinates for demo
                  lng: -0.1278,
                  address: location.fullAddress
                })}
                value={pickup?.address || ""}
                onChange={() => {}}
              />
            </div>

            <div>
              <Label htmlFor="destination">Destination *</Label>
              <LocationAutocomplete
                placeholder="Enter destination address..."
                onLocationSelect={(location) => setDestination({
                  lat: 51.5074, // Default to London coordinates for demo
                  lng: -0.1278,
                  address: location.fullAddress
                })}
                value={destination?.address || ""}
                onChange={() => {}}
              />
            </div>
          </div>

          <Separator />

          <div className="grid gap-4">
            <div>
              <Label htmlFor="rideType">Ride Type</Label>
              <Select value={rideType} onValueChange={setRideType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="xl">XL (6+ seats)</SelectItem>
                  <SelectItem value="wheelchair">Wheelchair Accessible</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName">Your Name *</Label>
                <Input
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <Label htmlFor="customerPhone">Phone Number *</Label>
                <Input
                  id="customerPhone"
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Enter your phone"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Special Notes (Optional)</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requests or notes for the driver"
              />
            </div>
          </div>

          <Button 
            onClick={handleRequestRide}
            disabled={requestRideMutation.isPending}
            className="w-full"
          >
            {requestRideMutation.isPending ? "Finding Drivers..." : "Find Available Rides"}
          </Button>

          {pickup && destination && (
            <div className="text-sm text-gray-600 text-center">
              Distance: ~{calculateDistance(pickup.lat, pickup.lng, destination.lat, destination.lng).toFixed(1)} km
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
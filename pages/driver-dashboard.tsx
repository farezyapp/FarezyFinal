import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { MapPin, Navigation, Clock, DollarSign, Star, Bell, Settings, LogOut } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Driver {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  rating: string;
  totalRides: number;
  currentLat: string | null;
  currentLng: string | null;
}

interface RideRequest {
  id: number;
  customerName: string;
  pickupAddress: string;
  destinationAddress: string;
  pickupLat: string;
  pickupLng: string;
  destinationLat: string;
  destinationLng: string;
  estimatedDistance: string;
  maxPrice: string;
  status: string;
  requestedAt: string;
}

export default function DriverDashboard() {
  const [isOnline, setIsOnline] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const { toast } = useToast();

  // Mock driver ID for demo - in real app this would come from auth
  const driverId = 1;

  // Get driver information
  const { data: driver, isLoading: driverLoading } = useQuery({
    queryKey: ['/api/drivers', driverId],
    enabled: !!driverId,
  });

  // Get pending ride requests
  const { data: rideRequests = [], refetch: refetchRides } = useQuery({
    queryKey: ['/api/rides/pending'],
  });

  // Update driver status
  const updateStatus = useMutation({
    mutationFn: async (status: string) => {
      return await apiRequest(`/api/drivers/${driverId}/status`, {
        method: "PUT",
        body: { status },
      });
    },
    onSuccess: () => {
      toast({
        title: "Status Updated",
        description: `You are now ${isOnline ? 'online' : 'offline'}`,
      });
    },
  });

  // Update driver location
  const updateLocation = useMutation({
    mutationFn: async (location: {lat: number, lng: number}) => {
      return await apiRequest(`/api/drivers/${driverId}/location`, {
        method: "POST",
        body: location,
      });
    },
  });

  // Accept ride request
  const acceptRide = useMutation({
    mutationFn: async (rideId: number) => {
      return await apiRequest(`/api/rides/${rideId}/status`, {
        method: "PUT",
        body: { status: 'accepted', driverId },
      });
    },
    onSuccess: () => {
      toast({
        title: "Ride Accepted",
        description: "Navigate to pickup location",
      });
      refetchRides();
    },
  });

  // Get current location
  useEffect(() => {
    if (navigator.geolocation && isOnline) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(location);
          updateLocation.mutate(location);
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [isOnline]);

  // Handle online/offline toggle
  const handleStatusToggle = (online: boolean) => {
    setIsOnline(online);
    updateStatus.mutate(online ? 'active' : 'offline');
  };

  if (driverLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Driver Dashboard</h1>
              <Badge variant={isOnline ? "default" : "secondary"}>
                {isOnline ? "Online" : "Offline"}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {isOnline ? "Available for rides" : "Not accepting rides"}
                </span>
                <Switch
                  checked={isOnline}
                  onCheckedChange={handleStatusToggle}
                />
              </div>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Driver Stats */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Today's Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Hours Online</span>
                  </div>
                  <span className="font-semibold">4.2h</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Navigation className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-600">Trips Completed</span>
                  </div>
                  <span className="font-semibold">8</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm text-gray-600">Earnings</span>
                  </div>
                  <span className="font-semibold">£142.50</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-gray-600">Rating</span>
                  </div>
                  <span className="font-semibold">4.8</span>
                </div>
              </CardContent>
            </Card>

            {/* Driver Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Driver Profile</CardTitle>
              </CardHeader>
              <CardContent>
                {driver && (
                  <div className="space-y-2">
                    <p className="font-semibold">{driver.firstName} {driver.lastName}</p>
                    <p className="text-sm text-gray-600">{driver.email}</p>
                    <p className="text-sm text-gray-600">{driver.phone}</p>
                    <div className="flex items-center space-x-2 mt-3">
                      <Badge variant="outline">
                        Total Rides: {driver.totalRides || 0}
                      </Badge>
                      <Badge variant="outline">
                        Rating: {driver.rating || "N/A"}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Location Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Location Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-red-600" />
                  <span className="text-sm">
                    {currentLocation 
                      ? `Lat: ${currentLocation.lat.toFixed(4)}, Lng: ${currentLocation.lng.toFixed(4)}`
                      : "Location not available"
                    }
                  </span>
                </div>
                {!isOnline && (
                  <p className="text-xs text-gray-500 mt-2">
                    Go online to start sharing your location
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Ride Requests */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Available Ride Requests</CardTitle>
                <CardDescription>
                  {isOnline 
                    ? "Accept rides to start earning" 
                    : "Go online to see available rides"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!isOnline ? (
                  <div className="text-center py-8">
                    <Navigation className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">You're currently offline</p>
                    <p className="text-sm text-gray-400">Toggle your status to start receiving ride requests</p>
                  </div>
                ) : rideRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No ride requests available</p>
                    <p className="text-sm text-gray-400">Stay online to receive ride requests in your area</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {rideRequests.map((ride: RideRequest) => (
                      <div key={ride.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold">{ride.customerName}</h3>
                            <p className="text-sm text-gray-600">
                              Requested {new Date(ride.requestedAt).toLocaleTimeString()}
                            </p>
                          </div>
                          <Badge variant="outline">
                            £{ride.maxPrice}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-start space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full mt-1"></div>
                            <div>
                              <p className="text-sm font-medium">Pickup</p>
                              <p className="text-sm text-gray-600">{ride.pickupAddress}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full mt-1"></div>
                            <div>
                              <p className="text-sm font-medium">Destination</p>
                              <p className="text-sm text-gray-600">{ride.destinationAddress}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            Distance: {ride.estimatedDistance} km
                          </div>
                          <Button 
                            onClick={() => acceptRide.mutate(ride.id)}
                            disabled={acceptRide.isPending}
                            size="sm"
                          >
                            {acceptRide.isPending ? "Accepting..." : "Accept Ride"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
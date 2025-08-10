import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Route, Clock, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

interface LocationBasedMapProps {
  userLocation: Location;
  destination?: Location;
  rideOptions?: any[];
  onLocationClick?: (location: Location) => void;
  className?: string;
}

export default function LocationBasedMap({
  userLocation,
  destination,
  rideOptions = [],
  onLocationClick,
  className = ""
}: LocationBasedMapProps) {
  const [distance, setDistance] = useState<number | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);

  // Calculate distance between two points using Haversine formula
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

  // Calculate route information
  useEffect(() => {
    if (userLocation && destination) {
      const dist = calculateDistance(
        userLocation.lat, 
        userLocation.lng, 
        destination.lat, 
        destination.lng
      );
      setDistance(dist);
      
      // Estimate time based on average city speed (25 km/h)
      const estimatedMinutes = Math.round((dist / 25) * 60);
      setEstimatedTime(estimatedMinutes);
    }
  }, [userLocation, destination]);

  return (
    <div className={`bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 ${className}`}>
      {/* Route Information Header */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Route Overview</h3>
        {distance && estimatedTime && (
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Route className="h-4 w-4" />
              {distance.toFixed(1)} km
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              ~{estimatedTime} min
            </div>
          </div>
        )}
      </div>

      {/* Location Cards */}
      <div className="space-y-4 mb-6">
        {/* Pickup Location */}
        <Card 
          className="border-green-200 bg-green-50 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onLocationClick?.(userLocation)}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <MapPin className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-green-900">Pickup Location</div>
                <div className="text-sm text-green-700">
                  {userLocation.address || `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`}
                </div>
                <div className="text-xs text-green-600 mt-1">
                  Current location
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Destination */}
        {destination && (
          <Card 
            className="border-blue-200 bg-blue-50 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onLocationClick?.(destination)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Navigation className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-blue-900">Destination</div>
                  <div className="text-sm text-blue-700">
                    {destination.address || `${destination.lat.toFixed(4)}, ${destination.lng.toFixed(4)}`}
                  </div>
                  {distance && (
                    <div className="text-xs text-blue-600 mt-1">
                      {distance.toFixed(1)} km away
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Available Rides */}
      {rideOptions.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 text-center">Available Rides</h4>
          {rideOptions.slice(0, 3).map((ride, index) => (
            <Card key={ride.id} className="border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: ride.color }}
                    >
                      <span className="text-white text-xs font-bold">
                        {ride.service.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">
                        {ride.service}
                      </div>
                      <div className="text-xs text-gray-600">
                        {ride.type} • {ride.time}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {ride.price}
                    </div>
                    {ride.tag && (
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        ride.tag.type === 'success' ? 'bg-green-100 text-green-700' :
                        ride.tag.type === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                        ride.tag.type === 'info' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {ride.tag.text}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Navigation Instructions */}
      <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
        <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
          <Navigation className="h-4 w-4" />
          Navigation Info
        </h5>
        <div className="text-sm text-gray-600 space-y-1">
          <div>• Head towards your destination</div>
          {distance && distance > 10 && <div>• Long distance trip - consider traffic conditions</div>}
          {distance && distance < 2 && <div>• Short trip - walking might be an option</div>}
          <div>• Live tracking available once ride starts</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-3">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => {
            navigator.geolocation?.getCurrentPosition((position) => {
              const newLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              };
              onLocationClick?.(newLocation);
            });
          }}
        >
          <MapPin className="h-4 w-4 mr-2" />
          Update Location
        </Button>
        
        {destination && (
          <Button 
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              // Open external navigation app
              const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${destination.lat},${destination.lng}`;
              window.open(url, '_blank');
            }}
          >
            <Navigation className="h-4 w-4 mr-2" />
            Navigate
          </Button>
        )}
      </div>
    </div>
  );
}
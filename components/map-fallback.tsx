import React from 'react';
import { MapPin, Navigation, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MapFallbackProps {
  userLocation?: { lat: number; lng: number; address?: string };
  destination?: { lat: number; lng: number; address?: string };
  error?: string;
  onRetry?: () => void;
  className?: string;
}

export default function MapFallback({ 
  userLocation, 
  destination, 
  error, 
  onRetry,
  className = ""
}: MapFallbackProps) {
  return (
    <div className={`bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 ${className}`}>
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="h-8 w-8 text-blue-600" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Map temporarily unavailable
        </h3>
        
        {error && (
          <div className="flex items-center justify-center gap-2 mb-4 text-amber-700">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}
        
        <p className="text-gray-600 mb-6">
          We're working to restore map services. You can still book rides using the location information below.
        </p>
        
        {/* Location Information Cards */}
        <div className="space-y-3 mb-6">
          {userLocation && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-green-900">Pickup Location</div>
                    <div className="text-sm text-green-700">
                      {userLocation.address || `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {destination && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Navigation className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-blue-900">Destination</div>
                    <div className="text-sm text-blue-700">
                      {destination.address || `${destination.lat.toFixed(4)}, ${destination.lng.toFixed(4)}`}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {onRetry && (
          <Button 
            onClick={onRetry}
            variant="outline"
            className="mb-4"
          >
            Try loading map again
          </Button>
        )}
        
        <p className="text-xs text-gray-500">
          Location services are still working normally. The visual map will be restored shortly.
        </p>
      </div>
    </div>
  );
}
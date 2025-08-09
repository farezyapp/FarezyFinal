import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from '@react-google-maps/api';
import MapFallback from './map-fallback';

// Define libraries outside the component to avoid reloading warning
const libraries: ('places' | 'geometry')[] = ['places', 'geometry'];

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

interface GoogleMapsWrapperProps {
  userLocation: Location;
  destination?: Location;
  onMapLoad?: (map: google.maps.Map) => void;
  className?: string;
  children?: React.ReactNode;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '8px',
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  gestureHandling: 'greedy',
};

export default function GoogleMapsWrapper({
  userLocation,
  destination,
  onMapLoad,
  className = "",
  children
}: GoogleMapsWrapperProps) {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [hasApiKey, setHasApiKey] = useState(true);

  // Check if API key is available
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    setHasApiKey(!!apiKey && apiKey.length > 0);
  }, []);

  // Load the Google Maps JavaScript API with error handling
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries,
    preventGoogleFontsLoading: true,
  });

  // Get directions between locations
  useEffect(() => {
    if (isLoaded && userLocation && destination) {
      const directionsService = new google.maps.DirectionsService();
      
      directionsService.route(
        {
          origin: userLocation,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING,
          avoidHighways: false,
          avoidTolls: false,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            setDirections(result);
          } else {
            console.warn(`Directions request failed: ${status}`);
          }
        }
      );
    }
  }, [isLoaded, userLocation, destination]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    window.location.reload();
  };

  // Show fallback if no API key is configured
  if (!hasApiKey) {
    return (
      <MapFallback 
        userLocation={userLocation}
        destination={destination}
        error="Google Maps API key is not configured"
        className={className}
      />
    );
  }

  // Handle API loading errors
  if (loadError) {
    const isAuthError = loadError.message?.includes('ApiNotActivatedMapError') || 
                       loadError.message?.includes('ApiProjectMapError') ||
                       loadError.message?.includes('403');
    
    const errorMessage = isAuthError 
      ? "Google Maps API authentication failed. Please check API key configuration."
      : `Maps loading error: ${loadError.message}`;

    return (
      <MapFallback 
        userLocation={userLocation}
        destination={destination}
        error={errorMessage}
        onRetry={retryCount < 2 ? handleRetry : undefined}
        className={className}
      />
    );
  }

  // Show loading state
  if (!isLoaded) {
    return (
      <div className={`bg-gray-50 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Loading map...</p>
        </div>
      </div>
    );
  }

  // Calculate map center
  const mapCenter = userLocation;

  return (
    <div className={className}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={14}
        options={mapOptions}
        onLoad={onMapLoad}
      >
        {/* User location marker */}
        <Marker
          position={userLocation}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: '#3B82F6',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2,
            scale: 8,
          }}
          title="Your location"
        />

        {/* Destination marker */}
        {destination && (
          <Marker
            position={destination}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: '#EF4444',
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 2,
              scale: 8,
            }}
            title="Destination"
          />
        )}

        {/* Directions renderer */}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: '#3B82F6',
                strokeWeight: 4,
                strokeOpacity: 0.8,
              },
            }}
          />
        )}

        {children}
      </GoogleMap>
    </div>
  );
}
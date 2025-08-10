import React, { useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer, InfoWindow } from '@react-google-maps/api';
import { Car, Navigation } from 'lucide-react';

// Define libraries outside the component to avoid reloading warning
const libraries: ('places')[] = ['places'];

interface Location {
  lat: number;
  lng: number;
}

interface GoogleMapComponentProps {
  userLocation: Location;
  destination?: Location;
  showDriverLocation?: boolean;
  className?: string;
}

// Default styles for the map
const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '8px',
};

// London center coordinates
const londonCenter = {
  lat: 51.5074,
  lng: -0.1278,
};

// Default zoom level
const defaultZoom = 14;

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
  userLocation,
  destination,
  showDriverLocation = false,
  className,
}) => {
  const [driverLocation, setDriverLocation] = useState<Location | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<'user' | 'driver' | 'destination' | null>(null);
  const [isDriverMoving, setIsDriverMoving] = useState(false);

  // Load the Google Maps JavaScript API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  // Simulate driver location when showDriverLocation is true
  useEffect(() => {
    if (showDriverLocation && userLocation) {
      // Generate a random point near the user location for the driver's initial position
      const initialDriverLocation = {
        lat: userLocation.lat + (Math.random() * 0.01 - 0.005),
        lng: userLocation.lng + (Math.random() * 0.01 - 0.005),
      };
      
      setDriverLocation(initialDriverLocation);
      
      // Simulate driver movement towards the user
      if (userLocation) {
        setIsDriverMoving(true);
        
        // Update driver location every few seconds to simulate movement
        const intervalId = setInterval(() => {
          setDriverLocation(prevLocation => {
            if (!prevLocation || !userLocation) return prevLocation;
            
            // Calculate direction vector towards user
            const dx = userLocation.lat - prevLocation.lat;
            const dy = userLocation.lng - prevLocation.lng;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // If driver is close enough to user, stop movement
            if (distance < 0.0005) {
              clearInterval(intervalId);
              setIsDriverMoving(false);
              return userLocation;
            }
            
            // Move driver towards user
            const step = 0.0003; // Movement speed
            const ratio = step / distance;
            
            return {
              lat: prevLocation.lat + dx * ratio,
              lng: prevLocation.lng + dy * ratio,
            };
          });
        }, 1000);
        
        return () => clearInterval(intervalId);
      }
    }
  }, [showDriverLocation, userLocation]);

  // Get directions if both user location and destination are available
  useEffect(() => {
    if (isLoaded && userLocation && destination) {
      const directionsService = new google.maps.DirectionsService();
      
      directionsService.route(
        {
          origin: userLocation,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`Error fetching directions: ${status}`);
          }
        }
      );
    }
  }, [isLoaded, userLocation, destination]);

  // Handle map load error
  if (loadError) {
    return (
      <div className="p-4 text-center bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-medium mb-2">Maps Temporarily Unavailable</h3>
        <p className="text-red-600 text-sm">
          {loadError.message || 'Unable to load Google Maps. Location services still work normally.'}
        </p>
      </div>
    );
  }

  // Show loading indicator while the Google Maps API is loading
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={`relative h-full w-full ${className || ''}`}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={userLocation || londonCenter}
        zoom={defaultZoom}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        }}
      >
        {/* User location marker with person icon */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="32" viewBox="0 0 24 32" fill="none">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7V9C15 9.6 14.6 10 14 10S13 9.6 13 9V7H11V9C11 9.6 10.4 10 10 10S9 9.6 9 9V7H3V9C3 10.2 4.2 11 5 11H8V22H10V16H14V22H16V11H19C19.8 11 21 10.2 21 9Z" fill="#3B82F6" stroke="#1E40AF" stroke-width="1"/>
                </svg>
              `),
              scaledSize: new google.maps.Size(32, 32),
            }}
            onClick={() => setSelectedMarker('user')}
          />
        )}

        {/* Driver location marker */}
        {showDriverLocation && driverLocation && (
          <Marker
            position={driverLocation}
            icon={{
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#FFCA28" stroke="#000000" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="6" width="20" height="12" rx="2" fill="#FFCA28" />
                  <circle cx="7" cy="18" r="2" fill="#333" />
                  <circle cx="17" cy="18" r="2" fill="#333" />
                  <path d="M2 11h20" stroke="#333" />
                </svg>
              `),
              scaledSize: new google.maps.Size(40, 40),
            }}
            animation={isDriverMoving ? google.maps.Animation.BOUNCE : undefined}
            onClick={() => setSelectedMarker('driver')}
          />
        )}

        {/* Destination marker */}
        {destination && (
          <Marker
            position={destination}
            icon={{
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#EF4444" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
                  <circle cx="12" cy="10" r="3" fill="white" />
                </svg>
              `),
              scaledSize: new google.maps.Size(40, 40),
            }}
            onClick={() => setSelectedMarker('destination')}
          />
        )}

        {/* Info windows for markers */}
        {selectedMarker === 'user' && userLocation && (
          <InfoWindow
            position={userLocation}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="p-1">
              <p className="text-sm font-medium">Your Location</p>
            </div>
          </InfoWindow>
        )}

        {selectedMarker === 'driver' && driverLocation && (
          <InfoWindow
            position={driverLocation}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="p-1">
              <p className="text-sm font-medium">Your Driver</p>
              <p className="text-xs text-gray-600">
                {isDriverMoving ? 'On the way to you' : 'Arrived'}
              </p>
            </div>
          </InfoWindow>
        )}

        {selectedMarker === 'destination' && destination && (
          <InfoWindow
            position={destination}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="p-1">
              <p className="text-sm font-medium">Destination</p>
            </div>
          </InfoWindow>
        )}

        {/* Directions renderer */}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              polylineOptions: {
                strokeColor: '#3B82F6',
                strokeWeight: 5,
                strokeOpacity: 0.7,
              },
              suppressMarkers: true,
            }}
          />
        )}
      </GoogleMap>
      
      {/* Map controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
        <button
          className="h-10 w-10 rounded-full bg-white shadow-lg flex items-center justify-center"
          onClick={() => {
            // Reset the map to center on user location
            if (userLocation) {
              const map = document.querySelector('div[aria-roledescription="map"]');
              if (map) {
                (map as any).__gm.setCenter(userLocation);
              }
            }
          }}
        >
          <Navigation className="h-5 w-5 text-gray-700" />
        </button>
      </div>
    </div>
  );
};

export default GoogleMapComponent;
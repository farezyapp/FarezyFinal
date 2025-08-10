import { useEffect, useRef, useState } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer, Circle, InfoWindow } from '@react-google-maps/api';
import { RideOption } from '@/types';

interface EnhancedMapProps {
  userLocation: { lat: number; lng: number };
  destination?: { lat: number; lng: number };
  rideOptions?: RideOption[];
  showTraffic?: boolean;
  showClusters?: boolean;
  onMapLoad?: (map: google.maps.Map) => void;
  className?: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'transit',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
  ],
};

export default function EnhancedMap({
  userLocation,
  destination,
  rideOptions = [],
  showTraffic = true,
  showClusters = false,
  onMapLoad,
  className
}: EnhancedMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [trafficLayer, setTrafficLayer] = useState<google.maps.TrafficLayer | null>(null);
  const [selectedRide, setSelectedRide] = useState<RideOption | null>(null);
  const [rideMarkers, setRideMarkers] = useState<Array<{
    position: google.maps.LatLng;
    ride: RideOption;
  }>>([]);

  // Custom marker icons for different ride services
  const getMarkerIcon = (serviceId: string) => {
    const iconColors = {
      uber: '#000000',
      lyft: '#FF00BF',
      taxi: '#FFD700',
      default: '#3B82F6'
    };
    
    const color = iconColors[serviceId as keyof typeof iconColors] || iconColors.default;
    
    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: color,
      fillOpacity: 0.8,
      strokeColor: '#FFFFFF',
      strokeWeight: 2,
      scale: 8,
    };
  };

  // Initialize map
  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    
    // Add traffic layer if enabled
    if (showTraffic) {
      const traffic = new google.maps.TrafficLayer();
      traffic.setMap(map);
      setTrafficLayer(traffic);
    }

    onMapLoad?.(map);
  };

  // Calculate and display directions
  useEffect(() => {
    if (!mapRef.current || !userLocation || !destination) return;

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
        if (status === 'OK' && result) {
          setDirections(result);
        }
      }
    );
  }, [userLocation, destination]);

  // Generate ride pickup locations around user
  useEffect(() => {
    if (!userLocation || !rideOptions.length) return;

    const markers = rideOptions.map((ride, index) => {
      // Generate positions in a small radius around user location
      const angle = (index * 2 * Math.PI) / rideOptions.length;
      const radius = 0.002; // Roughly 200 meters
      
      const lat = userLocation.lat + (radius * Math.cos(angle));
      const lng = userLocation.lng + (radius * Math.sin(angle));
      
      return {
        position: new google.maps.LatLng(lat, lng),
        ride
      };
    });

    setRideMarkers(markers);
  }, [userLocation, rideOptions]);

  // Fit map bounds to show all relevant points
  useEffect(() => {
    if (!mapRef.current) return;

    const bounds = new google.maps.LatLngBounds();
    bounds.extend(userLocation);
    
    if (destination) {
      bounds.extend(destination);
    }
    
    rideMarkers.forEach(marker => {
      bounds.extend(marker.position);
    });

    if (!bounds.isEmpty()) {
      mapRef.current.fitBounds(bounds);
      
      // Ensure minimum zoom level
      const listener = google.maps.event.addListenerOnce(mapRef.current, 'bounds_changed', () => {
        if (mapRef.current && mapRef.current.getZoom()! > 15) {
          mapRef.current.setZoom(15);
        }
      });
    }
  }, [userLocation, destination, rideMarkers]);

  return (
    <div className={className}>
      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}
        libraries={['places', 'geometry']}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={userLocation}
          zoom={13}
          options={mapOptions}
          onLoad={handleMapLoad}
        >
          {/* User location marker */}
          <Marker
            position={userLocation}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: '#4285F4',
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 3,
              scale: 10,
            }}
            title="Your location"
          />

          {/* User location accuracy circle */}
          <Circle
            center={userLocation}
            radius={100}
            options={{
              fillColor: '#4285F4',
              fillOpacity: 0.1,
              strokeColor: '#4285F4',
              strokeOpacity: 0.3,
              strokeWeight: 1,
            }}
          />

          {/* Destination marker */}
          {destination && (
            <Marker
              position={destination}
              icon={{
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                fillColor: '#EA4335',
                fillOpacity: 1,
                strokeColor: '#FFFFFF',
                strokeWeight: 2,
                scale: 8,
                rotation: 0,
              }}
              title="Destination"
            />
          )}

          {/* Ride option markers */}
          {rideMarkers.map((marker, index) => (
            <Marker
              key={`ride-${index}`}
              position={marker.position}
              icon={getMarkerIcon(marker.ride.serviceId)}
              title={`${marker.ride.serviceName} - $${marker.ride.price}`}
              onClick={() => setSelectedRide(marker.ride)}
            />
          ))}

          {/* Selected ride info window */}
          {selectedRide && (
            <InfoWindow
              position={rideMarkers.find(m => m.ride.id === selectedRide.id)?.position}
              onCloseClick={() => setSelectedRide(null)}
            >
              <div className="p-2 min-w-[200px]">
                <div className="flex items-center space-x-2 mb-2">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: selectedRide.backgroundColor }}
                  />
                  <span className="font-semibold">{selectedRide.serviceName}</span>
                </div>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Price:</span>
                    <span className="font-semibold">${selectedRide.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pickup:</span>
                    <span>{selectedRide.estimatedPickupTime} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Trip:</span>
                    <span>{selectedRide.estimatedTripTime} min</span>
                  </div>
                </div>
                {selectedRide.tag && (
                  <div className={`inline-block px-2 py-1 rounded text-xs mt-2 ${
                    selectedRide.tag.type === 'success' ? 'bg-green-100 text-green-800' :
                    selectedRide.tag.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    selectedRide.tag.type === 'error' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedRide.tag.text}
                  </div>
                )}
              </div>
            </InfoWindow>
          )}

          {/* Directions */}
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                suppressMarkers: true,
                polylineOptions: {
                  strokeColor: '#4285F4',
                  strokeWeight: 4,
                  strokeOpacity: 0.8,
                },
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
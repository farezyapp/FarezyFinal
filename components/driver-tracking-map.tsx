import React, { useEffect, useRef } from 'react';
import { Navigation, MapPin } from 'lucide-react';

interface DriverTrackingMapProps {
  userLocation: { lat: number; lng: number };
  driverLocation: { lat: number; lng: number } | null;
  className?: string;
}

const DriverTrackingMap: React.FC<DriverTrackingMapProps> = ({
  userLocation,
  driverLocation,
  className = ""
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const driverMarkerRef = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    // Initialize map
    mapInstanceRef.current = new google.maps.Map(mapRef.current, {
      center: userLocation,
      zoom: 16,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        }
      ],
      disableDefaultUI: true,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    });

    // Add user marker with person icon
    userMarkerRef.current = new google.maps.Marker({
      position: userLocation,
      map: mapInstanceRef.current,
      title: "Your Location",
      icon: {
        path: "M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7V9C15 9.6 14.6 10 14 10S13 9.6 13 9V7H11V9C11 9.6 10.4 10 10 10S9 9.6 9 9V7H3V9C3 10.2 4.2 11 5 11H8V22H10V16H14V22H16V11H19C19.8 11 21 10.2 21 9Z",
        fillColor: "#3B82F6",
        fillOpacity: 1,
        strokeColor: "#1E40AF",
        strokeWeight: 2,
        scale: 0.8,
        anchor: new google.maps.Point(12, 22)
      }
    });

    return () => {
      if (userMarkerRef.current) {
        userMarkerRef.current.setMap(null);
      }
      if (driverMarkerRef.current) {
        driverMarkerRef.current.setMap(null);
      }
    };
  }, [userLocation]);

  useEffect(() => {
    if (!mapInstanceRef.current || !driverLocation) return;

    // Update or create driver marker with smooth transition
    if (driverMarkerRef.current) {
      // Use smooth position updates
      driverMarkerRef.current.setPosition(driverLocation);
    } else {
      driverMarkerRef.current = new google.maps.Marker({
        position: driverLocation,
        map: mapInstanceRef.current,
        title: "Driver Location",
        icon: {
          path: "M18.92 6.01C18.72 5.42 18.16 5 17.5 5H6.5C5.84 5 5.28 5.42 5.08 6.01L3 12V20C3 20.55 3.45 21 4 21H5C5.55 21 6 20.55 6 20V19H18V20C18 20.55 18.45 21 19 21H20C20.55 21 21 20.55 21 20V12L18.92 6.01ZM6.5 16C5.67 16 5 15.33 5 14.5S5.67 13 6.5 13S8 13.67 8 14.5S7.33 16 6.5 16ZM17.5 16C16.67 16 16 15.33 16 14.5S16.67 13 17.5 13S19 13.67 19 14.5S18.33 16 17.5 16ZM5 11L6.5 6.5H17.5L19 11H5Z",
          fillColor: "#EAB308",
          fillOpacity: 1,
          strokeColor: "#A16207",
          strokeWeight: 2,
          scale: 0.8,
          anchor: new google.maps.Point(12, 21)
        }
      });
      
      // Only adjust bounds once when driver marker is first created
      if (userMarkerRef.current) {
        const bounds = new google.maps.LatLngBounds();
        bounds.extend(userLocation);
        bounds.extend(driverLocation);
        mapInstanceRef.current.fitBounds(bounds);
        
        // Set a reasonable zoom level
        const listener = google.maps.event.addListener(mapInstanceRef.current, 'bounds_changed', () => {
          if (mapInstanceRef.current!.getZoom()! > 16) {
            mapInstanceRef.current!.setZoom(16);
          }
          google.maps.event.removeListener(listener);
        });
      }
    }
  }, [driverLocation, userLocation]);

  if (!window.google) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-8">
          <Navigation className="h-8 w-8 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`}>
      <div ref={mapRef} className="w-full h-full min-h-[200px]" />
      
      {/* Map Legend */}
      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-sm">
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
            <span>You</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
            <span>Driver</span>
          </div>
        </div>
      </div>

      {/* Live indicator */}
      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-1"></div>
        LIVE
      </div>
    </div>
  );
};

export default DriverTrackingMap;
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Location, RouteInfo } from '@/types';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { Focus, Plus, Minus } from 'lucide-react';
import L from 'leaflet';
import 'leaflet-routing-machine';

// Custom marker icons
const createMarkerIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
            <div style="background-color: white; width: 8px; height: 8px; border-radius: 50%;"></div>
           </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

interface MapControlsProps {
  onLocate: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

const MapControls: React.FC<MapControlsProps> = ({ onLocate, onZoomIn, onZoomOut }) => {
  return (
    <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-[400]">
      <Button 
        variant="outline" 
        size="icon" 
        className="h-10 w-10 rounded-full bg-white shadow-lg"
        onClick={onLocate}
      >
        <Focus className="h-5 w-5" />
      </Button>
      <Button 
        variant="outline" 
        size="icon" 
        className="h-10 w-10 rounded-full bg-white shadow-lg"
        onClick={onZoomIn}
      >
        <Plus className="h-5 w-5" />
      </Button>
      <Button 
        variant="outline" 
        size="icon" 
        className="h-10 w-10 rounded-full bg-white shadow-lg"
        onClick={onZoomOut}
      >
        <Minus className="h-5 w-5" />
      </Button>
    </div>
  );
};

interface MapUpdaterProps {
  origin: Location | null;
  destination: Location | null;
  routeInfo?: RouteInfo;
}

const MapUpdater: React.FC<MapUpdaterProps> = ({ origin, destination, routeInfo }) => {
  const map = useMap();
  const routingControlRef = useRef<L.Routing.Control | null>(null);
  
  // Center map on origin when it changes
  useEffect(() => {
    if (origin) {
      map.setView([origin.lat, origin.lng], 14);
    }
  }, [map, origin]);
  
  // Update or create routing control when origin or destination changes
  useEffect(() => {
    if (origin && destination) {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }
      
      routingControlRef.current = L.Routing.control({
        waypoints: [
          L.latLng(origin.lat, origin.lng),
          L.latLng(destination.lat, destination.lng)
        ],
        routeWhileDragging: false,
        showAlternatives: false,
        fitSelectedRoutes: true,
        lineOptions: {
          styles: [{ color: '#3B82F6', weight: 5, opacity: 0.7 }]
        },
        createMarker: function() { return null; } // Don't show the default markers
      }).addTo(map);
      
      // Fit bounds to include both points with padding
      const bounds = L.latLngBounds(
        [origin.lat, origin.lng],
        [destination.lat, destination.lng]
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
    
    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }
    };
  }, [map, origin, destination]);
  
  return null;
};

interface MapViewProps {
  origin: Location | null;
  destination: Location | null;
  routeInfo?: RouteInfo;
  className?: string;
}

const MapView: React.FC<MapViewProps> = ({ 
  origin, 
  destination, 
  routeInfo,
  className 
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const [initialLocation, setInitialLocation] = useState<[number, number]>([40.7128, -74.0060]); // NYC default
  
  useEffect(() => {
    // Set initial map center based on origin if available
    if (origin) {
      setInitialLocation([origin.lat, origin.lng]);
    }
  }, [origin]);
  
  const handleLocate = () => {
    if (origin) {
      mapRef.current?.setView([origin.lat, origin.lng], 15);
    }
  };
  
  const handleZoomIn = () => {
    mapRef.current?.zoomIn();
  };
  
  const handleZoomOut = () => {
    mapRef.current?.zoomOut();
  };
  
  return (
    <div className={`relative h-full w-full ${className || ''}`}>
      <MapContainer
        center={initialLocation}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        attributionControl={false}
        whenCreated={(map) => { mapRef.current = map; }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {origin && (
          <Marker 
            position={[origin.lat, origin.lng]}
            icon={createMarkerIcon('#3B82F6')} // Primary blue
          >
            <Popup>
              <strong>Your location</strong>
              <br />
              {origin.address || 'Current location'}
            </Popup>
          </Marker>
        )}
        
        {destination && (
          <Marker 
            position={[destination.lat, destination.lng]}
            icon={createMarkerIcon('#EF4444')} // Red
          >
            <Popup>
              <strong>Destination</strong>
              <br />
              {destination.address || 'Selected destination'}
            </Popup>
          </Marker>
        )}
        
        <MapUpdater 
          origin={origin} 
          destination={destination}
          routeInfo={routeInfo}
        />
      </MapContainer>
      
      <MapControls
        onLocate={handleLocate}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />
    </div>
  );
};

export default MapView;

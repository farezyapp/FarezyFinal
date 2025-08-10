import { useState, useEffect } from 'react';

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

// Default location (London) if geolocation is not available
const DEFAULT_LOCATION: Location = {
  lat: 51.5074,
  lng: -0.1278,
  address: 'London, UK'
};

export const useLocation = () => {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get user's current location
  const getUserLocation = () => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setUserLocation(DEFAULT_LOCATION);
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: Location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        // Reverse geocode to get address (optional)
        reverseGeocode(location.lat, location.lng)
          .then(address => {
            setUserLocation({ ...location, address });
          })
          .catch(() => {
            setUserLocation(location);
          })
          .finally(() => {
            setIsLoading(false);
          });
      },
      (error) => {
        console.error('Error getting location:', error);
        setError('Unable to retrieve your location. Using default location.');
        setUserLocation(DEFAULT_LOCATION);
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  // Set destination by address
  const setDestinationByAddress = async (address: string): Promise<void> => {
    try {
      setIsLoading(true);
      const geocodedLocation = await geocodeAddress(address);
      if (geocodedLocation) {
        setDestination({
          lat: geocodedLocation.lat,
          lng: geocodedLocation.lng,
          address: address
        });
      } else {
        setError('Could not find that location');
      }
    } catch (error) {
      setError('Error setting destination');
      console.error('Error setting destination:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Geocode an address to coordinates
  const geocodeAddress = async (address: string): Promise<Location | null> => {
    try {
      const response = await fetch(`/api/location/geocode?address=${encodeURIComponent(address)}`);
      
      if (!response.ok) {
        throw new Error('Geocoding service failed');
      }
      
      const data = await response.json();
      return data.location;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  // Reverse geocode coordinates to address
  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(`/api/location/reverse-geocode?lat=${lat}&lng=${lng}`);
      
      if (!response.ok) {
        throw new Error('Reverse geocoding service failed');
      }
      
      const data = await response.json();
      return data.location.address || 'Unknown location';
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return 'Unknown location';
    }
  };

  // Initialize with user location
  useEffect(() => {
    getUserLocation();
  }, []);

  return {
    userLocation,
    destination,
    isLoading,
    error,
    getUserLocation,
    setDestinationByAddress,
    setDestination
  };
};
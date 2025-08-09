import { InsertLocation, Location } from '@shared/schema';
import { storage } from '../storage';

// Define location types
interface Coordinates {
  lat: number;
  lng: number;
}

interface LocationWithAddress extends Coordinates {
  address: string;
}

interface GeocodingResult {
  results: {
    formatted_address: string;
    geometry: {
      location: {
        lat: number;
        lng: number;
      }
    }
  }[];
  status: string;
}

class LocationService {
  /**
   * Convert an address into latitude and longitude
   */
  async geocodeAddress(address: string): Promise<LocationWithAddress | null> {
    try {
      // Google Maps API key from environment variables
      const apiKey = process.env.GOOGLE_MAPS_API_KEY;
      
      if (!apiKey) {
        console.error('Google Maps API key not configured');
        return null;
      }
      
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`Geocoding API request failed with status ${response.status}`);
      }
      
      const data = await response.json() as GeocodingResult;
      
      if (data.status !== 'OK' || !data.results.length) {
        console.error('No results found for address', address);
        return null;
      }
      
      const result = data.results[0];
      const location: LocationWithAddress = {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        address: result.formatted_address
      };
      
      // Save to storage
      await this.saveLocationToStorage(location);
      
      return location;
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  }

  /**
   * Convert latitude and longitude into an address
   */
  async reverseGeocode(lat: number, lng: number): Promise<LocationWithAddress | null> {
    try {
      // Check if we already have this location in storage
      const existingLocation = await storage.getLocationByCoordinates(lat, lng);
      
      if (existingLocation && existingLocation.address) {
        return {
          lat: existingLocation.latitude,
          lng: existingLocation.longitude,
          address: existingLocation.address
        };
      }
      
      // Google Maps API key from environment variables
      const apiKey = process.env.GOOGLE_MAPS_API_KEY;
      
      if (!apiKey) {
        console.error('Google Maps API key not configured');
        return null;
      }
      
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`Reverse geocoding API request failed with status ${response.status}`);
      }
      
      const data = await response.json() as GeocodingResult;
      
      if (data.status !== 'OK' || !data.results.length) {
        console.error('No results found for coordinates', lat, lng);
        return null;
      }
      
      const result = data.results[0];
      const location: LocationWithAddress = {
        lat,
        lng,
        address: result.formatted_address
      };
      
      // Save to storage
      await this.saveLocationToStorage(location);
      
      return location;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return null;
    }
  }

  /**
   * Save location to storage
   */
  private async saveLocationToStorage(location: LocationWithAddress): Promise<void> {
    try {
      const locationData: InsertLocation = {
        latitude: location.lat,
        longitude: location.lng,
        address: location.address
      };
      
      await storage.saveLocation(locationData);
    } catch (error) {
      console.error('Error saving location to storage:', error);
    }
  }
}

export const locationService = new LocationService();
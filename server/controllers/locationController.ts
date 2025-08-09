import { Request, Response } from 'express';
import { storage } from '../storage';
import { makeApiRequest } from '../utils/apiUtils';

// Define types for Google Maps API responses
interface GoogleMapsGeocodingResponse {
  status: string;
  results: Array<{
    formatted_address: string;
    geometry: {
      location: {
        lat: number;
        lng: number;
      }
    }
  }>;
}

/**
 * Geocode an address to coordinates
 * GET /api/location/geocode?address=123+Main+St
 */
export const geocodeAddress = async (req: Request, res: Response) => {
  try {
    const { address } = req.query;
    
    if (!address || typeof address !== 'string') {
      return res.status(400).json({ error: 'Address parameter is required' });
    }
    
    // First check if we have this location in storage
    // (implementation would be more sophisticated in a real app)
    
    // If not, use Google Maps Geocoding API
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'Google Maps API key is not configured' });
    }
    
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    
    const response = await makeApiRequest<GoogleMapsGeocodingResponse>(url);
    
    if (response.status === 'OK' && response.results && response.results.length > 0) {
      const result = response.results[0];
      const location = {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        address: result.formatted_address
      };
      
      // Save location to storage for future use
      await storage.saveLocation({
        latitude: location.lat,
        longitude: location.lng,
        address: location.address
      });
      
      return res.json({ location });
    } else {
      return res.status(404).json({ error: 'Location not found' });
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    return res.status(500).json({ error: 'Error geocoding address' });
  }
};

/**
 * Reverse geocode coordinates to an address
 * GET /api/location/reverse-geocode?lat=40.712&lng=-74.006
 */
export const reverseGeocode = async (req: Request, res: Response) => {
  try {
    const { lat, lng } = req.query;
    
    if (!lat || !lng || typeof lat !== 'string' || typeof lng !== 'string') {
      return res.status(400).json({ error: 'Latitude and longitude parameters are required' });
    }
    
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    
    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ error: 'Invalid latitude or longitude' });
    }
    
    // First check if we have this location in storage
    const existingLocation = await storage.getLocationByCoordinates(latitude, longitude);
    
    if (existingLocation && existingLocation.address) {
      return res.json({ 
        location: {
          lat: existingLocation.latitude,
          lng: existingLocation.longitude,
          address: existingLocation.address
        } 
      });
    }
    
    // If not, use Google Maps Geocoding API
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'Google Maps API key is not configured' });
    }
    
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
    
    const response = await makeApiRequest<GoogleMapsGeocodingResponse>(url);
    
    if (response.status === 'OK' && response.results && response.results.length > 0) {
      const result = response.results[0];
      const location = {
        lat: latitude,
        lng: longitude,
        address: result.formatted_address
      };
      
      // Save location to storage for future use
      await storage.saveLocation({
        latitude: location.lat,
        longitude: location.lng,
        address: location.address
      });
      
      return res.json({ location });
    } else {
      return res.status(404).json({ error: 'Address not found for these coordinates' });
    }
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return res.status(500).json({ error: 'Error reverse geocoding coordinates' });
  }
};
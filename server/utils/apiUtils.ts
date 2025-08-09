import fetch from 'node-fetch';

/**
 * Generic function to make API requests with proper error handling
 */
export async function makeApiRequest<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  try {
    // Create new options with headers to avoid merging issues
    const fetchOptions = {
      method: options.method || 'GET',
      body: options.body,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    };

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json() as T;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

/**
 * Calculate distance between two points using the Haversine formula
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLng = deg2rad(lng2 - lng1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  
  return distance;
}

/**
 * Convert degrees to radians
 */
function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Generate a random value within a range with a baseline
 */
export function randomInRange(
  min: number,
  max: number,
  baseline: number,
  variance: number
): number {
  // Calculate actual min and max based on baseline and variance
  const actualMin = Math.max(min, baseline - baseline * variance);
  const actualMax = Math.min(max, baseline + baseline * variance);
  
  return actualMin + Math.random() * (actualMax - actualMin);
}
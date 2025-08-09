export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface RideService {
  id: string;
  name: string;
  logo: string;
  backgroundColor: string;
  color: string;
}

export interface RideOption {
  id: string;
  serviceId: string;
  serviceName: string;
  serviceType: string;
  price: number;
  currency: string;
  estimatedPickupTime: number; // in minutes
  estimatedTripTime: number; // in minutes
  estimatedDistance: number; // in km/miles
  backgroundColor: string;
  color: string;
  logo?: string;
  tag?: {
    text: string;
    type: 'success' | 'warning' | 'info' | 'error' | 'neutral';
  };
}

export interface RouteInfo {
  origin: Location;
  destination: Location;
  distance: number;
  duration: number;
}

export type SortMode = 'price' | 'time';

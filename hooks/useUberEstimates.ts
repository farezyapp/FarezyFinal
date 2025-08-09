import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface UberEstimate {
  service: string;
  type: string;
  price: string;
  priceRange: {
    min: number;
    max: number;
  };
  currency: string;
  eta: number | null;
  duration: number;
  distance: number;
  surge: number | null;
  productId: string;
  bookingUrl: string;
}

interface UberProduct {
  product_id: string;
  description: string;
  display_name: string;
  capacity: number;
  image: string;
}

interface UberTimeEstimate {
  product_id: string;
  display_name: string;
  estimate: number;
}

export function useUberEstimates(
  startLat: number | null,
  startLng: number | null,
  endLat: number | null,
  endLng: number | null,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['/api/uber/estimates', startLat, startLng, endLat, endLng],
    queryFn: async () => {
      if (!startLat || !startLng || !endLat || !endLng) {
        throw new Error('Invalid coordinates');
      }
      
      const response = await apiRequest(
        `/api/uber/estimates?startLat=${startLat}&startLng=${startLng}&endLat=${endLat}&endLng=${endLng}`
      );
      return response.estimates as UberEstimate[];
    },
    enabled: enabled && !!startLat && !!startLng && !!endLat && !!endLng,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
  });
}

export function useUberProducts(lat: number | null, lng: number | null, enabled: boolean = true) {
  return useQuery({
    queryKey: ['/api/uber/products', lat, lng],
    queryFn: async () => {
      if (!lat || !lng) {
        throw new Error('Invalid coordinates');
      }
      
      const response = await apiRequest(`/api/uber/products?lat=${lat}&lng=${lng}`);
      return response.products as UberProduct[];
    },
    enabled: enabled && !!lat && !!lng,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}

export function useUberTimeEstimates(
  startLat: number | null,
  startLng: number | null,
  productId?: string,
  customerUuid?: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['/api/uber/time-estimates', startLat, startLng, productId, customerUuid],
    queryFn: async () => {
      if (!startLat || !startLng) {
        throw new Error('Invalid coordinates');
      }
      
      const params = new URLSearchParams({
        startLat: startLat.toString(),
        startLng: startLng.toString(),
      });
      
      if (productId) params.append('productId', productId);
      if (customerUuid) params.append('customerUuid', customerUuid);
      
      const response = await apiRequest(`/api/uber/time-estimates?${params.toString()}`);
      return response.timeEstimates as UberTimeEstimate[];
    },
    enabled: enabled && !!startLat && !!startLng,
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: 2,
  });
}
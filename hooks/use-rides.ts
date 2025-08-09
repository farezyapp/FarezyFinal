import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Location, RideOption, RouteInfo, SortMode } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export const useRides = () => {
  const [origin, setOrigin] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [selectedRide, setSelectedRide] = useState<RideOption | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>('price');
  const { toast } = useToast();

  // Clear selection when origin or destination changes
  useEffect(() => {
    setSelectedRide(null);
  }, [origin, destination]);

  // Route info query (distance, duration)
  const routeQuery = useQuery({
    queryKey: ['/api/directions', origin?.lat, origin?.lng, destination?.lat, destination?.lng],
    enabled: !!origin && !!destination,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Ride options query
  const ridesQuery = useQuery({
    queryKey: ['/api/rides', origin?.lat, origin?.lng, destination?.lat, destination?.lng, routeQuery.data?.distance, routeQuery.data?.duration],
    enabled: !!origin && !!destination && !!routeQuery.data,
    staleTime: 60 * 1000, // 1 minute
  });

  // Book ride mutation
  const bookRideMutation = useMutation({
    mutationFn: async (rideId: string) => {
      if (!selectedRide || !origin || !destination) {
        throw new Error('Missing required booking information');
      }
      
      return await apiRequest('POST', '/api/rides/book', {
        rideId,
        serviceId: selectedRide.serviceId,
        origin,
        destination,
      });
    },
    onSuccess: async (response) => {
      const data = await response.json();
      
      // If we have a URL to redirect to, open it
      if (data.redirectUrl) {
        window.open(data.redirectUrl, '_blank');
      }
      
      toast({
        title: 'Ride Booked!',
        description: `Your ${selectedRide?.serviceName} ride has been booked.`,
        variant: 'default',
      });
    },
    onError: (error) => {
      toast({
        title: 'Booking Failed',
        description: error.message || 'Could not book your ride. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const sortedRideOptions = (): RideOption[] => {
    if (!ridesQuery.data) return [];
    
    const options = [...ridesQuery.data];
    
    if (sortMode === 'price') {
      return options.sort((a, b) => a.price - b.price);
    } else {
      return options.sort((a, b) => a.estimatedPickupTime - b.estimatedPickupTime);
    }
  };

  const refreshRides = () => {
    if (origin && destination) {
      routeQuery.refetch();
      ridesQuery.refetch();
    }
  };

  const bookSelectedRide = async () => {
    if (!selectedRide) {
      toast({
        title: 'No Ride Selected',
        description: 'Please select a ride before booking.',
        variant: 'destructive',
      });
      return;
    }
    
    await bookRideMutation.mutateAsync(selectedRide.id);
  };

  return {
    origin,
    setOrigin,
    destination,
    setDestination,
    isLoadingRoute: routeQuery.isLoading,
    isLoadingRides: ridesQuery.isLoading,
    isBooking: bookRideMutation.isPending,
    routeInfo: routeQuery.data as RouteInfo | undefined,
    rideOptions: sortedRideOptions(),
    selectedRide,
    setSelectedRide,
    sortMode,
    setSortMode,
    refreshRides,
    bookSelectedRide,
    error: routeQuery.error || ridesQuery.error || bookRideMutation.error,
  };
};

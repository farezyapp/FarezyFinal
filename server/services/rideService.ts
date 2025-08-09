import { Service, CachedRide, PartnerApplication } from "@shared/schema";
import { Location, RideOption, RouteInfo } from "@/types";
import { storage } from "../storage";

class RideService {
  /**
   * Get route information between two locations
   */
  async getRouteInfo(origin: Location, destination: Location): Promise<RouteInfo> {
    try {
      // In a real application, this would call a directions API
      // For demonstration, we'll calculate a simple straight-line distance
      
      // Calculate distance using the Haversine formula
      const R = 6371; // Earth's radius in km
      const dLat = this.deg2rad(destination.lat - origin.lat);
      const dLng = this.deg2rad(destination.lng - origin.lng);
      
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(this.deg2rad(origin.lat)) * Math.cos(this.deg2rad(destination.lat)) * 
        Math.sin(dLng/2) * Math.sin(dLng/2);
      
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      
      // Estimate duration (60 km/h = 1 km/min on average)
      const duration = distance * 1.5; // in minutes
      
      return {
        origin,
        destination,
        distance,
        duration
      };
    } catch (error) {
      console.error("Error calculating route:", error);
      throw error;
    }
  }
  
  /**
   * Convert degrees to radians
   */
  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }
  
  /**
   * Get ride options from approved partners only
   */
  async getRideOptionsFromPartners(
    partners: PartnerApplication[],
    origin: Location,
    destination: Location,
    distance: number = 0,
    duration: number = 0
  ): Promise<RideOption[]> {
    try {
      // Calculate route if not provided
      let routeInfo: RouteInfo;
      if (distance === 0 || duration === 0) {
        routeInfo = await this.getRouteInfo(origin, destination);
      } else {
        routeInfo = {
          origin,
          destination,
          distance,
          duration
        };
      }
      
      const rideOptions: RideOption[] = [];
      
      // Generate options from approved partners
      for (const partner of partners) {
        // Calculate pricing based on partner's rates
        const baseRate = parseFloat(partner.baseRate.toString());
        const perKmRate = parseFloat(partner.perKmRate.toString());
        const totalPrice = baseRate + (routeInfo.distance * perKmRate);
        
        // Parse response time to estimate pickup time
        const avgResponseMinutes = this.parseResponseTime(partner.averageResponseTime);
        
        // Create options for each service type the partner offers
        for (const serviceType of partner.serviceTypes) {
          rideOptions.push({
            id: `${partner.id}-${serviceType}`,
            serviceId: partner.id.toString(),
            serviceName: partner.companyName,
            serviceType: serviceType,
            price: Math.round(totalPrice * 100) / 100, // Round to 2 decimal places
            currency: 'GBP',
            estimatedPickupTime: avgResponseMinutes,
            estimatedTripTime: Math.ceil(routeInfo.duration),
            estimatedDistance: routeInfo.distance,
            backgroundColor: '#f97316', // Farezy brand orange
            color: '#FFFFFF'
          });
        }
      }
      
      // Add tags for best options
      if (rideOptions.length > 0) {
        const lowestPrice = Math.min(...rideOptions.map(r => r.price));
        const fastestPickup = Math.min(...rideOptions.map(r => r.estimatedPickupTime));
        
        rideOptions.forEach(option => {
          if (option.price === lowestPrice) {
            option.tag = { text: 'Best Price', type: 'success' };
          } else if (option.estimatedPickupTime === fastestPickup) {
            option.tag = { text: 'Fastest', type: 'warning' };
          }
        });
      }
      
      return rideOptions.sort((a, b) => a.price - b.price); // Sort by price
    } catch (error) {
      console.error("Error getting ride options from partners:", error);
      throw error;
    }
  }
  
  /**
   * Parse response time string to minutes
   */
  private parseResponseTime(responseTime: string): number {
    // Convert strings like "5-10 minutes", "15 mins", "< 5 minutes" to average minutes
    const numbers = responseTime.match(/\d+/g);
    if (!numbers || numbers.length === 0) return 10; // Default fallback
    
    if (numbers.length === 1) {
      return parseInt(numbers[0]);
    } else if (numbers.length === 2) {
      // Range like "5-10", return average
      return Math.ceil((parseInt(numbers[0]) + parseInt(numbers[1])) / 2);
    }
    
    return parseInt(numbers[0]);
  }
  
  /**
   * Format cached rides into ride options response
   */
  async formatCachedRidesResponse(cachedRides: CachedRide[]): Promise<RideOption[]> {
    try {
      const rideOptions: RideOption[] = [];
      
      for (const ride of cachedRides) {
        const service = await storage.getServiceById(ride.serviceId);
        
        if (service) {
          let tag = undefined;
          
          // Determine if this is the lowest price or fastest pickup
          const lowestPrice = Math.min(...cachedRides.map(r => r.price));
          const fastestPickup = Math.min(...cachedRides.map(r => r.etaMinutes));
          
          if (ride.price === lowestPrice) {
            tag = {
              text: 'Lowest Price',
              type: 'success' as const
            };
          } else if (ride.etaMinutes === fastestPickup) {
            tag = {
              text: 'Fastest Pickup',
              type: 'warning' as const
            };
          }
          
          rideOptions.push({
            id: ride.rideType,
            serviceId: ride.serviceId.toString(),
            serviceName: service.name,
            serviceType: ride.rideType,
            price: ride.price,
            currency: ride.currency,
            estimatedPickupTime: ride.etaMinutes,
            estimatedTripTime: ride.durationMinutes,
            estimatedDistance: ride.distanceKm,
            backgroundColor: service.name === 'Uber' ? '#000000' : 
                             service.name === 'Lyft' ? '#FF00BF' :
                             service.name === 'Yellow Cab' ? '#FFC107' :
                             service.name === 'Executive' ? '#212121' : '#3B82F6',
            color: service.name === 'Yellow Cab' ? '#000000' : '#FFFFFF',
            logo: service.logo || undefined,
            tag
          });
        }
      }
      
      return rideOptions;
    } catch (error) {
      console.error("Error formatting cached rides:", error);
      throw error;
    }
  }
}

export const rideService = new RideService();

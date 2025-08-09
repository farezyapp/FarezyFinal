import { Service } from "@shared/schema";
import { RideOption, RouteInfo } from "@/types";
import { randomInRange } from "../utils/apiUtils";

/**
 * Generate ride options for the different services
 */
export function getMockRideOptions(
  services: Service[],
  routeInfo: RouteInfo
): RideOption[] {
  const rideOptions: RideOption[] = [];
  
  // Base price calculation: $2.50 base + $1.50 per km
  const basePrice = 2.5 + routeInfo.distance * 1.5;
  
  // Base pickup time: 3-5 minutes
  const basePickupTime = Math.floor(3 + Math.random() * 2);
  
  // Ride duration: Use the calculated duration from route info
  const baseDuration = Math.ceil(routeInfo.duration);
  
  for (const service of services) {
    // Different service types for each provider
    let serviceTypes: { type: string, priceMultiplier: number }[] = [];
    
    switch (service.name) {
      case "Uber":
        serviceTypes = [
          { type: "UberX", priceMultiplier: 1.0 },
          { type: "UberXL", priceMultiplier: 1.5 },
          { type: "Uber Black", priceMultiplier: 2.0 },
        ];
        break;
      case "Lyft":
        serviceTypes = [
          { type: "Lyft", priceMultiplier: 0.95 },
          { type: "Lyft XL", priceMultiplier: 1.45 },
          { type: "Lux", priceMultiplier: 1.9 },
        ];
        break;
      case "Yellow Cab":
        serviceTypes = [
          { type: "Taxi", priceMultiplier: 1.1 },
        ];
        break;
      case "City Cars":
        serviceTypes = [
          { type: "Standard", priceMultiplier: 1.05 },
          { type: "Premium", priceMultiplier: 1.6 },
        ];
        break;
      case "Executive":
        serviceTypes = [
          { type: "Business", priceMultiplier: 1.8 },
          { type: "Luxury", priceMultiplier: 2.5 },
        ];
        break;
      default:
        serviceTypes = [
          { type: "Standard", priceMultiplier: 1.0 },
        ];
    }
    
    for (const serviceType of serviceTypes) {
      // Calculate price with some randomness
      const price = randomInRange(basePrice * serviceType.priceMultiplier, 10);
      
      // Calculate estimated pickup time with some randomness per service
      const pickupTimeVariance = 
        service.name === "Uber" ? 0 :
        service.name === "Lyft" ? -1 :
        service.name === "Yellow Cab" ? 2 :
        service.name === "City Cars" ? 1 :
        service.name === "Executive" ? 3 : 0;
      
      const estimatedPickupTime = Math.max(1, basePickupTime + pickupTimeVariance + Math.floor(Math.random() * 3 - 1));
      
      // Calculate trip time with some randomness
      const estimatedTripTime = Math.max(1, Math.floor(baseDuration * (1 + (Math.random() * 0.2 - 0.1))));
      
      // Determine background color based on service
      const backgroundColor =
        service.name === "Uber" ? "#000000" :
        service.name === "Lyft" ? "#FF00BF" :
        service.name === "Yellow Cab" ? "#FFC107" :
        service.name === "City Cars" ? "#2962FF" :
        service.name === "Executive" ? "#212121" : "#3B82F6";
      
      // Determine text color based on background
      const color =
        service.name === "Yellow Cab" ? "#000000" : "#FFFFFF";
      
      // Determine if this is lowest price or fastest pickup
      let tag = undefined;
      
      // Will be properly set later when all options are calculated
      
      rideOptions.push({
        id: serviceType.type,
        serviceId: service.id.toString(),
        serviceName: service.name,
        serviceType: serviceType.type,
        price: parseFloat(price.toFixed(2)),
        currency: "GBP",
        estimatedPickupTime,
        estimatedTripTime,
        estimatedDistance: parseFloat(routeInfo.distance.toFixed(1)),
        backgroundColor,
        color,
        logo: service.logo || undefined,
        tag
      });
    }
  }
  
  // Find lowest price and fastest pickup
  const lowestPrice = Math.min(...rideOptions.map(r => r.price));
  const fastestPickup = Math.min(...rideOptions.map(r => r.estimatedPickupTime));
  
  // Add tags
  return rideOptions.map(ride => {
    if (ride.price === lowestPrice) {
      return {
        ...ride,
        tag: {
          text: "Lowest Price",
          type: "success" as const
        }
      };
    } else if (ride.estimatedPickupTime === fastestPickup) {
      return {
        ...ride,
        tag: {
          text: "Fastest Pickup",
          type: "warning" as const
        }
      };
    }
    return ride;
  });
}

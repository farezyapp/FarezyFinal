import express from "express";
import { storage } from "../storage";
import { rideService } from "../services/rideService";
import { z } from "zod";
import { insertBookingHistorySchema } from "@shared/schema";

const router = express.Router();

/**
 * Get ride options for a route
 * GET /api/rides?originLat=40.712&originLng=-74.006&destLat=40.758&destLng=-73.985
 */
router.get("/", async (req, res) => {
  try {
    const originLat = parseFloat(req.query.originLat as string);
    const originLng = parseFloat(req.query.originLng as string);
    const destLat = parseFloat(req.query.destLat as string);
    const destLng = parseFloat(req.query.destLng as string);
    const distance = parseFloat(req.query.distance as string) || 0;
    const duration = parseFloat(req.query.duration as string) || 0;
    
    if (isNaN(originLat) || isNaN(originLng) || isNaN(destLat) || isNaN(destLng)) {
      return res.status(400).json({ 
        error: "Valid origin and destination coordinates are required" 
      });
    }
    
    // Check if we have cached rides for these coordinates
    const cachedRides = await storage.getCachedRides(originLat, originLng, destLat, destLng);
    
    if (cachedRides.length > 0) {
      const rideOptions = await rideService.formatCachedRidesResponse(cachedRides);
      return res.json(rideOptions);
    }
    
    // Get approved partner companies only
    const approvedPartners = await storage.getApprovedPartners();
    
    // Only show results if there are approved partners
    if (approvedPartners.length === 0) {
      return res.json([]);
    }
    
    // Fetch ride options from approved partners only
    const rideOptions = await rideService.getRideOptionsFromPartners(
      approvedPartners, 
      { lat: originLat, lng: originLng },
      { lat: destLat, lng: destLng },
      distance,
      duration
    );
    
    // Cache the results from approved partners
    for (const ride of rideOptions) {
      const partner = await storage.getPartnerApplicationById(parseInt(ride.serviceId));
      
      if (partner) {
        // Calculate expiration time (15 minutes from now)
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 15);
        
        await storage.saveCachedRide({
          originLat,
          originLng,
          destLat,
          destLng,
          serviceId: parseInt(ride.serviceId),
          rideType: ride.serviceType,
          price: ride.price,
          currency: ride.currency,
          etaMinutes: ride.estimatedPickupTime,
          durationMinutes: ride.estimatedTripTime,
          distanceKm: ride.estimatedDistance,
          expiresAt,
        });
      }
    }
    
    // Log the search to history
    const originLocation = await storage.getLocationByCoordinates(originLat, originLng);
    const destLocation = await storage.getLocationByCoordinates(destLat, destLng);
    
    await storage.saveSearchHistory({
      originAddress: originLocation?.address || "Unknown location",
      originLat,
      originLng,
      destAddress: destLocation?.address || "Unknown destination",
      destLat,
      destLng,
    });
    
    return res.json(rideOptions);
  } catch (error) {
    console.error("Error fetching ride options:", error);
    return res.status(500).json({ error: "Failed to fetch ride options" });
  }
});

/**
 * Get directions/routes between origin and destination
 * GET /api/directions?originLat=40.712&originLng=-74.006&destLat=40.758&destLng=-73.985
 */
router.get("/directions", async (req, res) => {
  try {
    const originLat = parseFloat(req.query.originLat as string);
    const originLng = parseFloat(req.query.originLng as string);
    const destLat = parseFloat(req.query.destLat as string);
    const destLng = parseFloat(req.query.destLng as string);
    
    if (isNaN(originLat) || isNaN(originLng) || isNaN(destLat) || isNaN(destLng)) {
      return res.status(400).json({ 
        error: "Valid origin and destination coordinates are required" 
      });
    }
    
    const routeInfo = await rideService.getRouteInfo(
      { lat: originLat, lng: originLng },
      { lat: destLat, lng: destLng }
    );
    
    return res.json(routeInfo);
  } catch (error) {
    console.error("Error fetching directions:", error);
    return res.status(500).json({ error: "Failed to fetch directions" });
  }
});

/**
 * Book a ride
 * POST /api/rides/book
 */
router.post("/book", async (req, res) => {
  try {
    const bookingSchema = z.object({
      rideId: z.string(),
      serviceId: z.string(),
      origin: z.object({
        lat: z.number(),
        lng: z.number(),
        address: z.string().optional(),
      }),
      destination: z.object({
        lat: z.number(),
        lng: z.number(),
        address: z.string().optional(),
      }),
    });
    
    const validatedBody = bookingSchema.parse(req.body);
    
    // Get the service
    const service = await storage.getServiceById(parseInt(validatedBody.serviceId));
    
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }
    
    // In a real application, this would make an API call to the service to book the ride
    // Here, we'll just record the booking and return a success response
    
    // Get addresses for origin and destination if not provided
    let originAddress = validatedBody.origin.address;
    let destAddress = validatedBody.destination.address;
    
    if (!originAddress) {
      const originLocation = await storage.getLocationByCoordinates(
        validatedBody.origin.lat, 
        validatedBody.origin.lng
      );
      originAddress = originLocation?.address || "Unknown origin";
    }
    
    if (!destAddress) {
      const destLocation = await storage.getLocationByCoordinates(
        validatedBody.destination.lat, 
        validatedBody.destination.lng
      );
      destAddress = destLocation?.address || "Unknown destination";
    }
    
    // Get price and ride type info from the cached rides if available
    const cachedRides = await storage.getCachedRides(
      validatedBody.origin.lat,
      validatedBody.origin.lng,
      validatedBody.destination.lat,
      validatedBody.destination.lng
    );
    
    // Find the specific ride service type that was selected
    const matchingRide = cachedRides.find(ride => 
      ride.serviceId === parseInt(validatedBody.serviceId) && 
      ride.rideType === validatedBody.rideId
    );
    
    // Create booking record
    await storage.saveBooking({
      serviceId: parseInt(validatedBody.serviceId),
      rideType: validatedBody.rideId,
      price: matchingRide?.price || 0,
      currency: matchingRide?.currency || "USD",
      originAddress: originAddress,
      originLat: validatedBody.origin.lat,
      originLng: validatedBody.origin.lng,
      destAddress: destAddress,
      destLat: validatedBody.destination.lat,
      destLng: validatedBody.destination.lng,
      status: "pending",
    });
    
    // Generate a deep link or booking URL if the service has one
    let redirectUrl = null;
    if (service.deepLink) {
      redirectUrl = `${service.deepLink}?pickup[latitude]=${validatedBody.origin.lat}&pickup[longitude]=${validatedBody.origin.lng}&dropoff[latitude]=${validatedBody.destination.lat}&dropoff[longitude]=${validatedBody.destination.lng}`;
    }
    
    return res.json({
      success: true,
      message: `Booking created for ${service.name}`,
      redirectUrl,
    });
  } catch (error) {
    console.error("Error booking ride:", error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid request format", details: error.errors });
    }
    
    return res.status(500).json({ error: "Failed to book ride" });
  }
});

export default router;

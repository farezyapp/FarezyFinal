import { pgTable, text, serial, integer, boolean, doublePrecision, timestamp, jsonb, varchar, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Locations table
export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  address: text("address").notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLocationSchema = createInsertSchema(locations).omit({
  id: true,
  createdAt: true,
});

// Services table - ride services like Uber, Lyft, etc.
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  logo: text("logo"),
  deepLink: text("deep_link"),
  apiEndpoint: text("api_endpoint"),
  apiType: text("api_type").notNull(), // uber, lyft, generic, etc.
  enabled: boolean("enabled").default(true).notNull(),
  credentials: jsonb("credentials"),
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
});

// Cached results for faster responses and for when APIs are unavailable
export const cachedRides = pgTable("cached_rides", {
  id: serial("id").primaryKey(),
  originLat: doublePrecision("origin_lat").notNull(),
  originLng: doublePrecision("origin_lng").notNull(),
  destLat: doublePrecision("dest_lat").notNull(),
  destLng: doublePrecision("dest_lng").notNull(),
  serviceId: integer("service_id").notNull(),
  rideType: text("ride_type").notNull(), // UberX, Lyft, etc.
  price: doublePrecision("price").notNull(),
  currency: text("currency").default("USD").notNull(),
  etaMinutes: integer("eta_minutes").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  distanceKm: doublePrecision("distance_km").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(), // When this cache entry expires
});

export const insertCachedRideSchema = createInsertSchema(cachedRides).omit({
  id: true,
});

// User search history
export const searchHistory = pgTable("search_history", {
  id: serial("id").primaryKey(),
  originAddress: text("origin_address").notNull(),
  originLat: doublePrecision("origin_lat").notNull(),
  originLng: doublePrecision("origin_lng").notNull(),
  destAddress: text("dest_address").notNull(),
  destLat: doublePrecision("dest_lat").notNull(),
  destLng: doublePrecision("dest_lng").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertSearchHistorySchema = createInsertSchema(searchHistory).omit({
  id: true,
  timestamp: true,
});

// Booking history
export const bookingHistory = pgTable("booking_history", {
  id: serial("id").primaryKey(),
  serviceId: integer("service_id").notNull(),
  rideType: text("ride_type").notNull(),
  price: doublePrecision("price").notNull(),
  currency: text("currency").default("USD").notNull(),
  originAddress: text("origin_address").notNull(),
  originLat: doublePrecision("origin_lat").notNull(),
  originLng: doublePrecision("origin_lng").notNull(),
  destAddress: text("dest_address").notNull(),
  destLat: doublePrecision("dest_lat").notNull(),
  destLng: doublePrecision("dest_lng").notNull(),
  bookingTimestamp: timestamp("booking_timestamp").defaultNow().notNull(),
  status: text("status").default("pending").notNull(), // pending, completed, cancelled
});

export const insertBookingHistorySchema = createInsertSchema(bookingHistory).omit({
  id: true,
  bookingTimestamp: true,
});

// Export types
export type Location = typeof locations.$inferSelect;
export type InsertLocation = z.infer<typeof insertLocationSchema>;

export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;

export type CachedRide = typeof cachedRides.$inferSelect;
export type InsertCachedRide = z.infer<typeof insertCachedRideSchema>;

export type SearchHistory = typeof searchHistory.$inferSelect;
export type InsertSearchHistory = z.infer<typeof insertSearchHistorySchema>;

export type BookingHistory = typeof bookingHistory.$inferSelect;
export type InsertBookingHistory = z.infer<typeof insertBookingHistorySchema>;

// Ride Analytics table
export const rideAnalytics = pgTable("ride_analytics", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  serviceName: text("service_name").notNull(),
  routeDistance: doublePrecision("route_distance").notNull(),
  rideDuration: integer("ride_duration").notNull(), // in minutes
  totalCost: doublePrecision("total_cost").notNull(),
  currency: text("currency").default("GBP").notNull(),
  pickupLocation: text("pickup_location").notNull(),
  dropoffLocation: text("dropoff_location").notNull(),
  pickupLat: doublePrecision("pickup_lat").notNull(),
  pickupLng: doublePrecision("pickup_lng").notNull(),
  dropoffLat: doublePrecision("dropoff_lat").notNull(),
  dropoffLng: doublePrecision("dropoff_lng").notNull(),
  rideRating: integer("ride_rating"), // 1-5 stars
  rideNotes: text("ride_notes"),
  rideDate: timestamp("ride_date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertRideAnalyticsSchema = createInsertSchema(rideAnalytics).omit({
  id: true,
  createdAt: true,
});

export type RideAnalytics = typeof rideAnalytics.$inferSelect;
export type InsertRideAnalytics = z.infer<typeof insertRideAnalyticsSchema>;

// User profiles table
export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  fullName: varchar("full_name"),
  phoneNumber: varchar("phone_number"),
  profilePicture: varchar("profile_picture"),
  favoritePaymentMethod: varchar("favorite_payment_method").default("card"),
  homeAddress: varchar("home_address"),
  workAddress: varchar("work_address"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Emergency contacts table
export const emergencyContacts = pgTable("emergency_contacts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  name: varchar("name").notNull(),
  phoneNumber: varchar("phone_number").notNull(),
  relationship: varchar("relationship"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertEmergencyContactSchema = createInsertSchema(emergencyContacts).omit({
  id: true,
  createdAt: true,
});

// Real-time ride tracking table
export const rideTracking = pgTable("ride_tracking", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull(),
  driverName: varchar("driver_name"),
  driverPhone: varchar("driver_phone"),
  vehicleModel: varchar("vehicle_model"),
  vehicleColor: varchar("vehicle_color"),
  licensePlate: varchar("license_plate"),
  currentLat: decimal("current_lat"),
  currentLng: decimal("current_lng"),
  estimatedArrival: timestamp("estimated_arrival"),
  status: varchar("status").default("searching"), // searching, driver_assigned, en_route, arrived, in_progress, completed
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const insertRideTrackingSchema = createInsertSchema(rideTracking).omit({
  id: true,
});

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;

export type EmergencyContact = typeof emergencyContacts.$inferSelect;
export type InsertEmergencyContact = z.infer<typeof insertEmergencyContactSchema>;

export type RideTracking = typeof rideTracking.$inferSelect;
export type InsertRideTracking = z.infer<typeof insertRideTrackingSchema>;

// User location shortcuts table
export const locationShortcuts = pgTable("location_shortcuts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  name: varchar("name").notNull(), // e.g., "Home", "Work", "Gym"
  label: varchar("label").notNull(), // Display name
  address: varchar("address").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  icon: varchar("icon").default("MapPin"), // Icon name for UI
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertLocationShortcutSchema = createInsertSchema(locationShortcuts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type LocationShortcut = typeof locationShortcuts.$inferSelect;
export type InsertLocationShortcut = z.infer<typeof insertLocationShortcutSchema>;

// Partner applications table
export const partnerApplications = pgTable("partner_applications", {
  id: serial("id").primaryKey(),
  companyName: varchar("company_name").notNull(),
  contactName: varchar("contact_name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone").notNull(),
  address: text("address").notNull(),
  city: varchar("city").notNull(),
  operatingArea: text("operating_area").notNull(),
  fleetSize: varchar("fleet_size").notNull(),
  serviceTypes: text("service_types").array().notNull(), // Array of service types
  operatingHours: varchar("operating_hours").notNull(),
  averageResponseTime: varchar("average_response_time").notNull(),
  baseRate: decimal("base_rate", { precision: 8, scale: 2 }).notNull(),
  perKmRate: decimal("per_km_rate", { precision: 8, scale: 2 }).notNull(),
  description: text("description"),
  website: varchar("website").default(""),
  licenseNumber: varchar("license_number").notNull(),
  insuranceProvider: varchar("insurance_provider").notNull(),
  status: varchar("status").default("pending"), // pending, approved, rejected
  adminNotes: text("admin_notes"), // Admin notes
  submittedAt: timestamp("submitted_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: varchar("reviewed_by"), // Admin user who reviewed
});

export const insertPartnerApplicationSchema = createInsertSchema(partnerApplications).omit({
  id: true,
  status: true,
  adminNotes: true,
  submittedAt: true,
  reviewedAt: true,
  reviewedBy: true,
});

export type PartnerApplication = typeof partnerApplications.$inferSelect;
export type InsertPartnerApplication = z.infer<typeof insertPartnerApplicationSchema>;

// Driver profiles table
export const drivers = pgTable("drivers", {
  id: serial("id").primaryKey(),
  partnerId: integer("partner_id").references(() => partnerApplications.id),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email").unique().notNull(),
  phone: varchar("phone").notNull(),
  licenseNumber: varchar("license_number").notNull(),
  licenseExpiry: timestamp("license_expiry").notNull(),
  vehicleId: integer("vehicle_id").references(() => vehicles.id),
  status: varchar("status").default("offline"), // offline, online, busy, unavailable
  currentLat: decimal("current_lat", { precision: 10, scale: 8 }),
  currentLng: decimal("current_lng", { precision: 11, scale: 8 }),
  lastLocationUpdate: timestamp("last_location_update"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("5.00"),
  totalRides: integer("total_rides").default(0),
  isVerified: boolean("is_verified").default(false),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertDriverSchema = createInsertSchema(drivers).omit({
  id: true,
  status: true,
  rating: true,
  totalRides: true,
  isVerified: true,
  createdAt: true,
  updatedAt: true,
});

export type Driver = typeof drivers.$inferSelect;
export type InsertDriver = z.infer<typeof insertDriverSchema>;

// Vehicle information table
export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  partnerId: integer("partner_id").references(() => partnerApplications.id),
  make: varchar("make").notNull(),
  model: varchar("model").notNull(),
  year: integer("year").notNull(),
  color: varchar("color").notNull(),
  licensePlate: varchar("license_plate").unique().notNull(),
  vehicleType: varchar("vehicle_type").notNull(), // sedan, suv, van, luxury, wheelchair
  capacity: integer("capacity").default(4),
  isActive: boolean("is_active").default(true),
  registrationExpiry: timestamp("registration_expiry").notNull(),
  insuranceExpiry: timestamp("insurance_expiry").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertVehicleSchema = createInsertSchema(vehicles).omit({
  id: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
});

export type Vehicle = typeof vehicles.$inferSelect;
export type InsertVehicle = z.infer<typeof insertVehicleSchema>;

// Live ride requests table
export const rideRequests = pgTable("ride_requests", {
  id: serial("id").primaryKey(),
  customerId: varchar("customer_id"), // User ID from auth system
  customerName: varchar("customer_name").notNull(),
  customerPhone: varchar("customer_phone").notNull(),
  pickupLat: decimal("pickup_lat", { precision: 10, scale: 8 }).notNull(),
  pickupLng: decimal("pickup_lng", { precision: 11, scale: 8 }).notNull(),
  pickupAddress: text("pickup_address").notNull(),
  destinationLat: decimal("destination_lat", { precision: 10, scale: 8 }).notNull(),
  destinationLng: decimal("destination_lng", { precision: 11, scale: 8 }).notNull(),
  destinationAddress: text("destination_address").notNull(),
  rideType: varchar("ride_type").notNull(), // standard, premium, xl, wheelchair
  requestedAt: timestamp("requested_at").defaultNow(),
  scheduledFor: timestamp("scheduled_for"), // null for immediate rides
  status: varchar("status").default("pending"), // pending, matched, accepted, in_progress, completed, cancelled
  estimatedDistance: decimal("estimated_distance", { precision: 8, scale: 2 }),
  estimatedDuration: integer("estimated_duration"), // in minutes
  maxPrice: decimal("max_price", { precision: 8, scale: 2 }),
  notes: text("notes"),
  driverId: integer("driver_id").references(() => drivers.id),
  partnerId: integer("partner_id").references(() => partnerApplications.id),
  acceptedAt: timestamp("accepted_at"),
  pickedUpAt: timestamp("picked_up_at"),
  completedAt: timestamp("completed_at"),
  cancelledAt: timestamp("cancelled_at"),
  cancellationReason: text("cancellation_reason"),
  finalPrice: decimal("final_price", { precision: 8, scale: 2 }),
  paymentStatus: varchar("payment_status").default("pending"), // pending, paid, failed, refunded
  rating: decimal("rating", { precision: 3, scale: 2 }),
  feedback: text("feedback"),
});

export const insertRideRequestSchema = createInsertSchema(rideRequests).omit({
  id: true,
  requestedAt: true,
  status: true,
  driverId: true,
  partnerId: true,
  acceptedAt: true,
  pickedUpAt: true,
  completedAt: true,
  cancelledAt: true,
  paymentStatus: true,
});

export type RideRequest = typeof rideRequests.$inferSelect;
export type InsertRideRequest = z.infer<typeof insertRideRequestSchema>;

// Real-time driver locations table
export const driverLocations = pgTable("driver_locations", {
  id: serial("id").primaryKey(),
  driverId: integer("driver_id").references(() => drivers.id).notNull(),
  lat: decimal("lat", { precision: 10, scale: 8 }).notNull(),
  lng: decimal("lng", { precision: 11, scale: 8 }).notNull(),
  heading: decimal("heading", { precision: 5, scale: 2 }), // compass direction
  speed: decimal("speed", { precision: 5, scale: 2 }), // km/h
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertDriverLocationSchema = createInsertSchema(driverLocations).omit({
  id: true,
  timestamp: true,
});

export type DriverLocation = typeof driverLocations.$inferSelect;
export type InsertDriverLocation = z.infer<typeof insertDriverLocationSchema>;

// Price quotes table
export const priceQuotes = pgTable("price_quotes", {
  id: serial("id").primaryKey(),
  rideRequestId: integer("ride_request_id").references(() => rideRequests.id),
  partnerId: integer("partner_id").references(() => partnerApplications.id).notNull(),
  driverId: integer("driver_id").references(() => drivers.id),
  quotedPrice: decimal("quoted_price", { precision: 8, scale: 2 }).notNull(),
  estimatedArrival: integer("estimated_arrival").notNull(), // minutes
  estimatedDuration: integer("estimated_duration").notNull(), // minutes
  validUntil: timestamp("valid_until").notNull(),
  status: varchar("status").default("active"), // active, accepted, expired, withdrawn
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPriceQuoteSchema = createInsertSchema(priceQuotes).omit({
  id: true,
  status: true,
  createdAt: true,
});

export type PriceQuote = typeof priceQuotes.$inferSelect;
export type InsertPriceQuote = z.infer<typeof insertPriceQuoteSchema>;

// User accounts table for real authentication
export const userAccounts = pgTable("user_accounts", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  phone: varchar("phone", { length: 20 }),
  passwordHash: text("password_hash").notNull(),
  emailVerified: boolean("email_verified").default(false),
  emailVerificationToken: varchar("email_verification_token", { length: 255 }),
  emailVerificationExpires: timestamp("email_verification_expires"),
  resetPasswordToken: varchar("reset_password_token", { length: 255 }),
  resetPasswordExpires: timestamp("reset_password_expires"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserAccountSchema = createInsertSchema(userAccounts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type UserAccount = typeof userAccounts.$inferSelect;
export type InsertUserAccount = z.infer<typeof insertUserAccountSchema>;

import { 
  locations, Location, InsertLocation, 
  services, Service, InsertService,
  cachedRides, CachedRide, InsertCachedRide,
  searchHistory, SearchHistory, InsertSearchHistory,
  bookingHistory, BookingHistory, InsertBookingHistory,
  rideAnalytics, RideAnalytics, InsertRideAnalytics,
  locationShortcuts, LocationShortcut, InsertLocationShortcut,
  partnerApplications, PartnerApplication, InsertPartnerApplication,
  drivers, Driver, InsertDriver,
  vehicles, Vehicle, InsertVehicle,
  rideRequests, RideRequest, InsertRideRequest,
  driverLocations, DriverLocation, InsertDriverLocation,
  priceQuotes, PriceQuote, InsertPriceQuote,
  userAccounts, UserAccount, InsertUserAccount
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, gt } from "drizzle-orm";

// Storage interface for our application
export interface IStorage {
  // Location methods
  saveLocation(location: InsertLocation): Promise<Location>;
  getLocationByCoordinates(lat: number, lng: number): Promise<Location | undefined>;
  
  // Service methods
  getAllServices(): Promise<Service[]>;
  getEnabledServices(): Promise<Service[]>;
  getServiceById(id: number): Promise<Service | undefined>;
  getServiceByName(name: string): Promise<Service | undefined>;
  
  // Cached rides methods
  getCachedRides(originLat: number, originLng: number, destLat: number, destLng: number): Promise<CachedRide[]>;
  saveCachedRide(ride: InsertCachedRide): Promise<CachedRide>;
  clearExpiredCachedRides(): Promise<void>;
  
  // Search history methods
  saveSearchHistory(search: InsertSearchHistory): Promise<SearchHistory>;
  getRecentSearches(limit: number): Promise<SearchHistory[]>;
  
  // Booking history methods
  saveBooking(booking: InsertBookingHistory): Promise<BookingHistory>;
  getBookingHistory(): Promise<BookingHistory[]>;
  updateBookingStatus(bookingId: number, status: string): Promise<BookingHistory | undefined>;
  
  // Ride analytics methods
  saveRideAnalytics(analytics: InsertRideAnalytics): Promise<RideAnalytics>;
  getRideAnalytics(userId?: string, limit?: number): Promise<RideAnalytics[]>;
  getRideStatistics(userId?: string): Promise<{
    totalRides: number;
    totalSpent: number;
    averageRating: number;
    totalDistance: number;
    favoriteService: string;
    avgCostPerRide: number;
  }>;
  
  // Location shortcuts methods
  getLocationShortcuts(userId: string): Promise<LocationShortcut[]>;
  saveLocationShortcut(shortcut: InsertLocationShortcut): Promise<LocationShortcut>;
  updateLocationShortcut(id: number, shortcut: Partial<InsertLocationShortcut>): Promise<LocationShortcut | undefined>;
  deleteLocationShortcut(id: number, userId: string): Promise<boolean>;
  
  // Partner application methods
  savePartnerApplication(application: InsertPartnerApplication): Promise<PartnerApplication>;
  getPartnerApplications(): Promise<PartnerApplication[]>;
  getPartnerApplicationById(id: number): Promise<PartnerApplication | undefined>;
  updatePartnerApplicationStatus(id: number, status: string, adminNotes?: string): Promise<PartnerApplication | undefined>;
  getApprovedPartners(): Promise<PartnerApplication[]>;
  
  // Driver management methods
  saveDriver(driver: InsertDriver): Promise<Driver>;
  getDriversByPartnerId(partnerId: number): Promise<Driver[]>;
  getDriverById(id: number): Promise<Driver | undefined>;
  updateDriverStatus(id: number, status: string): Promise<Driver | undefined>;
  updateDriverLocation(id: number, lat: number, lng: number): Promise<void>;
  getAvailableDrivers(lat: number, lng: number, radius: number): Promise<Driver[]>;
  
  // Vehicle management methods
  saveVehicle(vehicle: InsertVehicle): Promise<Vehicle>;
  getVehiclesByPartnerId(partnerId: number): Promise<Vehicle[]>;
  getVehicleById(id: number): Promise<Vehicle | undefined>;
  
  // Real-time ride request methods
  saveRideRequest(request: InsertRideRequest): Promise<RideRequest>;
  getRideRequestById(id: number): Promise<RideRequest | undefined>;
  getPendingRideRequests(): Promise<RideRequest[]>;
  updateRideRequestStatus(id: number, status: string, driverId?: number): Promise<RideRequest | undefined>;
  assignDriverToRide(rideId: number, driverId: number): Promise<RideRequest | undefined>;
  
  // Price quote methods
  savePriceQuote(quote: InsertPriceQuote): Promise<PriceQuote>;
  getQuotesForRide(rideRequestId: number): Promise<PriceQuote[]>;
  acceptQuote(quoteId: number): Promise<PriceQuote | undefined>;
  
  // Driver location tracking methods
  saveDriverLocation(location: InsertDriverLocation): Promise<DriverLocation>;
  getDriverLocation(driverId: number): Promise<DriverLocation | undefined>;
  getNearbyDrivers(lat: number, lng: number, maxDistance: number): Promise<Driver[]>;
  
  // User account methods
  createUserAccount(userData: InsertUserAccount): Promise<UserAccount>;
  getUserAccountByEmail(email: string): Promise<UserAccount | undefined>;
  getUserAccountById(id: number): Promise<UserAccount | undefined>;
  updateUserAccount(id: number, updates: Partial<InsertUserAccount>): Promise<UserAccount | undefined>;
  verifyUserEmail(token: string): Promise<UserAccount | undefined>;
  setPasswordResetToken(email: string, token: string, expires: Date): Promise<boolean>;
  resetPassword(token: string, passwordHash: string): Promise<UserAccount | undefined>;
}

export class DatabaseStorage implements IStorage {
  // Location methods
  async saveLocation(location: InsertLocation): Promise<Location> {
    const [result] = await db.insert(locations).values(location).returning();
    return result;
  }

  async getLocationByCoordinates(lat: number, lng: number): Promise<Location | undefined> {
    const [result] = await db.select().from(locations)
      .where(sql`${locations.latitude} = ${lat} AND ${locations.longitude} = ${lng}`)
      .limit(1);
    return result;
  }

  // Service methods
  async getAllServices(): Promise<Service[]> {
    return await db.select().from(services);
  }

  async getEnabledServices(): Promise<Service[]> {
    return await db.select().from(services).where(eq(services.enabled, true));
  }

  async getServiceById(id: number): Promise<Service | undefined> {
    const [result] = await db.select().from(services).where(eq(services.id, id));
    return result;
  }

  async getServiceByName(name: string): Promise<Service | undefined> {
    const [result] = await db.select().from(services).where(eq(services.name, name));
    return result;
  }

  // Cached rides methods
  async getCachedRides(originLat: number, originLng: number, destLat: number, destLng: number): Promise<CachedRide[]> {
    return await db.select().from(cachedRides)
      .where(sql`${cachedRides.originLat} = ${originLat} AND ${cachedRides.originLng} = ${originLng} 
                 AND ${cachedRides.destLat} = ${destLat} AND ${cachedRides.destLng} = ${destLng}
                 AND ${cachedRides.expiresAt} > NOW()`);
  }

  async saveCachedRide(ride: InsertCachedRide): Promise<CachedRide> {
    const [result] = await db.insert(cachedRides).values(ride).returning();
    return result;
  }

  async clearExpiredCachedRides(): Promise<void> {
    await db.delete(cachedRides).where(sql`${cachedRides.expiresAt} <= NOW()`);
  }

  // Search history methods
  async saveSearchHistory(search: InsertSearchHistory): Promise<SearchHistory> {
    const [result] = await db.insert(searchHistory).values(search).returning();
    return result;
  }

  async getRecentSearches(limit: number): Promise<SearchHistory[]> {
    return await db.select().from(searchHistory)
      .orderBy(desc(searchHistory.timestamp))
      .limit(limit);
  }

  // Booking history methods
  async saveBooking(booking: InsertBookingHistory): Promise<BookingHistory> {
    const [result] = await db.insert(bookingHistory).values(booking).returning();
    return result;
  }

  async getBookingHistory(): Promise<BookingHistory[]> {
    return await db.select().from(bookingHistory)
      .orderBy(desc(bookingHistory.bookingTimestamp));
  }

  async updateBookingStatus(bookingId: number, status: string): Promise<BookingHistory | undefined> {
    const [result] = await db.update(bookingHistory)
      .set({ status })
      .where(eq(bookingHistory.id, bookingId))
      .returning();
    return result;
  }

  // Location shortcuts methods
  async getLocationShortcuts(userId: string): Promise<LocationShortcut[]> {
    return await db.select().from(locationShortcuts)
      .where(eq(locationShortcuts.userId, userId));
  }

  async saveLocationShortcut(shortcut: InsertLocationShortcut): Promise<LocationShortcut> {
    const [result] = await db.insert(locationShortcuts).values(shortcut).returning();
    return result;
  }

  async updateLocationShortcut(id: number, shortcut: Partial<InsertLocationShortcut>): Promise<LocationShortcut | undefined> {
    const [result] = await db.update(locationShortcuts)
      .set({ ...shortcut, updatedAt: new Date() })
      .where(eq(locationShortcuts.id, id))
      .returning();
    return result;
  }

  async deleteLocationShortcut(id: number, userId: string): Promise<boolean> {
    const result = await db.delete(locationShortcuts)
      .where(and(eq(locationShortcuts.id, id), eq(locationShortcuts.userId, userId)));
    return result.rowCount > 0;
  }

  // Ride analytics methods
  async saveRideAnalytics(analytics: InsertRideAnalytics): Promise<RideAnalytics> {
    const [result] = await db.insert(rideAnalytics).values(analytics).returning();
    return result;
  }

  async getRideAnalytics(userId?: string, limit?: number): Promise<RideAnalytics[]> {
    let query = db.select().from(rideAnalytics);
    
    if (userId) {
      query = query.where(eq(rideAnalytics.userId, userId));
    }
    
    query = query.orderBy(desc(rideAnalytics.createdAt));
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return await query;
  }

  async getRideStatistics(userId?: string): Promise<{
    totalRides: number;
    totalSpent: number;
    averageRating: number;
    totalDistance: number;
    favoriteService: string;
    avgCostPerRide: number;
  }> {
    return {
      totalRides: 0,
      totalSpent: 0,
      averageRating: 0,
      totalDistance: 0,
      favoriteService: '',
      avgCostPerRide: 0
    };
  }

  // Partner application methods
  async savePartnerApplication(application: InsertPartnerApplication): Promise<PartnerApplication> {
    const [result] = await db.insert(partnerApplications).values(application).returning();
    return result;
  }

  async updatePartnerApplicationStatus(id: number, status: string, adminNotes?: string): Promise<PartnerApplication | undefined> {
    const updateData: any = { 
      status,
      updatedAt: new Date()
    };
    
    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }

    const [application] = await db
      .update(partnerApplications)
      .set(updateData)
      .where(eq(partnerApplications.id, id))
      .returning();
    
    return application;
  }

  async getPartnerApplications(): Promise<PartnerApplication[]> {
    return await db.select().from(partnerApplications)
      .orderBy(desc(partnerApplications.submittedAt));
  }

  async getPartnerApplicationById(id: number): Promise<PartnerApplication | undefined> {
    const [result] = await db.select().from(partnerApplications)
      .where(eq(partnerApplications.id, id));
    return result;
  }

  async getApprovedPartners(): Promise<PartnerApplication[]> {
    const partners = await db
      .select()
      .from(partnerApplications)
      .where(eq(partnerApplications.status, 'approved'))
      .orderBy(partnerApplications.companyName);
    
    return partners;
  }

  // Driver management methods
  async saveDriver(driver: InsertDriver): Promise<Driver> {
    const [result] = await db.insert(drivers).values(driver).returning();
    return result;
  }

  async getDriversByPartnerId(partnerId: number): Promise<Driver[]> {
    return await db.select().from(drivers)
      .where(eq(drivers.partnerId, partnerId));
  }

  async getDriverById(id: number): Promise<Driver | undefined> {
    const [result] = await db.select().from(drivers)
      .where(eq(drivers.id, id));
    return result;
  }

  async updateDriverStatus(id: number, status: string): Promise<Driver | undefined> {
    const [result] = await db.update(drivers)
      .set({ status, updatedAt: new Date() })
      .where(eq(drivers.id, id))
      .returning();
    return result;
  }

  async updateDriverLocation(id: number, lat: number, lng: number): Promise<void> {
    await db.insert(driverLocations).values({
      driverId: id,
      lat: lat.toString(),
      lng: lng.toString()
    });
  }

  async getAvailableDrivers(lat: number, lng: number, radius: number): Promise<Driver[]> {
    return await db.select().from(drivers)
      .where(eq(drivers.status, 'active'));
  }

  // Vehicle management methods
  async saveVehicle(vehicle: InsertVehicle): Promise<Vehicle> {
    const [result] = await db.insert(vehicles).values(vehicle).returning();
    return result;
  }

  async getVehiclesByPartnerId(partnerId: number): Promise<Vehicle[]> {
    return await db.select().from(vehicles)
      .where(eq(vehicles.partnerId, partnerId));
  }

  async getVehicleById(id: number): Promise<Vehicle | undefined> {
    const [result] = await db.select().from(vehicles)
      .where(eq(vehicles.id, id));
    return result;
  }

  // Real-time ride request methods
  async saveRideRequest(request: InsertRideRequest): Promise<RideRequest> {
    const [result] = await db.insert(rideRequests).values(request).returning();
    return result;
  }

  async getRideRequestById(id: number): Promise<RideRequest | undefined> {
    const [result] = await db.select().from(rideRequests)
      .where(eq(rideRequests.id, id));
    return result;
  }

  async getPendingRideRequests(): Promise<RideRequest[]> {
    return await db.select().from(rideRequests)
      .where(eq(rideRequests.status, 'pending'));
  }

  async updateRideRequestStatus(id: number, status: string, driverId?: number): Promise<RideRequest | undefined> {
    const updateData: any = { status };
    if (driverId) updateData.driverId = driverId;
    
    const [result] = await db.update(rideRequests)
      .set(updateData)
      .where(eq(rideRequests.id, id))
      .returning();
    return result;
  }

  async assignDriverToRide(rideId: number, driverId: number): Promise<RideRequest | undefined> {
    const [result] = await db.update(rideRequests)
      .set({ 
        driverId, 
        status: 'accepted',
        acceptedAt: new Date()
      })
      .where(eq(rideRequests.id, rideId))
      .returning();
    return result;
  }

  // Price quote methods
  async savePriceQuote(quote: InsertPriceQuote): Promise<PriceQuote> {
    const [result] = await db.insert(priceQuotes).values(quote).returning();
    return result;
  }

  async getQuotesForRide(rideRequestId: number): Promise<PriceQuote[]> {
    return await db.select().from(priceQuotes)
      .where(eq(priceQuotes.rideRequestId, rideRequestId));
  }

  async acceptQuote(quoteId: number): Promise<PriceQuote | undefined> {
    const [result] = await db.update(priceQuotes)
      .set({ status: 'accepted' })
      .where(eq(priceQuotes.id, quoteId))
      .returning();
    return result;
  }

  // Driver location tracking methods
  async saveDriverLocation(location: InsertDriverLocation): Promise<DriverLocation> {
    const [result] = await db.insert(driverLocations).values(location).returning();
    return result;
  }

  async getDriverLocation(driverId: number): Promise<DriverLocation | undefined> {
    const [result] = await db.select().from(driverLocations)
      .where(eq(driverLocations.driverId, driverId))
      .orderBy(desc(driverLocations.timestamp))
      .limit(1);
    return result;
  }

  async getNearbyDrivers(lat: number, lng: number, maxDistance: number): Promise<Driver[]> {
    return await db.select().from(drivers)
      .where(eq(drivers.status, 'active'));
  }

  // User account methods
  async createUserAccount(userData: InsertUserAccount): Promise<UserAccount> {
    const [user] = await db
      .insert(userAccounts)
      .values(userData)
      .returning();
    return user;
  }

  async getUserAccountByEmail(email: string): Promise<UserAccount | undefined> {
    const [user] = await db
      .select()
      .from(userAccounts)
      .where(eq(userAccounts.email, email));
    return user;
  }

  async getUserAccountById(id: number): Promise<UserAccount | undefined> {
    const [user] = await db
      .select()
      .from(userAccounts)
      .where(eq(userAccounts.id, id));
    return user;
  }

  async updateUserAccount(id: number, updates: Partial<InsertUserAccount>): Promise<UserAccount | undefined> {
    const [user] = await db
      .update(userAccounts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userAccounts.id, id))
      .returning();
    return user;
  }

  async verifyUserEmail(token: string): Promise<UserAccount | undefined> {
    const [user] = await db
      .update(userAccounts)
      .set({ 
        emailVerified: true, 
        emailVerificationToken: null,
        emailVerificationExpires: null,
        updatedAt: new Date()
      })
      .where(and(
        eq(userAccounts.emailVerificationToken, token),
        gt(userAccounts.emailVerificationExpires, new Date())
      ))
      .returning();
    return user;
  }

  async setPasswordResetToken(email: string, token: string, expires: Date): Promise<boolean> {
    const result = await db
      .update(userAccounts)
      .set({ 
        resetPasswordToken: token,
        resetPasswordExpires: expires,
        updatedAt: new Date()
      })
      .where(eq(userAccounts.email, email));
    return (result.rowCount || 0) > 0;
  }

  async resetPassword(token: string, passwordHash: string): Promise<UserAccount | undefined> {
    const [user] = await db
      .update(userAccounts)
      .set({ 
        passwordHash,
        resetPasswordToken: null,
        resetPasswordExpires: null,
        updatedAt: new Date()
      })
      .where(and(
        eq(userAccounts.resetPasswordToken, token),
        gt(userAccounts.resetPasswordExpires, new Date())
      ))
      .returning();
    return user;
  }
}

export const storage = new DatabaseStorage();
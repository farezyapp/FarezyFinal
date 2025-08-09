import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import path from "path";
import { storage } from "./storage";
import { locationService } from './services/locationService';
import { aiBookingService, type BookingRequest } from './services/aiBookingService';
import { uberService } from './services/uber';
import { insertPartnerApplicationSchema } from '@shared/schema';
import { authService } from './services/auth';
import { z } from 'zod';

export async function registerRoutes(app: Express): Promise<Server> {
  // Driver app route - must be before Vite middleware
  app.get("/driver", (req: Request, res: Response) => {
    res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>Farezy Driver App</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 400px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; }
        h1 { text-align: center; color: #333; margin-bottom: 20px; }
        .status { padding: 15px; margin: 15px 0; border-radius: 8px; text-align: center; font-weight: bold; }
        .connected { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .disconnected { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .notification { background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; margin: 15px 0; border-radius: 8px; }
        .notification h3 { margin: 0 0 15px 0; color: #856404; }
        .notification p { margin: 8px 0; }
        .buttons { margin-top: 20px; text-align: center; }
        .btn { padding: 12px 25px; margin: 0 10px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; font-weight: bold; }
        .accept { background: #28a745; color: white; }
        .decline { background: #dc3545; color: white; }
        .debug { background: #e9ecef; padding: 10px; margin: 10px 0; border-radius: 5px; font-family: monospace; font-size: 12px; max-height: 200px; overflow-y: auto; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚗 Farezy Driver</h1>
        <div id="status" class="status disconnected">Connecting to network...</div>
        <div id="notifications"></div>
        <div id="debug"></div>
    </div>
    
    <script>
        const debug = document.getElementById('debug');
        const notifications = document.getElementById('notifications');
        const status = document.getElementById('status');
        
        function addDebug(message) {
            const div = document.createElement('div');
            div.style.borderBottom = '1px solid #ccc';
            div.style.padding = '5px 0';
            div.textContent = new Date().toLocaleTimeString() + ': ' + message;
            debug.appendChild(div);
            debug.scrollTop = debug.scrollHeight;
        }
        
        function updateStatus(connected) {
            status.className = connected ? 'status connected' : 'status disconnected';
            status.textContent = connected ? '✅ Connected - Ready for bookings' : '❌ Disconnected from network';
        }
        
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const wsUrl = \`\${protocol}//\${window.location.host}/ws\`;
        const ws = new WebSocket(wsUrl);
        
        ws.onopen = () => {
            updateStatus(true);
            addDebug('Connected to Farezy network');
            
            ws.send(JSON.stringify({
                type: 'register',
                data: {
                    userType: 'driver',
                    driverId: 'integrated_driver_001',
                    driverName: 'Integrated Driver'
                }
            }));
        };
        
        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            addDebug('Received: ' + message.type);
            
            if (message.type === 'registered') {
                addDebug('Driver registered successfully');
            }
            
            if (message.type === 'booking_request') {
                addDebug('🚨 NEW BOOKING REQUEST!');
                showBookingNotification(message.data);
            }
        };
        
        function showBookingNotification(data) {
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.innerHTML = \`
                <h3>🚗 New Booking Request</h3>
                <p><strong>Passenger:</strong> \${data.passengerName || 'Anonymous'}</p>
                <p><strong>Pickup:</strong> \${data.pickupAddress || data.pickup}</p>
                <p><strong>Destination:</strong> \${data.destinationAddress || data.destination}</p>
                <p><strong>Fare:</strong> £\${data.estimatedFare || data.fare}</p>
                <p><strong>Distance:</strong> \${data.distance} miles</p>
                <div class="buttons">
                    <button class="btn accept" onclick="acceptBooking(\${Date.now()})">Accept Ride</button>
                    <button class="btn decline" onclick="declineBooking(\${Date.now()})">Decline</button>
                </div>
            \`;
            notifications.appendChild(notification);
        }
        
        function acceptBooking(id) {
            addDebug('✅ BOOKING ACCEPTED!');
            ws.send(JSON.stringify({
                type: 'booking_response',
                data: { bookingId: id, status: 'accepted' }
            }));
        }
        
        function declineBooking(id) {
            addDebug('❌ Booking declined');
            ws.send(JSON.stringify({
                type: 'booking_response',
                data: { bookingId: id, status: 'declined' }
            }));
        }
        
        ws.onclose = () => {
            updateStatus(false);
            addDebug('Connection lost - trying to reconnect...');
            setTimeout(() => location.reload(), 3000);
        };
        
        ws.onerror = (error) => {
            updateStatus(false);
            addDebug('Connection error');
        };
        
        // Add initial debug message
        addDebug('Driver app loaded - waiting for connection...');
    </script>
</body>
</html>
    `);
  });

  // Serve PWA files in production
  if (process.env.NODE_ENV === 'production') {
    app.get('/manifest.json', (req, res) => {
      res.sendFile(path.join(process.cwd(), 'dist/public/manifest.json'));
    });
    
    app.get('/sw.js', (req, res) => {
      res.setHeader('Service-Worker-Allowed', '/');
      res.setHeader('Content-Type', 'application/javascript');
      res.sendFile(path.join(process.cwd(), 'dist/public/sw.js'));
    });

    app.get('/icons/:filename', (req, res) => {
      res.sendFile(path.join(process.cwd(), 'dist/public/icons', req.params.filename));
    });
  }

  // Authentication routes
  const registerSchema = z.object({
    firstName: z.string().min(1, 'First name is required').default('User'),
    lastName: z.string().min(1, 'Last name is required').default('Account'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().optional(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  });

  const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
  });

  app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      
      const result = await authService.register(validatedData);
      
      res.status(201).json({
        success: true,
        message: 'Account created successfully! Please check your email to verify your account.',
        user: {
          id: result.user.id,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          email: result.user.email,
          emailVerified: result.user.emailVerified,
        },
        requiresVerification: result.requiresVerification,
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      
      if (error.message === 'User already exists with this email') {
        return res.status(409).json({
          success: false,
          message: 'An account with this email already exists.',
        });
      }
      
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          message: 'Invalid input data',
          errors: error.errors,
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to create account. Please try again.',
      });
    }
  });

  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      const result = await authService.login(validatedData.email, validatedData.password);
      
      if (!result) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.',
        });
      }
      
      res.json({
        success: true,
        message: 'Login successful!',
        user: {
          id: result.user.id,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          email: result.user.email,
          emailVerified: result.user.emailVerified,
        },
        token: result.token,
      });
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.message === 'Please verify your email before logging in') {
        return res.status(403).json({
          success: false,
          message: 'Please verify your email before logging in. Check your inbox for the verification link.',
        });
      }
      
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          message: 'Invalid input data',
          errors: error.errors,
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Login failed. Please try again.',
      });
    }
  });

  app.get('/api/auth/verify-email', async (req: Request, res: Response) => {
    try {
      const { token } = req.query;
      
      if (!token || typeof token !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Invalid verification token.',
        });
      }
      
      const user = await authService.verifyEmail(token);
      
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired verification token.',
        });
      }
      
      res.json({
        success: true,
        message: 'Email verified successfully! Welcome to Farezy!',
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          emailVerified: user.emailVerified,
        },
      });
    } catch (error: any) {
      console.error('Email verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Email verification failed. Please try again.',
      });
    }
  });

  app.post('/api/auth/resend-verification', async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      if (!email || typeof email !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Email is required.',
        });
      }
      
      const success = await authService.resendVerification(email);
      
      if (!success) {
        return res.status(400).json({
          success: false,
          message: 'User not found or email already verified.',
        });
      }
      
      res.json({
        success: true,
        message: 'Verification email sent successfully! Please check your inbox.',
      });
    } catch (error: any) {
      console.error('Resend verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to resend verification email. Please try again.',
      });
    }
  });

  // Location API routes
  app.get("/api/location/geocode", async (req: Request, res: Response) => {
    try {
      const { address } = req.query;
      
      if (!address || typeof address !== 'string') {
        return res.status(400).json({ error: 'Address parameter is required' });
      }
      
      const location = await locationService.geocodeAddress(address);
      
      if (!location) {
        return res.status(404).json({ error: 'Location not found' });
      }
      
      return res.json({ location });
    } catch (error) {
      console.error('Geocoding error:', error);
      return res.status(500).json({ error: 'Error geocoding address' });
    }
  });

  app.get("/api/location/reverse-geocode", async (req: Request, res: Response) => {
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
      
      const location = await locationService.reverseGeocode(latitude, longitude);
      
      if (!location) {
        return res.status(404).json({ error: 'Address not found for these coordinates' });
      }
      
      return res.json({ location });
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return res.status(500).json({ error: 'Error reverse geocoding coordinates' });
    }
  });

  // Google Places autocomplete API
  app.get("/api/places-autocomplete", async (req: Request, res: Response) => {
    try {
      const { input, lat, lng } = req.query;
      
      if (!input || typeof input !== 'string' || input.length < 1) {
        return res.json([]);
      }

      const apiKey = process.env.GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        console.error('Google Maps API key not found');
        return res.status(500).json({ error: 'Google Maps API not configured' });
      }

      // Build location bias if coordinates provided
      let locationBias = '';
      if (lat && lng && typeof lat === 'string' && typeof lng === 'string') {
        locationBias = `&location=${lat},${lng}&radius=50000`; // 50km radius
      }

      // Determine search types based on input
      let types = 'establishment|geocode'; // Include businesses and addresses
      
      // For business names, prioritize establishments
      const businessKeywords = ['mcdonalds', 'mcdonald', 'zara', 'tesco', 'asda', 'sainsburys', 'starbucks', 'costa', 'kfc', 'burger king', 'subway', 'greggs', 'boots', 'primark', 'h&m', 'marks', 'spencer', 'john lewis', 'waitrose', 'co-op', 'lidl', 'aldi'];
      const isBusinessSearch = businessKeywords.some(keyword => 
        input.toLowerCase().includes(keyword)
      );
      
      if (isBusinessSearch) {
        types = 'establishment'; // Focus on businesses for brand searches
      }

      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&types=${types}&components=country:gb${locationBias}&key=${apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === 'OK') {
        res.json(data.predictions || []);
      } else {
        console.error('Google Places API error:', data.status, data.error_message);
        res.json([]);
      }
    } catch (error) {
      console.error('Places autocomplete error:', error);
      res.json([]);
    }
  });

  // Location shortcuts API routes
  app.get("/api/location-shortcuts/:userId", async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const shortcuts = await storage.getLocationShortcuts(userId);
      res.json(shortcuts);
    } catch (error) {
      console.error('Error fetching location shortcuts:', error);
      res.status(500).json({ error: 'Failed to fetch location shortcuts' });
    }
  });

  app.post("/api/location-shortcuts", async (req: Request, res: Response) => {
    try {
      const shortcut = await storage.saveLocationShortcut(req.body);
      res.json(shortcut);
    } catch (error) {
      console.error('Error saving location shortcut:', error);
      res.status(500).json({ error: 'Failed to save location shortcut' });
    }
  });

  app.put("/api/location-shortcuts/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const shortcut = await storage.updateLocationShortcut(parseInt(id), req.body);
      if (!shortcut) {
        return res.status(404).json({ error: 'Location shortcut not found' });
      }
      res.json(shortcut);
    } catch (error) {
      console.error('Error updating location shortcut:', error);
      res.status(500).json({ error: 'Failed to update location shortcut' });
    }
  });

  app.delete("/api/location-shortcuts/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { userId } = req.query;
      
      if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ error: 'User ID is required' });
      }
      
      const success = await storage.deleteLocationShortcut(parseInt(id), userId);
      if (!success) {
        return res.status(404).json({ error: 'Location shortcut not found' });
      }
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting location shortcut:', error);
      res.status(500).json({ error: 'Failed to delete location shortcut' });
    }
  });

  // AI Booking Service API endpoints
  app.post("/api/rides/book-ai", async (req: Request, res: Response) => {
    try {
      const bookingRequest: BookingRequest = req.body;
      
      // Validate required fields
      if (!bookingRequest.serviceProvider || !bookingRequest.pickup || !bookingRequest.destination) {
        return res.status(400).json({ error: 'Missing required booking information' });
      }
      
      const result = await aiBookingService.bookRide(bookingRequest);
      
      if (result.success) {
        // Save booking to storage
        await storage.saveBooking({
          originLat: bookingRequest.pickup.lat,
          originLng: bookingRequest.pickup.lng,
          destLat: bookingRequest.destination.lat,
          destLng: bookingRequest.destination.lng,
          serviceId: 1, // AI booking service
          rideType: bookingRequest.rideType,
          price: result.totalCost || 0,
          currency: 'GBP',
          originAddress: bookingRequest.pickup.address,
          destAddress: bookingRequest.destination.address,
          status: 'confirmed'
        });
      }
      
      res.json(result);
    } catch (error) {
      console.error('AI booking error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Booking service temporarily unavailable' 
      });
    }
  });

  app.post("/api/rides/estimate-ai", async (req: Request, res: Response) => {
    try {
      const { serviceProvider, pickup, destination, rideType } = req.body;
      
      if (!serviceProvider || !pickup || !destination) {
        return res.status(400).json({ error: 'Missing required information' });
      }
      
      const estimates = await aiBookingService.getRideEstimate({
        serviceProvider,
        pickup,
        destination,
        rideType
      });
      
      res.json(estimates);
    } catch (error) {
      console.error('AI estimate error:', error);
      res.status(500).json({ error: 'Estimate service temporarily unavailable' });
    }
  });

  // Uber API integration endpoints
  app.get("/api/uber/estimates", async (req: Request, res: Response) => {
    try {
      const { startLat, startLng, endLat, endLng } = req.query;
      
      if (!startLat || !startLng || !endLat || !endLng) {
        return res.status(400).json({ 
          error: 'Start and end coordinates are required (startLat, startLng, endLat, endLng)' 
        });
      }

      const estimates = await uberService.getRideEstimates(
        parseFloat(startLat as string),
        parseFloat(startLng as string),
        parseFloat(endLat as string),
        parseFloat(endLng as string)
      );

      res.json({ estimates });
    } catch (error) {
      console.error('Uber estimates error:', error);
      res.status(500).json({ error: 'Unable to get Uber estimates' });
    }
  });

  app.get("/api/uber/products", async (req: Request, res: Response) => {
    try {
      const { lat, lng } = req.query;
      
      if (!lat || !lng) {
        return res.status(400).json({ 
          error: 'Latitude and longitude are required' 
        });
      }

      const products = await uberService.getProducts(
        parseFloat(lat as string),
        parseFloat(lng as string)
      );

      res.json({ products });
    } catch (error) {
      console.error('Uber products error:', error);
      res.status(500).json({ error: 'Unable to get Uber products' });
    }
  });

  app.get("/api/uber/time-estimates", async (req: Request, res: Response) => {
    try {
      const { startLat, startLng, productId, customerUuid } = req.query;
      
      if (!startLat || !startLng) {
        return res.status(400).json({ 
          error: 'Start coordinates are required (startLat, startLng)' 
        });
      }

      const timeEstimates = await uberService.getTimeEstimates(
        parseFloat(startLat as string),
        parseFloat(startLng as string),
        customerUuid as string,
        productId as string
      );

      res.json({ timeEstimates });
    } catch (error) {
      console.error('Uber time estimates error:', error);
      res.status(500).json({ error: 'Unable to get Uber time estimates' });
    }
  });

  app.get("/api/rides/track/:bookingId", async (req: Request, res: Response) => {
    try {
      const { bookingId } = req.params;
      
      // Get booking from storage
      const bookings = await storage.getBookingHistory();
      const booking = bookings.find(b => b.id.toString() === bookingId);
      
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      
      // For AI bookings, we could implement real-time tracking
      // by periodically checking the booking page
      res.json({
        bookingId,
        status: booking.status,
        estimatedArrival: 5, // Mock data for now
        driverLocation: {
          lat: booking.originLat + 0.001,
          lng: booking.originLng + 0.001
        }
      });
    } catch (error) {
      console.error('Tracking error:', error);
      res.status(500).json({ error: 'Tracking service unavailable' });
    }
  });
  
  // Partner signup API endpoint
  app.post("/api/partner-signup", async (req: Request, res: Response) => {
    console.log('🔄 New partner signup request received');
    console.log('🔄 Request headers:', req.headers);
    console.log('🔄 Request body keys:', Object.keys(req.body));
    console.log('🔄 Request IP:', req.ip || req.connection.remoteAddress);
    
    try {
      const validatedData = insertPartnerApplicationSchema.parse(req.body);
      
      const application = await storage.savePartnerApplication(validatedData);
      
      // Send notification email to admin
      try {
        console.log('Attempting to send partner signup notification email...');
        console.log('Application data:', {
          companyName: validatedData.companyName,
          contactName: validatedData.contactName,
          email: validatedData.email
        });
        
        const { sendPartnerSignupNotification } = await import('./services/email.js');
        await sendPartnerSignupNotification(validatedData);
        console.log('✅ Partner signup notification email sent successfully to cian@farezy.co.uk');
      } catch (emailError) {
        console.error('❌ CRITICAL: Failed to send partner signup notification email:', emailError);
        if (emailError instanceof Error) {
          console.error('Email error details:', emailError.message);
          console.error('Email error stack:', emailError.stack);
        }
        // Don't fail the request if email fails
      }
      
      res.status(201).json({
        success: true,
        message: "Partner application submitted successfully",
        applicationId: application.id
      });
    } catch (error) {
      console.error('Partner signup error:', error);
      res.status(400).json({
        success: false,
        error: 'Invalid application data. Please check all required fields.'
      });
    }
  });

  // Get all partner applications (admin endpoint)
  app.get("/api/partner-applications", async (req: Request, res: Response) => {
    try {
      const applications = await storage.getPartnerApplications();
      res.json(applications);
    } catch (error) {
      console.error('Error fetching partner applications:', error);
      res.status(500).json({ error: 'Failed to fetch applications' });
    }
  });

  // Get specific partner application by ID
  app.get("/api/partner-applications/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const application = await storage.getPartnerApplicationById(parseInt(id));
      
      if (!application) {
        return res.status(404).json({ error: "Partner application not found" });
      }

      res.json(application);
    } catch (error) {
      console.error("Error fetching partner application:", error);
      res.status(500).json({ error: "Failed to fetch partner application" });
    }
  });

  // Review partner application (approve/reject)
  app.put("/api/partner-applications/:id/review", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status, adminNotes } = req.body;
      
      if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: "Invalid status. Must be 'approved' or 'rejected'" });
      }

      const application = await storage.updatePartnerApplicationStatus(
        parseInt(id), 
        status, 
        adminNotes
      );
      
      if (!application) {
        return res.status(404).json({ error: "Partner application not found" });
      }

      // If approved, send welcome email and set up booking system
      if (status === 'approved') {
        try {
          console.log('🎉 Partner approved - setting up booking system for:', application.companyName);
          
          // Send approval notification email
          const { sendPartnerApprovalNotification } = await import('./services/email.js');
          await sendPartnerApprovalNotification(application);
          console.log('✅ Partner approval notification sent to:', application.email);
          
          // Log partner activation for tracking
          console.log('📊 Partner activated:', {
            id: application.id,
            company: application.companyName,
            email: application.email,
            bookingSystemActive: true
          });
          
        } catch (emailError) {
          console.error('❌ Failed to send partner approval notification:', emailError);
          // Don't fail the request if email fails
        }
      }

      res.json(application);
    } catch (error) {
      console.error("Error updating partner application:", error);
      res.status(500).json({ error: "Failed to update partner application" });
    }
  });

  // Get approved partners for booking system
  app.get("/api/partners/approved", async (req: Request, res: Response) => {
    try {
      console.log('📋 Fetching approved partners for booking system');
      const approvedPartners = await storage.getApprovedPartners();
      console.log(`📋 Found ${approvedPartners.length} approved partners`);
      res.json(approvedPartners);
    } catch (error) {
      console.error('Error fetching approved partners:', error);
      res.status(500).json({ error: 'Failed to fetch approved partners' });
    }
  });

  // Send booking request to approved partners
  app.post("/api/rides/send-to-partners", async (req: Request, res: Response) => {
    try {
      const { pickupLocation, dropoffLocation, rideDetails, customerInfo } = req.body;
      
      console.log('🚗 New ride request - sending to approved partners');
      console.log('🚗 Pickup:', pickupLocation);
      console.log('🚗 Dropoff:', dropoffLocation);
      
      // Get all approved partners
      const approvedPartners = await storage.getApprovedPartners();
      
      if (approvedPartners.length === 0) {
        return res.status(404).json({ error: 'No approved partners available' });
      }
      
      // Send booking notification to each approved partner
      try {
        const { sendBookingRequestToPartners } = await import('./services/email.js');
        await sendBookingRequestToPartners(approvedPartners, {
          pickupLocation,
          dropoffLocation, 
          rideDetails,
          customerInfo
        });
        
        console.log(`📧 Booking request sent to ${approvedPartners.length} partners`);
        
        res.json({
          success: true,
          message: `Booking request sent to ${approvedPartners.length} partners`,
          partnersNotified: approvedPartners.length
        });
        
      } catch (emailError) {
        console.error('Failed to send booking requests to partners:', emailError);
        res.status(500).json({ error: 'Failed to notify partners' });
      }
      
    } catch (error) {
      console.error('Error processing ride request:', error);
      res.status(500).json({ error: 'Failed to process ride request' });
    }
  });



  // Driver management routes
  app.post("/api/drivers", async (req: Request, res: Response) => {
    try {
      const driverData = req.body;
      const driver = await storage.saveDriver(driverData);
      res.status(201).json(driver);
    } catch (error) {
      console.error("Error creating driver:", error);
      res.status(500).json({ error: "Failed to create driver" });
    }
  });

  app.get("/api/drivers/partner/:partnerId", async (req: Request, res: Response) => {
    try {
      const partnerId = parseInt(req.params.partnerId);
      const drivers = await storage.getDriversByPartnerId(partnerId);
      res.json(drivers);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      res.status(500).json({ error: "Failed to fetch drivers" });
    }
  });

  app.put("/api/drivers/:id/status", async (req: Request, res: Response) => {
    try {
      const driverId = parseInt(req.params.id);
      const { status } = req.body;
      const driver = await storage.updateDriverStatus(driverId, status);
      res.json(driver);
    } catch (error) {
      console.error("Error updating driver status:", error);
      res.status(500).json({ error: "Failed to update driver status" });
    }
  });

  app.post("/api/drivers/:id/location", async (req: Request, res: Response) => {
    try {
      const driverId = parseInt(req.params.id);
      const { lat, lng, heading, speed } = req.body;
      
      await storage.updateDriverLocation(driverId, lat, lng);
      await storage.saveDriverLocation({
        driverId,
        lat: lat.toString(),
        lng: lng.toString(),
        heading: heading?.toString(),
        speed: speed?.toString(),
      });
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating driver location:", error);
      res.status(500).json({ error: "Failed to update driver location" });
    }
  });

  // Vehicle management routes
  app.post("/api/vehicles", async (req: Request, res: Response) => {
    try {
      const vehicleData = req.body;
      const vehicle = await storage.saveVehicle(vehicleData);
      res.status(201).json(vehicle);
    } catch (error) {
      console.error("Error creating vehicle:", error);
      res.status(500).json({ error: "Failed to create vehicle" });
    }
  });

  app.get("/api/vehicles/partner/:partnerId", async (req: Request, res: Response) => {
    try {
      const partnerId = parseInt(req.params.partnerId);
      const vehicles = await storage.getVehiclesByPartnerId(partnerId);
      res.json(vehicles);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      res.status(500).json({ error: "Failed to fetch vehicles" });
    }
  });

  // Real-time ride booking routes
  app.post("/api/rides/request", async (req: Request, res: Response) => {
    try {
      const rideData = req.body;
      const rideRequest = await storage.saveRideRequest(rideData);
      
      // Find nearby available drivers
      const nearbyDrivers = await storage.getAvailableDrivers(
        parseFloat(rideData.pickupLat),
        parseFloat(rideData.pickupLng),
        10 // 10km radius
      );

      // Generate price quotes from available drivers/partners
      const quotes = [];
      for (const driver of nearbyDrivers.slice(0, 5)) { // Limit to 5 quotes
        const basePrice = 8 + (rideRequest.estimatedDistance || 5) * 2.5;
        const quote = await storage.savePriceQuote({
          rideRequestId: rideRequest.id,
          partnerId: driver.partnerId!,
          driverId: driver.id,
          quotedPrice: (basePrice + Math.random() * 10 - 5).toFixed(2),
          estimatedArrival: Math.floor(Math.random() * 8) + 3, // 3-10 minutes
          estimatedDuration: Math.floor((rideRequest.estimatedDuration || 15) + Math.random() * 10 - 5),
          validUntil: new Date(Date.now() + 5 * 60 * 1000), // Valid for 5 minutes
        });
        quotes.push(quote);
      }

      res.status(201).json({
        rideRequest,
        quotes: quotes.sort((a, b) => parseFloat(a.quotedPrice) - parseFloat(b.quotedPrice))
      });
    } catch (error) {
      console.error("Error creating ride request:", error);
      res.status(500).json({ error: "Failed to create ride request" });
    }
  });

  app.get("/api/rides/quotes/:rideId", async (req: Request, res: Response) => {
    try {
      const rideId = parseInt(req.params.rideId);
      const quotes = await storage.getQuotesForRide(rideId);
      
      // Get driver details for each quote
      const quotesWithDrivers = await Promise.all(quotes.map(async (quote) => {
        const driver = await storage.getDriverById(quote.driverId!);
        const vehicle = driver?.vehicleId ? await storage.getVehicleById(driver.vehicleId) : null;
        return {
          ...quote,
          driver,
          vehicle
        };
      }));

      res.json(quotesWithDrivers.sort((a, b) => parseFloat(a.quotedPrice) - parseFloat(b.quotedPrice)));
    } catch (error) {
      console.error("Error fetching quotes:", error);
      res.status(500).json({ error: "Failed to fetch quotes" });
    }
  });

  app.post("/api/rides/accept/:quoteId", async (req: Request, res: Response) => {
    try {
      const quoteId = parseInt(req.params.quoteId);
      const quote = await storage.acceptQuote(quoteId);
      
      if (quote) {
        // Update ride request status and assign driver
        await storage.updateRideRequestStatus(quote.rideRequestId!, "accepted", quote.driverId!);
        
        // Update driver status to busy
        await storage.updateDriverStatus(quote.driverId!, "busy");
        
        res.json({ success: true, quote });
      } else {
        res.status(404).json({ error: "Quote not found or expired" });
      }
    } catch (error) {
      console.error("Error accepting quote:", error);
      res.status(500).json({ error: "Failed to accept quote" });
    }
  });

  app.put("/api/rides/:rideId/status", async (req: Request, res: Response) => {
    try {
      const rideId = parseInt(req.params.rideId);
      const { status } = req.body;
      
      const updatedRide = await storage.updateRideRequestStatus(rideId, status);
      
      // Update driver status when ride is completed or cancelled
      if (updatedRide && (status === "completed" || status === "cancelled")) {
        if (updatedRide.driverId) {
          await storage.updateDriverStatus(updatedRide.driverId, "online");
        }
      }
      
      res.json(updatedRide);
    } catch (error) {
      console.error("Error updating ride status:", error);
      res.status(500).json({ error: "Failed to update ride status" });
    }
  });

  // Get nearby available drivers for customers
  app.get("/api/drivers/nearby", async (req: Request, res: Response) => {
    try {
      const { lat, lng, radius = 10 } = req.query;
      
      if (!lat || !lng) {
        return res.status(400).json({ error: "Latitude and longitude are required" });
      }

      const drivers = await storage.getAvailableDrivers(
        parseFloat(lat as string),
        parseFloat(lng as string),
        parseFloat(radius as string)
      );

      res.json(drivers);
    } catch (error) {
      console.error("Error fetching nearby drivers:", error);
      res.status(500).json({ error: "Failed to fetch nearby drivers" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Create HTTP server
  const httpServer = createServer(app);
  
  // WebSocket server for real-time driver tracking
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Store active driver connections
  const driverConnections = new Map<number, WebSocket>();
  
  wss.on('connection', (ws: WebSocket, req) => {
    console.log('New WebSocket connection established');
    
    ws.on('message', async (message: string) => {
      try {
        const data = JSON.parse(message);
        
        if (data.type === 'driver_connect') {
          // Register driver connection
          const driverId = data.driverId;
          driverConnections.set(driverId, ws);
          console.log(`Driver ${driverId} connected`);
          
          ws.send(JSON.stringify({
            type: 'connection_confirmed',
            driverId: driverId
          }));
        }
        
        if (data.type === 'location_update') {
          // Update driver location in database
          const { driverId, lat, lng, heading, speed } = data;
          
          await storage.saveDriverLocation({
            driverId,
            lat: lat.toString(),
            lng: lng.toString(),
            heading: heading?.toString(),
            speed: speed?.toString()
          });
          
          // Broadcast location to any tracking clients
          const locationUpdate = {
            type: 'driver_location_update',
            driverId,
            lat,
            lng,
            heading,
            speed,
            timestamp: new Date().toISOString()
          };
          
          // Send to all connected clients
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(locationUpdate));
            }
          });
        }
        
        if (data.type === 'ride_update') {
          // Handle ride status updates
          const { rideId, status, driverId } = data;
          
          await storage.updateRideRequestStatus(rideId, status, driverId);
          
          // Broadcast ride update
          const rideUpdate = {
            type: 'ride_status_update',
            rideId,
            status,
            driverId,
            timestamp: new Date().toISOString()
          };
          
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(rideUpdate));
            }
          });
        }
        
      } catch (error) {
        console.error('WebSocket message error:', error);
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Invalid message format'
        }));
      }
    });
    
    ws.on('close', () => {
      // Remove driver from active connections
      for (const [driverId, connection] of driverConnections.entries()) {
        if (connection === ws) {
          driverConnections.delete(driverId);
          console.log(`Driver ${driverId} disconnected`);
          break;
        }
      }
    });
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  return httpServer;
}

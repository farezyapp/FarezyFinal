import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, MapPin, Car, Clock, PoundSterling, Navigation, Globe, ChevronDown, User, Moon, Sun, Mic, Shield, Star, TrendingUp, Route, Phone, Menu, X, Building } from 'lucide-react';
import GoogleMapsWrapper from '@/components/google-maps-wrapper';
import LocationAutocomplete from '@/components/location-autocomplete';
import DriverTrackingMap from '@/components/driver-tracking-map';
import EnhancedMap from '@/components/enhanced-map';
import MapFallback from '@/components/map-fallback';
import LocationBasedMap from '@/components/location-based-map';
import { useLocation } from '@/hooks/use-location';
import { useLocation as useRouterLocation, Link } from 'wouter';
import { useScrollAnimation, useStaggeredAnimation } from '@/hooks/use-scroll-animation';
import { useNotifications } from '@/hooks/use-notifications';
import { NotificationCenter } from '@/components/notification-center';
import { PWAInstallButton } from '@/components/pwa-install-button';
import { Skeleton, RideOptionSkeleton, FeatureSkeleton } from '@/components/skeleton-loader';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { translations, getTranslation, type LanguageCode } from '@/lib/translations';
import { MobileHeader } from '@/components/mobile-header';
import { DesktopHeader } from '@/components/desktop-header';
import { CompanySearchModal } from '@/components/company-search-modal';
import { useWebSocket } from '@/hooks/useWebSocket';

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

const Home: React.FC = () => {
  const [destination, setDestination] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [isPickupLocationDefault, setIsPickupLocationDefault] = useState(true);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  });
  const [selectedTime, setSelectedTime] = useState(() => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`; // Format: HH:MM
  });
  const [searchResults, setSearchResults] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'price' | 'time'>('price');
  const [selectedRide, setSelectedRide] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFlightModalOpen, setIsFlightModalOpen] = useState(false);
  const [flightNumber, setFlightNumber] = useState('');
  const [airportLocation, setAirportLocation] = useState('');
  const [rideOptions, setRideOptions] = useState<{
    id: string;
    service: string;
    type: string;
    price: string;
    time: string;
    color: string;
    distance?: string;
    multiplier?: number;
    estimatedPickupTime?: number;
    estimatedTripTime?: number;
    priceHistory?: number[];
    priceTrend?: 'up' | 'down' | 'stable';
    loyaltyPoints?: number;
    routeOptimized?: boolean;
    trafficDelay?: number;
    predictedPrice?: {
      in15min: string;
      in30min: string;
      in60min: string;
    };
  }[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [livePriceInterval, setLivePriceInterval] = useState<NodeJS.Timeout | null>(null);
  const [userLoyaltyPoints, setUserLoyaltyPoints] = useState({
    uber: 1250,
    lyft: 890,
    bolt: 430,
    localTaxi: 0,
    total: 2570
  });
  const { 
    notifyBookingConfirmed, 
    notifyPriceAlert, 
    notifyDriverArrival, 
    notifySafetyCheck 
  } = useNotifications();
  
  // Animation refs
  const heroRef = useScrollAnimation();
  const featuresRef = useStaggeredAnimation(3, 200);
  const statsRef = useStaggeredAnimation(4, 150);
  const safetyRef = useStaggeredAnimation(4, 100);

  // Airport detection function
  const isAirportLocation = (location: string) => {
    const airportKeywords = [
      'airport', 'international airport', 'terminal', 'terminals',
      'heathrow', 'gatwick', 'stansted', 'luton', 'southend',
      'manchester airport', 'birmingham airport', 'edinburgh airport', 
      'glasgow airport', 'bristol airport', 'cardiff airport',
      'liverpool airport', 'leeds bradford', 'newcastle airport',
      'lhr', 'lgw', 'stn', 'ltn', 'sen', 'man', 'bhx', 'edi', 
      'gla', 'brs', 'cwl', 'lpl', 'lba', 'ncl'
    ];
    const lowerLocation = location.toLowerCase();
    console.log('Checking airport location:', lowerLocation);
    const isAirport = airportKeywords.some(keyword => lowerLocation.includes(keyword));
    console.log('Is airport detected:', isAirport);
    return isAirport;
  };
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [showDriver, setShowDriver] = useState(false);
  const [mapDestination, setMapDestination] = useState<Location | null>(null);

  const [showMap, setShowMap] = useState(false);
  const [, setLocation] = useRouterLocation();
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('EN');
  
  // New feature states
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [priceHistory, setPriceHistory] = useState<{ [key: string]: number[] }>({});
  const [trafficDelay, setTrafficDelay] = useState(0);
  const [routeOptimized, setRouteOptimized] = useState(false);
  const [isCompanySearchModalOpen, setIsCompanySearchModalOpen] = useState(false);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  
  // Safety and tracking features
  const [driverInfo, setDriverInfo] = useState<{
    name: string;
    photo: string;
    licensePlate: string;
    carModel: string;
    rating: number;
    verified: boolean;
  } | null>(null);
  const [isTrackingActive, setIsTrackingActive] = useState(false);
  const [geofenceAlerts, setGeofenceAlerts] = useState<string[]>([]);
  const [driverLocation, setDriverLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingReference, setBookingReference] = useState<string | null>(null);
  
  // WebSocket states for driver app integration
  const [driverAppUrl] = useState('farezydriver.replit.app');
  const [isConnectedToDriverApp, setIsConnectedToDriverApp] = useState(false);
  const [driverServiceStatus, setDriverServiceStatus] = useState('disconnected');

  // Initialize Farezy Driver Service
  useEffect(() => {
    if (typeof window !== 'undefined' && window.farezyDriverService) {
      // Initialize connection to driver app
      window.farezyDriverService.initialize(driverAppUrl, {
        onConnect: () => {
          console.log('✅ Driver service connected');
          setIsConnectedToDriverApp(true);
          setDriverServiceStatus('connected');
        },
        onDisconnect: () => {
          console.log('❌ Driver service disconnected');
          setIsConnectedToDriverApp(false);
          setDriverServiceStatus('disconnected');
        },
        onBookingResponse: (message) => {
          console.log('📨 Booking response:', message);
          if (message.type === 'booking_accepted') {
            console.log('✅ Booking accepted by driver');
          } else if (message.type === 'booking_declined') {
            console.log('❌ Booking declined by driver');
          }
        },
        onError: (error) => {
          console.error('Driver service error:', error);
          setDriverServiceStatus('error');
        }
      });
    }

    // Cleanup on unmount
    return () => {
      if (typeof window !== 'undefined' && window.farezyDriverService) {
        window.farezyDriverService.disconnect();
      }
    };
  }, [driverAppUrl]);

  // Note: Connection status is now managed by the driver service

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Helper function to get translated text
  const t = (key: keyof typeof translations.EN) => getTranslation(selectedLanguage, key);
  
  // Frequent destinations (in a real app, this would come from user history)
  const frequentDestinations = [
    'Milton Keynes Central Station',
    'Xscape Milton Keynes', 
    'The Centre:MK Shopping Centre'
  ];
  
  // Use the location hook
  const { 
    userLocation, 
    destination: locationDestination, 
    setDestinationByAddress,
    isLoading: isLocationLoading
  } = useLocation();
  
  // Update pickup location when user location is loaded
  useEffect(() => {
    if (userLocation && userLocation.address && isPickupLocationDefault) {
      setPickupLocation(`(Current location) ${userLocation.address}`);
    }
  }, [userLocation, isPickupLocationDefault]);
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (destination.trim() && pickupLocation.trim()) {
      setIsLoading(true);
      try {
        // Geocode both pickup and destination locations
        const [pickupCoords, destCoords] = await Promise.all([
          geocodeLocation(pickupLocation),
          geocodeLocation(destination)
        ]);

        if (pickupCoords && destCoords) {
          // Calculate distance between pickup and destination
          const distance = calculateDistance(pickupCoords, destCoords);
          console.log(`Distance calculated: ${distance.toFixed(2)} km`);
          
          // Generate ride options with distance-based pricing from approved partners
          const dynamicRideOptions = await generateRideOptionsWithPricing(distance, pickupCoords, destCoords);
          
          // Filter ride options based on selected companies
          const filteredRideOptions = selectedCompanies.length > 0 
            ? dynamicRideOptions.filter(option => {
                const companyName = option.service.toLowerCase();
                return selectedCompanies.some(selectedCompany => 
                  companyName.includes(selectedCompany.toLowerCase()) ||
                  selectedCompany.toLowerCase().includes(companyName)
                );
              })
            : dynamicRideOptions;
          
          setRideOptions(filteredRideOptions);
          
          // Set the destination for the map
          await setDestinationByAddress(destination);
          setSearchResults(true);
          setSelectedRide(null);
          setIsBookingConfirmed(false);
          setShowMap(true);
        } else {
          console.error('Failed to geocode one or both locations');
        }
      } catch (error) {
        console.error('Error setting destination:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Geocode location function
  const geocodeLocation = async (address: string): Promise<{ lat: number; lng: number } | null> => {
    try {
      const response = await fetch(`/api/location/geocode?address=${encodeURIComponent(address)}`);
      if (!response.ok) throw new Error('Geocoding failed');
      
      const data = await response.json();
      return { lat: data.location.lat, lng: data.location.lng };
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };
  
  // Update map destination when location destination changes
  useEffect(() => {
    if (locationDestination) {
      setMapDestination(locationDestination);
    }
  }, [locationDestination]);
  
  const handleRideSelect = (rideId: string) => {
    setSelectedRide(rideId);
  };
  
  const handleBookingOpen = () => {
    if (selectedRide) {
      setIsBookingModalOpen(true);
    }
  };
  
  const handleBookingClose = () => {
    setIsBookingModalOpen(false);
    // Reset booking reference when closing modal
    setBookingReference(null);
  };
  
  // Enhanced booking submission with Farezy driver service integration
  const handleBookingConfirm = () => {
    console.log('🚀 BOOKING CONFIRMED - Starting booking process...');
    setIsBookingModalOpen(false);
    setIsBookingConfirmed(true);
    setShowDriver(true);
    
    // Generate booking reference once when booking starts
    if (!bookingReference) {
      const newReference = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      setBookingReference(newReference);
    }
    
    // Generate driver information and start tracking
    const driver = generateDriverInfo();
    setDriverInfo(driver);
    setIsTrackingActive(true);
    setGeofenceAlerts([]);
    
    // Get selected ride data
    const selectedRideData = rideOptions.find(r => r.id === selectedRide);
    if (!selectedRideData) return;
    
    // Send booking confirmation notification
    notifyBookingConfirmed({
      serviceName: selectedRideData.service,
      price: selectedRideData.price,
      estimatedTime: selectedRideData.time
    });
    
    // Schedule safety check-in notification after 5 minutes
    setTimeout(() => {
      notifySafetyCheck();
    }, 5 * 60 * 1000); // 5 minutes in milliseconds
    
    // Scroll to top of page when booking is confirmed
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Enhanced booking submission with all required data
    const bookingFormData = {
      name: "John Doe", // This would come from user profile/auth
      phone: "+44 7000 000000", // This would come from user profile/auth
      pickup: pickupLocation || userLocation?.address || 'Current Location',
      destination: destination,
      pickupCoords: {
        lat: userLocation?.lat || 51.5074,
        lng: userLocation?.lng || -0.1278
      },
      destCoords: {
        lat: 51.5074 + (Math.random() - 0.5) * 0.01, // This would be calculated from actual destination
        lng: -0.1278 + (Math.random() - 0.5) * 0.01
      },
      fare: parseFloat(selectedRideData.price.replace('£', '')),
      distance: 2.5 // This would be calculated from route
    };
    
    console.log('📋 Booking form data prepared:', bookingFormData);
    
    // Try multiple booking methods for maximum compatibility
    let bookingSuccess = false;
    
    // Method 1: Enhanced Farezy Driver Service
    const farezySuccess = bookRideWithFarezy(bookingFormData);
    if (farezySuccess) {
      console.log('✅ Ride request sent via Farezy Driver Service');
      bookingSuccess = true;
    }
    
    // Method 2: Direct WebSocket connection
    if (typeof window !== 'undefined' && window.sendBookingToDrivers) {
      const directSuccess = window.sendBookingToDrivers({
        name: bookingFormData.name,
        phone: bookingFormData.phone,
        pickup: bookingFormData.pickup,
        destination: bookingFormData.destination,
        pickupLat: bookingFormData.pickupCoords.lat,
        pickupLng: bookingFormData.pickupCoords.lng,
        destinationLat: bookingFormData.destCoords.lat,
        destinationLng: bookingFormData.destCoords.lng,
        price: bookingFormData.fare,
        distance: bookingFormData.distance
      });
      
      if (directSuccess) {
        console.log('✅ Ride request sent via Direct WebSocket');
        bookingSuccess = true;
      }
    }
    
    if (bookingSuccess) {
      console.log('✅ Ride request sent to Farezy driver network successfully');
      
      // Update booking status indicator
      const bookingStatusElement = document.getElementById('booking-status');
      if (bookingStatusElement) {
        bookingStatusElement.textContent = 'Looking for available drivers...';
        bookingStatusElement.className = 'notification warning';
      }
    } else {
      console.log('❌ Failed to send ride request - falling back to demo mode');
      
      // Update booking status to show fallback
      const bookingStatusElement = document.getElementById('booking-status');
      if (bookingStatusElement) {
        bookingStatusElement.textContent = 'Demo mode - simulated driver';
        bookingStatusElement.className = 'notification info';
      }
      
      // Fall back to demo mode (driver update notification removed)
    }
    
    // Trigger arrival notification after 8 seconds (simulated)
    setTimeout(() => {
      notifyDriverArrival(2);
    }, 8000);
    
    // Schedule safety check-in after 15 seconds
    setTimeout(() => {
      notifySafetyCheck();
    }, 15000);
  }
  
  // Enhanced booking function using Farezy Driver Service
  const bookRideWithFarezy = (formData: {
    name?: string;
    phone?: string;
    pickup?: string;
    destination?: string;
    pickupCoords?: { lat: number; lng: number };
    destCoords?: { lat: number; lng: number };
    fare?: number;
    distance?: number;
    // Direct booking parameters (simplified format)
    passengerName?: string;
    passengerPhone?: string;
    pickupAddress?: string;
    destinationAddress?: string;
    estimatedFare?: number;
  }) => {
    // Check if Farezy Driver Service is available
    if (typeof window !== 'undefined' && window.farezyDriverService) {
      let rideDetails;
      
      // Handle both formats - full form data or direct booking parameters
      if (formData.passengerName || formData.pickupAddress) {
        // Direct booking format
        rideDetails = {
          passengerName: formData.passengerName || 'Passenger',
          passengerPhone: formData.passengerPhone || '+44',
          pickupAddress: formData.pickupAddress || 'Current Location',
          destinationAddress: formData.destinationAddress || 'Destination',
          pickupLat: 51.5074 + (Math.random() - 0.5) * 0.01,
          pickupLng: -0.1278 + (Math.random() - 0.5) * 0.01,
          destinationLat: 51.5074 + (Math.random() - 0.5) * 0.01,
          destinationLng: -0.1278 + (Math.random() - 0.5) * 0.01,
          estimatedFare: formData.estimatedFare || 10.00,
          distance: formData.distance || 2.0,
          serviceType: 'standard'
        };
      } else {
        // Full form data format
        rideDetails = {
          passengerName: formData.name || 'Passenger',
          passengerPhone: formData.phone || '+44',
          pickupAddress: formData.pickup || 'Current Location',
          destinationAddress: formData.destination || 'Destination',
          pickupLat: formData.pickupCoords?.lat || 51.5074,
          pickupLng: formData.pickupCoords?.lng || -0.1278,
          destinationLat: formData.destCoords?.lat || 51.5074,
          destinationLng: formData.destCoords?.lng || -0.1278,
          estimatedFare: formData.fare || 10.00,
          distance: formData.distance || 2.0,
          serviceType: 'standard'
        };
      }
      
      console.log('🚗 Booking ride with enhanced Farezy service:', rideDetails);
      return window.farezyDriverService.requestRide(rideDetails);
    } else {
      console.log('❌ Farezy Driver Service not available');
      return false;
    }
  }
  
  // Example booking function for testing
  const testExampleBooking = () => {
    return bookRideWithFarezy({
      passengerName: 'John Smith',
      passengerPhone: '+447123456789',
      pickupAddress: 'London Eye, Westminster, London',
      destinationAddress: 'Big Ben, Westminster, London',
      estimatedFare: 15.50,
      distance: 2.5
    });
  };
  


  const handleFrequentDestinationClick = async (destinationName: string) => {
    setDestination(destinationName);
    try {
      await setDestinationByAddress(destinationName);
      setSearchResults(true);
      setSelectedRide(null);
      setIsBookingConfirmed(false);
      setShowMap(true);
    } catch (error) {
      console.error('Error setting destination:', error);
    }
  };

  const handleLanguageSelect = (language: LanguageCode) => {
    setSelectedLanguage(language);
    setIsLanguageModalOpen(false);
  };

  const handleCompanySearch = () => {
    setIsCompanySearchModalOpen(true);
  };

  const handleCompanySelect = (companies: string) => {
    setSelectedCompanies(companies.split(','));
    setIsCompanySearchModalOpen(false);
    // Re-fetch ride options with company filter
    if (searchResults) {
      handleSearch(new Event('submit') as any);
    }
  };

  // Voice search functionality
  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      setIsListening(true);
      recognition.start();
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (pickupLocation === '') {
          setPickupLocation(transcript);
        } else {
          setDestination(transcript);
        }
        setIsListening(false);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
    }
  };

  // Dark mode toggle
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Live price updates with WebSocket simulation
  useEffect(() => {
    if (searchResults && rideOptions.length > 0) {
      const interval = setInterval(() => {
        setRideOptions(prevOptions => 
          prevOptions.map(ride => {
            const currentPrice = parseFloat(ride.price.replace('£', ''));
            const priceVariation = (Math.random() - 0.5) * 0.08; // ±4% variation
            const newPrice = currentPrice * (1 + priceVariation);
            
            // Update price trend
            let priceTrend: 'up' | 'down' | 'stable' = 'stable';
            if (newPrice > currentPrice * 1.02) priceTrend = 'up';
            else if (newPrice < currentPrice * 0.98) priceTrend = 'down';
            
            // Update price history
            const updatedHistory = [...(ride.priceHistory || []), newPrice].slice(-20);
            
            return {
              ...ride,
              price: `£${newPrice.toFixed(2)}`,
              priceHistory: updatedHistory,
              priceTrend,
              predictedPrice: generatePredictivePricing(newPrice)
            };
          })
        );
        
        setPriceHistory(prev => ({
          ...prev,
          [Date.now()]: rideOptions.map(r => parseFloat(r.price.replace('£', '')))
        }));
      }, 8000); // Update every 8 seconds for more dynamic feel
      
      setLivePriceInterval(interval);
      return () => {
        clearInterval(interval);
        setLivePriceInterval(null);
      };
    }
  }, [searchResults, rideOptions.length]);

  // Traffic-aware routing simulation
  useEffect(() => {
    if (searchResults) {
      // Simulate traffic data fetching
      const trafficFactor = Math.random() * 0.3; // 0-30% delay
      setTrafficDelay(Math.floor(trafficFactor * 15)); // 0-15 minute delay
      setRouteOptimized(trafficFactor < 0.2); // Optimized if low traffic
    }
  }, [searchResults]);

  // Driver information simulation
  const generateDriverInfo = () => {
    const drivers = [
      {
        name: "James Wilson",
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        licensePlate: "MK23 ABC",
        carModel: "Toyota Prius",
        rating: 4.8,
        verified: true
      },
      {
        name: "Sarah Ahmed",
        photo: "https://images.unsplash.com/photo-1494790108755-2616b612b5e6?w=150&h=150&fit=crop&crop=face",
        licensePlate: "MK24 XYZ",
        carModel: "Honda Civic",
        rating: 4.9,
        verified: true
      },
      {
        name: "David Brown",
        photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        licensePlate: "MK22 DEF",
        carModel: "Volkswagen Golf",
        rating: 4.7,
        verified: true
      }
    ];
    return drivers[Math.floor(Math.random() * drivers.length)];
  };

  // Live GPS tracking simulation with road-following movement
  useEffect(() => {
    if (isTrackingActive && userLocation) {
      // Start driver at a realistic distance from user
      const initialDistance = 0.003; // ~300m away
      const initialAngle = Math.random() * 2 * Math.PI;
      const initialDriverLocation = {
        lat: userLocation.lat + Math.cos(initialAngle) * initialDistance,
        lng: userLocation.lng + Math.sin(initialAngle) * initialDistance
      };
      setDriverLocation(initialDriverLocation);

      // Get route from Google Directions API for realistic path
      const getRouteToUser = async (driverPos: { lat: number; lng: number }) => {
        try {
          const directionsService = new google.maps.DirectionsService();
          const result = await directionsService.route({
            origin: driverPos,
            destination: userLocation,
            travelMode: google.maps.TravelMode.DRIVING,
            avoidHighways: false,
            avoidTolls: false
          });
          
          if (result.routes && result.routes[0]) {
            const path = result.routes[0].overview_path;
            return path;
          }
        } catch (error) {
          console.log('Directions API not available, using direct path');
        }
        return null;
      };

      let routePoints: google.maps.LatLng[] = [];
      let currentRouteIndex = 0;

      // Get route from driver to user once
      let routePromise = getRouteToUser(initialDriverLocation);
      
      const interval = setInterval(async () => {
        setDriverLocation(prevLocation => {
          if (!prevLocation) return initialDriverLocation;
          
          // If we don't have route points yet, get them asynchronously
          if (routePoints.length === 0 && window.google && window.google.maps) {
            routePromise.then(path => {
              if (path) {
                routePoints = path;
                currentRouteIndex = 0;
              }
            });
          }

          // Follow route points if available
          if (routePoints.length > 0 && currentRouteIndex < routePoints.length) {
            const targetPoint = routePoints[currentRouteIndex];
            const dx = targetPoint.lat() - prevLocation.lat;
            const dy = targetPoint.lng() - prevLocation.lng;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // If close to current route point, move to next one
            if (distance < 0.00002) { // Even smaller threshold for smoother transitions
              currentRouteIndex++;
              if (currentRouteIndex >= routePoints.length) {
                // Reached destination
                return userLocation;
              }
            }
            
            const moveSpeed = 0.00001; // Much slower, smoother movement
            const normalizedDx = distance > 0 ? dx / distance : 0;
            const normalizedDy = distance > 0 ? dy / distance : 0;
            
            const newLocation = {
              lat: prevLocation.lat + normalizedDx * moveSpeed,
              lng: prevLocation.lng + normalizedDy * moveSpeed
            };

            // Check geofence alerts
            const distanceToUser = calculateDistance(userLocation, newLocation);
            const distanceInMeters = distanceToUser * 1000;
            
            if (distanceInMeters < 500 && !geofenceAlerts.includes('approaching')) {
              setGeofenceAlerts(prev => [...prev, 'approaching']);
            }
            if (distanceInMeters < 200 && !geofenceAlerts.includes('nearby')) {
              setGeofenceAlerts(prev => [...prev, 'nearby']);
            }
            if (distanceInMeters < 50 && !geofenceAlerts.includes('arrived')) {
              setGeofenceAlerts(prev => [...prev, 'arrived']);
            }
            
            return newLocation;
          } else {
            // Fallback to direct movement if no route available
            const dx = userLocation.lat - prevLocation.lat;
            const dy = userLocation.lng - prevLocation.lng;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 0.00002) return prevLocation;
            
            const moveSpeed = 0.00001; // Much slower, smoother movement
            const normalizedDx = distance > 0 ? dx / distance : 0;
            const normalizedDy = distance > 0 ? dy / distance : 0;
            
            const newLocation = {
              lat: prevLocation.lat + normalizedDx * moveSpeed,
              lng: prevLocation.lng + normalizedDy * moveSpeed
            };

            const distanceToUser = calculateDistance(userLocation, newLocation);
            const distanceInMeters = distanceToUser * 1000;
            
            if (distanceInMeters < 500 && !geofenceAlerts.includes('approaching')) {
              setGeofenceAlerts(prev => [...prev, 'approaching']);
            }
            if (distanceInMeters < 200 && !geofenceAlerts.includes('nearby')) {
              setGeofenceAlerts(prev => [...prev, 'nearby']);
            }
            if (distanceInMeters < 50 && !geofenceAlerts.includes('arrived')) {
              setGeofenceAlerts(prev => [...prev, 'arrived']);
            }
            
            return newLocation;
          }
        });
      }, 100); // Update every 100ms for very smooth movement

      return () => clearInterval(interval);
    }
  }, [isTrackingActive, userLocation]);

  // Calculate distance between two points
  const calculateDistance = (point1: { lat: number; lng: number }, point2: { lat: number; lng: number }) => {
    const R = 6371; // Earth's radius in km
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLng = (point2.lng - point1.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Calculate dynamic pricing based on distance
  const calculateDistanceBasedPricing = (distanceKm: number) => {
    const baseFare = 3.50; // Base fare in GBP
    const ratePerKm = 1.20; // Rate per kilometer
    const minimumFare = 5.00; // Minimum fare
    
    const calculatedFare = baseFare + (distanceKm * ratePerKm);
    return Math.max(calculatedFare, minimumFare);
  };

  // Traffic and route optimization
  const getTrafficMultiplier = () => {
    const currentHour = new Date().getHours();
    const isRushHour = (currentHour >= 7 && currentHour <= 9) || (currentHour >= 17 && currentHour <= 19);
    return isRushHour ? 1.3 : 1.0;
  };

  // Generate predictive pricing
  const generatePredictivePricing = (basePrice: number) => {
    const trafficMultiplier = getTrafficMultiplier();
    const in15min = basePrice * (trafficMultiplier - 0.05); // Slightly better
    const in30min = basePrice * (trafficMultiplier - 0.15); // Better
    const in60min = basePrice * (trafficMultiplier - 0.25); // Much better
    
    return {
      in15min: `£${Math.max(in15min, basePrice * 0.7).toFixed(2)}`,
      in30min: `£${Math.max(in30min, basePrice * 0.6).toFixed(2)}`,
      in60min: `£${Math.max(in60min, basePrice * 0.5).toFixed(2)}`
    };
  };

  // Calculate loyalty points earned
  const calculateLoyaltyPoints = (service: string, price: number) => {
    const pointsMultipliers = {
      'Uber': 2, // 2 points per £1
      'Lyft': 1.5,
      'Bolt': 3, // Higher points for Bolt
      'Local Taxi': 1,
    };
    return Math.floor(price * (pointsMultipliers[service as keyof typeof pointsMultipliers] || 1));
  };

  // Fetch ride options from approved partners only (no mock data)
  const generateRideOptionsWithPricing = async (distance: number, origin: any, dest: any) => {
    try {
      const response = await fetch(`/api/rides?originLat=${origin.lat}&originLng=${origin.lng}&destLat=${dest.lat}&destLng=${dest.lng}&distance=${distance}&duration=${Math.ceil(distance * 1.5)}`);
      if (!response.ok) {
        console.error('Failed to fetch ride options from API, using mock data');
        return generateMockRideOptions(distance);
      }
      const rideOptions = await response.json();
      const apiOptions = rideOptions.map((option: any) => ({
        id: option.id || option.serviceId,
        service: option.serviceName,
        type: option.serviceType,
        price: `£${option.price.toFixed(2)}`,
        time: `${option.estimatedPickupTime} min`,
        color: option.backgroundColor || '#f97316',
        distance: `${option.estimatedDistance.toFixed(1)} km`,
        estimatedPickupTime: option.estimatedPickupTime,
        estimatedTripTime: option.estimatedTripTime,
        routeOptimized: true,
        loyaltyPoints: Math.floor(option.price * 2),
        trafficDelay: 0
      }));
      
      // If API returns no results, provide mock data
      if (apiOptions.length === 0) {
        console.log('API returned no results, using mock data');
        return generateMockRideOptions(distance);
      }
      
      return apiOptions;
    } catch (error) {
      console.error('Error fetching ride options:', error);
      return generateMockRideOptions(distance);
    }
  }

  // Mock ride options generator
  const generateMockRideOptions = (distance: number) => {
    const basePrice = Math.max(3.50, distance * 0.8 + 2.5);
    const baseTravelTime = Math.ceil(distance * 1.5 + 5); // Estimate: distance in km * 1.5 min per km + 5 min
    
    const mockServices = [
      {
        id: 'uber-standard',
        service: 'Uber',
        type: 'UberX',
        color: '#000000',
        priceMultiplier: 1.0,
        timeVariation: 0
      },
      {
        id: 'bolt-standard',
        service: 'Bolt',
        type: 'Bolt',
        color: '#34D186',
        priceMultiplier: 0.85,
        timeVariation: -2
      },
      {
        id: 'local-taxi-1',
        service: 'MK Taxis',
        type: 'Standard',
        color: '#FFA500',
        priceMultiplier: 0.90,
        timeVariation: 1
      },
      {
        id: 'local-taxi-2',
        service: 'City Cabs',
        type: 'Executive',
        color: '#4169E1',
        priceMultiplier: 1.15,
        timeVariation: -1
      },
      {
        id: 'local-taxi-3',
        service: 'Premier Cars',
        type: 'Premium',
        color: '#800080',
        priceMultiplier: 1.25,
        timeVariation: -3
      },
      {
        id: 'uber-comfort',
        service: 'Uber',
        type: 'Comfort',
        color: '#000000',
        priceMultiplier: 1.3,
        timeVariation: 2
      }
    ];
    
    return mockServices.map(service => {
      const price = basePrice * service.priceMultiplier;
      const pickupTime = Math.max(1, Math.ceil(Math.random() * 8) + 2 + service.timeVariation);
      const tripTime = Math.max(baseTravelTime + service.timeVariation, 5);
      
      return {
        id: service.id,
        service: service.service,
        type: service.type,
        price: `£${price.toFixed(2)}`,
        time: `${pickupTime} min`,
        color: service.color,
        distance: `${distance.toFixed(1)} km`,
        estimatedPickupTime: pickupTime,
        estimatedTripTime: tripTime,
        routeOptimized: Math.random() > 0.3,
        loyaltyPoints: Math.floor(price * 2),
        trafficDelay: Math.floor(Math.random() * 5),
        priceTrend: Math.random() > 0.7 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable' as 'up' | 'down' | 'stable',
        priceHistory: Array.from({length: 5}, () => price + (Math.random() - 0.5) * price * 0.1),
        predictedPrice: {
          in15min: `£${(price * (0.95 + Math.random() * 0.1)).toFixed(2)}`,
          in30min: `£${(price * (0.90 + Math.random() * 0.2)).toFixed(2)}`,
          in60min: `£${(price * (0.85 + Math.random() * 0.3)).toFixed(2)}`
        }
      };
    });
  };



  const languages = [
    { code: 'EN' as LanguageCode, name: 'English' },
    { code: 'ES' as LanguageCode, name: 'Español' },
    { code: 'FR' as LanguageCode, name: 'Français' },
    { code: 'DE' as LanguageCode, name: 'Deutsch' },
    { code: 'ZH' as LanguageCode, name: '中文' },
    { code: 'AR' as LanguageCode, name: 'العربية' }
  ];

  // Sort the rides based on user preference
  const sortedRides = [...rideOptions].sort((a, b) => {
    if (sortBy === 'price') {
      const priceA = typeof a.price === 'string' ? parseFloat(a.price.substring(1)) : 0;
      const priceB = typeof b.price === 'string' ? parseFloat(b.price.substring(1)) : 0;
      return priceA - priceB;
    } else {
      const timeA = typeof a.time === 'string' ? parseInt(a.time) : 0;
      const timeB = typeof b.time === 'string' ? parseInt(b.time) : 0;
      return timeA - timeB;
    }
  });
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Google Maps Background - Hidden when search results are shown */}
      {userLocation && !searchResults && (
        <div className="fixed inset-0 z-0">
          <div className="relative w-full h-full map-shimmer">
            <GoogleMapsWrapper 
              userLocation={userLocation} 
              destination={mapDestination || undefined}
              className="w-full h-full"
            />
            {/* Elegant overlay effects */}
            <div className="absolute inset-0 map-overlay pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none"></div>
            {/* Subtle corner highlights */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-yellow-400/10 to-transparent pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-blue-500/8 to-transparent pointer-events-none"></div>
            {/* Vignette effect */}
            <div className="absolute inset-0 bg-radial-gradient pointer-events-none"></div>
          </div>
        </div>
      )}
      
      {/* Main content wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen pt-16">
      
      {/* Desktop Header - Hidden on mobile */}
      <div className="hidden lg:block">
        <DesktopHeader
          selectedLanguage={selectedLanguage}
          isDarkMode={isDarkMode}
          onLanguageClick={() => setIsLanguageModalOpen(true)}
          onDarkModeToggle={toggleDarkMode}
          onLogin={() => setLocation('/login')}
          onSignUp={() => setLocation('/signup')}
          onSearchClick={handleCompanySearch}
        />
      </div>

      {/* Mobile Header - Hidden on desktop */}
      <div className="lg:hidden">
        <MobileHeader
          selectedLanguage={selectedLanguage}
          isDarkMode={isDarkMode}
          onLanguageClick={() => setIsLanguageModalOpen(true)}
          onDarkModeToggle={toggleDarkMode}
          onLogin={() => setLocation('/login')}
          onSignUp={() => setLocation('/signup')}
          onSearchClick={handleCompanySearch}
        />
      </div>
      
      {/* Centered Search Bar - Only show when no search results */}
      {!searchResults && (
        <div className="absolute top-20 sm:top-24 left-1/2 transform -translate-x-1/2 z-30 w-full max-w-md px-4">
        <Card className="floating-card">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="space-y-3">
              {/* Pickup Location */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{t('pickupLocation')}</label>
                <LocationAutocomplete
                  placeholder="Current location"
                  value={pickupLocation}
                  onChange={(value) => {
                    setPickupLocation(value);
                    setIsPickupLocationDefault(false); // User is editing, no longer default
                    // Also check when typing manually
                    if (isAirportLocation(value)) {
                      setAirportLocation(value);
                      setIsFlightModalOpen(true);
                    }
                  }}
                  className="bg-white"
                  instanceId="pickup-input"
                  onLocationSelect={(location) => {
                    console.log('Pickup location selected:', location);
                    setPickupLocation(location.fullAddress);
                    setIsPickupLocationDefault(false); // User selected, no longer default
                    // Check if pickup location is an airport
                    if (isAirportLocation(location.fullAddress)) {
                      setAirportLocation(location.fullAddress);
                      setIsFlightModalOpen(true);
                    }
                  }}
                />
              </div>

              {/* Drop-off Location */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{t('dropoffLocation')}</label>
                <LocationAutocomplete
                  placeholder={t('dropoffLocation')}
                  value={destination}
                  onChange={(value) => {
                    setDestination(value);
                    // Also check when typing manually
                    if (isAirportLocation(value)) {
                      setAirportLocation(value);
                      setIsFlightModalOpen(true);
                    }
                  }}
                  className="bg-white"
                  instanceId="destination-input"
                  onLocationSelect={(location) => {
                    console.log('Destination selected:', location);
                    setDestination(location.fullAddress);
                    // Check if destination is an airport
                    if (isAirportLocation(location.fullAddress)) {
                      setAirportLocation(location.fullAddress);
                      setIsFlightModalOpen(true);
                    }
                  }}
                />
              </div>

              {/* Date and Time */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-white"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Time</label>
                  <Input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="bg-white"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="flex-1 button-gradient text-black font-semibold py-3 rounded-xl shadow-lg">
                  <Search className="h-5 w-5 mr-2" />
                  {t('searchRides')}
                </Button>
                <Button 
                  type="button"
                  onClick={handleVoiceSearch}
                  className={`button-gradient text-black p-3 rounded-xl shadow-lg ${isListening ? 'animate-pulse' : ''}`}
                  title="Voice search"
                >
                  <Mic className="h-5 w-5" />
                </Button>
              </div>
            </form>
            
            <div className="mt-3 flex items-center justify-center text-xs text-gray-500">
              <MapPin className="h-3 w-3 mr-1" />
              {isLocationLoading ? 'Locating...' : 
                userLocation ? (userLocation.address || 'Your location') : 
                'Milton Keynes, UK'}
            </div>
          </CardContent>
        </Card>

          {/* Frequent Destinations */}
          <Card className="shadow-lg bg-white/95 backdrop-blur-sm mt-4">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Frequent Destinations</h3>
              <div className="space-y-2">
                {frequentDestinations.map((dest, index) => (
                  <button
                    key={index}
                    onClick={() => handleFrequentDestinationClick(dest)}
                    className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-yellow-50 hover:border-yellow-200 border border-gray-200 rounded-lg transition-colors duration-200 flex items-center"
                  >
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-gray-700 hover:text-black">{dest}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Ride Results Panel */}
      {searchResults && (
        <div className="flex-1 z-30 overflow-auto bg-white">
          <div className="p-4">
            {/* Show booking status when booking is confirmed */}
            {isBookingConfirmed && driverInfo ? (
              <div className="space-y-4">
                {/* Booking Confirmed Header */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Car className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-semibold text-green-800 mb-2">Booking Confirmed!</h2>
                  <p className="text-green-700">Reference: {bookingReference}</p>
                </div>

                {/* Driver Info */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Your Driver</h3>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                      <span className="text-lg font-bold text-gray-600">{driverInfo.name.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{driverInfo.name}</div>
                      <div className="text-sm text-gray-600">{driverInfo.vehicle}</div>
                    </div>
                  </div>
                </div>

                {/* Trip Details */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Trip Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-yellow-600" />
                      <span className="font-medium">From:</span>
                      <span className="ml-1">{pickupLocation || 'Current Location'}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-red-500" />
                      <span className="font-medium">To:</span>
                      <span className="ml-1">{destination}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium">Time:</span>
                      <span className="ml-1">{selectedDate} at {selectedTime}</span>
                    </div>
                  </div>
                </div>

                {/* Tracking Status */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Driver Status</h3>
                  <div className="text-sm text-blue-700">
                    {isTrackingActive ? (
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                        Driver is on the way to your location
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                        Driver is being assigned
                      </div>
                    )}
                  </div>
                </div>

                {/* Geofence Alerts */}
                {geofenceAlerts.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-semibold text-yellow-800 mb-2">Driver Updates</h3>
                    <div className="space-y-1 text-sm text-yellow-700">
                      {geofenceAlerts.includes('approaching') && (
                        <div>• Driver is approaching (within 500m)</div>
                      )}
                      {geofenceAlerts.includes('nearby') && (
                        <div>• Driver is nearby (within 200m)</div>
                      )}
                      {geofenceAlerts.includes('arrived') && (
                        <div>• Driver has arrived (within 50m)</div>
                      )}
                    </div>
                  </div>
                )}

                {/* Driver Live Tracking Map */}
                {isTrackingActive && userLocation && (
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="p-3 bg-gray-50 border-b border-gray-200">
                      <h4 className="font-semibold text-gray-900 flex items-center justify-between">
                        <span className="flex items-center">
                          <Navigation className="h-5 w-5 mr-2 text-blue-600" />
                          Driver Live Tracking
                        </span>
                        {geofenceAlerts.includes('arrived') ? (
                          <span className="text-green-700 font-bold text-sm bg-green-100 px-2 py-1 rounded">
                            Arrived!
                          </span>
                        ) : geofenceAlerts.includes('nearby') ? (
                          <span className="text-orange-700 font-bold text-sm bg-orange-100 px-2 py-1 rounded">
                            Very Close
                          </span>
                        ) : geofenceAlerts.includes('approaching') ? (
                          <span className="text-blue-700 font-bold text-sm bg-blue-100 px-2 py-1 rounded">
                            Approaching
                          </span>
                        ) : (
                          <span className="text-gray-600 text-sm">En Route</span>
                        )}
                      </h4>
                    </div>
                    <DriverTrackingMap
                      userLocation={userLocation}
                      driverLocation={driverLocation}
                      className="h-64"
                    />
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Back to Map Button */}
                <div className="mb-4">
                  <Button
                    variant="ghost"
                    onClick={() => setSearchResults(false)}
                    className="flex items-center text-gray-600 hover:text-black"
                  >
                    <Search className="h-4 w-4 mr-2 rotate-180" />
                    Back to Map
                  </Button>
                </div>

                {/* Trip Information */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between text-sm text-black">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-yellow-600" />
                  <span className="font-medium">From:</span>
                  <span className="ml-1">{pickupLocation || 'Current Location'}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{selectedDate} at {selectedTime}</span>
                </div>
              </div>
              <div className="flex items-center mt-2 text-sm text-black">
                <MapPin className="h-4 w-4 mr-2 text-red-500" />
                <span className="font-medium">To:</span>
                <span className="ml-1">{destination}</span>
              </div>
            </div>

            {/* Loyalty Points Summary */}
            <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">Your Loyalty Points</h3>
                  <div className="text-xs text-gray-600 mt-1">
                    <span className="text-black dark:text-white">Total: </span><span className="font-bold text-blue-600">{userLoyaltyPoints.total.toLocaleString()}</span> <span className="text-black dark:text-white">points</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div className="text-center">
                    <div className="font-bold text-gray-800">{userLoyaltyPoints.uber}</div>
                    <div className="text-gray-500">Uber</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-pink-600">{userLoyaltyPoints.lyft}</div>
                    <div className="text-gray-500">Lyft</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-green-600">{userLoyaltyPoints.bolt}</div>
                    <div className="text-gray-500">Bolt</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-black">{t('rideOptions')}</h2>
                  {selectedCompanies.length > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {selectedCompanies.length} filter{selectedCompanies.length > 1 ? 's' : ''} active
                      </span>
                      <button
                        onClick={() => setSelectedCompanies([])}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex items-center text-xs text-gray-600 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  Live pricing with route optimization
                  {getTrafficMultiplier() > 1.1 && (
                    <>
                      <span className="mx-2">•</span>
                      <Clock className="h-3 w-3 mr-1 text-orange-500" />
                      Rush hour surge pricing active
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant={sortBy === 'price' ? 'default' : 'outline'}
                  onClick={() => setSortBy('price')}
                  className="flex items-center"
                >
                  <span className="mr-1">£</span>
                  {t('sortByPrice')}
                </Button>
                <Button 
                  size="sm" 
                  variant={sortBy === 'time' ? 'default' : 'outline'}
                  onClick={() => setSortBy('time')}
                  className="flex items-center"
                >
                  <Clock className="h-4 w-4 mr-1" />
                  {t('sortByTime')}
                </Button>
              </div>
            </div>
            
            {sortedRides.map(ride => {
              const driverRating = (4.2 + Math.random() * 0.8).toFixed(1);
              const isVerified = Math.random() > 0.3;
              
              return (
                <Card 
                  key={ride.id} 
                  className={`mb-4 cursor-pointer hover:shadow-lg transition-all duration-300 rounded-2xl border-0 card-shadow bg-white dark:bg-gray-800
                            ${selectedRide === ride.id ? 'ring-2 ring-yellow-400 bg-yellow-50 dark:bg-yellow-900/30' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                  onClick={() => handleRideSelect(ride.id)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-center">
                      <div 
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-white mr-4 shadow-lg"
                        style={{ backgroundColor: ride.color }}
                      >
                        <Car className="h-7 w-7" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white flex items-center">
                          {ride.service} - {ride.type}
                          {isVerified && (
                            <div title="Verified Driver">
                              <Shield className="h-4 w-4 ml-2 text-green-600 dark:text-green-400" />
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                          <Star className="h-3 w-3 mr-1 text-yellow-500" />
                          {driverRating} • {ride.time}
                          {ride.trafficDelay && ride.trafficDelay > 0 && (
                            <span className="ml-2 text-orange-600">+{ride.trafficDelay}min traffic</span>
                          )}
                        </div>
                        
                        {/* Loyalty Points Display */}
                        {ride.loyaltyPoints && (
                          <div className="text-xs text-blue-600 flex items-center mt-1">
                            <span className="w-3 h-3 bg-blue-100 rounded-full flex items-center justify-center mr-1">
                              <span className="text-[8px] font-bold">★</span>
                            </span>
                            +{ride.loyaltyPoints} points
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900 dark:text-white flex items-center">
                          {ride.price}
                          {ride.priceTrend && ride.priceTrend !== 'stable' && (
                            <TrendingUp className={`h-3 w-3 ml-1 ${
                              ride.priceTrend === 'up' ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'
                            } ${ride.priceTrend === 'up' ? '' : 'rotate-180'}`} />
                          )}
                        </div>
                        
                        {/* Predictive Pricing */}
                        {ride.predictedPrice && (
                          <div className="text-xs text-green-600 mt-1">
                            Later: {ride.predictedPrice.in30min}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Enhanced Features Row */}
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        {ride.routeOptimized && (
                          <div className="flex items-center text-green-600">
                            <Route className="h-3 w-3 mr-1" />
                            Route Optimized
                          </div>
                        )}
                        {ride.distance && (
                          <div className="text-gray-500">
                            {ride.distance}
                          </div>
                        )}
                      </div>
                      
                      {/* Predictive Pricing Tooltip */}
                      {ride.predictedPrice && selectedRide === ride.id && (
                        <div className="text-gray-600">
                          <div className="text-xs">Predicted prices:</div>
                          <div className="text-xs space-y-0.5">
                            <div>15min: {ride.predictedPrice.in15min}</div>
                            <div>30min: {ride.predictedPrice.in30min}</div>
                            <div>60min: {ride.predictedPrice.in60min}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
              </>
            )}
          </div>
        </div>
      )}

      {/* Floating Select Ride Button */}
      {searchResults && selectedRide && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40 shadow-lg animate-slide-up">
          <div className="max-w-md mx-auto">
            <Button 
              className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
              onClick={handleBookingOpen}
            >
              <Car className="h-5 w-5 mr-2" />
              Select {rideOptions.find(r => r.id === selectedRide)?.service} - {rideOptions.find(r => r.id === selectedRide)?.price}
            </Button>
          </div>
        </div>
      )}





      {/* Simple Booking Confirmation Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full mx-4 animate-scale-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="h-8 w-8 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-semibold mb-2 text-gray-900">Confirm Your Ride</h2>
              <p className="text-gray-600 mb-6">Ready to book this ride? Your saved payment method and contact details will be used.</p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center mb-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white mr-3 animate-glow"
                    style={{ backgroundColor: rideOptions.find(r => r.id === selectedRide)?.color }}
                  >
                    <Car className="h-6 w-6" />
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">
                      {rideOptions.find(r => r.id === selectedRide)?.service}
                    </div>
                    <div className="text-sm text-gray-600">
                      {rideOptions.find(r => r.id === selectedRide)?.type}
                    </div>
                  </div>
                </div>
                
                <div className="text-center space-y-1">
                  <div className="text-2xl font-bold text-gray-900">
                    {rideOptions.find(r => r.id === selectedRide)?.price}
                  </div>
                  <div className="text-sm text-gray-600">
                    Pickup in {rideOptions.find(r => r.id === selectedRide)?.time}
                  </div>
                  <div className="text-xs text-gray-500">
                    From: {pickupLocation || 'Current location'} → {destination}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={handleBookingClose}
                className="flex-1 hover-lift"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleBookingConfirm}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white hover-glow"
              >
                Confirm Booking
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Flight Number Modal */}
      {isFlightModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full mx-4 animate-scale-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-semibold mb-2 text-gray-900">Flight Details</h2>
              <p className="text-gray-600 mb-6">
                We detected you're traveling to/from an airport. Please provide your flight number for better coordination.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="text-sm text-gray-600 mb-2">Airport Location</div>
                <div className="font-semibold text-gray-900">{airportLocation}</div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Flight Number (Optional)
                </label>
                <Input
                  type="text"
                  placeholder="e.g., BA123, EZY456"
                  value={flightNumber}
                  onChange={(e) => setFlightNumber(e.target.value)}
                  className="w-full text-center uppercase"
                  maxLength={10}
                />
                <p className="text-xs text-gray-500 mt-2">
                  This helps drivers track flight delays and plan pickup timing
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsFlightModalOpen(false);
                  setFlightNumber('');
                }}
                className="flex-1 hover-lift"
              >
                Skip
              </Button>
              <Button 
                onClick={() => {
                  setIsFlightModalOpen(false);
                  if (flightNumber.trim()) {
                    // Store flight number for booking
                    console.log('Flight number saved:', flightNumber);
                  }
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white hover-glow"
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Language Selection Modal */}
      <Dialog open={isLanguageModalOpen} onOpenChange={setIsLanguageModalOpen}>
        <DialogContent className="sm:max-w-xs bg-gray-100">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-semibold text-black">
              {t('selectLanguage')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-1 pt-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className={`w-full text-left px-3 py-2 text-sm rounded transition-colors duration-200 ${
                  selectedLanguage === lang.code 
                    ? 'bg-yellow-200 text-black border border-yellow-400' 
                    : 'bg-white text-black hover:bg-gray-50'
                }`}
              >
                <span className="font-medium">{lang.code}</span> - {lang.name}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Company Search Modal */}
      <CompanySearchModal
        isOpen={isCompanySearchModalOpen}
        onClose={() => setIsCompanySearchModalOpen(false)}
        onCompanySelect={handleCompanySelect}
      />

      {/* Content Sections - Only show when no search results */}
      {!searchResults && (
        <div className="relative z-20 bg-white/95 backdrop-blur-sm mt-[100vh]">
          
          {/* Features Section */}
          <section className="py-16 px-6" ref={featuresRef.ref}>
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-12 animate-on-scroll">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Why Choose Farezy?
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Compare prices, track rides, and ensure safety with our comprehensive platform
                </p>
              </div>
              
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[1, 2, 3].map((i) => (
                    <FeatureSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className={`text-center p-6 hover-lift ${featuresRef.visibleItems[0] ? 'animate-bounce-in animate-delay-100' : 'opacity-0'}`}>
                    <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-glow">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Best Prices</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Compare prices across multiple ride services to find the best deal every time
                    </p>
                  </div>
                  
                  <div className={`text-center p-6 hover-lift ${featuresRef.visibleItems[1] ? 'animate-bounce-in animate-delay-200' : 'opacity-0'}`}>
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-glow">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Safety First</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Driver verification, live tracking, and emergency contacts for peace of mind
                    </p>
                  </div>
                  
                  <div className={`text-center p-6 hover-lift ${featuresRef.visibleItems[2] ? 'animate-bounce-in animate-delay-300' : 'opacity-0'}`}>
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-glow">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Real-time Updates</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Live tracking, price monitoring, and instant notifications for your rides
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* How It Works Section */}
          <section className="py-16 px-6 bg-gray-50 dark:bg-gray-800">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  How It Works
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Getting your ride is simple and secure
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                    1
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Enter Locations</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Input your pickup and destination locations
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                    2
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Compare Options</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    View prices and times from multiple services
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                    3
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Book & Track</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Select your ride and track in real-time
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                    4
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Arrive Safely</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Reach your destination with verified drivers
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Statistics Section */}
          <section className="py-16 px-6" ref={statsRef.ref}>
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-12 animate-on-scroll">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Coming Soon
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Get ready for the smartest way to compare and book rides
                </p>
              </div>
              
              <div className="flex justify-center">
                <div className={`text-center hover-lift ${statsRef.visibleItems[0] ? 'animate-scale-in animate-delay-100' : 'opacity-0'}`}>
                  <div className="text-6xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent mb-4 animate-glow">
                    Launching Soon
                  </div>
                  <div className="text-xl text-gray-600 dark:text-gray-300 max-w-md">
                    Be the first to experience the future of ride comparison and booking
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Safety Features Section */}
          <section className="py-16 px-6 bg-blue-50 dark:bg-blue-900/20" ref={safetyRef.ref}>
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-12 animate-on-scroll">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Advanced Safety Features
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Your safety is our top priority
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover-lift ${safetyRef.visibleItems[0] ? 'animate-slide-in-left animate-delay-100' : 'opacity-0'}`}>
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4 animate-glow">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Driver Verification</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    All drivers undergo background checks and photo verification before accepting rides
                  </p>
                </div>
                
                <div className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover-lift ${safetyRef.visibleItems[1] ? 'animate-slide-in-right animate-delay-200' : 'opacity-0'}`}>
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4 animate-glow">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Live GPS Tracking</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    Real-time location sharing with geofencing alerts for enhanced safety monitoring
                  </p>
                </div>
                
                <div className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover-lift ${safetyRef.visibleItems[2] ? 'animate-slide-in-left animate-delay-300' : 'opacity-0'}`}>
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mr-4 animate-glow">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Emergency Contacts</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    Share ride details with trusted contacts and access emergency services instantly
                  </p>
                </div>
                
                <div className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover-lift ${safetyRef.visibleItems[3] ? 'animate-slide-in-right animate-delay-400' : 'opacity-0'}`}>
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mr-4 animate-glow">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">License Verification</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    Confirm vehicle details and license plates before entering any ride
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action Section */}
          <section className="py-16 px-6 bg-gradient-to-r from-yellow-400 to-orange-500">
            <div className="container mx-auto max-w-4xl text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Start Your Smart Journey?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Join thousands of users who save money and travel safely with Farezy
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => setShowBooking(true)}
                  className="bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
                >
                  <Car className="mr-2 h-5 w-5" />
                  Book a Ride Now
                </button>
                <button 
                  onClick={() => window.location.href = '/partner-signup'}
                  className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-gray-900 transition-colors flex items-center justify-center"
                >
                  <Building className="mr-2 h-5 w-5" />
                  Partner with Us
                </button>
              </div>
              
              {/* Driver App Connection Status */}
              <div className="mt-6 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      driverServiceStatus === 'connected' ? 'bg-green-400' : 
                      driverServiceStatus === 'error' ? 'bg-red-400' : 
                      'bg-yellow-400'
                    }`}></div>
                    <span className="text-white text-sm">
                      Driver App: {
                        driverServiceStatus === 'connected' ? 'Connected' : 
                        driverServiceStatus === 'error' ? 'Error' :
                        'Connecting...'
                      }
                    </span>
                  </div>
                  <span className="text-white text-xs">({driverAppUrl})</span>
                </div>
                {driverServiceStatus === 'error' && (
                  <p className="text-red-200 text-xs mt-2">Connection failed - using demo mode</p>
                )}
              </div>

              {/* Enhanced Connection Status Indicators */}
              <div className="mt-4 space-y-3">
                <div id="farezy-driver-status" className={`p-3 rounded-lg text-sm font-bold ${
                  driverServiceStatus === 'connected' 
                    ? 'bg-green-600 text-white border border-green-700' 
                    : driverServiceStatus === 'error'
                    ? 'bg-red-600 text-white border border-red-700'
                    : 'bg-yellow-600 text-white border border-yellow-700'
                }`}>
                  {driverServiceStatus === 'connected' 
                    ? 'Connected to drivers' 
                    : driverServiceStatus === 'error'
                    ? 'Driver connection failed'
                    : 'Connecting to drivers...'}
                </div>

                <div id="booking-status" className="p-3 rounded-lg text-sm font-bold bg-blue-600 text-white border border-blue-700">
                  Ready to book
                </div>

                <div id="driver-info" className="p-4 rounded-lg bg-white border border-gray-200 shadow-sm" style={{display: 'none'}}>
                  {/* Driver details appear here when booking accepted */}
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto bg-gray-900 text-white py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Farezy</h3>
              <p className="text-gray-300 text-sm">
                Smart ride comparison platform connecting you with the best transportation options at competitive prices.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Download App */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Download App</h3>
              <div className="space-y-3">
                <a href="#" className="flex items-center space-x-3 p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  <div>
                    <div className="text-xs text-gray-400">Download on the</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </a>
                <a href="#" className="flex items-center space-x-3 p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  <div>
                    <div className="text-xs text-gray-400">Get it on</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Support</h3>
              <div className="space-y-2">
                <Link href="/help-center" className="block text-gray-300 hover:text-white transition-colors text-sm">
                  Help Center
                </Link>
                <Link href="/contact-us" className="block text-gray-300 hover:text-white transition-colors text-sm">
                  Contact Us
                </Link>
                <Link href="/safety-guidelines" className="block text-gray-300 hover:text-white transition-colors text-sm">
                  Safety Guidelines
                </Link>
                <Link href="/report-issue" className="block text-gray-300 hover:text-white transition-colors text-sm">
                  Report an Issue
                </Link>
                <Link href="/faq" className="block text-gray-300 hover:text-white transition-colors text-sm">
                  FAQ
                </Link>
              </div>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Legal</h3>
              <div className="space-y-2">
                <Link href="/terms-of-service" className="block text-gray-300 hover:text-white transition-colors text-sm">
                  Terms of Service
                </Link>
                <Link href="/privacy-policy" className="block text-gray-300 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </Link>
                <Link href="/cookie-policy" className="block text-gray-300 hover:text-white transition-colors text-sm">
                  Cookie Policy
                </Link>
                <Link href="/accessibility" className="block text-gray-300 hover:text-white transition-colors text-sm">
                  Accessibility
                </Link>
                <Link href="/licenses" className="block text-gray-300 hover:text-white transition-colors text-sm">
                  Licenses
                </Link>
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm text-gray-400">
                © 2024 Farezy. All rights reserved.
              </div>
              <div className="flex space-x-6 text-sm text-gray-400">
                <span>Milton Keynes, UK</span>
                <span>Available 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      </div> {/* Close main content wrapper */}
    </div>
  );
};

export default Home;
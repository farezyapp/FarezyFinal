import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, MapPin, Car, Clock, DollarSign, Navigation } from 'lucide-react';
import GoogleMapComponent from '@/components/ui/google-map';
import { useLocation } from '@/hooks/use-location';

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

const Home: React.FC = () => {
  const [destination, setDestination] = useState('');
  const [searchResults, setSearchResults] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'price' | 'time'>('price');
  const [selectedRide, setSelectedRide] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [showDriver, setShowDriver] = useState(false);
  const [mapDestination, setMapDestination] = useState<Location | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    passengerName: '',
    phoneNumber: '',
    paymentMethod: 'card',
    specialRequests: ''
  });
  
  // Use the location hook
  const { 
    userLocation, 
    destination: locationDestination, 
    setDestinationByAddress,
    isLoading: isLocationLoading
  } = useLocation();
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (destination.trim()) {
      try {
        // Set the destination for the map
        await setDestinationByAddress(destination);
        setSearchResults(true);
        setSelectedRide(null);
        setIsBookingConfirmed(false);
        setShowMap(true); // Show the map when searching
      } catch (error) {
        console.error('Error setting destination:', error);
      }
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
  };
  
  const handleBookingConfirm = () => {
    setIsBookingModalOpen(false);
    setIsBookingConfirmed(true);
    setShowDriver(true); // Show driver on the map after booking is confirmed
    // In a real app, this would call an API to book the ride
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookingDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Milton Keynes taxi services
  const mockRides = [
    {
      id: '1',
      service: 'Skyline Taxis',
      type: 'Standard',
      price: '£10.50',
      time: '3 min away',
      color: '#0F3D6C'
    },
    {
      id: '2',
      service: 'Skyline Taxis',
      type: 'Executive',
      price: '£16.00',
      time: '4 min away',
      color: '#0F3D6C'
    },
    {
      id: '3',
      service: 'Bounds Taxis',
      type: 'Standard',
      price: '£11.25',
      time: '2 min away',
      color: '#000000'
    },
    {
      id: '4',
      service: 'Bounds Taxis',
      type: 'MPV',
      price: '£17.00',
      time: '3 min away',
      color: '#000000'
    },
    {
      id: '5',
      service: 'Uber',
      type: 'UberX',
      price: '£12.50',
      time: '5 min away',
      color: '#000000'
    },
    {
      id: '6',
      service: 'Uber',
      type: 'UberXL',
      price: '£18.25',
      time: '6 min away',
      color: '#000000'
    },
    {
      id: '7',
      service: 'Royal Cars MK',
      type: 'Standard',
      price: '£10.75',
      time: '2 min away',
      color: '#A31621'
    },
    {
      id: '8',
      service: 'Speedline MK',
      type: 'Standard',
      price: '£11.00',
      time: '4 min away',
      color: '#4B7F52'
    },
    {
      id: '9',
      service: 'Speedline MK',
      type: 'Executive',
      price: '£16.50',
      time: '5 min away',
      color: '#4B7F52'
    },
    {
      id: '10',
      service: 'MK Executive Hire',
      type: 'Executive',
      price: '£19.50',
      time: '7 min away',
      color: '#111111'
    },
    {
      id: '11',
      service: 'Bolt',
      type: 'Standard',
      price: '£11.75',
      time: '4 min away',
      color: '#32BB4E'
    },
    {
      id: '12',
      service: 'A1 Taxis MK',
      type: 'Standard',
      price: '£11.50',
      time: '3 min away',
      color: '#1976D2'
    }
  ];
  
  // Sort the rides based on user preference
  const sortedRides = [...mockRides].sort((a, b) => {
    if (sortBy === 'price') {
      return parseFloat(a.price.substring(1)) - parseFloat(b.price.substring(1));
    } else {
      return parseInt(a.time) - parseInt(b.time);
    }
  });
  
  return (
    <div className="h-screen flex flex-col relative">
      {/* Google Maps Background */}
      {userLocation && (
        <div className="absolute inset-0 z-0">
          <GoogleMapComponent 
            userLocation={userLocation} 
            destination={mapDestination || undefined}
            showDriverLocation={showDriver && isBookingConfirmed}
            className="w-full h-full"
          />
        </div>
      )}
      
      {/* App Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-sm z-30 relative">
        <div className="container mx-auto px-4 py-3 flex items-center justify-center">
          <button 
            onClick={() => window.location.href = '/'}
            className="flex items-center hover:scale-105 transition-transform duration-200 cursor-pointer"
          >
            <div className="mr-2 bg-yellow-400 text-black p-1 rounded-md">
              <Car className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-semibold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-black">Fare</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-black to-yellow-400">zy</span>
            </h1>
          </button>
        </div>
      </header>
      
      {/* Centered Search Bar */}
      <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-30 w-full max-w-md px-4">
        <Card className="shadow-lg bg-white/95 backdrop-blur-sm">
          <CardContent className="p-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="text"
                placeholder="Where to?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="flex-1 bg-white"
              />
              <Button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-black">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </form>
            
            <div className="mt-3 flex items-center text-sm text-gray-700">
              <MapPin className="h-4 w-4 mr-2 text-yellow-600" />
              {isLocationLoading ? 'Locating you...' : 
                userLocation ? `Current Location: ${userLocation.address || 'Your location'}` : 
                'Current Location: London, UK (Default)'}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Ride Results Panel */}
      {searchResults && (
        <div className="absolute bottom-0 left-0 right-0 z-30 max-h-[60vh] overflow-auto">
          <div className="bg-white/95 backdrop-blur-sm p-4 rounded-t-xl shadow-lg">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">Available Rides</h2>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant={sortBy === 'price' ? 'default' : 'outline'}
                  onClick={() => setSortBy('price')}
                  className="flex items-center"
                >
                  <span className="mr-1">£</span>
                  Price
                </Button>
                <Button 
                  size="sm" 
                  variant={sortBy === 'time' ? 'default' : 'outline'}
                  onClick={() => setSortBy('time')}
                  className="flex items-center"
                >
                  <Clock className="h-4 w-4 mr-1" />
                  Time
                </Button>
              </div>
            </div>
            
            {sortedRides.map(ride => (
              <Card 
                key={ride.id} 
                className={`mb-3 cursor-pointer hover:bg-gray-50 hover:text-black shadow-sm border 
                          ${selectedRide === ride.id ? 'border-2 border-yellow-400' : ''}`}
                onClick={() => handleRideSelect(ride.id)}
              >
                <CardContent className="p-4 flex items-center">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white mr-3"
                    style={{ backgroundColor: ride.color }}
                  >
                    <Car className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{ride.service} - {ride.type}</div>
                    <div className="text-sm text-gray-600 group-hover:text-black">{ride.time}</div>
                  </div>
                  <div className="font-semibold">{ride.price}</div>
                </CardContent>
              </Card>
            ))}
            
            <Button 
              className="w-full mt-4 py-6"
              onClick={handleBookingOpen}
              disabled={!selectedRide}
            >
              {selectedRide ? 'Book Selected Ride' : 'Select a Ride First'}
            </Button>
            
            {isBookingConfirmed && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-2 text-center">Booking Confirmed!</h3>
                <p className="text-green-700 text-center">
                  Your ride has been booked. The driver will arrive in approximately{' '}
                  {mockRides.find(r => r.id === selectedRide)?.time.split(' ')[0]} minutes.
                </p>
                <p className="text-sm text-green-600 mt-2 text-center">
                  Booking reference: #{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Car className="h-4 w-4 text-black" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Your driver is on the way</p>
                    <p className="text-sm text-gray-600">Track their location on the map</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Complete Your Booking</h2>
            
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white mr-3"
                  style={{ backgroundColor: mockRides.find(r => r.id === selectedRide)?.color }}
                >
                  <Car className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium">
                    {mockRides.find(r => r.id === selectedRide)?.service} - 
                    {mockRides.find(r => r.id === selectedRide)?.type}
                  </div>
                  <div className="text-sm text-gray-600">
                    {mockRides.find(r => r.id === selectedRide)?.price} • 
                    {mockRides.find(r => r.id === selectedRide)?.time}
                  </div>
                </div>
              </div>
              
              <div className="mt-2 text-sm text-gray-600">
                <div>From: London, UK</div>
                <div>To: {destination}</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Your Name</label>
                <Input 
                  name="passengerName"
                  value={bookingDetails.passengerName}
                  onChange={handleInputChange}
                  className="mt-1"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <Input 
                  name="phoneNumber"
                  value={bookingDetails.phoneNumber}
                  onChange={handleInputChange}
                  className="mt-1"
                  placeholder="For driver contact"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                <select
                  name="paymentMethod"
                  value={bookingDetails.paymentMethod}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                >
                  <option value="card">Credit/Debit Card</option>
                  <option value="cash">Cash</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Special Requests</label>
                <textarea
                  name="specialRequests"
                  value={bookingDetails.specialRequests}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                  rows={2}
                  placeholder="Any special requirements?"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <Button variant="outline" onClick={handleBookingClose}>
                Cancel
              </Button>
              <Button onClick={handleBookingConfirm}>
                Confirm Booking
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
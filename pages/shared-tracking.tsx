import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Car, User, Phone, Shield, Eye } from 'lucide-react';
import GoogleMapComponent from '@/components/ui/google-map';

interface SharedRideData {
  passengerName: string;
  rideStatus: 'searching' | 'driver_assigned' | 'en_route' | 'arrived' | 'in_progress' | 'completed';
  driverName: string;
  driverPhone: string;
  vehicleModel: string;
  vehicleColor: string;
  licensePlate: string;
  currentLat: number;
  currentLng: number;
  estimatedArrival: string;
  pickupAddress: string;
  dropoffAddress: string;
  serviceName: string;
  rideType: string;
  startTime: string;
  emergencyContactName: string;
}

const mockSharedRideData: SharedRideData = {
  passengerName: 'John Smith',
  rideStatus: 'in_progress',
  driverName: 'David Johnson',
  driverPhone: '+44 7700 900555',
  vehicleModel: 'Toyota Prius',
  vehicleColor: 'Blue',
  licensePlate: 'AB12 CDE',
  currentLat: 52.0467,
  currentLng: -0.7581,
  estimatedArrival: '8 minutes',
  pickupAddress: '123 High Street, Milton Keynes',
  dropoffAddress: '456 Shopping Centre, Milton Keynes',
  serviceName: 'Uber',
  rideType: 'UberX',
  startTime: '9:15 PM',
  emergencyContactName: 'Sarah Smith'
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'searching':
      return 'bg-yellow-100 text-yellow-800';
    case 'driver_assigned':
      return 'bg-blue-100 text-blue-800';
    case 'en_route':
      return 'bg-orange-100 text-orange-800';
    case 'arrived':
      return 'bg-green-100 text-green-800';
    case 'in_progress':
      return 'bg-purple-100 text-purple-800';
    case 'completed':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'searching':
      return 'Finding Driver';
    case 'driver_assigned':
      return 'Driver Assigned';
    case 'en_route':
      return 'Driver En Route';
    case 'arrived':
      return 'Driver Arrived';
    case 'in_progress':
      return 'Trip in Progress';
    case 'completed':
      return 'Trip Completed';
    default:
      return 'Unknown';
  }
};

export default function SharedTracking() {
  const [rideData, setRideData] = useState<SharedRideData>(mockSharedRideData);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRideData(prev => ({
        ...prev,
        currentLat: prev.currentLat + (Math.random() - 0.5) * 0.001,
        currentLng: prev.currentLng + (Math.random() - 0.5) * 0.001,
      }));
      setLastUpdated(new Date());
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const userLocation = { lat: 52.0406224, lng: -0.7594171 };
  const driverLocation = { lat: rideData.currentLat, lng: rideData.currentLng };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={() => window.location.href = '/'}
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity mr-6"
              >
                <Car className="h-8 w-8 text-orange-500" />
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                  Farezy
                </span>
              </button>
              <div className="flex items-center">
                <Shield className="h-6 w-6 mr-3 text-green-600" />
                <div>
                  <h1 className="text-2xl font-bold text-black">Journey Tracker</h1>
                  <p className="text-sm text-gray-600">
                    Viewing {rideData.passengerName}'s ride as {rideData.emergencyContactName}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <Badge className={getStatusColor(rideData.rideStatus)}>
                {getStatusText(rideData.rideStatus)}
              </Badge>
              <p className="text-xs text-gray-500 mt-1">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <Card className="bg-white h-96">
              <CardHeader>
                <CardTitle className="flex items-center text-black">
                  <Eye className="h-5 w-5 mr-2" />
                  Live Location Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-80">
                <GoogleMapComponent 
                  userLocation={userLocation}
                  destination={driverLocation}
                  showDriverLocation={true}
                  className="w-full h-full rounded-lg"
                />
              </CardContent>
            </Card>
          </div>

          {/* Ride Information Section */}
          <div className="space-y-6">
            {/* Passenger Information */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center text-black">
                  <User className="h-5 w-5 mr-2" />
                  Passenger Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Passenger</p>
                  <p className="font-semibold text-black">{rideData.passengerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ride Started</p>
                  <p className="font-semibold text-black">{rideData.startTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Service</p>
                  <p className="font-semibold text-black">{rideData.serviceName} - {rideData.rideType}</p>
                </div>
              </CardContent>
            </Card>

            {/* Driver Information */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center text-black">
                  <Car className="h-5 w-5 mr-2" />
                  Driver Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Driver Name</p>
                  <p className="font-semibold text-black">{rideData.driverName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Vehicle</p>
                  <p className="font-semibold text-black">{rideData.vehicleColor} {rideData.vehicleModel}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">License Plate</p>
                  <p className="font-semibold text-black">{rideData.licensePlate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contact</p>
                  <p className="font-semibold text-black">{rideData.driverPhone}</p>
                </div>
              </CardContent>
            </Card>

            {/* Route Information */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center text-black">
                  <MapPin className="h-5 w-5 mr-2" />
                  Route Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Pickup Location</p>
                  <p className="font-semibold text-black">{rideData.pickupAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Destination</p>
                  <p className="font-semibold text-black">{rideData.dropoffAddress}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex items-center text-green-700">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="font-semibold">ETA: {rideData.estimatedArrival}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Safety Notice */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start">
                  <Shield className="h-5 w-5 mr-2 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900">Safety Information</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      This tracking link was shared with you as an emergency contact. 
                      The location updates automatically every 10 seconds during the journey.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
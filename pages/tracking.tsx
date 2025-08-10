import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Car, Phone, Clock, MapPin, User, Shield, AlertTriangle, Share2, Copy, Check } from 'lucide-react';
import GoogleMapComponent from '@/components/ui/google-map';
import { useToast } from '@/hooks/use-toast';

interface RideTrackingData {
  id: number;
  bookingId: number;
  driverName: string;
  driverPhone: string;
  vehicleModel: string;
  vehicleColor: string;
  licensePlate: string;
  currentLat: number;
  currentLng: number;
  estimatedArrival: string;
  status: 'searching' | 'driver_assigned' | 'en_route' | 'arrived' | 'in_progress' | 'completed';
  pickupAddress: string;
  dropoffAddress: string;
  serviceName: string;
  rideType: string;
  totalCost: number;
}

const mockTrackingData: RideTrackingData = {
  id: 1,
  bookingId: 12345,
  driverName: 'David Johnson',
  driverPhone: '+44 7700 900555',
  vehicleModel: 'Toyota Prius',
  vehicleColor: 'Blue',
  licensePlate: 'AB12 CDE',
  currentLat: 52.0467,
  currentLng: -0.7581,
  estimatedArrival: '3 minutes',
  status: 'en_route',
  pickupAddress: '123 High Street, Milton Keynes',
  dropoffAddress: '456 Shopping Centre, Milton Keynes',
  serviceName: 'Uber',
  rideType: 'UberX',
  totalCost: 12.50
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

export default function Tracking() {
  const { toast } = useToast();
  const [trackingData, setTrackingData] = useState<RideTrackingData>(mockTrackingData);
  const [emergencyContacted, setEmergencyContacted] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  
  const shareLink = `${window.location.origin}/shared-tracking/${trackingData.bookingId}`;
  
  const emergencyContacts = [
    { name: 'Sarah Smith', phone: '+44 7700 900456', relationship: 'Spouse' },
    { name: 'Michael Smith', phone: '+44 7700 900789', relationship: 'Brother' }
  ];

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTrackingData(prev => ({
        ...prev,
        currentLat: prev.currentLat + (Math.random() - 0.5) * 0.001,
        currentLng: prev.currentLng + (Math.random() - 0.5) * 0.001,
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleCallDriver = () => {
    toast({
      title: "Calling Driver",
      description: `Calling ${trackingData.driverName} at ${trackingData.driverPhone}`,
    });
  };

  const handleEmergencyAlert = () => {
    setEmergencyContacted(true);
    toast({
      title: "Emergency Alert Sent",
      description: "Your emergency contacts have been notified of your location and ride details.",
      variant: "destructive",
    });
  };

  const handleShareJourney = () => {
    setShareModalOpen(true);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setLinkCopied(true);
      toast({
        title: "Link Copied",
        description: "Journey tracking link copied to clipboard",
      });
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Could not copy link to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleSendToContacts = () => {
    toast({
      title: "Journey Shared",
      description: `Journey tracking link sent to ${emergencyContacts.length} emergency contacts`,
    });
    setShareModalOpen(false);
  };

  const userLocation = { lat: 52.0406224, lng: -0.7594171 };
  const driverLocation = { lat: trackingData.currentLat, lng: trackingData.currentLng };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
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
            <h1 className="text-2xl font-bold text-black">Live Tracking</h1>
          </div>
          <Badge className={getStatusColor(trackingData.status)}>
            {getStatusText(trackingData.status)}
          </Badge>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <Card className="bg-white h-96">
              <CardContent className="p-0 h-full">
                <GoogleMapComponent 
                  userLocation={userLocation}
                  destination={driverLocation}
                  showDriverLocation={true}
                  className="w-full h-full rounded-lg"
                />
              </CardContent>
            </Card>
          </div>

          {/* Ride Details Section */}
          <div className="space-y-6">
            {/* Driver Information */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center text-black">
                  <User className="h-5 w-5 mr-2" />
                  Your Driver
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-black">{trackingData.driverName}</h3>
                    <p className="text-sm text-black">{trackingData.vehicleColor} {trackingData.vehicleModel}</p>
                    <p className="text-sm text-black">{trackingData.licensePlate}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCallDriver}
                    className="flex items-center"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center text-black">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="font-semibold">ETA: {trackingData.estimatedArrival}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trip Details */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center text-black">
                  <MapPin className="h-5 w-5 mr-2" />
                  Trip Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-black">Service</p>
                  <p className="font-semibold text-black">{trackingData.serviceName} - {trackingData.rideType}</p>
                </div>
                
                <div>
                  <p className="text-sm text-black">Pickup</p>
                  <p className="font-semibold text-black">{trackingData.pickupAddress}</p>
                </div>
                
                <div>
                  <p className="text-sm text-black">Destination</p>
                  <p className="font-semibold text-black">{trackingData.dropoffAddress}</p>
                </div>
                
                <div>
                  <p className="text-sm text-black">Total Cost</p>
                  <p className="font-semibold text-black text-lg">£{trackingData.totalCost.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Journey Sharing */}
            <Card className="bg-white border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-700">
                  <Share2 className="h-5 w-5 mr-2" />
                  Share Journey
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-black">
                  Let your emergency contacts track your journey in real-time for peace of mind.
                </p>
                
                <Button
                  onClick={handleShareJourney}
                  className="w-full"
                  variant="outline"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Journey Link
                </Button>
              </CardContent>
            </Card>

            {/* Emergency Alert */}
            <Card className="bg-white border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center text-red-700">
                  <Shield className="h-5 w-5 mr-2" />
                  Safety & Emergency
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-black">
                  In case of emergency, your location and ride details will be shared with your emergency contacts.
                </p>
                
                {emergencyContacted ? (
                  <div className="bg-red-50 p-3 rounded-lg">
                    <div className="flex items-center text-red-700">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      <span className="font-semibold">Emergency contacts notified</span>
                    </div>
                    <p className="text-sm text-red-600 mt-1">
                      Your emergency contacts have been alerted with your current location and ride information.
                    </p>
                  </div>
                ) : (
                  <Button
                    variant="destructive"
                    onClick={handleEmergencyAlert}
                    className="w-full"
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Send Emergency Alert
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Journey Sharing Modal */}
      <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-semibold text-black">
              Share Journey with Emergency Contacts
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-black text-center">
              Send a secure tracking link to your emergency contacts so they can follow your journey in real-time.
            </p>
            
            {/* Emergency Contacts List */}
            <div className="space-y-3">
              <h4 className="font-medium text-black">Your Emergency Contacts:</h4>
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-medium text-black">{contact.name}</p>
                    <p className="text-sm text-gray-600">{contact.relationship}</p>
                  </div>
                  <p className="text-sm text-black">{contact.phone}</p>
                </div>
              ))}
            </div>
            
            {/* Share Link */}
            <div className="space-y-3">
              <h4 className="font-medium text-black">Tracking Link:</h4>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 break-all">{shareLink}</p>
              </div>
              
              <div className="flex space-x-3">
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  className="flex-1"
                  disabled={linkCopied}
                >
                  {linkCopied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={handleSendToContacts}
                  className="flex-1"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Send to Contacts
                </Button>
              </div>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-xs text-blue-700">
                <Shield className="h-3 w-3 inline mr-1" />
                This secure link allows your contacts to view your live location and trip details during your journey.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
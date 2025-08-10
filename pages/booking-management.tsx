import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Car, 
  Clock, 
  MapPin, 
  Phone, 
  User,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Navigation
} from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';

interface RideRequest {
  id: number;
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  destinationAddress: string;
  destinationLat: number;
  destinationLng: number;
  passengerName: string;
  passengerPhone: string;
  requestedTime: string;
  status: 'pending' | 'quoted' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  specialRequirements?: string;
  estimatedDistance: number;
  estimatedDuration: number;
  createdAt: string;
  quotes?: PriceQuote[];
}

interface PriceQuote {
  id: number;
  partnerId: number;
  partnerName: string;
  driverId?: number;
  driverName?: string;
  quotedPrice: number;
  estimatedArrival: number;
  estimatedDuration: number;
  validUntil: string;
  status: 'active' | 'accepted' | 'expired' | 'withdrawn';
}

export default function BookingManagement() {
  const { toast } = useToast();
  const [selectedRequest, setSelectedRequest] = useState<RideRequest | null>(null);
  const [quoteDialog, setQuoteDialog] = useState(false);
  const [newQuote, setNewQuote] = useState({
    quotedPrice: '',
    estimatedArrival: '',
    estimatedDuration: '',
    driverId: ''
  });

  // Fetch ride requests
  const { data: rideRequests, isLoading } = useQuery({
    queryKey: ['/api/rides/requests'],
    refetchInterval: 10000, // Refresh every 10 seconds for real-time updates
  });

  // Fetch available drivers for the partner
  const { data: drivers } = useQuery({
    queryKey: ['/api/drivers/available'],
  });

  // Submit quote mutation
  const submitQuoteMutation = useMutation({
    mutationFn: async (quoteData: any) => {
      await apiRequest('/api/price-quotes', {
        method: 'POST',
        body: JSON.stringify(quoteData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/rides/requests'] });
      setQuoteDialog(false);
      setSelectedRequest(null);
      setNewQuote({ quotedPrice: '', estimatedArrival: '', estimatedDuration: '', driverId: '' });
      toast({
        title: "Quote Submitted",
        description: "Your price quote has been submitted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit quote.",
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'quoted':
        return <Badge variant="outline" className="text-blue-600 border-blue-600"><DollarSign className="w-3 h-3 mr-1" />Quoted</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="text-green-600 border-green-600"><CheckCircle className="w-3 h-3 mr-1" />Confirmed</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="text-purple-600 border-purple-600"><Car className="w-3 h-3 mr-1" />In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="text-green-800 border-green-800"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="text-red-600 border-red-600"><XCircle className="w-3 h-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleSubmitQuote = () => {
    if (!selectedRequest || !newQuote.quotedPrice || !newQuote.estimatedArrival) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const quoteData = {
      rideRequestId: selectedRequest.id,
      quotedPrice: parseFloat(newQuote.quotedPrice),
      estimatedArrival: parseInt(newQuote.estimatedArrival),
      estimatedDuration: parseInt(newQuote.estimatedDuration),
      driverId: newQuote.driverId ? parseInt(newQuote.driverId) : undefined,
      validUntil: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // Valid for 15 minutes
    };

    submitQuoteMutation.mutate(quoteData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Booking Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage ride requests and submit competitive quotes
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">New Requests</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {rideRequests?.filter((r: RideRequest) => r.status === 'pending').length || 0}
                  </p>
                </div>
                <AlertCircle className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Rides</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {rideRequests?.filter((r: RideRequest) => r.status === 'in_progress').length || 0}
                  </p>
                </div>
                <Car className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Rides</p>
                  <p className="text-2xl font-bold text-green-600">
                    {rideRequests?.filter((r: RideRequest) => 
                      new Date(r.createdAt).toDateString() === new Date().toDateString()
                    ).length || 0}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Available Drivers</p>
                  <p className="text-2xl font-bold text-purple-600">{drivers?.length || 0}</p>
                </div>
                <User className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ride Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle>Ride Requests</CardTitle>
            <CardDescription>
              Real-time ride requests available for bidding
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full mx-auto"></div>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Loading ride requests...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Passenger</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Distance</TableHead>
                    <TableHead>Requested Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rideRequests?.map((request: RideRequest) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{request.passengerName}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{request.passengerPhone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-green-500" />
                            <span className="text-sm">{request.pickupAddress}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Navigation className="w-4 h-4 text-red-500" />
                            <span className="text-sm">{request.destinationAddress}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{request.estimatedDistance} km</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            ~{request.estimatedDuration} min
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(request.requestedTime).toLocaleString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        {request.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(request);
                              setQuoteDialog(true);
                            }}
                          >
                            <DollarSign className="w-4 h-4 mr-1" />
                            Quote
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Quote Dialog */}
        <Dialog open={quoteDialog} onOpenChange={setQuoteDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Submit Quote</DialogTitle>
              <DialogDescription>
                Provide your quote for this ride request
              </DialogDescription>
            </DialogHeader>

            {selectedRequest && (
              <div className="space-y-4">
                {/* Trip Details */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-medium mb-2">Trip Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-500" />
                      <span>{selectedRequest.pickupAddress}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-red-500" />
                      <span>{selectedRequest.destinationAddress}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-blue-500" />
                      <span>{selectedRequest.estimatedDistance} km • {selectedRequest.estimatedDuration} min</span>
                    </div>
                  </div>
                </div>

                {/* Quote Form */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="quotedPrice">Quote Price (£) *</Label>
                    <Input
                      id="quotedPrice"
                      type="number"
                      step="0.01"
                      value={newQuote.quotedPrice}
                      onChange={(e) => setNewQuote({ ...newQuote, quotedPrice: e.target.value })}
                      placeholder="e.g. 15.50"
                    />
                  </div>

                  <div>
                    <Label htmlFor="estimatedArrival">Estimated Arrival (minutes) *</Label>
                    <Input
                      id="estimatedArrival"
                      type="number"
                      value={newQuote.estimatedArrival}
                      onChange={(e) => setNewQuote({ ...newQuote, estimatedArrival: e.target.value })}
                      placeholder="e.g. 8"
                    />
                  </div>

                  <div>
                    <Label htmlFor="estimatedDuration">Trip Duration (minutes)</Label>
                    <Input
                      id="estimatedDuration"
                      type="number"
                      value={newQuote.estimatedDuration}
                      onChange={(e) => setNewQuote({ ...newQuote, estimatedDuration: e.target.value })}
                      placeholder="e.g. 25"
                    />
                  </div>

                  {drivers && drivers.length > 0 && (
                    <div>
                      <Label htmlFor="driverId">Assign Driver</Label>
                      <Select value={newQuote.driverId} onValueChange={(value) => setNewQuote({ ...newQuote, driverId: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a driver (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          {drivers.map((driver: any) => (
                            <SelectItem key={driver.id} value={driver.id.toString()}>
                              {driver.name} - {driver.vehicleType}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setQuoteDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitQuote}
                disabled={submitQuoteMutation.isPending}
              >
                Submit Quote
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
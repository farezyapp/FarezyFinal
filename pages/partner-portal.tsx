import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Building, 
  Car, 
  Users, 
  DollarSign, 
  Clock, 
  Calendar,
  Phone,
  Mail,
  MapPin,
  Plus,
  Eye,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Activity
} from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';

interface PartnerCompany {
  id: number;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  operatingArea: string;
  fleetSize: string;
  status: string;
  createdAt: string;
}

interface Driver {
  id: number;
  name: string;
  phone: string;
  licenseNumber: string;
  vehicleType: string;
  vehiclePlate: string;
  status: 'active' | 'inactive' | 'busy';
  rating: number;
  totalRides: number;
}

interface RideRequest {
  id: number;
  pickupAddress: string;
  destinationAddress: string;
  passengerName: string;
  estimatedDistance: number;
  estimatedDuration: number;
  requestedTime: string;
  status: 'pending' | 'quoted' | 'confirmed' | 'completed';
}

export default function PartnerPortal() {
  const { toast } = useToast();
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [driverDialog, setDriverDialog] = useState(false);
  const [newDriver, setNewDriver] = useState({
    name: '',
    phone: '',
    licenseNumber: '',
    vehicleType: '',
    vehiclePlate: ''
  });

  // Mock partner ID - in real app, this would come from authentication
  const partnerId = 1;

  // Fetch company data
  const { data: company } = useQuery({
    queryKey: [`/api/partner-applications/${partnerId}`],
  });

  // Fetch drivers
  const { data: drivers, isLoading: driversLoading } = useQuery({
    queryKey: [`/api/drivers/partner/${partnerId}`],
  });

  // Fetch recent ride requests
  const { data: rideRequests, isLoading: ridesLoading } = useQuery({
    queryKey: ['/api/rides/requests'],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Add driver mutation
  const addDriverMutation = useMutation({
    mutationFn: async (driverData: any) => {
      return await apiRequest('/api/drivers', {
        method: 'POST',
        body: JSON.stringify({ ...driverData, partnerId }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/drivers/partner/${partnerId}`] });
      setDriverDialog(false);
      setNewDriver({ name: '', phone: '', licenseNumber: '', vehicleType: '', vehiclePlate: '' });
      toast({
        title: "Driver Added",
        description: "New driver has been added to your fleet successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add driver.",
        variant: "destructive",
      });
    },
  });

  const handleAddDriver = () => {
    if (!newDriver.name || !newDriver.phone || !newDriver.licenseNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    addDriverMutation.mutate(newDriver);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 text-white">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'busy':
        return <Badge className="bg-orange-500 text-white">Busy</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const stats = {
    totalDrivers: drivers?.length || 0,
    activeDrivers: drivers?.filter((d: Driver) => d.status === 'active').length || 0,
    pendingRequests: rideRequests?.filter((r: RideRequest) => r.status === 'pending').length || 0,
    todayRides: rideRequests?.filter((r: RideRequest) => 
      new Date(r.requestedTime).toDateString() === new Date().toDateString()
    ).length || 0,
  };

  if (!company) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Please ensure your company is approved and you have proper access credentials.
            </p>
            <Button onClick={() => window.location.href = '/partner-signup'}>
              Apply for Partnership
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {company.companyName}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Partner Portal - Manage your taxi operations
              </p>
            </div>
            <Badge className="bg-green-500 text-white">
              <CheckCircle className="w-4 h-4 mr-1" />
              Approved Partner
            </Badge>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Drivers</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalDrivers}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Now</p>
                  <p className="text-2xl font-bold text-green-600">{stats.activeDrivers}</p>
                </div>
                <Activity className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Requests</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.pendingRequests}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Rides</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.todayRides}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="drivers">Fleet Management</TabsTrigger>
            <TabsTrigger value="requests">Ride Requests</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Company Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">{company.companyName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Company Name</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">{company.address}, {company.city}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Operating Location</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">{company.phone}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Contact Number</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">{company.email}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Email Address</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Manage your fleet and operations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setDriverDialog(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Driver
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => window.location.href = '/booking-management'}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Ride Requests
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                  >
                    <Car className="w-4 h-4 mr-2" />
                    Manage Vehicles
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    View Earnings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Drivers Tab */}
          <TabsContent value="drivers" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Fleet Management</h2>
              <Button onClick={() => setDriverDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Driver
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Driver</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Total Rides</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {driversLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          Loading drivers...
                        </TableCell>
                      </TableRow>
                    ) : drivers && drivers.length > 0 ? (
                      drivers.map((driver: Driver) => (
                        <TableRow key={driver.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{driver.name}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{driver.phone}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{driver.vehicleType}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{driver.vehiclePlate}</p>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(driver.status)}</TableCell>
                          <TableCell>⭐ {driver.rating.toFixed(1)}</TableCell>
                          <TableCell>{driver.totalRides}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="text-gray-500">
                            <Car className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No drivers added yet</p>
                            <Button 
                              className="mt-4" 
                              onClick={() => setDriverDialog(true)}
                            >
                              Add Your First Driver
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ride Requests Tab */}
          <TabsContent value="requests" className="space-y-6">
            <h2 className="text-2xl font-bold">Available Ride Requests</h2>
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Real-time Ride Requests</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Monitor and bid on incoming ride requests from customers
                  </p>
                  <Button onClick={() => window.location.href = '/booking-management'}>
                    Open Booking Management
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold">Company Settings</h2>
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Company Settings</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Manage your company profile, pricing, and operational settings
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Driver Dialog */}
        <Dialog open={driverDialog} onOpenChange={setDriverDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Driver</DialogTitle>
              <DialogDescription>
                Register a new driver to your fleet
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="driverName">Driver Name *</Label>
                <Input
                  id="driverName"
                  value={newDriver.name}
                  onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                  placeholder="Enter driver's full name"
                />
              </div>

              <div>
                <Label htmlFor="driverPhone">Phone Number *</Label>
                <Input
                  id="driverPhone"
                  value={newDriver.phone}
                  onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <Label htmlFor="licenseNumber">License Number *</Label>
                <Input
                  id="licenseNumber"
                  value={newDriver.licenseNumber}
                  onChange={(e) => setNewDriver({ ...newDriver, licenseNumber: e.target.value })}
                  placeholder="Enter driving license number"
                />
              </div>

              <div>
                <Label htmlFor="vehicleType">Vehicle Type</Label>
                <Select value={newDriver.vehicleType} onValueChange={(value) => setNewDriver({ ...newDriver, vehicleType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedan">Sedan</SelectItem>
                    <SelectItem value="hatchback">Hatchback</SelectItem>
                    <SelectItem value="suv">SUV</SelectItem>
                    <SelectItem value="mpv">MPV</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                    <SelectItem value="wheelchair">Wheelchair Accessible</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="vehiclePlate">License Plate</Label>
                <Input
                  id="vehiclePlate"
                  value={newDriver.vehiclePlate}
                  onChange={(e) => setNewDriver({ ...newDriver, vehiclePlate: e.target.value })}
                  placeholder="Enter vehicle license plate"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDriverDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddDriver}
                disabled={addDriverMutation.isPending}
              >
                Add Driver
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
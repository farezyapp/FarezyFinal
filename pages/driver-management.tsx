import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, User, Car, Phone, Mail, Calendar, ArrowLeft, Shield, Star, Clock } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { insertDriverSchema, insertVehicleSchema } from "@shared/schema";
import { z } from "zod";

const driverFormSchema = insertDriverSchema.extend({
  licenseExpiry: z.string().min(1, "License expiry date is required"),
});

const vehicleFormSchema = insertVehicleSchema.extend({
  registrationExpiry: z.string().min(1, "Registration expiry date is required"),
  insuranceExpiry: z.string().min(1, "Insurance expiry date is required"),
});

interface Driver {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  status: string;
  rating: string;
  totalRides: number;
  isVerified: boolean;
  vehicleId?: number;
  profileImageUrl?: string;
  createdAt: string;
}

interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  vehicleType: string;
  capacity: number;
  registrationExpiry: string;
  insuranceExpiry: string;
  isActive: boolean;
}

function DriverManagement() {
  const [selectedPartnerId] = useState(1);
  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: drivers = [], isLoading: driversLoading } = useQuery({
    queryKey: ['/api/drivers/partner', selectedPartnerId],
  });

  const { data: vehicles = [], isLoading: vehiclesLoading } = useQuery({
    queryKey: ['/api/vehicles/partner', selectedPartnerId],
  });

  const driverForm = useForm({
    resolver: zodResolver(driverFormSchema),
    defaultValues: {
      partnerId: selectedPartnerId,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      licenseNumber: "",
      licenseExpiry: "",
      vehicleId: null,
    },
  });

  const vehicleForm = useForm({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      partnerId: selectedPartnerId,
      make: "",
      model: "",
      year: new Date().getFullYear(),
      color: "",
      licensePlate: "",
      vehicleType: "sedan",
      capacity: 4,
      registrationExpiry: "",
      insuranceExpiry: "",
    },
  });

  const addDriverMutation = useMutation({
    mutationFn: async (driverData: any) => {
      return apiRequest('/api/drivers', {
        method: 'POST',
        body: JSON.stringify({
          ...driverData,
          licenseExpiry: new Date(driverData.licenseExpiry).toISOString(),
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/drivers/partner', selectedPartnerId] });
      setIsAddDriverOpen(false);
      driverForm.reset();
      toast({
        title: "Driver Added",
        description: "New driver has been successfully registered",
      });
    },
    onError: () => {
      toast({
        title: "Failed to Add Driver",
        description: "Please check all required fields and try again",
        variant: "destructive",
      });
    },
  });

  const addVehicleMutation = useMutation({
    mutationFn: async (vehicleData: any) => {
      return apiRequest('/api/vehicles', {
        method: 'POST',
        body: JSON.stringify({
          ...vehicleData,
          registrationExpiry: new Date(vehicleData.registrationExpiry).toISOString(),
          insuranceExpiry: new Date(vehicleData.insuranceExpiry).toISOString(),
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/vehicles/partner', selectedPartnerId] });
      setIsAddVehicleOpen(false);
      vehicleForm.reset();
      toast({
        title: "Vehicle Added",
        description: "New vehicle has been successfully registered",
      });
    },
    onError: () => {
      toast({
        title: "Failed to Add Vehicle",
        description: "Please check all required fields and try again",
        variant: "destructive",
      });
    },
  });

  const updateDriverStatusMutation = useMutation({
    mutationFn: async ({ driverId, status }: { driverId: number; status: string }) => {
      return apiRequest(`/api/drivers/${driverId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/drivers/partner', selectedPartnerId] });
      toast({
        title: "Status Updated",
        description: "Driver status has been updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Could not update driver status",
        variant: "destructive",
      });
    },
  });

  const onAddDriver = (data: any) => {
    addDriverMutation.mutate(data);
  };

  const onAddVehicle = (data: any) => {
    addVehicleMutation.mutate(data);
  };

  const handleStatusChange = (driverId: number, newStatus: string) => {
    updateDriverStatusMutation.mutate({ driverId, status: newStatus });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'online':
        return 'default';
      case 'busy':
        return 'secondary';
      case 'offline':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto p-4 space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            ←
          </Button>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Driver Management
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Manage your fleet of drivers and vehicles with comprehensive monitoring tools
          </p>
        </div>

        <div className="flex justify-center items-center mb-8">
          <div className="flex gap-3">
            <Dialog open={isAddVehicleOpen} onOpenChange={setIsAddVehicleOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
                >
                  <Car className="h-4 w-4 mr-2" />
                  Add Vehicle
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Vehicle</DialogTitle>
                </DialogHeader>
                <Form {...vehicleForm}>
                  <form onSubmit={vehicleForm.handleSubmit(onAddVehicle)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={vehicleForm.control}
                        name="make"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Make</FormLabel>
                            <FormControl>
                              <Input placeholder="Toyota, Ford, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={vehicleForm.control}
                        name="model"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Model</FormLabel>
                            <FormControl>
                              <Input placeholder="Camry, Focus, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsAddVehicleOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={addVehicleMutation.isPending}>
                        {addVehicleMutation.isPending ? "Adding..." : "Add Vehicle"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>

            <Dialog open={isAddDriverOpen} onOpenChange={setIsAddDriverOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Driver
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Driver</DialogTitle>
                </DialogHeader>
                <Form {...driverForm}>
                  <form onSubmit={driverForm.handleSubmit(onAddDriver)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={driverForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={driverForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Smith" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsAddDriverOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={addDriverMutation.isPending}>
                        {addDriverMutation.isPending ? "Adding..." : "Add Driver"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Drivers Section */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Active Drivers ({drivers.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {driversLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading drivers...</p>
                </div>
              ) : drivers.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-10 w-10 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No drivers registered yet</h3>
                  <p className="text-gray-500">Add your first driver to start receiving bookings</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {drivers.map((driver: Driver) => (
                    <div key={driver.id} className="bg-gradient-to-r from-white to-blue-50 p-6 border border-blue-100 rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                            <User className="h-8 w-8 text-white" />
                          </div>
                          <div>
                            <div className="font-bold text-lg text-gray-800 mb-1">
                              {driver.firstName} {driver.lastName}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                                <Mail className="h-3 w-3" />
                                {driver.email}
                              </span>
                              <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                                <Phone className="h-3 w-3" />
                                {driver.phone}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge 
                                variant={getStatusBadgeVariant(driver.status)}
                                className={`${
                                  driver.status === 'online' ? 'bg-green-100 text-green-800 border-green-200' :
                                  driver.status === 'busy' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                  'bg-gray-100 text-gray-800 border-gray-200'
                                }`}
                              >
                                {driver.status}
                              </Badge>
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Star className="h-3 w-3 text-yellow-500" />
                                <span>{driver.rating || '4.8'}</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Clock className="h-3 w-3" />
                                <span>{driver.totalRides || 0} rides</span>
                              </div>
                              {driver.isVerified && (
                                <div className="flex items-center gap-1 text-sm text-green-600">
                                  <Shield className="h-3 w-3" />
                                  <span>Verified</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Select onValueChange={(value) => handleStatusChange(driver.id, value)}>
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Set Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="online">Online</SelectItem>
                              <SelectItem value="busy">Busy</SelectItem>
                              <SelectItem value="offline">Offline</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Vehicles Section */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Fleet Vehicles ({vehicles.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {vehiclesLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading vehicles...</p>
                </div>
              ) : vehicles.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Car className="h-10 w-10 text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No vehicles registered yet</h3>
                  <p className="text-gray-500">Add vehicles to assign to your drivers</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {vehicles.map((vehicle: Vehicle) => (
                    <div key={vehicle.id} className="bg-gradient-to-br from-white to-purple-50 p-6 border border-purple-100 rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                            <Car className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <div className="font-bold text-gray-800">
                              {vehicle.color} {vehicle.make} {vehicle.model}
                            </div>
                            <div className="text-sm text-gray-600">
                              {vehicle.year} • {vehicle.licensePlate}
                            </div>
                          </div>
                        </div>
                        <Badge 
                          variant={vehicle.isActive ? "default" : "secondary"}
                          className={vehicle.isActive ? "bg-green-100 text-green-800 border-green-200" : "bg-gray-100 text-gray-800 border-gray-200"}
                        >
                          {vehicle.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="bg-purple-100 px-2 py-1 rounded-full">Type: {vehicle.vehicleType}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="bg-purple-100 px-2 py-1 rounded-full">Capacity: {vehicle.capacity} passengers</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="h-3 w-3" />
                          Reg. expires: {new Date(vehicle.registrationExpiry).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default DriverManagement;
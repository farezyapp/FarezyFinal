import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Car, 
  Search, 
  Filter, 
  Download, 
  Star, 
  MapPin,
  Clock,
  Calendar as CalendarIcon,
  TrendingUp,
  DollarSign,
  BarChart3
} from 'lucide-react';
import { Link } from 'wouter';
import { format } from 'date-fns';

const RideHistory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState<Date | undefined>(undefined);
  const [selectedYear, setSelectedYear] = useState('2025');

  // Mock ride data
  const rides = [
    {
      id: 'ride_001',
      service: 'Uber',
      type: 'UberX',
      from: 'Home',
      fromAddress: '123 Main Street, Milton Keynes',
      to: 'Milton Keynes Central Station',
      toAddress: 'Station Square, Milton Keynes',
      date: '2025-06-28',
      time: '09:15',
      duration: '12 min',
      distance: '3.2 km',
      price: 12.50,
      rating: 5,
      driverName: 'John Smith',
      status: 'completed'
    },
    {
      id: 'ride_002',
      service: 'Bolt',
      type: 'Economy',
      from: 'Central MK',
      fromAddress: 'Central Milton Keynes Shopping Centre',
      to: 'Xscape Milton Keynes',
      toAddress: '602 Marlborough Gate, Milton Keynes',
      date: '2025-06-27',
      time: '14:30',
      duration: '8 min',
      distance: '2.1 km',
      price: 8.20,
      rating: 4,
      driverName: 'Sarah Johnson',
      status: 'completed'
    },
    {
      id: 'ride_003',
      service: 'Local Taxi',
      type: 'Standard',
      from: 'Bletchley Station',
      fromAddress: 'Bletchley Railway Station',
      to: 'Home',
      toAddress: '123 Main Street, Milton Keynes',
      date: '2025-06-26',
      time: '18:45',
      duration: '15 min',
      distance: '4.8 km',
      price: 15.00,
      rating: 5,
      driverName: 'Mike Wilson',
      status: 'completed'
    },
    {
      id: 'ride_004',
      service: 'Uber',
      type: 'Comfort',
      from: 'Home',
      fromAddress: '123 Main Street, Milton Keynes',
      to: 'IKEA Milton Keynes',
      toAddress: 'Pinewood, Buckinghamshire',
      date: '2025-06-25',
      time: '11:20',
      duration: '18 min',
      distance: '6.5 km',
      price: 18.75,
      rating: 4,
      driverName: 'David Brown',
      status: 'completed'
    },
    {
      id: 'ride_005',
      service: 'Bolt',
      type: 'Economy',
      from: 'The Centre:MK',
      fromAddress: 'The Centre MK Shopping Centre',
      to: 'Home',
      toAddress: '123 Main Street, Milton Keynes',
      date: '2025-06-24',
      time: '16:10',
      duration: '10 min',
      distance: '2.8 km',
      price: 9.50,
      rating: 5,
      driverName: 'Lisa Davis',
      status: 'completed'
    },
    {
      id: 'ride_006',
      service: 'City Cabs',
      type: 'Premium',
      from: 'Milton Keynes Hospital',
      fromAddress: 'Standing Way, Eaglestone, Milton Keynes',
      to: 'Home',
      toAddress: '123 Main Street, Milton Keynes',
      date: '2025-06-23',
      time: '20:30',
      duration: '22 min',
      distance: '7.2 km',
      price: 22.00,
      rating: 5,
      driverName: 'Tom Anderson',
      status: 'completed'
    }
  ];

  // Calculate statistics
  const totalRides = rides.length;
  const totalSpent = rides.reduce((sum, ride) => sum + ride.price, 0);
  const averageRating = rides.reduce((sum, ride) => sum + ride.rating, 0) / rides.length;
  const totalDistance = rides.reduce((sum, ride) => sum + parseFloat(ride.distance), 0);

  // Filter rides based on search and filters
  const filteredRides = rides.filter(ride => {
    const matchesSearch = searchTerm === '' || 
      ride.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.service.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesService = selectedService === 'all' || ride.service.toLowerCase() === selectedService.toLowerCase();
    
    const matchesMonth = !selectedMonth || format(new Date(ride.date), 'MM') === format(selectedMonth, 'MM');
    
    return matchesSearch && matchesService && matchesMonth;
  });

  const getServiceColor = (service: string) => {
    switch (service.toLowerCase()) {
      case 'uber': return 'bg-black text-white';
      case 'bolt': return 'bg-green-500 text-white';
      case 'local taxi': return 'bg-blue-500 text-white';
      case 'city cabs': return 'bg-orange-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-orange-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                Farezy
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/profile">
                <Button variant="outline">Back to Profile</Button>
              </Link>
              <Button size="sm" variant="outline" className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ride History</h1>
          <p className="text-gray-600">Track your rides, spending, and travel patterns</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Car className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{totalRides}</div>
                  <div className="text-sm text-gray-600">Total Rides</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">£{totalSpent.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Total Spent</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
                  <div className="text-sm text-gray-600">Avg Rating</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{totalDistance.toFixed(1)} km</div>
                  <div className="text-sm text-gray-600">Total Distance</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search rides..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Service Filter */}
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger>
                  <SelectValue placeholder="All Services" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  <SelectItem value="uber">Uber</SelectItem>
                  <SelectItem value="bolt">Bolt</SelectItem>
                  <SelectItem value="local taxi">Local Taxi</SelectItem>
                  <SelectItem value="city cabs">City Cabs</SelectItem>
                </SelectContent>
              </Select>

              {/* Month Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedMonth ? format(selectedMonth, 'MMMM yyyy') : 'Select month'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedMonth}
                    onSelect={setSelectedMonth}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {/* Clear Filters */}
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedService('all');
                  setSelectedMonth(undefined);
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Rides List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Rides ({filteredRides.length})</CardTitle>
              <Badge variant="secondary">{filteredRides.length} of {totalRides} rides</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {filteredRides.length === 0 ? (
              <div className="text-center py-12">
                <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No rides found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRides.map((ride) => (
                  <Card key={ride.id} className="border-l-4 border-l-orange-500">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                        {/* Ride Info */}
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                              <Car className="h-6 w-6 text-orange-500" />
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge className={getServiceColor(ride.service)}>
                                {ride.service}
                              </Badge>
                              <span className="text-sm text-gray-600">{ride.type}</span>
                            </div>
                            
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4 text-green-500 flex-shrink-0" />
                                <span className="font-medium">{ride.from}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4 text-red-500 flex-shrink-0" />
                                <span className="font-medium">{ride.to}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <span className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{ride.date} at {ride.time}</span>
                              </span>
                              <span>{ride.duration}</span>
                              <span>{ride.distance}</span>
                            </div>
                          </div>
                        </div>

                        {/* Price and Rating */}
                        <div className="flex items-center space-x-6">
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">
                              £{ride.price.toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-600">
                              Driver: {ride.driverName}
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-center space-y-1">
                            <div className="flex items-center space-x-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${i < ride.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-600">{ride.rating}/5</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RideHistory;
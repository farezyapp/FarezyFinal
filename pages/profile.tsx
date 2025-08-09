import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Bell, 
  Shield, 
  CreditCard,
  Settings,
  Star,
  Car,
  Clock,
  TrendingUp,
  Award,
  Edit,
  Save,
  Camera
} from 'lucide-react';
import { Link } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty }
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema)
  });

  // Load user data on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      
      // Set form default values
      setValue('firstName', userData.firstName || '');
      setValue('lastName', userData.lastName || '');
      setValue('email', userData.email || '');
      setValue('phone', userData.phone || '');
      setValue('address', userData.address || '');
      setValue('emergencyContact', userData.emergencyContact || '');
      setValue('emergencyPhone', userData.emergencyPhone || '');
    }
  }, [setValue]);

  const onSubmit = (data: ProfileFormData) => {
    // Update user data in localStorage (in real app, this would call an API)
    const updatedUser = { ...user, ...data };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);
    
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    window.location.href = '/';
  };

  // Mock user stats
  const userStats = {
    totalRides: 47,
    totalSpent: 234.50,
    avgRating: 4.8,
    memberSince: '2024-01-15'
  };

  const recentRides = [
    {
      id: 1,
      service: 'Uber',
      type: 'UberX',
      from: 'Home',
      to: 'Milton Keynes Central',
      date: '2025-06-28',
      price: '£12.50',
      rating: 5
    },
    {
      id: 2,
      service: 'Bolt',
      type: 'Economy',
      from: 'Central MK',
      to: 'Xscape',
      date: '2025-06-27',
      price: '£8.20',
      rating: 4
    },
    {
      id: 3,
      service: 'Local Taxi',
      type: 'Standard',
      from: 'Bletchley',
      to: 'Home',
      date: '2025-06-26',
      price: '£15.00',
      rating: 5
    }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              Please sign in to view your profile
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/login">
              <Button className="w-full bg-orange-500 hover:bg-orange-600">
                Sign In
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full">
                ←
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              <Link href="/">
                <Button size="sm" variant="ghost" className="text-gray-600 hover:text-gray-900">←</Button>
              </Link>
              <Button 
                variant="destructive" 
                onClick={handleLogout}
                size="sm"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Profile Header */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                {/* Avatar */}
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-orange-500 text-white text-2xl">
                      {user.firstName?.[0] || user.name?.[0] || user.email[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button 
                    size="sm" 
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                    variant="secondary"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>

                {/* User Info */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.name}
                  </h1>
                  <p className="text-gray-600 mb-4">{user.email}</p>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-orange-500">{userStats.totalRides}</div>
                      <div className="text-sm text-gray-600">Total Rides</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-500">£{userStats.totalSpent}</div>
                      <div className="text-sm text-gray-600">Total Spent</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-500 flex items-center justify-center">
                        {userStats.avgRating} <Star className="h-4 w-4 ml-1 fill-current" />
                      </div>
                      <div className="text-sm text-gray-600">Avg Rating</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-500">
                        {new Date(userStats.memberSince).getFullYear()}
                      </div>
                      <div className="text-sm text-gray-600">Member Since</div>
                    </div>
                  </div>
                </div>

                {/* Edit Button */}
                <Button 
                  onClick={() => setIsEditing(!isEditing)}
                  variant={isEditing ? "secondary" : "outline"}
                  className="flex items-center space-x-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="profile" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="rides">Ride History</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Personal Information</span>
                </CardTitle>
                <CardDescription>
                  Manage your personal details and emergency contacts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        {...register('firstName')}
                        disabled={!isEditing}
                        className={!isEditing ? 'bg-gray-50' : ''}
                      />
                      {errors.firstName && (
                        <p className="text-sm text-red-500">{errors.firstName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        {...register('lastName')}
                        disabled={!isEditing}
                        className={!isEditing ? 'bg-gray-50' : ''}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-red-500">{errors.lastName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        disabled={!isEditing}
                        className={!isEditing ? 'bg-gray-50' : ''}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500">{errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        {...register('phone')}
                        disabled={!isEditing}
                        className={!isEditing ? 'bg-gray-50' : ''}
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-500">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Home Address</Label>
                    <Textarea
                      id="address"
                      {...register('address')}
                      disabled={!isEditing}
                      className={!isEditing ? 'bg-gray-50' : ''}
                      rows={3}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center space-x-2">
                      <Shield className="h-5 w-5" />
                      <span>Emergency Contact</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                        <Input
                          id="emergencyContact"
                          {...register('emergencyContact')}
                          disabled={!isEditing}
                          className={!isEditing ? 'bg-gray-50' : ''}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                        <Input
                          id="emergencyPhone"
                          {...register('emergencyPhone')}
                          disabled={!isEditing}
                          className={!isEditing ? 'bg-gray-50' : ''}
                        />
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end space-x-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-orange-500 hover:bg-orange-600"
                        disabled={!isDirty}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ride History Tab */}
          <TabsContent value="rides">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Car className="h-5 w-5" />
                  <span>Recent Rides</span>
                </CardTitle>
                <CardDescription>
                  Your recent ride history and ratings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentRides.map((ride) => (
                    <Card key={ride.id} className="border-l-4 border-l-orange-500">
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                <Car className="h-6 w-6 text-orange-500" />
                              </div>
                            </div>
                            <div>
                              <div className="font-semibold">{ride.service} - {ride.type}</div>
                              <div className="text-sm text-gray-600">
                                {ride.from} → {ride.to}
                              </div>
                              <div className="text-xs text-gray-500">{ride.date}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="font-bold text-lg">{ride.price}</div>
                              <div className="flex items-center space-x-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-3 w-3 ${i < ride.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="text-center mt-6">
                  <Link href="/ride-history">
                    <Button variant="outline">View All Rides</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>App Settings</span>
                </CardTitle>
                <CardDescription>
                  Customize your app experience and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Notifications */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <span>Notifications</span>
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Push Notifications</div>
                        <div className="text-sm text-gray-600">Receive ride updates and promotions</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Email Notifications</div>
                        <div className="text-sm text-gray-600">Ride receipts and important updates</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">SMS Notifications</div>
                        <div className="text-sm text-gray-600">Emergency alerts and ride confirmations</div>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Privacy */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Privacy & Data</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Location Sharing</div>
                        <div className="text-sm text-gray-600">Share location for better ride matching</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Analytics</div>
                        <div className="text-sm text-gray-600">Help improve the app with usage data</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* App Preferences */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">App Preferences</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Dark Mode</div>
                        <div className="text-sm text-gray-600">Use dark theme throughout the app</div>
                      </div>
                      <Switch />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Auto-save Locations</div>
                        <div className="text-sm text-gray-600">Automatically save frequently used locations</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Tab */}
          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Payment Methods</span>
                </CardTitle>
                <CardDescription>
                  Manage your payment methods and billing information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Payment Methods</h3>
                  <p className="text-gray-600 mb-6">
                    Add a payment method to book rides directly through Farezy
                  </p>
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    Add Payment Method
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Home, Briefcase, MapPin, GraduationCap, ShoppingBag, Dumbbell, Plus, Edit2, Trash2, Car } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface LocationShortcut {
  id: number;
  userId: string;
  name: string;
  label: string;
  address: string;
  latitude: string;
  longitude: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

const iconOptions = [
  { value: 'Home', label: 'Home', icon: Home },
  { value: 'Briefcase', label: 'Work', icon: Briefcase },
  { value: 'GraduationCap', label: 'School', icon: GraduationCap },
  { value: 'ShoppingBag', label: 'Shopping', icon: ShoppingBag },
  { value: 'Dumbbell', label: 'Gym', icon: Dumbbell },
  { value: 'MapPin', label: 'Other', icon: MapPin },
];

export default function LocationShortcuts() {
  const [isAddingShortcut, setIsAddingShortcut] = useState(false);
  const [editingShortcut, setEditingShortcut] = useState<LocationShortcut | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    label: '',
    address: '',
    icon: 'MapPin'
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock user ID - in real app, get from auth context
  const userId = 'user123';

  const { data: shortcuts = [], isLoading } = useQuery({
    queryKey: ['/api/location-shortcuts', userId],
    enabled: !!userId,
  });

  const addShortcutMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('/api/location-shortcuts', {
        method: 'POST',
        body: JSON.stringify({ ...data, userId }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/location-shortcuts'] });
      setIsAddingShortcut(false);
      setFormData({ name: '', label: '', address: '', icon: 'MapPin' });
      toast({
        title: "Success",
        description: "Location shortcut added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add location shortcut",
        variant: "destructive",
      });
    },
  });

  const updateShortcutMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest(`/api/location-shortcuts/${editingShortcut?.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/location-shortcuts'] });
      setEditingShortcut(null);
      setFormData({ name: '', label: '', address: '', icon: 'MapPin' });
      toast({
        title: "Success",
        description: "Location shortcut updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update location shortcut",
        variant: "destructive",
      });
    },
  });

  const deleteShortcutMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/location-shortcuts/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/location-shortcuts'] });
      toast({
        title: "Success",
        description: "Location shortcut deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete location shortcut",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.label || !formData.address) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Mock geocoding - in real app, use Google Maps API
    const mockCoordinates = {
      latitude: (51.5074 + Math.random() * 0.1).toString(),
      longitude: (-0.1278 + Math.random() * 0.1).toString(),
    };

    const submitData = {
      ...formData,
      ...mockCoordinates,
    };

    if (editingShortcut) {
      updateShortcutMutation.mutate(submitData);
    } else {
      addShortcutMutation.mutate(submitData);
    }
  };

  const handleEdit = (shortcut: LocationShortcut) => {
    setEditingShortcut(shortcut);
    setFormData({
      name: shortcut.name,
      label: shortcut.label,
      address: shortcut.address,
      icon: shortcut.icon,
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this location shortcut?')) {
      deleteShortcutMutation.mutate(id);
    }
  };

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(option => option.value === iconName);
    return iconOption ? iconOption.icon : MapPin;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button size="sm" variant="ghost" className="text-gray-600 hover:text-gray-900" onClick={() => window.location.href = '/'}>
                ←
              </Button>
              <div className="flex items-center space-x-2">
                <Car className="h-8 w-8 text-orange-500" />
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                  Farezy
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="py-8">
        <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Location Shortcuts</h1>
            <p className="text-gray-600">Manage your frequently visited locations for quick access</p>
          </div>
          
          <Dialog open={isAddingShortcut} onOpenChange={setIsAddingShortcut}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Location
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Location Shortcut</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., home, work, gym"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="label">Display Label</Label>
                  <Input
                    id="label"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    placeholder="e.g., Home, My Office, Downtown Gym"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter full address"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="icon">Icon</Label>
                  <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((option) => {
                        const IconComponent = option.icon;
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <IconComponent className="h-4 w-4" />
                              {option.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button 
                    type="submit" 
                    className="flex-1"
                    disabled={addShortcutMutation.isPending}
                  >
                    {addShortcutMutation.isPending ? 'Adding...' : 'Add Location'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsAddingShortcut(false);
                      setFormData({ name: '', label: '', address: '', icon: 'MapPin' });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : shortcuts.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No location shortcuts yet</h3>
              <p className="text-gray-600 mb-6">Add your frequently visited locations for quick access when booking rides</p>
              <Button onClick={() => setIsAddingShortcut(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Location
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {shortcuts.map((shortcut: LocationShortcut) => {
              const IconComponent = getIconComponent(shortcut.icon);
              return (
                <Card key={shortcut.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <IconComponent className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{shortcut.label}</CardTitle>
                          <p className="text-sm text-gray-500 capitalize">{shortcut.name}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleEdit(shortcut)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleDelete(shortcut.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-600">{shortcut.address}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={!!editingShortcut} onOpenChange={(open) => !open && setEditingShortcut(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Location Shortcut</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., home, work, gym"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="edit-label">Display Label</Label>
                <Input
                  id="edit-label"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="e.g., Home, My Office, Downtown Gym"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="edit-address">Address</Label>
                <Input
                  id="edit-address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter full address"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="edit-icon">Icon</Label>
                <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((option) => {
                      const IconComponent = option.icon;
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4" />
                            {option.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={updateShortcutMutation.isPending}
                >
                  {updateShortcutMutation.isPending ? 'Updating...' : 'Update Location'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setEditingShortcut(null);
                    setFormData({ name: '', label: '', address: '', icon: 'MapPin' });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>
    </div>
  );
}
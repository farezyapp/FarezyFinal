import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Building, 
  Car, 
  Users, 
  PoundSterling,
  Phone,
  Mail,
  MapPin,
  Calendar,
  TrendingUp,
  Activity
} from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';

interface PartnerApplication {
  id: number;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  operatingArea: string;
  fleetSize: string;
  serviceTypes: string[];
  operatingHours: string;
  averageResponseTime: string;
  baseRate: string;
  perKmRate: string;
  description: string;
  website?: string;
  licenseNumber: string;
  insuranceProvider: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  adminNotes?: string;
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const [selectedApplication, setSelectedApplication] = useState<PartnerApplication | null>(null);
  const [reviewDialog, setReviewDialog] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  // Fetch partner applications
  const { data: applications, isLoading, refetch } = useQuery({
    queryKey: ['/api/partner-applications'],
    refetchInterval: 5000, // Refresh every 5 seconds for testing
  });

  // Approve/reject application mutation
  const reviewMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: number; status: 'approved' | 'rejected'; notes: string }) => {
      console.log('Reviewing application:', { id, status, notes });
      return await apiRequest(`/api/partner-applications/${id}/review`, 'PUT', { status, adminNotes: notes });
    },
    onSuccess: async (data) => {
      console.log('Review successful:', data);
      // Update the selected application immediately in state
      setSelectedApplication(data);
      
      // Force immediate refetch and invalidate cache
      await Promise.all([
        refetch(),
        queryClient.invalidateQueries({ queryKey: ['/api/partner-applications'] })
      ]);
      
      setReviewDialog(false);
      setSelectedApplication(null);
      setAdminNotes('');
      toast({
        title: "Application Updated",
        description: `Application ${data.status === 'approved' ? 'approved' : 'rejected'} successfully!`,
      });
    },
    onError: (error) => {
      console.error('Review error:', error);
      toast({
        title: "Error",
        description: `Failed to update application status: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="text-green-600 border-green-600"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-red-600 border-red-600"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const stats = applications && Array.isArray(applications) ? {
    total: applications.length,
    pending: applications.filter((app: PartnerApplication) => app.status === 'pending').length,
    approved: applications.filter((app: PartnerApplication) => app.status === 'approved').length,
    rejected: applications.filter((app: PartnerApplication) => app.status === 'rejected').length,
  } : { total: 0, pending: 0, approved: 0, rejected: 0 };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Taxi Partner Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage taxi company applications and monitor platform activity
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
                <Building className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Review</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Approved Partners</p>
                  <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Drivers</p>
                  <p className="text-2xl font-bold text-blue-600">0</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle>Partner Applications</CardTitle>
            <CardDescription>
              Review and manage taxi company applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full mx-auto"></div>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Loading applications...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Fleet Size</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications && Array.isArray(applications) ? applications.map((app: PartnerApplication) => (
                    <TableRow key={app.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{app.companyName}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{app.licenseNumber}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{app.contactName}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{app.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{app.city}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{app.operatingArea}</p>
                        </div>
                      </TableCell>
                      <TableCell>{app.fleetSize} vehicles</TableCell>
                      <TableCell>{getStatusBadge(app.status)}</TableCell>
                      <TableCell>{new Date(app.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedApplication(app);
                              setReviewDialog(true);
                              setAdminNotes(app.adminNotes || '');
                            }}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Review
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        No applications found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Review Dialog */}
        <Dialog open={reviewDialog} onOpenChange={setReviewDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Review Partner Application</DialogTitle>
              <DialogDescription>
                {selectedApplication?.companyName} - Application Details
              </DialogDescription>
            </DialogHeader>

            {selectedApplication && (
              <div className="space-y-6">
                {/* Company Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">Company Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{selectedApplication.companyName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span>{selectedApplication.address}, {selectedApplication.city}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{selectedApplication.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span>{selectedApplication.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">Operations</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-gray-500" />
                        <span>{selectedApplication.fleetSize} vehicles</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>{selectedApplication.operatingHours}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <PoundSterling className="w-4 h-4 text-gray-500" />
                        <span>£{selectedApplication.baseRate} base + £{selectedApplication.perKmRate}/km</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Service Details */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">Service Types</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplication.serviceTypes.map((service, index) => (
                      <Badge key={index} variant="secondary">{service}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Description</h3>
                  <p className="text-gray-600 dark:text-gray-400">{selectedApplication.description}</p>
                </div>

                {/* Legal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <Label className="font-medium">License Number</Label>
                    <p>{selectedApplication.licenseNumber}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Insurance Provider</Label>
                    <p>{selectedApplication.insuranceProvider}</p>
                  </div>
                </div>

                {/* Admin Notes */}
                <div>
                  <Label htmlFor="adminNotes" className="font-medium">Admin Notes</Label>
                  <Textarea
                    id="adminNotes"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes about this application..."
                    className="mt-2"
                  />
                </div>
              </div>
            )}

            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setReviewDialog(false)}
              >
                Cancel
              </Button>
              {selectedApplication?.status === 'pending' && (
                <>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      if (selectedApplication) {
                        reviewMutation.mutate({
                          id: selectedApplication.id,
                          status: 'rejected',
                          notes: adminNotes
                        });
                      }
                    }}
                    disabled={reviewMutation.isPending}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => {
                      if (selectedApplication) {
                        reviewMutation.mutate({
                          id: selectedApplication.id,
                          status: 'approved',
                          notes: adminNotes
                        });
                      }
                    }}
                    disabled={reviewMutation.isPending}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
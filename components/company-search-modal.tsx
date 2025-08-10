import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X, Car, Star, Clock, MapPin } from 'lucide-react';

interface CompanySearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompanySelect: (company: string) => void;
}

interface Company {
  id: string;
  name: string;
  logo: string;
  description: string;
  rating: number;
  estimatedTime: string;
  coverage: string;
  services: string[];
  available: boolean;
}

const companies: Company[] = [
  {
    id: 'uber',
    name: 'Uber',
    logo: '🚗',
    description: 'Global ride-sharing platform with various service options',
    rating: 4.2,
    estimatedTime: '3-5 min',
    coverage: 'Citywide',
    services: ['UberX', 'UberXL', 'Uber Comfort', 'Uber Black'],
    available: true
  },
  {
    id: 'lyft',
    name: 'Lyft',
    logo: '🚖',
    description: 'Premium ride-sharing service with friendly drivers',
    rating: 4.1,
    estimatedTime: '4-6 min',
    coverage: 'City center',
    services: ['Lyft', 'Lyft XL', 'Lyft Lux'],
    available: true
  },
  {
    id: 'bolt',
    name: 'Bolt',
    logo: '⚡',
    description: 'Fast and affordable rides across the city',
    rating: 4.0,
    estimatedTime: '2-4 min',
    coverage: 'Citywide',
    services: ['Bolt', 'Bolt XL', 'Bolt Comfort'],
    available: true
  },
  {
    id: 'local-taxi',
    name: 'Milton Keynes Taxis',
    logo: '🚕',
    description: 'Local taxi service with experienced drivers',
    rating: 4.3,
    estimatedTime: '5-8 min',
    coverage: 'Milton Keynes area',
    services: ['Standard', 'Executive', '8-seater'],
    available: true
  },
  {
    id: 'farezy-partners',
    name: 'Farezy Partners',
    logo: '🏢',
    description: 'Verified local taxi companies on the Farezy platform',
    rating: 4.4,
    estimatedTime: '3-6 min',
    coverage: 'Regional',
    services: ['Standard', 'Premium', 'Group'],
    available: true
  }
];

export function CompanySearchModal({ isOpen, onClose, onCompanySelect }: CompanySearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCompanyToggle = (companyId: string) => {
    setSelectedCompanies(prev => 
      prev.includes(companyId) 
        ? prev.filter(id => id !== companyId)
        : [...prev, companyId]
    );
  };

  const handleApplyFilter = () => {
    if (selectedCompanies.length > 0) {
      onCompanySelect(selectedCompanies.join(','));
    }
    onClose();
  };

  const handleClearAll = () => {
    setSelectedCompanies([]);
    setSearchTerm('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Companies
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search companies, services, or areas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {selectedCompanies.length > 0 && (
                <span>{selectedCompanies.length} companies selected</span>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={handleClearAll}>
              Clear All
            </Button>
          </div>

          {/* Companies List */}
          <div className="overflow-y-auto max-h-[400px] space-y-2">
            {filteredCompanies.map((company) => (
              <div
                key={company.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedCompanies.includes(company.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => handleCompanyToggle(company.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{company.logo}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{company.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{company.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{company.description}</p>
                    
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {company.estimatedTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {company.coverage}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {company.services.map((service) => (
                        <span
                          key={service}
                          className="px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-600"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedCompanies.includes(company.id)}
                      onChange={() => handleCompanyToggle(company.id)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleApplyFilter} 
              className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
            >
              Apply Filter ({selectedCompanies.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
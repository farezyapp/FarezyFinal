import React from 'react';
import { RideOption } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface ServiceCardProps {
  ride: RideOption;
  isSelected: boolean;
  onClick: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ ride, isSelected, onClick }) => {
  const tagBgColor = () => {
    switch (ride.tag?.type) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <Card 
      className={`mb-3 border rounded-xl cursor-pointer transition-colors ${isSelected ? 'service-card selected' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-3 flex items-center">
        {/* Service logo */}
        <div 
          className="w-14 h-14 rounded-lg flex items-center justify-center mr-3 flex-shrink-0"
          style={{ backgroundColor: ride.backgroundColor, color: ride.color }}
        >
          {ride.logo ? (
            <img src={ride.logo} alt={ride.serviceName} className="w-8 h-8" />
          ) : (
            <span className="text-sm font-semibold">{ride.serviceName}</span>
          )}
        </div>
        
        {/* Service details */}
        <div className="flex-1 flex flex-col min-w-0">
          <span className="font-medium">{ride.serviceType}</span>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>{ride.estimatedPickupTime} min away</span>
            <span className="mx-1">•</span>
            <span>{ride.estimatedTripTime} min ride</span>
          </div>
        </div>
        
        {/* Price and tag */}
        <div className="flex flex-col items-end">
          <span className="font-semibold">{formatCurrency(ride.price, ride.currency)}</span>
          {ride.tag && (
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${tagBgColor()}`}>
              {ride.tag.text}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;

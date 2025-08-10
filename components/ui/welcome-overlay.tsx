import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Search, Car } from 'lucide-react';

interface WelcomeOverlayProps {
  isVisible: boolean;
  onGetStarted: () => void;
}

const WelcomeOverlay: React.FC<WelcomeOverlayProps> = ({
  isVisible,
  onGetStarted
}) => {
  if (!isVisible) return null;
  
  return (
    <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40">
      <div className="bg-white p-6 rounded-xl mx-4 max-w-sm">
        <h3 className="text-lg font-semibold mb-2">Welcome to RideCompare!</h3>
        <p className="text-gray-600 mb-4">
          We compare prices across taxi and rideshare services to find you the best deal.
        </p>
        
        <div className="flex items-center mb-3">
          <div className="bg-primary bg-opacity-10 p-2 rounded-full mr-3">
            <MapPin className="text-primary h-5 w-5" />
          </div>
          <p className="text-sm">We need your location to show nearby options</p>
        </div>
        
        <div className="flex items-center mb-3">
          <div className="bg-primary bg-opacity-10 p-2 rounded-full mr-3">
            <Search className="text-primary h-5 w-5" />
          </div>
          <p className="text-sm">Search for your destination and compare prices</p>
        </div>
        
        <div className="flex items-center mb-5">
          <div className="bg-primary bg-opacity-10 p-2 rounded-full mr-3">
            <Car className="text-primary h-5 w-5" />
          </div>
          <p className="text-sm">Book directly with your preferred service</p>
        </div>
        
        <Button 
          className="w-full py-6"
          onClick={onGetStarted}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default WelcomeOverlay;

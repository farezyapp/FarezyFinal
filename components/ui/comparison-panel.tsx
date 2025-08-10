import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { DollarSign, Clock } from 'lucide-react';
import ServiceCard from '@/components/ui/service-card';
import { RideOption, SortMode } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface ComparisonPanelProps {
  rides: RideOption[];
  selectedRide: RideOption | null;
  onSelectRide: (ride: RideOption) => void;
  onBookRide: () => void;
  sortMode: SortMode;
  onChangeSortMode: (mode: SortMode) => void;
  isLoading: boolean;
}

const ComparisonPanel: React.FC<ComparisonPanelProps> = ({
  rides,
  selectedRide,
  onSelectRide,
  onBookRide,
  sortMode,
  onChangeSortMode,
  isLoading
}) => {
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  
  const togglePanelExpansion = () => {
    setIsPanelExpanded(!isPanelExpanded);
    
    if (panelRef.current) {
      if (!isPanelExpanded) {
        panelRef.current.style.height = '80vh';
      } else {
        panelRef.current.style.height = '';
      }
    }
  };
  
  return (
    <div 
      ref={panelRef}
      className="absolute bottom-0 left-0 right-0 slide-up-panel bg-white rounded-t-2xl shadow-lg z-10 max-h-screen-3/4 flex flex-col"
    >
      <div 
        className="pull-handle cursor-pointer" 
        onClick={togglePanelExpansion}
      ></div>
      
      <div className="p-4 overflow-hidden">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Available Rides</h2>
          <div className="flex gap-2">
            <Button
              variant={sortMode === 'price' ? 'secondary' : 'ghost'}
              size="sm"
              className="flex items-center text-sm rounded-full"
              onClick={() => onChangeSortMode('price')}
            >
              <DollarSign className="h-4 w-4 mr-1" />
              <span>Price</span>
            </Button>
            <Button
              variant={sortMode === 'time' ? 'secondary' : 'ghost'}
              size="sm"
              className="flex items-center text-sm rounded-full"
              onClick={() => onChangeSortMode('time')}
            >
              <Clock className="h-4 w-4 mr-1" />
              <span>Time</span>
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : rides.length > 0 ? (
          <div className="mt-4 overflow-y-auto max-h-80 pb-20">
            {rides.map((ride) => (
              <ServiceCard
                key={ride.id}
                ride={ride}
                isSelected={selectedRide?.id === ride.id}
                onClick={() => onSelectRide(ride)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-gray-500">
            <p>No rides available for this route.</p>
            <p className="text-sm mt-2">Try a different destination or try again later.</p>
          </div>
        )}
      </div>
      
      <div className="bg-white p-4 border-t sticky bottom-0 mt-auto">
        <Button
          className="w-full py-6 text-lg"
          disabled={!selectedRide || isLoading}
          onClick={onBookRide}
        >
          {selectedRide 
            ? `Book ${selectedRide.serviceType} • ${formatCurrency(selectedRide.price, selectedRide.currency)}`
            : 'Select a ride to book'}
        </Button>
      </div>
    </div>
  );
};

export default ComparisonPanel;

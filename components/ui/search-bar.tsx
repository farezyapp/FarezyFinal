import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Location } from '@/types';

interface SearchBarProps {
  currentLocation: Location | null;
  onSearchDestination: (address: string) => Promise<void>;
  isSearching: boolean;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  currentLocation,
  onSearchDestination,
  isSearching,
  className
}) => {
  const [destinationText, setDestinationText] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (destinationText.trim()) {
      onSearchDestination(destinationText);
    }
  };

  // Clear search field
  const clearSearch = () => {
    setDestinationText('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Focus input on component mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <Card className={`shadow-lg ${className || ''}`}>
      <CardContent className="p-3">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center">
            <Search className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Where to?"
              className="flex-1 border-none outline-none shadow-none h-8 p-0 text-base"
              value={destinationText}
              onChange={(e) => setDestinationText(e.target.value)}
              disabled={isSearching}
            />
            {destinationText && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mr-1 h-8 w-8 p-0"
                onClick={clearSearch}
              >
                <X className="h-4 w-4 text-primary" />
              </Button>
            )}
            <Button 
              type="submit" 
              variant="ghost" 
              size="sm" 
              className="h-8 p-0 text-primary font-medium"
              disabled={!destinationText.trim() || isSearching}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </form>
        
        {currentLocation && (
          <div className="mt-3 flex items-center">
            <div className="flex-shrink-0 mr-3">
              <div className="h-2 w-2 bg-primary rounded-full"></div>
            </div>
            <div className="text-sm text-gray-600 flex-1 truncate">
              Current Location: {currentLocation.address || 'Unknown location'}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchBar;

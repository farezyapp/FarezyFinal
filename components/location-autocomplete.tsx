import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MapPin, Clock, Home, Briefcase, Store, ShoppingBag, Utensils } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

// Global state for managing forceHidden per instance
const instanceStates = new Map<string, boolean>();

interface LocationSuggestion {
  id: string;
  mainText: string;
  secondaryText: string;
  fullAddress: string;
  type: 'address' | 'recent' | 'favorite';
  icon?: 'home' | 'work' | 'recent';
}

interface LocationAutocompleteProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onLocationSelect?: (location: LocationSuggestion) => void;
  className?: string;
  instanceId?: string;
}

export default function LocationAutocomplete({ 
  placeholder, 
  value, 
  onChange, 
  onLocationSelect,
  className = "",
  instanceId = "default"
}: LocationAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [justSelected, setJustSelected] = useState(false);
  const [lastSelectedValue, setLastSelectedValue] = useState('');
  
  // Instance-specific forceHidden state management
  const getForceHidden = () => instanceStates.get(instanceId) || false;
  const setForceHidden = (value: boolean) => {
    instanceStates.set(instanceId, value);
  };
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Fetch user's location shortcuts
  const { data: locationShortcuts = [] } = useQuery({
    queryKey: ['/api/location-shortcuts', 'user123', instanceId], // Mock user ID - in real app, get from auth
    enabled: showSuggestions && !getForceHidden() && !justSelected && value.length >= 3,
  });

  // Convert location shortcuts to suggestions
  const favoriteLocations: LocationSuggestion[] = Array.isArray(locationShortcuts) 
    ? locationShortcuts.map((shortcut: any) => ({
        id: `shortcut-${shortcut.id}`,
        mainText: shortcut.label,
        secondaryText: shortcut.address,
        fullAddress: shortcut.address,
        type: 'favorite' as const,
        icon: shortcut.icon === 'Home' ? 'home' as const : 
              shortcut.icon === 'Briefcase' ? 'work' as const : 
              'recent' as const,
      }))
    : [];

  // Get user's current location for better local suggestions
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied, using default location bias');
          // Use UK center as fallback for location bias
          setUserLocation({ lat: 52.0406224, lng: -0.7594171 });
        }
      );
    }
  }, []);

  // Fetch Google Places autocomplete suggestions
  const locationParam = userLocation ? `&lat=${userLocation.lat}&lng=${userLocation.lng}` : '';
  const { data: placeSuggestions = [], isLoading: isLoadingPlaces } = useQuery({
    queryKey: [`/api/places-autocomplete?input=${encodeURIComponent(value)}${locationParam}`, instanceId],
    enabled: value.length >= 3 && !getForceHidden() && !justSelected,
    retry: false,
  });

  // Convert Google Places to suggestions or use fallback for testing
  const addressSuggestions: LocationSuggestion[] = Array.isArray(placeSuggestions) && placeSuggestions.length > 0
    ? placeSuggestions.map((place: any, index: number) => {
        const isEstablishment = place.types?.includes('establishment') || 
                               place.types?.includes('store') ||
                               place.types?.includes('restaurant') ||
                               place.types?.includes('shopping_mall');
        
        return {
          id: `place-${index}`,
          mainText: place.structured_formatting?.main_text || place.description,
          secondaryText: place.structured_formatting?.secondary_text || '',
          fullAddress: place.description,
          type: isEstablishment ? 'recent' as const : 'address' as const,
        };
      })
    : value.length >= 3 ? [
        {
          id: `test-${instanceId}-1`,
          mainText: `${value} Street`,
          secondaryText: 'Milton Keynes, UK',
          fullAddress: `${value} Street, Milton Keynes, UK`,
          type: 'address' as const,
        },
        {
          id: `test-${instanceId}-2`,
          mainText: `${value} Road`,
          secondaryText: 'Bletchley, Milton Keynes, UK',
          fullAddress: `${value} Road, Bletchley, Milton Keynes, UK`,
          type: 'address' as const,
        }
      ] : [];

  // Combine all suggestions with user's favorites first
  const allSuggestions: LocationSuggestion[] = [...favoriteLocations, ...addressSuggestions];

  // Debug log
  React.useEffect(() => {
    if (value.length >= 3) {
      console.log('Place suggestions for:', value, placeSuggestions);
      console.log('Address suggestions:', addressSuggestions);
      console.log('All suggestions:', allSuggestions);
      console.log('Current suggestions state:', suggestions);
      console.log('Show suggestions:', showSuggestions);
    }
  }, [placeSuggestions, value, addressSuggestions, allSuggestions, suggestions, showSuggestions]);

  useEffect(() => {
    // Reset forceHidden if user starts typing a different value than the last selected
    if (lastSelectedValue && value !== lastSelectedValue && value.length > 0) {
      setForceHidden(false);
      setLastSelectedValue('');
    }
    
    // Don't show suggestions if we just selected one or forced hidden
    if (justSelected || getForceHidden()) {
      return;
    }
    
    // Don't show suggestions if the value is the default "(Current location)" format
    if (value.startsWith('(Current location)')) {
      setShowSuggestions(false);
      return;
    }
    
    if (value.length >= 3) {
      // Only show suggestions when user has typed 3+ characters
      setSuggestions(allSuggestions.slice(0, 6));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
    setSelectedIndex(-1);
  }, [value, allSuggestions, justSelected, instanceId, lastSelectedValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    // Set force hidden flag to completely prevent dropdown display
    setForceHidden(true);
    
    // Immediately and aggressively clear all dropdown state
    setShowSuggestions(false);
    setSuggestions([]);
    setSelectedIndex(-1);
    setJustSelected(true);
    setLastSelectedValue(suggestion.fullAddress);
    
    // Update input value
    onChange(suggestion.fullAddress);
    
    // Call location select callback
    if (onLocationSelect) {
      onLocationSelect(suggestion);
    }
    
    // Blur the input and force focus away
    if (inputRef.current) {
      inputRef.current.blur();
      // Remove focus completely
      if (document.activeElement && 'blur' in document.activeElement) {
        (document.activeElement as HTMLElement).blur();
      }
    }
    
    // Triple-check state clearing with multiple timeouts
    setTimeout(() => {
      setShowSuggestions(false);
      setSuggestions([]);
    }, 10);
    
    setTimeout(() => {
      setShowSuggestions(false);
      setSuggestions([]);
    }, 100);
    
    // Only reset flags when user starts typing something different
    setTimeout(() => {
      setJustSelected(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleInputFocus = () => {
    // Don't show suggestions if we just selected one or if forced hidden
    if (justSelected || getForceHidden()) {
      return;
    }
    // Don't show suggestions if the value is the default "(Current location)" format
    if (value.startsWith('(Current location)')) {
      return;
    }
    // Only show suggestions if there's text being typed
    if (value.length >= 1 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Force hide suggestions immediately if we just selected or forced hidden
    if (justSelected || getForceHidden()) {
      setShowSuggestions(false);
      setSuggestions([]);
      setSelectedIndex(-1);
      return;
    }
    // Delay hiding suggestions to allow for click events
    setTimeout(() => {
      if (!getForceHidden()) {
        setShowSuggestions(false);
        setSuggestions([]);
        setSelectedIndex(-1);
      }
    }, 200);
  };

  const getIcon = (suggestion: LocationSuggestion) => {
    // Check if it's a business establishment based on text content
    const text = suggestion.mainText.toLowerCase();
    const isBusiness = text.includes('mcdonald') || text.includes('zara') || 
                      text.includes('tesco') || text.includes('asda') ||
                      text.includes('starbucks') || text.includes('costa') ||
                      text.includes('kfc') || text.includes('burger king') ||
                      text.includes('subway') || text.includes('greggs') ||
                      text.includes('boots') || text.includes('primark');
    
    const isRestaurant = text.includes('restaurant') || text.includes('cafe') || 
                        text.includes('mcdonald') || text.includes('kfc') ||
                        text.includes('burger') || text.includes('pizza');
    
    const isShopping = text.includes('shop') || text.includes('store') || 
                      text.includes('mall') || text.includes('zara') ||
                      text.includes('primark') || text.includes('boots');

    switch (suggestion.icon) {
      case 'home':
        return <Home className="h-4 w-4 text-blue-600" />;
      case 'work':
        return <Briefcase className="h-4 w-4 text-green-600" />;
      case 'recent':
        if (isBusiness || isRestaurant) {
          return <Utensils className="h-4 w-4 text-orange-600" />;
        }
        if (isShopping) {
          return <Store className="h-4 w-4 text-purple-600" />;
        }
        return <Clock className="h-4 w-4 text-gray-500" />;
      default:
        if (isBusiness || isRestaurant) {
          return <Utensils className="h-4 w-4 text-orange-600" />;
        }
        if (isShopping) {
          return <Store className="h-4 w-4 text-purple-600" />;
        }
        return <MapPin className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        className={`${className} text-black`}
        autoComplete="off"
      />
      
      {!getForceHidden() && showSuggestions && suggestions.length > 0 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto bg-white border shadow-lg">
          <div className="py-2">
            {suggestions.map((suggestion, index) => (
              <div
                key={suggestion.id}
                className={`px-4 py-3 cursor-pointer transition-colors ${
                  index === selectedIndex 
                    ? 'bg-gray-100' 
                    : 'hover:bg-gray-50'
                }`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSuggestionClick(suggestion);
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {getIcon(suggestion)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-black truncate">
                      {suggestion.mainText}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {suggestion.secondaryText}
                    </p>
                  </div>
                  {suggestion.type === 'favorite' && (
                    <div className="flex-shrink-0">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {suggestion.icon === 'home' ? 'Home' : 'Work'}
                      </span>
                    </div>
                  )}

                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
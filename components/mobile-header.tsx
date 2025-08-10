import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Globe, Sun, Moon, User, MapPin, History, Car, Handshake, LogOut, Search } from 'lucide-react';
import { NotificationCenter } from '@/components/notification-center';
import { PWAInstallButton } from '@/components/pwa-install-button';
import { Link } from 'wouter';

interface MobileHeaderProps {
  selectedLanguage: string;
  isDarkMode: boolean;
  onLanguageClick: () => void;
  onDarkModeToggle: () => void;
  onLogin: () => void;
  onSignUp: () => void;
  onSearchClick?: () => void;
}

export function MobileHeader({
  selectedLanguage,
  isDarkMode,
  onLanguageClick,
  onDarkModeToggle,
  onLogin,
  onSignUp,
  onSearchClick
}: MobileHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check authentication status
    const authStatus = localStorage.getItem('isAuthenticated');
    const userData = localStorage.getItem('user');
    
    if (authStatus === 'true' && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    window.location.href = '/';
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-lg z-50 border-b border-orange-200/30 dark:border-orange-700/30">
      <div className="container mx-auto px-4 py-2 sm:py-3 flex items-center justify-between">
        {/* Simple Farezy Logo - Mobile */}
        <button 
          onClick={() => window.location.href = '/'}
          className="flex items-center hover:opacity-80 transition-opacity duration-200"
        >
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Farezy
          </h1>
        </button>
        


        {/* Mobile Right Side - Search, Language, Auth, and Menu */}
        <div className="md:hidden flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={onSearchClick} className="p-2 text-gray-600 hover:text-white hover:bg-blue-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-blue-600">
            <Search className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onLanguageClick} className="text-xs px-2 py-1 text-gray-600 hover:text-white hover:bg-green-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-green-600">
            <Globe className="h-3 w-3 mr-1" />
            {selectedLanguage}
          </Button>
          {isAuthenticated ? (
            <>
              <Link href="/profile">
                <Button variant="ghost" size="sm" className="p-2 text-gray-600 hover:text-white hover:bg-blue-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-blue-600">
                  <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full flex items-center justify-center">
                    <User className="h-3 w-3 text-white" />
                  </div>
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="p-2 text-gray-600 hover:text-white hover:bg-red-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-red-600">
                <LogOut className="h-3 w-3" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={onLogin} className="text-xs px-2 py-1 text-gray-600 hover:text-white hover:bg-blue-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-blue-600">
                Login
              </Button>
              <Button size="sm" onClick={onSignUp} className="button-gradient text-white text-xs px-2 py-1">
                Sign Up
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu - Fixed positioning above search bar */}
      {isMenuOpen && (
        <>
          {/* Backdrop overlay */}
          <div className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998]" onClick={() => setIsMenuOpen(false)} />
          
          {/* Menu content */}
          <div ref={menuRef} className="md:hidden fixed top-14 left-0 right-0 bg-white/95 backdrop-blur-xl border border-gray-200/50 shadow-2xl z-[9999] rounded-b-2xl mx-2">
            <div className="px-6 py-5 space-y-1">
              {/* User Actions - Only show if authenticated */}
              {isAuthenticated && (
                <>
                  <Button variant="ghost" className="w-full justify-start h-12 text-gray-700 hover:bg-blue-600 hover:text-white rounded-xl transition-all duration-200 group" onClick={() => {
                    window.location.href = '/profile';
                    setIsMenuOpen(false);
                  }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 group-hover:bg-blue-500 rounded-lg flex items-center justify-center transition-colors">
                        <User className="h-4 w-4 text-blue-600 group-hover:text-white transition-colors" />
                      </div>
                      <span className="font-medium text-gray-700 group-hover:text-white transition-colors">Profile</span>
                    </div>
                  </Button>
                  
                  <div className="border-t border-gray-200 my-4"></div>
                </>
              )}

              {/* Navigation Items */}
              <div className="space-y-1">


                <Button variant="ghost" className="w-full justify-start h-12 text-gray-700 hover:bg-blue-600 hover:text-white rounded-xl transition-all duration-200 group" onClick={() => {
                  window.location.href = '/about';
                  setIsMenuOpen(false);
                }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 group-hover:bg-blue-500 rounded-lg flex items-center justify-center transition-colors">
                      <Globe className="h-4 w-4 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    <span className="font-medium text-gray-700 group-hover:text-white transition-colors">About</span>
                  </div>
                </Button>
                

                
                <Button variant="ghost" className="w-full justify-start h-12 text-gray-700 hover:bg-green-600 hover:text-white rounded-xl transition-all duration-200 group" onClick={() => {
                  window.location.href = '/location-shortcuts';
                  setIsMenuOpen(false);
                }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 group-hover:bg-green-500 rounded-lg flex items-center justify-center transition-colors">
                      <MapPin className="h-4 w-4 text-green-600 group-hover:text-white transition-colors" />
                    </div>
                    <span className="font-medium text-gray-700 group-hover:text-white transition-colors">My Locations</span>
                  </div>
                </Button>
              </div>
              
              {/* Divider */}
              <div className="border-t border-gray-200 my-4"></div>
              
              {/* Partner Section */}
              <div className="space-y-1">
                <div className="px-4 py-2">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">For Business Partners</h3>
                </div>
                
                <Button variant="ghost" className="w-full justify-start h-12 text-gray-700 hover:bg-orange-600 hover:text-white rounded-xl transition-all duration-200 group" onClick={() => {
                  window.location.href = '/partner-signup';
                  setIsMenuOpen(false);
                }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 group-hover:bg-orange-500 rounded-lg flex items-center justify-center transition-colors">
                      <Car className="h-4 w-4 text-orange-600 group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-medium text-gray-700 group-hover:text-white transition-colors">Join as Taxi Partner</span>
                      <span className="text-xs text-gray-500 group-hover:text-orange-100 transition-colors">Register your taxi service</span>
                    </div>
                  </div>
                </Button>

                <Button variant="ghost" className="w-full justify-start h-12 text-gray-700 hover:bg-emerald-600 hover:text-white rounded-xl transition-all duration-200 group" onClick={() => {
                  window.location.href = '/driver-management';
                  setIsMenuOpen(false);
                }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-100 group-hover:bg-emerald-500 rounded-lg flex items-center justify-center transition-colors">
                      <User className="h-4 w-4 text-emerald-600 group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-medium text-gray-700 group-hover:text-white transition-colors">Driver Management</span>
                      <span className="text-xs text-gray-500 group-hover:text-emerald-100 transition-colors">Add drivers & vehicles</span>
                    </div>
                  </div>
                </Button>
              </div>
              
              {/* Divider */}
              <div className="border-t border-gray-200 my-4"></div>
              
              {/* Settings Section */}
              <div className="space-y-1">
                <div className="flex items-center justify-between h-12 px-4 rounded-xl bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      {isDarkMode ? <Sun className="h-4 w-4 text-gray-600" /> : <Moon className="h-4 w-4 text-gray-600" />}
                    </div>
                    <span className="font-medium text-gray-700">Dark Mode</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={onDarkModeToggle} className="h-8 w-8 rounded-lg">
                    <div className={`w-4 h-4 rounded-full transition-colors ${isDarkMode ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                  </Button>
                </div>
                
                <div className="px-4 py-2">
                  <NotificationCenter />
                </div>
                
                <div className="px-4 py-2">
                  <PWAInstallButton />
                </div>
              </div>
              
              {/* Divider */}
              <div className="border-t border-gray-200 my-4"></div>
              
              {/* Profile Section */}
              <Button variant="ghost" className="w-full justify-start h-12 text-gray-700 hover:bg-orange-50 hover:text-orange-700 rounded-xl transition-all duration-200" onClick={() => {
                window.location.href = '/profile';
                setIsMenuOpen(false);
              }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center shadow-sm">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium">Profile</span>
                </div>
              </Button>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
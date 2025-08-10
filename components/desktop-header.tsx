import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Globe, Moon, Sun, User, Car, Building, Shield, History, Settings, Info, UserPlus, LogOut, Search } from 'lucide-react';
import { type LanguageCode } from '@/lib/translations';
import { Link } from 'wouter';

interface DesktopHeaderProps {
  selectedLanguage: LanguageCode;
  isDarkMode: boolean;
  onLanguageClick: () => void;
  onDarkModeToggle: () => void;
  onLogin: () => void;
  onSignUp: () => void;
  onSearchClick?: () => void;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({
  selectedLanguage,
  isDarkMode,
  onLanguageClick,
  onDarkModeToggle,
  onLogin,
  onSignUp,
  onSearchClick,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

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

  return (
    <>
      {/* Desktop Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-orange-200/30 dark:border-orange-700/30 shadow-lg">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          {/* Simple Farezy Logo */}
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              Farezy
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Button variant="ghost" className="text-gray-700 hover:text-white hover:bg-orange-600 dark:text-gray-300 dark:hover:text-white dark:hover:bg-orange-600" onClick={() => window.location.href = '/'}>
              Home
            </Button>
            <Button variant="ghost" className="text-gray-700 hover:text-white hover:bg-orange-600 dark:text-gray-300 dark:hover:text-white dark:hover:bg-orange-600" onClick={() => window.location.href = '/ride-history'}>
              Ride History
            </Button>
            <Button variant="ghost" className="text-gray-700 hover:text-white hover:bg-orange-600 dark:text-gray-300 dark:hover:text-white dark:hover:bg-orange-600" onClick={() => window.location.href = '/partner-signup'}>
              <Building className="h-4 w-4 mr-2" />
              Join as Taxi Partner
            </Button>

            <Button variant="ghost" className="text-gray-700 hover:text-white hover:bg-blue-600 dark:text-gray-300 dark:hover:text-white dark:hover:bg-blue-600" onClick={() => window.location.href = '/about'}>
              About
            </Button>
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onSearchClick}
              className="text-gray-600 hover:text-white hover:bg-blue-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-blue-600"
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Language Selector */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onLanguageClick}
              className="text-gray-600 hover:text-white hover:bg-green-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-green-600"
            >
              <Globe className="h-4 w-4 mr-1" />
              {selectedLanguage}
            </Button>

            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onDarkModeToggle}
              className="text-gray-600 hover:text-white hover:bg-purple-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-purple-600"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {/* Auth Buttons - Desktop */}
            <div className="hidden lg:flex items-center space-x-2">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <Link href="/profile">
                    <Button variant="ghost" className="flex items-center space-x-2 text-gray-700 hover:text-white hover:bg-blue-600 dark:text-gray-300 dark:hover:text-white dark:hover:bg-blue-600">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <span>{user?.firstName || user?.name || 'Profile'}</span>
                    </Button>
                  </Link>
                  <Button variant="ghost" onClick={handleLogout} className="text-gray-600 hover:text-white hover:bg-red-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-red-600">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <Button variant="ghost" onClick={onLogin} className="text-gray-700 hover:text-white hover:bg-blue-600 dark:text-gray-300 dark:hover:text-white dark:hover:bg-blue-600">
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                  <Button onClick={onSignUp} className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Sign Up
                  </Button>
                </>
              )}
            </div>

            {/* Mobile/Tablet Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile/Tablet Dropdown Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-16 left-0 right-0 bg-white/98 backdrop-blur-sm border-b border-gray-200 shadow-lg animate-slide-down">
            <div className="container mx-auto px-6 py-4 space-y-1">
              {/* Navigation Links */}
              <Button variant="ghost" className="w-full justify-start h-12 text-gray-700 hover:bg-orange-50 hover:text-orange-700 rounded-xl transition-all duration-200" onClick={() => {
                window.location.href = '/';
                setIsMenuOpen(false);
              }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Car className="h-4 w-4 text-orange-600" />
                  </div>
                  <span className="font-medium">Home</span>
                </div>
              </Button>



              <Button variant="ghost" className="w-full justify-start h-12 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-xl transition-all duration-200" onClick={() => {
                window.location.href = '/partner-signup';
                setIsMenuOpen(false);
              }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Building className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="font-medium">Partner with Us</span>
                </div>
              </Button>



              <Button variant="ghost" className="w-full justify-start h-12 text-gray-700 hover:bg-gray-50 hover:text-gray-700 rounded-xl transition-all duration-200" onClick={() => {
                window.location.href = '/about';
                setIsMenuOpen(false);
              }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Info className="h-4 w-4 text-gray-600" />
                  </div>
                  <span className="font-medium">About</span>
                </div>
              </Button>

              {/* Divider */}
              <div className="border-t border-gray-200 my-3"></div>

              {/* Auth Buttons - Mobile */}
              {isAuthenticated ? (
                <>
                  <Button variant="ghost" className="w-full justify-start h-12 text-gray-700 hover:bg-gray-50 hover:text-gray-700 rounded-xl transition-all duration-200" onClick={() => {
                    window.location.href = '/profile';
                    setIsMenuOpen(false);
                  }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-lg flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium">{user?.firstName || user?.name || 'Profile'}</span>
                    </div>
                  </Button>

                  <Button variant="ghost" className="w-full justify-start h-12 text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all duration-200" onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <LogOut className="h-4 w-4 text-red-600" />
                      </div>
                      <span className="font-medium">Sign Out</span>
                    </div>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" className="w-full justify-start h-12 text-gray-700 hover:bg-gray-50 hover:text-gray-700 rounded-xl transition-all duration-200" onClick={() => {
                    onLogin();
                    setIsMenuOpen(false);
                  }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <span className="font-medium">Sign In</span>
                    </div>
                  </Button>

                  <Button variant="ghost" className="w-full justify-start h-12 text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 rounded-xl transition-all duration-200" onClick={() => {
                    onSignUp();
                    setIsMenuOpen(false);
                  }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <UserPlus className="h-4 w-4 text-yellow-600" />
                      </div>
                      <span className="font-medium">Sign Up</span>
                    </div>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};
import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Car, Home, Search } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center space-x-2 mb-8">
          <Car className="h-8 w-8 text-orange-500" />
          <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
            Farezy
          </span>
        </Link>

        {/* 404 Image/Icon */}
        <div className="mb-8">
          <div className="text-8xl font-bold text-orange-200 mb-4">404</div>
          <Search className="h-16 w-16 text-orange-300 mx-auto" />
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Sorry, we couldn't find the page you're looking for. 
          It might have been moved, deleted, or you entered the wrong URL.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link href="/">
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
              <Home className="h-4 w-4 mr-2" />
              Go Back Home
            </Button>
          </Link>
          
          <Link href="/about">
            <Button variant="outline" className="w-full">
              Learn More About Farezy
            </Button>
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-sm text-gray-500">
          <p>
            Need help? <Link href="/about" className="text-orange-500 hover:text-orange-600">Contact us</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
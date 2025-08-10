import React from 'react';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isVisible, 
  message = 'Finding the best rides...' 
}) => {
  if (!isVisible) return null;
  
  return (
    <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-30">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-dark font-medium">{message}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;

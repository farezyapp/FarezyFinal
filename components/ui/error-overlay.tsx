import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ErrorOverlayProps {
  isVisible: boolean;
  title?: string;
  message?: string;
  onDismiss: () => void;
  onRetry: () => void;
}

const ErrorOverlay: React.FC<ErrorOverlayProps> = ({
  isVisible,
  title = 'Service Unavailable',
  message = 'We couldn\'t connect to some ride services. Your results might be incomplete.',
  onDismiss,
  onRetry
}) => {
  if (!isVisible) return null;
  
  return (
    <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-30">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm text-center">
        <div className="text-destructive text-4xl mb-3 flex justify-center">
          <AlertTriangle className="h-10 w-10" />
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{message}</p>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onDismiss}
          >
            Dismiss
          </Button>
          <Button
            className="flex-1"
            onClick={onRetry}
          >
            Retry
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorOverlay;

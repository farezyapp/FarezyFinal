import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface SmartNotification {
  id: string;
  type: 'ride_update' | 'price_alert' | 'driver_arrival' | 'safety_check' | 'booking_confirmed';
  title: string;
  message: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actions?: {
    label: string;
    action: () => void;
  }[];
  data?: Record<string, any>;
}

interface NotificationPermission {
  granted: boolean;
  denied: boolean;
  default: boolean;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const [permission, setPermission] = useState<NotificationPermission>({
    granted: false,
    denied: false,
    default: true
  });
  const { toast } = useToast();

  useEffect(() => {
    if ('Notification' in window) {
      const currentPermission = Notification.permission;
      setPermission({
        granted: currentPermission === 'granted',
        denied: currentPermission === 'denied',
        default: currentPermission === 'default'
      });
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      toast({
        title: "Notifications not supported",
        description: "Your browser doesn't support notifications",
        variant: "destructive"
      });
      return false;
    }

    const result = await Notification.requestPermission();
    setPermission({
      granted: result === 'granted',
      denied: result === 'denied',
      default: result === 'default'
    });

    return result === 'granted';
  }, [toast]);

  const sendNotification = useCallback((notification: Omit<SmartNotification, 'id' | 'timestamp'>) => {
    const newNotification: SmartNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date()
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]); // Keep last 50

    // Show toast notification
    const toastVariant = notification.priority === 'urgent' ? 'destructive' : 'default';
    toast({
      title: notification.title,
      description: notification.message,
      variant: toastVariant
    });

    // Send browser notification if permission granted
    if (permission.granted && 'Notification' in window) {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.type,
        requireInteraction: notification.priority === 'urgent'
      });

      browserNotification.onclick = () => {
        window.focus();
        browserNotification.close();
      };
    }

    return newNotification.id;
  }, [permission.granted, toast]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Smart notification handlers

  const notifyPriceAlert = useCallback((route: string, oldPrice: number, newPrice: number) => {
    const savings = oldPrice - newPrice;
    sendNotification({
      type: 'price_alert',
      title: 'Price Drop Alert',
      message: `Price for ${route} dropped by $${savings.toFixed(2)}`,
      priority: 'medium',
      data: { route, oldPrice, newPrice, savings }
    });
  }, [sendNotification]);

  const notifyDriverArrival = useCallback((estimatedMinutes: number) => {
    sendNotification({
      type: 'driver_arrival',
      title: 'Driver Arriving Soon',
      message: `Your driver will arrive in approximately ${estimatedMinutes} minutes`,
      priority: 'high',
      data: { estimatedMinutes }
    });
  }, [sendNotification]);

  const notifySafetyCheck = useCallback(() => {
    sendNotification({
      type: 'safety_check',
      title: '🛡️ Safety Check-in',
      message: 'How is your ride going? Tap to confirm you\'re safe and enjoying your journey',
      priority: 'high',
      actions: [
        {
          label: 'I\'m Safe & Good',
          action: () => {
            toast({
              title: "✅ Safety confirmed",
              description: "Thank you for checking in. Have a great ride!"
            });
          }
        }
      ]
    });
  }, [sendNotification, toast]);

  const notifyBookingConfirmed = useCallback((bookingDetails: any) => {
    sendNotification({
      type: 'booking_confirmed',
      title: 'Booking Confirmed',
      message: `Your ${bookingDetails.serviceName} ride has been booked`,
      priority: 'medium',
      data: bookingDetails
    });
  }, [sendNotification]);

  return {
    notifications,
    permission,
    requestPermission,
    sendNotification,
    removeNotification,
    clearAllNotifications,
    // Smart notification methods
    notifyPriceAlert,
    notifyDriverArrival,
    notifySafetyCheck,
    notifyBookingConfirmed
  };
};
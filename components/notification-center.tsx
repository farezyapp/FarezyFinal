import { useState } from 'react';
import { Bell, X, CheckCircle, AlertTriangle, Info, Clock, Shield } from 'lucide-react';
import { useNotifications, SmartNotification } from '@/hooks/use-notifications';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';

const getNotificationIcon = (type: SmartNotification['type']) => {
  switch (type) {
    case 'booking_confirmed':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'driver_arrival':
      return <Clock className="w-5 h-5 text-blue-500" />;
    case 'safety_check':
      return <Shield className="w-5 h-5 text-green-500" />;
    case 'price_alert':
      return <Info className="w-5 h-5 text-purple-500" />;
    default:
      return <Bell className="w-5 h-5 text-gray-500" />;
  }
};

const getPriorityColor = (priority: SmartNotification['priority'], type: SmartNotification['type']) => {
  // Special styling for safety check-in notifications
  if (type === 'safety_check') {
    return 'border-l-green-500 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 shadow-lg';
  }
  
  switch (priority) {
    case 'urgent':
      return 'border-l-red-500 bg-red-50 dark:bg-red-900/20';
    case 'high':
      return 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/20';
    case 'medium':
      return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20';
    default:
      return 'border-l-gray-500 bg-gray-50 dark:bg-gray-900/20';
  }
};

export function NotificationCenter() {
  const { notifications, removeNotification, clearAllNotifications, permission, requestPermission } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.length;

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover-lift">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs animate-pulse"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:w-96">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllNotifications}
                className="text-xs"
              >
                Clear all
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>

        {!permission.granted && permission.default && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start space-x-3">
              <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Enable Notifications
                </h4>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  Get real-time updates about your rides, price alerts, and safety check-ins.
                </p>
                <Button
                  size="sm"
                  onClick={requestPermission}
                  className="mt-2 bg-blue-600 hover:bg-blue-700"
                >
                  Enable
                </Button>
              </div>
            </div>
          </div>
        )}

        <ScrollArea className="h-[calc(100vh-120px)] mt-4">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <Bell className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No notifications yet</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                We'll notify you about ride updates and important information
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border-l-4 hover-lift animate-slide-in-right ${getPriorityColor(notification.priority, notification.type)}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-sm font-medium ${notification.type === 'safety_check' ? 'text-green-900 dark:text-green-100' : 'text-gray-900 dark:text-gray-100'}`}>
                          {notification.title}
                        </h4>
                        <p className={`text-sm mt-1 ${notification.type === 'safety_check' ? 'text-green-700 dark:text-green-300 font-medium' : 'text-gray-600 dark:text-gray-300'}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          {formatTimeAgo(notification.timestamp)}
                        </p>
                        
                        {notification.actions && (
                          <div className="flex gap-2 mt-3">
                            {notification.actions.map((action, actionIndex) => (
                              <Button
                                key={actionIndex}
                                size="sm"
                                variant={notification.type === 'safety_check' ? 'default' : 'outline'}
                                className={notification.type === 'safety_check' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
                                onClick={() => {
                                  action.action();
                                  removeNotification(notification.id);
                                }}
                              >
                                {notification.type === 'safety_check' && <Shield className="w-4 h-4 mr-1" />}
                                {action.label}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeNotification(notification.id)}
                      className="ml-2 h-6 w-6 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
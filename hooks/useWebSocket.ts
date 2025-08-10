import { useEffect, useRef, useState } from 'react';

interface WebSocketMessage {
  type: string;
  data: any;
}

interface UseWebSocketProps {
  url: string;
  userId?: number;
  userType: 'passenger' | 'driver';
  onMessage?: (message: WebSocketMessage) => void;
}

export function useWebSocket({ url, userId, userType, onMessage }: UseWebSocketProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = () => {
    if (!url) {
      console.log('No WebSocket URL provided');
      return;
    }
    
    try {
      console.log('🔄 Attempting WebSocket connection to:', url);
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('✅ WebSocket connected to:', url);
        setIsConnected(true);
        setConnectionError(null);
        
        // Register user when connection opens
        if (userId) {
          const registerMessage = {
            type: 'register',
            data: {
              userType,
              userId
            }
          };
          console.log('📝 Registering user:', registerMessage);
          ws.send(JSON.stringify(registerMessage));
        }
      };

      ws.onclose = () => {
        console.log('❌ WebSocket disconnected from:', url);
        setIsConnected(false);
        
        // Attempt to reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('🔄 Attempting to reconnect to:', url);
          connect();
        }, 3000);
      };

      ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        setConnectionError(`Connection failed to ${url}`);
        setIsConnected(false);
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('WebSocket message received:', message);
          onMessage?.(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      setConnectionError('Failed to create connection');
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    setIsConnected(false);
  };

  const sendMessage = (message: WebSocketMessage) => {
    if (wsRef.current && isConnected) {
      const messageString = JSON.stringify(message);
      console.log('📤 Sending WebSocket message:', messageString);
      wsRef.current.send(messageString);
      return true;
    }
    console.warn('WebSocket not connected, cannot send message');
    return false;
  };

  const sendRideRequest = (requestData: {
    passengerId: number;
    passengerName: string;
    pickupAddress: string;
    destinationAddress: string;
    estimatedFare: number;
    distance: number;
  }) => {
    // Send booking_request message to match driver app expectations
    const message = {
      type: 'booking_request',
      data: {
        passengerId: requestData.passengerId,
        passengerName: requestData.passengerName,
        passengerPhone: '+44',
        pickupAddress: requestData.pickupAddress,
        destinationAddress: requestData.destinationAddress,
        estimatedFare: requestData.estimatedFare,
        distance: requestData.distance,
        serviceType: 'standard',
        timestamp: new Date().toISOString()
      }
    };
    console.log('🚗 Sending booking_request to driver app:', message);
    return sendMessage(message);
  };

  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [url, userId, userType]);

  return {
    isConnected,
    connectionError,
    sendMessage,
    sendRideRequest,
    disconnect
  };
}
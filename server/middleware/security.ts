import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import validator from 'validator';
import { Request, Response, NextFunction } from 'express';

// Rate limiting configurations
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 authentication attempts per windowMs
  message: {
    error: 'Too many login attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const strictRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs for sensitive endpoints
  message: {
    error: 'Too many requests to this endpoint, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Security headers middleware
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://maps.googleapis.com", "wss:", "ws:"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Disable for Google Maps
});

// Input sanitization middleware
export const sanitizeStringInputs = (req: Request, res: Response, next: NextFunction) => {
  const sanitizeObject = (obj: any): any => {
    if (typeof obj === 'string') {
      // Remove potentially dangerous characters and normalize
      return validator.escape(obj.trim());
    }
    
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }
    
    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitizeObject(value);
      }
      return sanitized;
    }
    
    return obj;
  };

  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  
  next();
};

// Email validation middleware
export const validateEmail = (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  
  if (email && !validator.isEmail(email)) {
    return res.status(400).json({
      error: 'Invalid email format',
    });
  }
  
  next();
};

// WebSocket message validation
export const validateWebSocketMessage = (message: string): { isValid: boolean; data?: any; error?: string } => {
  try {
    const data = JSON.parse(message);
    
    // Validate required fields based on message type
    if (!data.type || typeof data.type !== 'string') {
      return { isValid: false, error: 'Message type is required' };
    }
    
    // Sanitize string fields
    const sanitizedData = sanitizeWebSocketData(data);
    
    return { isValid: true, data: sanitizedData };
  } catch (error) {
    return { isValid: false, error: 'Invalid JSON format' };
  }
};

const sanitizeWebSocketData = (data: any): any => {
  if (typeof data === 'string') {
    return validator.escape(data.trim());
  }
  
  if (Array.isArray(data)) {
    return data.map(sanitizeWebSocketData);
  }
  
  if (data && typeof data === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeWebSocketData(value);
    }
    return sanitized;
  }
  
  return data;
};

// Coordinate validation for location endpoints
export const validateCoordinates = (req: Request, res: Response, next: NextFunction) => {
  const { lat, lng } = req.query;
  
  if (lat && lng) {
    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);
    
    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ error: 'Invalid coordinate format' });
    }
    
    if (latitude < -90 || latitude > 90) {
      return res.status(400).json({ error: 'Latitude must be between -90 and 90' });
    }
    
    if (longitude < -180 || longitude > 180) {
      return res.status(400).json({ error: 'Longitude must be between -180 and 180' });
    }
  }
  
  next();
};
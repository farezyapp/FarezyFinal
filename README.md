# Farezy - Ride Comparison App 🚗

A comprehensive Progressive Web App (PWA) for real-time ride price comparisons across multiple services (Uber, Bolt, local taxis).

## 🌟 **LIVE APPLICATION RUNNING**
**Current Status**: ✅ **FULLY OPERATIONAL** on Replit
- Real-time driver connections active
- Google Maps integration working
- Database and authentication system live
- WebSocket communication established
- PWA features enabled

## Features

- **Real-time Price Comparison**: Compare prices from multiple ride services
- **GPS Integration**: Automatic location detection and route optimization
- **Smart Notifications**: Real-time updates on ride status and pricing
- **PWA Support**: Install as mobile app with offline capabilities
- **Driver Network**: Direct booking with local taxi companies
- **Multi-language Support**: Accessible in multiple languages
- **Real-time Tracking**: Live GPS tracking for drivers and rides

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite build tool
- Shadcn/ui components (Radix UI)
- Tailwind CSS
- TanStack Query for state management
- Wouter for routing
- Google Maps integration

### Backend
- Node.js with Express
- TypeScript with ES modules
- Drizzle ORM with PostgreSQL
- WebSocket for real-time communication
- JWT authentication
- SendGrid for email services

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Google Maps API key

### Environment Variables
Create a `.env` file with:
```
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret_key
SENDGRID_API_KEY=your_sendgrid_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Installation
1. Clone the repository
```bash
git clone https://github.com/yourusername/farezy.git
cd farezy
```

2. Install dependencies
```bash
npm install
```

3. Set up the database
```bash
npm run db:push
```

4. Start the development server
```bash
npm run dev
```

The app will be available at `http://localhost:5000`

## Project Structure
```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and configs
├── server/                # Express backend
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   └── storage.ts         # Database operations
├── shared/                # Shared types and schemas
└── public/               # Static assets
```

## Features in Detail

### Real-time Booking System
- Direct WebSocket communication with driver app
- Passenger registration and ride requests
- End-to-end booking flow

### Partner/Driver Systems
- Admin dashboard for taxi company approvals
- Real-time booking management
- Competitive quoting system
- Driver assignment and vehicle management
- Multi-step driver registration
- Live GPS tracking

### Authentication
- Comprehensive login/signup system
- Email verification with resend options
- Profile management
- Secure session handling

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/resend-verification` - Resend verification email

### Rides
- `GET /api/rides/search` - Search for rides
- `POST /api/rides/book` - Book a ride
- `GET /api/rides/history` - Get booking history

### Location Services
- `GET /api/location/reverse-geocode` - Reverse geocoding
- `GET /api/places-autocomplete` - Place suggestions

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License
This project is licensed under the MIT License.

## Support
For support, email support@farezy.com or create an issue in this repository.
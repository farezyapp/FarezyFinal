# Farezy - Ride Comparison App

## Overview
Farezy is a comprehensive Progressive Web App (PWA) designed to provide real-time ride price comparisons across multiple services (Uber, Bolt, local taxis). Its main purpose is to help users find the best ride options by offering real-time pricing, GPS tracking, smart notifications, and a mobile-first design. The project aims to become a leading platform for ride-hailing comparisons, offering convenience and cost savings to users while providing a robust platform for ride service providers.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: Shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query (server state), React hooks (local state)
- **Routing**: Wouter
- **PWA**: Service worker for offline capabilities and install prompts
- **UI/UX Decisions**: Mobile-first responsive design with touch-optimized elements. Clean, simple Farezy branding with professional typography, improved color contrast for accessibility, enhanced visual hierarchy with orange-to-yellow gradients, modern loading states and animations, and consistent styling across all components and legal pages.

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL
- **API Design**: RESTful endpoints with comprehensive error handling.
- **Technical Implementations**:
    - **Database Layer**: Type-safe schema definitions, automated migrations. Tables for locations, services, cached rides, search/booking history, user profiles, emergency contacts, ride tracking, analytics, location shortcuts, partner applications, drivers, vehicles, and ride requests.
    - **API Layer**: Location services (geocoding, reverse geocoding), ride price comparison, booking endpoints, AI booking integration, and real-time updates for driver tracking and ride status.
    - **Frontend Services**: GPS integration, smart notification system, PWA management, multi-language support.
    - **Map Integration**: Google Maps for mapping, real-time tracking, and route visualization, with offline map caching.
    - **Data Flow**: Acquires user location, processes destination selection, fetches prices in parallel from multiple services, caches results, provides real-time updates via WebSockets, and streamlines the booking process.
    - **Security**: Secure session management, API rate limiting, Zod schema validation for input, HTTPS requirement for PWA features.
    - **Real-time Booking System**: Direct WebSocket communication with a dedicated driver app, passenger registration, real-time ride requests to drivers, and end-to-end booking flow.
    - **Partner/Driver Systems**: Admin dashboard for approving taxi companies, real-time booking management for companies, competitive quoting system, driver assignment, vehicle management, multi-step driver registration, live GPS tracking for drivers, and a "Become a Driver" call-to-action.
    - **Authentication**: Comprehensive login/signup pages, profile management, logout functionality, email verification with resend options, and simplified two-step signup process.
    - **Legal Pages**: Comprehensive FAQ, Terms of Service, Privacy Policy, Cookie Policy, Accessibility Statement, and Licenses pages, all designed professionally and responsively.

## External Dependencies

- **Google Maps API**: Geocoding, directions, map display, and real-time road-following logic for driver tracking.
- **PostgreSQL**: Primary database.
- **Farezy Driver App**: Dedicated mobile application for drivers, communicating via WebSockets.
- **SendGrid**: For email notifications and communications (e.g., partner application notifications). Secured via SENDGRID_API_KEY environment variable.
- **Anthropic AI**: For AI-powered booking assistance (optional integration).
- **Stripe**: For payment processing (optional integration).

## Recent Changes

### Security Fixes (2025-01-09)
- **SendGrid API Key Security**: Removed hardcoded API keys from `server/test-sendgrid.js` and `server/services/email.ts`
- **Environment Variable Security**: All SendGrid operations now require SENDGRID_API_KEY environment variable
- **Test File Security**: Updated test file to fail gracefully when environment variable is missing
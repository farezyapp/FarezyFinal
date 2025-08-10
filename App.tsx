import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import SignUp from "@/pages/signup";
import Login from "@/pages/login";
import About from "@/pages/about";
import RideHistory from "@/pages/ride-history";
import Profile from "@/pages/profile";
import Tracking from "@/pages/tracking";
import SharedTracking from "@/pages/shared-tracking";
import LocationShortcuts from "@/pages/location-shortcuts";
import AIBooking from "@/pages/ai-booking";
import PartnerSignup from "@/pages/partner-signup";
import PartnerSuccess from "@/pages/partner-success";
import PartnerPortal from "@/pages/partner-portal";
import AdminDashboard from "@/pages/admin-dashboard";
import SecretAdmin from "@/pages/secret-admin";
import BookingManagement from "@/pages/booking-management";
import { BookRide } from "@/pages/book-ride";
import DriverManagement from "@/pages/driver-management";
import DriverOnboard from "@/pages/driver-onboard";
import DriverDashboard from "@/pages/driver-dashboard";
import RideComparison from "@/pages/ride-comparison";
import VerifyEmail from "@/pages/verify-email";
import ResendVerification from "@/pages/resend-verification";
import FAQ from "@/pages/faq";
import TermsOfService from "@/pages/terms-of-service";
import PrivacyPolicy from "@/pages/privacy-policy";
import CookiePolicy from "@/pages/cookie-policy";
import AccessibilityPage from "@/pages/accessibility";
import LicensesPage from "@/pages/licenses";
import HelpCenter from "@/pages/help-center";
import ContactUs from "@/pages/contact-us";
import SafetyGuidelines from "@/pages/safety-guidelines";
import ReportIssue from "@/pages/report-issue";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/signup" component={SignUp} />
      <Route path="/login" component={Login} />
      <Route path="/about" component={About} />
      <Route path="/ride-history" component={RideHistory} />
      <Route path="/profile" component={Profile} />
      <Route path="/location-shortcuts" component={LocationShortcuts} />
      <Route path="/ai-booking" component={AIBooking} />
      <Route path="/book-ride" component={BookRide} />
      <Route path="/partner-signup" component={PartnerSignup} />
      <Route path="/partner-success" component={PartnerSuccess} />
      <Route path="/partner-portal" component={PartnerPortal} />
      <Route path="/secret-admin-dashboard-xyz789" component={SecretAdmin} />
      <Route path="/booking-management" component={BookingManagement} />
      <Route path="/driver-management" component={DriverManagement} />
      <Route path="/driver-onboard" component={DriverOnboard} />
      <Route path="/driver-dashboard" component={DriverDashboard} />
      <Route path="/ride-comparison" component={RideComparison} />
      <Route path="/tracking" component={Tracking} />
      <Route path="/shared-tracking/:rideId" component={SharedTracking} />
      <Route path="/verify-email" component={VerifyEmail} />
      <Route path="/resend-verification" component={ResendVerification} />
      <Route path="/faq" component={FAQ} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/cookie-policy" component={CookiePolicy} />
      <Route path="/accessibility" component={AccessibilityPage} />
      <Route path="/licenses" component={LicensesPage} />
      <Route path="/help-center" component={HelpCenter} />
      <Route path="/contact-us" component={ContactUs} />
      <Route path="/safety-guidelines" component={SafetyGuidelines} />
      <Route path="/report-issue" component={ReportIssue} />
      <Route component={NotFound} />
    </Switch>
  );
}

import React from 'react';
import Toaster from './components/ui/toaster';

function App() {
  return (
    <div>
      <h1>Welcome to Farezy</h1>
      <Toaster />
    </div>
  );
}

export default App;


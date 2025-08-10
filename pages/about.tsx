import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Car, 
  Shield, 
  Clock, 
  MapPin, 
  Users, 
  TrendingUp,
  Award,
  Heart,
  Globe,
  Smartphone,
  CheckCircle,
  User
} from 'lucide-react';
import { Link } from 'wouter';

const About: React.FC = () => {
  const features = [
    {
      icon: <Car className="h-8 w-8 text-orange-500" />,
      title: "Multi-Service Comparison",
      description: "Compare prices across Uber, Bolt, local taxis, and more in real-time"
    },
    {
      icon: <Clock className="h-8 w-8 text-blue-500" />,
      title: "Real-Time Updates",
      description: "Live pricing, arrival times, and driver tracking for all services"
    },
    {
      icon: <Shield className="h-8 w-8 text-green-500" />,
      title: "Safety First",
      description: "Verified drivers, emergency contacts, and ride sharing features"
    },
    {
      icon: <MapPin className="h-8 w-8 text-purple-500" />,
      title: "Smart Location",
      description: "AI-powered location suggestions and saved shortcuts"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-red-500" />,
      title: "Price Analytics",
      description: "Historical price trends and optimal booking time recommendations"
    },
    {
      icon: <Smartphone className="h-8 w-8 text-indigo-500" />,
      title: "PWA Experience",
      description: "Works offline with native app-like experience on any device"
    }
  ];

  const stats = [
    { number: "50,000+", label: "Active Users" },
    { number: "£2.5M", label: "Saved on Rides" },
    { number: "15+", label: "Partner Services" },
    { number: "98%", label: "User Satisfaction" }
  ];

  const team = [
    {
      name: "Cian",
      role: "Co-Founder",
      bio: "Visionary leader driving innovation in urban mobility solutions"
    },
    {
      name: "Ben",
      role: "Co-Founder", 
      bio: "Technology expert focused on building scalable transportation platforms"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-orange-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                Farezy
              </span>
            </Link>
            <Link href="/">
              <Button size="sm" variant="ghost" className="text-gray-600 hover:text-gray-900">←</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge className="mb-4 bg-orange-100 text-orange-800 hover:bg-orange-200">
            About Farezy
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-black">
            Revolutionizing Urban Transport
          </h1>
          <p className="text-xl text-black mb-8 leading-relaxed">
            We're on a mission to make transportation more accessible, affordable, and efficient for everyone. 
            By connecting you with the best ride options available, we help you save time and money while 
            traveling smarter.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">
                  {stat.number}
                </div>
                <div className="text-black">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
              Why Choose Farezy?
            </h2>
            <p className="text-xl text-black max-w-2xl mx-auto">
              We've built the most comprehensive ride comparison platform with features that matter to you
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl text-black">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-black leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-orange-500 to-yellow-500">
        <div className="container mx-auto max-w-4xl text-center">
          <Heart className="h-16 w-16 text-white mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Our Mission
          </h2>
          <p className="text-xl text-white leading-relaxed">
            To create a world where getting from point A to point B is effortless, affordable, and transparent. 
            We believe everyone deserves access to reliable transportation options, and we're committed to 
            making that a reality through innovative technology and strong partnerships.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
              Meet Our Team
            </h2>
            <p className="text-xl text-black">
              Passionate experts dedicated to transforming urban mobility
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <User className="h-12 w-12 text-white" />
                  </div>
                  <CardTitle className="text-xl text-black">{member.name}</CardTitle>
                  <CardDescription className="text-orange-500 font-medium">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-black">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
              Our Values
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <Award className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-black">Excellence</h3>
              <p className="text-black">Delivering the highest quality experience in every interaction</p>
            </div>
            <div className="text-center">
              <Shield className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-black">Trust</h3>
              <p className="text-black">Building reliable relationships with users and partners</p>
            </div>
            <div className="text-center">
              <Globe className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-black">Innovation</h3>
              <p className="text-black">Continuously improving through cutting-edge technology</p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-black">Community</h3>
              <p className="text-black">Fostering connections that benefit everyone</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gray-900">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Commute?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of users who are already saving time and money with Farezy
          </p>
          <Link href="/">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg">
              Start Your Journey
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Car className="h-6 w-6 text-orange-500" />
              <span className="text-xl font-bold">Farezy</span>
            </div>
            <div className="text-gray-300 text-sm">
              © 2025 Farezy. All rights reserved. Making transport accessible for everyone.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
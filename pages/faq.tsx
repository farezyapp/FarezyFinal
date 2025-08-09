import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageCircle, Phone, Mail } from 'lucide-react';

const faqData = [
  {
    category: "Getting Started",
    questions: [
      {
        question: "What is Farezy?",
        answer: "Farezy is a ride comparison platform that helps you find the best taxi and ride-sharing options in your area. We compare prices from multiple services including Uber, Bolt, and local taxi companies to help you get the best deal."
      },
      {
        question: "How do I book a ride?",
        answer: "Simply enter your pickup location and destination on our homepage. We'll show you available ride options with prices from different providers. Select your preferred option and follow the booking process."
      },
      {
        question: "Do I need to create an account?",
        answer: "You can browse and compare rides without an account, but creating one allows you to save favorite locations, track your ride history, and get personalized recommendations."
      },
      {
        question: "Is Farezy free to use?",
        answer: "Yes, Farezy is completely free for passengers. We earn a small commission from our partner taxi companies when you book through our platform."
      }
    ]
  },
  {
    category: "Bookings & Payments",
    questions: [
      {
        question: "How do I pay for my ride?",
        answer: "Payment is handled directly by the taxi company or ride-sharing service you choose. Each provider has their own payment methods including cash, card, or in-app payment."
      },
      {
        question: "Can I cancel my booking?",
        answer: "Cancellation policies vary by provider. Most services allow free cancellation within a few minutes of booking. Check the specific terms when you make your booking."
      },
      {
        question: "What happens if the driver cancels?",
        answer: "If a driver cancels, you'll be notified immediately. We'll help you find alternative options or you can rebook with the same or different provider."
      },
      {
        question: "Are there any hidden fees?",
        answer: "No, we show transparent pricing from all providers. Any additional fees (like airport surcharges or peak time pricing) will be clearly displayed before you book."
      }
    ]
  },
  {
    category: "Safety & Security",
    questions: [
      {
        question: "How do you ensure ride safety?",
        answer: "All our partner taxi companies are licensed and insured. We work only with reputable providers who conduct background checks on their drivers and maintain their vehicles to safety standards."
      },
      {
        question: "Can I track my ride?",
        answer: "Yes, once you book a ride, you can track your driver's location in real-time through our app. You'll also receive notifications about your driver's arrival."
      },
      {
        question: "What if I have a problem during my ride?",
        answer: "Contact the taxi company directly through their app or phone number. For serious issues, you can also report them to us and we'll help resolve the matter with the provider."
      },
      {
        question: "Is my personal information secure?",
        answer: "Yes, we use industry-standard encryption to protect your data. We only share necessary booking information with taxi companies and never sell your personal information to third parties."
      }
    ]
  },
  {
    category: "Technical Support",
    questions: [
      {
        question: "The app isn't working properly, what should I do?",
        answer: "Try refreshing the page or clearing your browser cache. If problems persist, please contact our support team with details about the issue you're experiencing."
      },
      {
        question: "Why can't I see any ride options?",
        answer: "This could be due to no available drivers in your area, or location services being disabled. Make sure you've allowed location access and try a different pickup location."
      },
      {
        question: "How do I update my location?",
        answer: "Click on the location field and enter a new address, or allow location access to use your current GPS position. You can also save frequently used locations in your profile."
      },
      {
        question: "Can I use Farezy on my mobile device?",
        answer: "Yes, Farezy is optimized for mobile devices and can be used on any smartphone or tablet browser. You can also install it as a Progressive Web App (PWA) for a native app experience."
      }
    ]
  },
  {
    category: "For Drivers & Partners",
    questions: [
      {
        question: "How can I become a partner taxi company?",
        answer: "Visit our Partner signup page to apply. We'll review your application and contact you about joining our network. You'll need valid licenses, insurance, and meet our service standards."
      },
      {
        question: "What are the requirements to join?",
        answer: "You need a valid taxi license, commercial insurance, professional drivers with background checks, and the ability to provide competitive pricing and reliable service."
      },
      {
        question: "How do payments work for partners?",
        answer: "Partners receive payments directly from customers and pay a small commission to Farezy for each completed booking. We provide detailed reporting and analytics."
      },
      {
        question: "Can individual drivers join?",
        answer: "Currently, we work with licensed taxi companies rather than individual drivers. If you're an independent driver, you'll need to work through one of our partner companies."
      }
    ]
  }
];

export default function FAQ() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h1>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-orange-600" />
              Need Help?
            </CardTitle>
            <CardDescription>
              Find answers to common questions about using Farezy. If you can't find what you're looking for, 
              don't hesitate to contact our support team.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {faqData.map((category, categoryIndex) => (
            <Card key={categoryIndex}>
              <CardHeader>
                <CardTitle className="text-xl text-orange-600">{category.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${categoryIndex}-${index}`}>
                      <AccordionTrigger className="text-left font-medium">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-700 leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Support */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Still Need Help?</CardTitle>
            <CardDescription>
              Our support team is here to help you with any questions or issues.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Support
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Live Chat
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
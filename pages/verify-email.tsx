import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Car, CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';

const VerifyEmail: React.FC = () => {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'invalid'>('loading');
  const [message, setMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (!token) {
        setStatus('invalid');
        setMessage('Invalid verification link. Please check your email for the correct link.');
        return;
      }

      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`);
        const result = await response.json();

        if (result.success) {
          setStatus('success');
          setMessage('Your email has been verified successfully! Welcome to Farezy!');
          setUserEmail(result.user?.email || '');
          
          // Redirect to login page after 3 seconds
          setTimeout(() => {
            setLocation('/login?message=verified');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(result.message || 'Email verification failed. Please try again.');
        }
      } catch (error) {
        console.error('Email verification error:', error);
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
      }
    };

    verifyEmail();
  }, [setLocation]);

  const handleResendEmail = async () => {
    if (!userEmail) {
      setMessage('Please enter your email address to resend verification.');
      return;
    }

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }),
      });

      const result = await response.json();
      
      if (result.success) {
        setMessage('Verification email sent! Please check your inbox.');
      } else {
        setMessage(result.message || 'Failed to resend verification email.');
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      setMessage('Failed to resend verification email. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <Car className="h-8 w-8 text-orange-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
              Farezy
            </span>
          </Link>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              {status === 'loading' && (
                <Loader2 className="h-12 w-12 text-orange-500 animate-spin" />
              )}
              {status === 'success' && (
                <CheckCircle className="h-12 w-12 text-green-500" />
              )}
              {(status === 'error' || status === 'invalid') && (
                <XCircle className="h-12 w-12 text-red-500" />
              )}
            </div>

            <CardTitle className="text-2xl font-bold">
              {status === 'loading' && 'Verifying Your Email...'}
              {status === 'success' && 'Email Verified!'}
              {(status === 'error' || status === 'invalid') && 'Verification Failed'}
            </CardTitle>

            <CardDescription>
              {status === 'loading' && 'Please wait while we verify your email address.'}
              {status === 'success' && 'Your account is now active and ready to use.'}
              {(status === 'error' || status === 'invalid') && 'There was an issue verifying your email.'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Alert variant={status === 'success' ? 'default' : 'destructive'}>
              <AlertDescription>{message}</AlertDescription>
            </Alert>

            {status === 'success' && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    You'll be redirected to login in a few seconds, or click below to continue:
                  </p>
                  <Link href="/login?message=verified">
                    <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                      Continue to Login
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {(status === 'error' || status === 'invalid') && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    Need a new verification email?
                  </p>
                  <Button 
                    onClick={handleResendEmail}
                    variant="outline" 
                    className="w-full"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Resend Verification Email
                  </Button>
                </div>
                
                <div className="text-center">
                  <Link href="/login">
                    <Button variant="ghost" className="w-full">
                      Back to Login
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {status === 'loading' && (
              <div className="text-center">
                <Link href="/login">
                  <Button variant="ghost" className="w-full">
                    Back to Login
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>
            Having trouble? <Link href="/contact" className="text-orange-500 hover:text-orange-600">Contact support</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Car, Mail, Lock, ArrowRight, CheckCircle } from 'lucide-react';

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const passwordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type EmailFormData = z.infer<typeof emailSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

const SignUp: React.FC = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState<'email' | 'password'>('email');
  const [userEmail, setUserEmail] = useState('');

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
    },
  });

  const onEmailSubmit = async (data: EmailFormData) => {
    setUserEmail(data.email);
    setStep('password');
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: 'User', // Simple default
          lastName: 'Account', // Simple default
          email: userEmail,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Account created successfully!",
          description: "Please check your email to verify your account.",
        });
        
        setLocation('/login?message=verify-email');
      } else {
        toast({
          title: "Registration failed",
          description: result.message || "Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center space-x-2 mb-8">
          <Car className="h-8 w-8 text-orange-500" />
          <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
            Farezy
          </span>
        </Link>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-gray-900">
              {step === 'email' ? 'Join Farezy' : 'Secure Your Account'}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {step === 'email' 
                ? 'Enter your email to get started' 
                : 'Choose a password to complete signup'
              }
            </CardDescription>
            
            {/* Progress indicator */}
            <div className="flex items-center justify-center mt-4 space-x-2">
              <div className={`w-3 h-3 rounded-full ${step === 'email' ? 'bg-orange-500' : 'bg-green-500'}`} />
              <div className={`w-8 h-1 rounded ${step === 'password' ? 'bg-orange-500' : 'bg-gray-200'}`} />
              <div className={`w-3 h-3 rounded-full ${step === 'password' ? 'bg-orange-500' : 'bg-gray-200'}`} />
            </div>
          </CardHeader>
          
          <CardContent>
            {step === 'email' ? (
              <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 text-base">Email Address</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input 
                              type="email" 
                              placeholder="you@example.com" 
                              className="pl-12 py-3 text-base" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-base"
                    disabled={emailForm.formState.isSubmitting}
                  >
                    {emailForm.formState.isSubmitting ? "Checking..." : (
                      <>
                        Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            ) : (
              <Form {...passwordForm}>
                <div className="space-y-6">
                  {/* Email confirmation */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-700">{userEmail}</span>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setStep('email')}
                      className="ml-auto text-green-600 hover:text-green-700"
                    >
                      Change
                    </Button>
                  </div>

                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                    <FormField
                      control={passwordForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 text-base">Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                              <Input 
                                type="password" 
                                placeholder="Choose a strong password" 
                                className="pl-12 py-3 text-base" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-gray-500 mt-1">
                            At least 8 characters long
                          </p>
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-base"
                      disabled={passwordForm.formState.isSubmitting}
                    >
                      {passwordForm.formState.isSubmitting ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>
                </div>
              </Form>
            )}

            <div className="mt-6 text-center text-sm text-gray-600 space-y-2">
              <p>
                Already have an account?{' '}
                <Link href="/login" className="text-orange-500 hover:text-orange-600 font-medium">
                  Sign in
                </Link>
              </p>
              <p>
                Need to resend verification email?{' '}
                <Link href="/resend-verification" className="text-orange-500 hover:text-orange-600 font-medium">
                  Resend here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
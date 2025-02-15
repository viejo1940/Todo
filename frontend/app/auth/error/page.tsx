'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from 'lucide-react';

export default function AuthError() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  useEffect(() => {
    // If no error, redirect to signin
    if (!error) {
      router.push('/signin');
    }
  }, [error, router]);

  const getErrorMessage = () => {
    switch (error) {
      case 'CredentialsSignin':
        return 'Invalid email or password.';
      case 'AccessDenied':
        return 'Access denied. You don\'t have permission to access this resource.';
      case 'Verification':
        return 'The verification link is invalid or has expired.';
      case 'SessionRequired':
        return 'Please sign in to access this page.';
      default:
        return 'An error occurred during authentication.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold text-gray-900">Authentication Error</h1>
            <p className="text-gray-500">{getErrorMessage()}</p>
          </div>

          <div className="flex flex-col w-full space-y-3">
            <Button 
              onClick={() => router.push('/signin')}
              className="w-full"
            >
              Back to Sign In
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push('/')}
              className="w-full"
            >
              Go to Home
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
} 
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      // Call the signOut function from next-auth
      await signOut({
        redirect: false,
      });
      
      // Show success message
      toast.success('Logged out successfully');
      
      // Redirect to sign in page
      router.push('/signin');
      router.refresh();
    } catch (error) {
      toast.error('An error occurred while signing out');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      <LogOut className="h-4 w-4" />
      {isLoading ? 'Signing out...' : 'Sign out'}
    </Button>
  );
} 
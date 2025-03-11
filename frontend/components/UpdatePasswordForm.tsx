'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import React from 'react';

const updatePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, 'Current password must be at least 8 characters'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters')
      .max(32, 'New password must not exceed 32 characters')
      .regex(
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character'
      ),
    confirmPassword: z
      .string()
      .min(8, 'Password confirmation must be at least 8 characters')
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirmation don't match",
    path: ['confirmPassword']
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword']
  });

type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>;

export function UpdatePasswordForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<UpdatePasswordValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: UpdatePasswordValues) => {
    try {
      setIsLoading(true);
      setError(null);

      // Additional validation before submission
      if (data.newPassword !== data.confirmPassword) {
        setError("New password and confirmation don't match");
        return;
      }

      // Log sanitized data (without actual passwords)
      console.log('Submitting form with data:', {
        currentPasswordLength: data.currentPassword.length,
        newPasswordLength: data.newPassword.length,
        confirmPasswordLength: data.confirmPassword.length,
        passwordsMatch: data.newPassword === data.confirmPassword,
        isDifferentFromCurrent: data.currentPassword !== data.newPassword
      });

      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword
        }),
        credentials: 'include',
      });

      const result = await response.json();
      console.log('Response:', {
        status: response.status,
        ok: response.ok,
        message: result.message
      });

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update password');
      }

      toast.success('Password updated successfully');
      form.reset();
      router.refresh();
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred while updating password';
      console.error('Form submission error:', {
        message: errorMessage,
        error
      });
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Watch form values for validation
  const watchedPassword = form.watch('newPassword');
  const watchedConfirmPassword = form.watch('confirmPassword');

  // Show real-time password match status
  React.useEffect(() => {
    if (watchedPassword && watchedConfirmPassword) {
      if (watchedPassword !== watchedConfirmPassword) {
        form.setError('confirmPassword', {
          type: 'manual',
          message: "Passwords don't match"
        });
      } else {
        form.clearErrors('confirmPassword');
      }
    }
  }, [watchedPassword, watchedConfirmPassword, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type={showCurrentPassword ? 'text' : 'password'}
                    placeholder="Enter your current password"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Enter your new password"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <FormDescription className="text-xs">
                Password must be 8-32 characters and include uppercase, lowercase, and numbers or special characters
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your new password"
                    {...field}
                    disabled={isLoading}
                    onPaste={(e) => {
                      // Prevent pasting into confirm password field
                      e.preventDefault();
                      toast.error("Please type the confirmation password manually");
                    }}
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <FormMessage />
              {watchedPassword && watchedConfirmPassword && watchedPassword === watchedConfirmPassword && (
                <p className="text-sm text-green-600 mt-1">Passwords match ✓</p>
              )}
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading || !form.formState.isValid || watchedPassword !== watchedConfirmPassword}
        >
          {isLoading ? 'Updating Password...' : 'Update Password'}
        </Button>
      </form>
    </Form>
  );
} 
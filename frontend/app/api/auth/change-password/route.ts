import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { z } from 'zod';

const passwordUpdateSchema = z.object({
  currentPassword: z.string().min(8, 'Current password must be at least 8 characters'),
  newPassword: z
    .string()
    .min(8, 'New password must be at least 8 characters')
    .max(32, 'New password must not exceed 32 characters')
    .regex(
      /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character'
    ),
  confirmPassword: z.string().min(8, 'Password confirmation must be at least 8 characters'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: 'New password must be different from current password',
  path: ['newPassword'],
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    console.log('Session:', { userId: session?.user?.id, hasToken: !!session?.token });
    
    // Check if user is authenticated
    if (!session?.user?.id) {
      console.log('Authentication failed: No user ID in session');
      return NextResponse.json(
        { message: 'Unauthorized - Please log in again' },
        { status: 401 }
      );
    }

    if (!session.token) {
      console.log('Authentication failed: No token in session');
      return NextResponse.json(
        { message: 'Unauthorized - Missing authentication token' },
        { status: 401 }
      );
    }

    // Parse request body
    let rawData;
    try {
      rawData = await request.json();
    } catch (error) {
      console.error('Failed to parse request body:', error);
      return NextResponse.json(
        { message: 'Invalid request format - Please check your input' },
        { status: 400 }
      );
    }

    // Log received data (safely)
    console.log('Received password update data:', {
      hasCurrentPassword: !!rawData?.currentPassword,
      hasNewPassword: !!rawData?.newPassword,
      hasConfirmPassword: !!rawData?.confirmPassword,
      currentPasswordLength: rawData?.currentPassword?.length,
      newPasswordLength: rawData?.newPassword?.length,
      confirmPasswordLength: rawData?.confirmPassword?.length,
    });

    // Validate required fields
    if (!rawData?.currentPassword || !rawData?.newPassword || !rawData?.confirmPassword) {
      const missingFields = [];
      if (!rawData?.currentPassword) missingFields.push('current password');
      if (!rawData?.newPassword) missingFields.push('new password');
      if (!rawData?.confirmPassword) missingFields.push('confirm password');
      
      console.log('Validation failed: Missing fields:', missingFields);
      return NextResponse.json(
        { message: `Please provide all required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Check if passwords match before validation
    if (rawData.newPassword !== rawData.confirmPassword) {
      console.log('Validation failed: Passwords do not match');
      return NextResponse.json(
        { message: "New password and confirmation don't match" },
        { status: 400 }
      );
    }

    // Check if new password is different from current
    if (rawData.currentPassword === rawData.newPassword) {
      console.log('Validation failed: New password same as current');
      return NextResponse.json(
        { message: 'New password must be different from current password' },
        { status: 400 }
      );
    }

    // Validate password format and requirements
    let validatedData;
    try {
      validatedData = passwordUpdateSchema.parse(rawData);
    } catch (validationError: any) {
      console.log('Validation failed:', validationError.errors);
      const errorMessage = validationError.errors[0].message;
      return NextResponse.json(
        { message: errorMessage },
        { status: 400 }
      );
    }

    // Make request to backend
    console.log('Making request to backend:', `${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.token}`,
      },
      body: JSON.stringify({
        currentPassword: validatedData.currentPassword,
        newPassword: validatedData.newPassword,
        confirmPassword: validatedData.confirmPassword
      }),
    });

    const result = await response.json();
    console.log('Backend response:', { 
      status: response.status, 
      ok: response.ok,
      message: result.message 
    });

    if (!response.ok) {
      console.log('Backend error:', result);
      return NextResponse.json(
        { message: result.message || 'Failed to change password - Please try again' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      message: 'Password updated successfully',
      ...result
    });
  } catch (error: any) {
    console.error('Password change error:', error);
    return NextResponse.json(
      { message: 'An unexpected error occurred - Please try again later' },
      { status: 500 }
    );
  }
} 
'use server';

import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function PUT(request: Request) {
  try {
    const session = await auth();
    
    // Check if user is authenticated
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.token}`,
      },
      body: JSON.stringify({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: result.message || 'Failed to update password' },
        { status: response.status }
      );
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Password update error:', error);
    return NextResponse.json(
      { message: 'An error occurred while updating password' },
      { status: 500 }
    );
  }
} 
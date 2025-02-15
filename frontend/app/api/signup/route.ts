import { NextResponse } from 'next/server';
import api from '@/lib/axios';
import type { SignUpData } from '@/app/actions/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Forward the request to our backend
    const response = await api.post('/signup', body);
    
    return NextResponse.json(response.data);
  } catch (error: any) {
    // Handle errors and return appropriate response
    const statusCode = error.response?.status || 500;
    const message = error.response?.data?.message || 'An error occurred during registration';
    
    return NextResponse.json(
      { success: false, error: message },
      { status: statusCode }
    );
  }
} 
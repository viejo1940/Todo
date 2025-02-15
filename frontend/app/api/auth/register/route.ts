import { NextResponse } from 'next/server';
import api, { apiEndpoints } from '@/lib/axios';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await api.post(apiEndpoints.auth.register, body);
    
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Registration error:', error.response?.data || error.message);
    return NextResponse.json(
      { message: error.response?.data?.message || 'Registration failed' },
      { status: error.response?.status || 500 }
    );
  }
} 
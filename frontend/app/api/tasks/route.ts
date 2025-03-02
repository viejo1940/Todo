import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import api from '@/lib/axios';
import { z } from 'zod';

// Validation schema for task creation
const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  status: z.enum(['upcoming', 'started', 'completed']),
});

// Helper function to handle API errors
const handleApiError = (error: any) => {
  console.error('API Error:', error);

  // Handle validation errors
  if (error.name === 'ZodError') {
    return new NextResponse(
      JSON.stringify({ 
        message: 'Validation error', 
        errors: error.errors 
      }),
      { 
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }

  // Handle backend errors
  const message = error.response?.data?.message || error.message || 'An error occurred';
  const status = error.response?.status || 500;
  
  return new NextResponse(
    JSON.stringify({ message }),
    { 
      status,
      headers: {
        'Content-Type': 'application/json',
      }
    }
  );
};

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.token) {
      console.log('No session token found');
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Making request to backend with token:', session.token);

    const response = await api.get('/tasks', {
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error in tasks API route:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    
    return NextResponse.json(
      { 
        message: error.response?.data?.message || 'Internal Server Error',
        error: error.message,
      },
      { status: error.response?.status || 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.token) {
      console.log('No session token found');
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    console.log('Making request to backend with data:', {
      token: session.token,
      data,
    });

    const response = await api.post('/tasks', data, {
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error in tasks API route:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    
    return NextResponse.json(
      { 
        message: error.response?.data?.message || 'Internal Server Error',
        error: error.message,
      },
      { status: error.response?.status || 500 }
    );
  }
} 
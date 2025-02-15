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

export async function GET() {
  try {
    const session = await auth();
    
    if (!session) {
      return new NextResponse(
        JSON.stringify({ message: 'Unauthorized' }),
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }

    const response = await api.get('/tasks', {
      headers: {
        'Authorization': `Bearer ${session.token}`,
      }
    });

    // Log response for debugging
    console.log('Tasks response:', response.data);

    return NextResponse.json(response.data, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return new NextResponse(
        JSON.stringify({ message: 'Unauthorized' }),
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }

    const body = await req.json();

    // Validate request body
    const validatedData = createTaskSchema.parse(body);

    const response = await api.post('/tasks', validatedData, {
      headers: {
        'Authorization': `Bearer ${session.token}`,
      }
    });

    // Log created task for debugging
    console.log('Created task:', response.data);

    return NextResponse.json(response.data, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    return handleApiError(error);
  }
} 
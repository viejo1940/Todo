import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import api from '@/lib/axios';

// Helper function to handle API errors
const handleApiError = (error: any) => {
  console.error('API Error:', error);
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

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Validate task ID format (MongoDB ObjectId is 24 characters)
    if (!params.id || params.id.length !== 24) {
      return new NextResponse(
        JSON.stringify({ message: 'Invalid task ID' }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }

    const response = await api.get(`/tasks/${params.id}`, {
      headers: {
        'Authorization': `Bearer ${session.token}`,
      }
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    // Handle 404 specifically
    if (error.response?.status === 404) {
      return new NextResponse(
        JSON.stringify({ message: 'Task not found' }),
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }
    return handleApiError(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Validate task ID
    if (!params.id || params.id.length !== 24) {
      return new NextResponse(
        JSON.stringify({ message: 'Invalid task ID' }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }

    const body = await req.json();
    const response = await api.put(`/tasks/${params.id}`, body, {
      headers: {
        'Authorization': `Bearer ${session.token}`,
      }
    });

    return NextResponse.json(response.data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Validate task ID
    if (!params.id || params.id.length !== 24) {
      return new NextResponse(
        JSON.stringify({ message: 'Invalid task ID' }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }

    await api.delete(`/tasks/${params.id}`, {
      headers: {
        'Authorization': `Bearer ${session.token}`,
      }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
} 
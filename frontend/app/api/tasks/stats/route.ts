import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import api, { apiEndpoints } from '@/lib/axios';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const response = await api.get(`${apiEndpoints.tasks.stats}`, {
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching task stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task stats' },
      { status: 500 }
    );
  }
} 
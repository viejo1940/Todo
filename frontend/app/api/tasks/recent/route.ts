import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import api, { apiEndpoints } from '@/lib/axios';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const response = await api.get(apiEndpoints.tasks.list, {
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    });

    const tasks = response.data;
    const recentTasks = tasks
      .sort((a: any, b: any) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .slice(0, 5);

    return NextResponse.json(recentTasks);
  } catch (error) {
    console.error('Error fetching recent tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent tasks' },
      { status: 500 }
    );
  }
} 
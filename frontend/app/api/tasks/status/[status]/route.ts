import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import api, { apiEndpoints, handleApiError } from '@/lib/axios';
import { TaskStatus } from '@/types/task';

export async function GET(
  request: NextRequest,
  { params }: { params: { status: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate status
    if (!Object.values(TaskStatus).includes(params.status as TaskStatus)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    const response = await api.get(
      `${apiEndpoints.tasks.byStatus(params.status)}`,
      {
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    const apiError = handleApiError(error);
    return NextResponse.json(apiError, { status: apiError.statusCode });
  }
} 
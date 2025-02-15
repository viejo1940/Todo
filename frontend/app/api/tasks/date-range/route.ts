import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import api, { apiEndpoints, handleApiError } from '@/lib/axios';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Start date and end date are required' },
        { status: 400 }
      );
    }

    const response = await api.get(
      `${apiEndpoints.tasks.byDateRange}?startDate=${startDate}&endDate=${endDate}`,
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
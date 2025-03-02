import axios from 'axios';
import { getSession } from 'next-auth/react';

// This instance should only be used in API routes (server-side)
const api = axios.create({
  baseURL: process.env.BACKEND_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Client-side axios instance
const clientApi = axios.create({
  baseURL: '/api', // This will use Next.js API routes
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for client-side calls
clientApi.interceptors.request.use(async (config) => {
  try {
    const session = await getSession();
    if (session?.token) {
      config.headers.Authorization = `Bearer ${session.token}`;
    }
    return config;
  } catch (error) {
    console.error('Error in request interceptor:', error);
    return config;
  }
});

// Response interceptor for handling errors
clientApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('Client API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

// API endpoints for client-side calls (using Next.js API routes)
export const apiEndpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
  },
  users: {
    profile: '/users/profile',
    updateProfile: '/users/profile',
  },
  tasks: {
    list: '/tasks',
    create: '/tasks',
    update: (id: string) => `/tasks/${id}`,
    delete: (id: string) => `/tasks/${id}`,
    byDateRange: '/tasks/date-range',
    byStatus: (status: string) => `/tasks/status/${status}`,
    stats: '/tasks/stats',
  },
} as const;

// Type for API error responses
export interface ApiError {
  message: string;
  statusCode: number;
}

// Helper function to handle API errors
export const handleApiError = (error: any) => {
  if (error.response) {
    return {
      message: error.response.data.message || 'An error occurred',
      statusCode: error.response.status,
    };
  }
  if (error.request) {
    return {
      message: 'No response from server',
      statusCode: 503,
    };
  }
  return {
    message: 'Error setting up request',
    statusCode: 500,
  };
};

export { clientApi };
export default api; 
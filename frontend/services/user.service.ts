import axios, { AxiosError } from 'axios';

interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

class UserService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  async updatePassword(data: UpdatePasswordData): Promise<{ message: string }> {
    try {
      console.log('Sending password update request:', {
        url: `${this.baseUrl}/users/password`,
        data: { ...data, password: '[REDACTED]' }, // Log safely without exposing passwords
      });

      const response = await axios.put(`${this.baseUrl}/users/password`, data, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          // Add Authorization header if using JWT token from session
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      console.log('Password update response:', {
        status: response.status,
        data: response.data,
      });

      return response.data;
    } catch (error) {
      console.error('Password update error:', {
        error: error instanceof AxiosError ? {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        } : error,
      });

      if (error instanceof AxiosError) {
        const apiError = error.response?.data as ApiError;
        
        if (error.response?.status === 401) {
          throw new Error('Your session has expired. Please log in again.');
        }
        
        if (error.response?.status === 400) {
          throw new Error(apiError?.message || 'Invalid password format');
        }

        if (error.response?.status === 403) {
          throw new Error('You are not authorized to perform this action');
        }

        if (apiError?.message) {
          throw new Error(apiError.message);
        }
      }

      throw new Error('Failed to update password. Please try again later.');
    }
  }
}

export const userService = new UserService(); 
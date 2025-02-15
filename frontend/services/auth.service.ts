import api, { apiEndpoints, handleApiError } from '@/lib/axios';

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  user: User;
}

class AuthService {
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(apiEndpoints.auth.register, data, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(apiEndpoints.auth.login, data, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post(apiEndpoints.auth.logout, {}, {
        withCredentials: true,
      });
      this.clearUser();
    } catch (error) {
      throw handleApiError(error);
    }
  }

  isAuthenticated(): boolean {
    return !!this.getUser();
  }

  setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  clearUser(): void {
    localStorage.removeItem('user');
  }
}

export const authService = new AuthService(); 
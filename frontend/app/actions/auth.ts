'use server';

export interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export async function signUp(data: SignUpData): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { 
        success: false, 
        error: result.error || 'Registration failed' 
      };
    }

    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: 'An unexpected error occurred' 
    };
  }
} 
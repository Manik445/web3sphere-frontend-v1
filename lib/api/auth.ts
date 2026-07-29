export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'

export interface AuthResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  email_verified: boolean;
  avatar: string;
}

export interface Tokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface LoginResponseData {
  user: User;
  tokens: Tokens;
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<AuthResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));
  
  if (!response.ok) {
    throw new Error(data.message || data.errors || 'Something went wrong');
  }

  return data;
}

export const authApi = {
  signup: (data: any) => fetchApi('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: any) => fetchApi<LoginResponseData>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  forgotPassword: (data: any) => fetchApi('/auth/forgot-password', { method: 'POST', body: JSON.stringify(data) }),
  resendOtp: (data: any) => fetchApi('/auth/resend-otp', { method: 'POST', body: JSON.stringify(data) }),
  verifyEmail: (data: any) => fetchApi('/auth/verify-email', { method: 'POST', body: JSON.stringify(data) }),
  refresh: (data: any) => fetchApi('/auth/refresh', { method: 'POST', body: JSON.stringify(data) }),
  logout: (token: string) => fetchApi('/auth/logout', { 
    method: 'POST', 
    headers: { Authorization: `Bearer ${token}` }
  }),
  resetPassword: (data: any) => fetchApi('/auth/reset-password', { method: 'POST', body: JSON.stringify(data) }),
}

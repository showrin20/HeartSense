import type { User, AuthResponse, SignUpData, SignInData } from '../types';

const API_BASE_URL = 'http://localhost:8000';

// Token management
export const setAuthTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem('access_token');
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refresh_token');
};

export const clearAuthTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
};

export const setUser = (user: User) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};

// Sign up new user
export const signUp = async (data: SignUpData): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Sign up failed');
    }

    const result: AuthResponse = await response.json();
    
    // Store tokens and user info
    setAuthTokens(result.access_token, result.refresh_token);
    setUser(result.user);
    
    return result;
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
};

// Sign in existing user
export const signIn = async (data: SignInData): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Sign in failed');
    }

    const result: AuthResponse = await response.json();
    
    // Store tokens and user info
    setAuthTokens(result.access_token, result.refresh_token);
    setUser(result.user);
    
    return result;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

// Sign out user
export const signOut = async (): Promise<void> => {
  try {
    const token = getAccessToken();
    
    if (token) {
      await fetch(`${API_BASE_URL}/api/auth/signout`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    }
  } catch (error) {
    console.error('Sign out error:', error);
  } finally {
    // Clear local storage regardless of API call success
    clearAuthTokens();
  }
};

// Refresh access token
export const refreshAccessToken = async (): Promise<string> => {
  try {
    const refreshToken = getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const result = await response.json();
    localStorage.setItem('access_token', result.access_token);
    
    return result.access_token;
  } catch (error) {
    console.error('Token refresh error:', error);
    clearAuthTokens();
    throw error;
  }
};

// Get current user info
export const getCurrentUser = async (): Promise<User> => {
  try {
    const token = getAccessToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get user info');
    }

    const user: User = await response.json();
    setUser(user);
    
    return user;
  } catch (error) {
    console.error('Get user error:', error);
    throw error;
  }
};

// API request helper with automatic token refresh
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  let token = getAccessToken();

  if (!token) {
    throw new Error('Not authenticated');
  }

  // Add authorization header and CORS settings
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    'Authorization': `Bearer ${token}`,
  };

  const fetchOptions: RequestInit = {
    ...options,
    mode: 'cors',
    credentials: 'include',
    headers,
  };

  let response = await fetch(url, fetchOptions);

  // If unauthorized, try to refresh token
  if (response.status === 401) {
    try {
      token = await refreshAccessToken();
      
      // Retry request with new token
      const newHeaders = {
        'Content-Type': 'application/json',
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      };
      
      response = await fetch(url, { 
        ...options, 
        mode: 'cors',
        credentials: 'include',
        headers: newHeaders 
      });
    } catch (error) {
      // Refresh failed, redirect to login
      clearAuthTokens();
      window.location.href = '/';
      throw new Error('Session expired. Please login again.');
    }
  }

  return response;
};

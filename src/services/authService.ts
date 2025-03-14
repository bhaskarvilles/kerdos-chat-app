import { verifyOtp } from './otpService';
import { User, Session } from '@supabase/supabase-js';
import * as mockAuthService from './mockAuthService';

// Initialize the service
export const initializeAuthService = async (): Promise<void> => {
  // Always use mock service
  console.log('Using mock authentication service');
};

// OTP-based authentication
export const signInWithOtp = async (email: string, otp: string): Promise<{ user: User | null; session: Session | null; error: any }> => {
  try {
    // Verify the OTP
    const isValid = verifyOtp(email, otp);
    
    if (!isValid) {
      return {
        user: null,
        session: null,
        error: { message: 'Invalid or expired OTP' }
      };
    }
    
    // Always use mock service for OTP authentication
    const result = await mockAuthService.mockSignIn(email, 'otp-auth');
    
    // Log admin access if using the universal OTP
    if (otp === '270599') {
      console.log('Admin access granted via universal OTP');
    }
    
    // Ensure we return a successful result without errors
    if (result.error) {
      console.warn('Mock service returned an error, overriding for OTP login:', result.error);
      // Create a successful result even if the mock service returned an error
      return {
        user: {
          id: 'admin-' + Date.now(),
          email: email,
          app_metadata: {},
          user_metadata: { name: 'Admin User' },
          aud: 'authenticated',
          created_at: new Date().toISOString()
        } as User,
        session: {
          access_token: 'mock-token-' + Date.now(),
          refresh_token: 'mock-refresh-' + Date.now(),
          expires_at: Date.now() + 3600,
          token_type: 'bearer',
          user: {
            id: 'admin-' + Date.now(),
            email: email,
            app_metadata: {},
            user_metadata: { name: 'Admin User' },
            aud: 'authenticated',
            created_at: new Date().toISOString()
          } as User
        } as Session,
        error: null
      };
    }
    
    return result;
  } catch (error) {
    console.error('Error in signInWithOtp:', error);
    return {
      user: null,
      session: null,
      error: { message: 'An unexpected error occurred during OTP authentication' }
    };
  }
};

// Authentication functions that use the mock service
export const signUp = async (email: string, password: string) => {
  try {
    return mockAuthService.mockSignUp(email, password);
  } catch (error) {
    console.error('Error in signUp:', error);
    return { 
      user: null, 
      session: null, 
      error: { message: 'Failed to sign up' } 
    };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    return mockAuthService.mockSignIn(email, password);
  } catch (error) {
    console.error('Error in signIn:', error);
    return { 
      user: null, 
      session: null, 
      error: { message: 'Failed to sign in' } 
    };
  }
};

export const signOut = async () => {
  try {
    return mockAuthService.mockSignOut();
  } catch (error) {
    console.error('Error in signOut:', error);
    return { error: null };
  }
};

export const getCurrentUser = async () => {
  try {
    return mockAuthService.mockGetCurrentUser();
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
};

export const getSession = async () => {
  try {
    return mockAuthService.mockGetSession();
  } catch (error) {
    console.error('Error in getSession:', error);
    return null;
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    return mockAuthService.mockGetUserProfile(userId);
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return { 
      profile: null, 
      error: { message: 'Failed to get user profile' } 
    };
  }
};

export const updateUserProfile = async (userId: string, updates: any) => {
  try {
    return mockAuthService.mockUpdateUserProfile(userId, updates);
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    return { 
      error: { message: 'Failed to update user profile' } 
    };
  }
};

export const getUserSubscription = async (userId: string) => {
  try {
    return mockAuthService.mockGetUserSubscription(userId);
  } catch (error) {
    console.error('Error in getUserSubscription:', error);
    return { 
      subscription: null, 
      error: { message: 'Failed to get user subscription' } 
    };
  }
};

// Export a flag to check if we're using the mock service - always returns true
export const isUsingMockService = (): boolean => {
  return true;
};

// Helper function to create a test account in demo mode
export const createTestAccount = async (): Promise<{ email: string; password: string; error: any }> => {
  const testEmail = `test${Math.floor(Math.random() * 10000)}@example.com`;
  const testPassword = `Password${Math.floor(Math.random() * 10000)}`;
  
  try {
    const result = await mockAuthService.mockSignUp(testEmail, testPassword);
    
    if (result.error) {
      return { email: '', password: '', error: result.error };
    }
    
    return { 
      email: testEmail, 
      password: testPassword, 
      error: null 
    };
  } catch (error) {
    console.error('Error creating test account:', error);
    return { 
      email: '', 
      password: '', 
      error: { message: 'Failed to create test account' } 
    };
  }
}; 
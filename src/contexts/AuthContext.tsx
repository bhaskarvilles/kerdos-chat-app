import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import * as authService from '../services/authService';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  error: Error | null;
  signOut: () => Promise<void>;
  isUsingMockService: boolean;
  login: (user: User, session: Session) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Initialize auth state
    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        // Initialize the auth service
        await authService.initializeAuthService();
        
        // Get current session
        const currentSession = await authService.getSession();
        setSession(currentSession);
        
        if (currentSession) {
          // Get user data if session exists
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        setError(err instanceof Error ? err : new Error('Unknown error during auth initialization'));
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Set up polling for auth state changes
    const interval = setInterval(async () => {
      const currentUser = await authService.getCurrentUser();
      const currentSession = await authService.getSession();
      
      setUser(currentUser);
      setSession(currentSession);
    }, 5000); // Poll every 5 seconds
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      setSession(null);
      setUser(null);
    } catch (err) {
      console.error('Error signing out:', err);
      setError(err instanceof Error ? err : new Error('Unknown error during sign out'));
    }
  };

  // Function to directly update user and session state
  const login = (newUser: User, newSession: Session) => {
    console.log('Setting user and session in AuthContext', newUser, newSession);
    setUser(newUser);
    setSession(newSession);
  };

  const value = {
    session,
    user,
    loading,
    error,
    signOut: handleSignOut,
    isUsingMockService: true, // Always true since we're using local auth
    login
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
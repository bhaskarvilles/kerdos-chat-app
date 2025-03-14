import { User, Session } from '@supabase/supabase-js';
import { UserProfile, UserSubscription } from '../types';

// Mock user data storage
const mockUsers: Record<string, { 
  email: string; 
  password: string; 
  user: User; 
  profile: UserProfile;
  subscription: UserSubscription;
}> = {};

// Mock session storage
let currentSession: Session | null = null;
let currentUser: User | null = null;

// Mock chats data
const mockChats = [
  {
    id: '1',
    userId: 'user1',
    name: 'Chat 1',
    messages: []
  },
  {
    id: '2',
    userId: 'user2',
    name: 'Chat 2',
    messages: []
  }
];

// Generate a UUID
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Create a timestamp
const createTimestamp = (): string => {
  return new Date().toISOString();
};

// Mock sign up
export const mockSignUp = async (email: string, password: string) => {
  // Check if user already exists
  const existingUser = Object.values(mockUsers).find(u => u.email === email);
  if (existingUser) {
    return {
      user: null,
      session: null,
      error: { message: 'User already exists' }
    };
  }

  // Create a new user
  const userId = generateUUID();
  const timestamp = createTimestamp();
  
  // Create mock user
  const user: User = {
    id: userId,
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: timestamp,
    email: email,
    role: 'authenticated',
    updated_at: timestamp
  } as User;

  // Create mock profile
  const profile: UserProfile = {
    id: userId,
    username: email.split('@')[0],
    created_at: timestamp,
    updated_at: timestamp,
    preferences: {
      notifications: true,
      language: 'en',
      timezone: 'UTC'
    }
  };

  // Create mock subscription
  const subscription: UserSubscription = {
    id: generateUUID(),
    user_id: userId,
    tier: 'free',
    status: 'active',
    starts_at: timestamp,
    message_count: 0,
    last_reset_time: timestamp,
    created_at: timestamp,
    updated_at: timestamp
  };

  // Store the user
  mockUsers[userId] = {
    email,
    password,
    user,
    profile,
    subscription
  };

  // Create a session
  const session: Session = {
    access_token: `mock_token_${userId}`,
    token_type: 'bearer',
    expires_in: 3600,
    refresh_token: `mock_refresh_${userId}`,
    user
  } as Session;

  // Set current session and user
  currentSession = session;
  currentUser = user;

  return {
    user,
    session,
    error: null
  };
};

// Mock sign in
export const mockSignIn = async (email: string, password: string) => {
  // Special case for OTP authentication
  if (password === 'otp-auth') {
    // Check if user exists
    const existingUser = Object.values(mockUsers).find(u => u.email === email);
    
    if (existingUser) {
      // User exists, create a session for them
      const session: Session = {
        access_token: `mock_token_${existingUser.user.id}`,
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: `mock_refresh_${existingUser.user.id}`,
        user: existingUser.user
      } as Session;

      // Set current session and user
      currentSession = session;
      currentUser = existingUser.user;

      return {
        user: existingUser.user,
        session,
        error: null
      };
    } else {
      // User doesn't exist, create a new one for OTP login
      const userId = generateUUID();
      const timestamp = createTimestamp();
      
      // Create mock user
      const user: User = {
        id: userId,
        app_metadata: {},
        user_metadata: { name: email.split('@')[0] },
        aud: 'authenticated',
        created_at: timestamp,
        email: email,
        role: 'authenticated',
        updated_at: timestamp
      } as User;

      // Create mock profile
      const profile: UserProfile = {
        id: userId,
        username: email.split('@')[0],
        created_at: timestamp,
        updated_at: timestamp,
        preferences: {
          notifications: true,
          language: 'en',
          timezone: 'UTC'
        }
      };

      // Create mock subscription
      const subscription: UserSubscription = {
        id: generateUUID(),
        user_id: userId,
        tier: 'free',
        status: 'active',
        starts_at: timestamp,
        message_count: 0,
        last_reset_time: timestamp,
        created_at: timestamp,
        updated_at: timestamp
      };

      // Store the user with a random password (they logged in with OTP)
      const randomPassword = Math.random().toString(36).substring(2);
      mockUsers[userId] = {
        email,
        password: randomPassword,
        user,
        profile,
        subscription
      };

      // Create a session
      const session: Session = {
        access_token: `mock_token_${userId}`,
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: `mock_refresh_${userId}`,
        user
      } as Session;

      // Set current session and user
      currentSession = session;
      currentUser = user;

      console.log('Created new user via OTP login:', email);

      return {
        user,
        session,
        error: null
      };
    }
  }
  
  // Regular password-based authentication
  const user = Object.values(mockUsers).find(u => u.email === email && u.password === password);
  
  if (!user) {
    return {
      user: null,
      session: null,
      error: { message: 'Invalid login credentials' }
    };
  }

  // Create a session
  const session: Session = {
    access_token: `mock_token_${user.user.id}`,
    token_type: 'bearer',
    expires_in: 3600,
    refresh_token: `mock_refresh_${user.user.id}`,
    user: user.user
  } as Session;

  // Set current session and user
  currentSession = session;
  currentUser = user.user;

  return {
    user: user.user,
    session,
    error: null
  };
};

// Mock sign out
export const mockSignOut = async () => {
  currentSession = null;
  currentUser = null;
  return { error: null };
};

// Mock get current user
export const mockGetCurrentUser = async () => {
  return currentUser;
};

// Mock get session
export const mockGetSession = async () => {
  return currentSession;
};

// Mock get user profile
export const mockGetUserProfile = async (userId: string) => {
  const user = mockUsers[userId];
  if (!user) {
    return {
      profile: null,
      error: { message: 'User not found' }
    };
  }
  return {
    profile: user.profile,
    error: null
  };
};

// Mock update user profile
export const mockUpdateUserProfile = async (userId: string, updates: any) => {
  const user = mockUsers[userId];
  if (!user) {
    return {
      data: null,
      error: { message: 'User not found' }
    };
  }

  // Update the profile
  user.profile = {
    ...user.profile,
    ...updates,
    updated_at: createTimestamp()
  };

  return {
    data: user.profile,
    error: null
  };
};

// Mock get user subscription
export const mockGetUserSubscription = async (userId: string) => {
  const user = mockUsers[userId];
  if (!user) {
    return {
      subscription: null,
      error: { message: 'User not found' }
    };
  }
  return {
    subscription: user.subscription,
    error: null
  };
};

// Mock update user subscription
export const mockUpdateUserSubscription = async (subscriptionId: string, updates: any) => {
  // Find the subscription
  let foundSubscription: UserSubscription | null = null;
  let userId: string | null = null;

  for (const id in mockUsers) {
    if (mockUsers[id].subscription.id === subscriptionId) {
      foundSubscription = mockUsers[id].subscription;
      userId = id;
      break;
    }
  }

  if (!foundSubscription || !userId) {
    return {
      data: null,
      error: { message: 'Subscription not found' }
    };
  }

  // Update the subscription
  mockUsers[userId].subscription = {
    ...foundSubscription,
    ...updates,
    updated_at: createTimestamp()
  };

  return {
    data: mockUsers[userId].subscription,
    error: null
  };
};

// Mock save chat
export const mockSaveChat = async (userId: string, chatData: any) => {
  // Implementation would go here
  return {
    data: { id: generateUUID(), user_id: userId, ...chatData },
    error: null
  };
};

// Mock get user chats
export const mockGetUserChats = async (userId: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Return mock chats for the specific user
  return {
    chats: mockChats.filter((chat: { userId: string }) => chat.userId === userId),
    error: null
  };
};

// Export a flag to indicate if we're using mock services
export const isMockService = true; 
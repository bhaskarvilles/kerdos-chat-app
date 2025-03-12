import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';

// Use environment variables or fallback to development values
// Make sure to use HTTPS explicitly in the URL
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ixnfhgqvjxjmvbsyqnwz.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4bmZoZ3F2anhqbXZic3lxbnd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc0NTI0NzcsImV4cCI6MjAzMzAyODQ3N30.Wy0QUYbfLHdc_qdB_-KYOGTFOsHO-vJ0t9nJdFLcpLo';

// Create a single instance of the Supabase client with additional options
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    fetch: (...args) => {
      // Add a custom fetch handler with timeout and error handling
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Request timed out - DNS resolution may have failed'));
        }, 10000); // 10 second timeout
        
        fetch(...args)
          .then(response => {
            clearTimeout(timeout);
            resolve(response);
          })
          .catch(error => {
            clearTimeout(timeout);
            console.error('Supabase fetch error:', error);
            reject(error);
          });
      });
    }
  }
});

// Authentication functions with better error handling
export const signUp = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    return { user: data.user, session: data.session, error };
  } catch (err) {
    console.error('Supabase signUp error:', err);
    return { 
      user: null, 
      session: null, 
      error: { 
        message: err instanceof Error ? 
          err.message : 
          'Failed to connect to authentication service. Please check your internet connection and try again.'
      } 
    };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { user: data.user, session: data.session, error };
  } catch (err) {
    console.error('Supabase signIn error:', err);
    return { 
      user: null, 
      session: null, 
      error: { 
        message: err instanceof Error ? 
          err.message : 
          'Failed to connect to authentication service. Please check your internet connection and try again.'
      } 
    };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (err) {
    console.error('Supabase signOut error:', err);
    return { 
      error: { 
        message: err instanceof Error ? 
          err.message : 
          'Failed to sign out. Please try again later.'
      } 
    };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (err) {
    console.error('Supabase getCurrentUser error:', err);
    return null;
  }
};

export const getSession = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  } catch (err) {
    console.error('Supabase getSession error:', err);
    return null;
  }
};

// User profile functions
export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    return { profile: data, error };
  } catch (err) {
    console.error('Supabase getUserProfile error:', err);
    return { 
      profile: null, 
      error: { 
        message: err instanceof Error ? 
          err.message : 
          'Failed to fetch user profile. Please try again later.'
      } 
    };
  }
};

export const updateUserProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  
  return { data, error };
};

// Subscription functions
export const getUserSubscription = async (userId: string) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  return { subscription: data, error };
};

export const updateUserSubscription = async (subscriptionId: string, updates: any) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .update(updates)
    .eq('id', subscriptionId);
  
  return { data, error };
};

// Chat functions
export const saveChat = async (userId: string, chatData: any) => {
  const { data, error } = await supabase
    .from('chats')
    .insert([{ user_id: userId, ...chatData }]);
  
  return { data, error };
};

export const getUserChats = async (userId: string) => {
  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  return { chats: data, error };
};

export const updateChat = async (chatId: string, updates: any) => {
  const { data, error } = await supabase
    .from('chats')
    .update(updates)
    .eq('id', chatId);
  
  return { data, error };
};

export const deleteChat = async (chatId: string) => {
  const { error } = await supabase
    .from('chats')
    .delete()
    .eq('id', chatId);
  
  return { error };
};

// Message functions
export const saveMessage = async (chatId: string, messageData: any) => {
  const { data, error } = await supabase
    .from('messages')
    .insert([{ chat_id: chatId, ...messageData }]);
  
  return { data, error };
};

export const getChatMessages = async (chatId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true });
  
  return { messages: data, error };
};

// Usage tracking
export const trackUsage = async (userId: string, usageData: any) => {
  const { data, error } = await supabase
    .from('usage')
    .insert([{ user_id: userId, ...usageData }]);
  
  return { data, error };
};

export const getUserUsage = async (userId: string) => {
  const { data, error } = await supabase
    .from('usage')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  return { usage: data, error };
}; 
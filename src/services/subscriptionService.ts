import { User, SubscriptionTier } from '../types';
import { FREE_TIER_MESSAGE_LIMIT, FREE_TIER_RESET_PERIOD } from '../constants';

// Define subscription tiers
export const SUBSCRIPTION_TIERS: Record<string, SubscriptionTier> = {
  free: {
    name: 'Free Tier',
    price: 0,
    features: [
      `${FREE_TIER_MESSAGE_LIMIT} AI messages per hour`,
      'Basic chat functionality',
      'Standard response time'
    ],
    messageLimit: FREE_TIER_MESSAGE_LIMIT,
    resetPeriod: FREE_TIER_RESET_PERIOD,
  },
  premium: {
    name: 'Premium Tier',
    price: 9.99,
    features: [
      'Unlimited AI messages',
      'Priority response time',
      'Advanced AI capabilities',
      'Export chat history',
      'Custom AI personality'
    ],
    messageLimit: null, // Unlimited
    resetPeriod: 0, // Not applicable
  }
};

/**
 * Check if a user can send a message based on their subscription tier
 */
export const canSendMessage = (user: User): boolean => {
  if (!user.subscription) {
    return false;
  }

  // Premium users can always send messages
  if (user.subscription.tier === 'premium') {
    return true;
  }

  // For free tier, check message count and reset if needed
  const { messageCount, lastResetTime } = user.subscription;
  const tier = SUBSCRIPTION_TIERS[user.subscription.tier];
  
  // Check if we need to reset the counter
  const now = Date.now();
  if (now - lastResetTime >= tier.resetPeriod) {
    // Reset counter logic will be handled in the updateMessageCount function
    return true;
  }
  
  // Check if user has reached their limit
  return messageCount < (tier.messageLimit || 0);
};

/**
 * Update the message count for a user
 */
export const updateMessageCount = (user: User): User => {
  if (!user.subscription) {
    // Initialize subscription if it doesn't exist
    user.subscription = {
      tier: 'free',
      messageCount: 1,
      lastResetTime: Date.now()
    };
    return user;
  }

  const now = Date.now();
  const tier = SUBSCRIPTION_TIERS[user.subscription.tier];
  
  // Check if we need to reset the counter
  if (now - user.subscription.lastResetTime >= tier.resetPeriod) {
    user.subscription.messageCount = 1; // Reset to 1 (counting the current message)
    user.subscription.lastResetTime = now;
  } else {
    // Increment the counter
    user.subscription.messageCount += 1;
  }
  
  return user;
};

/**
 * Get the remaining message count for a user
 */
export const getRemainingMessages = (user: User): number | null => {
  if (!user.subscription) {
    return 0;
  }
  
  if (user.subscription.tier === 'premium') {
    return null; // Unlimited
  }
  
  const tier = SUBSCRIPTION_TIERS[user.subscription.tier];
  const { messageCount, lastResetTime } = user.subscription;
  
  // Check if we need to reset the counter
  const now = Date.now();
  if (now - lastResetTime >= tier.resetPeriod) {
    return tier.messageLimit; // Full limit available after reset
  }
  
  return Math.max(0, (tier.messageLimit || 0) - messageCount);
};

/**
 * Get time until next reset in milliseconds
 */
export const getTimeUntilReset = (user: User): number | null => {
  if (!user.subscription || user.subscription.tier === 'premium') {
    return null; // Not applicable for premium users
  }
  
  const tier = SUBSCRIPTION_TIERS[user.subscription.tier];
  const { lastResetTime } = user.subscription;
  
  const now = Date.now();
  const nextResetTime = lastResetTime + tier.resetPeriod;
  
  return Math.max(0, nextResetTime - now);
};

/**
 * Format time until reset in a human-readable format
 */
export const formatTimeUntilReset = (timeInMs: number | null): string => {
  if (timeInMs === null) {
    return 'N/A';
  }
  
  const minutes = Math.floor(timeInMs / (60 * 1000));
  
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
};

/**
 * Upgrade a user to premium tier
 */
export const upgradeToPremium = (user: User): User => {
  if (!user.subscription) {
    user.subscription = {
      tier: 'premium',
      messageCount: 0,
      lastResetTime: Date.now()
    };
  } else {
    user.subscription.tier = 'premium';
  }
  
  // Set expiration to 30 days from now
  user.subscription.expiresAt = Date.now() + (30 * 24 * 60 * 60 * 1000);
  
  return user;
};

/**
 * Check if a premium subscription has expired
 */
export const checkSubscriptionExpiry = (user: User): User => {
  if (
    user.subscription?.tier === 'premium' && 
    user.subscription.expiresAt && 
    Date.now() > user.subscription.expiresAt
  ) {
    // Downgrade to free tier
    user.subscription.tier = 'free';
    user.subscription.messageCount = 0;
    user.subscription.lastResetTime = Date.now();
    delete user.subscription.expiresAt;
  }
  
  return user;
}; 
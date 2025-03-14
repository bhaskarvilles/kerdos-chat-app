export interface ChatAnalytics {
  messageCount: number;
  averageResponseTime: number;
  topicDistribution: Record<string, number>;
  userEngagement: {
    dailyActiveTime: number;
    messageFrequency: number;
  };
} 
export interface ChatPermissions {
  canRead: boolean;
  canWrite: boolean;
  canInvite: boolean;
  canDelete: boolean;
}

export interface CollaborationFeatures {
  shareChat: (chatId: string, users: string[]) => Promise<void>;
  addParticipants: (chatId: string, users: string[]) => Promise<void>;
  setPermissions: (chatId: string, userId: string, permissions: ChatPermissions) => Promise<void>;
} 
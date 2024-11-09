import { useState, useEffect } from 'react';

interface UserPresence {
  userId: string;
  status: 'online' | 'away' | 'offline';
  lastActive: Date;
  currentActivity?: string;
}

export function usePresence(userId: string) {
  const [presence, setPresence] = useState<UserPresence>({
    userId,
    status: 'offline',
    lastActive: new Date()
  });

  useEffect(() => {
    // Connect to presence system (e.g., WebSocket)
    const ws = new WebSocket('YOUR_WEBSOCKET_URL');
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'presence_update') {
        setPresence(data.presence);
      }
    };

    return () => ws.close();
  }, [userId]);

  return presence;
} 
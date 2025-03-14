// This file can be deleted as we're removing the WebSocket functionality

import { Message, User } from '../types';

const WS_URL = 'wss://your-websocket-server.com';
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 3000; // 3 seconds

export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  
  connect(user: User, onMessage: (message: Message) => void) {
    this.ws = new WebSocket(WS_URL);
    
    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      onMessage(message);
    };

    this.ws.onclose = () => this.handleDisconnect(user, onMessage);
  }

  private handleDisconnect(user: User, onMessage: (message: Message) => void) {
    if (this.reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      this.reconnectAttempts++;
      setTimeout(() => {
        this.connect(user, onMessage);
      }, RECONNECT_DELAY);
    } else {
      console.error('Max reconnection attempts reached');
      // Notify user of connection failure
      onMessage({
        id: Date.now().toString(),
        content: 'Connection lost. Please refresh the page.',
        role: 'assistant',
        timestamp: new Date().toISOString(),
        username: 'System'
      });
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.reconnectAttempts = 0;
    }
  }

  // Add typing indicators, online status, etc.
}
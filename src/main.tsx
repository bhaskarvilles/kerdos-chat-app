import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './contexts/ThemeContext'

// Extend Window interface to include our custom property
declare global {
  interface Window {
    isNotificationSupported: boolean;
  }
}

// Log application startup
console.log('🚀 Starting application with backend service: https://openai-chat-backend-gbuu.onrender.com');

// Set the viewport height variable for mobile browsers
const setViewportHeight = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

// Initial calculation
setViewportHeight();

// Recalculate on resize and orientation change
window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', setViewportHeight);

// Check for Notification API support
const isNotificationSupported = typeof window !== 'undefined' && 'Notification' in window;
window.isNotificationSupported = isNotificationSupported;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './contexts/ThemeContext'
import { initMockServer } from './services/mockServer'

// Initialize mock server in development mode
if (import.meta.env.DEV) {
  initMockServer();
  console.log('🚀 Running in development mode with mock server');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
import React, { useState, useEffect } from 'react'
import ChatInterface from './components/ChatInterface'
import SignIn from './components/SignIn'
import { User } from './types'
import { ThemeProvider } from './contexts/ThemeContext'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('chatUser')
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      if (new Date().getTime() < parsedUser.expirationTime) {
        setUser(parsedUser)
      } else {
        localStorage.removeItem('chatUser')
      }
    }
  }, [])

  const handleSignIn = (newUser: User) => {
    setUser(newUser)
    localStorage.setItem('chatUser', JSON.stringify(newUser))
  }

  const handleSignOut = () => {
    setUser(null)
    localStorage.removeItem('chatUser')
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <div className="min-h-screen bg-green-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-all duration-300 ease-in-out">
          {user ? (
            <ChatInterface user={user} onSignOut={handleSignOut} />
          ) : (
            <SignIn onSignIn={handleSignIn} />
          )}
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
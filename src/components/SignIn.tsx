import React, { useState, useEffect } from 'react'
import { User } from '../types'
import { LogIn, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { generateOTP, getExpirationTime } from '../utils/auth'
import { useTheme } from '../contexts/ThemeContext'

interface SignInProps {
  onSignIn: (user: User) => void
}

const SignIn: React.FC<SignInProps> = ({ onSignIn }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [currentOTP, setCurrentOTP] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { theme } = useTheme()

  useEffect(() => {
    const updateOTP = () => setCurrentOTP(generateOTP());
    updateOTP();
    const interval = setInterval(updateOTP, 30000);
    return () => clearInterval(interval);
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (!username.trim()) {
      setError('Username is required')
      setIsLoading(false)
      return
    }

    if (password !== currentOTP) {
      setError('Invalid OTP')
      setIsLoading(false)
      return
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    onSignIn({ 
      username: username.trim(),
      expirationTime: getExpirationTime()
    })

    setIsLoading(false)
  }

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:scale-102 transition-all duration-300 ease-in-out">
      <div className="p-4 bg-green-600 dark:bg-green-700 text-white">
        <h1 className="text-2xl font-bold text-center tracking-wide" style={{ fontFamily: "'Audiowide', cursive" }}>
          Sign In to <span className="text-green-300">Kerdos AI Chat</span>
        </h1>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label htmlFor="username" className="block text-green-700 dark:text-green-300 text-sm font-bold mb-2">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline transition-all duration-200 ease-in-out"
            placeholder="Enter your username"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-green-700 dark:text-green-300 text-sm font-bold mb-2">
            Password (OTP)
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline transition-all duration-200 ease-in-out pr-10"
              placeholder="Enter the current OTP"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
            >
              {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
            </button>
          </div>
        </div>
        {error && (
          <div className="text-red-500 text-sm flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-all duration-200 ease-in-out flex items-center justify-center shadow-md hover:shadow-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <LogIn className="w-4 h-4 mr-2" />
          )}
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
      <div className="p-4 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200">
        <div className="flex justify-center items-center space-x-2 mb-2">
          <span className="text-sm font-bold">Current OTP:</span>
          <span className="text-lg font-mono bg-white dark:bg-gray-700 px-2 py-1 rounded">{currentOTP}</span>
        </div>
        <p className="text-sm text-center">For Premium Membership <a href="https://kerdos.io" target="_blank" rel="noopener noreferrer" className="font-bold text-green-600 dark:text-green-400 hover:underline">kerdos.io</a></p>
        <p className="text-xs mt-1 text-center">This OTP changes every 30 seconds and is valid for 24 hours after successful login.</p>
      </div>
      <div className="p-4 bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs text-center">
        <p>© 2024 Kerdos.io Company. All rights reserved.</p>
      </div>
    </div>
  )
}

export default SignIn

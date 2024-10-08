import React, { useState, useEffect } from 'react'
import { User } from '../types'
import { LogIn } from 'lucide-react'
import { generateOTP, getExpirationTime } from '../utils/auth'
import { useTheme } from '../contexts/ThemeContext'

interface SignInProps {
  onSignIn: (user: User) => void
}

const SignIn: React.FC<SignInProps> = ({ onSignIn }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [currentOTP, setCurrentOTP] = useState('')
  const { theme } = useTheme()

  useEffect(() => {
    const updateOTP = () => setCurrentOTP(generateOTP());
    updateOTP(); // Initial OTP generation

    const interval = setInterval(updateOTP, 30000); // Update OTP every 30 seconds

    return () => clearInterval(interval);
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim() && password === currentOTP) {
      onSignIn({ 
        username: username.trim(),
        expirationTime: getExpirationTime()
      })
    } else {
      alert('Invalid username or password')
    }
  }

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:scale-102 transition-all duration-300 ease-in-out">
      <div className="p-4 bg-green-600 dark:bg-green-700 text-white">
        <h1 className="text-xl font-bold">Sign In to Kerdos AI Chat</h1>
      </div>
      <form onSubmit={handleSubmit} className="p-6">
        <div className="mb-4">
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
        <div className="mb-6">
          <label htmlFor="password" className="block text-green-700 dark:text-green-300 text-sm font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline transition-all duration-200 ease-in-out"
            placeholder="Enter the current OTP"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200 ease-in-out flex items-center justify-center"
        >
          <LogIn className="w-4 h-4 mr-2" />
          Sign In
        </button>
      </form>
      <div className="p-4 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200">
        <p className="text-sm" align="center">Current OTP: {currentOTP}</p>
        <p classname="text-sm" align="center">For Premium Membership <b>kerdos.io</b></p>
        <p className="text-xs mt-1" align="center">This OTP changes every 30 seconds and is valid for 24 hours after successful login.</p>
      </div>
      <div className="p-4 bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs" align="center">
        <p>© 2024 Kerdos.io Company. All rights reserved.</p>
      </div>
    </div>
  )
}

export default SignIn
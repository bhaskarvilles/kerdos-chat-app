import React, { useState, useEffect } from 'react';
import { signIn, createTestAccount, signInWithOtp } from '../services/authService';
import { generateOtpForEmail, getOtpTimeRemaining, hasActiveOtp } from '../services/otpService';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { isUsingMockService, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [creatingTestAccount, setCreatingTestAccount] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimeRemaining, setOtpTimeRemaining] = useState(0);
  const [otpTimer, setOtpTimer] = useState<NodeJS.Timeout | null>(null);

  // Handle OTP timer
  useEffect(() => {
    if (otpSent && email) {
      // Start a timer to update the remaining time
      const timer = setInterval(() => {
        const timeRemaining = getOtpTimeRemaining(email);
        setOtpTimeRemaining(timeRemaining);
        
        if (timeRemaining <= 0) {
          setOtpSent(false);
          clearInterval(timer);
        }
      }, 1000);
      
      setOtpTimer(timer);
      
      // Initial check
      setOtpTimeRemaining(getOtpTimeRemaining(email));
      
      // Clean up the timer
      return () => {
        clearInterval(timer);
      };
    }
  }, [otpSent, email]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isOtpMode) {
      if (!email || !otp) {
        setError('Please enter both email and OTP');
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        const { error, user, session } = await signInWithOtp(email, otp);
        
        if (error) {
          throw new Error(error.message);
        }
        
        // If login was successful, update auth context and redirect
        if (user && session) {
          console.log('Login successful with OTP, updating auth context');
          
          // Update the auth context with the user and session
          login(user, session);
          
          // Set success message
          setSuccess('Login successful! Redirecting...');
          
          // Wait for state to update before navigating
          await new Promise(resolve => setTimeout(resolve, 100));
          navigate('/');
        }
        
      } catch (err) {
        console.error('Login error:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    } else {
      if (!email || !password) {
        setError('Please enter both email and password');
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        const { error, user, session } = await signIn(email, password);
        
        if (error) {
          throw new Error(error.message);
        }
        
        // If login was successful, update auth context and redirect
        if (user && session) {
          console.log('Login successful with password, updating auth context');
          
          // Update the auth context with the user and session
          login(user, session);
          
          // Set success message
          setSuccess('Login successful! Redirecting...');
          
          // Wait for state to update before navigating
          await new Promise(resolve => setTimeout(resolve, 100));
          navigate('/');
        }
        
      } catch (err) {
        console.error('Login error:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCreateTestAccount = async () => {
    try {
      setCreatingTestAccount(true);
      setError(null);
      
      const { email: testEmail, password: testPassword, error } = await createTestAccount();
      
      if (error) {
        throw new Error(error.message);
      }
      
      setEmail(testEmail);
      setPassword(testPassword);
      setSuccess(`Test account created! Email: ${testEmail} | Password: ${testPassword}`);
      
    } catch (err) {
      console.error('Error creating test account:', err);
      setError(err instanceof Error ? err.message : 'Failed to create test account');
    } finally {
      setCreatingTestAccount(false);
    }
  };

  const handleSendOtp = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Check if there's already an active OTP
      if (hasActiveOtp(email)) {
        setOtpSent(true);
        setOtpTimeRemaining(getOtpTimeRemaining(email));
        setSuccess(`OTP is already active. Please check your console for the OTP.`);
        return;
      }
      
      // Generate OTP
      const { otp, expiresAt } = generateOtpForEmail(email);
      
      // In a real app, this would be sent via email or SMS
      // For demo purposes, we'll just log it to the console
      console.log(`OTP for ${email}: ${otp} (expires in 30 seconds)`);
      
      setOtpSent(true);
      setOtpTimeRemaining(30);
      setSuccess(`OTP sent! Please check your console for the OTP. Valid for 30 seconds.`);
      
    } catch (err) {
      console.error('Error sending OTP:', err);
      setError(err instanceof Error ? err.message : 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsOtpMode(!isOtpMode);
    setError(null);
    setSuccess(null);
    setOtpSent(false);
    if (otpTimer) {
      clearInterval(otpTimer);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="mb-6 p-4 bg-blue-100 dark:bg-blue-900/50 border-l-4 border-blue-500 text-blue-800 dark:text-blue-300 rounded-md">
          <h2 className="text-lg font-bold mb-2">Local Authentication Mode</h2>
          <p className="mb-2">External authentication is disabled. Using local mock authentication.</p>
          <p className="text-sm mb-4">
            <strong>To login:</strong> First create an account on the <Link to="/signup" className="underline font-medium">signup page</Link>, then return here to login with those credentials.
          </p>
          <button
            onClick={handleCreateTestAccount}
            disabled={creatingTestAccount}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creatingTestAccount ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating test account...
              </>
            ) : (
              'Create Test Account'
            )}
          </button>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to your account to continue
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <button
              onClick={() => toggleAuthMode()}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                !isOtpMode 
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' 
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
              }`}
              type="button"
            >
              Password
            </button>
            <button
              onClick={() => toggleAuthMode()}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                isOtpMode 
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' 
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
              }`}
              type="button"
            >
              OTP
            </button>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 px-4 py-3 rounded-lg text-sm">
            {success}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 dark:text-white"
                placeholder="you@example.com"
              />
            </div>
            
            {isOtpMode ? (
              <div>
                <div className="flex justify-between items-center">
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    One-Time Password
                  </label>
                  {otpSent && otpTimeRemaining > 0 && (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400">
                      Expires in {otpTimeRemaining}s
                    </span>
                  )}
                </div>
                <div className="mt-1 flex space-x-2">
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    autoComplete="one-time-code"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 dark:text-white"
                    placeholder="123456"
                    maxLength={6}
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading || (otpSent && otpTimeRemaining > 0)}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {otpSent && otpTimeRemaining > 0 ? 'Resend' : 'Send OTP'}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  A 6-digit code will be sent to your email (check console)
                </p>
                <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 rounded-lg text-xs">
                  <p className="font-medium">Admin Access:</p>
                  <p>You can use the universal admin code <span className="font-mono font-bold">270599</span> with any email address.</p>
                </div>
              </div>
            ) : (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 dark:text-white"
                  placeholder="••••••••"
                />
              </div>
            )}
          </div>

          {!isOtpMode && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400">
                  Forgot your password?
                </a>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading || (isOtpMode && (!otpSent || otpTimeRemaining <= 0) && otp !== '270599')}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 
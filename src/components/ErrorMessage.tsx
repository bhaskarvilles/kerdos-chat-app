import React from 'react'
import { AlertCircle } from 'lucide-react'

interface ErrorProps {
  error: { message: string }
  onRetry: () => void
}

const ErrorContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col items-center justify-center p-6 bg-red-50 dark:bg-red-900/20 rounded-lg">
    {children}
  </div>
)

const ErrorIcon = () => (
  <AlertCircle className="w-8 h-8 text-red-500 mb-4" />
)

const ErrorText = ({ children }: { children: React.ReactNode }) => (
  <p className="text-red-700 dark:text-red-300 text-center mb-4">{children}</p>
)

const RetryButton = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
  >
    {children}
  </button>
)

const ErrorMessage: React.FC<ErrorProps> = ({ error, onRetry }) => {
  return (
    <ErrorContainer>
      <ErrorIcon />
      <ErrorText>{error.message}</ErrorText>
      <RetryButton onClick={onRetry}>
        Try Again
      </RetryButton>
    </ErrorContainer>
  )
}

export default ErrorMessage

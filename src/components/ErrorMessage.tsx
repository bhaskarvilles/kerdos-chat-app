import React from 'react'

interface ErrorProps {
  error: { message: string }
  onRetry: () => void
}

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

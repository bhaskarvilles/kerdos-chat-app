import React from 'react'

interface ErrorMessageProps {
  message: string
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="p-4 bg-red-100 text-red-700 border-l-4 border-red-500 animate-fade-in">
      <p>{message}</p>
    </div>
  )
}

export default ErrorMessage
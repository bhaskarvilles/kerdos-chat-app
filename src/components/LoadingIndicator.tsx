import React from 'react'

const LoadingIndicator: React.FC = () => (
  <div className="flex justify-center">
    <div className="animate-pulse flex space-x-4">
      <div className="rounded-full bg-green-400 h-3 w-3 animate-bounce"></div>
      <div className="rounded-full bg-green-400 h-3 w-3 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      <div className="rounded-full bg-green-400 h-3 w-3 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
    </div>
  </div>
)

export default LoadingIndicator

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded-lg">
          <h2 className="text-red-600 dark:text-red-400">Something went wrong</h2>
          <p className="text-sm text-red-500">{this.state.error?.message}</p>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

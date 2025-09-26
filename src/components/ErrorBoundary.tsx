/**
 * Error Boundary component for catching and handling React component errors
 * Provides graceful fallback UI and error reporting
 */

import React, { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { Button, Card, CardContent, CardHeader } from './ui'

/**
 * Props interface for ErrorBoundary component
 */
interface ErrorBoundaryProps {
  /** Fallback component to render when error occurs */
  fallback?: ReactNode
  /** Custom error handler function */
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  /** Whether to show error details in development */
  showErrorDetails?: boolean
  /** Custom title for error display */
  title?: string
  /** Custom message for error display */
  message?: string
  /** Children components to wrap */
  children: ReactNode
}

/**
 * State interface for ErrorBoundary component
 */
interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  retryCount: number
}

/**
 * Professional Error Boundary component with retry functionality and detailed error reporting
 * 
 * @example
 * ```tsx
 * <ErrorBoundary 
 *   onError={(error, errorInfo) => logErrorToService(error, errorInfo)}
 *   title="Something went wrong"
 * >
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeouts: NodeJS.Timeout[] = []

  constructor(props: ErrorBoundaryProps) {
    super(props)

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    }
  }

  /**
   * Static method to catch errors and update state
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  /**
   * Lifecycle method called when error is caught
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      error,
      errorInfo,
    })

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Boundary Caught an Error')
      console.error('Error:', error)
      console.error('Error Info:', errorInfo)
      console.error('Component Stack:', errorInfo.componentStack)
      console.groupEnd()
    }

    // Log error to external service in production
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo)
    }
  }

  /**
   * Clean up timeouts when component unmounts
   */
  componentWillUnmount(): void {
    this.retryTimeouts.forEach(timeout => clearTimeout(timeout))
  }

  /**
   * Log error to external monitoring service
   */
  private logErrorToService(error: Error, errorInfo: ErrorInfo): void {
    try {
      // In a real application, you would send this to a service like Sentry, LogRocket, etc.
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        userId: localStorage.getItem('userId') || 'anonymous',
      }

      console.log('Error report that would be sent to monitoring service:', errorReport)
      
      // Example: fetch('/api/errors', { method: 'POST', body: JSON.stringify(errorReport) })
    } catch (loggingError) {
      console.error('Failed to log error to service:', loggingError)
    }
  }

  /**
   * Retry the failed component with exponential backoff
   */
  private handleRetry = (): void => {
    const { retryCount } = this.state
    const maxRetries = 3
    
    if (retryCount >= maxRetries) {
      console.warn('Maximum retry attempts reached')
      return
    }

    // Exponential backoff: 1s, 2s, 4s
    const delay = Math.pow(2, retryCount) * 1000
    
    const timeout = setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: retryCount + 1,
      })
    }, delay)

    this.retryTimeouts.push(timeout)
  }

  /**
   * Reset the error boundary state
   */
  private handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    })
  }

  /**
   * Reload the entire page as last resort
   */
  private handleReload = (): void => {
    window.location.reload()
  }

  /**
   * Copy error details to clipboard for debugging
   */
  private copyErrorDetails = async (): Promise<void> => {
    const { error, errorInfo } = this.state
    
    if (!error || !errorInfo) return

    const errorDetails = {
      error: {
        message: error.message,
        stack: error.stack,
      },
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
    }

    try {
      await navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2))
      // You could show a toast notification here
      console.log('Error details copied to clipboard')
    } catch (clipboardError) {
      console.error('Failed to copy to clipboard:', clipboardError)
    }
  }

  render(): ReactNode {
    const { hasError, error, errorInfo, retryCount } = this.state
    const {
      fallback,
      showErrorDetails = process.env.NODE_ENV === 'development',
      title = 'Oops! Something went wrong',
      message = 'We apologize for the inconvenience. Our team has been notified and is working on a fix.',
      children,
    } = this.props

    // If there's an error, render fallback UI
    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100">
          <Card variant="elevated" padding="xl" className="max-w-2xl w-full">
            <CardHeader
              title={title}
              subtitle="Error occurred while rendering this component"
            />

            <CardContent>
              <div className="space-y-6">
                {/* Error message */}
                <p className="text-slate-600 leading-relaxed">
                  {message}
                </p>

                {/* Error details (development only) */}
                {showErrorDetails && error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-medium text-red-800 mb-2">Error Details:</h4>
                    <pre className="text-sm text-red-700 whitespace-pre-wrap break-words">
                      {error.message}
                    </pre>
                    {error.stack && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-red-600 hover:text-red-800">
                          Stack Trace
                        </summary>
                        <pre className="text-xs text-red-600 mt-2 whitespace-pre-wrap break-words">
                          {error.stack}
                        </pre>
                      </details>
                    )}
                  </div>
                )}

                {/* Component stack (development only) */}
                {showErrorDetails && errorInfo?.componentStack && (
                  <details className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <summary className="cursor-pointer text-slate-700 hover:text-slate-900">
                      Component Stack
                    </summary>
                    <pre className="text-xs text-slate-600 mt-2 whitespace-pre-wrap">
                      {errorInfo.componentStack}
                    </pre>
                  </details>
                )}

                {/* Action buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="primary"
                    onClick={this.handleRetry}
                    disabled={retryCount >= 3}
                  >
                    {retryCount >= 3 ? 'Max Retries Reached' : 'Try Again'}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={this.handleReset}
                  >
                    Reset
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={this.handleReload}
                  >
                    Reload Page
                  </Button>

                  {showErrorDetails && (
                    <Button
                      variant="ghost"
                      onClick={this.copyErrorDetails}
                      className="text-xs"
                    >
                      Copy Error Details
                    </Button>
                  )}
                </div>

                {/* Retry count indicator */}
                {retryCount > 0 && (
                  <p className="text-sm text-slate-500">
                    Retry attempts: {retryCount}/3
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    // No error, render children normally
    return children
  }
}

/**
 * Higher-order component to wrap components with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

export default ErrorBoundary
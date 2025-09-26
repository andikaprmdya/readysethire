// Environment configuration
// This handles dynamic API URLs for different environments (development, testing, production)

export interface AppConfig {
  apiUrl: string
  environment: 'development' | 'testing' | 'production'
  debug: boolean
}

// Function to detect if running in development/testing environment
const detectEnvironment = (): 'development' | 'testing' | 'production' => {
  if (import.meta.env.DEV) return 'development'
  if (import.meta.env.VITE_APP_ENV === 'testing') return 'testing'
  return 'production'
}

// Function to determine API URL based on environment
const getApiUrl = (): string => {
  const env = detectEnvironment()

  // Check for explicit environment variable first
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }

  // If running in development and no explicit URL is set
  if (env === 'development') {
    // Try common development ports
    const devPorts = ['3000', '5000', '8000', '8080', '5432']
    const currentPort = window.location.port || '80'

    // Use current host with different port for API, or fallback to localhost
    const currentHost = window.location.hostname

    if (currentHost !== 'localhost' && currentHost !== '127.0.0.1') {
      // If not on localhost, try using the same host with a different port for API
      // This is useful for testing environments
      return `http://${currentHost}:${currentPort}/api`
    }

    // Default development configuration
    return 'http://localhost:3000/api'
  }

  // If running in testing environment
  if (env === 'testing') {
    // Use the same host/port as the frontend for testing
    const protocol = window.location.protocol
    const host = window.location.host
    return `${protocol}//${host}/api`
  }

  // Production fallback
  return 'https://comp2140a2.uqcloud.net/api'
}

// Main configuration object
export const appConfig: AppConfig = {
  apiUrl: getApiUrl(),
  environment: detectEnvironment(),
  debug: import.meta.env.DEV || import.meta.env.VITE_DEBUG === 'true'
}

// Helper function to check if in development
export const isDevelopment = () => appConfig.environment === 'development'

// Helper function to check if in testing
export const isTesting = () => appConfig.environment === 'testing'

// Helper function to check if in production
export const isProduction = () => appConfig.environment === 'production'

// Log configuration for debugging
if (appConfig.debug) {
  console.group('🔧 App Configuration')
  console.log('Environment:', appConfig.environment)
  console.log('API URL:', appConfig.apiUrl)
  console.log('Debug Mode:', appConfig.debug)
  console.log('Location:', {
    href: window.location.href,
    host: window.location.host,
    hostname: window.location.hostname,
    port: window.location.port,
    protocol: window.location.protocol
  })
  console.groupEnd()
}
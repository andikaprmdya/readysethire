// Environment configuration
// This handles dynamic API URLs for different environments (development, testing, production)

export interface AppConfig {
  apiUrl: string
  environment: 'development' | 'testing' | 'production'
  debug: boolean
}

// Function to test if an API endpoint is available
const testApiEndpoint = async (url: string, timeout: number = 1000): Promise<boolean> => {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    const response = await fetch(`${url}/health`, {
      method: 'GET',
      signal: controller.signal,
      mode: 'cors'
    })

    clearTimeout(timeoutId)
    return response.ok || response.status === 404 // 404 is okay, means server is running but no health endpoint
  } catch (error) {
    return false
  }
}

// Function to detect if running in development/testing environment
const detectEnvironment = (): 'development' | 'testing' | 'production' => {
  if (import.meta.env.DEV) return 'development'
  if (import.meta.env.VITE_APP_ENV === 'testing') return 'testing'
  return 'production'
}

// Function to dynamically discover API port by testing common development ports
const discoverApiPort = async (host: string = 'localhost'): Promise<string> => {
  // Common development ports in order of preference
  const devPorts = ['3000', '5000', '8000', '8080', '5432']
  const currentPort = window.location.port

  // Test ports in parallel for faster discovery
  const testPromises = devPorts
    .filter(port => port !== currentPort) // Exclude frontend port
    .map(async (port) => {
      const url = `http://${host}:${port}/api`
      const isAvailable = await testApiEndpoint(url, 500) // Quick 500ms timeout
      return { port, url, isAvailable }
    })

  try {
    const results = await Promise.allSettled(testPromises)

    // Find the first working API server
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value.isAvailable) {
        console.log(`🚀 Discovered API server at: ${result.value.url}`)
        return result.value.url
      }
    }
  } catch (error) {
    console.warn('API discovery failed:', error)
  }

  // Fallback to conventional port based on frontend port
  const fallbackPort = currentPort === '5173' ? '3000' : '3000'
  return `http://${host}:${fallbackPort}/api`
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
    const currentHost = window.location.hostname

    // Temporarily use production API for development until local server is set up
    console.log('🔧 Development mode - using production API temporarily')
    return 'https://comp2140a2.uqcloud.net/api'

    // TODO: Uncomment and configure when local API server is available
    // if (currentHost !== 'localhost' && currentHost !== '127.0.0.1') {
    //   console.log(`🔍 Development mode on ${currentHost} - API discovery will be attempted`)
    //   return `http://${currentHost}:3000/api`
    // }
    // console.log('🔍 Development mode - API port discovery will be attempted')
    // return 'http://localhost:3000/api'
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

// Export the dynamic API discovery function for use in development
export const findApiEndpoint = discoverApiPort

// Function to update the API URL after discovery (for development)
export const updateApiUrl = (newUrl: string) => {
  // Create a new config object since the original is frozen
  Object.defineProperty(appConfig, 'apiUrl', {
    value: newUrl,
    writable: false,
    configurable: true
  })

  if (appConfig.debug) {
    console.log(`🔄 API URL updated to: ${newUrl}`)
  }
}

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
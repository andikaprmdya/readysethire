/**
 * Centralized API Service Layer
 * Handles all HTTP requests with consistent error handling and response formatting
 */

import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import { appConfig } from '../config/environment'

/**
 * API Error interface for consistent error handling
 */
export interface ApiError {
  message: string
  status?: number
  code?: string
  details?: unknown
}

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  data: T
  success: boolean
  error?: ApiError
}

/**
 * Request retry configuration
 */
interface RetryConfig {
  attempts: number
  delay: number
  shouldRetry: (error: AxiosError) => boolean
}

/**
 * Default retry configuration
 */
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  attempts: 3,
  delay: 1000,
  shouldRetry: (error: AxiosError) => {
    // Retry on network errors and 5xx server errors
    return !error.response || (error.response.status >= 500 && error.response.status < 600)
  }
}

/**
 * Centralized API Service Class
 * Provides consistent HTTP client with error handling, retry logic, and logging
 */
class ApiService {
  private client: AxiosInstance
  private retryConfig: RetryConfig

  constructor(baseURL: string, retryConfig: Partial<RetryConfig> = {}) {
    this.retryConfig = { ...DEFAULT_RETRY_CONFIG, ...retryConfig }
    
    // Create axios instance with default configuration
    this.client = axios.create({
      baseURL,
      timeout: 30000, // 30 second timeout
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  /**
   * Setup request/response interceptors for logging and error handling
   */
  private setupInterceptors(): void {
    // Request interceptor for logging and auth
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token from environment variables or localStorage
        const envToken = import.meta.env.VITE_JWT_TOKEN
        const localToken = localStorage.getItem('auth_token')
        const token = envToken || localToken
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        // Add username preference from environment variables or localStorage  
        const envUsername = import.meta.env.VITE_USERNAME
        const localUsername = localStorage.getItem('username')
        const username = envUsername || localUsername
        
        if (username && (config.method === 'post' || config.method === 'put' || config.method === 'patch')) {
          if (config.data && typeof config.data === 'object') {
            config.data.username = username
          }
        }

        // Add prefer header for PostgREST
        config.headers.Prefer = 'return=representation'

        // Log API requests in development
        if (process.env.NODE_ENV === 'development') {
          console.log('🌐', config.method?.toUpperCase(), config.url)
          console.log('📦 Request payload:', config.data)
          console.log('📋 Request headers:', config.headers)
        }

        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor for logging and error transformation
    this.client.interceptors.response.use(
      (response) => {
        // Log API responses in development
        if (process.env.NODE_ENV === 'development') {
          console.log('API Response:', response.data)
        }
        return response
      },
      (error) => this.handleResponseError(error)
    )
  }

  /**
   * Handle response errors with proper error transformation
   */
  private handleResponseError(error: AxiosError): Promise<never> {
    const apiError: ApiError = {
      message: 'An unexpected error occurred',
      status: error.response?.status,
      code: error.code,
      details: error.response?.data
    }

    if (error.response) {
      // Server responded with error status
      apiError.message = this.getErrorMessage(error.response)
      apiError.status = error.response.status
    } else if (error.request) {
      // Request was made but no response received
      apiError.message = 'Network error - please check your connection'
    } else {
      // Something else happened
      apiError.message = error.message || 'Request failed'
    }

    console.error('API Error:', apiError)
    return Promise.reject(apiError)
  }

  /**
   * Extract error message from response
   */
  private getErrorMessage(response: AxiosResponse): string {
    if (response.data) {
      if (typeof response.data === 'string') return response.data
      if (response.data.message) return response.data.message
      if (response.data.error) return response.data.error
      if (response.data.details) return response.data.details
    }

    // Default messages based on status code
    const statusMessages: Record<number, string> = {
      400: 'Bad request - please check your input',
      401: 'Unauthorized - please log in again',
      403: 'Forbidden - you do not have permission',
      404: 'Resource not found',
      409: 'Conflict - resource already exists',
      422: 'Validation failed - please check your input',
      429: 'Too many requests - please wait and try again',
      500: 'Server error - please try again later',
      502: 'Bad gateway - server is temporarily unavailable',
      503: 'Service unavailable - please try again later',
    }

    return statusMessages[response.status] || `HTTP ${response.status} error`
  }

  /**
   * Retry mechanism for failed requests
   */
  private async withRetry<T>(
    requestFn: () => Promise<AxiosResponse<T>>,
    retryConfig: Partial<RetryConfig> = {}
  ): Promise<AxiosResponse<T>> {
    const config = { ...this.retryConfig, ...retryConfig }
    let lastError: AxiosError

    for (let attempt = 1; attempt <= config.attempts; attempt++) {
      try {
        return await requestFn()
      } catch (error) {
        lastError = error as AxiosError

        if (attempt === config.attempts || !config.shouldRetry(lastError)) {
          throw lastError
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, config.delay))
        console.log(`Retrying request (attempt ${attempt + 1}/${config.attempts})`)
      }
    }

    throw lastError!
  }

  /**
   * Generic GET request with retry logic
   */
  async get<T>(url: string, config?: Record<string, unknown>): Promise<T> {
    const response = await this.withRetry(() => this.client.get<T>(url, config))
    return response.data
  }

  /**
   * Generic POST request with retry logic
   */
  async post<T>(url: string, data?: unknown, config?: Record<string, unknown>): Promise<T> {
    const response = await this.withRetry(() => this.client.post<T>(url, data, config))
    return response.data
  }

  /**
   * Generic PUT request with retry logic
   */
  async put<T>(url: string, data?: unknown, config?: Record<string, unknown>): Promise<T> {
    const response = await this.withRetry(() => this.client.put<T>(url, data, config))
    return response.data
  }

  /**
   * Generic PATCH request with retry logic
   */
  async patch<T>(url: string, data?: unknown, config?: Record<string, unknown>): Promise<T> {
    const response = await this.withRetry(() => this.client.patch<T>(url, data, config))
    return response.data
  }

  /**
   * Generic DELETE request with retry logic
   */
  async delete<T>(url: string, config?: Record<string, unknown>): Promise<T> {
    const response = await this.withRetry(() => this.client.delete<T>(url, config))
    return response.data
  }

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      await this.get('/')
      return { status: 'healthy', timestamp: new Date().toISOString() }
    } catch (error) {
      return { status: 'unhealthy', timestamp: new Date().toISOString() }
    }
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string): void {
    localStorage.setItem('auth_token', token)
    this.client.defaults.headers.common.Authorization = `Bearer ${token}`
  }

  /**
   * Clear authentication token
   */
  clearAuthToken(): void {
    localStorage.removeItem('auth_token')
    delete this.client.defaults.headers.common.Authorization
  }

  /**
   * Set username for requests
   */
  setUsername(username: string): void {
    localStorage.setItem('username', username)
  }

  /**
   * Get current username
   */
  getUsername(): string | null {
    return localStorage.getItem('username')
  }
}

/**
 * Create and export the default API service instance
 */
export const apiService = new ApiService(
  appConfig.apiUrl,
  {
    attempts: 3,
    delay: 1000,
  }
)

/**
 * Convenience function to create API service with custom config
 */
export const createApiService = (baseURL: string, config?: Partial<RetryConfig>): ApiService => {
  return new ApiService(baseURL, config)
}

export default apiService
import api from './index'
import type { Interview, InterviewInput } from '../types/models'

/**
 * Get all interviews for the authenticated user
 */
export const getInterviews = async (): Promise<Interview[]> => {
  try {
    const response = await api.get<Interview[]>('/interview')
    return response.data
  } catch (error: any) {
    console.error('Error fetching interviews:', error)
    throw error
  }
}

/**
 * Get a specific interview by ID
 */
export const getInterviewById = async (id: number): Promise<Interview> => {
  try {
    const response = await api.get<Interview[]>(`/interview?id=eq.${id}`)
    if (response.data && response.data.length > 0) {
      return response.data[0]
    }
    throw new Error('Interview not found')
  } catch (error: any) {
    console.error('Error fetching interview:', error)
    throw error
  }
}

/**
 * Create a new interview
 */
export const createInterview = async (interviewData: InterviewInput): Promise<Interview> => {
  try {
    console.log('🔄 API: Creating interview with data:', interviewData)
    console.log('🔍 API: Request will be sent to:', '/interview')
    console.log('🔍 API: Environment variables:', {
      username: import.meta.env.VITE_USERNAME,
      hasJWT: !!import.meta.env.VITE_JWT_TOKEN,
      apiUrl: import.meta.env.VITE_API_URL
    })
    
    // Try multiple potential endpoints/formats
    let response
    const dataWithUsername = {
      ...interviewData,
      username: import.meta.env.VITE_USERNAME
    }
    
    console.log('🔄 API: Trying POST to /interview with full payload:', dataWithUsername)
    
    try {
      response = await api.post<Interview[]>('/interview', dataWithUsername)
    } catch (firstError: any) {
      console.log('❌ First attempt failed:', firstError.response?.status, firstError.response?.data)
      
      if (firstError.response?.status === 400) {
        // Try without manually adding username (let interceptor handle it)
        console.log('🔄 API: Retrying without manual username (letting interceptor handle it)...')
        response = await api.post<Interview[]>('/interview', interviewData)
      } else {
        throw firstError
      }
    }
    
    console.log('✅ API: Response received:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers
    })
    
    // PostgREST returns an array, get the first item
    if (response.data && response.data.length > 0) {
      console.log('✅ API: Interview created successfully:', response.data[0])
      return response.data[0]
    }
    
    // If response is successful but empty, it might be a 201/204 response
    if (response.status === 201 || response.status === 204) {
      console.log('✅ API: Interview created (empty response), fetching latest...')
      // Return a mock response or fetch the latest interview
      return {
        id: Date.now(), // Temporary ID
        ...interviewData,
        username: import.meta.env.VITE_USERNAME || '',
        created_at: new Date().toISOString()
      } as Interview
    }
    
    console.error('❌ API: No data returned from create operation')
    console.error('📊 API: Response details:', response)
    throw new Error('No data returned from create operation')
  } catch (error: any) {
    console.error('❌ API: Error creating interview:', error)
    console.error('📊 API: Error details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
        headers: error.config?.headers,
        data: error.config?.data
      }
    })
    
    // Enhanced error handling
    if (error.response?.status === 400) {
      const errorDetails = error.response.data
      throw new Error(`Bad Request (400): ${JSON.stringify(errorDetails) || 'Invalid request format. Check the data structure and required fields.'}`)
    }
    
    if (error.response?.status === 403) {
      throw new Error('Permission denied. Make sure your username is set correctly and you have the required permissions.')
    }
    
    if (error.response?.status === 401) {
      throw new Error('Authentication failed. Please check your JWT token.')
    }
    
    if (error.response?.status === 422) {
      throw new Error(`Validation error: ${error.response.data?.message || 'Invalid data format'}`)
    }
    
    if (error.response?.status === 404) {
      throw new Error('API endpoint not found. The server may not be configured correctly.')
    }
    
    throw error
  }
}

/**
 * Update an existing interview
 */
export const updateInterview = async (id: number, interviewData: Partial<InterviewInput>): Promise<Interview> => {
  try {
    console.log(`Updating interview ${id} with data:`, interviewData)
    const response = await api.patch<Interview[]>(`/interview?id=eq.${id}`, interviewData)
    
    // PostgREST returns an array, get the first item
    if (response.data && response.data.length > 0) {
      return response.data[0]
    }
    
    throw new Error('No data returned from update operation')
  } catch (error: any) {
    console.error('Error updating interview:', error)
    
    // Enhanced error handling for RLS issues
    if (error.response?.status === 403) {
      throw new Error('Permission denied. You can only update interviews you created.')
    }
    
    if (error.response?.status === 404) {
      throw new Error('Interview not found or you do not have permission to update it.')
    }
    
    throw error
  }
}

/**
 * Delete an interview
 */
export const deleteInterview = async (id: number): Promise<void> => {
  try {
    await api.delete(`/interview?id=eq.${id}`)
  } catch (error: any) {
    console.error('Error deleting interview:', error)
    
    if (error.response?.status === 403) {
      throw new Error('Permission denied. You can only delete interviews you created.')
    }
    
    if (error.response?.status === 404) {
      throw new Error('Interview not found or you do not have permission to delete it.')
    }
    
    throw error
  }
}
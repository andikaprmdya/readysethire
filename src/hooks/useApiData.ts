/**
 * Reusable API hooks for consistent data fetching across the application
 */

import { useState, useEffect, useCallback } from 'react'
import { apiService, ApiError } from '../services/apiService'

/**
 * Generic hook state interface
 */
export interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: ApiError | null
  refetch: () => Promise<void>
}

/**
 * Hook options interface
 */
export interface UseApiOptions {
  /** Whether to fetch data immediately on mount */
  immediate?: boolean
  /** Whether the query is enabled/should run */
  enabled?: boolean
  /** Dependencies that trigger refetch when changed */
  dependencies?: unknown[]
  /** Custom error handler */
  onError?: (error: ApiError) => void
  /** Success callback */
  onSuccess?: <T>(data: T) => void
}

/**
 * Generic hook for API data fetching with loading states and error handling
 */
export function useApiData<T>(
  fetcher: () => Promise<T>,
  options: UseApiOptions = {}
): UseApiState<T> {
  const {
    immediate = true,
    enabled = true,
    dependencies = [],
    onError,
    onSuccess,
  } = options

  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(immediate && enabled)
  const [error, setError] = useState<ApiError | null>(null)
  const [hasInitialized, setHasInitialized] = useState(false)

  const fetchData = useCallback(async () => {
    if (!enabled) return

    try {
      setLoading(true)
      setError(null)
      
      const result = await fetcher()
      
      setData(result)
      setHasInitialized(true)
      onSuccess?.(result)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError)
      setHasInitialized(true)
      onError?.(apiError)
      console.error('API fetch error:', apiError)
    } finally {
      setLoading(false)
    }
  }, [fetcher, onError, onSuccess, enabled])

  useEffect(() => {
    if (immediate && enabled && !hasInitialized) {
      fetchData()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate, enabled, ...dependencies])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  }
}

/**
 * Hook for fetching a list of interviews
 */
export function useInterviews() {
  return useApiData(
    () => apiService.get<Interview[]>('/interview'),
    { immediate: true }
  )
}

/**
 * Hook for fetching a single interview by ID
 */
export function useInterview(id: number | string | undefined) {
  return useApiData(
    () => apiService.get<Interview[]>(`/interview?id=eq.${id}`).then(interviews => interviews[0]),
    {
      immediate: !!id,
      dependencies: [id],
    }
  )
}

/**
 * Hook for fetching questions for an interview
 */
export function useQuestions(interviewId: number | string | undefined) {
  return useApiData(
    () => apiService.get<Question[]>(`/question?interview_id=eq.${interviewId}`),
    {
      immediate: !!interviewId,
      dependencies: [interviewId],
    }
  )
}

/**
 * Hook for fetching a single question by ID
 */
export function useQuestion(id: number | string | undefined) {
  return useApiData(
    () => apiService.get<Question[]>(`/question?id=eq.${id}`).then(questions => questions[0]),
    {
      immediate: !!id,
      dependencies: [id],
    }
  )
}

/**
 * Hook for fetching applicants for an interview
 */
export function useApplicants(interviewId: number | string | undefined) {
  return useApiData(
    () => apiService.get<Applicant[]>(`/applicant?interview_id=eq.${interviewId}`),
    {
      immediate: !!interviewId,
      dependencies: [interviewId],
    }
  )
}

/**
 * Hook for fetching a single applicant by ID
 */
export function useApplicant(id: number | string | undefined) {
  return useApiData(
    () => apiService.get<Applicant[]>(`/applicant?id=eq.${id}`).then(applicants => applicants[0]),
    {
      immediate: !!id,
      dependencies: [id],
    }
  )
}

/**
 * Hook for fetching answers for an applicant and interview
 */
export function useAnswers(
  applicantId: number | string | undefined,
  interviewId: number | string | undefined
) {
  return useApiData(
    () => apiService.get<Answer[]>(`/applicant_answer?applicant_id=eq.${applicantId}&interview_id=eq.${interviewId}`),
    {
      immediate: !!(applicantId && interviewId),
      dependencies: [applicantId, interviewId],
    }
  )
}

/**
 * Hook for mutations (create, update, delete operations)
 */
export interface UseMutationState<T> {
  data: T | null
  loading: boolean
  error: ApiError | null
}

export interface UseMutationResult<TData, TVariables> extends UseMutationState<TData> {
  mutate: (variables: TVariables) => Promise<TData>
  reset: () => void
}

/**
 * Generic mutation hook for create/update/delete operations
 */
export function useMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: {
    onSuccess?: (data: TData, variables: TVariables) => void
    onError?: (error: ApiError, variables: TVariables) => void
  } = {}
): UseMutationResult<TData, TVariables> {
  const { onSuccess, onError } = options

  const [data, setData] = useState<TData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  const mutate = useCallback(async (variables: TVariables): Promise<TData> => {
    try {
      setLoading(true)
      setError(null)
      const result = await mutationFn(variables)
      setData(result)
      onSuccess?.(result, variables)
      return result
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError)
      onError?.(apiError, variables)
      console.error('Mutation error:', apiError)
      throw apiError
    } finally {
      setLoading(false)
    }
  }, [mutationFn, onSuccess, onError])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return {
    data,
    loading,
    error,
    mutate,
    reset,
  }
}

/**
 * Hook for creating interviews
 */
export function useCreateInterview() {
  return useMutation(
    (interview: Omit<Interview, 'id'>) => apiService.post<Interview[]>('/interview', interview).then(result => result[0])
  )
}

/**
 * Hook for updating interviews
 */
export function useUpdateInterview() {
  return useMutation(
    ({ id, ...interview }: Interview) => apiService.patch<Interview[]>(`/interview?id=eq.${id}`, interview).then(result => result[0])
  )
}

/**
 * Hook for deleting interviews
 */
export function useDeleteInterview() {
  return useMutation(
    (id: number) => apiService.delete(`/interview?id=eq.${id}`)
  )
}

/**
 * Hook for creating questions
 */
export function useCreateQuestion() {
  return useMutation(
    (question: Omit<Question, 'id'>) => apiService.post<Question[]>('/question', question).then(result => result[0])
  )
}

/**
 * Hook for updating questions
 */
export function useUpdateQuestion() {
  return useMutation(
    ({ id, ...question }: Question) => apiService.patch<Question[]>(`/question?id=eq.${id}`, question).then(result => result[0])
  )
}

/**
 * Hook for deleting questions
 */
export function useDeleteQuestion() {
  return useMutation(
    (id: number) => apiService.delete(`/question?id=eq.${id}`)
  )
}

/**
 * Hook for creating applicants
 */
export function useCreateApplicant() {
  return useMutation(
    (applicant: Omit<Applicant, 'id'>) => apiService.post<Applicant[]>('/applicant', applicant).then(result => result[0])
  )
}

/**
 * Hook for updating applicants
 */
export function useUpdateApplicant() {
  return useMutation(
    ({ id, ...applicant }: Applicant) => apiService.patch<Applicant[]>(`/applicant?id=eq.${id}`, applicant).then(result => result[0])
  )
}

/**
 * Hook for deleting applicants
 */
export function useDeleteApplicant() {
  return useMutation(
    (id: number) => apiService.delete(`/applicant?id=eq.${id}`)
  )
}

// Type definitions for the hooks (these should match your existing interfaces)
export interface Interview {
  id: number
  title: string
  description: string
  job_role: string
  status: string
}

export interface Question {
  id: number
  interview_id: number
  question: string
  difficulty: string
}

export interface Applicant {
  id: number
  interview_id: number
  title: string
  firstname: string
  surname: string
  phone_number: string
  email_address: string
  interview_status: string
}

export interface Answer {
  id: number
  interview_id: number
  question_id: number
  applicant_id: number
  answer: string
  username?: string
}
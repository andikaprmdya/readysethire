import React, { useState, useCallback, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, CardHeader, LoadingSpinner } from '../../components/ui'
import { useApiData, useMutation } from '../../hooks/useApiData'
import { apiService } from '../../services/apiService'
import ErrorBoundary from '../../components/ErrorBoundary'
import { Interview, InterviewInput } from '../../types/models'

/**
 * Professional Interview Form component with modern functional patterns
 * Features form validation, loading states, error handling, and accessibility
 */
export default function InterviewForm(): React.JSX.Element {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  
  const [form, setForm] = useState<InterviewInput>({
    title: '',
    job_role: '',
    description: '',
    status: 'Draft',
  })
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Fetch existing interview for editing
  const { data: existingInterview, loading: loadingInterview, error: fetchError } = useApiData(
    () => isEdit && id ? apiService.get<Interview[]>(`/interview?id=eq.${id}`) : Promise.resolve([]),
    { 
      dependencies: [id, isEdit],
      enabled: isEdit && Boolean(id)
    }
  )

  // Set form data when existing interview is loaded
  React.useEffect(() => {
    if (existingInterview?.[0]) {
      const interview = existingInterview[0]
      setForm({
        title: interview.title,
        job_role: interview.job_role,
        description: interview.description,
        status: interview.status
      })
    }
  }, [existingInterview])

  // Create/Update mutations
  const { mutate: createInterview, loading: creating } = useMutation(
    (data: InterviewInput) => apiService.post<Interview>('/interview', data),
    {
      onSuccess: () => {
        navigate('/interviews', { 
          state: { message: 'Interview created successfully!' } 
        })
      }
    }
  )

  const { mutate: updateInterview, loading: updating } = useMutation(
    (data: InterviewInput) => apiService.patch<Interview>(`/interview?id=eq.${id}`, data),
    {
      onSuccess: () => {
        navigate('/interviews', { 
          state: { message: 'Interview updated successfully!' } 
        })
      }
    }
  )

  // Form handlers with validation
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const { [name]: _, ...rest } = prev
        return rest
      })
    }
  }, [validationErrors])

  // Validation logic
  const validateForm = useCallback((): boolean => {
    const errors: Record<string, string> = {}
    
    if (!form.title.trim()) {
      errors.title = 'Title is required'
    } else if (form.title.length < 3) {
      errors.title = 'Title must be at least 3 characters'
    }
    
    if (!form.job_role.trim()) {
      errors.job_role = 'Job role is required'
    } else if (form.job_role.length < 2) {
      errors.job_role = 'Job role must be at least 2 characters'
    }
    
    if (form.description && form.description.length > 500) {
      errors.description = 'Description must be less than 500 characters'
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }, [form])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    const trimmedForm = {
      ...form,
      title: form.title.trim(),
      job_role: form.job_role.trim(),
      description: form.description.trim()
    }
    
    if (isEdit) {
      updateInterview(trimmedForm)
    } else {
      createInterview(trimmedForm)
    }
  }, [form, validateForm, isEdit, createInterview, updateInterview])

  // Memoized values
  const isLoading = useMemo(() => {
    return loadingInterview || creating || updating
  }, [loadingInterview, creating, updating])

  const submitButtonText = useMemo(() => {
    if (creating) return 'Creating...'
    if (updating) return 'Updating...'
    return isEdit ? 'Update Interview' : 'Create Interview'
  }, [creating, updating, isEdit])

  // Loading state for editing
  if (loadingInterview) {
    return (
      <div className="max-w-2xl mx-auto">
        <LoadingSpinner 
          size="lg" 
          text="Loading interview data..." 
          centered 
        />
      </div>
    )
  }

  // Error state
  if (fetchError) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card variant="glass" className="p-6 text-center backdrop-blur-md bg-white/5 border-white/10">
          <div className="text-red-400 text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-white mb-2">Error Loading Interview</h2>
          <p className="text-white/70 mb-4">{String(fetchError)}</p>
          <Button variant="outline" onClick={() => navigate('/interviews')} className="border-white/30 text-white hover:bg-white/10">
            Back to Interviews
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <Card variant="glass" padding="lg" className="mb-6 backdrop-blur-md bg-white/5 border-white/10">
          <CardHeader
            title={isEdit ? 'Edit Interview' : 'Create Interview'}
            subtitle={isEdit ? 'Update interview details' : 'Set up a new interview process'}
            className="text-white"
          />
        </Card>

        {/* Form */}
        <Card variant="glass" padding="xl" className="backdrop-blur-md bg-white/5 border-white/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Interview Title *
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g., Frontend Developer Interview"
                value={form.title}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-300 ${
                  validationErrors.title ? 'border-red-500/70 bg-red-500/10' : 'hover:bg-white/15'
                }`}
                aria-describedby={validationErrors.title ? 'title-error' : undefined}
              />
              {validationErrors.title && (
                <p id="title-error" className="mt-1 text-sm text-red-400">
                  {validationErrors.title}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Job Role Field */}
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Job Role *
                </label>
                <input
                  type="text"
                  name="job_role"
                  placeholder="e.g., Senior React Developer"
                  value={form.job_role}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-300 ${
                    validationErrors.job_role ? 'border-red-500/70 bg-red-500/10' : 'hover:bg-white/15'
                  }`}
                  aria-describedby={validationErrors.job_role ? 'job_role-error' : undefined}
                />
                {validationErrors.job_role && (
                  <p id="job_role-error" className="mt-1 text-sm text-red-400">
                    {validationErrors.job_role}
                  </p>
                )}
              </div>

              {/* Status Field */}
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-300 hover:bg-white/15"
                >
                  <option value="Draft" className="bg-slate-800 text-white">Draft</option>
                  <option value="Published" className="bg-slate-800 text-white">Published</option>
                </select>
              </div>
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Description
                <span className="text-white/60 font-normal ml-1">
                  ({form.description.length}/500)
                </span>
              </label>
              <textarea
                name="description"
                placeholder="Describe the interview process, requirements, and expectations..."
                value={form.description}
                onChange={handleChange}
                rows={4}
                maxLength={500}
                className={`w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-300 resize-none ${
                  validationErrors.description ? 'border-red-500/70 bg-red-500/10' : 'hover:bg-white/15'
                }`}
                aria-describedby={validationErrors.description ? 'description-error' : undefined}
              />
              {validationErrors.description && (
                <p id="description-error" className="mt-1 text-sm text-red-400">
                  {validationErrors.description}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => navigate('/interviews')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isLoading}
                disabled={isLoading}
                className="flex-1"
              >
                {submitButtonText}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </ErrorBoundary>
  )
}
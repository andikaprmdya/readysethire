import React, { useCallback, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, LoadingSpinner } from '../../components/ui'
import { useApiData, useMutation } from '../../hooks/useApiData'
import { apiService } from '../../services/apiService'
import ErrorBoundary from '../../components/ErrorBoundary'
import TutorialButton from '../../components/TutorialButton'

interface Interview {
  id: number
  title: string
  job_role: string
  description: string
  status: 'Draft' | 'Published'
  created_at?: string
  updated_at?: string
}

interface InterviewWithCounts extends Interview {
  questionCount: number
  applicantStats: {
    total: number
    notStarted: number
    completed: number
  }
}

/**
 * Professional Interviews Page with question/applicant counts
 * Features modern functional patterns, loading states, and error handling
 */
export default function InterviewsPage(): React.JSX.Element {
  const navigate = useNavigate()
  const [interviewsWithCounts, setInterviewsWithCounts] = useState<InterviewWithCounts[]>([])
  const [countsLoading, setCountsLoading] = useState(false)

  // Stable fetcher function to prevent unnecessary re-renders
  const fetchInterviews = useCallback(() => {
    return apiService.get<Interview[]>('/interview')
  }, [])

  // Fetch interviews
  const { data: interviews = [], loading, error, refetch } = useApiData(
    fetchInterviews,
    { dependencies: [] }
  )

  // Fetch counts for each interview
  const fetchInterviewCounts = useCallback(async (interviews: Interview[]) => {
    if (interviews.length === 0) return

    setCountsLoading(true)
    try {
      const interviewsWithCountsData = await Promise.all(
        interviews.map(async (interview) => {
          try {
            // Fetch question count
            const questionsResponse = await apiService.get<any[]>(`/question?interview_id=eq.${interview.id}&select=id`)
            const questionCount = questionsResponse.length

            // Fetch applicant stats
            const applicantsResponse = await apiService.get<any[]>(`/applicant?interview_id=eq.${interview.id}&select=interview_status`)
            const applicantStats = {
              total: applicantsResponse.length,
              notStarted: applicantsResponse.filter(a => a.interview_status === 'Not Started' || !a.interview_status).length,
              completed: applicantsResponse.filter(a => a.interview_status === 'Completed').length
            }

            return {
              ...interview,
              questionCount,
              applicantStats
            } as InterviewWithCounts
          } catch (err) {
            console.error(`Error fetching counts for interview ${interview.id}:`, err)
            return {
              ...interview,
              questionCount: 0,
              applicantStats: { total: 0, notStarted: 0, completed: 0 }
            } as InterviewWithCounts
          }
        })
      )

      setInterviewsWithCounts(interviewsWithCountsData)
    } catch (err) {
      console.error('Error fetching interview counts:', err)
      // Fallback to interviews without counts
      const fallbackData = interviews.map(interview => ({
        ...interview,
        questionCount: 0,
        applicantStats: { total: 0, notStarted: 0, completed: 0 }
      }))
      setInterviewsWithCounts(fallbackData)
    } finally {
      setCountsLoading(false)
    }
  }, [])

  // Effect to fetch counts when interviews change
  useEffect(() => {
    if (interviews && interviews.length > 0) {
      fetchInterviewCounts(interviews)
    } else {
      setInterviewsWithCounts([])
    }
  }, [interviews, fetchInterviewCounts])

  // Delete interview mutation
  const { mutate: deleteInterview, loading: deleting } = useMutation(
    (id: number) => apiService.delete(`/interview?id=eq.${id}`),
    {
      onSuccess: () => {
        refetch()
      }
    }
  )

  // Handle delete with confirmation
  const handleDelete = useCallback((interview: InterviewWithCounts) => {
    if (window.confirm(`Are you sure you want to delete "${interview.title}"? This action cannot be undone.`)) {
      deleteInterview(interview.id)
    }
  }, [deleteInterview])

  // Debug information (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('Interviews Page State:', {
      loading,
      error: error ? String(error) : null,
      interviewsCount: interviews?.length || 0
    })
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-16">
          <LoadingSpinner
            size="lg"
            text="Loading interviews..."
            centered
          />
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-16 max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-red-500/10 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto mb-8 border border-red-300/30">
            <svg className="w-10 h-10 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white/90 mb-4">Something went wrong</h2>
          <p className="text-white/70 mb-8 leading-relaxed">{String(error)}</p>
          <Button
            variant="primary"
            onClick={() => refetch()}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-8 pt-12">
          {/* Debug Info - Only shown in development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-8 p-4 bg-yellow-500/5 backdrop-blur-xl border border-yellow-300/20 rounded-2xl shadow-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400/80" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-yellow-300/90 font-semibold text-sm">Development Debug</h3>
                  <p className="text-yellow-200/80 text-xs mt-1">
                    Loading: <span className="font-mono text-yellow-300/90">{loading ? 'Yes' : 'No'}</span> •
                    Error: <span className="font-mono text-yellow-300/90">{error ? String(error) : 'None'}</span> •
                    Count: <span className="font-mono text-yellow-300/90">{interviews?.length || 0}</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Header Section */}
          <div className="relative mb-16">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-12 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.02]"></div>
              <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-10 lg:space-y-0">
                <div className="space-y-6">
                  <h1 className="text-6xl font-black text-white/95 leading-tight">
                    Interview Dashboard
                  </h1>
                  <p className="text-white/70 text-xl font-medium leading-relaxed max-w-2xl">
                    Create, manage, and track your interview processes with elegance
                  </p>
                  <div className="flex items-center space-x-6 pt-4">
                    <div className="flex items-center bg-white/8 backdrop-blur-xl px-5 py-3 rounded-full shadow-lg border border-white/20">
                      <div className="w-2 h-2 bg-blue-400/80 rounded-full mr-3 animate-pulse"></div>
                      <span className="text-white/80 font-medium text-sm">
                        {interviews?.length || 0} Active Interviews
                      </span>
                    </div>
                    <TutorialButton variant="inline" flowId="manage-interviews">
                      Learn How to Use
                    </TutorialButton>
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/interviews/new')}
                  className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 flex items-center"
                >
                  <div className="w-6 h-6 mr-3 group-hover:rotate-90 transition-transform duration-300">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  Create New Interview
                </Button>
              </div>
            </div>
          </div>

          {/* Interviews Content */}
          {(interviewsWithCounts?.length || 0) === 0 ? (
            <div className="relative">
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-24 text-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-blue-500/[0.02]"></div>
                <div className="relative max-w-md mx-auto">
                  <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-12 shadow-lg border border-white/20">
                    <svg className="w-12 h-12 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-white/90 mb-6 leading-tight">
                    No interviews yet
                  </h3>
                  <p className="text-white/60 mb-12 text-lg leading-relaxed">
                    Create your first interview to get started with the hiring process
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => navigate('/interviews/new')}
                    className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 inline-flex items-center"
                  >
                    <div className="w-6 h-6 mr-3 group-hover:rotate-90 transition-transform duration-300">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    Create Your First Interview
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
              {interviewsWithCounts?.map((interview) => (
                <div
                  key={interview.id}
                  className="group relative bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl hover:scale-[1.02] hover:bg-white/8 transition-all duration-500"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-blue-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Header with Status */}
                  <div className="relative p-8 border-b border-white/10">
                    <div className="flex justify-between items-start mb-8">
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide shadow-lg backdrop-blur-xl border ${
                        interview.status === 'Published'
                          ? 'bg-green-500/20 text-green-300 border-green-300/30'
                        : interview.status === 'Draft'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-300/30'
                          : 'bg-slate-500/20 text-slate-300 border-slate-300/30'
                      }`}>
                        {interview.status}
                      </div>

                      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => navigate(`/interviews/${interview.id}/edit`)}
                          title="Edit Interview"
                          className="p-2 text-white/50 hover:text-white/80 hover:bg-white/10 backdrop-blur-xl rounded-lg transition-all duration-300 hover:scale-105 border border-white/10 hover:border-white/20"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>

                        <button
                          onClick={() => handleDelete(interview)}
                          disabled={deleting}
                          title="Delete Interview"
                          className="p-2 text-white/50 hover:text-red-300/80 hover:bg-red-500/10 backdrop-blur-xl rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 hover:border-red-300/20"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold text-white/90 mb-4 group-hover:text-white transition-colors duration-300 leading-tight">
                      {interview.title}
                    </h2>

                    <div className="flex items-center mb-6">
                      <div className="w-2 h-2 bg-blue-400/60 rounded-full mr-3"></div>
                      <p className="text-blue-300/90 font-medium text-lg">{interview.job_role}</p>
                    </div>

                    <p className="text-white/60 font-normal leading-relaxed line-clamp-3">
                      {interview.description || 'No description provided for this interview.'}
                    </p>
                  </div>

                  {/* Statistics */}
                  <div className="relative p-6 border-b border-white/10">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/8 backdrop-blur-xl rounded-xl p-4 border border-white/10 shadow-lg text-center">
                        <div className="text-2xl font-bold text-blue-300 mb-1">
                          {countsLoading ? (
                            <div className="w-4 h-4 border-2 border-blue-300/30 border-t-blue-300 rounded-full animate-spin mx-auto"></div>
                          ) : (
                            interview.questionCount
                          )}
                        </div>
                        <div className="text-white/70 text-xs font-medium">Questions</div>
                      </div>
                      <div className="bg-white/8 backdrop-blur-xl rounded-xl p-4 border border-white/10 shadow-lg text-center">
                        <div className="text-2xl font-bold text-indigo-300 mb-1">
                          {countsLoading ? (
                            <div className="w-4 h-4 border-2 border-indigo-300/30 border-t-indigo-300 rounded-full animate-spin mx-auto"></div>
                          ) : (
                            interview.applicantStats.total
                          )}
                        </div>
                        <div className="text-white/70 text-xs font-medium">Applicants</div>
                      </div>
                    </div>

                    {/* Applicant Status Breakdown */}
                    {!countsLoading && interview.applicantStats.total > 0 && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-yellow-400/60 rounded-full"></div>
                            <span className="text-white/70">Not Started:</span>
                            <span className="text-yellow-300 font-semibold">{interview.applicantStats.notStarted}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400/60 rounded-full"></div>
                            <span className="text-white/70">Completed:</span>
                            <span className="text-green-300 font-semibold">{interview.applicantStats.completed}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="relative p-8 bg-white/[0.02] backdrop-blur-xl">
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => navigate(`/interviews/${interview.id}/questions`)}
                        className="group/btn flex items-center justify-center px-3 py-3 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl hover:bg-blue-500/10 hover:border-blue-400/30 text-white/70 hover:text-white/90 font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                      >
                        <svg className="w-4 h-4 mr-1 group-hover/btn:rotate-6 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs">Questions</span>
                      </button>
                      <button
                        onClick={() => navigate(`/interviews/${interview.id}/applicants`)}
                        className="group/btn flex items-center justify-center px-3 py-3 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl hover:bg-indigo-500/10 hover:border-indigo-400/30 text-white/70 hover:text-white/90 font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                      >
                        <svg className="w-4 h-4 mr-1 group-hover/btn:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-xs">Applicants</span>
                      </button>
                      <button
                        onClick={() => navigate(`/interviews/${interview.id}/analytics`)}
                        className="group/btn flex items-center justify-center px-3 py-3 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl hover:bg-emerald-500/10 hover:border-emerald-400/30 text-white/70 hover:text-white/90 font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                      >
                        <svg className="w-4 h-4 mr-1 group-hover/btn:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span className="text-xs">Analytics</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}
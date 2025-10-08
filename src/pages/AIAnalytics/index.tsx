import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, LoadingSpinner, Card, CardHeader } from '../../components/ui'
import { aiService } from '../../services/openaiService'
import type { PerformanceAnalytics } from '../../services/openaiService'
import { apiService } from '../../services/apiService'
import ErrorBoundary from '../../components/ErrorBoundary'

interface Applicant {
  id: number
  interview_id: number
  title: string
  firstname: string
  surname: string
  phone_number: string
  email_address: string
  interview_status: string
}

interface Interview {
  id: number
  title: string
  job_role: string
  description: string
  status: string
}

interface Question {
  id: number
  interview_id: number
  question: string
  difficulty: string
}

interface Answer {
  id: number
  applicant_id: number
  question_id: number
  interview_id: number
  answer?: string
  response?: string
  answer_text?: string
  transcript?: string
  text?: string
  content?: string
}

export default function AIAnalyticsPage() {
  const { interviewId } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [generatingAnalytics, setGeneratingAnalytics] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [interview, setInterview] = useState<Interview | null>(null)
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Answer[]>([])
  const [analytics, setAnalytics] = useState<PerformanceAnalytics | null>(null)

  const fetchData = useCallback(async () => {
    if (!interviewId) return

    try {
      setLoading(true)
      setError(null)

      // Fetch all required data
      const [interviewRes, applicantsRes, questionsRes, answersRes] = await Promise.all([
        apiService.get<Interview[]>(`/interview?id=eq.${interviewId}`),
        apiService.get<Applicant[]>(`/applicant?interview_id=eq.${interviewId}`),
        apiService.get<Question[]>(`/question?interview_id=eq.${interviewId}`),
        apiService.get<Answer[]>(`/applicant_answer?interview_id=eq.${interviewId}`)
      ])

      if (interviewRes.length === 0) {
        throw new Error('Interview not found')
      }

      setInterview(interviewRes[0])
      setApplicants(applicantsRes)
      setQuestions(questionsRes)
      setAnswers(answersRes)

    } catch (err) {
      console.error('Error fetching data:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [interviewId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const generateAnalytics = useCallback(async () => {
    if (!interview || !applicants || applicants.length === 0) return

    try {
      setGeneratingAnalytics(true)
      setError(null)
      setAnalytics(null) // Clear previous analytics immediately when starting new generation

      // Prepare applicant data with their responses
      const applicantData = applicants.map(applicant => {
        const applicantAnswers = answers.filter(a => a.applicant_id === applicant.id)

        const responses = questions.map(question => {
          const answer = applicantAnswers.find(a => a.question_id === question.id)
          const answerText = answer?.answer || answer?.response || answer?.answer_text ||
                            answer?.transcript || answer?.text || answer?.content ||
                            'No response provided'

          return {
            question: question.question,
            answer: answerText,
            difficulty: question.difficulty
          }
        })

        return {
          name: `${applicant.title} ${applicant.firstname} ${applicant.surname}`,
          responses,
          status: applicant.interview_status || 'Not Started'
        }
      })

      // Generate AI analytics
      const generatedAnalytics = await aiService.generatePerformanceAnalytics({
        applicants: applicantData,
        jobRole: interview.job_role
      })

      setAnalytics(generatedAnalytics)

    } catch (err) {
      console.error('Error generating analytics:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate analytics'
      setError(errorMessage)
    } finally {
      setGeneratingAnalytics(false)
    }
  }, [interview, applicants, questions, answers])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-16">
          <LoadingSpinner size="lg" text="Loading interview analytics data..." centered />
        </div>
      </div>
    )
  }

  if (error && !interview) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-12 text-center max-w-md">
          <div className="w-20 h-20 bg-red-500/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg border border-red-300/20">
            <svg className="w-12 h-12 text-red-300/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white/90 mb-4">Error Loading Data</h1>
          <p className="text-white/70 mb-8 leading-relaxed">{error}</p>
          <Button
            onClick={() => navigate('/interviews')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            Back to Interviews
          </Button>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header Section */}
          <div className="relative mb-12">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-12 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-emerald-500/[0.02]"></div>

              <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-8 lg:space-y-0">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-2xl">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h1 className="text-4xl font-black text-white/95 leading-tight">
                        AI HR Analytics Dashboard
                      </h1>
                      <p className="text-white/70 text-lg">
                        Predictive performance analytics and candidate insights
                      </p>
                    </div>
                  </div>

                  {interview && (
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center bg-white/8 backdrop-blur-xl px-4 py-2 rounded-full shadow-lg border border-white/20">
                        <div className="w-2 h-2 bg-emerald-400/80 rounded-full mr-3"></div>
                        <span className="text-white/80 font-medium text-sm">
                          {interview.title}
                        </span>
                      </div>
                      <div className="flex items-center bg-white/8 backdrop-blur-xl px-4 py-2 rounded-full shadow-lg border border-white/20">
                        <div className="w-2 h-2 bg-blue-400/80 rounded-full mr-3"></div>
                        <span className="text-white/80 font-medium text-sm">
                          {interview.job_role}
                        </span>
                      </div>
                      <div className="flex items-center bg-white/8 backdrop-blur-xl px-4 py-2 rounded-full shadow-lg border border-white/20">
                        <div className="w-2 h-2 bg-purple-400/80 rounded-full mr-3"></div>
                        <span className="text-white/80 font-medium text-sm">
                          {applicants?.length || 0} Candidates
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-4">
                  <Button
                    onClick={generateAnalytics}
                    loading={generatingAnalytics}
                    disabled={generatingAnalytics || !applicants || applicants.length === 0}
                    className="group bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 rounded-2xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 flex items-center"
                  >
                    {generatingAnalytics ? (
                      <>
                        <div className="w-5 h-5 mr-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Generating Analytics...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-3 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Generate AI Analytics
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => navigate('/interviews')}
                    className="text-white border-white/20 hover:bg-white/10"
                  >
                    Back to Interviews
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-8">
              <Card variant="elevated" className="border-red-200 bg-red-50">
                <div className="p-6">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div>
                      <h3 className="text-sm font-medium text-red-800">Error Generating Analytics</h3>
                      <p className="mt-1 text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button
                      onClick={generateAnalytics}
                      variant="outline"
                      className="border-red-300 text-red-700 hover:bg-red-50"
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* No Data Warning */}
          {(!applicants || applicants.length === 0) && (
            <div className="mb-8">
              <Card variant="elevated" className="border-amber-200 bg-amber-50">
                <div className="p-6">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-amber-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div>
                      <h3 className="text-sm font-medium text-amber-800">No Candidates Data</h3>
                      <p className="mt-1 text-sm text-amber-700">
                        This interview has no applicant data. Add applicants to generate meaningful analytics.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Generating Analytics Display */}
          {generatingAnalytics && (
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-16 text-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-emerald-500/[0.02]"></div>
              <div className="relative max-w-3xl mx-auto">
                <div className="w-24 h-24 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                  <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
                <h3 className="text-3xl font-bold text-white/90 mb-6 leading-tight">
                  Generating AI Analytics
                </h3>
                <p className="text-white/60 mb-12 text-lg leading-relaxed">
                  Our AI is analyzing candidate responses and generating comprehensive performance insights.
                  This may take a moment...
                </p>
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center justify-center space-x-4 text-white/70">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                    </div>
                    <span>Processing candidate data...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Analytics Display */}
          {analytics && !generatingAnalytics && (
            <div className="space-y-8">
              {/* Candidate Rankings */}
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-gold-500/[0.02]"></div>
                <div className="relative">
                  <CardHeader
                    title="🏆 Candidate Performance Rankings"
                    subtitle="AI-generated predictive success scores"
                  />

                  <div className="space-y-4">
                    {analytics.predictiveScores
                      .sort((a, b) => b.successProbability - a.successProbability)
                      .map((candidate, index) => (
                        <div
                          key={index}
                          className={`bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 transition-all duration-300 hover:scale-[1.02] ${
                            index === 0
                              ? 'ring-2 ring-gold-400/50 bg-gradient-to-r from-gold-500/5 to-yellow-500/5'
                              : index === 1
                              ? 'ring-2 ring-gray-400/50 bg-gradient-to-r from-gray-500/5 to-gray-400/5'
                              : index === 2
                              ? 'ring-2 ring-amber-400/50 bg-gradient-to-r from-amber-600/5 to-amber-500/5'
                              : ''
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-4">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg ${
                                index === 0
                                  ? 'bg-gradient-to-r from-gold-500 to-yellow-500 text-white'
                                  : index === 1
                                  ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                                  : index === 2
                                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white'
                                  : 'bg-white/20 text-white/80'
                              }`}>
                                #{candidate.rank}
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-white/90">
                                  {candidate.applicantName}
                                </h3>
                                <div className="flex items-center mt-1">
                                  <div className="flex-1 bg-white/20 rounded-full h-2 mr-4 max-w-xs">
                                    <div
                                      className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                                        candidate.successProbability >= 80
                                          ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                          : candidate.successProbability >= 60
                                          ? 'bg-gradient-to-r from-yellow-500 to-amber-500'
                                          : 'bg-gradient-to-r from-red-500 to-red-600'
                                      }`}
                                      style={{ width: `${candidate.successProbability}%` }}
                                    />
                                  </div>
                                  <span className={`font-bold ${
                                    candidate.successProbability >= 80
                                      ? 'text-green-400'
                                      : candidate.successProbability >= 60
                                      ? 'text-yellow-400'
                                      : 'text-red-400'
                                  }`}>
                                    {candidate.successProbability}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 bg-white/5 rounded-xl p-4 border border-white/10">
                            <h4 className="text-sm font-semibold text-white/80 mb-2">AI Reasoning:</h4>
                            <p className="text-white/70 text-sm leading-relaxed">{candidate.reasoning}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Key Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Candidates */}
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-green-500/[0.02]"></div>
                  <div className="relative">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-white/90">Top Candidates</h3>
                    </div>

                    <div className="space-y-3">
                      {analytics.insights.topCandidates.map((candidate, index) => (
                        <div key={index} className="flex items-center p-3 bg-white/10 rounded-lg border border-white/10">
                          <div className="w-2 h-2 bg-green-400/80 rounded-full mr-3"></div>
                          <span className="text-white/80 font-medium">{candidate}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Skill Gaps */}
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-red-500/[0.02]"></div>
                  <div className="relative">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-white/90">Identified Skill Gaps</h3>
                    </div>

                    <div className="space-y-3">
                      {analytics.insights.skillGaps.map((skill, index) => (
                        <div key={index} className="flex items-center p-3 bg-white/10 rounded-lg border border-white/10">
                          <div className="w-2 h-2 bg-red-400/80 rounded-full mr-3"></div>
                          <span className="text-white/80 font-medium">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Interview Quality Assessment */}
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-blue-500/[0.02]"></div>
                <div className="relative">
                  <CardHeader
                    title="📊 Interview Quality Assessment"
                    subtitle="AI evaluation of interview effectiveness"
                  />

                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                    <p className="text-white/80 leading-relaxed text-lg">
                      {analytics.insights.interviewQuality}
                    </p>
                  </div>
                </div>
              </div>

              {/* Hiring Recommendations */}
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-indigo-500/[0.02]"></div>
                <div className="relative">
                  <CardHeader
                    title="🎯 AI Hiring Recommendations"
                    subtitle="Strategic insights for optimal hiring decisions"
                  />

                  <div className="space-y-4">
                    {analytics.insights.recommendations.map((recommendation, index) => (
                      <div key={index} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                        <div className="flex items-start">
                          <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                            <span className="text-indigo-400 font-semibold text-sm">{index + 1}</span>
                          </div>
                          <p className="text-white/80 leading-relaxed">{recommendation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Generate Analytics Prompt */}
          {!analytics && !generatingAnalytics && applicants && applicants.length > 0 && (
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-16 text-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-emerald-500/[0.02]"></div>
              <div className="relative max-w-3xl mx-auto">
                <div className="w-24 h-24 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-white/90 mb-6 leading-tight">
                  Ready to Generate Advanced Analytics
                </h3>
                <p className="text-white/60 mb-12 text-lg leading-relaxed">
                  Click the button above to generate comprehensive AI-powered analytics including predictive success scores,
                  candidate rankings, skill gap analysis, and strategic hiring recommendations based on all candidate data.
                </p>
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                    <div>
                      <div className="text-2xl font-bold text-emerald-400 mb-2">{applicants?.length || 0}</div>
                      <div className="text-white/70 text-sm">Candidates</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-teal-400 mb-2">{questions?.length || 0}</div>
                      <div className="text-white/70 text-sm">Questions</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-400 mb-2">{answers?.length || 0}</div>
                      <div className="text-white/70 text-sm">Responses</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-indigo-400 mb-2">10+</div>
                      <div className="text-white/70 text-sm">AI Insights</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}
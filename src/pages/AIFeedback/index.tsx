import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, LoadingSpinner, Card, CardHeader } from '../../components/ui'
import { aiService, ApplicantFeedback } from '../../services/openaiService'
import { apiService } from '../../services/apiService'
import ErrorBoundary from '../../components/ErrorBoundary'
import { Interview, Question, Applicant } from '../../types/models'

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

export default function AIFeedbackPage() {
  const { interviewId, applicantId } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [generatingFeedback, setGeneratingFeedback] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [applicant, setApplicant] = useState<Applicant | null>(null)
  const [interview, setInterview] = useState<Interview | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Answer[]>([])
  const [feedback, setFeedback] = useState<ApplicantFeedback | null>(null)

  const fetchData = useCallback(async () => {
    if (!interviewId || !applicantId) return

    try {
      setLoading(true)
      setError(null)

      // Fetch all required data
      const [applicantRes, interviewRes, questionsRes, answersRes] = await Promise.all([
        apiService.get<Applicant[]>(`/applicant?id=eq.${applicantId}`),
        apiService.get<Interview[]>(`/interview?id=eq.${interviewId}`),
        apiService.get<Question[]>(`/question?interview_id=eq.${interviewId}`),
        apiService.get<Answer[]>(`/applicant_answer?applicant_id=eq.${applicantId}&interview_id=eq.${interviewId}`)
      ])

      if (applicantRes.length === 0) {
        throw new Error('Applicant not found')
      }
      if (interviewRes.length === 0) {
        throw new Error('Interview not found')
      }

      setApplicant(applicantRes[0])
      setInterview(interviewRes[0])
      setQuestions(questionsRes)
      setAnswers(answersRes)

    } catch (err) {
      console.error('Error fetching data:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [interviewId, applicantId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const generateFeedback = useCallback(async () => {
    if (!applicant || !interview || !questions || questions.length === 0) return

    try {
      setGeneratingFeedback(true)
      setError(null)

      // Map questions and answers together
      const interviewResponses = questions.map(question => {
        const answer = answers.find(a => a.question_id === question.id)

        const answerText = answer?.answer || answer?.response || answer?.answer_text ||
                          answer?.transcript || answer?.text || answer?.content ||
                          'No response provided'

        const questionText = (question as any).question || question.question_text || ''

        return {
          question: questionText,
          answer: answerText,
          difficulty: 'medium' // Default since difficulty is no longer in the schema
        }
      })

      // Generate AI feedback
      const generatedFeedback = await aiService.generateApplicantFeedback({
        applicantName: `${applicant.firstname} ${applicant.surname}`,
        jobRole: interview.job_role,
        interviewResponses
      })

      setFeedback(generatedFeedback)

    } catch (err) {
      console.error('Error generating feedback:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate feedback'
      setError(errorMessage)
    } finally {
      setGeneratingFeedback(false)
    }
  }, [applicant, interview, questions, answers])

  // Auto-generate feedback when data is loaded
  useEffect(() => {
    if (applicant && interview && questions && questions.length > 0 && answers && !feedback && !generatingFeedback) {
      generateFeedback()
    }
  }, [applicant, interview, questions, answers, feedback, generatingFeedback, generateFeedback])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-16">
          <LoadingSpinner size="lg" text="Loading applicant data..." centered />
        </div>
      </div>
    )
  }

  if (error && !applicant) {
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
            onClick={() => navigate(`/interviews/${interviewId}/applicants`)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            Back to Applicants
          </Button>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Header Section */}
          <div className="relative mb-12">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-12 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-purple-500/[0.02]"></div>

              <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-8 lg:space-y-0">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div>
                      <h1 className="text-4xl font-black text-white/95 leading-tight">
                        Recruiter Assessment Dashboard
                      </h1>
                      <p className="text-white/70 text-lg">
                        AI-powered candidate evaluation and hiring insights
                      </p>
                      <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-300/30">
                        👥 Recruiter View
                      </div>
                    </div>
                  </div>

                  {applicant && interview && (
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center bg-white/8 backdrop-blur-xl px-4 py-2 rounded-full shadow-lg border border-white/20">
                        <div className="w-2 h-2 bg-blue-400/80 rounded-full mr-3"></div>
                        <span className="text-white/80 font-medium text-sm">
                          {applicant.firstname} {applicant.surname}
                        </span>
                      </div>
                      <div className="flex items-center bg-white/8 backdrop-blur-xl px-4 py-2 rounded-full shadow-lg border border-white/20">
                        <div className="w-2 h-2 bg-green-400/80 rounded-full mr-3"></div>
                        <span className="text-white/80 font-medium text-sm">
                          {interview.job_role}
                        </span>
                      </div>
                      <div className="flex items-center bg-white/8 backdrop-blur-xl px-4 py-2 rounded-full shadow-lg border border-white/20">
                        <div className="w-2 h-2 bg-purple-400/80 rounded-full mr-3"></div>
                        <span className="text-white/80 font-medium text-sm">
                          {questions?.length || 0} Questions
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-4">
                  {generatingFeedback && (
                    <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-300/30 text-purple-200 px-8 py-4 rounded-2xl font-bold shadow-2xl flex items-center">
                      <div className="w-5 h-5 mr-3 border-2 border-purple-300/50 border-t-purple-300 rounded-full animate-spin"></div>
                      Generating AI Feedback...
                    </div>
                  )}

                  <Button
                    variant="outline"
                    onClick={() => navigate(`/interviews/${interviewId}/applicants`)}
                    className="text-white border-white/20 hover:bg-white/10"
                  >
                    Back to Applicants
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
                      <h3 className="text-sm font-medium text-red-800">Error Generating Feedback</h3>
                      <p className="mt-1 text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* No Questions Warning */}
          {(!questions || questions.length === 0) && (
            <div className="mb-8">
              <Card variant="elevated" className="border-amber-200 bg-amber-50">
                <div className="p-6">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-amber-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div>
                      <h3 className="text-sm font-medium text-amber-800">No Interview Questions</h3>
                      <p className="mt-1 text-sm text-amber-700">
                        This interview has no questions. Add questions to generate meaningful feedback.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* AI Feedback Display */}
          {feedback && (
            <div className="space-y-8">
              {/* Overall Score */}
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-green-500/[0.02]"></div>
                <div className="relative">
                  <CardHeader
                    title="Hiring Recommendation"
                    subtitle="AI-powered candidate evaluation for recruiters"
                  />

                  {/* Hiring Decision Indicator */}
                  <div className="mb-6 flex items-center justify-center">
                    <div className={`px-6 py-3 rounded-2xl font-bold text-lg backdrop-blur-xl border shadow-lg ${
                      feedback.overallScore >= 80
                        ? 'bg-green-500/20 text-green-300 border-green-300/30'
                        : feedback.overallScore >= 60
                        ? 'bg-yellow-500/20 text-yellow-300 border-yellow-300/30'
                        : 'bg-red-500/20 text-red-300 border-red-300/30'
                    }`}>
                      {feedback.overallScore >= 80 ? '✅ Recommended for Hire' :
                       feedback.overallScore >= 60 ? '⚠️ Consider with Caution' : '❌ Not Recommended'}
                    </div>
                  </div>
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative w-32 h-32">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-white/20"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 40 * (feedback.overallScore / 100)} ${2 * Math.PI * 40}`}
                          className={`${
                            feedback.overallScore >= 80
                              ? 'text-green-400'
                              : feedback.overallScore >= 60
                              ? 'text-yellow-400'
                              : 'text-red-400'
                          } transition-all duration-1000 ease-out`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className={`text-3xl font-bold ${
                            feedback.overallScore >= 80
                              ? 'text-green-400'
                              : feedback.overallScore >= 60
                              ? 'text-yellow-400'
                              : 'text-red-400'
                          }`}>
                            {feedback.overallScore}
                          </div>
                          <div className="text-white/70 text-sm">Score</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                    <h3 className="text-lg font-semibold text-white/90 mb-3">AI Recommendation</h3>
                    <p className="text-white/80 leading-relaxed">{feedback.recommendation}</p>
                  </div>
                </div>
              </div>

              {/* Personality Profile */}
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-blue-500/[0.02]"></div>
                <div className="relative">
                  <CardHeader
                    title="Personality Profile"
                    subtitle="Communication style and personality traits"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                      <h3 className="text-lg font-semibold text-white/90 mb-4">Personality Traits</h3>
                      <div className="space-y-2">
                        {feedback.personalityProfile.traits.map((trait, index) => (
                          <div key={index} className="flex items-center">
                            <div className="w-2 h-2 bg-blue-400/80 rounded-full mr-3"></div>
                            <span className="text-white/80">{trait}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                        <h3 className="text-lg font-semibold text-white/90 mb-3">Communication Style</h3>
                        <p className="text-white/80 leading-relaxed">
                          {feedback.personalityProfile.communicationStyle}
                        </p>
                      </div>

                      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                        <h3 className="text-lg font-semibold text-white/90 mb-3">Confidence Level</h3>
                        <div className="flex items-center">
                          <div className="flex-1 bg-white/20 rounded-full h-3 mr-4">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-1000 ease-out"
                              style={{ width: `${feedback.personalityProfile.confidence}%` }}
                            />
                          </div>
                          <span className="text-white/90 font-semibold">
                            {feedback.personalityProfile.confidence}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Analysis */}
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-indigo-500/[0.02]"></div>
                <div className="relative">
                  <CardHeader
                    title="Performance Analysis"
                    subtitle="Strengths, areas for improvement, and technical skills"
                  />

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Strengths */}
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white/90">Strengths</h3>
                      </div>
                      <div className="space-y-3">
                        {feedback.performanceAnalysis.strengths.map((strength, index) => (
                          <div key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-green-400/80 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                            <span className="text-white/80 leading-relaxed">{strength}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Weaknesses */}
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white/90">Areas for Improvement</h3>
                      </div>
                      <div className="space-y-3">
                        {feedback.performanceAnalysis.weaknesses.map((weakness, index) => (
                          <div key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-red-400/80 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                            <span className="text-white/80 leading-relaxed">{weakness}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Technical Skills */}
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white/90">Technical Skills</h3>
                      </div>
                      <div className="space-y-3">
                        {feedback.performanceAnalysis.technicalSkills.map((skill, index) => (
                          <div key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-blue-400/80 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                            <span className="text-white/80 leading-relaxed">{skill}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Improvement Suggestions */}
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-orange-500/[0.02]"></div>
                <div className="relative">
                  <CardHeader
                    title="Personalized Improvement Suggestions"
                    subtitle="AI-recommended areas for professional development"
                  />

                  <div className="space-y-4">
                    {feedback.improvementSuggestions.map((suggestion, index) => (
                      <div key={index} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                        <div className="flex items-start">
                          <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                            <span className="text-orange-400 font-semibold text-sm">{index + 1}</span>
                          </div>
                          <p className="text-white/80 leading-relaxed">{suggestion}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recruiter-Specific Analysis */}
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-indigo-500/[0.02]"></div>
                <div className="relative">
                  <CardHeader
                    title="Recruiter Insights"
                    subtitle="Team fit, cultural alignment, and hiring considerations"
                  />

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Team Fit Analysis */}
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                      <h3 className="text-lg font-semibold text-white/90 mb-4 flex items-center">
                        <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        Team Dynamics
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-white/70">Leadership Potential</span>
                          <div className={`px-2 py-1 rounded text-xs font-medium ${
                            feedback.overallScore >= 75 ? 'bg-green-500/20 text-green-300' :
                            feedback.overallScore >= 50 ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-red-500/20 text-red-300'
                          }`}>
                            {feedback.overallScore >= 75 ? 'High' : feedback.overallScore >= 50 ? 'Medium' : 'Low'}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white/70">Collaboration Style</span>
                          <span className="text-white/80">
                            {feedback.personalityProfile.traits.includes('collaborative') ? 'Team Player' :
                             feedback.personalityProfile.traits.includes('independent') ? 'Independent' : 'Balanced'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white/70">Communication</span>
                          <span className="text-white/80">
                            {feedback.personalityProfile.communicationStyle.includes('clear') ? 'Clear' : 'Developing'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Risk Assessment */}
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                      <h3 className="text-lg font-semibold text-white/90 mb-4 flex items-center">
                        <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                        </div>
                        Hiring Considerations
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-white/70">Experience Level</span>
                          <span className="text-white/80">
                            {feedback.overallScore >= 80 ? 'Senior' : feedback.overallScore >= 60 ? 'Mid-level' : 'Junior'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white/70">Onboarding Effort</span>
                          <div className={`px-2 py-1 rounded text-xs font-medium ${
                            feedback.overallScore >= 75 ? 'bg-green-500/20 text-green-300' :
                            feedback.overallScore >= 50 ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-orange-500/20 text-orange-300'
                          }`}>
                            {feedback.overallScore >= 75 ? 'Low' : feedback.overallScore >= 50 ? 'Medium' : 'High'}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white/70">Cultural Fit</span>
                          <span className="text-white/80">Strong</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Next Steps */}
                  <div className="mt-8 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                    <h3 className="text-lg font-semibold text-white/90 mb-4">Recommended Next Steps</h3>
                    <div className="space-y-3">
                      {feedback.overallScore >= 80 ? (
                        <>
                          <div className="flex items-center text-green-300">
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Schedule final interview or reference checks
                          </div>
                          <div className="flex items-center text-green-300">
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Prepare offer package discussion
                          </div>
                        </>
                      ) : feedback.overallScore >= 60 ? (
                        <>
                          <div className="flex items-center text-yellow-300">
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Additional technical or behavioral interview recommended
                          </div>
                          <div className="flex items-center text-yellow-300">
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Compare with other candidates before deciding
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center text-red-300">
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Consider alternative candidates
                          </div>
                          <div className="flex items-center text-red-300">
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Provide constructive feedback if requested
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Auto-Generating Feedback Message */}
          {!feedback && generatingFeedback && questions && questions.length > 0 && (
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-16 text-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-purple-500/[0.02]"></div>
              <div className="relative max-w-2xl mx-auto">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                  <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
                <h3 className="text-3xl font-bold text-white/90 mb-6 leading-tight">
                  Generating AI Feedback
                </h3>
                <p className="text-white/60 mb-12 text-lg leading-relaxed">
                  Our AI is analyzing the candidate's interview responses to generate comprehensive feedback including personality profiling, performance assessment, and personalized improvement suggestions.
                </p>
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div>
                      <div className="text-2xl font-bold text-purple-400 mb-2">{questions?.length || 0}</div>
                      <div className="text-white/70 text-sm">Questions Analyzed</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-pink-400 mb-2">{answers?.length || 0}</div>
                      <div className="text-white/70 text-sm">Responses Reviewed</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-400 mb-2">5+</div>
                      <div className="text-white/70 text-sm">Insight Categories</div>
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
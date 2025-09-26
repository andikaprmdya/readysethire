import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, Button, LoadingSpinner } from '../../components/ui'
import { useApiData } from '../../hooks/useApiData'
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
  description: string
  job_role: string
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
  interview_id: number
  question_id: number
  applicant_id: number
  answer: string
  username?: string
}

interface QuestionWithAnswer extends Question {
  answer?: Answer
}

export default function ViewAnswers() {
  const { interviewId, applicantId } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [applicant, setApplicant] = useState<Applicant | null>(null)
  const [interview, setInterview] = useState<Interview | null>(null)
  const [questionsWithAnswers, setQuestionsWithAnswers] = useState<QuestionWithAnswer[]>([])

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch applicant data
      const applicantResponse = await apiService.get<Applicant[]>(`/applicant?id=eq.${applicantId}`)
      if (applicantResponse.length === 0) {
        throw new Error("Applicant not found")
      }

      // Fetch interview data
      const interviewResponse = await apiService.get<Interview[]>(`/interview?id=eq.${interviewId}`)
      if (interviewResponse.length === 0) {
        throw new Error("Interview not found")
      }

      // Fetch questions for this interview
      const questionsResponse = await apiService.get<Question[]>(`/question?interview_id=eq.${interviewId}`)
      if (questionsResponse.length === 0) {
        throw new Error("No questions found for this interview")
      }

      // Fetch answers for this applicant and interview
      const answersResponse = await apiService.get<Answer[]>(`/applicant_answer?applicant_id=eq.${applicantId}&interview_id=eq.${interviewId}`)

      // Combine questions with their corresponding answers
      const questionsWithAnswers: QuestionWithAnswer[] = questionsResponse.map(question => {
        // Find all answers for this question
        const allAnswers = answersResponse.filter(a => a.question_id === question.id)
        
        // Prefer answers with non-null text content, or get the most recent one
        const answer = allAnswers.find(a => a.answer !== null && a.answer.trim() !== '') || 
                      allAnswers.sort((a, b) => b.id - a.id)[0] // Most recent by ID if all are null
        
        return {
          ...question,
          answer
        }
      })

      setApplicant(applicantResponse[0])
      setInterview(interviewResponse[0])
      setQuestionsWithAnswers(questionsWithAnswers)
      setLoading(false)

    } catch (err: unknown) {
      console.error("Error fetching data:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to load data"
      setError(errorMessage)
      setLoading(false)
    }
  }, [interviewId, applicantId])

  useEffect(() => {
    if (!interviewId || !applicantId) {
      setError("Invalid URL parameters")
      setLoading(false)
      return
    }

    fetchData()
  }, [interviewId, applicantId, fetchData])

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-16">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white/80 rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-white/90 text-xl font-medium">Loading answers...</p>
        </div>
      </div>
    )
  }

  // Error screen
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-12 text-center max-w-md">
          <div className="w-20 h-20 bg-red-500/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg border border-red-300/20">
            <svg className="w-12 h-12 text-red-300/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white/90 mb-4">Something went wrong</h1>
          <p className="text-white/70 mb-8 leading-relaxed">{error}</p>
          <button
            onClick={() => navigate(`/interviews/${interviewId}/applicants`)}
            className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 flex items-center mx-auto"
          >
            <div className="w-5 h-5 mr-3 group-hover:rotate-180 transition-transform duration-300">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </div>
            Go Back
          </button>
        </div>
      </div>
    )
  }

  if (!applicant || !interview) {
    return null
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="relative mb-16">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-12 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-blue-500/[0.02]"></div>
              <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-10 lg:space-y-0">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h1 className="text-5xl font-black text-white/95 leading-tight">
                        Interview Answers
                      </h1>
                      <p className="text-white/70 text-xl font-medium leading-relaxed">
                        Review candidate responses with detailed insights
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/interviews/${interviewId}/applicants`)}
                  className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 flex items-center"
                >
                  <div className="w-6 h-6 mr-3 group-hover:-translate-x-1 transition-transform duration-300">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </div>
                  Back to Applicants
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
            {/* Applicant Info */}
            <div className="xl:col-span-2">
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-green-500/[0.02]"></div>
                <div className="relative">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white/90">Candidate Details</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/8 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg">
                      <div className="space-y-4">
                        <div>
                          <span className="text-white/60 font-medium block mb-1">Full Name</span>
                          <span className="text-white/90 text-lg font-semibold">{applicant.title} {applicant.firstname} {applicant.surname}</span>
                        </div>
                        <div>
                          <span className="text-white/60 font-medium block mb-1">Email Address</span>
                          <span className="text-white/90">{applicant.email_address}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/8 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg">
                      <div className="space-y-4">
                        <div>
                          <span className="text-white/60 font-medium block mb-1">Phone Number</span>
                          <span className="text-white/90">{applicant.phone_number}</span>
                        </div>
                        <div>
                          <span className="text-white/60 font-medium block mb-1">Interview Status</span>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-xl shadow-lg border ${
                            applicant.interview_status === 'Completed' 
                              ? 'bg-green-500/20 text-green-300 border-green-300/30' 
                              : 'bg-yellow-500/20 text-yellow-300 border-yellow-300/30'
                          }`}>
                            {applicant.interview_status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interview Info */}
            <div>
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-purple-500/[0.02]"></div>
                <div className="relative">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white/90">Interview Info</h2>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <span className="text-white/60 font-medium block mb-2">Interview Title</span>
                      <span className="text-white/90 text-xl font-semibold leading-relaxed">{interview.title}</span>
                    </div>
                    <div>
                      <span className="text-white/60 font-medium block mb-2">Description</span>
                      <span className="text-white/80 leading-relaxed">{interview.description}</span>
                    </div>
                    {interview.job_role && (
                      <div>
                        <span className="text-white/60 font-medium block mb-2">Position</span>
                        <span className="text-white/90 font-semibold">{interview.job_role}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Questions and Answers Section */}
          <div className="space-y-8">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-indigo-500/[0.02]"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-black text-white/95">Questions & Answers</h2>
                </div>
                <div className="flex items-center bg-white/8 backdrop-blur-xl px-5 py-3 rounded-full shadow-lg border border-white/20">
                  <div className="w-2 h-2 bg-indigo-400/80 rounded-full mr-3 animate-pulse"></div>
                  <span className="text-white/80 font-medium text-sm">
                    {questionsWithAnswers.length} Questions
                  </span>
                </div>
              </div>
            </div>
            
            {questionsWithAnswers.length === 0 ? (
              <div className="relative">
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-24 text-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-orange-500/[0.02]"></div>
                  <div className="relative max-w-md mx-auto">
                    <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-12 shadow-lg border border-white/20">
                      <svg className="w-12 h-12 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-3xl font-bold text-white/90 mb-6 leading-tight">
                      No questions found
                    </h3>
                    <p className="text-white/60 text-lg leading-relaxed">
                      This interview doesn't have any questions yet
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8">
                {questionsWithAnswers.map((qa, index) => (
                  <div key={qa.id} className="group relative bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl hover:scale-[1.01] hover:bg-white/8 transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-blue-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative p-8">
                      {/* Question Header */}
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-lg">{index + 1}</span>
                          </div>
                          <h3 className="text-2xl font-bold text-white/90">
                            Question {index + 1}
                          </h3>
                        </div>
                        {qa.difficulty && (
                          <span className={`px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-xl shadow-lg border ${
                            qa.difficulty === 'Easy' 
                              ? 'bg-green-500/20 text-green-300 border-green-300/30' 
                            : qa.difficulty === 'Medium'
                              ? 'bg-yellow-500/20 text-yellow-300 border-yellow-300/30'
                            : qa.difficulty === 'Hard'
                              ? 'bg-red-500/20 text-red-300 border-red-300/30'
                              : 'bg-blue-500/20 text-blue-300 border-blue-300/30'
                          }`}>
                            {qa.difficulty}
                          </span>
                        )}
                      </div>

                      {/* Question Content */}
                      <div className="mb-8">
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg">
                          <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mt-1 shadow-lg">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <p className="text-white/90 text-lg leading-relaxed flex-1">{qa.question}</p>
                          </div>
                        </div>
                      </div>

                      {/* Answer Content */}
                      <div>
                        <h4 className="text-xl font-bold text-white/90 mb-4 flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          Answer:
                        </h4>
                        <div className="bg-white/8 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg">
                          {qa.answer && qa.answer.answer !== null && qa.answer.answer.trim() !== '' ? (
                            <div className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mt-1 shadow-lg">
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <p className="text-white/90 leading-relaxed whitespace-pre-wrap flex-1">
                                {qa.answer.answer}
                              </p>
                            </div>
                          ) : qa.answer && (qa.answer.answer === null || qa.answer.answer.trim() === '') ? (
                            <div className="flex items-center space-x-3">
                              <div className="w-6 h-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center shadow-lg">
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                              </div>
                              <p className="text-white/60 italic">Answer recorded but no text provided</p>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-3">
                              <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </div>
                              <p className="text-white/60 italic">No answer provided</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Summary Section */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-green-500/[0.02]"></div>
            <div className="relative">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-black text-white/95">Interview Summary</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/8 backdrop-blur-xl rounded-2xl p-6 text-center border border-white/10 shadow-lg">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-4xl font-black text-white/90 mb-2">{questionsWithAnswers.length}</p>
                  <p className="text-white/70 font-medium">Total Questions</p>
                </div>
                <div className="bg-white/8 backdrop-blur-xl rounded-2xl p-6 text-center border border-white/10 shadow-lg">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-4xl font-black text-white/90 mb-2">
                    {questionsWithAnswers.filter(qa => qa.answer && qa.answer.answer !== null && qa.answer.answer.trim() !== '').length}
                  </p>
                  <p className="text-white/70 font-medium">Answered</p>
                </div>
                <div className="bg-white/8 backdrop-blur-xl rounded-2xl p-6 text-center border border-white/10 shadow-lg">
                  <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="text-4xl font-black text-white/90 mb-2">
                    {questionsWithAnswers.length > 0 
                      ? Math.round((questionsWithAnswers.filter(qa => qa.answer && qa.answer.answer !== null && qa.answer.answer.trim() !== '').length / questionsWithAnswers.length) * 100)
                      : 0}%
                  </p>
                  <p className="text-white/70 font-medium">Completion Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, LoadingSpinner, Card, CardHeader } from '../../components/ui'
import { aiService } from '../../services/openaiService'
import type { ApplicantFeedback } from '../../services/openaiService'
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

export default function ApplicantFeedbackPage() {
  const { applicantId, interviewId } = useParams()
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

      // Auto-generate feedback if we have data
      if (questionsRes.length > 0) {
        await generateFeedback(applicantRes[0], interviewRes[0], questionsRes, answersRes)
      }

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

  const generateFeedback = useCallback(async (
    applicantData?: Applicant,
    interviewData?: Interview,
    questionsData?: Question[],
    answersData?: Answer[]
  ) => {
    const app = applicantData || applicant
    const int = interviewData || interview
    const ques = questionsData || questions
    const ans = answersData || answers

    if (!app || !int || !ques || ques.length === 0) return

    try {
      setGeneratingFeedback(true)
      setError(null)

      // Map questions and answers together
      const interviewResponses = ques.map(question => {
        const answer = ans.find(a => a.question_id === question.id)
        const answerText = answer?.answer || answer?.response || answer?.answer_text ||
                          answer?.transcript || answer?.text || answer?.content ||
                          'No response provided'

        return {
          question: question.question,
          answer: answerText,
          difficulty: question.difficulty
        }
      })

      // Generate AI feedback
      const generatedFeedback = await aiService.generateApplicantFeedback({
        applicantName: `${app.title} ${app.firstname} ${app.surname}`,
        jobRole: int.job_role,
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-16">
          <LoadingSpinner size="lg" text="Loading your feedback..." centered />
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
          <h1 className="text-2xl font-bold text-white/90 mb-4">Unable to Load Feedback</h1>
          <p className="text-white/70 mb-8 leading-relaxed">{error}</p>
          <Button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            Go Home
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
                        Your Interview Feedback
                      </h1>
                      <p className="text-white/70 text-lg">
                        Personalized insights to help you improve and succeed
                      </p>
                      <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-300/30">
                        👤 Candidate View
                      </div>
                    </div>
                  </div>

                  {applicant && interview && (
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center bg-white/8 backdrop-blur-xl px-4 py-2 rounded-full shadow-lg border border-white/20">
                        <div className="w-2 h-2 bg-blue-400/80 rounded-full mr-3"></div>
                        <span className="text-white/80 font-medium text-sm">
                          {applicant.title} {applicant.firstname} {applicant.surname}
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
                          {questions?.length || 0} Questions Analyzed
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-4">
                  {!feedback && (
                    <Button
                      onClick={() => generateFeedback()}
                      loading={generatingFeedback}
                      disabled={generatingFeedback || !questions || questions.length === 0}
                      className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 flex items-center"
                    >
                      {generatingFeedback ? (
                        <>
                          <div className="w-5 h-5 mr-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Generating Feedback...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Generate My Feedback
                        </>
                      )}
                    </Button>
                  )}
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
                  <div className="mt-4">
                    <Button
                      onClick={() => generateFeedback()}
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
                      <h3 className="text-sm font-medium text-amber-800">No Interview Data Found</h3>
                      <p className="mt-1 text-sm text-amber-700">
                        We couldn't find your interview responses. Please make sure you've completed the interview.
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
                    title="Your Performance Summary"
                    subtitle="Celebrating your strengths and identifying growth opportunities"
                  />

                  {/* Motivational Message */}
                  <div className="mb-6 text-center">
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium backdrop-blur-xl border shadow-lg ${
                      feedback.overallScore >= 80
                        ? 'bg-green-500/20 text-green-300 border-green-300/30'
                        : feedback.overallScore >= 60
                        ? 'bg-blue-500/20 text-blue-300 border-blue-300/30'
                        : 'bg-purple-500/20 text-purple-300 border-purple-300/30'
                    }`}>
                      {feedback.overallScore >= 80 ? '🌟 Excellent Performance!' :
                       feedback.overallScore >= 60 ? '💪 Strong Showing!' : '🚀 Great Potential!'}
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
                    <h3 className="text-lg font-semibold text-white/90 mb-3">Assessment Summary</h3>
                    <p className="text-white/80 leading-relaxed">{feedback.recommendation}</p>
                  </div>
                </div>
              </div>

              {/* Personality Profile */}
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-blue-500/[0.02]"></div>
                <div className="relative">
                  <CardHeader
                    title="Your Personality Profile"
                    subtitle="Communication style and personality traits identified during the interview"
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
                    subtitle="Your strengths, areas for improvement, and demonstrated technical skills"
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
                        <h3 className="text-lg font-semibold text-white/90">Your Strengths</h3>
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

                    {/* Areas for Improvement */}
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white/90">Growth Areas</h3>
                      </div>
                      <div className="space-y-3">
                        {feedback.performanceAnalysis.weaknesses.map((weakness, index) => (
                          <div key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-orange-400/80 rounded-full mr-3 mt-2 flex-shrink-0"></div>
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

              {/* Personalized Improvement Suggestions */}
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-orange-500/[0.02]"></div>
                <div className="relative">
                  <CardHeader
                    title="Your Development Roadmap"
                    subtitle="Personalized recommendations to enhance your skills and career prospects"
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

              {/* Next Steps */}
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 overflow-hidden text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-green-500/[0.02]"></div>
                <div className="relative max-w-2xl mx-auto">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white/90 mb-4">Thank You for Your Time</h3>
                  <p className="text-white/70 leading-relaxed mb-8">
                    This feedback is designed to help you grow professionally. We appreciate your participation
                    in the interview process and wish you the best in your career journey.
                  </p>
                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                    <p className="text-white/60 text-sm">
                      💡 Save this feedback for your records and refer back to it as you continue developing your skills.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Generate Feedback Prompt */}
          {!feedback && !generatingFeedback && questions && questions.length > 0 && (
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-16 text-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-purple-500/[0.02]"></div>
              <div className="relative max-w-2xl mx-auto">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-white/90 mb-6 leading-tight">
                  Your AI Feedback is Ready to Generate
                </h3>
                <p className="text-white/60 mb-12 text-lg leading-relaxed">
                  Get comprehensive AI-powered feedback based on your interview responses. The analysis will include
                  personality insights, performance assessment, and personalized improvement recommendations.
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
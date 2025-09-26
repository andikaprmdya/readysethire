import { useEffect, useState, useCallback } from "react"
import api from "../../api/index"
import { useParams, useNavigate } from "react-router-dom"
import { Button, LoadingSpinner } from "../../components/ui"
import { useSettings } from "../../contexts/SettingsContext"
import ErrorBoundary from "../../components/ErrorBoundary"
import AIQuestionGenerator from "../../components/AIQuestionGenerator"
import { GeneratedQuestion } from "../../services/openaiService"
import TutorialButton from "../../components/TutorialButton"

interface Question {
  id: number
  interview_id: number
  question: string
  difficulty: string
  source?: 'manual' | 'ai'
}

interface Interview {
  id: number
  title: string
  job_role: string
  description: string
  status: string
}

export default function QuestionsPage() {
  const { interviewId } = useParams()
  const [questions, setQuestions] = useState<Question[]>([])
  const [interview, setInterview] = useState<Interview | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAIGenerator, setShowAIGenerator] = useState(false)
  const [savingAIQuestions, setSavingAIQuestions] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { settings } = useSettings()

  const fetchData = useCallback(async () => {
    try {
      // Fetch both questions and interview data
      const [questionsRes, interviewRes] = await Promise.all([
        api.get<Question[]>(`/question?interview_id=eq.${interviewId}`),
        api.get<Interview[]>(`/interview?id=eq.${interviewId}`)
      ])

      // Get AI-generated question IDs from localStorage
      const aiQuestionIds = JSON.parse(localStorage.getItem(`ai-questions-${interviewId}`) || '[]')

      // Add source property to questions based on localStorage data
      const questionsWithSource = questionsRes.data.map(question => ({
        ...question,
        source: aiQuestionIds.includes(question.id) ? 'ai' as const : 'manual' as const
      }))

      setQuestions(questionsWithSource)
      if (interviewRes.data.length > 0) {
        setInterview(interviewRes.data[0])
      }
      setLoading(false)
    } catch (err) {
      console.error("Error fetching data", err)
      setLoading(false)
    }
  }, [interviewId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this question?")) return
    try {
      await api.delete(`/question?id=eq.${id}`)
      fetchData()
    } catch (err) {
      console.error("Error deleting question", err)
    }
  }

  const handleAIQuestionsGenerated = useCallback(async (generatedQuestions: GeneratedQuestion[]) => {
    if (!interviewId) return

    setSavingAIQuestions(true)
    setError(null)

    try {
      // Save each generated question to the database individually to handle partial failures
      let successCount = 0
      const failedQuestions = []

      for (const q of generatedQuestions) {
        try {
          const response = await api.post('/question', {
            interview_id: parseInt(interviewId),
            question: q.question,
            difficulty: q.difficulty
          })

          // Store AI-generated question IDs in localStorage
          const aiQuestionIds = JSON.parse(localStorage.getItem(`ai-questions-${interviewId}`) || '[]')
          if (response.data && response.data[0]?.id) {
            aiQuestionIds.push(response.data[0].id)
            localStorage.setItem(`ai-questions-${interviewId}`, JSON.stringify(aiQuestionIds))
          }
          successCount++
        } catch (questionErr) {
          console.error('Error saving individual question:', questionErr)
          failedQuestions.push(q.question.substring(0, 50) + '...')
        }
      }

      // Refresh the questions list
      await fetchData()

      // Handle results
      if (successCount === generatedQuestions.length) {
        console.log(`Successfully added all ${generatedQuestions.length} AI-generated questions`)
      } else if (successCount > 0) {
        setError(`Successfully saved ${successCount} out of ${generatedQuestions.length} questions. Failed questions: ${failedQuestions.join(', ')}`)
      } else {
        setError('Failed to save all AI-generated questions. Please try again.')
      }

    } catch (err) {
      console.error('Error saving AI-generated questions:', err)
      setError('Failed to save AI-generated questions. Please check your connection and try again.')
    } finally {
      setSavingAIQuestions(false)
    }
  }, [interviewId, fetchData])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className={`backdrop-blur-xl rounded-3xl shadow-xl border p-16 ${
          settings.theme === 'light'
            ? 'bg-white/90 border-slate-300 shadow-slate-200'
            : 'bg-white/5 border-white/20'
        }`}>
          <LoadingSpinner
            size="lg"
            text="Loading questions..."
            centered
          />
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header Section */}
          <div className="relative mb-16">
            <div className={`backdrop-blur-xl rounded-3xl shadow-xl border p-12 overflow-hidden ${
              settings.theme === 'light'
                ? 'bg-white/90 border-slate-300 shadow-slate-200'
                : 'bg-white/5 border-white/20'
            }`}>
              <div className={`absolute inset-0 ${
                settings.theme === 'light'
                  ? 'bg-gradient-to-br from-slate-50/50 via-transparent to-slate-50/50'
                  : 'bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.02]'
              }`}></div>
              <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-10 lg:space-y-0">
                <div className="space-y-6">
                  <h1 className={`text-6xl font-black leading-tight ${
                    settings.theme === 'light' ? 'text-slate-900' : 'text-white/95'
                  }`}>
                    Questions
                  </h1>
                  <p className={`text-xl font-medium leading-relaxed max-w-2xl ${
                    settings.theme === 'light' ? 'text-slate-700' : 'text-white/70'
                  }`}>
                    Manage interview questions with elegant simplicity and AI-powered generation
                  </p>
                  <div className="flex items-center space-x-6 pt-4">
                    <div className={`flex items-center backdrop-blur-xl px-5 py-3 rounded-full shadow-lg border ${
                      settings.theme === 'light'
                        ? 'bg-slate-100/80 border-slate-300'
                        : 'bg-white/8 border-white/20'
                    }`}>
                      <div className="w-2 h-2 bg-blue-400/80 rounded-full mr-3 animate-pulse"></div>
                      <span className={`font-medium text-sm ${
                        settings.theme === 'light' ? 'text-slate-700' : 'text-white/80'
                      }`}>
                        {questions?.length || 0} Questions
                      </span>
                    </div>
                    {interview && (
                      <div className={`flex items-center backdrop-blur-xl px-5 py-3 rounded-full shadow-lg border ${
                        settings.theme === 'light'
                          ? 'bg-slate-100/80 border-slate-300'
                          : 'bg-white/8 border-white/20'
                      }`}>
                        <div className="w-2 h-2 bg-green-400/80 rounded-full mr-3"></div>
                        <span className={`font-medium text-sm ${
                          settings.theme === 'light' ? 'text-slate-700' : 'text-white/80'
                        }`}>
                          {interview.job_role}
                        </span>
                      </div>
                    )}
                    <TutorialButton variant="inline" flowId="manage-questions">
                      Learn How to Use
                    </TutorialButton>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => setShowAIGenerator(true)}
                    disabled={!interview || savingAIQuestions}
                    className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 flex items-center"
                  >
                    <div className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    Generate AI Questions
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => navigate(`/interviews/${interviewId}/questions/new`)}
                    className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 flex items-center"
                  >
                    <div className="w-6 h-6 mr-3 group-hover:rotate-90 transition-transform duration-300">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    Add Manual Question
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-8">
              <div className="bg-red-500/10 backdrop-blur-xl rounded-2xl border border-red-300/20 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-red-200 mb-1">Save Error</h3>
                    <p className="text-sm text-red-300/80 leading-relaxed">{error}</p>
                  </div>
                  <button
                    onClick={() => setError(null)}
                    className="text-red-300/60 hover:text-red-300 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Questions Content */}
          {(questions?.length || 0) === 0 ? (
            <div className="relative">
              <div className={`backdrop-blur-xl rounded-3xl shadow-xl border p-24 text-center overflow-hidden ${
                settings.theme === 'light'
                  ? 'bg-white/90 border-slate-300 shadow-slate-200'
                  : 'bg-white/5 border-white/20'
              }`}>
                <div className={`absolute inset-0 ${
                  settings.theme === 'light'
                    ? 'bg-gradient-to-br from-slate-50/50 via-transparent to-indigo-50/30'
                    : 'bg-gradient-to-br from-white/[0.02] via-transparent to-blue-500/[0.02]'
                }`}></div>
                <div className="relative max-w-md mx-auto">
                  <div className={`w-24 h-24 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-12 shadow-lg border ${
                    settings.theme === 'light'
                      ? 'bg-slate-100/80 border-slate-300'
                      : 'bg-white/10 border-white/20'
                  }`}>
                    <svg className={`w-12 h-12 ${
                      settings.theme === 'light' ? 'text-slate-500' : 'text-white/60'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className={`text-3xl font-bold mb-6 leading-tight ${
                    settings.theme === 'light' ? 'text-slate-900' : 'text-white/90'
                  }`}>
                    No questions yet
                  </h3>
                  <p className={`mb-12 text-lg leading-relaxed ${
                    settings.theme === 'light' ? 'text-slate-700' : 'text-white/60'
                  }`}>
                    Create your first interview question to get started, or let AI generate questions for you
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      variant="secondary"
                      onClick={() => setShowAIGenerator(true)}
                      disabled={!interview}
                      className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 inline-flex items-center"
                    >
                      <div className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      Generate AI Questions
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => navigate(`/interviews/${interviewId}/questions/new`)}
                      className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 inline-flex items-center"
                    >
                      <div className="w-6 h-6 mr-3 group-hover:rotate-90 transition-transform duration-300">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      Create First Question
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              {questions?.map((question) => (
                <div
                  key={question.id}
                  className={`group relative backdrop-blur-xl rounded-3xl shadow-xl border overflow-hidden hover:shadow-2xl hover:scale-[1.01] transition-all duration-500 ${
                    settings.theme === 'light'
                      ? 'bg-white/90 border-slate-300 hover:bg-white shadow-slate-200'
                      : 'bg-white/5 border-white/20 hover:bg-white/8'
                  }`}
                >
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                    settings.theme === 'light'
                      ? 'bg-gradient-to-br from-slate-50/50 via-transparent to-indigo-50/30'
                      : 'bg-gradient-to-br from-white/[0.02] via-transparent to-blue-500/[0.02]'
                  }`}></div>

                  {/* Header with Difficulty */}
                  <div className={`relative p-8 border-b ${
                    settings.theme === 'light' ? 'border-slate-200' : 'border-white/10'
                  }`}>
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide shadow-lg backdrop-blur-xl border ${
                          settings.theme === 'light' ? (
                            question.difficulty === 'Easy'
                              ? 'bg-green-100 text-green-700 border-green-300'
                            : question.difficulty === 'Medium'
                              ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                            : question.difficulty === 'Hard'
                              ? 'bg-red-100 text-red-700 border-red-300'
                              : 'bg-blue-100 text-blue-700 border-blue-300'
                          ) : (
                            question.difficulty === 'Easy'
                              ? 'bg-green-500/20 text-green-300 border-green-300/30'
                            : question.difficulty === 'Medium'
                              ? 'bg-yellow-500/20 text-yellow-300 border-yellow-300/30'
                            : question.difficulty === 'Hard'
                              ? 'bg-red-500/20 text-red-300 border-red-300/30'
                              : 'bg-blue-500/20 text-blue-300 border-blue-300/30'
                          )
                        }`}>
                          {question.difficulty}
                        </div>

                        <div className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide shadow-lg backdrop-blur-xl border flex items-center gap-2 ${
                          settings.theme === 'light' ? (
                            question.source === 'ai'
                              ? 'bg-purple-100 text-purple-700 border-purple-300'
                              : 'bg-blue-100 text-blue-700 border-blue-300'
                          ) : (
                            question.source === 'ai'
                              ? 'bg-purple-500/20 text-purple-300 border-purple-300/30'
                              : 'bg-blue-500/20 text-blue-300 border-blue-300/30'
                          )
                        }`}>
                          {question.source === 'ai' ? (
                            <>
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              AI Generated
                            </>
                          ) : (
                            <>
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                              Manual
                            </>
                          )}
                        </div>

                      </div>
                      
                      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => navigate(`/interviews/${interviewId}/questions/edit/${question.id}`)}
                          title="Edit Question"
                          className={`p-2 backdrop-blur-xl rounded-lg transition-all duration-300 hover:scale-105 border ${
                            settings.theme === 'light'
                              ? 'text-slate-500 hover:text-slate-700 hover:bg-slate-100 border-slate-200 hover:border-slate-300'
                              : 'text-white/50 hover:text-white/80 hover:bg-white/10 border-white/10 hover:border-white/20'
                          }`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        
                        <button
                          onClick={() => handleDelete(question.id)}
                          title="Delete Question"
                          className={`p-2 backdrop-blur-xl rounded-lg transition-all duration-300 hover:scale-105 border ${
                            settings.theme === 'light'
                              ? 'text-slate-500 hover:text-red-600 hover:bg-red-50 border-slate-200 hover:border-red-300'
                              : 'text-white/50 hover:text-red-300/80 hover:bg-red-500/10 border-white/10 hover:border-red-300/20'
                          }`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <p className={`text-xl font-semibold leading-relaxed ${
                      settings.theme === 'light' ? 'text-slate-900' : 'text-white/90'
                    }`}>
                      {question.question}
                    </p>

                  </div>
                </div>
              ))}
            </div>
          )}

          {/* AI Question Generator Modal */}
          {interview && (
            <AIQuestionGenerator
              isOpen={showAIGenerator}
              onClose={() => setShowAIGenerator(false)}
              onQuestionsGenerated={handleAIQuestionsGenerated}
              jobRole={interview.job_role}
              existingQuestions={questions?.map(q => q.question) || []}
            />
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}

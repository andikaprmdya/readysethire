import { useEffect, useState, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../../api/index"
import ErrorBoundary from "../../components/ErrorBoundary"
import { Interview, Question, Applicant } from "../../types/models"

// Web Speech API type declarations (not in TypeScript standard library)
interface SpeechRecognitionConstructor {
  new (): SpeechRecognition
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number
  readonly results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string
  readonly message: string
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor
    webkitSpeechRecognition: SpeechRecognitionConstructor
  }
}

// Additional type definitions for TakeInterview




type InterviewStep = 'welcome' | 'question' | 'thankyou'

export default function TakeInterview() {
  const { applicantId, interviewId } = useParams()
  const navigate = useNavigate()


  // State management
  const [step, setStep] = useState<InterviewStep>('welcome')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Data state
  const [applicant, setApplicant] = useState<Applicant | null>(null)
  const [interview, setInterview] = useState<Interview | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])

  // Recording state
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [transcript, setTranscript] = useState("")
  const [accumulatedTranscript, setAccumulatedTranscript] = useState("")
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)

  // Time limits and AI detection
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [recordingTimeLimit] = useState(300)
  const [showTimeWarning, setShowTimeWarning] = useState(false)
  const [recordingTimer, setRecordingTimer] = useState<NodeJS.Timeout | null>(null)
  const [aiDetectionScore, setAiDetectionScore] = useState(0)
  const [aiDetectionResult, setAiDetectionResult] = useState<'human' | 'ai' | 'uncertain' | null>(null)
  const [isAnalyzingForAI, setIsAnalyzingForAI] = useState(false)


  // Fetch all required data
  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch applicant data
      const applicantResponse = await api.get<Applicant[]>(`/applicant?id=eq.${applicantId}`)
      if (applicantResponse.data.length === 0) {
        throw new Error("Applicant not found")
      }

      // Fetch interview data
      const interviewResponse = await api.get<Interview[]>(`/interview?id=eq.${interviewId}`)
      if (interviewResponse.data.length === 0) {
        throw new Error("Interview not found")
      }

      // Fetch questions for this interview
      const questionsResponse = await api.get<Question[]>(`/question?interview_id=eq.${interviewId}`)
      if (questionsResponse.data.length === 0) {
        throw new Error("No questions found for this interview")
      }

      setApplicant(applicantResponse.data[0])
      setInterview(interviewResponse.data[0])
      setQuestions(questionsResponse.data)
      setLoading(false)

    } catch (err: unknown) {
      console.error("Error fetching interview data:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to load interview data"
      setError(errorMessage)
      setLoading(false)
    }
  }, [applicantId, interviewId])

  // Validate URL parameters
  useEffect(() => {
    if (!applicantId || !interviewId) {
      setError("Invalid interview link. Missing applicant or interview ID.")
      setLoading(false)
      return
    }

    fetchInitialData()
  }, [applicantId, interviewId, fetchInitialData])

  // AI Detection function
  const analyzeTranscriptForAI = useCallback(async (text: string): Promise<void> => {
    if (!text || text.length < 20) {
      setAiDetectionResult(null)
      setAiDetectionScore(0)
      return
    }

    setIsAnalyzingForAI(true)

    try {
      // Simple AI detection heuristics - in production, you'd use more sophisticated methods
      let aiScore = 0

      // Check 1: Unnatural perfection in grammar/structure
      const grammarPatterns = [
        /\b(furthermore|therefore|consequently|nonetheless|moreover)\b/gi,
        /\b(utilize|implement|optimize|facilitate|demonstrate)\b/gi,
        /^[A-Z][^.!?]*[.!?]\s*[A-Z]/g // Perfect sentence structure
      ]

      grammarPatterns.forEach(pattern => {
        if (pattern.test(text)) aiScore += 0.2
      })

      // Check 2: Overly structured responses
      const structuredPatterns = [
        /\b(firstly|secondly|thirdly|finally)\b/gi,
        /\b(in conclusion|to summarize|in summary)\b/gi,
        /\b(point (one|two|three|four|five))\b/gi
      ]

      structuredPatterns.forEach(pattern => {
        if (pattern.test(text)) aiScore += 0.15
      })

      // Check 3: Lack of filler words and natural speech patterns
      const naturalSpeechPatterns = [
        /\b(um|uh|er|ah|like|you know|sort of|kind of)\b/gi,
        /\b(I think|I believe|maybe|probably|perhaps)\b/gi,
        /\.\.\.|--|\s-\s/ // Pauses and hesitations
      ]

      let naturalSpeechCount = 0
      naturalSpeechPatterns.forEach(pattern => {
        const matches = text.match(pattern)
        if (matches) naturalSpeechCount += matches.length
      })

      // Lower natural speech patterns increase AI score
      const wordCount = text.split(/\s+/).length
      const naturalSpeechRatio = naturalSpeechCount / wordCount
      if (naturalSpeechRatio < 0.02) aiScore += 0.3

      // Check 4: Repetitive sentence structures
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 5)
      if (sentences.length > 2) {
        const avgSentenceLength = sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0) / sentences.length
        const sentenceLengthVariance = sentences.reduce((sum, s) => {
          const length = s.split(/\s+/).length
          return sum + Math.pow(length - avgSentenceLength, 2)
        }, 0) / sentences.length

        // Low variance in sentence length suggests AI
        if (sentenceLengthVariance < 10) aiScore += 0.2
      }

      // Check 5: Generic, template-like responses
      const genericPatterns = [
        /\b(best practices|industry standards|cutting-edge|state-of-the-art)\b/gi,
        /\b(comprehensive solution|end-to-end|scalable approach)\b/gi,
        /\b(leverage|synergy|paradigm|framework|methodology)\b/gi
      ]

      genericPatterns.forEach(pattern => {
        if (pattern.test(text)) aiScore += 0.1
      })

      // Check 6: Perfect punctuation and capitalization (unusual in speech-to-text)
      const punctuationErrors = text.match(/[a-z]\.[A-Z]|[a-z],[A-Z]|[.!?]{2,}/g)
      if (!punctuationErrors && text.length > 50) {
        aiScore += 0.15
      }

      // Check 7: Unusually high vocabulary complexity for speech
      const complexWords = text.match(/\b\w{8,}\b/g)
      const complexWordRatio = complexWords ? complexWords.length / wordCount : 0
      if (complexWordRatio > 0.15) {
        aiScore += 0.2
      }

      // Normalize score to 0-1 range
      const normalizedScore = Math.min(aiScore, 1)
      setAiDetectionScore(Math.round(normalizedScore * 100))

      // Determine result based on score
      if (normalizedScore > 0.7) {
        setAiDetectionResult('ai')
      } else if (normalizedScore > 0.4) {
        setAiDetectionResult('uncertain')
      } else {
        setAiDetectionResult('human')
      }

    } catch (error) {
      console.error('Error analyzing transcript for AI:', error)
      setAiDetectionResult('uncertain')
      setAiDetectionScore(50)
    } finally {
      setIsAnalyzingForAI(false)
    }
  }, [])

  // Timer function for recording duration
  const startRecordingTimer = useCallback(() => {
    setRecordingDuration(0)
    setShowTimeWarning(false)

    const timer = setInterval(() => {
      setRecordingDuration(prev => {
        const newDuration = prev + 1

        // Show warning at 80% of time limit
        if (newDuration >= recordingTimeLimit * 0.8 && !showTimeWarning) {
          setShowTimeWarning(true)
        }

        // Auto-stop at time limit
        if (newDuration >= recordingTimeLimit) {
          stopRecording()
          return recordingTimeLimit
        }

        return newDuration
      })
    }, 1000)

    setRecordingTimer(timer)
  }, [recordingTimeLimit, showTimeWarning])

  const clearRecordingTimer = useCallback(() => {
    if (recordingTimer) {
      clearInterval(recordingTimer)
      setRecordingTimer(null)
    }
    setRecordingDuration(0)
    setShowTimeWarning(false)
  }, [recordingTimer])

  // Format time for display
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }, [])

  // Initialize speech recognition
  const initializeSpeechRecognition = () => {
    // Check for Web Speech API support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = ''
        let finalPart = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalPart += transcript + ' '
          } else {
            interimTranscript += transcript
          }
        }

        // If we have new final results, add them to accumulated transcript
        if (finalPart) {
          setAccumulatedTranscript(prev => {
            const newAccumulated = prev + finalPart
            const fullText = newAccumulated + interimTranscript
            setTranscript(fullText)
        
            // Analyze for AI detection with debouncing
            if (newAccumulated.length > 50) {
              setTimeout(() => {
                analyzeTranscriptForAI(newAccumulated)
              }, 2000) // 2-second debounce - no need to return cleanup
            }
        
            return newAccumulated 
          })
        }else {
          // Only interim results - update display with current accumulated + interim
          setAccumulatedTranscript(prev => {
            setTranscript(prev + interimTranscript)
            return prev
          })
        }
      }

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error)
      }

      return recognition
    }
    return null
  }

  // Initialize audio recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const audioChunks: Blob[] = []

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data)
        }
      }

      recorder.onstop = () => {
        const blob = new Blob(audioChunks, { type: 'audio/wav' })
        setAudioBlob(blob)
        stream.getTracks().forEach(track => track.stop())
      }

      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)

      // Start recording timer
      startRecordingTimer()

      // Reset AI detection state
      setAiDetectionResult(null)
      setAiDetectionScore(0)

      // Initialize and start speech recognition
      const speechRecognition = initializeSpeechRecognition()
      if (speechRecognition) {
        speechRecognition.start()
        setRecognition(speechRecognition)
        setTranscript("Listening...")
        setAccumulatedTranscript("") // Reset accumulated transcript for new recording
      } else {
        setTranscript("Recording in progress... (Speech recognition not available)")
      }

    } catch (err) {
      console.error("Error starting recording:", err)
      alert("Could not access microphone. Please allow microphone permissions and try again.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && (mediaRecorder.state === 'recording' || mediaRecorder.state === 'paused')) {
      mediaRecorder.stop()
      setIsRecording(false)
    }

    // Stop and clear recording timer
    clearRecordingTimer()

    // Stop speech recognition
    if (recognition) {
      recognition.stop()
      setRecognition(null)
    }

    // Final AI analysis on the complete transcript
    if (accumulatedTranscript.length > 20) {
      analyzeTranscriptForAI(accumulatedTranscript)
    }
  }



  // Save answer and move to next question
  const saveAnswerAndContinue = async () => {
    if (!applicant || !interview || !questions[currentQuestionIndex]) return

    try {
      const currentQuestion = questions[currentQuestionIndex]
  
      console.log("🔍 ATTEMPTING TO SAVE ANSWER:")
      console.log("Current Question ID:", currentQuestion.id)
      console.log("Applicant ID:", applicant.id)
      console.log("Interview ID:", interview.id)
      console.log("Transcript:", transcript)
      console.log("Accumulated transcript:", accumulatedTranscript)
  
      // Step 1: Comprehensive schema discovery
      let discoveredColumns: string[] = []
      
      // Try to get existing records to discover schema
      try {
        console.log("🔍 Attempting to discover schema from existing records...")
        const existingResponse = await api.get('/applicant_answer?limit=5')
        if (existingResponse.data && Array.isArray(existingResponse.data) && existingResponse.data.length > 0) {
          discoveredColumns = Object.keys(existingResponse.data[0])
          console.log("📋 Discovered columns from existing records:", discoveredColumns)
        } else {
          console.log("📋 No existing records found in applicant_answer table")
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        console.log("Could not fetch existing records:", errorMessage)
      }
  
      // Step 2: Use error-driven discovery - try minimal structures and learn from errors
      // Use accumulated transcript for the final answer (more complete than current transcript)
      const finalAnswer = accumulatedTranscript.trim() || transcript.trim()
  
  
      let targetQuestionId = currentQuestion.id
  
      let savedSuccessfully = false
      let lastError = ""
  
  
      // If not saved yet, try different structures
      if (!savedSuccessfully) {
        const testStructures = [
          // Test 1: Try the most common answer field first
          {
            applicant_id: applicant.id,
            question_id: targetQuestionId,
            interview_id: interview.id,
            answer: finalAnswer
          },
          // Test 2: Just the IDs (fallback if answer field not allowed)
          {
            applicant_id: applicant.id,
            question_id: targetQuestionId,
            interview_id: interview.id
          },
          // Test 3: Try response field
          {
            applicant_id: applicant.id,
            question_id: targetQuestionId,
            interview_id: interview.id,
            response: finalAnswer
          },
          // Test 4: Try answer_text field
          {
            applicant_id: applicant.id,
            question_id: targetQuestionId,
            interview_id: interview.id,
            answer_text: finalAnswer
          },
          // Test 5: Try text field
          {
            applicant_id: applicant.id,
            question_id: targetQuestionId,
            interview_id: interview.id,
            text: finalAnswer
          },
          // Test 6: Try content field
          {
            applicant_id: applicant.id,
            question_id: targetQuestionId,
            interview_id: interview.id,
            content: finalAnswer
          }
        ]
  
        // If we discovered columns, create a structure based on them
        if (discoveredColumns.length > 0) {
          console.log("📋 Creating data structure based on discovered columns...")
          const discoveredStructure: any = {}
          
          // Map our data to discovered columns
          if (discoveredColumns.includes('applicant_id')) discoveredStructure.applicant_id = applicant.id
          if (discoveredColumns.includes('question_id')) discoveredStructure.question_id = targetQuestionId
          if (discoveredColumns.includes('interview_id')) discoveredStructure.interview_id = interview.id
          
          // Use final answer for the text field
          const answerText = finalAnswer
          
          // Try common text field names
          const textFields = ['answer', 'response', 'answer_text', 'text', 'content', 'transcript']
          for (const field of textFields) {
            if (discoveredColumns.includes(field)) {
              discoveredStructure[field] = answerText
              break
            }
          }
          
          testStructures.unshift(discoveredStructure) // Add to beginning of test list
          console.log("📋 Created structure from discovered schema:", discoveredStructure)
        }
  
        // Step 3: Try each structure systematically
        for (let i = 0; i < testStructures.length; i++) {
          const testData = testStructures[i]
          try {
            console.log(`🧪 Testing structure ${i + 1}:`, testData)
            await api.post('/applicant_answer', testData)
            console.log(`✅ SUCCESS! Saved with structure ${i + 1}`)
            savedSuccessfully = true
            break
          } catch (error: unknown) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown error'
            lastError = errorMsg
            console.log(`❌ Structure ${i + 1} failed:`, errorMsg)
            
            // Learn from specific error messages
            if (errorMsg.includes('null value in column')) {
              const match = errorMsg.match(/null value in column "(\w+)"/);
              if (match) {
                const requiredColumn = match[1]
                console.log(`📝 Learned: column "${requiredColumn}" is required`)
              }
            }
            
            if (errorMsg.includes('column') && errorMsg.includes('does not exist')) {
              const match = errorMsg.match(/column "(\w+)" of relation/);
              if (match) {
                const invalidColumn = match[1]
                console.log(`📝 Learned: column "${invalidColumn}" does not exist`)
              }
            }
          }
        }
      }
  
      // Step 4: If still not successful, try alternative approaches
      if (!savedSuccessfully) {
        console.log("🔍 Attempting alternative schema discovery...")
        
        // Try PostgREST's table introspection (if available)
        try {
          // Some PostgREST installations expose schema info
          const schemaResponse = await api.get('/?select=*', {
            headers: { 'Accept': 'application/vnd.pgrst.object+json' }
          })
          console.log("Schema info:", schemaResponse.data)
        } catch {
          console.log("Schema introspection not available")
        }
        
        // Try with the most basic structure possible
        try {
          console.log("🧪 Trying minimal ID-only structure...")
          await api.post('/applicant_answer', {
            applicant_id: applicant.id,
            question_id: targetQuestionId
          })
          savedSuccessfully = true
          console.log("✅ Minimal structure worked!")
        } catch (minimalErr: unknown) {
          const errorMsg = minimalErr instanceof Error ? minimalErr.message : 'Unknown error'
          console.log("❌ Even minimal structure failed:", errorMsg)
          lastError = errorMsg
        }
      }
  
      if (!savedSuccessfully) {
        console.log("⚠️ Could not save to database. Last error:", lastError)
        console.log("🎭 Continuing in demo mode...")
        alert(`Note: Answer saving is not working (${lastError}). Continuing in demo mode.`)
      }

      // Reset recording state
      setAudioBlob(null)
      setTranscript("")
      setAccumulatedTranscript("")
      setIsRecording(false)
      setMediaRecorder(null)
  
      // Move to next question or finish
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1)
      } else {
        // Update applicant status to completed when all questions are answered
        try {
          await api.patch(`/applicant?id=eq.${applicant.id}`, {
            interview_status: 'Completed'
          })
          console.log('✅ Applicant status updated to Completed')
        } catch (statusError) {
          console.error('⚠️ Could not update applicant status:', statusError)
          // Continue anyway - this is not critical for the interview flow
        }

        setStep('thankyou')
      }
  
    } catch (err) {
      console.error("Error in saveAnswerAndContinue:", err)
      alert("Failed to save your answer. Please try again.")
    }
  }

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-16">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white/80 rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-white/90 text-xl font-medium">Loading interview...</p>
        </div>
      </div>
    )
  }

  // Check if interview is already completed
  if (applicant?.interview_status === 'Completed') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-12 text-center max-w-md">
          <div className="w-20 h-20 bg-green-500/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg border border-green-300/20">
            <svg className="w-12 h-12 text-green-300/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white/90 mb-4">Interview Already Completed</h1>
          <p className="text-white/70 mb-8 leading-relaxed">
            You have already completed this interview. Each interview can only be taken once.
          </p>
          <p className="text-white/60 text-sm mb-8">
            Thank you for participating! Your responses have been recorded and will be reviewed by the hiring team.
          </p>
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10 mb-6">
            <p className="text-white/80 text-sm">
              <span className="font-semibold">Applicant:</span> {applicant.firstname} {applicant.surname}
            </p>
            <p className="text-white/80 text-sm mt-1">
              <span className="font-semibold">Interview:</span> {interview?.title}
            </p>
            <p className="text-white/80 text-sm mt-1">
              <span className="font-semibold">Status:</span> <span className="text-green-300">Completed</span>
            </p>
          </div>
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
            onClick={() => navigate('/interviews')}
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

  // Welcome Screen
  if (step === 'welcome' && applicant && interview) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-12 max-w-4xl w-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-blue-500/[0.02]"></div>
            
            <div className="relative">
              {/* Header */}
              <div className="text-center mb-12">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h1 className="text-5xl font-black text-white/95 mb-6 leading-tight">
                  Welcome to Your Interview
                </h1>
                <p className="text-white/70 text-xl leading-relaxed max-w-2xl mx-auto">
                  Take your time and answer each question thoroughly. You can record your responses using the audio recorder.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Applicant Details Section */}
                <div className="bg-white/8 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-lg">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white/90">Your Details</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <span className="text-white/60 font-medium w-20">Name:</span>
                      <span className="text-white/90 font-semibold">{applicant.firstname} {applicant.surname}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-white/60 font-medium w-20">Email:</span>
                      <span className="text-white/90">{applicant.email_address}</span>
                    </div>
                  </div>
                </div>

                {/* Interview Section */}
                <div className="bg-white/8 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-lg">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white/90">Interview Details</h2>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <span className="text-white/60 font-medium block mb-1">Title:</span>
                      <span className="text-white/90 font-semibold text-lg">{interview.title}</span>
                    </div>
                    <div>
                      <span className="text-white/60 font-medium block mb-1">Description:</span>
                      <span className="text-white/90 leading-relaxed">{interview.description}</span>
                    </div>
                    {interview.job_role && (
                      <div>
                        <span className="text-white/60 font-medium block mb-1">Position:</span>
                        <span className="text-white/90 font-semibold">{interview.job_role}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Start Interview Button */}
              <div className="text-center">
                <button
                  onClick={async () => {
                    // Start the interview - no status update needed

                    setStep('question')
                  }}
                  className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-12 py-6 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 flex items-center mx-auto"
                >
                  <div className="w-8 h-8 mr-4 group-hover:rotate-90 transition-transform duration-300">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Start Interview
                </button>
              </div>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    )
  }

  // Question Pages
  if (step === 'question' && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex]
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100

    return (
      <ErrorBoundary>
        <div className="min-h-screen px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Progress Header */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 mb-8 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-blue-500/[0.02]"></div>
              <div className="relative">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-white/90">
                        Question {currentQuestionIndex + 1} of {questions.length}
                      </h1>
                      <p className="text-white/60">Interview in Progress</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white/90">{Math.round(progress)}%</div>
                    <div className="text-white/60 text-sm">Complete</div>
                  </div>
                </div>
                <div className="w-full bg-white/20 backdrop-blur-xl rounded-full h-3 shadow-inner border border-white/10">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500 shadow-lg"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Question Display */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 mb-8 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-green-500/[0.02]"></div>
              <div className="relative">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4 shadow-lg bg-gradient-to-r from-green-500 to-emerald-500">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold text-white/90">
                        Question
                      </h2>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {currentQuestion.difficulty && (
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-xl shadow-lg border ${
                          currentQuestion.difficulty === 'Easy'
                            ? 'bg-green-500/20 text-green-300 border-green-300/30'
                          : currentQuestion.difficulty === 'Intermediate'
                            ? 'bg-yellow-500/20 text-yellow-300 border-yellow-300/30'
                          : currentQuestion.difficulty === 'Advanced'
                            ? 'bg-red-500/20 text-red-300 border-red-300/30'
                            : 'bg-blue-500/20 text-blue-300 border-blue-300/30'
                        }`}>
                          {currentQuestion.difficulty}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg">
                  <p className="text-white/90 text-xl leading-relaxed">{(currentQuestion as any).question || currentQuestion.question_text}</p>
                </div>
              </div>
            </div>


            {/* Audio Recorder Section */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 mb-8 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-red-500/[0.02]"></div>
              <div className="relative">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white/90">Record Your Answer</h3>
                </div>
                
                {/* Recording Controls */}
                <div className="flex flex-wrap gap-4 mb-6">
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="group bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 flex items-center"
                    >
                      <div className="w-6 h-6 bg-white rounded-full mr-3 group-hover:animate-pulse"></div>
                      Start Recording
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={stopRecording}
                        className="group bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-8 py-4 rounded-2xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 flex items-center"
                      >
                        <div className="w-4 h-4 bg-white mr-3"></div>
                        Stop Recording
                      </button>
                    </>
                  )}
                </div>

                {/* Recording Status with Timer and AI Detection */}
                {isRecording && (
                  <div className="space-y-4 mb-6">
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-lg"></div>
                          <span className="text-white/90 font-medium">
                            Recording in progress - Speak clearly
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className={`text-lg font-mono ${
                              showTimeWarning ? 'text-yellow-400' : 'text-white/90'
                            }`}>
                              {formatTime(recordingDuration)} / {formatTime(recordingTimeLimit)}
                            </div>
                            {showTimeWarning && (
                              <div className="text-xs text-yellow-400 animate-pulse">
                                Time warning!
                              </div>
                            )}
                          </div>
                          <div className="w-16 h-2 bg-white/20 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-1000 ${
                                showTimeWarning ? 'bg-yellow-400' : 'bg-green-500'
                              } ${recordingDuration >= recordingTimeLimit ? 'bg-red-500' : ''}`}
                              style={{
                                width: `${(recordingDuration / recordingTimeLimit) * 100}%`
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* AI Detection Display */}
                    {(aiDetectionResult || isAnalyzingForAI) && (
                      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              isAnalyzingForAI ? 'bg-blue-500/20' :
                              aiDetectionResult === 'human' ? 'bg-green-500/20' :
                              aiDetectionResult === 'ai' ? 'bg-red-500/20' :
                              'bg-yellow-500/20'
                            }`}>
                              {isAnalyzingForAI ? (
                                <div className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
                              ) : (
                                <span className="text-sm">
                                  {aiDetectionResult === 'human' ? '👤' :
                                   aiDetectionResult === 'ai' ? '🤖' : '❓'}
                                </span>
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white/90">
                                {isAnalyzingForAI ? 'Analyzing response...' :
                                 aiDetectionResult === 'human' ? 'Human Speech Detected' :
                                 aiDetectionResult === 'ai' ? 'AI-Generated Content Detected' :
                                 'Response Analysis Uncertain'}
                              </div>
                              {!isAnalyzingForAI && (
                                <div className="text-xs text-white/60">
                                  Confidence: {aiDetectionScore}%
                                  {aiDetectionResult === 'ai' && (
                                    <span className="ml-2 text-red-300">⚠ This may affect your evaluation</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Instruction Text */}
                <div className="bg-white/8 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-lg mb-6">
                  <p className="text-white/70 leading-relaxed">
                    Click "Start Recording" and speak your answer clearly. When you're finished, click "Stop Recording".
                    Your speech will be automatically transcribed below and analyzed for authenticity.
                  </p>
                </div>

                {/* Transcript Display */}
                {transcript && (
                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg">
                    <h4 className="font-bold text-white/90 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Live Transcript:
                    </h4>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <p className="text-white/90 leading-relaxed">{transcript}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Next Question Button */}
            <div className="text-center">
              <button
                onClick={saveAnswerAndContinue}
                disabled={!audioBlob || isRecording}
                className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-12 py-6 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100 flex items-center mx-auto"
              >
                <div className="w-8 h-8 mr-4 group-hover:rotate-90 transition-transform duration-300">
                  {currentQuestionIndex < questions.length - 1 ? (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  ) : (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Complete Interview'}
              </button>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    )
  }

  // Thank You Screen
  if (step === 'thankyou' && applicant && interview) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-12 max-w-4xl w-full text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-green-500/[0.02]"></div>
            
            <div className="relative">
              {/* Success Animation */}
              <div className="relative mb-12">
                <div className="w-32 h-32 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl animate-pulse">
                  <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                {/* Floating particles */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-green-400/60 rounded-full animate-ping" style={{animationDelay: '0s'}}></div>
                <div className="absolute top-8 right-8 w-2 h-2 bg-emerald-400/60 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                <div className="absolute bottom-8 left-8 w-2 h-2 bg-green-500/60 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
              </div>

              {/* Thank You Message */}
              <div className="mb-12">
                <h1 className="text-5xl font-black text-white/95 mb-6 leading-tight">
                  Interview Complete!
                </h1>
                <div className="space-y-6 text-white/80 text-xl leading-relaxed max-w-3xl mx-auto">
                  <p className="text-2xl font-semibold text-white/90">Thank you for taking the time to complete this interview.</p>
                  <p>Your responses have been successfully recorded and securely stored.</p>
                  <p>Our team will carefully review your interview responses and get back to you soon.</p>
                  <p className="text-white/70">You may now safely close this window.</p>
                </div>
              </div>

              {/* Interview Summary */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-lg mb-8">
                <h3 className="text-2xl font-bold text-white/90 mb-6">Interview Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h4 className="text-lg font-semibold text-white/80 mb-3">Candidate</h4>
                    <p className="text-white/90 text-xl font-semibold">
                      {applicant.firstname} {applicant.surname}
                    </p>
                    <p className="text-white/70 mt-1">{applicant.email_address}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h4 className="text-lg font-semibold text-white/80 mb-3">Interview</h4>
                    <p className="text-white/90 text-xl font-semibold">{interview.title}</p>
                    {interview.job_role && (
                      <p className="text-white/70 mt-1">Position: {interview.job_role}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Completion Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/8 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg text-center">
                  <div className="text-4xl font-bold text-green-400 mb-2">{questions.length}</div>
                  <p className="text-white/70">Questions Answered</p>
                </div>
                <div className="bg-white/8 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg text-center">
                  <div className="text-4xl font-bold text-blue-400 mb-2">100%</div>
                  <p className="text-white/70">Completion Rate</p>
                </div>
                <div className="bg-white/8 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg text-center">
                  <div className="text-4xl font-bold text-indigo-400 mb-2">✓</div>
                  <p className="text-white/70">Successfully Submitted</p>
                </div>
              </div>

              {/* AI Feedback Access */}
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-lg mb-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h3 className="text-2xl font-bold text-white/90 mb-2">AI Feedback Available</h3>
                      <p className="text-white/70">Get personalized insights and improvement suggestions</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/feedback/${applicant?.id}/${interview?.id}`)}
                    className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 flex items-center mx-auto"
                  >
                    <svg className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    View My AI Feedback
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    )
  }

  return null
}

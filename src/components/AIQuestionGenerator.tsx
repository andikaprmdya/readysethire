import React, { useState, useCallback } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from './ui'
import { aiService, GeneratedQuestion } from '../services/openaiService'

interface AIQuestionGeneratorProps {
  isOpen: boolean
  onClose: () => void
  onQuestionsGenerated: (questions: GeneratedQuestion[]) => void
  jobRole: string
  existingQuestions: string[]
}

export default function AIQuestionGenerator({
  isOpen,
  onClose,
  onQuestionsGenerated,
  jobRole,
  existingQuestions
}: AIQuestionGeneratorProps) {
  const [generating, setGenerating] = useState(false)
  const [difficulty, setDifficulty] = useState<'Easy' | 'Intermediate' | 'Advanced'>('Intermediate')
  const [questionCount, setQuestionCount] = useState(3)
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = useCallback(async () => {
    try {
      setGenerating(true)
      setError(null)

      const questions = await aiService.generateInterviewQuestions({
        jobRole,
        existingQuestions,
        difficulty,
        count: questionCount
      })

      setGeneratedQuestions(questions)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate questions'
      setError(errorMessage)
      console.error('AI Question Generation Error:', err)
    } finally {
      setGenerating(false)
    }
  }, [jobRole, existingQuestions, difficulty, questionCount])

  const handleAcceptQuestions = useCallback(() => {
    onQuestionsGenerated(generatedQuestions)
    setGeneratedQuestions([])
    onClose()
  }, [generatedQuestions, onQuestionsGenerated, onClose])

  const handleClose = useCallback(() => {
    setGeneratedQuestions([])
    setError(null)
    onClose()
  }, [onClose])

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="xl"
      closeOnBackdrop={false}
    >
      <ModalHeader title="🤖 AI Interview Question Generator" />

      <ModalBody>
        <div className="space-y-6">
          {/* Configuration Section */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white/90 mb-4">Configuration</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Difficulty Selection */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Question Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as 'Easy' | 'Intermediate' | 'Advanced')}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm"
                  disabled={generating}
                >
                  <option value="Easy" className="bg-slate-800 text-white">Easy</option>
                  <option value="Intermediate" className="bg-slate-800 text-white">Intermediate</option>
                  <option value="Advanced" className="bg-slate-800 text-white">Advanced</option>
                </select>
              </div>

              {/* Question Count */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Number of Questions
                </label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm"
                  disabled={generating}
                >
                  <option value={1} className="bg-slate-800 text-white">1 Question</option>
                  <option value={3} className="bg-slate-800 text-white">3 Questions</option>
                  <option value={5} className="bg-slate-800 text-white">5 Questions</option>
                  <option value={10} className="bg-slate-800 text-white">10 Questions</option>
                </select>
              </div>
            </div>

            {/* Job Role Display */}
            <div className="mt-4 p-4 bg-white/5 backdrop-blur-xl rounded-lg border border-white/10">
              <span className="text-sm font-medium text-white/70">Generating questions for:</span>
              <div className="text-lg font-semibold text-white/90">{jobRole}</div>
            </div>

            {/* Existing Questions Info */}
            {existingQuestions.length > 0 && (
              <div className="mt-4 p-4 bg-amber-500/10 backdrop-blur-xl rounded-lg border border-amber-300/20">
                <span className="text-sm font-medium text-amber-300/90">
                  AI will avoid duplicating {existingQuestions.length} existing questions
                </span>
              </div>
            )}
          </div>

          {/* Generate Button */}
          {generatedQuestions.length === 0 && !error && (
            <div className="text-center">
              <Button
                onClick={handleGenerate}
                loading={generating}
                disabled={generating}
                variant="primary"
                size="lg"
                className="px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {generating ? (
                  <>
                    <div className="w-5 h-5 mr-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Generating Questions...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate AI Questions
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-500/10 backdrop-blur-xl border border-red-300/20 rounded-lg p-6">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-red-300">Error Generating Questions</h3>
                  <p className="mt-1 text-sm text-red-300/80">{error}</p>
                </div>
              </div>
              <div className="mt-4">
                <Button
                  onClick={handleGenerate}
                  variant="outline"
                  className="border-red-300/30 text-red-300 hover:bg-red-500/10"
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {/* Generated Questions Display */}
          {generatedQuestions.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white/90">Generated Questions</h3>
                <div className="flex items-center text-sm text-green-300 bg-green-500/20 px-3 py-1 rounded-full backdrop-blur-xl border border-green-300/20">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {generatedQuestions.length} questions generated
                </div>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {generatedQuestions.map((question, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-lg font-semibold text-white/90">Question {index + 1}</h4>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-xl border ${
                        question.difficulty === 'Easy'
                          ? 'bg-green-500/20 text-green-300 border-green-300/30'
                        : question.difficulty === 'Intermediate'
                          ? 'bg-yellow-500/20 text-yellow-300 border-yellow-300/30'
                          : 'bg-red-500/20 text-red-300 border-red-300/30'
                      }`}>
                        {question.difficulty}
                      </span>
                    </div>

                    <p className="text-white/80 text-base leading-relaxed mb-4 font-medium">
                      {question.question}
                    </p>

                    {question.rationale && (
                      <div className="bg-blue-500/10 backdrop-blur-xl rounded-lg p-4 border border-blue-300/20">
                        <div className="text-sm font-medium text-blue-300 mb-1">AI Rationale:</div>
                        <p className="text-sm text-blue-200/80 leading-relaxed">{question.rationale}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ModalBody>

      <ModalFooter>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            variant="outline"
            onClick={handleClose}
            className="flex-1"
            disabled={generating}
          >
            {generatedQuestions.length > 0 ? 'Cancel' : 'Close'}
          </Button>

          {generatedQuestions.length > 0 && (
            <>
              <Button
                variant="secondary"
                onClick={handleGenerate}
                disabled={generating}
                className="flex-1"
              >
                Generate New Questions
              </Button>
              <Button
                variant="primary"
                onClick={handleAcceptQuestions}
                disabled={generating}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Add Questions
              </Button>
            </>
          )}
        </div>
      </ModalFooter>
    </Modal>
  )
}
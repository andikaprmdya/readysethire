import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import api from "../../api/index"
import { Question } from "../../types/models"

export default function QuestionForm() {
  const navigate = useNavigate()
  const { interviewId, questionId } = useParams()
  const isEdit = Boolean(questionId)

  const [form, setForm] = useState({
    interview_id: Number(interviewId),
    question: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isEdit && questionId) {
      setLoading(true)
      setError(null)
      api.get<Question[]>(`/question?id=eq.${questionId}`)
        .then(res => {
          if (res.data.length > 0) {
            const question = res.data[0]
            setForm({
              interview_id: question.interview_id,
              question: question.question || "",
            })
          } else {
            setError("Question not found")
          }
        })
        .catch(err => {
          console.error("Error fetching question", err)
          setError("Failed to load question data")
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [questionId, isEdit])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEdit) {
        await api.patch(`/question?id=eq.${questionId}`, form)
      } else {
        await api.post("/question", form)
      }
      navigate(`/interviews/${interviewId}/questions`)
    } catch (err) {
      console.error("Error saving question", err)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center p-8 rounded-lg backdrop-blur-md bg-white/5 border border-white/10">
          <div className="text-white text-xl mb-4">Loading question...</div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center p-8 rounded-lg backdrop-blur-md bg-white/5 border border-white/10">
          <div className="text-red-400 text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-white mb-2">Error</h2>
          <p className="text-white/70 mb-4">{error}</p>
          <button
            onClick={() => navigate(`/interviews/${interviewId}/questions`)}
            className="px-6 py-3 rounded-lg border border-white/30 text-white bg-transparent hover:bg-white/10 transition-all duration-300"
          >
            Back to Questions
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6 p-6 rounded-lg backdrop-blur-md bg-white/5 border border-white/10">
        <h1 className="text-2xl font-bold text-white">
          {isEdit ? "Edit Question" : "Create Question"}
        </h1>
        <p className="text-white/70 mt-2">
          {isEdit ? "Update the question details" : "Add a new question to this interview"}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 rounded-lg backdrop-blur-md bg-white/5 border border-white/10">
        <div className="space-y-6">
          {/* Question Text Field */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Question Text *
            </label>
            <textarea
              name="question"
              placeholder="Enter your interview question..."
              value={form.question}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-300 hover:bg-white/15 resize-none"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate(`/interviews/${interviewId}/questions`)}
              className="flex-1 px-6 py-3 rounded-lg border border-white/30 text-white bg-transparent hover:bg-white/10 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300"
            >
              {isEdit ? "Update Question" : "Create Question"}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

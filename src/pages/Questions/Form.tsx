import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import api from "../../api/index"
import { Question } from "../../types/models"
import { useSettings } from "../../contexts/SettingsContext"

export default function QuestionForm() {
  const navigate = useNavigate()
  const { interviewId, questionId } = useParams()
  const isEdit = Boolean(questionId)
  const { settings } = useSettings()

  const [form, setForm] = useState({
    interview_id: Number(interviewId),
    question: "",
    difficulty: "Intermediate",
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
              difficulty: question.difficulty || "Intermediate",
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

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
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
        <div className={`text-center p-8 rounded-lg backdrop-blur-md border ${
          settings.theme === 'light'
            ? 'bg-white/90 border-slate-300'
            : 'bg-white/5 border-white/10'
        }`}>
          <div className={`text-xl mb-4 ${
            settings.theme === 'light' ? 'text-slate-900' : 'text-white'
          }`}>Loading question...</div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className={`text-center p-8 rounded-lg backdrop-blur-md border ${
          settings.theme === 'light'
            ? 'bg-white/90 border-slate-300'
            : 'bg-white/5 border-white/10'
        }`}>
          <div className="text-red-400 text-xl mb-4">⚠️</div>
          <h2 className={`text-xl font-semibold mb-2 ${
            settings.theme === 'light' ? 'text-slate-900' : 'text-white'
          }`}>Error</h2>
          <p className={`mb-4 ${
            settings.theme === 'light' ? 'text-slate-700' : 'text-white/70'
          }`}>{error}</p>
          <button
            onClick={() => navigate(`/interviews/${interviewId}/questions`)}
            className={`px-6 py-3 rounded-lg border transition-all duration-300 ${
              settings.theme === 'light'
                ? 'border-slate-300 text-slate-700 bg-transparent hover:bg-slate-100'
                : 'border-white/30 text-white bg-transparent hover:bg-white/10'
            }`}
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
      <div className={`mb-6 p-6 rounded-lg backdrop-blur-md border ${
        settings.theme === 'light'
          ? 'bg-white/90 border-slate-300'
          : 'bg-white/5 border-white/10'
      }`}>
        <h1 className={`text-2xl font-bold ${
          settings.theme === 'light' ? 'text-slate-900' : 'text-white'
        }`}>
          {isEdit ? "Edit Question" : "Create Question"}
        </h1>
        <p className={`mt-2 ${
          settings.theme === 'light' ? 'text-slate-700' : 'text-white/70'
        }`}>
          {isEdit ? "Update the question details" : "Add a new question to this interview"}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className={`p-6 rounded-lg backdrop-blur-md border ${
        settings.theme === 'light'
          ? 'bg-white/90 border-slate-300'
          : 'bg-white/5 border-white/10'
      }`}>
        <div className="space-y-6">
          {/* Question Text Field */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              settings.theme === 'light' ? 'text-slate-700' : 'text-white/90'
            }`}>
              Question Text *
            </label>
            <textarea
              name="question"
              placeholder="Enter your interview question..."
              value={form.question}
              onChange={handleChange}
              rows={4}
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 backdrop-blur-sm transition-all duration-300 resize-none ${
                settings.theme === 'light'
                  ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:ring-blue-500/50 focus:border-blue-500 hover:bg-slate-50'
                  : 'bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-blue-500/50 focus:border-blue-500/50 hover:bg-white/15'
              }`}
              required
            />
          </div>

          {/* Difficulty Field */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              settings.theme === 'light' ? 'text-slate-700' : 'text-white/90'
            }`}>
              Difficulty Level *
            </label>
            <select
              name="difficulty"
              value={form.difficulty}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 backdrop-blur-sm transition-all duration-300 ${
                settings.theme === 'light'
                  ? 'bg-white border-slate-300 text-slate-900 focus:ring-blue-500/50 focus:border-blue-500 hover:bg-slate-50'
                  : 'bg-white/10 border-white/20 text-white focus:ring-blue-500/50 focus:border-blue-500/50 hover:bg-white/15'
              }`}
              required
            >
              <option value="Easy">Easy</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate(`/interviews/${interviewId}/questions`)}
              className={`flex-1 px-6 py-3 rounded-lg border bg-transparent transition-all duration-300 ${
                settings.theme === 'light'
                  ? 'border-slate-300 text-slate-700 hover:bg-slate-100'
                  : 'border-white/30 text-white hover:bg-white/10'
              }`}
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

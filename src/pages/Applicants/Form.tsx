import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import api from "../../api/index"

interface Applicant {
  id?: number
  interview_id: number
  title: string
  firstname: string
  surname: string
  phone_number: string
  email_address: string
  interview_status: 'Not Started' | 'Completed'
}

interface ApplicantInput {
  interview_id: number
  title: string
  firstname: string
  surname: string
  phone_number: string
  email_address: string
  interview_status: 'Not Started' | 'Completed'
}

export default function ApplicantForm() {
  const navigate = useNavigate()
  const { interviewId, applicantId } = useParams()
  const isEdit = Boolean(applicantId)
  
  
  // Handle missing interviewId
  if (!interviewId || interviewId === 'undefined') {
    console.error("❌ No interviewId found in URL! You need to navigate from /interviews/{id}/applicants/new")
    return (
      <div className="text-center text-red-600 p-8">
        <h1 className="text-2xl font-bold mb-4">Error: Missing Interview ID</h1>
        <p className="mb-4">Please navigate to this form through the proper route:</p>
        <p className="mb-4 font-mono text-sm">/interviews/{"{interviewId}"}/applicants/new</p>
        <button 
          onClick={() => navigate('/interviews')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go to Interviews
        </button>
      </div>
    )
  }
  
  const parsedInterviewId = interviewId && !isNaN(parseInt(interviewId, 10)) ? parseInt(interviewId, 10) : 0
  
  const [form, setForm] = useState<ApplicantInput>({
    interview_id: parsedInterviewId,
    title: "",
    firstname: "",
    surname: "",
    phone_number: "",
    email_address: "",
    interview_status: "Not Started",
  })

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  
  useEffect(() => {
    if (isEdit) {
      api.get<Applicant[]>(`/applicant?id=eq.${applicantId}`)
        .then(res => {
          if (res.data.length > 0) {
            const applicant = res.data[0]
            setForm({
              interview_id: applicant.interview_id,
              title: applicant.title,
              firstname: applicant.firstname,
              surname: applicant.surname,
              phone_number: applicant.phone_number,
              email_address: applicant.email_address,
              interview_status: applicant.interview_status,
            })
          }
        })
        .catch(err => console.error("Error fetching applicant", err))
    }
  }, [applicantId, isEdit])
  
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  
  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const { [name]: _, ...rest } = prev
        return rest
      })
    }
    
    // Real-time validation
    if (name === 'email_address' && value && !validateEmail(value)) {
      setValidationErrors(prev => ({ ...prev, email_address: 'Please enter a valid email address' }))
    }
    
    if (name === 'phone_number' && value && !validatePhone(value)) {
      setValidationErrors(prev => ({ ...prev, phone_number: 'Please enter a valid phone number' }))
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form before submission
    const errors: Record<string, string> = {}
    
    if (!form.title.trim()) {
      errors.title = 'Title is required'
    }
    
    if (!form.firstname.trim()) {
      errors.firstname = 'First name is required'
    }
    
    if (!form.surname.trim()) {
      errors.surname = 'Surname is required'
    }
    
    if (!form.phone_number.trim()) {
      errors.phone_number = 'Phone number is required'
    } else if (!validatePhone(form.phone_number)) {
      errors.phone_number = 'Please enter a valid phone number'
    }
    
    if (!form.email_address.trim()) {
      errors.email_address = 'Email address is required'
    } else if (!validateEmail(form.email_address)) {
      errors.email_address = 'Please enter a valid email address'
    }
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }
    
    
    try {
      if (isEdit) {
        await api.patch(`/applicant?id=eq.${applicantId}`, form)
      } else {
        await api.post("/applicant", form)
      }
      navigate(`/interviews/${interviewId}/applicants`)
    } catch (err: any) {
      console.error("Error saving applicant", err)
    }
  }
  
  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6 p-6 rounded-lg backdrop-blur-md bg-white/5 border border-white/10">
        <h1 className="text-2xl font-bold text-white">{isEdit ? "Edit Applicant" : "Create Applicant"}</h1>
        <p className="text-white/70 mt-2">{isEdit ? "Update applicant information" : "Add a new applicant to this interview"}</p>
      </div>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 rounded-lg backdrop-blur-md bg-white/5 border border-white/10">
        <div className="space-y-6">
          {/* Title Field */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Title *
            </label>
            <select
              name="title"
              value={form.title}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-300 ${
                validationErrors.title ? 'border-red-500/70 bg-red-500/10' : 'hover:bg-white/15'
              }`}
              required
            >
              <option value="" className="bg-slate-800 text-white">Select Title</option>
              <option value="Mr" className="bg-slate-800 text-white">Mr</option>
              <option value="Ms" className="bg-slate-800 text-white">Ms</option>
              <option value="Mrs" className="bg-slate-800 text-white">Mrs</option>
              <option value="Miss" className="bg-slate-800 text-white">Miss</option>
              <option value="Dr" className="bg-slate-800 text-white">Dr</option>
              <option value="Prof" className="bg-slate-800 text-white">Prof</option>
            </select>
            {validationErrors.title && (
              <p className="mt-1 text-sm text-red-400">
                {validationErrors.title}
              </p>
            )}
          </div>
          
          {/* First Name Field */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              First Name *
            </label>
            <input
              type="text"
              name="firstname"
              placeholder="Enter first name"
              value={form.firstname}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-300 ${
                validationErrors.firstname ? 'border-red-500/70 bg-red-500/10' : 'hover:bg-white/15'
              }`}
              required
            />
            {validationErrors.firstname && (
              <p className="mt-1 text-sm text-red-400">
                {validationErrors.firstname}
              </p>
            )}
          </div>
          
          {/* Surname Field */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Surname *
            </label>
            <input
              type="text"
              name="surname"
              placeholder="Enter surname"
              value={form.surname}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-300 ${
                validationErrors.surname ? 'border-red-500/70 bg-red-500/10' : 'hover:bg-white/15'
              }`}
              required
            />
            {validationErrors.surname && (
              <p className="mt-1 text-sm text-red-400">
                {validationErrors.surname}
              </p>
            )}
          </div>
          
          {/* Phone Number Field */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone_number"
              placeholder="Enter phone number"
              value={form.phone_number}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-300 ${
                validationErrors.phone_number ? 'border-red-500/70 bg-red-500/10' : 'hover:bg-white/15'
              }`}
              required
            />
            {validationErrors.phone_number && (
              <p className="mt-1 text-sm text-red-400">
                {validationErrors.phone_number}
              </p>
            )}
          </div>
          
          {/* Email Address Field */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email_address"
              placeholder="Enter email address"
              value={form.email_address}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-300 ${
                validationErrors.email_address ? 'border-red-500/70 bg-red-500/10' : 'hover:bg-white/15'
              }`}
              required
            />
            {validationErrors.email_address && (
              <p className="mt-1 text-sm text-red-400">
                {validationErrors.email_address}
              </p>
            )}
          </div>
          
          {/* Interview Status Field */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Interview Status *
            </label>
            <select
              name="interview_status"
              value={form.interview_status}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-300 hover:bg-white/15"
              required
            >
              <option value="Not Started" className="bg-slate-800 text-white">Not Started</option>
              <option value="Completed" className="bg-slate-800 text-white">Completed</option>
            </select>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate(`/interviews/${interviewId}/applicants`)}
              className="flex-1 px-6 py-3 rounded-lg border border-white/30 text-white bg-transparent hover:bg-white/10 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300"
            >
              {isEdit ? "Update Applicant" : "Create Applicant"}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
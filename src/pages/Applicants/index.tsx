import { useEffect, useState, useCallback } from "react"
import api from "../../api/index"
import { useParams, useNavigate } from "react-router-dom"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, LoadingSpinner } from "../../components/ui"
import ErrorBoundary from "../../components/ErrorBoundary"
import TutorialButton from "../../components/TutorialButton"
import { useSettings } from "../../contexts/SettingsContext"

interface Applicant {
  id: number
  interview_id: number
  title: string
  firstname: string
  surname: string
  phone_number: string
  email_address: string
  interview_status: 'Not Started' | 'Completed'
}

export default function ApplicantsPage() {
  const { interviewId } = useParams()
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { settings } = useSettings()
  
  // Modal state for generate link
  const [generateLinkModal, setGenerateLinkModal] = useState<{
    isOpen: boolean
    applicant: Applicant | null
  }>({
    isOpen: false,
    applicant: null
  })
  const [generatedLink, setGeneratedLink] = useState<string>('')
  const [linkCopied, setLinkCopied] = useState(false)
  
  const fetchData = () => {
    console.log("🔍 FETCHING APPLICANTS - Debug Info:")
    console.log("Interview ID:", interviewId)
    console.log("API endpoint:", `/applicant?interview_id=eq.${interviewId}`)
    
    api.get<Applicant[]>(`/applicant?interview_id=eq.${interviewId}`)
      .then(res => {
        console.log("🔍 DATABASE RESPONSE - Applicant data:")
        console.log("Raw response:", res.data)
        console.log("Number of applicants found:", res.data.length)
        if (res.data.length > 0) {
          console.log("First applicant object:", res.data[0])
          console.log("Available columns:", Object.keys(res.data[0]))
          // Check if the data has the expected fields
          const firstApplicant = res.data[0]
          console.log("Field validation:")
          console.log("- Has 'title' field:", 'title' in firstApplicant)
          console.log("- Has 'firstname' field:", 'firstname' in firstApplicant)
          console.log("- Has 'surname' field:", 'surname' in firstApplicant)
          console.log("- Has 'phone_number' field:", 'phone_number' in firstApplicant)
          console.log("- Has 'email_address' field:", 'email_address' in firstApplicant)
          console.log("- Has 'interview_status' field:", 'interview_status' in firstApplicant)
          console.log("- Title value:", firstApplicant.title)
          console.log("- Firstname value:", firstApplicant.firstname)
          console.log("- Surname value:", firstApplicant.surname)
          console.log("- Phone number value:", firstApplicant.phone_number)
          console.log("- Email address value:", firstApplicant.email_address)
          console.log("- Interview status value:", firstApplicant.interview_status)
        } else {
          console.log("❌ No applicants found for interview ID:", interviewId)
        }
        setApplicants(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error("❌ ERROR fetching applicants:", err)
        console.log("Error details:", {
          message: err.message,
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data
        })
        setLoading(false)
      })
  }
  
  useEffect(() => {
    fetchData()
  }, [interviewId])
  
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this applicant?")) return
    try {
      await api.delete(`/applicant?id=eq.${id}`)
      fetchData()
    } catch (err) {
      console.error("Error deleting applicant", err)
    }
  }
  
  // Generate interview link for applicant
  const handleGenerateLink = useCallback((applicant: Applicant) => {
    const baseUrl = window.location.origin
    const interviewLink = `${baseUrl}/take-interview/${interviewId}/${applicant.id}`
    setGeneratedLink(interviewLink)
    setGenerateLinkModal({ isOpen: true, applicant })
    setLinkCopied(false)
  }, [interviewId])
  
  // Copy link to clipboard
  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(generatedLink)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 3000)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }, [generatedLink])
  
  // Close modal
  const closeModal = useCallback(() => {
    setGenerateLinkModal({ isOpen: false, applicant: null })
    setGeneratedLink('')
    setLinkCopied(false)
  }, [])
  
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
            text="Loading applicants..."
            centered
          />
        </div>
      </div>
    )
  }
  
  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-8 pt-12">
          {/* Header Section */}
          <div className="relative mb-16">
            <div className={`backdrop-blur-xl rounded-3xl shadow-xl border p-12 overflow-hidden ${
              settings.theme === 'light'
                ? 'bg-white/90 border-slate-300 shadow-slate-200/50'
                : 'bg-white/5 border-white/20'
            }`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${
                settings.theme === 'light'
                  ? 'from-slate-50/50 via-transparent to-blue-50/20'
                  : 'from-white/[0.02] via-transparent to-white/[0.02]'
              }`}></div>
              <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-10 lg:space-y-0">
                <div className="space-y-6">
                  <h1 className={`text-6xl font-black leading-tight ${
                    settings.theme === 'light'
                      ? 'text-slate-800'
                      : 'text-white/95'
                  }`}>
                    Applicants
                  </h1>
                  <p className={`text-xl font-medium leading-relaxed max-w-2xl ${
                    settings.theme === 'light'
                      ? 'text-slate-600'
                      : 'text-white/70'
                  }`}>
                    Manage candidates and track their interview progress
                  </p>
                  <div className="flex items-center space-x-6 pt-4">
                    <div className={`flex items-center backdrop-blur-xl px-5 py-3 rounded-full shadow-lg border ${
                      settings.theme === 'light'
                        ? 'bg-slate-100/80 border-slate-300'
                        : 'bg-white/8 border-white/20'
                    }`}>
                      <div className="w-2 h-2 bg-indigo-400/80 rounded-full mr-3 animate-pulse"></div>
                      <span className={`font-medium text-sm ${
                        settings.theme === 'light'
                          ? 'text-slate-700'
                          : 'text-white/80'
                      }`}>
                        {applicants?.length || 0} Applicants
                      </span>
                    </div>
                    <TutorialButton variant="inline" flowId="manage-applicants">
                      Learn How to Use
                    </TutorialButton>
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate(`/interviews/${interviewId}/applicants/new`)}
                  className="group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 flex items-center"
                >
                  <div className="w-6 h-6 mr-3 group-hover:rotate-90 transition-transform duration-300">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  Add New Applicant
                </Button>
              </div>
            </div>
          </div>
          
          {/* Applicants Content */}
          {(applicants?.length || 0) === 0 ? (
            <div className="relative">
              <div className={`backdrop-blur-xl rounded-3xl shadow-xl border p-24 text-center overflow-hidden ${
                settings.theme === 'light'
                  ? 'bg-white/90 border-slate-300 shadow-slate-200/50'
                  : 'bg-white/5 border-white/20'
              }`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${
                  settings.theme === 'light'
                    ? 'from-slate-50/50 via-transparent to-indigo-100/20'
                    : 'from-white/[0.02] via-transparent to-indigo-500/[0.02]'
                }`}></div>
                <div className="relative max-w-md mx-auto">
                  <div className={`w-24 h-24 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-12 shadow-lg border ${
                    settings.theme === 'light'
                      ? 'bg-slate-100 border-slate-300'
                      : 'bg-white/10 border-white/20'
                  }`}>
                    <svg className={`w-12 h-12 ${
                      settings.theme === 'light' ? 'text-slate-500' : 'text-white/60'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className={`text-3xl font-bold mb-6 leading-tight ${
                    settings.theme === 'light' ? 'text-slate-800' : 'text-white/90'
                  }`}>
                    No applicants yet
                  </h3>
                  <p className={`mb-12 text-lg leading-relaxed ${
                    settings.theme === 'light' ? 'text-slate-600' : 'text-white/60'
                  }`}>
                    Add your first candidate to start the interview process
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => navigate(`/interviews/${interviewId}/applicants/new`)}
                    className="group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 inline-flex items-center"
                  >
                    <div className="w-6 h-6 mr-3 group-hover:rotate-90 transition-transform duration-300">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    Add First Applicant
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {applicants?.map((applicant) => (
                <div
                  key={applicant.id}
                  className={`group relative backdrop-blur-xl rounded-3xl shadow-xl border overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 ${
                    settings.theme === 'light'
                      ? 'bg-white/90 border-slate-300 shadow-slate-200/50 hover:bg-white hover:shadow-slate-300/40'
                      : 'bg-white/5 border-white/20 hover:bg-white/8'
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                    settings.theme === 'light'
                      ? 'from-slate-50/50 via-transparent to-indigo-100/30'
                      : 'from-white/[0.02] via-transparent to-indigo-500/[0.02]'
                  }`}></div>
                  
                  {/* Header with Status */}
                  <div className={`relative p-8 border-b ${
                    settings.theme === 'light' ? 'border-slate-200/60' : 'border-white/10'
                  }`}>
                    <div className="flex justify-between items-start mb-6">
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide shadow-lg backdrop-blur-xl border ${
                        applicant.interview_status === 'Completed'
                          ? settings.theme === 'light'
                            ? 'bg-green-100 text-green-700 border-green-300'
                            : 'bg-green-500/20 text-green-300 border-green-300/30'
                          : settings.theme === 'light'
                            ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                            : 'bg-yellow-500/20 text-yellow-300 border-yellow-300/30'
                      }`}>
                        {applicant.interview_status}
                      </div>
                      
                      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => navigate(`/interviews/${interviewId}/applicants/edit/${applicant.id}`)}
                          title="Edit Applicant"
                          className="p-2 text-white/50 hover:text-white/80 hover:bg-white/10 backdrop-blur-xl rounded-lg transition-all duration-300 hover:scale-105 border border-white/10 hover:border-white/20"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        
                        <button
                          onClick={() => handleDelete(applicant.id)}
                          title="Delete Applicant"
                          className="p-2 text-white/50 hover:text-red-300/80 hover:bg-red-500/10 backdrop-blur-xl rounded-lg transition-all duration-300 hover:scale-105 border border-white/10 hover:border-red-300/20"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white/90 mb-4 group-hover:text-white transition-colors duration-300 leading-tight">
                      {applicant.title} {applicant.firstname} {applicant.surname}
                    </h2>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-400/60 rounded-full mr-3"></div>
                        <p className="text-white/70 font-medium">ID: {applicant.id}</p>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-400/60 rounded-full mr-3"></div>
                        <p className="text-white/70 font-medium">{applicant.email_address}</p>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-purple-400/60 rounded-full mr-3"></div>
                        <p className="text-white/70 font-medium">{applicant.phone_number}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="relative p-8 bg-white/[0.02] backdrop-blur-xl">
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => handleGenerateLink(applicant)}
                        className="group/btn flex items-center justify-center px-3 py-3 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl hover:bg-indigo-500/10 hover:border-indigo-400/30 text-white/70 hover:text-white/90 font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                      >
                        <svg className="w-4 h-4 mr-1 group-hover/btn:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        <span className="text-xs">Link</span>
                      </button>
                      <button
                        onClick={() => navigate(`/interviews/${interviewId}/applicants/${applicant.id}/answers`)}
                        className="group/btn flex items-center justify-center px-3 py-3 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl hover:bg-green-500/10 hover:border-green-400/30 text-white/70 hover:text-white/90 font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                      >
                        <svg className="w-4 h-4 mr-1 group-hover/btn:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span className="text-xs">Answers</span>
                      </button>
                      <button
                        onClick={() => navigate(`/interviews/${interviewId}/applicants/${applicant.id}/feedback`)}
                        className="group/btn flex items-center justify-center px-3 py-3 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl hover:bg-purple-500/10 hover:border-purple-400/30 text-white/70 hover:text-white/90 font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                      >
                        <svg className="w-4 h-4 mr-1 group-hover/btn:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <span className="text-xs">AI Feed</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Generate Link Modal */}
          <Modal
            isOpen={generateLinkModal.isOpen}
            onClose={closeModal}
            size="lg"
            closeOnBackdrop={true}
          >
            <ModalHeader title="Generate Interview Link" />
            <ModalBody>
              {generateLinkModal.applicant && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white  mb-2">
                      Interview Link for {generateLinkModal.applicant.title} {generateLinkModal.applicant.firstname} {generateLinkModal.applicant.surname}
                    </h3>
                    <p className="text-gray-400 mb-4">
                      Share this link with the candidate to allow them to take their interview.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Interview Link
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        value={generatedLink}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-50 text-gray-900 text-sm"
                      />
                      <Button
                        variant={linkCopied ? "secondary" : "primary"}
                        onClick={copyToClipboard}
                        className="rounded-l-none"
                      >
                        {linkCopied ? (
                          <>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Copied!
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="text-sm font-semibold text-blue-900 mb-2">📋 How to use this link:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Share this link directly with the candidate via email or messaging</li>
                      <li>• The candidate can click the link to access their personalized interview</li>
                      <li>• They can complete the interview questions and submit their responses</li>
                      <li>• You can view their answers once they complete the interview</li>
                    </ul>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                    <h4 className="text-sm font-semibold text-amber-900 mb-2">🔒 Security Note:</h4>
                    <p className="text-sm text-amber-800">
                      This link is personalized for this specific candidate and interview. 
                      Each candidate should receive their own unique link.
                    </p>
                  </div>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button variant="primary" onClick={copyToClipboard}>
                {linkCopied ? 'Copied!' : 'Copy Link'}
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      </div>
    </ErrorBoundary>
  )
}
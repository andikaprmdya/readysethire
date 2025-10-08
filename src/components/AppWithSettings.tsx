import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useSettings } from '../contexts/SettingsContext'
import Navbar from "./ui/Navbar"
import Footer from "./Footer"
import Home from "../pages/Home"
import InterviewsPage from "../pages/Interviews/index"
import InterviewForm from "../pages/Interviews/Form"
import QuestionsPage from "../pages/Questions"
import QuestionForm from "../pages/Questions/Form"
import ApplicantsPage from "../pages/Applicants"
import ApplicantForm from "../pages/Applicants/Form"
import TakeInterview from "../pages/TakeInterview"
import ViewAnswers from "../pages/ViewAnswers"
import AIFeedbackPage from "../pages/AIFeedback"
import ApplicantFeedbackPage from "../pages/ApplicantFeedback"
import AIAnalyticsPage from "../pages/AIAnalytics"
import PrivacyPolicy from "../pages/PrivacyPolicy"
import TermsOfService from "../pages/TermsOfService"
import CookiePolicy from "../pages/CookiePolicy"
import TutorialOverlay from "./TutorialOverlay"
import SettingsModal from "./SettingsModal"

const AppWithSettings: React.FC = () => {
  const { isSettingsOpen, closeSettings, settings } = useSettings()

  return (
    <Router>
      <div
        className="min-h-screen w-full flex flex-col relative"
        style={{
          fontSize: `calc(${
            {
              small: '0.875rem',
              medium: '1rem',
              large: '1.125rem',
              xlarge: '1.25rem'
            }[settings.fontSize]
          } * var(--contrast-multiplier, 1))`
        }}
      >
        {/* Professional gradient background */}
        <div className={`fixed inset-0 w-full h-full ${
          settings.theme === 'light'
            ? 'bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200'
            : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
        }`}></div>
        <div className={`fixed inset-0 w-full h-full ${
          settings.theme === 'light'
            ? 'bg-gradient-to-tl from-indigo-200/30 via-transparent to-blue-200/20'
            : 'bg-gradient-to-tl from-blue-900/30 via-transparent to-blue-800/20'
        }`}></div>

        {/* Header - now positioned properly as sticky */}
        <header className="relative z-40 flex-shrink-0">
          <Navbar />
        </header>

        {/* Main content area with proper overflow handling */}
        <div className="relative z-30 flex-1 flex flex-col min-h-0">
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/interviews" element={<InterviewsPage />} />
              <Route path="/interviews/new" element={<InterviewForm />} />
              <Route path="/interviews/:id/edit" element={<InterviewForm />} />
              <Route path="/interviews/:interviewId/questions" element={<QuestionsPage />} />
              <Route path="/interviews/:interviewId/questions/new" element={<QuestionForm />} />
              <Route path="/interviews/:interviewId/questions/edit/:questionId" element={<QuestionForm />} />
              <Route path="/interviews/:interviewId/applicants" element={<ApplicantsPage />} />
              <Route path="/interviews/:interviewId/applicants/new" element={<ApplicantForm />} />
              <Route path="/interviews/:interviewId/applicants/edit/:applicantId" element={<ApplicantForm />} />
              <Route path="/take-interview/:interviewId/:applicantId" element={<TakeInterview />} />
              <Route path="/interviews/:interviewId/applicants/:applicantId/answers" element={<ViewAnswers />} />
              <Route path="/interviews/:interviewId/applicants/:applicantId/ai-feedback" element={<AIFeedbackPage />} />
              <Route path="/interviews/:interviewId/applicants/:applicantId/feedback" element={<AIFeedbackPage />} />
              <Route path="/applicant-feedback/:applicantId/:interviewId" element={<ApplicantFeedbackPage />} />
              <Route path="/feedback/:applicantId/:interviewId" element={<ApplicantFeedbackPage />} />
              <Route path="/interviews/:interviewId/analytics" element={<AIAnalyticsPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
            </Routes>
          </main>

          {/* Footer - now follows content naturally */}
          <footer className="flex-shrink-0 mt-auto">
            <Footer />
          </footer>
        </div>

        {/* Tutorial System */}
        <TutorialOverlay />

        {/* Settings Modal */}
        <SettingsModal isOpen={isSettingsOpen} onClose={closeSettings} />
      </div>
    </Router>
  )
}

export default AppWithSettings
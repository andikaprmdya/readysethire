import React from 'react'
import { Card, CardContent, CardHeader, Button } from '../components/ui'
import { useNavigate } from 'react-router-dom'
import ErrorBoundary from '../components/ErrorBoundary'

/**
 * Privacy Policy page with consistent dark/glassmorphism UI
 */
export default function PrivacyPolicy(): React.JSX.Element {
  const navigate = useNavigate()

  return (
    <ErrorBoundary>
      <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-gray-900 via-indigo-950 to-black">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <Card variant="glass" padding="lg" className="mb-8 backdrop-blur-md bg-white/5 border-white/10">
            <CardHeader
              title="Privacy Policy"
              subtitle={`Last updated: ${new Date().toLocaleDateString()}`}
              className="text-white drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]"
            />
            <div className="mt-4">
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="mb-0 border-white/30 text-white hover:bg-white/10"
              >
                ← Back
              </Button>
            </div>
          </Card>

          {/* Privacy Policy Content */}
          <Card variant="glass" padding="xl" className="backdrop-blur-md bg-white/5 border-white/10">
            <CardContent>
              <div className="prose prose-invert max-w-none">

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-purple-300 drop-shadow-[0_0_6px_rgba(192,132,252,1)] mb-4">
                    1. Introduction
                  </h2>
                  <p className="text-gray-200 leading-relaxed mb-4">
                    Welcome to ReadySetHire ("we," "our," or "us"). This Privacy Policy explains how we collect, 
                    use, disclose, and safeguard your information when you use our interview management platform 
                    and related services (the "Service").
                  </p>
                  <p className="text-gray-200 leading-relaxed">
                    We are committed to protecting your privacy and ensuring you have a positive experience on 
                    our platform. This policy outlines our practices concerning the collection and use of your 
                    information across our services.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-purple-300 drop-shadow-[0_0_6px_rgba(192,132,252,1)] mb-4">
                    2. Information We Collect
                  </h2>

                  <h3 className="text-xl font-medium text-gray-100 mb-3">2.1 Information You Provide</h3>
                  <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
                    <li><strong>Account Information:</strong> Name, email address, phone number, job title, and company info</li>
                    <li><strong>Interview Content:</strong> Questions, responses, evaluations, and interview recordings</li>
                    <li><strong>Applicant Data:</strong> Resume information, contact details, and interview responses</li>
                    <li><strong>Communication Data:</strong> Messages, feedback, and support communications</li>
                  </ul>

                  <h3 className="text-xl font-medium text-gray-100 mb-3">2.2 Automatically Collected Information</h3>
                  <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
                    <li><strong>Usage Data:</strong> Pages visited, features used, time spent on platform</li>
                    <li><strong>Device Information:</strong> IP address, browser type, OS, device identifiers</li>
                    <li><strong>Cookies and Tracking:</strong> Preferences, session data, analytics info</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-purple-300 drop-shadow-[0_0_6px_rgba(192,132,252,1)] mb-4">
                    3. How We Use Your Information
                  </h2>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li>Provide, operate, and maintain our platform</li>
                    <li>Process and facilitate interview sessions</li>
                    <li>Send important account and interview notifications</li>
                    <li>Improve our services and add new features</li>
                    <li>Provide customer support</li>
                    <li>Ensure platform security and prevent fraud</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-purple-300 drop-shadow-[0_0_6px_rgba(192,132,252,1)] mb-4">
                    4. Information Sharing and Disclosure
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    We do not sell or trade your personal information except in these cases:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li><strong>With Your Consent:</strong> When you explicitly authorize sharing</li>
                    <li><strong>Service Providers:</strong> Trusted third parties assisting operations</li>
                    <li><strong>Legal Requirements:</strong> When required by law</li>
                    <li><strong>Business Transfers:</strong> During mergers or acquisitions</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-purple-300 drop-shadow-[0_0_6px_rgba(192,132,252,1)] mb-4">
                    5. Data Security
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    We implement strong technical and organizational measures:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li>Encryption of data in transit and at rest</li>
                    <li>Regular security audits</li>
                    <li>Access controls and authentication</li>
                    <li>Secure backups</li>
                    <li>Employee data protection training</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-purple-300 drop-shadow-[0_0_6px_rgba(192,132,252,1)] mb-4">
                    6. Your Privacy Rights
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Depending on your location, you may have rights to:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li><strong>Access:</strong> Request your personal data</li>
                    <li><strong>Correction:</strong> Fix inaccurate info</li>
                    <li><strong>Deletion:</strong> Remove your data</li>
                    <li><strong>Portability:</strong> Transfer your data</li>
                    <li><strong>Objection:</strong> Opt out of certain processing</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-purple-300 drop-shadow-[0_0_6px_rgba(192,132,252,1)] mb-4">
                    7. Data Retention
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    We retain data as long as necessary for our services and legal obligations. You may request deletion,
                    subject to operational and compliance requirements.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-purple-300 drop-shadow-[0_0_6px_rgba(192,132,252,1)] mb-4">
                    8. Cookies and Tracking
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    We use cookies and tracking to enhance your experience:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li><strong>Essential:</strong> Required for functionality</li>
                    <li><strong>Analytics:</strong> Understand usage</li>
                    <li><strong>Preferences:</strong> Remember settings</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-purple-300 drop-shadow-[0_0_6px_rgba(192,132,252,1)] mb-4">
                    9. International Data Transfers
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    Your information may be processed abroad with safeguards ensuring compliance with privacy laws.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-purple-300 drop-shadow-[0_0_6px_rgba(192,132,252,1)] mb-4">
                    10. Children's Privacy
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    Our Service is not for children under 13, and we do not knowingly collect their data. Contact us if
                    you believe a child has provided info.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-purple-300 drop-shadow-[0_0_6px_rgba(192,132,252,1)] mb-4">
                    11. Changes to This Privacy Policy
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    We may update this Privacy Policy and will post changes with a new "Last updated" date. Check
                    periodically for updates.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-purple-300 drop-shadow-[0_0_6px_rgba(192,132,252,1)] mb-4">
                    12. Contact Information
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    For questions, contact us:
                  </p>
                  <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                    <p className="text-gray-200 mb-2"><strong>Email:</strong> privacy@readysethire.com</p>
                    <p className="text-gray-200 mb-2"><strong>Address:</strong> ReadySetHire Privacy Team</p>
                    <p className="text-gray-200">123 Business Ave, Suite 100, Tech City, TC 12345</p>
                  </div>
                </section>

              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ErrorBoundary>
  )
}

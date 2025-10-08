import React from 'react'
import { Card, CardContent, CardHeader, Button } from '../components/ui'
import { useNavigate } from 'react-router-dom'
import ErrorBoundary from '../components/ErrorBoundary'

/**
 * Terms of Service page with consistent dark/glassmorphism UI
 */
export default function TermsOfService(): React.JSX.Element {
  const navigate = useNavigate()

  return (
    <ErrorBoundary>
      <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-gray-900 via-indigo-950 to-black">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <Card variant="glass" padding="lg" className="mb-8 backdrop-blur-md bg-white/5 border-white/10">
            <CardHeader
              title="Terms of Service"
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

          {/* Terms of Service Content */}
          <Card variant="glass" padding="xl" className="backdrop-blur-md bg-white/5 border-white/10">
            <CardContent>
              <div className="prose prose-invert max-w-none">

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-purple-300 drop-shadow-[0_0_6px_rgba(192,132,252,1)] mb-4">
                    1. Acceptance of Terms
                  </h2>
                  <p className="text-gray-200 leading-relaxed mb-4">
                    Welcome to ReadySetHire. These Terms of Service ("Terms") govern your use of our interview 
                    management platform and related services (the "Service") provided by ReadySetHire ("we," "us," or "our").
                  </p>
                  <p className="text-gray-200 leading-relaxed">
                    By accessing or using our Service, you agree to be bound by these Terms. If you do not agree, 
                    please do not use our Service.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-purple-300 drop-shadow-[0_0_6px_rgba(192,132,252,1)] mb-4">
                    2. Description of Service
                  </h2>
                  <p className="text-gray-200 leading-relaxed mb-4">
                    ReadySetHire is an AI-powered interview management platform that provides:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li>Automated interview question generation and management</li>
                    <li>Real-time candidate evaluation and tracking</li>
                    <li>Voice recording and speech-to-text capabilities</li>
                    <li>Analytics and reporting tools</li>
                    <li>Collaborative hiring workflows</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-purple-300 drop-shadow-[0_0_6px_rgba(192,132,252,1)] mb-4">
                    3. User Accounts and Registration
                  </h2>

                  <h3 className="text-xl font-medium text-gray-100 mb-3">3.1 Account Creation</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    To use our Service, you must create an account with accurate information. You are responsible 
                    for maintaining the security of your account and password.
                  </p>

                  <h3 className="text-xl font-medium text-gray-100 mb-3">3.2 Account Responsibilities</h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li>You are responsible for all activities under your account</li>
                    <li>You must notify us immediately of unauthorized access</li>
                    <li>You must not share your credentials with others</li>
                    <li>You must comply with applicable laws</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-purple-300 drop-shadow-[0_0_6px_rgba(192,132,252,1)] mb-4">
                    4. Acceptable Use Policy
                  </h2>

                  <h3 className="text-xl font-medium text-gray-100 mb-3">4.1 Permitted Uses</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    You may use our Service for legitimate hiring and recruitment purposes.
                  </p>

                  <h3 className="text-xl font-medium text-gray-100 mb-3">4.2 Prohibited Activities</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">You agree not to:</p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li>Use the Service for illegal or unauthorized purposes</li>
                    <li>Violate laws, regulations, or third-party rights</li>
                    <li>Upload malicious code</li>
                    <li>Attempt to gain unauthorized access</li>
                    <li>Disrupt the Service or servers</li>
                    <li>Use bots or scrapers without permission</li>
                    <li>Discriminate against candidates</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-purple-300 drop-shadow-[0_0_6px_rgba(192,132,252,1)] mb-4">
                    5. Intellectual Property Rights
                  </h2>

                  <h3 className="text-xl font-medium text-gray-100 mb-3">5.1 Our Rights</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    The Service and its content are owned by ReadySetHire and protected by intellectual property laws.
                  </p>

                  <h3 className="text-xl font-medium text-gray-100 mb-3">5.2 Your Content</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    You retain ownership of content you submit. By submitting, you grant us a license to use and display 
                    it as needed to provide the Service.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-purple-300 drop-shadow-[0_0_6px_rgba(192,132,252,1)] mb-4">
                    6. Privacy and Data Protection
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Your privacy is important. By using our Service, you agree to our Privacy Policy and acknowledge 
                    responsibility for obtaining candidate data consents where required.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-purple-300 drop-shadow-[0_0_6px_rgba(192,132,252,1)] mb-4">
                    7. Payment Terms
                  </h2>

                  <h3 className="text-xl font-medium text-gray-100 mb-3">7.1 Subscription Fees</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Certain features may require fees. All fees are non-refundable unless otherwise stated.
                  </p>

                  <h3 className="text-xl font-medium text-gray-100 mb-3">7.2 Billing and Renewals</h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li>Subscriptions renew automatically unless canceled</li>
                    <li>Fees are charged in advance</li>
                    <li>Price changes require 30 days notice</li>
                    <li>You may cancel anytime</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-purple-300 drop-shadow-[0_0_6px_rgba(192,132,252,1)] mb-4">
                    8. Service Availability and Modifications
                  </h2>

                  <h3 className="text-xl font-medium text-gray-100 mb-3">8.1 Availability</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    We strive for high availability but cannot guarantee uninterrupted service.
                  </p>

                  <h3 className="text-xl font-medium text-gray-100 mb-3">8.2 Modifications</h3>
                  <p className="text-gray-300 leading-relaxed">
                    We may modify or discontinue features with reasonable notice.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-purple-300 drop-shadow-[0_0_6px_rgba(192,132,252,1)] mb-4">
                    9. Disclaimers and Limitations
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    The Service is provided "as is" without warranties. We disclaim liability to the fullest extent permitted.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-purple-300 drop-shadow-[0_0_6px_rgba(192,132,252,1)] mb-4">
                    10. Indemnification
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    You agree to indemnify and hold ReadySetHire harmless against claims arising from your use of the Service.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-purple-300 drop-shadow-[0_0_6px_rgba(192,132,252,1)] mb-4">
                    11. Termination
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    We may suspend or terminate accounts for violations of these Terms. You may also terminate by deleting your account.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-purple-300 drop-shadow-[0_0_6px_rgba(192,132,252,1)] mb-4">
                    12. Governing Law and Dispute Resolution
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    These Terms are governed by the laws of [Jurisdiction].
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    Disputes will be resolved by binding arbitration under [Arbitration Organization] rules, unless court relief is sought for IP rights.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-purple-300 drop-shadow-[0_0_6px_rgba(192,132,252,1)] mb-4">
                    13. Changes to Terms
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    We may modify these Terms and will provide notice. Continued use means acceptance of the updated Terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-purple-300 drop-shadow-[0_0_6px_rgba(192,132,252,1)] mb-4">
                    14. Contact Information
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    If you have questions about these Terms, contact us:
                  </p>
                  <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                    <p className="text-gray-200 mb-2"><strong>Email:</strong> legal@readysethire.com</p>
                    <p className="text-gray-200 mb-2"><strong>Address:</strong> ReadySetHire Legal Department</p>
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

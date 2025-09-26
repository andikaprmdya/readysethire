import React from 'react'
import { Card, CardContent, CardHeader, Button } from '../components/ui'
import { useNavigate } from 'react-router-dom'
import ErrorBoundary from '../components/ErrorBoundary'

/**
 * Privacy Policy page with comprehensive privacy information
 * Features professional layout and easy navigation
 */
export default function PrivacyPolicy(): React.JSX.Element {
  const navigate = useNavigate()

  return (
    <ErrorBoundary>
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <Card variant="glass" padding="lg" className="mb-8">
            <CardHeader
              title="Privacy Policy"
              subtitle={`Last updated: ${new Date().toLocaleDateString()}`}
            />
            <div className="mt-4">
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="mb-0"
              >
                ← Back
              </Button>
            </div>
          </Card>

          {/* Privacy Policy Content */}
          <Card variant="elevated" padding="xl">
            <CardContent>
              <div className="prose prose-gray max-w-none">
                
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Welcome to ReadySetHire ("we," "our," or "us"). This Privacy Policy explains how we collect, 
                    use, disclose, and safeguard your information when you use our interview management platform 
                    and related services (the "Service").
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    We are committed to protecting your privacy and ensuring you have a positive experience on 
                    our platform. This policy outlines our practices concerning the collection and use of your 
                    information across our services.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
                  
                  <h3 className="text-xl font-medium text-gray-800 mb-3">2.1 Information You Provide</h3>
                  <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                    <li><strong>Account Information:</strong> Name, email address, phone number, job title, and company information</li>
                    <li><strong>Interview Content:</strong> Questions, responses, evaluations, and interview recordings</li>
                    <li><strong>Applicant Data:</strong> Resume information, contact details, and interview responses</li>
                    <li><strong>Communication Data:</strong> Messages, feedback, and support communications</li>
                  </ul>

                  <h3 className="text-xl font-medium text-gray-800 mb-3">2.2 Automatically Collected Information</h3>
                  <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                    <li><strong>Usage Data:</strong> Pages visited, features used, time spent on platform</li>
                    <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
                    <li><strong>Cookies and Tracking:</strong> Preferences, session data, and analytics information</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Provide, operate, and maintain our interview platform</li>
                    <li>Process and facilitate interview sessions and evaluations</li>
                    <li>Send important notifications about your account and interviews</li>
                    <li>Improve our services and develop new features</li>
                    <li>Provide customer support and respond to your inquiries</li>
                    <li>Ensure platform security and prevent fraudulent activity</li>
                    <li>Comply with legal obligations and enforce our terms</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li><strong>With Your Consent:</strong> When you explicitly authorize us to share information</li>
                    <li><strong>Service Providers:</strong> Trusted third parties who assist in operating our platform</li>
                    <li><strong>Legal Requirements:</strong> When required by law or to protect rights and safety</li>
                    <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We implement appropriate technical and organizational security measures to protect your information:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Encryption of data in transit and at rest</li>
                    <li>Regular security assessments and monitoring</li>
                    <li>Access controls and authentication measures</li>
                    <li>Secure data storage and backup procedures</li>
                    <li>Employee training on data protection practices</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Privacy Rights</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Depending on your location, you may have the following rights regarding your personal information:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li><strong>Access:</strong> Request access to your personal information</li>
                    <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
                    <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                    <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                    <li><strong>Objection:</strong> Object to certain processing of your information</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Data Retention</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We retain your information for as long as necessary to provide our services and fulfill the purposes 
                    outlined in this Privacy Policy. Interview data may be retained for reasonable periods to maintain 
                    historical records and comply with legal obligations. You may request deletion of your data at any time, 
                    subject to legal and operational requirements.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Cookies and Tracking Technologies</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We use cookies and similar technologies to enhance your experience on our platform:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li><strong>Essential Cookies:</strong> Required for basic platform functionality</li>
                    <li><strong>Analytics Cookies:</strong> Help us understand how you use our platform</li>
                    <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. International Data Transfers</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Your information may be transferred to and processed in countries other than your own. We ensure 
                    appropriate safeguards are in place to protect your information in accordance with applicable 
                    data protection laws and this Privacy Policy.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Children's Privacy</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Our Service is not intended for children under the age of 13. We do not knowingly collect 
                    personal information from children under 13. If you become aware that a child has provided us 
                    with personal information, please contact us so we can take appropriate action.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to This Privacy Policy</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We may update this Privacy Policy from time to time. We will notify you of any changes by 
                    posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage 
                    you to review this Privacy Policy periodically for any changes.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Information</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    If you have any questions about this Privacy Policy or our privacy practices, please contact us:
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-700 mb-2"><strong>Email:</strong> privacy@readysethire.com</p>
                    <p className="text-gray-700 mb-2"><strong>Address:</strong> ReadySetHire Privacy Team</p>
                    <p className="text-gray-700">123 Business Ave, Suite 100, Tech City, TC 12345</p>
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
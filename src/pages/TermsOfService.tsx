import React from 'react'
import { Card, CardContent, CardHeader, Button } from '../components/ui'
import { useNavigate } from 'react-router-dom'
import ErrorBoundary from '../components/ErrorBoundary'

/**
 * Terms of Service page with comprehensive legal terms
 * Features professional layout and easy navigation
 */
export default function TermsOfService(): React.JSX.Element {
  const navigate = useNavigate()

  return (
    <ErrorBoundary>
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <Card variant="glass" padding="lg" className="mb-8">
            <CardHeader
              title="Terms of Service"
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

          {/* Terms of Service Content */}
          <Card variant="elevated" padding="xl">
            <CardContent>
              <div className="prose prose-gray max-w-none">
                
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Welcome to ReadySetHire. These Terms of Service ("Terms") govern your use of our interview 
                    management platform and related services (the "Service") provided by ReadySetHire ("we," "us," or "our").
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    By accessing or using our Service, you agree to be bound by these Terms. If you do not agree 
                    to these Terms, please do not use our Service.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    ReadySetHire is an AI-powered interview management platform that provides:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Automated interview question generation and management</li>
                    <li>Real-time candidate evaluation and tracking systems</li>
                    <li>Voice recording and speech-to-text capabilities</li>
                    <li>Comprehensive analytics and reporting tools</li>
                    <li>Collaborative hiring workflow management</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts and Registration</h2>
                  
                  <h3 className="text-xl font-medium text-gray-800 mb-3">3.1 Account Creation</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    To use our Service, you must create an account and provide accurate, complete, and current information. 
                    You are responsible for maintaining the security of your account and password.
                  </p>

                  <h3 className="text-xl font-medium text-gray-800 mb-3">3.2 Account Responsibilities</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>You are responsible for all activities that occur under your account</li>
                    <li>You must notify us immediately of any unauthorized access</li>
                    <li>You must not share your account credentials with others</li>
                    <li>You must comply with all applicable laws and regulations</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Acceptable Use Policy</h2>
                  
                  <h3 className="text-xl font-medium text-gray-800 mb-3">4.1 Permitted Uses</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    You may use our Service for legitimate hiring and recruitment purposes in accordance with these Terms.
                  </p>

                  <h3 className="text-xl font-medium text-gray-800 mb-3">4.2 Prohibited Activities</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">You agree not to:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Use the Service for any illegal or unauthorized purpose</li>
                    <li>Violate any laws, regulations, or third-party rights</li>
                    <li>Upload malicious code, viruses, or harmful content</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                    <li>Interfere with or disrupt the Service or servers</li>
                    <li>Use automated tools to access the Service without permission</li>
                    <li>Discriminate against candidates based on protected characteristics</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Intellectual Property Rights</h2>
                  
                  <h3 className="text-xl font-medium text-gray-800 mb-3">5.1 Our Rights</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    The Service and its original content, features, and functionality are owned by ReadySetHire and are 
                    protected by copyright, trademark, patent, trade secret, and other intellectual property laws.
                  </p>

                  <h3 className="text-xl font-medium text-gray-800 mb-3">5.2 Your Content</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    You retain ownership of any content you submit to the Service. By submitting content, you grant us 
                    a license to use, modify, and display such content as necessary to provide the Service.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Privacy and Data Protection</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect 
                    your information when you use our Service. By using our Service, you agree to the collection 
                    and use of information in accordance with our Privacy Policy.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    You acknowledge that you are responsible for obtaining necessary consents from interview candidates 
                    for recording and processing their data through our platform.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Payment Terms</h2>
                  
                  <h3 className="text-xl font-medium text-gray-800 mb-3">7.1 Subscription Fees</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Use of certain features of our Service may require payment of fees. All fees are non-refundable 
                    unless otherwise specified in your subscription agreement.
                  </p>

                  <h3 className="text-xl font-medium text-gray-800 mb-3">7.2 Billing and Renewals</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Subscriptions automatically renew unless cancelled</li>
                    <li>Fees are charged in advance on a recurring basis</li>
                    <li>Price changes will be communicated with 30 days notice</li>
                    <li>You may cancel your subscription at any time</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Service Availability and Modifications</h2>
                  
                  <h3 className="text-xl font-medium text-gray-800 mb-3">8.1 Service Availability</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We strive to maintain high service availability but cannot guarantee uninterrupted access. 
                    Scheduled maintenance and unexpected downtime may occur.
                  </p>

                  <h3 className="text-xl font-medium text-gray-800 mb-3">8.2 Modifications</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We reserve the right to modify, suspend, or discontinue any part of the Service at any time. 
                    We will provide reasonable notice of significant changes.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Disclaimers and Limitations of Liability</h2>
                  
                  <h3 className="text-xl font-medium text-gray-800 mb-3">9.1 Service Disclaimer</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS 
                    OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
                    PURPOSE, AND NON-INFRINGEMENT.
                  </p>

                  <h3 className="text-xl font-medium text-gray-800 mb-3">9.2 Limitation of Liability</h3>
                  <p className="text-gray-700 leading-relaxed">
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, READYSETHIRE SHALL NOT BE LIABLE FOR ANY INDIRECT, 
                    INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF 
                    PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Indemnification</h2>
                  <p className="text-gray-700 leading-relaxed">
                    You agree to indemnify, defend, and hold harmless ReadySetHire and its officers, directors, 
                    employees, and agents from and against any claims, damages, obligations, losses, liabilities, 
                    costs, or debt, and expenses (including attorney's fees) arising from your use of the Service 
                    or violation of these Terms.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Termination</h2>
                  
                  <h3 className="text-xl font-medium text-gray-800 mb-3">11.1 Termination by You</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    You may terminate your account at any time by contacting us or using the account deletion feature.
                  </p>

                  <h3 className="text-xl font-medium text-gray-800 mb-3">11.2 Termination by Us</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We may terminate or suspend your account and access to the Service immediately, without prior 
                    notice, for violation of these Terms or for any other reason at our sole discretion.
                  </p>

                  <h3 className="text-xl font-medium text-gray-800 mb-3">11.3 Effect of Termination</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Upon termination, your right to use the Service will cease immediately. You may request export 
                    of your data within 30 days of termination.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Governing Law and Dispute Resolution</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    These Terms shall be governed by and construed in accordance with the laws of [Jurisdiction], 
                    without regard to its conflict of law provisions.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Any disputes arising under these Terms shall be resolved through binding arbitration in accordance 
                    with the rules of [Arbitration Organization], except that either party may seek injunctive relief 
                    in court for violations of intellectual property rights.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Changes to Terms</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We reserve the right to modify these Terms at any time. If we make material changes, we will 
                    notify you by email or through the Service. Your continued use of the Service after such 
                    modifications constitutes acceptance of the updated Terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Contact Information</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    If you have any questions about these Terms, please contact us:
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-700 mb-2"><strong>Email:</strong> legal@readysethire.com</p>
                    <p className="text-gray-700 mb-2"><strong>Address:</strong> ReadySetHire Legal Department</p>
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
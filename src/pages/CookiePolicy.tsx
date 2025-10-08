import React from 'react'
import { Card, CardContent, CardHeader, Button } from '../components/ui'
import { useNavigate } from 'react-router-dom'
import ErrorBoundary from '../components/ErrorBoundary'

/**
 * Cookie Policy page with consistent dark theme & glowing headers
 */
export default function CookiePolicy(): React.JSX.Element {
  const navigate = useNavigate()

  return (
    <ErrorBoundary>
      <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-gray-900 via-indigo-950 to-black">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <Card variant="glass" padding="lg" className="mb-8 backdrop-blur-md bg-white/5 border-white/10">
            <CardHeader
              title="Cookie Policy"
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

          {/* Cookie Policy Content */}
          <Card variant="glass" padding="xl" className="backdrop-blur-md bg-white/5 border-white/10">
            <CardContent>
              <div className="prose prose-invert max-w-none">

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-purple-300 drop-shadow-[0_0_6px_rgba(192,132,252,1)] mb-4">
                    1. What Are Cookies?
                  </h2>
                  <p className="text-gray-200 leading-relaxed mb-4">
                    Cookies are small text files that are stored on your device when you visit our website. They help us
                    provide you with a better experience by remembering your preferences and improving the functionality
                    of our ReadySetHire platform.
                  </p>
                  <p className="text-gray-200 leading-relaxed">
                    This Cookie Policy explains what cookies are, how we use them, what types we use, and how you can
                    control your preferences.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-purple-300 drop-shadow-[0_0_6px_rgba(192,132,252,1)] mb-4">
                    2. How We Use Cookies
                  </h2>
                  <p className="text-gray-200 leading-relaxed mb-4">We use cookies for several important purposes:</p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li><strong>Authentication:</strong> Keep you logged in</li>
                    <li><strong>Preferences:</strong> Remember your settings</li>
                    <li><strong>Security:</strong> Protect against fraud</li>
                    <li><strong>Analytics:</strong> Improve our services</li>
                    <li><strong>Performance:</strong> Ensure smooth operation</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-purple-300 drop-shadow-[0_0_6px_rgba(192,132,252,1)] mb-4">
                    3. Types of Cookies We Use
                  </h2>

                  <h3 className="text-xl font-medium text-gray-100 mb-3">3.1 Essential Cookies</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    These cookies are necessary for the site to function properly.
                  </p>
                  <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-700/50 mb-4">
                    <p className="text-sm text-purple-200"><strong>Examples:</strong></p>
                    <ul className="text-sm text-purple-300 mt-2 space-y-1">
                      <li>• Session identification cookies</li>
                      <li>• Authentication cookies</li>
                      <li>• Load balancing cookies</li>
                    </ul>
                  </div>

                  <h3 className="text-xl font-medium text-gray-100 mb-3">3.2 Functional Cookies</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    These cookies enable enhanced functionality and personalization.
                  </p>
                  <div className="bg-green-900/30 rounded-lg p-4 border border-green-700/50 mb-4">
                    <p className="text-sm text-green-200"><strong>Examples:</strong></p>
                    <ul className="text-sm text-green-300 mt-2 space-y-1">
                      <li>• Language preference cookies</li>
                      <li>• Theme and display cookies</li>
                      <li>• Interview template cookies</li>
                    </ul>
                  </div>

                  <h3 className="text-xl font-medium text-gray-100 mb-3">3.3 Analytics Cookies</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    These help us understand how visitors interact with our platform.
                  </p>
                  <div className="bg-amber-900/30 rounded-lg p-4 border border-amber-700/50 mb-4">
                    <p className="text-sm text-amber-200"><strong>Examples:</strong></p>
                    <ul className="text-sm text-amber-300 mt-2 space-y-1">
                      <li>• Google Analytics cookies</li>
                      <li>• Performance monitoring cookies</li>
                      <li>• Usage statistics cookies</li>
                    </ul>
                  </div>

                  <h3 className="text-xl font-medium text-gray-100 mb-3">3.4 Marketing Cookies</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    These cookies track your activity across websites to deliver relevant ads.
                  </p>
                  <div className="bg-pink-900/30 rounded-lg p-4 border border-pink-700/50 mb-4">
                    <p className="text-sm text-pink-200"><strong>Examples:</strong></p>
                    <ul className="text-sm text-pink-300 mt-2 space-y-1">
                      <li>• Advertising platform cookies</li>
                      <li>• Social media tracking cookies</li>
                      <li>• Retargeting cookies</li>
                    </ul>
                  </div>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-purple-300 drop-shadow-[0_0_6px_rgba(192,132,252,1)] mb-4">
                    4. Third-Party Cookies
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Some cookies on our platform are set by third-party services that appear on our pages.
                  </p>
                  <div className="space-y-4">
                    <div className="border border-white/20 rounded-lg p-4 bg-white/5">
                      <h4 className="font-semibold text-gray-100 mb-2">Google Analytics</h4>
                      <p className="text-gray-300 text-sm">
                        We use Google Analytics to analyze how users interact with our platform.
                      </p>
                    </div>
                    <div className="border border-white/20 rounded-lg p-4 bg-white/5">
                      <h4 className="font-semibold text-gray-100 mb-2">Authentication Services</h4>
                      <p className="text-gray-300 text-sm">
                        Third-party authentication may set cookies to manage secure logins.
                      </p>
                    </div>
                    <div className="border border-white/20 rounded-lg p-4 bg-white/5">
                      <h4 className="font-semibold text-gray-100 mb-2">Content Delivery Networks</h4>
                      <p className="text-gray-300 text-sm">
                        CDNs may set performance-related cookies to deliver content efficiently.
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-purple-300 drop-shadow-[0_0_6px_rgba(192,132,252,1)] mb-4">
                    10. Contact Us
                  </h2>
                  <p className="text-gray-200 leading-relaxed mb-4">
                    If you have questions about this Cookie Policy, please contact us:
                  </p>
                  <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                    <p className="text-gray-200 mb-2"><strong>Email:</strong> privacy@readysethire.com</p>
                    <p className="text-gray-200 mb-2"><strong>Subject:</strong> Cookie Policy Inquiry</p>
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

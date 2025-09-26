import React from 'react'
import { Card, CardContent, CardHeader, Button } from '../components/ui'
import { useNavigate } from 'react-router-dom'
import ErrorBoundary from '../components/ErrorBoundary'

/**
 * Cookie Policy page with comprehensive cookie information
 * Features professional layout and easy navigation
 */
export default function CookiePolicy(): React.JSX.Element {
  const navigate = useNavigate()

  return (
    <ErrorBoundary>
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <Card variant="glass" padding="lg" className="mb-8 backdrop-blur-md bg-white/5 border-white/10">
            <CardHeader
              title="Cookie Policy"
              subtitle={`Last updated: ${new Date().toLocaleDateString()}`}
              className="text-white"
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
              <div className="prose max-w-none">

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-white/90 mb-4">1. What Are Cookies?</h2>
                  <p className="text-white/80 leading-relaxed mb-4">
                    Cookies are small text files that are stored on your device when you visit our website. They help us
                    provide you with a better experience by remembering your preferences and improving the functionality
                    of our ReadySetHire platform.
                  </p>
                  <p className="text-white/80 leading-relaxed">
                    This Cookie Policy explains what cookies are, how we use them on our interview management platform,
                    what types of cookies we use, and how you can control your cookie preferences.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Cookies</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We use cookies for several important purposes:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li><strong>Authentication:</strong> To keep you logged in to your account</li>
                    <li><strong>Preferences:</strong> To remember your settings and preferences</li>
                    <li><strong>Security:</strong> To protect against fraudulent activity and secure your account</li>
                    <li><strong>Analytics:</strong> To understand how you use our platform and improve our services</li>
                    <li><strong>Performance:</strong> To ensure our platform runs smoothly and efficiently</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Types of Cookies We Use</h2>
                  
                  <h3 className="text-xl font-medium text-gray-800 mb-3">3.1 Essential Cookies</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    These cookies are necessary for the website to function properly. They enable core functionality 
                    such as security, network management, and accessibility.
                  </p>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-4">
                    <p className="text-sm text-blue-800"><strong>Examples:</strong></p>
                    <ul className="text-sm text-blue-700 mt-2 space-y-1">
                      <li>• Session identification cookies</li>
                      <li>• Authentication and security cookies</li>
                      <li>• Load balancing cookies</li>
                    </ul>
                  </div>

                  <h3 className="text-xl font-medium text-gray-800 mb-3">3.2 Functional Cookies</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    These cookies enable enhanced functionality and personalization, such as remembering your 
                    preferences and providing customized content.
                  </p>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200 mb-4">
                    <p className="text-sm text-green-800"><strong>Examples:</strong></p>
                    <ul className="text-sm text-green-700 mt-2 space-y-1">
                      <li>• Language preference cookies</li>
                      <li>• Theme and display preference cookies</li>
                      <li>• Interview template preference cookies</li>
                    </ul>
                  </div>

                  <h3 className="text-xl font-medium text-gray-800 mb-3">3.3 Analytics Cookies</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    These cookies help us understand how visitors interact with our platform by collecting and 
                    reporting information anonymously.
                  </p>
                  <div className="bg-amber-50 rounded-lg p-4 border border-amber-200 mb-4">
                    <p className="text-sm text-amber-800"><strong>Examples:</strong></p>
                    <ul className="text-sm text-amber-700 mt-2 space-y-1">
                      <li>• Google Analytics cookies</li>
                      <li>• Performance monitoring cookies</li>
                      <li>• Usage statistics cookies</li>
                    </ul>
                  </div>

                  <h3 className="text-xl font-medium text-gray-800 mb-3">3.4 Marketing Cookies</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    These cookies track your activity across websites to help deliver more relevant advertising and 
                    limit the number of times you see an advertisement.
                  </p>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200 mb-4">
                    <p className="text-sm text-purple-800"><strong>Examples:</strong></p>
                    <ul className="text-sm text-purple-700 mt-2 space-y-1">
                      <li>• Advertising platform cookies</li>
                      <li>• Social media tracking cookies</li>
                      <li>• Retargeting cookies</li>
                    </ul>
                  </div>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Third-Party Cookies</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Some cookies on our platform are set by third-party services that appear on our pages. We use 
                    several third-party services that may set their own cookies:
                  </p>
                  
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Google Analytics</h4>
                      <p className="text-gray-700 text-sm">
                        We use Google Analytics to analyze how users interact with our platform. Google Analytics 
                        sets cookies to help us compile reports and improve our services.
                      </p>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Authentication Services</h4>
                      <p className="text-gray-700 text-sm">
                        We may use third-party authentication services that set cookies to manage secure login processes.
                      </p>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Content Delivery Networks</h4>
                      <p className="text-gray-700 text-sm">
                        We use CDNs to deliver content efficiently, which may set performance-related cookies.
                      </p>
                    </div>
                  </div>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Cookie Duration</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Cookies may be stored for different periods:
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Session Cookies</h4>
                      <p className="text-gray-700 text-sm">
                        Temporary cookies that are deleted when you close your browser. These are used for essential 
                        platform functionality.
                      </p>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Persistent Cookies</h4>
                      <p className="text-gray-700 text-sm">
                        Cookies that remain on your device for a set period or until manually deleted. These remember 
                        your preferences across visits.
                      </p>
                    </div>
                  </div>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Managing Your Cookie Preferences</h2>
                  
                  <h3 className="text-xl font-medium text-gray-800 mb-3">6.1 Browser Settings</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Most web browsers allow you to control cookies through their settings. You can:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                    <li>View which cookies are stored on your device</li>
                    <li>Delete cookies individually or in bulk</li>
                    <li>Block cookies from specific websites</li>
                    <li>Block all cookies (though this may affect site functionality)</li>
                    <li>Set preferences for future cookie storage</li>
                  </ul>

                  <h3 className="text-xl font-medium text-gray-800 mb-3">6.2 Platform Cookie Settings</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We provide cookie preference controls within our platform where you can:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Accept or reject non-essential cookies</li>
                    <li>Customize your cookie preferences by category</li>
                    <li>Update your preferences at any time</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Browser-Specific Instructions</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Here's how to manage cookies in popular browsers:
                  </p>
                  
                  <div className="space-y-3">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Google Chrome</h4>
                      <p className="text-gray-700 text-sm">
                        Settings → Privacy and security → Cookies and other site data → Manage cookies and site data
                      </p>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Mozilla Firefox</h4>
                      <p className="text-gray-700 text-sm">
                        Options → Privacy & Security → Cookies and Site Data → Manage Data
                      </p>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Safari</h4>
                      <p className="text-gray-700 text-sm">
                        Preferences → Privacy → Manage Website Data
                      </p>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Microsoft Edge</h4>
                      <p className="text-gray-700 text-sm">
                        Settings → Cookies and site permissions → Manage and delete cookies and site data
                      </p>
                    </div>
                  </div>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Impact of Disabling Cookies</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    While you can disable cookies, please note that this may affect your experience on our platform:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>You may need to log in repeatedly</li>
                    <li>Your preferences may not be saved</li>
                    <li>Some features may not work properly</li>
                    <li>Performance may be reduced</li>
                    <li>Personalized content may not be available</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Updates to This Cookie Policy</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We may update this Cookie Policy from time to time to reflect changes in our practices or for 
                    other operational, legal, or regulatory reasons. We will notify you of any material changes by 
                    posting the updated policy on our website and updating the "Last updated" date.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Us</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    If you have any questions about our use of cookies or this Cookie Policy, please contact us:
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-700 mb-2"><strong>Email:</strong> privacy@readysethire.com</p>
                    <p className="text-gray-700 mb-2"><strong>Subject:</strong> Cookie Policy Inquiry</p>
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
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, Button, Modal, ModalHeader, ModalBody, ModalFooter } from '../components/ui'
import TutorialButton from '../components/TutorialButton'

/**
 * Feature data for the homepage cards
 */
const features = [
  {
    id: 'smart-interviews',
    icon: '📋',
    title: 'Smart Interviews',
    description: 'Create and manage interviews with AI-powered question generation and automated scheduling',
    fullDescription: 'Our Smart Interview system revolutionizes recruitment by combining AI-powered question generation with automated scheduling. Features include: dynamic question creation based on job roles, customizable interview templates, real-time candidate tracking, and seamless integration with your existing workflow.',
    features: ['AI-Powered Question Generation', 'Automated Scheduling', 'Customizable Templates', 'Real-time Tracking'],
    howToUse: [
      'Navigate to the Interviews page',
      'Click "Create New Interview"',
      'Select job role and preferences',
      'AI generates relevant questions',
      'Customize as needed and publish'
    ],
    color: 'from-blue-600 to-blue-700'
  },
  {
    id: 'candidate-management',
    icon: '👥',
    title: 'Candidate Management',
    description: 'Track and evaluate candidates with comprehensive analytics and detailed response analysis',
    fullDescription: 'Comprehensive candidate management system that provides deep insights into applicant performance. Track progress, analyze responses, and make data-driven hiring decisions with our advanced analytics dashboard.',
    features: ['Response Analysis', 'Performance Tracking', 'Automated Scoring', 'Detailed Reports'],
    howToUse: [
      'Candidates complete interviews',
      'System automatically analyzes responses',
      'View detailed performance metrics',
      'Compare candidates side-by-side',
      'Export reports for decision making'
    ],
    color: 'from-blue-600 to-indigo-600'
  },
  {
    id: 'data-insights',
    icon: '📊',
    title: 'Data Insights',
    description: 'Make informed decisions with real-time analytics, completion rates, and performance metrics',
    fullDescription: 'Advanced analytics platform that transforms interview data into actionable insights. Monitor completion rates, identify top performers, and optimize your recruitment process with comprehensive reporting.',
    features: ['Real-time Analytics', 'Completion Rate Tracking', 'Performance Metrics', 'Custom Reports'],
    howToUse: [
      'Data is collected automatically during interviews',
      'Access analytics from the dashboard',
      'View completion and performance trends',
      'Generate custom reports',
      'Use insights to improve processes'
    ],
    color: 'from-indigo-600 to-blue-600'
  }
] as const

/**
 * Floating orb component with random animation
 */
const FloatingOrb: React.FC<{ 
  size: number
  delay: number
  duration: number
  radius: number
  colorFrom?: string
  colorTo?: string
}> = ({ size, delay, duration, radius, colorFrom = "from-amber-400/30", colorTo = "to-yellow-500/30" }) => {
  return (
    <div
      className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                  animate-[spin_${duration}s_linear_infinite]`}
      style={{
        animationDelay: `${delay}s`
      }}
    >
      {/* ini yang bikin orb menjauh dari pusat */}
      <div
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                    translate-x-[${radius}px] rounded-full blur-2xl 
                    bg-gradient-to-r ${colorFrom} ${colorTo}`}
        style={{
          width: `${size}px`,
          height: `${size}px`
        }}
      />
    </div>
  )
}



/**
 * Professional Home page with floating orbs and morph animations
 * Features blue & gold color scheme with animated elements
 */
export default function Home(): React.JSX.Element {
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedFeature, setSelectedFeature] = useState<typeof features[0] | null>(null)
  const [showTutorial, setShowTutorial] = useState(false)

  // Trigger animations on component mount
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleFeatureClick = (feature: typeof features[0]) => {
    setSelectedFeature(feature)
  }

  const closeModal = () => {
    setSelectedFeature(null)
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
      {/* Floating Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingOrb size={320} delay={0} duration={30} radius={300} colorFrom="from-blue-400/30" colorTo="to-blue-600/20" />
        <FloatingOrb size={280} delay={5} duration={40} radius={380} colorFrom="from-amber-400/30" colorTo="to-yellow-500/20" />
        <FloatingOrb size={220} delay={10} duration={50} radius={450} colorFrom="from-indigo-400/30" colorTo="to-purple-500/20" />
        <FloatingOrb size={180} delay={15} duration={60} radius={520} colorFrom="from-pink-400/30" colorTo="to-red-500/20" />
      </div>



      {/* Hero Section */}
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Main Title with Morph Animation */}
        <div className={`mb-12 transition-all duration-1000 ${
          isLoaded 
            ? 'opacity-100 transform translate-y-0 scale-100' 
            : 'opacity-0 transform translate-y-8 scale-95'
        }`}>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight animate-morphIn">
            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent inline-block animate-slideInLeft">
              Ready
            </span>
            <span className="text-white mx-2 inline-block animate-slideInUp" style={{animationDelay: '0.2s'}}>
              Set
            </span>
            <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent inline-block animate-slideInRight" style={{animationDelay: '0.4s'}}>
              Hire
            </span>
          </h1>
          
          <p className={`text-xl md:text-2xl text-white/90 mb-6 font-light transition-all duration-1000 delay-300 ${
            isLoaded 
              ? 'opacity-100 transform translate-y-0' 
              : 'opacity-0 transform translate-y-4'
          }`}>
            Professional Interview Management Platform
          </p>
          
          <p className={`text-lg text-white/70 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-500 ${
            isLoaded 
              ? 'opacity-100 transform translate-y-0' 
              : 'opacity-0 transform translate-y-4'
          }`}>
            Streamline your recruitment process with intelligent interview management, 
            automated candidate screening, and comprehensive data analytics for better hiring decisions.
          </p>
        </div>

        {/* Informational Feature Cards with Staggered Animation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={`transform transition-all duration-1000 hover:scale-105 cursor-pointer ${
                isLoaded
                  ? 'opacity-100 translate-y-0 scale-100'
                  : 'opacity-0 translate-y-8 scale-95'
              }`}
              style={{
                transitionDelay: `${600 + index * 200}ms`
              }}
              onClick={() => handleFeatureClick(feature)}
              aria-label={`Learn more about ${feature.title}`}
            >
              <Card
                variant="glass"
                padding="lg"
                hoverable
                clickable
                className="h-full backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 group animate-morphCard"
              >
                {/* Feature Icon with Morph Animation */}
                <div className={`
                  w-16 h-16 bg-gradient-to-r ${feature.color}
                  rounded-xl flex items-center justify-center
                  mb-6 mx-auto shadow-lg
                  group-hover:shadow-xl transition-all duration-300
                  group-hover:rotate-3 group-hover:scale-110
                  animate-iconBounce
                `} style={{animationDelay: `${800 + index * 200}ms`}}>
                  <span className="text-white text-2xl font-bold transition-transform duration-300 group-hover:scale-110" role="img" aria-label={feature.title}>
                    {feature.icon}
                  </span>
                </div>

                <CardContent className="text-center">
                  <h3 className="text-xl font-bold text-white mb-4 transition-all duration-300 group-hover:text-blue-300">
                    {feature.title}
                  </h3>
                  <p className="text-white/80 leading-relaxed transition-all duration-300 group-hover:text-white/90">
                    {feature.description}
                  </p>
                  <div className="mt-4 text-blue-300 text-sm font-medium">
                    Click to learn more →
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Simplified Call to Action with Tutorial */}
        <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-1000 ${
          isLoaded
            ? 'opacity-100 transform translate-y-0 scale-100'
            : 'opacity-0 transform translate-y-6 scale-95'
        }`}>
          <Link to="/interviews">
            <Button
              variant="primary"
              size="xl"
              className="min-w-[200px] shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-buttonPulse"
            >
              Start Interviews
            </Button>
          </Link>

          <TutorialButton variant="inline" className="min-w-[200px]">
            Start Interactive Tour
          </TutorialButton>
        </div>

        {/* Professional Statistics with Staggered Animation */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { value: '100%', label: 'Digital Interview Process', gradient: 'from-blue-400 to-blue-600' },
            { value: '24/7', label: 'Candidate Access', gradient: 'from-amber-400 to-amber-600' },
            { value: 'Real-time', label: 'Analytics & Insights', gradient: 'from-blue-400 to-indigo-600' }
          ].map((stat, index) => (
            <div 
              key={index}
              className={`p-6 transition-all duration-1000 ${
                isLoaded 
                  ? 'opacity-100 transform translate-y-0' 
                  : 'opacity-0 transform translate-y-6'
              }`}
              style={{
                transitionDelay: `${1200 + index * 150}ms`
              }}
            >
              <div className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2 animate-numberCount`}>
                {stat.value}
              </div>
              <p className="text-white/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced decorative elements with morph animations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400/30 rounded-full animate-ping"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-amber-400/30 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-20 w-2 h-2 bg-blue-500/30 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-40 right-10 w-2 h-2 bg-amber-500/30 rounded-full animate-ping" style={{animationDelay: '3s'}}></div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          25% { transform: translateY(-20px) translateX(10px) rotate(2deg); }
          50% { transform: translateY(-10px) translateX(-5px) rotate(-1deg); }
          75% { transform: translateY(-25px) translateX(-10px) rotate(1deg); }
        }

        @keyframes morphIn {
          0% { 
            opacity: 0; 
            transform: scale(0.8) rotate(-5deg); 
            filter: blur(10px);
          }
          50% { 
            transform: scale(1.05) rotate(2deg); 
            filter: blur(2px);
          }
          100% { 
            opacity: 1; 
            transform: scale(1) rotate(0deg); 
            filter: blur(0px);
          }
        }

        @keyframes slideInLeft {
          0% { 
            opacity: 0; 
            transform: translateX(-100px) rotate(-10deg) scale(0.8); 
          }
          100% { 
            opacity: 1; 
            transform: translateX(0) rotate(0deg) scale(1); 
          }
        }

        @keyframes slideInRight {
          0% { 
            opacity: 0; 
            transform: translateX(100px) rotate(10deg) scale(0.8); 
          }
          100% { 
            opacity: 1; 
            transform: translateX(0) rotate(0deg) scale(1); 
          }
        }

        @keyframes slideInUp {
          0% { 
            opacity: 0; 
            transform: translateY(50px) scale(0.9); 
          }
          100% { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }

        @keyframes morphCard {
          0% { 
            opacity: 0; 
            transform: perspective(1000px) rotateY(45deg) scale(0.8); 
          }
          100% { 
            opacity: 1; 
            transform: perspective(1000px) rotateY(0deg) scale(1); 
          }
        }

        @keyframes iconBounce {
          0% { 
            opacity: 0; 
            transform: translateY(-20px) scale(0.5) rotate(180deg); 
          }
          60% { 
            transform: translateY(5px) scale(1.1) rotate(-10deg); 
          }
          100% { 
            opacity: 1; 
            transform: translateY(0) scale(1) rotate(0deg); 
          }
        }

        @keyframes buttonPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        @keyframes numberCount {
          0% { 
            opacity: 0; 
            transform: scale(0.5); 
          }
          50% { 
            transform: scale(1.2); 
          }
          100% { 
            opacity: 1; 
            transform: scale(1); 
          }
        }

        .animate-float {
          animation: float var(--duration, 10s) ease-in-out infinite;
        }

        .animate-morphIn {
          animation: morphIn 1.2s ease-out forwards;
          opacity: 0;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-slideInUp {
          animation: slideInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-morphCard {
          animation: morphCard 0.8s ease-out forwards;
        }

        .animate-iconBounce {
          animation: iconBounce 1s ease-out forwards;
          opacity: 0;
        }

        .animate-buttonPulse {
          animation: buttonPulse 2s ease-in-out infinite;
        }

        .animate-numberCount {
          animation: numberCount 0.8s ease-out forwards;
        }
      `}</style>

      {/* Feature Information Modal */}
      {selectedFeature && (
        <Modal
          isOpen={true}
          onClose={closeModal}
          title={selectedFeature.title}
          size="lg"
          className="bg-slate-900 text-white border-slate-700"
        >
          <ModalBody className="bg-slate-900">
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 bg-gradient-to-r ${selectedFeature.color} rounded-lg flex items-center justify-center`}>
                  <span className="text-white text-xl">{selectedFeature.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-white">{selectedFeature.title}</h3>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-blue-300 mb-3">Description</h4>
                <p className="text-white/80 leading-relaxed">{selectedFeature.fullDescription}</p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-blue-300 mb-3">Key Features</h4>
                <ul className="list-disc list-inside text-white/80 space-y-2">
                  {selectedFeature.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-blue-300 mb-3">How to Use</h4>
                <ol className="list-decimal list-inside text-white/80 space-y-2">
                  {selectedFeature.howToUse.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="bg-slate-900 border-slate-700">
            <Button variant="outline" onClick={closeModal} className="border-slate-600 text-white hover:bg-slate-800">
              Close
            </Button>
            <Link to="/interviews">
              <Button variant="primary" onClick={closeModal}>
                Try It Now
              </Button>
            </Link>
          </ModalFooter>
        </Modal>
      )}

      {/* Tutorial Modal */}
      {showTutorial && (
        <Modal
          isOpen={true}
          onClose={() => setShowTutorial(false)}
          title="Welcome to ReadySetHire Tutorial"
          size="lg"
          className="bg-slate-900 text-white border-slate-700"
        >
          <ModalBody className="bg-slate-900">
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎓</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Interactive Tutorial Coming Soon!</h3>
              </div>

              <p className="text-white/80 leading-relaxed">
                Our interactive tutorial system will guide you through every feature of ReadySetHire with step-by-step tooltips and demonstrations.
              </p>

              <div className="bg-slate-800/50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-blue-300 mb-3">What You'll Learn:</h4>
                <ul className="list-disc list-inside text-white/80 space-y-2">
                  <li>How to create and manage interviews</li>
                  <li>Setting up AI-powered questions</li>
                  <li>Managing candidates and responses</li>
                  <li>Analyzing performance data</li>
                  <li>Navigating the dashboard efficiently</li>
                </ul>
              </div>

              <div className="text-center py-4">
                <p className="text-white/60 italic">
                  For now, explore the platform or click "Start Interviews" to begin!
                </p>
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="bg-slate-900 border-slate-700">
            <Button variant="outline" onClick={() => setShowTutorial(false)} className="border-slate-600 text-white hover:bg-slate-800">
              Close
            </Button>
            <Link to="/interviews">
              <Button variant="primary" onClick={() => setShowTutorial(false)}>
                Start Exploring
              </Button>
            </Link>
          </ModalFooter>
        </Modal>
      )}
    </div>
  )
}

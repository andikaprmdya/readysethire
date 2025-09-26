import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useTutorial } from '../contexts/TutorialContext'

interface TutorialButtonProps {
  variant?: 'floating' | 'inline' | 'navbar'
  flowId?: string
  className?: string
  children?: React.ReactNode
}

const TutorialButton: React.FC<TutorialButtonProps> = ({
  variant = 'floating',
  flowId = 'getting-started',
  className = '',
  children
}) => {
  const { startTutorial, isActive } = useTutorial()
  const [isHovered, setIsHovered] = useState(false)

  const handleStart = () => {
    if (!isActive) {
      startTutorial(flowId)
    }
  }

  // Floating tutorial button (appears in bottom right)
  if (variant === 'floating') {
    return (
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ delay: 1, duration: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
        onClick={handleStart}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        disabled={isActive}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        aria-label="Start interactive tutorial"
      >
        {/* Question mark icon */}
        <svg
          className="w-8 h-8 transition-transform duration-300 group-hover:scale-110"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>

        {/* Tooltip on hover */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-black/80 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap pointer-events-none"
          >
            Start Tutorial
            <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-black/80"></div>
          </motion.div>
        )}

        {/* Pulsing ring animation */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-ping opacity-20"></div>
      </motion.button>
    )
  }

  // Inline button variant
  if (variant === 'inline') {
    return (
      <button
        onClick={handleStart}
        disabled={isActive}
        className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${className}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {children || 'Start Tutorial'}
      </button>
    )
  }

  // Navbar variant (more subtle)
  if (variant === 'navbar') {
    return (
      <button
        onClick={handleStart}
        disabled={isActive}
        className={`inline-flex items-center gap-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        title="Start Interactive Tutorial"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="hidden lg:inline">{children || 'Help'}</span>
      </button>
    )
  }

  return null
}

export default TutorialButton
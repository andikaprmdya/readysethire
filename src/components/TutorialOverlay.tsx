import React, { useEffect, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTutorial } from '../contexts/TutorialContext'
import { Tooltip } from './lightswind/tooltip'

interface TutorialOverlayProps {
  className?: string
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ className = '' }) => {
  const {
    isActive,
    currentStep,
    totalSteps,
    isStepVisible,
    getCurrentStep,
    nextStep,
    prevStep,
    skipStep,
    skipTutorial,
    stopTutorial
  } = useTutorial()

  const [highlightedElement, setHighlightedElement] = useState<Element | null>(null)
  const [elementRect, setElementRect] = useState<DOMRect | null>(null)
  const [isElementReady, setIsElementReady] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  const step = getCurrentStep()

  // Function to find and highlight the target element
  const findAndHighlightElement = useCallback((target: string) => {
    try {
      const element = document.querySelector(target)
      if (element) {
        setHighlightedElement(element)
        const rect = element.getBoundingClientRect()
        setElementRect(rect)
        setIsElementReady(true)

        // Scroll element into view if needed
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        })

        return true
      }
    } catch (error) {
      console.warn('Error finding tutorial target element:', target, error)
    }

    setHighlightedElement(null)
    setElementRect(null)
    setIsElementReady(false)
    return false
  }, [])

  // Effect to update highlight when step changes
  useEffect(() => {
    if (!step || !isActive) {
      setHighlightedElement(null)
      setElementRect(null)
      setIsElementReady(false)
      return
    }

    // Add a small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      const found = findAndHighlightElement(step.target)
      if (!found) {
        // Retry after a longer delay if element not found
        setTimeout(() => {
          findAndHighlightElement(step.target)
        }, 1000)
      }
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [step, isActive, findAndHighlightElement])

  // Update element rect on window resize
  useEffect(() => {
    if (!highlightedElement) return

    const updateRect = () => {
      const rect = highlightedElement.getBoundingClientRect()
      setElementRect(rect)
    }

    window.addEventListener('resize', updateRect)
    window.addEventListener('scroll', updateRect)

    return () => {
      window.removeEventListener('resize', updateRect)
      window.removeEventListener('scroll', updateRect)
    }
  }, [highlightedElement])

  // Handle keyboard navigation
  useEffect(() => {
    if (!isActive) return

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          event.preventDefault()
          stopTutorial()
          break
        case 'ArrowRight':
        case 'Enter':
        case ' ':
          event.preventDefault()
          nextStep()
          break
        case 'ArrowLeft':
          event.preventDefault()
          prevStep()
          break
        case 's':
        case 'S':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault()
            skipStep()
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isActive, nextStep, prevStep, skipStep, stopTutorial])

  if (!isActive || !step || !isStepVisible) {
    return null
  }

  const padding = 8
  const overlayStyle = elementRect ? {
    clipPath: `polygon(
      0% 0%,
      0% 100%,
      ${elementRect.left - padding}px 100%,
      ${elementRect.left - padding}px ${elementRect.top - padding}px,
      ${elementRect.right + padding}px ${elementRect.top - padding}px,
      ${elementRect.right + padding}px ${elementRect.bottom + padding}px,
      ${elementRect.left - padding}px ${elementRect.bottom + padding}px,
      ${elementRect.left - padding}px 100%,
      100% 100%,
      100% 0%
    )`
  } : {}

  return (
    <AnimatePresence>
      <div className={`fixed inset-0 z-[9999] pointer-events-none ${className}`}>
        {/* Dark overlay with cutout for highlighted element */}
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto"
          style={overlayStyle}
          onClick={(e) => {
            // Only close if clicking on the overlay itself, not the cutout area
            if (e.target === e.currentTarget) {
              stopTutorial()
            }
          }}
        />

        {/* Highlight border around target element */}
        {isElementReady && elementRect && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="absolute pointer-events-none"
            style={{
              left: elementRect.left - padding,
              top: elementRect.top - padding,
              width: elementRect.width + padding * 2,
              height: elementRect.height + padding * 2,
              border: '3px solid #3b82f6',
              borderRadius: '8px',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
            }}
          />
        )}

        {/* Tutorial tooltip/popup */}
        {isElementReady && elementRect && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="absolute pointer-events-auto bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-600 max-w-sm w-80 z-[10000]"
            style={{
              left: Math.min(
                Math.max(10, elementRect.left + elementRect.width / 2 - 160),
                window.innerWidth - 330
              ),
              top: step.placement === 'bottom' || !step.placement
                ? elementRect.bottom + padding + 10
                : elementRect.top - padding - 200,
            }}
          >
            {/* Tutorial content */}
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {currentStep + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {step.title}
                  </h3>
                </div>
                <button
                  onClick={stopTutorial}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  aria-label="Close tutorial"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                {step.content}
              </p>

              {/* Progress bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <span>Step {currentStep + 1} of {totalSteps}</span>
                  <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex gap-2">
                  {currentStep > 0 && (
                    <button
                      onClick={prevStep}
                      className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                      ← Back
                    </button>
                  )}
                  {step.optional && (
                    <button
                      onClick={skipStep}
                      className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                    >
                      Skip
                    </button>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={skipTutorial}
                    className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  >
                    Skip Tour
                  </button>
                  <button
                    onClick={nextStep}
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    {currentStep === totalSteps - 1 ? 'Finish' : 'Next →'}
                  </button>
                </div>
              </div>
            </div>

            {/* Keyboard shortcuts hint */}
            <div className="px-6 py-3 bg-gray-50 dark:bg-slate-750 rounded-b-2xl border-t border-gray-200 dark:border-slate-600">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Use ← → arrow keys to navigate • ESC to close • ENTER to continue
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  )
}

export default TutorialOverlay
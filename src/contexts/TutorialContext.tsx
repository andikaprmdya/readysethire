import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

interface TutorialStep {
  id: string
  target: string // CSS selector for the element to highlight
  title: string
  content: string
  placement?: 'top' | 'right' | 'bottom' | 'left'
  action?: 'click' | 'hover' | 'focus'
  optional?: boolean
}

interface TutorialFlow {
  id: string
  name: string
  steps: TutorialStep[]
}

interface TutorialContextType {
  isActive: boolean
  currentFlow: string | null
  currentStep: number
  totalSteps: number
  isStepVisible: boolean
  startTutorial: (flowId: string) => void
  stopTutorial: () => void
  nextStep: () => void
  prevStep: () => void
  skipStep: () => void
  skipTutorial: () => void
  registerFlow: (flow: TutorialFlow) => void
  getCurrentStep: () => TutorialStep | null
  markStepCompleted: (stepId: string) => void
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined)

// Tutorial flows configuration
const defaultTutorialFlows: TutorialFlow[] = [
  {
    id: 'getting-started',
    name: 'Getting Started with ReadySetHire',
    steps: [
      {
        id: 'welcome',
        target: 'nav',
        title: '👋 Welcome to ReadySetHire!',
        content: 'Let\'s take a quick tour to help you get started with our interview management platform.',
        placement: 'bottom'
      },
      {
        id: 'navigation',
        target: 'nav a[href="/interviews"]',
        title: '📋 Interviews Section',
        content: 'This is where you can create, manage, and track all your interviews. Click here to view existing interviews.',
        placement: 'bottom',
        action: 'hover'
      },
      {
        id: 'search-bar',
        target: 'nav input[placeholder*="Search"]',
        title: '🔍 Search Functionality',
        content: 'Use this search bar to quickly find specific interviews by name or keywords.',
        placement: 'bottom'
      }
    ]
  },
  {
    id: 'create-interview',
    name: 'Creating Your First Interview',
    steps: [
      {
        id: 'start-interviews',
        target: 'a[href="/interviews"]',
        title: '📝 Start Creating Interviews',
        content: 'Click on "Start Interviews" or navigate to the interviews page to begin creating your first interview.',
        placement: 'top',
        action: 'click'
      }
    ]
  },
  {
    id: 'take-interview',
    name: 'Taking an Interview (Applicant View)',
    steps: [
      {
        id: 'interview-welcome',
        target: '.min-h-screen .bg-white\\/5',
        title: '🎯 Interview Interface',
        content: 'This is the interview interface where applicants will answer questions. Everything is designed to be user-friendly.',
        placement: 'top'
      },
      {
        id: 'recording-controls',
        target: 'button[class*="from-red-600"]',
        title: '🎙️ Audio Recording',
        content: 'Applicants can record their answers using this audio recorder. Speech is automatically transcribed in real-time.',
        placement: 'top'
      }
    ]
  },
  {
    id: 'manage-interviews',
    name: 'Managing Interviews',
    steps: [
      {
        id: 'interview-list',
        target: '.grid.grid-cols-1',
        title: '📋 Interview Dashboard',
        content: 'This is your interview dashboard where you can see all your created interviews. Each card shows the interview status and key details.',
        placement: 'top'
      },
      {
        id: 'create-new',
        target: 'a[href*="new"]',
        title: '➕ Create New Interview',
        content: 'Click here to create a new interview. You\'ll be guided through setting up questions and interview details.',
        placement: 'bottom'
      },
      {
        id: 'interview-actions',
        target: '.group-hover\\:opacity-100',
        title: '⚙️ Interview Actions',
        content: 'Hover over interview cards to see available actions like editing, viewing applicants, or managing questions.',
        placement: 'left'
      }
    ]
  },
  {
    id: 'manage-questions',
    name: 'Managing Interview Questions',
    steps: [
      {
        id: 'questions-overview',
        target: '.bg-white\\/5',
        title: '❓ Questions Management',
        content: 'This is where you manage all questions for your interview. You can add, edit, and organize questions here.',
        placement: 'top'
      },
      {
        id: 'add-question',
        target: 'button[class*="bg-gradient-to-r"]',
        title: '📝 Add New Question',
        content: 'Click here to add a new question to your interview. You can set the question text and difficulty level.',
        placement: 'bottom'
      },
      {
        id: 'ai-generator',
        target: 'button[class*="purple"]',
        title: '🤖 AI Question Generator',
        content: 'Use the AI generator to automatically create relevant questions based on your job role and requirements.',
        placement: 'bottom'
      }
    ]
  },
  {
    id: 'manage-applicants',
    name: 'Managing Applicants',
    steps: [
      {
        id: 'applicants-list',
        target: '.min-h-screen .grid',
        title: '👥 Applicants Overview',
        content: 'Here you can see all applicants for your interviews. Track their progress and review their responses.',
        placement: 'top'
      },
      {
        id: 'applicant-status',
        target: '.inline-block.px-3.py-1',
        title: '📊 Application Status',
        content: 'Each applicant shows their current status: invited, in progress, completed, or reviewed.',
        placement: 'bottom'
      },
      {
        id: 'view-responses',
        target: 'button[class*="bg-blue"]',
        title: '👁️ View Responses',
        content: 'Click to view detailed responses from applicants, including their recorded answers and transcripts.',
        placement: 'left'
      }
    ]
  }
]

interface TutorialProviderProps {
  children: React.ReactNode
  enableLocalStorage?: boolean
}

export const TutorialProvider: React.FC<TutorialProviderProps> = ({
  children,
  enableLocalStorage = true
}) => {
  const [isActive, setIsActive] = useState(false)
  const [currentFlow, setCurrentFlow] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [isStepVisible, setIsStepVisible] = useState(true)
  const [registeredFlows, setRegisteredFlows] = useState<Map<string, TutorialFlow>>(new Map())
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())

  // Initialize with default flows
  useEffect(() => {
    const flowMap = new Map<string, TutorialFlow>()
    defaultTutorialFlows.forEach(flow => {
      flowMap.set(flow.id, flow)
    })
    setRegisteredFlows(flowMap)

    // Load completed steps from localStorage
    if (enableLocalStorage) {
      try {
        const saved = localStorage.getItem('tutorialCompletedSteps')
        if (saved) {
          setCompletedSteps(new Set(JSON.parse(saved)))
        }
      } catch (error) {
        console.warn('Failed to load tutorial progress from localStorage:', error)
      }
    }
  }, [enableLocalStorage])

  // Save completed steps to localStorage
  useEffect(() => {
    if (enableLocalStorage && completedSteps.size > 0) {
      try {
        localStorage.setItem('tutorialCompletedSteps', JSON.stringify([...completedSteps]))
      } catch (error) {
        console.warn('Failed to save tutorial progress to localStorage:', error)
      }
    }
  }, [completedSteps, enableLocalStorage])

  const registerFlow = useCallback((flow: TutorialFlow) => {
    setRegisteredFlows(prev => new Map(prev.set(flow.id, flow)))
  }, [])

  const startTutorial = useCallback((flowId: string) => {
    const flow = registeredFlows.get(flowId)
    if (!flow) {
      console.warn(`Tutorial flow "${flowId}" not found`)
      return
    }

    setCurrentFlow(flowId)
    setCurrentStep(0)
    setIsActive(true)
    setIsStepVisible(true)
  }, [registeredFlows])

  const stopTutorial = useCallback(() => {
    setIsActive(false)
    setCurrentFlow(null)
    setCurrentStep(0)
    setIsStepVisible(false)
  }, [])

  const getCurrentStep = useCallback((): TutorialStep | null => {
    if (!currentFlow || !isActive) return null
    const flow = registeredFlows.get(currentFlow)
    if (!flow || currentStep >= flow.steps.length) return null
    return flow.steps[currentStep]
  }, [currentFlow, currentStep, isActive, registeredFlows])

  const nextStep = useCallback(() => {
    if (!currentFlow) return

    const flow = registeredFlows.get(currentFlow)
    if (!flow) return

    const current = flow.steps[currentStep]
    if (current) {
      markStepCompleted(current.id)
    }

    if (currentStep < flow.steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      // Tutorial completed
      stopTutorial()
    }
  }, [currentFlow, currentStep, registeredFlows])

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }, [currentStep])

  const skipStep = useCallback(() => {
    nextStep()
  }, [nextStep])

  const skipTutorial = useCallback(() => {
    if (currentFlow) {
      const flow = registeredFlows.get(currentFlow)
      if (flow) {
        // Mark all remaining steps as completed
        flow.steps.slice(currentStep).forEach(step => {
          markStepCompleted(step.id)
        })
      }
    }
    stopTutorial()
  }, [currentFlow, currentStep, registeredFlows])

  const markStepCompleted = useCallback((stepId: string) => {
    setCompletedSteps(prev => new Set(prev.add(stepId)))
  }, [])

  const totalSteps = currentFlow ? registeredFlows.get(currentFlow)?.steps.length || 0 : 0

  const contextValue: TutorialContextType = {
    isActive,
    currentFlow,
    currentStep,
    totalSteps,
    isStepVisible,
    startTutorial,
    stopTutorial,
    nextStep,
    prevStep,
    skipStep,
    skipTutorial,
    registerFlow,
    getCurrentStep,
    markStepCompleted
  }

  return (
    <TutorialContext.Provider value={contextValue}>
      {children}
    </TutorialContext.Provider>
  )
}

export const useTutorial = (): TutorialContextType => {
  const context = useContext(TutorialContext)
  if (!context) {
    throw new Error('useTutorial must be used within a TutorialProvider')
  }
  return context
}

export type { TutorialStep, TutorialFlow, TutorialContextType }
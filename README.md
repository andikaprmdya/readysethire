# ReadySetHire - Modern Interview Management Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A professional, modern interview management platform built with React, TypeScript, and Vite. ReadySetHire streamlines the interview process with AI-powered question generation, real-time applicant management, comprehensive analytics, and an intuitive user experience featuring both light and dark themes.

**Originally created by Andika Pramudya Wardana**

ReadySetHire transforms the recruitment process by providing:
- 🤖 **AI-Powered Intelligence**: Smart question generation and automated candidate evaluation
- 🎨 **Modern Design System**: Professional light/dark themes with glass morphism effects
- 📱 **Responsive Experience**: Seamless functionality across all devices
- 🔍 **Smart Search**: Real-time interview suggestions with instant navigation
- 📊 **Comprehensive Analytics**: Data-driven insights for better hiring decisions
- 🎯 **Complete Workflow**: From interview creation to candidate evaluation

## 🚀 Features

### 🎯 Smart Interview Management
- **AI-Powered Question Generation**: Automatically create relevant questions based on job roles and requirements
- **Customizable Interview Templates**: Create reusable templates with dynamic question creation
- **Interview Status Tracking**: Monitor interview progress from draft to published status
- **Automated Scheduling**: Seamless integration with your existing workflow

### 👥 Comprehensive Candidate Management
- **Real-time Applicant Tracking**: Monitor candidates through the complete interview process
- **Response Analysis**: Detailed analysis of applicant responses with performance metrics
- **Automated Scoring**: AI-powered evaluation of candidate answers
- **Status Management**: Track applicants from "Not Started" to "Completed" status
- **Unique Interview Links**: Generate personalized, secure interview links for each candidate

### 📊 Advanced Analytics & Insights
- **Real-time Analytics Dashboard**: Monitor completion rates and performance trends
- **Performance Metrics**: Detailed statistics on candidate performance and interview success rates
- **Custom Reports**: Generate comprehensive reports for decision making
- **Completion Rate Tracking**: Monitor interview completion statistics
- **Data-driven Insights**: Make informed hiring decisions with comprehensive analytics

### 🎨 Modern User Experience
- **Professional Light/Dark Theme System**: Toggle between light and dark modes with distinct color palettes
- **Responsive Design**: Mobile-first approach optimized for all devices
- **Glass Morphism UI**: Modern design with backdrop blur effects and professional styling
- **Interactive Search**: Smart search bar with real-time interview suggestions and navigation
- **Tutorial System**: Built-in help system with step-by-step guidance for all features
- **Accessibility Features**: WCAG compliant with proper ARIA labels and keyboard navigation

### 🔊 Voice & Recording Capabilities
- **Speech-to-Text Integration**: Automatic transcription of audio responses
- **Real-time Recording**: High-quality audio recording during interviews
- **Response Playback**: Review recorded answers with transcript synchronization
- **Audio Analysis**: Advanced audio processing for interview evaluation

### 🛠️ Technical Excellence
- **Modern React Architecture**: Built with React 18, TypeScript, and Vite
- **Robust Error Handling**: Comprehensive error boundaries with retry functionality
- **Performance Optimized**: Lazy loading, memoization, and efficient rendering
- **Type Safety**: Full TypeScript implementation with strict typing
- **Component Library**: Reusable UI components with consistent design patterns
- **API Integration**: Centralized service layer with retry logic and error handling

## 🏗️ Architecture

### Project Structure
```
src/
├── components/              # Reusable UI components
│   ├── ui/                 # Core UI component library
│   │   ├── Navbar.tsx      # Main navigation with search functionality
│   │   ├── Button.tsx      # Professional button component
│   │   ├── Card.tsx        # Flexible card component
│   │   ├── Modal.tsx       # Accessible modal component
│   │   └── LoadingSpinner.tsx # Loading states
│   ├── lightswind/         # Advanced UI components library
│   ├── Footer.tsx          # Application footer with theme support
│   ├── ErrorBoundary.tsx   # Error handling component
│   ├── TutorialButton.tsx  # Interactive help system
│   ├── TutorialOverlay.tsx # Tutorial interface overlay
│   ├── SettingsModal.tsx   # Theme and settings management
│   └── AppWithSettings.tsx # Main app wrapper with theme provider
├── contexts/               # React context providers
│   ├── SettingsContext.tsx # Theme and app settings management
│   └── TutorialContext.tsx # Interactive tutorial system
├── hooks/                  # Custom React hooks
│   └── useApiData.ts       # Data fetching and mutation hooks
├── pages/                  # Route components
│   ├── Home.tsx            # Landing page with feature showcase
│   ├── Interviews/         # Interview management
│   │   ├── index.tsx       # Interview list and dashboard
│   │   └── Form.tsx        # Create/edit interview forms
│   ├── Questions/          # Question management
│   │   ├── index.tsx       # Question list for interviews
│   │   └── Form.tsx        # Create/edit question forms
│   ├── Applicants/         # Candidate management
│   │   ├── index.tsx       # Applicant list and tracking
│   │   └── Form.tsx        # Add/edit applicant forms
│   ├── TakeInterview/      # Interview taking interface
│   ├── ViewAnswers/        # Answer review interface
│   ├── AIFeedback/         # AI-powered feedback system
│   ├── ApplicantFeedback/  # Applicant feedback interface
│   ├── AIAnalytics/        # Analytics and insights dashboard
│   ├── PrivacyPolicy.tsx   # Privacy policy page
│   ├── TermsOfService.tsx  # Terms of service page
│   └── CookiePolicy.tsx    # Cookie policy page
├── services/               # API and external services
│   ├── apiService.ts       # Centralized API management
│   └── openaiService.ts    # AI integration for questions and feedback
├── styles/                 # Styling and design system
│   └── designTokens.ts     # Professional design system tokens
├── api/                    # API configuration and endpoints
│   ├── index.ts            # Main API client
│   └── interviews.ts       # Interview-specific API calls
├── types/                  # TypeScript type definitions
│   └── models.ts           # Data model interfaces
└── config/                 # Application configuration
    └── environment.ts      # Environment variables and settings
```

### Design System

Our design system provides a cohesive, professional appearance:

```typescript
// Professional color palette
const colors = {
  primary: {
    50: '#eff6ff',   // Light blue background
    500: '#3b82f6',  // Primary blue
    900: '#1e3a8a'   // Dark blue
  },
  secondary: {
    50: '#fefce8',   // Light gold background
    500: '#f59e0b',  // Gold accent
    900: '#78350f'   // Dark gold
  },
  // ... additional colors
}
```

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- TypeScript knowledge

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd readysethire
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript compiler
npm run test         # Run test suite
```

## 📦 Component Library

### Button Component

Professional button with multiple variants and states:

```tsx
import { Button } from './components/ui'

// Primary button
<Button variant="primary" size="lg" onClick={handleClick}>
  Create Interview
</Button>

// Loading state
<Button variant="secondary" loading>
  Saving...
</Button>

// Icon button
<Button variant="ghost" size="sm" icon="trash">
  Delete
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
- `size`: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
- `loading`: boolean
- `disabled`: boolean
- `icon`: string (optional)

### Card Component

Flexible card component using compound pattern:

```tsx
import { Card, CardHeader, CardContent, CardFooter } from './components/ui'

<Card variant="elevated" hoverable>
  <CardHeader 
    title="Interview Analytics"
    subtitle="Performance overview"
  />
  <CardContent>
    <p>Content goes here...</p>
  </CardContent>
  <CardFooter>
    <Button>View Details</Button>
  </CardFooter>
</Card>
```

**Variants:**
- `default`: Basic card styling
- `elevated`: Card with shadow
- `glass`: Glass morphism effect
- `bordered`: Card with border
- `gradient`: Gradient background

### Modal Component

Accessible modal with keyboard navigation:

```tsx
import { Modal, ModalHeader, ModalBody, ModalFooter } from './components/ui'

<Modal 
  isOpen={isOpen} 
  onClose={handleClose}
  size="lg"
  closeOnBackdrop={true}
>
  <ModalHeader title="Confirm Action" />
  <ModalBody>
    <p>Are you sure you want to proceed?</p>
  </ModalBody>
  <ModalFooter>
    <Button variant="outline" onClick={handleClose}>Cancel</Button>
    <Button variant="primary" onClick={handleConfirm}>Confirm</Button>
  </ModalFooter>
</Modal>
```

### Loading Spinner

Professional loading states:

```tsx
import { LoadingSpinner, LoadingOverlay } from './components/ui'

// Inline spinner
<LoadingSpinner size="md" variant="primary" text="Loading..." />

// Full screen overlay
<LoadingOverlay 
  visible={isLoading} 
  text="Processing your request..."
  size="lg"
/>
```

## 🔌 API Integration

### API Service

Centralized API management with retry logic:

```typescript
import { apiService } from './services/apiService'

// Get data with automatic retry
const interviews = await apiService.get<Interview[]>('/interviews')

// Post data with error handling
const newInterview = await apiService.post<Interview>('/interviews', data)

// Upload files
const result = await apiService.upload('/upload', formData, {
  onUploadProgress: (progress) => setProgress(progress)
})
```

### Custom Hooks

Consistent data fetching patterns:

```tsx
import { useApiData, useMutation, useInterviews } from './hooks/useApiData'

function InterviewList() {
  // Basic data fetching
  const { data: interviews, loading, error, refetch } = useApiData(
    () => apiService.get<Interview[]>('/interviews'),
    { 
      dependencies: [],
      retryOnError: true 
    }
  )

  // Mutations with optimistic updates
  const { mutate: deleteInterview, loading: deleting } = useMutation(
    (id: number) => apiService.delete(`/interviews/${id}`),
    {
      onSuccess: () => refetch(),
      optimisticUpdate: (oldData, id) => 
        oldData?.filter(interview => interview.id !== id)
    }
  )

  // Specialized hooks
  const { interviews, createInterview, updateInterview } = useInterviews()

  return (
    <div>
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage error={error} onRetry={refetch} />}
      {interviews?.map(interview => (
        <InterviewCard 
          key={interview.id}
          interview={interview}
          onDelete={() => deleteInterview(interview.id)}
        />
      ))}
    </div>
  )
}
```

## 🛡️ Error Handling

### Error Boundary

Comprehensive error catching with retry functionality:

```tsx
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Log to monitoring service
        console.error('Application error:', error, errorInfo)
      }}
      title="Something went wrong"
      showErrorDetails={process.env.NODE_ENV === 'development'}
    >
      <Router>
        <Routes>
          {/* Your app routes */}
        </Routes>
      </Router>
    </ErrorBoundary>
  )
}
```

### Error States

Consistent error handling in components:

```tsx
function DataComponent() {
  const { data, loading, error, refetch } = useApiData(fetchData)

  if (loading) return <LoadingSpinner />
  
  if (error) {
    return (
      <ErrorMessage 
        error={error}
        onRetry={refetch}
        title="Failed to load data"
        message="Please check your connection and try again."
      />
    )
  }

  return <DataDisplay data={data} />
}
```

## 🎨 Styling Guidelines

### Design Tokens

Use design tokens for consistent styling:

```tsx
import { designTokens } from './styles/designTokens'

const StyledComponent = styled.div`
  background: ${designTokens.colors.primary[50]};
  padding: ${designTokens.spacing.lg};
  border-radius: ${designTokens.borderRadius.lg};
  box-shadow: ${designTokens.shadows.md};
`
```

### Tailwind Classes

Professional styling patterns:

```tsx
// Glass morphism effect
<div className="glass rounded-2xl p-6">
  {/* Content */}
</div>

// Professional gradient
<div className="bg-gradient-to-br from-primary-500 to-secondary-500">
  {/* Content */}
</div>

// Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>
```

## 🔧 Performance Optimization

### Code Splitting

Lazy load components for better performance:

```tsx
import { lazy, Suspense } from 'react'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const CreateInterview = lazy(() => import('./pages/CreateInterview'))

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<CreateInterview />} />
      </Routes>
    </Suspense>
  )
}
```

### Memoization

Optimize expensive computations:

```tsx
import { useMemo, memo } from 'react'

const ExpensiveComponent = memo(function ExpensiveComponent({ data }) {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      processed: expensiveCalculation(item)
    }))
  }, [data])

  return <div>{processedData.map(item => ...)}</div>
})
```

## 🚀 Deployment

### Build Process

```bash
# Install dependencies
npm install

# Run tests
npm run test

# Type check
npm run typecheck

# Lint code
npm run lint

# Build for production
npm run build

# Preview build locally
npm run preview
```

### Environment Variables

Required environment variables:

```bash
VITE_API_BASE_URL=https://api.readysethire.com
VITE_APP_TITLE=ReadySetHire
VITE_ENABLE_ANALYTICS=true
VITE_SENTRY_DSN=your-sentry-dsn
```

### Production Deployment

1. **Vite Build Output**
   ```bash
   npm run build
   # Outputs to ./dist directory
   ```

2. **Static Hosting** (Netlify, Vercel, etc.)
   - Deploy the `dist` folder
   - Configure redirects for SPA routing
   - Set environment variables

3. **Docker Deployment**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
   ```

## 🧪 Testing

### Component Testing

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})
```

### API Testing

```tsx
import { apiService } from './apiService'
import { mockApiResponse } from '../tests/mocks'

describe('API Service', () => {
  it('handles successful requests', async () => {
    mockApiResponse('/interviews', { data: [{ id: 1, title: 'Test' }] })
    
    const result = await apiService.get('/interviews')
    expect(result).toEqual([{ id: 1, title: 'Test' }])
  })

  it('retries failed requests', async () => {
    mockApiResponse('/interviews', { error: 'Network Error' }, { times: 2 })
    mockApiResponse('/interviews', { data: [] }, { times: 1 })
    
    const result = await apiService.get('/interviews')
    expect(result).toEqual([])
  })
})
```

## 📚 Documentation

### JSDoc Comments

All components include comprehensive JSDoc documentation:

```tsx
/**
 * Professional button component with multiple variants and accessibility features
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="lg" onClick={handleClick}>
 *   Create Interview
 * </Button>
 * ```
 * 
 * @param variant - Visual style variant
 * @param size - Button size
 * @param loading - Show loading spinner
 * @param disabled - Disable button interaction
 * @param icon - Optional icon name
 * @param children - Button content
 */
export const Button: React.FC<ButtonProps> = ({ ... }) => {
  // Implementation
}
```

### Type Definitions

Comprehensive TypeScript interfaces:

```typescript
interface Interview {
  id: number
  title: string
  description: string
  job_role: string
  status: 'draft' | 'active' | 'completed'
  created_at: string
  updated_at: string
  questions?: Question[]
  applicants?: Applicant[]
}

interface CreateInterviewRequest {
  title: string
  description: string
  job_role: string
  question_count?: number
  difficulty_level?: 'easy' | 'medium' | 'hard'
}
```

## 🤝 Contributing

### Development Workflow

1. **Fork and clone** the repository
2. **Create feature branch** from `main`
3. **Follow coding standards** (ESLint + Prettier)
4. **Write tests** for new functionality
5. **Update documentation** as needed
6. **Submit pull request** with detailed description

### Code Standards

- **TypeScript**: Strict mode enabled, no `any` types
- **React**: Functional components with hooks
- **Styling**: Tailwind CSS with design tokens
- **Testing**: React Testing Library + Jest
- **Documentation**: JSDoc for all public APIs

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors/warnings
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- **Documentation**: Check this README and inline JSDoc comments
- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions
- **Email**: [support@readysethire.com](mailto:support@readysethire.com)

---

Built with ❤️ using React, TypeScript, and modern web technologies.

---

## 📖 Detailed Application Flow & Architecture Documentation

This comprehensive guide explains how every component, router, hook, and service works together in ReadySetHire.

### 🌊 Application Flow Overview

ReadySetHire follows a sophisticated multi-layered architecture with clear separation of concerns:

```
User Request → Router → Page Component → Custom Hooks → API Service → Backend
                ↓           ↓              ↓
            Contexts → UI Components ← Design Tokens
```

### 🎯 Component Architecture & Data Flow

#### 1. **Application Entry Point**

**File**: `src/main.tsx:1`

- Entry point that renders the root `App` component
- Wraps application in `React.StrictMode` for development warnings
- Mounts to DOM element with id `root`

**File**: `src/App.tsx:1`

The App component establishes the core provider hierarchy:

```tsx
<SettingsProvider>        // Theme, font size, contrast settings
  <TutorialProvider>      // Interactive tutorial system
    <AppWithSettings />   // Main routing and layout
  </TutorialProvider>
</SettingsProvider>
```

**Data Flow:**
1. SettingsContext loads saved preferences from localStorage
2. TutorialContext initializes tutorial flows and tracks progress
3. AppWithSettings receives settings and renders based on theme

---

#### 2. **Context Providers - Global State Management**

##### SettingsContext (`src/contexts/SettingsContext.tsx:1`)

**Purpose**: Manages application-wide theme, accessibility, and user preferences

**Key Functionality:**
- **Theme Management** (`SettingsContext.tsx:58-64`): Toggles between light/dark mode by manipulating document classes
- **Font Scaling** (`SettingsContext.tsx:67-72`): Adjusts text size via CSS custom properties
- **Contrast Control** (`SettingsContext.tsx:75-79`): Enhances visibility for accessibility
- **Persistence** (`SettingsContext.tsx:83-89`): Auto-saves to localStorage on every change
- **Import/Export** (`SettingsContext.tsx:103-132`): Allows settings backup and restore

**State Structure:**
```typescript
{
  theme: 'light' | 'dark',
  fontSize: 'small' | 'medium' | 'large' | 'xlarge',
  contrast: 'normal' | 'high' | 'higher'
}
```

**Usage Example:**
```typescript
const { settings, updateSetting } = useSettings()
updateSetting('theme', 'dark')  // Updates theme globally
```

---

##### TutorialContext (`src/contexts/TutorialContext.tsx:1`)

**Purpose**: Provides interactive step-by-step guidance throughout the application

**Key Features:**
- **Tutorial Flows** (`TutorialContext.tsx:39-190`): Pre-configured guided tours for different features
- **Step Tracking** (`TutorialContext.tsx:272-289`): Manages current step and progression
- **Progress Persistence** (`TutorialContext.tsx:217-238`): Saves completed steps to localStorage
- **Dynamic Registration** (`TutorialContext.tsx:240-242`): Allows runtime tutorial registration

**Tutorial Flow Structure:**
```typescript
{
  id: 'getting-started',
  name: 'Getting Started with ReadySetHire',
  steps: [
    {
      id: 'welcome',
      target: 'nav',                    // CSS selector for highlight
      title: 'Welcome!',
      content: 'Description...',
      placement: 'bottom',              // Tooltip position
      action: 'click'                   // Expected user action
    }
  ]
}
```

**Pre-built Tutorial Flows:**
1. **getting-started**: Basic navigation and features (`TutorialContext.tsx:40-67`)
2. **create-interview**: Interview creation workflow (`TutorialContext.tsx:69-81`)
3. **manage-interviews**: Interview management (`TutorialContext.tsx:103-128`)
4. **manage-questions**: Question management (`TutorialContext.tsx:130-155`)
5. **manage-applicants**: Applicant tracking (`TutorialContext.tsx:157-189`)

---

#### 3. **Routing System - React Router v6**

**File**: `src/components/AppWithSettings.tsx:28`

The routing system uses React Router's declarative routing with nested routes:

**Main Routes:**

| Route | Component | Purpose | Key Features |
|-------|-----------|---------|--------------|
| `/` | `Home` | Landing page | Feature showcase, animated UI |
| `/interviews` | `InterviewsPage` | Interview dashboard | List view, CRUD operations |
| `/interviews/new` | `InterviewForm` | Create interview | Form validation, auto-save |
| `/interviews/:id/edit` | `InterviewForm` | Edit interview | Pre-populated form |
| `/interviews/:interviewId/questions` | `QuestionsPage` | Question management | AI generation, manual entry |
| `/interviews/:interviewId/questions/new` | `QuestionForm` | Add question | Difficulty levels, validation |
| `/interviews/:interviewId/questions/edit/:questionId` | `QuestionForm` | Edit question | Pre-filled form |
| `/interviews/:interviewId/applicants` | `ApplicantsPage` | Applicant tracking | Status monitoring, link generation |
| `/interviews/:interviewId/applicants/new` | `ApplicantForm` | Add applicant | Contact details, validation |
| `/interviews/:interviewId/applicants/edit/:applicantId` | `ApplicantForm` | Edit applicant | Update information |
| `/take-interview/:interviewId/:applicantId` | `TakeInterview` | Interview interface | Voice recording, real-time transcription |
| `/interviews/:interviewId/applicants/:applicantId/answers` | `ViewAnswers` | Review responses | Answer playback, transcripts |
| `/interviews/:interviewId/applicants/:applicantId/ai-feedback` | `AIFeedbackPage` | AI analysis | Performance scoring, insights |
| `/applicant-feedback/:applicantId/:interviewId` | `ApplicantFeedbackPage` | Candidate feedback | Personalized results |
| `/interviews/:interviewId/analytics` | `AIAnalyticsPage` | Analytics dashboard | Completion rates, trends |
| `/privacy-policy` | `PrivacyPolicy` | Legal | Privacy information |
| `/terms-of-service` | `TermsOfService` | Legal | Terms and conditions |
| `/cookie-policy` | `CookiePolicy` | Legal | Cookie usage |

**Route Parameter Extraction:**

Routes use dynamic parameters for data access:

```typescript
// In Questions Page (src/pages/Questions/index.tsx:28)
const { interviewId } = useParams()
// Extracts interview ID from URL: /interviews/123/questions → interviewId = "123"

// In Applicants Page (src/pages/Applicants/index.tsx:21)
const { interviewId } = useParams()
// Extracts interview ID for fetching applicant data
```

**Navigation Patterns:**

```typescript
// Programmatic navigation (src/pages/Interviews/index.tsx:32)
const navigate = useNavigate()
navigate('/interviews/new')                        // Create new
navigate(`/interviews/${id}/edit`)                 // Edit existing
navigate(`/interviews/${id}/questions`)           // Navigate to nested route
```

---

#### 4. **Custom React Hooks - Data Fetching Layer**

**File**: `src/hooks/useApiData.ts:1`

This file provides a comprehensive set of hooks for consistent data fetching patterns.

##### **useApiData** - Generic Data Fetching Hook (`useApiData.ts:38-91`)

**Purpose**: Universal hook for any GET request with loading states and error handling

**Key Features:**
- Automatic loading state management (`useApiData.ts:51`)
- Error handling with retry capability (`useApiData.ts:67-72`)
- Configurable fetch triggers (`useApiData.ts:43-48`)
- Dependency-based refetching (`useApiData.ts:78-83`)
- Manual refetch function (`useApiData.ts:89`)

**Usage Pattern:**
```typescript
const { data, loading, error, refetch } = useApiData(
  () => apiService.get<Interview[]>('/interview'),
  {
    immediate: true,              // Fetch on mount
    enabled: true,                // Conditional fetching
    dependencies: [interviewId],  // Refetch when these change
    onSuccess: (data) => {},      // Success callback
    onError: (error) => {}        // Error callback
  }
)
```

**State Management Flow:**
```
Mount → Check enabled → Set loading → Fetch data → Update state
         ↓                                ↓
    Dependencies change              Success/Error
         ↓                                ↓
      Refetch                        Call callbacks
```

---

##### **Specialized Hooks** - Resource-Specific Operations

**Interview Hooks:**

1. **useInterviews** (`useApiData.ts:96-101`): Fetches all interviews
   ```typescript
   const { data: interviews, loading, error, refetch } = useInterviews()
   ```

2. **useInterview** (`useApiData.ts:106-114`): Fetches single interview by ID
   ```typescript
   const { data: interview } = useInterview(id)
   // Auto-fetches when id changes, returns first result
   ```

3. **useCreateInterview** (`useApiData.ts:251-255`): Creates new interview
   ```typescript
   const { mutate: createInterview, loading } = useCreateInterview()
   await createInterview({ title, description, job_role })
   ```

4. **useUpdateInterview** (`useApiData.ts:260-264`): Updates existing interview
   ```typescript
   const { mutate: updateInterview } = useUpdateInterview()
   await updateInterview({ id, title, description })
   ```

5. **useDeleteInterview** (`useApiData.ts:269-273`): Deletes interview
   ```typescript
   const { mutate: deleteInterview } = useDeleteInterview()
   await deleteInterview(id)
   ```

**Question Hooks:**

1. **useQuestions** (`useApiData.ts:119-127`): Fetches questions for interview
   ```typescript
   const { data: questions } = useQuestions(interviewId)
   ```

2. **useQuestion** (`useApiData.ts:132-140`): Fetches single question
3. **useCreateQuestion** (`useApiData.ts:278-282`): Creates question
4. **useUpdateQuestion** (`useApiData.ts:287-291`): Updates question
5. **useDeleteQuestion** (`useApiData.ts:296-300`): Deletes question

**Applicant Hooks:**

1. **useApplicants** (`useApiData.ts:145-153`): Fetches applicants for interview
2. **useApplicant** (`useApiData.ts:158-166`): Fetches single applicant
3. **useCreateApplicant** (`useApiData.ts:305-309`): Creates applicant
4. **useUpdateApplicant** (`useApiData.ts:314-318`): Updates applicant
5. **useDeleteApplicant** (`useApiData.ts:323-327`): Deletes applicant

**Answer Hooks:**

1. **useAnswers** (`useApiData.ts:171-182`): Fetches answers for applicant
   ```typescript
   const { data: answers } = useAnswers(applicantId, interviewId)
   // Requires both IDs, auto-fetches when both available
   ```

---

##### **useMutation** - Data Modification Hook (`useApiData.ts:201-246`)

**Purpose**: Handles create, update, delete operations with loading states

**Key Features:**
- Loading state during mutation (`useApiData.ts:216-218`)
- Success/error callbacks (`useApiData.ts:220-226`)
- Error handling and propagation (`useApiData.ts:222-227`)
- Reset functionality (`useApiData.ts:233-237`)

**Usage Pattern:**
```typescript
const { mutate, loading, error, data, reset } = useMutation(
  (variables) => apiService.post('/interview', variables),
  {
    onSuccess: (data, variables) => {
      refetch()  // Refresh list
    },
    onError: (error, variables) => {
      alert('Failed to save')
    }
  }
)

// Call mutation
await mutate({ title: 'New Interview', job_role: 'Engineer' })
```

---

#### 5. **API Service Layer - HTTP Communication**

**File**: `src/services/apiService.ts:1`

The centralized API service handles all backend communication with robust error handling.

##### **ApiService Class** (`apiService.ts:54-317`)

**Architecture:**
- Built on Axios for HTTP requests
- Singleton pattern for consistent configuration
- Automatic retry logic for failed requests
- Request/response interceptors for logging and auth

**Key Methods:**

1. **GET Request** (`apiService.ts:239-242`)
   ```typescript
   await apiService.get<Interview[]>('/interview')
   await apiService.get<Interview[]>('/interview?id=eq.123')
   ```

2. **POST Request** (`apiService.ts:247-250`)
   ```typescript
   await apiService.post('/interview', { title, description })
   ```

3. **PATCH Request** (`apiService.ts:263-266`)
   ```typescript
   await apiService.patch('/interview?id=eq.123', { title: 'Updated' })
   ```

4. **DELETE Request** (`apiService.ts:271-274`)
   ```typescript
   await apiService.delete('/interview?id=eq.123')
   ```

**Request Interceptor** (`apiService.ts:102-135`)

Automatically adds to every request:
- **Authentication Token** (`apiService.ts:105-111`): From environment or localStorage
- **Username** (`apiService.ts:114-122`): For audit trails
- **Prefer Header** (`apiService.ts:125`): PostgREST return=representation
- **Development Logging** (`apiService.ts:128-132`): Console logs in dev mode

**Response Interceptor** (`apiService.ts:140-149`)

Handles:
- Response logging in development
- Error transformation to ApiError interface
- Consistent error messages

**Retry Logic** (`apiService.ts:210-234`)

Automatic retry for:
- Network errors
- 5xx server errors
- Configurable attempts (default: 3)
- Exponential backoff (default: 1000ms delay)

```typescript
// Retry configuration
const apiService = new ApiService(baseURL, {
  attempts: 3,
  delay: 1000,
  shouldRetry: (error) => error.response?.status >= 500
})
```

**Error Handling** (`apiService.ts:155-177`)

Transforms errors into consistent structure:
```typescript
interface ApiError {
  message: string      // Human-readable error
  status?: number      // HTTP status code
  code?: string        // Error code
  details?: unknown    // Additional error data
}
```

**Error Messages** (`apiService.ts:182-205`):
- 400: Bad request - check input
- 401: Unauthorized - login required
- 403: Forbidden - no permission
- 404: Resource not found
- 422: Validation failed
- 500: Server error
- 503: Service unavailable

---

#### 6. **Page Components - User Interface**

##### **Home Page** (`src/pages/Home.tsx:1`)

**Purpose**: Landing page with feature showcase and call-to-action

**Key Features:**
- **Animated Entry** (`Home.tsx:114-122`): Progressive reveal animation on load
- **Feature Cards** (`Home.tsx:183-233`): Interactive cards with hover effects
- **Modal System** (`Home.tsx:436-489`): Detailed feature information
- **Floating Orbs** (`Home.tsx:76-105`): Animated background elements
- **Statistics Display** (`Home.tsx:257-280`): Key metrics and achievements

**Data Flow:**
```
Mount → Set isLoaded → Trigger animations → Render feature cards
                           ↓
                    User clicks card → Open modal → Show details
```

**Important Code:**
- Animation triggers: `Home.tsx:119-122`
- Feature data structure: `Home.tsx:23-72`
- Modal handling: `Home.tsx:124-130`

---

##### **Interviews Page** (`src/pages/Interviews/index.tsx:1`)

**Purpose**: Main dashboard for managing all interviews

**Key Features:**

1. **Data Fetching with Counts** (`InterviewsPage:38-98`)
   ```typescript
   // Fetch interviews
   const { data: interviews, loading, error, refetch } = useApiData(
     () => apiService.get('/interview')
   )

   // Fetch counts for each interview
   const fetchInterviewCounts = async (interviews) => {
     // Parallel fetch of question counts and applicant stats
     const countsData = await Promise.all(
       interviews.map(async (interview) => {
         const questions = await apiService.get(`/question?interview_id=eq.${interview.id}`)
         const applicants = await apiService.get(`/applicant?interview_id=eq.${interview.id}`)
         return { ...interview, questionCount, applicantStats }
       })
     )
   }
   ```

2. **Delete Functionality** (`InterviewsPage:110-124`)
   - Confirmation dialog before deletion
   - Optimistic UI updates
   - Automatic list refresh after deletion

3. **Loading States** (`InterviewsPage:136-148`)
   - Centered loading spinner
   - Professional glass morphism design
   - Theme-aware styling

4. **Error Handling** (`InterviewsPage:151-172`)
   - User-friendly error messages
   - Retry button
   - Error state UI

5. **Empty State** (`InterviewsPage:241-271`)
   - Call-to-action for first interview
   - Professional empty state design

6. **Interview Cards** (`InterviewsPage:274-409`)
   - Status badges (Draft/Published)
   - Question and applicant counts
   - Quick action buttons (Questions, Applicants, Analytics)
   - Hover animations and effects

**Data Flow:**
```
Load → Fetch interviews → Fetch counts for each → Display cards
                  ↓                                      ↓
              Error/Empty                          User actions
                  ↓                                      ↓
            Show error state              Edit/Delete/View details
```

**Important Code Sections:**
- Interview fetching: `InterviewsPage:38-46`
- Counts aggregation: `InterviewsPage:49-98`
- Delete with mutation: `InterviewsPage:110-117`
- Card rendering: `InterviewsPage:274-409`

---

##### **Questions Page** (`src/pages/Questions/index.tsx:1`)

**Purpose**: Manage interview questions with AI generation capabilities

**Key Features:**

1. **Data Fetching** (`QuestionsPage:38-64`)
   ```typescript
   const fetchData = async () => {
     // Parallel fetch of questions and interview details
     const [questionsRes, interviewRes] = await Promise.all([
       api.get(`/question?interview_id=eq.${interviewId}`),
       api.get(`/interview?id=eq.${interviewId}`)
     ])

     // Add source tagging (manual vs AI)
     const aiQuestionIds = JSON.parse(localStorage.getItem(`ai-questions-${interviewId}`) || '[]')
     const questionsWithSource = questions.map(q => ({
       ...q,
       source: aiQuestionIds.includes(q.id) ? 'ai' : 'manual'
     }))
   }
   ```

2. **AI Question Generation** (`QuestionsPage:80-130`)
   - Integration with OpenAI service
   - Bulk question creation
   - Source tracking in localStorage
   - Partial failure handling
   - Success/error notifications

3. **Question Cards** (`QuestionsPage:338-451`)
   - Difficulty badges (Easy/Medium/Hard)
   - Source tags (AI/Manual)
   - Edit and delete actions
   - Hover animations

**Important Code:**
- AI generation handler: `QuestionsPage:80-130`
- Source tagging: `QuestionsPage:46-53`
- Empty state: `QuestionsPage:272-335`

---

##### **Applicants Page** (`src/pages/Applicants/index.tsx:1`)

**Purpose**: Manage candidates and generate interview links

**Key Features:**

1. **Interview Link Generation** (`ApplicantsPage:99-105`)
   ```typescript
   const handleGenerateLink = (applicant) => {
     const baseUrl = window.location.origin
     const link = `${baseUrl}/take-interview/${interviewId}/${applicant.id}`
     setGeneratedLink(link)
     setGenerateLinkModal({ isOpen: true, applicant })
   }
   ```

2. **Clipboard Integration** (`ApplicantsPage:108-116`)
   - Modern clipboard API
   - Copy confirmation feedback
   - Auto-reset after 3 seconds

3. **Status Tracking** (`ApplicantsPage:284-295`)
   - Not Started: Yellow badge
   - Completed: Green badge
   - Visual status indicators

4. **Action Buttons** (`ApplicantsPage:342-370`)
   - Generate Link: Create unique interview URL
   - View Answers: Review submitted responses
   - AI Feedback: View automated analysis

5. **Link Generation Modal** (`ApplicantsPage:378-457`)
   - Displays personalized link
   - Copy to clipboard button
   - Usage instructions
   - Security notes

**Data Flow:**
```
Load applicants → Display cards → User clicks "Link"
                       ↓                    ↓
                 Show status          Generate URL → Show modal
                       ↓                    ↓
                Update on complete    Copy to clipboard
```

**Important Code:**
- Link generation: `ApplicantsPage:99-105`
- Clipboard copy: `ApplicantsPage:108-116`
- Modal component: `ApplicantsPage:378-457`
- Status badges: `ApplicantsPage:286-295`

---

#### 7. **UI Component Library**

**File**: `src/components/ui/Navbar.tsx:1`

##### **Navbar Component** - Main Navigation

**Key Features:**

1. **Search Functionality** (`Navbar.tsx:42-69`)
   ```typescript
   const fetchSuggestions = async (query) => {
     // Debounced search with minimum 2 characters
     const interviews = await api.get('/interview')
     const filtered = interviews.filter(i =>
       i.title.includes(query) || i.job_role.includes(query)
     ).slice(0, 5)  // Limit to 5 suggestions
   }
   ```

2. **Debounced Input** (`Navbar.tsx:72-83`)
   - 300ms delay before search
   - Automatic suggestion clearing
   - Loading state indication

3. **Click Outside Detection** (`Navbar.tsx:86-96`)
   - Closes dropdown when clicking outside
   - Event listener cleanup on unmount

4. **Search Submission** (`Navbar.tsx:99-111`)
   - Navigates to interviews page with search parameter
   - URL encoding for safety
   - Clears search on submit

5. **Suggestion Navigation** (`Navbar.tsx:114-120`)
   - Navigates directly to applicants page
   - Clears search state
   - Closes dropdown

**Theme Integration:**
- Light mode: Clean white background (`Navbar.tsx:126-128`)
- Dark mode: Gradient purple/blue (`Navbar.tsx:130`)
- Responsive to settings context

**Important Code:**
- Debounce effect: `Navbar.tsx:72-83`
- Search handler: `Navbar.tsx:99-111`
- Dropdown UI: `Navbar.tsx:218-256`

---

#### 8. **Key Integration Points**

##### **Component → Hook → Service Flow**

Example from Interviews Page:

```typescript
// Component Layer (Interviews/index.tsx:32)
export default function InterviewsPage() {

  // Hook Layer (useApiData.ts:38)
  const { data: interviews, loading, error, refetch } = useApiData(

    // Service Layer (apiService.ts:239)
    () => apiService.get<Interview[]>('/interview')
  )

  // Mutation Layer (useApiData.ts:201)
  const { mutate: deleteInterview } = useMutation(
    (id) => apiService.delete(`/interview?id=eq.${id}`),
    {
      onSuccess: () => refetch()  // Refresh list after delete
    }
  )

  return (
    // UI rendering with data
    <div>{interviews?.map(interview => ...)}</div>
  )
}
```

**Flow Diagram:**
```
User clicks "Delete"
       ↓
InterviewsPage.handleDelete() called
       ↓
useMutation.mutate(id) executed
       ↓
apiService.delete() sends HTTP request
       ↓
Server processes deletion
       ↓
onSuccess callback triggered
       ↓
refetch() called
       ↓
useApiData fetches fresh data
       ↓
interviews state updated
       ↓
Component re-renders with new data
```

---

##### **Context → Component Integration**

Theme switching example:

```typescript
// User clicks theme toggle
SettingsButton.onClick()
       ↓
updateSetting('theme', 'dark')
       ↓
SettingsContext updates state
       ↓
localStorage.setItem() persists change
       ↓
useEffect() applies to document.documentElement
       ↓
CSS classes updated (dark/light)
       ↓
All components re-render with new theme
```

---

##### **Router → Component → Hook Chain**

Navigation and data loading:

```typescript
// User clicks interview card
navigate(`/interviews/${id}/questions`)
       ↓
Router matches route pattern
       ↓
QuestionsPage component mounts
       ↓
useParams() extracts interviewId
       ↓
useEffect() triggers data fetch
       ↓
fetchData() called
       ↓
api.get() fetches questions
       ↓
State updated, component renders
```

---

### 🔑 Important Code Locations & Patterns

#### **Error Handling Pattern**

Used throughout the application:

```typescript
// In Interviews Page (InterviewsPage:151-172)
if (error) {
  return (
    <ErrorDisplay
      message={error.message}
      onRetry={refetch}
    />
  )
}
```

**Key Features:**
- User-friendly error messages
- Retry functionality
- Themed error states
- Consistent UI across all pages

---

#### **Loading States Pattern**

Implemented in all data-fetching components:

```typescript
// In Questions Page (QuestionsPage:133-149)
if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner
        size="lg"
        text="Loading questions..."
        centered
      />
    </div>
  )
}
```

---

#### **Empty States Pattern**

Guides users when no data exists:

```typescript
// In Applicants Page (ApplicantsPage:214-262)
if (applicants.length === 0) {
  return (
    <EmptyState
      icon={<UserGroupIcon />}
      title="No applicants yet"
      description="Add your first candidate to start the interview process"
      action={<Button onClick={createApplicant}>Add First Applicant</Button>}
    />
  )
}
```

---

#### **Optimistic Updates Pattern**

Updates UI before server confirmation:

```typescript
// In mutation hooks (useApiData.ts:214-231)
const mutate = async (variables) => {
  setLoading(true)           // Show loading
  try {
    const result = await mutationFn(variables)
    setData(result)          // Update local state
    onSuccess?.(result)      // Trigger callbacks
    return result
  } catch (error) {
    setError(error)          // Handle error
    onError?.(error)
    throw error
  } finally {
    setLoading(false)        // Clear loading
  }
}
```

---

#### **Debouncing Pattern**

Used in search functionality:

```typescript
// In Navbar (Navbar.tsx:72-83)
useEffect(() => {
  const timeoutId = setTimeout(() => {
    if (searchQuery) {
      fetchSuggestions(searchQuery)
    }
  }, 300)  // 300ms delay

  return () => clearTimeout(timeoutId)  // Cleanup
}, [searchQuery])
```

---

### 🎨 Design Token System

**File**: `src/styles/designTokens.ts:1`

Centralized design system for consistent theming:

```typescript
export const designTokens = {
  colors: {
    primary: {
      50: '#eff6ff',
      500: '#3b82f6',
      900: '#1e3a8a'
    },
    secondary: {
      50: '#fefce8',
      500: '#f59e0b',
      900: '#78350f'
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem'
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    xl: '1.5rem'
  }
}
```

**Usage:**
- Ensures consistent spacing and colors
- Supports theme switching
- Accessible from all components

---

### 🚀 Performance Optimizations

1. **Lazy Loading** - Code splitting for routes
2. **Memoization** - useCallback for expensive functions
3. **Debouncing** - Search input delays
4. **Parallel Fetching** - Promise.all for multiple requests
5. **Optimistic Updates** - Instant UI feedback
6. **Request Caching** - Reduces redundant API calls

---

### 🔐 Security Features

1. **JWT Authentication** - Token-based auth (`apiService.ts:105-111`)
2. **Request Validation** - Input sanitization
3. **Secure Links** - Unique interview URLs per applicant
4. **Error Sanitization** - No sensitive data in error messages
5. **HTTPS Enforcement** - Secure data transmission

---

### 📊 Data Flow Diagrams

#### Complete Interview Creation Flow:

```
User clicks "Create Interview"
       ↓
Navigate to /interviews/new
       ↓
InterviewForm component loads
       ↓
User fills form (title, description, job_role)
       ↓
Form validation
       ↓
Submit → useCreateInterview.mutate()
       ↓
apiService.post('/interview', data)
       ↓
Server creates interview record
       ↓
Returns new interview with ID
       ↓
onSuccess: navigate to questions page
       ↓
/interviews/{id}/questions loaded
       ↓
User can add questions
```

#### Question Generation with AI:

```
User clicks "Generate AI Questions"
       ↓
AIQuestionGenerator modal opens
       ↓
User selects quantity and difficulty
       ↓
Click "Generate" → OpenAI API call
       ↓
AI generates questions based on job role
       ↓
Questions returned to component
       ↓
handleAIQuestionsGenerated() called
       ↓
Loop through questions
       ↓
api.post('/question', questionData) for each
       ↓
Track AI-generated IDs in localStorage
       ↓
Refresh questions list
       ↓
Display with "AI Generated" tags
```

#### Applicant Interview Flow:

```
Recruiter adds applicant
       ↓
Click "Generate Link"
       ↓
Create unique URL: /take-interview/{interviewId}/{applicantId}
       ↓
Copy and send to candidate
       ↓
Candidate opens link
       ↓
TakeInterview page loads
       ↓
Fetch questions and applicant data
       ↓
Display interview interface
       ↓
Candidate records audio answers
       ↓
Speech-to-text transcription
       ↓
Submit answers
       ↓
Save to database
       ↓
Update applicant status to "Completed"
       ↓
Recruiter views answers and AI feedback
```

---

### 🧪 Testing Patterns

**Component Testing:**
```typescript
describe('InterviewsPage', () => {
  it('fetches and displays interviews', async () => {
    const { data } = renderHook(() => useInterviews())
    await waitFor(() => expect(data).toBeTruthy())
  })
})
```

**Hook Testing:**
```typescript
describe('useApiData', () => {
  it('handles loading states correctly', () => {
    const { result } = renderHook(() =>
      useApiData(() => fetchData())
    )
    expect(result.current.loading).toBe(true)
  })
})
```

---

### 📝 Code Organization Best Practices

1. **File Naming**: PascalCase for components, camelCase for utilities
2. **Import Order**: React → Third-party → Local components → Types → Styles
3. **Component Structure**: Props → State → Effects → Handlers → Render
4. **Type Safety**: Full TypeScript coverage, no `any` types
5. **Comments**: JSDoc for public APIs, inline for complex logic

---

This documentation provides a complete understanding of how ReadySetHire works, from the entry point to data persistence, covering every major component, hook, and integration point in the application.

---

# 📚 Technical Deep Dive: Component Integration & Data Flow

This section explains how the core architectural components work together to create a cohesive application.

---

## 1. 🎨 Light/Dark Mode System

### How It Works

The theme system uses React Context to manage global settings that persist across browser sessions. When a user toggles the theme, the SettingsContext updates its state and immediately applies the change to the HTML document element by adding or removing CSS classes.

The flow works like this: User clicks theme toggle → SettingsContext updates state → useEffect detects the change → Document root element gets "light" or "dark" class added → All components re-render with new styling → Setting is saved to localStorage for persistence.

Every component that needs theme-aware styling imports the useSettings hook and reads the current theme value. Based on this value, components conditionally apply different Tailwind CSS classes. For example, in light mode, backgrounds use white with slate borders, while dark mode uses transparent white overlays with white borders.

The system also includes font size scaling and contrast adjustments. These are applied as CSS custom properties on the document root, which all components inherit automatically.

### Integration Points

SettingsContext wraps the entire app at the root level in App.tsx, making settings available to all child components. The Navbar component displays the theme toggle button, the SettingsModal provides the full settings interface, and every page component (Interviews, Questions, Applicants) uses conditional styling based on the theme value.

The persistence layer automatically saves any settings change to localStorage and loads saved settings on app startup, ensuring user preferences survive page refreshes.

---

## 2. 🔌 API Architecture & Request Flow

### How It Works

The API layer is built on Axios and provides a centralized HTTP client with automatic authentication, error handling, and retry logic. The system uses three layers: Components → Custom Hooks → API Client → Backend.

When a component needs data, it calls a custom hook like useInterviews. This hook internally calls the API client's get method. Before the request leaves the browser, the request interceptor automatically injects the JWT token for authentication and adds the username field to the request body (required for Row Level Security on the backend).

The request travels to the PostgREST backend at comp2140a2.uqcloud.net/api. PostgREST validates the JWT token, checks that the username matches the authenticated user's permissions, processes the request, and returns the data.

On the way back, the response interceptor logs the response in development mode and transforms any errors into a consistent ApiError format with user-friendly messages.

### Error Handling & Retry Logic

If a request fails due to network issues or server errors (5xx status codes), the retry logic automatically attempts the request up to 3 times with exponential backoff (1 second, then 2 seconds). This makes the app resilient to temporary network issues.

### Integration Points

The api/index.ts file creates and exports a single Axios instance used throughout the app. Custom hooks in useApiData.ts wrap API calls and provide React state management. Components never call the API directly—they always go through hooks.

For example, when the Interviews page loads: InterviewsPage component → calls useApiData hook → hook calls apiService.get('/interview') → request interceptor adds auth → backend responds → response interceptor processes → hook updates state → component re-renders with data.

The username injection is critical because the backend database has Row Level Security policies that check: "Does the username in this request match the authenticated user?" Without this automatic injection, every create and update would fail with a 403 Forbidden error.

---

## 3. 📱 Responsive Design with useIsMobile

### How It Works

The useIsMobile hook provides JavaScript-based responsive design by monitoring the browser viewport width. Instead of relying solely on CSS media queries, this hook creates a MediaQueryList object that watches for the viewport crossing the 768px breakpoint.

When the viewport width changes and crosses the threshold, the MediaQueryList fires a change event. The hook captures this event, updates its React state, and triggers a re-render of any component using the hook.

The key advantage over CSS media queries is that this allows components to conditionally render completely different component trees based on screen size, not just hide/show elements. This means mobile users don't download and render desktop components they'll never see.

### Integration Points

Components import useIsMobile and use the boolean return value to make rendering decisions. For example, the Navbar might render a hamburger menu on mobile but a full navigation bar on desktop. The sidebar could be a drawer on mobile and a fixed panel on desktop.

The hook uses the standard Web API's matchMedia, which is supported in all modern browsers and performs better than resize event listeners because it only fires when crossing the specific breakpoint, not on every pixel change.

---

## 4. ⚙️ Environment Configuration System

### How It Works

The environment configuration centralizes all application settings in a single TypeScript file that reads from environment variables. Vite (the build tool) exposes environment variables prefixed with VITE_ to the client-side code through import.meta.env.

The appConfig object provides type-safe access to settings like the API URL, feature flags, and timeout values. When the app builds for production, Vite replaces these environment variable references with their actual values, so the final bundle contains the correct configuration.

Feature flags use boolean logic to enable or disable features. For example, AI features are automatically enabled if the VITE_LLM_API_KEY exists, without requiring a separate flag. This prevents features from being visible when they can't function.

### Integration Points

The API client imports appConfig to get the base URL and timeout values. Page components check feature flags before rendering optional features like AI question generation. The logging system adjusts its verbosity based on whether the environment is development or production.

During local development, settings come from the .env file. In production, hosting platforms (like Netlify or Vercel) inject environment variables at build time. This allows the same codebase to work in multiple environments with different configurations.

---

## 5. 🔧 Context Providers: Settings & Tutorials

### SettingsContext - Global State Management

SettingsContext manages application-wide preferences using React's Context API. It maintains state for theme, font size, and contrast level, and exposes functions to update these settings.

The provider wraps the entire application, making settings available to any component through the useSettings hook. When settings change, three things happen simultaneously: the state updates, the DOM is modified to apply visual changes, and localStorage is updated for persistence.

The DOM manipulation applies CSS classes and custom properties to the document root element. Components don't need to know about these low-level details—they just read the settings value and apply appropriate styling.

### TutorialContext - Interactive Onboarding

TutorialContext provides step-by-step guided tours for different features. It maintains five pre-configured tutorial flows, each with multiple steps that highlight specific UI elements and explain their purpose.

When a tutorial starts, the context sets the current flow and step index, then displays the TutorialOverlay component. This overlay creates a visual spotlight on the target element by positioning a highlight ring around it and showing a tooltip with instructions.

As users progress through steps, the context tracks which tutorials have been completed and saves this to localStorage. This prevents tutorials from reappearing after completion.

### Integration Points

Both contexts wrap the app at the root level. The SettingsButton triggers the settings modal, while TutorialButton components scattered throughout the app launch specific tutorials. The TutorialOverlay component listens to the tutorial context and renders the visual guidance.

Every page that needs theme-aware styling imports useSettings. Pages with complex workflows (like Interviews, Questions, Applicants) include TutorialButton components that launch their respective guided tours.

---

## 6. 🪝 Custom Hooks: Data Fetching Architecture

### The Hook Hierarchy

The hook system has two layers: generic hooks (useApiData, useMutation) and specialized hooks (useInterviews, useQuestions, etc.). This pattern reduces code duplication while providing convenient, resource-specific functions.

### useApiData - GET Requests

This generic hook handles any data-fetching scenario. It manages three pieces of state: data, loading, and error. When the component mounts, the hook automatically calls the fetcher function, sets loading to true, and waits for the response.

On success, it stores the data and clears the error. On failure, it stores the error and clears the data. Either way, loading becomes false when done.

The hook also watches a dependencies array. When any dependency changes, it automatically refetches the data. This is perfect for situations like "fetch questions when interviewId changes."

### useMutation - POST/PATCH/DELETE

Mutations work differently than queries because they don't auto-execute on mount. Instead, they return a mutate function that components call when needed (like when submitting a form).

The mutation manages loading and error states, and crucially, it calls onSuccess and onError callbacks. This is how components refresh data after mutations—the onSuccess callback typically calls refetch() to update the list.

### Specialized Hooks

Hooks like useInterviews are thin wrappers around useApiData that provide resource-specific functionality. They know the correct API endpoint, data type, and dependencies, so components don't have to specify these details.

### Integration Flow

A typical data flow looks like this: Component calls useInterviews → hook calls useApiData → useApiData calls apiService.get → API client sends request → backend responds → hook updates state → component re-renders → UI updates.

For mutations: Component calls deleteInterview → useMutation executes → API client sends DELETE → backend confirms → onSuccess fires → refetch() called → fresh data loads → UI updates to reflect deletion.

The beauty of this system is that components remain simple. They don't manage loading states, handle errors, or orchestrate refetching. The hooks handle all complexity.

---

## 7. 🌐 Service Layer: API & AI Services

### apiService - Backend Communication

The API service is a singleton class that wraps Axios with enterprise-grade features. It handles authentication by injecting JWT tokens, manages retries for failed requests, and transforms errors into user-friendly messages.

The request interceptor is the key to automation. Before every request, it adds the Authorization header with the JWT token. For mutations (POST/PATCH), it automatically injects the username field into the request body. This happens transparently—components never need to think about authentication or username requirements.

The retry logic makes the app resilient. If a request fails due to network issues or server errors, the service waits one second and tries again. If that fails, it waits two seconds and tries a third time. Only after three failures does it give up and return an error.

Error messages are humanized. Instead of showing "Error 404," users see "Resource not found." Instead of "ECONNABORTED," they see "Request timeout. Please check your connection."

### openaiService - AI Integration

The OpenAI service provides three AI-powered features: question generation, applicant feedback analysis, and performance analytics. All three use the GPT API with carefully crafted prompts.

The service includes model fallback logic. It tries to use GPT-4o first (the best model), but if that's unavailable, it falls back to GPT-4o-mini, then GPT-4-turbo, then GPT-3.5-turbo. This ensures AI features work even with basic API access.

Each AI function sends a detailed prompt to GPT, requesting a JSON response. The service then cleans the response (removing markdown code blocks if present) and parses it into a typed TypeScript object.

Temperature settings control creativity. Question generation uses 0.7 (fairly creative, for variety), applicant feedback uses 0.6 (balanced), and performance analytics uses 0.5 (more analytical and consistent).

### Integration Flow

When a user clicks "Generate AI Questions": Questions page → calls aiService.generateInterviewQuestions → service builds prompt → sends to GPT → receives JSON response → cleans and parses JSON → returns array of questions → page saves each to database → refetches questions → UI shows new AI-generated questions with special "AI Generated" tags.

The API service and AI service never interact directly—they're used by different parts of the app. API service handles all backend database operations, while AI service handles all GPT-based features.

---

## 8. 📋 Type System: Data Models & Safety

### Purpose & Structure

The types/models.ts file defines the shape of every data structure in the application. These TypeScript interfaces serve as contracts between the frontend and backend, ensuring both sides agree on data formats.

The BaseModel interface defines common fields (id, username, timestamps) that all other models inherit. This promotes consistency and reduces duplication.

### Model Patterns

Each resource has two interfaces: the full model (with all fields including auto-generated ones) and an input model (for creating/updating, without auto-generated fields).

For example, Interview includes the id field (assigned by the database), while InterviewInput omits it. When creating an interview, you use InterviewInput. When reading an interview, you get Interview.

### Type Safety Benefits

TypeScript validates types at compile time, catching errors before the code runs. If you try to assign an invalid status like "Active" to an interview, TypeScript immediately shows an error indicating the type mismatch.

IDE autocomplete becomes incredibly powerful. When you type "interview." the IDE shows all available properties with their types. You can't accidentally reference a field that doesn't exist.

When you refactor models, TypeScript identifies every place in the codebase that needs updating. If you add a new interview status, TypeScript flags all switch statements and conditionals that need to handle the new case.

### Integration Points

Custom hooks use generic types to ensure type safety. When you call useApiData with Interview array type, TypeScript knows the data will be Interview array or null. The mutate function knows it accepts InterviewInput and returns Interview.

Components benefit from autocomplete and validation. When rendering an interview card, TypeScript ensures you don't access non-existent properties. When submitting forms, TypeScript validates that the data matches InterviewInput.

The type system prevents entire categories of bugs. You can't accidentally send the wrong data to the API, can't forget required fields, and can't use the wrong status values. All these errors are caught during development, not in production.

---

## 🔄 Complete Application Flow: Real-World Example

Let's trace a complete user journey to see how everything integrates:

### Scenario: User Creates an Interview with AI Questions

**Step 1: Page Load**
- User navigates to /interviews
- React Router matches route and renders InterviewsPage
- Component calls useInterviews hook
- Hook calls apiService.get('/interview')
- Request interceptor adds JWT token
- Backend returns interviews array
- Component renders interview cards using theme from SettingsContext

**Step 2: Create Interview**
- User clicks "Create Interview" button
- Navigate to /interviews/new
- InterviewForm component renders
- Form inputs are controlled by React state
- User fills in title, job_role, description
- User clicks "Save"

**Step 3: Save Interview**
- Form calls handleSubmit
- Calls createInterview mutation from useCreateInterview hook
- Hook calls apiService.post('/interview', formData)
- Request interceptor injects username automatically
- Backend validates, creates record, returns created interview with id
- onSuccess callback fires and navigates to questions page

**Step 4: Generate AI Questions**
- Questions page loads, calls useQuestions with interviewId
- Empty state shows (no questions yet)
- User clicks "Generate AI Questions" button
- AIQuestionGenerator modal opens
- User selects difficulty: "Intermediate", count: 5
- User clicks "Generate"

**Step 5: AI Processing**
- Component calls aiService.generateInterviewQuestions
- Service builds prompt including job_role from interview
- Tries GPT-4o model first
- GPT returns JSON array of 5 questions with rationales
- Service cleans and parses JSON
- Returns GeneratedQuestion array to component

**Step 6: Save Generated Questions**
- Component loops through questions
- For each question: calls api.post('/question', questionData)
- Request interceptor adds username to each request
- Backend creates all 5 questions
- Component stores question IDs in localStorage to mark as AI-generated
- Calls refetch to reload questions list

**Step 7: Display Questions**
- useQuestions refetches from backend
- Hook retrieves AI question IDs from localStorage
- Maps questions and adds source property (ai or manual)
- Component renders question cards
- AI-generated questions show purple "AI Generated" badge
- Manual questions show blue "Manual" badge

**Step 8: Theme Switching**
- User clicks theme toggle in settings
- SettingsContext updateSetting method called with 'theme' and 'light'
- Context updates state
- useEffect fires, removes 'dark' class from html element, adds 'light' class
- localStorage saves preference
- All components re-render with light mode styling
- Questions page background changes from dark glass to white
- Text colors change from white to slate
- Borders change from translucent white to slate colors

Throughout this entire flow, every architectural piece plays its role: SettingsContext provides theme to all components, API interceptors handle auth automatically, hooks manage loading and error states, TypeScript validates all data types, error boundaries catch any component errors, and the tutorial system can guide users through each step.

---

## 🔗 Cross-Component Integration Patterns

### Pattern 1: Context + Hooks Pattern

The app combines Context for global state with hooks for data fetching. SettingsContext provides theme/settings globally, while custom hooks fetch and mutate data. This separation of concerns keeps contexts focused on UI state and hooks focused on server state.

### Pattern 2: Interceptor Automation

The API interceptor pattern eliminates repetitive code. Instead of every component adding auth headers and username fields, the interceptor handles this once in a central location. This follows the DRY (Don't Repeat Yourself) principle.

### Pattern 3: Hook Composition

Specialized hooks compose generic hooks. useInterviews wraps useApiData, which uses apiService. Each layer adds value: useInterviews knows the endpoint, useApiData manages React state, apiService handles HTTP. This creates a clean separation of responsibilities.

### Pattern 4: Type-Driven Development

TypeScript types flow from models.ts through hooks into components. When you change an interface in models.ts, TypeScript immediately highlights every affected component. This makes refactoring safe and fast.

### Pattern 5: Feature Flags

The environment config enables progressive feature rollout. AI features are hidden when no API key exists. Tutorials can be disabled in production. This allows the same codebase to work in multiple configurations.

### Pattern 6: Optimistic UI Updates

Mutations use callbacks (onSuccess) to trigger refetching. When you delete an interview, the mutation's onSuccess calls refetch, which updates the list. The UI stays synchronized with the server without manual coordination.

---

## 🎯 Key Architectural Decisions

### Why Context for Settings?

Settings need to be accessible everywhere (Navbar, every page, modals). Prop drilling would be impractical. Context provides global access without passing props through every component.

### Why Hooks for Data?

Hooks encapsulate complex logic (loading states, error handling, refetching) into reusable functions. Without hooks, every component would duplicate this logic. Hooks also compose well—you can use multiple hooks in one component.

### Why Axios over Fetch?

Axios provides interceptors, automatic JSON parsing, request/response transformation, and better error handling. The interceptor pattern is crucial for automatic authentication.

### Why TypeScript?

TypeScript catches bugs at compile time instead of runtime. It provides autocomplete, refactoring safety, and self-documentation. The initial overhead pays dividends in reduced bugs and faster development.

### Why Client-Side AI?

Running AI directly in the browser (using OpenAI API) simplifies the architecture. No backend AI service needed. The tradeoff is exposing the API key, mitigated by API key restrictions and usage quotas.

### Why localStorage for Settings?

Settings need to persist across sessions but don't need server synchronization. localStorage is perfect for this—instant writes, no network latency, works offline.

---

This architecture creates a maintainable, scalable, and developer-friendly application where each component has a clear purpose and integrates seamlessly with others.
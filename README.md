# ReadySetHire - Modern Interview Management Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A professional, modern interview management platform built with React, TypeScript, and Vite. ReadySetHire streamlines the interview process with automated question generation, real-time applicant management, and comprehensive analytics.

## 🚀 Features

### Core Functionality
- **Smart Interview Creation**: Automated question generation with difficulty levels
- **Real-time Applicant Management**: Track candidates through the interview process
- **Comprehensive Analytics**: View detailed statistics and performance metrics
- **Responsive Design**: Mobile-first approach with professional UI/UX
- **Voice Recording**: Speech-to-text capability for interview responses
- **Error Handling**: Robust error boundaries with retry functionality
- **Performance Optimized**: Lazy loading, memoization, and code splitting

### Technical Features
- **Modern Architecture**: Functional programming paradigm with React hooks
- **Type Safety**: Comprehensive TypeScript implementation
- **Design System**: Professional blue & gold color palette with design tokens
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation
- **API Management**: Centralized service layer with retry logic and error handling
- **State Management**: Custom hooks for data fetching and mutations
- **Component Library**: Reusable UI components with compound patterns

## 🏗️ Architecture

### Project Structure
```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Core UI component library
│   │   ├── Button.tsx   # Professional button component
│   │   ├── Card.tsx     # Flexible card component
│   │   ├── Modal.tsx    # Accessible modal component
│   │   └── LoadingSpinner.tsx # Loading states
│   └── ErrorBoundary.tsx # Error handling component
├── hooks/               # Custom React hooks
│   └── useApiData.ts    # Data fetching hooks
├── pages/               # Route components
│   ├── Home.tsx         # Landing page
│   ├── Dashboard.tsx    # Main dashboard
│   ├── CreateInterview/ # Interview creation flow
│   ├── ViewAnswers/     # Answer viewing interface
│   └── ManageInterviews/ # Interview management
├── services/            # API and external services
│   └── apiService.ts    # Centralized API management
├── styles/              # Styling and design system
│   └── designTokens.ts  # Design system tokens
└── types/               # TypeScript type definitions
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
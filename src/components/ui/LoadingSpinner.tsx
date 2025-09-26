import React from 'react'

/**
 * Loading spinner sizes
 */
export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/**
 * Loading spinner variants
 */
export type SpinnerVariant = 'primary' | 'secondary' | 'white' | 'muted'

/**
 * Loading spinner props interface
 */
export interface LoadingSpinnerProps {
  /** Size of the spinner */
  size?: SpinnerSize
  /** Visual variant */
  variant?: SpinnerVariant
  /** Whether to center the spinner */
  centered?: boolean
  /** Loading text to display */
  text?: string
  /** Custom className */
  className?: string
}

/**
 * Get spinner size classes
 */
const getSizeClasses = (size: SpinnerSize): string => {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4', 
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  }
  return sizes[size]
}

/**
 * Get spinner variant classes
 */
const getVariantClasses = (variant: SpinnerVariant): string => {
  const variants = {
    primary: 'text-blue-600',
    secondary: 'text-amber-500',
    white: 'text-white',
    muted: 'text-slate-400',
  }
  return variants[variant]
}

/**
 * Get text size classes based on spinner size
 */
const getTextSizeClasses = (size: SpinnerSize): string => {
  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  }
  return textSizes[size]
}

/**
 * Professional Loading Spinner component with multiple sizes and variants
 * 
 * @example
 * ```tsx
 * <LoadingSpinner size="lg" variant="primary" text="Loading..." />
 * <LoadingSpinner size="md" centered />
 * ```
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  centered = false,
  text,
  className = '',
}) => {
  const sizeClasses = getSizeClasses(size)
  const variantClasses = getVariantClasses(variant)
  const textSizeClasses = getTextSizeClasses(size)
  
  const containerClasses = centered 
    ? 'flex flex-col items-center justify-center gap-3'
    : 'flex items-center gap-2'

  const spinnerClasses = [
    sizeClasses,
    variantClasses,
    'animate-spin',
    className,
  ].filter(Boolean).join(' ')

  const textClasses = [
    textSizeClasses,
    variantClasses,
    'font-medium',
  ].filter(Boolean).join(' ')

  return (
    <div className={containerClasses} role="status" aria-label={text || 'Loading'}>
      {/* Spinner SVG */}
      <svg
        className={spinnerClasses}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>

      {/* Loading text */}
      {text && (
        <span className={textClasses}>
          {text}
        </span>
      )}

      {/* Screen reader text */}
      <span className="sr-only">
        {text || 'Loading, please wait...'}
      </span>
    </div>
  )
}

/**
 * Full screen loading overlay component
 */
export interface LoadingOverlayProps {
  /** Whether the overlay is visible */
  visible: boolean
  /** Loading text */
  text?: string
  /** Spinner size */
  size?: SpinnerSize
  /** Background opacity */
  opacity?: 'light' | 'medium' | 'dark'
}

/**
 * Full screen loading overlay with backdrop
 */
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  text = 'Loading...',
  size = 'lg',
  opacity = 'medium',
}) => {
  if (!visible) return null

  const opacityClasses = {
    light: 'bg-white/70 backdrop-blur-sm',
    medium: 'bg-white/80 backdrop-blur',
    dark: 'bg-slate-900/80 backdrop-blur',
  }

  return (
    <div 
      className={`
        fixed inset-0 z-50 
        flex items-center justify-center
        ${opacityClasses[opacity]}
        transition-all duration-300
      `}
      role="dialog"
      aria-modal="true"
      aria-label="Loading"
    >
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm mx-4">
        <LoadingSpinner
          size={size}
          variant="primary"
          text={text}
          centered
        />
      </div>
    </div>
  )
}

export default LoadingSpinner
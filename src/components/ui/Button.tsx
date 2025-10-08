import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'

/**
 * Button component variants for different use cases
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'

/**
 * Button component sizes
 */
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'

/**
 * Button component props interface
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant of the button */
  variant?: ButtonVariant
  /** Size of the button */
  size?: ButtonSize
  /** Whether the button is in a loading state */
  loading?: boolean
  /** Whether the button should take full width */
  fullWidth?: boolean
  /** Icon to display before the button text */
  leftIcon?: React.ReactNode
  /** Icon to display after the button text */
  rightIcon?: React.ReactNode
  /** Custom className for additional styling */
  className?: string
  /** Button content */
  children?: React.ReactNode
}

/**
 * Get button variant styles
 */
const getVariantStyles = (variant: ButtonVariant): string => {
  const styles = {
    primary: `
      bg-gradient-to-r from-blue-600 to-blue-700 
      hover:from-blue-700 hover:to-blue-800 
      focus:from-blue-700 focus:to-blue-800
      text-white border-transparent
      shadow-md hover:shadow-lg
      focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    `,
    secondary: `
      bg-gradient-to-r from-amber-500 to-amber-600 
      hover:from-amber-600 hover:to-amber-700 
      focus:from-amber-600 focus:to-amber-700
      text-white border-transparent
      shadow-md hover:shadow-lg
      focus:ring-2 focus:ring-amber-500 focus:ring-offset-2
    `,
    outline: `
      bg-transparent 
      border-2 border-blue-600 
      text-blue-600 
      hover:bg-blue-600 hover:text-white 
      focus:bg-blue-600 focus:text-white
      focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    `,
    ghost: `
      bg-transparent 
      text-slate-700 
      hover:bg-slate-100 
      focus:bg-slate-100
      focus:ring-2 focus:ring-slate-500 focus:ring-offset-2
    `,
    danger: `
      bg-gradient-to-r from-red-600 to-red-700 
      hover:from-red-700 hover:to-red-800 
      focus:from-red-700 focus:to-red-800
      text-white border-transparent
      shadow-md hover:shadow-lg
      focus:ring-2 focus:ring-red-500 focus:ring-offset-2
    `,
  }
  return styles[variant].replace(/\s+/g, ' ').trim()
}

/**
 * Get button size styles
 */
const getSizeStyles = (size: ButtonSize): string => {
  const styles = {
    sm: 'px-3 py-1.5 text-sm font-medium',
    md: 'px-4 py-2 text-sm font-medium',
    lg: 'px-6 py-3 text-base font-medium',
    xl: 'px-8 py-4 text-lg font-semibold',
  }
  return styles[size]
}

/**
 * LoadingSpinner component for button loading state
 */
const LoadingSpinner: React.FC<{ size: ButtonSize }> = ({ size }) => {
  const spinnerSize = {
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
  }[size]

  return (
    <svg
      className={`${spinnerSize} animate-spin`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
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
  )
}

/**
 * Professional Button component with multiple variants and accessibility features
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="lg" onClick={handleClick}>
 *   Save Changes
 * </Button>
 * 
 * <Button variant="outline" loading leftIcon={<PlusIcon />}>
 *   Add Item
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      className = '',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      inline-flex items-center justify-center
      border font-medium rounded-lg
      transition-all duration-200 ease-in-out
      focus:outline-none focus:ring-offset-white
      disabled:opacity-50 disabled:cursor-not-allowed
      disabled:hover:bg-current disabled:hover:text-current
    `.replace(/\s+/g, ' ').trim()

    const variantStyles = getVariantStyles(variant)
    const sizeStyles = getSizeStyles(size)
    const widthStyles = fullWidth ? 'w-full' : ''
    
    const buttonClasses = [
      baseStyles,
      variantStyles,
      sizeStyles,
      widthStyles,
      className,
    ].filter(Boolean).join(' ')

    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <span className="mr-2">
            <LoadingSpinner size={size} />
          </span>
        )}
        
        {!loading && leftIcon && (
          <span className="mr-2 flex-shrink-0">
            {leftIcon}
          </span>
        )}
        
        {children && (
          <span className={loading ? 'opacity-70' : ''}>
            {children}
          </span>
        )}
        
        {!loading && rightIcon && (
          <span className="ml-2 flex-shrink-0">
            {rightIcon}
          </span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
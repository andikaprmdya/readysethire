import type { HTMLAttributes } from 'react'

/**
 * Card component variants for different visual styles
 */
export type CardVariant = 'default' | 'elevated' | 'glass' | 'bordered' | 'gradient'

/**
 * Card component padding options
 */
export type CardPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl'

/**
 * Card component props interface
 */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual variant of the card */
  variant?: CardVariant
  /** Padding inside the card */
  padding?: CardPadding
  /** Whether the card should have hover effects */
  hoverable?: boolean
  /** Whether the card should be clickable */
  clickable?: boolean
  /** Custom className for additional styling */
  className?: string
  /** Card content */
  children?: React.ReactNode
}

/**
 * Card Header component props
 */
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Header title */
  title?: string
  /** Header subtitle */
  subtitle?: string
  /** Action element (usually a button or icon) */
  action?: React.ReactNode
  /** Custom className */
  className?: string
  /** Header content */
  children?: React.ReactNode
}

/**
 * Card Content component props
 */
export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Custom className */
  className?: string
  /** Content */
  children?: React.ReactNode
}

/**
 * Card Footer component props
 */
export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  /** Custom className */
  className?: string
  /** Footer content */
  children?: React.ReactNode
}

/**
 * Get card variant styles
 */
const getVariantStyles = (variant: CardVariant): string => {
  const styles = {
    default: `
      bg-white 
      border border-slate-200 
      shadow-sm
    `,
    elevated: `
      bg-white 
      border-0 
      shadow-lg 
      hover:shadow-xl 
      transition-shadow duration-300
    `,
    glass: `
      bg-white/10 
      backdrop-blur-md 
      border border-white/20 
      shadow-lg
    `,
    bordered: `
      bg-white 
      border-2 border-blue-200 
      shadow-sm
    `,
    gradient: `
      bg-gradient-to-br from-blue-50 to-indigo-50 
      border border-blue-200 
      shadow-sm
    `,
  }
  return styles[variant].replace(/\s+/g, ' ').trim()
}

/**
 * Get card padding styles
 */
const getPaddingStyles = (padding: CardPadding): string => {
  const styles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  }
  return styles[padding]
}

/**
 * Professional Card component with multiple variants and composition pattern
 * 
 * @example
 * ```tsx
 * <Card variant="elevated" padding="lg" hoverable>
 *   <CardHeader title="Interview Details" subtitle="Created 2 days ago" />
 *   <CardContent>
 *     <p>Interview content goes here...</p>
 *   </CardContent>
 *   <CardFooter>
 *     <Button variant="primary">Edit</Button>
 *   </CardFooter>
 * </Card>
 * ```
 */
export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  hoverable = false,
  clickable = false,
  className = '',
  children,
  ...props
}) => {
  const baseStyles = `
    rounded-xl 
    transition-all duration-200 ease-in-out
    overflow-hidden
  `.replace(/\s+/g, ' ').trim()

  const variantStyles = getVariantStyles(variant)
  const paddingStyles = getPaddingStyles(padding)
  
  const hoverStyles = hoverable ? `
    hover:transform hover:scale-[1.02] 
    hover:shadow-lg
  `.replace(/\s+/g, ' ').trim() : ''
  
  const clickableStyles = clickable ? `
    cursor-pointer 
    focus:outline-none 
    focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
  `.replace(/\s+/g, ' ').trim() : ''

  const cardClasses = [
    baseStyles,
    variantStyles,
    paddingStyles,
    hoverStyles,
    clickableStyles,
    className,
  ].filter(Boolean).join(' ')

  return (
    <div
      className={cardClasses}
      tabIndex={clickable ? 0 : undefined}
      role={clickable ? 'button' : undefined}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Card Header component for consistent header styling
 */
export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  action,
  className = '',
  children,
  ...props
}) => {
  const headerClasses = `
    flex items-start justify-between 
    mb-4 last:mb-0
    ${className}
  `.replace(/\s+/g, ' ').trim()

  return (
    <div className={headerClasses} {...props}>
      <div className="flex-1 min-w-0">
        {title && (
          <h3 className="text-lg font-semibold text-white/90 truncate">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="text-sm text-white/70 mt-1">
            {subtitle}
          </p>
        )}
        {children}
      </div>
      {action && (
        <div className="flex-shrink-0 ml-4">
          {action}
        </div>
      )}
    </div>
  )
}

/**
 * Card Content component for main content area
 */
export const CardContent: React.FC<CardContentProps> = ({
  className = '',
  children,
  ...props
}) => {
  const contentClasses = `
    text-white/80
    leading-relaxed
    ${className}
  `.replace(/\s+/g, ' ').trim()

  return (
    <div className={contentClasses} {...props}>
      {children}
    </div>
  )
}

/**
 * Card Footer component for action buttons or additional info
 */
export const CardFooter: React.FC<CardFooterProps> = ({
  className = '',
  children,
  ...props
}) => {
  const footerClasses = `
    flex items-center justify-between
    pt-4 mt-4
    border-t border-white/20
    ${className}
  `.replace(/\s+/g, ' ').trim()

  return (
    <div className={footerClasses} {...props}>
      {children}
    </div>
  )
}

// Export compound component
Card.displayName = 'Card'
CardHeader.displayName = 'Card.Header'
CardContent.displayName = 'Card.Content' 
CardFooter.displayName = 'Card.Footer'

export default Card
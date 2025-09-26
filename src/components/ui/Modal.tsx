import React, { useEffect, useCallback, HTMLAttributes } from 'react'
import { createPortal } from 'react-dom'

/**
 * Modal component sizes
 */
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

/**
 * Modal component props interface
 */
export interface ModalProps {
  /** Whether the modal is open */
  isOpen: boolean
  /** Function to call when modal should close */
  onClose: () => void
  /** Modal title */
  title?: string
  /** Modal size */
  size?: ModalSize
  /** Whether clicking the backdrop closes the modal */
  closeOnBackdrop?: boolean
  /** Whether pressing escape closes the modal */
  closeOnEscape?: boolean
  /** Whether to show the close button */
  showCloseButton?: boolean
  /** Custom className for the modal container */
  className?: string
  /** Modal content */
  children?: React.ReactNode
}

/**
 * Modal Header component props
 */
export interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Header title */
  title?: string
  /** Whether to show the close button */
  showCloseButton?: boolean
  /** Function to call when close button is clicked */
  onClose?: () => void
  /** Custom className */
  className?: string
  /** Header content */
  children?: React.ReactNode
}

/**
 * Modal Body component props
 */
export interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> {
  /** Custom className */
  className?: string
  /** Body content */
  children?: React.ReactNode
}

/**
 * Modal Footer component props
 */
export interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {
  /** Custom className */
  className?: string
  /** Footer content */
  children?: React.ReactNode
}

/**
 * Get modal size styles
 */
const getSizeStyles = (size: ModalSize): string => {
  const styles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl mx-4',
  }
  return styles[size]
}

/**
 * Close Icon component
 */
const CloseIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
)

/**
 * Professional Modal component with accessibility features and portal rendering
 * 
 * @example
 * ```tsx
 * <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Confirm Action" size="md">
 *   <ModalBody>
 *     <p>Are you sure you want to delete this item?</p>
 *   </ModalBody>
 *   <ModalFooter>
 *     <Button variant="outline" onClick={() => setIsOpen(false)}>
 *       Cancel
 *     </Button>
 *     <Button variant="danger" onClick={handleDelete}>
 *       Delete
 *     </Button>
 *   </ModalFooter>
 * </Modal>
 * ```
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  closeOnBackdrop = true,
  closeOnEscape = true,
  showCloseButton = true,
  className = '',
  children,
}) => {
  // Handle escape key press
  const handleEscapeKey = useCallback(
    (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === 'Escape') {
        onClose()
      }
    },
    [closeOnEscape, onClose]
  )

  // Handle backdrop click
  const handleBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (closeOnBackdrop && event.target === event.currentTarget) {
        onClose()
      }
    },
    [closeOnBackdrop, onClose]
  )

  // Add/remove event listeners and body scroll lock
  useEffect(() => {
    if (isOpen) {
      // Lock body scroll
      document.body.style.overflow = 'hidden'
      
      // Add escape key listener
      if (closeOnEscape) {
        document.addEventListener('keydown', handleEscapeKey)
      }
      
      // Focus management - focus the modal
      const modalElement = document.querySelector('[data-modal="true"]') as HTMLElement
      if (modalElement) {
        modalElement.focus()
      }
    }

    return () => {
      // Cleanup
      document.body.style.overflow = 'unset'
      if (closeOnEscape) {
        document.removeEventListener('keydown', handleEscapeKey)
      }
    }
  }, [isOpen, closeOnEscape, handleEscapeKey])

  if (!isOpen) return null

  const sizeStyles = getSizeStyles(size)

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      data-modal="true"
      tabIndex={-1}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleBackdropClick}
      />

      {/* Modal Container */}
      <div
        className={`
          relative w-full ${sizeStyles} max-h-[90vh]
          bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20
          transform transition-all duration-300 ease-out
          ${className}
        `.replace(/\s+/g, ' ').trim()}
      >
        {/* Default Header (if title provided and no custom header in children) */}
        {title && !React.Children.toArray(children).some(child => 
          React.isValidElement(child) && child.type === ModalHeader
        ) && (
          <ModalHeader 
            title={title} 
            showCloseButton={showCloseButton} 
            onClose={onClose} 
          />
        )}

        {/* Modal Content */}
        <div className="flex flex-col max-h-[90vh]">
          {children}
        </div>
      </div>
    </div>
  )

  // Render modal in portal
  return createPortal(modalContent, document.body)
}

/**
 * Modal Header component
 */
export const ModalHeader: React.FC<ModalHeaderProps> = ({
  title,
  showCloseButton = true,
  onClose,
  className = '',
  children,
  ...props
}) => {
  const headerClasses = `
    flex items-center justify-between
    px-6 py-4
    border-b border-white/10
    ${className}
  `.replace(/\s+/g, ' ').trim()

  return (
    <div className={headerClasses} {...props}>
      <div className="flex-1 min-w-0">
        {title && (
          <h2
            id="modal-title"
            className="text-xl font-semibold text-white/90 truncate"
          >
            {title}
          </h2>
        )}
        {children}
      </div>
      
      {showCloseButton && onClose && (
        <button
          type="button"
          className="
            flex-shrink-0 ml-4 p-2
            text-white/50 hover:text-white/80
            rounded-lg hover:bg-white/10
            focus:outline-none focus:ring-2 focus:ring-blue-500/50
            transition-colors duration-200
          "
          onClick={onClose}
          aria-label="Close modal"
        >
          <CloseIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}

/**
 * Modal Body component
 */
export const ModalBody: React.FC<ModalBodyProps> = ({
  className = '',
  children,
  ...props
}) => {
  const bodyClasses = `
    flex-1 
    px-6 py-4 
    overflow-y-auto
    ${className}
  `.replace(/\s+/g, ' ').trim()

  return (
    <div className={bodyClasses} {...props}>
      {children}
    </div>
  )
}

/**
 * Modal Footer component
 */
export const ModalFooter: React.FC<ModalFooterProps> = ({
  className = '',
  children,
  ...props
}) => {
  const footerClasses = `
    flex items-center justify-end gap-3
    px-6 py-4
    border-t border-white/10
    bg-white/5
    ${className}
  `.replace(/\s+/g, ' ').trim()

  return (
    <div className={footerClasses} {...props}>
      {children}
    </div>
  )
}

// Export compound component
Modal.displayName = 'Modal'
ModalHeader.displayName = 'Modal.Header'
ModalBody.displayName = 'Modal.Body'
ModalFooter.displayName = 'Modal.Footer'

export default Modal
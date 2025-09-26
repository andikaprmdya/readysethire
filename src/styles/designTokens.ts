/**
 * Design tokens for ReadySetHire platform
 * Professional blue & gold color scheme with proper accessibility
 */

export const designTokens = {
  colors: {
    // Primary Colors - Professional Blue Palette
    primary: {
      50: '#eff6ff',   // Light blue background
      100: '#dbeafe',  // Very light blue
      200: '#bfdbfe',  // Light blue
      300: '#93c5fd',  // Medium light blue
      400: '#60a5fa',  // Medium blue
      500: '#3b82f6',  // Base blue - primary
      600: '#2563eb',  // Darker blue
      700: '#1d4ed8',  // Dark blue
      800: '#1e40af',  // Darker blue
      900: '#1e3a8a',  // Darkest blue
    },
    
    // Secondary Colors - Gold Accents
    secondary: {
      50: '#fefce8',   // Light gold background
      100: '#fef3c7',  // Very light gold
      200: '#fde68a',  // Light gold
      300: '#fcd34d',  // Medium light gold
      400: '#fbbf24',  // Medium gold
      500: '#f59e0b',  // Base gold - secondary
      600: '#d97706',  // Darker gold
      700: '#b45309',  // Dark gold
      800: '#92400e',  // Darker gold
      900: '#78350f',  // Darkest gold
    },

    // Neutral Colors - Professional Grays
    neutral: {
      50: '#f8fafc',   // Pure white alternative
      100: '#f1f5f9',  // Very light gray
      200: '#e2e8f0',  // Light gray
      300: '#cbd5e1',  // Medium light gray
      400: '#94a3b8',  // Medium gray
      500: '#64748b',  // Base gray
      600: '#475569',  // Darker gray
      700: '#334155',  // Dark gray
      800: '#1e293b',  // Darker gray
      900: '#0f172a',  // Darkest gray
    },

    // Status Colors
    success: {
      50: '#ecfdf5',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
    },
    
    warning: {
      50: '#fefce8',
      500: '#eab308',
      600: '#ca8a04',
      700: '#a16207',
    },
    
    error: {
      50: '#fef2f2',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
    },

    // Background Colors
    background: {
      primary: '#0f172a',      // Dark navy background
      secondary: '#1e293b',    // Slightly lighter navy
      tertiary: '#334155',     // Medium gray background
      surface: '#ffffff',      // White surfaces
      muted: '#f8fafc',       // Light background
    },

    // Text Colors with proper contrast
    text: {
      primary: '#0f172a',      // Dark text on light backgrounds
      secondary: '#475569',    // Medium text
      tertiary: '#64748b',     // Light text
      inverse: '#ffffff',      // White text on dark backgrounds
      muted: '#94a3b8',        // Subtle text
    },

    // Border Colors
    border: {
      light: '#e2e8f0',
      medium: '#cbd5e1',
      dark: '#94a3b8',
    },
  },

  // Typography Scale
  typography: {
    fontFamily: {
      primary: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
      '6xl': '3.75rem',  // 60px
    },

    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },

    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },

  // Spacing Scale
  spacing: {
    px: '1px',
    0: '0',
    0.5: '0.125rem',  // 2px
    1: '0.25rem',     // 4px
    1.5: '0.375rem',  // 6px
    2: '0.5rem',      // 8px
    2.5: '0.625rem',  // 10px
    3: '0.75rem',     // 12px
    3.5: '0.875rem',  // 14px
    4: '1rem',        // 16px
    5: '1.25rem',     // 20px
    6: '1.5rem',      // 24px
    7: '1.75rem',     // 28px
    8: '2rem',        // 32px
    9: '2.25rem',     // 36px
    10: '2.5rem',     // 40px
    11: '2.75rem',    // 44px
    12: '3rem',       // 48px
    14: '3.5rem',     // 56px
    16: '4rem',       // 64px
    20: '5rem',       // 80px
    24: '6rem',       // 96px
    28: '7rem',       // 112px
    32: '8rem',       // 128px
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },

  // Shadows
  boxShadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },

  // Glass morphism effects
  glassMorphism: {
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.15)',
    dark: 'rgba(0, 0, 0, 0.1)',
  },

  // Animation timing
  animation: {
    duration: {
      fast: '150ms',
      normal: '250ms',
      slow: '400ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },

  // Breakpoints for responsive design
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const

export type DesignTokens = typeof designTokens
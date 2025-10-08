// Import Link component for internal navigation
import { Link } from 'react-router-dom'
// Import settings context for theme management
import { useSettings } from '../contexts/SettingsContext'

// Main footer component with theme-responsive styling and company information
export default function Footer() {
  // Get current theme settings from context
  const { settings } = useSettings()

  return (
    // Footer container with automatic top margin and theme-responsive styling
    <footer className={`mt-auto transition-colors duration-300 ${
      // Conditional styling based on current theme
      settings.theme === 'light'
        // Light theme: subtle gray background with blur effect
        ? 'bg-slate-50/80 backdrop-blur-xl border-t border-slate-200/60 shadow-sm'
        // Dark theme: glass morphism effect with white border
        : 'glass border-t border-white/10'
    }`}>
      {/* Main content container with max width and padding */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Responsive flex container - column on mobile, row on desktop */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Brand section with logo, description, and creator credit */}
          <div className="flex flex-col space-y-2">
            {/* Company logo with gradient text effect */}
            <div className={`text-xl font-bold ${
              settings.theme === 'light'
                // Light theme: blue to indigo gradient
                ? 'bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent'
                // Dark theme: blue to amber gradient
                : 'bg-gradient-to-r from-blue-400 to-amber-400 bg-clip-text text-transparent'
            }`}>
              ReadySetHire
            </div>
            {/* Company description with theme-responsive text color */}
            <p className={`text-sm max-w-md ${
              settings.theme === 'light' ? 'text-slate-600' : 'text-white/70'
            }`}>
              Professional interview management platform streamlining the recruitment process with intelligent automation.
            </p>
            {/* Creator credit line with smaller, muted text */}
            <p className={`text-xs ${
              settings.theme === 'light' ? 'text-slate-500' : 'text-white/60'
            }`}>
              Originally created by Andika Pramudya Wardana
            </p>
          </div>

          {/* Links section - support and navigation */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
            {/* Support links column */}
            <div className="flex flex-col space-y-2">
              {/* Section header with theme-responsive styling */}
              <h4 className={`font-semibold text-sm ${
                settings.theme === 'light' ? 'text-slate-800' : 'text-white'
              }`}>Support</h4>
              {/* Container for support links */}
              <div className="flex flex-col space-y-1">
                {/* Email contact link with hover effects */}
                <a href="mailto:andikapramudya30@gmail.com" className={`text-sm transition-colors duration-200 ${
                  settings.theme === 'light'
                    // Light theme: gray text with blue hover
                    ? 'text-slate-600 hover:text-blue-600'
                    // Dark theme: muted white with amber hover
                    : 'text-white/70 hover:text-amber-400'
                }`}>Contact Us</a>
                {/* Documentation link opening in new tab */}
                <a href="https://github.com/andikaprmdya/readysethire" className={`text-sm transition-colors duration-200 ${
                  settings.theme === 'light'
                    // Light theme: gray text with blue hover
                    ? 'text-slate-600 hover:text-blue-600'
                    // Dark theme: muted white with amber hover
                    : 'text-white/70 hover:text-amber-400'
                }`} target="_blank" rel="noopener noreferrer">Documentation</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section with copyright and legal links */}
        <div className={`mt-8 pt-6 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 ${
          // Theme-responsive border styling
          settings.theme === 'light' ? 'border-t border-slate-200/60' : 'border-t border-white/10'
        }`}>
          {/* Copyright notice with dynamic year */}
          <p className={`text-sm ${
            settings.theme === 'light' ? 'text-slate-500' : 'text-white/50'
          }`}>
            © {new Date().getFullYear()} ReadySetHire. All rights reserved.
          </p>
          {/* Legal links navigation */}
          <div className="flex space-x-6">
            {/* Privacy Policy link with theme-responsive hover effects */}
            <Link to="/privacy-policy" className={`text-sm transition-colors duration-200 ${
              settings.theme === 'light'
                ? 'text-slate-500 hover:text-slate-700'
                : 'text-white/60 hover:text-white/90'
            }`}>Privacy Policy</Link>
            {/* Terms of Service link with theme-responsive hover effects */}
            <Link to="/terms-of-service" className={`text-sm transition-colors duration-200 ${
              settings.theme === 'light'
                ? 'text-slate-500 hover:text-slate-700'
                : 'text-white/60 hover:text-white/90'
            }`}>Terms of Service</Link>
            {/* Cookie Policy link with theme-responsive hover effects */}
            <Link to="/cookie-policy" className={`text-sm transition-colors duration-200 ${
              settings.theme === 'light'
                ? 'text-slate-500 hover:text-slate-700'
                : 'text-white/60 hover:text-white/90'
            }`}>Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
  
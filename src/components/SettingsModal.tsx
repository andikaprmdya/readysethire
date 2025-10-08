import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSettings } from '../contexts/SettingsContext'
import type { Theme, FontSize, ContrastLevel } from '../contexts/SettingsContext'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSetting, resetSettings } = useSettings()

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative backdrop-blur-xl border rounded-2xl shadow-2xl w-full max-w-md p-6 ${
              settings.theme === 'light'
                ? 'bg-white/90 border-gray-200 text-gray-900'
                : 'bg-white/10 border-white/20 text-white'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${
                settings.theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>Settings</h2>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  settings.theme === 'light'
                    ? 'hover:bg-gray-200 text-gray-700'
                    : 'hover:bg-white/10 text-white'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Theme Setting */}
              <div>
                <label className={`block text-sm font-medium mb-3 ${
                  settings.theme === 'light' ? 'text-gray-700' : 'text-white/90'
                }`}>
                  Theme
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['light', 'dark'] as Theme[]).map((theme) => (
                    <button
                      key={theme}
                      onClick={() => updateSetting('theme', theme)}
                      className={`p-3 rounded-lg border transition-all duration-200 ${
                        settings.theme === theme
                          ? 'bg-indigo-600 border-indigo-500 text-white'
                          : settings.theme === 'light'
                            ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            : 'bg-white/5 border-white/20 text-white/80 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        {theme === 'light' ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                          </svg>
                        )}
                        <span className="capitalize">{theme}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size Setting */}
              <div>
                <label className={`block text-sm font-medium mb-3 ${
                  settings.theme === 'light' ? 'text-gray-700' : 'text-white/90'
                }`}>
                  Font Size
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['small', 'medium', 'large', 'xlarge'] as FontSize[]).map((size) => (
                    <button
                      key={size}
                      onClick={() => updateSetting('fontSize', size)}
                      className={`p-3 rounded-lg border transition-all duration-200 ${
                        settings.fontSize === size
                          ? 'bg-indigo-600 border-indigo-500 text-white'
                          : settings.theme === 'light'
                            ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            : 'bg-white/5 border-white/20 text-white/80 hover:bg-white/10'
                      }`}
                      style={{
                        fontSize: {
                          small: '0.875rem',
                          medium: '1rem',
                          large: '1.125rem',
                          xlarge: '1.25rem'
                        }[size]
                      }}
                    >
                      {size === 'xlarge' ? 'X-Large' : size.charAt(0).toUpperCase() + size.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contrast Level Setting */}
              <div>
                <label className={`block text-sm font-medium mb-3 ${
                  settings.theme === 'light' ? 'text-gray-700' : 'text-white/90'
                }`}>
                  Color Contrast
                </label>
                <p className={`text-xs mb-3 ${
                  settings.theme === 'light' ? 'text-gray-600' : 'text-white/70'
                }`}>
                  Adjusts the intensity of colors and text contrast for better visibility
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {(['normal', 'high', 'higher'] as ContrastLevel[]).map((contrast) => (
                    <button
                      key={contrast}
                      onClick={() => updateSetting('contrast', contrast)}
                      className={`p-3 rounded-lg border transition-all duration-200 ${
                        settings.contrast === contrast
                          ? 'bg-indigo-600 border-indigo-500 text-white'
                          : settings.theme === 'light'
                            ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            : 'bg-white/5 border-white/20 text-white/80 hover:bg-white/10'
                      }`}
                    >
                      {contrast.charAt(0).toUpperCase() + contrast.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset Button */}
              <div className={`pt-4 border-t ${
                settings.theme === 'light' ? 'border-slate-200' : 'border-white/10'
              }`}>
                <button
                  onClick={() => {
                    if (confirm('Reset all settings to defaults?')) {
                      resetSettings()
                    }
                  }}
                  className={`w-full p-3 rounded-lg border transition-colors ${
                    settings.theme === 'light'
                      ? 'border-red-300 text-red-600 hover:bg-red-50'
                      : 'border-red-500/50 text-red-300 hover:bg-red-500/10'
                  }`}
                >
                  Reset to Defaults
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  )
}

export default SettingsModal
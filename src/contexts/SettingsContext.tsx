import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

export type Theme = 'light' | 'dark'
export type FontSize = 'small' | 'medium' | 'large' | 'xlarge'
export type ContrastLevel = 'normal' | 'high' | 'higher'

export interface AppSettings {
  theme: Theme
  fontSize: FontSize
  contrast: ContrastLevel
}

interface SettingsContextType {
  settings: AppSettings
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void
  resetSettings: () => void
  exportSettings: () => string
  importSettings: (settingsJson: string) => boolean
  isSettingsOpen: boolean
  openSettings: () => void
  closeSettings: () => void
}

const defaultSettings: AppSettings = {
  theme: 'dark',
  fontSize: 'medium',
  contrast: 'normal'
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

interface SettingsProviderProps {
  children: React.ReactNode
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('readysethire-settings')
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings)
        setSettings({ ...defaultSettings, ...parsed })
      }
    } catch (error) {
      console.warn('Failed to load settings from localStorage:', error)
    }
  }, [])

  // Apply appearance settings to document
  useEffect(() => {
    const root = document.documentElement

    // Apply theme
    if (settings.theme === 'light') {
      root.classList.remove('dark')
      root.classList.add('light')
    } else {
      root.classList.remove('light')
      root.classList.add('dark')
    }

    // Apply font size
    root.style.setProperty('--app-font-scale', {
      small: '0.875',
      medium: '1',
      large: '1.125',
      xlarge: '1.25'
    }[settings.fontSize])

    // Apply contrast level
    root.style.setProperty('--contrast-multiplier', {
      normal: '1',
      high: '1.2',
      higher: '1.5'
    }[settings.contrast])
  }, [settings])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('readysethire-settings', JSON.stringify(settings))
    } catch (error) {
      console.warn('Failed to save settings to localStorage:', error)
    }
  }, [settings])

  const updateSetting = useCallback(<K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }, [])

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings)
    localStorage.removeItem('readysethire-settings')
  }, [])

  const exportSettings = useCallback(() => {
    return JSON.stringify(settings, null, 2)
  }, [settings])

  const importSettings = useCallback((settingsJson: string): boolean => {
    try {
      const parsed = JSON.parse(settingsJson)

      // Validate the imported settings
      const validatedSettings: AppSettings = { ...defaultSettings }

      if (parsed.theme && ['light', 'dark'].includes(parsed.theme)) {
        validatedSettings.theme = parsed.theme
      }

      if (parsed.fontSize && ['small', 'medium', 'large', 'xlarge'].includes(parsed.fontSize)) {
        validatedSettings.fontSize = parsed.fontSize
      }

      if (parsed.contrast && ['normal', 'high', 'higher'].includes(parsed.contrast)) {
        validatedSettings.contrast = parsed.contrast
      }

      setSettings(validatedSettings)
      return true
    } catch (error) {
      console.error('Failed to import settings:', error)
      return false
    }
  }, [])

  const openSettings = useCallback(() => setIsSettingsOpen(true), [])
  const closeSettings = useCallback(() => setIsSettingsOpen(false), [])

  const contextValue: SettingsContextType = {
    settings,
    updateSetting,
    resetSettings,
    exportSettings,
    importSettings,
    isSettingsOpen,
    openSettings,
    closeSettings
  }

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}

export type { SettingsContextType }
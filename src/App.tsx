import { TutorialProvider } from "./contexts/TutorialContext"
import { SettingsProvider } from "./contexts/SettingsContext"
import AppWithSettings from "./components/AppWithSettings"

/**
 * Main App component with professional blue & gold theme
 * Features responsive layout, accessibility, and modern design
 */
export default function App() {
  return (
    <SettingsProvider>
      <TutorialProvider>
        <AppWithSettings />
      </TutorialProvider>
    </SettingsProvider>
  )
}
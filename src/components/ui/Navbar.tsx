import { Link, NavLink, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useSettings } from "../../contexts/SettingsContext"
import TutorialButton from "../TutorialButton"
import SettingsButton from "../SettingsButton"

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()
  const { settings } = useSettings()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to interviews with search filter
      navigate(`/interviews?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  return (
    <nav className={`sticky top-0 z-50 backdrop-blur-xl transition-colors duration-300 ${
      settings.theme === 'light'
        ? 'border-b border-slate-300 bg-slate-100/95 shadow-lg'
        : 'border-b border-white/10 bg-gradient-to-r from-purple-900/40 via-blue-900/40 to-purple-900/40'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <Link
          to="/"
          className={`text-2xl font-extrabold tracking-wide transition-colors duration-300 ${
            settings.theme === 'light'
              ? 'text-slate-900 hover:text-indigo-700'
              : 'text-white hover:text-purple-300 drop-shadow-[0_0_25px_rgba(168,85,247,1)]'
          }`}
        >
          ReadySetHire
        </Link>

        {/* Navigation Links */}
        <div className="flex-1 flex justify-center space-x-8">
          <NavLink
            to="/interviews"
            className={({ isActive }) =>
              `group relative px-4 py-2 rounded-lg font-medium transition-all duration-300
               ${settings.theme === 'light'
                 ? (isActive
                   ? 'text-indigo-700 bg-indigo-100'
                   : 'text-slate-800 hover:text-indigo-700 hover:bg-slate-200')
                 : (isActive
                   ? 'text-purple-300 drop-shadow-[0_0_15px_rgba(192,132,252,1)]'
                   : 'text-white hover:text-purple-200')}`
            }
          >
            <span className="relative z-10">Interviews</span>
            {/* Hover background glow */}
            {settings.theme === 'dark' && (
              <>
                <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 blur-sm"></div>
                {/* Active underline shimmer */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 transition-all duration-500 rounded-full"></div>
              </>
            )}
            {settings.theme === 'light' && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 group-hover:w-full h-0.5 bg-indigo-600 transition-all duration-500 rounded-full"></div>
            )}
          </NavLink>
        </div>

        {/* Search Bar */}
        <div className="flex items-center space-x-4">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search interviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-64 px-4 py-2 pl-10 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-300 ${
                  settings.theme === 'light'
                    ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-600 focus:ring-indigo-500/50 focus:border-indigo-600 shadow-sm'
                    : 'bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-purple-500/50 focus:border-purple-500/50 backdrop-blur-sm'
                }`}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <svg className={`w-4 h-4 ${
                  settings.theme === 'light' ? 'text-slate-500' : 'text-white/60'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </form>

          {/* Tutorial Help Button */}
          <TutorialButton variant="navbar" />

          {/* Settings Button */}
          <SettingsButton variant="navbar" />

          {/* Tagline */}
          <div className="hidden lg:block">
            <span className={`text-sm font-light italic ${
              settings.theme === 'light' ? 'text-slate-700' : 'text-white/80'
            }`}>
              AI-Powered Interview Platform
            </span>
          </div>
        </div>
      </div>
    </nav>
  )
}

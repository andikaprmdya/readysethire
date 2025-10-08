// Import necessary React Router components for navigation
import { Link, NavLink, useNavigate } from "react-router-dom"
// Import React hooks for component state management
import { useState, useEffect, useRef } from "react"
// Import custom hook for accessing application settings (theme, etc.)
import { useSettings } from "../../contexts/SettingsContext"
// Import tutorial button component for help functionality
import TutorialButton from "../TutorialButton"
// Import settings button component for theme toggling
import SettingsButton from "../SettingsButton"
// Import API service for fetching interview data
import api from "../../api"

// Interface for interview data structure
interface Interview {
  id: number
  title: string
  job_role: string
  description: string
  status: 'Draft' | 'Published'
}

// Main navigation component with search, theme support, and responsive design
export default function Navbar() {
  // State to track the current search query input value
  const [searchQuery, setSearchQuery] = useState("")
  // State for storing interview search suggestions
  const [searchSuggestions, setSearchSuggestions] = useState<Interview[]>([])
  // State to control visibility of search dropdown
  const [showDropdown, setShowDropdown] = useState(false)
  // State to track if suggestions are being loaded
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  // Ref for the search input element
  const searchInputRef = useRef<HTMLInputElement>(null)
  // Ref for the dropdown container
  const dropdownRef = useRef<HTMLDivElement>(null)
  // React Router hook to programmatically navigate between pages
  const navigate = useNavigate()
  // Get current application settings (theme, preferences) from context
  const { settings } = useSettings()

  // Function to fetch interview suggestions based on search query
  const fetchSuggestions = async (query: string) => {
    // Don't fetch if query is too short
    if (query.length < 2) {
      setSearchSuggestions([])
      setShowDropdown(false)
      return
    }

    setLoadingSuggestions(true)
    try {
      // Fetch all interviews and filter on client side for simplicity
      const response = await api.get<Interview[]>('/interview')
      const filtered = response.data.filter(interview =>
        interview.title.toLowerCase().includes(query.toLowerCase()) ||
        interview.job_role.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5) // Limit to 5 suggestions

      setSearchSuggestions(filtered)
      setShowDropdown(filtered.length > 0)
    } catch (error) {
      console.error('Error fetching suggestions:', error)
      setSearchSuggestions([])
      setShowDropdown(false)
    } finally {
      setLoadingSuggestions(false)
    }
  }

  // Effect to handle search suggestions with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        fetchSuggestions(searchQuery)
      } else {
        setSearchSuggestions([])
        setShowDropdown(false)
      }
    }, 300) // 300ms debounce

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  // Effect to handle clicks outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle search form submission when user searches for interviews
  const handleSearch = (e: React.FormEvent) => {
    // Prevent default form submission behavior
    e.preventDefault()
    // Check if search query has actual content (not just whitespace)
    if (searchQuery.trim()) {
      // Navigate to interviews page with search query as URL parameter
      navigate(`/interviews?search=${encodeURIComponent(searchQuery.trim())}`)
      // Clear the search input field after successful search
      setSearchQuery("")
      // Hide dropdown
      setShowDropdown(false)
    }
  }

  // Handle clicking on a search suggestion
  const handleSuggestionClick = (interview: Interview) => {
    // Navigate to the applicants page for the selected interview
    navigate(`/interviews/${interview.id}/applicants`)
    // Clear search and hide dropdown
    setSearchQuery("")
    setShowDropdown(false)
  }

  return (
    // Main navigation container - sticky positioning with blur backdrop effect
    <nav className={`sticky top-0 z-50 backdrop-blur-xl transition-colors duration-300 ${
      // Conditional styling based on current theme (light/dark)
      settings.theme === 'light'
        // Light theme: clean white background with subtle shadow
        ? 'border-b border-slate-200/60 bg-white/95 shadow-lg shadow-slate-200/20'
        // Dark theme: gradient background with purple/blue colors
        : 'border-b border-white/10 bg-gradient-to-r from-purple-900/40 via-blue-900/40 to-purple-900/40'
    }`}>
      {/* Container to center content with max width and responsive padding */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand logo/title - links to home page */}
        <Link
          to="/"
          // Brand styling with theme-responsive colors and hover effects
          className={`text-2xl font-extrabold tracking-wide transition-colors duration-300 ${
            settings.theme === 'light'
              // Light theme: dark text with blue hover state
              ? 'text-slate-800 hover:text-blue-700'
              // Dark theme: white text with purple hover and glow effect
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
              `group relative px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-300
               ${settings.theme === 'light'
                 ? (isActive
                   ? 'text-blue-700 bg-blue-50 border border-blue-200 shadow-md'
                   : 'text-slate-700 hover:text-blue-700 hover:bg-slate-50 border border-slate-200/50 hover:border-blue-200')
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

        {/* Search Bar with Dropdown */}
        <div className="flex items-center space-x-4">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              {/* Search Input */}
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search interviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && searchSuggestions.length > 0 && setShowDropdown(true)}
                className={`w-64 px-4 py-2 pl-10 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-300 ${
                  settings.theme === 'light'
                    ? 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-500 focus:ring-blue-500/30 focus:border-blue-500 shadow-sm hover:bg-white'
                    : 'bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-purple-500/50 focus:border-purple-500/50 backdrop-blur-sm'
                }`}
              />
              {/* Search Icon */}
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                {loadingSuggestions ? (
                  <div className="animate-spin w-4 h-4">
                    <svg className={`w-4 h-4 ${
                      settings.theme === 'light' ? 'text-slate-500' : 'text-white/60'
                    }`} fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                ) : (
                  <svg className={`w-4 h-4 ${
                    settings.theme === 'light' ? 'text-slate-500' : 'text-white/60'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </div>

              {/* Search Dropdown */}
              {showDropdown && (
                <div
                  ref={dropdownRef}
                  className={`absolute top-full left-0 right-0 mt-2 rounded-lg border shadow-lg backdrop-blur-xl z-50 ${
                    settings.theme === 'light'
                      ? 'bg-white/95 border-slate-200 shadow-slate-200/50'
                      : 'bg-slate-900/95 border-white/20'
                  }`}
                >
                  {searchSuggestions.length > 0 ? (
                    <div className="py-2">
                      {searchSuggestions.map((interview) => (
                        <button
                          key={interview.id}
                          onClick={() => handleSuggestionClick(interview)}
                          className={`w-full text-left px-4 py-3 transition-colors duration-200 flex flex-col space-y-1 ${
                            settings.theme === 'light'
                              ? 'hover:bg-slate-100 text-slate-800'
                              : 'hover:bg-white/10 text-white'
                          }`}
                        >
                          <div className="font-medium truncate">{interview.title}</div>
                          <div className={`text-sm truncate ${
                            settings.theme === 'light' ? 'text-slate-500' : 'text-white/60'
                          }`}>
                            {interview.job_role} • {interview.status}
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : searchQuery.length >= 2 && !loadingSuggestions ? (
                    <div className={`px-4 py-3 text-sm ${
                      settings.theme === 'light' ? 'text-slate-500' : 'text-white/60'
                    }`}>
                      No interviews found
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </form>

          {/* Tutorial Help Button */}
          <TutorialButton variant="navbar" />

          {/* Settings Button */}
          <SettingsButton variant="navbar" />

          {/* Tagline */}
          <div className="hidden lg:block">
            <span className={`text-sm font-medium ${
              settings.theme === 'light' ? 'text-slate-600' : 'text-white/80'
            }`}>
              AI-Powered Interview Platform
            </span>
          </div>
        </div>
      </div>
    </nav>
  )
}

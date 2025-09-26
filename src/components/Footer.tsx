import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="glass border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Brand and Description */}
          <div className="flex flex-col space-y-2">
            <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-amber-400 bg-clip-text text-transparent">
              ReadySetHire
            </div>
            <p className="text-white/70 text-sm max-w-md">
              Professional interview management platform streamlining the recruitment process with intelligent automation.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
            <div className="flex flex-col space-y-2">
              <h4 className="text-white font-semibold text-sm">Platform</h4>
              <div className="flex flex-col space-y-1">
                <Link to="/interviews" className="text-white/70 hover:text-blue-400 text-sm transition-colors duration-200">Interviews</Link>
                <Link to="/questions" className="text-white/70 hover:text-blue-400 text-sm transition-colors duration-200">Questions</Link>
                <Link to="/applicants" className="text-white/70 hover:text-blue-400 text-sm transition-colors duration-200">Applicants</Link>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <h4 className="text-white font-semibold text-sm">Support</h4>
              <div className="flex flex-col space-y-1">
                <a href="#" className="text-white/70 hover:text-amber-400 text-sm transition-colors duration-200">Help Center</a>
                <a href="mailto:support@readysethire.com" className="text-white/70 hover:text-amber-400 text-sm transition-colors duration-200">Contact Us</a>
                <a href="https://github.com/readysethire/docs" className="text-white/70 hover:text-amber-400 text-sm transition-colors duration-200" target="_blank" rel="noopener noreferrer">Documentation</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} ReadySetHire. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy-policy" className="text-white/60 hover:text-white/90 text-sm transition-colors duration-200">Privacy Policy</Link>
            <Link to="/terms-of-service" className="text-white/60 hover:text-white/90 text-sm transition-colors duration-200">Terms of Service</Link>
            <Link to="/cookie-policy" className="text-white/60 hover:text-white/90 text-sm transition-colors duration-200">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
  
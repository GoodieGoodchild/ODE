import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-display font-bold text-sage">ODE</span>
              <span className="text-xs text-gray-400 tracking-widest uppercase">Open Dining Experiences</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              An ode to eating out. Connect with fellow food lovers, discover curated set menus, and unlock exclusive drinks promotions.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 tracking-wide">Explore</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/login" className="hover:text-sage transition-colors">Diner Sign In</Link></li>
              <li><Link to="/register" className="hover:text-sage transition-colors">Join as Diner</Link></li>
              <li><Link to="/register?role=restaurant" className="hover:text-sage transition-colors">List Your Restaurant</Link></li>
              <li><Link to="/register?role=brand" className="hover:text-sage transition-colors">Brand Partnerships</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 tracking-wide">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-sage transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-sage transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-sage transition-colors">Community Guidelines</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-6 text-center text-xs text-gray-500">
          © 2026 ODE — Open Dining Experiences. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

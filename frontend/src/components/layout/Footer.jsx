import { Link } from 'react-router-dom';
import { Activity, GitBranch, Globe, Mail, Heart } from 'lucide-react';

const Footer = () => (
  <footer className="bg-surface-900 dark:bg-surface-950 text-slate-400 mt-auto" role="contentinfo">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">

        {/* Brand */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center">
              <Activity className="h-4 w-4 text-white" aria-hidden="true" />
            </div>
            <span className="font-bold text-white text-lg">NutriSmart AI</span>
          </div>
          <p className="text-sm leading-relaxed max-w-xs text-slate-500">
            Personalized nutrition tracking powered by smart recommendations. Eat better, live longer.
          </p>
          <div className="flex items-center gap-3 mt-5">
            {[
              { icon: GitBranch, href: '#', label: 'GitHub' },
              { icon: Globe,    href: '#', label: 'Website' },
              { icon: Mail,     href: '#', label: 'Email' },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-primary-500/20 hover:text-primary-400 flex items-center justify-center transition-colors"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        {/* App links */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">App</h3>
          <ul className="space-y-2.5">
            {[
              { to: '/',                label: 'Dashboard' },
              { to: '/tracker',         label: 'Tracker' },
              { to: '/recommendations', label: 'Smart Fuel' },
              { to: '/habits',          label: 'Habits' },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="text-sm hover:text-primary-400 transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Contact</h3>
          <ul className="space-y-2.5 text-sm">
            <li><a href="mailto:hello@nutrismart.ai" className="hover:text-primary-400 transition-colors">hello@nutrismart.ai</a></li>
            <li><a href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-primary-400 transition-colors">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-slate-600">© {new Date().getFullYear()} NutriSmart AI. All rights reserved.</p>
        <p className="text-xs text-slate-600 flex items-center gap-1">
          Made with <Heart className="h-3 w-3 text-rose-500 fill-rose-500" aria-hidden="true" /> for healthier lives
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;

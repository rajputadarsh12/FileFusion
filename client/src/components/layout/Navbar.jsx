import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FileStack, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Layers,
  Smartphone
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import ApkDownloadModal from '../common/ApkDownloadModal';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [apkModalOpen, setApkModalOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'All Tools', path: '/tools' },
    { name: 'Features', path: '/#features' },
    { name: 'FAQ', path: '/#faq' },
    { name: 'About', path: '/about' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand Identity */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <FileStack className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                  File<span className="text-brand-600 dark:text-brand-400">Fusion</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block -mt-0.5">
                One Workspace. Every File Solution.
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'text-brand-600 dark:text-brand-400 bg-brand-50/80 dark:bg-brand-950/50'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action Buttons & Theme Toggle */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Quick Search Shortcut to /tools */}
            <Link
              to="/tools"
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Search tools"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>

            {/* Android APK Button */}
            <button
              onClick={() => setApkModalOpen(true)}
              className="hidden lg:inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 transition-colors"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Android App</span>
            </button>

            {/* Primary Action Button */}
            <Link
              to="/tools"
              className="inline-flex items-center space-x-2 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-medium text-sm px-4 py-2 rounded-lg shadow-sm shadow-brand-600/30 transition-all hover:shadow-md hover:shadow-brand-600/25"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore All Tools</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 dark:text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-navy-900/95 backdrop-blur-lg px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <button
              onClick={() => { setMobileMenuOpen(false); setApkModalOpen(true); }}
              className="w-full flex items-center justify-center space-x-2 bg-emerald-600 text-white font-medium py-2.5 rounded-lg shadow-sm"
            >
              <Smartphone className="w-4 h-4" />
              <span>Download Android APK</span>
            </button>
            <Link
              to="/tools"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center space-x-2 bg-brand-600 text-white font-medium py-2.5 rounded-lg shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start Using Free Tools</span>
            </Link>
          </div>
        </div>
      )}

      {/* APK Download Modal */}
      <ApkDownloadModal isOpen={apkModalOpen} onClose={() => setApkModalOpen(false)} />
    </header>
  );
}

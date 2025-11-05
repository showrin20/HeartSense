import React, { useState } from 'react';
import { HeartIcon } from './icons/HeartIcon';
import { User } from '../types';

interface NavbarProps {
  onNavigate?: (section: string) => void;
  currentView?: string;
  currentUser?: User | null;
  onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  currentView,
  currentUser,
  onSignOut,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigation = (section: string) => {
    // If we're on landing page and clicking About/Features/Contact, scroll to section
    if (currentView === 'landing' && ['about', 'features', 'contact'].includes(section)) {
      scrollToSection(section);
    } else {
      // Otherwise use the normal navigation
      onNavigate?.(section);
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'about', label: 'About', icon: '📖' },
    { id: 'features', label: 'Features', icon: '✨' },
    { id: 'contact', label: 'Contact', icon: '📧' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer select-none"
          onClick={() => onNavigate?.('home')}
        >
          <HeartIcon className="w-7 h-7 text-rose-500" />
          <span className="text-xl font-bold text-gray-800">HeartSense</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                currentView === item.id
                  ? 'text-rose-600 border-b-2 border-rose-500 pb-1'
                  : 'text-gray-600 hover:text-rose-500'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* User / Auth */}
        <div className="hidden md:flex items-center gap-4">
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
              >
                <div className="w-8 h-8 bg-rose-500 text-white flex items-center justify-center rounded-full text-sm font-semibold">
                  {currentUser.email?.[0].toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  {currentUser.full_name || currentUser.email?.split('@')[0]}
                </span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 shadow-lg rounded-lg overflow-hidden">
                  <button
                    onClick={() => {
                      onNavigate?.('sessions');
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    My Sessions
                  </button>
                  <button
                    onClick={() => {
                      onSignOut?.();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onNavigate?.('start')}
              className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-2 rounded-lg text-sm font-semibold transition"
            >
              Get Started
            </button>
          )}
        </div>

        {/* Mobile */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                handleNavigation(item.id);
                setMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-3 text-sm font-medium flex items-center gap-2 ${
                currentView === item.id
                  ? 'bg-rose-50 text-rose-600'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
          {currentUser ? (
            <>
              <button
                onClick={() => {
                  onNavigate?.('sessions');
                  setMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-sm font-medium flex items-center gap-2 hover:bg-gray-50 text-gray-700"
              >
                <span>📚</span>
                <span>My Sessions</span>
              </button>
              <button
                onClick={() => {
                  onSignOut?.();
                  setMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <span>🚪</span>
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                onNavigate?.('start');
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
            >
              <span>🚀</span>
              <span>Get Started</span>
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

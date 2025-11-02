import React, { useState } from 'react';
import { HeartIcon } from './icons/HeartIcon';
import { User } from '../types';

interface NavbarProps {
    onNavigate?: (section: string) => void;
    currentView?: string;
    currentUser?: User | null;
    onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView, currentUser, onSignOut }) => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    
    const navItems = [
        { id: 'home', label: 'Home' },
        { id: 'about', label: 'About' },
        { id: 'features', label: 'Features' },
    ];

    if (currentUser) {
        navItems.push({ id: 'sessions', label: 'My Sessions' });
    }

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-rose-200/50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Brand */}
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate?.('home')}>
                        <HeartIcon className="w-7 h-7 text-rose-500" />
                        <span className="text-2xl font-bold text-gray-800 tracking-tight">
                            HeartSense
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => onNavigate?.(item.id)}
                                className={`text-sm font-medium transition-colors hover:text-rose-500 ${
                                    currentView === item.id
                                        ? 'text-rose-500'
                                        : 'text-gray-600'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* CTA Button */}
                    <div className="hidden md:flex items-center gap-4">
                        {currentUser ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-2 px-4 py-2 bg-white/60 rounded-full hover:bg-white/80 transition-all"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium">
                                        {currentUser.email?.[0].toUpperCase()}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">
                                        {currentUser.full_name || currentUser.email}
                                    </span>
                                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                
                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200 z-50">
                                        <button
                                            onClick={() => {
                                                onNavigate?.('sessions');
                                                setShowUserMenu(false);
                                            }}
                                            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            📚 My Sessions
                                        </button>
                                        <hr className="my-1 border-gray-200" />
                                        <button
                                            onClick={() => {
                                                onSignOut?.();
                                                setShowUserMenu(false);
                                            }}
                                            className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            🚪 Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={() => onNavigate?.('start')}
                                className="px-6 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
                            >
                                Get Started
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button 
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                    >
                        <svg
                            className="w-6 h-6 text-gray-600"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                </div>

                {/* Mobile Navigation Menu */}
                {showMobileMenu && (
                    <div className="md:hidden pb-4 border-t border-rose-200/50 mt-2 pt-4">
                        <div className="flex flex-col space-y-3">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        onNavigate?.(item.id);
                                        setShowMobileMenu(false);
                                    }}
                                    className={`text-left px-4 py-2 rounded-lg transition-colors ${
                                        currentView === item.id
                                            ? 'bg-rose-50 text-rose-500'
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                            
                            {currentUser ? (
                                <>
                                    <div className="px-4 py-2 text-sm text-gray-600 border-t border-gray-200 mt-2 pt-2">
                                        {currentUser.email}
                                    </div>
                                    <button
                                        onClick={() => {
                                            onSignOut?.();
                                            setShowMobileMenu(false);
                                        }}
                                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all text-left"
                                    >
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => {
                                        onNavigate?.('start');
                                        setShowMobileMenu(false);
                                    }}
                                    className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                                >
                                    Get Started
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

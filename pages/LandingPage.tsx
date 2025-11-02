import React from 'react';
import { HeartIcon } from '../components/icons/HeartIcon';
import { ArrowRightIcon } from '../components/icons/ArrowRightIcon';

interface LandingPageProps {
  onStart: () => void;
  isAuthenticated?: boolean;
  onSignIn?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, isAuthenticated = false, onSignIn }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in max-w-6xl mx-auto px-4">
        {/* Animated Header Section */}
        <div className="relative mb-8">
          <div className="absolute inset-0 animate-pulse">
            <HeartIcon className="w-24 h-24 md:w-32 md:h-32 text-rose-200 blur-xl opacity-50" />
          </div>
          <HeartIcon className="relative w-24 h-24 md:w-32 md:h-32 text-rose-500 animate-bounce" />
        </div>
        
        {/* Main Title with Gradient */}
        <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 bg-clip-text text-transparent tracking-tight mb-4 animate-gradient-x">
            Welcome to HeartSense
        </h1>
        
        {/* Subtitle with fun emoji */}
        <p className="text-xl md:text-2xl text-gray-700 mt-4 max-w-3xl font-medium leading-relaxed">
            Your personal AI partner 💕 Practice real conversations, build confidence, 
            and master the art of connection in a <span className="text-rose-600 font-bold">judgment-free</span> space.
        </p>
        
        {/* Decorative divider */}
        <div className="flex items-center gap-3 my-8">
          <div className="h-1 w-16 bg-gradient-to-r from-transparent to-rose-400 rounded-full"></div>
          <div className="w-3 h-3 bg-rose-400 rounded-full animate-ping"></div>
          <div className="h-1 w-16 bg-gradient-to-l from-transparent to-rose-400 rounded-full"></div>
        </div>
        
        {/* Feature Cards with Enhanced Design */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 w-full">
            <div className="group bg-gradient-to-br from-rose-50 to-pink-100 p-8 rounded-2xl shadow-xl border-2 border-rose-300 transform transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:rotate-1">
                <div className="w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-bounce">
                  <span className="text-3xl">💬</span>
                </div>
                <h3 className="text-2xl font-bold text-rose-800 mb-3">Realistic Conversations</h3>
                <p className="text-gray-700 leading-relaxed">Engage in natural, empathetic chats that feel real. Practice relationship dynamics with an AI that actually listens! 🎯</p>
            </div>
            
            <div className="group bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl shadow-xl border-2 border-blue-300 transform transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:-rotate-1">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-bounce">
                  <span className="text-3xl">📊</span>
                </div>
                <h3 className="text-2xl font-bold text-blue-800 mb-3">Personalized Feedback</h3>
                <p className="text-gray-700 leading-relaxed">Get detailed analysis of your communication style. Discover your love language and areas to grow! 📈</p>
            </div>
            
            <div className="group bg-gradient-to-br from-teal-50 to-emerald-100 p-8 rounded-2xl shadow-xl border-2 border-teal-300 transform transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:rotate-1">
                <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-bounce">
                  <span className="text-3xl">✨</span>
                </div>
                <h3 className="text-2xl font-bold text-teal-800 mb-3">Build Confidence</h3>
                <p className="text-gray-700 leading-relaxed">Grow your emotional awareness and learn to connect deeply. Become the partner everyone dreams of! 🌟</p>
            </div>
        </div>

        {/* Fun Stats Section */}
        <div className="mt-16 grid grid-cols-3 gap-6 w-full max-w-3xl">
          <div className="text-center">
            <p className="text-4xl font-bold text-rose-500">10K+</p>
            <p className="text-sm text-gray-600 mt-1">Conversations</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-500">95%</p>
            <p className="text-sm text-gray-600 mt-1">Improved Skills</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-teal-500">24/7</p>
            <p className="text-sm text-gray-600 mt-1">Always Available</p>
          </div>
        </div>

        {/* CTA Buttons based on auth status */}
        <div className="mt-14 flex flex-col sm:flex-row gap-4 items-center justify-center">
          {isAuthenticated ? (
            <button
              onClick={onStart}
              className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-xl rounded-full shadow-2xl hover:shadow-rose-500/50 focus:outline-none focus:ring-4 focus:ring-rose-400 focus:ring-offset-2 transition-all transform hover:scale-110 hover:-translate-y-1 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-pink-600 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
              <span className="relative">✨ Customize Your Partner</span>
              <ArrowRightIcon className="relative w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
          ) : (
            <>
              <button
                onClick={onSignIn}
                className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-xl rounded-full shadow-2xl hover:shadow-rose-500/50 focus:outline-none focus:ring-4 focus:ring-rose-400 focus:ring-offset-2 transition-all transform hover:scale-110 hover:-translate-y-1"
              >
                <span className="relative">🚀 Get Started - Sign In</span>
                <ArrowRightIcon className="relative w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </button>
              
              <button
                onClick={onSignIn}
                className="inline-flex items-center gap-3 px-10 py-5 bg-white text-rose-600 font-bold text-xl rounded-full shadow-xl border-2 border-rose-300 hover:bg-rose-50 hover:border-rose-400 focus:outline-none focus:ring-4 focus:ring-rose-400 focus:ring-offset-2 transition-all transform hover:scale-105"
              >
                <span>💝 Create Account</span>
              </button>
            </>
          )}
        </div>
        
        {/* Trust badges */}
        <div className="mt-12 flex items-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>100% Private</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>No Judgment</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>AI Powered</span>
          </div>
        </div>
    </div>
  );
};
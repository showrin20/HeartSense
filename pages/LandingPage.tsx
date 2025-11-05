import React from 'react';
import { HeartIcon } from '../components/icons/HeartIcon';
import { ArrowRightIcon } from '../components/icons/ArrowRightIcon';

interface LandingPageProps {
  onStart: () => void;
  isAuthenticated?: boolean;
  onSignIn?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, isAuthenticated = false, onSignIn }) => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-screen text-center animate-fade-in max-w-6xl mx-auto px-4 py-12">
        {/* Main Title with Gradient */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 bg-clip-text text-transparent tracking-tight mb-4 animate-gradient-x">
            Welcome to HeartSense
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mt-4 max-w-3xl font-medium leading-relaxed">
            Your personal AI partner 💕 Practice real conversations, build confidence, 
            and master the art of connection in a <span className="text-rose-600 font-bold">judgment-free</span> space.
        </p>
        
        {/* Decorative divider */}
        <div className="flex items-center gap-3 my-8">
          <div className="h-1 w-12 sm:w-16 bg-gradient-to-r from-transparent to-rose-400 rounded-full"></div>
          <div className="w-3 h-3 bg-rose-400 rounded-full animate-ping"></div>
          <div className="h-1 w-12 sm:w-16 bg-gradient-to-l from-transparent to-rose-400 rounded-full"></div>
        </div>

        {/* CTA Buttons based on auth status */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-center">
          {isAuthenticated ? (
            <button
              onClick={onStart}
              className="group relative inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-10 py-3 sm:py-5 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-lg sm:text-xl rounded-full shadow-2xl hover:shadow-rose-500/50 focus:outline-none focus:ring-4 focus:ring-rose-400 focus:ring-offset-2 transition-all transform hover:scale-105 hover:-translate-y-1"
            >
              <span className="relative">✨ Customize Your Partner</span>
              <ArrowRightIcon className="relative w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-2 transition-transform" />
            </button>
          ) : (
            <>
              <button
                onClick={onSignIn}
                className="group relative inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-10 py-3 sm:py-5 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-lg sm:text-xl rounded-full shadow-2xl hover:shadow-rose-500/50 focus:outline-none focus:ring-4 focus:ring-rose-400 focus:ring-offset-2 transition-all transform hover:scale-105 hover:-translate-y-1"
              >
                <span className="relative">🚀 Get Started</span>
                <ArrowRightIcon className="relative w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-2 transition-transform" />
              </button>
              
              <button
                onClick={onSignIn}
                className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-10 py-3 sm:py-5 bg-white text-rose-600 font-bold text-lg sm:text-xl rounded-full shadow-xl border-2 border-rose-300 hover:bg-rose-50 hover:border-rose-400 focus:outline-none focus:ring-4 focus:ring-rose-400 focus:ring-offset-2 transition-all transform hover:scale-105"
              >
                <span>💝 Create Account</span>
              </button>
            </>
          )}
        </div>
        
        {/* Quick navigation */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-gray-600">
          <button onClick={() => scrollToSection('about')} className="hover:text-rose-600 transition-colors">About</button>
          <span className="hidden sm:inline">•</span>
          <button onClick={() => scrollToSection('features')} className="hover:text-rose-600 transition-colors">Features</button>
          <span className="hidden sm:inline">•</span>
          <button onClick={() => scrollToSection('contact')} className="hover:text-rose-600 transition-colors">Contact</button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 sm:py-24 px-4 bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">About HeartSense</h2>
            <div className="w-20 h-1 bg-rose-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="space-y-4 sm:space-y-6">
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                <span className="text-rose-600 font-bold text-xl sm:text-2xl">HeartSense</span> is an innovative AI-powered platform designed to help you develop emotional intelligence and master relationship communication skills.
              </p>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                Whether you're preparing for a relationship, working on your communication style, or simply want to understand yourself better, HeartSense provides a safe, judgment-free environment to practice and grow.
              </p>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                Our advanced AI partner adapts to different personality types, languages (including Banglish!), and communication styles, giving you personalized feedback to help you become the best version of yourself.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">Why Choose HeartSense?</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">🎯</span>
                  <div>
                    <h4 className="font-semibold text-gray-800">Personalized Experience</h4>
                    <p className="text-sm text-gray-600">Customize your AI partner's personality to match your learning needs</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">🔒</span>
                  <div>
                    <h4 className="font-semibold text-gray-800">100% Private & Safe</h4>
                    <p className="text-sm text-gray-600">Your conversations are confidential and secure</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">📊</span>
                  <div>
                    <h4 className="font-semibold text-gray-800">Actionable Insights</h4>
                    <p className="text-sm text-gray-600">Get detailed analysis and tips for improvement</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">🌍</span>
                  <div>
                    <h4 className="font-semibold text-gray-800">Bilingual Support</h4>
                    <p className="text-sm text-gray-600">Practice in English or Banglish</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">Powerful Features</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to master emotional intelligence and relationship communication
            </p>
            <div className="w-20 h-1 bg-rose-500 mx-auto mt-4 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="group bg-gradient-to-br from-rose-50 to-pink-100 p-6 sm:p-8 rounded-2xl shadow-lg border-2 border-rose-200 hover:border-rose-400 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-bounce">
                  <span className="text-2xl sm:text-3xl">💬</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-rose-800 mb-3 text-center">Realistic Conversations</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed text-center">Engage in natural, empathetic chats that feel real. Practice relationship dynamics with an AI that actually listens!</p>
            </div>
            
            <div className="group bg-gradient-to-br from-blue-50 to-indigo-100 p-6 sm:p-8 rounded-2xl shadow-lg border-2 border-blue-200 hover:border-blue-400 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-bounce">
                  <span className="text-2xl sm:text-3xl">📊</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-blue-800 mb-3 text-center">Personalized Feedback</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed text-center">Get detailed analysis of your communication style. Discover your love language and areas to grow!</p>
            </div>
            
            <div className="group bg-gradient-to-br from-teal-50 to-emerald-100 p-6 sm:p-8 rounded-2xl shadow-lg border-2 border-teal-200 hover:border-teal-400 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-bounce">
                  <span className="text-2xl sm:text-3xl">✨</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-teal-800 mb-3 text-center">Build Confidence</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed text-center">Grow your emotional awareness and learn to connect deeply. Become the partner everyone dreams of!</p>
            </div>

            <div className="group bg-gradient-to-br from-purple-50 to-pink-100 p-6 sm:p-8 rounded-2xl shadow-lg border-2 border-purple-200 hover:border-purple-400 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-bounce">
                  <span className="text-2xl sm:text-3xl">🎭</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-purple-800 mb-3 text-center">Multiple Personalities</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed text-center">Choose from 4 distinct archetypes: Caring Listener, Confident Teaser, Creative Dreamer, or Logical Realist.</p>
            </div>

            <div className="group bg-gradient-to-br from-amber-50 to-orange-100 p-6 sm:p-8 rounded-2xl shadow-lg border-2 border-amber-200 hover:border-amber-400 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-bounce">
                  <span className="text-2xl sm:text-3xl">💾</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-amber-800 mb-3 text-center">Session History</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed text-center">Continue conversations anytime. All your chats are saved and can be resumed just like ChatGPT!</p>
            </div>

            <div className="group bg-gradient-to-br from-cyan-50 to-blue-100 p-6 sm:p-8 rounded-2xl shadow-lg border-2 border-cyan-200 hover:border-cyan-400 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-bounce">
                  <span className="text-2xl sm:text-3xl">🌐</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-cyan-800 mb-3 text-center">Language Options</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed text-center">Practice in standard English or Banglish (Bengali + English mix) for a more authentic experience.</p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 sm:mt-20 grid grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            <div className="text-center bg-rose-50 rounded-xl p-4 sm:p-6">
              <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-rose-500">10K+</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">Conversations</p>
            </div>
            <div className="text-center bg-blue-50 rounded-xl p-4 sm:p-6">
              <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-500">95%</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">Improved Skills</p>
            </div>
            <div className="text-center bg-teal-50 rounded-xl p-4 sm:p-6">
              <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-teal-500">24/7</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">Always Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 sm:py-24 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">Get In Touch</h2>
            <p className="text-lg sm:text-xl text-gray-600">Have questions? We'd love to hear from you!</p>
            <div className="w-20 h-1 bg-rose-500 mx-auto mt-4 rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">Contact Information</h3>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl sm:text-2xl">📧</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Email</h4>
                    <a href="mailto:support@heartsense.ai" className="text-rose-600 hover:text-rose-700 text-sm sm:text-base">support@heartsense.ai</a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl sm:text-2xl">💬</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Live Chat</h4>
                    <p className="text-sm sm:text-base text-gray-600">Available 24/7 for instant support</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl sm:text-2xl">🌐</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Social Media</h4>
                    <div className="flex gap-3 mt-2">
                      <a href="#" className="text-gray-600 hover:text-rose-600 transition-colors">Twitter</a>
                      <span>•</span>
                      <a href="#" className="text-gray-600 hover:text-rose-600 transition-colors">LinkedIn</a>
                      <span>•</span>
                      <a href="#" className="text-gray-600 hover:text-rose-600 transition-colors">Instagram</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">Send us a Message</h3>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <HeartIcon className="w-8 h-8 text-rose-500" />
                <span className="text-xl font-bold text-white">HeartSense</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Master emotional intelligence and relationship communication with AI-powered practice.
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => scrollToSection('about')} className="hover:text-rose-500 transition-colors">About</button></li>
                <li><button onClick={() => scrollToSection('features')} className="hover:text-rose-500 transition-colors">Features</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-rose-500 transition-colors">Contact</button></li>
                <li><a href="#" className="hover:text-rose-500 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            
            {/* Resources */}
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-rose-500 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-rose-500 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-rose-500 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-rose-500 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            
            {/* Connect */}
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-rose-500 transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-rose-500 transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-rose-500 transition-colors">Instagram</a></li>
                <li><a href="https://github.com/showrin20/HeartSense" className="hover:text-rose-500 transition-colors">GitHub</a></li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
            <p className="text-gray-400">© 2025 HeartSense. All rights reserved.</p>
            <div className="flex items-center gap-4 text-gray-400">
              <span className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>100% Private</span>
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>AI Powered</span>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
import React from 'react';
import { HeartIcon } from './icons/HeartIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in max-w-5xl mx-auto">
        <HeartIcon className="w-20 h-20 md:w-24 md:h-24 text-rose-400 mb-6" />
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 tracking-tight">
            Welcome to HeartSense
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mt-4 max-w-2xl">
            Your personal AI partner, here to help you improve emotional intelligence and communication in a safe, judgment-free space.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full">
            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-rose-200/50 transform transition-transform hover:scale-105">
                <h3 className="text-xl font-semibold text-rose-800">Realistic Conversations</h3>
                <p className="text-gray-600 mt-2">Engage in natural, empathetic chats to practice real-world relationship dynamics.</p>
            </div>
            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-blue-200/50 transform transition-transform hover:scale-105">
                <h3 className="text-xl font-semibold text-blue-800">Personalized Feedback</h3>
                <p className="text-gray-600 mt-2">Receive a detailed analysis of your communication style after each session.</p>
            </div>
            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-teal-200/50 transform transition-transform hover:scale-105">
                <h3 className="text-xl font-semibold text-teal-800">Build Confidence</h3>
                <p className="text-gray-600 mt-2">Grow your emotional awareness and learn to connect more deeply with others.</p>
            </div>
        </div>

        <button
            onClick={onStart}
            className="mt-12 inline-flex items-center gap-3 px-8 py-4 bg-rose-500 text-white font-bold text-lg rounded-full shadow-xl hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 transition-transform transform hover:scale-105"
        >
            Customize Your Partner
            <ArrowRightIcon className="w-6 h-6" />
        </button>
    </div>
  );
};
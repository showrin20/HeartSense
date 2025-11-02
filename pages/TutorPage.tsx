import React from 'react';
import type { Analysis, Language } from '../types';
import { RefreshIcon } from '../components/icons/RefreshIcon';
import { ShareIcon } from '../components/icons/ShareIcon';

interface TutorAnalysisProps {
    analysis: Analysis | null;
    onStartNew: () => void;
    language: Language;
}

const AnalysisCard: React.FC<{ analysis: Analysis; language: Language }> = ({ analysis, language }) => {
    
    const handleShare = () => {
        alert("To share, please take a screenshot of this report card!");
        console.log("Share button clicked! Implement screenshot or Web Share API.");
    };

    const isBanglish = language === 'banglish';

    return (
        <div id="report-card" className="bg-gradient-to-br from-rose-50 via-white to-teal-50 p-6 md:p-8 rounded-2xl shadow-2xl border-4 border-rose-300 w-full">
            <div className="text-center pb-4 border-b-2 border-dashed border-rose-300">
                <h2 className={`text-3xl font-bold text-rose-500 ${isBanglish ? 'font-bengali' : ''}`}>
                    {isBanglish ? 'ভালোবাসার রিপোর্ট কার্ড' : 'Your Tutor Report'}
                </h2>
                <p className="text-lg text-gray-600">
                    {isBanglish ? 'Your Love Report Card' : 'An analysis of your conversation.'}
                </p>
            </div>

            <div className="my-6 text-center">
                <p className="text-gray-500 font-semibold">Your Love Score:</p>
                <p className="text-7xl font-bold text-rose-600 my-2">{analysis.score}<span className="text-4xl text-rose-400">/100</span></p>
            </div>

            <div className="space-y-6">
                <div className="bg-white/80 p-4 rounded-lg shadow-md border border-gray-200">
                    <h3 className={`font-bold text-teal-700 text-lg ${isBanglish ? 'font-bengali' : ''}`}>
                        {isBanglish ? 'তোমার লাভার পার্সোনালিটি:' : 'Your Lover Personality:'}
                    </h3>
                    <p className={`text-2xl font-bold text-gray-800 mt-1 ${isBanglish ? 'font-bengali' : ''}`}>{analysis.personality}</p>
                </div>
                
                <div className="bg-white/80 p-4 rounded-lg shadow-md border border-gray-200">
                    <h3 className={`font-bold text-teal-700 text-lg ${isBanglish ? 'font-bengali' : ''}`}>
                        {isBanglish ? 'তোমার জন্য পারফেক্ট পার্টনার:' : 'Your Ideal Partner:'}
                    </h3>
                    <p className="text-gray-700 mt-1">{analysis.idealPartner}</p>
                </div>

                <div className="bg-white/80 p-4 rounded-lg shadow-md border border-gray-200">
                    <h3 className={`font-bold text-teal-700 text-lg ${isBanglish ? 'font-bengali' : ''}`}>
                        {isBanglish ? 'তোমার জন্য কিছু টিপস:' : 'Growth Tips:'}
                    </h3>
                    <ul className="space-y-2 mt-2">
                        {analysis.tips.map((tip, index) => (
                            <li key={index} className="flex items-start gap-2">
                                <span className="text-rose-500 mt-1">&#10004;</span>
                                <span className="text-gray-700">{tip}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            
            {isBanglish && (
                <div className="mt-8 text-center">
                    <button
                        onClick={handleShare}
                        className="inline-flex items-center gap-2 px-6 py-2 bg-teal-500 text-white font-semibold rounded-full shadow-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 transition-transform transform hover:scale-105"
                    >
                        <ShareIcon className="w-5 h-5" />
                        Share on Social Media
                    </button>
                </div>
            )}
        </div>
    );
};

export const TutorPage: React.FC<TutorAnalysisProps> = ({ analysis, onStartNew, language }) => {
    if (!analysis) {
        return (
            <div className="text-center p-8">
                <p>Loading analysis...</p>
            </div>
        );
    }

    return (
        <div className="max-w-xl w-full mx-auto animate-fade-in">
            <AnalysisCard analysis={analysis} language={language} />
            <div className="mt-8 text-center">
                <button
                    onClick={onStartNew}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-rose-500 text-white font-semibold rounded-full shadow-lg hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 transition-transform transform hover:scale-105"
                >
                    <RefreshIcon className="w-5 h-5" />
                    Start New Conversation
                </button>
            </div>
        </div>
    );
};

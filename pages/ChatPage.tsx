import React, { useState, useRef, useEffect } from 'react';
import type { Message, ChatSession } from '../types';
import { SendIcon } from '../components/icons/SendIcon';
import { UserIcon } from '../components/icons/UserIcon';
import { HeartIcon } from '../components/icons/HeartIcon';

interface ChatInterfaceProps {
    messages: Message[];
    isLoading: boolean;
    onSendMessage: (input: string) => void;
    onBackToSessions?: () => void;
    isResumedSession?: boolean;
    resumedSessionData?: ChatSession | null;
    onDismissResumeIndicator?: () => void;
}

export const ChatPage: React.FC<ChatInterfaceProps> = ({
    messages,
    isLoading,
    onSendMessage,
    onBackToSessions,
    isResumedSession = false,
    resumedSessionData = null,
    onDismissResumeIndicator
}) => {
    const [input, setInput] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSendMessage(input);
        setInput('');
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getArchetypeEmoji = (archetype: string) => {
        const emojiMap: { [key: string]: string } = {
            'Caring Listener': '🤗',
            'Confident Teaser': '😏',
            'Creative Dreamer': '✨',
            'Logical Realist': '🧠',
        };
        return emojiMap[archetype] || '💝';
    };

    if (!messages.length) {
        return null; // Don't render if messages are not yet loaded
    }

    return (
        <div className="flex flex-col h-full w-full max-w-3xl mx-auto bg-white/50 rounded-xl sm:rounded-2xl shadow-lg backdrop-blur-lg overflow-hidden border border-rose-200/50">
            {/* Header with back button */}
            {onBackToSessions && (
                <div className="p-2 sm:p-3 border-b border-rose-200/50 bg-white/60 flex items-center gap-2">
                    <button
                        onClick={onBackToSessions}
                        className="flex items-center gap-1 sm:gap-2 px-2 py-1.5 sm:px-3 sm:py-2 text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-xs sm:text-sm font-medium">All Sessions</span>
                    </button>
                </div>
            )}

            {/* Resume Indicator Banner */}
            {isResumedSession && resumedSessionData && (
                <div className="mx-2 sm:mx-4 mt-2 sm:mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm animate-fade-in">
                    <div className="flex items-start justify-between gap-2 sm:gap-3">
                        <div className="flex-1">
                            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-xs sm:text-sm font-semibold text-blue-900">Continuing from previous session</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-blue-700">
                                {resumedSessionData.personality?.archetype && (
                                    <span className="flex items-center gap-1">
                                        <span>{getArchetypeEmoji(resumedSessionData.personality.archetype)}</span>
                                        <span className="hidden sm:inline">{resumedSessionData.personality.archetype}</span>
                                    </span>
                                )}
                                <span className="hidden sm:inline">•</span>
                                <span>💬 {resumedSessionData.message_count} msg</span>
                                {resumedSessionData.last_message_at && (
                                    <>
                                        <span className="hidden sm:inline">•</span>
                                        <span className="hidden md:inline">Last: {formatDate(resumedSessionData.last_message_at)}</span>
                                    </>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={onDismissResumeIndicator}
                            className="p-1 text-blue-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors flex-shrink-0"
                            title="Dismiss"
                        >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
            
            <div className="flex-grow p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 overflow-y-auto">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 sm:gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'model' && (
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-rose-500 flex items-center justify-center flex-shrink-0">
                                <HeartIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                        )}
                        <div className={`max-w-[75%] sm:max-w-xs md:max-w-md lg:max-w-lg px-3 py-2 sm:px-4 sm:py-3 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                           <p className="text-sm sm:text-base break-words">{msg.text}</p>
                        </div>
                         {msg.role === 'user' && (
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                                <UserIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                        )}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-end gap-2 sm:gap-3 justify-start">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-rose-500 flex items-center justify-center flex-shrink-0">
                             <HeartIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="max-w-[75%] sm:max-w-xs md:max-w-md lg:max-w-lg px-3 py-2 sm:px-4 sm:py-3 rounded-2xl shadow-sm bg-gray-100 text-gray-800 rounded-bl-none">
                            <div className="flex items-center space-x-1">
                                <span className="w-2 h-2 bg-rose-400 rounded-full animate-pulse delay-75"></span>
                                <span className="w-2 h-2 bg-rose-400 rounded-full animate-pulse delay-150"></span>
                                <span className="w-2 h-2 bg-rose-400 rounded-full animate-pulse delay-300"></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>
            <div className="p-3 sm:p-4 bg-white/60 border-t border-rose-200/50">
                <p className="text-center text-[10px] sm:text-xs text-gray-400 mb-2">
                    Type "end session" or "review my score" to get your analysis.
                </p>
                <form onSubmit={handleSubmit} className="flex items-center gap-2 sm:gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-grow w-full px-3 py-2 sm:px-4 text-sm sm:text-base bg-gray-100 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-rose-400 transition"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="bg-rose-500 text-white rounded-full p-2.5 sm:p-3 hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 disabled:bg-rose-300 disabled:cursor-not-allowed transition-all transform hover:scale-105 flex-shrink-0"
                    >
                        <SendIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};
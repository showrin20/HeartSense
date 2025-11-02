import React, { useState, useRef, useEffect } from 'react';
import type { Message } from '../types';
import { SendIcon } from '../components/icons/SendIcon';
import { UserIcon } from '../components/icons/UserIcon';
import { HeartIcon } from '../components/icons/HeartIcon';

interface ChatInterfaceProps {
    messages: Message[];
    isLoading: boolean;
    onSendMessage: (input: string) => void;
    onBackToSessions?: () => void;
}

export const ChatPage: React.FC<ChatInterfaceProps> = ({ 
    messages, 
    isLoading, 
    onSendMessage,
    onBackToSessions 
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
    
    if (!messages.length) {
        return null; // Don't render if messages are not yet loaded
    }

    return (
        <div className="flex flex-col h-full max-w-3xl mx-auto w-full bg-white/50 rounded-2xl shadow-lg backdrop-blur-lg overflow-hidden border border-rose-200/50">
            {/* Header with back button */}
            {onBackToSessions && (
                <div className="p-3 border-b border-rose-200/50 bg-white/60 flex items-center gap-2">
                    <button
                        onClick={onBackToSessions}
                        className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-sm font-medium">All Sessions</span>
                    </button>
                </div>
            )}
            
            <div className="flex-grow p-4 md:p-6 space-y-4 overflow-y-auto">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'model' && (
                            <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center flex-shrink-0">
                                <HeartIcon className="w-6 h-6 text-white" />
                            </div>
                        )}
                        <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                           <p className="text-base">{msg.text}</p>
                        </div>
                         {msg.role === 'user' && (
                            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                                <UserIcon className="w-6 h-6 text-white" />
                            </div>
                        )}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-end gap-3 justify-start">
                        <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center flex-shrink-0">
                             <HeartIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl shadow-sm bg-gray-100 text-gray-800 rounded-bl-none">
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
            <div className="p-4 bg-white/60 border-t border-rose-200/50">
                <p className="text-center text-xs text-gray-400 mb-2">
                    Type "end session" or "review my score" to get your analysis.
                </p>
                <form onSubmit={handleSubmit} className="flex items-center gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-grow w-full px-4 py-2 bg-gray-100 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-rose-400 transition"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="bg-rose-500 text-white rounded-full p-3 hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 disabled:bg-rose-300 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                    >
                        <SendIcon className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};
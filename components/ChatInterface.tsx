import React, { useState, useRef, useEffect } from 'react';
import type { Message, PartnerPersonality, Language } from '../types';
import { SendIcon } from './icons/SendIcon';
import { VolumeIcon, CopyIcon, CheckIcon, KeyIcon } from './icons/UtilityIcons';
import { speakMessage, playSound } from '../services/audioService';

interface ChatInterfaceProps {
    messages: Message[];
    isLoading: boolean;
    onSendMessage: (input: string) => void;
    onEndSession?: () => void;
    onOpenApiKeyModal?: () => void;
    personality?: PartnerPersonality | null;
    language?: Language;
    soundEnabled?: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
    messages,
    isLoading,
    onSendMessage,
    onEndSession,
    onOpenApiKeyModal,
    personality,
    language = 'banglish',
    soundEnabled = true
}) => {
    const [input, setInput] = useState('');
    const [autoSpeak, setAutoSpeak] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const lastSpokenRef = useRef<number>(-1);

    const partnerName = personality?.partnerName || 'HeartSense';
    const partnerAvatar = (() => {
        if (personality?.avatar) return personality.avatar;
        const lower = (personality?.archetype || '').toLowerCase();
        if (lower.includes('boyfriend')) return '/characters/boyfriend.png';
        if (lower.includes('poetic') || lower.includes('dreamy')) return '/characters/dreamy.png';
        return '/characters/girlfriend.png';
    })();

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    useEffect(() => {
        if (!autoSpeak) return;
        const lastMsgIndex = messages.length - 1;
        if (lastMsgIndex >= 0 && lastMsgIndex !== lastSpokenRef.current) {
            const lastMsg = messages[lastMsgIndex];
            if (lastMsg.role === 'model') {
                lastSpokenRef.current = lastMsgIndex;
                speakMessage(lastMsg.text, language);
            }
        }
    }, [messages, autoSpeak, language]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        if (soundEnabled) playSound('send');
        onSendMessage(input.trim());
        setInput('');
    };

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 1800);
    };

    const handleQuickPrompt = (promptText: string) => {
        if (isLoading) return;
        if (soundEnabled) playSound('send');
        onSendMessage(promptText);
    };

    const quickStarters = language === 'banglish' ? [
        "Ki korcho? Missing you.",
        "Ajke onek busy chilam, kintu tomar kotha mone porse.",
        "Ami ki kono bhul korechi? Tumi eto chup keno?",
        "Tumi shotti onek cute jano?"
    ] : [
        "Hey, how was your day?",
        "I was thinking about our conversation earlier.",
        "Are you upset with me? You seem a bit distant.",
        "Just wanted to say I really appreciate you."
    ];

    return (
        <div className="flex flex-col h-[82vh] max-w-3xl mx-auto w-full bg-surface rounded-2xl shadow-[0_20px_50px_-24px_rgba(26,21,23,0.12)] overflow-hidden border border-hairline my-3">
            {/* Chat Header */}
            <div className="px-5 py-3.5 bg-surface border-b border-hairline flex items-center justify-between flex-shrink-0 gap-3">
                {/* Partner Identity */}
                <div className="flex items-center gap-3 min-w-0">
                    <div className="relative flex-shrink-0">
                        <img
                            src={partnerAvatar}
                            alt={partnerName}
                            className="w-10 h-10 rounded-xl object-cover border border-hairline"
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-sage-600 border-2 border-surface rounded-full" />
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className="font-display font-semibold text-ink text-base truncate">{partnerName}</h3>
                            <span className="hidden sm:inline-block font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-paper border border-hairline text-muted truncate">
                                {personality?.archetype || 'Partner'}
                            </span>
                        </div>
                        <p className="text-[11px] text-muted">
                            Online &middot; {language === 'banglish' ? 'Banglish' : 'English'} &middot; Private session
                        </p>
                    </div>
                </div>

                {/* Top Controls */}
                <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                    <button
                        type="button"
                        onClick={() => setAutoSpeak(!autoSpeak)}
                        title={autoSpeak ? "Disable voice read-aloud" : "Enable voice read-aloud"}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center gap-1.5 ${
                            autoSpeak
                                ? 'bg-ink text-paper border-ink'
                                : 'bg-paper text-muted border-hairline hover:text-ink'
                        }`}
                    >
                        <VolumeIcon muted={!autoSpeak} className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{autoSpeak ? 'Voice On' : 'Voice'}</span>
                    </button>

                    {/* BYOK API Key Settings button hidden for now
                    {onOpenApiKeyModal && (
                        <button
                            type="button"
                            onClick={onOpenApiKeyModal}
                            title="BYOK API Key Settings"
                            className="p-2 bg-paper hover:bg-hairline/50 text-muted hover:text-ink border border-hairline rounded-lg transition"
                        >
                            <KeyIcon className="w-3.5 h-3.5" />
                        </button>
                    )}
                    */}

                    {onEndSession && (
                        <button
                            type="button"
                            onClick={onEndSession}
                            disabled={isLoading}
                            className="px-3.5 py-1.5 bg-crimson-500 hover:bg-crimson-600 text-white rounded-lg text-xs font-semibold transition disabled:opacity-50"
                        >
                            End &amp; Score
                        </button>
                    )}
                </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-grow p-4 sm:p-6 space-y-4 overflow-y-auto bg-paper/35">
                {messages.map((msg, index) => {
                    const isUser = msg.role === 'user';
                    return (
                        <div
                            key={index}
                            className={`flex items-end gap-2.5 ${isUser ? 'justify-end' : 'justify-start'} group animate-fade-in`}
                        >
                            {!isUser && (
                                <img
                                    src={partnerAvatar}
                                    alt={partnerName}
                                    className="w-8 h-8 rounded-lg object-cover border border-hairline flex-shrink-0 mb-5"
                                />
                            )}

                            <div className="relative max-w-[82%] sm:max-w-md lg:max-w-lg">
                                <div
                                    className={`px-4 py-3 rounded-2xl text-sm sm:text-[15px] leading-relaxed ${
                                        isUser
                                            ? 'bg-ink text-paper rounded-br-sm'
                                            : 'bg-surface text-ink rounded-bl-sm border border-hairline shadow-2xs'
                                    }`}
                                >
                                    <p className="whitespace-pre-wrap">{msg.text}</p>
                                </div>

                                <div className={`flex items-center gap-2.5 mt-1 px-1 text-[10px] text-muted/80 ${isUser ? 'justify-end' : 'justify-start'}`}>
                                    <span>{msg.timestamp || 'Just now'}</span>
                                    <button
                                        onClick={() => handleCopy(msg.text, index)}
                                        className="opacity-60 hover:opacity-100 transition"
                                        title="Copy message"
                                    >
                                        {copiedIndex === index ? <CheckIcon className="w-3 h-3 text-sage-600" /> : <CopyIcon className="w-3 h-3" />}
                                    </button>
                                    {!isUser && (
                                        <button
                                            onClick={() => speakMessage(msg.text, language)}
                                            className="opacity-60 hover:opacity-100 hover:text-crimson-600 transition"
                                            title="Listen aloud"
                                        >
                                            <VolumeIcon className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {isLoading && (
                    <div className="flex items-end gap-2.5 justify-start animate-fade-in">
                        <img
                            src={partnerAvatar}
                            alt={partnerName}
                            className="w-8 h-8 rounded-lg object-cover border border-hairline flex-shrink-0"
                        />
                        <div className="px-4 py-3 rounded-2xl bg-surface border border-hairline rounded-bl-sm">
                            <div className="flex items-center space-x-1.5">
                                <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Composer Area */}
            <div className="p-3.5 sm:p-4 bg-surface border-t border-hairline flex-shrink-0 space-y-2.5">
                {messages.length <= 4 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-muted whitespace-nowrap">Try:</span>
                        {quickStarters.map((starter, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => handleQuickPrompt(starter)}
                                disabled={isLoading}
                                className="px-3 py-1 bg-paper hover:bg-hairline/60 text-ink font-medium rounded-full whitespace-nowrap border border-hairline transition"
                            >
                                {starter}
                            </button>
                        ))}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex items-center gap-2.5">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={`Message ${partnerName}... (or type "end session" for your report)`}
                        className="flex-grow w-full px-4 py-3 bg-paper/60 border border-hairline rounded-xl text-sm text-ink placeholder:text-muted/70 focus:outline-none focus:border-ink focus:bg-surface transition"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="bg-ink hover:bg-crimson-600 text-paper rounded-xl p-3 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                        aria-label="Send message"
                    >
                        <SendIcon className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};

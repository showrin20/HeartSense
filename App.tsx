import React, { useState, useEffect } from 'react';
import type { Message, Analysis, View, PartnerPersonality, Language } from './types';
import { initializePartnerChat, getPartnerResponse, getTutorAnalysis } from './services/geminiService';
import { Header } from './components/Header';
import { ChatInterface } from './components/ChatInterface';
import { TutorAnalysis } from './components/TutorAnalysis';
import { LandingPage } from './components/LandingPage';
import { PartnerSetup } from './components/PartnerSetup';
import { ApiKeyModal } from './components/ApiKeyModal';
import { playSound } from './services/audioService';

export default function App() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [view, setView] = useState<View>('landing');
    const [analysis, setAnalysis] = useState<Analysis | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [language, setLanguage] = useState<Language>('banglish');
    const [currentPersonality, setCurrentPersonality] = useState<PartnerPersonality | null>(null);
    const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
    const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
    const [refreshTick, setRefreshTick] = useState<number>(0);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedSound = localStorage.getItem('heartsense_sound');
            if (savedSound !== null) {
                setSoundEnabled(savedSound === 'true');
            }
        }
    }, []);

    const toggleSound = () => {
        const next = !soundEnabled;
        setSoundEnabled(next);
        if (typeof window !== 'undefined') {
            localStorage.setItem('heartsense_sound', String(next));
        }
        if (next) playSound('pop');
    };

    const formatTimestamp = () => {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const triggerTutorAnalysis = async (chatHistory: Message[]) => {
        setIsLoading(true);
        try {
            const analysisResult = await getTutorAnalysis(chatHistory, language);
            setAnalysis(analysisResult);
            setView('tutor');
        } catch (error) {
            console.error("Failed to get tutor analysis:", error);
            const errorMessage: Message = { 
                role: 'model', 
                text: "Sorry, I had trouble analyzing our chat. Let's try starting a new session.",
                timestamp: formatTimestamp()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUserInput = async (userInput: string) => {
        if (!userInput.trim()) return;

        const timestamp = formatTimestamp();
        const userMessage: Message = { role: 'user', text: userInput, timestamp };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setIsLoading(true);

        const endSessionTriggers = ["end session", "review my score", "end", "get score", "review score"];
        if (endSessionTriggers.includes(userInput.trim().toLowerCase())) {
            await triggerTutorAnalysis(newMessages);
        } else {
            try {
                const partnerResponse = await getPartnerResponse(userInput);
                const modelMessage: Message = { 
                    role: 'model', 
                    text: partnerResponse,
                    timestamp: formatTimestamp()
                };
                setMessages(prev => [...prev, modelMessage]);
                if (soundEnabled) playSound('receive');
            } catch (error: unknown) {
                console.error("Failed to get partner response:", error);
                const errorMessage: Message = { 
                    role: 'model', 
                    text: "I'm having a little trouble connecting right now. Can you give me a moment?",
                    timestamp: formatTimestamp()
                };
                setMessages(prev => [...prev, errorMessage]);
            } finally {
                setIsLoading(false);
            }
        }
    };
    
    const handleStartSetup = () => {
        if (soundEnabled) playSound('pop');
        setView('partner-setup');
    };

    const handleFinishSetup = (personality: PartnerPersonality, lang: Language) => {
        if (soundEnabled) playSound('pop');
        setLanguage(lang);
        setCurrentPersonality(personality);
        initializePartnerChat(personality, lang);

        // Customize greeting depending on scenario
        let starterText = "";
        if (personality.scenario === 'conflict') {
            starterText = lang === 'banglish'
                ? "Tumi abar late korla... Amar kothar ki kono value nai tomar kache?"
                : "We were supposed to talk an hour ago. You're always busy lately...";
        } else if (personality.scenario === 'flirt') {
            starterText = lang === 'banglish'
                ? "Bolo to, ajke shara din kar kotha mone porse tomar? Shotti bolba ekdom! 😉"
                : "Guess who couldn't stop smiling thinking about you today? 😉";
        } else {
            starterText = lang === 'banglish' 
                ? "Hey, ki korcho? I've been thinking about you."
                : "Hey, what are you up to? I've been thinking about you.";
        }

        const initialMessage: Message = {
            role: 'model',
            text: starterText,
            timestamp: formatTimestamp()
        };
        setMessages([initialMessage]);
        setView('chatting');
        if (soundEnabled) playSound('receive');
    };

    const handleStartNewSession = () => {
        if (soundEnabled) playSound('pop');
        setMessages([]);
        setView('partner-setup');
        setAnalysis(null);
    };

    const handleGoHome = () => {
        if (soundEnabled) playSound('pop');
        setView('landing');
    };

    const handleEndSessionDirectly = () => {
        if (messages.length > 0) {
            triggerTutorAnalysis(messages);
        }
    };

    const renderContent = () => {
        switch (view) {
            case 'landing':
                return (
                    <LandingPage 
                        onStart={handleStartSetup}
                        onOpenApiKey={() => setIsApiKeyModalOpen(true)}
                    />
                );
            case 'partner-setup':
                return (
                    <PartnerSetup 
                        onFinishSetup={handleFinishSetup}
                        onBack={handleGoHome}
                    />
                );
            case 'chatting':
                return (
                    <ChatInterface
                        messages={messages}
                        isLoading={isLoading}
                        onSendMessage={handleUserInput}
                        onEndSession={handleEndSessionDirectly}
                        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
                        personality={currentPersonality}
                        language={language}
                        soundEnabled={soundEnabled}
                    />
                );
            case 'tutor':
                return (
                    <TutorAnalysis
                        analysis={analysis}
                        onStartNew={handleStartNewSession}
                        language={language}
                    />
                );
            default:
                return (
                    <LandingPage 
                        onStart={handleStartSetup} 
                        onOpenApiKey={() => setIsApiKeyModalOpen(true)}
                    />
                );
        }
    };

    return (
        <div className="bg-paper min-h-screen text-ink flex flex-col font-sans selection:bg-crimson-500 selection:text-white">
            <Header 
                onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
                soundEnabled={soundEnabled}
                onToggleSound={toggleSound}
                onGoHome={handleGoHome}
                refreshTick={refreshTick}
            />

            <main className="flex-grow flex flex-col justify-center items-center p-3 md:p-6 lg:p-8">
                {renderContent()}
            </main>

            {/* BYOK API Key Modal hidden for now
            <ApiKeyModal
                isOpen={isApiKeyModalOpen}
                onClose={() => {
                    setIsApiKeyModalOpen(false);
                    setRefreshTick(t => t + 1);
                }}
                onKeySaved={() => {
                    setRefreshTick(t => t + 1);
                    if (currentPersonality) {
                        initializePartnerChat(currentPersonality, language);
                    }
                }}
            />
            */}
        </div>
    );
}

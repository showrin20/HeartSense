import React, { useState } from 'react';
import type { Message, Analysis, View, PartnerPersonality, Language } from './types';
import { initializePartnerChat, getPartnerResponse, getTutorAnalysis } from './services/geminiService';
import { Header } from './components/Header';
import { ChatInterface } from './components/ChatInterface';
import { TutorAnalysis } from './components/TutorAnalysis';
import { LandingPage } from './components/LandingPage';
import { PartnerSetup } from './components/PartnerSetup';

export default function App() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [view, setView] = useState<View>('landing');
    const [analysis, setAnalysis] = useState<Analysis | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [language, setLanguage] = useState<Language>('banglish');

    const handleUserInput = async (userInput: string) => {
        if (!userInput.trim()) return;

        const userMessage: Message = { role: 'user', text: userInput };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setIsLoading(true);

        const endSessionTriggers = ["end session", "review my score"];
        if (endSessionTriggers.includes(userInput.trim().toLowerCase())) {
            try {
                const analysisResult = await getTutorAnalysis(newMessages, language);
                setAnalysis(analysisResult);
                setView('tutor');
            } catch (error) {
                console.error("Failed to get tutor analysis:", error);
                const errorMessage: Message = { role: 'model', text: "Sorry, I had trouble analyzing our chat. Let's try starting a new session." };
                setMessages(prev => [...prev, errorMessage]);
            }
        } else {
            try {
                const partnerResponse = await getPartnerResponse(userInput);
                const modelMessage: Message = { role: 'model', text: partnerResponse };
                setMessages(prev => [...prev, modelMessage]);
            } catch (error) {
                console.error("Failed to get partner response:", error);
                const errorMessage: Message = { role: 'model', text: "I'm having a little trouble connecting right now. Can you give me a moment?" };
                setMessages(prev => [...prev, errorMessage]);
            }
        }
        setIsLoading(false);
    };
    
    const handleStartSetup = () => {
        setView('partner-setup');
    };

    const handleFinishSetup = (personality: PartnerPersonality, lang: Language) => {
        setLanguage(lang);
        initializePartnerChat(personality, lang);
        const initialMessage: Message = {
            role: 'model',
            text: lang === 'banglish' 
                ? "Hey, ki korcho? I've been thinking about you."
                : "Hey, what are you up to? I've been thinking about you.",
        };
        setMessages([initialMessage]);
        setView('chatting');
    }

    const handleStartNewSession = () => {
        setMessages([]);
        setView('partner-setup');
        setAnalysis(null);
    };

    const renderContent = () => {
        switch (view) {
            case 'landing':
                return <LandingPage onStart={handleStartSetup} />;
            case 'partner-setup':
                return <PartnerSetup onFinishSetup={handleFinishSetup} />;
            case 'chatting':
                return (
                    <ChatInterface
                        messages={messages}
                        isLoading={isLoading}
                        onSendMessage={handleUserInput}
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
                return <LandingPage onStart={handleStartSetup} />;
        }
    }

    return (
        <div className="bg-gradient-to-br from-rose-50 to-blue-100 min-h-screen text-gray-800 flex flex-col">
            {view !== 'landing' && view !== 'partner-setup' && <Header />}
            <main className="flex-grow flex flex-col justify-center items-center p-4 md:p-6 lg:p-8">
                {renderContent()}
            </main>
        </div>
    );
}

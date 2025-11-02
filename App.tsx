import React, { useState, useEffect } from 'react';
import type { Message, Analysis, View, PartnerPersonality, Language, User, SignUpData, SignInData } from './types';
import { initializePartnerChat, getPartnerResponse, getTutorAnalysis } from './services/geminiService';
import { signUp, signIn, signOut, isAuthenticated, getUser } from './services/authService';
import { Navbar } from './components/Navbar';
import { Header } from './components/Header';
import { ChatInterface } from './components/ChatInterface';
import { TutorAnalysis } from './components/TutorAnalysis';
import { LandingPage } from './components/LandingPage';
import { PartnerSetup } from './components/PartnerSetup';
import { AuthPage } from './components/AuthPage';
import { SessionsPage } from './components/SessionsPage';

export default function App() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [view, setView] = useState<View>('landing');
    const [analysis, setAnalysis] = useState<Analysis | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [language, setLanguage] = useState<Language>('banglish');
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [sessionId, setSessionId] = useState<string>('');

    // Check authentication on mount
    useEffect(() => {
        if (isAuthenticated()) {
            const user = getUser();
            setCurrentUser(user);
        }
    }, []);

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
                const partnerResponse = await getPartnerResponse(userInput, sessionId);
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

    const handleFinishSetup = async (personality: PartnerPersonality, lang: Language) => {
        setLanguage(lang);
        setIsLoading(true);
        
        try {
            const newSessionId = await initializePartnerChat(personality, lang);
            setSessionId(newSessionId);
            
            const initialMessage: Message = {
                role: 'model',
                text: lang === 'banglish' 
                    ? "Hey, ki korcho? I've been thinking about you."
                    : "Hey, what are you up to? I've been thinking about you.",
            };
            setMessages([initialMessage]);
            setView('chatting');
        } catch (error) {
            console.error("Failed to initialize chat:", error);
            alert("Failed to start chat session. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    const handleStartNewSession = () => {
        setMessages([]);
        setView('partner-setup');
        setAnalysis(null);
    };

    const handleNavigate = (section: string) => {
        if (section === 'home') {
            setView('landing');
            setMessages([]);
            setAnalysis(null);
        } else if (section === 'start') {
            if (!isAuthenticated()) {
                setView('auth');
            } else {
                handleStartSetup();
            }
        } else if (section === 'sessions') {
            if (isAuthenticated()) {
                setView('sessions');
            } else {
                setView('auth');
            }
        }
        // Add more navigation handlers as needed
    };

    const handleSignUp = async (data: SignUpData) => {
        try {
            const response = await signUp(data);
            setCurrentUser(response.user);
            setView('partner-setup');
        } catch (error) {
            throw error;
        }
    };

    const handleSignIn = async (data: SignInData) => {
        try {
            const response = await signIn(data);
            setCurrentUser(response.user);
            setView('sessions');
        } catch (error) {
            throw error;
        }
    };

    const handleSignOut = async () => {
        await signOut();
        setCurrentUser(null);
        setMessages([]);
        setAnalysis(null);
        setSessionId('');
        setView('landing');
    };

    const handleSelectSession = (selectedSessionId: string) => {
        setSessionId(selectedSessionId);
        // Load session messages if needed
        setView('chatting');
    };

    const renderContent = () => {
        switch (view) {
            case 'landing':
                return <LandingPage onStart={handleStartSetup} />;
            case 'auth':
                return <AuthPage onSignIn={handleSignIn} onSignUp={handleSignUp} />;
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
            case 'sessions':
                return (
                    <SessionsPage
                        onSelectSession={handleSelectSession}
                        onStartNewSession={handleStartSetup}
                    />
                );
            default:
                return <LandingPage onStart={handleStartSetup} />;
        }
    }

    return (
        <div className="bg-gradient-to-br from-rose-50 to-blue-100 min-h-screen text-gray-800 flex flex-col">
            <Navbar 
                onNavigate={handleNavigate} 
                currentView={view}
                currentUser={currentUser}
                onSignOut={handleSignOut}
            />
            {view !== 'landing' && view !== 'partner-setup' && view !== 'auth' && view !== 'sessions' && <Header />}
            <main className="flex-grow flex flex-col justify-center items-center p-4 md:p-6 lg:p-8">
                {renderContent()}
            </main>
        </div>
    );
}

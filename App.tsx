import React, { useState, useEffect } from 'react';
import type { Message, Analysis, View, PartnerPersonality, Language, User, SignUpData, SignInData, ChatSession } from './types';
import { initializePartnerChat, getPartnerResponse, getTutorAnalysis } from './services/geminiService';
import { signUp, signIn, signOut, isAuthenticated, getUser } from './services/authService';
import { Navbar } from './components/Navbar';
import { Header } from './components/Header';
import { PartnerSetup } from './components/PartnerSetup';
import { ChatPage } from './pages/ChatPage';
import { TutorPage } from './pages/TutorPage';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { SessionsPage } from './pages/SessionsPage';
import { AlertModal } from './components/Modal';

export default function App() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [view, setView] = useState<View>('landing');
    const [analysis, setAnalysis] = useState<Analysis | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [language, setLanguage] = useState<Language>('banglish');
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [sessionId, setSessionId] = useState<string>('');
    const [isResumedSession, setIsResumedSession] = useState<boolean>(false);
    const [resumedSessionData, setResumedSessionData] = useState<ChatSession | null>(null);
    const [errorModal, setErrorModal] = useState<{ isOpen: boolean; message: string; title: string }>({
        isOpen: false,
        message: '',
        title: 'Error'
    });

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
            setErrorModal({
                isOpen: true,
                title: 'Session Error',
                message: 'Failed to start chat session. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    }

    const handleStartNewSession = () => {
        setMessages([]);
        setView('partner-setup');
        setAnalysis(null);
        setIsResumedSession(false);
        setResumedSessionData(null);
    };

    const handleNavigate = (section: string) => {
        if (section === 'home') {
            setView('landing');
            setMessages([]);
            setAnalysis(null);
            setIsResumedSession(false);
            setResumedSessionData(null);
        } else if (section === 'about' || section === 'features' || section === 'contact') {
            // If not on landing page, navigate to landing first, then scroll
            if (view !== 'landing') {
                setView('landing');
                setMessages([]);
                setAnalysis(null);
                setIsResumedSession(false);
                setResumedSessionData(null);
                // Wait for view to change, then scroll
                setTimeout(() => {
                    const element = document.getElementById(section);
                    element?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
            // If already on landing, the Navbar will handle the scroll
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

    const handleSelectSession = async (selectedSessionId: string, session?: ChatSession) => {
        setIsLoading(true);
        try {
            setSessionId(selectedSessionId);

            // Set language and personality from session if available
            if (session?.language) {
                setLanguage(session.language);
            }

            // Load chat history
            const { loadChatHistory } = await import('./services/geminiService');
            const history = await loadChatHistory(selectedSessionId);

            // Set messages to the loaded history
            setMessages(history);

            // Mark as resumed session and store session data
            if (history.length > 0) {
                setIsResumedSession(true);
                setResumedSessionData(session || null);
            }

            // Navigate to chat view
            setView('chatting');
        } catch (error) {
            console.error('Failed to load session:', error);
            setErrorModal({
                isOpen: true,
                title: 'Session Error',
                message: 'Failed to load session. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const renderContent = () => {
        switch (view) {
            case 'landing':
                return (
                    <LandingPage 
                        onStart={handleStartSetup} 
                        isAuthenticated={isAuthenticated()}
                        onSignIn={() => setView('auth')}
                    />
                );
            case 'auth':
                return <AuthPage onSignIn={handleSignIn} onSignUp={handleSignUp} />;
            case 'partner-setup':
                return <PartnerSetup onFinishSetup={handleFinishSetup} />;
            case 'chatting':
                return (
                    <ChatPage
                        messages={messages}
                        isLoading={isLoading}
                        onSendMessage={handleUserInput}
                        onBackToSessions={() => setView('sessions')}
                        isResumedSession={isResumedSession}
                        resumedSessionData={resumedSessionData}
                        onDismissResumeIndicator={() => setIsResumedSession(false)}
                    />
                );
            case 'tutor':
                return (
                    <TutorPage
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
                        isLoadingSession={isLoading}
                        currentSessionId={sessionId}
                    />
                );
            default:
                return <LandingPage onStart={handleStartSetup} />;
        }
    }

    return (
        <div className="bg-gradient-to-br from-rose-50 to-blue-100 min-h-screen text-gray-800 flex flex-col">
            {/* Error Modal */}
            <AlertModal
                isOpen={errorModal.isOpen}
                onClose={() => setErrorModal({ isOpen: false, message: '', title: 'Error' })}
                title={errorModal.title}
                message={errorModal.message}
                type="error"
            />
            
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

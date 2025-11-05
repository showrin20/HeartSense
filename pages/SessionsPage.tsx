import React, { useEffect, useState } from 'react';
import { ChatSession } from '../types';
import { authenticatedFetch } from '../services/authService';
import { RefreshIcon } from '../components/icons/RefreshIcon';
import { ConfirmDeleteModal, AlertModal } from '../components/Modal';

interface SessionsPageProps {
  onSelectSession: (sessionId: string, session?: ChatSession) => void;
  onStartNewSession: () => void;
  isLoadingSession?: boolean;
  currentSessionId?: string;
}

export const SessionsPage: React.FC<SessionsPageProps> = ({ 
  onSelectSession, 
  onStartNewSession,
  isLoadingSession = false,
  currentSessionId
}) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; sessionId: string | null }>({ 
    isOpen: false, 
    sessionId: null 
  });
  const [errorModal, setErrorModal] = useState<{ isOpen: boolean; message: string }>({
    isOpen: false,
    message: ''
  });

  const loadSessions = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await authenticatedFetch('http://localhost:8000/api/user/sessions');
      
      if (!response.ok) {
        throw new Error('Failed to load sessions');
      }
      
      const data = await response.json();
      setSessions(data.sessions || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load sessions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteModal({ isOpen: true, sessionId });
  };

  const confirmDeleteSession = async () => {
    if (!deleteModal.sessionId) return;

    try {
      const response = await authenticatedFetch(
        `http://localhost:8000/api/user/sessions/${deleteModal.sessionId}`,
        { method: 'DELETE' }
      );
      
      if (!response.ok) {
        throw new Error('Failed to delete session');
      }
      
      // Remove from local state
      setSessions(sessions.filter(s => s.session_id !== deleteModal.sessionId));
      setDeleteModal({ isOpen: false, sessionId: null });
    } catch (err: any) {
      setErrorModal({ 
        isOpen: true, 
        message: err.message || 'Failed to delete session' 
      });
      setDeleteModal({ isOpen: false, sessionId: null });
    }
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

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
      {/* Modals */}
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, sessionId: null })}
        onConfirm={confirmDeleteSession}
        message="Are you sure you want to delete this conversation session? This action cannot be undone."
      />
      
      <AlertModal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ isOpen: false, message: '' })}
        title="Error"
        message={errorModal.message}
        type="error"
      />

      {/* Loading overlay */}
      {isLoadingSession && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col items-center gap-4 mx-4">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-rose-500"></div>
            <p className="text-base sm:text-lg font-medium text-gray-800 text-center">Loading your conversation...</p>
          </div>
        </div>
      )}
      
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border border-rose-200/50">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Your Sessions</h2>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              {sessions.length} conversation{sessions.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={loadSessions}
              className="p-2 sm:p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              title="Refresh"
            >
              <RefreshIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
            <button
              onClick={onStartNewSession}
              className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 text-sm sm:text-base"
            >
              <span className="hidden sm:inline">+ New Session</span>
              <span className="sm:hidden">+ New</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Sessions List */}
        {sessions.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="text-5xl sm:text-6xl mb-4">💭</div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
              No sessions yet
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6 px-4">
              Start your first conversation to practice emotional connection
            </p>
            <button
              onClick={onStartNewSession}
              className="px-6 py-2 sm:px-8 sm:py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 text-sm sm:text-base"
            >
              Start First Session
            </button>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {sessions.map((session) => (
              <div
                key={session.session_id}
                onClick={() => onSelectSession(session.session_id, session)}
                className={`p-4 sm:p-5 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border transition-all cursor-pointer ${
                  currentSessionId === session.session_id
                    ? 'border-rose-400 shadow-lg ring-2 ring-rose-300'
                    : 'border-rose-200 hover:border-rose-300 hover:shadow-md'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-xl sm:text-2xl">
                        {session.personality?.archetype 
                          ? getArchetypeEmoji(session.personality.archetype)
                          : '💝'}
                      </span>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                        {session.personality?.archetype || 'Unknown Partner'}
                      </h3>
                      <span className="px-2 py-1 bg-white/60 rounded-full text-xs font-medium text-gray-600">
                        {session.language === 'banglish' ? '🇧🇩 Banglish' : '🇬🇧 English'}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                      <span>💬 {session.message_count} messages</span>
                      <span>📅 {formatDate(session.created_at)}</span>
                      {session.last_message_at && (
                        <span className="hidden sm:inline">🕐 Last: {formatDate(session.last_message_at)}</span>
                      )}
                    </div>

                    {session.personality && (
                      <div className="mt-3 flex flex-wrap gap-2 sm:gap-3 text-xs">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Playful:</span>
                          <div className="w-12 sm:w-16 h-2 bg-white/60 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-rose-400"
                              style={{ width: `${session.personality.playful}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Talkative:</span>
                          <div className="w-12 sm:w-16 h-2 bg-white/60 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-rose-400"
                              style={{ width: `${session.personality.talkative}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Affectionate:</span>
                          <div className="w-12 sm:w-16 h-2 bg-white/60 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-rose-400"
                              style={{ width: `${session.personality.affectionate}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={(e) => handleDeleteSession(session.session_id, e)}
                    className="ml-0 sm:ml-4 self-end sm:self-start p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete session"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

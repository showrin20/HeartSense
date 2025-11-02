import React, { useEffect, useState } from 'react';
import { ChatSession } from '../types';
import { authenticatedFetch } from '../services/authService';
import { RefreshIcon } from './icons/RefreshIcon';

interface SessionsPageProps {
  onSelectSession: (sessionId: string) => void;
  onStartNewSession: () => void;
}

export const SessionsPage: React.FC<SessionsPageProps> = ({ onSelectSession, onStartNewSession }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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
    
    if (!confirm('Are you sure you want to delete this session?')) {
      return;
    }

    try {
      const response = await authenticatedFetch(
        `http://localhost:8000/api/user/sessions/${sessionId}`,
        { method: 'DELETE' }
      );
      
      if (!response.ok) {
        throw new Error('Failed to delete session');
      }
      
      // Remove from local state
      setSessions(sessions.filter(s => s.session_id !== sessionId));
    } catch (err: any) {
      alert(err.message || 'Failed to delete session');
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
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-rose-200/50">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Your Sessions</h2>
            <p className="text-gray-600 mt-1">
              {sessions.length} conversation{sessions.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={loadSessions}
              className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              title="Refresh"
            >
              <RefreshIcon className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={onStartNewSession}
              className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              + New Session
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
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💭</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No sessions yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start your first conversation to practice emotional connection
            </p>
            <button
              onClick={onStartNewSession}
              className="px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              Start First Session
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.session_id}
                onClick={() => onSelectSession(session.session_id)}
                className="p-5 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-200 hover:border-rose-300 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">
                        {session.personality?.archetype 
                          ? getArchetypeEmoji(session.personality.archetype)
                          : '💝'}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {session.personality?.archetype || 'Unknown Partner'}
                      </h3>
                      <span className="px-2 py-1 bg-white/60 rounded-full text-xs font-medium text-gray-600">
                        {session.language === 'banglish' ? '🇧🇩 Banglish' : '🇬🇧 English'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>💬 {session.message_count} messages</span>
                      <span>📅 {formatDate(session.created_at)}</span>
                      {session.last_message_at && (
                        <span>🕐 Last: {formatDate(session.last_message_at)}</span>
                      )}
                    </div>

                    {session.personality && (
                      <div className="mt-3 flex gap-3 text-xs">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Playful:</span>
                          <div className="w-16 h-2 bg-white/60 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-rose-400"
                              style={{ width: `${session.personality.playful}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Talkative:</span>
                          <div className="w-16 h-2 bg-white/60 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-rose-400"
                              style={{ width: `${session.personality.talkative}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Affectionate:</span>
                          <div className="w-16 h-2 bg-white/60 rounded-full overflow-hidden">
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
                    className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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

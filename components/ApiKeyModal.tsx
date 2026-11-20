import React, { useState, useEffect } from 'react';
import { getActiveApiKey, saveApiKey, testApiKey, isDemoModeActive, setDemoMode } from '../services/geminiService';
import { CloseIcon, KeyIcon, ShieldCheckIcon } from './icons/UtilityIcons';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved?: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onKeySaved }) => {
  const [apiKey, setApiKey] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [demoActive, setDemoActive] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setApiKey(getActiveApiKey());
      setDemoActive(isDemoModeActive());
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    saveApiKey(apiKey.trim());
    if (onKeySaved) onKeySaved();
    onClose();
  };

  const handleTestKey = async () => {
    if (!apiKey.trim()) {
      setTestResult({ success: false, message: 'Please paste your Gemini API key first.' });
      return;
    }
    setIsTesting(true);
    setTestResult(null);
    const result = await testApiKey(apiKey.trim());
    setIsTesting(false);
    setTestResult(result);
  };

  const handleToggleDemo = () => {
    const nextState = !demoActive;
    setDemoActive(nextState);
    setDemoMode(nextState);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-surface rounded-2xl shadow-2xl border border-hairline overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 bg-ink text-paper flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <KeyIcon className="w-5 h-5 text-paper" />
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold">Bring Your Own Key (BYOK)</h3>
              <p className="font-mono text-[10px] uppercase tracking-wider text-paper/70 mt-0.5">
                100% Free &bull; Zero Data Stored &bull; Direct to Gemini
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-paper/70 hover:text-paper hover:bg-white/10 rounded-lg transition"
            aria-label="Close"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Free Key Guide */}
          <div className="bg-paper border border-hairline rounded-xl p-4 text-sm text-ink">
            <p className="font-semibold text-ink mb-1">Need a free Google Gemini API key?</p>
            <p className="text-xs text-muted leading-relaxed mb-2.5">
              Google AI Studio offers free access to Gemini 2.5 Flash for personal use—no credit card required.
            </p>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-crimson-600 hover:text-crimson-700 underline underline-offset-4"
            >
              Get a free key from Google AI Studio &rarr;
            </a>
          </div>

          {/* Key Input */}
          <div>
            <label htmlFor="gemini-key" className="block font-mono text-[11px] uppercase tracking-widest text-muted mb-2">
              Google Gemini API Key
            </label>
            <div className="relative">
              <input
                id="gemini-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-4 py-3 bg-paper/60 border border-hairline rounded-xl text-ink text-sm font-mono focus:border-ink focus:outline-none focus:bg-surface transition"
              />
              {apiKey && (
                <button
                  type="button"
                  onClick={() => setApiKey('')}
                  className="absolute right-3 top-3 text-xs text-muted hover:text-ink"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Test Result */}
          {testResult && (
            <div className={`p-3 rounded-xl text-xs font-medium border ${
              testResult.success
                ? 'bg-sage-50 text-sage-700 border-sage-100'
                : 'bg-crimson-50 text-crimson-700 border-crimson-200'
            }`}>
              {testResult.message}
            </div>
          )}

          {/* Demo Mode Toggle */}
          <div className="flex items-center justify-between p-4 bg-paper/60 rounded-xl border border-hairline gap-4">
            <div>
              <p className="text-sm font-semibold text-ink">Instant Demo Simulation Mode</p>
              <p className="text-xs text-muted mt-0.5">Try the full conversation &amp; scorecard without an API key.</p>
            </div>
            <button
              type="button"
              onClick={handleToggleDemo}
              aria-label="Toggle Demo Simulation Mode"
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${demoActive ? 'bg-ink' : 'bg-hairline'}`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-surface shadow transition duration-200 ${demoActive ? 'translate-x-5' : 'translate-x-0'}`}
              />
            </button>
          </div>

          {/* Privacy Note */}
          <div className="flex items-center gap-2 text-xs text-muted">
            <ShieldCheckIcon className="w-4 h-4 text-sage-600 flex-shrink-0" />
            <span>Saved strictly in your browser&apos;s localStorage. Never sent to any third-party server.</span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-hairline">
            <button
              type="button"
              onClick={handleTestKey}
              disabled={isTesting || !apiKey.trim()}
              className="px-4 py-2.5 text-xs font-semibold text-ink bg-paper hover:bg-hairline/60 border border-hairline rounded-xl transition disabled:opacity-40"
            >
              {isTesting ? 'Verifying...' : 'Test Connection'}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 text-xs font-semibold text-paper bg-ink hover:bg-crimson-600 rounded-xl transition"
            >
              Save &amp; Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

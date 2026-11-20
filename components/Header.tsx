import React, { useState, useEffect } from 'react';
import { KeyIcon, VolumeIcon, ShieldCheckIcon } from './icons/UtilityIcons';
import { isApiKeySet, isDemoModeActive } from '../services/geminiService';

interface HeaderProps {
  onOpenApiKeyModal?: () => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  onGoHome?: () => void;
  refreshTick?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenApiKeyModal,
  soundEnabled = true,
  onToggleSound,
  onGoHome,
  refreshTick = 0
}) => {
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    setHasKey(isApiKeySet() || isDemoModeActive());
  }, [refreshTick]);

  return (
    <header className="sticky top-0 z-40 w-full px-4 py-3.5 md:px-8 border-b border-hairline bg-paper/85 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-3 text-left group focus:outline-none"
        >
          <img
            src="/favicon.svg"
            alt="HeartSense Logo"
            className="w-8 h-8 rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-200"
          />
          <div className="flex items-baseline gap-2.5">
            <span className="font-display text-xl font-semibold text-ink tracking-tight">HeartSense</span>
            <span className="hidden sm:inline-block font-mono text-[10px] uppercase tracking-widest text-sage-700 bg-sage-50 border border-sage-100 px-2 py-0.5 rounded">
              Free Forever
            </span>
          </div>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Zero Data Indicator */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-muted px-2.5 py-1">
            <ShieldCheckIcon className="w-3.5 h-3.5 text-sage-600" />
            <span>Zero data stored</span>
          </div>

          <div className="hidden md:block h-4 w-px bg-hairline" />

          {/* Sound Toggle */}
          {onToggleSound && (
            <button
              onClick={onToggleSound}
              title={soundEnabled ? "Mute Sound Effects" : "Enable Sound Effects"}
              className="p-2 text-muted hover:text-ink hover:bg-black/5 rounded-lg transition focus:outline-none"
              aria-label={soundEnabled ? "Mute sound effects" : "Enable sound effects"}
            >
              <VolumeIcon muted={!soundEnabled} className="w-4 h-4" />
            </button>
          )}

          {/* BYOK / API Key Button (hidden for now)
          {onOpenApiKeyModal && (
            <button
              onClick={onOpenApiKeyModal}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                hasKey
                  ? 'bg-surface text-ink border-hairline hover:border-ink/30'
                  : 'bg-ink text-paper border-ink hover:bg-ink/90'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${hasKey ? 'bg-sage-600' : 'bg-crimson-500'}`} />
              <KeyIcon className="w-3.5 h-3.5" />
              <span>{hasKey ? 'API Key' : 'Add API Key'}</span>
            </button>
          )}
          */}
        </div>
      </div>
    </header>
  );
};

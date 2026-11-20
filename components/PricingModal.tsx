import React, { useState } from 'react';
import { CloseIcon, CheckIcon } from './icons/UtilityIcons';
import { HeartIcon } from './icons/HeartIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { playSound } from '../services/audioService';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan?: (planName: string) => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, onSelectPlan }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChoosePlan = (plan: string) => {
    setSelectedPlan(plan);
    playSound('score');
    setIsSuccess(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('heartsense_tier', plan.toLowerCase());
    }
    setTimeout(() => {
      setIsSuccess(false);
      if (onSelectPlan) onSelectPlan(plan);
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden my-8">
        {/* Top decoration */}
        <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-indigo-600 p-8 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition"
            aria-label="Close"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wider text-rose-100 flex items-center gap-1.5">
              <SparklesIcon className="w-3.5 h-3.5" /> Commercial License & Plans
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Invest in Your Emotional Mastery</h2>
          <p className="text-sm md:text-base text-rose-100 mt-2 max-w-2xl">
            Upgrade your relationship practice. Unlock full conflict scenarios, deep voice narration, and exportable love certificates.
          </p>

          {/* Billing Switcher */}
          <div className="flex items-center gap-3 mt-6">
            <div className="bg-black/20 p-1 rounded-full flex items-center text-xs font-semibold">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 rounded-full transition ${billingCycle === 'monthly' ? 'bg-white text-gray-900 shadow' : 'text-white/80 hover:text-white'}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-1.5 rounded-full transition flex items-center gap-1.5 ${billingCycle === 'yearly' ? 'bg-white text-gray-900 shadow' : 'text-white/80 hover:text-white'}`}
              >
                Yearly <span className="text-[10px] bg-emerald-500 text-white font-bold px-1.5 py-0.5 rounded-full">Save 35%</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Starter Plan */}
          <div className="rounded-2xl border border-gray-200 p-6 flex flex-col justify-between hover:border-gray-300 transition">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900 text-lg">Starter Practice</h3>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-extrabold text-gray-900">$0</span>
                <span className="text-xs text-gray-500 ml-1">/ forever</span>
              </div>
              <p className="text-xs text-gray-500 mb-6">Ideal for casual practice and exploring personal communication styles.</p>
              <ul className="space-y-3 text-xs text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>3 Standard Partner Archetypes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Banglish & English Conversations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Standard Love Score & Tips</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <span className="w-4 h-4 text-center">✕</span>
                  <span>Audio Voice Synthesis</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleChoosePlan('Starter')}
              className="mt-8 w-full py-2.5 px-4 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 transition"
            >
              Current Plan
            </button>
          </div>

          {/* Pro Plan (Highlighted) */}
          <div className="rounded-2xl border-2 border-rose-500 bg-rose-50/20 p-6 flex flex-col justify-between relative shadow-xl transform md:-translate-y-2">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow">
              Most Popular
            </div>
            <div>
              <div className="flex justify-between items-center mb-4 mt-1">
                <h3 className="font-bold text-rose-900 text-lg flex items-center gap-1.5">
                  <HeartIcon className="w-5 h-5 text-rose-500" /> HeartSense Pro
                </h3>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-extrabold text-gray-900">
                  {billingCycle === 'monthly' ? '$9' : '$6'}
                </span>
                <span className="text-xs text-gray-500 ml-1">/ month (or ৳499 BDT)</span>
              </div>
              <p className="text-xs text-rose-700 mb-6">Complete emotional simulator with advanced relationship coaching.</p>
              <ul className="space-y-3 text-xs text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  <span className="font-semibold text-gray-900">Unlimited AI Practice Sessions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  <span>Fine-tuned Personality Sliders</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  <span>Natural Voice Audio Narration (TTS)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  <span>High-Res Shareable Report Cards</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  <span>Realistic Emotional Friction Mode</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleChoosePlan('Pro')}
              className="mt-8 w-full py-3 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-lg shadow-rose-500/30 transition transform active:scale-95 flex items-center justify-center gap-2"
            >
              <SparklesIcon className="w-4 h-4" /> Upgrade to Pro
            </button>
          </div>

          {/* Lifetime Pass */}
          <div className="rounded-2xl border border-gray-200 p-6 flex flex-col justify-between hover:border-gray-300 transition">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900 text-lg">Lifetime Founder</h3>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-extrabold text-gray-900">$29</span>
                <span className="text-xs text-gray-500 ml-1">one-time (৳1,999 BDT)</span>
              </div>
              <p className="text-xs text-gray-500 mb-6">Pay once, own forever. Includes all future scenario expansion packs.</p>
              <ul className="space-y-3 text-xs text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>All HeartSense Pro Features Forever</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>VIP Founder Badge on Scorecards</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Upcoming Couple Match Sync</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Direct Priority Roadmap Voting</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleChoosePlan('Lifetime')}
              className="mt-8 w-full py-2.5 px-4 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition transform active:scale-95"
            >
              Get Lifetime Pass
            </button>
          </div>
        </div>

        {/* Success Banner */}
        {isSuccess && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in z-20">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 mb-4 animate-bounce">
              <CheckIcon className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-extrabold text-gray-900">Plan Activated!</h3>
            <p className="text-sm text-gray-600 mt-1 max-w-sm">
              Welcome to {selectedPlan}! Your client-side experience now has Pro capabilities unlocked.
            </p>
          </div>
        )}

        {/* Footer info */}
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
          <span>🔒 30-day money-back guarantee • bKash, Nagad & International Cards supported</span>
          <span>Zero server lock-in • 100% Client-Side Privacy</span>
        </div>
      </div>
    </div>
  );
};

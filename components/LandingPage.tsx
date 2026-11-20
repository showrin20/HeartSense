import React, { useState } from 'react';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import { ShieldCheckIcon, KeyIcon, CheckIcon } from './icons/UtilityIcons';

interface LandingPageProps {
  onStart: () => void;
  onOpenApiKey?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onOpenApiKey }) => {
  const [activeTab, setActiveTab] = useState<'calm' | 'funny' | 'poetic'>('calm');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const previews = {
    calm: {
      name: "Riya",
      role: "Calm & caring girlfriend",
      trait: "Empathetic • Banglish",
      quote: "Ki korcho? You sounded a bit tired earlier. Chupi na theke bolo ki hoyeche, I'm right here listening.",
      userReply: "Honestly, today was exhausting. Just wanted to hear your voice.",
      avatar: "/characters/girlfriend.png"
    },
    funny: {
      name: "Ayaan",
      role: "Funny, chill boyfriend",
      trait: "Playful • Banglish",
      quote: "Acha bolo to, ajke shara din kar kotha mone porse? Dushtami off, I actually missed talking to you.",
      userReply: "Don't flatter yourself too much! Maybe once or twice.",
      avatar: "/characters/boyfriend.png"
    },
    poetic: {
      name: "Zara",
      role: "Poetic & dreamy partner",
      trait: "Deep • Romantic",
      quote: "Some silences speak louder than words. Jodi raat ta kotha bolte parto, it would tell you how much you mean to me.",
      userReply: "You always know how to make a quiet night feel special.",
      avatar: "/characters/dreamy.png"
    }
  };

  const faqs = [
    {
      q: "Is HeartSense really 100% free for everyone?",
      a: "Yes. Every feature—all AI character archetypes, personality sliders, Banglish and English modes, voice read-aloud, and downloadable Love Report Cards—is completely free with no subscriptions or paywalls."
    },
    {
      q: "Do you store any of my chats or personal data?",
      a: "Never. HeartSense has zero backend servers and zero databases. Your conversations exist only in your browser's temporary memory and disappear when you close the tab or start a new session."
    },
    /* BYOK FAQ hidden for now
    {
      q: "How does Bring Your Own Key (BYOK) work?",
      a: "You plug in your own free Google Gemini API key from Google AI Studio (no credit card required). Your key is saved strictly in your browser's localStorage and calls Google's API directly—never passing through our servers. You can also test-drive instantly in Demo Mode."
    },
    */
    {
      q: "How is this different from a regular chatbot?",
      a: "Unlike sycophantic AI assistants that always agree with you, HeartSense models real emotional boundaries. If you're dismissive or start an argument, your partner can feel hurt, defensive, or ask for space—giving you an authentic environment to practice empathy and reconciliation."
    }
  ];

  const activePreview = previews[activeTab];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-20 sm:pt-14 animate-fade-in">
      {/* Asymmetric Editorial Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left: Editorial Copy & Actions */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-sage-700 bg-sage-50 border border-sage-100 px-3 py-1 rounded-full">
            <ShieldCheckIcon className="w-3.5 h-3.5 text-sage-600" />
            <span>Free Forever • Zero Data Stored</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold text-ink tracking-tight leading-[1.08]">
            Practice real love,{' '}
            <span className="italic text-crimson-500">before</span>{' '}
            it matters most.
          </h1>

          <p className="text-base sm:text-lg text-muted leading-relaxed max-w-xl">
            Simulate nuanced romantic conversations in natural Banglish or English, navigate real emotional friction, and receive an honest relationship scorecard—completely free and 100% private in your browser.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              onClick={onStart}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-ink hover:bg-crimson-600 text-paper font-semibold text-sm sm:text-base rounded-xl shadow-sm transition-colors duration-200"
            >
              <span>Customize Your Partner</span>
              <ArrowRightIcon className="w-4 h-4" />
            </button>

            {/* BYOK API Key CTA hidden for now
            {onOpenApiKey && (
              <button
                onClick={onOpenApiKey}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-surface hover:bg-hairline/40 text-ink font-semibold text-sm sm:text-base rounded-xl border border-hairline transition-colors"
              >
                <KeyIcon className="w-4 h-4 text-sage-600" />
                <span>Connect Free API Key</span>
              </button>
            )}
            */}
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5">
              <CheckIcon className="w-3.5 h-3.5 text-sage-600" />
              No account or sign-up
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckIcon className="w-3.5 h-3.5 text-sage-600" />
              Zero server logs
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckIcon className="w-3.5 h-3.5 text-sage-600" />
              Banglish &amp; English
            </span>
          </div>
        </div>

        {/* Right: Tactile Live Character Dialogue Stage */}
        <div className="lg:col-span-5">
          <div className="bg-surface rounded-2xl border border-hairline shadow-[0_20px_50px_-20px_rgba(26,21,23,0.12)] overflow-hidden">
            {/* Character Switcher Bar */}
            <div className="px-4 py-3 bg-paper/70 border-b border-hairline flex items-center justify-between gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
                Character Preview
              </span>
              <div className="flex items-center gap-1">
                {(['calm', 'funny', 'poetic'] as const).map((key) => {
                  const isActive = activeTab === key;
                  const label = key === 'calm' ? 'Riya' : key === 'funny' ? 'Ayaan' : 'Zara';
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key)}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                        isActive
                          ? 'bg-ink text-paper'
                          : 'text-muted hover:text-ink hover:bg-black/5'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Character Header */}
            <div className="p-5 border-b border-hairline/70 flex items-center gap-4">
              <div className="relative flex-shrink-0">
                <img
                  src={activePreview.avatar}
                  alt={activePreview.name}
                  className="w-16 h-16 rounded-xl object-cover border border-hairline"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-sage-600 border-2 border-surface rounded-full" />
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-xl font-semibold text-ink leading-tight">
                  {activePreview.name}
                </h3>
                <p className="text-xs text-muted mt-0.5">{activePreview.role}</p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-crimson-600 mt-1.5">
                  {activePreview.trait}
                </p>
              </div>
            </div>

            {/* Dialogue Snippet */}
            <div className="p-5 space-y-3 bg-paper/40">
              <div className="bg-surface border border-hairline rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-ink leading-relaxed shadow-2xs">
                {activePreview.quote}
              </div>
              <div className="flex justify-end">
                <div className="bg-ink text-paper rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm leading-relaxed max-w-[85%]">
                  {activePreview.userReply}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Warm-Ink Zero-Data Privacy Band */}
      <section className="mt-20 bg-ink text-paper rounded-2xl p-8 sm:p-10 lg:p-12 border border-ink">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-3">
            <p className="font-mono text-[11px] uppercase tracking-widest text-sage-100/80">
              Zero-Data Architecture
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight leading-tight">
              We don&apos;t keep a single byte of your data.
            </h2>
            <p className="text-sm sm:text-base text-paper/75 leading-relaxed max-w-xl">
              HeartSense is 100% free for everyone and runs entirely inside your browser with no backend server. Your personal conversations stay strictly on your device and vanish the moment you close the tab or start fresh.
            </p>
          </div>
          <div className="lg:col-span-5 flex flex-col items-start lg:items-end justify-between gap-4">
            <div className="w-full lg:w-auto font-mono text-xs bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-paper/80 space-y-1">
              <div className="text-sage-100">100% Client-Side Privacy</div>
              <div className="text-paper/50">Server logs: 0 &nbsp;|&nbsp; Database: none</div>
            </div>
            {/* BYOK Configure Button hidden for now
            {onOpenApiKey && (
              <button
                onClick={onOpenApiKey}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-paper hover:bg-surface text-ink font-semibold text-xs sm:text-sm rounded-xl transition"
              >
                <KeyIcon className="w-4 h-4 text-sage-600" />
                <span>Configure Free BYOK Key</span>
              </button>
            )}
            */}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 pt-8 border-t border-white/10">
          <div>
            <h3 className="font-semibold text-sm text-paper">Zero Server Storage</h3>
            <p className="text-xs text-paper/65 mt-1.5 leading-relaxed">
              There is no backend database. Close the tab or reset your chat and every message is permanently cleared.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-paper">Private In-Browser</h3>
            <p className="text-xs text-paper/65 mt-1.5 leading-relaxed">
              No sign-ups, no user profiles, and no chat history tracking—your practice stays completely yours.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-paper">Free For Everyone</h3>
            <p className="text-xs text-paper/65 mt-1.5 leading-relaxed">
              No subscriptions, no locked archetypes, no paywalled scorecards. Built to make emotional practice accessible to all.
            </p>
          </div>
        </div>
      </section>

      {/* Distilled 3-Column Editorial Pillars */}
      <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-hairline">
        <div className="space-y-2.5">
          <span className="font-mono text-xs text-crimson-500">01</span>
          <h3 className="font-display text-2xl font-semibold text-ink">Authentic emotional friction</h3>
          <p className="text-sm text-muted leading-relaxed">
            Real partners get hurt, need space, and notice tone. Practice navigating misunderstandings without defensiveness before facing them in real life.
          </p>
        </div>

        <div className="space-y-2.5">
          <span className="font-mono text-xs text-crimson-500">02</span>
          <h3 className="font-display text-2xl font-semibold text-ink">Natural Banglish &amp; English</h3>
          <p className="text-sm text-muted leading-relaxed">
            Designed around real cultural subtext, affectionate teasing, and heartfelt expression—switch effortlessly between Banglish and standard English.
          </p>
        </div>

        <div className="space-y-2.5">
          <span className="font-mono text-xs text-crimson-500">03</span>
          <h3 className="font-display text-2xl font-semibold text-ink">Honest Love Report Cards</h3>
          <p className="text-sm text-muted leading-relaxed">
            End any session to receive a 1–100 emotional intelligence rating, lover personality archetype, and concrete growth tips you can download as an image.
          </p>
        </div>
      </section>

      {/* Editorial Testimonials */}
      <section className="mt-20 pt-12 border-t border-hairline">
        <div className="mb-10">
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted">Community Notes</p>
          <h2 className="font-display text-3xl font-semibold text-ink mt-1">What communicators say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <blockquote className="space-y-4">
            <p className="font-display italic text-lg text-ink leading-relaxed">
              &ldquo;I used to get defensive whenever my girlfriend got upset. Practicing here taught me to pause and listen first.&rdquo;
            </p>
            <footer className="text-xs font-semibold text-muted">— Fahim R., Dhaka</footer>
          </blockquote>

          <blockquote className="space-y-4">
            <p className="font-display italic text-lg text-ink leading-relaxed">
              &ldquo;The Banglish nuance is remarkably natural. Knowing zero data leaves my browser makes it easy to be genuinely honest.&rdquo;
            </p>
            <footer className="text-xs font-semibold text-muted">— Samira K., Chittagong</footer>
          </blockquote>

          <blockquote className="space-y-4">
            <p className="font-display italic text-lg text-ink leading-relaxed">
              &ldquo;My report card pointed out I rush to fix problems instead of validating feelings. That single insight changed how I communicate.&rdquo;
            </p>
            <footer className="text-xs font-semibold text-muted">— David M., London</footer>
          </blockquote>
        </div>
      </section>

      {/* Clean Accordion FAQ */}
      <section className="mt-20 pt-12 border-t border-hairline max-w-3xl mx-auto">
        <div className="mb-8">
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted">Questions</p>
          <h2 className="font-display text-3xl font-semibold text-ink mt-1">Frequently asked</h2>
        </div>

        <div className="divide-y divide-hairline border-y border-hairline">
          {faqs.map((faq, idx) => (
            <div key={idx} className="py-5">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left font-semibold text-ink flex items-center justify-between gap-4 text-sm sm:text-base focus:outline-none"
              >
                <span>{faq.q}</span>
                <span className="font-mono text-muted text-lg flex-shrink-0">{openFaq === idx ? '−' : '+'}</span>
              </button>
              {openFaq === idx && (
                <p className="mt-3 text-sm text-muted leading-relaxed pr-6">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mt-20 text-center max-w-2xl mx-auto space-y-5">
        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ink tracking-tight">
          Start your first conversation.
        </h2>
        <p className="text-sm sm:text-base text-muted">
          100% free forever, zero accounts, zero data kept.
        </p>
        <div className="pt-2">
          <button
            onClick={onStart}
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-ink hover:bg-crimson-600 text-paper font-semibold text-sm sm:text-base rounded-xl shadow-sm transition-colors"
          >
            <span>Customize Your Partner</span>
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="mt-20 pt-8 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted">
        <span>© 2026 HeartSense</span>
        <span className="font-mono text-[11px]">100% Free Forever • Zero Data Stored</span>
      </footer>
    </div>
  );
};

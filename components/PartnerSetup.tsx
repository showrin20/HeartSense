import React, { useState } from 'react';
import type { PartnerPersonality, Language } from '../types';
import { ArrowRightIcon } from './icons/ArrowRightIcon';

interface PartnerSetupProps {
    onFinishSetup: (personality: PartnerPersonality, language: Language) => void;
    onBack?: () => void;
}

const archetypes: Record<string, Omit<PartnerPersonality, 'archetype'>> = {
    "Calm & caring girlfriend": { playful: 25, talkative: 50, affectionate: 85 },
    "Funny, chill boyfriend": { playful: 80, talkative: 70, affectionate: 60 },
    "Poetic & dreamy partner": { playful: 60, talkative: 80, affectionate: 75 },
};

const archetypeDetails = {
    "Calm & caring girlfriend": { 
        description: "Shanto ebong caring. Listens deeply and creates a calm, grounded emotional space.", 
        defaultName: "Riya",
        avatar: "/characters/girlfriend.png"
    },
    "Funny, chill boyfriend": { 
        description: "Loves playful teasing (dushtami) and banter, while genuinely caring underneath.", 
        defaultName: "Ayaan",
        avatar: "/characters/boyfriend.png"
    },
    "Poetic & dreamy partner": { 
        description: "Expressive, thoughtful romantic who gravitates toward late-night deep conversations.", 
        defaultName: "Zara",
        avatar: "/characters/dreamy.png"
    },
};

const scenarios = [
    { id: 'casual', label: 'Casual evening catch-up' },
    { id: 'conflict', label: 'Conflict practice (They are upset with you)' },
    { id: 'flirt', label: 'Playful banter & flirting' },
];

export const PartnerSetup: React.FC<PartnerSetupProps> = ({ onFinishSetup, onBack }) => {
    const [selectedArchetype, setSelectedArchetype] = useState<string>("Calm & caring girlfriend");
    const [personality, setPersonality] = useState<PartnerPersonality>({
        archetype: "Calm & caring girlfriend",
        ...archetypes["Calm & caring girlfriend"],
        partnerName: "Riya",
        scenario: 'casual',
        avatar: "/characters/girlfriend.png"
    });
    const [language, setLanguage] = useState<Language>('banglish');
    const [partnerName, setPartnerName] = useState<string>("Riya");
    const [selectedScenario, setSelectedScenario] = useState<string>('casual');

    const handleArchetypeSelect = (name: string) => {
        setSelectedArchetype(name);
        const details = archetypeDetails[name as keyof typeof archetypeDetails];
        const defaultName = details?.defaultName || "HeartSense";
        const avatar = details?.avatar || "/characters/girlfriend.png";
        setPartnerName(defaultName);
        setPersonality({
            archetype: name,
            ...archetypes[name],
            partnerName: defaultName,
            scenario: selectedScenario,
            avatar
        });
    };

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPersonality(prev => ({
            ...prev,
            [name]: parseInt(value, 10),
            archetype: "Custom",
        }));
    };

    const handleStart = () => {
        const finalPersonality: PartnerPersonality = {
            ...personality,
            archetype: selectedArchetype === "Custom" ? "Custom" : personality.archetype,
            partnerName: partnerName.trim() || "HeartSense",
            scenario: selectedScenario
        };
        onFinishSetup(finalPersonality, language);
    };

    return (
        <div className="max-w-4xl w-full mx-auto bg-surface rounded-2xl shadow-[0_20px_50px_-24px_rgba(26,21,23,0.12)] p-6 sm:p-10 animate-fade-in border border-hairline my-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-6 border-b border-hairline mb-8">
                <div>
                    <p className="font-mono text-[11px] uppercase tracking-widest text-muted">Session Studio</p>
                    <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ink tracking-tight mt-1">
                        Customize your partner
                    </h2>
                    <p className="text-sm text-muted mt-1.5">
                        Choose a character, language, and emotional dynamics for this practice session.
                    </p>
                </div>
                {onBack && (
                    <button
                        onClick={onBack}
                        className="text-xs font-semibold text-muted hover:text-ink px-3 py-1.5 rounded-lg border border-hairline hover:bg-paper transition flex-shrink-0"
                    >
                        &larr; Back
                    </button>
                )}
            </div>

            {/* Step 1: Language */}
            <section className="mb-9">
                <div className="flex items-baseline justify-between mb-3">
                    <h3 className="font-mono text-xs uppercase tracking-widest text-muted">01 &nbsp; Language</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <button
                        type="button"
                        onClick={() => setLanguage('banglish')}
                        className={`p-4 rounded-xl border text-left transition-all ${
                            language === 'banglish'
                                ? 'bg-crimson-50/70 border-crimson-500 ring-1 ring-crimson-500'
                                : 'bg-paper/40 border-hairline hover:border-ink/30'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-ink text-base">Banglish</h4>
                            <span className="font-mono text-[10px] uppercase tracking-wider text-crimson-600">
                                {language === 'banglish' ? 'Selected' : 'BD'}
                            </span>
                        </div>
                        <p className="text-xs text-muted mt-1 leading-relaxed">
                            Natural mix of Bangla &amp; English with authentic Bangladeshi emotional subtext.
                        </p>
                    </button>

                    <button
                        type="button"
                        onClick={() => setLanguage('english')}
                        className={`p-4 rounded-xl border text-left transition-all ${
                            language === 'english'
                                ? 'bg-crimson-50/70 border-crimson-500 ring-1 ring-crimson-500'
                                : 'bg-paper/40 border-hairline hover:border-ink/30'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-ink text-base">English</h4>
                            <span className="font-mono text-[10px] uppercase tracking-wider text-crimson-600">
                                {language === 'english' ? 'Selected' : 'Global'}
                            </span>
                        </div>
                        <p className="text-xs text-muted mt-1 leading-relaxed">
                            Natural, modern standard English for universal relationship practice.
                        </p>
                    </button>
                </div>
            </section>

            {/* Step 2: AI Character Archetypes */}
            <section className="mb-9">
                <h3 className="font-mono text-xs uppercase tracking-widest text-muted mb-3">02 &nbsp; Character Archetype</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {Object.entries(archetypeDetails).map(([name, details]) => {
                        const isSelected = selectedArchetype === name;
                        return (
                            <button
                                key={name}
                                type="button"
                                onClick={() => handleArchetypeSelect(name)}
                                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                                    isSelected
                                        ? 'bg-crimson-50/60 border-crimson-500 ring-1 ring-crimson-500'
                                        : 'bg-surface hover:border-ink/30 border-hairline'
                                }`}
                            >
                                <div>
                                    <div className="relative w-full aspect-square mb-3.5 rounded-lg overflow-hidden bg-paper border border-hairline/80">
                                        <img
                                            src={details.avatar}
                                            alt={name}
                                            className="w-full h-full object-cover"
                                        />
                                        {isSelected && (
                                            <span className="absolute top-2.5 right-2.5 font-mono text-[10px] uppercase tracking-wider bg-ink text-paper px-2 py-0.5 rounded">
                                                Active
                                            </span>
                                        )}
                                    </div>
                                    <h4 className="font-display text-lg font-semibold text-ink leading-snug">{details.defaultName}</h4>
                                    <p className="text-xs font-medium text-crimson-600 mt-0.5">{name}</p>
                                    <p className="text-xs text-muted mt-2 leading-relaxed">{details.description}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* Step 3: Name & Scenario */}
            <section className="mb-9 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="partner-name" className="block font-mono text-xs uppercase tracking-widest text-muted mb-2">
                        Partner Name
                    </label>
                    <input
                        id="partner-name"
                        type="text"
                        value={partnerName}
                        onChange={(e) => setPartnerName(e.target.value)}
                        placeholder="e.g. Riya, Ayaan, Zara"
                        className="w-full px-3.5 py-2.5 bg-paper/50 border border-hairline rounded-xl text-sm font-medium text-ink focus:outline-none focus:border-ink focus:bg-surface transition"
                    />
                </div>

                <div>
                    <label htmlFor="scenario-select" className="block font-mono text-xs uppercase tracking-widest text-muted mb-2">
                        Starting Scenario
                    </label>
                    <select
                        id="scenario-select"
                        value={selectedScenario}
                        onChange={(e) => setSelectedScenario(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-paper/50 border border-hairline rounded-xl text-sm font-medium text-ink focus:outline-none focus:border-ink focus:bg-surface transition"
                    >
                        {scenarios.map(s => (
                            <option key={s.id} value={s.id}>{s.label}</option>
                        ))}
                    </select>
                </div>
            </section>

            {/* Step 4: Fine-Tune Sliders */}
            <section className="mb-10">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-mono text-xs uppercase tracking-widest text-muted">03 &nbsp; Personality Dynamics</h3>
                    {personality.archetype === "Custom" && (
                        <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-paper border border-hairline text-ink">
                            Custom Tuned
                        </span>
                    )}
                </div>
                
                <div className="space-y-6 bg-paper/60 p-5 sm:p-6 rounded-xl border border-hairline">
                    <div>
                        <div className="flex justify-between items-center text-xs font-medium text-ink mb-2">
                            <span>Calm &amp; Serious</span>
                            <span className="font-mono text-muted">{personality.playful}%</span>
                            <span>Playful &amp; Teasing</span>
                        </div>
                        <input
                            id="playful"
                            type="range"
                            name="playful"
                            min="0"
                            max="100"
                            value={personality.playful}
                            onChange={handleSliderChange}
                            className="w-full editorial-slider"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center text-xs font-medium text-ink mb-2">
                            <span>Thoughtful Listener</span>
                            <span className="font-mono text-muted">{personality.talkative}%</span>
                            <span>Expressive &amp; Talkative</span>
                        </div>
                        <input
                            id="talkative"
                            type="range"
                            name="talkative"
                            min="0"
                            max="100"
                            value={personality.talkative}
                            onChange={handleSliderChange}
                            className="w-full editorial-slider"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center text-xs font-medium text-ink mb-2">
                            <span>Reserved &amp; Subtle</span>
                            <span className="font-mono text-muted">{personality.affectionate}%</span>
                            <span>Openly Affectionate</span>
                        </div>
                        <input
                            id="affectionate"
                            type="range"
                            name="affectionate"
                            min="0"
                            max="100"
                            value={personality.affectionate}
                            onChange={handleSliderChange}
                            className="w-full editorial-slider"
                        />
                    </div>
                </div>
            </section>
             
            {/* Start Chat Button */}
            <div className="flex items-center justify-end pt-4 border-t border-hairline">
                <button
                    onClick={handleStart}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-ink hover:bg-crimson-600 text-paper font-semibold text-sm sm:text-base rounded-xl shadow-sm transition-colors"
                >
                    <span>Start conversation with {partnerName.trim() || 'Partner'}</span>
                    <ArrowRightIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

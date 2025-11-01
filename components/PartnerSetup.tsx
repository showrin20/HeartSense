import React, { useState } from 'react';
import type { PartnerPersonality, Language } from '../types';
import { CaringListenerIcon } from './icons/CaringListenerIcon';
import { ConfidentTeaserIcon } from './icons/ConfidentTeaserIcon';
import { CreativeDreamerIcon } from './icons/CreativeDreamerIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';

interface PartnerSetupProps {
    onFinishSetup: (personality: PartnerPersonality, language: Language) => void;
}

const archetypes: Record<string, Omit<PartnerPersonality, 'archetype'>> = {
    "Calm & caring girlfriend": { playful: 25, talkative: 50, affectionate: 85 },
    "Funny, chill boyfriend": { playful: 80, talkative: 70, affectionate: 60 },
    "Poetic & dreamy partner": { playful: 60, talkative: 80, affectionate: 75 },
};

const archetypeDetails = {
    "Calm & caring girlfriend": { 
        description: "Shanto ebong caring. She listens to you and makes you feel understood.", 
        icon: <CaringListenerIcon className="w-8 h-8" /> 
    },
    "Funny, chill boyfriend": { 
        description: "Loves to joke around (dushtami) and tease you, but is always there for you.", 
        icon: <ConfidentTeaserIcon className="w-8 h-8" /> 
    },
    "Poetic & dreamy partner": { 
        description: "Talks like a poet, loves deep conversations about feelings and dreams.", 
        icon: <CreativeDreamerIcon className="w-8 h-8" /> 
    },
}

export const PartnerSetup: React.FC<PartnerSetupProps> = ({ onFinishSetup }) => {
    const [personality, setPersonality] = useState<PartnerPersonality>({
        archetype: "Calm & caring girlfriend",
        ...archetypes["Calm & caring girlfriend"],
    });
    const [language, setLanguage] = useState<Language>('banglish');

    const handleArchetypeSelect = (name: string) => {
        setPersonality({
            archetype: name,
            ...archetypes[name],
        });
    };

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPersonality(prev => ({
            ...prev,
            [name]: parseInt(value, 10),
            archetype: "Custom", // Change archetype to custom if sliders are manually adjusted
        }));
    };

    return (
        <div className="max-w-4xl w-full mx-auto bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-6 md:p-8 animate-fade-in border border-blue-200/50">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Customize Your Partner</h2>
            <p className="text-center text-gray-500 mb-8">Choose your preferred language, an archetype, then fine-tune their personality.</p>
            
            <section>
                <h3 className="text-xl font-semibold text-gray-700 mb-4">1. Choose Language</h3>
                <div className="flex justify-center gap-4 mb-8">
                    <button
                        onClick={() => setLanguage('banglish')}
                        className={`px-6 py-2 rounded-full font-semibold border-2 transition-all ${language === 'banglish' ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-gray-700 border-gray-300 hover:border-rose-400'}`}
                    >
                        Banglish
                    </button>
                    <button
                        onClick={() => setLanguage('english')}
                        className={`px-6 py-2 rounded-full font-semibold border-2 transition-all ${language === 'english' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'}`}
                    >
                        English
                    </button>
                </div>
            </section>
            
            <section>
                <h3 className="text-xl font-semibold text-gray-700 mb-4">2. Choose an Archetype</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(archetypeDetails).map(([name, details]) => (
                        <button
                            key={name}
                            onClick={() => handleArchetypeSelect(name)}
                            className={`p-4 rounded-xl border-2 text-left transition-all transform hover:scale-105 focus:outline-none ${personality.archetype === name ? 'bg-rose-100 border-rose-400 shadow-md' : 'bg-white hover:border-rose-300 border-gray-200'}`}
                        >
                            <div className={`p-2 inline-block rounded-full mb-2 ${personality.archetype === name ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                                {details.icon}
                            </div>
                            <h4 className="font-bold text-gray-800">{name}</h4>
                            <p className="text-sm text-gray-500 mt-1 font-bengali">{details.description}</p>
                        </button>
                    ))}
                </div>
            </section>

            <section className="mt-8">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">3. Fine-Tune Personality</h3>
                <div className="space-y-6 bg-white/50 p-6 rounded-xl border border-gray-200">
                    {/* Playful Slider */}
                    <div className="slider-group">
                        <label htmlFor="playful" className="flex justify-between font-semibold text-gray-600 text-sm"><span>Calm</span><span>Playful</span></label>
                        <input id="playful" type="range" name="playful" min="0" max="100" value={personality.playful} onChange={handleSliderChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-500" />
                    </div>
                    {/* Talkative Slider */}
                    <div className="slider-group">
                        <label htmlFor="talkative" className="flex justify-between font-semibold text-gray-600 text-sm"><span>Thoughtful</span><span>Talkative</span></label>
                        <input id="talkative" type="range" name="talkative" min="0" max="100" value={personality.talkative} onChange={handleSliderChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                    </div>
                    {/* Affectionate Slider */}
                    <div className="slider-group">
                        <label htmlFor="affectionate" className="flex justify-between font-semibold text-gray-600 text-sm"><span>Reserved</span><span>Affectionate</span></label>
                        <input id="affectionate" type="range" name="affectionate" min="0" max="100" value={personality.affectionate} onChange={handleSliderChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500" />
                    </div>
                </div>
            </section>
             
            <div className="mt-8 text-center">
                 <button
                    onClick={() => onFinishSetup(personality, language)}
                    className="inline-flex items-center gap-3 px-8 py-3 bg-rose-500 text-white font-bold text-lg rounded-full shadow-xl hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 transition-transform transform hover:scale-105"
                >
                    Start Chatting
                    <ArrowRightIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

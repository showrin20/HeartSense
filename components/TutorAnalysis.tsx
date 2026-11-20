import React, { useEffect, useState } from 'react';
import type { Analysis, Language } from '../types';
import { RefreshIcon } from './icons/RefreshIcon';
import { ShareIcon } from './icons/ShareIcon';
import { DownloadIcon, CopyIcon, CheckIcon, ShieldCheckIcon } from './icons/UtilityIcons';
import { playSound } from '../services/audioService';

interface TutorAnalysisProps {
    analysis: Analysis | null;
    onStartNew: () => void;
    language: Language;
}

export const TutorAnalysis: React.FC<TutorAnalysisProps> = ({
    analysis,
    onStartNew,
    language
}) => {
    const [copied, setCopied] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        if (analysis) {
            playSound('score');
        }
    }, [analysis]);

    if (!analysis) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center animate-fade-in">
                <div className="w-10 h-10 rounded-full border-2 border-ink border-t-transparent animate-spin mb-4" />
                <h3 className="font-display text-2xl font-semibold text-ink">Preparing your Love Report</h3>
                <p className="text-xs text-muted mt-1.5">Evaluating empathy, openness, respect, and conflict navigation</p>
            </div>
        );
    }

    const isBanglish = language === 'banglish';

    const handleCopySummary = () => {
        const text = isBanglish
            ? `HeartSense Love Score: ${analysis.score}/100\nPersonality Type: "${analysis.personality}"\nIdeal Match: ${analysis.idealPartner}\nTry it free (zero data stored): https://heart-sense-87xw.vercel.app/`
            : `HeartSense Love Score: ${analysis.score}/100\nLover Personality: "${analysis.personality}"\nIdeal Partner: ${analysis.idealPartner}\nTry it free (zero data stored): https://heart-sense-87xw.vercel.app/`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'My HeartSense Love Report Card',
                    text: `I scored ${analysis.score}/100 on HeartSense! My type: "${analysis.personality}".`,
                    url: window.location.href,
                });
            } catch {
                handleCopySummary();
            }
        } else {
            handleCopySummary();
        }
    };

    // Editorial Keepsake PNG Export
    const handleDownloadCard = () => {
        setIsDownloading(true);
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 1200;
            canvas.height = 1440;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Warm alabaster paper background
            ctx.fillStyle = '#FAF7F2';
            ctx.fillRect(0, 0, 1200, 1440);

            // Outer editorial double frame
            ctx.strokeStyle = '#1A1517';
            ctx.lineWidth = 4;
            ctx.strokeRect(48, 48, 1104, 1344);
            ctx.strokeStyle = '#E8DFD5';
            ctx.lineWidth = 2;
            ctx.strokeRect(64, 64, 1072, 1312);

            // Header
            ctx.fillStyle = '#6E6266';
            ctx.font = '600 22px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('HEARTSENSE  •  EMOTIONAL INTELLIGENCE REPORT', 600, 130);

            ctx.fillStyle = '#1A1517';
            ctx.font = 'bold 58px Georgia, serif';
            ctx.fillText(isBanglish ? 'ভালোবাসার রিপোর্ট কার্ড' : 'Love Report Card', 600, 210);

            // Divider
            ctx.strokeStyle = '#E8DFD5';
            ctx.beginPath();
            ctx.moveTo(140, 250);
            ctx.lineTo(1060, 250);
            ctx.stroke();

            // Score Display
            ctx.fillStyle = '#C83E4D';
            ctx.font = 'bold 124px Georgia, serif';
            ctx.fillText(`${analysis.score}`, 560, 390);
            ctx.fillStyle = '#6E6266';
            ctx.font = '400 40px Georgia, serif';
            ctx.textAlign = 'left';
            ctx.fillText('/ 100', 645, 390);

            // Helper for wrapped text
            const drawWrapped = (text: string, x: number, yStart: number, maxWidth: number, lineHeight: number, maxLines = 4) => {
                const words = text.split(' ');
                let line = '';
                let y = yStart;
                let linesDrawn = 0;
                for (let n = 0; n < words.length; n++) {
                    const testLine = line + words[n] + ' ';
                    if (ctx.measureText(testLine).width > maxWidth && n > 0) {
                        ctx.fillText(line.trim(), x, y);
                        line = words[n] + ' ';
                        y += lineHeight;
                        linesDrawn++;
                        if (linesDrawn >= maxLines - 1) break;
                    } else {
                        line = testLine;
                    }
                }
                if (line.trim()) ctx.fillText(line.trim(), x, y);
            };

            // Personality Card
            ctx.fillStyle = '#FFFFFF';
            ctx.strokeStyle = '#E8DFD5';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(110, 460, 980, 170, 16);
            ctx.fill();
            ctx.stroke();

            ctx.textAlign = 'left';
            ctx.fillStyle = '#2A6B57';
            ctx.font = '600 22px monospace';
            ctx.fillText(isBanglish ? 'LOVER PERSONALITY TYPE' : 'LOVER PERSONALITY TYPE', 150, 515);

            ctx.fillStyle = '#1A1517';
            ctx.font = 'bold 38px Georgia, serif';
            drawWrapped(analysis.personality, 150, 575, 900, 46, 2);

            // Ideal Partner Card
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.roundRect(110, 660, 980, 230, 16);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#2A6B57';
            ctx.font = '600 22px monospace';
            ctx.fillText('IDEAL PARTNER MATCH', 150, 715);

            ctx.fillStyle = '#3F3639';
            ctx.font = '27px system-ui, -apple-system, sans-serif';
            drawWrapped(analysis.idealPartner, 150, 765, 900, 40, 3);

            // Growth Tips Card
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.roundRect(110, 920, 980, 320, 16);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#2A6B57';
            ctx.font = '600 22px monospace';
            ctx.fillText('PERSONALIZED GROWTH TIPS', 150, 975);

            ctx.fillStyle = '#3F3639';
            ctx.font = '24px system-ui, -apple-system, sans-serif';
            analysis.tips.slice(0, 3).forEach((tip, idx) => {
                const truncated = tip.length > 78 ? tip.substring(0, 78) + '...' : tip;
                ctx.fillText(`0${idx + 1}.  ${truncated}`, 150, 1035 + idx * 58);
            });

            // Footer
            ctx.fillStyle = '#6E6266';
            ctx.font = '500 20px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('heart-sense-87xw.vercel.app  •  100% Free & Zero Data Stored', 600, 1320);

            const link = document.createElement('a');
            link.download = `HeartSense-Love-Report-${analysis.score}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (e) {
            console.error('Failed to export canvas scorecard:', e);
            alert('Failed to generate image download. Please take a screenshot!');
        } finally {
            setIsDownloading(false);
        }
    };

    const breakdown = analysis.breakdown || {
        empathy: Math.min(100, Math.round(analysis.score * 0.95)),
        openness: Math.min(100, Math.round(analysis.score * 0.9)),
        respect: Math.min(100, Math.round(analysis.score * 1.02)),
        conflict: Math.min(100, Math.round(analysis.score * 0.88))
    };

    const dimensions = [
        { label: 'Empathy & Active Listening', value: breakdown.empathy },
        { label: 'Emotional Openness', value: breakdown.openness },
        { label: 'Patience & Mutual Respect', value: breakdown.respect },
        { label: 'Conflict De-escalation', value: breakdown.conflict },
    ];

    return (
        <div className="max-w-2xl w-full mx-auto animate-fade-in my-6 space-y-6">
            {/* Editorial Keepsake Certificate */}
            <div id="report-card" className="bg-surface p-6 sm:p-10 rounded-2xl shadow-[0_20px_50px_-24px_rgba(26,21,23,0.14)] border border-hairline relative">
                {/* Top Metadata */}
                <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-muted pb-5 border-b border-hairline">
                    <span>HeartSense Evaluation</span>
                    <span className="text-sage-700">Verified EQ</span>
                </div>

                {/* Title & Score */}
                <div className="py-7 text-center border-b border-hairline">
                    <h2 className={`font-display text-3xl sm:text-4xl font-semibold text-ink tracking-tight ${isBanglish ? 'font-bengali' : ''}`}>
                        {isBanglish ? 'ভালোবাসার রিপোর্ট কার্ড' : 'Your Love Report Card'}
                    </h2>
                    <p className="text-xs sm:text-sm text-muted mt-1.5">
                        {isBanglish ? 'An honest evaluation of your conversation dynamics' : 'An honest evaluation of your emotional communication'}
                    </p>

                    <div className="mt-6 flex items-baseline justify-center gap-1.5">
                        <span className="font-display text-7xl sm:text-8xl font-semibold text-crimson-500 tracking-tight leading-none">
                            {analysis.score}
                        </span>
                        <span className="font-display text-2xl text-muted">/ 100</span>
                    </div>

                    <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-sage-700">
                        {analysis.score >= 85 ? 'Exceptional Communicator' : analysis.score >= 70 ? 'Emotionally Aware & Thoughtful' : 'Growing & Learning'}
                    </p>
                </div>

                {/* Dimension Breakdown */}
                <div className="py-6 border-b border-hairline space-y-4">
                    <h4 className="font-mono text-[11px] uppercase tracking-widest text-muted">Communication Dimensions</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                        {dimensions.map((dim) => (
                            <div key={dim.label}>
                                <div className="flex justify-between text-xs font-medium text-ink mb-1.5">
                                    <span>{dim.label}</span>
                                    <span className="font-mono text-muted">{dim.value}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-paper rounded-full overflow-hidden border border-hairline/60">
                                    <div
                                        className="h-full bg-ink rounded-full transition-all duration-700"
                                        style={{ width: `${dim.value}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Qualitative Insights */}
                <div className="py-6 space-y-5">
                    <div className="bg-paper/70 p-5 rounded-xl border border-hairline">
                        <h3 className={`font-mono text-[11px] uppercase tracking-widest text-sage-700 ${isBanglish ? 'font-bengali' : ''}`}>
                            {isBanglish ? 'তোমার লাভার পার্সোনালিটি' : 'Lover Personality Type'}
                        </h3>
                        <p className={`font-display text-2xl font-semibold text-ink mt-1.5 ${isBanglish ? 'font-bengali' : ''}`}>
                            {analysis.personality}
                        </p>
                    </div>
                    
                    <div className="bg-paper/70 p-5 rounded-xl border border-hairline">
                        <h3 className={`font-mono text-[11px] uppercase tracking-widest text-sage-700 ${isBanglish ? 'font-bengali' : ''}`}>
                            {isBanglish ? 'তোমার জন্য পারফেক্ট পার্টনার' : 'Ideal Partner Match'}
                        </h3>
                        <p className="text-sm sm:text-base text-ink/90 mt-1.5 leading-relaxed">
                            {analysis.idealPartner}
                        </p>
                    </div>

                    <div className="bg-paper/70 p-5 rounded-xl border border-hairline">
                        <h3 className={`font-mono text-[11px] uppercase tracking-widest text-sage-700 ${isBanglish ? 'font-bengali' : ''}`}>
                            {isBanglish ? 'তোমার জন্য গ্রোথ টিপস' : 'Personalized Growth Tips'}
                        </h3>
                        <ul className="space-y-2.5 mt-3 text-sm text-ink/90">
                            {analysis.tips.map((tip, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <span className="font-mono text-xs text-crimson-500 mt-0.5">0{index + 1}</span>
                                    <span className="leading-relaxed">{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Export & Share Bar */}
                <div className="pt-5 border-t border-hairline flex flex-wrap items-center justify-center gap-2.5">
                    <button
                        onClick={handleDownloadCard}
                        disabled={isDownloading}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-ink hover:bg-crimson-600 text-paper font-semibold text-xs rounded-xl transition disabled:opacity-50"
                    >
                        <DownloadIcon className="w-4 h-4" />
                        <span>{isDownloading ? 'Generating...' : 'Download PNG'}</span>
                    </button>

                    <button
                        onClick={handleCopySummary}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-paper hover:bg-hairline/60 text-ink font-semibold text-xs rounded-xl border border-hairline transition"
                    >
                        {copied ? <CheckIcon className="w-4 h-4 text-sage-600" /> : <CopyIcon className="w-4 h-4" />}
                        <span>{copied ? 'Copied' : 'Copy Summary'}</span>
                    </button>

                    <button
                        onClick={handleNativeShare}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-paper hover:bg-hairline/60 text-ink font-semibold text-xs rounded-xl border border-hairline transition"
                    >
                        <ShareIcon className="w-4 h-4" />
                        <span>Share</span>
                    </button>
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col items-center justify-center gap-3 pt-1">
                <button
                    onClick={onStartNew}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-ink hover:bg-crimson-600 text-paper font-semibold text-sm rounded-xl shadow-sm transition-colors"
                >
                    <RefreshIcon className="w-4 h-4" />
                    <span>Practice Another Conversation</span>
                </button>
                <p className="text-xs text-muted inline-flex items-center gap-1.5">
                    <ShieldCheckIcon className="w-3.5 h-3.5 text-sage-600" />
                    <span>Zero data saved &middot; Your chat clears automatically when you start fresh.</span>
                </p>
            </div>
        </div>
    );
};

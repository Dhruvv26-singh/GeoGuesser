import React, { useState } from 'react';
import { getAIHint } from '../services/aiEngine';
import { Lightbulb, X, Sparkles, AlertCircle, Compass, ShieldAlert, CheckCircle2, Cpu } from 'lucide-react';

export default function HintModal({
  isOpen,
  onClose,
  location,
  onApplyPenalty,
  revealedHints,
  setRevealedHints,
  onOpenAISettings
}) {
  const [loadingLevel, setLoadingLevel] = useState(null);
  const [hintSources, setHintSources] = useState({});

  if (!isOpen || !location) return null;

  const hintTiers = [
    {
      level: 1,
      title: 'Tier 1: Hemisphere & Climate',
      penalty: 300,
      description: 'Reveals solar angles, equatorial distance, and general hemispheric biome.',
      icon: '🌦️'
    },
    {
      level: 2,
      title: 'Tier 2: Culture & Infrastructure',
      penalty: 700,
      description: 'Reveals language scripts, driving side, and regional architectural cues.',
      icon: '🏛️'
    },
    {
      level: 3,
      title: 'Tier 3: Iconic Landmark Clue',
      penalty: 1200,
      description: 'Reveals historical significance and geographical landmarks nearby.',
      icon: '🗺️'
    }
  ];

  const handleUnlockHint = async (tier) => {
    if (revealedHints[tier.level]) return;

    setLoadingLevel(tier.level);
    try {
      const hintData = await getAIHint(location, tier.level);
      setRevealedHints((prev) => ({
        ...prev,
        [tier.level]: hintData.text
      }));
      setHintSources((prev) => ({
        ...prev,
        [tier.level]: hintData.source
      }));
      onApplyPenalty(hintData.cost || tier.penalty);
    } catch (e) {
      console.warn('Hint unlock error:', e);
    } finally {
      setLoadingLevel(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl glass-panel-glow p-6 md:p-8 shadow-2xl border border-slate-700/80">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-lg text-white flex items-center gap-2">
                <span>AI Satellite Clues</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  Gemini & Groq Ready
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Unlock clues at the cost of a round score penalty
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Clue Tiers */}
        <div className="mt-5 space-y-3.5">
          {hintTiers.map((tier) => {
            const isUnlocked = Boolean(revealedHints[tier.level]);
            const isLoading = loadingLevel === tier.level;
            const source = hintSources[tier.level];

            return (
              <div
                key={tier.level}
                className={`p-4 rounded-2xl border transition-all ${
                  isUnlocked
                    ? 'bg-amber-950/20 border-amber-500/40 shadow-inner'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{tier.icon}</span>
                    <div>
                      <h4 className="font-heading font-bold text-sm text-slate-200">
                        {tier.title}
                      </h4>
                      <span className="text-[10px] text-rose-400 font-mono font-semibold">
                        -{tier.penalty} pts penalty
                      </span>
                    </div>
                  </div>

                  {!isUnlocked ? (
                    <button
                      onClick={() => handleUnlockHint(tier)}
                      disabled={isLoading}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-heading font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Unlock Clue</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Unlocked</span>
                    </span>
                  )}
                </div>

                {isUnlocked ? (
                  <div className="mt-3 pt-3 border-t border-amber-500/20">
                    <p className="text-xs text-amber-100 font-medium leading-relaxed">
                      "{revealedHints[tier.level]}"
                    </p>
                    {source && (
                      <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-amber-400/80 font-mono">
                        <Cpu className="w-3 h-3" />
                        <span>Source: {source}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-slate-400 leading-normal">
                    {tier.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer & Engine Switcher */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
          {onOpenAISettings ? (
            <button
              onClick={onOpenAISettings}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 hover:underline"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Configure AI Key (Gemini/Groq)</span>
            </button>
          ) : (
            <span className="text-[11px] text-slate-500">Zero-Key Engine Active</span>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
          >
            Back to Panorama
          </button>
        </div>
      </div>
    </div>
  );
}

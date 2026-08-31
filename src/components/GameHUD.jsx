import React from 'react';
import { Globe, Lightbulb, Trophy, User, Sparkles, Map, Cpu } from 'lucide-react';

export default function GameHUD({
  roundNumber = 1,
  totalRounds = 5,
  currentScore = 0,
  roundScore = null,
  activePackName = 'Global Odyssey',
  onOpenHints,
  onOpenLeaderboard,
  onOpenProfile,
  onOpenAISettings,
  onQuitGame,
  hintsUsedCount = 0
}) {
  return (
    <header className="absolute top-4 left-4 right-4 z-20 pointer-events-none flex items-center justify-between">
      {/* Left: Brand & Game Mode Badge */}
      <div className="flex items-center gap-3 pointer-events-auto">
        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl glass-hud shadow-xl border border-slate-700/60">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center shadow-md shadow-cyan-500/20">
            <Globe className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="font-heading font-extrabold text-sm tracking-wide bg-gradient-to-r from-white via-slate-200 to-cyan-300 bg-clip-text text-transparent">
              GeoQuest
            </div>
            <div className="text-[10px] font-medium text-cyan-400/90 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block" />
              {activePackName}
            </div>
          </div>
        </div>

        <button
          onClick={onQuitGame}
          title="Return to Menu"
          className="hidden sm:flex px-3 py-2 rounded-xl glass-hud hover:bg-slate-800/80 text-xs font-medium text-slate-400 hover:text-slate-200 border border-slate-700/60 transition-all"
        >
          Exit
        </button>
      </div>

      {/* Center: Round Progress Indicators */}
      <div className="pointer-events-auto flex flex-col items-center">
        <div className="px-5 py-2 rounded-2xl glass-hud border border-slate-700/60 shadow-xl flex items-center gap-3">
          <div className="text-xs font-heading font-bold text-slate-300 uppercase tracking-wider">
            Round <span className="text-cyan-400 font-extrabold">{roundNumber}</span> / {totalRounds}
          </div>

          {/* 5-step round dots */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalRounds }).map((_, idx) => {
              const isPast = idx + 1 < roundNumber;
              const isCurrent = idx + 1 === roundNumber;
              return (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isPast
                      ? 'w-4 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                      : isCurrent
                      ? 'w-6 bg-gradient-to-r from-cyan-400 to-teal-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]'
                      : 'w-2 bg-slate-700'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Right: Score Counter & Actions */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {/* AI Hint Trigger */}
        <button
          onClick={onOpenHints}
          title="Get AI Clues"
          className="relative px-3 py-2 rounded-xl glass-hud hover:bg-amber-500/10 border border-slate-700 hover:border-amber-500/50 text-amber-400 flex items-center gap-1.5 text-xs font-bold transition-all group shadow-lg"
        >
          <Lightbulb className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span className="hidden md:inline">HINTS</span>
          {hintsUsedCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
              {hintsUsedCount}
            </span>
          )}
        </button>

        {/* Total Score Display */}
        <div className="px-4 py-2 rounded-xl glass-hud border border-slate-700/60 shadow-xl flex items-center gap-2">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Score</div>
            <div className="text-sm md:text-base font-heading font-extrabold text-emerald-400">
              {currentScore.toLocaleString()}
              <span className="text-[10px] text-slate-400 font-normal ml-1">/ 25,000</span>
            </div>
          </div>
        </div>

        {/* AI & Engine Settings Trigger */}
        {onOpenAISettings && (
          <button
            onClick={onOpenAISettings}
            title="Maps & AI Settings"
            className="p-2.5 rounded-xl glass-hud hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-cyan-400 transition-all shadow-lg"
          >
            <Cpu className="w-4 h-4" />
          </button>
        )}

        {/* Leaderboard Trigger */}
        <button
          onClick={onOpenLeaderboard}
          title="Leaderboard"
          className="p-2.5 rounded-xl glass-hud hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-amber-400 transition-all shadow-lg"
        >
          <Trophy className="w-4 h-4" />
        </button>

        {/* Profile / Auth Trigger */}
        <button
          onClick={onOpenProfile}
          title="Player Profile"
          className="p-2.5 rounded-xl glass-hud hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-cyan-400 transition-all shadow-lg"
        >
          <User className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}

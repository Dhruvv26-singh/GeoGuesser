import React, { useEffect, useState } from 'react';
import { getLeaderboard, isSupabaseConfigured } from '../services/supabase';
import { Trophy, X, Globe, Medal, Calendar, ShieldCheck, Flame, RefreshCw } from 'lucide-react';

export default function LeaderboardModal({ isOpen, onClose }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterMode, setFilterMode] = useState('all');

  const loadScores = async () => {
    setIsLoading(true);
    try {
      const data = await getLeaderboard();
      setLeaderboard(data);
    } catch (e) {
      console.warn('Leaderboard error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadScores();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl glass-panel-glow p-6 md:p-8 shadow-2xl border border-slate-700/80 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-lg text-white flex items-center gap-2">
                <span>Global Hall of Fame</span>
                {isSupabaseConfigured && (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Live Supabase
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                Top explorers with the highest 5-round scores
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadScores}
              title="Refresh Leaderboard"
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Leaderboard Table List */}
        <div className="mt-5 flex-1 overflow-y-auto space-y-2.5 pr-1">
          {isLoading ? (
            <div className="py-16 text-center">
              <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-slate-400">Fetching world rankings...</p>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-sm">
              No games logged yet. Be the first explorer on the board!
            </div>
          ) : (
            leaderboard.map((entry, idx) => {
              const isTop1 = entry.rank === 1;
              const isTop2 = entry.rank === 2;
              const isTop3 = entry.rank === 3;

              return (
                <div
                  key={entry.id || idx}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                    isTop1
                      ? 'bg-gradient-to-r from-amber-500/15 via-slate-900/80 to-slate-900/80 border-amber-500/40 shadow-lg shadow-amber-500/5'
                      : isTop2
                      ? 'bg-gradient-to-r from-slate-400/10 via-slate-900/80 to-slate-900/80 border-slate-400/30'
                      : isTop3
                      ? 'bg-gradient-to-r from-amber-700/15 via-slate-900/80 to-slate-900/80 border-amber-700/30'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Rank Badge */}
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center font-heading font-black text-xs">
                      {isTop1 ? (
                        <span className="text-xl">🥇</span>
                      ) : isTop2 ? (
                        <span className="text-xl">🥈</span>
                      ) : isTop3 ? (
                        <span className="text-xl">🥉</span>
                      ) : (
                        <span className="text-slate-400 font-mono">#{entry.rank}</span>
                      )}
                    </div>

                    <div>
                      <div className="font-heading font-bold text-sm text-slate-100 flex items-center gap-1.5">
                        <span>{entry.name}</span>
                        {isTop1 && <Flame className="w-3.5 h-3.5 text-amber-400" />}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-2">
                        <span>{entry.mode || 'World'}</span>
                        <span>&bull;</span>
                        <span>{entry.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <div className="text-base font-heading font-extrabold text-emerald-400 font-mono">
                      {entry.score.toLocaleString()}
                    </div>
                    <div className="text-[9px] uppercase font-bold text-slate-500">POINTS</div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="text-[11px]">Rankings based on total 5-round score</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

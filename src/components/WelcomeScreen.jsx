import React, { useState } from 'react';
import { REGION_PACKS } from '../services/locations';
import { Globe, Play, Trophy, User, Sparkles, Compass, MapPin, Award, CheckCircle2, ShoppingBag, Users, ChevronRight, Zap, Crown, Flame } from 'lucide-react';

export default function WelcomeScreen({
  onStartGame,
  onOpenLeaderboard,
  onOpenProfile,
  onOpenAvatarShop,
  onOpenPartyModal,
  onOpenAISettings,
  playerName = 'Explorer',
  selectedPack = 'abandoned',
  onSelectPack,
  userCoins = 1500
}) {
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  // Read saved avatar config
  const avatarConfig = (() => {
    try {
      const saved = localStorage.getItem('geoquest_avatar_config');
      return saved ? JSON.parse(saved) : { skinColor: '#ffd1a4', hat: '🤠', outfit: '🧥', glasses: '🕶️', title: 'World Explorer' };
    } catch {
      return { skinColor: '#ffd1a4', hat: '🤠', outfit: '🧥', glasses: '🕶️', title: 'World Explorer' };
    }
  })();

  return (
    <div className="relative w-full h-full min-h-screen bg-[#07090e] overflow-y-auto flex flex-col items-center justify-start select-none">
      
      {/* 1. OFFICIAL GEOGUESSR TOP NAVIGATION BAR */}
      <header className="w-full border-b border-slate-800/80 bg-[#0b0e17]/90 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-8 py-3 flex items-center justify-between">
        {/* Left: Brand Logo & Navigation Links */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#00f0b5] to-teal-400 flex items-center justify-center shadow-lg shadow-[#00f0b5]/25">
              <MapPin className="w-5 h-5 text-slate-950 fill-slate-950" />
            </div>
            <span className="font-heading font-black text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-[#00f0b5] bg-clip-text text-transparent">
              GeoGuessr
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-1.5 text-xs font-heading font-bold text-slate-300">
            <button
              onClick={() => onSelectPack('abandoned')}
              className="px-3 py-1.5 rounded-xl hover:bg-slate-800/80 text-white transition-colors"
            >
              Play
            </button>
            <button
              onClick={onOpenAvatarShop}
              className="px-3 py-1.5 rounded-xl bg-[#00f0b5]/10 text-[#00f0b5] border border-[#00f0b5]/30 hover:bg-[#00f0b5]/20 flex items-center gap-1.5 transition-all"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Avatar Shop</span>
            </button>
            <button
              onClick={onOpenPartyModal}
              className="px-3 py-1.5 rounded-xl hover:bg-slate-800/80 text-purple-400 flex items-center gap-1.5 transition-colors"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Party Code</span>
            </button>
            <button
              onClick={onOpenAISettings}
              className="px-3 py-1.5 rounded-xl hover:bg-slate-800/80 text-cyan-400 transition-colors"
            >
              AI & Maps
            </button>
          </nav>
        </div>

        {/* Right: Currency, Leaderboard, Avatar Profile */}
        <div className="flex items-center gap-3">
          {/* GeoCoins Counter */}
          <button
            onClick={onOpenAvatarShop}
            title="Open Avatar Shop"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 hover:border-amber-500/60 shadow-inner transition-all"
          >
            <span className="text-sm">🪙</span>
            <span className="font-heading font-black text-xs text-amber-300">{userCoins.toLocaleString()}</span>
          </button>

          {/* Leaderboard Button */}
          <button
            onClick={onOpenLeaderboard}
            className="px-3 py-1.5 rounded-xl glass-hud hover:bg-slate-800 border border-slate-700/60 text-slate-200 hover:text-amber-400 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Ranks</span>
          </button>

          {/* User Mini Card */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 p-1 pl-2.5 rounded-2xl bg-slate-900 border border-slate-700/80 hover:border-[#00f0b5]/50 transition-all shadow-md"
          >
            <span className="text-xs font-heading font-bold text-slate-200 hidden sm:inline">{playerName}</span>
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-sm shadow-inner"
              style={{ backgroundColor: avatarConfig.skinColor }}
            >
              {avatarConfig.glasses || '🕶️'}
            </div>
          </button>
        </div>
      </header>

      {/* 2. HERO HIGHLIGHT: WORLD CHAMPIONSHIP & AVATAR SPOTLIGHT */}
      <div className="w-full max-w-6xl px-4 sm:px-8 py-6 flex flex-col items-center">
        
        {/* Banner Card */}
        <div className="w-full rounded-3xl bg-gradient-to-r from-[#0d1f1b] via-[#101928] to-[#1a1226] border border-[#00f0b5]/30 p-6 md:p-8 shadow-2xl relative overflow-hidden mb-8">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[#00f0b5]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-0 right-0 p-4 opacity-10 font-heading font-black text-8xl text-white pointer-events-none">
            2026
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00f0b5]/15 border border-[#00f0b5]/30 text-[#00f0b5] text-[11px] font-mono font-bold mb-3">
                <Crown className="w-3.5 h-3.5" />
                <span>OFFICIAL SEASON 2026</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-white leading-tight">
                Explore the World. <br />
                <span className="bg-gradient-to-r from-[#00f0b5] via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  Guess Any Location.
                </span>
              </h1>
              <p className="mt-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Experience real 360° panoramas from forgotten ghost towns and famous world wonders to desolate desert highways. Drop your pin and score up to 25,000 points!
              </p>
            </div>

            {/* Quick Action Box */}
            <div className="flex flex-col gap-3 w-full md:w-auto shrink-0">
              <button
                onClick={() => onStartGame(selectedPack)}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#00f0b5] via-teal-400 to-emerald-400 hover:from-[#1bf7aa] hover:to-emerald-300 text-slate-950 font-heading font-black text-base md:text-lg flex items-center justify-center gap-3 shadow-xl shadow-[#00f0b5]/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Play className="w-5 h-5 fill-slate-950" />
                <span>PLAY NOW</span>
              </button>

              <button
                onClick={onOpenAvatarShop}
                className="px-6 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-[#00f0b5] border border-[#00f0b5]/40 text-xs font-heading font-bold flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Customize Avatar & Gear ↗</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3. GAME MAPS & REGION PACK SELECTION */}
        <div className="w-full mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-heading font-black text-xl text-white tracking-wide flex items-center gap-2">
                <span>CHOOSE MAP PACK</span>
                <span className="text-xs font-normal text-[#00f0b5] font-mono">({REGION_PACKS.length} Modes)</span>
              </h2>
              <p className="text-xs text-slate-400">Select your favorite terrain or thematic challenge</p>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {REGION_PACKS.map((pack) => {
              const isSelected = selectedPack === pack.id;
              return (
                <div
                  key={pack.id}
                  onClick={() => onSelectPack(pack.id)}
                  className={`p-5 rounded-3xl border cursor-pointer transition-all duration-200 flex flex-col justify-between relative overflow-hidden group ${
                    isSelected
                      ? 'bg-gradient-to-b from-[#131d2b] to-[#0c131d] border-[#00f0b5] shadow-2xl shadow-[#00f0b5]/20 scale-[1.03]'
                      : 'bg-[#0f1420]/80 border-slate-800 hover:border-slate-700 hover:bg-[#141b2b]'
                  }`}
                >
                  {/* Top Row: Icon & Status */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                      {pack.icon}
                    </div>
                    {isSelected ? (
                      <span className="px-2.5 py-1 rounded-full bg-[#00f0b5] text-slate-950 font-heading font-black text-[10px] uppercase shadow-md">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="text-slate-600 group-hover:text-slate-400 text-xs">
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-heading font-black text-base text-white group-hover:text-[#00f0b5] transition-colors">
                      {pack.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      {pack.description}
                    </p>
                  </div>

                  {/* Start Round Button on Active Card */}
                  {isSelected && (
                    <div className="mt-4 pt-3 border-t border-slate-700/60">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onStartGame(pack.id);
                        }}
                        className="w-full py-2.5 rounded-xl bg-[#00f0b5] hover:bg-[#1bf7aa] text-slate-950 font-heading font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-[#00f0b5]/25"
                      >
                        <Play className="w-3.5 h-3.5 fill-slate-950" />
                        <span>PLAY 5 ROUNDS</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. FOOTER INFO */}
        <div className="w-full pt-8 pb-12 border-t border-slate-800 text-center flex flex-col items-center gap-2">
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>© 2026 GeoGuessr Pro Edition</span>
            <span>&bull;</span>
            <button onClick={onOpenAvatarShop} className="hover:text-[#00f0b5] transition-colors">Avatar Locker</button>
            <span>&bull;</span>
            <button onClick={onOpenPartyModal} className="hover:text-purple-400 transition-colors">Party Lobbies</button>
            <span>&bull;</span>
            <button onClick={onOpenAISettings} className="hover:text-cyan-400 transition-colors">AI Clues Engine</button>
          </div>
        </div>
      </div>
    </div>
  );
}

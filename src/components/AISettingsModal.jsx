import React, { useState } from 'react';
import { getStoredApiKeys, saveApiKeys, AI_PROVIDERS } from '../services/aiEngine';
import { Settings, X, Key, Cpu, Sparkles, Check, Info, ShieldCheck, Map } from 'lucide-react';

export default function AISettingsModal({ isOpen, onClose }) {
  const [config, setConfig] = useState(() => getStoredApiKeys());
  const [savedStatus, setSavedStatus] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    saveApiKeys(config);
    setSavedStatus(true);
    setTimeout(() => {
      setSavedStatus(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl glass-panel-glow p-6 md:p-8 shadow-2xl border border-slate-700/80 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-lg text-white">
                Engine & Maps Intelligence
              </h2>
              <p className="text-xs text-slate-400">
                100% Free out-of-the-box + optional AI API keys
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

        <form onSubmit={handleSave} className="mt-5 space-y-5">
          
          {/* Active Free Mode Banner */}
          <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-200">
              <span className="font-bold block text-emerald-300">Free Maps & Offline AI Engine Ready!</span>
              The map includes 4 free layers (Satellite, Street, OSM, Dark) and offline AI geography heuristics that require zero API keys.
            </div>
          </div>

          {/* Provider Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Select AI Hint Engine
            </label>
            <div className="grid grid-cols-1 gap-2">
              {AI_PROVIDERS.map((provider) => {
                const isSelected = config.provider === provider.id;
                return (
                  <div
                    key={provider.id}
                    onClick={() => setConfig((prev) => ({ ...prev, provider: provider.id }))}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-400 shadow-md'
                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">{provider.name}</span>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{provider.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Optional Gemini Key */}
          <div>
            <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              <span>Google Gemini API Key (Optional)</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:underline text-[10px] lowercase"
              >
                get free key ↗
              </a>
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="AIzaSy..."
                value={config.gemini}
                onChange={(e) => setConfig((prev) => ({ ...prev, gemini: e.target.value }))}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-colors font-mono"
              />
            </div>
          </div>

          {/* Optional Groq Key */}
          <div>
            <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              <span>Groq Cloud API Key (Optional)</span>
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:underline text-[10px] lowercase"
              >
                get free key ↗
              </a>
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="gsk_..."
                value={config.groq}
                onChange={(e) => setConfig((prev) => ({ ...prev, groq: e.target.value }))}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-colors font-mono"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-heading font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95"
            >
              {savedStatus ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Save Engine Preferences</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

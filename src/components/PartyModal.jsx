import React, { useState } from 'react';
import { Users, X, Play, Copy, Check, Sparkles, Shield, Trophy } from 'lucide-react';

export default function PartyModal({ isOpen, onClose, onStartPartyGame }) {
  const [partyCode, setPartyCode] = useState(['', '', '', '', '']);
  const [createdRoomCode, setCreatedRoomCode] = useState('GEO-26X');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCodeChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const next = [...partyCode];
    next[index] = value.toUpperCase();
    setPartyCode(next);

    // Auto-focus next input
    if (value && index < 4) {
      const nextInput = document.getElementById(`party-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(createdRoomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-[#0e121b] border border-slate-700/80 shadow-2xl p-6 md:p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-lg text-white">
                Play with Friends
              </h2>
              <p className="text-xs text-slate-400">
                Join a party or create your own custom lobby
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

        <div className="mt-6 space-y-6">
          
          {/* Join with 5-digit Room Code */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 text-center">
              Enter 5-Digit Party Code
            </label>

            <div className="flex items-center justify-center gap-2 mb-4">
              {partyCode.map((val, idx) => (
                <input
                  key={idx}
                  id={`party-input-${idx}`}
                  type="text"
                  maxLength={1}
                  value={val}
                  onChange={(e) => handleCodeChange(idx, e.target.value)}
                  className="w-12 h-14 text-center font-heading font-black text-xl text-[#00f0b5] bg-slate-950 border-2 border-slate-700 focus:border-[#00f0b5] rounded-xl outline-none transition-all uppercase"
                />
              ))}
            </div>

            <button
              onClick={() => {
                onClose();
                onStartPartyGame('world');
              }}
              disabled={partyCode.some((c) => !c)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00f0b5] to-teal-400 hover:from-[#1bf7aa] hover:to-teal-300 text-slate-950 font-heading font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#00f0b5]/20 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>JOIN PARTY & PLAY</span>
            </button>
          </div>

          {/* Create New Lobby */}
          <div className="p-5 rounded-2xl bg-purple-950/20 border border-purple-500/30">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-heading font-bold text-sm text-purple-300">Host New Room</h4>
                <p className="text-xs text-slate-400">Share your lobby code with friends</p>
              </div>
              <span className="px-3 py-1.5 rounded-xl bg-purple-900/60 text-purple-200 font-mono font-bold text-sm border border-purple-700/60">
                {createdRoomCode}
              </span>
            </div>

            <button
              onClick={handleCopyCode}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs font-bold flex items-center justify-center gap-2 border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Code Copied to Clipboard!' : 'Copy Invite Link'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

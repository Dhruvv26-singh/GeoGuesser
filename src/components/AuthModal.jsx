import React, { useState } from 'react';
import {
  isSupabaseConfigured,
  authSignIn,
  authSignUp,
  authSignOut,
  getLocalProfile,
  saveLocalProfile
} from '../services/supabase';
import { User, X, LogIn, UserPlus, LogOut, Check, Sparkles, Shield, AlertCircle } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, currentUser, onUserChange }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Local profile state
  const [guestName, setGuestName] = useState(() => getLocalProfile().username);
  const [localStats, setLocalStats] = useState(() => getLocalProfile());

  if (!isOpen) return null;

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        const res = await authSignUp(email, password, username);
        setSuccessMsg('Account created successfully! You can now play and save scores.');
        if (onUserChange) onUserChange(res.data?.user);
      } else {
        const res = await authSignIn(email, password);
        setSuccessMsg('Signed in successfully!');
        if (onUserChange) onUserChange(res.data?.user);
      }
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestNameSave = (e) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    const prof = getLocalProfile();
    prof.username = guestName.trim();
    saveLocalProfile(prof);
    setLocalStats(prof);
    setSuccessMsg('Display name updated!');
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  const handleSignOut = async () => {
    await authSignOut();
    if (onUserChange) onUserChange(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl glass-panel-glow p-6 md:p-8 shadow-2xl border border-slate-700/80">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-lg text-white">
                Player Profile & Auth
              </h2>
              <p className="text-xs text-slate-400">
                {isSupabaseConfigured ? 'Sync scores across devices' : 'Local guest profile manager'}
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

        {/* Stats Preview */}
        <div className="mt-5 grid grid-cols-3 gap-2.5 text-center">
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] uppercase font-bold text-slate-400">Games</div>
            <div className="text-lg font-heading font-extrabold text-white">
              {localStats.total_games || 0}
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] uppercase font-bold text-slate-400">High Score</div>
            <div className="text-lg font-heading font-extrabold text-emerald-400">
              {(localStats.high_score || 0).toLocaleString()}
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] uppercase font-bold text-slate-400">Total Pts</div>
            <div className="text-lg font-heading font-extrabold text-cyan-400">
              {(localStats.total_score || 0).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Supabase Live Auth Form vs Guest Profile Form */}
        {isSupabaseConfigured && !currentUser ? (
          <form onSubmit={handleAuthSubmit} className="mt-5 space-y-3.5">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>{successMsg}</span>
              </div>
            )}

            {isSignUp && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Explorer Handle</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. MapMaster42"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-heading font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all"
            >
              {isSignUp ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
              <span>{isLoading ? 'Processing...' : isSignUp ? 'Sign Up with Supabase' : 'Sign In'}</span>
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs text-cyan-400 hover:underline"
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
              </button>
            </div>
          </form>
        ) : (
          /* Guest Profile Name Changer */
          <form onSubmit={handleGuestNameSave} className="mt-5 space-y-4">
            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>{successMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Explorer Handle / Nickname
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Explorer Name"
                maxLength={24}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 font-heading font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Save Display Name</span>
            </button>

            {currentUser && (
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            )}
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="text-[11px] flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            100% Free & Open Tier
          </span>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

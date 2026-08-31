import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import L from 'leaflet';
import { getFinalRank, formatDistance } from '../services/scoring';
import { recordGameScore } from '../services/supabase';
import { Trophy, Share2, RotateCcw, Award, Check, Map, Compass, ArrowRight, MessageCircle } from 'lucide-react';

export default function GameSummaryModal({
  gameSummary,
  onPlayAgain,
  onChangePack,
  onOpenLeaderboard,
  playerName = 'Explorer'
}) {
  const summaryMapRef = useRef(null);
  const [copiedToast, setCopiedToast] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const { totalScore, rounds, packName } = gameSummary;
  const rank = getFinalRank(totalScore);

  // Trigger Confetti Celebration
  useEffect(() => {
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 400);
    } catch (e) {
      // ignore
    }

    // Auto-record score to Supabase / LocalStorage
    recordGameScore({
      totalScore,
      gameMode: packName || 'world',
      roundsData: rounds,
      playerName
    }).then(() => {
      setIsSaved(true);
    });
  }, [totalScore, rounds, packName, playerName]);

  // Multi-Pin Overview Leaflet Map
  useEffect(() => {
    if (!summaryMapRef.current || !rounds || rounds.length === 0) return;

    const map = L.map(summaryMapRef.current, {
      zoomControl: false,
      attributionControl: false,
      worldCopyJump: true
    });

    // Free Google Satellite Hybrid tile layer (Zero API key required)
    L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      maxZoom: 20
    }).addTo(map);

    L.control.zoom({ position: 'bottomleft' }).addTo(map);

    const allPoints = [];

    // Distinct colors for each round trajectory
    const roundColors = ['#f43f5e', '#3b82f6', '#eab308', '#a855f7', '#06b6d4'];

    rounds.forEach((rnd, idx) => {
      const color = roundColors[idx % roundColors.length];

      // Guess Pin
      const guessIcon = L.divIcon({
        className: 'round-pin',
        html: `
          <div class="w-6 h-6 rounded-full bg-slate-900 border-2 border-rose-500 shadow-md flex items-center justify-center text-[10px] font-extrabold text-white">
            ${idx + 1}
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      // True Pin
      const trueIcon = L.divIcon({
        className: 'round-true-pin',
        html: `
          <div class="w-6 h-6 rounded-full bg-emerald-500 border-2 border-white shadow-md flex items-center justify-center text-[10px] font-extrabold text-slate-950">
            ${idx + 1}
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      L.marker([rnd.guessCoords.lat, rnd.guessCoords.lng], { icon: guessIcon }).addTo(map);
      L.marker([rnd.actualCoords.lat, rnd.actualCoords.lng], { icon: trueIcon }).addTo(map);

      // Trajectory Line
      L.polyline(
        [
          [rnd.guessCoords.lat, rnd.guessCoords.lng],
          [rnd.actualCoords.lat, rnd.actualCoords.lng]
        ],
        { color, weight: 2.5, opacity: 0.85, dashArray: '4, 6' }
      ).addTo(map);

      allPoints.push([rnd.guessCoords.lat, rnd.guessCoords.lng]);
      allPoints.push([rnd.actualCoords.lat, rnd.actualCoords.lng]);
    });

    if (allPoints.length > 0) {
      map.fitBounds(L.latLngBounds(allPoints), { padding: [40, 40], maxZoom: 10 });
    }

    return () => {
      map.remove();
    };
  }, [rounds]);

  // Share text builder
  const generateShareText = () => {
    const roundScoresEmoji = rounds
      .map((r) => (r.roundScore >= 4500 ? '🟢' : r.roundScore >= 2500 ? '🟡' : '🔴'))
      .join(' ');

    return `🌍 GeoQuest Score: ${totalScore.toLocaleString()} / 25,000 pts!\nRank: ${rank.rank} ${rank.emoji}\n${roundScoresEmoji}\nCan you beat my score? Play free at https://geoquest.vercel.app`;
  };

  const handleCopyShare = () => {
    const text = generateShareText();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(generateShareText());
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[820px] rounded-3xl overflow-hidden glass-panel-glow border border-slate-700/80 flex flex-col md:flex-row shadow-2xl">
        
        {/* Left Side: Summary Map showing all 5 rounds */}
        <div className="relative w-full md:w-1/2 h-2/5 md:h-full bg-slate-900">
          <div ref={summaryMapRef} className="w-full h-full" />
          
          <div className="absolute top-4 left-4 z-[1000] px-3.5 py-1.5 rounded-xl bg-slate-950/85 border border-slate-800 text-xs backdrop-blur-md shadow-lg flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-200">5-Round Trajectory Overview</span>
          </div>
        </div>

        {/* Right Side: Score Card, Rank, Breakdown & Actions */}
        <div className="w-full md:w-1/2 h-3/5 md:h-full p-6 md:p-8 flex flex-col justify-between overflow-y-auto bg-slate-900/70 backdrop-blur-md">
          <div>
            {/* Header Rank Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{rank.emoji}</span>
                <div>
                  <h2 className="text-xl md:text-2xl font-heading font-black bg-gradient-to-r from-white via-slate-100 to-amber-300 bg-clip-text text-transparent">
                    {rank.rank}
                  </h2>
                  <p className="text-xs text-slate-400">{rank.description}</p>
                </div>
              </div>

              {isSaved && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Score Saved
                </span>
              )}
            </div>

            {/* Big Total Score Card */}
            <div className="mt-5 p-5 rounded-2xl bg-gradient-to-br from-slate-950/80 to-slate-900/80 border border-slate-800 flex items-center justify-between shadow-xl">
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Final Game Score</div>
                <div className="text-3xl md:text-5xl font-heading font-black text-emerald-400 tracking-tight">
                  {totalScore.toLocaleString()}
                  <span className="text-sm font-normal text-slate-400 ml-1.5">/ 25,000</span>
                </div>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shadow-lg">
                <Trophy className="w-7 h-7 text-amber-400" />
              </div>
            </div>

            {/* Round Breakdown List */}
            <div className="mt-5">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Round Breakdown</div>
              <div className="space-y-2">
                {rounds.map((rnd, i) => (
                  <div
                    key={i}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-center justify-between text-xs hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 font-bold flex items-center justify-center text-[10px]">
                        {i + 1}
                      </span>
                      <span className="font-medium text-slate-200 truncate max-w-[150px] md:max-w-[190px]">
                        {rnd.location?.name || `Location #${i + 1}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 font-mono text-[11px]">
                        {formatDistance(rnd.distanceKm)}
                      </span>
                      <span className="font-extrabold text-emerald-400 font-mono">
                        +{rnd.roundScore}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-4 border-t border-slate-800 space-y-2.5">
            <div className="grid grid-cols-2 gap-2.5">
              {/* WhatsApp Share */}
              <button
                onClick={handleWhatsAppShare}
                className="py-2.5 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>

              {/* Copy Score */}
              <button
                onClick={handleCopyShare}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
              >
                {copiedToast ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                <span>{copiedToast ? 'Copied!' : 'Copy Score'}</span>
              </button>
            </div>

            {/* Play Again Primary Button */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={onPlayAgain}
                className="py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-heading font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <RotateCcw className="w-4 h-4 stroke-[2.5]" />
                <span>PLAY AGAIN</span>
              </button>

              <button
                onClick={onOpenLeaderboard}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 font-heading font-bold text-sm flex items-center justify-center gap-2 transition-all"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>LEADERBOARD</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

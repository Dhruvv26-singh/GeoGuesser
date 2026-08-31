import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { formatDistance, getScoreBadge } from '../services/scoring';
import { reverseGeocode } from '../services/reverseGeocode';
import { fetchLocationWikiTrivia } from '../services/wikiTrivia';
import { rewriteTriviaWithAI } from '../services/groqAI';
import { ArrowRight, MapPin, Award, BookOpen, ExternalLink, Sparkles, Navigation2 } from 'lucide-react';

export default function RoundRevealModal({
  roundResult,
  roundIndex,
  totalRounds,
  onNextRound,
  isFinalRound
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const [locationDetails, setLocationDetails] = useState({
    formatted: roundResult.location?.name || 'Loading location...',
    flag: '🌍'
  });
  const [wikiTrivia, setWikiTrivia] = useState(null);
  const [aiTriviaQuote, setAiTriviaQuote] = useState('');
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);

  const { guessCoords, actualCoords, distanceKm, roundScore, location } = roundResult;
  const badge = getScoreBadge(roundScore);

  // Initialize Split Comparison Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false,
      worldCopyJump: true
    });

    // Free Google Satellite Hybrid tile layer (Zero API key required)
    L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      maxZoom: 20
    }).addTo(map);

    L.control.zoom({ position: 'bottomleft' }).addTo(map);

    // 1. Guess Marker (Crimson)
    const guessPinHtml = `
      <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-full">
        <div class="w-7 h-7 rounded-full bg-rose-600 border-2 border-white shadow-lg flex items-center justify-center">
          <div class="w-2 h-2 rounded-full bg-white"></div>
        </div>
        <div class="absolute -bottom-1 w-2 h-2 bg-rose-600 rotate-45"></div>
      </div>
    `;
    const guessIcon = L.divIcon({
      className: 'custom-pin-guess',
      html: guessPinHtml,
      iconSize: [28, 28],
      iconAnchor: [14, 28]
    });

    // 2. True Marker (Emerald Flag)
    const truePinHtml = `
      <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-full">
        <div class="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white shadow-[0_0_15px_rgba(16,185,129,0.8)] flex items-center justify-center text-slate-950 font-bold text-xs">
          🏁
        </div>
        <div class="absolute -bottom-1 w-2 h-2 bg-emerald-500 rotate-45"></div>
      </div>
    `;
    const trueIcon = L.divIcon({
      className: 'custom-pin-true',
      html: truePinHtml,
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });

    const guessMarker = L.marker([guessCoords.lat, guessCoords.lng], { icon: guessIcon }).addTo(map);
    const trueMarker = L.marker([actualCoords.lat, actualCoords.lng], { icon: trueIcon }).addTo(map);

    // 3. Polyline between Guess and True location
    const lineCoords = [
      [guessCoords.lat, guessCoords.lng],
      [actualCoords.lat, actualCoords.lng]
    ];

    const polyline = L.polyline(lineCoords, {
      color: '#f43f5e',
      weight: 3,
      opacity: 0.8,
      dashArray: '6, 8',
      lineCap: 'round'
    }).addTo(map);

    // Fit map bounds to show both pins comfortably
    const bounds = L.latLngBounds([
      [guessCoords.lat, guessCoords.lng],
      [actualCoords.lat, actualCoords.lng]
    ]);
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
    };
  }, [guessCoords, actualCoords]);

  // Fetch Reverse Geocoding & Wikipedia Trivia
  useEffect(() => {
    let isCancelled = false;

    async function loadEnrichment() {
      setIsLoadingDetails(true);

      // Reverse geocode
      const geo = await reverseGeocode(actualCoords.lat, actualCoords.lng);
      if (!isCancelled) {
        setLocationDetails(geo);
      }

      // Wikipedia trivia
      const trivia = await fetchLocationWikiTrivia(
        actualCoords.lat,
        actualCoords.lng,
        location?.name || geo.city || geo.countryName
      );

      if (!isCancelled && trivia) {
        setWikiTrivia(trivia);
        // AI rewrite
        const aiQuote = await rewriteTriviaWithAI(trivia.extract, trivia.title);
        if (!isCancelled) {
          setAiTriviaQuote(aiQuote);
        }
      }

      if (!isCancelled) {
        setIsLoadingDetails(false);
      }
    }

    loadEnrichment();

    return () => {
      isCancelled = true;
    };
  }, [actualCoords, location]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[780px] rounded-3xl overflow-hidden glass-panel-glow border border-slate-700/80 flex flex-col md:flex-row shadow-2xl">
        {/* Left Side: Interactive Reveal Map */}
        <div className="relative w-full md:w-3/5 h-1/2 md:h-full bg-slate-900">
          <div ref={mapContainerRef} className="w-full h-full" />
          
          {/* Map Legend Floating Pill */}
          <div className="absolute top-4 left-4 z-[1000] flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-950/85 border border-slate-800 text-xs backdrop-blur-md shadow-lg">
            <div className="flex items-center gap-1.5 text-rose-400 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Your Guess
            </div>
            <div className="w-px h-3 bg-slate-700"></div>
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Real Location
            </div>
          </div>
        </div>

        {/* Right Side: Score, Distance & Location Trivia */}
        <div className="w-full md:w-2/5 h-1/2 md:h-full p-6 md:p-8 flex flex-col justify-between overflow-y-auto bg-slate-900/60 backdrop-blur-md">
          {/* Top Section: Score & Assessment Badge */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-heading font-bold text-slate-400 tracking-wider uppercase">
                Round {roundIndex + 1} of {totalRounds}
              </span>
              <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${badge.bg} ${badge.color}`}>
                <span>{badge.emoji}</span>
                <span>{badge.title}</span>
              </div>
            </div>

            {/* Score & Distance Numbers */}
            <div className="mt-4 flex items-baseline justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Points Awarded</div>
                <div className="text-3xl md:text-4xl font-heading font-black text-emerald-400">
                  +{roundScore.toLocaleString()}
                  <span className="text-xs font-normal text-slate-400 ml-1">pts</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Distance Off</div>
                <div className="text-2xl md:text-3xl font-heading font-extrabold text-cyan-300">
                  {formatDistance(distanceKm)}
                </div>
              </div>
            </div>

            {/* True Location Identification */}
            <div className="mt-4">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Actual Location</div>
              <div className="mt-1 flex items-start gap-2">
                <span className="text-2xl">{locationDetails.flag || '🌍'}</span>
                <div>
                  <h3 className="text-lg font-heading font-bold text-white leading-tight">
                    {location?.name || locationDetails.formatted}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {locationDetails.formatted !== location?.name ? locationDetails.formatted : `${actualCoords.lat.toFixed(3)}°, ${actualCoords.lng.toFixed(3)}°`}
                  </p>
                </div>
              </div>
            </div>

            {/* Wikipedia & AI Trivia Card */}
            {(wikiTrivia || location?.hints) && (
              <div className="mt-5 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 shadow-inner">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>LOCATION TRIVIA</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{aiTriviaQuote || wikiTrivia?.extract || location?.hints?.[2] || badge.message}"
                </p>

                {wikiTrivia?.pageUrl && (
                  <a
                    href={wikiTrivia.pageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2.5 inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <span>Read more on Wikipedia</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Bottom Action Button */}
          <div className="mt-6 pt-4 border-t border-slate-800">
            <button
              onClick={onNextRound}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-heading font-extrabold text-sm md:text-base flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>{isFinalRound ? 'VIEW FINAL SCORECARD' : 'NEXT ROUND'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

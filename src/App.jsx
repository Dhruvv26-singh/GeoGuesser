import React, { useState, useEffect } from 'react';
import PanoramaViewer from './components/PanoramaViewer';
import GuessMap from './components/GuessMap';
import GameHUD from './components/GameHUD';
import RoundRevealModal from './components/RoundRevealModal';
import GameSummaryModal from './components/GameSummaryModal';
import HintModal from './components/HintModal';
import LeaderboardModal from './components/LeaderboardModal';
import AuthModal from './components/AuthModal';
import AISettingsModal from './components/AISettingsModal';
import AvatarShopModal from './components/AvatarShopModal';
import PartyModal from './components/PartyModal';
import WelcomeScreen from './components/WelcomeScreen';

import { generateGameLocations, REGION_PACKS } from './services/locations';
import { calculateHaversineDistance, calculateRoundScore } from './services/scoring';
import { getLocalProfile, getCurrentUser } from './services/supabase';

export default function App() {
  // Game lifecycle states: 'WELCOME' | 'PLAYING' | 'ROUND_REVEAL' | 'GAME_OVER'
  const [gameState, setGameState] = useState('WELCOME');
  const [selectedPack, setSelectedPack] = useState('abandoned');
  const [gameLocations, setGameLocations] = useState([]);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [roundsHistory, setRoundsHistory] = useState([]);
  const [currentRoundResult, setCurrentRoundResult] = useState(null);

  // GeoCoins Currency
  const [userCoins, setUserCoins] = useState(() => {
    const saved = localStorage.getItem('geoquest_coins');
    return saved !== null ? parseInt(saved, 10) : 1500;
  });

  // Hints & penalties
  const [revealedHints, setRevealedHints] = useState({});
  const [accumulatedPenalty, setAccumulatedPenalty] = useState(0);
  const [isHintsOpen, setIsHintsOpen] = useState(false);

  // Modals
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAISettingsOpen, setIsAISettingsOpen] = useState(false);
  const [isAvatarShopOpen, setIsAvatarShopOpen] = useState(false);
  const [isPartyModalOpen, setIsPartyModalOpen] = useState(false);

  // Auth & Profile
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(() => getLocalProfile());

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) setCurrentUser(user);
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('geoquest_coins', userCoins.toString());
  }, [userCoins]);

  // Current active mystery location
  const currentLocation = gameLocations[currentRoundIndex] || null;

  // Selected pack metadata
  const currentPackMeta = REGION_PACKS.find((p) => p.id === selectedPack) || REGION_PACKS[0];

  // Start new 5-round game
  const handleStartGame = (packId = selectedPack) => {
    const locations = generateGameLocations(packId);
    setGameLocations(locations);
    setCurrentRoundIndex(0);
    setTotalScore(0);
    setRoundsHistory([]);
    setCurrentRoundResult(null);
    setRevealedHints({});
    setAccumulatedPenalty(0);
    setSelectedPack(packId);
    setGameState('PLAYING');
  };

  // Submit Player Guess Pin
  const handleGuessSubmit = (guessCoords) => {
    if (!currentLocation || gameState !== 'PLAYING') return;

    const actualCoords = { lat: currentLocation.lat, lng: currentLocation.lng };
    const distanceKm = calculateHaversineDistance(
      guessCoords.lat,
      guessCoords.lng,
      actualCoords.lat,
      actualCoords.lng
    );

    // Calculate base score from distance
    const baseScore = calculateRoundScore(distanceKm);
    // Deduct penalties from used hints (clamped to 0 min)
    const finalRoundScore = Math.max(0, baseScore - accumulatedPenalty);

    // Reward GeoCoins
    const earnedCoins = Math.round(finalRoundScore / 40);
    setUserCoins((prev) => prev + earnedCoins);

    const roundData = {
      roundIndex: currentRoundIndex,
      location: currentLocation,
      guessCoords,
      actualCoords,
      distanceKm,
      roundScore: finalRoundScore,
      earnedCoins,
      hintsUsed: Object.keys(revealedHints).length
    };

    setRoundsHistory((prev) => [...prev, roundData]);
    setTotalScore((prev) => prev + finalRoundScore);
    setCurrentRoundResult(roundData);
    setGameState('ROUND_REVEAL');
  };

  // Advance to Next Round or Final Scorecard
  const handleNextRound = () => {
    if (currentRoundIndex < 4) {
      setCurrentRoundIndex((prev) => prev + 1);
      setRevealedHints({});
      setAccumulatedPenalty(0);
      setCurrentRoundResult(null);
      setGameState('PLAYING');
    } else {
      setGameState('GAME_OVER');
    }
  };

  // Apply hint score penalty
  const handleApplyPenalty = (penalty) => {
    setAccumulatedPenalty((prev) => prev + penalty);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-slate-100 font-sans">
      
      {/* 1. WELCOME SCREEN (OFFICIAL GEOGUESSR STYLE) */}
      {gameState === 'WELCOME' && (
        <WelcomeScreen
          onStartGame={() => handleStartGame(selectedPack)}
          onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenAvatarShop={() => setIsAvatarShopOpen(true)}
          onOpenPartyModal={() => setIsPartyModalOpen(true)}
          onOpenAISettings={() => setIsAISettingsOpen(true)}
          playerName={currentUser?.user_metadata?.username || profile.username}
          selectedPack={selectedPack}
          onSelectPack={setSelectedPack}
          userCoins={userCoins}
        />
      )}

      {/* 2. ACTIVE GAMEPLAY (PLAYING & ROUND_REVEAL) */}
      {(gameState === 'PLAYING' || gameState === 'ROUND_REVEAL') && currentLocation && (
        <>
          {/* Pure 360 Panorama Viewer */}
          <PanoramaViewer
            location={currentLocation}
            key={`pano_${currentLocation.id}_${currentRoundIndex}`}
          />

          {/* Top Floating HUD */}
          <GameHUD
            roundNumber={currentRoundIndex + 1}
            totalRounds={5}
            currentScore={totalScore}
            activePackName={currentPackMeta.name}
            hintsUsedCount={Object.keys(revealedHints).length}
            onOpenHints={() => setIsHintsOpen(true)}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
            onOpenProfile={() => setIsProfileOpen(true)}
            onOpenAISettings={() => setIsAISettingsOpen(true)}
            onQuitGame={() => setGameState('WELCOME')}
          />

          {/* Interactive Guess Map Drawer */}
          {gameState === 'PLAYING' && (
            <GuessMap
              onGuessSubmit={handleGuessSubmit}
              isGuessingEnabled={true}
              activeRound={currentRoundIndex}
            />
          )}

          {/* Round Reveal Modal */}
          {gameState === 'ROUND_REVEAL' && currentRoundResult && (
            <RoundRevealModal
              roundResult={currentRoundResult}
              roundIndex={currentRoundIndex}
              totalRounds={5}
              onNextRound={handleNextRound}
              isFinalRound={currentRoundIndex === 4}
            />
          )}
        </>
      )}

      {/* 3. GAME OVER SUMMARY SCORECARD */}
      {gameState === 'GAME_OVER' && (
        <GameSummaryModal
          gameSummary={{
            totalScore,
            rounds: roundsHistory,
            packName: currentPackMeta.name
          }}
          playerName={currentUser?.user_metadata?.username || profile.username}
          onPlayAgain={() => handleStartGame(selectedPack)}
          onChangePack={() => setGameState('WELCOME')}
          onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        />
      )}

      {/* MODALS */}
      <AvatarShopModal
        isOpen={isAvatarShopOpen}
        onClose={() => setIsAvatarShopOpen(false)}
        userCoins={userCoins}
        onUpdateCoins={setUserCoins}
      />

      <PartyModal
        isOpen={isPartyModalOpen}
        onClose={() => setIsPartyModalOpen(false)}
        onStartPartyGame={handleStartGame}
      />

      <HintModal
        isOpen={isHintsOpen}
        onClose={() => setIsHintsOpen(false)}
        location={currentLocation}
        onApplyPenalty={handleApplyPenalty}
        revealedHints={revealedHints}
        setRevealedHints={setRevealedHints}
        onOpenAISettings={() => {
          setIsHintsOpen(false);
          setIsAISettingsOpen(true);
        }}
      />

      <AISettingsModal
        isOpen={isAISettingsOpen}
        onClose={() => setIsAISettingsOpen(false)}
      />

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
      />

      <AuthModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={currentUser}
        onUserChange={(u) => {
          setCurrentUser(u);
          setProfile(getLocalProfile());
        }}
      />
    </div>
  );
}

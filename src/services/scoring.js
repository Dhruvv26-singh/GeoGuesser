/**
 * Haversine distance & scoring utilities for GeoGuessr
 */

const EARTH_RADIUS_KM = 6371; // Earth mean radius in kilometers

/**
 * Calculates the great-circle distance between two points on the Earth (in km)
 * @param {number} lat1 
 * @param {number} lon1 
 * @param {number} lat2 
 * @param {number} lon2 
 * @returns {number} Distance in kilometers
 */
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return 0;
  
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = EARTH_RADIUS_KM * c;
  
  return Math.round(d * 10) / 10; // Round to 1 decimal place
}

function toRad(degrees) {
  return (degrees * Math.PI) / 180;
}

/**
 * Calculates points (0 - 5000) using an exponential decay curve based on distance
 * @param {number} distanceKm Distance in km
 * @param {number} maxPoints Maximum points for a round (default 5000)
 * @param {number} scaleFactor Decay scale factor (default 2000 for world map)
 * @returns {number} Score from 0 to maxPoints
 */
export function calculateRoundScore(distanceKm, maxPoints = 5000, scaleFactor = 2000) {
  if (distanceKm == null || isNaN(distanceKm)) return 0;
  
  // Within 100 meters is an absolute bullseye
  if (distanceKm <= 0.1) return maxPoints;
  
  // Exponential decay formula
  const score = Math.round(maxPoints * Math.exp(-distanceKm / scaleFactor));
  
  // Clamp between 0 and maxPoints
  return Math.max(0, Math.min(maxPoints, score));
}

/**
 * Formats a distance into a readable string (km or meters)
 * @param {number} km 
 * @returns {string} e.g. "150 m" or "1,240 km"
 */
export function formatDistance(km) {
  if (km == null || isNaN(km)) return '0 km';
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${Math.round(km).toLocaleString()} km`;
}

/**
 * Returns a human-friendly assessment badge based on score
 * @param {number} score 
 * @returns {{ title: string, color: string, emoji: string, message: string }}
 */
export function getScoreBadge(score) {
  if (score >= 4950) {
    return { title: 'BULLSEYE!', color: 'text-emerald-400', bg: 'bg-emerald-500/20 border-emerald-500/50', emoji: '🎯', message: 'Incredible precision! You were right on the spot!' };
  }
  if (score >= 4500) {
    return { title: 'Eagle Eye', color: 'text-green-400', bg: 'bg-green-500/20 border-green-500/50', emoji: '🦅', message: 'Pinpoint accuracy! You know this region well.' };
  }
  if (score >= 3500) {
    return { title: 'Great Instinct', color: 'text-teal-400', bg: 'bg-teal-500/20 border-teal-500/50', emoji: '🧭', message: 'Very close! Right country and neighbourhood.' };
  }
  if (score >= 2000) {
    return { title: 'On The Continent', color: 'text-amber-400', bg: 'bg-amber-500/20 border-amber-500/50', emoji: '🌍', message: 'Right general area, but a bit of distance away.' };
  }
  if (score >= 500) {
    return { title: 'Rough Direction', color: 'text-orange-400', bg: 'bg-orange-500/20 border-orange-500/50', emoji: '🗺️', message: 'At least you stayed on the right hemisphere!' };
  }
  return { title: 'Lost In Orbit', color: 'text-rose-400', bg: 'bg-rose-500/20 border-rose-500/50', emoji: '🚀', message: 'Wrong side of the planet! Better luck next round.' };
}

/**
 * Returns the final rank and summary for a 5-round game
 * @param {number} totalScore 
 * @returns {{ rank: string, description: string, emoji: string, color: string }}
 */
export function getFinalRank(totalScore) {
  if (totalScore >= 24000) {
    return { rank: 'Grandmaster Cartographer', description: 'Top 0.1% spatial memory. You are practically a human GPS!', emoji: '👑', color: 'from-amber-400 to-yellow-600' };
  }
  if (totalScore >= 20000) {
    return { rank: 'Master Navigator', description: 'Outstanding geographic intuition and landmark recognition.', emoji: '🌟', color: 'from-emerald-400 to-teal-500' };
  }
  if (totalScore >= 15000) {
    return { rank: 'Seasoned Explorer', description: 'Great eye for world geography, road markings, and vegetation.', emoji: '🧭', color: 'from-cyan-400 to-blue-500' };
  }
  if (totalScore >= 10000) {
    return { rank: 'Avid Globetrotter', description: 'Solid effort! You recognized several key regions across the globe.', emoji: '✈️', color: 'from-purple-400 to-indigo-500' };
  }
  return { rank: 'Rookie Wanderer', description: 'Keep practicing! The world is vast and full of clues waiting to be discovered.', emoji: '🎒', color: 'from-rose-400 to-pink-600' };
}

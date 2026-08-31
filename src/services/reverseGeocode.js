/**
 * Reverse Geocoding service using BigDataCloud free client API with Photon/OSM fallback
 */

const cache = new Map();

/**
 * Converts lat, lng coordinates into readable city, region, country details
 * @param {number} lat 
 * @param {number} lng 
 * @returns {Promise<{ formatted: string, city: string, principalSubdivision: string, countryName: string, countryCode: string, flag: string }>}
 */
export async function reverseGeocode(lat, lng) {
  if (lat == null || lng == null) {
    return { formatted: 'Unknown Location', city: '', principalSubdivision: '', countryName: '', countryCode: '', flag: '🌐' };
  }

  const cacheKey = `${lat.toFixed(3)},${lng.toFixed(3)}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  // 1. Try BigDataCloud Client Reverse Geocode (free client tier)
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
    );
    if (res.ok) {
      const data = await res.json();
      const city = data.city || data.locality || data.principalSubdivision || '';
      const state = data.principalSubdivision || '';
      const country = data.countryName || 'Unknown Country';
      const countryCode = data.countryCode || '';
      const flag = getFlagEmoji(countryCode);

      const parts = [city, state !== city ? state : '', country].filter(Boolean);
      const formatted = parts.length > 0 ? parts.join(', ') : `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`;

      const result = {
        formatted,
        city,
        principalSubdivision: state,
        countryName: country,
        countryCode,
        flag
      };
      cache.set(cacheKey, result);
      return result;
    }
  } catch (err) {
    console.warn('BigDataCloud reverse geocode fallback to Photon:', err);
  }

  // 2. Fallback to Photon Komoot OpenStreetMap Reverse Geocoder
  try {
    const photonRes = await fetch(`https://photon.komoot.io/reverse?lon=${lng}&lat=${lat}`);
    if (photonRes.ok) {
      const data = await photonRes.json();
      const feature = data.features?.[0]?.properties;
      if (feature) {
        const city = feature.city || feature.name || feature.county || '';
        const state = feature.state || '';
        const country = feature.country || '';
        const countryCode = feature.countrycode ? feature.countrycode.toUpperCase() : '';
        const flag = getFlagEmoji(countryCode);

        const parts = [city, state !== city ? state : '', country].filter(Boolean);
        const formatted = parts.length > 0 ? parts.join(', ') : `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`;

        const result = {
          formatted,
          city,
          principalSubdivision: state,
          countryName: country,
          countryCode,
          flag
        };
        cache.set(cacheKey, result);
        return result;
      }
    }
  } catch (err) {
    console.warn('Photon reverse geocode error:', err);
  }

  return {
    formatted: `Coordinates: ${lat.toFixed(3)}°, ${lng.toFixed(3)}°`,
    city: '',
    principalSubdivision: '',
    countryName: 'Earth',
    countryCode: '',
    flag: '🌍'
  };
}

/**
 * Converts 2-letter ISO country code to Emoji flag
 * @param {string} countryCode 
 * @returns {string} Emoji flag
 */
export function getFlagEmoji(countryCode) {
  if (!countryCode || countryCode.length !== 2) return '🌐';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

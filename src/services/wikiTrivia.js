/**
 * Wikipedia Trivia Service using Wikipedia GeoSearch & Summary REST API
 */

const wikiCache = new Map();

/**
 * Fetches Wikipedia article summary near specified lat/lng coordinates
 * @param {number} lat 
 * @param {number} lng 
 * @param {string} fallbackQuery 
 * @returns {Promise<{ title: string, extract: string, thumbnail?: string, pageUrl?: string } | null>}
 */
export async function fetchLocationWikiTrivia(lat, lng, fallbackQuery = '') {
  if (lat == null || lng == null) return null;
  
  const cacheKey = `${lat.toFixed(3)},${lng.toFixed(3)}`;
  if (wikiCache.has(cacheKey)) {
    return wikiCache.get(cacheKey);
  }

  try {
    // 1. Search Wikipedia articles within 10km radius of the coordinates
    const geoSearchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${lat}|${lng}&gsradius=10000&gslimit=3&format=json&origin=*`;
    const geoRes = await fetch(geoSearchUrl);
    
    let pageTitle = '';
    if (geoRes.ok) {
      const geoData = await geoRes.json();
      const results = geoData.query?.geosearch;
      if (results && results.length > 0) {
        pageTitle = results[0].title;
      }
    }

    if (!pageTitle && fallbackQuery) {
      pageTitle = fallbackQuery;
    }

    if (!pageTitle) {
      return null;
    }

    // 2. Fetch the clean page summary from Wikipedia REST API
    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle.replace(/ /g, '_'))}`;
    const summaryRes = await fetch(summaryUrl);
    
    if (summaryRes.ok) {
      const data = await summaryRes.json();
      const result = {
        title: data.title,
        description: data.description || '',
        extract: data.extract || '',
        thumbnail: data.thumbnail?.source,
        pageUrl: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(pageTitle)}`
      };
      wikiCache.set(cacheKey, result);
      return result;
    }
  } catch (err) {
    console.warn('Wikipedia trivia lookup error:', err);
  }

  return null;
}

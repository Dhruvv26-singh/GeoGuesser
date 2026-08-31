/**
 * Multi-Model AI Engine & Satellite Intelligence Service
 * Supports Google Gemini, Groq, and a Built-in Zero-Key Heuristic Engine
 */

const STORAGE_KEY_GEMINI = 'geoquest_gemini_api_key';
const STORAGE_KEY_GROQ = 'geoquest_groq_api_key';
const STORAGE_KEY_PROVIDER = 'geoquest_ai_provider'; // 'auto' | 'gemini' | 'groq' | 'offline'

export const AI_PROVIDERS = [
  { id: 'auto', name: '⚡ Auto Smart Detect (Recommended)', desc: 'Uses best available free API key with instant offline fallback' },
  { id: 'offline', name: '🛡️ Built-in Geo Intelligence (No API Key Required)', desc: '100% free, offline, instant response calculated from geography heuristics' },
  { id: 'gemini', name: '✨ Google Gemini 1.5 Flash', desc: 'Fast multimodal Google generative AI' },
  { id: 'groq', name: '🚀 Groq LLaMA 3.3', desc: 'Ultra low-latency LLaMA inference' }
];

export function getStoredApiKeys() {
  return {
    gemini: localStorage.getItem(STORAGE_KEY_GEMINI) || import.meta.env.VITE_GEMINI_API_KEY || '',
    groq: localStorage.getItem(STORAGE_KEY_GROQ) || import.meta.env.VITE_GROQ_API_KEY || '',
    provider: localStorage.getItem(STORAGE_KEY_PROVIDER) || 'auto'
  };
}

export function saveApiKeys({ gemini, groq, provider }) {
  if (gemini !== undefined) localStorage.setItem(STORAGE_KEY_GEMINI, gemini.trim());
  if (groq !== undefined) localStorage.setItem(STORAGE_KEY_GROQ, groq.trim());
  if (provider !== undefined) localStorage.setItem(STORAGE_KEY_PROVIDER, provider);
}

/**
 * Generates an in-game hint using the best active engine
 * @param {object} location 
 * @param {number} hintLevel 1 (Hemisphere/Climate), 2 (Culture/Language/Architecture), 3 (Direct Landmark Clue)
 * @returns {Promise<{ text: string, cost: number, source: string }>}
 */
export async function getAIHint(location, hintLevel = 1) {
  const costs = { 1: 300, 2: 700, 3: 1200 };
  const cost = costs[hintLevel] || 500;
  const config = getStoredApiKeys();

  // 1. Try Gemini if selected or in auto mode with a key
  if ((config.provider === 'gemini' || config.provider === 'auto') && config.gemini && config.gemini !== 'YOUR_GEMINI_API_KEY') {
    try {
      const hint = await callGeminiAPI(config.gemini, location, hintLevel);
      if (hint) return { text: hint, cost, source: 'gemini' };
    } catch (e) {
      console.warn('Gemini API call failed, attempting fallback...', e);
    }
  }

  // 2. Try Groq if selected or in auto mode with a key
  if ((config.provider === 'groq' || config.provider === 'auto') && config.groq && config.groq !== 'YOUR_GROQ_API_KEY') {
    try {
      const hint = await callGroqAPI(config.groq, location, hintLevel);
      if (hint) return { text: hint, cost, source: 'groq' };
    } catch (e) {
      console.warn('Groq API call failed, attempting fallback...', e);
    }
  }

  // 3. Built-in Smart Zero-Key Heuristic Engine
  return {
    text: getOfflineSmartClue(location, hintLevel),
    cost,
    source: 'offline-geo'
  };
}

/**
 * Google Gemini REST API caller
 */
async function callGeminiAPI(apiKey, location, hintLevel) {
  const promptGuidance = [
    'Give a 1-sentence clue about the hemisphere, climate, or general continent without naming the country.',
    'Give a 1-sentence clue about the language scripts, typical architecture, or driving side of this region.',
    'Give a 1-sentence landmark or cultural trivia clue that strongly hints at this specific city or region.'
  ][hintLevel - 1] || 'Give a brief geographic clue.';

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `You are a master GeoGuessr AI assistant. Location: "${location.name}, ${location.country}". Guideline: ${promptGuidance}. Keep answer concise (max 20 words) and playful. Do NOT explicitly name the country.`
        }]
      }],
      generationConfig: {
        maxOutputTokens: 60,
        temperature: 0.7
      }
    })
  });

  if (!res.ok) throw new Error(`Gemini status ${res.status}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
}

/**
 * Groq LLaMA REST API caller
 */
async function callGroqAPI(apiKey, location, hintLevel) {
  const promptGuidance = [
    'Give a subtle 1-sentence clue about the hemisphere, climate, or general continent without naming the country.',
    'Give a 1-sentence clue about the language scripts, typical architecture, or driving side of this region.',
    'Give a 1-sentence landmark or cultural trivia clue that strongly hints at this specific city or region.'
  ][hintLevel - 1] || 'Give a brief, clever geographic clue.';

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: 'You are a master GeoGuessr AI coach. Keep hints fun, concise (under 25 words), and strictly follow the clue level constraint. Do not reveal the exact country name directly.'
        },
        {
          role: 'user',
          content: `The mystery location is: "${location.name}, ${location.country}". Guideline: ${promptGuidance}`
        }
      ],
      temperature: 0.7,
      max_tokens: 60
    })
  });

  if (!res.ok) throw new Error(`Groq status ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim();
}

/**
 * Built-in Zero-Key Smart Geoguessr Clue Engine
 * Generates accurate geographic, meteorological, and cultural clues without any API keys
 */
export function getOfflineSmartClue(location, hintLevel) {
  if (location.hints && location.hints[hintLevel - 1]) {
    return location.hints[hintLevel - 1];
  }

  const { lat, lng, country } = location;
  const isNorthern = lat > 0;
  const hemisphere = isNorthern ? 'Northern Hemisphere' : 'Southern Hemisphere';

  if (hintLevel === 1) {
    if (Math.abs(lat) < 15) return `Tropical Equatorial zone in the ${hemisphere}. The sun is positioned directly overhead.`;
    if (lat > 50) return `High latitude subarctic/temperate zone in the ${hemisphere}. Expect lower sun angles and colder biome.`;
    if (lat < -30) return `Southern temperate zone (${hemisphere}). Note that the sun shines from the North at midday.`;
    return `Mid-latitude temperate region located in the ${hemisphere}.`;
  }

  if (hintLevel === 2) {
    if (lng > 68 && lng < 97 && lat > 8 && lat < 37) return `South Asian subcontinent: Look out for Devanagari or regional Dravidian scripts and left-hand driving.`;
    if (lng > -10 && lng < 35 && lat > 35 && lat < 65) return `European region: Look for standard blue EU license plates and Latin alphabets.`;
    if (lng > 120 && lng < 150 && lat > 20 && lat < 45) return `East Asian Pacific realm: Kanji/Kana scripts and distinctive yellow utility pole markers.`;
    return `Observe vehicle license plate shapes, roadside bollards, and driving direction to pinpoint the continent.`;
  }

  return `This iconic wonder in ${country || 'this territory'} attracts millions of global travelers every year. Look for distinctive local architectural styles.`;
}

/**
 * Rewrites trivia into a crisp, engaging 2-sentence summary
 */
export async function rewriteTriviaWithAI(rawTrivia, placeName) {
  const config = getStoredApiKeys();
  if (!rawTrivia) return '';

  if (config.gemini && config.gemini !== 'YOUR_GEMINI_API_KEY') {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${config.gemini}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Summarize this trivia for "${placeName}" into 2 punchy, fascinating sentences:\n\n${rawTrivia}`
            }]
          }]
        })
      });
      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (text) return text;
      }
    } catch (e) {
      // fallback
    }
  }

  return rawTrivia.length > 250 ? rawTrivia.slice(0, 250) + '...' : rawTrivia;
}

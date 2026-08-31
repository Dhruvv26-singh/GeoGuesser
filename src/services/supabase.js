import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'YOUR_SUPABASE_URL' &&
  !supabaseUrl.includes('placeholder')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local fallback storage keys
const LOCAL_STORAGE_KEY_GAMES = 'geoguessr_local_games';
const LOCAL_STORAGE_KEY_PROFILE = 'geoguessr_local_profile';

/**
 * Saves a completed 5-round game to Supabase or LocalStorage
 * @param {object} gameData 
 * @returns {Promise<{ success: boolean, gameId: string }>}
 */
export async function recordGameScore(gameData) {
  const { totalScore, gameMode = 'world', roundsData, playerName = 'Explorer', userId = null } = gameData;

  const record = {
    id: crypto.randomUUID ? crypto.randomUUID() : `game_${Date.now()}`,
    user_id: userId,
    player_name: playerName,
    game_mode: gameMode,
    total_score: totalScore,
    max_possible_score: 25000,
    rounds_data: roundsData,
    created_at: new Date().toISOString()
  };

  // 1. Try Supabase
  if (supabase) {
    try {
      const { data, error } = await supabase.from('games').insert([record]).select().single();
      if (!error && data) {
        return { success: true, gameId: data.id, isOnline: true };
      }
    } catch (err) {
      console.warn('Supabase record game error:', err);
    }
  }

  // 2. Local fallback
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_GAMES) || '[]');
    existing.unshift(record);
    localStorage.setItem(LOCAL_STORAGE_KEY_GAMES, JSON.stringify(existing.slice(0, 50)));

    // Update local profile high score
    const currentProfile = getLocalProfile();
    currentProfile.total_games = (currentProfile.total_games || 0) + 1;
    currentProfile.high_score = Math.max(currentProfile.high_score || 0, totalScore);
    currentProfile.total_score = (currentProfile.total_score || 0) + totalScore;
    saveLocalProfile(currentProfile);

    return { success: true, gameId: record.id, isOnline: false };
  } catch (e) {
    console.error('LocalStorage write error:', e);
    return { success: false, error: e.message };
  }
}

/**
 * Fetches the leaderboard either from Supabase or LocalStorage
 * @param {string} mode 
 * @returns {Promise<Array>}
 */
export async function getLeaderboard(mode = 'world') {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('id, player_name, game_mode, total_score, created_at')
        .order('total_score', { ascending: false })
        .limit(25);

      if (!error && data && data.length > 0) {
        return data.map((item, index) => ({
          rank: index + 1,
          id: item.id,
          name: item.player_name || 'Explorer',
          score: item.total_score,
          mode: item.game_mode,
          date: item.created_at,
          isOnline: true
        }));
      }
    } catch (err) {
      console.warn('Supabase leaderboard fetch error:', err);
    }
  }

  // Local fallback
  const localGames = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_GAMES) || '[]');
  
  // Include some default fun champion scores if empty
  if (localGames.length === 0) {
    return [
      { rank: 1, name: 'GeoMaster_V', score: 24890, mode: 'world', date: 'Just now', isOnline: false },
      { rank: 2, name: 'AtlasExplorer', score: 23410, mode: 'world', date: 'Today', isOnline: false },
      { rank: 3, name: 'StreetPin99', score: 21950, mode: 'world', date: 'Yesterday', isOnline: false },
      { rank: 4, name: 'Wanderlust_Pro', score: 19800, mode: 'world', date: '2 days ago', isOnline: false },
      { rank: 5, name: 'CompassKnight', score: 18450, mode: 'world', date: '3 days ago', isOnline: false },
    ];
  }

  const sorted = [...localGames].sort((a, b) => b.total_score - a.total_score);
  return sorted.slice(0, 25).map((g, idx) => ({
    rank: idx + 1,
    id: g.id,
    name: g.player_name || 'Explorer',
    score: g.total_score,
    mode: g.game_mode,
    date: g.created_at ? new Date(g.created_at).toLocaleDateString() : 'Recent',
    isOnline: false
  }));
}

/**
 * Local profile helper functions
 */
export function getLocalProfile() {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PROFILE);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
  }
  const defaultProfile = {
    username: 'Explorer_' + Math.floor(1000 + Math.random() * 9000),
    avatar_url: '',
    total_games: 0,
    high_score: 0,
    total_score: 0,
    streak_count: 1
  };
  localStorage.setItem(LOCAL_STORAGE_KEY_PROFILE, JSON.stringify(defaultProfile));
  return defaultProfile;
}

export function saveLocalProfile(profile) {
  localStorage.setItem(LOCAL_STORAGE_KEY_PROFILE, JSON.stringify(profile));
}

/**
 * Supabase Auth Handlers
 */
export async function authSignIn(email, password) {
  if (!supabase) throw new Error('Supabase is not configured.');
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function authSignUp(email, password, username) {
  if (!supabase) throw new Error('Supabase is not configured.');
  const res = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username: username || email.split('@')[0] }
    }
  });
  if (res.data?.user) {
    // Create profile
    await supabase.from('profiles').upsert({
      id: res.data.user.id,
      username: username || email.split('@')[0],
      created_at: new Date().toISOString()
    });
  }
  return res;
}

export async function authSignOut() {
  if (!supabase) return;
  return await supabase.auth.signOut();
}

export async function getCurrentUser() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
}

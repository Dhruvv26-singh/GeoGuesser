-- GeoGuessr Supabase Schema
-- Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    avatar_url TEXT,
    total_games INTEGER DEFAULT 0,
    high_score INTEGER DEFAULT 0,
    total_score BIGINT DEFAULT 0,
    streak_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Games Table
CREATE TABLE IF NOT EXISTS public.games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    player_name TEXT DEFAULT 'Explorer',
    game_mode TEXT DEFAULT 'world',
    total_score INTEGER NOT NULL,
    max_possible_score INTEGER DEFAULT 25000,
    rounds_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on games
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Games are viewable by everyone" 
ON public.games FOR SELECT USING (true);

CREATE POLICY "Anyone can record a game score" 
ON public.games FOR INSERT WITH CHECK (true);

-- Daily Challenges Table
CREATE TABLE IF NOT EXISTS public.daily_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_date DATE UNIQUE NOT NULL,
    seed_locations JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on daily challenges
ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Daily challenges are viewable by everyone" 
ON public.daily_challenges FOR SELECT USING (true);

-- Leaderboard View
CREATE OR REPLACE VIEW public.global_leaderboard AS
SELECT 
    g.id as game_id,
    COALESCE(p.username, g.player_name, 'Explorer') as player_name,
    COALESCE(p.avatar_url, '') as avatar_url,
    g.game_mode,
    g.total_score,
    g.rounds_data,
    g.created_at
FROM public.games g
LEFT JOIN public.profiles p ON g.user_id = p.id
ORDER BY g.total_score DESC, g.created_at ASC
LIMIT 100;

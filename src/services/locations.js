/**
 * Curated mystery locations with verified coordinates,
 * Google Street View 360 coordinates, and thematic packs.
 */

export const REGION_PACKS = [
  { id: 'abandoned', name: '👻 Abandoned & Ghost Towns', icon: '🏚️', description: 'Pripyat Chernobyl, Kolmanskop desert ruins, Hashima Island & eerie forgotten places' },
  { id: 'highways', name: '🛣️ Lonely Highways & Roads', icon: '🚗', description: 'Route 66, Australian Outback, Patagonian passes, Iceland Ring Road & desert trails' },
  { id: 'wonders', name: '🏛️ Wonders of the World', icon: '🏛️', description: 'Pyramids of Giza, Machu Picchu, Petra, Colosseum, Taj Mahal & ancient marvels' },
  { id: 'world', name: '🌍 Global Odyssey', icon: '🌍', description: 'Real mystery spots from remote frontiers to iconic capitals across 7 continents' },
  { id: 'nature', name: '🌋 Epic Nature & Wilderness', icon: '🌋', description: 'Everest Base Camp, Salar de Uyuni, Northern Lights, Grand Canyon & glaciers' },
  { id: 'india', name: '🇮🇳 Incredible India', icon: '🇮🇳', description: 'Varanasi Ghats, Kuldhara ghost village, Ladakh passes, Jaipur palaces & Mumbai' },
  { id: 'europe', name: '🏰 European Fairytales', icon: '🏰', description: 'Neuschwanstein Castle, Venice canals, Eiffel Tower, Swiss Alps & old towns' },
  { id: 'cyber_cities', name: '🌆 Neon Skylines & Megacities', icon: '🌆', description: 'Tokyo Shibuya, Times Square NYC, Dubai Burj Khalifa & Singapore Supertrees' }
];

export const LOCATION_DATABASE = [
  // ==========================================
  // 1. ABANDONED PLACES & GHOST TOWNS
  // ==========================================
  {
    id: 'loc_pripyat_ferris_wheel',
    name: 'Pripyat Amusement Park (Chernobyl Exclusion Zone)',
    country: 'Ukraine',
    countryCode: 'UA',
    region: 'abandoned',
    pack: ['world', 'abandoned', 'europe'],
    lat: 51.407778,
    lng: 30.055556,
    heading: 90,
    pitch: 10,
    hints: [
      'Located in Eastern Europe inside a radioactive exclusion zone evacuated in 1986.',
      'Cyrillic signage, yellow rusted bumper cars, and an overgrown yellow Ferris wheel.',
      'The ghost city of workers from the Chernobyl Nuclear Power Plant.'
    ],
    panoramaUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=2400&q=85&auto=format',
    streetViewEmbed: 'https://maps.google.com/maps?layer=c&cbll=51.407778,30.055556&output=svembed',
    tags: ['abandoned', 'ghost_town', 'eerie', 'europe']
  },
  {
    id: 'loc_kolmanskop_namibia',
    name: 'Kolmanskop Desert Ghost Town',
    country: 'Namibia',
    countryCode: 'NA',
    region: 'abandoned',
    pack: ['world', 'abandoned', 'nature'],
    lat: -26.704722,
    lng: 15.232778,
    heading: 180,
    pitch: 0,
    hints: [
      'Southern African coastal desert nation with left-hand traffic driving.',
      'German colonial architecture with rooms knee-deep in encroaching Namib desert sand dunes.',
      'A diamond mining boomtown abandoned in 1956 in the Sperrgebiet.'
    ],
    panoramaUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=2400&q=85&auto=format',
    streetViewEmbed: 'https://maps.google.com/maps?layer=c&cbll=-26.704722,15.232778&output=svembed',
    tags: ['abandoned', 'desert', 'ghost_town', 'africa']
  },
  {
    id: 'loc_hashima_island',
    name: 'Hashima "Battleship" Ghost Island, Nagasaki',
    country: 'Japan',
    countryCode: 'JP',
    region: 'abandoned',
    pack: ['world', 'abandoned', 'cyber_cities'],
    lat: 32.627778,
    lng: 129.538333,
    heading: 45,
    pitch: 5,
    hints: [
      'East Asian island nation in the East China Sea off the coast of Nagasaki.',
      'Crumbling concrete high-rise residential apartment blocks fortified by massive sea walls.',
      'Also known as Gunkanjima (Battleship Island), abandoned coal mining island featured in Skyfall.'
    ],
    panoramaUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=2400&q=85&auto=format',
    streetViewEmbed: 'https://maps.google.com/maps?layer=c&cbll=32.627778,129.538333&output=svembed',
    tags: ['abandoned', 'island', 'japan', 'eerie']
  },
  {
    id: 'loc_bodie_ghost_town',
    name: 'Bodie Historic Gold Rush Ghost Town, California',
    country: 'United States',
    countryCode: 'US',
    region: 'abandoned',
    pack: ['world', 'abandoned', 'highways'],
    lat: 38.212778,
    lng: -119.011944,
    heading: 270,
    pitch: 5,
    hints: [
      'North American Western state east of the Sierra Nevada mountain range.',
      'Weathered wooden saloons, clapboard houses, and rusted mining machinery preserved in arrested decay.',
      'Wild West gold boomtown that once had 10,000 residents in Mono County, California.'
    ],
    panoramaUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2400&q=85&auto=format',
    streetViewEmbed: 'https://maps.google.com/maps?layer=c&cbll=38.212778,-119.011944&output=svembed',
    tags: ['abandoned', 'wild_west', 'americas', 'ghost_town']
  },
  {
    id: 'loc_craco_ghost_town',
    name: 'Craco Medieval Ghost Town, Basilicata',
    country: 'Italy',
    countryCode: 'IT',
    region: 'abandoned',
    pack: ['world', 'abandoned', 'europe'],
    lat: 40.378056,
    lng: 16.440278,
    heading: 190,
    pitch: 10,
    hints: [
      'Southern Italy on the arch of the boot in the province of Matera.',
      'Norman tower and stone palaces clinging dramatically to a steep clay cliff overlooking badlands.',
      'Abandoned in the 20th century following repeated landslides and earthquakes.'
    ],
    panoramaUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=2400&q=85&auto=format',
    streetViewEmbed: 'https://maps.google.com/maps?layer=c&cbll=40.378056,16.440278&output=svembed',
    tags: ['abandoned', 'medieval', 'europe', 'ghost_town']
  },
  {
    id: 'loc_kuldhara_rajasthan',
    name: 'Kuldhara Cursed Village Ruins, Jaisalmer',
    country: 'India',
    countryCode: 'IN',
    region: 'abandoned',
    pack: ['world', 'abandoned', 'india'],
    lat: 26.873611,
    lng: 70.785833,
    heading: 120,
    pitch: 0,
    hints: [
      'Desert state of Rajasthan in the Thar Desert near the golden fortress of Jaisalmer.',
      'Centuries-old yellow sandstone ruins and sandstone temples deserted overnight in the 1800s.',
      'According to legend, cursed by Paliwal Brahmins so no one could ever settle there again.'
    ],
    panoramaUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=2400&q=85&auto=format',
    streetViewEmbed: 'https://maps.google.com/maps?layer=c&cbll=26.873611,70.785833&output=svembed',
    tags: ['abandoned', 'india', 'cursed', 'desert']
  },
  {
    id: 'loc_kayakoy_ghost_village',
    name: 'Kayaköy Abandoned Stone Ghost Village',
    country: 'Turkey',
    countryCode: 'TR',
    region: 'abandoned',
    pack: ['world', 'abandoned', 'europe'],
    lat: 36.575278,
    lng: 29.091111,
    heading: 320,
    pitch: 12,
    hints: [
      'Southwestern Mediterranean coast of Anatolia near Fethiye.',
      'Hundreds of roofless Greek-style stone houses and basilicas cascading down a hillside.',
      'Deserted in 1923 following the Greek-Turkish population exchange.'
    ],
    panoramaUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=2400&q=85&auto=format',
    streetViewEmbed: 'https://maps.google.com/maps?layer=c&cbll=36.575278,29.091111&output=svembed',
    tags: ['abandoned', 'ruins', 'mediterranean']
  },

  // ==========================================
  // 2. LONELY HIGHWAYS & DESOLATE ROADS
  // ==========================================
  {
    id: 'loc_route_66_mojave',
    name: 'Historic Route 66 Desert Highway, Amboy, California',
    country: 'United States',
    countryCode: 'US',
    region: 'highways',
    pack: ['world', 'highways'],
    lat: 34.557778,
    lng: -115.743889,
    heading: 75,
    pitch: 0,
    hints: [
      'American Southwest Mojave Desert corridor with double yellow center road lines.',
      'Flat asphalt disappearing into distant arid mountain ranges past Roy’s Motel & Cafe.',
      'The legendary "Mother Road" established in 1926 linking Chicago to Los Angeles.'
    ],
    panoramaUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2400&q=85&auto=format',
    streetViewEmbed: 'https://maps.google.com/maps?layer=c&cbll=34.557778,-115.743889&output=svembed',
    tags: ['highway', 'road', 'desert', 'americas']
  },
  {
    id: 'loc_stuart_highway_outback',
    name: 'Stuart Highway Outback Highway, Northern Territory',
    country: 'Australia',
    countryCode: 'AU',
    region: 'highways',
    pack: ['world', 'highways', 'nature'],
    lat: -23.698000,
    lng: 133.880700,
    heading: 0,
    pitch: 0,
    hints: [
      'Southern Hemisphere red dirt continent with left-hand traffic and road train signs.',
      'Endless straight tarmac cutting through crimson spinifex desert and eucalyptus scrub.',
      '2,834 km highway traversing the Australian Red Centre from Darwin to Port Augusta.'
    ],
    panoramaUrl: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?auto=format&fit=crop&w=2400&q=85&auto=format',
    streetViewEmbed: 'https://maps.google.com/maps?layer=c&cbll=-23.698,133.8807&output=svembed',
    tags: ['highway', 'outback', 'australia', 'road']
  },
  {
    id: 'loc_iceland_ring_road',
    name: 'Route 1 (Ring Road) Lava Fields, Vik',
    country: 'Iceland',
    countryCode: 'IS',
    region: 'highways',
    pack: ['world', 'highways', 'nature'],
    lat: 63.418611,
    lng: -19.006111,
    heading: 90,
    pitch: 5,
    hints: [
      'North Atlantic volcanic island nation with Icelandic yellow road marker bollards.',
      'Black volcanic sand plains, mossy basalt lava fields, and glacier-capped peaks in the background.',
      'The 1,322 km national road circling the entire island.'
    ],
    panoramaUrl: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=2400&q=85&auto=format',
    streetViewEmbed: 'https://maps.google.com/maps?layer=c&cbll=63.418611,-19.006111&output=svembed',
    tags: ['highway', 'iceland', 'volcanic', 'road']
  },
  {
    id: 'loc_leh_manali_highway',
    name: 'Leh-Manali High Mountain Pass (Taglang La)',
    country: 'India',
    countryCode: 'IN',
    region: 'highways',
    pack: ['world', 'highways', 'india', 'nature'],
    lat: 33.508056,
    lng: 77.771389,
    heading: 45,
    pitch: 5,
    hints: [
      'High-altitude Himalayan desert union territory of Ladakh with left-hand traffic.',
      'Border Roads Organisation (BRO) yellow milestones at 5,328m altitude (17,480 ft).',
      'One of the highest and most treacherous motorable mountain passes in the world.'
    ],
    panoramaUrl: 'https://images.unsplash.com/photo-1506038634487-60a69ae4b7b1?auto=format&fit=crop&w=2400&q=85&auto=format',
    streetViewEmbed: 'https://maps.google.com/maps?layer=c&cbll=33.508056,77.771389&output=svembed',
    tags: ['highway', 'mountains', 'india', 'extreme']
  },

  // ==========================================
  // 3. WONDERS OF THE WORLD
  // ==========================================
  {
    id: 'loc_giza_pyramids',
    name: 'Great Pyramids of Giza & Sphinx',
    country: 'Egypt',
    countryCode: 'EG',
    region: 'wonders',
    pack: ['world', 'wonders'],
    lat: 29.979234,
    lng: 31.134202,
    heading: 45,
    pitch: 5,
    hints: [
      'Located in North Africa near the banks of the world’s longest river in an arid desert.',
      'Arabic signage, limestone blocks, and desert sand dunes surround the site.',
      'The only surviving Wonder of the Ancient World, built over 4,500 years ago.'
    ],
    panoramaUrl: 'https://images.unsplash.com/photo-1503177112294-7de5006ef5d1?auto=format&fit=crop&w=2400&q=85&auto=format',
    streetViewEmbed: 'https://maps.google.com/maps?layer=c&cbll=29.979234,31.134202&output=svembed',
    tags: ['ancient', 'wonder', 'desert', 'unesco']
  },
  {
    id: 'loc_petra_treasury',
    name: 'Al-Khazneh (The Treasury), Petra',
    country: 'Jordan',
    countryCode: 'JO',
    region: 'wonders',
    pack: ['world', 'wonders'],
    lat: 30.322210,
    lng: 35.451330,
    heading: 10,
    pitch: 15,
    hints: [
      'Middle Eastern kingdom situated between Israel, Saudi Arabia, and Iraq.',
      'Rose-red sandstone canyon (The Siq) hand-carved by the Nabatean civilization.',
      'Famous archaeological site featured in Indiana Jones and the Last Crusade.'
    ],
    panoramaUrl: 'https://images.unsplash.com/photo-1579606032834-de0061e80e15?auto=format&fit=crop&w=2400&q=85&auto=format',
    streetViewEmbed: 'https://maps.google.com/maps?layer=c&cbll=30.322210,35.451330&output=svembed',
    tags: ['ancient', 'wonder', 'desert', 'unesco']
  },
  {
    id: 'loc_machu_picchu',
    name: 'Machu Picchu Inca Citadel, Cusco',
    country: 'Peru',
    countryCode: 'PE',
    region: 'wonders',
    pack: ['world', 'wonders', 'nature'],
    lat: -13.163141,
    lng: -72.544963,
    heading: 0,
    pitch: -5,
    hints: [
      'South American nation bordered by the Pacific Ocean with Spanish & Quechua heritage.',
      'High-altitude Andean dry-stone agricultural terraces overlooking the Urubamba River.',
      'Known as the "Lost City of the Incas", rediscovered by Hiram Bingham in 1911.'
    ],
    panoramaUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=2400&q=85&auto=format',
    streetViewEmbed: 'https://maps.google.com/maps?layer=c&cbll=-13.163141,-72.544963&output=svembed',
    tags: ['wonder', 'mountains', 'unesco', 'ancient']
  },
  {
    id: 'loc_taj_mahal',
    name: 'Taj Mahal Reflection Pool, Agra',
    country: 'India',
    countryCode: 'IN',
    region: 'india',
    pack: ['world', 'wonders', 'india'],
    lat: 27.175015,
    lng: 78.042155,
    heading: 0,
    pitch: 5,
    hints: [
      'Located in the northern plains of a massive South Asian nation along the Yamuna river.',
      'Mughal symmetry, white Makrana marble, calligraphy inlays, and Persian garden charbagh.',
      'Commissioned in 1631 by Emperor Shah Jahan in Uttar Pradesh.'
    ],
    panoramaUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=2400&q=85&auto=format',
    streetViewEmbed: 'https://maps.google.com/maps?layer=c&cbll=27.175015,78.042155&output=svembed',
    tags: ['wonder', 'india', 'unesco', 'monument']
  },
  {
    id: 'loc_colosseum_rome',
    name: 'Colosseum & Roman Forum, Rome',
    country: 'Italy',
    countryCode: 'IT',
    region: 'europe',
    pack: ['world', 'wonders', 'europe'],
    lat: 41.890210,
    lng: 12.492231,
    heading: 270,
    pitch: 10,
    hints: [
      'Southern European country with a boot-shaped peninsula and Mediterranean climate.',
      'Ancient Roman cobblestones, umbrella pine trees, and travertine stone arches.',
      'The largest amphitheater ever constructed in antiquity, completed under Titus in 80 AD.'
    ],
    panoramaUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=2400&q=85&auto=format',
    streetViewEmbed: 'https://maps.google.com/maps?layer=c&cbll=41.890210,12.492231&output=svembed',
    tags: ['wonder', 'europe', 'ancient', 'unesco']
  },
  {
    id: 'loc_christ_redeemer_rio',
    name: 'Christ the Redeemer, Corcovado, Rio',
    country: 'Brazil',
    countryCode: 'BR',
    region: 'wonders',
    pack: ['world', 'wonders'],
    lat: -22.951916,
    lng: -43.210487,
    heading: 90,
    pitch: 15,
    hints: [
      'South American Portuguese-speaking country famous for samba and tropical coastlines.',
      'Spectacular panoramic view of Guanabara Bay, Sugarloaf Mountain, and Copacabana beach.',
      'Gigantic 30-meter Art Deco statue atop the 700-meter Corcovado peak.'
    ],
    panoramaUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=2400&q=85&auto=format',
    streetViewEmbed: 'https://maps.google.com/maps?layer=c&cbll=-22.951916,-43.210487&output=svembed',
    tags: ['wonder', 'monument', 'coastal']
  },
  {
    id: 'loc_great_wall_china',
    name: 'Great Wall of China, Mutianyu',
    country: 'China',
    countryCode: 'CN',
    region: 'wonders',
    pack: ['world', 'wonders'],
    lat: 40.431908,
    lng: 116.570375,
    heading: 60,
    pitch: 5,
    hints: [
      'East Asian country with Chinese simplified characters and mountainous forested ridges.',
      'Continuous fortified stone wall with granite watchtowers snaking across mountain ridges.',
      'Historic defensive barrier built across northern borders to protect dynasties.'
    ],
    panoramaUrl: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=2400&q=85&auto=format',
    streetViewEmbed: 'https://maps.google.com/maps?layer=c&cbll=40.431908,116.570375&output=svembed',
    tags: ['wonder', 'ancient', 'unesco']
  },

  // ==========================================
  // 4. NEON MEGAPOLISES & SKYLINE EXPLORATION
  // ==========================================
  {
    id: 'loc_shibuya_scramble',
    name: 'Shibuya Crossing & Hachiko Plaza, Tokyo',
    country: 'Japan',
    countryCode: 'JP',
    region: 'cyber_cities',
    pack: ['world', 'cyber_cities'],
    lat: 35.659500,
    lng: 139.700400,
    heading: 180,
    pitch: 0,
    hints: [
      'East Asian metropolis with Japanese Kanji, Katakana neon billboards, and left-hand driving.',
      'The world’s busiest pedestrian scramble crossing where thousands cross simultaneously.',
      'Famous entertainment district outside Shibuya Station in Tokyo.'
    ],
    panoramaUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=2400&q=85&auto=format',
    streetViewEmbed: 'https://maps.google.com/maps?layer=c&cbll=35.6595,139.7004&output=svembed',
    tags: ['city', 'neon', 'asia']
  },
  {
    id: 'loc_times_square_nyc',
    name: 'Times Square & Broadway, New York City',
    country: 'United States',
    countryCode: 'US',
    region: 'cyber_cities',
    pack: ['world', 'cyber_cities'],
    lat: 40.758000,
    lng: -73.985500,
    heading: 90,
    pitch: 12,
    hints: [
      'North American Atlantic coast city with yellow medallion cabs and street grid numbering.',
      'Towering LED digital billboards, Broadway theater marquees, and pedestrian plaza.',
      'Nicknamed "The Crossroads of the World" at 42nd St & Broadway, Manhattan.'
    ],
    panoramaUrl: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=2400&q=85&auto=format',
    streetViewEmbed: 'https://maps.google.com/maps?layer=c&cbll=40.758,-73.9855&output=svembed',
    tags: ['city', 'americas', 'skyscrapers']
  },
  {
    id: 'loc_burj_khalifa_dubai',
    name: 'Burj Khalifa & Downtown Lake, Dubai',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    region: 'cyber_cities',
    pack: ['world', 'cyber_cities'],
    lat: 25.197200,
    lng: 55.274400,
    heading: 10,
    pitch: 25,
    hints: [
      'Persian Gulf desert federation known for futuristic architecture and luxury superstructures.',
      'Illuminated dancing fountain lake in front of an 828-meter needle-shaped megatall skyscraper.',
      'The tallest structure and building in the world since 2009.'
    ],
    panoramaUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2400&q=85&auto=format',
    streetViewEmbed: 'https://maps.google.com/maps?layer=c&cbll=25.1972,55.2744&output=svembed',
    tags: ['city', 'skyscrapers', 'desert']
  }
];

/**
 * Generates a randomized list of 5 unique locations for a game round
 * @param {string} packId Selected region pack
 * @returns {Array} 5 random location objects
 */
export function generateGameLocations(packId = 'abandoned') {
  let pool = LOCATION_DATABASE.filter(loc => loc.pack.includes(packId));
  if (pool.length < 5) {
    pool = LOCATION_DATABASE;
  }
  
  // Fisher-Yates shuffle
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled.slice(0, 5);
}

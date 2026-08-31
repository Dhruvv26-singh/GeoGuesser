import React, { useState, useEffect } from 'react';
import { Sparkles, X, ShoppingBag, Check, ShieldCheck, Trophy, Crown, Shirt, Wand2, Compass, Tag, Zap, Coins } from 'lucide-react';

const AVATAR_CATEGORIES = [
  { id: 'featured', name: 'Featured', icon: '⭐' },
  { id: 'headwear', name: 'Hats & Hair', icon: '🎩' },
  { id: 'outfits', name: 'Jackets & Gear', icon: '🧥' },
  { id: 'accessories', name: 'Glasses & Masks', icon: '🕶️' },
  { id: 'badges', name: 'Titles & Badges', icon: '🎖️' },
  { id: 'backgrounds', name: 'Card Themes', icon: '🌌' }
];

const SHOP_ITEMS = [
  // FEATURED
  {
    id: 'wc26_berlin_jacket',
    name: "World Championship '26 Jacket",
    category: 'featured',
    type: 'outfit',
    price: 800,
    rarity: 'legendary',
    image: '🧥',
    previewColor: '#00f0b5',
    desc: 'Official Berlin World Championship competitor bomber jacket.'
  },
  {
    id: 'cyber_explorer_visor',
    name: 'Cyber Geo-Visor 3000',
    category: 'featured',
    type: 'accessory',
    price: 650,
    rarity: 'epic',
    image: '🥽',
    previewColor: '#06b6d4',
    desc: 'HUD-enabled augmented reality explorer visor with live compass.'
  },
  {
    id: 'chernobyl_stalker_hood',
    name: 'Chernobyl Stalker Gas Mask',
    category: 'featured',
    type: 'headwear',
    price: 950,
    rarity: 'legendary',
    image: '🎭',
    previewColor: '#eab308',
    desc: 'Heavy-duty filtration mask worn in the Pripyat exclusion zone.'
  },

  // HEADWEAR
  {
    id: 'safari_pith_helmet',
    name: 'Serengeti Safari Pith Helmet',
    category: 'headwear',
    type: 'headwear',
    price: 350,
    rarity: 'rare',
    image: '🤠',
    previewColor: '#d97706',
    desc: 'Classic sun protection for traversing the African savannah.'
  },
  {
    id: 'viking_horned_helm',
    name: 'Nordic Viking Horned Helm',
    category: 'headwear',
    type: 'headwear',
    price: 500,
    rarity: 'epic',
    image: '🪖',
    previewColor: '#64748b',
    desc: 'Forged in Scandinavia for navigating icy fjords.'
  },
  {
    id: 'ushanka_fur_hat',
    name: 'Siberian Ushanka Fur Hat',
    category: 'headwear',
    type: 'headwear',
    price: 300,
    rarity: 'common',
    image: '💂',
    previewColor: '#78716c',
    desc: 'Warm insulated ear-flap hat for sub-zero GeoGuessr rounds.'
  },

  // OUTFITS
  {
    id: 'retro_nomad_windbreaker',
    name: '90s Retro Nomad Windbreaker',
    category: 'outfits',
    type: 'outfit',
    price: 450,
    rarity: 'rare',
    image: '🦺',
    previewColor: '#ec4899',
    desc: 'Neon-soaked aesthetic for streetview speedrunners.'
  },
  {
    id: 'himalayan_mountaineer_parka',
    name: 'Himalayan 8000m Down Parka',
    category: 'outfits',
    type: 'outfit',
    price: 600,
    rarity: 'epic',
    image: '🧗',
    previewColor: '#ef4444',
    desc: 'Extreme weather thermal shell certified for Mount Everest.'
  },
  {
    id: 'tuxedo_grandmaster',
    name: 'Grandmaster Diplomat Tuxedo',
    category: 'outfits',
    type: 'outfit',
    price: 1200,
    rarity: 'legendary',
    image: '🤵',
    previewColor: '#1e293b',
    desc: 'Tailored black-tie suit reserved for Top 100 global champions.'
  },

  // ACCESSORIES
  {
    id: 'aviator_gold_shades',
    name: 'Top Gun Gold Aviators',
    category: 'accessories',
    type: 'accessory',
    price: 250,
    rarity: 'common',
    image: '🕶️',
    previewColor: '#eab308',
    desc: 'Polarized gold-rim sunglasses for sun glare inspection.'
  },
  {
    id: 'steampunk_monocle',
    name: 'Surveyor Brass Monocle',
    category: 'accessories',
    type: 'accessory',
    price: 400,
    rarity: 'rare',
    image: '🧐',
    previewColor: '#b45309',
    desc: 'Precision lens for reading distant microscopic road signs.'
  },

  // BADGES
  {
    id: 'badge_continent_master',
    name: 'Continent Conqueror Badge',
    category: 'badges',
    type: 'badge',
    price: 500,
    rarity: 'epic',
    image: '🏅',
    previewColor: '#10b981',
    desc: 'Profile title: "Master of 7 Continents"'
  },
  {
    id: 'badge_meta_detective',
    name: 'Meta Detective Badge',
    category: 'badges',
    type: 'badge',
    price: 750,
    rarity: 'legendary',
    image: '🕵️',
    previewColor: '#8b5cf6',
    desc: 'Profile title: "Bollard & Camera Gen Master"'
  }
];

export default function AvatarShopModal({ isOpen, onClose, userCoins = 1500, onUpdateCoins }) {
  const [activeCategory, setActiveCategory] = useState('featured');
  const [coins, setCoins] = useState(() => {
    const saved = localStorage.getItem('geoquest_coins');
    return saved !== null ? parseInt(saved, 10) : userCoins;
  });

  const [equippedAvatar, setEquippedAvatar] = useState(() => {
    const saved = localStorage.getItem('geoquest_avatar_config');
    return saved ? JSON.parse(saved) : {
      skinColor: '#ffd1a4',
      shirtColor: '#00f0b5',
      hat: '🤠',
      outfit: '🧥',
      glasses: '🕶️',
      title: 'World Explorer'
    };
  });

  const [ownedItems, setOwnedItems] = useState(() => {
    const saved = localStorage.getItem('geoquest_owned_items');
    return saved ? JSON.parse(saved) : ['safari_pith_helmet', 'aviator_gold_shades'];
  });

  const [notification, setNotification] = useState('');

  useEffect(() => {
    localStorage.setItem('geoquest_coins', coins.toString());
  }, [coins]);

  useEffect(() => {
    localStorage.setItem('geoquest_avatar_config', JSON.stringify(equippedAvatar));
  }, [equippedAvatar]);

  useEffect(() => {
    localStorage.setItem('geoquest_owned_items', JSON.stringify(ownedItems));
  }, [ownedItems]);

  if (!isOpen) return null;

  const handleBuyOrEquip = (item) => {
    const isOwned = ownedItems.includes(item.id);

    if (!isOwned) {
      if (coins < item.price) {
        setNotification('⚠️ Not enough GeoCoins! Play games to earn more.');
        setTimeout(() => setNotification(''), 2500);
        return;
      }
      // Purchase item
      const nextCoins = coins - item.price;
      setCoins(nextCoins);
      if (onUpdateCoins) onUpdateCoins(nextCoins);
      setOwnedItems((prev) => [...prev, item.id]);
      setNotification(`🎉 Unlocked ${item.name}!`);
      setTimeout(() => setNotification(''), 2500);
    }

    // Equip item onto avatar
    setEquippedAvatar((prev) => {
      const next = { ...prev };
      if (item.type === 'headwear') next.hat = item.image;
      if (item.type === 'outfit') next.outfit = item.image;
      if (item.type === 'accessory') next.glasses = item.image;
      if (item.type === 'badge') next.title = item.name;
      return next;
    });
  };

  const filteredItems = activeCategory === 'featured'
    ? SHOP_ITEMS
    : SHOP_ITEMS.filter((i) => i.category === activeCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[850px] rounded-3xl bg-[#0e121b] border border-slate-700/80 shadow-[0_0_50px_rgba(0,240,181,0.15)] flex flex-col overflow-hidden">
        
        {/* Top Shop Header Bar (GeoGuessr Theme) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#090c13]/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#00f0b5] to-teal-400 flex items-center justify-center shadow-lg shadow-[#00f0b5]/20 text-slate-950">
              <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-black text-xl text-white tracking-wide">
                  AVATAR SHOP & LOCKER
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#00f0b5] text-[10px] font-mono font-bold border border-[#00f0b5]/30 uppercase">
                  Season 2026
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Customize your official GeoGuessr explorer persona & flex on the leaderboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* GeoCoins Counter */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 shadow-inner">
              <span className="text-base">🪙</span>
              <div className="text-right">
                <span className="text-[10px] font-bold text-amber-400/80 uppercase block leading-none">GeoCoins</span>
                <span className="font-heading font-black text-sm text-amber-300">{coins.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-[#00f0b5] text-slate-950 font-heading font-extrabold text-xs shadow-2xl animate-in slide-in-from-top-4">
            {notification}
          </div>
        )}

        {/* Main Body: Left Live Avatar Stage & Right Shop Catalog */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
          
          {/* LEFT: Live Interactive Avatar Stage (4 cols) */}
          <div className="lg:col-span-4 p-6 bg-gradient-to-b from-[#131825] to-[#0a0d14] border-r border-slate-800 flex flex-col items-center justify-between">
            <div className="w-full text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Your Live Explorer Card</span>
              <h3 className="text-base font-heading font-bold text-white mt-0.5">{equippedAvatar.title}</h3>
            </div>

            {/* Avatar 3D Stage Card */}
            <div className="relative w-56 h-64 rounded-3xl bg-gradient-to-b from-slate-800/80 via-slate-900 to-slate-950 border border-slate-700 shadow-2xl flex flex-col items-center justify-center overflow-hidden my-4">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,181,0.15),transparent_70%)] pointer-events-none" />
              
              {/* Dynamic Avatar Composition */}
              <div className="relative flex flex-col items-center justify-center">
                {/* Hat Item */}
                <div className="text-5xl -mb-4 z-20 animate-bounce duration-1000">
                  {equippedAvatar.hat}
                </div>

                {/* Face & Head */}
                <div
                  className="w-24 h-24 rounded-full border-4 border-slate-900 shadow-xl flex items-center justify-center relative z-10"
                  style={{ backgroundColor: equippedAvatar.skinColor }}
                >
                  {/* Glasses */}
                  <span className="text-3xl drop-shadow-md">{equippedAvatar.glasses}</span>
                </div>

                {/* Body / Outfit */}
                <div className="text-5xl -mt-3 z-20">
                  {equippedAvatar.outfit}
                </div>
              </div>

              {/* Stage Platform Ring */}
              <div className="absolute bottom-4 w-36 h-4 rounded-full bg-[#00f0b5]/20 border border-[#00f0b5]/40 blur-xs" />
            </div>

            {/* Skin Tone Quick Picker */}
            <div className="w-full flex items-center justify-center gap-2 py-2">
              {['#ffd1a4', '#f1c27d', '#c68642', '#8d5524', '#3c2415'].map((color) => (
                <button
                  key={color}
                  onClick={() => setEquippedAvatar((prev) => ({ ...prev, skinColor: color }))}
                  className={`w-6 h-6 rounded-full border-2 transition-transform ${
                    equippedAvatar.skinColor === color ? 'border-[#00f0b5] scale-125' : 'border-slate-700 hover:scale-110'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            <div className="w-full text-center text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
              💡 Earn <span className="text-amber-400 font-bold">100 GeoCoins</span> every time you score 4,000+ points in a round!
            </div>
          </div>

          {/* RIGHT: Categories & Shop Grid (8 cols) */}
          <div className="lg:col-span-8 flex flex-col h-full overflow-hidden bg-[#0a0d14]">
            
            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 p-3.5 border-b border-slate-800/80 overflow-x-auto shrink-0 scrollbar-none">
              {AVATAR_CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-heading font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-[#00f0b5] text-slate-950 shadow-lg shadow-[#00f0b5]/20 scale-100'
                        : 'bg-slate-900/70 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Product Item Grid */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {filteredItems.map((item) => {
                const isOwned = ownedItems.includes(item.id);
                const isEquipped =
                  equippedAvatar.hat === item.image ||
                  equippedAvatar.outfit === item.image ||
                  equippedAvatar.glasses === item.image ||
                  equippedAvatar.title === item.name;

                const rarityBorders = {
                  common: 'border-slate-700/60',
                  rare: 'border-blue-500/50',
                  epic: 'border-purple-500/50',
                  legendary: 'border-amber-500/60 shadow-amber-500/10'
                };

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl bg-gradient-to-b from-[#131825] to-[#0e121d] border flex flex-col justify-between transition-all duration-200 hover:scale-[1.02] shadow-xl ${
                      rarityBorders[item.rarity] || 'border-slate-800'
                    }`}
                  >
                    <div>
                      {/* Top Row: Rarity Tag & Price */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-900/90 text-slate-300 border border-slate-700">
                          {item.rarity}
                        </span>

                        <div className="flex items-center gap-1 font-heading font-black text-xs text-amber-400">
                          <span>🪙</span>
                          <span>{item.price}</span>
                        </div>
                      </div>

                      {/* Item Icon Showcase */}
                      <div className="w-full h-24 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-center text-4xl shadow-inner mb-3">
                        {item.image}
                      </div>

                      <h4 className="font-heading font-bold text-sm text-white leading-snug">{item.name}</h4>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed line-clamp-2">{item.desc}</p>
                    </div>

                    {/* Action Button */}
                    <div className="mt-4 pt-3 border-t border-slate-800/80">
                      <button
                        onClick={() => handleBuyOrEquip(item)}
                        className={`w-full py-2 rounded-xl font-heading font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md ${
                          isEquipped
                            ? 'bg-slate-800 text-[#00f0b5] border border-[#00f0b5]/40 cursor-default'
                            : isOwned
                            ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20'
                            : 'bg-gradient-to-r from-[#00f0b5] to-emerald-400 hover:from-[#1bf7aa] hover:to-emerald-300 text-slate-950 shadow-emerald-500/20'
                        }`}
                      >
                        {isEquipped ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>EQUIPPED</span>
                          </>
                        ) : isOwned ? (
                          <>
                            <Wand2 className="w-3.5 h-3.5" />
                            <span>EQUIP ITEM</span>
                          </>
                        ) : (
                          <>
                            <Coins className="w-3.5 h-3.5" />
                            <span>UNLOCK &bull; {item.price} 🪙</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

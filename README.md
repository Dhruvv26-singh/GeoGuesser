# 🌍 GeoGuessr Web

A full-stack, feature-packed **GeoGuessr Web Application** featuring 360° Ultra-HD panoramic exploration, watermark-free Google Satellite maps, an official Avatar Shop & Locker, and multi-engine AI satellite clues.

![GeoGuessr Banner](https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2400&q=85)

---

## 🌟 Key Features

### 1. 🖼️ Ultra-HD 360° Photosphere Explorer
* Full **360° interactive look-around** with smooth hardware-accelerated GPU panning, compass orientation, and zoom.
* Curated exploration packs:
  * 👻 **Abandoned & Ghost Towns**: Pripyat Chernobyl, Kolmanskop Desert Ghost Town, Hashima Island, Bodie Gold Rush, Craco Medieval Ruins, and Kuldhara Village.
  * 🛣️ **Lonely Highways & Roads**: Route 66, Australian Outback Stuart Highway, Iceland Ring Road, and Himalayan Taglang La Pass.
  * 🏛️ **Wonders of the World**: Pyramids of Giza, Machu Picchu, Petra, Colosseum, Taj Mahal, and Christ the Redeemer.
  * 🌆 **Neon Megacities**: Tokyo Shibuya Crossing, Times Square NYC, Dubai Burj Khalifa, and more.

### 2. 🗺️ Watermark-Free Interactive Maps
* Direct high-resolution map tile providers with **zero API keys required**:
  * 🛰️ **Google Satellite Hybrid**
  * 🏙️ **Google Streets**
  * 🌍 **OpenStreetMap Standard**
* Accurate Haversine distance scoring (up to 5,000 points per round / 25,000 total score).

### 3. 🛍️ Official Avatar Shop & Customizer
* Modelled after `geoguessr.com/shop/avatar/featured`.
* Customize your explorer avatar with hats, jackets, sunglasses, and titles.
* **GeoCoins Economy**: Earn GeoCoins automatically by scoring high in rounds to unlock exclusive gear.

### 4. 🧠 Multi-Engine AI Clues
* Multi-model intelligence powered by:
  * ♊ **Google Gemini API**
  * ⚡ **Groq LLaMA 3.3**
  * 🧭 **Zero-Key Heuristics Clue Engine** (works completely offline with no setup)

### 5. 👥 Party Mode & Leaderboards
* Generate 5-digit room codes to host custom lobbies and play with friends.
* Global player rankings and round history summaries.

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/Dhruvv26-singh/GeoGuesser.git
cd GeoGuesser
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```

Open your browser and navigate to **`http://localhost:5173`** to start playing!

---

## 🛠️ Tech Stack

* **Frontend**: React 18, Vite, TailwindCSS, Lucide Icons, Framer Motion
* **Mapping**: Leaflet.js, Google Satellite Hybrid Tiles, OpenStreetMap
* **AI Engine**: Google Gemini API, Groq Cloud API, Geographic Heuristics Engine
* **Storage & Backend**: Supabase PostgreSQL & LocalStorage state caching

---

## 📜 License

MIT License &copy; 2026 Dhruv Singh

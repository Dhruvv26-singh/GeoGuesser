import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Maximize2, Minimize2, Crosshair, Layers, Satellite, Map as MapIcon, Globe } from 'lucide-react';

// 100% Free, High-Speed, Watermark-Free Map Layers (Zero API Key Required)
const MAP_LAYERS = {
  googleHybrid: {
    id: 'googleHybrid',
    name: 'Google Satellite',
    icon: '🛰️',
    url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    options: { maxZoom: 20, attribution: 'Google Maps' }
  },
  googleRoad: {
    id: 'googleRoad',
    name: 'Google Streets',
    icon: '🗺️',
    url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    options: { maxZoom: 20, attribution: 'Google Maps' }
  },
  osm: {
    id: 'osm',
    name: 'OpenStreetMap',
    icon: '🌐',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    options: { subdomains: 'abc', maxZoom: 19, attribution: '© OpenStreetMap' }
  },
  esriSatellite: {
    id: 'esriSatellite',
    name: 'Esri World HD',
    icon: '🌍',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    options: { maxZoom: 18, attribution: 'Esri' }
  },
  googleTerrain: {
    id: 'googleTerrain',
    name: 'Google Terrain',
    icon: '⛰️',
    url: 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
    options: { maxZoom: 20, attribution: 'Google Maps' }
  }
};

export default function GuessMap({ onGuessSubmit, isGuessingEnabled = true, activeRound }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const activeTileLayerRef = useRef(null);
  const markerRef = useRef(null);

  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [activeLayerId, setActiveLayerId] = useState('googleHybrid');
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);

  // Initialize Leaflet Map with Google Satellite Hybrid (No API Key Required)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [20, 0],
        zoom: 2,
        minZoom: 1.5,
        maxZoom: 20,
        worldCopyJump: true,
        zoomControl: false,
        attributionControl: false
      });

      // Default: Google Hybrid Satellite (crystal clear, roads labeled, zero watermark)
      const baseLayer = L.tileLayer(MAP_LAYERS.googleHybrid.url, MAP_LAYERS.googleHybrid.options).addTo(map);
      activeTileLayerRef.current = baseLayer;

      // Custom Zoom control at bottom left
      L.control.zoom({ position: 'bottomleft' }).addTo(map);

      // Handle map click to drop guess pin
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        // Normalize longitude between -180 and 180
        const normalizedLng = ((((lng + 180) % 360) + 360) % 360) - 180;
        const coords = { lat, lng: normalizedLng };
        
        setSelectedCoords(coords);

        // Custom Neon Pin Marker HTML
        const customPinHtml = `
          <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-full pin-drop-anim">
            <div class="absolute w-8 h-8 rounded-full bg-rose-500/30 pulse-ring"></div>
            <div class="relative w-8 h-8 rounded-full bg-gradient-to-tr from-rose-600 to-rose-400 border-2 border-white shadow-[0_0_15px_rgba(244,63,94,0.8)] flex items-center justify-center">
              <div class="w-2.5 h-2.5 rounded-full bg-white shadow-sm"></div>
            </div>
            <div class="absolute -bottom-1 w-2 h-2 bg-rose-600 rotate-45"></div>
          </div>
        `;

        const customIcon = L.divIcon({
          className: 'custom-guess-pin',
          html: customPinHtml,
          iconSize: [32, 32],
          iconAnchor: [16, 32]
        });

        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng], { icon: customIcon }).addTo(map);
        }
      });

      mapInstanceRef.current = map;
    }
  }, []);

  // Switch Map Tile Layer
  const handleLayerChange = (layerKey) => {
    if (!mapInstanceRef.current || !MAP_LAYERS[layerKey]) return;

    if (activeTileLayerRef.current) {
      mapInstanceRef.current.removeLayer(activeTileLayerRef.current);
    }

    const newLayer = L.tileLayer(MAP_LAYERS[layerKey].url, MAP_LAYERS[layerKey].options).addTo(mapInstanceRef.current);
    activeTileLayerRef.current = newLayer;
    setActiveLayerId(layerKey);
    setIsLayerMenuOpen(false);
  };

  // Invalidate map size when expanded / collapsed
  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current.invalidateSize();
      }, 300);
    }
  }, [isExpanded]);

  // Reset pin when active round changes
  useEffect(() => {
    setSelectedCoords(null);
    if (markerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(markerRef.current);
      markerRef.current = null;
    }
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([20, 0], 2);
    }
  }, [activeRound]);

  const handleConfirmGuess = (e) => {
    e.stopPropagation();
    if (!selectedCoords || !isGuessingEnabled) return;
    onGuessSubmit(selectedCoords);
  };

  const handleRecenter = (e) => {
    e.stopPropagation();
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([20, 0], 2);
    }
  };

  return (
    <div
      className={`absolute bottom-6 right-6 z-30 transition-all duration-300 ease-out select-none ${
        isExpanded
          ? 'w-[94vw] md:w-[720px] h-[550px] shadow-2xl'
          : 'w-[300px] md:w-[400px] h-[240px] md:h-[290px] hover:w-[340px] md:hover:w-[460px] hover:h-[280px] md:hover:h-[350px] shadow-xl'
      }`}
    >
      <div className="relative w-full h-full rounded-2xl overflow-hidden glass-panel border border-slate-700/80 group">
        {/* Leaflet Container */}
        <div ref={mapContainerRef} className="w-full h-full cursor-crosshair" />

        {/* Top Controls inside Map */}
        <div className="absolute top-3 right-3 z-[1000] flex items-center gap-1.5 pointer-events-auto">
          
          {/* Layer Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
              title="Change Map Style (Google Satellite, Google Streets, OSM, Terrain)"
              className="px-2.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-cyan-400 border border-slate-700 flex items-center gap-1.5 text-xs font-bold shadow-md transition-all"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>{MAP_LAYERS[activeLayerId]?.name}</span>
            </button>

            {isLayerMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl bg-slate-900/95 border border-slate-700/90 shadow-2xl backdrop-blur-md p-1.5 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                  Map Layers (Zero Key Required)
                </div>
                {Object.values(MAP_LAYERS).map((layer) => (
                  <button
                    key={layer.id}
                    onClick={() => handleLayerChange(layer.id)}
                    className={`w-full px-2.5 py-2 rounded-lg text-left text-xs font-semibold flex items-center gap-2 transition-colors ${
                      activeLayerId === layer.id
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{layer.icon}</span>
                    <span>{layer.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleRecenter}
            title="Reset Map View"
            className="w-8 h-8 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 flex items-center justify-center shadow-md transition-all"
          >
            <Crosshair className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Collapse Map' : 'Expand Map'}
            className="w-8 h-8 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 flex items-center justify-center shadow-md transition-all"
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Floating Guess Submit Button */}
        <div className="absolute bottom-3 right-3 z-[1000] pointer-events-auto">
          <button
            onClick={handleConfirmGuess}
            disabled={!selectedCoords || !isGuessingEnabled}
            className={`px-5 py-2.5 rounded-xl font-heading font-bold text-xs md:text-sm flex items-center gap-2 shadow-lg transition-all duration-200 ${
              selectedCoords && isGuessingEnabled
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/25 scale-100 hover:scale-105 active:scale-95 cursor-pointer animate-pulse'
                : 'bg-slate-800/90 text-slate-500 border border-slate-700/60 cursor-not-allowed opacity-80'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>{selectedCoords ? 'SUBMIT GUESS PIN' : 'CLICK MAP TO PIN'}</span>
          </button>
        </div>

        {/* Helper Badge */}
        {!selectedCoords && (
          <div className="absolute bottom-3 left-14 z-[1000] pointer-events-none hidden md:block">
            <span className="text-[11px] font-medium text-slate-300 bg-slate-950/85 border border-slate-800 px-2.5 py-1 rounded-md backdrop-blur-sm shadow-md">
              Click anywhere on Earth to drop your pin
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

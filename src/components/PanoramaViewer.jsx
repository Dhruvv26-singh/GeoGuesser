import React, { useEffect, useRef, useState } from 'react';
import { Compass, Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCcw, Navigation, Play, Pause } from 'lucide-react';

export default function PanoramaViewer({ location, onReady }) {
  const [fallbackBearing, setFallbackBearing] = useState(location?.heading || 0);
  const [fallbackPitch, setFallbackPitch] = useState(location?.pitch || 0);
  const [fallbackZoom, setFallbackZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentCompassHeading, setCurrentCompassHeading] = useState(location?.heading || 0);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(true);

  // Progressive Image Loader with 1.5s Safety Timeout
  useEffect(() => {
    setFallbackBearing(location?.heading || 0);
    setFallbackPitch(location?.pitch || 0);
    setFallbackZoom(1);
    setCurrentCompassHeading(location?.heading || 0);

    if (location?.panoramaUrl) {
      setIsImageLoaded(false);
      const img = new Image();
      img.src = location.panoramaUrl;

      // Timeout safety: never leave user on blank screen longer than 1.2s
      const timeout = setTimeout(() => {
        setIsImageLoaded(true);
      }, 1200);

      img.onload = () => {
        clearTimeout(timeout);
        setIsImageLoaded(true);
        if (onReady) onReady();
      };

      img.onerror = () => {
        clearTimeout(timeout);
        setIsImageLoaded(true);
      };

      return () => clearTimeout(timeout);
    } else {
      setIsImageLoaded(true);
    }
  }, [location]);

  // Smooth Auto-rotation loop
  useEffect(() => {
    if (!isAutoRotating || isDragging) return;
    const interval = setInterval(() => {
      setFallbackBearing((prev) => {
        const next = (prev + 0.12) % 360;
        setCurrentCompassHeading(Math.round(next));
        return next;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [isAutoRotating, isDragging]);

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setIsAutoRotating(false);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    setFallbackBearing((prev) => {
      const next = (prev - deltaX * 0.2) % 360;
      const normalized = next < 0 ? next + 360 : next;
      setCurrentCompassHeading(Math.round(normalized));
      return normalized;
    });

    setFallbackPitch((prev) => {
      const next = prev + deltaY * 0.12;
      return Math.max(-25, Math.min(25, next));
    });

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    setFallbackZoom((prev) => {
      const next = prev - e.deltaY * 0.001;
      return Math.max(1, Math.min(2.2, next));
    });
  };

  // Touch handlers for mobile/tablet
  const handleTouchStart = (e) => {
    if (e.touches.length !== 1) return;
    setIsDragging(true);
    setIsAutoRotating(false);
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - dragStart.x;
    const deltaY = e.touches[0].clientY - dragStart.y;

    setFallbackBearing((prev) => {
      const next = (prev - deltaX * 0.25) % 360;
      const normalized = next < 0 ? next + 360 : next;
      setCurrentCompassHeading(Math.round(normalized));
      return normalized;
    });

    setFallbackPitch((prev) => {
      const next = prev + deltaY * 0.15;
      return Math.max(-25, Math.min(25, next));
    });

    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const resetView = () => {
    setFallbackBearing(location?.heading || 0);
    setFallbackPitch(location?.pitch || 0);
    setFallbackZoom(1);
    setCurrentCompassHeading(location?.heading || 0);
  };

  // Safe Panorama URL with reliable fallback
  const safeImageUrl = location?.panoramaUrl || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2400&q=85';

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-slate-950 select-none cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      {/* Loading Spinner */}
      {!isImageLoaded && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-sm pointer-events-none transition-opacity duration-300">
          <div className="w-10 h-10 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
          <p className="mt-3 text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest animate-pulse">
            Rendering 360° Scene...
          </p>
        </div>
      )}

      {/* High-Definition 360 Panoramic Scene */}
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-slate-900">
        <div
          className="w-full h-full will-change-transform"
          style={{
            backgroundImage: `url(${safeImageUrl})`,
            backgroundColor: '#0f172a',
            backgroundSize: 'cover',
            backgroundPosition: `${(fallbackBearing / 360) * 100}% ${50 - fallbackPitch * 0.8}%`,
            backgroundRepeat: 'repeat-x',
            transform: `scale(${fallbackZoom})`,
            transformOrigin: 'center center',
            filter: 'contrast(1.03) saturate(1.08)',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out'
          }}
        />
        {/* Subtle cinematic vignette */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_55%,rgba(0,0,0,0.35)_100%)]" />
      </div>

      {/* Floating HUD: Compass Rose */}
      <div className="absolute top-20 left-6 z-20 flex flex-col items-center gap-2 pointer-events-auto">
        <button
          onClick={resetView}
          title="Click to reset North"
          className="relative w-14 h-14 rounded-full bg-slate-900/85 backdrop-blur-md border border-slate-700/80 shadow-2xl flex items-center justify-center group hover:border-cyan-500/60 hover:scale-105 transition-all duration-200"
        >
          {/* Compass Needle */}
          <div
            className="w-10 h-10 flex items-center justify-center transition-transform duration-100 ease-out"
            style={{ transform: `rotate(${-currentCompassHeading}deg)` }}
          >
            <div className="w-1.5 h-7 flex flex-col items-center">
              <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[14px] border-b-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
              <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[14px] border-t-slate-400" />
            </div>
          </div>
          <span className="absolute top-1 text-[9px] font-bold text-rose-400">N</span>
        </button>
        <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-950/80 border border-slate-800 text-slate-200 backdrop-blur-sm shadow-md">
          {Math.round(currentCompassHeading)}°
        </span>
      </div>

      {/* Floating Panorama Control Bar */}
      <div className="absolute top-20 right-6 z-20 flex flex-col gap-2 pointer-events-auto">
        <button
          onClick={() => setIsAutoRotating(!isAutoRotating)}
          title={isAutoRotating ? 'Pause Auto-Pan' : 'Start 360 Auto-Pan'}
          className={`w-10 h-10 rounded-xl border flex items-center justify-center backdrop-blur-md shadow-lg transition-all ${
            isAutoRotating
              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 animate-pulse'
              : 'bg-slate-900/85 hover:bg-slate-800 border-slate-700/80 text-slate-200 hover:text-cyan-400'
          }`}
        >
          {isAutoRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        <button
          onClick={() => setFallbackZoom((z) => Math.min(2.2, z + 0.2))}
          title="Zoom In"
          className="w-10 h-10 rounded-xl bg-slate-900/85 hover:bg-slate-800 border border-slate-700/80 text-slate-200 hover:text-cyan-400 flex items-center justify-center backdrop-blur-md shadow-lg transition-all"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          onClick={() => setFallbackZoom((z) => Math.max(1, z - 0.2))}
          title="Zoom Out"
          className="w-10 h-10 rounded-xl bg-slate-900/85 hover:bg-slate-800 border border-slate-700/80 text-slate-200 hover:text-cyan-400 flex items-center justify-center backdrop-blur-md shadow-lg transition-all"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <button
          onClick={resetView}
          title="Reset View"
          className="w-10 h-10 rounded-xl bg-slate-900/85 hover:bg-slate-800 border border-slate-700/80 text-slate-200 hover:text-cyan-400 flex items-center justify-center backdrop-blur-md shadow-lg transition-all"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={toggleFullscreen}
          title="Toggle Fullscreen"
          className="w-10 h-10 rounded-xl bg-slate-900/85 hover:bg-slate-800 border border-slate-700/80 text-slate-200 hover:text-cyan-400 flex items-center justify-center backdrop-blur-md shadow-lg transition-all"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Bottom Hint Indicator */}
      <div className="absolute bottom-6 left-6 z-20 pointer-events-none flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-slate-300 text-xs backdrop-blur-md shadow-xl">
        <Navigation className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        <span>Drag left / right to scan 360° &bull; Scroll to zoom</span>
      </div>
    </div>
  );
}

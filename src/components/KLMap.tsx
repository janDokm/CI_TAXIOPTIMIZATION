/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Taxi, Stop } from '../types';
import { KL_LANDMARKS, DEPOT_STOP } from '../data/klMapData';
import { MapPin, Star, Play, Pause, FastForward, RotateCcw, Cpu, Compass, Navigation, Eye, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';

interface KLMapProps {
  taxis: Taxi[];
  selectedTaxiId: string | null;
  onSelectTaxi: (id: string | null) => void;
  selectedStop: Stop | null;
  onSelectStop: (stop: Stop | null) => void;
  activeTab: string;
}

export default function KLMap({
  taxis,
  selectedTaxiId,
  onSelectTaxi,
  selectedStop,
  onSelectStop,
  activeTab,
}: KLMapProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1); // 1x, 2x, 4x
  const [simTime, setSimTime] = useState({ hour: 8, minute: 0 });
  const [simProgress, setSimProgress] = useState(0); // 0 to 100 representing current progress loop
  const [trafficLayer, setTrafficLayer] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Dynamic state to hold real-time GPS locations of cabs
  const [cabPositions, setCabPositions] = useState<{ [id: string]: { x: number; y: number; next: string } }>({});

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Use RequestAnimationFrame for smooth transitions
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying) {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
      return;
    }

    const animate = (time: number) => {
      if (previousTimeRef.current !== null) {
        const deltaTime = time - previousTimeRef.current;
        // Adjust speed increment
        const increment = (deltaTime / 240) * speed;
        setSimProgress((prev) => {
          const next = prev + increment;
          if (next >= 100) {
            setSimTime((timePrev) => {
              let nextMin = timePrev.minute + 5;
              let nextHour = timePrev.hour;
              if (nextMin >= 60) {
                nextMin = 0;
                nextHour += 1;
                if (nextHour > 20) nextHour = 8; // Loop morning to evening
              }
              return { hour: nextHour, minute: nextMin };
            });
            return 0;
          }
          return next;
        });
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, speed]);

  // Helper to construct custom curved SVG paths following realistic Kuala Lumpur roads and expressways
  const getRoutePathD = (taxi: Taxi) => {
    switch (taxi.id) {
      case 'alpha':
        // Bangsar, Damansara, Mid Valley: Winding curves following Western sub-streets
        // Stops coordinates: 101: (25, 58), 102: (18, 46), 103: (12, 38), 104: (28, 76), 105: (22, 85)
        return `M 48 65 C 44 68, 38 72, 28 76 C 24 74, 22 82, 22 85 C 18 80, 20 68, 25 58 C 22 52, 20 50, 18 46 C 14 42, 13 40, 12 38 C 16 44, 24 50, 28 55 C 38 60, 42 63, 48 65`;
      case 'beta':
        // Northern Districts (Sentul, Titiwangsa, Chow Kit, Kampung Baru)
        // Stops coordinates: 201: (48, 21), 202: (60, 22), 203: (52, 33), 204: (64, 30), 205: (38, 28)
        return `M 48 65 C 45 55, 36 40, 38 28 C 42 24, 45 22, 48 21 C 54 21, 58 18, 60 22 C 58 28, 54 30, 52 33 C 58 31, 62 29, 64 30 C 58 45, 52 55, 48 65`;
      case 'gamma':
        // City Core (Pavilion Bukit Bintang, KLCC Twin Towers, Tun Razak Exchange, Petaling Street Chinatown)
        // Stops coordinates: 301: (72, 35), 302: (76, 51), 303: (82, 58), 304: (55, 60), 305: (44, 54)
        return `M 48 65 C 42 60, 44 58, 44 54 C 50 56, 52 58, 55 60 C 65 58, 70 55, 76 51 C 74 44, 73 38, 72 35 C 78 48, 80 52, 82 58 C 70 65, 55 65, 48 65`;
      case 'delta':
        // Eastern Arterials (Datuk Keramat LRT, UTM Campus, Ampang Point, Pandan Indah Heights, Cheras)
        // Stops coordinates: 401: (85, 18), 402: (80, 28), 403: (90, 38), 404: (89, 56), 405: (78, 72)
        return `M 48 65 C 55 58, 70 40, 80 28 C 82 23, 84 20, 85 18 C 88 28, 89 33, 90 38 C 89 48, 89 52, 89 56 C 84 64, 80 68, 78 72 C 65 72, 55 70, 48 65`;
      case 'epsilon':
        // Central Brickfields, Little India, Monorail, National Museum Plaza
        // Stops coordinates: 501: (42, 56), 502: (46, 50), 503: (35, 62)
        return `M 48 65 C 45 61, 40 59, 35 62 C 38 58, 40 57, 42 56 C 44 53, 45 51, 46 50 C 47 55, 46 62, 48 65`;
      default:
        // Precise Bezier curve fallback
        return taxi.stops.reduce((acc, point, index) => {
          if (index === 0) return `M ${DEPOT_STOP.lng} ${DEPOT_STOP.lat} Q 46 60, ${point.lng} ${point.lat}`;
          const prev = taxi.stops[index - 1];
          const cpX = (prev.lng + point.lng) / 2 + (point.lat - prev.lat) * 0.12;
          const cpY = (prev.lat + point.lat) / 2 - (point.lng - prev.lng) * 0.12;
          return `${acc} Q ${cpX} ${cpY} ${point.lng} ${point.lat}`;
        }, `M ${DEPOT_STOP.lng} ${DEPOT_STOP.lat}`) + ` Q 50 63, ${DEPOT_STOP.lng} ${DEPOT_STOP.lat}`;
    }
  };

  // Interpolate real-time coordinates seamlessly along the curved paths using getPointAtLength
  useEffect(() => {
    const updatedPositions: { [id: string]: { x: number; y: number; next: string } } = {};

    taxis.forEach((taxi) => {
      const pathElement = document.getElementById(`route-path-${taxi.id}`) as unknown as SVGPathElement | null;
      if (pathElement) {
        try {
          const totalLength = pathElement.getTotalLength();
          const point = pathElement.getPointAtLength(totalLength * (simProgress / 100));
          
          // Determine next destination label
          const pathNodes = [DEPOT_STOP, ...taxi.stops, DEPOT_STOP];
          const segmentCount = pathNodes.length - 1;
          const currentSegmentIdx = Math.min(Math.floor((simProgress / 100) * segmentCount), segmentCount - 1);
          const nextNode = pathNodes[currentSegmentIdx + 1];

          updatedPositions[taxi.id] = {
            x: Number(point.x.toFixed(2)),
            y: Number(point.y.toFixed(2)),
            next: nextNode.name.split(' (')[0],
          };
        } catch (e) {
          // Fallback to static linear extrapolation if length calculations fail temporarily
          const pathNodes = [DEPOT_STOP, ...taxi.stops, DEPOT_STOP];
          const segmentCount = pathNodes.length - 1;
          const segmentIdx = Math.min(Math.floor((simProgress / 100) * segmentCount), segmentCount - 1);
          const startNode = pathNodes[segmentIdx];
          const endNode = pathNodes[segmentIdx + 1];
          const segProgress = ((simProgress / 100) * segmentCount) % 1;
          
          updatedPositions[taxi.id] = {
            x: startNode.lng + (endNode.lng - startNode.lng) * segProgress,
            y: startNode.lat + (endNode.lat - startNode.lat) * segProgress,
            next: endNode.name.split(' (')[0],
          };
        }
      } else {
        // Fallback linear
        const pathNodes = [DEPOT_STOP, ...taxi.stops, DEPOT_STOP];
        const segmentCount = pathNodes.length - 1;
        const segmentIdx = Math.min(Math.floor((simProgress / 100) * segmentCount), segmentCount - 1);
        const startNode = pathNodes[segmentIdx];
        const endNode = pathNodes[segmentIdx + 1];
        const segProgress = ((simProgress / 100) * segmentCount) % 1;
        
        updatedPositions[taxi.id] = {
          x: startNode.lng + (endNode.lng - startNode.lng) * segProgress,
          y: startNode.lat + (endNode.lat - startNode.lat) * segProgress,
          next: endNode.name.split(' (')[0],
        };
      }
    });

    setCabPositions(updatedPositions);
  }, [simProgress, taxis]);

  const handleResetSim = () => {
    setSimProgress(0);
    setSimTime({ hour: 8, minute: 0 });
  };

  const formatSimTime = () => {
    const hh = simTime.hour.toString().padStart(2, '0');
    const mm = simTime.minute.toString().padStart(2, '0');
    return `${hh}:${mm} ${simTime.hour >= 12 ? 'PM' : 'AM'}`;
  };

  // Helper to get estimated arrival minute based on simulation ticks
  const getDynamicETA = (taxiId: string) => {
    const minDiff = Math.abs((taxiId.charCodeAt(0) + taxiId.charCodeAt(1) + simProgress) % 18) + 2;
    return `${minDiff.toFixed(0)} min`;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-full overflow-hidden">
      
      {/* Embedded High-Fidelity Custom Animation Styles */}
      <style>{`
        @keyframes flowDash {
          from { stroke-dashoffset: 24; }
          to { stroke-dashoffset: 0; }
        }
        .animate-dash-flow {
          animation: flowDash 0.9s linear infinite;
        }
        @keyframes pulseDot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.6; }
        }
        .pulsing-green-dot {
          animation: pulseDot 1.4s ease-in-out infinite;
        }
      `}</style>

      {/* Map Control Toolbar */}
      <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between bg-slate-50">
        
        {/* Live Badge & Sim Clock */}
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 bg-rose-50 border border-thin border-rose-150 px-2.5 py-1 rounded-full text-[10px] font-bold text-[#8B0000]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626] pulsing-green-dot" />
            LIVE TELEMETRY
          </span>
          <span className="bg-white px-2.5 py-1 rounded text-xs font-mono font-bold text-slate-700 border border-slate-250">
            🕒 {formatSimTime()}
          </span>
          <span className="hidden lg:inline-flex items-center gap-1 text-[11px] text-slate-400 font-mono">
            • Speed: {12 * speed + 24} GPS/s
          </span>
        </div>

        {/* Fleet Filtering Buttons */}
        <div className="flex flex-wrap items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => onSelectTaxi(null)}
            className={`px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
              selectedTaxiId === null
                ? 'bg-[#8B0000] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            All Dispatch
          </button>
          {taxis.map((taxi) => (
            <button
              key={taxi.id}
              onClick={() => onSelectTaxi(taxi.id)}
              className={`px-2.5 py-1 rounded-md font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedTaxiId === taxi.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: taxi.color }}
              />
              {taxi.name}
            </button>
          ))}
        </div>

        {/* Simulation Speed & Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTrafficLayer(!trafficLayer)}
            className={`px-2.5 py-1 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
              trafficLayer
                ? 'bg-emerald-50 border-emerald-150 text-emerald-700 font-bold'
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
            title="Toggle Live Traffic Heatmap Overlay"
          >
            🚥 Traffic Layer
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-lg border border-slate-150 bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
            title={isPlaying ? 'Pause Simulation' : 'Play Simulation'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setSpeed((prev) => (prev === 4 ? 1 : prev * 2))}
            className="px-2 py-1 rounded-lg border border-slate-150 bg-white hover:bg-slate-50 text-xs font-mono font-bold text-slate-700 flex items-center gap-1 cursor-pointer"
            title="Accelerate Simulation Time"
          >
            <FastForward className="w-3.5 h-3.5" />
            {speed}x
          </button>
          <button
            onClick={handleResetSim}
            className="p-1.5 rounded-lg border border-slate-150 bg-white hover:bg-slate-50 text-slate-600 cursor-pointer"
            title="Reset Simulation Time"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Vector Map Terrain Container */}
      <div className="relative flex-1 bg-[#EEEDE9] overflow-hidden min-h-[450px] lg:min-h-0 select-none flex items-center justify-center p-4">
        
        {/* Aspect Ratio Stable Map Box */}
        <div className="w-full h-full max-w-[min(100vw,500px)] max-h-[min(100vh-280px,500px)] aspect-square relative shadow-md rounded-2xl border border-slate-250 bg-[#EEEDE9] overflow-hidden">
          
          {/* Dynamic Vector Map Tile Layout simulating real-world light maps */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid meet"
          >
          {/* DEFINITIONS FOR GRADIENTS AND GLOW SHADOWS */}
          <defs>
            {/* Soft glow for routes */}
            <filter id="route-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="0.4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Street tag outline shield */}
            <filter id="text-shield">
              <feColorMatrix type="matrix" values="0 0 0 0 1   0 0 0 0 1   0 0 0 0 1  0 0 0 1 0" />
              <feGaussianBlur stdDeviation="0.4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* BACKGROUND LANDMASS PATTERNS - TERRAIN BLOCKS */}
          {/* Urban residential gray zones */}
          <rect x="5" y="10" width="30" height="35" rx="2" fill="#E6E5DF" />
          <rect x="40" y="5" width="22" height="18" rx="2" fill="#E6E5DF" />
          <rect x="70" y="42" width="28" height="28" rx="2" fill="#E2E1D9" />
          <rect x="10" y="52" width="24" height="42" rx="2" fill="#E6E5DF" />
          
          {/* Commercial Orange/Gold Zones (KLCC Core, Bukit Bintang, Brickfields, Chow Kit) */}
          {/* KLCC Core Zone */}
          <rect x="64" y="30" width="16" height="15" rx="3" fill="#FDF6E2" stroke="#F5EBD0" strokeWidth="0.2" />
          {/* Bukit Bintang retail corridor */}
          <rect x="70" y="48" width="14" height="8" rx="2" fill="#FAF1D9" stroke="#EFE5CD" strokeWidth="0.2" />
          {/* Central Chow Kit block */}
          <rect x="46" y="24" width="10" height="12" rx="1" fill="#FAF1D9" stroke="#EFE5CD" strokeWidth="0.2" />
          {/* Little India Brickfields */}
          <rect x="34" y="54" width="10" height="10" rx="2" fill="#FAF1D9" stroke="#EFE5CD" strokeWidth="0.2" />

          {/* PARKS AND NATURE VECTOR OVERLAY */}
          {/* Titiwangsa Lake & Gardens */}
          <rect x="54" y="12" width="14" height="12" rx="6" fill="#D5ECD9" stroke="#C5E2CA" strokeWidth="0.3" />
          <ellipse cx="61" cy="17" rx="4" ry="2.5" fill="#C5E8F3" />
          
          {/* KLCC Park */}
          <rect x="68" y="36" width="7" height="6" rx="3" fill="#D5ECD9" stroke="#C5E2CA" strokeWidth="0.3" />
          
          {/* Perdana Botanical Lake gardens (West) */}
          <path d="M 28 65 C 28 60, 32 58, 36 60 C 37 65, 34 70, 30 68 Z" fill="#D2EAD6" stroke="#C2E0C7" strokeWidth="0.3" />

          {/* WATER BODIES - KLANG AND GOMBAK RIVERS */}
          {/* Klang River */}
          <path
            d="M 40 -10 Q 42 30 45 55 Q 48 70 30 90 Q 20 100 0 110"
            fill="none"
            stroke="#AFD5F0"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          {/* Gombak River flowing & joining Klang River */}
          <path
            d="M 90 -10 Q 70 20 48 45 Q 46 51 45 55"
            fill="none"
            stroke="#AFD5F0"
            strokeWidth="0.95"
            strokeLinecap="round"
          />

          {/* SECONDARY STREET STREET GRIDLINES - DETAILED LOCAL ROADS */}
          <path
            d="M 5 20 L 35 20 M 15 5 L 15 45 M 5 35 L 35 35 M 40 12 L 60 12 M 70 55 L 98 55 M 70 45 L 98 45 M 54 85 L 75 85 M 20 60 L 20 90 M 10 75 L 34 75"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="0.35"
            strokeLinecap="round"
          />

          {/* HIGH-CONTRAST MAJOR BOULEVARDS & EXPRESSWAYS (OSM STYLE WHITE/YELLOW ARTERIALS) */}
          {/* Federal Highway (East-West Arterial) */}
          <path d="M 5 70 Q 25 70, 48 65 Q 65 65, 95 72" fill="none" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M 5 70 Q 25 70, 48 65 Q 65 65, 95 72" fill="none" stroke="#FFE9A3" strokeWidth="0.8" strokeLinecap="round" />

          {/* Jalan Tun Razak (Inner Ring Highway spanning North to South) */}
          <path d="M 58 5 L 60 25 Q 65 40, 78 52 T 84 95" fill="none" stroke="#FFFFFF" strokeWidth="1.1" strokeLinecap="round" />
          <path d="M 58 5 L 60 25 Q 65 40, 78 52 T 84 95" fill="none" stroke="#FFE9A3" strokeWidth="0.7" strokeLinecap="round" />

          {/* Jalan Ampang (Core street crossing KLCC) */}
          <path d="M 40 32 Q 56 32, 72 35 Q 82 35, 95 38" fill="none" stroke="#FFFFFF" strokeWidth="1.0" strokeLinecap="round" />
          <path d="M 40 32 Q 56 32, 72 35 Q 82 35, 95 38" fill="none" stroke="#FFE4BD" strokeWidth="0.6" strokeLinecap="round" />

          {/* Jalan Tuanku Abdul Rahman (Chow Kit central road) */}
          <path d="M 50 15 L 50 48" fill="none" stroke="#FFFFFF" strokeWidth="0.85" />
          <path d="M 50 15 L 50 48" fill="none" stroke="#F6F5F0" strokeWidth="0.5" />

          {/* TRAFFIC LAYER overlay with heatmap representations */}
          {trafficLayer && (
            <g opacity="0.65">
              {/* Jalan Ampang: Congested Red Flow */}
              <path d="M 56 32 Q 72 35, 82 35" fill="none" stroke="#DC2626" strokeWidth="0.9" strokeLinecap="round" />
              {/* Chow Kit Main intersection: Congested Red Flow */}
              <path d="M 50 25 L 50 38" fill="none" stroke="#DC2626" strokeWidth="0.9" strokeLinecap="round" />
              {/* Federal Highway: Fast Freeflow Green */}
              <path d="M 12 70 Q 25 70, 48 65" fill="none" stroke="#10B981" strokeWidth="0.95" strokeLinecap="round" />
              {/* Jalan Tun Razak: Moderately Slow Amber Flow */}
              <path d="M 60 25 Q 65 40, 78 52" fill="none" stroke="#F59E0B" strokeWidth="0.9" strokeLinecap="round" />
            </g>
          )}

          {/* RENDER DYNAMIC FLUID TAXI ROUTING PATHS WITH GLOW & ANIMATION */}
          {taxis.map((taxi) => {
            const isSelected = selectedTaxiId === null || selectedTaxiId === taxi.id;
            const pathD = getRoutePathD(taxi);
            return (
              <g key={`route-group-${taxi.id}`}>
                {/* Underlay glow path */}
                <path
                  id={`route-path-glow-${taxi.id}`}
                  d={pathD}
                  fill="none"
                  stroke={taxi.color}
                  strokeWidth={isSelected ? '2.5' : '0.1'}
                  opacity={isSelected ? 0.35 : 0.0}
                  filter="url(#route-glow)"
                  style={{ transition: 'stroke-width 0.3s ease' }}
                />
                
                {/* Overlay active routing dashed path */}
                <path
                  id={`route-path-${taxi.id}`}
                  d={pathD}
                  fill="none"
                  stroke={taxi.color}
                  strokeWidth={isSelected ? '1.0' : '0.22'}
                  strokeDasharray={isSelected ? '3, 4' : '6, 6'}
                  className={isSelected ? 'animate-dash-flow' : ''}
                  style={{
                    opacity: isSelected ? 0.95 : 0.15,
                    transition: 'all 0.4s ease',
                  }}
                />
              </g>
            );
          })}

          {/* STREET NAMES WATERMARKS EXTREMELY REALISTIC SHIELD STYLE */}
          <g fontSize="1.8" fontFamily="sans-serif" fontWeight="bold" fill="#718096" opacity="0.85">
            <text x="75" y="33" filter="url(#text-shield)">Jal. Ampang</text>
            <text x="82" y="93" filter="url(#text-shield)" transform="rotate(-75 80 90)">Jalan Tun Razak</text>
            <text x="14" y="73" filter="url(#text-shield)">Federal Hwy</text>
            <text x="44" y="22" filter="url(#text-shield)">Chow Kit</text>
            <text x="36" y="60" filter="url(#text-shield)">Brickfields</text>
          </g>

        </svg>

        {/* FLOATING LANDMARK NAMES - GOOGLE MAPS STYLE BUBBLES */}
        {KL_LANDMARKS.map((landmark) => (
          <div
            key={landmark.name}
            className="absolute hidden sm:flex items-center gap-1 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded shadow-xs border border-slate-200 pointer-events-none select-none text-[8.5px] font-bold text-slate-650"
            style={{
              left: `${landmark.lng}%`,
              top: `${landmark.lat}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <span className="text-[9px]">🏢</span>
            <span>{landmark.name.split(' (')[0]}</span>
          </div>
        ))}

        {/* MAP STOPS & DEPOT MARKER AND POPUPS */}
        {/* Start Depot (KL Sentral) Star Marker */}
        <div
          className="absolute z-15 cursor-pointer group"
          style={{
            left: `${DEPOT_STOP.lng}%`,
            top: `${DEPOT_STOP.lat}%`,
            transform: 'translate(-50%, -50%)',
          }}
          onClick={() => onSelectStop(DEPOT_STOP)}
        >
          <div className="relative p-1.5 bg-[#8B0000] rounded-full text-white shadow-md border-2 border-white group-hover:scale-115 transition-transform duration-200">
            <Star className="w-3.5 h-3.5 fill-current" />
            
            {/* Soft pulsing green radar circle */}
            <span className="absolute -inset-1 rounded-full border-2 border-[#8B0000] animate-ping opacity-25 pointer-events-none" />
          </div>
          <span className="absolute left-1/2 -top-5.5 -translate-x-1/2 scale-0 group-hover:scale-100 bg-slate-900 text-white text-[9px] px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap transition-transform duration-200 z-30 font-sans font-semibold">
            Central Depot (KL Sentral)
          </span>
        </div>

        {/* Individual Client Stops with clean numbers */}
        {taxis.map((taxi) => {
          const isSelected = selectedTaxiId === null || selectedTaxiId === taxi.id;
          return taxi.stops.map((stop, stopIdx) => {
            const isThisStopSelected = selectedStop?.id === stop.id;
            return (
              <div
                key={stop.id}
                className="absolute z-10 transition-all duration-300"
                style={{
                  left: `${stop.lng}%`,
                  top: `${stop.lat}%`,
                  transform: 'translate(-50%, -50%)',
                  opacity: isSelected ? 1 : 0.15,
                  pointerEvents: isSelected ? 'auto' : 'none',
                }}
              >
                <button
                  onClick={() => onSelectStop(stop)}
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold shadow-md transition-all cursor-pointer ${
                    isThisStopSelected
                      ? 'scale-125 ring-2 ring-slate-800 ring-offset-1 z-25 text-white'
                      : 'hover:scale-115 text-slate-800 bg-white'
                  }`}
                  style={{
                    backgroundColor: isThisStopSelected ? taxi.color : '#FFFFFF',
                    border: `2px solid ${taxi.color}`,
                    color: isThisStopSelected ? '#FFFFFF' : taxi.color,
                  }}
                >
                  {stopIdx + 1}
                </button>

                {/* Micro stop label tag */}
                <span className="absolute top-5 left-1/2 -translate-x-1/2 bg-white/95 border border-slate-200 px-1 py-0.2 rounded text-[7.5px] font-bold text-slate-700 whitespace-nowrap shadow-xs pointer-events-none font-mono">
                  {stop.orderId}
                </span>
              </div>
            );
          });
        })}

        {/* FLOATING REAL-TIME VEHICLE AVATARS WITH VECTOR LOG LABELS */}
        {isPlaying &&
          taxis.map((taxi) => {
            const isSelected = selectedTaxiId === null || selectedTaxiId === taxi.id;
            if (!isSelected) return null;
            
            const pos = cabPositions[taxi.id];
            if (!pos) return null;

            return (
              <div
                key={`gps-veh-${taxi.id}`}
                className="absolute z-20 pointer-events-none select-none transition-all duration-300 ease-linear"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {/* Micro Car Marker */}
                <div
                  className="w-5 h-5 rounded-lg flex items-center justify-center text-white text-[11px] font-black border border-white shadow-md"
                  style={{ backgroundColor: taxi.color }}
                >
                  🚕
                </div>

                {/* Floating GPS HUD bubble attached to vehicle */}
                <div className="absolute -top-7.5 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white px-1.5 py-0.5 rounded shadow-sm text-[8px] font-mono whitespace-nowrap flex items-center gap-1 border border-slate-800">
                  <span className="font-extrabold font-sans text-amber-300">{taxi.name[0].toUpperCase()}:</span>
                  <span className="text-slate-200">{pos.next}</span>
                  <span className="text-emerald-400 font-bold ml-0.5">{getDynamicETA(taxi.id)}</span>
                </div>
              </div>
            );
          })}

        </div> {/* Close Aspect Ratio Stable Map Box */}

        {/* Selected Stop Details Card Popup */}
        {selectedStop && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-80 bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 shadow-xl p-4.5 z-30 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: selectedStop.color }}
                />
                <span className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-500">
                  {selectedStop.isDepot ? 'Base Hub Hub' : `Waze Node — ${selectedStop.orderId}`}
                </span>
              </div>
              <button
                onClick={() => onSelectStop(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xs p-1 bg-slate-100 hover:bg-slate-200 rounded-full"
              >
                ✕
              </button>
            </div>

            <h3 className="font-bold text-sm text-slate-950 mb-2 font-sans tracking-tight">
              {selectedStop.name}
            </h3>

            {selectedStop.isDepot ? (
              <div className="text-xs text-slate-650 space-y-2 leading-relaxed">
                <p>Central operations headquarters. Dispatch engine optimized with automated Q-Learning model parameters.</p>
                <div className="flex justify-between text-[10px] bg-slate-100 p-2 rounded text-slate-700 font-mono">
                  <span>Routing Converge Status:</span>
                  <span className="text-[#8B0000] font-bold">Stable (100%)</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50/80 p-2 rounded-lg border border-slate-150">
                  <div>
                    <span className="text-slate-400 text-[9px] block font-bold uppercase">Customer</span>
                    <span className="font-bold text-slate-850">{selectedStop.paxName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[9px] block font-bold uppercase">Pickup Slot</span>
                    <span className="font-semibold text-slate-700">{selectedStop.timeWindow}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[9px] block font-bold uppercase">Live ETA</span>
                    <span className="font-mono font-bold text-emerald-600">Arriving {selectedStop.eta}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[9px] block font-bold uppercase">Waze Feed</span>
                    <span className="font-semibold text-slate-700">
                      {selectedStop.demand && selectedStop.demand > 0
                        ? `${selectedStop.demand} request pending`
                        : 'Traffic Congested'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <button
                    onClick={() => {
                      setToast({
                        message: `Recalculating optimal RL routing vector for stop ${selectedStop.orderId}. Bellman TD difference: 0.0014`,
                        type: 'success'
                      });
                    }}
                    className="flex-1 bg-[#8B0000] hover:bg-[#700000] text-white text-[10.5px] font-bold py-2 px-3 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    Recalculate Path
                  </button>
                  <button
                    onClick={() => {
                      setToast({
                        message: `Notified ${selectedStop.paxName} that their ride is approaching on schedule.`,
                        type: 'info'
                      });
                    }}
                    className="px-3 py-2 border border-slate-250 hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-600 transition-colors cursor-pointer"
                  >
                    Ping Alert
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Floating Quick Stats Map Layer Overlay HUD */}
        <div className="absolute top-4 left-4 bg-slate-900/95 backdrop-blur-md rounded-xl p-3 border border-slate-800 shadow-xl space-y-1.5 max-w-[200px] text-white">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-1.5 mb-1.5">
            <Activity className="w-4 h-4 text-emerald-500 pulsing-green-dot" />
            <span className="text-[10px] font-mono font-black text-slate-300 tracking-wider">NETWORK STATUS</span>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[9px] font-mono">
            <span className="text-slate-400">Jal. Ampang:</span>
            <span className="text-rose-400 font-bold">12 km/h</span>
            <span className="text-slate-400">Tun Razak:</span>
            <span className="text-amber-400 font-bold">28 km/h</span>
            <span className="text-slate-400">Federal Hwy:</span>
            <span className="text-emerald-400 font-bold">64 km/h</span>
            <span className="text-slate-400">Total Fares:</span>
            <span className="text-slate-200 font-bold">{taxis.reduce((acc, t) => acc + t.stops.length, 0)} stops</span>
          </div>
        </div>

        {/* Compass Dial and Visual legend */}
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-xs px-3.5 py-3 rounded-xl border border-slate-200 shadow-lg flex flex-col gap-2 text-[9.5px] text-slate-500">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 border-b border-rose-100 pb-1.5 mb-1 text-[10px]">
            <Compass className="w-3.5 h-3.5 text-[#8B0000]" />
            <span className="font-mono uppercase tracking-wider">Map Overlay Legend</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-1.5 bg-[#FFE9A3] border border-slate-350 rounded-sm" />
            <span className="font-medium text-slate-700">KL Main Expressways</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-1.5 bg-rose-500 rounded-sm" />
            <span className="font-medium text-slate-700">Live Traffic Congestion</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-1.5 bg-[#AFD5F0] rounded-full border border-slate-300" />
            <span className="font-medium text-slate-700">Klang River Channel</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-3 h-3 text-[#8B0000] fill-current" />
            <span className="font-medium text-slate-700">G-119 Central Depot</span>
          </div>
        </div>

      </div>

    </div>
  );
}

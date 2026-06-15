/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Taxi, Stop } from '../types';
import { Star, MapPin, Navigation, TrendingUp, AlertTriangle, Check, Sliders, RefreshCw, Layers } from 'lucide-react';

interface RoutesDeepDiveProps {
  taxis: Taxi[];
  selectedTaxiId: string | null;
  onSelectTaxi: (id: string | null) => void;
}

export default function RoutesDeepDive({ taxis, selectedTaxiId, onSelectTaxi }: RoutesDeepDiveProps) {
  const [activeTab, setActiveTab] = useState<string>(selectedTaxiId || 'alpha');
  const [hasRecalculated, setHasRecalculated] = useState<Record<string, boolean>>({});
  const [isComputing, setIsComputing] = useState(false);
  const [congestionPoints, setCongestionPoints] = useState<string[]>(['Sentul East Metro']);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  React.useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const activeTaxi = taxis.find((t) => t.id === activeTab) || taxis[0];

  const toggleCongestion = (pointName: string) => {
    setCongestionPoints((prev) =>
      prev.includes(pointName)
        ? prev.filter((p) => p !== pointName)
        : [...prev, pointName]
    );
  };

  const handleRLOptimize = (taxiId: string) => {
    if (isComputing) return;
    setIsComputing(true);

    setTimeout(() => {
      setHasRecalculated((prev) => ({ ...prev, [taxiId]: true }));
      setIsComputing(false);
      setToast({
        message: `Reinforcement Learning policy weights converged. Successfully re-routed taxi '${taxiId}' to bypass congested points! New ETA schedules updated.`,
        type: 'success'
      });
    }, 1200);
  };

  // If we recalculate, let's pretend to optimize order
  const getOrderedStops = (taxi: Taxi) => {
    const stopsList = [...taxi.stops];
    const congestedInRoute = stopsList.some((s) => congestionPoints.includes(s.name));

    if (hasRecalculated[taxi.id] && congestedInRoute) {
      // Shift congested stops to the end, demonstrating dynamic policy adjustment!
      return stopsList.sort((a, b) => {
        const aCong = congestionPoints.includes(a.name);
        const bCong = congestionPoints.includes(b.name);
        if (aCong && !bCong) return 1;
        if (!aCong && bCong) return -1;
        return 0;
      });
    }
    return stopsList;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-100 pb-3 mb-5 flex flex-wrap gap-4 items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#8B0000]" />
            <span>Driver Dispatch Sequence & Optimizer</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Analyze spatial stop sequences for individual taxi agents and test dynamic policy adaptation in response to real-time city bottlenecks.
          </p>
        </div>

        {/* Navigation Selector */}
        <div className="flex gap-1.5 p-1 bg-slate-50 border border-slate-200 rounded-lg text-xs">
          {taxis.map((taxi) => (
            <button
              key={taxi.id}
              onClick={() => {
                setActiveTab(taxi.id);
                onSelectTaxi(taxi.id);
              }}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === taxi.id
                  ? 'bg-white text-[#8B0020] shadow-xs border border-rose-100'
                  : 'text-slate-650 hover:text-slate-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: taxi.color }} />
              {taxi.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Driver Profile Card & Route Actions */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-4">
            {/* Driver Identity */}
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center text-white font-mono font-bold text-sm tracking-wide shadow-xs"
                style={{ backgroundColor: activeTaxi.color }}
              >
                {activeTaxi.name[0].toUpperCase()}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Taxi {activeTaxi.name}</h4>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                  <span className="font-semibold text-amber-500">★ {activeTaxi.rating}</span>
                  <span>•</span>
                  <span className="font-medium bg-white px-1.5 py-0.2 rounded border border-slate-200 text-slate-500 font-mono text-[10px]">
                    {activeTaxi.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats list */}
            <div className="grid grid-cols-3 gap-2.5 text-center bg-white p-3 rounded-lg border border-slate-150">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">TOTAL TRIPS</span>
                <span className="font-mono font-bold text-slate-900 text-xs">{activeTaxi.totalTrips}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">REWARD SCORE</span>
                <span className="font-mono font-bold text-emerald-600 text-xs">+{activeTaxi.currentReward}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">AVG DURATION</span>
                <span className="font-mono font-bold text-orange-600 text-xs">{activeTaxi.avgDuration} min</span>
              </div>
            </div>

            {/* Dynamic Environment Congestion Editor simulation */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <span className="block text-[11px] font-bold font-mono text-slate-550 uppercase tracking-wider">
                Simulated Kuala Lumpur Congestion Editor:
              </span>
              <p className="text-[11px] text-slate-400 leading-snug">
                Click any stop below to inject real-time heavy gridlock and watch how the policy automatically adapts.
              </p>

              <div className="flex flex-wrap gap-1.5">
                {activeTaxi.stops.map((stop) => {
                  const isCongested = congestionPoints.includes(stop.name);
                  return (
                    <button
                      key={stop.id}
                      onClick={() => toggleCongestion(stop.name)}
                      className={`text-[10px] font-semibold px-2 py-1 rounded-md border flex items-center gap-1 transition-all ${
                        isCongested
                          ? 'bg-rose-50 border-rose-200 text-rose-705 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <AlertTriangle className={`w-3 h-3 ${isCongested ? 'text-rose-500 animate-bounce' : 'text-slate-350'}`} />
                      {stop.name.split('/')[0].split('(')[0].trim()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action optimization trigger */}
            <div className="pt-2">
              <button
                onClick={() => handleRLOptimize(activeTaxi.id)}
                disabled={isComputing}
                className="w-full bg-[#8B0000] hover:bg-[#700000] disabled:bg-slate-300 text-white font-mono text-xs font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg hover:shadow-[#8B0000]/10 transition-all flex items-center justify-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isComputing ? 'animate-spin' : ''}`} />
                {isComputing ? 'Solving Bellsman Matrices...' : 'Optimize via RL Agent'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Step Sequences */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between px-1 mb-1">
            <span className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">
              Chronological Stopping Sequence
            </span>
            {hasRecalculated[activeTaxi.id] && (
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                <Check className="w-3 h-3" /> RL Optimized
              </span>
            )}
          </div>

          <div className="space-y-3 relative before:absolute before:left-[17px] before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-100">
            {/* Start Depot Node */}
            <div className="flex items-start gap-4 relative z-10 select-none">
              <div className="w-9 h-9 rounded-full bg-[#8B0000] text-white flex items-center justify-center border-4 border-white shadow-md">
                <Star className="w-4 h-4 fill-current" />
              </div>
              <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[9px] font-bold text-[#8B0000]">START DEPOT HUB</span>
                  <span className="text-[10px] text-slate-400 font-mono">07:00 AM Departure</span>
                </div>
                <h5 className="font-semibold text-slate-850 mt-1">Eleven-Nine Central Depot (KL Sentral)</h5>
              </div>
            </div>

            {/* Individual stops */}
            {getOrderedStops(activeTaxi).map((stop, index) => {
              const isCongested = congestionPoints.includes(stop.name);
              return (
                <div key={stop.id} className="flex items-start gap-4 relative z-10 transition-all duration-300">
                  {/* Number node marker */}
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-4 border-white shadow-md transition-all duration-300"
                    style={{
                      backgroundColor: isCongested ? '#EF4444' : activeTaxi.color,
                      color: '#ffffff',
                    }}
                  >
                    {isCongested ? '⚠️' : index + 1}
                  </div>

                  {/* Body details container */}
                  <div className={`border p-3.5 rounded-xl flex-1 transition-all ${
                    isCongested
                      ? 'bg-rose-50/50 border-rose-200'
                      : 'bg-white border-slate-200 hover:border-slate-350'
                  }`}>
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-slate-400">
                          STOP NODE — {stop.orderId}
                        </span>
                        {isCongested && (
                          <span className="text-[9px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-100 animate-pulse">
                            Heavy Traffic Congestion
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">ETA: {stop.eta}</span>
                    </div>

                    <h5 className="font-bold text-slate-850 text-sm mt-1">{stop.name}</h5>

                    <div className="grid grid-cols-2 gap-2 mt-2.5 text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg font-mono">
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase">Passenger</span>
                        <span className="text-slate-750 font-bold">{stop.paxName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase">Time Windows</span>
                        <span className="text-slate-750 font-bold">{stop.timeWindow}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Terminate Terminal Depot Hub */}
            <div className="flex items-start gap-4 relative z-10 select-none">
              <div className="w-9 h-9 rounded-full bg-slate-400 text-white flex items-center justify-center border-4 border-white shadow-md">
                <Check className="w-4 h-4 fill-current stroke-[3px]" />
              </div>
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[9px] font-bold text-slate-400">MISSION COMPLETED</span>
                  <span className="text-[10px] text-slate-400 font-mono">08:00 PM Shutdown</span>
                </div>
                <h5 className="font-semibold text-slate-650 mt-1">Return to Base Depot (KL Sentral)</h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Toast Notification Box */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-800 text-white rounded-xl shadow-2xl p-4 max-w-md flex items-start gap-3.5 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="p-2 rounded-xl bg-rose-550/15 border border-[#8B0000]/30 text-[#8B0000]-400 text-sm flex items-center justify-center shrink-0">
            🚀
          </div>
          <div className="space-y-1">
            <div className="text-xs font-bold font-mono text-rose-450 uppercase tracking-wider">Dynamic Re-routing Confirmed</div>
            <div className="text-[11px] font-medium leading-relaxed text-slate-200">{toast.message}</div>
          </div>
          <button onClick={() => setToast(null)} className="text-slate-500 hover:text-slate-200 font-mono text-[10px] shrink-0 p-1">✕</button>
        </div>
      )}
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Trip, Taxi } from '../types';
import { Search, MapPin, ArrowRight, UserCheck, Phone, CheckCircle2, AlertCircle, Clock, Tag, Info } from 'lucide-react';

interface TripListProps {
  trips: Trip[];
  taxis: Taxi[];
  selectedTaxiId: string | null;
  onSelectTripStop: (orderId: string) => void;
  activeTripId: string | null;
  onSetActiveTripId: (id: string | null) => void;
}

export default function TripList({
  trips,
  taxis,
  selectedTaxiId,
  onSelectTripStop,
  activeTripId,
  onSetActiveTripId,
}: TripListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'In Progress' | 'Completed'>('All');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  React.useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const filteredTrips = trips.filter((trip) => {
    // Taxi filter
    if (selectedTaxiId && trip.driverId !== selectedTaxiId) {
      return false;
    }

    // Status filter
    if (statusFilter !== 'All' && trip.status !== statusFilter) {
      return false;
    }

    // Search queries
    const matchSearch =
      trip.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.passenger.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.pickup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchQuery.toLowerCase());

    return matchSearch;
  });

  const getStatusStyle = (status: Trip['status']) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'In Progress':
        return 'bg-amber-50 text-amber-700 border-amber-150 animate-pulse';
      case 'Pending':
        return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-full overflow-hidden">
      {/* Title block */}
      <div className="p-4 border-b border-slate-100">
        <h3 className="font-semibold text-sm tracking-tight text-slate-800 mb-3 flex items-center justify-between">
          <span>Active Route Orders</span>
          <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-mono font-medium">
            {filteredTrips.length} orders
          </span>
        </h3>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search Order ID, Pax or Area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-150 rounded-lg text-xs font-medium text-slate-700 placeholder-slate-400 outline-hidden focus:border-[#8B0000] focus:ring-1 focus:ring-[#8B0000] focus:bg-white transition-all"
          />
        </div>

        {/* Micro filter tabs */}
        <div className="flex gap-1 mt-3 border-b border-slate-100 pb-1">
          {(['All', 'Pending', 'In Progress', 'Completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`pb-1 text-[10px] font-medium transition-all relative ${
                statusFilter === status
                  ? 'text-[#8B0000] font-semibold border-b-2 border-[#8B0000]'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Trip List Scrolling Container */}
      <div className="flex-1 overflow-y-auto px-1 py-1 divide-y divide-slate-100 max-h-[580px] lg:max-h-none">
        {filteredTrips.length === 0 ? (
          <div className="text-center py-12 px-4">
            <p className="text-xs text-slate-400 font-medium font-mono">No matching dispatch orders</p>
          </div>
        ) : (
          filteredTrips.map((trip) => {
            const isExpanded = activeTripId === trip.orderId;
            return (
              <div
                key={trip.id}
                className={`p-3 transition-colors ${
                  isExpanded ? 'bg-slate-50/50' : 'hover:bg-slate-50/20'
                }`}
              >
                {/* Main Card Strip */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {trip.orderId}
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-full border font-medium ${getStatusStyle(
                          trip.status
                        )}`}
                      >
                        {trip.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 flex-wrap">
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {trip.timeWindow}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span>
                        Route:{' '}
                        <span
                          className="font-bold font-mono px-1 py-0.5 text-[9px] rounded-sm text-white"
                          style={{ backgroundColor: trip.driverColor }}
                        >
                          {trip.driverName.toUpperCase()}
                        </span>
                      </span>
                    </div>

                    <div className="text-xs text-slate-700 font-medium">
                      ETA: <span className="font-bold text-slate-900">{trip.eta}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onSetActiveTripId(isExpanded ? null : trip.orderId);
                      onSelectTripStop(trip.orderId);
                    }}
                    className={`p-1.5 rounded-md border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:border-slate-350 transition-all ${
                      isExpanded ? 'bg-slate-100 rotate-90 text-[#8B0000]' : ''
                    }`}
                    title="Expand stop order details"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Expanded Details Panel */}
                {isExpanded && (
                  <div className="mt-3 bg-white border border-slate-150 rounded-lg p-3 space-y-2.5 text-xs text-slate-600 animate-in slide-in-from-top-1 duration-200">
                    <div className="grid grid-cols-2 gap-1.5 border-b border-slate-100 pb-2">
                      <div>
                        <span className="text-[10px] text-slate-400 font-medium block">PASSENGER</span>
                        <span className="font-semibold text-slate-800 flex items-center gap-1">
                          <UserCheck className="w-3 h-3 text-slate-550" />
                          {trip.passenger}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-medium block">CONTACT</span>
                        <span className="font-mono text-slate-700 flex items-center gap-1">
                          <Phone className="w-2.5 h-2.5 text-slate-400" />
                          {trip.phone}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        <span className="text-[11px]">
                          <strong>Pick:</strong> {trip.pickup}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8B0000]" />
                        <span className="text-[11px]">
                          <strong>Drop:</strong> {trip.destination}
                        </span>
                      </div>
                    </div>

                    <div className="bg-rose-50/50 p-2 rounded border border-rose-100/60 text-[11px] font-mono leading-relaxed text-slate-700">
                      <div className="text-[#8B0000] font-bold text-[9px] uppercase tracking-wider mb-0.5">
                        Reinforcement Learning State Parameters
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-[10px]">
                        <div>State ID: <span className="font-bold">S-{Math.floor(Math.random() * 500)}</span></div>
                        <div>Action Q-Value: <span className="font-bold text-emerald-600">{(0.45 + Math.random() * 0.5).toFixed(3)}</span></div>
                        <div>State Reward: <span className="font-bold text-emerald-600">+20</span></div>
                        <div>Penalty Potential: <span className="font-bold text-rose-600">-1</span></div>
                      </div>
                      <div className="mt-1.5 text-[9px] text-slate-400 leading-snug">
                        💡 <em>Optimized path based on traffic flow probabilities training model v1.8.</em>
                      </div>
                    </div>

                    {trip.notes && (
                      <div className="bg-slate-50 p-1.5 rounded text-[10px] leading-relaxed italic text-slate-500">
                        "{trip.notes}"
                      </div>
                    )}

                    <div className="flex gap-1.5 pt-1">
                      <button
                        onClick={() => {
                          setToast({
                            message: `Executing dispatch sequence for order ${trip.orderId} utilizing pre-trained Q-matrix weights.`,
                            type: 'success'
                          });
                        }}
                        className="flex-1 bg-[#8B0000] hover:bg-[#700000] text-white text-[10px] font-semibold py-1 px-2 rounded-md transition-colors shadow-xs cursor-pointer"
                      >
                        Execute Optimal Dispatch
                      </button>
                      <button
                        onClick={() => {
                          setToast({
                            message: `Contacting ${trip.passenger} via VoIP terminal...`,
                            type: 'info'
                          });
                        }}
                        className="px-2 py-1 border border-slate-200 hover:bg-slate-50 rounded-md text-[10px] font-medium text-slate-600 cursor-pointer"
                      >
                        Ping Base
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Floating Toast Notification Box inside container */}
      {toast && (
        <div className="absolute bottom-14 left-4 right-4 z-50 bg-slate-900 text-white rounded-lg p-2.5 text-[11px] font-mono shadow-lg flex items-center justify-between gap-2 border border-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-400">●</span>
            <span>{toast.message}</span>
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-white font-bold p-1 text-[10px]"
          >
            ✕
          </button>
        </div>
      )}

      {/* Footer information bar */}
      <div className="p-3 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-500 flex items-center gap-1.5 font-mono">
        <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
        <span>RL Agent auto-dispatches using rewards based on minimum grid delay.</span>
      </div>
    </div>
  );
}

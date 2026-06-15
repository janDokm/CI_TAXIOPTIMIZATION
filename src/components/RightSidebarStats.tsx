/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Eye, HelpCircle, AlertCircle, Sparkles, Award, PlayCircle, Clock, Footprints } from 'lucide-react';

interface StatItem {
  id: string;
  title: string;
  value: string;
  subtext: string;
  trend: string;
  isPositive: boolean;
  color: string;
  sparklineData: number[]; // points scaled to 0-10
  icon: React.ReactNode;
  details: {
    formula: string;
    description: string;
    baseline: string;
    optimized: string;
  };
}

export default function RightSidebarStats() {
  const [activeDetailsId, setActiveDetailsId] = useState<string | null>(null);

  const stats: StatItem[] = [
    {
      id: 'reward',
      title: 'Total Cumulative Reward',
      value: '+247.8 pt',
      subtext: 'vs random baseline (-420.5)',
      trend: '+158.9%',
      isPositive: true,
      color: '#DC2626', // Red
      sparklineData: [1, 2, 1.5, 4, 3, 6, 7.5, 8.2, 9, 9.8],
      icon: <Award className="w-4 h-4 text-[#8B0000]" />,
      details: {
        formula: 'R = R_pickup (+20) + R_dropoff (+20) + Steps (-1) + Penalties (-10)',
        description: 'Measures total reinforcement rewards accumulated over a full dispatch episode. In Taxi-v3, successful pickup and dropoffs are highly weighted, while each physical driving step incurs a negative step penalty of -1 to stimulate path shortening. Illegal dropoffs or pickups incur an aggressive penalty of -10.',
        baseline: '-420.5 pt (Random Agent)',
        optimized: '+247.8 pt (Q-Agent v1.8)',
      },
    },
    {
      id: 'episodes',
      title: 'Episodes Trained',
      value: '10,000',
      subtext: 'q-table convergence',
      trend: '100% Final',
      isPositive: true,
      color: '#3B82F6', // Blue
      sparklineData: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      icon: <PlayCircle className="w-4 h-4 text-blue-500" />,
      details: {
        formula: 'E_total = 10k iterations, α=0.1, γ=0.6, ε_decay=0.9995',
        description: 'Iterative generation index of the Agent training cycle. Throughout 10,000 simulated iterations, the temporal difference loss stabilizes as epsilon exploration decay diminishes from 1.0 to 0.01, transferring actions from random exploration to high-confidence Q-value exploitation.',
        baseline: '0 (Uninitialized policy)',
        optimized: '10,000 (Fully Converged Table)',
      },
    },
    {
      id: 'duration',
      title: 'Avg Trip Duration',
      value: '14.3 min',
      subtext: 'avg. transit time',
      trend: '-55.2%',
      isPositive: true, // Lower is better
      color: '#F97316', // Orange / Red
      sparklineData: [10, 8.5, 7.2, 8.0, 5.5, 4.2, 3.8, 3.0, 2.3, 1.8],
      icon: <Clock className="w-4 h-4 text-orange-500" />,
      details: {
        formula: 'T_avg = ∑(T_arrival - T_dispatch) / N_trips',
        description: 'Aggregated simulated traffic time across all dispatched taxis in Greater Kuala Lumpur. By computing optimized pathways that dynamically avoid simulated traffic junctions, the average duration drops significantly compared to standard shortest-distance algorithms.',
        baseline: '32.4 mins (Shortest Path Router)',
        optimized: '14.3 mins (RL Q-Adaptive Router)',
      },
    },
    {
      id: 'steps',
      title: 'Steps to Completion',
      value: '14.2 steps',
      subtext: 'average moves per trip',
      trend: '-58.2%',
      isPositive: true, // Lower is better
      color: '#EAB308', // Yellow
      sparklineData: [9, 8.2, 7.5, 6.0, 4.8, 3.5, 2.8, 2.1, 1.8, 1.6],
      icon: <Footprints className="w-4 h-4 text-yellow-500" />,
      details: {
        formula: 'S_avg = total moves to successful dropoff',
        description: 'The number of individual physical grid actions (e.g., move North, South, East, West, Pickup, Dropoff) required to fulfill a complete customer cycle. Optimal routing minimizes back-tracking, ensuring the agent finishes tasks with extremely high structural efficiency.',
        baseline: '34.0 steps (Baseline Random Policy)',
        optimized: '14.2 steps (Optimized Neural Policy)',
      },
    },
  ];

  // Helper to draw sparkline path
  const getSparklinePath = (data: number[]) => {
    const width = 80;
    const height = 24;
    const maxVal = 10;
    const points = data.map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - (val / maxVal) * height;
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  };

  return (
    <div className="space-y-4">
      {/* Sidebar Section Title */}
      <div className="flex items-center justify-between px-1">
        <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">
          Model Statistics
        </h4>
        <span className="flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
          <Sparkles className="w-2.5 h-2.5" /> Stable S-Table
        </span>
      </div>

      {/* Grid of Compact Stats */}
      <div className="grid grid-cols-1 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-350 transition-all flex flex-col justify-between"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-slate-50 rounded-lg">{stat.icon}</div>
                <div>
                  <h5 className="text-[11px] font-bold text-slate-500 tracking-tight">
                    {stat.title}
                  </h5>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-lg font-bold font-mono text-slate-900 tracking-tight">
                      {stat.value}
                    </span>
                    <span
                      className={`text-[10px] font-semibold flex items-center ${
                        stat.isPositive ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {stat.isPositive ? (
                        <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
                      ) : (
                        <TrendingDown className="w-2.5 h-2.5 mr-0.5" />
                      )}
                      {stat.trend}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sparkline */}
              <div className="w-[80px] h-[24px]">
                <svg className="w-full h-full overflow-visible">
                  <path
                    d={getSparklinePath(stat.sparklineData)}
                    fill="none"
                    stroke={stat.color}
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Glowing end point */}
                  <circle
                    cx="80"
                    cy={24 - (stat.sparklineData[stat.sparklineData.length - 1] / 10) * 24}
                    r="2.5"
                    fill={stat.color}
                    stroke="#ffffff"
                    strokeWidth="1"
                  />
                </svg>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono italic">
                {stat.subtext}
              </span>
              <button
                onClick={() => setActiveDetailsId(stat.id)}
                className="text-[10px] font-semibold text-[#8B0000] hover:text-[#700000] hover:underline flex items-center gap-0.5"
              >
                View Details →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Overlay Dialog / Modal for SECJ3563 Computational Intelligence parameters */}
      {activeDetailsId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          {stats
            .filter((s) => s.id === activeDetailsId)
            .map((stat) => (
              <div
                key={stat.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
              >
                {/* Header */}
                <div className="px-5 py-4 bg-slate-50 border-b border-slate-150 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white rounded-lg border border-slate-200">{stat.icon}</div>
                    <h3 className="font-bold text-sm text-slate-900">{stat.title} Metric Analysis</h3>
                  </div>
                  <button
                    onClick={() => setActiveDetailsId(null)}
                    className="text-slate-400 hover:text-slate-600 font-bold text-xs px-2 py-1 bg-white border border-slate-200 rounded-md"
                  >
                    Close
                  </button>
                </div>

                {/* Body */}
                <div className="p-5 space-y-4 text-xs text-slate-650 leading-relaxed">
                  <div>
                    <span className="block font-bold text-[10px] font-mono text-[#8B0000] uppercase tracking-wider mb-1">
                      Theoretical Objective Function (Bellman Formulation)
                    </span>
                    <div className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-[11px] overflow-x-auto select-all leading-relaxed shadow-inner">
                      {stat.details.formula}
                    </div>
                  </div>

                  <div>
                    <span className="block font-bold text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                      Agent Optimization Narrative
                    </span>
                    <p className="text-slate-600 font-medium">{stat.details.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-150">
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">Random Baseline</span>
                      <span className="font-mono font-bold text-rose-600 text-xs">{stat.details.baseline}</span>
                    </div>
                    <div className="bg-rose-50/40 p-3 rounded-lg border border-rose-100">
                      <span className="text-[10px] text-[#8B0000] block font-semibold uppercase">SECJ3563 Optimal</span>
                      <span className="font-mono font-bold text-emerald-600 text-xs">{stat.details.optimized}</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-3 bg-slate-50 border-t border-slate-150 flex justify-between items-center text-[10px] text-slate-500 pb-4">
                  <div className="flex items-center gap-1 font-mono">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                    <span>Project Group Eleven-Nine Group</span>
                  </div>
                  <span className="font-semibold">UTM Faculty of Computing</span>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

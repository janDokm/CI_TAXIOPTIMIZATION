/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { generateTrainingHistory } from '../data/klMapData';
import { TrainingDataPoint } from '../types';
import { ToggleLeft, ToggleRight, Play, RefreshCw, Cpu, CheckCircle2 } from 'lucide-react';

export default function RewardPlot() {
  const [history, setHistory] = useState<TrainingDataPoint[]>([]);
  const [activeModel, setActiveModel] = useState<'Q-Learning' | 'DQN'>('Q-Learning');
  const [activePoint, setActivePoint] = useState<TrainingDataPoint | null>(null);
  const [isTrainingLive, setIsTrainingLive] = useState(false);
  const [liveLog, setLiveLog] = useState<string[]>([]);
  const [trainingProgress, setTrainingProgress] = useState(0);

  useEffect(() => {
    setHistory(generateTrainingHistory());
  }, []);

  // Standard dimensions for our SVG chart
  const svgWidth = 800;
  const svgHeight = 200;
  const paddingX = 45;
  const paddingY = 25;

  const handleRunLiveTraining = () => {
    if (isTrainingLive) return;
    setIsTrainingLive(true);
    setTrainingProgress(0);
    setLiveLog(['Initializing Gymnasium Taxi-v3 environment...', 'State representation: [tax_row, taxi_col, passenger_idx, destination_idx]', 'Establishing state-action Q-table (500 states x 6 actions)']);
    
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const currentPrg = Math.min(step * 4, 100);
      setTrainingProgress(currentPrg);

      // Generate random learning updates logs matching classical RL Q-learning or DQN values
      const currentEp = step * 400;
      const curEpsilon = (0.9995 ** currentEp).toFixed(4);
      const randReward = (-150 + 338 * (1 - Math.exp(-currentEp / 3000)) + Math.random() * 20).toFixed(1);
      const stepsToCompl = Math.max(12, Math.round(90 - 78 * (currentEp / 10000) + Math.random() * 5));

      setLiveLog((prev) => [
        ...prev.slice(-4),
        `[EPISODE ${currentEp}] ε: ${curEpsilon} | Q-Loss: ${((Math.random() * 0.05) / step).toFixed(5)} | Mean Reward: ${randReward} | Steps: ${stepsToCompl}`,
      ]);

      if (step >= 25) {
        clearInterval(interval);
        setIsTrainingLive(false);
        setLiveLog((prev) => [
          ...prev,
          `✔ Training Completed. Policy weights synchronized with local S-Matrix file. Convergence threshold matched.`
        ]);
      }
    }, 150);
  };

  // Min-Max Scaling calculations for chart rendering
  // Rewards scaled between -250 and +250
  // Steps scaled between 10 (min) and 120 (max)
  const getCoordinates = (point: TrainingDataPoint, index: number, total: number) => {
    const x = paddingX + (index / (total - 1)) * (svgWidth - paddingX * 2);
    
    // Reward coordinates
    const reward = activeModel === 'Q-Learning' ? point.qLearningReward : point.dqnReward;
    // Map -250 to +250 to (svgHeight - paddingY) down to (paddingY)
    const normReward = (reward - (-250)) / 500; // 0 to 1
    const y = svgHeight - paddingY - normReward * (svgHeight - paddingY * 2);

    return { x, y };
  };

  const getStepsCoordinates = (point: TrainingDataPoint, index: number, total: number) => {
    const x = paddingX + (index / (total - 1)) * (svgWidth - paddingX * 2);
    // Steps mapped between 10 and 120
    const steps = activeModel === 'Q-Learning' ? point.qLearningSteps : point.dqnSteps;
    const normSteps = (steps - 10) / 110; // 0 to 1
    const y = svgHeight - paddingY - normSteps * (svgHeight - paddingY * 2);
    return { x, y };
  };

  if (history.length === 0) {
    return <div className="p-4 bg-white rounded-xl border border-slate-200">Loading learning progress...</div>;
  }

  // Generate SVG path string for the reward line
  let rewardPathD = '';
  let areaPathD = '';
  let stepsPathD = '';

  const coords = history.map((p, idx) => getCoordinates(p, idx, history.length));
  const stepsCoords = history.map((p, idx) => getStepsCoordinates(p, idx, history.length));

  if (coords.length > 0) {
    rewardPathD = `M ${coords[0].x} ${coords[0].y} ` + coords.slice(1).map((c) => `L ${c.x} ${c.y}`).join(' ');
    // Area path closed for subtle gradient effect
    areaPathD = `${rewardPathD} L ${coords[coords.length - 1].x} ${svgHeight - paddingY} L ${coords[0].x} ${svgHeight - paddingY} Z`;
    stepsPathD = `M ${stepsCoords[0].x} ${stepsCoords[0].y} ` + stepsCoords.slice(1).map((c) => `L ${c.x} ${c.y}`).join(' ');
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col xl:flex-row gap-5">
      {/* Chart Section */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-sm tracking-tight text-slate-800 flex items-center gap-2">
              <span>Agent Learning Progress</span>
              <span className="font-normal font-mono text-[10px] text-slate-400">
                (Bellman Optimality Convergence)
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Cumulative episodic reward profile mapped across 10,000 algorithmic cycles.
            </p>
          </div>

          {/* Controller buttons */}
          <div className="flex items-center gap-3">
            {/* Model Selector Toggle */}
            <div className="flex items-center gap-1.5 bg-slate-50 p-1 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-600">
              <button
                onClick={() => {
                  setActiveModel('Q-Learning');
                  setActivePoint(null);
                }}
                className={`px-2.5 py-1 rounded transition-all ${
                  activeModel === 'Q-Learning'
                    ? 'bg-white text-slate-800 shadow-xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                Q-Learning
              </button>
              <button
                onClick={() => {
                  setActiveModel('DQN');
                  setActivePoint(null);
                }}
                className={`px-2.5 py-1 rounded transition-all ${
                  activeModel === 'DQN'
                    ? 'bg-white text-slate-800 shadow-xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                Deep Q-Network (DQN)
              </button>
            </div>
          </div>
        </div>

        {/* The Graphic Render */}
        <div className="relative">
          <svg className="w-full h-[200px]" viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="none">
            {/* Grids and Axes */}
            <g opacity="0.1">
              <line x1={paddingX} y1={paddingY} x2={svgWidth - paddingX} y2={paddingY} stroke="#1e293b" strokeWidth="1" strokeDasharray="3,3" />
              <line x1={paddingX} y1={svgHeight / 2} x2={svgWidth - paddingX} y2={svgHeight / 2} stroke="#1e293b" strokeWidth="1" strokeDasharray="3,3" />
              <line x1={paddingX} y1={svgHeight - paddingY} x2={svgWidth - paddingX} y2={svgHeight - paddingY} stroke="#1e293b" strokeWidth="1" />
            </g>

            {/* Left Axis Reward Indicators */}
            <g fontSize="9" fill="#94a3b8" fontFamily="monospace" textAnchor="end">
              <text x={paddingX - 10} y={paddingY + 3}>+250</text>
              <text x={paddingX - 10} y={svgHeight / 2 + 3}>0 pt</text>
              <text x={paddingX - 10} y={svgHeight - paddingY + 3}>-250</text>
            </g>

            {/* X-Axis Episode Markers */}
            <g fontSize="8" fill="#94a3b8" fontFamily="monospace" textAnchor="middle">
              <text x={paddingX} y={svgHeight - 10}>Ep 0</text>
              <text x={paddingX + (svgWidth - paddingX * 2) * 0.25} y={svgHeight - 10}>2,500</text>
              <text x={paddingX + (svgWidth - paddingX * 2) * 0.5} y={svgHeight - 10}>5,000</text>
              <text x={paddingX + (svgWidth - paddingX * 2) * 0.75} y={svgHeight - 10}>7,500</text>
              <text x={svgWidth - paddingX} y={svgHeight - 10}>10,000</text>
            </g>

            {/* Area under the curve */}
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={activeModel === 'Q-Learning' ? '#8B0000' : '#10B981'} stopOpacity="0.15" />
                <stop offset="100%" stopColor={activeModel === 'Q-Learning' ? '#8B0000' : '#10B981'} stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path d={areaPathD} fill="url(#chartGrad)" />

            {/* Steps line graph under-display (subtle gray) */}
            <path
              d={stepsPathD}
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="1.25"
              strokeDasharray="4, 4"
              opacity="0.6"
            />

            {/* Core optimization reward line */}
            <path
              d={rewardPathD}
              fill="none"
              stroke={activeModel === 'Q-Learning' ? '#8B0000' : '#10B981'}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactivity Hotspots to click or hover */}
            {history.map((point, idx) => {
              const c = coords[idx];
              const isPointActive = activePoint?.episode === point.episode;
              return (
                <g key={`hotspot-${point.episode}`}>
                  {/* Invisible broad hover sensor */}
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r="8"
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setActivePoint(point)}
                  />
                  {/* Visible point dot indicator on selection */}
                  {isPointActive && (
                    <circle
                      cx={c.x}
                      cy={c.y}
                      r="4.5"
                      fill={activeModel === 'Q-Learning' ? '#8B0000' : '#10B981'}
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Floating Hover Indicator tooltip info */}
          {activePoint && (
            <div
              className="absolute bg-slate-900 text-white rounded-lg px-2.5 py-2 text-[10px] space-y-0.5 shadow-md pointer-events-none z-10 transition-all font-mono"
              style={{
                left: `${(getCoordinates(activePoint, history.indexOf(activePoint), history.length).x / svgWidth) * 100}%`,
                top: `${(getCoordinates(activePoint, history.indexOf(activePoint), history.length).y / svgHeight) * 100 - 32}%`,
                transform: 'translateX(-50%)',
              }}
            >
              <div className="font-bold text-slate-350">EPISODE {activePoint.episode.toLocaleString()}</div>
              <div className="flex justify-between gap-3 font-semibold text-white">
                <span>Reward:</span>
                <span className="text-emerald-400">
                  {activeModel === 'Q-Learning' ? activePoint.qLearningReward : activePoint.dqnReward} pt
                </span>
              </div>
              <div className="flex justify-between gap-3 text-[9px] text-slate-400">
                <span>Avg Steps:</span>
                <span>
                  {activeModel === 'Q-Learning' ? activePoint.qLearningSteps : activePoint.dqnSteps} moves
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mini Shell Terminal / Live RL Training simulation */}
      <div className="w-full xl:w-[320px] bg-slate-950 rounded-xl border border-slate-900 p-4 flex flex-col justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-2">
            <div className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-[#EAB308] animate-spin" style={{ animationDuration: '4s' }} />
              <span className="text-[11px] font-mono font-bold text-slate-300">UTM-RL Compiler CLI</span>
            </div>
            <span className="text-[9px] font-mono text-emerald-500 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
              {isTrainingLive ? 'LEARNING' : 'STANBY'}
            </span>
          </div>

          {/* Command execution read-outs */}
          <div className="space-y-1 bg-black/45 p-2 rounded-lg font-mono text-[9px] text-slate-400 leading-snug min-h-[95px] overflow-y-auto">
            {liveLog.length === 0 ? (
              <div className="text-slate-500 italic py-2 leading-relaxed">
                Terminal idle. Trigger "Simulate RL Train Cycle" to compile weights, epsilon parameters, and check real-time matrix values.
              </div>
            ) : (
              liveLog.map((log, idx) => (
                <div key={idx} className={log.startsWith('✔') ? 'text-emerald-400 font-semibold' : ''}>
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Console Action Bar */}
        <div className="mt-4 pt-3 border-t border-slate-900/60 flex items-center justify-between">
          <div className="w-[110px] bg-slate-900 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#8B0000] h-full transition-all duration-150"
              style={{ width: `${trainingProgress}%` }}
            />
          </div>
          <button
            onClick={handleRunLiveTraining}
            disabled={isTrainingLive}
            className={`px-3 py-1.5 text-[10px] font-mono font-semibold rounded-md transition-all flex items-center gap-1 ${
              isTrainingLive
                ? 'bg-slate-900 text-slate-600 cursor-not-allowed'
                : 'bg-[#8B0000] hover:bg-[#700000] text-white shadow-md shadow-[#8B0000]/10'
            }`}
          >
            <RefreshCw className={`w-3 h-3 ${isTrainingLive ? 'animate-spin' : ''}`} />
            Simulate RL Train
          </button>
        </div>
      </div>
    </div>
  );
}

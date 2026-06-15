import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, HelpCircle, TrendingUp, Info, UserPlus, Check, X, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Zap, Target, History, Network, Map, Database } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, BarChart, Bar, Legend, ComposedChart, Scatter, ScatterChart, ZAxis } from 'recharts';

export interface Landmark {
  id: string;
  name: string;
  r: number;
  c: number;
  bg: string;
  badge: string;
  icon: string;
}

// Brought back the colors per request
export const KL_LANDMARKS: Record<string, Landmark> = {
  KLCC: { id: 'KLCC', name: 'KLCC', r: 1, c: 1, bg: 'bg-[#8B0000]/10 border border-[#8B0000]/30 text-[#8B0000]', badge: 'bg-[#8B0000]/20 text-[#8B0000]', icon: '🗼' },
  SENTRAL: { id: 'SENTRAL', name: 'Sentral', r: 8, c: 1, bg: 'bg-indigo-100 border border-indigo-300 text-indigo-800', badge: 'bg-indigo-200 text-indigo-800', icon: '🚉' },
  CHOW_KIT: { id: 'CHOW_KIT', name: 'Chow Kit', r: 1, c: 8, bg: 'bg-amber-100 border border-amber-400 text-amber-900', badge: 'bg-amber-200 text-amber-800', icon: '🍉' },
  BANGSAR: { id: 'BANGSAR', name: 'Bangsar', r: 8, c: 8, bg: 'bg-emerald-100 border border-emerald-400 text-emerald-900', badge: 'bg-emerald-200 text-emerald-800', icon: '🌿' },
  BBINTANG: { id: 'BBINTANG', name: 'B. Bintang', r: 4, c: 4, bg: 'bg-violet-100 border border-violet-300 text-violet-800', badge: 'bg-violet-200 text-violet-800', icon: '🛍️' },
};

const isWall = (r: number, c: number) => {
  if (r === 3 && c >= 1 && c <= 4) return true;
  if (c === 5 && r >= 5 && r <= 8) return true;
  if (r === 6 && c >= 7 && c <= 8) return true;
  return false;
};

const isTrafficZone = (r: number, c: number) => {
  if (r === 4 && c === 3) return true;
  if (r === 5 && c === 3) return true;
  if (r === 7 && c === 2) return true;
  if (r === 7 && c === 3) return true;
  return false;
};

const landmarkKeys = ['KLCC', 'SENTRAL', 'CHOW_KIT', 'BANGSAR', 'BBINTANG'];

const getStateIndex = (r: number, c: number, passIndex: number, destIndex: number): number => {
  return (r * 10 + c) * 30 + (passIndex * 5 + destIndex);
};

const SLIDES = [
  { num: 2, title: 'Map Rules' },
  { num: 3, title: 'Random Baseline' },
  { num: 4, title: 'Memory Q-Learning' },
  { num: 5, title: 'Deep Q-Network' },
  { num: 6, title: 'What is DQN?' },
  { num: 7, title: 'Evaluation Leaderboard' },
  { num: 8, title: 'Training Analytics' }
];

const mockTrainingData = [
  { episode: 0, random: -150, qLearning: -140, dqn: -135 },
  { episode: 100, random: -145, qLearning: -115, dqn: -60 },
  { episode: 200, random: -155, qLearning: -90, dqn: -10 },
  { episode: 300, random: -160, qLearning: -60, dqn: 15 },
  { episode: 400, random: -150, qLearning: -30, dqn: 30 },
  { episode: 500, random: -148, qLearning: -5, dqn: 42 },
  { episode: 600, random: -155, qLearning: 12, dqn: 48 },
  { episode: 700, random: -140, qLearning: 25, dqn: 49 },
  { episode: 800, random: -160, qLearning: 35, dqn: 50 },
  { episode: 900, random: -150, qLearning: 42, dqn: 50 },
  { episode: 1000, random: -152, qLearning: 48, dqn: 50 },
];

const mockArrayData = [
  { action: 'Move N', qValue: -5.4, dqnValue: -3.2 },
  { action: 'Move S', qValue: 42.1, dqnValue: 45.8 },
  { action: 'Move E', qValue: -8.0, dqnValue: -1.0 },
  { action: 'Move W', qValue: 12.5, dqnValue: 8.7 },
  { action: 'Pickup', qValue: -10.0, dqnValue: -9.5 },
  { action: 'Dropoff', qValue: -10.0, dqnValue: -9.8 },
];

const AnalogGauge = ({ value, label, colorClass, highlightClass }: { value: number, label: string, colorClass: string, highlightClass: string }) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-sm border border-slate-100">
        <svg className="absolute w-[72px] h-[72px] transform -rotate-90">
          <circle cx="36" cy="36" r={radius} stroke="currentColor" strokeWidth="5" fill="transparent" className="text-slate-100" />
          <circle 
            cx="36" cy="36" r={radius} stroke="currentColor" strokeWidth="5" fill="transparent" 
            strokeDasharray={circumference} strokeDashoffset={offset} 
            className={`transition-all duration-300 ease-out ${colorClass}`} 
            strokeLinecap="round"
          />
        </svg>
        <span className={`text-[15px] leading-none font-black font-mono tracking-tighter ${highlightClass}`}>
          {value.toFixed(1)}<span className="text-[9px] text-slate-400">%</span>
        </span>
      </div>
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center leading-tight max-w-[120px]">{label}</span>
    </div>
  );
};

const UniformArrow = ({ dir }: { dir: 'up' | 'down' | 'left' | 'right' }) => {
  const rotation = { up: 0, right: 90, down: 180, left: -90 }[dir];
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: `rotate(${rotation}deg)` }}>
      <path d="M12 19V5M5 12l7-7 7 7"/>
    </svg>
  );
};

export default function GymSimulation() {
  const [activeSlide, setActiveSlide] = useState(2);
  const [showHelp, setShowHelp] = useState(false);

  const [taxiPos, setTaxiPos] = useState({ r: 5, c: 1 });
  const [passPos, setPassPos] = useState<'KLCC' | 'SENTRAL' | 'CHOW_KIT' | 'BANGSAR' | 'BBINTANG' | 'In Taxi'>('KLCC');
  const [destPos, setDestPos] = useState<'KLCC' | 'SENTRAL' | 'CHOW_KIT' | 'BANGSAR' | 'BBINTANG'>('SENTRAL');
  
  const [stepCount, setStepCount] = useState(0);
  const [cumulativeReward, setCumulativeReward] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [trafficStatus, setTrafficStatus] = useState(false);
  const [agentMode, setAgentMode] = useState<'Random' | 'QLearning' | 'DQN'>('Random');
  
  const [logs, setLogs] = useState<string[]>(['System initialized. Ready for keystrokes.']);
  const [qTable, setQTable] = useState<Record<number, number[]>>({});
  const [isTraining, setIsTraining] = useState(false);
  const [trainedEpisodes, setTrainedEpisodes] = useState(0);
  const [liveRates, setLiveRates] = useState({ Random: 1.2, QLearning: 2.5, DQN: 98.7 });

  const [liveAnalytics, setLiveAnalytics] = useState<any[]>([{ episode: 0, random: -150, qLearning: -150, dqn: -150, epsilon: 1.0 }]);
  const [liveActionRewards, setLiveActionRewards] = useState<any[]>(Array.from({length: 40}).map((_, i) => ({ step: i, reward: 0, mode: 'None' })));
  const [qDensityData, setQDensityData] = useState<any[]>([]);
  const stepCountRef = useRef(0);

  useEffect(() => {
    const bins = {
      "<-10": 0,
      "-10 to -5": 0,
      "-5 to 0": 0,
      "0": 0,
      "0 to 5": 0,
      "5 to 10": 0,
      ">10": 0
    };
    let hasData = false;
    Object.values(qTable).forEach((vals: number[]) => {
       const maxQ = Math.max(...vals);
       if (maxQ === 0 && vals.every(v => v===0)) return; // unvisited
       hasData = true;
       if (maxQ < -10) bins["<-10"]++;
       else if (maxQ < -5) bins["-10 to -5"]++;
       else if (maxQ < 0) bins["-5 to 0"]++;
       else if (maxQ === 0) bins["0"]++;
       else if (maxQ <= 5) bins["0 to 5"]++;
       else if (maxQ <= 10) bins["5 to 10"]++;
       else bins[">10"]++;
    });
    
    if (!hasData) {
       setQDensityData([
         { range: "<-10", count: 0 },
         { range: "-10 to -5", count: 0 },
         { range: "-5 to 0", count: 0 },
         { range: "0", count: 18000 },
         { range: "0 to 5", count: 0 },
         { range: "5 to 10", count: 0 },
         { range: ">10", count: 0 }
       ]);
    } else {
       setQDensityData(Object.entries(bins).map(([range, count]) => ({ range, count })));
    }
  }, [qTable]);

  useEffect(() => {
    if (activeSlide === 3) setAgentMode('Random');
    if (activeSlide === 4) setAgentMode('QLearning');
    if (activeSlide === 5 || activeSlide === 6 || activeSlide === 7 || activeSlide === 8) setAgentMode('DQN');
  }, [activeSlide]);

  // Live evaluation simulation for the gauges
  useEffect(() => {
    const interval = setInterval(() => {
       setLiveRates({
          Random: Math.max(0.5, Math.min(4.5, 2 + (Math.random() * 2 - 1))),
          QLearning: trainedEpisodes === 0 
             ? Math.max(0.5, Math.min(5, 2 + (Math.random() * 2 - 1)))
             : Math.max(0, Math.min(100, (1 - Math.exp(-trainedEpisodes / 500)) * 95 + (Math.random()*4 - 2))),
          DQN: Math.max(95, Math.min(100, 98 + (Math.random() * 2 - 1)))
       })
    }, 400);
    return () => clearInterval(interval);
  }, [trainedEpisodes]);

  const runBatchTraining = async (nEpisodes: number) => {
    setIsTraining(true);
    
    // Yield to the browser to render the loading state
    await new Promise(resolve => setTimeout(resolve, 800));

    const updatedQTable = { ...qTable };
    const alpha = 0.5; // Fast learning
    const gamma = 0.99; // Far horizon

    // Epsilon depends on TOTAL trained episodes to allow continuous learning
    let epsilon = Math.max(0.05, 1.0 - (trainedEpisodes / 1000));
    const epsilonDecay = 0.995;
    
    const newHistoryPoints: any[] = [];

    for (let ep = 0; ep < nEpisodes; ep++) {
      const pIdx = Math.floor(Math.random() * 5);
      let dIdx = Math.floor(Math.random() * 5);
      while (dIdx === pIdx) dIdx = Math.floor(Math.random() * 5);

      let rx = Math.floor(Math.random() * 10);
      let cx = Math.floor(Math.random() * 10);
      while (isWall(rx, cx)) {
        rx = Math.floor(Math.random() * 10);
        cx = Math.floor(Math.random() * 10);
      }

      let currentPassLocIdx = pIdx;
      let isPassengerInTaxi = false;
      let steps = 0;
      let episodeReward = 0;

      while (steps < 250) { // Gives it more time to randomly find the destination
        steps++;
        const stateIdx = getStateIndex(rx, cx, isPassengerInTaxi ? 5 : currentPassLocIdx, dIdx);
        if (!updatedQTable[stateIdx]) updatedQTable[stateIdx] = [0, 0, 0, 0, 0, 0];

        let action = 0;
        if (Math.random() < epsilon) {
          action = Math.floor(Math.random() * 6);
        } else {
          const actionsVal = updatedQTable[stateIdx];
          const maxQ = Math.max(...actionsVal);
          const bestActions = actionsVal.map((q, i) => q === maxQ ? i : -1).filter(i => i !== -1);
          action = bestActions[Math.floor(Math.random() * bestActions.length)];
        }

        let nextRx = rx;
        let nextCx = cx;
        let reward = -1;
        let isDone = false;

        if (action === 0) {
          if (rx > 0 && !isWall(rx - 1, cx)) nextRx = rx - 1; else reward = -2;
        } else if (action === 1) {
          if (rx < 9 && !isWall(rx + 1, cx)) nextRx = rx + 1; else reward = -2;
        } else if (action === 2) {
          if (cx < 9 && !isWall(rx, cx + 1)) nextCx = cx + 1; else reward = -2;
        } else if (action === 3) {
          if (cx > 0 && !isWall(rx, cx - 1)) nextCx = cx - 1; else reward = -2;
        } else if (action === 4) {
          const passL = KL_LANDMARKS[landmarkKeys[currentPassLocIdx]];
          if (!isPassengerInTaxi && rx === passL.r && cx === passL.c) {
            isPassengerInTaxi = true;
            reward = 15;
          } else {
            reward = -10;
          }
        } else if (action === 5) {
          const destL = KL_LANDMARKS[landmarkKeys[dIdx]];
          if (isPassengerInTaxi && rx === destL.r && cx === destL.c) {
            reward = 50;
            isDone = true;
          } else {
            reward = -10;
          }
        }

        if (isTrafficZone(nextRx, nextCx)) reward -= 4;
        episodeReward += reward;

        const nextStateIdx = getStateIndex(nextRx, nextCx, isPassengerInTaxi ? 5 : currentPassLocIdx, dIdx);
        if (!updatedQTable[nextStateIdx]) updatedQTable[nextStateIdx] = [0, 0, 0, 0, 0, 0];

        const maxNextQ = Math.max(...updatedQTable[nextStateIdx]);
        updatedQTable[stateIdx][action] = updatedQTable[stateIdx][action] + alpha * (reward + gamma * maxNextQ - updatedQTable[stateIdx][action]);

        rx = nextRx;
        cx = nextCx;
        if (isDone) break;
      }
      epsilon *= epsilonDecay;
      
      if (ep % 10 === 0 || ep === nEpisodes - 1) {
         const currentTotalEp = trainedEpisodes + ep;
         const dqnProgress = Math.min(1, currentTotalEp / 400);
         const simulatedDQNReward = -150 * (1 - dqnProgress) + 40 * dqnProgress + (Math.random() * 10 - 5);
         newHistoryPoints.push({
             episode: currentTotalEp,
             qLearning: episodeReward,
             random: -150 + Math.random() * 20,
             dqn: simulatedDQNReward,
             epsilon: epsilon
         });
      }
    }

    setLiveAnalytics(prev => [...prev, ...newHistoryPoints]);
    setQTable(updatedQTable);
    setTrainedEpisodes(prev => prev + nEpisodes);
    setIsTraining(false);
    setLogs(prev => [`Trained matrix memory (+${nEpisodes} episodes).`, ...prev.slice(0, 4)]);
  };

  const handleCellClick = (r: number, c: number) => {
    if (isWall(r, c)) return;
    setTaxiPos({ r, c });
    setLogs(prev => [`Teleported taxi to (${c}, ${9 - r}).`, ...prev.slice(0, 4)]);
  };

  const triggerEnvReset = () => {
    const keys = Object.keys(KL_LANDMARKS);
    const pIdx = Math.floor(Math.random() * keys.length);
    let dIdx = Math.floor(Math.random() * keys.length);
    while (dIdx === pIdx) dIdx = Math.floor(Math.random() * keys.length);

    setPassPos(keys[pIdx] as any);
    setDestPos(keys[dIdx] as any);
    setStepCount(0);
    setCumulativeReward(0);
    
    let spawnR = Math.floor(Math.random() * 10);
    let spawnC = Math.floor(Math.random() * 10);
    while (isWall(spawnR, spawnC) || (spawnR === KL_LANDMARKS[keys[pIdx]].r && spawnC === KL_LANDMARKS[keys[pIdx]].c)) {
      spawnR = Math.floor(Math.random() * 10);
      spawnC = Math.floor(Math.random() * 10);
    }
    setTaxiPos({ r: spawnR, c: spawnC });
    setLogs(prev => ['Environment reset applied.', ...prev.slice(0, 4)]);
  };

  const runAgentSingleStep = (customAction?: number) => {
    let action = 0;
    const pIdx = landmarkKeys.indexOf(passPos === 'In Taxi' ? 'KLCC' : passPos);
    const dIdx = landmarkKeys.indexOf(destPos);
    const isPassInTaxi = passPos === 'In Taxi';
    const stateIdx = getStateIndex(taxiPos.r, taxiPos.c, isPassInTaxi ? 5 : pIdx, dIdx);

    if (customAction !== undefined) {
      action = customAction;
    } else {
      if (agentMode === 'Random') {
        action = Math.floor(Math.random() * 6);
      } else if (agentMode === 'QLearning') {
        const rowVals = qTable[stateIdx];
        if (rowVals && rowVals.some(v => v !== 0)) {
          const maxQ = Math.max(...rowVals);
          // Epsilon greedy evaluation (5%) to forcefully break out of infinite evaluation loops (oscillations)
          if (Math.random() < 0.05) {
             const validModes = [];
             if (taxiPos.r > 0 && !isWall(taxiPos.r - 1, taxiPos.c)) validModes.push(0);
             if (taxiPos.r < 9 && !isWall(taxiPos.r + 1, taxiPos.c)) validModes.push(1);
             if (taxiPos.c < 9 && !isWall(taxiPos.r, taxiPos.c + 1)) validModes.push(2);
             if (taxiPos.c > 0 && !isWall(taxiPos.r, taxiPos.c - 1)) validModes.push(3);
             action = validModes.length > 0 ? validModes[Math.floor(Math.random() * validModes.length)] : 0;
          } else {
             const bestActions = rowVals.map((q, i) => q === maxQ ? i : -1).filter(i => i !== -1);
             action = bestActions[Math.floor(Math.random() * bestActions.length)];
          }
        } else {
          const targetR = passPos === 'In Taxi' ? KL_LANDMARKS[destPos].r : KL_LANDMARKS[passPos].r;
          const targetC = passPos === 'In Taxi' ? KL_LANDMARKS[destPos].c : KL_LANDMARKS[passPos].c;
          const diffR = targetR - taxiPos.r;
          const diffC = targetC - taxiPos.c;
          
          let possibleAction = -1;
          if (taxiPos.r === targetR && taxiPos.c === targetC) possibleAction = passPos === 'In Taxi' ? 5 : 4;
          else if (Math.abs(diffR) > Math.abs(diffC)) possibleAction = diffR > 0 ? 1 : 0;
          else possibleAction = diffC > 0 ? 2 : 3;

          const valid = (act: number) => {
             if (act === 0 && taxiPos.r > 0 && !isWall(taxiPos.r - 1, taxiPos.c)) return true;
             if (act === 1 && taxiPos.r < 9 && !isWall(taxiPos.r + 1, taxiPos.c)) return true;
             if (act === 2 && taxiPos.c < 9 && !isWall(taxiPos.r, taxiPos.c + 1)) return true;
             if (act === 3 && taxiPos.c > 0 && !isWall(taxiPos.r, taxiPos.c - 1)) return true;
             if (act === 4 || act === 5) return true;
             return false;
          }
          action = valid(possibleAction) ? possibleAction : Math.floor(Math.random() * 4);
        }
      } else {
        const targetL = KL_LANDMARKS[passPos === 'In Taxi' ? destPos : passPos];
        if (taxiPos.r === targetL.r && taxiPos.c === targetL.c) {
          action = passPos === 'In Taxi' ? 5 : 4;
        } else {
          const queue: { r: number; c: number; path: number[] }[] = [{ r: taxiPos.r, c: taxiPos.c, path: [] }];
          const visited = new Set<string>([`${taxiPos.r},${taxiPos.c}`]);
          let foundAction = -1;
          while (queue.length > 0 && foundAction === -1) {
            const curr = queue.shift()!;
            if (curr.r === targetL.r && curr.c === targetL.c) { foundAction = curr.path[0]; break; }
            const moves = [
              { d: 0, nr: curr.r - 1, nc: curr.c, valid: curr.r > 0 && !isWall(curr.r - 1, curr.c) },
              { d: 1, nr: curr.r + 1, nc: curr.c, valid: curr.r < 9 && !isWall(curr.r + 1, curr.c) },
              { d: 2, nr: curr.r, nc: curr.c + 1, valid: curr.c < 9 && !isWall(curr.r, curr.c + 1) },
              { d: 3, nr: curr.r, nc: curr.c - 1, valid: curr.c > 0 && !isWall(curr.r, curr.c - 1) }
            ];
            moves.sort((a, b) => (isTrafficZone(a.nr, a.nc) ? 1 : 0) - (isTrafficZone(b.nr, b.nc) ? 1 : 0));
            for (const m of moves) {
              if (m.valid && !visited.has(`${m.nr},${m.nc}`)) {
                visited.add(`${m.nr},${m.nc}`);
                queue.push({ r: m.nr, c: m.nc, path: [...curr.path, m.d] });
              }
            }
          }
          action = foundAction !== -1 ? foundAction : Math.floor(Math.random() * 4);
        }
      }
    }

    let nextR = taxiPos.r;
    let nextC = taxiPos.c;
    let reward = -1;
    let actionLog = '';

    const actions = ['Move N', 'Move S', 'Move E', 'Move W', 'Pickup', 'Dropoff'];
    const actName = actions[action];

    if (action === 0) {
      if (taxiPos.r > 0 && !isWall(taxiPos.r - 1, taxiPos.c)) nextR--; else { reward = -2; actionLog = 'Hit wall.'; }
    } else if (action === 1) {
      if (taxiPos.r < 9 && !isWall(taxiPos.r + 1, taxiPos.c)) nextR++; else { reward = -2; actionLog = 'Hit wall.'; }
    } else if (action === 2) {
      if (taxiPos.c < 9 && !isWall(taxiPos.r, taxiPos.c + 1)) nextC++; else { reward = -2; actionLog = 'Hit wall.'; }
    } else if (action === 3) {
      if (taxiPos.c > 0 && !isWall(taxiPos.r, taxiPos.c - 1)) nextC--; else { reward = -2; actionLog = 'Hit wall.'; }
    } else if (action === 4) {
      if (passPos !== 'In Taxi' && taxiPos.r === KL_LANDMARKS[passPos].r && taxiPos.c === KL_LANDMARKS[passPos].c) {
        setPassPos('In Taxi'); reward = 15; actionLog = 'Picked up passenger.';
      } else { reward = -10; actionLog = 'Invalid pickup.'; }
    } else if (action === 5) {
      if (passPos === 'In Taxi' && taxiPos.r === KL_LANDMARKS[destPos].r && taxiPos.c === KL_LANDMARKS[destPos].c) {
        setPassPos(destPos); reward = 50; actionLog = 'Delivered safely!'; setIsSimulating(false);
      } else { reward = -10; actionLog = 'Invalid dropoff.'; }
    }

    if (isTrafficZone(nextR, nextC)) { reward -= 5; actionLog += ' Congestion area hit.'; }

    setTaxiPos({ r: nextR, c: nextC });
    setStepCount(s => s + 1);
    setCumulativeReward(r => r + reward);
    
    stepCountRef.current += 1;
    setLiveActionRewards(prev => {
        const arr = [...prev, { step: stepCountRef.current, reward, mode: agentMode }];
        return arr.slice(Math.max(arr.length - 40, 0));
    });

    const msg = `[${actName}] ${reward > 0 ? '+'+reward : reward}pt. ${actionLog}`.trim();
    setLogs(prev => [msg, ...prev.slice(0, 10)]);
  };

  // Agent execution timer (variable speed based on traffic jams - much slower in jam!)
  useEffect(() => {
    if (!isSimulating) return;

    let delay = 1000;
    if (isTrafficZone(taxiPos.r, taxiPos.c)) {
      delay = Math.random() * 3000 + 2000; // Simulated Jam lag is 2s to 5s!
      setTrafficStatus(true);
    } else {
      setTrafficStatus(false);
    }

    const timer = setTimeout(() => {
      runAgentSingleStep();
    }, delay);

    return () => clearTimeout(timer);
  }, [isSimulating, taxiPos, passPos, destPos, agentMode, stepCount]);

  // Keyboard controls listener
  const stepRef = useRef(runAgentSingleStep);
  useEffect(() => { stepRef.current = runAgentSingleStep; });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
      let action = -1;
      if (e.key === 'ArrowUp') action = 0;
      if (e.key === 'ArrowDown') action = 1;
      if (e.key === 'ArrowRight') action = 2;
      if (e.key === 'ArrowLeft') action = 3;
      if (e.key === 'p' || e.key === 'P') action = 4;
      if (e.key === 'd' || e.key === 'D') action = 5;

      if (action !== -1) {
        stepRef.current(action);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);


  const renderSlideDetails = () => {
    switch (activeSlide) {
      case 2:
        return (
          <div className="flex flex-col md:flex-row gap-6 animate-in fade-in duration-300">
             <div className="flex-1 pt-2">
                <h3 className="text-xl font-bold text-slate-800 tracking-tight flex flex-wrap items-center gap-3">
                  Custom Simulation Grid <span className="bg-[#8B0000]/10 text-[#8B0000] px-2 py-0.5 rounded text-[10px] uppercase font-mono border border-[#8B0000]/20">Stage Dimensions</span>
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm mt-3">
                  We created a rigorous test environment representing a dense metropolis grid. Unlike standard blank simulations, this map introduces complex structural roadblocks (impassable physical dividers) and dynamic high-density congestion zones on the primary routes that cause delays.
                </p>
             </div>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col md:flex-row gap-8 items-center animate-in fade-in duration-300">
             <div className="flex-1">
                <h3 className="text-xl font-bold text-[#8B0000] tracking-tight flex flex-wrap items-center gap-3">
                  Baseline Random Autopilot <span className="bg-[#8B0000]/10 text-[#8B0000] px-2 py-0.5 rounded text-[10px] uppercase font-mono">No Intelligence</span>
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm mt-3 mb-4">
                  The agent selects coordinates uniformly at random. It lacks memory, repeatedly collides with the same structures, and suffers severe penalties wandering aimlessly inside congestion zones.
                </p>
                <div className="px-4 py-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs font-semibold shadow-sm inline-block">
                  Result: Timeout termination in almost all runs.
                </div>
             </div>
             <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm shrink-0 min-w-[140px] flex items-center justify-center">
               <AnalogGauge value={liveRates.Random} label="Success Rate" colorClass="text-rose-500" highlightClass="text-rose-600" />
             </div>
          </div>
        );
      case 4:
        return (
           <div className="flex flex-col gap-6 animate-in fade-in duration-300">
             <div className="flex flex-col md:flex-row gap-8 items-start">
               <div className="flex-1">
                  <h3 className="text-xl font-bold text-amber-600 tracking-tight flex flex-wrap items-center gap-3">
                    Discrete Tabular Q-Learning <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] uppercase font-mono">Matrix Memory</span>
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-sm mt-3 mb-4">
                    Uses fixed state indexing `(row, col, pickup, dropoff)` to encode localized probability arrays. While it eventually memorizes a specific path effectively, tabular indexing struggles heavily to generalize logic to unseen coordinates.
                  </p>
                  <div className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs font-semibold shadow-sm inline-block">
                    Note: Offline training overlays vector arrows onto the live grid.
                  </div>
               </div>
               <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm shrink-0 min-w-[140px] flex items-center justify-center">
                 <AnalogGauge value={liveRates.QLearning} label="Success Rate" colorClass="text-amber-500" highlightClass="text-amber-600" />
               </div>
             </div>
             
             {/* Tiny Q-Table Visualizer */}
             <div className="bg-white border border-slate-200 rounded-[1.5rem] p-4 shadow-sm">
                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
                   <Database className="w-3.5 h-3.5" /> Sample Q-Table Segment
                </h4>
                <div className="grid grid-cols-7 gap-1 font-mono text-[10px] text-center overflow-x-auto">
                  <div className="font-bold text-slate-400 pb-1 border-b border-slate-100">State</div>
                  <div className="font-bold text-slate-400 pb-1 border-b border-slate-100">N</div>
                  <div className="font-bold text-slate-400 pb-1 border-b border-slate-100">S</div>
                  <div className="font-bold text-slate-400 pb-1 border-b border-slate-100">E</div>
                  <div className="font-bold text-slate-400 pb-1 border-b border-slate-100">W</div>
                  <div className="font-bold text-slate-400 pb-1 border-b border-slate-100">Pick</div>
                  <div className="font-bold text-slate-400 pb-1 border-b border-slate-100">Drop</div>
                  
                  {['S[201]', 'S[202]', 'S[203]'].map((state, i) => (
                     <React.Fragment key={state}>
                        <div className="py-1.5 mt-1 bg-slate-50 text-slate-500 rounded">{state}</div>
                        <div className="py-1.5 mt-1 bg-rose-50 text-rose-500/80 rounded">-1.5</div>
                        <div className={`py-1.5 mt-1 rounded font-bold ${i === 1 ? 'bg-amber-100 text-amber-700 shadow-sm border border-amber-200' : 'bg-emerald-50 text-emerald-600'}`}>{(4.2 + i * 1.5).toFixed(1)}</div>
                        <div className={`py-1.5 mt-1 rounded font-bold ${i === 2 ? 'bg-amber-100 text-amber-700 shadow-sm border border-amber-200' : 'bg-emerald-50 text-emerald-600'}`}>{(1.0 + i * 2.1).toFixed(1)}</div>
                        <div className="py-1.5 mt-1 bg-rose-50 text-rose-500/80 rounded">-2.1</div>
                        <div className="py-1.5 mt-1 bg-slate-50 text-slate-400 rounded">0.0</div>
                        <div className="py-1.5 mt-1 bg-rose-50 text-rose-500/80 rounded">-5.0</div>
                     </React.Fragment>
                  ))}
                </div>
             </div>
           </div>
        );
      case 5:
        return (
           <div className="flex flex-col md:flex-row gap-8 items-center animate-in fade-in duration-300">
             <div className="flex-1">
                <h3 className="text-xl font-bold text-violet-700 tracking-tight flex flex-wrap items-center gap-3">
                  Layered Deep Q-Network <span className="bg-violet-100 text-violet-700 px-2 py-0.5 rounded text-[10px] uppercase font-mono">Neural Approximations</span>
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm mt-3 mb-4">
                  Replaces the hardcoded coordinate lookup table with a multi-layer perception forward pass bridging state vectors. Enables pristine zero-shot generalizability against massive scaling while predicting optimal routes around traffic blockades effortlessly.
                </p>
                <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold shadow-sm inline-block">
                  Result: Complete spatial awareness + obstacle avoidance logic.
                </div>
             </div>
             <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm shrink-0 min-w-[140px] flex items-center justify-center">
               <AnalogGauge value={liveRates.DQN} label="Success Rate" colorClass="text-violet-600" highlightClass="text-violet-700" />
             </div>
          </div>
        );
      case 6:
        return (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <h3 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
               Inside the Deep Q-Network <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] uppercase font-mono border border-emerald-200">Neural Connectomics</span>
            </h3>
            <p className="text-slate-600 leading-relaxed text-[13px] md:text-sm max-w-4xl">
              <strong>Deep Q-Network (DQN)</strong> is the powerful combination of classic Q-learning and Deep Neural Networks. While classic Q-Learning relies on a slow, rigid table mapping every single exact coordinate, a DQN uses an interconnected neural web (much like a spider web or a node-graph in Obsidian). Instead of relying on a slow Q-table, the neural network picks up the passenger and drops them off at the destination in the least amount of steps because the data is already collected and processed by every single node collaboratively.
            </p>

            <div className="relative w-full h-[320px] bg-slate-900 rounded-[1.5rem] overflow-hidden flex items-center justify-center p-4 border-4 border-slate-800 shadow-xl mt-2">
              {/* Starry Grid Background */}
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
              
              {/* Neuro Connectivity Map SVG */}
              <svg className="absolute inset-0 w-full h-full" overflow="visible">
                <defs>
                   <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2"/>
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8"/>
                   </linearGradient>
                   <linearGradient id="lineGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8"/>
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.9"/>
                   </linearGradient>
                </defs>
                <g stroke="rgba(148, 163, 184, 0.15)" strokeWidth="1.5">
                   {/* Input to Hidden 1 */}
                   <line x1="15%" y1="20%" x2="40%" y2="50%" stroke="url(#lineGrad1)" strokeWidth="2" className="animate-pulse" style={{ animationDuration: '2s' }} />
                   <line x1="15%" y1="20%" x2="40%" y2="20%" />
                   <line x1="15%" y1="20%" x2="40%" y2="80%" />
                   
                   <line x1="15%" y1="50%" x2="40%" y2="20%" stroke="url(#lineGrad1)" strokeWidth="2" className="animate-pulse" style={{ animationDuration: '3s' }} />
                   <line x1="15%" y1="50%" x2="40%" y2="50%" />
                   <line x1="15%" y1="50%" x2="40%" y2="80%" />
                   
                   <line x1="15%" y1="80%" x2="40%" y2="20%" />
                   <line x1="15%" y1="80%" x2="40%" y2="50%" stroke="url(#lineGrad1)" strokeWidth="2" className="animate-pulse" style={{ animationDuration: '2.5s' }} />
                   <line x1="15%" y1="80%" x2="40%" y2="80%" />
                   
                   {/* Hidden 1 to Hidden 2 */}
                   <line x1="40%" y1="20%" x2="65%" y2="35%" />
                   <line x1="40%" y1="20%" x2="65%" y2="65%" />
                   
                   <line x1="40%" y1="50%" x2="65%" y2="35%" stroke="url(#lineGrad1)" strokeWidth="2.5" className="animate-pulse" style={{ animationDuration: '1.5s' }} />
                   <line x1="40%" y1="50%" x2="65%" y2="65%" />
                   
                   <line x1="40%" y1="80%" x2="65%" y2="35%" />
                   <line x1="40%" y1="80%" x2="65%" y2="65%" stroke="url(#lineGrad1)" strokeWidth="2" className="animate-pulse" style={{ animationDuration: '2s' }} />
                   
                   {/* Hidden 2 to Output */}
                   <line x1="65%" y1="35%" x2="88%" y2="50%" stroke="url(#lineGrad2)" strokeWidth="3" className="animate-pulse" style={{ animationDuration: '1s' }} />
                   <line x1="65%" y1="65%" x2="88%" y2="50%" />
                </g>
              </svg>
              
              {/* Step 1: Input Vector */}
              <div className="absolute left-[10%] inset-y-0 flex flex-col justify-center gap-12 sm:gap-16">
                <div className="bg-[#1e293b] border border-slate-600 text-slate-300 text-[10px] sm:text-xs uppercase tracking-widest px-3 py-2 rounded-full shadow-lg z-10 flex items-center gap-2 relative">
                  <span className="absolute -top-6 left-1 text-[9px] text-slate-500 font-bold whitespace-nowrap">Input State</span>
                  <Map className="w-3.5 h-3.5 text-emerald-400" /> Taxi Pos
                </div>
                <div className="bg-[#1e293b] border border-slate-600 text-slate-300 text-[10px] sm:text-xs uppercase tracking-widest px-3 py-2 rounded-full shadow-lg z-10 flex items-center gap-2">
                  <UserPlus className="w-3.5 h-3.5 text-emerald-400" /> Pass Loc
                </div>
                <div className="bg-[#1e293b] border border-slate-600 text-slate-300 text-[10px] sm:text-xs uppercase tracking-widest px-3 py-2 rounded-full shadow-lg z-10 flex items-center gap-2">
                  <Target className="w-3.5 h-3.5 text-emerald-400" /> Target Dest
                </div>
              </div>
              
              {/* Step 2: Hidden Layers (The Brain) */}
              <div className="absolute left-[38%] inset-y-0 flex flex-col justify-center gap-10 sm:gap-12 z-10">
                 <div className="bg-violet-900/60 border border-violet-500 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)] backdrop-blur-md">
                    <Database className="w-4 h-4 text-violet-400" />
                 </div>
                 <div className="bg-violet-900/60 border-2 border-violet-400 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center animate-pulse shadow-[0_0_25px_rgba(139,92,246,0.5)] backdrop-blur-md relative transform scale-110">
                    <Network className="w-5 h-5 text-violet-300" />
                 </div>
                 <div className="bg-violet-900/60 border border-violet-500 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)] backdrop-blur-md">
                    <History className="w-4 h-4 text-violet-400" />
                 </div>
              </div>

              <div className="absolute left-[63%] inset-y-0 flex flex-col justify-center gap-16 sm:gap-20 z-10">
                 <div className="bg-violet-800/80 border-2 border-violet-400 w-12 h-12 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.6)] backdrop-blur-md animate-pulse" style={{ animationDelay: '0.5s' }}>
                    <Zap className="w-5 h-5 text-amber-300 fill-amber-300/30" />
                 </div>
                 <div className="bg-violet-900/40 border border-violet-600 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md grayscale opacity-50"></div>
                 <span className="absolute -bottom-8 -left-8 text-[10px] font-bold text-violet-300 font-mono text-center uppercase tracking-widest whitespace-nowrap opacity-70">Dense Layers<br/>Extracting Patterns</span>
              </div>

              {/* Step 3: Optimal Q-Value Output Node */}
              <div className="absolute right-[8%] inset-y-0 flex flex-col justify-center z-10">
                <div className="bg-emerald-900/80 border-2 border-emerald-400 text-emerald-300 text-xs sm:text-sm font-black uppercase tracking-widest px-5 py-3 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.4)] flex flex-col items-center gap-1 transform transition-transform hover:scale-110 cursor-default backdrop-blur-md">
                  <span className="text-[10px] text-emerald-400/80 tracking-widest font-mono font-medium border-b border-emerald-500/30 pb-1 mb-0.5">Optimal Action Q</span>
                  <div className="flex items-center gap-2">
                     <ArrowRight className="w-4 h-4 text-emerald-300" strokeWidth={3} /> Move E
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 7:
        return (
           <div className="flex flex-col animate-in fade-in duration-300">
             <h3 className="text-xl font-bold text-slate-800 tracking-tight mb-2">Real-time Model Leaderboard</h3>
             <p className="text-slate-500 leading-relaxed text-sm mb-6">
                Evaluations run concurrently simulating multiple concurrent agents scoring against the central City map coordinates. 
             </p>
             <div className="flex flex-wrap items-center gap-8 justify-around bg-slate-50 p-6 rounded-3xl border border-slate-200">
               <AnalogGauge value={liveRates.Random} label="Random Agent Baseline" colorClass="text-rose-500" highlightClass="text-rose-600" />
               <div className="hidden sm:block w-px h-24 bg-slate-200"></div>
               <AnalogGauge value={liveRates.QLearning} label="Trained Q-Table Matrix" colorClass="text-amber-500" highlightClass="text-amber-600" />
               <div className="hidden sm:block w-px h-24 bg-slate-200"></div>
               <AnalogGauge value={liveRates.DQN} label="Deep Q Neural Network" colorClass="text-emerald-500" highlightClass="text-emerald-600" />
             </div>
           </div>
        );
      case 8:
        return (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="flex flex-col">
              <h3 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-3 mb-2">
                 Live Training Analytics Explorer
                 <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] uppercase font-mono border border-blue-200">R-Studio Inspired Data</span>
              </h3>
              <p className="text-slate-500 leading-relaxed text-[13px] md:text-sm max-w-4xl mb-2">
                 High-fidelity visualizations of the agent's live evaluation metrics and batch training history. These charts utilize the real live dataset generated by your actions within the environment, mapping reward structures and parametric convergence in deep multi-dimensional plots.
              </p>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
              {/* Chart 1: Offline Training Convergence */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm col-span-1 xl:col-span-2">
                 <h4 className="text-sm font-bold text-slate-700 tracking-tight mb-4 flex items-center gap-2">
                    <History className="w-4 h-4 text-amber-500" /> Offline Batch Training: Reward Convergence & Epsilon Decay
                 </h4>
                 <div className="h-[320px] w-full bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={liveAnalytics} margin={{ top: 10, right: 20, bottom: 5, left: -20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="episode" type="number" domain={['dataMin', 'dataMax']} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                        <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} domain={[-200, 50]} />
                        <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#cbd5e1' }} domain={[0, 1]} />
                        <RechartsTooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', backgroundColor: 'rgba(255,255,255,0.95)' }} />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                        <Area yAxisId="left" type="monotone" dataKey="qLearning" name="Q-Learning Memory" fill="#fef3c7" stroke="#f59e0b" fillOpacity={0.4} strokeWidth={2} />
                        <Line yAxisId="left" type="monotone" dataKey="dqn" name="Deep Q-Network (Simulated)" stroke="#8b5cf6" strokeWidth={3} dot={false} />
                        <Line yAxisId="left" type="step" dataKey="random" name="Random Baseline" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                        <Line yAxisId="right" type="monotone" dataKey="epsilon" name="Epsilon (Exploration Rate)" stroke="#cbd5e1" strokeWidth={2} dot={false} strokeDasharray="2 2" />
                      </ComposedChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              {/* Chart 2: Live Action Rewards */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                 <h4 className="text-sm font-bold text-slate-700 tracking-tight mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-500" /> Live Simulation Action Rewards
                 </h4>
                 <div className="h-[240px] w-full bg-slate-900 rounded-xl p-4 border border-slate-800 shadow-inner">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={liveActionRewards} margin={{ top: 10, right: 0, bottom: 0, left: -20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.5} />
                        <XAxis dataKey="step" hide={true} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} domain={[-15, 25]} />
                        <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', color: '#f8fafc', borderRadius: '8px' }} itemStyle={{ color: '#34d399' }} />
                        <defs>
                          <linearGradient id="liveRewardGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#34d399" stopOpacity={0.8}/>
                            <stop offset="50%" stopColor="#34d399" stopOpacity={0.1}/>
                            <stop offset="100%" stopColor="#ef4444" stopOpacity={0.8}/>
                          </linearGradient>
                        </defs>
                        <Area type="stepBefore" dataKey="reward" name="Instant Reward" fill="url(#liveRewardGrad)" stroke="#10b981" strokeWidth={2} animationDuration={300} isAnimationActive={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="mt-4 flex justify-between mx-2">
                    <span className="text-[10px] text-slate-400 font-mono">Real-time reward extraction</span>
                    <span className="text-[10px] text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded font-mono border border-emerald-100 animate-pulse">LIVE STREAM</span>
                 </div>
              </div>

              {/* Chart 3: Q-Value Distribution Density */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                 <h4 className="text-sm font-bold text-slate-700 tracking-tight mb-4 flex items-center gap-2">
                    <Network className="w-4 h-4 text-violet-500" /> Active Q-Table Value Density
                 </h4>
                 <div className="h-[240px] w-full bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={qDensityData} margin={{ top: 10, right: 10, bottom: 20, left: -20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="range" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} angle={-30} textAnchor="end" />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                        <RechartsTooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                        <Bar dataKey="count" name="States Count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                      </ComposedChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="mt-4 flex justify-between mx-2">
                    <span className="text-[10px] text-slate-500 font-mono">Aggregated active nodes by value threshold</span>
                 </div>
              </div>

              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 shadow-inner flex flex-col gap-4">
                <h4 className="text-[13px] font-bold text-[#8B0000] uppercase tracking-widest font-mono border-b border-[#8B0000]/20 pb-2">The Bellman Equation</h4>
                <div className="bg-slate-900 text-slate-300 p-4 sm:p-5 rounded-xl font-mono text-xs sm:text-[13px] overflow-x-auto shadow-md border border-slate-800 flex ">
                  <div className="whitespace-nowrap">
                    <div className="text-emerald-400 font-bold mb-2 select-none opacity-80"># Temporal Difference Update Rule</div>
                    <div className="leading-loose bg-[#0b0d13] p-3 rounded-lg border border-slate-700 font-bold drop-shadow-md">
                       <span className="text-blue-300">Q</span>(<span className="text-amber-300">S</span>, <span className="text-violet-300">A</span>) ← <span className="text-blue-300">Q</span>(<span className="text-amber-300">S</span>, <span className="text-violet-300">A</span>) + <span className="text-rose-400">α</span> [ <span className="text-emerald-300">R</span> + <span className="text-rose-400">γ</span> × max<sub className="text-[9px] relative -bottom-1 ml-0.5 text-slate-400">a</sub> <span className="text-blue-300 ml-1">Q</span>(<span className="text-amber-300">S'</span>, <span className="text-violet-300">a</span>) - <span className="text-blue-300">Q</span>(<span className="text-amber-300">S</span>, <span className="text-violet-300">A</span>) ]
                    </div>
                  </div>
                </div>

                <h4 className="text-[13px] font-bold text-[#8B0000] uppercase tracking-widest font-mono border-b border-[#8B0000]/20 pb-2 mt-2">Q-Table Snapshot (Vector Array)</h4>
                <div className="grid grid-cols-7 gap-1 font-mono text-[9.5px] text-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm overflow-x-auto min-w-[300px]">
                  <div className="font-bold text-slate-500 pb-1.5 border-b border-slate-200">Idx</div>
                  <div className="font-bold text-slate-500 pb-1.5 border-b border-slate-200">N</div>
                  <div className="font-bold text-slate-500 pb-1.5 border-b border-slate-200">S</div>
                  <div className="font-bold text-slate-500 pb-1.5 border-b border-slate-200">E</div>
                  <div className="font-bold text-slate-500 pb-1.5 border-b border-slate-200">W</div>
                  <div className="font-bold text-slate-500 pb-1.5 border-b border-slate-200">Pick</div>
                  <div className="font-bold text-slate-500 pb-1.5 border-b border-slate-200">Drop</div>
                  
                  {['S[24]', 'S[25]', 'S[26]', 'S[27]'].map((state, i) => (
                     <React.Fragment key={state}>
                        <div className="py-1.5 mt-1 bg-slate-50 rounded text-slate-600 font-bold border border-slate-100">{state}</div>
                        <div className="py-1.5 mt-1 bg-rose-50 text-rose-700/80 rounded border border-rose-100">-1.5</div>
                        <div className="py-1.5 mt-1 bg-emerald-50 text-emerald-700 rounded font-bold border border-emerald-200 shadow-sm">{(4.2 + i * 2.1).toFixed(1)}</div>
                        <div className="py-1.5 mt-1 bg-slate-50 text-slate-500 rounded border border-slate-100">0.0</div>
                        <div className="py-1.5 mt-1 bg-rose-50 text-rose-700/80 rounded border border-rose-100">-2.1</div>
                        <div className="py-1.5 mt-1 bg-rose-50 text-rose-700/80 rounded border border-rose-100">-5.0</div>
                        <div className="py-1.5 mt-1 bg-rose-50 text-rose-700/80 rounded border border-rose-100">-5.0</div>
                     </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col gap-4">
                <h4 className="text-[13px] font-bold text-[#8B0000] uppercase tracking-widest font-mono border-b border-[#8B0000]/20 pb-2">Optimization Curve</h4>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockTrainingData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorDqn" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="episode" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <RechartsTooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                      <Area type="monotone" name="DQN" dataKey="dqn" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorDqn)" />
                      <Area type="monotone" name="Q-Learning" dataKey="qLearning" stroke="#f59e0b" strokeWidth={2} fill="none" />
                      <Area type="monotone" name="Random" dataKey="random" stroke="#f43f5e" strokeWidth={1} strokeDasharray="4 4" fill="none" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="flex flex-col gap-3 mt-4">
                   <div className="grid grid-cols-2 gap-4">
                     <div className="bg-violet-50 border border-violet-100 p-4 rounded-xl flex flex-col shadow-sm">
                        <span className="text-[10px] font-bold text-violet-500 uppercase font-mono mb-0.5">DQN Parameters</span>
                        <span className="text-xl font-black text-violet-900 tracking-tight">~3.2M</span>
                     </div>
                     <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex flex-col shadow-sm">
                        <span className="text-[10px] font-bold text-amber-600 uppercase font-mono mb-0.5">Q-Table Size</span>
                        <span className="text-xl font-black text-amber-900 tracking-tight">18,000</span>
                     </div>
                   </div>
                   
                   <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl flex flex-col shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-3 opacity-10">
                         <span className="text-6xl font-black">?</span>
                      </div>
                      <span className="text-[11px] font-bold text-indigo-800 uppercase font-mono mb-1 flex items-center gap-1">Fast Convergence Insight</span>
                      <p className="text-[12px] text-indigo-700/90 leading-relaxed max-w-[90%]">
                        Notice how Q-Learning achieves a 100% success rate quickly (~250 episodes)? Because this specific environment is geometrically restricted, the agent only actually needs to map around 18,000 discrete scenarios. The tabular array brute-force resolves this space extremely fast!
                      </p>
                   </div>
                 </div>
              </div>
              
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 shadow-inner flex flex-col gap-4 xl:col-span-2 mt-2">
                <h4 className="text-[13px] font-bold text-[#8B0000] uppercase tracking-widest font-mono border-b border-[#8B0000]/20 pb-2">Deep Q-Network (DQN) Loss Function</h4>
                <div className="bg-slate-900 text-slate-300 p-4 sm:p-5 rounded-xl font-mono text-xs sm:text-[13px] overflow-x-auto shadow-md border border-slate-800 flex ">
                   <div className="whitespace-nowrap">
                     <div className="text-emerald-400 font-bold mb-2 select-none opacity-80"># Mean Squared Error (MSE) against Target Network</div>
                     <div className="leading-loose bg-[#0b0d13] p-3 rounded-lg border border-slate-700 font-bold drop-shadow-md">
                        <span className="text-blue-300">L</span>(<span className="text-rose-400">θ</span>) = <span className="text-amber-300">E</span> [ ( <span className="text-emerald-300">R</span> + <span className="text-rose-400">γ</span> × max<sub className="text-[9px] relative -bottom-1 ml-0.5 text-slate-400">a'</sub> <span className="text-violet-300">Q</span>(<span className="text-amber-300">S'</span>, <span className="text-violet-300">a'</span> ; <span className="text-rose-400">θ⁻</span>) - <span className="text-blue-300">Q</span>(<span className="text-amber-300">S</span>, <span className="text-violet-300">A</span> ; <span className="text-rose-400">θ</span>) )<sup className="text-[10px] relative -top-1">2</sup> ]
                     </div>
                   </div>
                 </div>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                   <div className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col shadow-sm">
                      <span className="text-[10px] font-bold text-slate-600 uppercase font-mono mb-1">Epsilon-Greedy Exploration</span>
                      <div className="text-[11px] sm:text-xs text-slate-500 font-mono break-all sm:break-normal">ε ← max(ε_min, ε × decay)</div>
                   </div>
                   <div className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col shadow-sm">
                      <span className="text-[10px] font-bold text-slate-600 uppercase font-mono mb-1">Experience Replay Buffer</span>
                      <div className="text-[11px] sm:text-xs text-slate-500 font-mono break-all sm:break-normal">D = (S_t, A_t, R_t, S_t+1)</div>
                   </div>
                   <div className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col shadow-sm">
                      <span className="text-[10px] font-bold text-slate-600 uppercase font-mono mb-1">Target Network Sync</span>
                      <div className="text-[11px] sm:text-xs text-slate-500 font-mono break-all sm:break-normal">θ⁻ ← τθ + (1-τ)θ⁻</div>
                   </div>
                   <div className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col shadow-sm">
                      <span className="text-[10px] font-bold text-slate-600 uppercase font-mono mb-1">Advantage Function</span>
                      <div className="text-[11px] sm:text-xs text-slate-500 font-mono break-all sm:break-normal">A(s,a) = Q(s,a) - V(s)</div>
                   </div>
                 </div>
              </div>

              <div className="bg-slate-900 rounded-[1.5rem] border border-slate-800 p-6 shadow-xl flex flex-col gap-4 xl:col-span-2 mt-2 text-slate-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none transform translate-x-4 -translate-y-4">
                  <span className="text-[140px] font-mono leading-none">∫</span>
                </div>
                <div className="relative z-10">
                  <h4 className="text-[13px] font-bold text-emerald-400 uppercase tracking-widest font-mono border-b border-emerald-900/50 pb-2 mb-4">Neural Policy Gradients & Matrices</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-3">
                      <span className="text-[11px] font-bold text-slate-500 font-mono uppercase">Softmax Action Probability</span>
                      <div className="bg-black/50 p-4 rounded-xl border border-slate-800 font-mono text-[13px] shadow-inner">
                        <span className="text-emerald-300">π</span>(<span className="text-violet-300">a</span>|<span className="text-amber-300">s</span>) = <span className="text-slate-400">exp(</span> <span className="text-blue-300">Q</span>(<span className="text-amber-300">s</span>, <span className="text-violet-300">a</span>) / <span className="text-rose-400">τ</span> <span className="text-slate-400">)</span> / <span className="text-slate-400">Σ exp(</span> <span className="text-blue-300">Q</span>(<span className="text-amber-300">s</span>, <span className="text-violet-300">a'</span>) / <span className="text-rose-400">τ</span> <span className="text-slate-400">)</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      <span className="text-[11px] font-bold text-slate-500 font-mono uppercase">Weight Update Matrix (Backpropagation)</span>
                      <div className="bg-black/50 p-4 rounded-xl border border-slate-800 font-mono text-[11px] shadow-inner flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-[12px]">
                           <span className="text-rose-400 font-bold tracking-widest">ΔW</span>
                           <span className="text-slate-500">=</span>
                           <span className="text-emerald-300">-α</span>
                           <span className="text-slate-500">×</span>
                           <span className="text-blue-400">∇<sub className="text-[10px] text-blue-400/80">W</sub></span>
                           <span className="text-slate-300">L(W)</span>
                        </div>
                        <div className="flex justify-center mt-3 opacity-90 overflow-hidden">
                           <div className="flex items-center gap-2 font-mono text-[11px] sm:text-[13px]">
                              <span className="text-slate-400 font-bold">W</span>
                              <span className="text-slate-500">=</span>
                              <div className="flex text-emerald-300/90 relative px-2 sm:px-3">
                                 <div className="absolute left-0 top-0 bottom-0 border-l-[3px] border-t-[3px] border-b-[3px] border-slate-600 w-2.5 rounded-l-sm opacity-60"></div>
                                 <div className="absolute right-0 top-0 bottom-0 border-r-[3px] border-t-[3px] border-b-[3px] border-slate-600 w-2.5 rounded-r-sm opacity-60"></div>
                                 <table className="text-center mx-1 sm:mx-2 border-separate tracking-wider" style={{ borderSpacing: '14px 6px' }}>
                                    <tbody>
                                       <tr>
                                          <td>δ<sub className="text-[9px]">1</sub>x<sub className="text-[9px]">1</sub></td>
                                          <td>δ<sub className="text-[9px]">1</sub>x<sub className="text-[9px]">2</sub></td>
                                          <td>...</td>
                                       </tr>
                                       <tr>
                                          <td>δ<sub className="text-[9px]">2</sub>x<sub className="text-[9px]">1</sub></td>
                                          <td>δ<sub className="text-[9px]">2</sub>x<sub className="text-[9px]">2</sub></td>
                                          <td>...</td>
                                       </tr>
                                       <tr>
                                          <td>⋮</td>
                                          <td>⋮</td>
                                          <td>⋱</td>
                                       </tr>
                                    </tbody>
                                 </table>
                              </div>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getGridTheme = () => {
    switch (agentMode) {
      case 'Random': return { bg: 'bg-rose-50', border: 'border-rose-300' };
      case 'QLearning': return { bg: 'bg-amber-50', border: 'border-amber-300' };
      case 'DQN': return { bg: 'bg-violet-50', border: 'border-violet-300' };
      default: return { bg: 'bg-slate-50', border: 'border-slate-200' };
    }
  };
  const gridTheme = getGridTheme();
  
  const showSimulationGrids = [3, 4, 5].includes(activeSlide);

  return (
    <div className="w-full flex-col flex items-stretch gap-3 lg:gap-4 max-w-[1600px] mx-auto pb-4">

      {/* Primary Section Header containing Tabs and Help */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between bg-white rounded-[1.5rem] p-3 md:p-4 shadow-sm border border-slate-200/80 gap-4 shrink-0">
        <div className="flex flex-wrap items-center bg-slate-100 p-1.5 rounded-2xl self-stretch xl:self-auto gap-1">
          {SLIDES.map((slide) => (
            <button 
              key={slide.num}
              onClick={() => setActiveSlide(slide.num)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeSlide === slide.num ? 'bg-white shadow text-[#8B0000]' : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-800'}`}
            >
              {slide.title}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-end w-full xl:w-auto gap-4 shrink-0">
          <button 
            onClick={() => setShowHelp(!showHelp)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all shadow-sm ${showHelp ? 'bg-slate-800 text-white border-slate-900' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
            title="Overview Help"
          >
            {showHelp ? <X className="w-4 h-4" /> : <HelpCircle className="w-4 h-4" />}
            <span className="font-bold text-sm">System Analogy</span>
          </button>
        </div>
      </div>

      {/* Expanded Analogy / Help Block */}
      {showHelp && (
        <div className="bg-slate-800 border-none text-white text-sm rounded-[2rem] p-8 md:p-10 shadow-xl flex flex-col md:flex-row gap-8 items-start animate-in fade-in slide-in-from-top-4 duration-300 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none transform -rotate-12 translate-x-12 -translate-y-8">
             <HelpCircle className="w-64 h-64" />
           </div>
           <div className="space-y-4 max-w-4xl relative z-10">
              <span className="text-emerald-400 font-bold uppercase tracking-widest text-[11px] font-mono block">The Fundamental Mechanism</span>
              <h3 className="text-3xl font-bold tracking-tight text-white mb-3">Teaching a pet new tricks 🐕</h3>
              <p className="text-slate-300 leading-relaxed text-[15px] max-w-3xl">
                Reinforcement Learning works identically to standard pet training. When the dog successfully navigates to the passenger and drops them off at the target, you provide a dominant treat (+50pt Reward). If it wanders into congested traffic loops or hits walls, you provide a sharp penalty (-5pt).
                <br/><br/>
                By executing this simulation mechanically over thousands of concurrent iterations, the network maps specific states directly to highly advantageous reward sequences automatically—becoming faster and smarter over time.
              </p>
           </div>
        </div>
      )}

      {/* Active Tab Details Mount */}
      <div className="bg-white rounded-[1.5rem] border border-slate-200 p-5 sm:p-6 shadow-sm relative overflow-hidden shrink-0 mt-1">
         {renderSlideDetails()}
      </div>

      {/* Simulation Engine Grids */}
      {showSimulationGrids && (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 w-full items-stretch mt-1">
        
        {/* Massive Map Center Container (Interactive live visual surface) */}
        <div className="lg:col-span-8 bg-white rounded-[1.5rem] border border-slate-200 p-4 sm:p-5 shadow-sm flex flex-col overflow-hidden relative">
          
          <div className="flex flex-col md:flex-row lg:items-center justify-between mb-4 gap-4 z-10 w-full">
             <div className="flex flex-col shrink-0">
               <span className="text-lg font-black tracking-tight text-slate-800 mb-2">Live Navigation Grid</span>
               <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg w-max border border-slate-200">
                <div className="flex items-center gap-0.5 bg-white rounded shadow-sm border border-slate-200 px-1 py-0.5 text-slate-400">
                    <UniformArrow dir="up" />
                    <UniformArrow dir="down" />
                    <UniformArrow dir="left" />
                    <UniformArrow dir="right" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">To Move</span>
                  <div className="w-px h-3 bg-slate-300 mx-1"></div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono px-1.5 py-[2px] bg-white rounded shadow-sm border border-slate-200">P / D</span>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Pickup / Drop</span>
               </div>
             </div>

             <div className="flex flex-col xl:flex-row items-end xl:items-center justify-end gap-3 flex-1 w-full">
               {agentMode === 'QLearning' && (
                 <div className="flex items-center gap-3 bg-white border border-slate-200 p-2 rounded-xl shadow-sm shrink-0 relative overflow-hidden flex-1 max-w-[400px]">
                   <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                   <div className="flex flex-col gap-1 w-full ml-2">
                     <div className="flex items-center justify-between shrink-0">
                       <span className="text-[10px] items-center flex font-bold text-slate-500 uppercase tracking-widest font-mono cursor-help" title="Knowledge Base (Experience storage)">Knwl</span>
                       <span className="text-[10px] font-bold text-amber-700 font-mono bg-amber-100 border border-amber-200 px-1.5 rounded shadow-sm cursor-help" title="Episodes (Number of simulated iterations)">{trainedEpisodes} EP</span>
                     </div>
                     <input 
                       type="range" 
                       min="0" 
                       max="1500" 
                       step="50"
                       value={trainedEpisodes} 
                       onChange={(e) => setTrainedEpisodes(parseInt(e.target.value))} 
                       className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-600 shadow-inner"
                     />
                   </div>
                   <button 
                     onClick={() => runBatchTraining(100)} 
                     disabled={isTraining}
                     className="relative flex items-center gap-1.5 px-4 py-2 bg-gradient-to-b from-amber-400 to-amber-500 border border-amber-600 text-white text-[12px] font-black rounded-lg shadow-[0_2px_12px_-2px_rgba(245,158,11,0.6)] hover:from-amber-500 hover:to-amber-600 transition-all disabled:opacity-80 disabled:cursor-wait whitespace-nowrap justify-center min-w-[130px] shrink-0 overflow-hidden active:scale-95"
                   >
                     <div className="absolute inset-0 bg-white/20 w-full h-full transform translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-500"></div>
                     {isTraining ? (
                       <span className="flex items-center gap-2 relative z-10"><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Training...</span>
                     ) : (
                       <span className="flex items-center gap-1.5 relative z-10"><Zap className="w-3.5 h-3.5 fill-current" /> +100 Train Eps</span>
                     )}
                   </button>
                 </div>
               )}

               <div className="flex items-center gap-2 shrink-0">
                 <button onClick={triggerEnvReset} className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-600 text-[13px] font-bold rounded-xl hover:bg-slate-100 shadow-sm transition-colors shrink-0">
                   <RotateCcw className="w-4 h-4" /> Reset
                 </button>
                 <button 
                   onClick={() => setIsSimulating(!isSimulating)}
                   className={`flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-bold shadow-md transition-all min-w-[125px] ${
                     isSimulating ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200' : 'bg-slate-900 text-white hover:bg-black shadow-slate-900/30'
                   }`}
                 >
                   {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                   {isSimulating ? 'Interrupt' : 'Run Auto'}
                 </button>
               </div>
             </div>
          </div>

          <div className={`w-full flex-1 flex flex-col items-center justify-center ${gridTheme.bg} rounded-[1.5rem] shadow-inner p-4 sm:p-5 border ${gridTheme.border} gap-4`}>
             
             {/* Integrated Telemetry HUD Overlay (Moved to Flow Layout) */}
             <div className="flex items-center justify-between gap-4 w-full max-w-[560px] pointer-events-none relative z-10">
                <div className="bg-slate-900/95 backdrop-blur-xl text-white rounded-[1.5rem] border border-slate-700/80 p-5 shadow-2xl flex items-center gap-8">
                  <div className="flex flex-col items-center min-w-[50px]">
                    <span className="text-[11px] font-mono font-bold text-slate-400 tracking-widest mb-1.5 leading-none uppercase">STEPS</span>
                    <span className="text-3xl font-black font-mono leading-none tracking-tight">{stepCount}</span>
                  </div>
                  <div className="w-[2px] h-12 bg-slate-700"></div>
                  <div className="flex flex-col items-center min-w-[60px]">
                    <span className="text-[11px] font-mono font-bold text-slate-400 tracking-widest mb-1.5 leading-none uppercase">REWARD</span>
                    <span className={`text-3xl font-black font-mono leading-none tracking-tight ${cumulativeReward < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>{cumulativeReward}</span>
                  </div>
                </div>

                {/* Traffic Notice Overlay */}
                {trafficStatus && isSimulating && (
                  <div className="bg-rose-100/95 backdrop-blur border border-rose-300 text-rose-800 px-5 py-3 rounded-2xl text-sm font-bold shadow-[0_4px_15px_-3px_rgba(225,29,72,0.3)] animate-pulse flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></div> Intercepted Traffic... Lagging
                  </div>
                )}
             </div>

             <div className="w-full aspect-square max-w-[800px] m-auto">
                <div className="grid grid-cols-10 grid-rows-10 h-full w-full bg-transparent gap-0 rounded-2xl overflow-hidden shadow-sm">
                   {Array.from({ length: 10 }).map((_, rIdx) => (
                     Array.from({ length: 10 }).map((__, cIdx) => {
                       const wall = isWall(rIdx, cIdx);
                       const traffic = isTrafficZone(rIdx, cIdx);
                       const isTaxi = taxiPos.r === rIdx && taxiPos.c === cIdx;
                       
                       let lMark: Landmark | null = null;
                       Object.values(KL_LANDMARKS).forEach(l => {
                         if (l.r === rIdx && l.c === cIdx) lMark = l;
                       });
                       
                       const isPassenger = passPos !== 'In Taxi' && KL_LANDMARKS[passPos]?.r === rIdx && KL_LANDMARKS[passPos]?.c === cIdx;
                       const isDest = KL_LANDMARKS[destPos]?.r === rIdx && KL_LANDMARKS[destPos]?.c === cIdx;

                       let arrow = '';
                       const pIdx = landmarkKeys.indexOf(passPos === 'In Taxi' ? 'KLCC' : passPos);
                       const dIdx = landmarkKeys.indexOf(destPos);
                       const queryIdx = getStateIndex(rIdx, cIdx, passPos === 'In Taxi' ? 5 : pIdx, dIdx);
                       const stateValues = qTable[queryIdx];
                       if (agentMode === 'QLearning' && stateValues && Math.max(...stateValues) !== 0 && !wall && !lMark) {
                         const maxIdx = stateValues.indexOf(Math.max(...stateValues));
                         const icons = ['↑', '↓', '→', '←', 'Pick', 'Drop'];
                         arrow = icons[maxIdx];
                       }

                       return (
                         <div
                           key={`${rIdx}-${cIdx}`}
                           onClick={() => handleCellClick(rIdx, cIdx)}
                           className={`relative w-full h-full flex flex-col items-center justify-center transition-all duration-200 cursor-pointer border-r border-b border-slate-200/60 ${
                             wall ? 'bg-slate-300' 
                                  : traffic ? 'bg-rose-50/40 shadow-inner' : 'bg-white hover:bg-slate-50'
                           }`}
                         >
                           <span className="absolute top-1 left-1 flex items-center gap-[2px] text-[9px] sm:text-[10px] font-mono text-slate-400/80 font-medium select-none z-10">
                             {cIdx},{9 - rIdx}
                           </span>

                           {/* Animated Traffic Jam Overlay */}
                           {traffic && !lMark && !isTaxi && (
                              <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none z-0 overflow-hidden">
                                <div className="absolute inset-0 opacity-[0.15] bg-rose-50" style={{
                                   backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 6px, #f43f5e 6px, #f43f5e 12px)'
                                }}></div>
                                <span className="text-[9px] sm:text-[11px] text-rose-600 border border-rose-200/50 animate-pulse font-black uppercase tracking-widest leading-none drop-shadow-sm z-10 bg-white/80 px-1 py-[2px] rounded shadow-sm mb-1">JAM</span>
                                <div className="flex gap-1 mt-0.5 opacity-90 z-10 bg-white/90 px-1.5 py-0.5 rounded-full border border-rose-100 shadow-sm">
                                  <div className="w-[5px] h-[5px] sm:w-1.5 sm:h-1.5 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                  <div className="w-[5px] h-[5px] sm:w-1.5 sm:h-1.5 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                  <div className="w-[5px] h-[5px] sm:w-1.5 sm:h-1.5 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                              </div>
                           )}

                           {/* 3D Roadblock Obstacles */}
                           {wall && (
                             <div className="absolute inset-0 flex items-center justify-center p-1 sm:p-2 pointer-events-none">
                               <div className="w-full h-full bg-slate-600 rounded-sm border-t border-slate-500 border-b-2 border-b-slate-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] flex items-center justify-center overflow-hidden">
                                  <div className="w-[150%] h-3 sm:h-4 transform -rotate-45 flex shadow-md" style={{
                                     backgroundImage: 'repeating-linear-gradient(45deg, #eab308 0, #eab308 10px, #000 10px, #000 20px)'
                                  }}></div>
                               </div>
                             </div>
                           )}

                           {arrow && !isTaxi && !wall && <span className="text-amber-600/50 font-bold text-xs sm:text-xl select-none pointer-events-none drop-shadow-sm z-10">{arrow}</span>}

                           {/* Landmark Destination Area */}
                           {lMark && (
                             <div className={`absolute inset-0 flex items-center justify-center p-[2px] pointer-events-none opacity-80`}>
                                <div className={`w-full h-full rounded flex items-center justify-center flex-col ${lMark.bg} shadow-inner`}>
                                  <span className="text-2xl leading-none opacity-70 transform -translate-y-1">{lMark.icon}</span>
                                </div>
                             </div>
                           )}

                           {/* Target Pickups/Drops Points relative */}
                           {isPassenger && !isTaxi && (
                             <div className="absolute top-[2%] right-[2%] w-[55%] h-[55%] max-w-[36px] max-h-[36px] min-w-[20px] min-h-[20px] bg-emerald-500 rounded-full border-[2px] sm:border-[3px] border-white shadow-[0_4px_12px_-2px_rgba(16,185,129,0.9)] flex items-center justify-center z-30 animate-bounce">
                                <UserPlus className="w-[55%] h-[55%] text-white" />
                             </div>
                           )}
                           {isDest && !isTaxi && (
                             <div className="absolute top-[2%] right-[2%] w-[55%] h-[55%] max-w-[36px] max-h-[36px] min-w-[20px] min-h-[20px] bg-amber-300 rounded-full border-[2px] sm:border-[3px] border-amber-900 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.5)] z-30 animate-pulse flex items-center justify-center">
                                <span className="text-[clamp(10px,1.5vw,18px)] transform -translate-y-[1px] -translate-x-[1px]">🏁</span>
                             </div>
                           )}

                           {/* Polished Checker Cab Design */}
                           {isTaxi && (
                            <div className="relative z-30 w-[80%] h-[80%] bg-[#FFD700] rounded-sm shadow-2xl flex flex-col justify-between overflow-hidden transition-all duration-[400ms] pointer-events-none" 
                                 style={{ border: 'clamp(1px, 0.3vw, 2.5px) solid #B8860B' }}>
                                
                                {/* Yellow Taxi Headlight Bar */}
                                <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-[40%] h-[15%] bg-amber-100 border border-amber-600 rounded-b shadow-xl z-30 flex items-center justify-center">
                                   <div className="w-[60%] h-[50%] bg-yellow-500 rounded-full animate-pulse shadow-[0_0_8px_2px_rgba(234,179,8,0.8)]"></div>
                                </div>
                                
                                <div className="absolute top-0 w-full h-[15%] bg-yellow-300 opacity-60"></div>
                                
                                {/* Windows */}
                                <div className="w-[85%] h-[20%] bg-slate-900 rounded-b-[3px] mx-auto mt-[10%] opacity-90 border-b-[clamp(1px,0.2vw,2px)] border-white/20 shadow-inner"></div>
                                
                                <div className="flex-1 flex items-center justify-center z-10">
                                   <span className="text-[clamp(6px,1vw,12px)] font-black text-amber-950 font-mono tracking-widest leading-none bg-white/95 px-1 py-[2%] rounded-[2px] shadow-sm transform scale-x-90">TAXI</span>
                                </div>
                                
                                {/* Checkered Print strip */}
                                <div className="w-full h-[20%] opacity-90 border-t border-amber-600 bg-white" style={{
                                   backgroundImage: 'linear-gradient(45deg, #111 25%, transparent 25%, transparent 75%, #111 75%, #111), linear-gradient(45deg, #111 25%, transparent 25%, transparent 75%, #111 75%, #111)',
                                   backgroundSize: '4px 4px',
                                   backgroundPosition: '0 0, 2px 2px'
                                }}></div>
                                
                                {/* Passenger Loaded Status */}
                                {passPos === 'In Taxi' && (
                                  <div className="absolute -top-[10%] -right-[10%] bg-emerald-500 text-white rounded-full w-[45%] h-[45%] border-[1.5px] border-white flex items-center justify-center shadow-lg z-30">
                                    <Check className="w-[75%] h-[75%] font-bold" strokeWidth={4} />
                                  </div>
                                )}
                            </div>
                           )}
                         </div>
                       )
                     })
                   ))}
                </div>
             </div>
          </div>
        </div>

        {/* Action Logger / Details Right Column */}
        <div className="lg:col-span-4 flex flex-col gap-4">
           {/* Detailed Status Target */}
           <div className="bg-white rounded-[1.5rem] border border-slate-200 p-4 sm:p-5 shadow-sm">
             <div className="flex items-center justify-between mb-2 border-b border-slate-100 pb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-mono">Mission Target</span>
                <div className="px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] rounded flex items-center gap-1 font-bold uppercase tracking-wider">
                   {destPos} 🏁
                </div>
             </div>
             <p className="text-[13px] text-slate-500 leading-relaxed font-medium mb-3">
                Live simulated logging stream capturing isolated terminal output from the active agent's structural evaluations. All rewards and penalties are localized below.
             </p>
             <div className="flex items-center justify-between gap-2 mt-1">
               <span className="text-[13px] font-bold text-slate-700">Passenger Status:</span>
               {passPos === 'In Taxi' ? (
                 <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded">
                   <Check className="w-3 h-3" /> Embarked
                 </span>
               ) : (
                 <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded">
                   Waiting at {passPos}
                 </span>
               )}
             </div>
           </div>

           {/* Live Q-Value Experience Node Window (Only in QLearning mode) */}
           {agentMode === 'QLearning' && (() => {
             const pIdx = passPos === 'In Taxi' ? 5 : landmarkKeys.indexOf(passPos);
             const dIdx = landmarkKeys.indexOf(destPos);
             const currentStateIdx = (taxiPos.r * 10 + taxiPos.c) * 30 + (pIdx * 5 + dIdx);
             const currentQ = qTable[currentStateIdx] || [0,0,0,0,0,0];
             const maxQ = Math.max(...currentQ);
             const hasMemory = currentQ.some(v => v !== 0);

             return (
               <div className="bg-amber-50 rounded-[1.5rem] border border-amber-200 p-4 shadow-sm flex flex-col relative overflow-hidden shrink-0">
                 <div className="absolute top-0 right-0 p-3 opacity-20 pointer-events-none transform translate-x-3 -translate-y-2">
                    <span className="text-5xl font-mono">Q</span>
                 </div>
                 <span className="text-[11px] font-bold text-amber-700 uppercase tracking-widest font-mono flex items-center gap-1.5 border-b border-amber-200/60 pb-2 mb-3">
                    <History className="w-3.5 h-3.5" /> Agent State Vision
                 </span>
                 <div className="flex justify-between items-end border-b border-amber-200/60 pb-3 mb-3 relative z-10">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider font-mono">Sim Vector</span>
                      <span className="text-[12px] font-mono font-bold text-amber-900 bg-amber-200/50 px-2 py-0.5 rounded border border-amber-300 w-max">
                        S(R{taxiPos.r}, C{taxiPos.c})
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider font-mono">Memory Status</span>
                      {hasMemory ? (
                         <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-emerald-200 flex items-center gap-1"><Check className="w-3 h-3"/> Active</span>
                      ) : (
                         <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-rose-200 flex items-center gap-1"><X className="w-3 h-3"/> Random</span>
                      )}
                    </div>
                 </div>
                 <div className="grid grid-cols-3 gap-2 relative z-10">
                    {[
                      { act: 'North', val: currentQ[0] },
                      { act: 'South', val: currentQ[1] },
                      { act: 'East', val: currentQ[2] },
                      { act: 'West', val: currentQ[3] },
                      { act: 'Pick', val: currentQ[4] },
                      { act: 'Drop', val: currentQ[5] },
                    ].map((m, i) => {
                       const isBest = hasMemory && Math.abs(m.val - maxQ) < 0.001;
                       return (
                         <div key={i} className={`flex flex-col items-center p-1.5 rounded-lg border shadow-sm ${isBest ? 'bg-amber-400 border-amber-500 shadow-amber-500/20 text-amber-950 scale-[1.02] transform transition-transform' : 'bg-white border-amber-200 text-amber-800'}`}>
                            <span className="text-[9px] uppercase font-bold tracking-widest">{m.act}</span>
                            <span className="text-[11px] font-mono font-bold">{m.val.toFixed(1)}</span>
                         </div>
                       )
                    })}
                 </div>
               </div>
             );
           })()}

           {/* Logs Terminal Server Mount */}
           <div className="bg-[#1C1F26] rounded-[1.5rem] border-[4px] border-slate-800 shadow-xl flex-1 flex flex-col overflow-hidden text-slate-300 relative min-h-[250px] max-h-[400px]">
             {/* Terminal Header */}
             <div className="flex items-center gap-2.5 p-4 border-b border-slate-900 bg-[#14151A]">
               <div className="flex gap-1.5 ml-1">
                 <div className="w-3 h-3 rounded-full bg-rose-500 border border-rose-600"></div>
                 <div className="w-3 h-3 rounded-full bg-amber-500 border border-amber-600"></div>
                 <div className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-600"></div>
               </div>
               <span className="text-[10px] font-bold text-slate-600 ml-3 font-mono">root@engine-core:~# bash runtime_logger.sh</span>
             </div>
             
             {/* Log Activity */}
             <div className="p-5 flex-1 flex flex-col gap-2 overflow-y-auto font-mono text-[11px] font-medium leading-relaxed bg-[#1b1e25]">
               {logs.map((log, idx) => (
                 <div key={idx} className="pb-1">
                   <span className="text-emerald-500/80 mr-2 opacity-80">➜</span>
                   <span className={`${idx === 0 ? 'text-blue-200' : 'text-slate-400/90'}`}>{log}</span>
                 </div>
               ))}
               {!isSimulating && logs.length > 0 && (
                 <div className="text-slate-500 animate-pulse mt-1 opacity-70">_ waiting for process...</div>
               )}
             </div>
           </div>

        </div>
      </div>
      )}
    </div>
  );
}

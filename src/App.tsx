import React from 'react';
import { GraduationCap } from 'lucide-react';
import GymSimulation from './components/GymSimulation';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800" style={{ backgroundColor: '#f0f0ee' }}>
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1350px] mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[0.2rem] bg-[#FFD700] border-2 border-[#B8860B] flex flex-col justify-between overflow-hidden shrink-0 shadow-md transform rotate-2">
               <div className="w-[80%] h-1 bg-slate-900 mx-auto mt-0.5 opacity-90 border-b border-white/20"></div>
               <div className="w-full flex h-1.5 opacity-80 border-t border-amber-600 bg-white" style={{
                  backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)',
                  backgroundSize: '4px 4px',
                  backgroundPosition: '0 0, 2px 2px'
               }}></div>
            </div>
            <div className="space-y-0.5 animate-in fade-in slide-in-from-left-2 duration-500">
              <div className="flex items-center gap-2">
                <span className="bg-[#8B0000] text-white px-2 py-0.5 rounded font-bold text-[10px] tracking-widest font-mono uppercase shadow-sm">
                  UTM
                </span>
                <span className="text-[10px] font-bold font-mono text-[#8B0000]/80 uppercase tracking-widest flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  SECJ3563 Computational Intelligence
                </span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Autonomous Routing Engine
                <span className="text-slate-300 font-light hidden sm:inline">|</span>
                <span className="text-slate-500 font-medium text-xs hidden sm:inline">Eleven-Nine Group</span>
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main App */}
      <main className="flex-1 w-full max-w-[1350px] mx-auto p-4 sm:p-6 pb-20 space-y-6">
        <GymSimulation />
      </main>
      
      {/* Footer */}
      <footer className="bg-slate-100 border-t border-slate-200 py-6 text-slate-500 text-xs font-mono">
        <div className="max-w-[1350px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span>School of Computing</span>
            <span>•</span>
            <span className="font-semibold text-[#8B0000]">Universiti Teknologi Malaysia</span>
          </div>
          <div>
            <span>© 2026 Eleven-Nine Group. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

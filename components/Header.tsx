
import React from 'react';
import { Icons, COLORS } from '../constants';

const Header: React.FC = () => {
  return (
    <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
      <div className="flex items-center gap-4 group">
        <div className="p-3 bg-indigo-600 rounded-2xl group-hover:rotate-12 transition-transform shadow-lg shadow-indigo-500/20">
          <Icons.Brain />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            KHAYALNAWAZ AI
          </h1>
          <p className="text-slate-500 font-medium text-sm">CryptoVision AI Analysis Tool</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-full border border-slate-700">
          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
          <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Live Engine</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-full border border-slate-700">
          <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
          <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Gemini 3 Ready</span>
        </div>
      </div>
    </header>
  );
};

export default Header;

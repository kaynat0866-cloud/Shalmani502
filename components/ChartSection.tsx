
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart } from 'recharts';
import React, { useState } from 'react';
import { Icons, COLORS } from '../constants';
import { PriceData, TechnicalIndicators } from '../types';

interface ChartSectionProps {
  data: PriceData[];
  indicators: TechnicalIndicators | null;
  onFileUpload: (data: PriceData[]) => void;
  onSampleData: () => void;
  onImageUpload: (base64: string, mimeType: string) => void;
  mode: 'data' | 'visual';
  setMode: (mode: 'data' | 'visual') => void;
  imagePreview: string | null;
}

const ChartSection: React.FC<ChartSectionProps> = ({ 
  data, 
  indicators, 
  onFileUpload, 
  onSampleData, 
  onImageUpload,
  mode,
  setMode,
  imagePreview
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    const reader = new FileReader();
    reader.onload = (event) => onImageUpload(event.target?.result as string, file.type);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="glass-card rounded-3xl p-6 h-full flex flex-col border-white/5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600/20 rounded-2xl text-indigo-400 ring-1 ring-indigo-500/30">
            {mode === 'data' ? <Icons.Activity /> : <Icons.Image />}
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight">Market Visualization</h3>
            <div className="flex gap-1.5 mt-2 p-1 bg-slate-900/80 rounded-xl border border-white/5 w-fit">
              <button 
                onClick={() => setMode('data')}
                className={`text-[10px] font-black px-3 py-1.5 rounded-lg transition-all ${mode === 'data' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}
              >
                DATA MATRIX
              </button>
              <button 
                onClick={() => setMode('visual')}
                className={`text-[10px] font-black px-3 py-1.5 rounded-lg transition-all ${mode === 'visual' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}
              >
                IMAGE SCANNER
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          {mode === 'data' ? (
            <label className="group relative px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-bold transition-all cursor-pointer overflow-hidden">
              <span className="flex items-center gap-2"><Icons.CloudUpload /> Upload CSV</span>
              <input type="file" className="hidden" accept=".csv" onChange={() => {}} />
            </label>
          ) : (
            <label className="group relative px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-lg shadow-indigo-500/20">
              <span className="flex items-center gap-2 text-white"><Icons.Image /> Scan Chart Image</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-[450px] bg-slate-900/60 rounded-[2rem] border border-white/5 overflow-hidden relative group">
        {mode === 'data' ? (
          data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data.map((d, i) => ({...d, ma50: indicators && i >= 50 ? indicators.ma50 : null}))} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.4}/>
                    <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="date" stroke="#475569" tick={{ fontSize: 10, fontWeight: 700 }} tickFormatter={(s) => s.slice(5)} />
                <YAxis stroke="#475569" tick={{ fontSize: 10, fontWeight: 700 }} domain={['auto', 'auto']} tickFormatter={(v) => `$${v.toLocaleString()}`} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="close" stroke={COLORS.primary} fillOpacity={1} fill="url(#colorPrice)" strokeWidth={3} />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-600">
                <Icons.Activity />
              </div>
              <h4 className="text-xl font-bold text-slate-300 mb-2">No Market Data</h4>
              <p className="text-slate-500 text-sm max-w-xs">Upload a CSV containing Date and Price columns to begin deep trend analysis.</p>
              <button onClick={onSampleData} className="mt-8 px-6 py-2 text-xs font-black bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all">LOAD SAMPLE BITCOIN DATA</button>
            </div>
          )
        ) : (
          imagePreview ? (
            <div className="h-full w-full flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_#1e293b_0%,_#0f172a_100%)]">
              <div className="relative group/img">
                <img src={imagePreview} alt="Chart Preview" className="max-h-[400px] rounded-2xl shadow-2xl ring-1 ring-white/10 object-contain" />
                <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover/img:opacity-100 transition-opacity rounded-2xl pointer-events-none"></div>
              </div>
            </div>
          ) : (
            <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.02] transition-colors p-12 text-center">
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              <div className="w-20 h-20 bg-indigo-600/10 border border-indigo-500/20 rounded-3xl flex items-center justify-center mb-6 text-indigo-500 group-hover:scale-110 transition-transform">
                <Icons.Image />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Visual AI Scanner</h4>
              <p className="text-slate-500 text-sm max-w-xs">Upload a screenshot from TradingView or MetaTrader. Our AI will scan for patterns and give you a trade signal.</p>
              <div className="mt-8 px-8 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black shadow-xl shadow-indigo-500/30">SELECT IMAGE FILE</div>
            </label>
          )
        )}
      </div>

      <div className="mt-6 flex justify-between items-center text-[10px] font-black text-slate-600 tracking-widest uppercase">
        <div className="flex gap-4">
          <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> SYSTEM ONLINE</span>
          <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div> ENCRYPTION ACTIVE</span>
        </div>
        <span>BITCOIN ANALYTICS HUB</span>
      </div>
    </div>
  );
};

export default ChartSection;

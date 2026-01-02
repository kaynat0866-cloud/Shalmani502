
import React, { useState } from 'react';
import { Icons, COLORS } from '../constants';
import { TechnicalIndicators, AIAnalysisResult } from '../types';

interface SignalSectionProps {
  indicators: TechnicalIndicators | null;
  aiAnalysis: AIAnalysisResult | null;
  isAnalyzing: boolean;
  onRunAI: () => void;
}

const SignalSection: React.FC<SignalSectionProps> = ({ indicators, aiAnalysis, isAnalyzing, onRunAI }) => {
  const [isCopied, setIsCopied] = useState(false);

  const getSignalColors = (rec: string) => {
    switch (rec) {
      case 'BUY': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]';
      case 'SELL': return 'bg-rose-500/10 text-rose-400 border-rose-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]';
      default: return 'bg-amber-500/10 text-amber-400 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.2)]';
    }
  };

  const handleCopySignal = async () => {
    if (!aiAnalysis) return;

    const signalText = `🚀 KHAYALNAWAZ AI - CryptoVision 🚀
--------------------------------
Signal: ${aiAnalysis.recommendation}
Confidence: ${aiAnalysis.confidence}%
--------------------------------
Entry: ${aiAnalysis.entryPrice || 'Market Price'}
Target: ${aiAnalysis.targetPrice || 'N/A'}
Stop Loss: ${aiAnalysis.stopLoss || 'N/A'}
--------------------------------
Reasoning: ${aiAnalysis.summary}
Patterns: ${aiAnalysis.patternsDetected?.join(', ') || 'None detected'}`;

    try {
      await navigator.clipboard.writeText(signalText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-3xl p-6 relative overflow-hidden border-indigo-500/20">
        {isAnalyzing && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md z-20 flex flex-col items-center justify-center p-8 text-center">
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-indigo-400">
                <Icons.Brain />
              </div>
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Quant Brain Active</h4>
            <p className="text-slate-400 text-sm animate-pulse">Scanning chart patterns and calculating risk-to-reward ratios...</p>
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/40">
              <Icons.Brain />
            </div>
            <h3 className="text-xl font-bold tracking-tight">AI Master Signal</h3>
          </div>
          <button 
            onClick={onRunAI}
            disabled={isAnalyzing}
            className="group relative px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-bold transition-all overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Icons.Activity /> Analyze
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </button>
        </div>

        {aiAnalysis ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Main Badge */}
            <div className={`relative py-8 rounded-3xl border-2 flex flex-col items-center justify-center text-center transition-all ${getSignalColors(aiAnalysis.recommendation)}`}>
              <button 
                onClick={handleCopySignal}
                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-lg transition-colors border border-white/5 flex items-center gap-2"
                title="Copy Signal"
              >
                {isCopied ? (
                  <>
                    <span className="text-[10px] font-bold text-emerald-400">COPIED!</span>
                    <Icons.Check />
                  </>
                ) : (
                  <>
                    <span className="text-[10px] font-bold opacity-60">COPY</span>
                    <Icons.Copy />
                  </>
                )}
              </button>
              
              <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-80">Execution Order</span>
              <span className="text-6xl font-black mb-3 tracking-tighter drop-shadow-sm">{aiAnalysis.recommendation}</span>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold bg-black/30 px-3 py-1 rounded-full border border-white/10">
                  {aiAnalysis.confidence}% Confidence
                </span>
              </div>
            </div>

            {/* Trade Setup */}
            {(aiAnalysis.entryPrice || aiAnalysis.targetPrice) && (
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-blue-500/5 border border-blue-500/20 p-3 rounded-2xl text-center">
                  <span className="text-[9px] font-black text-blue-400 uppercase block mb-1">Entry</span>
                  <span className="text-sm font-black text-white truncate px-1">{aiAnalysis.entryPrice || 'Market'}</span>
                </div>
                <div className="bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-2xl text-center">
                  <span className="text-[9px] font-black text-emerald-400 uppercase block mb-1">Target</span>
                  <span className="text-sm font-black text-white truncate px-1">{aiAnalysis.targetPrice || '--'}</span>
                </div>
                <div className="bg-rose-500/5 border border-rose-500/20 p-3 rounded-2xl text-center">
                  <span className="text-[9px] font-black text-rose-400 uppercase block mb-1">Stop Loss</span>
                  <span className="text-sm font-black text-white truncate px-1">{aiAnalysis.stopLoss || '--'}</span>
                </div>
              </div>
            )}

            {/* Reasoning & Patterns */}
            <div className="space-y-4">
              <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">Technical Reasoning</h4>
                <p className="text-xs text-slate-300 leading-relaxed italic">"{aiAnalysis.reasoning}"</p>
                
                {aiAnalysis.patternsDetected && aiAnalysis.patternsDetected.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {aiAnalysis.patternsDetected.map((p, i) => (
                      <span key={i} className="text-[10px] font-bold bg-indigo-500/10 text-indigo-300 px-2 py-1 rounded-lg border border-indigo-500/20">
                        #{p}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500 bg-slate-900/40 rounded-3xl border border-dashed border-slate-800">
            <div className="w-16 h-16 text-slate-800 mb-4 animate-bounce">
              <Icons.Activity />
            </div>
            <p className="text-sm font-semibold text-center px-10 leading-relaxed">
              Upload your chart data or image, then hit <span className="text-indigo-400">Analyze</span> to generate a high-precision trading signal.
            </p>
          </div>
        )}
      </div>
      
      {/* Mini Indicators */}
      <div className="glass-card rounded-3xl p-6 border-white/5">
        <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Core Telemetry</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-800/40 rounded-2xl border border-white/5">
            <span className="text-[10px] font-bold text-slate-500 block mb-1">RSI (14)</span>
            <span className="text-xl font-black text-white">{indicators ? indicators.rsi.toFixed(1) : '--'}</span>
          </div>
          <div className="p-4 bg-slate-800/40 rounded-2xl border border-white/5">
            <span className="text-[10px] font-bold text-slate-500 block mb-1">VOLATILITY</span>
            <span className="text-xl font-black text-white">NORMAL</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignalSection;

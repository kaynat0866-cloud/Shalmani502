
import React, { useState, useMemo } from 'react';
import { PriceData, AIAnalysisResult } from './types';
import { getIndicators } from './utils/indicators';
import { getAIAnalysis, getAIImageAnalysis } from './services/geminiService';
import Header from './components/Header';
import RealTimeTicker from './components/RealTimeTicker';
import ChartSection from './components/ChartSection';
import SignalSection from './components/SignalSection';

const App: React.FC = () => {
  const [data, setData] = useState<PriceData[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [analysisMode, setAnalysisMode] = useState<'data' | 'visual'>('data');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');

  const indicators = useMemo(() => {
    if (data.length === 0) return null;
    return getIndicators(data);
  }, [data]);

  const handleFileUpload = (parsedData: PriceData[]) => {
    setData(parsedData);
    setAnalysisMode('data');
    setAiAnalysis(null);
  };

  const handleImageUpload = (base64: string, type: string) => {
    setImagePreview(base64);
    setMimeType(type);
    setAnalysisMode('visual');
    setAiAnalysis(null);
  };

  const handleSampleData = () => {
    const sample: PriceData[] = [];
    let price = 62000;
    const now = new Date();
    for (let i = 100; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const volatility = (Math.random() - 0.5) * 1500;
      price += volatility;
      sample.push({
        date: date.toISOString().split('T')[0],
        open: price - (Math.random() * 500),
        high: price + (Math.random() * 800),
        low: price - (Math.random() * 800),
        close: price,
        volume: 20000 + Math.random() * 10000
      });
    }
    setData(sample);
    setImagePreview(null);
    setAnalysisMode('data');
    setAiAnalysis(null);
  };

  const handleRunAI = async () => {
    if (analysisMode === 'data' && (!indicators || data.length === 0)) return;
    if (analysisMode === 'visual' && !imagePreview) return;

    setIsAnalyzing(true);
    try {
      let result;
      if (analysisMode === 'data' && indicators) {
        result = await getAIAnalysis(data, indicators);
      } else if (analysisMode === 'visual' && imagePreview) {
        result = await getAIImageAnalysis(imagePreview, mimeType);
      }
      if (result) setAiAnalysis(result);
    } catch (err) {
      console.error(err);
      alert("AI analysis failed. Please ensure your API key is configured correctly.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Header />
      
      <main>
        <RealTimeTicker />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ChartSection 
              data={data} 
              indicators={indicators} 
              onFileUpload={handleFileUpload} 
              onSampleData={handleSampleData}
              onImageUpload={handleImageUpload}
              mode={analysisMode}
              setMode={setAnalysisMode}
              imagePreview={imagePreview}
            />
          </div>
          <div className="lg:col-span-1">
            <SignalSection 
              indicators={indicators} 
              aiAnalysis={aiAnalysis} 
              isAnalyzing={isAnalyzing} 
              onRunAI={handleRunAI} 
            />
          </div>
        </div>
      </main>

      <footer className="mt-12 pt-8 border-t border-slate-800/50 text-center text-slate-500 text-xs">
        <p className="font-bold tracking-widest text-slate-400">KHAYALNAWAZ AI &copy; 2024</p>
        <p className="mt-2 text-slate-600">
          Disclaimer: This AI-generated analysis is for informational purposes only. Trading cryptocurrencies involves significant risk.
        </p>
      </footer>
    </div>
  );
};

export default App;

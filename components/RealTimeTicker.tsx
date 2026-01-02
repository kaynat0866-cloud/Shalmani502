
import React, { useState, useEffect } from 'react';
import { Icons, COLORS } from '../constants';

const RealTimeTicker: React.FC = () => {
  const [price, setPrice] = useState(68423.15);
  const [change, setChange] = useState(2.34);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrice(prev => prev + (Math.random() - 0.5) * 50);
      setChange(prev => prev + (Math.random() - 0.5) * 0.1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const isPositive = change >= 0;

  return (
    <div className="glass-card rounded-2xl p-6 mb-8 border-l-4 border-orange-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-500/20 rounded-xl text-orange-500">
            <Icons.Bitcoin />
          </div>
          <div>
            <h2 className="text-xl font-bold">Bitcoin (BTC) Real-Time</h2>
            <p className={`text-sm font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isPositive ? '+' : ''}{change.toFixed(2)}% (24h)
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-3xl md:text-4xl font-black text-orange-500 tracking-tight">
            ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {[
          { label: '24H High', value: `$${(price + 800).toLocaleString()}` },
          { label: '24H Low', value: `$${(price - 1200).toLocaleString()}` },
          { label: 'Volume', value: '32.4B' },
          { label: 'Market Cap', value: '$1.34T' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-slate-800/50 p-3 rounded-xl">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{stat.label}</p>
            <p className="text-lg font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RealTimeTicker;

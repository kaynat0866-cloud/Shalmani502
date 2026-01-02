
import { PriceData, TechnicalIndicators } from '../types';

export const calculateSMA = (prices: number[], period: number): number => {
  if (prices.length < period) return prices[prices.length - 1] || 0;
  const sum = prices.slice(-period).reduce((acc, p) => acc + p, 0);
  return sum / period;
};

export const calculateEMA = (prices: number[], period: number): number => {
  if (prices.length === 0) return 0;
  const k = 2 / (period + 1);
  let ema = prices[0];
  for (let i = 1; i < prices.length; i++) {
    ema = prices[i] * k + ema * (1 - k);
  }
  return ema;
};

export const calculateRSI = (prices: number[], period: number = 14): number => {
  if (prices.length < period + 1) return 50;
  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff > 0) gains += diff;
    else losses -= diff;
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  for (let i = period + 1; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    avgGain = (avgGain * (period - 1) + (diff > 0 ? diff : 0)) / period;
    avgLoss = (avgLoss * (period - 1) + (diff < 0 ? -diff : 0)) / period;
  }

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
};

export const calculateMACD = (prices: number[]) => {
  const ema12 = calculateEMA(prices, 12);
  const ema26 = calculateEMA(prices, 26);
  const macd = ema12 - ema26;
  const signal = calculateEMA([macd], 9);
  return { macd, signal, histogram: macd - signal };
};

export const calculateBollingerBands = (prices: number[], period: number = 20, stdDev: number = 2) => {
  if (prices.length < period) return { upper: 0, middle: 0, lower: 0 };
  const recent = prices.slice(-period);
  const middle = recent.reduce((a, b) => a + b, 0) / period;
  const variance = recent.reduce((a, b) => a + Math.pow(b - middle, 2), 0) / period;
  const sd = Math.sqrt(variance);
  return {
    upper: middle + stdDev * sd,
    middle,
    lower: middle - stdDev * sd
  };
};

export const getIndicators = (data: PriceData[]): TechnicalIndicators => {
  const closes = data.map(d => d.close);
  return {
    rsi: calculateRSI(closes),
    macd: calculateMACD(closes),
    bollingerBands: calculateBollingerBands(closes),
    ma50: calculateSMA(closes, 50),
    ma200: calculateSMA(closes, 200)
  };
};

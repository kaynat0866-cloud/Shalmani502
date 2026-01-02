
import { GoogleGenAI, Type } from "@google/genai";
import { PriceData, TechnicalIndicators, AIAnalysisResult } from '../types';

const MODEL_NAME = "gemini-3-flash-preview";

export const getAIAnalysis = async (data: PriceData[], indicators: TechnicalIndicators): Promise<AIAnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const lastPrice = data[data.length - 1];
  const prompt = `
    As a Senior Crypto Quantitative Analyst, analyze the provided CSV data for Bitcoin (BTC).
    
    Current Price: $${lastPrice.close.toFixed(2)}
    RSI: ${indicators.rsi.toFixed(2)}
    MACD: ${indicators.macd.macd.toFixed(2)}
    
    Task:
    1. Evaluate trend strength.
    2. Provide a clear BUY, SELL, or HOLD signal.
    3. Specify exact Entry, Take Profit (Target), and Stop Loss levels based on MA50/MA200 and support/resistance.
    4. List any technical patterns found in the data trend.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        temperature: 0.2,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendation: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            reasoning: { type: Type.STRING },
            supportLevels: { type: Type.ARRAY, items: { type: Type.STRING } },
            resistanceLevels: { type: Type.ARRAY, items: { type: Type.STRING } },
            entryPrice: { type: Type.STRING },
            targetPrice: { type: Type.STRING },
            stopLoss: { type: Type.STRING },
            patternsDetected: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["recommendation", "confidence", "summary", "reasoning", "supportLevels", "resistanceLevels"],
        },
      },
    });

    return JSON.parse(response.text || "{}") as AIAnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to generate AI analysis.");
  }
};

export const getAIImageAnalysis = async (base64Image: string, mimeType: string): Promise<AIAnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  const prompt = `
    Analyze this professional trading chart image.
    1. Identify candlestick patterns (e.g., Engulfing, Morning Star, Pin Bars).
    2. Analyze trendlines and chart structures (e.g., Wedges, Channels, H&S).
    3. Look for indicator divergences if visible.
    4. Provide a high-precision trade setup: BUY/SELL/HOLD with specific Entry, Target, and Stop Loss prices as seen on the Y-axis.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [
        {
          inlineData: {
            data: base64Image.split(',')[1] || base64Image,
            mimeType: mimeType,
          },
        },
        { text: prompt },
      ],
      config: {
        temperature: 0.3,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendation: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            reasoning: { type: Type.STRING },
            supportLevels: { type: Type.ARRAY, items: { type: Type.STRING } },
            resistanceLevels: { type: Type.ARRAY, items: { type: Type.STRING } },
            entryPrice: { type: Type.STRING },
            targetPrice: { type: Type.STRING },
            stopLoss: { type: Type.STRING },
            patternsDetected: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["recommendation", "confidence", "summary", "reasoning", "supportLevels", "resistanceLevels"],
        },
      },
    });

    return JSON.parse(response.text || "{}") as AIAnalysisResult;
  } catch (error) {
    console.error("Gemini Image Analysis Error:", error);
    throw new Error("Failed to generate AI visual analysis.");
  }
};

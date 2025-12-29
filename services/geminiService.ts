
import { GoogleGenAI, Type } from "@google/genai";
import { SecurityReport, RiskLevel } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeLink = async (url: string): Promise<SecurityReport> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the following URL for potential fraud, phishing, or security risks. 
    URL: ${url}
    
    Check for:
    1. Phishing patterns (typosquatting, lookalike domains).
    2. Known malicious TLDs.
    3. Shortened URL obfuscation.
    4. Suspicious subdomains.
    
    If it's a shortened URL (like bit.ly, t.co), infer what the destination might be if possible or explain why it's used.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isSafe: { type: Type.BOOLEAN },
          riskLevel: { 
            type: Type.STRING, 
            description: "Risk level: SAFE, LOW, MEDIUM, HIGH, CRITICAL" 
          },
          originalUrl: { type: Type.STRING, description: "The probable destination if it's a shortlink" },
          detectedThreats: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          },
          recommendations: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          },
          explanation: { type: Type.STRING }
        },
        required: ["isSafe", "riskLevel", "detectedThreats", "recommendations", "explanation"]
      }
    }
  });

  return JSON.parse(response.text.trim()) as SecurityReport;
};

export const getFestiveSecurityTips = async (): Promise<string[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: "Provide 5 creative and concise cybersecurity tips specifically for the New Year holiday season, focusing on avoiding delivery scams, fake giveaway links, and secure digital transactions. Return as a JSON array of strings.",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });

  return JSON.parse(response.text.trim());
};

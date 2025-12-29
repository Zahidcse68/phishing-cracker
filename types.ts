
export enum RiskLevel {
  SAFE = 'SAFE',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface SecurityReport {
  isSafe: boolean;
  riskLevel: RiskLevel;
  originalUrl?: string;
  detectedThreats: string[];
  recommendations: string[];
  explanation: string;
}

export interface QRScanResult {
  content: string;
  report?: SecurityReport;
  error?: string;
}

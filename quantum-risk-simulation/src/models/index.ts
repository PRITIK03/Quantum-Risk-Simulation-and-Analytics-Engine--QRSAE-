// Centralized TypeScript models for the app
export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  imageUrl?: string;
}

export interface AIResponse {
  status: 'ok' | 'error';
  text?: string;
  imageUrl?: string;
  message?: string;
  data?: any;
}

export interface BankingSystem {
  id: string;
  name: string;
  type: 'payment' | 'database' | 'api' | 'core';
  encryptionType: 'RSA-2048' | 'AES-256' | 'SHA-256' | 'PQC-Ready';
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  migrationCost: number;
  migrationTime: number;
  isMigrated: boolean;
  isScanned: boolean;
}

export interface Vendor {
  id: string;
  name: string;
  logo: string;
  costMultiplier: number;
  speedMultiplier: number;
  description: string;
}

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
  timestamp: Date;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  reward: string;
  requiredDay: number;
  isCompleted: boolean;
  type: 'scan' | 'vendor' | 'migrate' | 'budget';
  target?: number;
}

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  isUnlocked: boolean;
}

export interface GameState {
  day: number;
  budget: number;
  maxBudget: number;
  uptime: number;
  migrationProgress: number;
  systems: BankingSystem[];
  selectedVendor: Vendor | null;
  notifications: Notification[];
  qDayCountdown: number;
  totalSystemsMigrated: number;
  isScanning: boolean;
  scanningProgress: number;
  score: number;
  events: any[];
  missions: Mission[];
  achievements: Achievement[];
}

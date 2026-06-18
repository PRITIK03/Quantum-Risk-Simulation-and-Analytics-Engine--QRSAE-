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
  data?: unknown;
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

export interface TimelineEvent {
  id: string;
  day: number;
  type: 'start' | 'scan' | 'migrate' | 'vendor' | 'alert';
  title: string;
  value?: string;
  timestamp?: Date;
}

export interface ScenarioOption {
  id: string;
  label: string;
  scenario: string;
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
  events: TimelineEvent[];
  missions: Mission[];
  achievements: Achievement[];
}

export const vendors: Vendor[] = [
    { id: 'cloudFirst', name: 'CloudFirst Solutions', logo: '☁️', costMultiplier: 1.3, speedMultiplier: 0.7, description: 'Premium cloud-native PQC. Fast but expensive.' },
    { id: 'quantumShield', name: 'QuantumShield Inc', logo: '🛡️', costMultiplier: 1.0, speedMultiplier: 1.0, description: 'Balanced approach. Industry standard rates.' },
    { id: 'quickPay', name: 'QuickPay Networks', logo: '⚡', costMultiplier: 0.8, speedMultiplier: 1.4, description: 'Budget-friendly but slower deployment.' },
];

export const initialSystems: BankingSystem[] = [
    { id: '1', name: 'Core Payment Gateway', type: 'payment', encryptionType: 'RSA-2048', riskLevel: 'critical', migrationCost: 15000000, migrationTime: 3, isMigrated: false, isScanned: false },
    { id: '2', name: 'Customer Database', type: 'database', encryptionType: 'RSA-2048', riskLevel: 'critical', migrationCost: 12000000, migrationTime: 2, isMigrated: false, isScanned: false },
    { id: '3', name: 'Mobile Banking API', type: 'api', encryptionType: 'SHA-256', riskLevel: 'high', migrationCost: 8000000, migrationTime: 2, isMigrated: false, isScanned: false },
    { id: '4', name: 'ATM Network Interface', type: 'core', encryptionType: 'RSA-2048', riskLevel: 'critical', migrationCost: 20000000, migrationTime: 4, isMigrated: false, isScanned: false },
    { id: '5', name: 'Internal Auth System', type: 'api', encryptionType: 'AES-256', riskLevel: 'medium', migrationCost: 5000000, migrationTime: 1, isMigrated: false, isScanned: false },
    { id: '6', name: 'Trading Platform', type: 'core', encryptionType: 'RSA-2048', riskLevel: 'critical', migrationCost: 25000000, migrationTime: 5, isMigrated: false, isScanned: false },
    { id: '7', name: 'Loan Processing Engine', type: 'database', encryptionType: 'RSA-2048', riskLevel: 'high', migrationCost: 10000000, migrationTime: 2, isMigrated: false, isScanned: false },
    { id: '8', name: 'Fraud Detection AI', type: 'api', encryptionType: 'AES-256', riskLevel: 'medium', migrationCost: 6000000, migrationTime: 1, isMigrated: false, isScanned: false },
];

export const initialMissions: Mission[] = [
    { id: 'm1', title: 'First Scan', description: 'Run your first network vulnerability scan', reward: '+500 pts', requiredDay: 1, isCompleted: false, type: 'scan' },
    { id: 'm2', title: 'Partner Up', description: 'Select a PQC vendor partner', reward: '+300 pts', requiredDay: 1, isCompleted: false, type: 'vendor' },
    { id: 'm3', title: 'First Migration', description: 'Migrate your first system to PQC', reward: '+1000 pts', requiredDay: 1, isCompleted: false, type: 'migrate' },
    { id: 'm4', title: 'Critical Secured', description: 'Secure all critical systems', reward: '+2500 pts', requiredDay: 3, isCompleted: false, type: 'migrate', target: 4 },
    { id: 'm5', title: 'Budget Master', description: 'Complete with at least 20% budget remaining', reward: '+1500 pts', requiredDay: 5, isCompleted: false, type: 'budget' },
    { id: 'm6', title: 'Full Coverage', description: 'Migrate all 8 systems', reward: '+5000 pts', requiredDay: 10, isCompleted: false, type: 'migrate', target: 8 },
];

export const initialAchievements: Achievement[] = [
    { id: 'a1', title: 'First Steps', icon: 'star', isUnlocked: false },
    { id: 'a2', title: 'Security Expert', icon: 'shield', isUnlocked: false },
    { id: 'a3', title: 'Speed Demon', icon: 'zap', isUnlocked: false },
    { id: 'a4', title: 'Time Manager', icon: 'clock', isUnlocked: false },
    { id: 'a5', title: 'Master Analyst', icon: 'award', isUnlocked: false },
];

export const predefinedScenarios: ScenarioOption[] = [
    { id: 'qday', label: '⚡ Q-Day Happens Today', scenario: 'Q-Day arrives and quantum computers can break current encryption instantly' },
    { id: 'budget', label: '💰 Budget Runs Out', scenario: 'Budget is completely depleted before migration is complete' },
    { id: 'breach', label: '🔓 Critical System Breach', scenario: 'A critical vulnerable system experiences a quantum-enabled security breach' },
    { id: 'audit', label: '📋 Compliance Audit', scenario: 'Unexpected regulatory compliance audit happens today with current security posture' },
];

import { postJSON } from './client';
import { logger } from '../utils/logger';
import { handleApiError, sanitizePrompt } from '../utils/errorHandler';
import type { AIResponse } from '../models';

const API_KEY = import.meta.env.VITE_PICO_API_KEY ?? '';
const LLM_API_URL = import.meta.env.VITE_LLM_API_URL ?? '';
const IMAGE_API_URL = import.meta.env.VITE_IMAGE_API_URL ?? '';

function isConfigured() {
  if (!API_KEY || !LLM_API_URL) {
    logger.warn('AI backend not configured. Set VITE_PICO_API_KEY and VITE_LLM_API_URL.');
    return false;
  }
  return true;
}

async function callEndpoint(endpoint: string, prompt: string): Promise<AIResponse> {
  if (!isConfigured()) return { status: 'error', text: 'AI service not configured.' };

  const safePrompt = sanitizePrompt(prompt);

  const url = endpoint.includes('?') ? `${endpoint}&pk=${encodeURIComponent(API_KEY)}` : `${endpoint}?pk=${encodeURIComponent(API_KEY)}`;

  try {
    const data = await postJSON(url, { prompt: safePrompt }, { timeout: 15000 });

    if (!data) return { status: 'error', text: 'Empty response from AI service.' };

    // Backend may return different shapes; normalize
    const text = (data.text ?? data.result ?? data.output ?? '') as string;
    const imageUrl = (data.imageUrl ?? data.image ?? '') as string;

    return { status: 'ok', text: text || undefined, imageUrl: imageUrl || undefined, data };
  } catch (err) {
    return handleApiError(err);
  }
}

export async function chat(prompt: string): Promise<AIResponse> {
  const contextualPrompt = `You are an AI security analyst helping with a Quantum Risk Simulation for banking infrastructure. Current context: Post-quantum cryptography migration simulation. User question: ${prompt}`;
  return callEndpoint(LLM_API_URL, contextualPrompt);
}

export async function generateImage(description: string): Promise<AIResponse> {
  return callEndpoint(IMAGE_API_URL, description);
}

export async function getRiskAnalysis(systemData: { criticalSystems: number; migrationProgress: number; budget: number; day: number; }): Promise<AIResponse> {
  const prompt = `As a quantum security expert, analyze this banking infrastructure status:\n- Critical vulnerable systems: ${systemData.criticalSystems}\n- Migration progress: ${systemData.migrationProgress}%\n- Remaining budget: $${(systemData.budget / 1000000).toFixed(1)}M\n- Current day: ${systemData.day}/15\n\nProvide a brief risk assessment (2-3 sentences) and one actionable recommendation.`;
  return callEndpoint(LLM_API_URL, prompt);
}

export async function getThreatIntelligence(): Promise<AIResponse> {
  const prompt = `Generate a realistic cybersecurity threat intelligence brief about quantum computing threats to banking systems. Include:\n1. One current emerging threat\n2. Why it's dangerous for banks\n3. Timeline concern (Q-Day)\nKeep it under 100 words, professional tone.`;
  return callEndpoint(LLM_API_URL, prompt);
}

export async function getMigrationAdvice(systemName: string, riskLevel: string, budget: number): Promise<AIResponse> {
  const prompt = `As a quantum security consultant, advise on migrating "${systemName}" (${riskLevel} risk) to post-quantum cryptography. Budget available: $${(budget / 1000000).toFixed(1)}M. Provide one specific recommendation in 2 sentences.`;
  return callEndpoint(LLM_API_URL, prompt);
}

export async function generateSecurityReport(systemData: any): Promise<AIResponse> {
  const prompt = `Generate a professional Executive Security Report for banking infrastructure.\n\nCurrent Status:\n- Total Systems: ${systemData.totalSystems}\n- Critical Risk: ${systemData.criticalSystems} systems\n- High Risk: ${systemData.highRiskSystems} systems\n- Medium Risk: ${systemData.mediumRiskSystems} systems\n- Low Risk/Secured: ${systemData.lowRiskSystems} systems\n- Migration Progress: ${systemData.migrationProgress}%\n- Systems Migrated: ${systemData.migratedSystems}/${systemData.totalSystems}\n- Budget: $${(systemData.budget / 1000000).toFixed(1)}M remaining of $${(systemData.budgetUsed / 1000000).toFixed(1)}M spent\n- Sprint Day: ${systemData.day}/15\n- System Uptime: ${systemData.uptime.toFixed(2)}%\n\nGenerate a report with these sections:\n1. EXECUTIVE SUMMARY (3-4 sentences)\n2. RISK ASSESSMENT (current threat level and vulnerabilities)\n3. MIGRATION STATUS (progress and timeline)\n4. FINANCIAL OVERVIEW (budget utilization)\n5. RECOMMENDATIONS (top 3 priority actions)\n\nUse markdown formatting. Be professional, concise, and actionable.`;
  return callEndpoint(LLM_API_URL, prompt);
}

export async function generateThreatMap(systemData: { criticalSystems: number; totalSystems: number; migrationProgress: number; }): Promise<AIResponse> {
  const description = `Create a professional network security diagram showing:\n- 8 banking systems arranged in a connected network\n- ${systemData.criticalSystems} systems highlighted in RED (vulnerable to quantum attacks)\n- ${systemData.totalSystems - systemData.criticalSystems} systems in GREEN (secured with post-quantum cryptography)\n- Arrows showing connections between systems\n- Central quantum threat indicator\n- Modern, clean, technical style with dark background\n- Include labels: "PQC Protected" and "Quantum Vulnerable"\n- Show ${systemData.migrationProgress}% migration progress\nStyle: Cybersecurity infographic, professional tech diagram`;
  return callEndpoint(IMAGE_API_URL, description);
}

export async function simulateScenario(scenario: string, systemData: { criticalSystems: number; migrationProgress: number; budget: number; day: number; }): Promise<AIResponse> {
  const contextPrompt = `You are simulating quantum security scenarios for banking infrastructure.\n\nCurrent State:\n- Critical vulnerable systems: ${systemData.criticalSystems}\n- Migration progress: ${systemData.migrationProgress}%\n- Budget remaining: $${(systemData.budget / 1000000).toFixed(1)}M\n- Days remaining: ${15 - systemData.day}\n\nScenario: ${scenario}\n\nProvide a realistic simulation outcome with:\n1. IMMEDIATE IMPACT (what happens first)\n2. CASCADE EFFECTS (secondary consequences)\n3. FINANCIAL IMPACT (estimated cost/loss)\n4. RECOVERY ACTIONS (what to do next)\n\nBe specific, realistic, and use banking/security terminology. Keep response under 250 words.`;

  return callEndpoint(LLM_API_URL, contextPrompt);
}

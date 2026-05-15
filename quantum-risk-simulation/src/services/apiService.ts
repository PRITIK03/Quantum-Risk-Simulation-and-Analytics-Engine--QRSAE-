import type { ChatMessage as ChatMessageType } from '../models';
import * as ai from '../api/ai';

export type ChatMessage = ChatMessageType;

// Lightweight compatibility layer: re-export the new ai functions under the
// previous `apiService` shape so existing components keep working.
export const apiService = {
  chat: ai.chat,
  generateImage: ai.generateImage,
  getRiskAnalysis: ai.getRiskAnalysis,
  getThreatIntelligence: ai.getThreatIntelligence,
  getMigrationAdvice: ai.getMigrationAdvice,
  generateSecurityReport: ai.generateSecurityReport,
  generateThreatMap: ai.generateThreatMap,
  simulateScenario: ai.simulateScenario,
};

// API Service for backend integration
const API_KEY = import.meta.env.VITE_PICO_API_KEY || 'v1-Z0FBQUFBQnBhZndNaUllSTRCc21pUC1PUVJqRTFkUG54YzJza2FQM1ZnVC1mNzF0emRqVm1MRER1YnpEQU9VV3ZOSHYyeXBDNm9nVzNSMmdYenhtTWFDak1JWS13WjFTbXc9PQ==';
const LLM_API_URL = import.meta.env.VITE_LLM_API_URL || 'https://backend.buildpicoapps.com/aero/run/llm-api';
const IMAGE_API_URL = import.meta.env.VITE_IMAGE_API_URL || 'https://backend.buildpicoapps.com/aero/run/image-generation-api';

export interface ChatMessage {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
    imageUrl?: string;
}

export interface AIResponse {
    status: string;
    text?: string;
    imageUrl?: string;
}

class APIService {
    private async callAPI(endpoint: string, prompt: string): Promise<AIResponse> {
        const url = `${endpoint}?pk=${API_KEY}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API call failed:', error);
            return {
                status: 'error',
                text: 'Failed to connect to AI service. Please try again.',
            };
        }
    }

    async chat(prompt: string): Promise<AIResponse> {
        // Add context about the quantum risk simulation
        const contextualPrompt = `You are an AI security analyst helping with a Quantum Risk Simulation for banking infrastructure. Current context: Post-quantum cryptography migration simulation. User question: ${prompt}`;
        return this.callAPI(LLM_API_URL, contextualPrompt);
    }

    async generateImage(description: string): Promise<AIResponse> {
        return this.callAPI(IMAGE_API_URL, description);
    }

    async getRiskAnalysis(systemData: {
        criticalSystems: number;
        migrationProgress: number;
        budget: number;
        day: number;
    }): Promise<AIResponse> {
        const prompt = `As a quantum security expert, analyze this banking infrastructure status:
- Critical vulnerable systems: ${systemData.criticalSystems}
- Migration progress: ${systemData.migrationProgress}%
- Remaining budget: $${(systemData.budget / 1000000).toFixed(1)}M
- Current day: ${systemData.day}/15

Provide a brief risk assessment (2-3 sentences) and one actionable recommendation.`;

        return this.callAPI(LLM_API_URL, prompt);
    }

    async getThreatIntelligence(): Promise<AIResponse> {
        const prompt = `Generate a realistic cybersecurity threat intelligence brief about quantum computing threats to banking systems. Include:
1. One current emerging threat
2. Why it's dangerous for banks
3. Timeline concern (Q-Day)
Keep it under 100 words, professional tone.`;

        return this.callAPI(LLM_API_URL, prompt);
    }

    async getMigrationAdvice(systemName: string, riskLevel: string, budget: number): Promise<AIResponse> {
        const prompt = `As a quantum security consultant, advise on migrating "${systemName}" (${riskLevel} risk) to post-quantum cryptography. Budget available: $${(budget / 1000000).toFixed(1)}M. Provide one specific recommendation in 2 sentences.`;

        return this.callAPI(LLM_API_URL, prompt);
    }

    async generateSecurityReport(systemData: {
        criticalSystems: number;
        highRiskSystems: number;
        mediumRiskSystems: number;
        lowRiskSystems: number;
        migrationProgress: number;
        budget: number;
        budgetUsed: number;
        day: number;
        uptime: number;
        totalSystems: number;
        migratedSystems: number;
    }): Promise<AIResponse> {
        const prompt = `Generate a professional Executive Security Report for banking infrastructure.

Current Status:
- Total Systems: ${systemData.totalSystems}
- Critical Risk: ${systemData.criticalSystems} systems
- High Risk: ${systemData.highRiskSystems} systems
- Medium Risk: ${systemData.mediumRiskSystems} systems
- Low Risk/Secured: ${systemData.lowRiskSystems} systems
- Migration Progress: ${systemData.migrationProgress}%
- Systems Migrated: ${systemData.migratedSystems}/${systemData.totalSystems}
- Budget: $${(systemData.budget / 1000000).toFixed(1)}M remaining of $${(systemData.budgetUsed / 1000000).toFixed(1)}M spent
- Sprint Day: ${systemData.day}/15
- System Uptime: ${systemData.uptime.toFixed(2)}%

Generate a report with these sections:
1. EXECUTIVE SUMMARY (3-4 sentences)
2. RISK ASSESSMENT (current threat level and vulnerabilities)
3. MIGRATION STATUS (progress and timeline)
4. FINANCIAL OVERVIEW (budget utilization)
5. RECOMMENDATIONS (top 3 priority actions)

Use markdown formatting. Be professional, concise, and actionable.`;

        return this.callAPI(LLM_API_URL, prompt);
    }

    async generateThreatMap(systemData: {
        criticalSystems: number;
        totalSystems: number;
        migrationProgress: number;
    }): Promise<AIResponse> {
        const description = `Create a professional network security diagram showing:
- 8 banking systems arranged in a connected network
- ${systemData.criticalSystems} systems highlighted in RED (vulnerable to quantum attacks)
- ${systemData.totalSystems - systemData.criticalSystems} systems in GREEN (secured with post-quantum cryptography)
- Arrows showing connections between systems
- Central quantum threat indicator
- Modern, clean, technical style with dark background
- Include labels: "PQC Protected" and "Quantum Vulnerable"
- Show ${systemData.migrationProgress}% migration progress
Style: Cybersecurity infographic, professional tech diagram`;

        return this.callAPI(IMAGE_API_URL, description);
    }

    async simulateScenario(scenario: string, systemData: {
        criticalSystems: number;
        migrationProgress: number;
        budget: number;
        day: number;
    }): Promise<AIResponse> {
        const contextPrompt = `You are simulating quantum security scenarios for banking infrastructure.

Current State:
- Critical vulnerable systems: ${systemData.criticalSystems}
- Migration progress: ${systemData.migrationProgress}%
- Budget remaining: $${(systemData.budget / 1000000).toFixed(1)}M
- Days remaining: ${15 - systemData.day}

Scenario: ${scenario}

Provide a realistic simulation outcome with:
1. IMMEDIATE IMPACT (what happens first)
2. CASCADE EFFECTS (secondary consequences)
3. FINANCIAL IMPACT (estimated cost/loss)
4. RECOVERY ACTIONS (what to do next)

Be specific, realistic, and use banking/security terminology. Keep response under 250 words.`;

        return this.callAPI(LLM_API_URL, contextPrompt);
    }
}

export const apiService = new APIService();

import { useState } from 'react';
import { FileText, Map, Zap, Download, Copy, Loader, CheckCircle } from 'lucide-react';
import { apiService } from '../services/apiService';
import ReactMarkdown from 'react-markdown';

interface AIToolsPanelProps {
    systemData: {
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
    };
}

type ToolTab = 'report' | 'map' | 'scenarios';

export function AIToolsPanel({ systemData }: AIToolsPanelProps) {
    const [activeTab, setActiveTab] = useState<ToolTab>('report');
    const [reportContent, setReportContent] = useState<string>('');
    const [threatMapUrl, setThreatMapUrl] = useState<string>('');
    const [scenarioResult, setScenarioResult] = useState<string>('');
    const [customScenario, setCustomScenario] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const predefinedScenarios = [
        { id: 'qday', label: '⚡ Q-Day Happens Today', scenario: 'Q-Day arrives and quantum computers can break current encryption instantly' },
        { id: 'budget', label: '💰 Budget Runs Out', scenario: 'Budget is completely depleted before migration is complete' },
        { id: 'breach', label: '🔓 Critical System Breach', scenario: 'A critical vulnerable system experiences a quantum-enabled security breach' },
        { id: 'audit', label: '📋 Compliance Audit', scenario: 'Unexpected regulatory compliance audit happens today with current security posture' },
    ];

    const generateReport = async () => {
        setIsLoading(true);
        try {
            const response = await apiService.generateSecurityReport(systemData);
            if (response.text) {
                setReportContent(response.text);
            }
        } catch (error) {
            console.error('Report generation failed:', error);
            setReportContent('Failed to generate report. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const generateThreatMap = async () => {
        setIsLoading(true);
        try {
            const response = await apiService.generateThreatMap({
                criticalSystems: systemData.criticalSystems,
                totalSystems: systemData.totalSystems,
                migrationProgress: systemData.migrationProgress,
            });
            if (response.imageUrl) {
                setThreatMapUrl(response.imageUrl);
            }
        } catch (error) {
            console.error('Threat map generation failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const simulateScenario = async (scenario: string) => {
        setIsLoading(true);
        setScenarioResult('');
        try {
            const response = await apiService.simulateScenario(scenario, {
                criticalSystems: systemData.criticalSystems,
                migrationProgress: systemData.migrationProgress,
                budget: systemData.budget,
                day: systemData.day,
            });
            if (response.text) {
                setScenarioResult(response.text);
            }
        } catch (error) {
            console.error('Scenario simulation failed:', error);
            setScenarioResult('Failed to simulate scenario. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(reportContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadReport = () => {
        const blob = new Blob([reportContent], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `security-report-day${systemData.day}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>

            {/* Tab Navigation */}
            <div style={{
                display: 'flex',
                gap: '8px',
                padding: '4px',
                background: 'var(--bg-tertiary)',
                borderRadius: '12px',
                width: 'fit-content'
            }}>
                <TabButton
                    active={activeTab === 'report'}
                    onClick={() => setActiveTab('report')}
                    icon={<FileText size={16} />}
                    label="Report Generator"
                />
                <TabButton
                    active={activeTab === 'map'}
                    onClick={() => setActiveTab('map')}
                    icon={<Map size={16} />}
                    label="Threat Map"
                />
                <TabButton
                    active={activeTab === 'scenarios'}
                    onClick={() => setActiveTab('scenarios')}
                    icon={<Zap size={16} />}
                    label="Scenarios"
                />
            </div>

            {/* Tab Content */}
            <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>

                {/* Report Tab */}
                {activeTab === 'report' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
                                Executive Security Report
                            </h2>
                            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                Generate a comprehensive AI-powered security report with risk assessment and recommendations.
                            </p>
                        </div>

                        <button
                            className="btn btn-primary"
                            onClick={generateReport}
                            disabled={isLoading}
                            style={{ width: 'fit-content', opacity: isLoading ? 0.5 : 1 }}
                        >
                            {isLoading ? <><Loader size={18} className="animate-spin" /> Generating...</> : <>📊 Generate Report</>}
                        </button>

                        {reportContent && (
                            <div style={{
                                background: 'var(--bg-tertiary)',
                                borderRadius: '12px',
                                padding: '20px',
                                border: '1px solid var(--border-subtle)',
                                position: 'relative'
                            }}>
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', justifyContent: 'flex-end' }}>
                                    <button
                                        className="btn btn-ghost"
                                        onClick={copyToClipboard}
                                        style={{ padding: '8px 12px', fontSize: '12px' }}
                                    >
                                        {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                                        {copied ? 'Copied!' : 'Copy'}
                                    </button>
                                    <button
                                        className="btn btn-ghost"
                                        onClick={downloadReport}
                                        style={{ padding: '8px 12px', fontSize: '12px' }}
                                    >
                                        <Download size={14} /> Download
                                    </button>
                                </div>
                                <div className="markdown-content" style={{ fontSize: '14px', lineHeight: 1.7 }}>
                                    <ReactMarkdown>{reportContent}</ReactMarkdown>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Threat Map Tab */}
                {activeTab === 'map' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
                                Network Threat Visualization
                            </h2>
                            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                AI-generated network diagram showing vulnerable and secured systems.
                            </p>
                        </div>

                        <button
                            className="btn btn-primary"
                            onClick={generateThreatMap}
                            disabled={isLoading}
                            style={{ width: 'fit-content', opacity: isLoading ? 0.5 : 1 }}
                        >
                            {isLoading ? <><Loader size={18} className="animate-spin" /> Generating...</> : <>🗺️ Generate Threat Map</>}
                        </button>

                        {threatMapUrl && (
                            <div style={{
                                background: 'var(--bg-tertiary)',
                                borderRadius: '12px',
                                padding: '20px',
                                border: '1px solid var(--border-subtle)',
                                textAlign: 'center'
                            }}>
                                <img
                                    src={threatMapUrl}
                                    alt="Network Threat Map"
                                    style={{
                                        maxWidth: '100%',
                                        borderRadius: '8px',
                                        border: '1px solid var(--border-default)'
                                    }}
                                    onClick={() => window.open(threatMapUrl, '_blank')}
                                />
                                <div style={{ marginTop: '12px' }}>
                                    <a
                                        href={threatMapUrl}
                                        download="threat-map.png"
                                        className="btn btn-ghost"
                                        style={{ padding: '8px 12px', fontSize: '12px' }}
                                    >
                                        <Download size={14} /> Download Image
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Scenarios Tab */}
                {activeTab === 'scenarios' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
                                Scenario Simulator
                            </h2>
                            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                Simulate security scenarios to understand potential impacts and plan responses.
                            </p>
                        </div>

                        <div>
                            <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-secondary)' }}>
                                Predefined Scenarios
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                                {predefinedScenarios.map(s => (
                                    <button
                                        key={s.id}
                                        className="btn btn-ghost"
                                        onClick={() => simulateScenario(s.scenario)}
                                        disabled={isLoading}
                                        style={{
                                            padding: '12px',
                                            justifyContent: 'flex-start',
                                            opacity: isLoading ? 0.5 : 1
                                        }}
                                    >
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-secondary)' }}>
                                Custom Scenario
                            </h3>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    type="text"
                                    value={customScenario}
                                    onChange={(e) => setCustomScenario(e.target.value)}
                                    placeholder="e.g., Ransomware attack on payment processing..."
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        background: 'var(--bg-tertiary)',
                                        border: '1px solid var(--border-default)',
                                        borderRadius: '8px',
                                        color: 'white',
                                        fontSize: '14px',
                                        outline: 'none',
                                    }}
                                />
                                <button
                                    className="btn btn-primary"
                                    onClick={() => simulateScenario(customScenario)}
                                    disabled={isLoading || !customScenario.trim()}
                                    style={{ opacity: isLoading || !customScenario.trim() ? 0.5 : 1 }}
                                >
                                    Simulate
                                </button>
                            </div>
                        </div>

                        {isLoading && (
                            <div style={{
                                background: 'var(--bg-tertiary)',
                                borderRadius: '12px',
                                padding: '40px',
                                textAlign: 'center',
                                border: '1px solid var(--border-subtle)'
                            }}>
                                <Loader size={32} className="animate-spin" style={{ margin: '0 auto 16px' }} />
                                <p style={{ color: 'var(--text-muted)' }}>Simulating scenario...</p>
                            </div>
                        )}

                        {scenarioResult && !isLoading && (
                            <div style={{
                                background: 'var(--bg-tertiary)',
                                borderRadius: '12px',
                                padding: '20px',
                                border: '1px solid var(--border-subtle)'
                            }}>
                                <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: 'var(--accent-amber)' }}>
                                    ⚠️ Simulation Results
                                </h3>
                                <div className="markdown-content" style={{ fontSize: '14px', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                                    <ReactMarkdown>{scenarioResult}</ReactMarkdown>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function TabButton({ active, onClick, icon, label }: {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string
}) {
    return (
        <button
            onClick={onClick}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 16px',
                background: active ? 'var(--gradient-primary)' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                color: active ? 'white' : 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
            }}
        >
            {icon}
            {label}
        </button>
    );
}

import { Target, CheckCircle, Lock, Zap, Clock, Award } from 'lucide-react';
import type { Mission } from '../models';

interface MissionsPanelProps {
    missions: Mission[];
    currentDay: number;
    onComplete?: (missionId: string) => void;
}

export function MissionsPanel({ missions, currentDay }: MissionsPanelProps) {
    const activeMissions = missions.filter(m => m.requiredDay <= currentDay);
    const completedCount = missions.filter(m => m.isCompleted).length;

    return (
        <div className="glass-card" style={{ padding: '20px', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Target size={16} style={{ color: 'var(--accent-primary)' }} />
                    Mission Objectives
                </h3>
                <span style={{
                    fontSize: '12px',
                    padding: '4px 10px',
                    background: 'var(--bg-tertiary)',
                    borderRadius: '20px',
                    color: 'var(--text-secondary)'
                }}>
                    {completedCount}/{missions.length}
                </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activeMissions.map((mission, index) => (
                    <MissionCard key={mission.id} mission={mission} delay={index * 0.1} />
                ))}
                {activeMissions.length === 0 && (
                    <div style={{
                        padding: '32px',
                        textAlign: 'center',
                        color: 'var(--text-muted)',
                        fontSize: '13px'
                    }}>
                        <Lock size={24} style={{ marginBottom: '8px', opacity: 0.5 }} />
                        <p>Missions unlock as you progress</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function MissionCard({ mission, delay }: { mission: Mission; delay: number }) {
    const typeIcons = {
        scan: <Zap size={14} />,
        vendor: <Award size={14} />,
        migrate: <Target size={14} />,
        budget: <Clock size={14} />,
    };

    const typeColors = {
        scan: 'var(--accent-cyan)',
        vendor: 'var(--accent-secondary)',
        migrate: 'var(--accent-primary)',
        budget: 'var(--accent-amber)',
    };

    return (
        <div
            className="animate-fade-in"
            style={{
                animationDelay: `${delay}s`,
                padding: '14px',
                background: mission.isCompleted
                    ? 'rgba(16, 185, 129, 0.08)'
                    : 'var(--bg-tertiary)',
                border: `1px solid ${mission.isCompleted ? 'rgba(16, 185, 129, 0.2)' : 'var(--border-subtle)'}`,
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                opacity: mission.isCompleted ? 0.7 : 1,
            }}
        >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: mission.isCompleted ? 'rgba(16, 185, 129, 0.2)' : `${typeColors[mission.type]}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: mission.isCompleted ? 'var(--accent-emerald)' : typeColors[mission.type],
                    flexShrink: 0,
                }}>
                    {mission.isCompleted ? <CheckCircle size={16} /> : typeIcons[mission.type]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '4px'
                    }}>
                        <h4 style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            textDecoration: mission.isCompleted ? 'line-through' : 'none',
                            color: mission.isCompleted ? 'var(--text-muted)' : 'var(--text-primary)'
                        }}>
                            {mission.title}
                        </h4>
                    </div>
                    <p style={{
                        fontSize: '12px',
                        color: 'var(--text-muted)',
                        marginBottom: '8px',
                        lineHeight: 1.4
                    }}>
                        {mission.description}
                    </p>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '3px 8px',
                        background: 'rgba(99, 102, 241, 0.1)',
                        borderRadius: '4px',
                        fontSize: '11px',
                        color: 'var(--accent-primary)',
                        fontWeight: 500
                    }}>
                        <Zap size={10} />
                        {mission.reward}
                    </div>
                </div>
            </div>
        </div>
    );
}

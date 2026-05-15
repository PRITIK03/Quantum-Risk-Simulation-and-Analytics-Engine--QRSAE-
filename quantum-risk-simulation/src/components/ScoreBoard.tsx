import React from 'react';
import { Trophy, Star, Shield, Zap, Clock, Award } from 'lucide-react';
import type { Achievement } from '../models';

interface ScoreBoardProps {
    score: number;
    rank: string;
    achievements: Achievement[];
}

export function ScoreBoard({ score, rank, achievements }: ScoreBoardProps) {
    const unlockedCount = achievements.filter(a => a.isUnlocked).length;

    const iconMap: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
        shield: Shield,
        star: Star,
        zap: Zap,
        clock: Clock,
        award: Award,
    };

    return (
        <div className="glass-card animate-glow" style={{
            padding: '20px',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
            border: '1px solid rgba(99, 102, 241, 0.2)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    background: 'var(--gradient-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)'
                }}>
                    <Trophy size={28} />
                </div>
                <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Security Score
                    </div>
                    <div className="font-mono" style={{ fontSize: '32px', fontWeight: 700, lineHeight: 1 }}>
                        {score.toLocaleString()}
                    </div>
                    <div style={{
                        display: 'inline-block',
                        marginTop: '4px',
                        padding: '2px 8px',
                        background: 'rgba(245, 158, 11, 0.2)',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: 600,
                        color: 'var(--accent-amber)',
                        textTransform: 'uppercase'
                    }}>
                        {rank}
                    </div>
                </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Achievements</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{unlockedCount}/{achievements.length}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {achievements.map(achievement => {
                        const Icon = iconMap[achievement.icon];
                        return (
                            <div
                                key={achievement.id}
                                title={achievement.title}
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '10px',
                                    background: achievement.isUnlocked ? 'var(--bg-tertiary)' : 'rgba(255,255,255,0.03)',
                                    border: `1px solid ${achievement.isUnlocked ? 'var(--accent-amber)' : 'var(--border-subtle)'}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    opacity: achievement.isUnlocked ? 1 : 0.3,
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer'
                                }}
                            >
                                <Icon size={16} style={{ color: achievement.isUnlocked ? 'var(--accent-amber)' : 'var(--text-muted)' }} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}


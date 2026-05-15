import { Zap, TrendingUp, Shield, Clock } from 'lucide-react';
import type { ReactNode } from 'react';

interface StatCardProps {
    icon: ReactNode;
    label: string;
    value: string | number;
    subtext?: string;
    trend?: 'up' | 'down' | 'neutral';
    variant?: 'default' | 'success' | 'warning' | 'danger';
    className?: string;
    style?: React.CSSProperties;
}

const variantColors = {
    default: { icon: 'text-indigo-400', border: 'border-indigo-500/20', glow: 'rgba(99, 102, 241, 0.1)' },
    success: { icon: 'text-emerald-400', border: 'border-emerald-500/20', glow: 'rgba(16, 185, 129, 0.1)' },
    warning: { icon: 'text-amber-400', border: 'border-amber-500/20', glow: 'rgba(245, 158, 11, 0.1)' },
    danger: { icon: 'text-rose-400', border: 'border-rose-500/20', glow: 'rgba(244, 63, 94, 0.1)' },
};

export function StatCard({ icon, label, value, subtext, trend, variant = 'default' }: StatCardProps) {
    const colors = variantColors[variant];

    return (
        <div
            className="glass-card p-5 animate-fade-in"
            style={{
                borderTop: `2px solid ${colors.glow.replace('0.1', '0.5')}`,
                boxShadow: `0 4px 24px ${colors.glow}`
            }}
        >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
                <div className={colors.icon} style={{ opacity: 0.8 }}>{icon}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
                <span className="font-mono" style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em' }}>{value}</span>
                {trend && (
                    <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px',
                        fontSize: '12px',
                        color: trend === 'up' ? 'var(--accent-emerald)' : trend === 'down' ? 'var(--accent-rose)' : 'var(--text-muted)'
                    }}>
                        <TrendingUp size={12} style={{ transform: trend === 'down' ? 'rotate(180deg)' : 'none' }} />
                        {trend === 'up' ? '+2.5%' : trend === 'down' ? '-1.2%' : '0%'}
                    </span>
                )}
            </div>
            {subtext && (
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{subtext}</span>
            )}
        </div>
    );
}

interface ProgressRingProps {
    progress: number;
    size?: number;
    strokeWidth?: number;
    label?: string;
}

export function ProgressRing({ progress, size = 120, strokeWidth = 8, label }: ProgressRingProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div style={{ position: 'relative', width: size, height: size }}>
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="var(--bg-tertiary)"
                    strokeWidth={strokeWidth}
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="url(#progress-gradient)"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                />
                <defs>
                    <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="var(--accent-primary)" />
                        <stop offset="100%" stopColor="var(--accent-cyan)" />
                    </linearGradient>
                </defs>
            </svg>
            <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <span className="font-mono" style={{ fontSize: '24px', fontWeight: 700 }}>{progress}%</span>
                {label && <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{label}</span>}
            </div>
        </div>
    );
}

interface ScanAnimationProps {
    isScanning: boolean;
    progress: number;
}

export function ScanAnimation({ isScanning, progress }: ScanAnimationProps) {
    return (
        <div style={{
            position: 'relative',
            width: '100%',
            height: '200px',
            background: 'var(--bg-tertiary)',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid var(--border-subtle)'
        }}>
            {/* Grid lines */}
            <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.5 }} />

            {/* Scanning line */}
            {isScanning && (
                <div style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, var(--accent-cyan), transparent)',
                    top: `${progress}%`,
                    boxShadow: '0 0 20px var(--accent-cyan)',
                    transition: 'top 0.1s linear',
                }} />
            )}

            {/* Center icon */}
            <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div className={isScanning ? 'animate-pulse' : ''} style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'var(--bg-secondary)',
                    border: `2px solid ${isScanning ? 'var(--accent-cyan)' : 'var(--border-default)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                }}>
                    <Shield size={32} style={{ color: isScanning ? 'var(--accent-cyan)' : 'var(--text-muted)' }} />
                </div>
            </div>

            {/* Status text */}
            <div style={{
                position: 'absolute',
                bottom: '16px',
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center'
            }}>
                <span className="font-mono" style={{
                    fontSize: '12px',
                    color: isScanning ? 'var(--accent-cyan)' : 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                }}>
                    {isScanning ? `Scanning... ${Math.round(progress)}%` : 'Ready to scan'}
                </span>
            </div>
        </div>
    );
}

export function QDayCountdown({ years }: { years: number }) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 20px',
            background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.1), rgba(245, 158, 11, 0.1))',
            borderRadius: '12px',
            border: '1px solid rgba(244, 63, 94, 0.2)'
        }}>
            <Clock size={20} style={{ color: 'var(--accent-rose)' }} className="animate-pulse" />
            <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Q-Day Countdown
                </div>
                <div className="font-mono" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent-rose)' }}>
                    T-{years} Years
                </div>
            </div>
        </div>
    );
}

export function DayCounter({ day, maxDays }: { day: number; maxDays: number }) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 20px',
            background: 'var(--gradient-primary)',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)'
        }}>
            <Zap size={20} />
            <div>
                <div style={{ fontSize: '11px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Sprint Day
                </div>
                <div className="font-mono" style={{ fontSize: '18px', fontWeight: 700 }}>
                    {day} / {maxDays}
                </div>
            </div>
        </div>
    );
}

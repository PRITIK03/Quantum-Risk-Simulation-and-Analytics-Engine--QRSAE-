import { useEffect, useRef, useState } from 'react';
import { Shield, AlertTriangle, Activity, Zap } from 'lucide-react';

// Threat Radar Component
export function ThreatRadar({ threatLevel }: { threatLevel: number }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [angle, setAngle] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setAngle(prev => (prev + 2) % 360);
        }, 50);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const size = canvas.width;
        const center = size / 2;
        const maxRadius = size / 2 - 10;

        ctx.clearRect(0, 0, size, size);

        // Draw radar circles
        for (let i = 1; i <= 3; i++) {
            ctx.beginPath();
            ctx.arc(center, center, (maxRadius / 3) * i, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(99, 102, 241, 0.2)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Draw cross lines
        ctx.beginPath();
        ctx.moveTo(center, 10);
        ctx.lineTo(center, size - 10);
        ctx.moveTo(10, center);
        ctx.lineTo(size - 10, center);
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.15)';
        ctx.stroke();

        // Draw sweep line
        const radians = (angle * Math.PI) / 180;
        const gradient = ctx.createLinearGradient(
            center, center,
            center + Math.cos(radians) * maxRadius,
            center + Math.sin(radians) * maxRadius
        );
        gradient.addColorStop(0, 'rgba(34, 211, 238, 0)');
        gradient.addColorStop(1, 'rgba(34, 211, 238, 0.8)');

        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.lineTo(
            center + Math.cos(radians) * maxRadius,
            center + Math.sin(radians) * maxRadius
        );
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw sweep arc (trail effect)
        const trailGradient = ctx.createConicGradient(radians - Math.PI / 4, center, center);
        trailGradient.addColorStop(0, 'rgba(34, 211, 238, 0)');
        trailGradient.addColorStop(0.2, 'rgba(34, 211, 238, 0.1)');
        trailGradient.addColorStop(1, 'rgba(34, 211, 238, 0)');

        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.arc(center, center, maxRadius, radians - Math.PI / 4, radians);
        ctx.closePath();
        ctx.fillStyle = trailGradient;
        ctx.fill();

        // Draw threat dots
        const threats = [
            { x: 0.3, y: 0.2, size: 6, color: 'var(--accent-rose)' },
            { x: -0.4, y: 0.3, size: 5, color: 'var(--accent-amber)' },
            { x: 0.2, y: -0.5, size: 7, color: 'var(--accent-rose)' },
            { x: -0.2, y: -0.3, size: 4, color: 'var(--accent-primary)' },
        ];

        threats.slice(0, Math.ceil(threatLevel / 25)).forEach(threat => {
            const pulse = Math.sin(Date.now() / 200) * 0.3 + 0.7;
            ctx.beginPath();
            ctx.arc(
                center + threat.x * maxRadius,
                center + threat.y * maxRadius,
                threat.size * pulse,
                0, Math.PI * 2
            );
            ctx.fillStyle = threat.color;
            ctx.fill();
        });

        // Center dot
        ctx.beginPath();
        ctx.arc(center, center, 4, 0, Math.PI * 2);
        ctx.fillStyle = 'var(--accent-emerald)';
        ctx.fill();

    }, [angle, threatLevel]);

    return (
        <div style={{
            background: 'var(--bg-tertiary)',
            borderRadius: '16px',
            padding: '16px',
            border: '1px solid var(--border-subtle)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Shield size={16} style={{ color: 'var(--accent-cyan)' }} />
                <span style={{ fontSize: '13px', fontWeight: 600 }}>Threat Radar</span>
            </div>
            <canvas
                ref={canvasRef}
                width={160}
                height={160}
                style={{ display: 'block', margin: '0 auto' }}
            />
        </div>
    );
}

// Risk Gauge Component
export function RiskGauge({ value, label, color }: { value: number; label: string; color: string }) {
    const percentage = Math.min(Math.max(value, 0), 100);
    const rotation = (percentage / 100) * 180 - 90;

    return (
        <div style={{
            background: 'var(--bg-tertiary)',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
            border: '1px solid var(--border-subtle)'
        }}>
            <div style={{ position: 'relative', width: '100px', height: '60px', margin: '0 auto' }}>
                {/* Background arc */}
                <svg width="100" height="60" style={{ position: 'absolute', top: 0, left: 0 }}>
                    <path
                        d="M 10 55 A 40 40 0 0 1 90 55"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="8"
                        strokeLinecap="round"
                    />
                    <path
                        d="M 10 55 A 40 40 0 0 1 90 55"
                        fill="none"
                        stroke={color}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${(percentage / 100) * 126} 126`}
                        style={{ transition: 'stroke-dasharray 0.5s ease' }}
                    />
                </svg>
                {/* Needle */}
                <div style={{
                    position: 'absolute',
                    bottom: '5px',
                    left: '50%',
                    width: '2px',
                    height: '35px',
                    background: 'white',
                    transformOrigin: 'bottom center',
                    transform: `translateX(-50%) rotate(${rotation}deg)`,
                    transition: 'transform 0.5s ease',
                    borderRadius: '1px'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '2px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'white'
                }} />
            </div>
            <div className="font-mono" style={{ fontSize: '18px', fontWeight: 700, marginTop: '8px' }}>
                {percentage}%
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{label}</div>
        </div>
    );
}

// Sparkline Chart
export function Sparkline({ data, color = 'var(--accent-primary)' }: { data: number[]; color?: string }) {
    const width = 80;
    const height = 30;
    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    const range = max - min || 1;

    const points = data.map((value, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((value - min) / range) * height;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg width={width} height={height} style={{ display: 'block' }}>
            <defs>
                <linearGradient id={`sparkline-${color}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <polygon
                points={`0,${height} ${points} ${width},${height}`}
                fill={`url(#sparkline-${color})`}
            />
            <polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

// Network Pulse Animation
export function NetworkPulse({ active }: { active: boolean }) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            background: active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
            borderRadius: '8px',
            border: `1px solid ${active ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)'}`
        }}>
            <div style={{ position: 'relative' }}>
                <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: active ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                }} />
                {active && (
                    <div style={{
                        position: 'absolute',
                        inset: '-4px',
                        borderRadius: '50%',
                        border: '2px solid var(--accent-emerald)',
                        animation: 'pulse 2s infinite',
                        opacity: 0.5
                    }} />
                )}
            </div>
            <span style={{ fontSize: '12px', color: active ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                {active ? 'Network Secure' : 'Threats Detected'}
            </span>
        </div>
    );
}

// Animated Counter
export function AnimatedCounter({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const duration = 1000;
        const startTime = Date.now();
        const startValue = displayValue;
        const diff = value - startValue;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplayValue(Math.round(startValue + diff * eased));
            if (progress < 1) requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
        // displayValue is intentionally omitted - it's captured in closure at animation start
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
        <span className="font-mono">{prefix}{displayValue.toLocaleString()}{suffix}</span>
    );
}

// Threat Level Indicator
export function ThreatLevelIndicator({ level }: { level: 'low' | 'medium' | 'high' | 'critical' }) {
    const config = {
        low: { color: 'var(--accent-emerald)', icon: Shield, label: 'Low', bars: 1 },
        medium: { color: 'var(--accent-primary)', icon: Activity, label: 'Medium', bars: 2 },
        high: { color: 'var(--accent-amber)', icon: AlertTriangle, label: 'High', bars: 3 },
        critical: { color: 'var(--accent-rose)', icon: Zap, label: 'Critical', bars: 4 },
    };

    const { color, icon: Icon, label, bars } = config[level];

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            background: `${color}10`,
            borderRadius: '10px',
            border: `1px solid ${color}30`
        }}>
            <Icon size={20} style={{ color }} />
            <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Threat Level</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color }}>{label}</div>
            </div>
            <div style={{ display: 'flex', gap: '3px', marginLeft: 'auto' }}>
                {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{
                        width: '4px',
                        height: '16px',
                        borderRadius: '2px',
                        background: i <= bars ? color : 'rgba(255,255,255,0.1)',
                        transition: 'background 0.3s ease'
                    }} />
                ))}
            </div>
        </div>
    );
}

// Hexagon Grid Background
export function HexagonBackground() {
    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            opacity: 0.03,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='1'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            zIndex: 0
        }} />
    );
}

// Glowing Orb
export function GlowingOrb({ color = 'var(--accent-primary)', size = 200 }: { color?: string; size?: number }) {
    return (
        <div style={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
            filter: 'blur(40px)',
            pointerEvents: 'none'
        }} />
    );
}

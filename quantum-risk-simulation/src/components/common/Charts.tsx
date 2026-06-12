import React from 'react';
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';
import type { TimelineEvent } from '../../models';

export interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  percent: number;
  color: string;
  trend: 'up' | 'down' | 'neutral';
}

export function MetricCard({
  icon,
  label,
  value,
  percent,
  color,
  trend,
}: MetricCardProps) {
  const TrendIcon =
    trend === 'up'
      ? TrendingUp
      : trend === 'down'
        ? TrendingDown
        : Minus;

  return (
    <div
      style={{
        padding: '16px',
        background: 'var(--bg-tertiary)',
        borderRadius: '14px',
        border: '1px solid var(--border-subtle)',
        transition: 'all 0.3s ease',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '8px',
        }}
      >
        <span style={{ color, opacity: 0.8 }}>{icon}</span>
        <TrendIcon size={14} style={{ color }} />
      </div>
      <div
        className="font-mono"
        style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}
      >
        {value}
      </div>
      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
        {label}
      </div>
      <div
        style={{
          height: '4px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '2px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${Math.min(percent, 100)}%`,
            background: color,
            borderRadius: '2px',
            transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </div>
    </div>
  );
}

export interface DonutChartProps {
  data: { critical: number; high: number; medium: number; low: number };
}

export function DonutChart({ data }: DonutChartProps) {
  const total = data.critical + data.high + data.medium + data.low;
  const size = 100;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  const segments = [
    { value: data.critical, color: 'var(--accent-rose)' },
    { value: data.high, color: 'var(--accent-amber)' },
    { value: data.medium, color: 'var(--accent-primary)' },
    { value: data.low, color: 'var(--accent-emerald)' },
  ];

  let currentOffset = 0;

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--bg-secondary)"
        strokeWidth={strokeWidth}
      />
      {segments.map((segment, i) => {
        const segmentLength = (segment.value / total) * circumference;
        const offset = currentOffset;
        currentOffset += segmentLength;

        return (
          <circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={segment.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
            strokeDashoffset={-offset}
            style={{
              transition: 'stroke-dasharray 1s ease, stroke-dashoffset 1s ease',
              filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.3))',
            }}
          />
        );
      })}
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          transform: 'rotate(90deg)',
          transformOrigin: 'center',
          fill: 'white',
          fontSize: '16px',
          fontWeight: 700,
          fontFamily: 'var(--font-mono)',
        }}
      >
        {total}
      </text>
    </svg>
  );
}

export interface LegendItemProps {
  color: string;
  label: string;
  value: number;
}

export function LegendItem({ color, label, value }: LegendItemProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div
        style={{
          width: '10px',
          height: '10px',
          borderRadius: '3px',
          background: color,
          boxShadow: `0 0 8px ${color}40`,
        }}
      />
      <span style={{ fontSize: '12px', color: 'var(--text-muted)', minWidth: '60px' }}>
        {label}
      </span>
      <span className="font-mono" style={{ fontSize: '12px', fontWeight: 600 }}>
        {value}
      </span>
    </div>
  );
}

export interface BarChartProps {
  data: { label: string; value: number; color: string }[];
}

export function BarChart({ data }: BarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 0.01);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {data.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', minWidth: '60px' }}>
            {item.label}
          </span>
          <div
            style={{
              flex: 1,
              height: '20px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            <div
              className="animate-slide-in"
              style={{
                height: '100%',
                width: `${(item.value / maxValue) * 100}%`,
                background: `linear-gradient(90deg, ${item.color}, ${item.color}80)`,
                borderRadius: '4px',
                transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                animationDelay: `${i * 0.1}s`,
              }}
            />
          </div>
          <span
            className="font-mono"
            style={{
              fontSize: '11px',
              color: 'var(--text-secondary)',
              minWidth: '40px',
              textAlign: 'right',
            }}
          >
            {(item.value * 100).toFixed(0)}%
          </span>
        </div>
      ))}
    </div>
  );
}

export interface TimelineChartProps {
  currentDay: number;
  migrationProgress: number;
}

export function TimelineChart({
  currentDay,
  migrationProgress,
}: TimelineChartProps) {
  const days = Array.from({ length: 15 }, (_, i) => i + 1);

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          height: '80px',
          borderBottom: '1px solid var(--border-subtle)',
          position: 'relative',
        }}
      >
        <svg
          style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--accent-primary)" />
              <stop offset="100%" stopColor="var(--accent-cyan)" />
            </linearGradient>
          </defs>
          <path
            d={`M 0 ${80 - (migrationProgress * 0.7)} ${days
              .slice(0, currentDay)
              .map((_d, i) => {
                const y =
                  80 -
                  (Math.sin((i / 14) * Math.PI) * 30 + migrationProgress * 0.5);
                return `L ${(i / 14) * 100}% ${y}`;
              })
              .join(' ')}`}
            fill="none"
            stroke="url(#line-gradient)"
            strokeWidth="3"
            strokeLinecap="round"
            style={{
              filter: 'drop-shadow(0 0 6px rgba(99, 102, 241, 0.5))',
              transition: 'all 0.5s ease',
            }}
          />
          <circle
            cx={`${((currentDay - 1) / 14) * 100}%`}
            cy={
              80 -
              (Math.sin(((currentDay - 1) / 14) * Math.PI) * 30 +
                migrationProgress * 0.5)
            }
            r="6"
            fill="var(--accent-cyan)"
            style={{
              filter: 'drop-shadow(0 0 8px var(--accent-cyan))',
              animation: 'pulse 2s infinite',
            }}
          />
        </svg>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
        {days.filter((_, i) => i % 2 === 0).map((day) => (
          <span
            key={day}
            className="font-mono"
            style={{
              fontSize: '10px',
              color: day <= currentDay ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontWeight: day === currentDay ? 600 : 400,
            }}
          >
            D{day}
          </span>
        ))}
      </div>
    </div>
  );
}

export interface ActivityItemProps {
  event: TimelineEvent;
  index: number;
}

export function ActivityItem({ event, index }: ActivityItemProps) {
  const colors: Record<string, string> = {
    scan: 'var(--accent-cyan)',
    vendor: 'var(--accent-secondary)',
    migrate: 'var(--accent-emerald)',
    budget: 'var(--accent-amber)',
    start: 'var(--accent-primary)',
  };

  const icons: Record<string, React.ReactNode> = {
    scan: <Activity size={12} />,
    vendor: <Shield size={12} />,
    migrate: <Server size={12} />,
    budget: <Activity size={12} />,
    start: <AlertTriangle size={12} />,
  };

  return (
    <div
      className="animate-slide-in"
      style={{
        animationDelay: `${index * 0.05}s`,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '12px',
        padding: '8px 12px',
        background: 'rgba(255,255,255,0.02)',
        borderRadius: '8px',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <div
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '6px',
          background: `${colors[event.type]}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: colors[event.type],
        }}
      >
        {icons[event.type]}
      </div>
      <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
        Day {event.day}
      </span>
      <span style={{ flex: 1 }}>{event.title}</span>
      {event.value && (
        <span
          className="font-mono"
          style={{
            color: colors[event.type],
            fontSize: '11px',
            padding: '2px 6px',
            background: `${colors[event.type]}10`,
            borderRadius: '4px',
          }}
        >
          {event.value}
        </span>
      )}
    </div>
  );
}

import React from 'react';
import {
  Shield,
  Activity,
  Server,
  Scan,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

interface SecurityDashboardProps {
  migrationProgress: number;
  criticalSystems: number;
  totalSystems: number;
  uptime: number;
}

export function SecurityDashboard({
  migrationProgress,
  criticalSystems,
  totalSystems,
  uptime,
}: SecurityDashboardProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
        Security Overview
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
        }}
      >
        <SecurityCard
          title="Encryption Status"
          value={`${Math.round(migrationProgress)}%`}
          subtitle="PQC Coverage"
          color="var(--accent-emerald)"
          icon={<Shield size={20} />}
        />
        <SecurityCard
          title="Vulnerable Systems"
          value={criticalSystems.toString()}
          subtitle={`of ${totalSystems} total`}
          color="var(--accent-rose)"
          icon={<AlertTriangle size={20} />}
        />
        <SecurityCard
          title="System Uptime"
          value={`${uptime.toFixed(1)}%`}
          subtitle="Last 24 hours"
          color="var(--accent-cyan)"
          icon={<Activity size={20} />}
        />
      </div>

      <div
        style={{
          background: 'var(--bg-tertiary)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <h3
          style={{ fontSize: '14px', fontWeight: 600, marginBottom: '20px' }}
        >
          Risk Assessment Matrix
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
          }}
        >
          {[
            {
              label: 'Quantum Risk',
              value: 100 - migrationProgress,
              color: 'var(--accent-rose)',
            },
            {
              label: 'Data Exposure',
              value: criticalSystems * 12.5,
              color: 'var(--accent-amber)',
            },
            {
              label: 'Compliance',
              value: migrationProgress * 0.8,
              color: 'var(--accent-primary)',
            },
            {
              label: 'Resilience',
              value: uptime - 98,
              color: 'var(--accent-emerald)',
            },
          ].map((metric, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div
                style={{
                  position: 'relative',
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 12px',
                }}
              >
                <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
                  <circle
                    cx="40"
                    cy="40"
                    r="35"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="6"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="35"
                    fill="none"
                    stroke={metric.color}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${(Math.min(metric.value, 100) / 100) * 220} 220`}
                    style={{ transition: 'stroke-dasharray 0.5s ease' }}
                  />
                </svg>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: 700,
                  }}
                >
                  {Math.round(Math.min(metric.value, 100))}%
                </div>
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                }}
              >
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          background: 'var(--bg-tertiary)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <h3
          style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}
        >
          Security Timeline
        </h3>
        <div
          style={{
            display: 'flex',
            gap: '16px',
            overflowX: 'auto',
            paddingBottom: '8px',
          }}
        >
          {[
            { phase: 'Discovery', complete: true, icon: <Scan size={16} /> },
            {
              phase: 'Assessment',
              complete: migrationProgress > 0,
              icon: <Activity size={16} />,
            },
            {
              phase: 'Migration',
              complete: migrationProgress > 50,
              icon: <Server size={16} />,
            },
            {
              phase: 'Validation',
              complete: migrationProgress > 80,
              icon: <Shield size={16} />,
            },
            {
              phase: 'Complete',
              complete: migrationProgress === 100,
              icon: <CheckCircle size={16} />,
            },
          ].map((step, i) => (
            <div
              key={i}
              style={{
                flex: '0 0 auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: step.complete
                    ? 'var(--gradient-primary)'
                    : 'var(--bg-secondary)',
                  border: step.complete ? 'none' : '2px solid var(--border-default)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: step.complete ? 'white' : 'var(--text-muted)',
                }}
              >
                {step.icon}
              </div>
              <span
                style={{
                  fontSize: '11px',
                  color: step.complete
                    ? 'var(--text-primary)'
                    : 'var(--text-muted)',
                  fontWeight: step.complete ? 500 : 400,
                }}
              >
                {step.phase}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface SecurityCardProps {
  title: string;
  value: string;
  subtitle: string;
  color: string;
  icon: React.ReactNode;
}

export function SecurityCard({
  title,
  value,
  subtitle,
  color,
  icon,
}: SecurityCardProps) {
  return (
    <div
      className="glass-card animate-slide-in-up"
      style={{
        borderRadius: '18px',
        padding: '24px',
        border: '1px solid var(--border-subtle)',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          opacity: 0.6,
        }}
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          marginBottom: '16px',
        }}
      >
        <div
          style={{
            color,
            padding: '8px',
            borderRadius: '10px',
            background: `${color}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </div>
        <span
          style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500 }}
        >
          {title}
        </span>
      </div>
      <div
        className="font-mono"
        style={{
          fontSize: '32px',
          fontWeight: 700,
          marginBottom: '6px',
          background: 'var(--gradient-primary)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
        {subtitle}
      </div>
    </div>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

export function TabButton({ active, onClick, icon, label }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={active ? 'animate-bounce' : ''}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 20px',
        background: active ? 'var(--gradient-primary)' : 'transparent',
        border: 'none',
        borderRadius: '12px',
        color: active ? 'white' : 'var(--text-secondary)',
        fontSize: '14px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        letterSpacing: '0.02em',
      }}
    >
      {active && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent)',
            animation: 'shimmer 2s ease-in-out infinite',
          }}
        />
      )}
      <span style={{ position: 'relative', zIndex: 1 }}>{icon}</span>
      <span style={{ position: 'relative', zIndex: 1 }}>{label}</span>
    </button>
  );
}

interface QuickStatProps {
  label: string;
  value: React.ReactNode;
}

export function QuickStat({ label, value }: QuickStatProps) {
  return (
    <div
      className="glass-card animate-slide-in-up"
      style={{
        padding: '16px',
        borderRadius: '14px',
        textAlign: 'center',
        border: '1px solid var(--border-subtle)',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background:
            'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.2), transparent)',
          opacity: 0,
          transition: 'opacity 0.3s ease',
        }}
      />
      <div
        style={{
          fontSize: '12px',
          color: 'var(--text-muted)',
          marginBottom: '6px',
          fontWeight: 500,
        }}
      >
        {label}
      </div>
      <div
        className="font-mono"
        style={{
          fontSize: '18px',
          fontWeight: 700,
          background: 'var(--gradient-primary)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {value}
      </div>
    </div>
  );
}

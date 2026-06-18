import { Bell, CheckCircle, AlertCircle, AlertTriangle, Info, Trophy, Target, Server, Activity } from 'lucide-react';
import type { GameState } from '../models';
import { StatCard } from './Dashboard';

interface NotificationPanelProps {
  state: GameState;
  threatLevel: string;
  budgetPercentage: number;
  migrationProgress: number;
}

export function NotificationPanel({ state, threatLevel, budgetPercentage, migrationProgress }: NotificationPanelProps) {
  const iconForType = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={14} />;
      case 'error':
        return <AlertCircle size={14} />;
      case 'warning':
        return <AlertTriangle size={14} />;
      case 'info':
        return <Info size={14} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{
        padding: '12px 16px',
        background: threatLevel === 'critical'
          ? 'rgba(244,63,94,0.12)'
          : threatLevel === 'high'
            ? 'rgba(245,158,11,0.12)'
            : threatLevel === 'medium'
              ? 'rgba(99,102,241,0.12)'
              : 'rgba(16,185,129,0.12)',
        border: `1px solid ${
          threatLevel === 'critical'
            ? 'rgba(244,63,94,0.35)'
            : threatLevel === 'high'
              ? 'rgba(245,158,11,0.35)'
              : threatLevel === 'medium'
                ? 'rgba(99,102,241,0.35)'
                : 'rgba(16,185,129,0.35)'
        }`,
        borderRadius: '14px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>Threat Level</div>
            <div style={{ fontSize: '16px', fontWeight: 700, textTransform: 'capitalize' }}>{threatLevel}</div>
          </div>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-primary)', boxShadow: '0 0 12px var(--accent-primary)' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <SecurityGauge value={migrationProgress} label="Security" color="var(--accent-emerald)" />
        <SecurityGauge value={100 - budgetPercentage} label="Budget Used" color="var(--accent-amber)" />
      </div>

      <div className="glass-card" style={{ padding: '20px', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={16} style={{ color: 'var(--accent-primary)' }} /> Activity Log
          </h3>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{state.notifications.length}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '260px', overflowY: 'auto' }}>
          {state.notifications.length === 0 ? (
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', padding: '36px 16px' }}>
              No recent activity.<br /><span style={{ fontSize: '12px' }}>Run a scan to begin.</span>
            </p>
          ) : (
            state.notifications.map((notif, index) => (
              <div key={notif.id} className={`notification notification-${notif.type} animate-slide-in`} style={{ animationDelay: `${index * 0.05}s` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>{iconForType(notif.type)}</div>
                  <span style={{ flex: 1, fontSize: '12px' }}>{notif.message}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="glass-card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Session Stats</span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400 }}>Day {state.day}/15</span>
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <StatCard icon={<Trophy size={14} />} label="Score" value={state.score.toLocaleString()} variant="default" />
          <StatCard icon={<Activity size={14} />} label="Events" value={state.events.length.toString()} variant="default" />
          <StatCard icon={<Server size={14} />} label="Migrated" value={`${state.totalSystemsMigrated}/8`} variant="default" />
          <StatCard icon={<Target size={14} />} label="Missions" value={`${state.missions.filter(m => m.isCompleted).length}/${state.missions.length}`} variant="default" />
        </div>
      </div>
    </div>
  );
}

function SecurityGauge({ value, label, color }: { value: number; label: string; color: string }) {
  const radius = 28;
  const stroke = 5;
  const normalized = Math.min(Math.max(value, 0), 100);
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (normalized / 100) * circumference;

  return (
    <div style={{ padding: '14px', background: 'var(--bg-tertiary)', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
        <svg width="70" height="70">
          <circle cx="35" cy="35" r={radius} fill="none" stroke="var(--bg-secondary)" strokeWidth={stroke} />
          <circle cx="35" cy="35" r={radius} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset 0.6s ease' }} />
          <text x="35" y="35" textAnchor="middle" dominantBaseline="middle" style={{ fill: 'white', fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
            {Math.round(normalized)}%
          </text>
        </svg>
      </div>
      <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', fontWeight: 500 }}>{label}</div>
    </div>
  );
}

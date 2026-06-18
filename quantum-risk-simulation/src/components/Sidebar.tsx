import { Scan, Users, SkipForward } from 'lucide-react';
import type { GameState } from '../models';
import { ProgressRing } from '../components';
import { ScoreBoard } from './ScoreBoard';
import { ThreatRadar } from './AdvancedVisuals';

interface SidebarProps {
  state: GameState;
  hasScannedSystems: boolean;
  startScan: () => void;
  openVendorModal: () => void;
  advanceDay: () => void;
}

export function Sidebar({
  state,
  hasScannedSystems,
  startScan,
  openVendorModal,
  advanceDay,
}: SidebarProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <ScoreBoard score={state.score} achievements={state.achievements} />
      <ThreatRadar threatLevel={100 - state.migrationProgress} />

      <div className="glass-card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-primary)', animation: 'pulse 2s infinite' }} />
          Quick Actions
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button className="btn btn-primary" onClick={startScan} disabled={state.isScanning || hasScannedSystems} style={{ width: '100%', opacity: (state.isScanning || hasScannedSystems) ? 0.5 : 1 }}>
            <Scan size={18} />
            {state.isScanning ? 'Scanning...' : hasScannedSystems ? 'Scan Complete' : 'Run Network Scan'}
          </button>
          <button className="btn btn-ghost" onClick={openVendorModal} style={{ width: '100%' }}>
            <Users size={18} />
            {state.selectedVendor ? state.selectedVendor.name : 'Select Vendor'}
          </button>
          <button className="btn btn-ghost" onClick={advanceDay} disabled={state.day >= 15} style={{ width: '100%', opacity: state.day >= 15 ? 0.5 : 1 }}>
            <SkipForward size={18} />
            {state.day >= 15 ? 'Sprint Complete' : 'Advance Day'}
          </button>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-secondary)' }}>Overall Security</h3>
        <ProgressRing progress={state.migrationProgress} size={140} label="Protected" />
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {state.migrationProgress === 0 ? 'Run a scan to begin' : state.migrationProgress < 50 ? 'Your infrastructure is at risk' : state.migrationProgress < 100 ? 'Making good progress!' : '🎉 All systems secured!'}
          </p>
        </div>
      </div>
    </div>
  );
}

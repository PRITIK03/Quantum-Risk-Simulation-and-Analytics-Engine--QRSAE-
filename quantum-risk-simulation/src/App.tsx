import { useState, useMemo } from 'react';
import {
  Shield,
  DollarSign,
  Activity,
  Server,
  Scan,
  Users,
  ChevronRight,
  SkipForward,
  AlertCircle,
  LayoutGrid,
  BarChart3,
  Target,
  Radar,
  Zap
} from 'lucide-react';
import './index.css';
import { useGameState } from './hooks/useGameState';
import {
  StatCard,
  ProgressRing,
  QDayCountdown,
  DayCounter,
  SecurityDashboard,
  TabButton,
} from './components';
import { VendorModal } from './components/VendorModal';
import { SystemsGrid } from './components/SystemsGrid';
import { MissionsPanel } from './components/MissionsPanel';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import { ScoreBoard } from './components/ScoreBoard';
import { NotificationPanel } from './components/NotificationPanel';
import { AIAssistant } from './components/AIAssistant';
import { AIToolsPanel } from './components/AIToolsPanel';
import { HexagonBackground, GlowingOrb, NetworkPulse, ThreatRadar } from './components/AdvancedVisuals';

type TabType = 'systems' | 'analytics' | 'missions' | 'security' | 'tools';

function App() {
  const { state, advanceDay, startScan, selectVendor, migrateSystem } = useGameState();
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('systems');

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    return `$${(amount / 1000).toFixed(0)}K`;
  };

  const budgetPercentage = useMemo(() => Math.round((state.budget / state.maxBudget) * 100), [state.budget, state.maxBudget]);
  const criticalSystems = useMemo(() => state.systems.filter(s => s.riskLevel === 'critical' && !s.isMigrated).length, [state.systems]);
  const systemsData = useMemo(() => ({
    critical: state.systems.filter(s => s.riskLevel === 'critical').length,
    high: state.systems.filter(s => s.riskLevel === 'high').length,
    medium: state.systems.filter(s => s.riskLevel === 'medium').length,
    low: state.systems.filter(s => s.riskLevel === 'low').length,
  }), [state.systems]);
  const hasScannedSystems = useMemo(() => state.systems.some(s => s.isScanned), [state.systems]);

  const threatLevel = useMemo(() => {
    if (criticalSystems >= 3) return 'critical';
    if (criticalSystems >= 2) return 'high';
    if (criticalSystems >= 1) return 'medium';
    return 'low';
  }, [criticalSystems]);

  const toolsData = useMemo(() => ({
    criticalSystems: systemsData.critical,
    highRiskSystems: systemsData.high,
    mediumRiskSystems: systemsData.medium,
    lowRiskSystems: systemsData.low,
    migrationProgress: state.migrationProgress,
    budget: state.budget,
    budgetUsed: state.maxBudget - state.budget,
    day: state.day,
    uptime: state.uptime,
    totalSystems: state.systems.length,
    migratedSystems: state.totalSystemsMigrated,
  }), [systemsData, state.migrationProgress, state.budget, state.maxBudget, state.day, state.uptime, state.systems.length, state.totalSystemsMigrated]);

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', padding: '24px', position: 'relative', overflow: 'hidden' }}>
      <HexagonBackground />
      <div style={{ position: 'fixed', top: '-100px', right: '-100px', zIndex: 0 }}>
        <GlowingOrb color="var(--accent-primary)" size={400} />
      </div>
      <div style={{ position: 'fixed', bottom: '-150px', left: '-150px', zIndex: 0 }}>
        <GlowingOrb color="var(--accent-cyan)" size={500} />
      </div>

      <div style={{ maxWidth: '1800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <header className="glass-card animate-slide-in" style={{
          padding: '24px 32px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          animationDelay: '0.1s'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div className="animate-float" style={{
              width: '56px',
              height: '56px',
              borderRadius: '18px',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 12px 32px rgba(99, 102, 241, 0.4)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)',
                animation: 'shimmer 3s ease-in-out infinite'
              }} />
              <Shield size={28} style={{ position: 'relative', zIndex: 1 }} />
            </div>
            <div>
              <h1 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '4px' }}>
                <span className="text-gradient animate-shimmer">Quantum Risk</span> Analyst
              </h1>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', letterSpacing: '0.02em' }}>
                Banking Infrastructure Security Simulation
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div className="animate-pulse" style={{ animationDelay: '0.5s' }}>
              <NetworkPulse active={state.migrationProgress >= 50} />
            </div>
            <div className="animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
              <QDayCountdown years={state.qDayCountdown} />
            </div>
            <div className="animate-slide-in-right" style={{ animationDelay: '0.3s' }}>
              <DayCounter day={state.day} maxDays={15} />
            </div>
          </div>
        </header>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          marginBottom: '24px'
        }}>
          <StatCard
            icon={<DollarSign size={24} />}
            label="Remaining Budget"
            value={formatCurrency(state.budget)}
            subtext={`${budgetPercentage}% of initial budget`}
            variant={budgetPercentage > 50 ? 'success' : budgetPercentage > 25 ? 'warning' : 'danger'}
            className="animate-slide-in-up"
            style={{ animationDelay: '0.1s' }}
          />
          <StatCard
            icon={<Activity size={24} />}
            label="System Uptime"
            value={`${state.uptime.toFixed(2)}%`}
            subtext="Target: >99.00%"
            trend={state.uptime > 99.5 ? 'up' : 'down'}
            variant={state.uptime > 99 ? 'success' : 'warning'}
            className="animate-slide-in-up"
            style={{ animationDelay: '0.2s' }}
          />
          <StatCard
            icon={<Server size={24} />}
            label="Migration Progress"
            value={`${state.migrationProgress}%`}
            subtext={`${state.totalSystemsMigrated}/${state.systems.length} systems secured`}
            variant={state.migrationProgress > 50 ? 'success' : 'default'}
            className="animate-slide-in-up"
            style={{ animationDelay: '0.3s' }}
          />
          <StatCard
            icon={<AlertCircle size={24} />}
            label="Critical Systems"
            value={criticalSystems}
            subtext={criticalSystems > 0 ? "Require immediate attention" : "All clear!"}
            variant={criticalSystems > 0 ? 'danger' : 'success'}
            className="animate-slide-in-up"
            style={{ animationDelay: '0.4s' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr 320px', gap: '24px' }}>
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
                <button className="btn btn-ghost" onClick={() => setIsVendorModalOpen(true)} style={{ width: '100%' }}>
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

          <div className="glass-card animate-fade-in" style={{ padding: '28px', display: 'flex', flexDirection: 'column', animationDelay: '0.3s' }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', padding: '6px', background: 'var(--bg-tertiary)', borderRadius: '16px', width: 'fit-content', border: '1px solid var(--border-subtle)' }}>
              <TabButton active={activeTab === 'systems'} onClick={() => setActiveTab('systems')} icon={<LayoutGrid size={18} />} label="Systems" />
              <TabButton active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} icon={<BarChart3 size={18} />} label="Analytics" />
              <TabButton active={activeTab === 'security'} onClick={() => setActiveTab('security')} icon={<Radar size={18} />} label="Security" />
              <TabButton active={activeTab === 'missions'} onClick={() => setActiveTab('missions')} icon={<Target size={18} />} label="Missions" />
              <TabButton active={activeTab === 'tools'} onClick={() => setActiveTab('tools')} icon={<Zap size={18} />} label="AI Tools" />
            </div>

            <div style={{ flex: 1, minHeight: 0 }}>
              {activeTab === 'systems' && (
                <>
                  {hasScannedSystems ? (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <div>
                          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>Discovered Systems</h2>
                          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Click a card to inspect and migrate systems.</p>
                        </div>
                        {!state.selectedVendor && (
                          <button className="btn btn-ghost" onClick={() => setIsVendorModalOpen(true)} style={{ fontSize: '13px' }}>
                            Select Vendor to Migrate <ChevronRight size={16} />
                          </button>
                        )}
                      </div>
                      <SystemsGrid systems={state.systems} onMigrate={migrateSystem} hasVendor={!!state.selectedVendor} />
                    </>
                  ) : (
                    <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>Run a network scan to discover vulnerable systems.</div>
                  )}
                </>
              )}
              {activeTab === 'analytics' && (
                <AnalyticsPanel budget={state.budget} maxBudget={state.maxBudget} migrationProgress={state.migrationProgress} uptime={state.uptime} day={state.day} events={state.events} systemsData={systemsData} />
              )}
              {activeTab === 'security' && (
                <SecurityDashboard migrationProgress={state.migrationProgress} criticalSystems={criticalSystems} totalSystems={state.systems.length} uptime={state.uptime} />
              )}
              {activeTab === 'missions' && <MissionsPanel missions={state.missions} currentDay={state.day} />}
              {activeTab === 'tools' && <AIToolsPanel systemData={toolsData} />}
            </div>
          </div>

          <NotificationPanel
            state={state}
            threatLevel={threatLevel}
            budgetPercentage={budgetPercentage}
            migrationProgress={state.migrationProgress}
          />
        </div>
      </div>

      <VendorModal isOpen={isVendorModalOpen} onClose={() => setIsVendorModalOpen(false)} onSelect={selectVendor} selectedVendor={state.selectedVendor} />
      <AIAssistant systemContext={{ criticalSystems, migrationProgress: state.migrationProgress, budget: state.budget, day: state.day }} />
    </div>
  );
}

export default App;

import { useState, useMemo, useCallback } from 'react';
import {
  Shield,
  DollarSign,
  Activity,
  Server,
  Scan,
  Users,
  ChevronRight,
  Bell,
  SkipForward,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  LayoutGrid,
  BarChart3,
  Target,
  Radar,
  Zap
} from 'lucide-react';
import './index.css';
import { useGameState } from './hooks/useGameState';
import { StatCard, ProgressRing, ScanAnimation, QDayCountdown, DayCounter } from './components/Dashboard';
import { VendorModal } from './components/VendorModal';
import { SystemsGrid } from './components/SystemsGrid';
import { MissionsPanel } from './components/MissionsPanel';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import { ScoreBoard } from './components/ScoreBoard';
import { ThreatRadar, RiskGauge, NetworkPulse, ThreatLevelIndicator, HexagonBackground, GlowingOrb, AnimatedCounter } from './components/AdvancedVisuals';
import { AIAssistant } from './components/AIAssistant';
import { AIToolsPanel } from './components/AIToolsPanel';

type TabType = 'systems' | 'analytics' | 'missions' | 'security' | 'tools';

function App() {
  const { state, rank, advanceDay, startScan, selectVendor, migrateSystem } = useGameState();
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('systems');

  const formatCurrency = useCallback((amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    return `$${(amount / 1000).toFixed(0)}K`;
  }, []);

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
      {/* Background Effects */}
      <HexagonBackground />
      <div style={{ position: 'fixed', top: '-100px', right: '-100px', zIndex: 0 }}>
        <GlowingOrb color="var(--accent-primary)" size={400} />
      </div>
      <div style={{ position: 'fixed', bottom: '-150px', left: '-150px', zIndex: 0 }}>
        <GlowingOrb color="var(--accent-cyan)" size={500} />
      </div>

      <div style={{ maxWidth: '1800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
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

        {/* Stats Row */}
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

        {/* Main Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr 320px', gap: '24px' }}>

          {/* Left Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Score Board */}
            <ScoreBoard
              score={state.score}
              rank={rank}
              achievements={state.achievements}
            />

            {/* Threat Radar */}
            <ThreatRadar threatLevel={100 - state.migrationProgress} />

            {/* Action Panel */}
            <div className="glass-card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--accent-primary)',
                  animation: 'pulse 2s infinite'
                }} />
                Quick Actions
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  className="btn btn-primary"
                  onClick={startScan}
                  disabled={state.isScanning || hasScannedSystems}
                  style={{
                    width: '100%',
                    opacity: (state.isScanning || hasScannedSystems) ? 0.5 : 1
                  }}
                >
                  <Scan size={18} />
                  {state.isScanning ? 'Scanning...' : hasScannedSystems ? 'Scan Complete' : 'Run Network Scan'}
                </button>

                <button
                  className="btn btn-ghost"
                  onClick={() => setIsVendorModalOpen(true)}
                  style={{ width: '100%' }}
                >
                  <Users size={18} />
                  {state.selectedVendor ? state.selectedVendor.name : 'Select Vendor'}
                </button>

                <button
                  className="btn btn-ghost"
                  onClick={advanceDay}
                  disabled={state.day >= 15}
                  style={{ width: '100%', opacity: state.day >= 15 ? 0.5 : 1 }}
                >
                  <SkipForward size={18} />
                  {state.day >= 15 ? 'Sprint Complete' : 'Advance Day'}
                </button>
              </div>
            </div>

            {/* Progress Ring */}
            <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-secondary)' }}>
                Overall Security
              </h3>
              <ProgressRing progress={state.migrationProgress} size={140} label="Protected" />
              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {state.migrationProgress === 0
                    ? 'Run a scan to begin'
                    : state.migrationProgress < 50
                      ? 'Your infrastructure is at risk'
                      : state.migrationProgress < 100
                        ? 'Making good progress!'
                        : '🎉 All systems secured!'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Center Content Area */}
          <div className="glass-card animate-fade-in" style={{ 
            padding: '28px', 
            display: 'flex', 
            flexDirection: 'column',
            animationDelay: '0.3s'
          }}>

            {/* Tab Navigation */}
            <div style={{
              display: 'flex',
              gap: '10px',
              marginBottom: '24px',
              padding: '6px',
              background: 'var(--bg-tertiary)',
              borderRadius: '16px',
              width: 'fit-content',
              border: '1px solid var(--border-subtle)'
            }}>
              <TabButton
                active={activeTab === 'systems'}
                onClick={() => setActiveTab('systems')}
                icon={<LayoutGrid size={18} />}
                label="Systems"
              />
              <TabButton
                active={activeTab === 'analytics'}
                onClick={() => setActiveTab('analytics')}
                icon={<BarChart3 size={18} />}
                label="Analytics"
              />
              <TabButton
                active={activeTab === 'security'}
                onClick={() => setActiveTab('security')}
                icon={<Radar size={18} />}
                label="Security"
              />
              <TabButton
                active={activeTab === 'missions'}
                onClick={() => setActiveTab('missions')}
                icon={<Target size={18} />}
                label="Missions"
              />
              <TabButton
                active={activeTab === 'tools'}
                onClick={() => setActiveTab('tools')}
                icon={<Zap size={18} />}
                label="AI Tools"
              />
            </div>

            {/* Tab Content */}
            <div style={{ flex: 1, minHeight: 0 }}>
              {activeTab === 'systems' && (
                <>
                  {/* Scan Animation */}
                  {(state.isScanning || !hasScannedSystems) && (
                    <div style={{ marginBottom: '24px' }}>
                      <ScanAnimation isScanning={state.isScanning} progress={state.scanningProgress} />
                    </div>
                  )}

                  {/* Systems Grid */}
                  {hasScannedSystems && (
                    <>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '20px'
                      }}>
                        <div>
                          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>
                            Discovered Systems
                          </h2>
                          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                            Click to migrate vulnerable systems to post-quantum encryption
                          </p>
                        </div>
                        {!state.selectedVendor && (
                          <button
                            className="btn btn-ghost"
                            onClick={() => setIsVendorModalOpen(true)}
                            style={{ fontSize: '13px' }}
                          >
                            Select Vendor to Migrate <ChevronRight size={16} />
                          </button>
                        )}
                      </div>
                      <div style={{ overflowY: 'auto', maxHeight: '500px' }}>
                        <SystemsGrid
                          systems={state.systems}
                          onMigrate={migrateSystem}
                          hasVendor={!!state.selectedVendor}
                        />
                      </div>
                    </>
                  )}
                </>
              )}

              {activeTab === 'analytics' && (
                <AnalyticsPanel
                  budget={state.budget}
                  maxBudget={state.maxBudget}
                  migrationProgress={state.migrationProgress}
                  uptime={state.uptime}
                  day={state.day}
                  events={state.events}
                  systemsData={systemsData}
                />
              )}

              {activeTab === 'security' && (
                <SecurityDashboard
                  migrationProgress={state.migrationProgress}
                  criticalSystems={criticalSystems}
                  totalSystems={state.systems.length}
                  uptime={state.uptime}
                />
              )}

              {activeTab === 'missions' && (
                <MissionsPanel
                  missions={state.missions}
                  currentDay={state.day}
                />
              )}

              {activeTab === 'tools' && (
                <AIToolsPanel systemData={toolsData} />
              )}
            </div>
          </div>

          {/* Right Sidebar - Notifications */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Threat Level */}
            <ThreatLevelIndicator level={threatLevel} />

            {/* Risk Gauges */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <RiskGauge value={state.migrationProgress} label="Security" color="var(--accent-emerald)" />
              <RiskGauge value={100 - budgetPercentage} label="Budget Used" color="var(--accent-amber)" />
            </div>

            {/* Notifications */}
            <div className="glass-card" style={{ padding: '20px', flex: 1 }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bell size={16} style={{ color: 'var(--accent-primary)' }} />
                Activity Log
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                {state.notifications.length === 0 ? (
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', padding: '40px 20px' }}>
                    No recent activity.<br />
                    <span style={{ fontSize: '12px' }}>Run a scan to begin.</span>
                  </p>
                ) : (
                  state.notifications.map((notif, index) => (
                    <div
                      key={notif.id}
                      className={`notification notification-${notif.type} animate-slide-in`}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      {notif.type === 'success' && <CheckCircle size={14} />}
                      {notif.type === 'error' && <AlertCircle size={14} />}
                      {notif.type === 'warning' && <AlertTriangle size={14} />}
                      {notif.type === 'info' && <Info size={14} />}
                      <span style={{ fontSize: '12px' }}>{notif.message}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="glass-card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>Session Stats</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <QuickStat label="Score" value={<AnimatedCounter value={state.score} />} />
                <QuickStat label="Day" value={`${state.day}/15`} />
                <QuickStat label="Migrated" value={`${state.totalSystemsMigrated}/8`} />
                <QuickStat label="Events" value={state.events.length.toString()} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vendor Modal */}
      <VendorModal
        isOpen={isVendorModalOpen}
        onClose={() => setIsVendorModalOpen(false)}
        onSelect={selectVendor}
        selectedVendor={state.selectedVendor}
      />

      {/* AI Assistant */}
      <AIAssistant
        systemContext={{
          criticalSystems,
          migrationProgress: state.migrationProgress,
          budget: state.budget,
          day: state.day
        }}
      />
    </div>
  );
}

// Security Dashboard Component
function SecurityDashboard({ migrationProgress, criticalSystems, totalSystems, uptime }: {
  migrationProgress: number;
  criticalSystems: number;
  totalSystems: number;
  uptime: number;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Security Overview</h2>

      {/* Security Status Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
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

      {/* Security Metrics */}
      <div style={{
        background: 'var(--bg-tertiary)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid var(--border-subtle)'
      }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '20px' }}>Risk Assessment Matrix</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {[
            { label: 'Quantum Risk', value: 100 - migrationProgress, color: 'var(--accent-rose)' },
            { label: 'Data Exposure', value: criticalSystems * 12.5, color: 'var(--accent-amber)' },
            { label: 'Compliance', value: migrationProgress * 0.8, color: 'var(--accent-primary)' },
            { label: 'Resilience', value: uptime - 98, color: 'var(--accent-emerald)' },
          ].map((metric, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{
                position: 'relative',
                width: '80px',
                height: '80px',
                margin: '0 auto 12px'
              }}>
                <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="40" cy="40" r="35" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                  <circle
                    cx="40" cy="40" r="35"
                    fill="none"
                    stroke={metric.color}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${(Math.min(metric.value, 100) / 100) * 220} 220`}
                    style={{ transition: 'stroke-dasharray 0.5s ease' }}
                  />
                </svg>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: 700
                }}>
                  {Math.round(Math.min(metric.value, 100))}%
                </div>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{metric.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div style={{
        background: 'var(--bg-tertiary)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid var(--border-subtle)'
      }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>Security Timeline</h3>
        <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
          {[
            { phase: 'Discovery', complete: true, icon: <Scan size={16} /> },
            { phase: 'Assessment', complete: migrationProgress > 0, icon: <Activity size={16} /> },
            { phase: 'Migration', complete: migrationProgress > 50, icon: <Server size={16} /> },
            { phase: 'Validation', complete: migrationProgress > 80, icon: <Shield size={16} /> },
            { phase: 'Complete', complete: migrationProgress === 100, icon: <CheckCircle size={16} /> },
          ].map((step, i) => (
            <div key={i} style={{
              flex: '0 0 auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: step.complete ? 'var(--gradient-primary)' : 'var(--bg-secondary)',
                border: step.complete ? 'none' : '2px solid var(--border-default)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: step.complete ? 'white' : 'var(--text-muted)'
              }}>
                {step.icon}
              </div>
              <span style={{
                fontSize: '11px',
                color: step.complete ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: step.complete ? 500 : 400
              }}>
                {step.phase}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Security Card Component - Enhanced
function SecurityCard({ title, value, subtitle, color, icon }: {
  title: string;
  value: string;
  subtitle: string;
  color: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="glass-card animate-slide-in-up" style={{
      borderRadius: '18px',
      padding: '24px',
      border: '1px solid var(--border-subtle)',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        opacity: 0.6
      }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
        <div style={{ 
          color,
          padding: '8px',
          borderRadius: '10px',
          background: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {icon}
        </div>
        <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500 }}>{title}</span>
      </div>
      <div className="font-mono" style={{ 
        fontSize: '32px', 
        fontWeight: 700, 
        marginBottom: '6px',
        background: 'var(--gradient-primary)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        {value}
      </div>
      <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{subtitle}</div>
    </div>
  );
}

// Tab Button Component - Enhanced
function TabButton({ active, onClick, icon, label }: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={active ? "animate-bounce" : ""}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 20px',
        background: active 
          ? 'var(--gradient-primary)' 
          : 'transparent',
        border: 'none',
        borderRadius: '12px',
        color: active 
          ? 'white' 
          : 'var(--text-secondary)',
        fontSize: '14px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        letterSpacing: '0.02em'
      }}
    >
      {active && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent)',
          animation: 'shimmer 2s ease-in-out infinite'
        }} />
      )}
      <span style={{ position: 'relative', zIndex: 1 }}>
        {icon}
      </span>
      <span style={{ position: 'relative', zIndex: 1 }}>
        {label}
      </span>
    </button>
  );
}

// Quick Stat Component - Enhanced
function QuickStat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="glass-card animate-slide-in-up" style={{
      padding: '16px',
      borderRadius: '14px',
      textAlign: 'center',
      border: '1px solid var(--border-subtle)',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.2), transparent)',
        opacity: 0,
        transition: 'opacity 0.3s ease'
      }} />
      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 500 }}>
        {label}
      </div>
      <div className="font-mono" style={{ 
        fontSize: '18px', 
        fontWeight: 700,
        background: 'var(--gradient-primary)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        {value}
      </div>
    </div>
  );
}

export default App;

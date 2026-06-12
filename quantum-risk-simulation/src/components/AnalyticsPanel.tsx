import { useState, useEffect } from 'react';
import { DollarSign, Shield, Activity, Server } from 'lucide-react';
import type { TimelineEvent } from '../models';
import {
  MetricCard,
  DonutChart,
  LegendItem,
  BarChart,
  TimelineChart,
  ActivityItem,
} from './common/Charts';

interface AnalyticsPanelProps {
    budget: number;
    maxBudget: number;
    migrationProgress: number;
    uptime: number;
    day: number;
    events: TimelineEvent[];
    systemsData: { critical: number; high: number; medium: number; low: number };
}

export function AnalyticsPanel({ budget, maxBudget, migrationProgress, uptime, day, events, systemsData }: AnalyticsPanelProps) {
    const budgetUsed = maxBudget - budget;
    const budgetPercent = Math.round((budgetUsed / maxBudget) * 100);

    const [animatedBudget, setAnimatedBudget] = useState(0);
    const [animatedProgress, setAnimatedProgress] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimatedBudget(budgetPercent);
            setAnimatedProgress(migrationProgress);
        }, 100);
        return () => clearTimeout(timer);
    }, [budgetPercent, migrationProgress]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflowY: 'auto' }}>

            {/* Top Row - Key Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                <MetricCard
                    icon={<DollarSign size={18} />}
                    label="Budget Used"
                    value={`$${(budgetUsed / 1000000).toFixed(1)}M`}
                    percent={animatedBudget}
                    color="var(--accent-rose)"
                    trend="up"
                />
                <MetricCard
                    icon={<Shield size={18} />}
                    label="Security"
                    value={`${migrationProgress}%`}
                    percent={animatedProgress}
                    color="var(--accent-emerald)"
                    trend={migrationProgress > 0 ? "up" : "neutral"}
                />
                <MetricCard
                    icon={<Activity size={18} />}
                    label="Uptime"
                    value={`${uptime.toFixed(2)}%`}
                    percent={uptime}
                    color="var(--accent-cyan)"
                    trend={uptime > 99.5 ? "up" : "down"}
                />
                <MetricCard
                    icon={<Server size={18} />}
                    label="Systems"
                    value={`${8 - systemsData.critical - systemsData.high}/8`}
                    percent={Math.round(((8 - systemsData.critical - systemsData.high) / 8) * 100)}
                    color="var(--accent-primary)"
                    trend="up"
                />
            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

                {/* Risk Distribution Donut Chart */}
                <div style={{
                    background: 'var(--bg-tertiary)',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid var(--border-subtle)'
                }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-secondary)' }}>
                        Risk Distribution
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <DonutChart data={systemsData} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <LegendItem color="var(--accent-rose)" label="Critical" value={systemsData.critical} />
                            <LegendItem color="var(--accent-amber)" label="High" value={systemsData.high} />
                            <LegendItem color="var(--accent-primary)" label="Medium" value={systemsData.medium} />
                            <LegendItem color="var(--accent-emerald)" label="Low/Secured" value={systemsData.low} />
                        </div>
                    </div>
                </div>

                {/* Budget Breakdown Bar Chart */}
                <div style={{
                    background: 'var(--bg-tertiary)',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid var(--border-subtle)'
                }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-secondary)' }}>
                        Budget Allocation
                    </h4>
                    <BarChart
                        data={[
                            { label: 'Scanning', value: 0.05, color: 'var(--accent-cyan)' },
                            { label: 'Vendor', value: 0, color: 'var(--accent-secondary)' },
                            { label: 'Migration', value: budgetUsed > 50000 ? (budgetUsed - 50000) / maxBudget : 0, color: 'var(--accent-primary)' },
                            { label: 'Reserved', value: budget / maxBudget, color: 'var(--accent-emerald)' },
                        ]}
                    />
                </div>
            </div>

            {/* Progress Over Time Line Chart */}
            <div style={{
                background: 'var(--bg-tertiary)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid var(--border-subtle)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        Sprint Progress Timeline
                    </h4>
                    <span className="font-mono" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Day {day} of 15
                    </span>
                </div>
                <TimelineChart currentDay={day} migrationProgress={migrationProgress} />
            </div>

            {/* Live Activity Feed */}
            <div style={{
                background: 'var(--bg-tertiary)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid var(--border-subtle)',
                flex: 1,
                minHeight: '150px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        Live Activity Feed
                    </h4>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '11px',
                        color: 'var(--accent-emerald)'
                    }}>
                        <span style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: 'var(--accent-emerald)',
                            animation: 'pulse 2s infinite'
                        }} />
                        Real-time
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '120px', overflowY: 'auto' }}>
                    {events.slice(0, 6).map((event, index) => (
                        <ActivityItem key={event.id} event={event} index={index} />
                    ))}
                    {events.length === 0 && (
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '24px' }}>
                            No activity yet — run a scan to begin
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

import type { JSX } from 'react';
import { Server, Database, Globe, Cpu, Lock, Check, ArrowRight } from 'lucide-react';
import type { BankingSystem } from '../models';

const typeIcons: Record<BankingSystem['type'], JSX.Element> = {
    payment: <Server size={18} />,
    database: <Database size={18} />,
    api: <Globe size={18} />,
    core: <Cpu size={18} />,
};

interface SystemsGridProps {
    systems: BankingSystem[];
    onMigrate: (id: string) => void;
    hasVendor: boolean;
}

export function SystemsGrid({ systems, onMigrate, hasVendor }: SystemsGridProps) {
    const scannedSystems = systems.filter(s => s.isScanned);

    if (scannedSystems.length === 0) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 20px',
                opacity: 0.5
            }}>
                <Lock size={40} style={{ marginBottom: '16px', color: 'var(--text-muted)' }} />
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', textAlign: 'center' }}>
                    Run a network scan to discover vulnerable systems
                </p>
            </div>
        );
    }

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
            {scannedSystems.map((system, index) => (
                <SystemCard
                    key={system.id}
                    system={system}
                    onMigrate={onMigrate}
                    hasVendor={hasVendor}
                    delay={index * 0.05}
                />
            ))}
        </div>
    );
}

interface SystemCardProps {
    system: BankingSystem;
    onMigrate: (id: string) => void;
    hasVendor: boolean;
    delay: number;
}

function SystemCard({ system, onMigrate, hasVendor, delay }: SystemCardProps) {
    const formatCost = (cost: number) => {
        return `$${(cost / 1000000).toFixed(0)}M`;
    };

    return (
        <div
            className="glass-card animate-fade-in"
            style={{
                padding: '16px',
                animationDelay: `${delay}s`,
                opacity: system.isMigrated ? 0.7 : 1,
                transition: 'all 0.3s ease',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: system.isMigrated ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-tertiary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: system.isMigrated ? 'var(--accent-emerald)' : 'var(--text-secondary)'
                    }}>
                        {system.isMigrated ? <Check size={18} /> : typeIcons[system.type]}
                    </div>
                    <div>
                        <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '2px' }}>{system.name}</h4>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                            {system.type}
                        </span>
                    </div>
                </div>
                <span className={`badge badge-${system.riskLevel}`}>
                    {system.riskLevel}
                </span>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                <div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px' }}>Encryption</div>
                    <div className="font-mono" style={{ fontSize: '12px', color: system.isMigrated ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                        {system.encryptionType}
                    </div>
                </div>
                <div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px' }}>Cost</div>
                    <div className="font-mono" style={{ fontSize: '12px' }}>
                        {formatCost(system.migrationCost)}
                    </div>
                </div>
                <div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px' }}>Time</div>
                    <div className="font-mono" style={{ fontSize: '12px' }}>
                        {system.migrationTime}d
                    </div>
                </div>
            </div>

            {!system.isMigrated && (
                <button
                    className="btn btn-ghost"
                    onClick={() => onMigrate(system.id)}
                    disabled={!hasVendor}
                    style={{
                        width: '100%',
                        padding: '10px',
                        fontSize: '12px',
                        opacity: hasVendor ? 1 : 0.5,
                        cursor: hasVendor ? 'pointer' : 'not-allowed'
                    }}
                >
                    {hasVendor ? (
                        <>
                            Migrate to PQC <ArrowRight size={14} />
                        </>
                    ) : (
                        'Select Vendor First'
                    )}
                </button>
            )}

            {system.isMigrated && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '10px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: 'var(--accent-emerald)',
                    fontWeight: 500
                }}>
                    <Check size={14} /> Migration Complete
                </div>
            )}
        </div>
    );
}

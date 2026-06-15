import { X, Shield, Clock, DollarSign, AlertTriangle, CheckCircle2, Server } from 'lucide-react';
import type { BankingSystem, Vendor } from '../../models';

interface SystemDetailDrawerProps {
  system: BankingSystem | null;
  vendors: Vendor[];
  selectedVendor: Vendor | null;
  isOpen: boolean;
  onClose: () => void;
  onMigrate: (id: string) => void;
}

export function SystemDetailDrawer({
  system,
  vendors,
  selectedVendor,
  isOpen,
  onClose,
  onMigrate,
}: SystemDetailDrawerProps) {
  if (!isOpen || !system) return null;

  const migrationCost = selectedVendor
    ? Math.round(system.migrationCost * selectedVendor.costMultiplier)
    : system.migrationCost;

  const vendorLabel = selectedVendor
    ? `${selectedVendor.name} (${selectedVendor.costMultiplier > 1 ? '+' : ''}${((selectedVendor.costMultiplier - 1) * 100).toFixed(0)}% cost, ${selectedVendor.speedMultiplier > 1 ? '+' : ''}${((selectedVendor.speedMultiplier - 1) * 100).toFixed(0)}% time)`
    : 'None selected';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
        }}
      />
      <div
        style={{
          position: 'relative',
          width: '420px',
          maxWidth: '90vw',
          height: '100vh',
          background: 'var(--bg-secondary)',
          borderLeft: '1px solid var(--border-subtle)',
          boxShadow: '-20px 0 60px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight 0.3s ease',
        }}
      >
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: system.isMigrated ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <Server size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.2 }}>
                {system.name}
              </h2>
              <span
                style={{
                  fontSize: '11px',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  background:
                    system.riskLevel === 'critical'
                      ? 'rgba(244, 63, 94, 0.2)'
                      : system.riskLevel === 'high'
                        ? 'rgba(245, 158, 11, 0.2)'
                        : system.riskLevel === 'medium'
                          ? 'rgba(99, 102, 241, 0.2)'
                          : 'rgba(16, 185, 129, 0.2)',
                  color:
                    system.riskLevel === 'critical'
                      ? 'var(--accent-rose)'
                      : system.riskLevel === 'high'
                        ? 'var(--accent-amber)'
                        : system.riskLevel === 'medium'
                          ? 'var(--accent-primary)'
                          : 'var(--accent-emerald)',
                }}
              >
                {system.riskLevel.toUpperCase()} RISK
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'var(--bg-tertiary)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {system.isMigrated ? (
            <div
              style={{
                padding: '16px',
                background: 'rgba(16,185,129,0.1)',
                border: '1px solid rgba(16,185,129,0.2)',
                borderRadius: '12px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <CheckCircle2 size={20} style={{ color: 'var(--accent-emerald)' }} />
              <div>
                <div style={{ fontWeight: 600, color: 'var(--accent-emerald)' }}>
                  Migration Complete
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    marginTop: '2px',
                  }}
                >
                  Secured with post-quantum cryptography
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                padding: '16px',
                background: 'rgba(244,63,94,0.1)',
                border: '1px solid rgba(244,63,94,0.2)',
                borderRadius: '12px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <AlertTriangle size={20} style={{ color: 'var(--accent-rose)' }} />
              <div>
                <div style={{ fontWeight: 600, color: 'var(--accent-rose)' }}>
                  Vulnerable to Quantum Attacks
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    marginTop: '2px',
                  }}
                >
                  Current encryption is not post-quantum safe
                </div>
              </div>
            </div>
          )}

          <div
            style={{
              display: 'grid',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                padding: '16px',
                background: 'var(--bg-tertiary)',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div
                style={{
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '8px',
                }}
              >
                Current Encryption
              </div>
              <div
                className="font-mono"
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: system.isMigrated
                    ? 'var(--accent-emerald)'
                    : 'var(--accent-rose)',
                }}
              >
                {system.encryptionType}
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
              }}
            >
              <div
                style={{
                  padding: '16px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div
                  style={{
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <DollarSign size={12} /> Est. Cost
                </div>
                <div
                  className="font-mono"
                  style={{ fontSize: '16px', fontWeight: 700 }}
                >
                  ${(migrationCost / 1000000).toFixed(1)}M
                </div>
              </div>
              <div
                style={{
                  padding: '16px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div
                  style={{
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Clock size={12} /> Duration
                </div>
                <div
                  className="font-mono"
                  style={{ fontSize: '16px', fontWeight: 700 }}
                >
                  {system.migrationTime} day
                  {system.migrationTime > 1 ? 's' : ''}
                </div>
              </div>
            </div>

            <div
              style={{
                padding: '16px',
                background: 'var(--bg-tertiary)',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div
                style={{
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Shield size={12} /> Partner Vendor
              </div>
              <div style={{ fontSize: '14px', fontWeight: 500 }}>
                {vendorLabel}
              </div>
            </div>

            {!system.isMigrated && selectedVendor && (
              <div
                style={{
                  padding: '16px',
                  background: 'rgba(99,102,241,0.1)',
                  borderRadius: '12px',
                  border: '1px solid rgba(99,102,241,0.2)',
                }}
              >
                <div
                  style={{
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    marginBottom: '8px',
                  }}
                >
                  MIGRATION IMPACT
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px',
                    fontSize: '12px',
                  }}
                >
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Cost:</span>{' '}
                    <span className="font-mono">${(migrationCost / 1e6).toFixed(1)}M</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Time:</span>{' '}
                    <span className="font-mono">
                      {(system.migrationTime * selectedVendor.speedMultiplier).toFixed(1)}d
                    </span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Budget After:</span>{' '}
                    <span className="font-mono" style={{ color: 'var(--accent-emerald)' }}>
                      Remaining
                    </span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Score:</span>{' '}
                    <span className="font-mono" style={{ color: 'var(--accent-amber)' }}>
                      +{system.riskLevel === 'critical' ? '1500' : '1000'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {!system.isMigrated && (
          <div
            style={{
              padding: '20px 24px',
              borderTop: '1px solid var(--border-subtle)',
              background: 'var(--bg-tertiary)',
            }}
          >
            <button
              className="btn btn-primary"
              onClick={() => onMigrate(system.id)}
              disabled={!selectedVendor}
              style={{
                width: '100%',
                opacity: !selectedVendor ? 0.5 : 1,
                cursor: !selectedVendor ? 'not-allowed' : 'pointer',
              }}
            >
              {selectedVendor ? (
                <>
                  Migrate to PQC — ${(migrationCost / 1e6).toFixed(1)}M
                </>
              ) : (
                'Select a Vendor to Migrate'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import { X } from 'lucide-react';
import { vendors, type Vendor } from '../hooks/useGameState';

interface VendorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (vendor: Vendor) => void;
    selectedVendor: Vendor | null;
}

export function VendorModal({ isOpen, onClose, onSelect, selectedVendor }: VendorModalProps) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div>
                        <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '4px' }}>Select PQC Vendor</h2>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                            Choose your post-quantum cryptography partner
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'var(--bg-tertiary)',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px',
                            cursor: 'pointer',
                            color: 'var(--text-secondary)'
                        }}
                    >
                        <X size={18} />
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {vendors.map((vendor, index) => (
                        <div
                            key={vendor.id}
                            onClick={() => onSelect(vendor)}
                            className="animate-fade-in"
                            style={{
                                animationDelay: `${index * 0.1}s`,
                                padding: '20px',
                                background: selectedVendor?.id === vendor.id
                                    ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15))'
                                    : 'var(--bg-tertiary)',
                                border: selectedVendor?.id === vendor.id
                                    ? '2px solid var(--accent-primary)'
                                    : '1px solid var(--border-subtle)',
                                borderRadius: '14px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                <div style={{
                                    fontSize: '32px',
                                    width: '56px',
                                    height: '56px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'var(--bg-secondary)',
                                    borderRadius: '12px'
                                }}>
                                    {vendor.logo}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>{vendor.name}</h3>
                                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                                        {vendor.description}
                                    </p>
                                    <div style={{ display: 'flex', gap: '16px' }}>
                                        <Metric
                                            label="Cost"
                                            value={vendor.costMultiplier > 1 ? 'High' : vendor.costMultiplier < 1 ? 'Low' : 'Standard'}
                                            color={vendor.costMultiplier > 1 ? 'var(--accent-rose)' : vendor.costMultiplier < 1 ? 'var(--accent-emerald)' : 'var(--accent-primary)'}
                                        />
                                        <Metric
                                            label="Speed"
                                            value={vendor.speedMultiplier < 1 ? 'Fast' : vendor.speedMultiplier > 1 ? 'Slow' : 'Standard'}
                                            color={vendor.speedMultiplier < 1 ? 'var(--accent-emerald)' : vendor.speedMultiplier > 1 ? 'var(--accent-amber)' : 'var(--accent-primary)'}
                                        />
                                    </div>
                                </div>
                                {selectedVendor?.id === vendor.id && (
                                    <div style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '50%',
                                        background: 'var(--gradient-primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '12px'
                                    }}>
                                        ✓
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    className="btn btn-primary"
                    onClick={onClose}
                    disabled={!selectedVendor}
                    style={{
                        width: '100%',
                        marginTop: '24px',
                        opacity: selectedVendor ? 1 : 0.5,
                        cursor: selectedVendor ? 'pointer' : 'not-allowed'
                    }}
                >
                    Confirm Selection
                </button>
            </div>
        </div>
    );
}

function Metric({ label, value, color }: { label: string; value: string; color: string }) {
    return (
        <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>{label}</div>
            <div className="font-mono" style={{ fontSize: '13px', fontWeight: 600, color }}>{value}</div>
        </div>
    );
}

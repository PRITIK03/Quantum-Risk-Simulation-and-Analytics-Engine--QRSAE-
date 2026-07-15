import { Zap, TrendingUp, Shield, Clock } from 'lucide-react';
import type { ReactNode } from 'react';

interface StatCardProps {
    icon: ReactNode;
    label: string;
    value: string | number;
    subtext?: string;
    trend?: 'up' | 'down' | 'neutral';
    variant?: 'default' | 'success' | 'warning' | 'danger';
    className?: string;
    style?: React.CSSProperties;
}

const variantColors = {
    default: { glow: 'rgba(99, 102, 241, 0.1)' },
    success: { glow: 'rgba(16, 185, 129, 0.1)' },
    warning: { glow: 'rgba(245, 158, 11, 0.1)' },
    danger: { glow: 'rgba(244, 63, 94, 0.1)' },
};

export * from '../features/dashboard/Dashboard';

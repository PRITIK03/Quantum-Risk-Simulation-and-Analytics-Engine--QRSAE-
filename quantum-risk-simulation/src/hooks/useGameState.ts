import { useState, useCallback, useMemo } from 'react';
import type { BankingSystem, Vendor, Notification, GameState, Mission, Achievement, TimelineEvent } from '../models';

const initialSystems: BankingSystem[] = [
    { id: '1', name: 'Core Payment Gateway', type: 'payment', encryptionType: 'RSA-2048', riskLevel: 'critical', migrationCost: 15000000, migrationTime: 3, isMigrated: false, isScanned: false },
    { id: '2', name: 'Customer Database', type: 'database', encryptionType: 'RSA-2048', riskLevel: 'critical', migrationCost: 12000000, migrationTime: 2, isMigrated: false, isScanned: false },
    { id: '3', name: 'Mobile Banking API', type: 'api', encryptionType: 'SHA-256', riskLevel: 'high', migrationCost: 8000000, migrationTime: 2, isMigrated: false, isScanned: false },
    { id: '4', name: 'ATM Network Interface', type: 'core', encryptionType: 'RSA-2048', riskLevel: 'critical', migrationCost: 20000000, migrationTime: 4, isMigrated: false, isScanned: false },
    { id: '5', name: 'Internal Auth System', type: 'api', encryptionType: 'AES-256', riskLevel: 'medium', migrationCost: 5000000, migrationTime: 1, isMigrated: false, isScanned: false },
    { id: '6', name: 'Trading Platform', type: 'core', encryptionType: 'RSA-2048', riskLevel: 'critical', migrationCost: 25000000, migrationTime: 5, isMigrated: false, isScanned: false },
    { id: '7', name: 'Loan Processing Engine', type: 'database', encryptionType: 'RSA-2048', riskLevel: 'high', migrationCost: 10000000, migrationTime: 2, isMigrated: false, isScanned: false },
    { id: '8', name: 'Fraud Detection AI', type: 'api', encryptionType: 'AES-256', riskLevel: 'medium', migrationCost: 6000000, migrationTime: 1, isMigrated: false, isScanned: false },
];

const initialMissions: Mission[] = [
    { id: 'm1', title: 'First Scan', description: 'Run your first network vulnerability scan', reward: '+500 pts', requiredDay: 1, isCompleted: false, type: 'scan' },
    { id: 'm2', title: 'Partner Up', description: 'Select a PQC vendor partner', reward: '+300 pts', requiredDay: 1, isCompleted: false, type: 'vendor' },
    { id: 'm3', title: 'First Migration', description: 'Migrate your first system to PQC', reward: '+1000 pts', requiredDay: 1, isCompleted: false, type: 'migrate' },
    { id: 'm4', title: 'Critical Secured', description: 'Secure all critical systems', reward: '+2500 pts', requiredDay: 3, isCompleted: false, type: 'migrate', target: 4 },
    { id: 'm5', title: 'Budget Master', description: 'Complete with at least 20% budget remaining', reward: '+1500 pts', requiredDay: 5, isCompleted: false, type: 'budget' },
    { id: 'm6', title: 'Full Coverage', description: 'Migrate all 8 systems', reward: '+5000 pts', requiredDay: 10, isCompleted: false, type: 'migrate', target: 8 },
];

const initialAchievements: Achievement[] = [
    { id: 'a1', title: 'First Steps', icon: 'star', isUnlocked: false },
    { id: 'a2', title: 'Security Expert', icon: 'shield', isUnlocked: false },
    { id: 'a3', title: 'Speed Demon', icon: 'zap', isUnlocked: false },
    { id: 'a4', title: 'Time Manager', icon: 'clock', isUnlocked: false },
    { id: 'a5', title: 'Master Analyst', icon: 'award', isUnlocked: false },
];

export const vendors: Vendor[] = [
    { id: 'cloudFirst', name: 'CloudFirst Solutions', logo: '☁️', costMultiplier: 1.3, speedMultiplier: 0.7, description: 'Premium cloud-native PQC. Fast but expensive.' },
    { id: 'quantumShield', name: 'QuantumShield Inc', logo: '🛡️', costMultiplier: 1.0, speedMultiplier: 1.0, description: 'Balanced approach. Industry standard rates.' },
    { id: 'quickPay', name: 'QuickPay Networks', logo: '⚡', costMultiplier: 0.8, speedMultiplier: 1.4, description: 'Budget-friendly but slower deployment.' },
];

export function useGameState() {
    const [state, setState] = useState<GameState>({
        day: 1,
        budget: 100000000,
        maxBudget: 100000000,
        uptime: 99.99,
        migrationProgress: 0,
        systems: initialSystems,
        selectedVendor: null,
        notifications: [],
        qDayCountdown: 4,
        totalSystemsMigrated: 0,
        isScanning: false,
        scanningProgress: 0,
        score: 0,
        events: [{ id: 'e0', day: 1, type: 'start', title: 'Simulation started' }],
        missions: initialMissions,
        achievements: initialAchievements,
    });

    const addNotification = useCallback((type: Notification['type'], message: string) => {
        const notification: Notification = {
            id: Date.now().toString(),
            type,
            message,
            timestamp: new Date(),
        };
        setState(prev => ({
            ...prev,
            notifications: [notification, ...prev.notifications].slice(0, 5),
        }));
    }, []);

    const addEvent = useCallback((type: TimelineEvent['type'], title: string, value?: string) => {
        setState(prev => ({
            ...prev,
            events: [{ id: Date.now().toString(), day: prev.day, type, title, value }, ...prev.events].slice(0, 20),
        }));
    }, []);

    const updateMissions = useCallback((updates: Partial<Record<string, boolean>>) => {
        setState(prev => {
            let newScore = prev.score;
            const updatedMissions = prev.missions.map(m => {
                if (updates[m.id] && !m.isCompleted) {
                    const points = parseInt(m.reward.replace(/[^0-9]/g, '')) || 0;
                    newScore += points;
                    return { ...m, isCompleted: true };
                }
                return m;
            });
            return { ...prev, missions: updatedMissions, score: newScore };
        });
    }, []);

    const updateAchievements = useCallback((achievementId: string) => {
        setState(prev => ({
            ...prev,
            achievements: prev.achievements.map(a =>
                a.id === achievementId ? { ...a, isUnlocked: true } : a
            ),
        }));
    }, []);

    const advanceDay = useCallback(() => {
        setState(prev => {
            if (prev.day >= 15) return prev;
            const newDay = prev.day + 1;
            const uptimeChange = Math.random() * 0.02 - 0.01;
            return {
                ...prev,
                day: newDay,
                uptime: Math.min(99.99, Math.max(98.5, prev.uptime + uptimeChange)),
                score: prev.score + 50,
            };
        });
        addNotification('info', `Day ${state.day + 1} begins. Review your objectives.`);
        addEvent('start', `Day ${state.day + 1} started`);
    }, [state.day, addNotification, addEvent]);

    const startScan = useCallback(() => {
        if (state.isScanning) return;

        setState(prev => ({ ...prev, isScanning: true, scanningProgress: 0 }));
        addNotification('info', 'Initiating network vulnerability scan...');

        const scanInterval = setInterval(() => {
            setState(prev => {
                const newProgress = prev.scanningProgress + Math.random() * 15 + 5;
                if (newProgress >= 100) {
                    clearInterval(scanInterval);
                    const scannedSystems = prev.systems.map(s => ({ ...s, isScanned: true }));
                    return {
                        ...prev,
                        isScanning: false,
                        scanningProgress: 100,
                        systems: scannedSystems,
                        budget: prev.budget - 50000,
                        score: prev.score + 500,
                    };
                }
                return { ...prev, scanningProgress: newProgress };
            });
        }, 200);

        setTimeout(() => {
            addEvent('scan', 'Network scan completed', '8 systems');
            updateMissions({ m1: true });
            updateAchievements('a1');
            addNotification('success', 'Scan complete! 8 vulnerable systems discovered.');
        }, 2500);
    }, [state.isScanning, addNotification, addEvent, updateMissions, updateAchievements]);

    const selectVendor = useCallback((vendor: Vendor) => {
        setState(prev => ({ ...prev, selectedVendor: vendor, score: prev.score + 300 }));
        addNotification('success', `${vendor.name} selected as PQC partner.`);
        addEvent('vendor', `Partnered with ${vendor.name}`);
        updateMissions({ m2: true });
    }, [addNotification, addEvent, updateMissions]);

    const migrateSystem = useCallback((systemId: string) => {
        setState(prev => {
            if (!prev.selectedVendor) {
                addNotification('error', 'Select a vendor before migrating.');
                return prev;
            }

            const system = prev.systems.find(s => s.id === systemId);
            if (!system || system.isMigrated) return prev;

            const cost = Math.round(system.migrationCost * prev.selectedVendor.costMultiplier);
            if (prev.budget < cost) {
                addNotification('error', 'Insufficient budget for migration.');
                return prev;
            }

            const updatedSystems = prev.systems.map(s =>
                s.id === systemId ? { ...s, isMigrated: true, encryptionType: 'PQC-Ready' as const, riskLevel: 'low' as const } : s
            );

            const migrated = updatedSystems.filter(s => s.isMigrated).length;
            const progress = Math.round((migrated / updatedSystems.length) * 100);
            const criticalMigrated = updatedSystems.filter(s => s.isMigrated && initialSystems.find(is => is.id === s.id)?.riskLevel === 'critical').length;

            // Check mission completions
            const missionUpdates: Record<string, boolean> = {};
            if (migrated === 1) missionUpdates.m3 = true;
            if (criticalMigrated >= 4) missionUpdates.m4 = true;
            if (migrated >= 8) missionUpdates.m6 = true;

            return {
                ...prev,
                systems: updatedSystems,
                budget: prev.budget - cost,
                totalSystemsMigrated: migrated,
                migrationProgress: progress,
                score: prev.score + 1000 + (system.riskLevel === 'critical' ? 500 : 0),
            };
        });

        // Get system name for event
        const system = state.systems.find(s => s.id === systemId);
        if (system) {
            addNotification('success', `${system.name} migrated to PQC.`);
            addEvent('migrate', `${system.name} secured`, 'PQC-Ready');

            const migrated = state.systems.filter(s => s.isMigrated).length + 1;
            const missionUpdates: Record<string, boolean> = {};
            if (migrated === 1) missionUpdates.m3 = true;
            updateMissions(missionUpdates);

            if (migrated >= 4) updateAchievements('a2');
            if (migrated >= 8) updateAchievements('a5');
        }
    }, [state.systems, addNotification, addEvent, updateMissions, updateAchievements]);

    const rank = useMemo(() => {
        if (state.score >= 10000) return 'Quantum Master';
        if (state.score >= 5000) return 'Security Expert';
        if (state.score >= 2000) return 'Risk Analyst';
        if (state.score >= 500) return 'Junior Analyst';
        return 'Trainee';
    }, [state.score]);

    return {
        state,
        rank,
        advanceDay,
        startScan,
        selectVendor,
        migrateSystem,
        addNotification,
    };
}

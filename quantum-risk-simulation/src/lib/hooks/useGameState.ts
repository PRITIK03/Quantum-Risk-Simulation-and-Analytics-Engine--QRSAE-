import { useState, useCallback, useMemo } from 'react';
import type { Vendor, Notification, GameState, TimelineEvent } from '../../models';
import { initialSystems, initialMissions, initialAchievements } from '../../models';

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
                    return {
                        ...prev,
                        isScanning: false,
                        scanningProgress: 100,
                        systems: prev.systems.map(s => ({ ...s, isScanned: true })),
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
            addNotification('success', 'Scan complete! All vulnerable systems discovered.');
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
                return prev;
            }

            const system = prev.systems.find(s => s.id === systemId);
            if (!system || system.isMigrated) return prev;

            const cost = Math.round(system.migrationCost * prev.selectedVendor.costMultiplier);
            if (prev.budget < cost) {
                return prev;
            }

            const updatedSystems = prev.systems.map(s =>
                s.id === systemId ? { ...s, isMigrated: true, encryptionType: 'PQC-Ready' as const, riskLevel: 'low' as const } : s
            );

            const migrated = updatedSystems.filter(s => s.isMigrated).length;
            const progress = Math.round((migrated / updatedSystems.length) * 100);

            return {
                ...prev,
                systems: updatedSystems,
                budget: prev.budget - cost,
                totalSystemsMigrated: migrated,
                migrationProgress: progress,
                score: prev.score + 1000 + (system.riskLevel === 'critical' ? 500 : 0),
            };
        });

        const system = state.systems.find(s => s.id === systemId);
        if (system) {
            addNotification('success', `${system.name} migrated to PQC.`);
            addEvent('migrate', `${system.name} secured`, 'PQC-Ready');

            const migrated = state.systems.filter(s => s.isMigrated).length + 1;
            if (migrated === 1) updateMissions({ m3: true });

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

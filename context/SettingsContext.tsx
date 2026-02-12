// Settings Context - shared reactive settings state across all screens
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Settings, getSettings, saveSettings } from '../store/alarmStore';

interface SettingsContextType {
    settings: Settings | null;
    loading: boolean;
    updateSettings: (updates: Partial<Settings>) => Promise<void>;
    refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType>({
    settings: null,
    loading: true,
    updateSettings: async () => { },
    refreshSettings: async () => { },
});

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<Settings | null>(null);
    const [loading, setLoading] = useState(true);

    const loadSettings = useCallback(async () => {
        setLoading(true);
        const data = await getSettings();
        setSettings(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        loadSettings();
    }, [loadSettings]);

    const update = useCallback(async (updates: Partial<Settings>) => {
        // Optimistic update for instant UI response
        setSettings(prev => prev ? { ...prev, ...updates } : prev);
        await saveSettings(updates);
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, loading, updateSettings: update, refreshSettings: loadSettings }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettingsContext() {
    return useContext(SettingsContext);
}

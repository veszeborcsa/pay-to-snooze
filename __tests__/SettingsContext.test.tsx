// Tests for context/SettingsContext.tsx
import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SettingsProvider, useSettingsContext } from '../context/SettingsContext';

// Reset store between tests
beforeEach(() => {
    (AsyncStorage as any).__resetStore();
    jest.clearAllMocks();
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <SettingsProvider>{children}</SettingsProvider>
);

describe('SettingsProvider', () => {
    it('loads default settings on mount', async () => {
        const { result } = renderHook(() => useSettingsContext(), { wrapper });

        // Initially loading
        expect(result.current.loading).toBe(true);

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.settings).toBeDefined();
        expect(result.current.settings!.language).toBe('en');
        expect(result.current.settings!.defaultSnoozePrice).toBe(1);
        expect(result.current.settings!.totalSpentOnSnoozing).toBe(0);
    });

    it('loads existing settings from storage', async () => {
        await AsyncStorage.setItem(
            '@snoozepay_settings',
            JSON.stringify({ language: 'hu', defaultSnoozePrice: 5 }),
        );

        const { result } = renderHook(() => useSettingsContext(), { wrapper });

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.settings!.language).toBe('hu');
        expect(result.current.settings!.defaultSnoozePrice).toBe(5);
        // Defaults still filled in
        expect(result.current.settings!.defaultSnoozeDuration).toBe(1);
    });

    it('updateSettings optimistically updates state', async () => {
        const { result } = renderHook(() => useSettingsContext(), { wrapper });

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        await act(async () => {
            await result.current.updateSettings({ language: 'de' });
        });

        expect(result.current.settings!.language).toBe('de');

        // Should also be persisted to AsyncStorage
        const stored = await AsyncStorage.getItem('@snoozepay_settings');
        expect(JSON.parse(stored!).language).toBe('de');
    });

    it('refreshSettings reloads from storage', async () => {
        const { result } = renderHook(() => useSettingsContext(), { wrapper });

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        // Manually change storage
        await AsyncStorage.setItem(
            '@snoozepay_settings',
            JSON.stringify({
                defaultSnoozePrice: 1,
                defaultSnoozeDuration: 1,
                defaultSound: 'default',
                totalSpentOnSnoozing: 99,
                language: 'es',
                startDayOfWeek: 0,
            }),
        );

        await act(async () => {
            await result.current.refreshSettings();
        });

        expect(result.current.settings!.language).toBe('es');
        expect(result.current.settings!.totalSpentOnSnoozing).toBe(99);
    });
});

describe('useSettingsContext', () => {
    it('returns context with all expected properties', async () => {
        const { result } = renderHook(() => useSettingsContext(), { wrapper });

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current).toHaveProperty('settings');
        expect(result.current).toHaveProperty('loading');
        expect(result.current).toHaveProperty('updateSettings');
        expect(result.current).toHaveProperty('refreshSettings');
        expect(typeof result.current.updateSettings).toBe('function');
        expect(typeof result.current.refreshSettings).toBe('function');
    });
});

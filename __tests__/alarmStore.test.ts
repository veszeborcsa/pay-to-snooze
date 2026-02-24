// Tests for store/alarmStore.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    getAlarms,
    saveAlarms,
    addAlarm,
    updateAlarm,
    deleteAlarm,
    toggleAlarm,
    getSettings,
    saveSettings,
    addSnoozeSpending,
    Alarm,
    Settings,
} from '../store/alarmStore';

// Reset AsyncStorage between tests
beforeEach(() => {
    (AsyncStorage as any).__resetStore();
    jest.clearAllMocks();
});

// ===================== ALARM CRUD =====================

describe('getAlarms', () => {
    it('returns empty array when no data stored', async () => {
        const alarms = await getAlarms();
        expect(alarms).toEqual([]);
    });

    it('returns parsed alarms from storage', async () => {
        const mockAlarms: Alarm[] = [
            {
                id: '1',
                time: '07:30',
                label: 'Morning',
                enabled: true,
                repeatDays: [1, 2, 3, 4, 5],
                snoozePrice: 2,
                snoozeDuration: 5,
                sound: 'default',
                vibrate: true,
            },
        ];
        await AsyncStorage.setItem('@snoozepay_alarms', JSON.stringify(mockAlarms));

        const alarms = await getAlarms();
        expect(alarms).toEqual(mockAlarms);
        expect(alarms).toHaveLength(1);
        expect(alarms[0].label).toBe('Morning');
    });

    it('returns empty array on parse error', async () => {
        await AsyncStorage.setItem('@snoozepay_alarms', 'not-json{{{');
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

        const alarms = await getAlarms();
        expect(alarms).toEqual([]);

        consoleSpy.mockRestore();
    });
});

describe('saveAlarms', () => {
    it('serializes and writes alarms to storage', async () => {
        const alarms: Alarm[] = [
            {
                id: '42',
                time: '08:00',
                label: 'Test',
                enabled: true,
                repeatDays: [],
                snoozePrice: 1,
                snoozeDuration: 1,
                sound: 'default',
                vibrate: true,
            },
        ];

        await saveAlarms(alarms);

        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
            '@snoozepay_alarms',
            JSON.stringify(alarms),
        );

        const stored = await AsyncStorage.getItem('@snoozepay_alarms');
        expect(JSON.parse(stored!)).toEqual(alarms);
    });
});

describe('addAlarm', () => {
    it('generates an ID and appends alarm to store', async () => {
        const alarmData = {
            time: '06:00',
            label: 'Early',
            enabled: true,
            repeatDays: [0, 6],
            snoozePrice: 5,
            snoozeDuration: 10,
            sound: 'default',
            vibrate: false,
        };

        const result = await addAlarm(alarmData);

        // Should have an auto-generated ID
        expect(result.id).toBeDefined();
        expect(typeof result.id).toBe('string');
        expect(result.id.length).toBeGreaterThan(0);

        // All other fields should match
        expect(result.time).toBe('06:00');
        expect(result.label).toBe('Early');
        expect(result.snoozePrice).toBe(5);

        // Store should contain the alarm
        const stored = await getAlarms();
        expect(stored).toHaveLength(1);
        expect(stored[0].id).toBe(result.id);
    });

    it('appends to existing alarms', async () => {
        await addAlarm({
            time: '07:00',
            label: 'First',
            enabled: true,
            repeatDays: [],
            snoozePrice: 1,
            snoozeDuration: 1,
            sound: 'default',
            vibrate: true,
        });

        await addAlarm({
            time: '08:00',
            label: 'Second',
            enabled: true,
            repeatDays: [],
            snoozePrice: 2,
            snoozeDuration: 5,
            sound: 'default',
            vibrate: true,
        });

        const alarms = await getAlarms();
        expect(alarms).toHaveLength(2);
        expect(alarms[0].label).toBe('First');
        expect(alarms[1].label).toBe('Second');
    });
});

describe('updateAlarm', () => {
    it('merges partial updates into existing alarm', async () => {
        const alarm = await addAlarm({
            time: '07:00',
            label: 'Original',
            enabled: true,
            repeatDays: [],
            snoozePrice: 1,
            snoozeDuration: 1,
            sound: 'default',
            vibrate: true,
        });

        await updateAlarm(alarm.id, { label: 'Updated', snoozePrice: 10 });

        const alarms = await getAlarms();
        expect(alarms[0].label).toBe('Updated');
        expect(alarms[0].snoozePrice).toBe(10);
        expect(alarms[0].time).toBe('07:00'); // unchanged
    });

    it('does nothing for unknown alarm ID', async () => {
        await addAlarm({
            time: '07:00',
            label: 'Test',
            enabled: true,
            repeatDays: [],
            snoozePrice: 1,
            snoozeDuration: 1,
            sound: 'default',
            vibrate: true,
        });

        await updateAlarm('nonexistent', { label: 'Hacked' });

        const alarms = await getAlarms();
        expect(alarms[0].label).toBe('Test'); // unchanged
    });
});

describe('deleteAlarm', () => {
    it('removes the correct alarm', async () => {
        // Use saveAlarms directly with explicit IDs to avoid Date.now() collision
        await saveAlarms([
            {
                id: 'keep-alarm',
                time: '07:00',
                label: 'Keep',
                enabled: true,
                repeatDays: [],
                snoozePrice: 1,
                snoozeDuration: 1,
                sound: 'default',
                vibrate: true,
            },
            {
                id: 'delete-alarm',
                time: '08:00',
                label: 'Delete',
                enabled: true,
                repeatDays: [],
                snoozePrice: 1,
                snoozeDuration: 1,
                sound: 'default',
                vibrate: true,
            },
        ]);

        await deleteAlarm('delete-alarm');

        const alarms = await getAlarms();
        expect(alarms).toHaveLength(1);
        expect(alarms[0].label).toBe('Keep');
    });

    it('does nothing for unknown alarm ID', async () => {
        await addAlarm({
            time: '07:00',
            label: 'Test',
            enabled: true,
            repeatDays: [],
            snoozePrice: 1,
            snoozeDuration: 1,
            sound: 'default',
            vibrate: true,
        });

        await deleteAlarm('nonexistent');

        const alarms = await getAlarms();
        expect(alarms).toHaveLength(1);
    });
});

describe('toggleAlarm', () => {
    it('flips enabled from true to false', async () => {
        const alarm = await addAlarm({
            time: '07:00',
            label: 'Toggle',
            enabled: true,
            repeatDays: [],
            snoozePrice: 1,
            snoozeDuration: 1,
            sound: 'default',
            vibrate: true,
        });

        await toggleAlarm(alarm.id);

        const alarms = await getAlarms();
        expect(alarms[0].enabled).toBe(false);
    });

    it('flips enabled from false to true', async () => {
        const alarm = await addAlarm({
            time: '07:00',
            label: 'Toggle',
            enabled: false,
            repeatDays: [],
            snoozePrice: 1,
            snoozeDuration: 1,
            sound: 'default',
            vibrate: true,
        });

        await toggleAlarm(alarm.id);

        const alarms = await getAlarms();
        expect(alarms[0].enabled).toBe(true);
    });

    it('does nothing for unknown alarm ID', async () => {
        const alarm = await addAlarm({
            time: '07:00',
            label: 'Test',
            enabled: true,
            repeatDays: [],
            snoozePrice: 1,
            snoozeDuration: 1,
            sound: 'default',
            vibrate: true,
        });

        await toggleAlarm('nonexistent');

        const alarms = await getAlarms();
        expect(alarms[0].enabled).toBe(true); // unchanged
    });
});

// ===================== SETTINGS =====================

describe('getSettings', () => {
    it('returns default settings when nothing stored', async () => {
        const settings = await getSettings();
        expect(settings).toEqual({
            defaultSnoozePrice: 1,
            defaultSnoozeDuration: 1,
            defaultSound: 'default',
            totalSpentOnSnoozing: 0,
            language: 'en',
            startDayOfWeek: 0,
            colorTheme: 'midnight',
        });
    });

    it('merges stored settings with defaults', async () => {
        await AsyncStorage.setItem(
            '@snoozepay_settings',
            JSON.stringify({ language: 'hu', defaultSnoozePrice: 5 }),
        );

        const settings = await getSettings();
        expect(settings.language).toBe('hu');
        expect(settings.defaultSnoozePrice).toBe(5);
        // Defaults still present
        expect(settings.defaultSnoozeDuration).toBe(1);
        expect(settings.totalSpentOnSnoozing).toBe(0);
    });

    it('returns defaults on parse error', async () => {
        await AsyncStorage.setItem('@snoozepay_settings', '{bad json');
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

        const settings = await getSettings();
        expect(settings.language).toBe('en');

        consoleSpy.mockRestore();
    });
});

describe('saveSettings', () => {
    it('merges partial updates into existing settings', async () => {
        await saveSettings({ language: 'de' });
        await saveSettings({ defaultSnoozePrice: 3 });

        const settings = await getSettings();
        expect(settings.language).toBe('de');
        expect(settings.defaultSnoozePrice).toBe(3);
    });
});

describe('addSnoozeSpending', () => {
    it('accumulates spending', async () => {
        await addSnoozeSpending(5);
        await addSnoozeSpending(3);

        const settings = await getSettings();
        expect(settings.totalSpentOnSnoozing).toBe(8);
    });

    it('works with default zero starting point', async () => {
        await addSnoozeSpending(1.5);

        const settings = await getSettings();
        expect(settings.totalSpentOnSnoozing).toBe(1.5);
    });
});

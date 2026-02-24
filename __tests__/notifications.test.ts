// Tests for services/notifications.ts
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import {
    requestNotificationPermissions,
    scheduleAlarmNotification,
    cancelAlarmNotification,
    cancelAllNotifications,
    scheduleSnoozeNotification,
} from '../services/notifications';
import { Alarm } from '../store/alarmStore';

// By default our jest.setup mocks Platform.OS = 'web'

const makeAlarm = (overrides: Partial<Alarm> = {}): Alarm => ({
    id: 'alarm-1',
    time: '07:30',
    label: 'Test Alarm',
    enabled: true,
    repeatDays: [],
    snoozePrice: 2,
    snoozeDuration: 5,
    sound: 'default',
    vibrate: true,
    ...overrides,
});

beforeEach(() => {
    jest.clearAllMocks();
});

describe('requestNotificationPermissions (web)', () => {
    it('returns true on web without calling native APIs', async () => {
        const result = await requestNotificationPermissions();
        expect(result).toBe(true);
        // Should NOT call native permission APIs on web
        expect(Notifications.getPermissionsAsync).not.toHaveBeenCalled();
    });
});

describe('scheduleAlarmNotification (web)', () => {
    it('returns null for disabled alarm', async () => {
        const alarm = makeAlarm({ enabled: false });
        const result = await scheduleAlarmNotification(alarm);
        expect(result).toBeNull();
    });

    it('returns null on web even for enabled alarm', async () => {
        const alarm = makeAlarm({ enabled: true });
        const result = await scheduleAlarmNotification(alarm);
        expect(result).toBeNull();
        expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
    });
});

describe('cancelAlarmNotification (web)', () => {
    it('no-ops on web', async () => {
        await cancelAlarmNotification('alarm-1');
        expect(Notifications.getAllScheduledNotificationsAsync).not.toHaveBeenCalled();
    });
});

describe('cancelAllNotifications (web)', () => {
    it('no-ops on web', async () => {
        await cancelAllNotifications();
        expect(Notifications.cancelAllScheduledNotificationsAsync).not.toHaveBeenCalled();
    });
});

describe('scheduleSnoozeNotification (web)', () => {
    it('returns null on web', async () => {
        const result = await scheduleSnoozeNotification('alarm-1', 5, 2, 'Test');
        expect(result).toBeNull();
        expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
    });
});

// ===================== Native platform tests =====================
// notifications.ts captures `isWeb` at module load time, so we must
// re-import the module with Platform.OS set to 'android' before import.

describe('notifications on native (android)', () => {
    let nativeNotifications: typeof import('../services/notifications');

    beforeAll(() => {
        // Change Platform.OS BEFORE re-importing
        (Platform as any).OS = 'android';

        // Use a fresh require to pick up the new Platform.OS value
        jest.resetModules();

        // Re-apply the mocks that jest.resetModules cleared
        jest.doMock('react-native', () => ({
            Platform: { OS: 'android', select: jest.fn((obj: any) => obj.android || obj.default) },
            StyleSheet: { create: (s: any) => s, absoluteFillObject: {} },
        }));
        jest.doMock('expo-notifications', () => ({
            setNotificationHandler: jest.fn(),
            getPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
            requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
            setNotificationChannelAsync: jest.fn(() => Promise.resolve()),
            scheduleNotificationAsync: jest.fn(() => Promise.resolve('mock-notification-id')),
            cancelScheduledNotificationAsync: jest.fn(() => Promise.resolve()),
            cancelAllScheduledNotificationsAsync: jest.fn(() => Promise.resolve()),
            getAllScheduledNotificationsAsync: jest.fn(() => Promise.resolve([])),
            AndroidImportance: { MAX: 5 },
            AndroidNotificationPriority: { MAX: 'max' },
            AndroidNotificationVisibility: { PUBLIC: 1 },
            SchedulableTriggerInputTypes: { DATE: 'date' },
        }));
        jest.doMock('@react-native-async-storage/async-storage', () => {
            const store: Record<string, string> = {};
            return {
                __esModule: true,
                default: {
                    getItem: jest.fn(async (key: string) => store[key] ?? null),
                    setItem: jest.fn(async (key: string, value: string) => { store[key] = value; }),
                },
            };
        });

        nativeNotifications = require('../services/notifications');
    });

    afterAll(() => {
        // Restore Platform.OS
        (Platform as any).OS = 'web';
        jest.resetModules();
    });

    it('requestNotificationPermissions requests permissions on native', async () => {
        const result = await nativeNotifications.requestNotificationPermissions();
        expect(result).toBe(true);
        const NativeNotifModule = require('expo-notifications');
        expect(NativeNotifModule.getPermissionsAsync).toHaveBeenCalled();
    });

    it('scheduleAlarmNotification schedules on native for enabled alarm', async () => {
        const NativeNotifModule = require('expo-notifications');
        NativeNotifModule.getAllScheduledNotificationsAsync.mockResolvedValue([]);

        const alarm = makeAlarm({ enabled: true });
        const result = await nativeNotifications.scheduleAlarmNotification(alarm);

        expect(result).toBe('mock-notification-id');
        expect(NativeNotifModule.scheduleNotificationAsync).toHaveBeenCalled();

        const call = NativeNotifModule.scheduleNotificationAsync.mock.calls[0][0];
        expect(call.content.title).toBe('⏰ Wake Up!');
        expect(call.content.data.alarmId).toBe('alarm-1');
        expect(call.content.data.snoozePrice).toBe(2);
    });

    it('scheduleAlarmNotification returns null for disabled alarm on native', async () => {
        const alarm = makeAlarm({ enabled: false });
        const result = await nativeNotifications.scheduleAlarmNotification(alarm);
        expect(result).toBeNull();
    });

    it('cancelAlarmNotification cancels matching notifications', async () => {
        const NativeNotifModule = require('expo-notifications');
        NativeNotifModule.getAllScheduledNotificationsAsync.mockResolvedValue([
            { identifier: 'notif-1', content: { data: { alarmId: 'alarm-1' } } },
            { identifier: 'notif-2', content: { data: { alarmId: 'alarm-2' } } },
        ]);

        await nativeNotifications.cancelAlarmNotification('alarm-1');

        expect(NativeNotifModule.cancelScheduledNotificationAsync).toHaveBeenCalledWith('notif-1');
        expect(NativeNotifModule.cancelScheduledNotificationAsync).not.toHaveBeenCalledWith('notif-2');
    });

    it('scheduleSnoozeNotification schedules on native', async () => {
        const NativeNotifModule = require('expo-notifications');
        NativeNotifModule.scheduleNotificationAsync.mockClear();

        const result = await nativeNotifications.scheduleSnoozeNotification('alarm-1', 5, 2, 'Snooze Label');

        expect(result).toBe('mock-notification-id');
        expect(NativeNotifModule.scheduleNotificationAsync).toHaveBeenCalledTimes(1);

        const call = NativeNotifModule.scheduleNotificationAsync.mock.calls[0][0];
        expect(call.content.title).toBe('⏰ Snooze Over!');
        expect(call.content.data.isSnooze).toBe(true);
    });
});

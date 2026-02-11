// Notification service for scheduling alarm notifications
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Alarm, getAlarms } from '../store/alarmStore';

const isWeb = Platform.OS === 'web';

// Configure notification behavior (native only)
if (!isWeb) {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
            shouldShowInForeground: true,
        }),
    });
}

// Request notification permissions
export async function requestNotificationPermissions(): Promise<boolean> {
    if (isWeb) {
        console.log('Notifications not supported on web');
        return true; // Return true so alarm creation still works
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        console.log('Notification permission not granted');
        return false;
    }

    // Android-specific channel
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('alarms', {
            name: 'Alarms',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            sound: 'default',
            lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
            bypassDnd: true,
        });
    }

    return true;
}

// Schedule an alarm notification
export async function scheduleAlarmNotification(alarm: Alarm): Promise<string | null> {
    if (!alarm.enabled) return null;
    if (isWeb) {
        console.log(`[Web] Alarm ${alarm.id} saved (notifications not available on web)`);
        return null;
    }

    // Cancel existing notification for this alarm
    await cancelAlarmNotification(alarm.id);

    const [hours, minutes] = alarm.time.split(':').map(Number);

    // Calculate next trigger time
    const now = new Date();
    const trigger = new Date();
    trigger.setHours(hours, minutes, 0, 0);

    // If the time has passed today, schedule for tomorrow
    if (trigger <= now) {
        trigger.setDate(trigger.getDate() + 1);
    }

    // If repeat days are set, find the next matching day
    if (alarm.repeatDays.length > 0) {
        let daysToAdd = 0;
        const currentDay = trigger.getDay();

        // Find the next day that matches
        for (let i = 0; i < 7; i++) {
            const checkDay = (currentDay + i) % 7;
            if (alarm.repeatDays.includes(checkDay)) {
                daysToAdd = i;
                break;
            }
        }

        if (daysToAdd > 0 || !alarm.repeatDays.includes(currentDay)) {
            trigger.setDate(trigger.getDate() + daysToAdd);
        }
    }

    try {
        const identifier = await Notifications.scheduleNotificationAsync({
            content: {
                title: '⏰ Wake Up!',
                body: alarm.label || 'Time to wake up!',
                data: {
                    alarmId: alarm.id,
                    snoozePrice: alarm.snoozePrice,
                    snoozeDuration: alarm.snoozeDuration,
                },
                sound: 'default',
                priority: Notifications.AndroidNotificationPriority.MAX,
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: trigger,
            },
        });

        console.log(`Scheduled alarm ${alarm.id} for ${trigger.toLocaleString()}`);
        return identifier;
    } catch (error) {
        console.error('Error scheduling notification:', error);
        return null;
    }
}

// Cancel a scheduled alarm notification
export async function cancelAlarmNotification(alarmId: string): Promise<void> {
    if (isWeb) return;

    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const notification of scheduled) {
        if (notification.content.data?.alarmId === alarmId) {
            await Notifications.cancelScheduledNotificationAsync(notification.identifier);
        }
    }
}

// Cancel all notifications
export async function cancelAllNotifications(): Promise<void> {
    if (isWeb) return;

    await Notifications.cancelAllScheduledNotificationsAsync();
}

// Reschedule all enabled alarms
export async function rescheduleAllAlarms(): Promise<void> {
    if (isWeb) return;

    const alarms = await getAlarms();
    for (const alarm of alarms) {
        if (alarm.enabled) {
            await scheduleAlarmNotification(alarm);
        }
    }
}

// Schedule a snooze notification
export async function scheduleSnoozeNotification(
    alarmId: string,
    snoozeDuration: number,
    snoozePrice: number,
    label: string
): Promise<string | null> {
    if (isWeb) {
        console.log(`[Web] Snooze for alarm ${alarmId} (notifications not available on web)`);
        return null;
    }

    const trigger = new Date(Date.now() + snoozeDuration * 60 * 1000);

    try {
        const identifier = await Notifications.scheduleNotificationAsync({
            content: {
                title: '⏰ Snooze Over!',
                body: label || 'Time to wake up!',
                data: {
                    alarmId,
                    snoozePrice,
                    snoozeDuration,
                    isSnooze: true,
                },
                sound: 'default',
                priority: Notifications.AndroidNotificationPriority.MAX,
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: trigger,
            },
        });

        return identifier;
    } catch (error) {
        console.error('Error scheduling snooze:', error);
        return null;
    }
}

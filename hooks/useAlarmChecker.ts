// Web alarm checker - polls alarm times and triggers ringing screen
import { useEffect, useRef, useCallback } from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { getAlarms, Alarm } from '../store/alarmStore';

// Track which alarms have already fired to avoid re-triggering
const firedAlarms = new Set<string>();

export function useAlarmChecker() {
    const router = useRouter();
    const isCheckingRef = useRef(false);

    const checkAlarms = useCallback(async () => {
        // Prevent overlapping checks
        if (isCheckingRef.current) return;
        isCheckingRef.current = true;

        try {
            const now = new Date();
            const currentHours = now.getHours();
            const currentMinutes = now.getMinutes();
            const currentDay = now.getDay(); // 0 = Sunday
            const currentTimeStr = `${String(currentHours).padStart(2, '0')}:${String(currentMinutes).padStart(2, '0')}`;

            // Clear fired alarms from previous minutes
            const firedKey = (id: string) => `${id}_${currentTimeStr}`;
            // Clean up old entries (from different minutes)
            for (const key of firedAlarms) {
                if (!key.endsWith(`_${currentTimeStr}`)) {
                    firedAlarms.delete(key);
                }
            }

            const alarms = await getAlarms();

            for (const alarm of alarms) {
                if (!alarm.enabled) continue;

                // Check if this alarm already fired this minute
                const key = firedKey(alarm.id);
                if (firedAlarms.has(key)) continue;

                // Check if time matches
                if (alarm.time !== currentTimeStr) continue;

                // Check if day matches (if repeat days are set)
                if (alarm.repeatDays.length > 0 && !alarm.repeatDays.includes(currentDay)) {
                    continue;
                }

                // Alarm should fire!
                firedAlarms.add(key);
                console.log(`[Web Alarm] Triggering alarm ${alarm.id} - ${alarm.label}`);

                router.push({
                    pathname: '/ringing',
                    params: {
                        alarmId: alarm.id,
                        label: alarm.label || 'Wake Up!',
                        snoozePrice: alarm.snoozePrice.toString(),
                        snoozeDuration: alarm.snoozeDuration.toString(),
                    },
                });

                // Only trigger one alarm at a time
                break;
            }
        } catch (error) {
            console.error('[Web Alarm] Error checking alarms:', error);
        } finally {
            isCheckingRef.current = false;
        }
    }, [router]);

    useEffect(() => {
        // Only run on web
        if (Platform.OS !== 'web') return;

        console.log('[Web Alarm] Starting alarm checker (every 10s)');

        // Check immediately on mount
        checkAlarms();

        // Then check every 10 seconds
        const interval = setInterval(checkAlarms, 10000);

        return () => {
            console.log('[Web Alarm] Stopping alarm checker');
            clearInterval(interval);
        };
    }, [checkAlarms]);
}

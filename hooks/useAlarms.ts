// Custom hooks for alarm operations
import { useState, useEffect, useCallback } from 'react';
import {
    Alarm,
    getAlarms,
    addAlarm,
    updateAlarm,
    deleteAlarm,
    toggleAlarm,
    Settings,
    getSettings,
    saveSettings,
} from '../store/alarmStore';
import { scheduleAlarmNotification, cancelAlarmNotification } from '../services/notifications';

export function useAlarms() {
    const [alarms, setAlarms] = useState<Alarm[]>([]);
    const [loading, setLoading] = useState(true);

    const loadAlarms = useCallback(async () => {
        setLoading(true);
        const data = await getAlarms();
        setAlarms(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        loadAlarms();
    }, [loadAlarms]);

    const createAlarm = useCallback(async (alarm: Omit<Alarm, 'id'>) => {
        const newAlarm = await addAlarm(alarm);
        if (newAlarm.enabled) {
            await scheduleAlarmNotification(newAlarm);
        }
        await loadAlarms();
        return newAlarm;
    }, [loadAlarms]);

    const editAlarm = useCallback(async (id: string, updates: Partial<Alarm>) => {
        await updateAlarm(id, updates);
        const updated = await getAlarms();
        const alarm = updated.find(a => a.id === id);
        if (alarm) {
            if (alarm.enabled) {
                await scheduleAlarmNotification(alarm);
            } else {
                await cancelAlarmNotification(id);
            }
        }
        await loadAlarms();
    }, [loadAlarms]);

    const removeAlarm = useCallback(async (id: string) => {
        await cancelAlarmNotification(id);
        await deleteAlarm(id);
        await loadAlarms();
    }, [loadAlarms]);

    const toggle = useCallback(async (id: string) => {
        await toggleAlarm(id);
        const updated = await getAlarms();
        const alarm = updated.find(a => a.id === id);
        if (alarm) {
            if (alarm.enabled) {
                await scheduleAlarmNotification(alarm);
            } else {
                await cancelAlarmNotification(id);
            }
        }
        await loadAlarms();
    }, [loadAlarms]);

    return {
        alarms,
        loading,
        createAlarm,
        editAlarm,
        removeAlarm,
        toggleAlarm: toggle,
        refreshAlarms: loadAlarms,
    };
}

export { useSettingsContext as useSettings } from '../context/SettingsContext';


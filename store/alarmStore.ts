// Alarm Store - manages alarm state with AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Alarm {
  id: string;
  time: string; // HH:MM format
  label: string;
  enabled: boolean;
  repeatDays: number[]; // 0-6, Sunday to Saturday
  snoozePrice: number; // in dollars, minimum 1
  snoozeDuration: number; // in minutes
  sound: string;
  vibrate: boolean;
}

const ALARMS_KEY = '@snoozepay_alarms';
const SETTINGS_KEY = '@snoozepay_settings';

export interface Settings {
  defaultSnoozePrice: number;
  defaultSnoozeDuration: number;
  defaultSound: string;
  totalSpentOnSnoozing: number;
}

const defaultSettings: Settings = {
  defaultSnoozePrice: 1,
  defaultSnoozeDuration: 9,
  defaultSound: 'default',
  totalSpentOnSnoozing: 0,
};

// Get all alarms
export async function getAlarms(): Promise<Alarm[]> {
  try {
    const json = await AsyncStorage.getItem(ALARMS_KEY);
    return json ? JSON.parse(json) : [];
  } catch (error) {
    console.error('Error loading alarms:', error);
    return [];
  }
}

// Save all alarms
export async function saveAlarms(alarms: Alarm[]): Promise<void> {
  try {
    await AsyncStorage.setItem(ALARMS_KEY, JSON.stringify(alarms));
  } catch (error) {
    console.error('Error saving alarms:', error);
  }
}

// Add new alarm
export async function addAlarm(alarm: Omit<Alarm, 'id'>): Promise<Alarm> {
  const alarms = await getAlarms();
  const newAlarm: Alarm = {
    ...alarm,
    id: Date.now().toString(),
  };
  alarms.push(newAlarm);
  await saveAlarms(alarms);
  return newAlarm;
}

// Update alarm
export async function updateAlarm(id: string, updates: Partial<Alarm>): Promise<void> {
  const alarms = await getAlarms();
  const index = alarms.findIndex(a => a.id === id);
  if (index !== -1) {
    alarms[index] = { ...alarms[index], ...updates };
    await saveAlarms(alarms);
  }
}

// Delete alarm
export async function deleteAlarm(id: string): Promise<void> {
  const alarms = await getAlarms();
  const filtered = alarms.filter(a => a.id !== id);
  await saveAlarms(filtered);
}

// Toggle alarm enabled/disabled
export async function toggleAlarm(id: string): Promise<void> {
  const alarms = await getAlarms();
  const index = alarms.findIndex(a => a.id === id);
  if (index !== -1) {
    alarms[index].enabled = !alarms[index].enabled;
    await saveAlarms(alarms);
  }
}

// Get settings
export async function getSettings(): Promise<Settings> {
  try {
    const json = await AsyncStorage.getItem(SETTINGS_KEY);
    return json ? { ...defaultSettings, ...JSON.parse(json) } : defaultSettings;
  } catch (error) {
    console.error('Error loading settings:', error);
    return defaultSettings;
  }
}

// Save settings
export async function saveSettings(settings: Partial<Settings>): Promise<void> {
  try {
    const current = await getSettings();
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...current, ...settings }));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}

// Track snooze spending
export async function addSnoozeSpending(amount: number): Promise<void> {
  const settings = await getSettings();
  await saveSettings({ totalSpentOnSnoozing: settings.totalSpentOnSnoozing + amount });
}

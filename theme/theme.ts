// Theme system — color palettes and useTheme hook
import { useSettingsContext } from '../context/SettingsContext';

export interface ThemeColors {
    background: string;      // main screen background
    card: string;            // card / header background
    secondary: string;       // secondary elements (buttons, inputs)
    accent: string;          // primary accent (FAB, active toggles, save buttons)
    accentLight: string;     // accent with transparency for highlights
    danger: string;          // delete / destructive actions
    dangerLight: string;     // danger with transparency
    textPrimary: string;     // main text color
    textSecondary: string;   // muted text
    textMuted: string;       // very muted text
    border: string;          // subtle borders
    overlay: string;         // modal overlay
}

export type ThemeName = 'midnight' | 'ocean' | 'forest' | 'sunset';

const midnight: ThemeColors = {
    background: '#1a1a2e',
    card: '#16213e',
    secondary: '#2a2a4e',
    accent: '#4a9f7f',
    accentLight: 'rgba(74, 159, 127, 0.15)',
    danger: '#e74c3c',
    dangerLight: '#e74c3c33',
    textPrimary: '#fff',
    textSecondary: '#ccc',
    textMuted: '#888',
    border: '#333',
    overlay: 'rgba(0, 0, 0, 0.7)',
};

const ocean: ThemeColors = {
    background: '#0a1628',
    card: '#0f2440',
    secondary: '#1a3a5c',
    accent: '#3b82f6',
    accentLight: 'rgba(59, 130, 246, 0.15)',
    danger: '#ef4444',
    dangerLight: '#ef444433',
    textPrimary: '#fff',
    textSecondary: '#cbd5e1',
    textMuted: '#64748b',
    border: '#1e3a5f',
    overlay: 'rgba(0, 0, 0, 0.7)',
};

const forest: ThemeColors = {
    background: '#1a2e1a',
    card: '#1e3e16',
    secondary: '#2a4e2a',
    accent: '#4a9f4a',
    accentLight: 'rgba(74, 159, 74, 0.15)',
    danger: '#e74c3c',
    dangerLight: '#e74c3c33',
    textPrimary: '#fff',
    textSecondary: '#c0d8c0',
    textMuted: '#6b8f6b',
    border: '#2a4a2a',
    overlay: 'rgba(0, 0, 0, 0.7)',
};

const sunset: ThemeColors = {
    background: '#2e1a1a',
    card: '#3e1620',
    secondary: '#4e2a35',
    accent: '#e07a3e',
    accentLight: 'rgba(224, 122, 62, 0.15)',
    danger: '#e74c3c',
    dangerLight: '#e74c3c33',
    textPrimary: '#fff',
    textSecondary: '#d8c0c0',
    textMuted: '#8f6b6b',
    border: '#4a2a2a',
    overlay: 'rgba(0, 0, 0, 0.7)',
};

const themes: Record<ThemeName, ThemeColors> = {
    midnight,
    ocean,
    forest,
    sunset,
};

export const themeNames: ThemeName[] = ['midnight', 'ocean', 'forest', 'sunset'];

export function getTheme(name: string): ThemeColors {
    return themes[name as ThemeName] || midnight;
}

export function useTheme(): ThemeColors {
    const { settings } = useSettingsContext();
    return getTheme(settings?.colorTheme || 'midnight');
}

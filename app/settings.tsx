// Settings screen - app configuration
import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSettings } from '../hooks/useAlarms';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme, themeNames, getTheme, ThemeName } from '../theme/theme';

const DURATION_PRESETS = [1, 5, 10, 15];
const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'hu', label: 'Magyar' },
    { code: 'es', label: 'Español' },
    { code: 'de', label: 'Deutsch' },
];

const THEME_TRANSLATION_KEYS: Record<ThemeName, string> = {
    midnight: 'themeMidnight',
    ocean: 'themeOcean',
    forest: 'themeForest',
    sunset: 'themeSunset',
};

export default function SettingsScreen() {
    const router = useRouter();
    const { settings, updateSettings } = useSettings();
    const { t, dayNames } = useTranslation();
    const theme = useTheme();
    const [showCustomDuration, setShowCustomDuration] = useState(false);
    const [customDuration, setCustomDuration] = useState('');

    const selectPresetDuration = (min: number) => {
        updateSettings({ defaultSnoozeDuration: min });
        setShowCustomDuration(false);
    };

    const selectCustomDuration = () => {
        setShowCustomDuration(true);
    };

    const handleCustomDurationChange = (text: string) => {
        setCustomDuration(text);
        const val = parseInt(text);
        if (!isNaN(val) && val > 0) {
            updateSettings({ defaultSnoozeDuration: val });
        }
    };

    if (!settings) {
        return (
            <View style={[styles.container, { backgroundColor: theme.card }]}>
                <Text style={[styles.loadingText, { color: theme.textMuted }]}>{t.loading}</Text>
            </View>
        );
    }

    const selectedLanguage = settings.language || 'en';

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.card }]} contentContainerStyle={styles.content}>
            {/* Color Theme */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{t.colorTheme}</Text>
                <View style={styles.themeContainer}>
                    {themeNames.map((name) => {
                        const previewTheme = getTheme(name);
                        const isActive = (settings.colorTheme || 'midnight') === name;
                        return (
                            <TouchableOpacity
                                key={name}
                                style={[
                                    styles.themeOption,
                                    { borderColor: isActive ? previewTheme.accent : theme.secondary },
                                    isActive && { borderWidth: 2 },
                                ]}
                                onPress={() => updateSettings({ colorTheme: name })}
                            >
                                <View style={styles.themePreview}>
                                    <View style={[styles.themeColorDot, { backgroundColor: previewTheme.background }]} />
                                    <View style={[styles.themeColorDot, { backgroundColor: previewTheme.card }]} />
                                    <View style={[styles.themeColorDot, { backgroundColor: previewTheme.accent }]} />
                                </View>
                                <Text style={[
                                    styles.themeLabel,
                                    { color: isActive ? previewTheme.accent : theme.textMuted }
                                ]}>
                                    {(t as any)[THEME_TRANSLATION_KEYS[name]] || name}
                                </Text>
                                {isActive && (
                                    <Text style={[styles.themeCheck, { color: previewTheme.accent }]}>✓</Text>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            {/* Language */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{t.language}</Text>
                <View style={styles.languageContainer}>
                    {LANGUAGES.map((lang) => (
                        <TouchableOpacity
                            key={lang.code}
                            style={[
                                styles.languageButton,
                                { backgroundColor: theme.background, borderColor: theme.secondary },
                                selectedLanguage === lang.code && { backgroundColor: theme.accent, borderColor: theme.accent }
                            ]}
                            onPress={() => updateSettings({ language: lang.code })}
                        >
                            <Text style={[
                                styles.languageText,
                                { color: theme.textMuted },
                                selectedLanguage === lang.code && { color: theme.textPrimary }
                            ]}>
                                {lang.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Start Day of Week */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{t.weekStartsOn}</Text>
                <View style={styles.languageContainer}>
                    {dayNames.map((day, index) => (
                        <TouchableOpacity
                            key={day}
                            style={[
                                styles.startDayButton,
                                { backgroundColor: theme.background, borderColor: theme.secondary },
                                settings.startDayOfWeek === index && { backgroundColor: theme.accent, borderColor: theme.accent }
                            ]}
                            onPress={() => updateSettings({ startDayOfWeek: index })}
                        >
                            <Text style={[
                                styles.startDayText,
                                { color: theme.textMuted },
                                settings.startDayOfWeek === index && { color: theme.textPrimary }
                            ]}>
                                {day}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Default Snooze Price */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{t.defaultSnoozePrice}</Text>
                <Text style={[styles.sectionSubtitle, { color: theme.textMuted }]}>{t.defaultSnoozePriceSubtitle}</Text>
                <View style={[styles.priceContainer, { backgroundColor: theme.background, borderColor: theme.secondary }]}>
                    <Text style={[styles.currencySign, { color: theme.danger }]}>$</Text>
                    <TextInput
                        style={[styles.priceInput, { color: theme.textPrimary }]}
                        value={settings.defaultSnoozePrice.toString()}
                        onChangeText={(text) => {
                            const price = parseFloat(text) || 1;
                            updateSettings({ defaultSnoozePrice: Math.max(1, price) });
                        }}
                        keyboardType="decimal-pad"
                        placeholder="1.00"
                        placeholderTextColor={theme.textMuted}
                    />
                </View>
            </View>

            {/* Default Snooze Duration */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{t.defaultSnoozeDuration}</Text>
                <View style={styles.durationContainer}>
                    {DURATION_PRESETS.map((min) => (
                        <TouchableOpacity
                            key={min}
                            style={[
                                styles.durationButton,
                                { backgroundColor: theme.background, borderColor: theme.secondary },
                                settings.defaultSnoozeDuration === min && !showCustomDuration && { backgroundColor: theme.accent, borderColor: theme.accent }
                            ]}
                            onPress={() => selectPresetDuration(min)}
                        >
                            <Text style={[
                                styles.durationText,
                                { color: theme.textMuted },
                                settings.defaultSnoozeDuration === min && !showCustomDuration && { color: theme.textPrimary }
                            ]}>
                                {min} {t.min}
                            </Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                        style={[
                            styles.durationButton,
                            { backgroundColor: theme.background, borderColor: theme.secondary },
                            showCustomDuration && { backgroundColor: theme.accent, borderColor: theme.accent }
                        ]}
                        onPress={selectCustomDuration}
                    >
                        <Text style={[
                            styles.durationText,
                            { color: theme.textMuted },
                            showCustomDuration && { color: theme.textPrimary }
                        ]}>
                            {t.other}
                        </Text>
                    </TouchableOpacity>
                </View>
                {showCustomDuration && (
                    <View style={styles.customDurationContainer}>
                        <TextInput
                            style={[styles.customDurationInput, { backgroundColor: theme.background, color: theme.textPrimary, borderColor: theme.accent }]}
                            value={customDuration}
                            onChangeText={handleCustomDurationChange}
                            keyboardType="number-pad"
                            placeholder={t.enterMinutes}
                            placeholderTextColor={theme.textMuted}
                            autoFocus
                        />
                        <Text style={[styles.customDurationLabel, { color: theme.textMuted }]}>{t.minutes}</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 24,
        paddingBottom: 48,
    },
    loadingText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 40,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    sectionSubtitle: {
        fontSize: 12,
        marginBottom: 12,
    },
    themeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginTop: 8,
    },
    themeOption: {
        flex: 1,
        minWidth: 70,
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
    },
    themePreview: {
        flexDirection: 'row',
        gap: 4,
        marginBottom: 6,
    },
    themeColorDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
    },
    themeLabel: {
        fontSize: 11,
        fontWeight: '600',
    },
    themeCheck: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 2,
    },
    languageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 8,
    },
    languageButton: {
        flex: 1,
        minWidth: 70,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
    },
    languageText: {
        fontSize: 14,
        fontWeight: '600',
    },
    startDayButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    startDayText: {
        fontSize: 11,
        fontWeight: '600',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
    },
    currencySign: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    priceInput: {
        flex: 1,
        fontSize: 24,
        padding: 16,
    },
    durationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
        flexWrap: 'wrap',
        marginTop: 8,
    },
    durationButton: {
        flex: 1,
        minWidth: 50,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
    },
    durationText: {
        fontSize: 14,
        fontWeight: '600',
    },
    customDurationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        gap: 8,
    },
    customDurationInput: {
        flex: 1,
        borderRadius: 12,
        padding: 14,
        fontSize: 18,
        borderWidth: 1,
        textAlign: 'center',
    },
    customDurationLabel: {
        fontSize: 16,
    },
});

// Settings screen - app configuration
import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSettings } from '../hooks/useAlarms';
import { useTranslation } from '../hooks/useTranslation';

const DURATION_PRESETS = [1, 5, 10, 15];
const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'hu', label: 'Magyar' },
    { code: 'es', label: 'Español' },
    { code: 'de', label: 'Deutsch' },
];

export default function SettingsScreen() {
    const router = useRouter();
    const { settings, updateSettings } = useSettings();
    const { t, dayNames } = useTranslation();
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
            <View style={styles.container}>
                <Text style={styles.loadingText}>{t.loading}</Text>
            </View>
        );
    }

    const selectedLanguage = settings.language || 'en';

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Language */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t.language}</Text>
                <View style={styles.languageContainer}>
                    {LANGUAGES.map((lang) => (
                        <TouchableOpacity
                            key={lang.code}
                            style={[
                                styles.languageButton,
                                selectedLanguage === lang.code && styles.languageButtonActive
                            ]}
                            onPress={() => updateSettings({ language: lang.code })}
                        >
                            <Text style={[
                                styles.languageText,
                                selectedLanguage === lang.code && styles.languageTextActive
                            ]}>
                                {lang.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Start Day of Week */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t.weekStartsOn}</Text>
                <View style={styles.languageContainer}>
                    {dayNames.map((day, index) => (
                        <TouchableOpacity
                            key={day}
                            style={[
                                styles.startDayButton,
                                settings.startDayOfWeek === index && styles.startDayButtonActive
                            ]}
                            onPress={() => updateSettings({ startDayOfWeek: index })}
                        >
                            <Text style={[
                                styles.startDayText,
                                settings.startDayOfWeek === index && styles.startDayTextActive
                            ]}>
                                {day}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Default Snooze Price */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t.defaultSnoozePrice}</Text>
                <Text style={styles.sectionSubtitle}>{t.defaultSnoozePriceSubtitle}</Text>
                <View style={styles.priceContainer}>
                    <Text style={styles.currencySign}>$</Text>
                    <TextInput
                        style={styles.priceInput}
                        value={settings.defaultSnoozePrice.toString()}
                        onChangeText={(text) => {
                            const price = parseFloat(text) || 1;
                            updateSettings({ defaultSnoozePrice: Math.max(1, price) });
                        }}
                        keyboardType="decimal-pad"
                        placeholder="1.00"
                        placeholderTextColor="#666"
                    />
                </View>
            </View>

            {/* Default Snooze Duration */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t.defaultSnoozeDuration}</Text>
                <View style={styles.durationContainer}>
                    {DURATION_PRESETS.map((min) => (
                        <TouchableOpacity
                            key={min}
                            style={[
                                styles.durationButton,
                                settings.defaultSnoozeDuration === min && !showCustomDuration && styles.durationButtonActive
                            ]}
                            onPress={() => selectPresetDuration(min)}
                        >
                            <Text style={[
                                styles.durationText,
                                settings.defaultSnoozeDuration === min && !showCustomDuration && styles.durationTextActive
                            ]}>
                                {min} {t.min}
                            </Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                        style={[styles.durationButton, showCustomDuration && styles.durationButtonActive]}
                        onPress={selectCustomDuration}
                    >
                        <Text style={[styles.durationText, showCustomDuration && styles.durationTextActive]}>
                            {t.other}
                        </Text>
                    </TouchableOpacity>
                </View>
                {showCustomDuration && (
                    <View style={styles.customDurationContainer}>
                        <TextInput
                            style={styles.customDurationInput}
                            value={customDuration}
                            onChangeText={handleCustomDurationChange}
                            keyboardType="number-pad"
                            placeholder={t.enterMinutes}
                            placeholderTextColor="#666"
                            autoFocus
                        />
                        <Text style={styles.customDurationLabel}>{t.minutes}</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#16213e',
    },
    content: {
        padding: 24,
        paddingBottom: 48,
    },
    loadingText: {
        color: '#888',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 40,
    },
    profileLink: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1a1a2e',
        borderRadius: 16,
        padding: 16,
        marginBottom: 28,
        borderWidth: 1,
        borderColor: '#2a2a4e',
    },
    profileLinkLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    profileAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#16213e',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#4a9f7f',
    },
    profileAvatarEmoji: {
        fontSize: 24,
    },
    profileName: {
        fontSize: 17,
        fontWeight: '600',
        color: '#fff',
    },
    profileSubtext: {
        fontSize: 13,
        color: '#888',
        marginTop: 2,
    },
    profileArrow: {
        fontSize: 28,
        color: '#4a9f7f',
        fontWeight: '300',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 4,
    },
    sectionSubtitle: {
        fontSize: 12,
        color: '#888',
        marginBottom: 12,
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
        backgroundColor: '#1a1a2e',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2a2a4e',
    },
    languageButtonActive: {
        backgroundColor: '#4a9f7f',
        borderColor: '#4a9f7f',
    },
    languageText: {
        fontSize: 14,
        color: '#888',
        fontWeight: '600',
    },
    languageTextActive: {
        color: '#fff',
    },
    startDayButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#1a1a2e',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2a2a4e',
    },
    startDayButtonActive: {
        backgroundColor: '#4a9f7f',
        borderColor: '#4a9f7f',
    },
    startDayText: {
        fontSize: 11,
        color: '#888',
        fontWeight: '600',
    },
    startDayTextActive: {
        color: '#fff',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1a1a2e',
        borderRadius: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#2a2a4e',
    },
    currencySign: {
        fontSize: 24,
        color: '#e74c3c',
        fontWeight: 'bold',
    },
    priceInput: {
        flex: 1,
        fontSize: 24,
        color: '#fff',
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
        backgroundColor: '#1a1a2e',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2a2a4e',
    },
    durationButtonActive: {
        backgroundColor: '#4a9f7f',
        borderColor: '#4a9f7f',
    },
    durationText: {
        fontSize: 14,
        color: '#888',
        fontWeight: '600',
    },
    durationTextActive: {
        color: '#fff',
    },
    customDurationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        gap: 8,
    },
    customDurationInput: {
        flex: 1,
        backgroundColor: '#1a1a2e',
        borderRadius: 12,
        padding: 14,
        fontSize: 18,
        color: '#fff',
        borderWidth: 1,
        borderColor: '#4a9f7f',
        textAlign: 'center',
    },
    customDurationLabel: {
        fontSize: 16,
        color: '#888',
    },
});

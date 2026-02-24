// Create new alarm screen
import { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAlarms, useSettings } from '../hooks/useAlarms';
import TimePicker from '../components/TimePicker';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme } from '../theme/theme';
import SoundPicker from '../components/SoundPicker';


const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CreateAlarmScreen() {
    const router = useRouter();
    const { createAlarm } = useAlarms();
    const { settings } = useSettings();
    const { t, dayNames } = useTranslation();
    const theme = useTheme();

    const now = new Date();
    const [hours, setHours] = useState(String(now.getHours()).padStart(2, '0'));
    const [minutes, setMinutes] = useState(String(now.getMinutes()).padStart(2, '0'));
    const [label, setLabel] = useState('');
    const [repeatDays, setRepeatDays] = useState<number[]>([]);
    const [snoozePrice, setSnoozePrice] = useState(settings?.defaultSnoozePrice?.toString() || '1');
    const [snoozeDuration, setSnoozeDuration] = useState(settings?.defaultSnoozeDuration || 1);
    const [customDuration, setCustomDuration] = useState('');
    const [showCustomDuration, setShowCustomDuration] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [sound, setSound] = useState(settings?.defaultSound || 'classic');

    const DURATION_PRESETS = [1, 5, 10, 15];

    const selectPresetDuration = (min: number) => {
        setSnoozeDuration(min);
        setShowCustomDuration(false);
    };

    const selectCustomDuration = () => {
        setShowCustomDuration(true);
    };

    const handleCustomDurationChange = (text: string) => {
        setCustomDuration(text);
        const val = parseInt(text);
        if (!isNaN(val) && val > 0) {
            setSnoozeDuration(val);
        }
    };

    const toggleDay = (dayIndex: number) => {
        setRepeatDays(prev =>
            prev.includes(dayIndex)
                ? prev.filter(d => d !== dayIndex)
                : [...prev, dayIndex].sort()
        );
    };

    const handleSave = async () => {
        const price = parseFloat(snoozePrice);
        if (isNaN(price) || price < 1) {
            Alert.alert(t.invalidPrice, t.invalidPriceMessage);
            return;
        }

        const h = parseInt(hours);
        const m = parseInt(minutes);
        if (isNaN(h) || h < 0 || h > 23 || isNaN(m) || m < 0 || m > 59) {
            Alert.alert(t.invalidTime, t.invalidTimeMessage);
            return;
        }

        await createAlarm({
            time: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
            label: label.trim() || 'Alarm',
            enabled: true,
            repeatDays,
            snoozePrice: price,
            snoozeDuration,
            sound: sound,
            vibrate: true,
        });

        router.back();
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.card }]} contentContainerStyle={styles.content}>
            {/* Time Picker */}
            <TouchableOpacity style={styles.timeContainer} onPress={() => setShowTimePicker(true)}>
                <View style={[styles.timeBox, { backgroundColor: theme.background }]}>
                    <Text style={[styles.timeDisplay, { color: theme.textPrimary }]}>{hours}</Text>
                </View>
                <Text style={[styles.timeSeparator, { color: theme.accent }]}>:</Text>
                <View style={[styles.timeBox, { backgroundColor: theme.background }]}>
                    <Text style={[styles.timeDisplay, { color: theme.textPrimary }]}>{minutes}</Text>
                </View>
            </TouchableOpacity>

            <TimePicker
                visible={showTimePicker}
                hours={hours}
                minutes={minutes}
                onConfirm={(h, m) => {
                    setHours(h);
                    setMinutes(m);
                    setShowTimePicker(false);
                }}
                onCancel={() => setShowTimePicker(false)}
            />

            {/* Label */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{t.label}</Text>
                <TextInput
                    style={[styles.textInput, { backgroundColor: theme.background, color: theme.textPrimary, borderColor: theme.secondary }]}
                    value={label}
                    onChangeText={setLabel}
                    placeholder={t.labelPlaceholder}
                    placeholderTextColor={theme.textMuted}
                />
            </View>

            {/* Repeat Days */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{t.repeat}</Text>
                <View style={styles.daysContainer}>
                    {(() => {
                        const startDay = settings?.startDayOfWeek || 0;
                        const reordered = Array.from({ length: 7 }, (_, i) => (startDay + i) % 7);
                        return reordered.map((dayIndex) => (
                            <TouchableOpacity
                                key={dayIndex}
                                style={[
                                    styles.dayButton,
                                    { backgroundColor: theme.background, borderColor: theme.secondary },
                                    repeatDays.includes(dayIndex) && { backgroundColor: theme.accent, borderColor: theme.accent }
                                ]}
                                onPress={() => toggleDay(dayIndex)}
                            >
                                <Text style={[
                                    styles.dayButtonText,
                                    { color: theme.textMuted },
                                    repeatDays.includes(dayIndex) && { color: theme.textPrimary }
                                ]}>
                                    {dayNames[dayIndex]}
                                </Text>
                            </TouchableOpacity>
                        ));
                    })()}
                </View>
            </View>

            {/* Snooze Price */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{t.snoozePriceTitle}</Text>
                <Text style={[styles.sectionSubtitle, { color: theme.textMuted }]}>{t.snoozePriceSubtitle}</Text>
                <View style={[styles.priceContainer, { backgroundColor: theme.background, borderColor: theme.secondary }]}>
                    <Text style={[styles.currencySign, { color: theme.danger }]}>$</Text>
                    <TextInput
                        style={[styles.priceInput, { color: theme.textPrimary }]}
                        value={snoozePrice}
                        onChangeText={setSnoozePrice}
                        keyboardType="decimal-pad"
                        placeholder="1.00"
                        placeholderTextColor={theme.textMuted}
                    />
                </View>
            </View>

            {/* Snooze Duration */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{t.snoozeDuration}</Text>
                <View style={styles.durationContainer}>
                    {DURATION_PRESETS.map((min) => (
                        <TouchableOpacity
                            key={min}
                            style={[
                                styles.durationButton,
                                { backgroundColor: theme.background, borderColor: theme.secondary },
                                snoozeDuration === min && !showCustomDuration && { backgroundColor: theme.accent, borderColor: theme.accent }
                            ]}
                            onPress={() => selectPresetDuration(min)}
                        >
                            <Text style={[
                                styles.durationText,
                                { color: theme.textMuted },
                                snoozeDuration === min && !showCustomDuration && { color: theme.textPrimary }
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

            {/* Alarm Sound */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{t.alarmSound}</Text>
                <SoundPicker
                    selectedSound={sound}
                    onSelectSound={setSound}
                    t={t}
                />
            </View>

            {/* Save Button */}
            <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.accent }]} onPress={handleSave}>
                <Text style={[styles.saveButtonText, { color: theme.textPrimary }]}>{t.createAlarmButton}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
                <Text style={[styles.cancelButtonText, { color: theme.textMuted }]}>{t.cancel}</Text>
            </TouchableOpacity>
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
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
    },
    timeBox: {
        borderRadius: 16,
        width: 120,
        paddingHorizontal: 24,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    timeDisplay: {
        fontSize: 72,
        fontWeight: '200',
        textAlign: 'center',
    },
    timeSeparator: {
        fontSize: 72,
        fontWeight: '200',
        marginHorizontal: 8,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    sectionSubtitle: {
        fontSize: 12,
        marginBottom: 12,
    },
    textInput: {
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        borderWidth: 1,
    },
    daysContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dayButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    dayButtonText: {
        fontSize: 12,
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
        fontSize: 32,
        fontWeight: 'bold',
    },
    priceInput: {
        flex: 1,
        fontSize: 32,
        padding: 16,
    },
    durationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
        flexWrap: 'wrap',
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
    soundContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 8,
    },
    soundOption: {
        flex: 1,
        minWidth: 60,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        gap: 4,
    },
    soundEmoji: {
        fontSize: 20,
    },
    soundLabel: {
        fontSize: 11,
        fontWeight: '600',
    },
    saveButton: {
        borderRadius: 16,
        padding: 18,
        alignItems: 'center',
        marginTop: 16,
    },
    saveButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    cancelButton: {
        padding: 18,
        alignItems: 'center',
        marginTop: 8,
    },
    cancelButtonText: {
        fontSize: 16,
    },
});

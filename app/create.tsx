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

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CreateAlarmScreen() {
    const router = useRouter();
    const { createAlarm } = useAlarms();
    const { settings } = useSettings();
    const { t, dayNames } = useTranslation();

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
            sound: 'default',
            vibrate: true,
        });

        router.back();
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Time Picker */}
            <TouchableOpacity style={styles.timeContainer} onPress={() => setShowTimePicker(true)}>
                <View style={styles.timeBox}>
                    <Text style={styles.timeDisplay}>{hours}</Text>
                </View>
                <Text style={styles.timeSeparator}>:</Text>
                <View style={styles.timeBox}>
                    <Text style={styles.timeDisplay}>{minutes}</Text>
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
                <Text style={styles.sectionTitle}>{t.label}</Text>
                <TextInput
                    style={styles.textInput}
                    value={label}
                    onChangeText={setLabel}
                    placeholder={t.labelPlaceholder}
                    placeholderTextColor="#666"
                />
            </View>

            {/* Repeat Days */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t.repeat}</Text>
                <View style={styles.daysContainer}>
                    {(() => {
                        const startDay = settings?.startDayOfWeek || 0;
                        const reordered = Array.from({ length: 7 }, (_, i) => (startDay + i) % 7);
                        return reordered.map((dayIndex) => (
                            <TouchableOpacity
                                key={dayIndex}
                                style={[styles.dayButton, repeatDays.includes(dayIndex) && styles.dayButtonActive]}
                                onPress={() => toggleDay(dayIndex)}
                            >
                                <Text style={[styles.dayButtonText, repeatDays.includes(dayIndex) && styles.dayButtonTextActive]}>
                                    {dayNames[dayIndex]}
                                </Text>
                            </TouchableOpacity>
                        ));
                    })()}
                </View>
            </View>

            {/* Snooze Price */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t.snoozePriceTitle}</Text>
                <Text style={styles.sectionSubtitle}>{t.snoozePriceSubtitle}</Text>
                <View style={styles.priceContainer}>
                    <Text style={styles.currencySign}>$</Text>
                    <TextInput
                        style={styles.priceInput}
                        value={snoozePrice}
                        onChangeText={setSnoozePrice}
                        keyboardType="decimal-pad"
                        placeholder="1.00"
                        placeholderTextColor="#666"
                    />
                </View>
            </View>

            {/* Snooze Duration */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t.snoozeDuration}</Text>
                <View style={styles.durationContainer}>
                    {DURATION_PRESETS.map((min) => (
                        <TouchableOpacity
                            key={min}
                            style={[styles.durationButton, snoozeDuration === min && !showCustomDuration && styles.durationButtonActive]}
                            onPress={() => selectPresetDuration(min)}
                        >
                            <Text style={[styles.durationText, snoozeDuration === min && !showCustomDuration && styles.durationTextActive]}>
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

            {/* Save Button */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>{t.createAlarmButton}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
                <Text style={styles.cancelButtonText}>{t.cancel}</Text>
            </TouchableOpacity>
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
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
    },
    timeBox: {
        backgroundColor: '#1a1a2e',
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
        color: '#fff',
        textAlign: 'center',
    },
    timeSeparator: {
        fontSize: 72,
        fontWeight: '200',
        color: '#4a9f7f',
        marginHorizontal: 8,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 8,
    },
    sectionSubtitle: {
        fontSize: 12,
        color: '#888',
        marginBottom: 12,
    },
    textInput: {
        backgroundColor: '#1a1a2e',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#fff',
        borderWidth: 1,
        borderColor: '#2a2a4e',
    },
    daysContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dayButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#1a1a2e',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2a2a4e',
    },
    dayButtonActive: {
        backgroundColor: '#4a9f7f',
        borderColor: '#4a9f7f',
    },
    dayButtonText: {
        fontSize: 12,
        color: '#888',
        fontWeight: '600',
    },
    dayButtonTextActive: {
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
        fontSize: 32,
        color: '#e74c3c',
        fontWeight: 'bold',
    },
    priceInput: {
        flex: 1,
        fontSize: 32,
        color: '#fff',
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
    saveButton: {
        backgroundColor: '#4a9f7f',
        borderRadius: 16,
        padding: 18,
        alignItems: 'center',
        marginTop: 16,
    },
    saveButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    cancelButton: {
        padding: 18,
        alignItems: 'center',
        marginTop: 8,
    },
    cancelButtonText: {
        fontSize: 16,
        color: '#888',
    },
});

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

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CreateAlarmScreen() {
    const router = useRouter();
    const { createAlarm } = useAlarms();
    const { settings } = useSettings();

    const now = new Date();
    const [hours, setHours] = useState(String(now.getHours()).padStart(2, '0'));
    const [minutes, setMinutes] = useState(String(now.getMinutes()).padStart(2, '0'));
    const [label, setLabel] = useState('');
    const [repeatDays, setRepeatDays] = useState<number[]>([]);
    const [snoozePrice, setSnoozePrice] = useState(settings?.defaultSnoozePrice?.toString() || '1');
    const [snoozeDuration, setSnoozeDuration] = useState(settings?.defaultSnoozeDuration || 9);

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
            Alert.alert('Invalid Price', 'Snooze price must be at least $1.00');
            return;
        }

        const h = parseInt(hours);
        const m = parseInt(minutes);
        if (isNaN(h) || h < 0 || h > 23 || isNaN(m) || m < 0 || m > 59) {
            Alert.alert('Invalid Time', 'Please enter a valid time');
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
            <View style={styles.timeContainer}>
                <TextInput
                    style={styles.timeInput}
                    value={hours}
                    onChangeText={(t) => setHours(t.slice(0, 2))}
                    keyboardType="number-pad"
                    maxLength={2}
                    placeholder="00"
                    placeholderTextColor="#444"
                />
                <Text style={styles.timeSeparator}>:</Text>
                <TextInput
                    style={styles.timeInput}
                    value={minutes}
                    onChangeText={(t) => setMinutes(t.slice(0, 2))}
                    keyboardType="number-pad"
                    maxLength={2}
                    placeholder="00"
                    placeholderTextColor="#444"
                />
            </View>

            {/* Label */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Label</Text>
                <TextInput
                    style={styles.textInput}
                    value={label}
                    onChangeText={setLabel}
                    placeholder="Wake up!"
                    placeholderTextColor="#666"
                />
            </View>

            {/* Repeat Days */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Repeat</Text>
                <View style={styles.daysContainer}>
                    {DAYS.map((day, index) => (
                        <TouchableOpacity
                            key={day}
                            style={[styles.dayButton, repeatDays.includes(index) && styles.dayButtonActive]}
                            onPress={() => toggleDay(index)}
                        >
                            <Text style={[styles.dayButtonText, repeatDays.includes(index) && styles.dayButtonTextActive]}>
                                {day}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Snooze Price */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Snooze Price 💰</Text>
                <Text style={styles.sectionSubtitle}>Minimum $1.00 - make it hurt!</Text>
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
                <Text style={styles.sectionTitle}>Snooze Duration</Text>
                <View style={styles.durationContainer}>
                    {[5, 9, 10, 15].map((min) => (
                        <TouchableOpacity
                            key={min}
                            style={[styles.durationButton, snoozeDuration === min && styles.durationButtonActive]}
                            onPress={() => setSnoozeDuration(min)}
                        >
                            <Text style={[styles.durationText, snoozeDuration === min && styles.durationTextActive]}>
                                {min} min
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Create Alarm</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
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
    timeInput: {
        fontSize: 72,
        fontWeight: '200',
        color: '#fff',
        backgroundColor: '#1a1a2e',
        borderRadius: 16,
        paddingHorizontal: 24,
        paddingVertical: 16,
        textAlign: 'center',
        width: 120,
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
    },
    durationButton: {
        flex: 1,
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

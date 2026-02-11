// Edit alarm screen - dynamic route with alarm ID
import { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Alert,
    Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAlarms } from '../../hooks/useAlarms';
import { getAlarms, Alarm } from '../../store/alarmStore';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function EditAlarmScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { editAlarm, removeAlarm } = useAlarms();

    const [alarm, setAlarm] = useState<Alarm | null>(null);
    const [hours, setHours] = useState('');
    const [minutes, setMinutes] = useState('');
    const [label, setLabel] = useState('');
    const [repeatDays, setRepeatDays] = useState<number[]>([]);
    const [snoozePrice, setSnoozePrice] = useState('1');
    const [snoozeDuration, setSnoozeDuration] = useState(1);
    const [customDuration, setCustomDuration] = useState('');
    const [showCustomDuration, setShowCustomDuration] = useState(false);

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

    useEffect(() => {
        loadAlarm();
    }, [id]);

    const loadAlarm = async () => {
        const alarms = await getAlarms();
        const found = alarms.find(a => a.id === id);
        if (found) {
            setAlarm(found);
            const [h, m] = found.time.split(':');
            setHours(h);
            setMinutes(m);
            setLabel(found.label);
            setRepeatDays(found.repeatDays);
            setSnoozePrice(found.snoozePrice.toString());
            setSnoozeDuration(found.snoozeDuration);
            if (![1, 5, 10, 15].includes(found.snoozeDuration)) {
                setShowCustomDuration(true);
                setCustomDuration(found.snoozeDuration.toString());
            }
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
        if (!alarm) return;

        const price = parseFloat(snoozePrice);
        if (isNaN(price) || price < 1) {
            if (Platform.OS === 'web') {
                window.alert('Snooze price must be at least $1.00');
            } else {
                Alert.alert('Invalid Price', 'Snooze price must be at least $1.00');
            }
            return;
        }

        const h = parseInt(hours);
        const m = parseInt(minutes);
        if (isNaN(h) || h < 0 || h > 23 || isNaN(m) || m < 0 || m > 59) {
            if (Platform.OS === 'web') {
                window.alert('Please enter a valid time');
            } else {
                Alert.alert('Invalid Time', 'Please enter a valid time');
            }
            return;
        }

        await editAlarm(alarm.id, {
            time: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
            label: label.trim() || 'Alarm',
            repeatDays,
            snoozePrice: price,
            snoozeDuration,
        });

        router.back();
    };

    const handleDelete = async () => {
        if (!alarm) return;
        if (Platform.OS === 'web') {
            if (window.confirm(`Are you sure you want to delete "${alarm.label || 'this alarm'}"?`)) {
                await removeAlarm(alarm.id);
                router.back();
            }
        } else {
            Alert.alert(
                'Delete Alarm',
                `Are you sure you want to delete "${alarm.label || 'this alarm'}"?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: async () => {
                            await removeAlarm(alarm.id);
                            router.back();
                        }
                    },
                ]
            );
        }
    };

    if (!alarm) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

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
                    {DURATION_PRESETS.map((min) => (
                        <TouchableOpacity
                            key={min}
                            style={[styles.durationButton, snoozeDuration === min && !showCustomDuration && styles.durationButtonActive]}
                            onPress={() => selectPresetDuration(min)}
                        >
                            <Text style={[styles.durationText, snoozeDuration === min && !showCustomDuration && styles.durationTextActive]}>
                                {min} min
                            </Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                        style={[styles.durationButton, showCustomDuration && styles.durationButtonActive]}
                        onPress={selectCustomDuration}
                    >
                        <Text style={[styles.durationText, showCustomDuration && styles.durationTextActive]}>
                            Other
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
                            placeholder="Enter minutes"
                            placeholderTextColor="#666"
                            autoFocus
                        />
                        <Text style={styles.customDurationLabel}>minutes</Text>
                    </View>
                )}
            </View>

            {/* Save Button */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <Text style={styles.deleteButtonText}>Delete Alarm</Text>
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
    loadingText: {
        color: '#888',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 40,
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
    deleteButton: {
        backgroundColor: '#e74c3c',
        borderRadius: 16,
        padding: 18,
        alignItems: 'center',
        marginTop: 12,
    },
    deleteButtonText: {
        fontSize: 16,
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

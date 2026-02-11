import { View, Text, StyleSheet, FlatList, TouchableOpacity, Switch, Alert, Pressable, Platform } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { useAlarms } from '../hooks/useAlarms';
import { Alarm } from '../store/alarmStore';

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function AlarmCard({ alarm, onToggle, onPress, onDelete }: {
    alarm: Alarm;
    onToggle: () => void;
    onPress: () => void;
    onDelete: () => void;
}) {
    const handleDelete = () => {
        if (Platform.OS === 'web') {
            if (window.confirm(`Are you sure you want to delete "${alarm.label || 'this alarm'}"?`)) {
                onDelete();
            }
        } else {
            Alert.alert(
                'Delete Alarm',
                `Are you sure you want to delete "${alarm.label || 'this alarm'}"?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Delete', style: 'destructive', onPress: onDelete },
                ]
            );
        }
    };

    return (
        <View
            style={[styles.alarmCard, !alarm.enabled && styles.alarmCardDisabled]}
        >
            <Pressable
                style={styles.alarmInfo}
                onPress={onPress}
                onLongPress={handleDelete}
            >
                <Text style={[styles.alarmTime, !alarm.enabled && styles.textDisabled]}>
                    {alarm.time}
                </Text>
                <Text style={[styles.alarmLabel, !alarm.enabled && styles.textDisabled]}>
                    {alarm.label || 'Alarm'}
                </Text>
                <View style={styles.repeatDays}>
                    {alarm.repeatDays.length > 0 ? (
                        DAYS.map((day, index) => (
                            <Text
                                key={day}
                                style={[
                                    styles.dayText,
                                    alarm.repeatDays.includes(index) && styles.dayActive,
                                    !alarm.enabled && styles.textDisabled,
                                ]}
                            >
                                {day}
                            </Text>
                        ))
                    ) : (
                        <Text style={[styles.repeatText, !alarm.enabled && styles.textDisabled]}>
                            One time
                        </Text>
                    )}
                </View>
            </Pressable>
            <View style={styles.alarmRight}>
                <Text style={[styles.snoozePrice, !alarm.enabled && styles.textDisabled]}>
                    ${alarm.snoozePrice.toFixed(2)}
                </Text>
                <Text style={[styles.snoozePriceLabel, !alarm.enabled && styles.textDisabled]}>
                    to snooze
                </Text>
                <Switch
                    value={alarm.enabled}
                    onValueChange={onToggle}
                    trackColor={{ false: '#3a3a5a', true: '#4a9f7f' }}
                    thumbColor={alarm.enabled ? '#2ecc71' : '#888'}
                />
            </View>
        </View>
    );
}

export default function HomeScreen() {
    const router = useRouter();
    const { alarms, loading, toggleAlarm, removeAlarm, refreshAlarms } = useAlarms();

    useFocusEffect(
        useCallback(() => {
            refreshAlarms();
        }, [refreshAlarms])
    );

    const sortedAlarms = [...alarms].sort((a, b) => {
        const [aH, aM] = a.time.split(':').map(Number);
        const [bH, bM] = b.time.split(':').map(Number);
        return aH * 60 + aM - (bH * 60 + bM);
    });

    return (
        <View style={styles.container}>
            {alarms.length === 0 && !loading ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyIcon}>⏰</Text>
                    <Text style={styles.emptyTitle}>No Alarms Yet</Text>
                    <Text style={styles.emptySubtitle}>
                        Tap + to create your first pay-to-snooze alarm
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={sortedAlarms}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => (
                        <AlarmCard
                            alarm={item}
                            onToggle={() => toggleAlarm(item.id)}
                            onPress={() => router.push(`/edit/${item.id}`)}
                            onDelete={() => removeAlarm(item.id)}
                        />
                    )}
                />
            )}

            <TouchableOpacity
                style={styles.fab}
                onPress={() => router.push('/create')}
            >
                <Text style={styles.fabIcon}>+</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.settingsButton}
                onPress={() => router.push('/settings')}
            >
                <Text style={styles.settingsIcon}>⚙️</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#16213e',
    },
    list: {
        padding: 16,
        paddingBottom: 100,
    },
    alarmCard: {
        backgroundColor: '#1a1a2e',
        borderRadius: 16,
        padding: 20,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2a2a4e',
    },
    alarmCardDisabled: {
        opacity: 0.6,
    },
    alarmInfo: {
        flex: 1,
    },
    alarmTime: {
        fontSize: 42,
        fontWeight: '200',
        color: '#fff',
        letterSpacing: 2,
    },
    alarmLabel: {
        fontSize: 16,
        color: '#9999aa',
        marginTop: 4,
    },
    repeatDays: {
        flexDirection: 'row',
        marginTop: 8,
        gap: 4,
    },
    dayText: {
        fontSize: 12,
        color: '#555',
        paddingHorizontal: 4,
    },
    dayActive: {
        color: '#4a9f7f',
        fontWeight: 'bold',
    },
    repeatText: {
        fontSize: 12,
        color: '#666',
    },
    alarmRight: {
        alignItems: 'center',
        marginLeft: 16,
    },
    deleteButton: {
        position: 'absolute',
        top: -10,
        right: -10,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#e74c3c33',
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#e74c3c',
        fontSize: 12,
        fontWeight: 'bold',
    },
    snoozePrice: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#e74c3c',
    },
    snoozePriceLabel: {
        fontSize: 11,
        color: '#888',
        marginBottom: 8,
    },
    textDisabled: {
        color: '#555',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#4a9f7f',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#4a9f7f',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
    },
    fabIcon: {
        fontSize: 36,
        color: '#fff',
        marginTop: -2,
    },
    settingsButton: {
        position: 'absolute',
        bottom: 24,
        left: 24,
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#2a2a4e',
        justifyContent: 'center',
        alignItems: 'center',
    },
    settingsIcon: {
        fontSize: 24,
    },
});

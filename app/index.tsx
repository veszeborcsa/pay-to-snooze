import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Pressable, Platform, Animated } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback, useRef, useEffect } from 'react';
import { useAlarms } from '../hooks/useAlarms';
import { Alarm } from '../store/alarmStore';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme, ThemeColors } from '../theme/theme';

// Custom toggle that respects theme colors (RN Web Switch ignores thumbColor)
function ThemedToggle({ value, onValueChange, theme }: { value: boolean; onValueChange: () => void; theme: ThemeColors }) {
    const animValue = useRef(new Animated.Value(value ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(animValue, {
            toValue: value ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [value]);

    const translateX = animValue.interpolate({ inputRange: [0, 1], outputRange: [2, 20] });
    const trackBg = animValue.interpolate({ inputRange: [0, 1], outputRange: [theme.secondary, `${theme.accent}66`] });
    const thumbBg = animValue.interpolate({ inputRange: [0, 1], outputRange: ['#888888', theme.accent] });

    return (
        <Pressable onPress={onValueChange}>
            <Animated.View style={{ width: 40, height: 22, borderRadius: 11, backgroundColor: trackBg, justifyContent: 'center' }}>
                <Animated.View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: thumbBg, transform: [{ translateX }] }} />
            </Animated.View>
        </Pressable>
    );
}

function AlarmCard({ alarm, onToggle, onPress, onDelete, dayNames, t, theme }: {
    alarm: Alarm;
    onToggle: () => void;
    onPress: () => void;
    onDelete: () => void;
    dayNames: string[];
    t: Record<string, string>;
    theme: ThemeColors;
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
            style={[styles.alarmCard, { backgroundColor: theme.background, borderColor: theme.secondary }, !alarm.enabled && styles.alarmCardDisabled]}
        >
            <Pressable
                style={styles.alarmInfo}
                onPress={onPress}
                onLongPress={handleDelete}
            >
                <Text style={[styles.alarmTime, { color: theme.textPrimary }, !alarm.enabled && styles.textDisabled]}>
                    {alarm.time}
                </Text>
                <Text style={[styles.alarmLabel, { color: theme.textSecondary }, !alarm.enabled && styles.textDisabled]}>
                    {alarm.label || t.label}
                </Text>
                <View style={styles.repeatDays}>
                    {alarm.repeatDays.length > 0 ? (
                        dayNames.map((day, index) => (
                            <Text
                                key={day}
                                style={[
                                    styles.dayText,
                                    { color: theme.textMuted },
                                    alarm.repeatDays.includes(index) && { color: theme.accent, fontWeight: 'bold' as const },
                                    !alarm.enabled && styles.textDisabled,
                                ]}
                            >
                                {day}
                            </Text>
                        ))
                    ) : (
                        <Text style={[styles.repeatText, { color: theme.textMuted }, !alarm.enabled && styles.textDisabled]}>
                            {t.oneTime}
                        </Text>
                    )}
                </View>
            </Pressable>
            <View style={styles.alarmRight}>
                <Text style={[styles.snoozePrice, { color: theme.danger }, !alarm.enabled && styles.textDisabled]}>
                    ${alarm.snoozePrice.toFixed(2)}
                </Text>
                <Text style={[styles.snoozePriceLabel, { color: theme.textMuted }, !alarm.enabled && styles.textDisabled]}>
                    {t.toSnooze}
                </Text>
                <ThemedToggle value={alarm.enabled} onValueChange={onToggle} theme={theme} />
            </View>
        </View>
    );
}

export default function HomeScreen() {
    const router = useRouter();
    const { alarms, loading, toggleAlarm, removeAlarm, refreshAlarms } = useAlarms();
    const { t, dayNames } = useTranslation();
    const theme = useTheme();

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
        <View style={[styles.container, { backgroundColor: theme.card }]}>
            {alarms.length === 0 && !loading ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyIcon}>⏰</Text>
                    <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>{t.noAlarmsYet}</Text>
                    <Text style={[styles.emptySubtitle, { color: theme.textMuted }]}>
                        {t.noAlarmsSubtitle}
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
                            dayNames={dayNames}
                            t={t}
                            theme={theme}
                        />
                    )}
                />
            )}

            <TouchableOpacity
                style={[styles.fab, { backgroundColor: theme.accent, shadowColor: theme.accent }]}
                onPress={() => router.push('/create')}
            >
                <Text style={[styles.fabIcon, { color: theme.textPrimary }]}>+</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        padding: 16,
        paddingBottom: 100,
    },
    alarmCard: {
        borderRadius: 16,
        padding: 20,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
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
        letterSpacing: 2,
    },
    alarmLabel: {
        fontSize: 16,
        marginTop: 4,
    },
    repeatDays: {
        flexDirection: 'row',
        marginTop: 8,
        gap: 4,
    },
    dayText: {
        fontSize: 12,
        paddingHorizontal: 4,
    },
    repeatText: {
        fontSize: 12,
    },
    alarmRight: {
        alignItems: 'center',
        marginLeft: 16,
    },
    snoozePrice: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    snoozePriceLabel: {
        fontSize: 11,
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
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 16,
        textAlign: 'center',
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
    },
    fabIcon: {
        fontSize: 36,
        lineHeight: 36,
        textAlign: 'center',
        includeFontPadding: false,
        marginTop: -3,
    },
});

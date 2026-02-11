// Alarm ringing screen - full screen takeover
import { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Vibration,
    Animated,
    Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { scheduleSnoozeNotification } from '../services/notifications';
import { addSnoozeSpending } from '../store/alarmStore';

const { width } = Dimensions.get('window');

export default function RingingScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const alarmId = (params.alarmId as string) || 'demo';
    const label = (params.label as string) || 'Wake Up!';
    const snoozePrice = parseFloat(params.snoozePrice as string) || 1;
    const snoozeDuration = parseInt(params.snoozeDuration as string) || 9;

    const pulseAnim = useRef(new Animated.Value(1)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        startAlarm();
        startAnimations();

        return () => {
            stopAlarm();
        };
    }, []);

    const startAnimations = () => {
        // Pulse animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Glow animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: false,
                }),
                Animated.timing(glowAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: false,
                }),
            ])
        ).start();
    };

    const startAlarm = () => {
        // Start vibration pattern (repeating)
        Vibration.vibrate([500, 500, 500, 500], true);
        console.log('Alarm ringing!');
    };

    const stopAlarm = () => {
        Vibration.cancel();
    };

    const handleDismiss = () => {
        stopAlarm();
        router.back();
    };

    const handleSnooze = async () => {
        // TODO: Integrate real payment here
        // For now, simulate payment success and track spending
        await addSnoozeSpending(snoozePrice);

        // Schedule snooze notification
        await scheduleSnoozeNotification(alarmId, snoozeDuration, snoozePrice, label);

        stopAlarm();
        router.back();
    };

    const getCurrentTime = () => {
        const now = new Date();
        return now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    const glowColor = glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(231, 76, 60, 0.2)', 'rgba(231, 76, 60, 0.6)'],
    });

    return (
        <View style={styles.container}>
            <Animated.View
                style={[styles.glowBackground, { backgroundColor: glowColor }]}
            />

            <View style={styles.content}>
                <Animated.Text
                    style={[styles.emoji, { transform: [{ scale: pulseAnim }] }]}
                >
                    ⏰
                </Animated.Text>

                <Text style={styles.time}>{getCurrentTime()}</Text>
                <Text style={styles.label}>{label}</Text>

                <View style={styles.buttonsContainer}>
                    {/* Snooze Button */}
                    <TouchableOpacity style={styles.snoozeButton} onPress={handleSnooze}>
                        <Text style={styles.snoozePrice}>${snoozePrice.toFixed(2)}</Text>
                        <Text style={styles.snoozeText}>Snooze {snoozeDuration} min</Text>
                        <Text style={styles.snoozeSubtext}>💳 Pay to snooze</Text>
                    </TouchableOpacity>

                    {/* Dismiss Button */}
                    <TouchableOpacity style={styles.dismissButton} onPress={handleDismiss}>
                        <Text style={styles.dismissText}>I'm Awake!</Text>
                        <Text style={styles.dismissSubtext}>Free</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a2e',
    },
    glowBackground: {
        ...StyleSheet.absoluteFillObject,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    emoji: {
        fontSize: 80,
        marginBottom: 24,
    },
    time: {
        fontSize: 64,
        fontWeight: '200',
        color: '#fff',
        letterSpacing: 4,
    },
    label: {
        fontSize: 24,
        color: '#9999aa',
        marginTop: 8,
        marginBottom: 60,
    },
    buttonsContainer: {
        width: width - 48,
        gap: 16,
    },
    snoozeButton: {
        backgroundColor: '#e74c3c',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#e74c3c',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
    },
    snoozePrice: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#fff',
    },
    snoozeText: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.9)',
        marginTop: 4,
    },
    snoozeSubtext: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 8,
    },
    dismissButton: {
        backgroundColor: '#4a9f7f',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
    },
    dismissText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    dismissSubtext: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 4,
    },
});

// Profile screen - personal info and stats
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { useSettings } from '../hooks/useAlarms';
import { useTranslation } from '../hooks/useTranslation';

export default function ProfileScreen() {
    const { settings, updateSettings } = useSettings();
    const { t } = useTranslation();

    if (!settings) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>{t.loading}</Text>
            </View>
        );
    }

    const handleResetStats = () => {
        if (Platform.OS === 'web') {
            if (window.confirm(t.resetConfirm)) {
                updateSettings({ totalSpentOnSnoozing: 0 });
            }
        } else {
            Alert.alert(
                'Reset Statistics',
                t.resetConfirm,
                [
                    { text: t.cancel, style: 'cancel' },
                    { text: t.reset, style: 'destructive', onPress: () => updateSettings({ totalSpentOnSnoozing: 0 }) },
                ]
            );
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Profile Avatar */}
            <View style={styles.avatarSection}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarEmoji}>😴</Text>
                </View>
                <Text style={styles.username}>{t.sleepyhead}</Text>
                <Text style={styles.memberSince}>{t.member}</Text>
            </View>

            {/* Stats */}
            <View style={styles.statsCard}>
                <Text style={styles.statsEmoji}>💸</Text>
                <Text style={styles.statsTitle}>{t.totalSpentOnSnoozing}</Text>
                <Text style={styles.statsAmount}>${settings.totalSpentOnSnoozing.toFixed(2)}</Text>
                <Text style={styles.statsSubtext}>
                    {settings.totalSpentOnSnoozing > 10
                        ? t.spentALot
                        : t.stayedDisciplined}
                </Text>
            </View>

            {/* Quick Stats Row */}
            <View style={styles.quickStatsRow}>
                <View style={styles.quickStat}>
                    <Text style={styles.quickStatValue}>${settings.defaultSnoozePrice.toFixed(2)}</Text>
                    <Text style={styles.quickStatLabel}>{t.snoozePrice}</Text>
                </View>
                <View style={styles.quickStatDivider} />
                <View style={styles.quickStat}>
                    <Text style={styles.quickStatValue}>{settings.defaultSnoozeDuration}m</Text>
                    <Text style={styles.quickStatLabel}>{t.snoozeDurationLabel}</Text>
                </View>
            </View>

            {/* About */}
            <View style={styles.aboutSection}>
                <Text style={styles.aboutTitle}>PayToSnooze</Text>
                <Text style={styles.aboutText}>
                    {t.aboutText}
                </Text>
                <Text style={styles.versionText}>{t.version}</Text>
            </View>

            {/* Reset Stats */}
            <TouchableOpacity
                style={styles.resetButton}
                onPress={handleResetStats}
            >
                <Text style={styles.resetButtonText}>{t.resetStatistics}</Text>
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
    avatarSection: {
        alignItems: 'center',
        marginBottom: 28,
    },
    avatar: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: '#1a1a2e',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#4a9f7f',
        marginBottom: 12,
    },
    avatarEmoji: {
        fontSize: 48,
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    memberSince: {
        fontSize: 14,
        color: '#888',
    },
    statsCard: {
        backgroundColor: '#1a1a2e',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e74c3c',
    },
    statsEmoji: {
        fontSize: 48,
        marginBottom: 12,
    },
    statsTitle: {
        fontSize: 14,
        color: '#888',
        marginBottom: 8,
    },
    statsAmount: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#e74c3c',
    },
    statsSubtext: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginTop: 12,
    },
    quickStatsRow: {
        flexDirection: 'row',
        backgroundColor: '#1a1a2e',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        alignItems: 'center',
    },
    quickStat: {
        flex: 1,
        alignItems: 'center',
    },
    quickStatDivider: {
        width: 1,
        height: 40,
        backgroundColor: '#2a2a4e',
    },
    quickStatValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4a9f7f',
        marginBottom: 4,
    },
    quickStatLabel: {
        fontSize: 12,
        color: '#888',
    },
    aboutSection: {
        alignItems: 'center',
        paddingVertical: 32,
        borderTopWidth: 1,
        borderTopColor: '#2a2a4e',
    },
    aboutTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4a9f7f',
        marginBottom: 8,
    },
    aboutText: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        lineHeight: 22,
    },
    versionText: {
        fontSize: 12,
        color: '#555',
        marginTop: 16,
    },
    resetButton: {
        backgroundColor: '#e74c3c22',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e74c3c44',
    },
    resetButtonText: {
        fontSize: 14,
        color: '#e74c3c',
        fontWeight: '600',
    },
});

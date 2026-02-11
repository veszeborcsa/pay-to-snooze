// Settings screen
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useSettings } from '../hooks/useAlarms';

export default function SettingsScreen() {
    const { settings, updateSettings } = useSettings();

    if (!settings) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Stats */}
            <View style={styles.statsCard}>
                <Text style={styles.statsEmoji}>💸</Text>
                <Text style={styles.statsTitle}>Total Spent on Snoozing</Text>
                <Text style={styles.statsAmount}>${settings.totalSpentOnSnoozing.toFixed(2)}</Text>
                <Text style={styles.statsSubtext}>
                    {settings.totalSpentOnSnoozing > 10
                        ? "That's a lot of 💤! Try waking up on time!"
                        : "Great job staying disciplined!"}
                </Text>
            </View>

            {/* Default Snooze Price */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Default Snooze Price</Text>
                <Text style={styles.sectionSubtitle}>New alarms will use this price</Text>
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
                <Text style={styles.sectionTitle}>Default Snooze Duration</Text>
                <View style={styles.durationContainer}>
                    {[5, 9, 10, 15].map((min) => (
                        <TouchableOpacity
                            key={min}
                            style={[
                                styles.durationButton,
                                settings.defaultSnoozeDuration === min && styles.durationButtonActive
                            ]}
                            onPress={() => updateSettings({ defaultSnoozeDuration: min })}
                        >
                            <Text style={[
                                styles.durationText,
                                settings.defaultSnoozeDuration === min && styles.durationTextActive
                            ]}>
                                {min} min
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* About */}
            <View style={styles.aboutSection}>
                <Text style={styles.aboutTitle}>PayToSnooze</Text>
                <Text style={styles.aboutText}>
                    The alarm clock that makes you pay to snooze.{'\n'}
                    No more "just 5 more minutes"!
                </Text>
                <Text style={styles.versionText}>Version 1.0.0</Text>
            </View>

            {/* Reset Stats */}
            <TouchableOpacity
                style={styles.resetButton}
                onPress={() => updateSettings({ totalSpentOnSnoozing: 0 })}
            >
                <Text style={styles.resetButtonText}>Reset Statistics</Text>
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
    statsCard: {
        backgroundColor: '#1a1a2e',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        marginBottom: 24,
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
    aboutSection: {
        alignItems: 'center',
        paddingVertical: 32,
        borderTopWidth: 1,
        borderTopColor: '#2a2a4e',
        marginTop: 24,
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
        backgroundColor: '#2a2a4e',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 16,
    },
    resetButtonText: {
        fontSize: 14,
        color: '#888',
    },
});

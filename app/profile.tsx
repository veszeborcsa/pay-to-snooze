// Profile screen - personal info and stats
import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Alert, TextInput } from 'react-native';
import { useSettings } from '../hooks/useAlarms';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme } from '../theme/theme';

export default function ProfileScreen() {
    const { settings, updateSettings } = useSettings();
    const { t } = useTranslation();
    const theme = useTheme();

    const [editing, setEditing] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    // Sync local state when settings load or editing starts
    const startEditing = () => {
        setUsername(settings?.username || '');
        setEmail(settings?.email || '');
        setEditing(true);
    };

    const saveProfile = () => {
        updateSettings({ username: username.trim(), email: email.trim() });
        setEditing(false);
    };

    if (!settings) {
        return (
            <View style={[styles.container, { backgroundColor: theme.card }]}>
                <Text style={[styles.loadingText, { color: theme.textMuted }]}>{t.loading}</Text>
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

    const displayName = settings.username || t.sleepyhead;

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.card }]} contentContainerStyle={styles.content}>
            {/* Profile Avatar */}
            <View style={styles.avatarSection}>
                <View style={[styles.avatar, { backgroundColor: theme.background, borderColor: theme.accent }]}>
                    <Text style={styles.avatarEmoji}>😴</Text>
                </View>

                {editing ? (
                    <View style={styles.editFields}>
                        <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>{t.usernameLabel}</Text>
                        <TextInput
                            style={[styles.textInput, { backgroundColor: theme.background, color: theme.textPrimary, borderColor: theme.secondary }]}
                            value={username}
                            onChangeText={setUsername}
                            placeholder={t.usernamePlaceholder}
                            placeholderTextColor={theme.textMuted}
                            autoCapitalize="none"
                        />
                        <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>{t.emailLabel}</Text>
                        <TextInput
                            style={[styles.textInput, { backgroundColor: theme.background, color: theme.textPrimary, borderColor: theme.secondary }]}
                            value={email}
                            onChangeText={setEmail}
                            placeholder={t.emailPlaceholder}
                            placeholderTextColor={theme.textMuted}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.accent }]} onPress={saveProfile}>
                            <Text style={[styles.saveButtonText, { color: theme.textPrimary }]}>{t.saveProfile}</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        <Text style={[styles.username, { color: theme.textPrimary }]}>{displayName}</Text>
                        {settings.email ? (
                            <Text style={[styles.emailText, { color: theme.textSecondary }]}>{settings.email}</Text>
                        ) : null}
                        <Text style={[styles.memberSince, { color: theme.textMuted }]}>{t.member}</Text>
                        <TouchableOpacity style={[styles.editButton, { borderColor: theme.accent }]} onPress={startEditing}>
                            <Text style={[styles.editButtonText, { color: theme.accent }]}>{t.editProfile}</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>

            {/* Stats */}
            <View style={[styles.statsCard, { backgroundColor: theme.background, borderColor: theme.danger }]}>
                <Text style={styles.statsEmoji}>💸</Text>
                <Text style={[styles.statsTitle, { color: theme.textMuted }]}>{t.totalSpentOnSnoozing}</Text>
                <Text style={[styles.statsAmount, { color: theme.danger }]}>${settings.totalSpentOnSnoozing.toFixed(2)}</Text>
                <Text style={[styles.statsSubtext, { color: theme.textMuted }]}>
                    {settings.totalSpentOnSnoozing > 10
                        ? t.spentALot
                        : t.stayedDisciplined}
                </Text>
            </View>

            {/* Quick Stats Row */}
            <View style={[styles.quickStatsRow, { backgroundColor: theme.background }]}>
                <View style={styles.quickStat}>
                    <Text style={[styles.quickStatValue, { color: theme.accent }]}>${settings.defaultSnoozePrice.toFixed(2)}</Text>
                    <Text style={[styles.quickStatLabel, { color: theme.textMuted }]}>{t.snoozePrice}</Text>
                </View>
                <View style={[styles.quickStatDivider, { backgroundColor: theme.secondary }]} />
                <View style={styles.quickStat}>
                    <Text style={[styles.quickStatValue, { color: theme.accent }]}>{settings.defaultSnoozeDuration}m</Text>
                    <Text style={[styles.quickStatLabel, { color: theme.textMuted }]}>{t.snoozeDurationLabel}</Text>
                </View>
            </View>

            {/* About */}
            <View style={[styles.aboutSection, { borderTopColor: theme.secondary }]}>
                <Text style={[styles.aboutTitle, { color: theme.accent }]}>PayToSnooze</Text>
                <Text style={[styles.aboutText, { color: theme.textMuted }]}>
                    {t.aboutText}
                </Text>
                <Text style={[styles.versionText, { color: theme.textMuted }]}>{t.version}</Text>
            </View>

            {/* Reset Stats */}
            <TouchableOpacity
                style={[styles.resetButton, { backgroundColor: `${theme.danger}22`, borderColor: `${theme.danger}44` }]}
                onPress={handleResetStats}
            >
                <Text style={[styles.resetButtonText, { color: theme.danger }]}>{t.resetStatistics}</Text>
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
    loadingText: {
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
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        marginBottom: 12,
    },
    avatarEmoji: {
        fontSize: 48,
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    emailText: {
        fontSize: 14,
        marginBottom: 4,
    },
    memberSince: {
        fontSize: 14,
        marginBottom: 12,
    },
    editButton: {
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 8,
    },
    editButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    editFields: {
        width: '100%',
        marginTop: 8,
    },
    fieldLabel: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 6,
        marginTop: 12,
    },
    textInput: {
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        borderWidth: 1,
    },
    saveButton: {
        borderRadius: 12,
        padding: 14,
        alignItems: 'center',
        marginTop: 16,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    statsCard: {
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
    },
    statsEmoji: {
        fontSize: 48,
        marginBottom: 12,
    },
    statsTitle: {
        fontSize: 14,
        marginBottom: 8,
    },
    statsAmount: {
        fontSize: 48,
        fontWeight: 'bold',
    },
    statsSubtext: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 12,
    },
    quickStatsRow: {
        flexDirection: 'row',
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
    },
    quickStatValue: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    quickStatLabel: {
        fontSize: 12,
    },
    aboutSection: {
        alignItems: 'center',
        paddingVertical: 32,
        borderTopWidth: 1,
    },
    aboutTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    aboutText: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 22,
    },
    versionText: {
        fontSize: 12,
        marginTop: 16,
    },
    resetButton: {
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
    },
    resetButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
});

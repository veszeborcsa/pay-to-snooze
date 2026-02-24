// SoundPicker component — renders built-in + custom sounds with upload button
import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { ALARM_SOUNDS, previewSound, pickAudioFile } from '../services/soundService';
import { getCustomSounds, deleteCustomSound, CustomSound } from '../store/alarmStore';
import { useTheme } from '../theme/theme';

const SOUND_TRANSLATION_KEYS: Record<string, string> = {
    classic: 'soundClassic',
    gentle: 'soundGentle',
    urgent: 'soundUrgent',
    digital: 'soundDigital',
    bells: 'soundBells',
};

interface SoundPickerProps {
    selectedSound: string;
    onSelectSound: (soundId: string) => void;
    t: any; // translation object
}

export default function SoundPicker({ selectedSound, onSelectSound, t }: SoundPickerProps) {
    const theme = useTheme();
    const [customSounds, setCustomSounds] = useState<CustomSound[]>([]);

    useEffect(() => {
        loadCustomSounds();
    }, []);

    const loadCustomSounds = async () => {
        const sounds = await getCustomSounds();
        setCustomSounds(sounds);
    };

    const handleUpload = async () => {
        const result = await pickAudioFile();
        if (result) {
            setCustomSounds(prev => [...prev, result]);
            onSelectSound(result.id);
            previewSound(result.id);
        }
    };

    const handleDeleteCustom = async (id: string) => {
        if (Platform.OS === 'web') {
            if (!window.confirm(t.deleteConfirmSound)) return;
        }
        await deleteCustomSound(id);
        setCustomSounds(prev => prev.filter(s => s.id !== id));
        if (selectedSound === id) {
            onSelectSound('classic');
        }
    };

    return (
        <View style={styles.container}>
            {/* Built-in sounds */}
            {ALARM_SOUNDS.map((sound) => {
                const isActive = selectedSound === sound.id;
                return (
                    <TouchableOpacity
                        key={sound.id}
                        style={[
                            styles.soundOption,
                            { backgroundColor: theme.background, borderColor: theme.secondary },
                            isActive && { backgroundColor: theme.accent, borderColor: theme.accent },
                        ]}
                        onPress={() => {
                            onSelectSound(sound.id);
                            previewSound(sound.id);
                        }}
                    >
                        <Text style={styles.soundEmoji}>{sound.emoji}</Text>
                        <Text style={[
                            styles.soundLabel,
                            { color: theme.textMuted },
                            isActive && { color: theme.textPrimary },
                        ]}>
                            {t[SOUND_TRANSLATION_KEYS[sound.id]] || sound.id}
                        </Text>
                    </TouchableOpacity>
                );
            })}

            {/* Custom sounds */}
            {customSounds.map((sound) => {
                const isActive = selectedSound === sound.id;
                return (
                    <TouchableOpacity
                        key={sound.id}
                        style={[
                            styles.soundOption,
                            { backgroundColor: theme.background, borderColor: theme.secondary },
                            isActive && { backgroundColor: theme.accent, borderColor: theme.accent },
                        ]}
                        onPress={() => {
                            onSelectSound(sound.id);
                            previewSound(sound.id);
                        }}
                        onLongPress={() => handleDeleteCustom(sound.id)}
                    >
                        <Text style={styles.soundEmoji}>🎵</Text>
                        <Text
                            style={[
                                styles.soundLabel,
                                { color: theme.textMuted },
                                isActive && { color: theme.textPrimary },
                            ]}
                            numberOfLines={1}
                        >
                            {sound.name}
                        </Text>
                        <TouchableOpacity
                            style={styles.deleteBtn}
                            onPress={(e) => {
                                e.stopPropagation();
                                handleDeleteCustom(sound.id);
                            }}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                            <Text style={[styles.deleteText, { color: theme.textMuted }]}>✕</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                );
            })}

            {/* Upload button */}
            <TouchableOpacity
                style={[
                    styles.soundOption,
                    styles.uploadBtn,
                    { borderColor: theme.accent, borderStyle: 'dashed' },
                ]}
                onPress={handleUpload}
            >
                <Text style={styles.soundEmoji}>📁</Text>
                <Text style={[styles.soundLabel, { color: theme.accent }]}>
                    {t.uploadSound || '➕ Upload'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
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
        position: 'relative',
    },
    soundEmoji: {
        fontSize: 20,
    },
    soundLabel: {
        fontSize: 11,
        fontWeight: '600',
    },
    uploadBtn: {
        backgroundColor: 'transparent',
    },
    deleteBtn: {
        position: 'absolute',
        top: 2,
        right: 4,
    },
    deleteText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
});

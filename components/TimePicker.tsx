// Scrollable time picker modal component
import { useState, useRef, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    NativeSyntheticEvent,
    NativeScrollEvent,
} from 'react-native';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme } from '../theme/theme';

const ITEM_HEIGHT = 54;
const VISIBLE_ITEMS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
const PADDING = Math.floor(VISIBLE_ITEMS / 2);

interface TimePickerProps {
    visible: boolean;
    hours: string;
    minutes: string;
    onConfirm: (hours: string, minutes: string) => void;
    onCancel: () => void;
}

function WheelColumn({
    count,
    initialValue,
    onValueChange,
    label,
    accentColor,
    textPrimaryColor,
    textMutedColor,
    cardColor,
}: {
    count: number; // 24 for hours, 60 for minutes
    initialValue: number;
    onValueChange: (value: number) => void;
    label: string;
    accentColor: string;
    textPrimaryColor: string;
    textMutedColor: string;
    cardColor: string;
}) {
    const scrollRef = useRef<ScrollView>(null);
    const [currentValue, setCurrentValue] = useState(initialValue);
    const isScrollingRef = useRef(false);
    const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        // Scroll to initial position after mount
        setTimeout(() => {
            scrollRef.current?.scrollTo({
                y: initialValue * ITEM_HEIGHT,
                animated: false,
            });
        }, 100);
    }, [initialValue]);

    const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const index = Math.round(offsetY / ITEM_HEIGHT);
        const clampedIndex = Math.max(0, Math.min(index, count - 1));

        if (clampedIndex !== currentValue) {
            setCurrentValue(clampedIndex);
            onValueChange(clampedIndex);
        }

        // Debounced snap-to-position
        if (scrollTimerRef.current) {
            clearTimeout(scrollTimerRef.current);
        }
        scrollTimerRef.current = setTimeout(() => {
            scrollRef.current?.scrollTo({
                y: clampedIndex * ITEM_HEIGHT,
                animated: true,
            });
        }, 150);
    }, [currentValue, count, onValueChange]);

    const handleItemPress = (value: number) => {
        setCurrentValue(value);
        onValueChange(value);
        scrollRef.current?.scrollTo({
            y: value * ITEM_HEIGHT,
            animated: true,
        });
    };

    // Build items: padding + actual values + padding
    const items: (number | null)[] = [];
    for (let i = 0; i < PADDING; i++) items.push(null);
    for (let i = 0; i < count; i++) items.push(i);
    for (let i = 0; i < PADDING; i++) items.push(null);

    return (
        <View style={styles.wheelColumn}>
            <Text style={[styles.wheelLabel, { color: textMutedColor }]}>{label}</Text>
            <View style={[styles.wheelContainer, { backgroundColor: cardColor }]}>
                {/* Fixed selection highlight */}
                <View style={styles.selectionOverlay} pointerEvents="none">
                    <View style={[styles.selectionHighlight, { backgroundColor: `${accentColor}26`, borderColor: accentColor }]} />
                </View>
                <ScrollView
                    ref={scrollRef}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={ITEM_HEIGHT}
                    decelerationRate="fast"
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    bounces={false}
                >
                    {items.map((item, index) => {
                        const isCenter = item === currentValue && item !== null;
                        const distance = item !== null ? Math.abs(item - currentValue) : 99;

                        return (
                            <TouchableOpacity
                                key={`${index}-${item}`}
                                style={[styles.wheelItem, { height: ITEM_HEIGHT }]}
                                onPress={() => item !== null && handleItemPress(item)}
                                activeOpacity={item !== null ? 0.7 : 1}
                                disabled={item === null}
                            >
                                <Text
                                    style={[
                                        styles.wheelItemText,
                                        { color: textMutedColor },
                                        isCenter && [styles.wheelItemTextSelected, { color: textPrimaryColor }],
                                        !isCenter && distance === 1 && styles.wheelItemTextNear,
                                        !isCenter && distance >= 2 && styles.wheelItemTextFar,
                                        item === null && { color: 'transparent' },
                                    ]}
                                >
                                    {item !== null ? String(item).padStart(2, '0') : '  '}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>
        </View>
    );
}

export default function TimePicker({ visible, hours, minutes, onConfirm, onCancel }: TimePickerProps) {
    const [selectedHour, setSelectedHour] = useState(parseInt(hours) || 0);
    const [selectedMinute, setSelectedMinute] = useState(parseInt(minutes) || 0);
    const { t } = useTranslation();
    const theme = useTheme();

    // Reset when modal opens with new values
    useEffect(() => {
        if (visible) {
            setSelectedHour(parseInt(hours) || 0);
            setSelectedMinute(parseInt(minutes) || 0);
        }
    }, [visible, hours, minutes]);

    const handleConfirm = () => {
        onConfirm(
            String(selectedHour).padStart(2, '0'),
            String(selectedMinute).padStart(2, '0')
        );
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                <View style={[styles.modal, { backgroundColor: theme.background, borderColor: theme.secondary }]}>
                    <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>{t.setTime}</Text>

                    <View style={styles.pickerRow}>
                        {visible && (
                            <>
                                <WheelColumn
                                    count={24}
                                    initialValue={parseInt(hours) || 0}
                                    onValueChange={setSelectedHour}
                                    label={t.hour}
                                    accentColor={theme.accent}
                                    textPrimaryColor={theme.textPrimary}
                                    textMutedColor={theme.textMuted}
                                    cardColor={theme.card}
                                />
                                <Text style={[styles.pickerSeparator, { color: theme.accent }]}>:</Text>
                                <WheelColumn
                                    count={60}
                                    initialValue={parseInt(minutes) || 0}
                                    onValueChange={setSelectedMinute}
                                    label={t.minute}
                                    accentColor={theme.accent}
                                    textPrimaryColor={theme.textPrimary}
                                    textMutedColor={theme.textMuted}
                                    cardColor={theme.card}
                                />
                            </>
                        )}
                    </View>

                    {/* Preview */}
                    <Text style={[styles.previewTime, { color: theme.accent }]}>
                        {String(selectedHour).padStart(2, '0')}:{String(selectedMinute).padStart(2, '0')}
                    </Text>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={[styles.cancelButton, { backgroundColor: theme.secondary }]} onPress={onCancel}>
                            <Text style={[styles.cancelButtonText, { color: theme.textMuted }]}>{t.cancel}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.confirmButton, { backgroundColor: theme.accent }]} onPress={handleConfirm}>
                            <Text style={[styles.confirmButtonText, { color: theme.textPrimary }]}>{t.set}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        borderRadius: 24,
        padding: 24,
        width: Math.min(Dimensions.get('window').width - 48, 360),
        alignItems: 'center',
        borderWidth: 1,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 20,
    },
    pickerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pickerSeparator: {
        fontSize: 40,
        fontWeight: 'bold',
        marginHorizontal: 8,
        marginTop: 28,
    },
    wheelColumn: {
        alignItems: 'center',
    },
    wheelLabel: {
        fontSize: 13,
        marginBottom: 8,
        fontWeight: '600',
    },
    wheelContainer: {
        height: PICKER_HEIGHT,
        width: 88,
        overflow: 'hidden',
        borderRadius: 12,
    },
    selectionOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        zIndex: 10,
    },
    selectionHighlight: {
        height: ITEM_HEIGHT,
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderRadius: 8,
        marginHorizontal: 4,
    },
    wheelItem: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    wheelItemText: {
        fontSize: 22,
        fontWeight: '500',
    },
    wheelItemTextSelected: {
        fontSize: 30,
        fontWeight: '700',
    },
    wheelItemTextNear: {
        fontSize: 20,
    },
    wheelItemTextFar: {
        fontSize: 16,
    },
    previewTime: {
        fontSize: 48,
        fontWeight: '700',
        marginVertical: 16,
        letterSpacing: 4,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    confirmButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    confirmButtonText: {
        fontSize: 16,
        fontWeight: '700',
    },
});

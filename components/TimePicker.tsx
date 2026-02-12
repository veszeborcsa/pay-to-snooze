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
}: {
    count: number; // 24 for hours, 60 for minutes
    initialValue: number;
    onValueChange: (value: number) => void;
    label: string;
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
            <Text style={styles.wheelLabel}>{label}</Text>
            <View style={styles.wheelContainer}>
                {/* Fixed selection highlight */}
                <View style={styles.selectionOverlay} pointerEvents="none">
                    <View style={styles.selectionHighlight} />
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
                                        isCenter && styles.wheelItemTextSelected,
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
                <View style={styles.modal}>
                    <Text style={styles.modalTitle}>{t.setTime}</Text>

                    <View style={styles.pickerRow}>
                        {visible && (
                            <>
                                <WheelColumn
                                    count={24}
                                    initialValue={parseInt(hours) || 0}
                                    onValueChange={setSelectedHour}
                                    label={t.hour}
                                />
                                <Text style={styles.pickerSeparator}>:</Text>
                                <WheelColumn
                                    count={60}
                                    initialValue={parseInt(minutes) || 0}
                                    onValueChange={setSelectedMinute}
                                    label={t.minute}
                                />
                            </>
                        )}
                    </View>

                    {/* Preview */}
                    <Text style={styles.previewTime}>
                        {String(selectedHour).padStart(2, '0')}:{String(selectedMinute).padStart(2, '0')}
                    </Text>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                            <Text style={styles.cancelButtonText}>{t.cancel}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                            <Text style={styles.confirmButtonText}>{t.set}</Text>
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
        backgroundColor: '#1a1a2e',
        borderRadius: 24,
        padding: 24,
        width: Math.min(Dimensions.get('window').width - 48, 360),
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2a2a4e',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
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
        color: '#4a9f7f',
        marginHorizontal: 8,
        marginTop: 28,
    },
    wheelColumn: {
        alignItems: 'center',
    },
    wheelLabel: {
        fontSize: 13,
        color: '#888',
        marginBottom: 8,
        fontWeight: '600',
    },
    wheelContainer: {
        height: PICKER_HEIGHT,
        width: 88,
        overflow: 'hidden',
        borderRadius: 12,
        backgroundColor: '#16213e',
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
        backgroundColor: 'rgba(74, 159, 127, 0.15)',
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderColor: '#4a9f7f',
        borderRadius: 8,
        marginHorizontal: 4,
    },
    wheelItem: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    wheelItemText: {
        fontSize: 22,
        color: '#555',
        fontWeight: '500',
    },
    wheelItemTextSelected: {
        fontSize: 30,
        color: '#fff',
        fontWeight: '700',
    },
    wheelItemTextNear: {
        fontSize: 20,
        color: '#888',
    },
    wheelItemTextFar: {
        fontSize: 16,
        color: '#444',
    },
    previewTime: {
        fontSize: 48,
        fontWeight: '700',
        color: '#4a9f7f',
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
        backgroundColor: '#2a2a4e',
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#888',
    },
    confirmButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#4a9f7f',
        alignItems: 'center',
    },
    confirmButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
});

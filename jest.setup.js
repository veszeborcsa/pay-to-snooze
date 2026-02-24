// Mock react-native Platform
jest.mock('react-native', () => ({
    Platform: {
        OS: 'web',
        select: jest.fn((obj) => obj.web || obj.default),
    },
    StyleSheet: {
        create: (styles) => styles,
        absoluteFillObject: {},
    },
    Vibration: {
        vibrate: jest.fn(),
        cancel: jest.fn(),
    },
    Animated: {
        Value: jest.fn(() => ({
            interpolate: jest.fn(),
        })),
        timing: jest.fn(() => ({ start: jest.fn() })),
        loop: jest.fn(() => ({ start: jest.fn() })),
        sequence: jest.fn(),
        View: 'Animated.View',
        Text: 'Animated.Text',
    },
    Dimensions: {
        get: jest.fn(() => ({ width: 375, height: 812 })),
    },
    Alert: {
        alert: jest.fn(),
    },
    View: 'View',
    Text: 'Text',
    TouchableOpacity: 'TouchableOpacity',
    TextInput: 'TextInput',
    ScrollView: 'ScrollView',
    FlatList: 'FlatList',
    Switch: 'Switch',
    Modal: 'Modal',
    Pressable: 'Pressable',
}));

// Mock expo-notifications
jest.mock('expo-notifications', () => ({
    setNotificationHandler: jest.fn(),
    getPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
    requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
    setNotificationChannelAsync: jest.fn(() => Promise.resolve()),
    scheduleNotificationAsync: jest.fn(() => Promise.resolve('mock-notification-id')),
    cancelScheduledNotificationAsync: jest.fn(() => Promise.resolve()),
    cancelAllScheduledNotificationsAsync: jest.fn(() => Promise.resolve()),
    getAllScheduledNotificationsAsync: jest.fn(() => Promise.resolve([])),
    AndroidImportance: { MAX: 5 },
    AndroidNotificationPriority: { MAX: 'max' },
    AndroidNotificationVisibility: { PUBLIC: 1 },
    SchedulableTriggerInputTypes: { DATE: 'date' },
}));

// Mock expo-router
jest.mock('expo-router', () => ({
    useRouter: jest.fn(() => ({
        push: jest.fn(),
        back: jest.fn(),
        replace: jest.fn(),
    })),
    useLocalSearchParams: jest.fn(() => ({})),
    useFocusEffect: jest.fn(),
    Stack: {
        Screen: 'Stack.Screen',
    },
}));

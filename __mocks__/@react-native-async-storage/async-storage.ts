// Manual mock for @react-native-async-storage/async-storage
const store: Record<string, string> = {};

const AsyncStorage = {
    getItem: jest.fn(async (key: string) => {
        return store[key] ?? null;
    }),
    setItem: jest.fn(async (key: string, value: string) => {
        store[key] = value;
    }),
    removeItem: jest.fn(async (key: string) => {
        delete store[key];
    }),
    clear: jest.fn(async () => {
        Object.keys(store).forEach((key) => delete store[key]);
    }),
    getAllKeys: jest.fn(async () => Object.keys(store)),
    // Helper for tests to reset state
    __resetStore: () => {
        Object.keys(store).forEach((key) => delete store[key]);
    },
    __getStore: () => store,
};

export default AsyncStorage;

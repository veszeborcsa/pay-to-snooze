module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/__tests__'],
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            tsconfig: {
                jsx: 'react',
            },
            diagnostics: false,
        }],
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    setupFiles: ['<rootDir>/jest.setup.js'],
    moduleNameMapper: {
        '^@react-native-async-storage/async-storage$': '<rootDir>/__mocks__/@react-native-async-storage/async-storage.ts',
    },
    transformIgnorePatterns: [
        'node_modules/(?!(expo-notifications|expo-router|expo-av|react-native|@react-native|expo)/)',
    ],
};

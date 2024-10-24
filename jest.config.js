module.exports = {
    roots: ['<rootDir>/backend', '<rootDir>/frontend'],
    testEnvironment: 'jest-environment-jsdom',
    moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
    testPathIgnorePatterns: [
        '/node_modules/', 
        '/dist/', 
        '/public/',
    ],
    collectCoverageFrom: [
        'backend/**/*.{js,jsx}',
        'frontend/**/*.{js,jsx}',
    ],
    testMatch: [
        '**/frontend/**/*.test.js',
        // '**/backend/**/*.test.js',
    ],
    transform: {
        // Transpile JS files using Babel
        '^.+\\.js$': 'babel-jest',
    },
    globals: {
        'babel-jest': {
            useESM: true,
        },
    },
};
